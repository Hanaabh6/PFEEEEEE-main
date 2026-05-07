from datetime import datetime, timedelta, timezone
import sys

from bson import ObjectId
from fastapi import APIRouter, Body, HTTPException, Query, Request
from pydantic import BaseModel, Field

from ..base import notifications_collection, user_history_collection, things_collection
from .main_auth import _get_user_from_token, extract_bearer_token, get_role_from_token, require_admin
from .main_crud import _canonical_availability
from ..notifications_service import create_notification

notifications_router = APIRouter(tags=["notifications"])


class SendNotificationRequest(BaseModel):
    target_role: str = Field(..., min_length=4, max_length=10)
    title: str = Field(..., min_length=1, max_length=120)
    message: str = Field(..., min_length=1, max_length=500)
    notif_type: str = Field(default="info", max_length=30)
    recipient_user_id: str = Field(default="", max_length=120)
    recipient_email: str = Field(default="", max_length=254)


class MarkReadRequest(BaseModel):
    is_read: bool = True


class NearbyObjectRequest(BaseModel):
    thing_id: str = Field(..., min_length=1, max_length=120)
    thing_name: str = Field(..., min_length=1, max_length=160)
    room: str = Field(default="", max_length=120)
    distance_m: float = Field(default=0, ge=0, le=5000)


class ProblemReportRequest(BaseModel):
    thing_id: str = Field(..., min_length=1, max_length=120)
    thing_name: str = Field(..., min_length=1, max_length=160)
    problem_type: str = Field(..., min_length=1, max_length=80)
    description: str = Field(..., min_length=1, max_length=500)


class ProblemReportDecisionRequest(BaseModel):
    decision: str = Field(..., min_length=3, max_length=40)


def _main_module():
    return sys.modules.get("main")


def _notifications_collection():
    module = _main_module()
    return getattr(module, "notifications_collection", notifications_collection) if module else notifications_collection


def _require_authenticated_user(request: Request) -> tuple[str, str, str]:
    token = extract_bearer_token(request)
    if not token:
        raise HTTPException(status_code=401, detail="Token manquant")

    user = _get_user_from_token(token)
    role = get_role_from_token(token)
    return str(user.id), str(getattr(user, "email", "") or ""), str(role or "user")


def _is_notification_accessible(doc: dict, user_id: str, role: str) -> bool:
    target_role = str(doc.get("target_role") or "").strip().lower()
    recipient_user_id = str(doc.get("recipient_user_id") or "").strip()
    recipient_email = str(doc.get("recipient_email") or "").strip().lower()

    if role == "admin":
        return target_role in {"admin", "all"}

    if target_role not in {"user", "all"}:
        return False

    if not recipient_user_id:
        return True

    if recipient_user_id == user_id:
        return True

    user_email = str(doc.get("actor_email") or "").strip().lower()
    if recipient_email and user_email and recipient_email == user_email:
        return True

    return False


def _serialize_notification(doc: dict) -> dict:
    return {
        "id": str(doc.get("_id")),
        "target_role": doc.get("target_role", ""),
        "recipient_user_id": doc.get("recipient_user_id", ""),
        "title": doc.get("title", "Notification"),
        "message": doc.get("message", ""),
        "type": doc.get("type", "info"),
        "is_read": bool(doc.get("is_read", False)),
        "created_at": doc.get("created_at", ""),
        "updated_at": doc.get("updated_at", ""),
        "actor_user_id": doc.get("actor_user_id", ""),
        "actor_email": doc.get("actor_email", ""),
        "metadata": doc.get("metadata", {}),
    }


def _extract_room_label(location) -> str:
    if isinstance(location, dict):
        return str(location.get("room") or location.get("name") or "").strip()
    return str(location or "").strip()


def _extract_thing_snapshot(thing_doc: dict | None) -> dict:
    thing_doc = thing_doc or {}
    return {
        "thing_name": str(thing_doc.get("name") or "").strip(),
        "thing_type": str(thing_doc.get("type") or thing_doc.get("@type") or "").strip(),
        "thing_location": _extract_room_label(thing_doc.get("location")),
        "thing_status": str(thing_doc.get("status") or thing_doc.get("availability") or "").strip(),
        "thing_maintenance_state": str(thing_doc.get("maintenance_state") or "").strip(),
    }


def _build_thing_snapshot_map(reports: list[dict]) -> dict[str, dict]:
    thing_ids: list[str] = []
    seen: set[str] = set()
    for report in reports:
        thing_id = str(report.get("thing_id") or "").strip()
        if thing_id and thing_id not in seen:
            seen.add(thing_id)
            thing_ids.append(thing_id)

    if not thing_ids:
        return {}

    rows = list(
        _things_collection().find(
            {"id": {"$in": thing_ids}},
            {
                "id": 1,
                "name": 1,
                "type": 1,
                "location": 1,
                "status": 1,
                "availability": 1,
                "maintenance_state": 1,
            },
        )
    )
    snapshots: dict[str, dict] = {}
    for row in rows:
        thing_id = str(row.get("id") or "").strip()
        if thing_id:
            snapshots[thing_id] = _extract_thing_snapshot(row)
    return snapshots


def _serialize_problem_report(report: dict, thing_snapshots: dict[str, dict] | None = None) -> dict:
    thing_id = str(report.get("thing_id") or "").strip()
    snapshot = (thing_snapshots or {}).get(thing_id, {})
    thing_name = str(report.get("thing_name") or snapshot.get("thing_name") or "Objet").strip() or "Objet"
    thing_type = str(report.get("thing_type") or snapshot.get("thing_type") or "").strip()
    thing_location = str(report.get("thing_location") or snapshot.get("thing_location") or "").strip()
    thing_status = str(snapshot.get("thing_status") or report.get("thing_status") or "").strip()
    thing_maintenance_state = str(snapshot.get("thing_maintenance_state") or report.get("thing_maintenance_state") or "").strip()
    status = str(report.get("status") or "signale").strip() or "signale"

    return {
        "id": str(report.get("_id")),
        "user_id": str(report.get("user_id") or "").strip(),
        "email": str(report.get("email") or "").strip(),
        "thing_id": thing_id,
        "thing_name": thing_name,
        "thing_type": thing_type,
        "thing_location": thing_location,
        "thing_status": thing_status,
        "thing_maintenance_state": thing_maintenance_state,
        "problem_type": str(report.get("problem_type") or "").strip(),
        "description": str(report.get("description") or "").strip(),
        "status": status,
        "decision": str(report.get("decision") or "").strip(),
        "created_at": report.get("created_at", ""),
        "updated_at": report.get("updated_at", ""),
        "reviewed_at": report.get("reviewed_at", ""),
        "reviewed_by_user_id": str(report.get("reviewed_by_user_id") or "").strip(),
        "reviewed_by_email": str(report.get("reviewed_by_email") or "").strip(),
        "date": report.get("date", ""),
    }


def _normalize_problem_report_decision(decision: str) -> str:
    value = str(decision or "").strip().lower()
    if value in {"accept", "accepted", "accepte", "approuve"}:
        return "accept"
    if value in {"reject", "rejected", "refuse", "refus", "rejete", "rejet"}:
        return "reject"
    if value in {"reactivate", "resolved", "resolve", "remis_en_service", "remise_en_service"}:
        return "reactivate"
    raise HTTPException(status_code=400, detail="Decision invalide")


def _update_reported_thing_state(thing_id: str, status: str, maintenance_state: str) -> dict:
    clean_thing_id = str(thing_id or "").strip()
    if not clean_thing_id:
        return {}

    update_fields = {
        "status": status,
        "availability": _canonical_availability(status),
        "maintenance_state": str(maintenance_state or "").strip(),
    }
    updated = _things_collection().find_one_and_update(
        {"id": clean_thing_id},
        {"$set": update_fields},
        return_document=True,
    )
    if not updated:
        raise HTTPException(status_code=404, detail=f"Objet '{clean_thing_id}' introuvable")
    return updated


@notifications_router.get("/notifications/me")
def get_my_notifications(
    request: Request,
    only_unread: bool = Query(default=False),
    limit: int = Query(default=50, ge=1, le=200),
):
    user_id, user_email, role = _require_authenticated_user(request)
    collection = _notifications_collection()

    if role == "admin":
        query = {"target_role": {"$in": ["admin", "all"]}}
    else:
        query = {
            "target_role": {"$in": ["user", "all"]},
            "$or": [
                {"recipient_user_id": ""},
                {"recipient_user_id": {"$exists": False}},
                {"recipient_user_id": user_id},
                {"recipient_email": user_email},
            ],
        }

    if only_unread:
        query["is_read"] = False

    rows = list(collection.find(query).sort("created_at", -1).limit(limit))
    return [_serialize_notification(row) for row in rows]


@notifications_router.get("/notifications/count")
def get_notification_count(request: Request):
    user_id, user_email, role = _require_authenticated_user(request)
    collection = _notifications_collection()

    if role == "admin":
        query = {"target_role": {"$in": ["admin", "all"]}, "is_read": False}
    else:
        query = {
            "target_role": {"$in": ["user", "all"]},
            "is_read": False,
            "$or": [
                {"recipient_user_id": ""},
                {"recipient_user_id": {"$exists": False}},
                {"recipient_user_id": user_id},
                {"recipient_email": user_email},
            ],
        }

    unread = collection.count_documents(query)
    return {"unread": int(unread)}


@notifications_router.patch("/notifications/{notification_id}/read")
def mark_notification_read(notification_id: str, request: Request, data: MarkReadRequest = Body(default=MarkReadRequest())):
    user_id, _, role = _require_authenticated_user(request)
    collection = _notifications_collection()

    try:
        object_id = ObjectId(notification_id)
    except Exception:
        raise HTTPException(status_code=400, detail="notification_id invalide")

    doc = collection.find_one({"_id": object_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Notification introuvable")

    if not _is_notification_accessible(doc, user_id, role):
        raise HTTPException(status_code=403, detail="Notification non accessible")

    now = datetime.now(timezone.utc).isoformat()
    collection.update_one(
        {"_id": object_id},
        {"$set": {"is_read": bool(data.is_read), "updated_at": now}},
    )

    updated = collection.find_one({"_id": object_id}) or {}
    return {"success": True, "notification": _serialize_notification(updated)}


@notifications_router.patch("/notifications/read-all")
def mark_all_notifications_read(request: Request):
    user_id, user_email, role = _require_authenticated_user(request)
    collection = _notifications_collection()
    now = datetime.now(timezone.utc).isoformat()

    if role == "admin":
        query = {"target_role": {"$in": ["admin", "all"]}, "is_read": False}
    else:
        query = {
            "target_role": {"$in": ["user", "all"]},
            "is_read": False,
            "$or": [
                {"recipient_user_id": ""},
                {"recipient_user_id": {"$exists": False}},
                {"recipient_user_id": user_id},
                {"recipient_email": user_email},
            ],
        }

    result = collection.update_many(query, {"$set": {"is_read": True, "updated_at": now}})
    return {"success": True, "updated": int(result.modified_count)}


@notifications_router.post("/notifications/send")
def send_notification(request: Request, data: SendNotificationRequest = Body(...)):
    require_admin(request)
    _, admin_email, _ = _require_authenticated_user(request)

    target_role = str(data.target_role or "").strip().lower()
    if target_role not in {"admin", "user", "all"}:
        raise HTTPException(status_code=400, detail="target_role doit etre admin, user ou all")

    created_ids: list[str | None] = []
    if target_role == "all":
        created_ids.append(
            create_notification(
                target_role="admin",
                title=data.title,
                message=data.message,
                notif_type=data.notif_type,
                actor_email=admin_email,
            )
        )
        created_ids.append(
            create_notification(
                target_role="user",
                title=data.title,
                message=data.message,
                notif_type=data.notif_type,
                recipient_user_id=data.recipient_user_id,
                recipient_email=data.recipient_email,
                actor_email=admin_email,
            )
        )
    else:
        created_ids.append(
            create_notification(
                target_role=target_role,
                title=data.title,
                message=data.message,
                notif_type=data.notif_type,
                recipient_user_id=data.recipient_user_id if target_role == "user" else "",
                recipient_email=data.recipient_email if target_role == "user" else "",
                actor_email=admin_email,
            )
        )

    return {"success": True, "created_ids": [x for x in created_ids if x]}


@notifications_router.post("/notifications/nearby-object")
def notify_nearby_object(request: Request, data: NearbyObjectRequest = Body(...)):
    user_id, user_email, role = _require_authenticated_user(request)
    if role != "user":
        raise HTTPException(status_code=403, detail="Endpoint reserve aux users")

    collection = _notifications_collection()
    cooldown_since = (datetime.now(timezone.utc) - timedelta(minutes=30)).isoformat()

    existing = collection.find_one(
        {
            "target_role": "user",
            "recipient_user_id": user_id,
            "metadata.action": "nearby_object",
            "metadata.thing_id": data.thing_id,
            "created_at": {"$gte": cooldown_since},
        }
    )
    if existing:
        return {"success": True, "deduped": True, "id": str(existing.get("_id"))}

    room_label = str(data.room or "votre zone")
    distance_value = int(round(float(data.distance_m or 0)))
    created_id = create_notification(
        target_role="user",
        recipient_user_id=user_id,
        recipient_email=user_email,
        actor_user_id=user_id,
        actor_email=user_email,
        title="Objet proche de votre salle",
        message=f"{data.thing_name} est proche de {room_label} (environ {distance_value}m).",
        notif_type="info",
        metadata={
            "action": "nearby_object",
            "thing_id": data.thing_id,
            "room": room_label,
            "distance_m": distance_value,
        },
    )

    return {"success": True, "deduped": False, "id": created_id}


@notifications_router.post("/problem-report")
def submit_problem_report(request: Request, data: ProblemReportRequest = Body(...)):
    """Enregistrer un signalement d'objet et notifier tous les admins"""
    user_id, user_email, role = _require_authenticated_user(request)
    if role != "user":
        raise HTTPException(status_code=403, detail="Endpoint réservé aux utilisateurs")

    user_history = _user_history_collection()
    things = _things_collection()
    now = datetime.now(timezone.utc)
    now_iso = now.isoformat()

    thing_id = str(data.thing_id or "").strip()
    thing_name = str(data.thing_name or "Objet").strip()
    problem_type = str(data.problem_type or "").strip()
    description = str(data.description or "").strip()

    if not thing_id or not problem_type or not description:
        raise HTTPException(status_code=400, detail="Champs requis manquants")

    thing_doc = things.find_one({"id": thing_id}) or {}
    thing_snapshot = _extract_thing_snapshot(thing_doc)
    if thing_snapshot.get("thing_name"):
        thing_name = thing_snapshot["thing_name"]

    # Enregistrer le signalement dans user_history
    report_doc = {
        "user_id": user_id,
        "email": user_email,
        "action": "SIGNALEMENT_OBJET",
        "detail": f"Signalement: {problem_type}",
        "description": description,
        "status": "signale",
        "decision": "",
        "date": now.strftime("%d/%m/%Y %H:%M:%S"),
        "created_at": now_iso,
        "updated_at": now_iso,
        "thing_id": thing_id,
        "thing_name": thing_name,
        "thing_type": thing_snapshot.get("thing_type", ""),
        "thing_location": thing_snapshot.get("thing_location", ""),
        "thing_status": thing_snapshot.get("thing_status", ""),
        "thing_maintenance_state": thing_snapshot.get("thing_maintenance_state", ""),
        "problem_type": problem_type,
    }

    result = user_history.insert_one(report_doc)
    report_id = str(result.inserted_id)

    # Créer notification pour TOUS les admins
    message = f"Signalement de {user_email}: {thing_name} - {problem_type}\n{description}"
    create_notification(
        target_role="admin",
        title=f"Nouveau signalement: {thing_name}",
        message=message,
        notif_type="warning",
        actor_user_id=user_id,
        actor_email=user_email,
        metadata={
            "action": "problem_report",
            "thing_id": thing_id,
            "problem_type": problem_type,
            "report_id": report_id,
        },
    )

    return {
        "success": True,
        "report_id": report_id,
        "message": "Signalement enregistré. Les administrateurs en ont été notifiés.",
    }


def _user_history_collection():
    module = _main_module()
    return getattr(module, "user_history_collection", user_history_collection) if module else user_history_collection


def _things_collection():
    module = _main_module()
    return getattr(module, "things_collection", things_collection) if module else things_collection


@notifications_router.patch("/problem-reports/{report_id}/decision")
def review_problem_report(report_id: str, request: Request, data: ProblemReportDecisionRequest = Body(...)):
    """Traiter un signalement de manière persistée pour tous les admins."""
    require_admin(request)
    admin_user_id, admin_email, _ = _require_authenticated_user(request)
    user_history = _user_history_collection()

    try:
        report_object_id = ObjectId(report_id)
    except Exception:
        raise HTTPException(status_code=400, detail="report_id invalide")

    report = user_history.find_one({"_id": report_object_id, "action": "SIGNALEMENT_OBJET"})
    if not report:
        raise HTTPException(status_code=404, detail="Signalement introuvable")

    decision = _normalize_problem_report_decision(data.decision)
    now_iso = datetime.now(timezone.utc).isoformat()
    thing_id = str(report.get("thing_id") or "").strip()
    thing_name = str(report.get("thing_name") or "Objet").strip() or "Objet"

    update_fields = {
        "updated_at": now_iso,
        "reviewed_at": now_iso,
        "reviewed_by_user_id": admin_user_id,
        "reviewed_by_email": admin_email,
        "decision": decision,
    }
    notification_title = ""
    notification_message = ""
    notification_type = "info"

    if decision == "accept":
        if thing_id:
            updated_thing = _update_reported_thing_state(thing_id, "inactive", "en panne")
            update_fields.update(_extract_thing_snapshot(updated_thing))
            update_fields["status"] = "Accepte - objet en panne"
        else:
            update_fields["status"] = "Accepte - signalement recu"
        notification_title = "Signalement accepte"
        notification_message = f"Votre signalement pour {thing_name} a ete accepte. L'objet est maintenant marque en panne."
        notification_type = "warning"
    elif decision == "reject":
        update_fields["status"] = "Refuse"
        notification_title = "Signalement refuse"
        notification_message = f"Votre signalement pour {thing_name} a ete refuse par l'administration."
        notification_type = "error"
    else:
        if thing_id:
            updated_thing = _update_reported_thing_state(thing_id, "active", "")
            update_fields.update(_extract_thing_snapshot(updated_thing))
            update_fields["status"] = "Resolu - remis en service"
        else:
            update_fields["status"] = "Resolu - signalement traite"
        notification_title = "Objet remis en service"
        notification_message = f"L'objet {thing_name} a ete remis en service apres traitement de votre signalement."
        notification_type = "success"

    user_history.update_one({"_id": report_object_id}, {"$set": update_fields})
    updated_report = user_history.find_one({"_id": report_object_id}) or {}

    recipient_user_id = str(updated_report.get("user_id") or "").strip()
    recipient_email = str(updated_report.get("email") or "").strip()
    if recipient_user_id or recipient_email:
        create_notification(
            target_role="user",
            recipient_user_id=recipient_user_id,
            recipient_email=recipient_email,
            actor_user_id=admin_user_id,
            actor_email=admin_email,
            title=notification_title,
            message=notification_message,
            notif_type=notification_type,
            metadata={
                "action": "problem_report_review",
                "decision": decision,
                "report_id": report_id,
                "thing_id": thing_id,
            },
        )

    return {
        "success": True,
        "report": _serialize_problem_report(updated_report),
    }


@notifications_router.get("/problem-reports")
def get_problem_reports(request: Request, limit: int = Query(default=50, ge=1, le=200)):
    """Récupérer les signalements (ses propres pour user, tous pour admin)"""
    user_id, _, role = _require_authenticated_user(request)
    user_history = _user_history_collection()

    if role == "admin":
        # Les admins voient TOUS les signalements
        query = {"action": "SIGNALEMENT_OBJET"}
    else:
        # Les users ne voient que les leurs
        query = {"action": "SIGNALEMENT_OBJET", "user_id": user_id}

    reports = list(user_history.find(query).sort("created_at", -1).limit(limit))
    thing_snapshots = _build_thing_snapshot_map(reports)
    serialized = [_serialize_problem_report(report, thing_snapshots) for report in reports]
    return {"success": True, "reports": serialized}
