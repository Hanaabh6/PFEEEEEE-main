from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, HTTPException, Request
from typing import Any

from ..base import things_collection, notifications_collection, user_history_collection, db

stats_router = APIRouter(tags=["stats"])


def _require_authenticated_user(request: Request):
    auth = request.headers.get("Authorization", "")
    token = auth.replace("Bearer ", "").strip() if auth.startswith("Bearer ") else auth.strip()
    if not token:
        raise HTTPException(status_code=401, detail="Non authentifie")
    return token


def _normalize_status(value: str) -> str:
    v = str(value or "").lower().strip()
    if v in ("active", "actif", "disponible"):
        return "active"
    if v in ("inactive", "inactif", "indisponible", "hors service", "hors-service", "hors ligne", "hors-ligne", "broken", "out of order", "hs"):
        return "inactive"
    if v in ("en_utilisation", "en utilisation", "borrowed", "emprunte"):
        return "en_utilisation"
    if v in ("panne", "en panne", "maintenance", "signale"):
        return "panne"
    return "autre"


def _is_closed_report_status(status: str) -> bool:
    value = str(status or "").strip().lower()
    return any(
        token in value
        for token in ("refuse", "rejet", "resolu", "remis en service", "traite")
    )


def _thing_is_still_reported(thing: dict[str, Any] | None) -> bool:
    item = thing or {}
    if str(item.get("maintenance_state") or "").strip():
        return True
    raw_status = item.get("status") or item.get("availability") or ""
    return _normalize_status(str(raw_status)) in {"inactive", "panne"}


def _build_thing_state_map(thing_ids: list[str]) -> dict[str, dict[str, Any]]:
    clean_ids = [str(thing_id or "").strip() for thing_id in thing_ids if str(thing_id or "").strip()]
    if not clean_ids:
        return {}

    rows = list(
        things_collection.find(
            {"id": {"$in": clean_ids}},
            {
                "id": 1,
                "name": 1,
                "status": 1,
                "availability": 1,
                "maintenance_state": 1,
            },
        )
    )

    return {
        str(row.get("id") or "").strip(): row
        for row in rows
        if str(row.get("id") or "").strip()
    }


def _parse_created_at_iso(raw_value: str) -> datetime | None:
    value = str(raw_value or "").strip()
    if not value:
        return None

    try:
        normalized = value.replace("Z", "+00:00")
        parsed = datetime.fromisoformat(normalized)
        if parsed.tzinfo is None:
            return parsed.replace(tzinfo=timezone.utc)
        return parsed.astimezone(timezone.utc)
    except Exception:
        return None


def _normalize_history_action(value: str) -> str:
    text = str(value or "").strip().lower()
    if text.startswith("admin -"):
        text = text.replace("admin -", "", 1).strip()
    return text


@stats_router.get("/admin/stats/overview")
def get_overview_stats(request: Request):
    _require_authenticated_user(request)
    try:
        total = things_collection.count_documents({})
        active = things_collection.count_documents({
            "$or": [
                {"status": {"$in": ["active", "Active", "disponible", "Disponible"]}},
                {"availability": {"$in": ["active", "Active", "disponible", "Disponible"]}}
            ]
        })
        inactive = things_collection.count_documents({
            "$or": [
                {"status": {"$in": ["inactive", "Inactive", "indisponible", "hors service", "hors-service"]}},
                {"availability": {"$in": ["inactive", "Inactive", "indisponible", "hors service", "hors-service"]}}
            ]
        })
        
        # Objets en panne / maintenance
        broken = things_collection.count_documents({
            "$or": [
                {"maintenance_state": {"$exists": True, "$ne": ""}},
                {"status": {"$in": ["panne", "en panne", "maintenance"]}},
                {"availability": {"$in": ["panne", "en panne", "maintenance"]}}
            ]
        })
        
        # Objets actuellement empruntÃ©s
        borrowed = things_collection.count_documents({
            "$or": [
                {"current_borrow": {"$exists": True, "$ne": None}},
                {"status": "en_utilisation"},
                {"availability": "en_utilisation"}
            ]
        })
        
        # Signalements non lus / en attente
        notif_unread = notifications_collection.count_documents({
            "notif_type": "warning",
            "$or": [
                {"is_read": False},
                {"is_read": {"$exists": False}}
            ]
        })
        # Also include 'signalement' actions recorded in user_history_collection
        history_reports = user_history_collection.count_documents({
            "action": {"$regex": "signal|SIGNALEMENT", "$options": "i"}
        })
        pending_reports = notif_unread + history_reports
        
        # Total vues
        views_pipeline = [
            {"$group": {"_id": None, "total_views": {"$sum": "$view_count"}}}
        ]
        views_result = list(things_collection.aggregate(views_pipeline))
        total_views = views_result[0]["total_views"] if views_result else 0
        
        # Salles uniques
        rooms = things_collection.distinct("location.room")
        room_count = len([r for r in rooms if r])
        
        return {
            "total": total,
            "active": active,
            "inactive": inactive,
            "broken": broken,
            "borrowed": borrowed,
            "pending_reports": pending_reports,
            "total_views": total_views,
            "rooms": room_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur stats overview: {e}")


@stats_router.get("/admin/stats/by-type")
def get_stats_by_type(request: Request):
    _require_authenticated_user(request)
    try:
        pipeline = [
            {"$match": {"type": {"$exists": True, "$ne": ""}}},
            {"$group": {"_id": "$type", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ]
        results = list(things_collection.aggregate(pipeline))
        return [{"type": r["_id"], "count": r["count"]} for r in results if r["_id"]]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur stats by-type: {e}")


@stats_router.get("/admin/stats/by-status")
def get_stats_by_status(request: Request):
    _require_authenticated_user(request)
    try:
        items = list(things_collection.find({}, {"status": 1, "availability": 1, "maintenance_state": 1}))
        status_counts = {"active": 0, "inactive": 0, "en_utilisation": 0, "panne": 0, "autre": 0}
        
        for item in items:
            raw_status = item.get("status") or item.get("availability") or ""
            if item.get("maintenance_state"):
                status_counts["panne"] += 1
            else:
                normalized = _normalize_status(raw_status)
                status_counts[normalized] += 1
        
        return [{"status": k, "count": v} for k, v in status_counts.items() if v > 0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur stats by-status: {e}")


@stats_router.get("/admin/stats/top-viewed")
def get_top_viewed(request: Request, limit: int = 10):
    _require_authenticated_user(request)
    try:
        results = list(
            things_collection.find(
                {"view_count": {"$exists": True, "$gt": 0}}
            ).sort("view_count", -1).limit(limit)
        )
        return [
            {
                "id": str(r.get("id", "")),
                "name": r.get("name", "Sans nom"),
                "type": r.get("type", "Inconnu"),
                "view_count": r.get("view_count", 0)
            }
            for r in results
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur stats top-viewed: {e}")


@stats_router.get("/admin/stats/top-reported")
def get_top_reported(request: Request, limit: int = 10):
    _require_authenticated_user(request)
    try:
        reports = list(
            user_history_collection.find(
                {"action": "SIGNALEMENT_OBJET"},
                {
                    "thing_id": 1,
                    "thing_name": 1,
                    "status": 1,
                    "decision": 1,
                },
            )
        )

        thing_ids = [
            str(report.get("thing_id") or "").strip()
            for report in reports
            if str(report.get("thing_id") or "").strip()
        ]
        thing_state_map = _build_thing_state_map(thing_ids)

        counts: dict[str, dict[str, Any]] = {}
        for report in reports:
            thing_id = str(report.get("thing_id") or "").strip()
            if not thing_id:
                continue

            decision = str(report.get("decision") or "").strip().lower()
            status = str(report.get("status") or "").strip()
            if decision in {"reject", "reactivate"} or _is_closed_report_status(status):
                continue

            thing_state = thing_state_map.get(thing_id)
            if decision == "accept" and thing_state and not _thing_is_still_reported(thing_state):
                continue

            bucket = counts.setdefault(
                thing_id,
                {
                    "thing_id": thing_id,
                    "thing_name": str(report.get("thing_name") or "").strip(),
                    "count": 0,
                },
            )
            bucket["count"] += 1

            if not bucket["thing_name"] and thing_state:
                bucket["thing_name"] = str(thing_state.get("name") or "").strip()

        ranked = sorted(
            counts.values(),
            key=lambda item: (-int(item.get("count", 0) or 0), str(item.get("thing_name") or "").lower(), str(item.get("thing_id") or "")),
        )

        return [
            {
                "thing_id": item["thing_id"],
                "thing_name": item.get("thing_name") or "Objet",
                "count": int(item.get("count", 0) or 0),
            }
            for item in ranked[:limit]
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur stats top-reported: {e}")


@stats_router.get("/admin/stats/borrow-stats")
def get_borrow_stats(request: Request):
    _require_authenticated_user(request)
    try:
        # Emprunts en cours
        current_borrows = things_collection.count_documents({
            "current_borrow": {"$exists": True, "$ne": None}
        })
        
        # Total emprunts historiques (depuis l'historique utilisateur)
        borrow_history = user_history_collection.count_documents({
            "action": {"$regex": "emprunt|borrow|take", "$options": "i"}
        })
        
        # Objets retournÃ©s (on compte les actions de retour)
        returned_count = user_history_collection.count_documents({
            "action": {"$regex": "retour|return|release", "$options": "i"}
        })
        
        return {
            "current": current_borrows,
            "total_history": borrow_history,
            "returned": returned_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur stats borrow: {e}")


@stats_router.get("/admin/stats/recent-activity")
def get_recent_activity(request: Request, limit: int = 20):
    _require_authenticated_user(request)
    try:
        results = list(
            user_history_collection.find()
            .sort("created_at", -1)
            .limit(limit)
        )
        return [
            {
                "id": str(r.get("_id", "")),
                "action": r.get("action", ""),
                "detail": r.get("detail", ""),
                "status": r.get("status", ""),
                "email": r.get("email", ""),
                "created_at": str(r.get("created_at", ""))
            }
            for r in results
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur stats recent-activity: {e}")


@stats_router.get("/admin/stats/notifications-count")
def get_admin_notifications_count(request: Request):
    _require_authenticated_user(request)
    try:
        unread = notifications_collection.count_documents({
            "notif_type": "warning",
            "$or": [
                {"is_read": False},
                {"is_read": {"$exists": False}}
            ]
        })
        return {"unread": unread}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur notifications count: {e}")


@stats_router.get("/admin/stats/app-usage-daily")
def get_app_usage_daily(request: Request, days: int = 7):
    _require_authenticated_user(request)
    try:
        safe_days = max(3, min(int(days or 7), 30))
        now_utc = datetime.now(timezone.utc)
        today = now_utc.date()
        start_date = today - timedelta(days=safe_days - 1)

        date_labels = [
            (start_date + timedelta(days=offset)).isoformat()
            for offset in range(safe_days)
        ]
        users_counts = {label: 0 for label in date_labels}
        admins_counts = {label: 0 for label in date_labels}

        scan_start = datetime.combine(start_date, datetime.min.time(), tzinfo=timezone.utc).isoformat()
        rows = list(
            user_history_collection.find(
                {
                    "created_at": {"$gte": scan_start},
                    "action": {"$regex": "connexion|session", "$options": "i"},
                },
                {"created_at": 1, "action": 1, "user_id": 1, "email": 1},
            )
        )

        user_ids = [str(row.get("user_id") or "").strip() for row in rows if str(row.get("user_id") or "").strip()]
        role_map: dict[str, str] = {}
        if user_ids:
            profile_rows = list(
                db.utilisateur.find(
                    {"id": {"$in": list(dict.fromkeys(user_ids))}},
                    {"id": 1, "role": 1},
                )
            )
            role_map = {
                str(row.get("id") or "").strip(): str(row.get("role") or "user").strip().lower() or "user"
                for row in profile_rows
                if str(row.get("id") or "").strip()
            }

        for row in rows:
            dt = _parse_created_at_iso(str(row.get("created_at") or ""))
            if dt is None:
                continue

            d = dt.date()
            if d < start_date or d > today:
                continue

            key = d.isoformat()
            action = _normalize_history_action(str(row.get("action") or ""))
            user_role = role_map.get(str(row.get("user_id") or "").strip(), "user")
            if action not in {"connexion", "session"}:
                continue

            if user_role == "admin" or str(row.get("action") or "").lower().startswith("admin -"):
                admins_counts[key] += 1
            else:
                users_counts[key] += 1

        users = [users_counts[label] for label in date_labels]
        admins = [admins_counts[label] for label in date_labels]
        totals = [users[i] + admins[i] for i in range(len(date_labels))]

        average_daily = (sum(totals) / len(totals)) if totals else 0.0
        peak_daily = max(totals) if totals else 0
        load_level = "normal"
        if average_daily >= 120 or peak_daily >= 180:
            load_level = "critical"
        elif average_daily >= 70 or peak_daily >= 110:
            load_level = "high"

        return {
            "labels": date_labels,
            "users": users,
            "admins": admins,
            "totals": totals,
            "total_connections": int(sum(totals)),
            "average_daily": round(average_daily, 2),
            "peak_daily": int(peak_daily),
            "load_level": load_level,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur stats app usage daily: {e}")