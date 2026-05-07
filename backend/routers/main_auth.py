from fastapi import APIRouter, Body, HTTPException, Request
from pydantic import BaseModel, Field
from datetime import datetime, timezone
import httpx

from ..base import user_history_collection, notifications_collection, things_collection
from ..config import resolve_public_base_url

from ..supabase_client import reset_password_email, signup_user, supabase, delete_user_admin
from ..notifications_service import create_notification


auth_router = APIRouter()

HISTORY_RETENTION_DAYS = 45
HISTORY_MAX_ENTRIES_PER_USER = 120
HISTORY_PRUNE_SCAN_BUFFER = 5000
class LoginRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=254)
    password: str = Field(..., min_length=6, max_length=128)


class SignupRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=254)
    password: str = Field(..., min_length=6, max_length=128)


class ForgotPasswordRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=254)


class UserHistoryRequest(BaseModel):
    action: str = Field(..., min_length=1, max_length=120)
    detail: str = Field(default="", max_length=500)
    status: str = Field(default="Succes", max_length=80)


class UpdateUserRoleRequest(BaseModel):
    role: str = Field(..., min_length=4, max_length=10)


class UpdateDisplayNameRequest(BaseModel):
    display_name: str = Field(..., min_length=1, max_length=160)


class AddFavoriteRequest(BaseModel):
    thing_id: str = Field(..., min_length=1, max_length=120)
    thing_name: str = Field(..., min_length=1, max_length=160)


def _favorite_id_from_row(row: dict) -> str:
    if not isinstance(row, dict):
        return ""
    return str(row.get("id") or row.get("object_id") or row.get("code") or "").strip()


def _normalize_favorite_row(row: dict) -> dict | None:
    favorite_id = _favorite_id_from_row(row)
    if not favorite_id:
        return None

    normalized = {
        "id": favorite_id,
        "name": str(row.get("name") or row.get("nom") or row.get("title") or favorite_id).strip() or favorite_id,
        "addedAt": str(
            row.get("addedAt")
            or row.get("added_at")
            or row.get("date")
            or datetime.now(timezone.utc).isoformat()
        ).strip(),
    }

    favorite_type = str(row.get("type") or row.get("category") or row.get("categorie") or "").strip()
    if favorite_type:
        normalized["type"] = favorite_type

    favorite_location = str(
        row.get("location")
        or row.get("localisation")
        or row.get("room")
        or row.get("salle")
        or ""
    ).strip()
    if favorite_location:
        normalized["location"] = favorite_location

    return normalized


def _normalize_favorites(rows) -> list[dict]:
    normalized: list[dict] = []
    seen_ids: set[str] = set()

    if not isinstance(rows, list):
        return normalized

    for row in rows:
        if not isinstance(row, dict):
            continue
        item = _normalize_favorite_row(row)
        if not item:
            continue
        if item["id"] in seen_ids:
            continue
        seen_ids.add(item["id"])
        normalized.append(item)

    return normalized


def extract_bearer_token(request: Request) -> str | None:
    header = request.headers.get("Authorization", "")
    if not header.startswith("Bearer "):
        return None
    return header.replace("Bearer ", "", 1).strip() or None


def _get_user_from_token(token: str):
    """Resolve a Supabase user from JWT with resilient upstream error handling."""
    last_http_error: Exception | None = None
    for _ in range(2):
        try:
            user_response = supabase.auth.get_user(token)
            user = getattr(user_response, "user", None)
            if not user:
                raise HTTPException(status_code=401, detail="Token invalide")
            return user
        except HTTPException:
            raise
        except httpx.HTTPError as e:
            # Supabase transient network/protocol error (seen as RemoteProtocolError).
            last_http_error = e
            continue
        except Exception as e:
            message = str(e).lower()
            if "jwt" in message or "token" in message or "unauthorized" in message:
                raise HTTPException(status_code=401, detail="Token invalide")
            raise HTTPException(status_code=503, detail="Service auth temporairement indisponible")

    print(f"Erreur Supabase get_user: {last_http_error}")
    raise HTTPException(status_code=503, detail="Service auth temporairement indisponible")


def get_role_from_token(token: str) -> str:
    user = _get_user_from_token(token)
    profile = supabase.table("utilisateur").select("role").eq("id", user.id).maybe_single().execute()
    return profile.data.get("role", "user") if profile.data else "user"


def require_admin(request: Request) -> None:
    token = extract_bearer_token(request)
    if not token:
        raise HTTPException(status_code=401, detail="Token manquant")
    if get_role_from_token(token) != "admin":
        raise HTTPException(status_code=403, detail="Acces refuse: Admin requis")


def _get_authenticated_user(request: Request):
    token = extract_bearer_token(request)
    if not token:
        raise HTTPException(status_code=401, detail="Token manquant")
    return _get_user_from_token(token)


def _get_user_profile_row(user_id: str) -> dict:
    try:
        query = supabase.table("utilisateur").select("*").eq("id", user_id).maybe_single().execute()
        if query and isinstance(query.data, dict):
            return query.data
    except Exception as e:
        print(f"Erreur lecture profil utilisateur: {e}")
    return {}


def _display_name_from_profile(email: str, profile_row: dict | None = None) -> str:
    profile_row = profile_row or {}
    for key in ("display_name", "full_name", "name", "nom"):
        value = str(profile_row.get(key, "") or "").strip()
        if value:
            return value

    local_part = str(email or "").split("@", 1)[0].strip()
    if not local_part:
        return "Utilisateur"

    local_part = local_part.replace(".", " ").replace("_", " ").replace("-", " ")
    return " ".join(piece.capitalize() for piece in local_part.split() if piece)


def _history_retention_cutoff_iso() -> str:
    cutoff = datetime.now(timezone.utc).timestamp() - (HISTORY_RETENTION_DAYS * 24 * 60 * 60)
    return datetime.fromtimestamp(cutoff, tz=timezone.utc).isoformat()


def _prune_user_history(user_id: str | None = None) -> None:
    try:
        # Keep the collection from growing indefinitely by trimming old rows globally.
        user_history_collection.delete_many({"created_at": {"$lt": _history_retention_cutoff_iso()}})

        if user_id:
            rows = list(
                user_history_collection.find({"user_id": str(user_id)}, {"_id": 1})
                .sort("created_at", -1)
                .limit(HISTORY_MAX_ENTRIES_PER_USER + HISTORY_PRUNE_SCAN_BUFFER)
            )
            if len(rows) > HISTORY_MAX_ENTRIES_PER_USER:
                stale_ids = [row.get("_id") for row in rows[HISTORY_MAX_ENTRIES_PER_USER:] if row.get("_id")]
                if stale_ids:
                    user_history_collection.delete_many({"_id": {"$in": stale_ids}})
    except Exception as e:
        print(f"Erreur purge historique: {e}")


def _format_history_date(raw_date: str, raw_created_at: str) -> str:
    date_value = str(raw_date or "").strip()
    if date_value:
        return date_value

    created_value = str(raw_created_at or "").strip()
    if not created_value:
        return "-"

    try:
        parsed = datetime.fromisoformat(created_value.replace("Z", "+00:00"))
        return parsed.astimezone(timezone.utc).strftime("%d/%m/%Y %H:%M:%S")
    except Exception:
        return created_value


def _parse_iso_datetime(value: str | None) -> datetime | None:
    text = str(value or "").strip()
    if not text:
        return None
    try:
        return datetime.fromisoformat(text.replace("Z", "+00:00"))
    except Exception:
        return None


def _pick_profile_update_value(row: dict) -> str:
    if not isinstance(row, dict):
        return "-"

    candidates = [
        row.get("profile_updated_at"),
        row.get("last_profile_update"),
        row.get("updated_at"),
        row.get("modified_at"),
        row.get("updatedAt"),
        row.get("created_at"),
    ]
    for candidate in candidates:
        candidate_text = str(candidate or "").strip()
        if candidate_text:
            return candidate_text
    return "-"


def _is_report_history_entry(row: dict) -> bool:
    if not isinstance(row, dict):
        return False
    action = str(row.get("action", "") or "").lower()
    detail = str(row.get("detail", "") or "").lower()
    haystack = f"{action} {detail}"
    return any(token in haystack for token in ("signal", "report", "probl", "incident", "alerte"))


def _summarize_user_history(rows: list[dict]) -> dict[str, dict]:
    summary: dict[str, dict] = {}

    for row in rows:
        if not isinstance(row, dict):
            continue

        user_id = str(row.get("user_id", "") or "").strip()
        if not user_id:
            continue

        bucket = summary.setdefault(
            user_id,
            {
                "history_count": 0,
                "last_activity": "-",
                "last_activity_raw": "",
                "report_count": 0,
                "report_items": [],
            },
        )

        bucket["history_count"] += 1

        created_at = str(row.get("created_at", "") or "").strip()
        if not bucket["last_activity_raw"]:
            bucket["last_activity_raw"] = created_at
            bucket["last_activity"] = _format_history_date(str(row.get("date", "") or ""), created_at)

        if _is_report_history_entry(row):
            bucket["report_count"] += 1
            if len(bucket["report_items"]) < 10:
                bucket["report_items"].append(
                    {
                        "date": _format_history_date(str(row.get("date", "") or ""), created_at),
                        "action": str(row.get("action", "") or "").strip(),
                        "detail": str(row.get("detail", "") or "").strip(),
                        "status": str(row.get("status", "") or "").strip(),
                        "thing_id": str(row.get("thing_id", "") or "").strip(),
                        "thing_name": str(row.get("thing_name", "") or "").strip(),
                    }
                )

    return summary


@auth_router.post("/login")
def login(data: LoginRequest = Body(...)):
    email = data.email.strip().lower()
    if "@" not in email:
        raise HTTPException(status_code=400, detail="Email invalide")

    try:
        auth_res = supabase.auth.sign_in_with_password({"email": email, "password": data.password})
        if not auth_res.user or not auth_res.session:
            raise HTTPException(status_code=401, detail="Identifiants invalides")

        user_role = "user"
        display_name = _display_name_from_profile(email)
        user_localisation = None
        try:
            query = supabase.table("utilisateur").select("*").eq("id", auth_res.user.id).maybe_single().execute()
            if query.data:
                user_role = query.data.get("role", "user")
                display_name = _display_name_from_profile(email, query.data)
                user_localisation = query.data.get("localisation")
        except Exception as e:
            print(f"Erreur lecture role: {e}")

        create_notification(
            target_role="user",
            recipient_user_id=str(auth_res.user.id),
            recipient_email=email,
            actor_user_id=str(auth_res.user.id),
            actor_email=email,
            title="Connexion reussie",
            message="Connexion reussie a votre espace IntelliBuild.",
            notif_type="success",
            metadata={"action": "login"},
        )

        return {
            "access_token": auth_res.session.access_token,
            "user_id": str(auth_res.user.id),
            "role": user_role,
            "email": email,
            "display_name": display_name,
            "localisation": user_localisation,
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erreur login: {e}")
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")


@auth_router.post("/signup")
def signup(data: SignupRequest = Body(...)):
    email = data.email.strip().lower()
    if "@" not in email:
        raise HTTPException(status_code=400, detail="Email invalide")

    try:
        res = signup_user(email, data.password)
        if res.user:
            supabase.table("utilisateur").insert({
                "id": res.user.id,
                "email": email,
                "role": "user",
                "localisation": None,
            }).execute()
            return {"success": True, "message": "Compte cree"}

        raise HTTPException(status_code=400, detail="Erreur signup")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erreur signup: {e}")
        raise HTTPException(status_code=500, detail="Impossible de creer le compte")


@auth_router.post("/auth/forgot")
def forgot_password(request: Request, data: ForgotPasswordRequest = Body(...)):
    try:
        email = data.email.strip().lower()
        reset_password_email(email, f"{resolve_public_base_url(str(request.base_url))}/reset.html")

        recipient_user_id = ""
        try:
            user_row = supabase.table("utilisateur").select("id").eq("email", email).maybe_single().execute()
            if user_row and user_row.data and user_row.data.get("id"):
                recipient_user_id = str(user_row.data.get("id"))
        except Exception as e:
            print(f"Erreur lookup user forgot: {e}")

        create_notification(
            target_role="user",
            recipient_user_id=recipient_user_id,
            recipient_email=email,
            actor_email=email,
            title="Reinitialisation mot de passe demandee",
            message="Une demande de reinitialisation de mot de passe a ete enregistree.",
            notif_type="info",
            metadata={"action": "forgot_password"},
        )

        return {"success": True}
    except Exception as e:
        print(f"Erreur forgot: {e}")
        raise HTTPException(status_code=500, detail="Erreur email")


@auth_router.get("/user/profile")
def get_user_profile(request: Request):
    user = _get_authenticated_user(request)
    profile_row = _get_user_profile_row(str(user.id))
    email = getattr(user, "email", "") or profile_row.get("email", "") or ""
    role = str(profile_row.get("role", "user") or "user")
    return {
        "id": str(user.id),
        "email": email,
        "role": role,
        "display_name": _display_name_from_profile(email, profile_row),
    }


@auth_router.get("/user/history")
def get_user_history(request: Request):
    user = _get_authenticated_user(request)
    _prune_user_history(str(user.id))
    rows = list(user_history_collection.find({"user_id": str(user.id)}).sort("created_at", -1).limit(HISTORY_MAX_ENTRIES_PER_USER))
    result = []
    for row in rows:
        row["_id"] = str(row.get("_id"))
        result.append(row)
    return result


@auth_router.post("/user/history")
def add_user_history(request: Request, data: UserHistoryRequest = Body(...)):
    user = _get_authenticated_user(request)
    now = datetime.now(timezone.utc)
    doc = {
        "user_id": str(user.id),
        "email": getattr(user, "email", "") or "",
        "action": data.action,
        "detail": data.detail,
        "status": data.status,
        "date": now.strftime("%d/%m/%Y %H:%M:%S"),
        "created_at": now.isoformat(),
    }
    inserted = user_history_collection.insert_one(doc)
    _prune_user_history(str(user.id))
    return {"success": True, "id": str(inserted.inserted_id)}


@auth_router.get("/admin/users")
def get_admin_users(request: Request):
    require_admin(request)
    rows = supabase.table("utilisateur").select("*").execute()
    data = rows.data if rows and isinstance(rows.data, list) else []
    user_ids = [str(item.get("id", "") or "").strip() for item in data if isinstance(item, dict) and item.get("id")]

    history_summary: dict[str, dict] = {}
    if user_ids:
        try:
            history_rows = list(
                user_history_collection.find(
                    {"user_id": {"$in": user_ids}},
                    {
                        "_id": 0,
                        "user_id": 1,
                        "action": 1,
                        "detail": 1,
                        "status": 1,
                        "date": 1,
                        "created_at": 1,
                        "thing_id": 1,
                        "thing_name": 1,
                    },
                ).sort("created_at", -1)
            )
            history_summary = _summarize_user_history(history_rows)
        except Exception as e:
            print(f"Erreur lecture historique admin users: {e}")
            history_summary = {}

    result = []
    for item in data:
        if not isinstance(item, dict):
            continue

        user_id = str(item.get("id", "") or "").strip()
        if not user_id:
            continue

        favorites_raw = item.get("favorites", [])
        favorites = _normalize_favorites(favorites_raw if isinstance(favorites_raw, list) else [])
        history_info = history_summary.get(user_id, {})
        last_profile_update = _pick_profile_update_value(item)

        result.append(
            {
                "id": user_id,
                "email": str(item.get("email", "") or ""),
                "role": str(item.get("role", "user") or "user"),
                "display_name": _display_name_from_profile(str(item.get("email", "") or ""), item),
                "favorites_count": len(favorites),
                "favorites": favorites,
                "history_count": int(history_info.get("history_count", 0) or 0),
                "report_count": int(history_info.get("report_count", 0) or 0),
                "report_items": history_info.get("report_items", []),
                "last_activity": str(history_info.get("last_activity", "-") or "-"),
                "last_profile_update": last_profile_update,
                "updated_at": str(item.get("updated_at", "") or ""),
                "created_at": str(item.get("created_at", "") or ""),
                "email_confirmed_at": str(item.get("email_confirmed_at", "") or ""),
                "last_sign_in_at": str(item.get("last_sign_in_at", "") or ""),
            }
        )

    return result


@auth_router.get("/admin/user-activity")
def get_admin_user_activity(request: Request, limit: int = 200):
    require_admin(request)

    _prune_user_history()

    safe_limit = max(20, min(int(limit or 200), 500))

    # Focus admin supervision on object lifecycle and key user activity.
    rows = list(
        user_history_collection.find(
            {
                "action": {
                    "$in": [
                        "EMPRUNT_DEBUT",
                        "EMPRUNT_FIN",
                        "Session",
                    ]
                }
            }
        )
        .sort("created_at", -1)
        .limit(safe_limit)
    )

    result = []
    for row in rows:
        action = str(row.get("action", "") or "")
        detail = str(row.get("detail", "") or "")
        user_id = str(row.get("user_id", "") or "")
        email = str(row.get("email", "") or "")
        created_at = str(row.get("created_at", "") or "")
        date_value = _format_history_date(str(row.get("date", "") or ""), created_at)

        # Skip explicit admin-labelled logs to keep this table user-centric.
        if action.lower().startswith("admin -"):
            continue

        # Remove low-value consultation spam from admin activity table.
        detail_lower = detail.lower()
        if action.lower() == "objet" and "consultation" in detail_lower:
            continue

        result.append(
            {
                "_id": str(row.get("_id")),
                "user_id": user_id,
                "email": email or (f"user:{user_id[:8]}" if user_id else "-"),
                "action": action,
                "detail": detail,
                "status": str(row.get("status", "") or ""),
                "thing_id": str(row.get("thing_id", "") or ""),
                "thing_name": str(row.get("thing_name", "") or ""),
                "date": date_value,
                "created_at": created_at,
            }
        )

    return result


@auth_router.patch("/admin/users/{target_user_id}/role")
def update_admin_user_role(target_user_id: str, request: Request, data: UpdateUserRoleRequest = Body(...)):
    require_admin(request)
    actor = _get_authenticated_user(request)
    role = str(data.role or "").strip().lower()
    if role not in {"admin", "user"}:
        raise HTTPException(status_code=400, detail="Role invalide")

    row = _get_user_profile_row(target_user_id)
    if not row:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    supabase.table("utilisateur").update({"role": role}).eq("id", target_user_id).execute()

    recipient_email = str(row.get("email", "") or "")
    create_notification(
        target_role=role,
        recipient_user_id=target_user_id,
        recipient_email=recipient_email,
        actor_user_id=str(actor.id),
        actor_email=str(getattr(actor, "email", "") or ""),
        title="Role mis a jour",
        message=f"Votre role a ete modifie vers '{role}'.",
        notif_type="info",
        metadata={"action": "role_update", "new_role": role},
    )

    return {
        "success": True,
        "id": target_user_id,
        "role": role,
        "email": recipient_email,
        "display_name": _display_name_from_profile(recipient_email, row),
    }


@auth_router.delete("/admin/users/{target_user_id}")
def delete_admin_user(target_user_id: str, request: Request):
    require_admin(request)
    actor = _get_authenticated_user(request)

    row = _get_user_profile_row(target_user_id)
    if not row:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    recipient_email = str(row.get("email", "") or "")

    # Try to remove the auth account from Supabase (best-effort).
    auth_deleted = False
    auth_error = None
    try:
        ok, err = delete_user_admin(target_user_id)
        auth_deleted = bool(ok)
        auth_error = err
        if not ok:
            print(f"delete_user_admin returned error: {err}")
    except Exception as e:
        auth_error = str(e)
        print(f"Erreur suppression auth supabase: {e}")

    # Remove profile row from utilisateur table
    try:
        supabase.table("utilisateur").delete().eq("id", target_user_id).execute()
    except Exception as e:
        print(f"Erreur suppression ligne utilisateur: {e}")

    # Remove related MongoDB documents (history, notifications)
    try:
        user_history_collection.delete_many({"user_id": target_user_id})
    except Exception as e:
        print(f"Erreur suppression historique utilisateur: {e}")
    try:
        notifications_collection.delete_many({"$or": [{"recipient_user_id": target_user_id}, {"actor_user_id": target_user_id}]})
    except Exception as e:
        print(f"Erreur suppression notifications utilisateur: {e}")

    result = {"success": True, "id": target_user_id, "email": recipient_email}
    result["auth_deleted"] = auth_deleted
    if auth_error:
        result["auth_error"] = str(auth_error)
    return result


@auth_router.patch("/user/display-name")
def update_display_name(request: Request, data: UpdateDisplayNameRequest = Body(...)):
    """Mettre à jour le nom d'affichage de l'utilisateur dans Supabase (UNIQUE)"""
    user = _get_authenticated_user(request)
    user_id = str(user.id)
    user_email = str(getattr(user, "email", "") or "").strip().lower()
    display_name = str(data.display_name or "").strip()
    
    print(f"[PATCH /user/display-name] user_id={user_id}, display_name='{display_name}'")
    
    if not display_name or len(display_name) > 160:
        raise HTTPException(status_code=400, detail="Nom d'affichage invalide")
    
    try:
        profile_row = _get_user_profile_row(user_id)
        timestamp_fields = ["profile_updated_at", "last_profile_update", "updated_at", "modified_at", "updatedAt"]
        profile_update_timestamp = datetime.now(timezone.utc).isoformat()
        update_payload = {"display_name": display_name}
        for field_name in timestamp_fields:
            if isinstance(profile_row, dict) and field_name in profile_row:
                update_payload[field_name] = profile_update_timestamp

        # Vérification robuste sans maybe_single(), qui peut lever une erreur si plusieurs lignes matchent.
        existing = supabase.table("utilisateur").select("id,display_name").eq("display_name", display_name).execute()
        existing_rows = []
        existing_data = getattr(existing, "data", None)
        if isinstance(existing_data, list):
            existing_rows = existing_data
        elif isinstance(existing_data, dict):
            existing_rows = [existing_data]

        for row in existing_rows:
            row_id = str((row or {}).get("id") or "").strip()
            if row_id and row_id != user_id:
                print(f"[PATCH /user/display-name] Name already exists for another user: {row_id}")
                raise HTTPException(status_code=409, detail="Ce nom d'affichage est deja pris. Veuillez en choisir un autre.")

        print(f"[PATCH /user/display-name] Calling Supabase update...")
        if profile_row:
            result = supabase.table("utilisateur").update(update_payload).eq("id", user_id).execute()
        else:
            print(f"[PATCH /user/display-name] Missing profile row, creating it...")
            result = supabase.table("utilisateur").insert({
                "id": user_id,
                "email": user_email,
                "role": "user",
                "display_name": display_name,
                "updated_at": profile_update_timestamp,
            }).execute()
        print(f"[PATCH /user/display-name] Supabase result: {result}")
        
        # Certains clients Supabase retournent une erreur ou status en cas de violation de contrainte
        try:
            err = getattr(result, 'error', None) or (result.get('error') if isinstance(result, dict) else None)
        except Exception:
            err = None

        if err:
            msg = str(err)
            if 'duplicate' in msg.lower() or 'unique' in msg.lower() or 'violat' in msg.lower():
                raise HTTPException(status_code=409, detail="Ce nom d'affichage est deja pris. Veuillez en choisir un autre.")
            print(f"Supabase update returned error: {err}")

        print(f"[PATCH /user/display-name] SUCCESS!")
        return {"success": True, "display_name": display_name}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erreur update display_name: {e}")
        import traceback; traceback.print_exc()
        raise HTTPException(status_code=500, detail="Impossible de mettre a jour le nom d'affichage.")


@auth_router.get("/user/favorites")
def get_user_favorites(request: Request):
    """Charger les favoris de l'utilisateur depuis Supabase"""
    user = _get_authenticated_user(request)
    user_id = str(user.id)
    
    try:
        query = supabase.table("utilisateur").select("favorites").eq("id", user_id).maybe_single().execute()
        raw_favorites = query.data.get("favorites", []) if query.data else []
        favorites = _normalize_favorites(raw_favorites)

        if raw_favorites != favorites:
            try:
                supabase.table("utilisateur").update({"favorites": favorites}).eq("id", user_id).execute()
            except Exception as sync_error:
                print(f"Erreur sync favorites normalises: {sync_error}")

        return {"success": True, "favorites": favorites}
    except Exception as e:
        print(f"Erreur get favorites: {e}")
        raise HTTPException(status_code=500, detail="Erreur chargement favoris")


@auth_router.post("/user/favorites")
def add_favorite(request: Request, data: AddFavoriteRequest = Body(...)):
    """Ajouter un favori pour l'utilisateur"""
    user = _get_authenticated_user(request)
    user_id = str(user.id)
    thing_id = str(data.thing_id or "").strip()
    thing_name = str(data.thing_name or "").strip()
    
    if not thing_id or not thing_name:
        raise HTTPException(status_code=400, detail="Données manquantes")
    
    try:
        # Charger les favoris existants
        query = supabase.table("utilisateur").select("favorites").eq("id", user_id).maybe_single().execute()
        favorites = _normalize_favorites(query.data.get("favorites", []) if query.data else [])
        
        # Vérifier si déjà en favori
        if any(_favorite_id_from_row(fav) == thing_id for fav in favorites if isinstance(fav, dict)):
            return {"success": True, "message": "Déjà en favori", "favorites": favorites}
        
        # Ajouter le nouveau favori
        new_favorite = {
            "id": thing_id,
            "name": thing_name,
            "addedAt": datetime.now(timezone.utc).isoformat()
        }

        # Enrichir avec des métadonnées si l'objet existe dans la collection principale
        try:
            thing = things_collection.find_one({"id": thing_id})
            if thing and isinstance(thing, dict):
                # Type
                fav_type = str(thing.get("type") or thing.get("@type") or thing.get("category") or "").strip()
                if fav_type:
                    new_favorite["type"] = fav_type

                # Localisation (room / name)
                loc = thing.get("location") if isinstance(thing.get("location"), dict) else {}
                room = str(loc.get("room") or loc.get("name") or "").strip()
                if room:
                    new_favorite["location"] = room
        except Exception as e:
            print(f"Erreur enrichment favori depuis things_collection: {e}")
        favorites.append(new_favorite)
        
        # Sauvegarder
        supabase.table("utilisateur").update({"favorites": favorites}).eq("id", user_id).execute()
        
        return {"success": True, "message": "Favori ajouté", "favorites": favorites}
    except Exception as e:
        print(f"Erreur add favorite: {e}")
        raise HTTPException(status_code=500, detail="Erreur ajout favori")


# Backwards-compatible alias routes in case of mounting/trailing-slash issues
@auth_router.post("/user/favorites/")
def add_favorite_trailing(request: Request, data: AddFavoriteRequest = Body(...)):
    try:
        print("Alias route /user/favorites/ invoked")
    except Exception:
        pass
    return add_favorite(request, data)


@auth_router.post("/user/favorites/add")
def add_favorite_addpath(request: Request, data: AddFavoriteRequest = Body(...)):
    try:
        print("Alias route /user/favorites/add invoked")
    except Exception:
        pass
    return add_favorite(request, data)


@auth_router.delete("/user/favorites/{thing_id}")
def remove_favorite(thing_id: str, request: Request):
    """Supprimer un favori pour l'utilisateur"""
    user = _get_authenticated_user(request)
    user_id = str(user.id)
    thing_id_safe = str(thing_id or "").strip()
    
    print(f"[DELETE /user/favorites/{thing_id}] user_id={user_id}, thing_id_safe='{thing_id_safe}'")
    
    if not thing_id_safe:
        raise HTTPException(status_code=400, detail="thing_id manquant")
    
    try:
        # Charger les favoris existants
        print(f"[DELETE /user/favorites/{thing_id}] Loading favorites...")
        query = supabase.table("utilisateur").select("favorites").eq("id", user_id).maybe_single().execute()
        print(f"[DELETE /user/favorites/{thing_id}] Query result: {query.data}")
        favorites = _normalize_favorites(query.data.get("favorites", []) if query.data else [])
        
        print(f"[DELETE /user/favorites/{thing_id}] Current favorites count: {len(favorites)}")
        
        # Filtrer pour supprimer
        updated_favorites = [
            fav for fav in favorites
            if not (isinstance(fav, dict) and _favorite_id_from_row(fav) == thing_id_safe)
        ]
        print(f"[DELETE /user/favorites/{thing_id}] After filter count: {len(updated_favorites)}")
        
        # Sauvegarder
        print(f"[DELETE /user/favorites/{thing_id}] Saving to Supabase...")
        result = supabase.table("utilisateur").update({"favorites": updated_favorites}).eq("id", user_id).execute()
        print(f"[DELETE /user/favorites/{thing_id}] Supabase result: {result}")
        
        print(f"[DELETE /user/favorites/{thing_id}] SUCCESS!")
        return {"success": True, "message": "Favori supprimé", "favorites": updated_favorites}
    except Exception as e:
        print(f"Erreur delete favorite: {e}")
        import traceback; traceback.print_exc()
        raise HTTPException(status_code=500, detail="Erreur suppression favori")


class UpdateUserLocalisationRequest(BaseModel):
    room: str = Field(..., min_length=1, max_length=120)
    x: float = Field(...)
    y: float = Field(...)
    z: float = Field(...)


@auth_router.put("/user-localisation")
def update_user_localisation(request: Request, data: UpdateUserLocalisationRequest = Body(...)):
    """Mettre à jour la localisation (position) de l'utilisateur dans Supabase"""
    user = _get_authenticated_user(request)
    user_id = str(user.id)
    
    room = str(data.room or "").strip()
    if not room:
        raise HTTPException(status_code=400, detail="Salle manquante")
    
    try:
        x = float(data.x or 0)
        y = float(data.y or 0)
        z = float(data.z or 0)
    except (TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Coordonnées invalides")
    
    localisation = {
        "room": room,
        "x": x,
        "y": y,
        "z": z
    }
    
    try:
        supabase.table("utilisateur").update({"localisation": localisation}).eq("id", user_id).execute()
        return {"success": True, "localisation": localisation}
    except Exception as e:
        print(f"Erreur update localisation: {e}")
        raise HTTPException(status_code=500, detail="Erreur mise à jour localisation")