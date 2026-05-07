from datetime import datetime, timedelta, timezone
import sys
from typing import Any

import requests
from fastapi import APIRouter, Body, HTTPException, Request
from pydantic import BaseModel, Field

from ..base import things_collection, user_history_collection
from .main_auth import _get_user_from_token, _prune_user_history, extract_bearer_token, require_admin
from ..notifications_service import create_notification

borrow_router = APIRouter(tags=["borrow"])


class BorrowRequest(BaseModel):
    duration_minutes: int | None = Field(default=None, ge=1, le=43200)
    planned_return_at: str = Field(default="", max_length=80)


def _main_module():
    return sys.modules.get("main")


def _things_collection():
    module = _main_module()
    return getattr(module, "things_collection", things_collection) if module else things_collection


def _user_history_collection():
    module = _main_module()
    return getattr(module, "user_history_collection", user_history_collection) if module else user_history_collection


def _auth_user_checker():
    module = _main_module()
    return getattr(module, "_require_authenticated_user", None) if module else None


def _normalize_text(text: str) -> str:
    return str(text or "").strip().lower()


def _canonical_availability(status: str) -> str:
    s = _normalize_text(status)
    if s in {"active", "disponible", "in-stock", "instock"}:
        return "disponible"
    if s in {"en_utilisation", "en utilisation", "borrowed"}:
        return "en_utilisation"
    return "indisponible"


def _require_authenticated_user(request: Request) -> tuple[str, str]:
    main_checker = _auth_user_checker()
    if callable(main_checker) and main_checker is not _require_authenticated_user:
        return main_checker(request)

    token = extract_bearer_token(request)
    if not token:
        raise HTTPException(status_code=401, detail="Token manquant")

    user = _get_user_from_token(token)

    return str(user.id), str(getattr(user, "email", "") or "")


def _active_borrow_log(history, user_id: str, thing_id: str):
    return history.find_one(
        {
            "thing_id": thing_id,
            "user_id": user_id,
            "action": "EMPRUNT_DEBUT",
            "returned": False,
        },
        sort=[("created_at", -1)],
    )


def _active_borrow_log_for_thing(history, thing_id: str):
    return history.find_one(
        {
            "thing_id": thing_id,
            "action": "EMPRUNT_DEBUT",
            "returned": False,
        },
        sort=[("created_at", -1)],
    )


def _parse_iso_datetime(raw_value: str) -> datetime:
    value = str(raw_value or "").strip()
    if not value:
        raise HTTPException(status_code=400, detail="Date de retour prevue manquante")

    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Date de retour prevue invalide") from exc

    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)

    return parsed.astimezone(timezone.utc)


def _parse_optional_iso_datetime(raw_value: str) -> datetime | None:
    value = str(raw_value or "").strip()
    if not value:
        return None

    try:
        return _parse_iso_datetime(value)
    except HTTPException:
        return None


def _resolve_borrow_plan(now: datetime, data: BorrowRequest) -> tuple[str, int, str]:
    # Mode illimité : l'utilisateur peut utiliser l'objet aussi longtemps qu'il veut
    # Pas de durée limite, pas de retour automatique
    return "", 0, "unlimited"


def _parse_log_datetime(raw_value: str) -> datetime:
    try:
        parsed = datetime.fromisoformat(str(raw_value or "").replace("Z", "+00:00"))
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        return parsed.astimezone(timezone.utc)
    except Exception:
        return datetime.now(timezone.utc)


def _finalize_borrow_return(
    *,
    things,
    history,
    open_log: dict,
    thing: dict,
    detail: str,
    returned_by: str,
    returned_by_user_id: str = "",
    returned_by_email: str = "",
) -> dict:
    borrower_user_id = str(open_log.get("user_id") or "").strip()
    borrower_email = str(open_log.get("email") or "").strip()
    thing_id = str(open_log.get("thing_id") or thing.get("id") or "").strip()
    thing_name = str(thing.get("name") or open_log.get("thing_name") or "objet")
    planned_return_at = str(open_log.get("planned_return_at") or "").strip()
    planned_duration_minutes = int(open_log.get("planned_duration_minutes") or 0)

    start_dt = _parse_log_datetime(str(open_log.get("created_at") or ""))
    end_dt = datetime.now(timezone.utc)
    duration_min = max(0, int((end_dt - start_dt).total_seconds() // 60))
    end_iso = end_dt.isoformat()

    history.update_one(
        {"_id": open_log["_id"]},
        {
            "$set": {
                "returned": True,
                "returned_at": end_iso,
                "duree_minutes": duration_min,
                "returned_by": returned_by,
                "returned_by_user_id": returned_by_user_id,
                "returned_by_email": returned_by_email,
            }
        },
    )

    history.insert_one(
        {
            "user_id": borrower_user_id,
            "email": borrower_email,
            "action": "EMPRUNT_FIN",
            "detail": detail,
            "status": "disponible",
            "date": end_dt.strftime("%d/%m/%Y %H:%M:%S"),
            "created_at": end_iso,
            "thing_id": thing_id,
            "thing_name": thing_name,
            "duree_minutes": duration_min,
            "planned_duration_minutes": planned_duration_minutes,
            "planned_return_at": planned_return_at,
            "returned_by": returned_by,
        }
    )
    _prune_user_history(borrower_user_id)

    things.update_one(
        {"id": thing_id},
        {
            "$set": {
                "availability": "disponible",
                "status": "active",
                "maintenance_state": "",
            },
            "$unset": {
                "current_borrow": "",
            },
        },
    )

    return {
        "user_id": borrower_user_id,
        "email": borrower_email,
        "thing_id": thing_id,
        "thing_name": thing_name,
        "duration_min": duration_min,
        "planned_duration_minutes": planned_duration_minutes,
        "planned_return_at": planned_return_at,
        "returned_at": end_iso,
    }


def expire_due_borrows(*, thing_id: str = "", user_id: str = "", limit: int = 200) -> list[dict]:
    history = _user_history_collection()
    things = _things_collection()
    now = datetime.now(timezone.utc)

    query: dict[str, Any] = {
        "action": "EMPRUNT_DEBUT",
        "returned": False,
        "planned_return_at": {"$exists": True, "$nin": ["", None]},
    }
    safe_thing_id = str(thing_id or "").strip()
    safe_user_id = str(user_id or "").strip()
    if safe_thing_id:
        query["thing_id"] = safe_thing_id
    if safe_user_id:
        query["user_id"] = safe_user_id

    open_logs = list(history.find(query).sort("created_at", 1).limit(max(1, int(limit or 200))))
    expired_results: list[dict] = []

    for open_log in open_logs:
        planned_dt = _parse_optional_iso_datetime(open_log.get("planned_return_at"))
        if planned_dt is None or planned_dt > now:
            continue

        borrower_user_id = str(open_log.get("user_id") or "").strip()
        borrower_email = str(open_log.get("email") or "").strip()
        current_thing_id = str(open_log.get("thing_id") or "").strip()
        if not current_thing_id:
            continue

        thing = things.find_one({"id": current_thing_id}) or {}
        thing_name = str(thing.get("name") or open_log.get("thing_name") or "objet")
        planned_return_at = str(open_log.get("planned_return_at") or "").strip()
        planned_duration_minutes = int(open_log.get("planned_duration_minutes") or 0)
        start_dt = _parse_log_datetime(str(open_log.get("created_at") or ""))
        end_iso = now.isoformat()
        duration_min = max(0, int((now - start_dt).total_seconds() // 60))

        claim_result = history.update_one(
            {"_id": open_log["_id"], "returned": False},
            {
                "$set": {
                    "returned": True,
                    "returned_at": end_iso,
                    "duree_minutes": duration_min,
                    "returned_by": "system",
                    "returned_by_user_id": "",
                    "returned_by_email": "",
                }
            },
        )
        if claim_result.modified_count == 0:
            continue

        history.insert_one(
            {
                "user_id": borrower_user_id,
                "email": borrower_email,
                "action": "EMPRUNT_FIN",
                "detail": f"Retour automatique de {thing_name}",
                "status": "disponible",
                "date": now.strftime("%d/%m/%Y %H:%M:%S"),
                "created_at": end_iso,
                "thing_id": current_thing_id,
                "thing_name": thing_name,
                "duree_minutes": duration_min,
                "planned_duration_minutes": planned_duration_minutes,
                "planned_return_at": planned_return_at,
                "returned_by": "system",
            }
        )
        _prune_user_history(borrower_user_id)

        things.update_one(
            {"id": current_thing_id},
            {
                "$set": {
                    "availability": "disponible",
                    "status": "active",
                    "maintenance_state": "",
                },
                "$unset": {
                    "current_borrow": "",
                },
            },
        )

        if borrower_user_id or borrower_email:
            create_notification(
                target_role="user",
                recipient_user_id=borrower_user_id,
                recipient_email=borrower_email,
                title="Objet rendu automatiquement",
                message=f"{thing_name} a ete remis disponible automatiquement a la fin de la duree prevue.",
                notif_type="info",
                metadata={"thing_id": current_thing_id, "action": "auto_return", "duration_min": duration_min},
            )
        create_notification(
            target_role="admin",
            title="Retour automatique objet",
            message=f"{thing_name} a ete remis disponible automatiquement a la fin de la duree prevue.",
            notif_type="info",
            metadata={"thing_id": current_thing_id, "action": "auto_return", "user_id": borrower_user_id},
        )

        expired_results.append(
            {
                "thing_id": current_thing_id,
                "thing_name": thing_name,
                "user_id": borrower_user_id,
                "email": borrower_email,
                "planned_return_at": planned_return_at,
                "duration_min": duration_min,
                "returned_at": end_iso,
            }
        )

    return expired_results


def _remote_action_config(thing: dict, action_name: str) -> dict:
    control = thing.get("control") if isinstance(thing.get("control"), dict) else {}
    actions = control.get("actions") if isinstance(control.get("actions"), dict) else {}
    action_cfg = actions.get(action_name) if isinstance(actions.get(action_name), dict) else {}
    href = str(action_cfg.get("href") or "").strip()
    method = str(action_cfg.get("method") or "POST").strip().upper()
    if not href:
        raise HTTPException(status_code=400, detail="Aucune action distante configuree pour cet objet")
    return {"href": href, "method": method}


def _call_remote_action(remote_cfg: dict, payload: dict[str, Any] | None = None):
    method = str(remote_cfg.get("method") or "POST").strip().upper()
    href = str(remote_cfg.get("href") or "").strip()
    if method == "GET":
        return requests.get(href, timeout=8)

    clean_payload = payload if isinstance(payload, dict) and payload else None
    return requests.request(method, href, json=clean_payload, timeout=8)


def _extract_response_payload(response) -> dict:
    try:
        data = response.json()
        if isinstance(data, dict):
            return data
        return {"data": data}
    except ValueError:
        return {"message": str(response.text or "").strip()}


def _build_device_state(thing: dict, action_name: str, payload: dict, remote_payload: dict) -> dict:
    previous = thing.get("device_state") if isinstance(thing.get("device_state"), dict) else {}
    now_iso = datetime.now(timezone.utc).isoformat()

    next_state = {
        "power": str(previous.get("power") or "off"),
        "last_action": action_name,
        "last_action_at": now_iso,
        "reachable": True,
        "last_result": remote_payload,
    }

    if action_name in {"on", "off"}:
        next_state["power"] = "on" if action_name == "on" else "off"

    if action_name == "play":
        channel = str(payload.get("channel") or remote_payload.get("current") or "").strip()
        if channel:
            next_state["channel"] = channel

    if action_name in {"next", "prev", "status"}:
        channel = str(remote_payload.get("current") or "").strip()
        if channel:
            next_state["channel"] = channel

    if action_name == "channels":
        channels = remote_payload.get("channels") if isinstance(remote_payload.get("channels"), list) else remote_payload.get("data")
        if isinstance(channels, list):
            next_state["channels"] = channels

    return next_state


@borrow_router.get("/user/mes-objets")
def get_mes_objets(request: Request):
    user_id, _ = _require_authenticated_user(request)
    expire_due_borrows(user_id=user_id)
    history = _user_history_collection()
    things = _things_collection()

    open_logs = list(
        history.find(
            {
                "user_id": user_id,
                "action": "EMPRUNT_DEBUT",
                "returned": False,
            }
        ).sort("created_at", -1)
    )

    result = []
    for log in open_logs:
        thing_id = str(log.get("thing_id") or "").strip()
        if not thing_id:
            continue

        thing = things.find_one({"id": thing_id}) or {}
        loc = thing.get("location") if isinstance(thing.get("location"), dict) else {}

        result.append(
            {
                "thing_id": thing_id,
                "name": thing.get("name") or log.get("thing_name") or "Objet",
                "type": thing.get("type") or thing.get("@type") or "-",
                "status": thing.get("status") or "inactive",
                "availability": thing.get("availability") or "en_utilisation",
                "location": {
                    "room": loc.get("room") or loc.get("name") or log.get("salle") or "-",
                    "x": loc.get("x", 0),
                    "y": loc.get("y", 0),
                    "z": loc.get("z", 0),
                },
                "taken_at": log.get("created_at") or "",
                "planned_return_at": (
                    (thing.get("current_borrow") if isinstance(thing.get("current_borrow"), dict) else {}).get("planned_return_at")
                    or log.get("planned_return_at")
                    or ""
                ),
                "planned_duration_minutes": int(
                    (thing.get("current_borrow") if isinstance(thing.get("current_borrow"), dict) else {}).get("planned_duration_minutes")
                    or log.get("planned_duration_minutes")
                    or 0
                ),
                "borrow_mode": (
                    (thing.get("current_borrow") if isinstance(thing.get("current_borrow"), dict) else {}).get("mode")
                    or log.get("borrow_mode")
                    or ""
                ),
                "control": thing.get("control") if isinstance(thing.get("control"), dict) else None,
                "device_state": thing.get("device_state") if isinstance(thing.get("device_state"), dict) else {},
            }
        )

    return result


@borrow_router.post("/things/{thing_id}/prendre")
@borrow_router.post("/take/{thing_id}")
def prendre_objet(thing_id: str, request: Request, data: BorrowRequest = Body(default=BorrowRequest())):
    user_id, email = _require_authenticated_user(request)

    things = _things_collection()
    history = _user_history_collection()
    expire_due_borrows(thing_id=thing_id)

    thing = things.find_one({"id": thing_id})
    if not thing:
        raise HTTPException(status_code=404, detail="Objet introuvable")

    availability = _canonical_availability(str(thing.get("availability") or thing.get("status") or ""))
    if availability != "disponible":
        raise HTTPException(status_code=400, detail="Objet non disponible")

    now = datetime.now(timezone.utc)
    now_iso = now.isoformat()
    room_name = ""
    loc = thing.get("location")
    if isinstance(loc, dict):
        room_name = str(loc.get("room") or loc.get("name") or "")

    history.insert_one(
        {
            "user_id": user_id,
            "email": email,
            "action": "EMPRUNT_DEBUT",
            "detail": f"Prise de {thing.get('name', 'objet')}",
            "status": "en_utilisation",
            "date": now.strftime("%d/%m/%Y %H:%M:%S"),
            "created_at": now_iso,
            "thing_id": thing_id,
            "thing_name": thing.get("name", ""),
            "salle": room_name,
            "returned": False,
        }
    )
    _prune_user_history(user_id)

    things.update_one(
        {"id": thing_id},
        {
            "$set": {
                "availability": "en_utilisation",
                "status": "inactive",
                "current_borrow": {
                    "active": True,
                    "user_id": user_id,
                    "user_email": email,
                    "taken_at": now_iso,
                },
            }
        },
    )

    thing_name = str(thing.get("name") or "objet")
    create_notification(
        target_role="user",
        recipient_user_id=user_id,
        recipient_email=email,
        actor_user_id=user_id,
        actor_email=email,
        title="Objet pris",
        message=f"Vous avez pris {thing_name}. Cliquez sur 'Rendre' quand vous aurez termine.",
        notif_type="success",
        metadata={
            "thing_id": thing_id,
            "action": "take",
        },
    )
    create_notification(
        target_role="admin",
        actor_user_id=user_id,
        actor_email=email,
        title="Emprunt utilisateur",
        message=f"{email or user_id} a pris {thing_name}.",
        notif_type="info",
        metadata={
            "thing_id": thing_id,
            "action": "take",
            "user_id": user_id,
        },
    )

    return {
        "success": True,
        "message": f"Vous avez pris {thing.get('name', 'objet')}. Cliquez sur 'Rendre' quand vous aurez termine.",
        "timestamp": now_iso,
    }


@borrow_router.post("/things/{thing_id}/retourner")
@borrow_router.post("/return/{thing_id}")
def retourner_objet(thing_id: str, request: Request):
    user_id, email = _require_authenticated_user(request)

    things = _things_collection()
    history = _user_history_collection()
    expire_due_borrows(thing_id=thing_id, user_id=user_id)

    open_log = _active_borrow_log(history, user_id, thing_id)
    if not open_log:
        raise HTTPException(status_code=400, detail="Aucun emprunt actif pour cet objet")

    thing = things.find_one({"id": thing_id}) or {}
    result = _finalize_borrow_return(
        things=things,
        history=history,
        open_log=open_log,
        thing=thing,
        detail=f"Retour de {thing.get('name', 'objet')}",
        returned_by="user",
        returned_by_user_id=user_id,
        returned_by_email=email,
    )

    thing_name = result["thing_name"]
    duration_min = result["duration_min"]
    create_notification(
        target_role="user",
        recipient_user_id=user_id,
        recipient_email=email,
        actor_user_id=user_id,
        actor_email=email,
        title="Objet retourne",
        message=f"Vous avez retourne {thing_name}.",
        notif_type="success",
        metadata={"thing_id": thing_id, "action": "return", "duration_min": duration_min},
    )
    create_notification(
        target_role="admin",
        actor_user_id=user_id,
        actor_email=email,
        title="Retour utilisateur",
        message=f"{email or user_id} a retourne {thing_name} ({duration_min} min).",
        notif_type="info",
        metadata={"thing_id": thing_id, "action": "return", "duration_min": duration_min, "user_id": user_id},
    )

    return {
        "success": True,
        "message": f"Merci. Objet retourne apres {duration_min} minutes",
        "duree_minutes": duration_min,
    }


@borrow_router.post("/admin/things/{thing_id}/release-borrow")
def admin_release_borrow(thing_id: str, request: Request):
    require_admin(request)
    admin_user_id, admin_email = _require_authenticated_user(request)

    things = _things_collection()
    history = _user_history_collection()
    expire_due_borrows(thing_id=thing_id)

    open_log = _active_borrow_log_for_thing(history, thing_id)
    if not open_log:
        raise HTTPException(status_code=404, detail="Aucun emprunt actif pour cet objet")

    thing = things.find_one({"id": thing_id}) or {}
    result = _finalize_borrow_return(
        things=things,
        history=history,
        open_log=open_log,
        thing=thing,
        detail=f"Retrait admin de {thing.get('name', 'objet')}",
        returned_by="admin",
        returned_by_user_id=admin_user_id,
        returned_by_email=admin_email,
    )

    borrower_user_id = result["user_id"]
    borrower_email = result["email"]
    thing_name = result["thing_name"]

    create_notification(
        target_role="user",
        recipient_user_id=borrower_user_id,
        recipient_email=borrower_email,
        actor_user_id=admin_user_id,
        actor_email=admin_email,
        title="Objet retire par l'admin",
        message=f"Un administrateur a retire {thing_name} et l'a remis disponible.",
        notif_type="warning",
        metadata={"thing_id": thing_id, "action": "admin_release"},
    )
    create_notification(
        target_role="admin",
        actor_user_id=admin_user_id,
        actor_email=admin_email,
        title="Objet remis disponible",
        message=f"{thing_name} a ete retire a {borrower_email or borrower_user_id or 'un utilisateur'} et remis disponible.",
        notif_type="info",
        metadata={"thing_id": thing_id, "action": "admin_release", "user_id": borrower_user_id},
    )

    return {
        "success": True,
        "message": f"{thing_name} est maintenant disponible",
        "thing_id": result["thing_id"],
        "returned_at": result["returned_at"],
    }


@borrow_router.post("/things/{thing_id}/actions/{action_name}")
def trigger_remote_object_action(thing_id: str, action_name: str, request: Request, payload: dict[str, Any] | None = None):
    user_id, email = _require_authenticated_user(request)

    safe_action = str(action_name or "").strip().lower()
    supported_actions = {"on", "off", "play", "next", "prev", "volume-up", "volume-down", "mute", "channels", "status"}
    if safe_action not in supported_actions:
        raise HTTPException(status_code=400, detail="Action distante non supportee")

    things = _things_collection()
    history = _user_history_collection()
    expire_due_borrows(thing_id=thing_id, user_id=user_id)

    open_log = _active_borrow_log(history, user_id, thing_id)
    if not open_log:
        raise HTTPException(status_code=403, detail="Vous devez prendre cet objet avant de l'utiliser")

    thing = things.find_one({"id": thing_id})
    if not thing:
        raise HTTPException(status_code=404, detail="Objet introuvable")

    remote_cfg = _remote_action_config(thing, safe_action)
    action_payload = payload if isinstance(payload, dict) else {}

    # Premier essai: appel selon la configuration fournie
    last_exception = None
    remote_response = None
    try:
        remote_response = _call_remote_action(remote_cfg, action_payload)
    except requests.RequestException as exc:
        last_exception = exc

    # Si l'appel initial a echoue ou retourne une erreur, tenter quelques fallbacks courants (ON/OFF seulement)
    if safe_action in {"on", "off"} and (not remote_response or not getattr(remote_response, "ok", False)):
        # tentatives alternatives: même method avec JSON, POST avec different payloads, puis GET
        try:
            resp_alt = requests.request(remote_cfg["method"], remote_cfg["href"], json={"action": safe_action}, timeout=6)
            if getattr(resp_alt, "ok", False):
                remote_response = resp_alt
        except requests.RequestException as exc2:
            last_exception = exc2

        if not remote_response or not getattr(remote_response, "ok", False):
            for body in ({"state": safe_action}, {"power": safe_action}):
                try:
                    resp_alt = requests.post(remote_cfg["href"], json=body, timeout=6)
                    if getattr(resp_alt, "ok", False):
                        remote_response = resp_alt
                        break
                except requests.RequestException as exc3:
                    last_exception = exc3

        if not remote_response or not getattr(remote_response, "ok", False):
            try:
                resp_alt = requests.get(remote_cfg["href"], timeout=6)
                if getattr(resp_alt, "ok", False):
                    remote_response = resp_alt
            except requests.RequestException as exc4:
                last_exception = exc4

    if not remote_response:
        things.update_one(
            {"id": thing_id},
            {"$set": {"device_state.reachable": False}},
        )
        raise HTTPException(status_code=502, detail=f"Objet distant injoignable: {last_exception}") from last_exception

    remote_payload = _extract_response_payload(remote_response)

    if not getattr(remote_response, "ok", False):
        detail = remote_payload.get("detail") or remote_payload.get("error") or remote_payload.get("message") or "Echec action distante"
        raise HTTPException(status_code=502, detail=str(detail))

    now_iso = datetime.now(timezone.utc).isoformat()
    device_state = _build_device_state(thing, safe_action, action_payload, remote_payload)

    things.update_one(
        {"id": thing_id},
        {"$set": {"device_state": device_state}},
    )

    history.insert_one(
        {
            "user_id": user_id,
            "email": email,
            "action": "OBJET_ACTION",
            "detail": f"{thing.get('name', 'objet')} -> {safe_action.upper()}",
            "status": "Succes",
            "date": datetime.now(timezone.utc).strftime("%d/%m/%Y %H:%M:%S"),
            "created_at": now_iso,
            "thing_id": thing_id,
            "thing_name": thing.get("name", ""),
            "remote_payload": remote_payload,
        }
    )
    _prune_user_history(user_id)

    thing_name = str(thing.get("name") or "objet")
    create_notification(
        target_role="user",
        recipient_user_id=user_id,
        recipient_email=email,
        actor_user_id=user_id,
        actor_email=email,
        title="Commande objet executee",
        message=f"Action {safe_action.upper()} envoyee a {thing_name}.",
        notif_type="success",
        metadata={"thing_id": thing_id, "action": safe_action},
    )

    return {
        "success": True,
        "message": remote_payload.get("message") or f"Action {safe_action.upper()} executee",
        "thing_id": thing_id,
        "device_state": device_state,
        "remote_response": remote_payload,
    }
