import re
import sys
import unicodedata
import uuid

from fastapi import APIRouter, Body, HTTPException, Request
from pydantic import BaseModel, Field

from ..base import keyword_index_collection, things_collection
from .main_auth import require_admin
from .main_localisation import canonical_room_name as _canonical_room_name, coords_from_room as _coords_from_room
from ..notifications_service import create_notification

crud_router = APIRouter(tags=["crud"])


class AddThingRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    type: str = Field(..., min_length=1, max_length=80)
    location: str = Field(..., min_length=1, max_length=120)
    description: str = Field(default="", max_length=800)
    status: str = Field(default="active", max_length=40)
    endpoint_url: str = Field(default="", max_length=300)


class UpdateThingRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    type: str = Field(..., min_length=1, max_length=80)
    location: str = Field(..., min_length=1, max_length=120)
    description: str = Field(default="", max_length=800)
    status: str = Field(default="active", max_length=40)
    endpoint_url: str = Field(default="", max_length=300)


def _main_module():
    return sys.modules.get("main")


def _things_collection():
    module = _main_module()
    return getattr(module, "things_collection", things_collection) if module else things_collection


def _index_collection():
    module = _main_module()
    if module is not None:
        return getattr(module, "index_mot_cle_collection", getattr(module, "keyword_index_collection", keyword_index_collection))
    return keyword_index_collection


def _normalize_text(text: str) -> str:
    if not text:
        return ""
    text = text.lower().strip()
    text = unicodedata.normalize("NFD", text)
    text = "".join(ch for ch in text if unicodedata.category(ch) != "Mn")
    return text


def _canonical_availability(status: str) -> str:
    s = _normalize_text(status)
    if s in {"active", "disponible", "in-stock", "instock"}:
        return "disponible"
    if s in {"en_utilisation", "en utilisation", "borrowed"}:
        return "en_utilisation"
    return "indisponible"


def _status_clears_maintenance_state(status: str) -> bool:
    return _normalize_text(status) in {
        "active",
        "disponible",
        "in-stock",
        "instock",
        "en_utilisation",
        "en utilisation",
        "borrowed",
    }


def _clean_endpoint_url(endpoint_url: str) -> str:
    clean = str(endpoint_url or "").strip()
    if not clean:
        return ""
    if not re.match(r"^https?://", clean, flags=re.IGNORECASE):
        raise HTTPException(status_code=400, detail="Endpoint reseau invalide")
    return clean.rstrip("/")


def _is_tv_type(thing_type: str) -> bool:
    normalized = _normalize_text(thing_type)
    return bool(re.search(r"\b(tv|smart\s*tv|television|televiseur)\b", normalized))


def _build_remote_control(endpoint_url: str, thing_type: str = "") -> dict | None:
    endpoint = _clean_endpoint_url(endpoint_url)
    if not endpoint:
        return None

    if _is_tv_type(thing_type):
        actions = {
            "play": {"method": "POST", "href": f"{endpoint}/play"},
            "next": {"method": "POST", "href": f"{endpoint}/next"},
            "prev": {"method": "POST", "href": f"{endpoint}/prev"},
            "volume-up": {"method": "POST", "href": f"{endpoint}/volume-up"},
            "volume-down": {"method": "POST", "href": f"{endpoint}/volume-down"},
            "mute": {"method": "POST", "href": f"{endpoint}/mute"},
            "channels": {"method": "GET", "href": f"{endpoint}/channels"},
            "status": {"method": "GET", "href": f"{endpoint}/status"},
        }
    else:
        on_href = f"{endpoint}/actions/on"
        off_href = f"{endpoint}/actions/off"
        actions = {
            "on": {"method": "POST", "href": on_href},
            "off": {"method": "POST", "href": off_href},
        }

    return {
        "@type": "EntryPoint",
        "name": "REST Control",
        "protocol": "REST",
        "contentType": "application/json",
        "endpoint": endpoint,
        "health": f"{endpoint}/health",
        "actions": actions,
    }


def _build_potential_actions(endpoint_url: str, thing_type: str = "") -> list[dict]:
    endpoint = _clean_endpoint_url(endpoint_url)
    if not endpoint:
        return []

    if _is_tv_type(thing_type):
        return [
            {
                "@type": "ControlAction",
                "name": "play",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": f"{endpoint}/play",
                    "httpMethod": "POST",
                    "contentType": "application/json",
                },
            },
            {
                "@type": "ControlAction",
                "name": "next",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": f"{endpoint}/next",
                    "httpMethod": "POST",
                    "contentType": "application/json",
                },
            },
            {
                "@type": "ControlAction",
                "name": "prev",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": f"{endpoint}/prev",
                    "httpMethod": "POST",
                    "contentType": "application/json",
                },
            },
            {
                "@type": "ControlAction",
                "name": "volume-up",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": f"{endpoint}/volume-up",
                    "httpMethod": "POST",
                    "contentType": "application/json",
                },
            },
            {
                "@type": "ControlAction",
                "name": "volume-down",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": f"{endpoint}/volume-down",
                    "httpMethod": "POST",
                    "contentType": "application/json",
                },
            },
            {
                "@type": "ControlAction",
                "name": "mute",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": f"{endpoint}/mute",
                    "httpMethod": "POST",
                    "contentType": "application/json",
                },
            },
            {
                "@type": "ControlAction",
                "name": "channels",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": f"{endpoint}/channels",
                    "httpMethod": "GET",
                    "contentType": "application/json",
                },
            },
            {
                "@type": "ControlAction",
                "name": "status",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": f"{endpoint}/status",
                    "httpMethod": "GET",
                    "contentType": "application/json",
                },
            },
        ]

    return [
        {
            "@type": "ActivateAction",
            "name": "on",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": f"{endpoint}/actions/on",
                "httpMethod": "POST",
                "contentType": "application/json",
            },
        },
        {
            "@type": "DeactivateAction",
            "name": "off",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": f"{endpoint}/actions/off",
                "httpMethod": "POST",
                "contentType": "application/json",
            },
        },
    ]


def _to_index_id(thing_id: str) -> int:
    try:
        return int((thing_id or "").replace("-", "")[:8], 16)
    except Exception:
        return 0


def _extract_keywords(text: str) -> list[str]:
    norm = _normalize_text(text)
    return re.findall(r"[a-z0-9]+", norm)


def _find_thing_with_same_name(name: str, exclude_id: str = "") -> dict | None:
    target_name = _normalize_text(name)
    if not target_name:
        return None

    safe_exclude_id = str(exclude_id or "").strip()
    for item in _things_collection().find({}, {"id": 1, "name": 1, "search_name_norm": 1}):
        if not isinstance(item, dict):
            continue

        current_id = str(item.get("id") or "").strip()
        if safe_exclude_id and current_id == safe_exclude_id:
            continue

        current_name = str(item.get("search_name_norm") or "").strip() or _normalize_text(str(item.get("name") or ""))
        if current_name == target_name:
            return item

    return None


def _build_keyword_docs(item: dict) -> list[dict]:
    thing_id = str(item.get("id", "")).strip()
    fields = [
        ("TITRE", 3, item.get("name", "")),
        ("TYPE", 2, item.get("type", "")),
        ("DESCRIPTION", 1, item.get("description", "")),
        ("SALLE", 2, (item.get("location") or {}).get("room", "") if isinstance(item.get("location"), dict) else ""),
    ]

    frequency: dict[tuple[str, str], int] = {}
    for source, weight, text in fields:
        for token in _extract_keywords(str(text or "")):
            key = (token, source)
            frequency[key] = frequency.get(key, 0) + 1

    docs = []
    for (token, source), freq in frequency.items():
        docs.append(
            {
                "mot": token,
                "thingId": thing_id,
                "poids": 3 if source == "TITRE" else (2 if source in {"TYPE", "SALLE"} else 1),
                "source": source,
                "frequence": max(1, int(freq)),
            }
        )
    return docs


def _reindex_thing(item: dict) -> None:
    thing_id = str(item.get("id", "")).strip()
    if not thing_id:
        return
    index_collection = _index_collection()
    index_collection.delete_many({"thingId": thing_id})
    docs = _build_keyword_docs(item)
    if docs:
        index_collection.insert_many(docs)


@crud_router.post("/things/add")
def add_thing(request: Request, data: AddThingRequest = Body(...)):
    require_admin(request)
    try:
        duplicate = _find_thing_with_same_name(data.name)
        if duplicate:
            duplicate_name = str(duplicate.get("name") or data.name).strip()
            raise HTTPException(status_code=409, detail=f"Un objet avec le nom '{duplicate_name}' existe deja.")

        location_room = _canonical_room_name(data.location.strip())
        coords = _coords_from_room(location_room)
        availability = _canonical_availability(data.status)
        remote_control = _build_remote_control(data.endpoint_url, data.type)
        potential_actions = _build_potential_actions(data.endpoint_url, data.type)

        new_item = {
            "@context": "https://schema.org",
            "@type": "Product",
            "id": str(uuid.uuid4())[:8],
            "name": data.name,
            "search_name_norm": _normalize_text(data.name),
            "type": data.type,
            "description": data.description,
            "status": data.status,
            "availability": availability,
            "view_count": 0,
            "location": {
                "@type": "Place",
                "name": location_room,
                "room": location_room,
                "x": coords["x"],
                "y": coords["y"],
                "z": coords["z"],
            },
        }

        if remote_control:
            new_item["control"] = remote_control
            new_item["device_state"] = {
                "power": "off",
                "last_action_at": "",
                "reachable": True,
            }
            if potential_actions:
                new_item["potentialAction"] = potential_actions

        _things_collection().insert_one(new_item)
        _reindex_thing(new_item)
        create_notification(
            target_role="admin",
            title="Objet ajoute",
            message=f"Objet ajoute: {new_item['name']} ({new_item['id']}).",
            notif_type="success",
            metadata={"thing_id": new_item["id"], "action": "add"},
        )
        return {"message": "Succes", "id": new_item["id"]}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erreur add: {e}")
        raise HTTPException(status_code=500, detail="Impossible d'ajouter l'objet.")


@crud_router.get("/things/{thing_id}")
def get_thing(thing_id: str):
    try:
        thing = _things_collection().find_one({"id": thing_id})
        if not thing:
            raise HTTPException(status_code=404, detail="Objet non trouvé")

        thing["id"] = str(thing.get("id", thing_id))
        if "_id" in thing:
            thing["_id"] = str(thing["_id"])

        loc = thing.get("location") if isinstance(thing.get("location"), dict) else {}
        room_raw = str(loc.get("room") or loc.get("name") or "").strip()
        if room_raw:
            room_canonical = _canonical_room_name(room_raw)
            coords = _coords_from_room(room_canonical)
            loc["room"] = room_canonical
            loc["name"] = room_canonical
            if (coords["x"], coords["y"], coords["z"]) != (0.0, 0.0, 0.0):
                loc["x"] = coords["x"]
                loc["y"] = coords["y"]
                loc["z"] = coords["z"]
            thing["location"] = loc

        return thing
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erreur get thing: {e}")
        raise HTTPException(status_code=500, detail="Impossible de recuperer l'objet.")


@crud_router.patch("/things/{thing_id}/status")
def update_thing_status(thing_id: str, data: dict = Body(...)):
    """Met à jour le statut et la disponibilité d'un objet."""
    try:
        new_status = data.get("status", "").strip()
        if not new_status:
            raise HTTPException(status_code=400, detail="Status requis")

        maintenance_state = str(data.get("maintenance_state", "") or "").strip()
        things = _things_collection()

        update_fields = {
            "status": new_status,
            "availability": _canonical_availability(new_status)
        }
        if maintenance_state:
            update_fields["maintenance_state"] = maintenance_state
        elif _status_clears_maintenance_state(new_status):
            update_fields["maintenance_state"] = ""

        # Mettre à jour le statut et la disponibilité
        result = things.find_one_and_update(
            {"id": thing_id},
            {
                "$set": update_fields
            },
            return_document=True
        )

        if not result:
            raise HTTPException(status_code=404, detail=f"Objet '{thing_id}' non trouvé")

        # Réindexer après modification
        _reindex_thing(result)
        create_notification(
            target_role="admin",
            title="Statut objet modifie",
            message=f"Statut de {result.get('name', thing_id)} change en {new_status}.",
            notif_type="info",
            metadata={"thing_id": thing_id, "action": "status", "status": new_status},
        )
        
        return {
            "success": True,
            "message": f"Statut changé en '{new_status}'",
            "thing": {
                "id": result.get("id"),
                "name": result.get("name"),
                "status": result.get("status"),
                "availability": result.get("availability"),
                "maintenance_state": result.get("maintenance_state", "")
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erreur update status: {e}")
        raise HTTPException(status_code=500, detail="Impossible de mettre a jour le statut de l'objet.")


@crud_router.put("/things/{thing_id}")
def update_thing(thing_id: str, request: Request, data: UpdateThingRequest = Body(...)):
    require_admin(request)
    try:
        things = _things_collection()
        existing = things.find_one({"id": thing_id})
        if not existing:
            raise HTTPException(status_code=404, detail="Objet non trouvé")

        location_room = _canonical_room_name(data.location.strip())
        coords = _coords_from_room(location_room)
        availability = _canonical_availability(data.status)
        remote_control = _build_remote_control(data.endpoint_url, data.type)
        potential_actions = _build_potential_actions(data.endpoint_url, data.type)

        updated_fields = {
            "name": data.name,
            "search_name_norm": _normalize_text(data.name),
            "type": data.type,
            "description": data.description,
            "status": data.status,
            "availability": availability,
            "location": {
                "@type": "Place",
                "name": location_room,
                "room": location_room,
                "x": coords["x"],
                "y": coords["y"],
                "z": coords["z"],
            },
        }

        existing_maintenance_state = str(existing.get("maintenance_state") or "").strip()
        if _status_clears_maintenance_state(data.status):
            updated_fields["maintenance_state"] = ""
        elif existing_maintenance_state:
            updated_fields["maintenance_state"] = existing_maintenance_state

        unset_fields = {}
        if remote_control:
            previous_state = existing.get("device_state") if isinstance(existing.get("device_state"), dict) else {}
            updated_fields["control"] = remote_control
            updated_fields["device_state"] = {
                "power": str(previous_state.get("power") or "off").lower() == "on" and "on" or "off",
                "last_action_at": str(previous_state.get("last_action_at") or ""),
                "reachable": bool(previous_state.get("reachable", True)),
            }
            if potential_actions:
                updated_fields["potentialAction"] = potential_actions
        else:
            unset_fields["control"] = ""
            unset_fields["device_state"] = ""
            unset_fields["potentialAction"] = ""

        update_doc = {"$set": updated_fields}
        if unset_fields:
            update_doc["$unset"] = unset_fields

        thing = things.find_one_and_update(
            {"id": thing_id},
            update_doc,
            return_document=True,
        )

        thing["id"] = thing_id
        if "_id" in thing:
            thing["_id"] = str(thing["_id"])
        _reindex_thing(thing)
        create_notification(
            target_role="admin",
            title="Objet modifie",
            message=f"Objet modifie: {thing.get('name', thing_id)} ({thing_id}).",
            notif_type="info",
            metadata={"thing_id": thing_id, "action": "update"},
        )
        return {"success": True, "message": "Objet modifié", "thing": thing}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Erreur update thing: {e}")
        raise HTTPException(status_code=500, detail="Impossible de modifier l'objet.")


def _cleanup_orphan_keywords() -> int:
    """Supprime tous les mots-clés orphelins (dont le thingId n'existe plus)."""
    things = _things_collection()
    index_collection = _index_collection()
    
    # Récupérer tous les thingId uniques dans keyword_index
    orphan_thing_ids = []
    try:
        all_keyword_thing_ids = list(index_collection.distinct("thingId"))
        
        # Pour chaque thingId, vérifier s'il existe dans things
        for thing_id in all_keyword_thing_ids:
            if not things.find_one({"id": str(thing_id).strip()}):
                orphan_thing_ids.append(str(thing_id).strip())
        
        # Supprimer tous les mots-clés orphelins
        if orphan_thing_ids:
            result = index_collection.delete_many({"thingId": {"$in": orphan_thing_ids}})
            return result.deleted_count
    except Exception as e:
        print(f"Erreur cleanup keywords: {e}")
    
    return 0


@crud_router.delete("/things/{thing_id}")
def delete_thing(thing_id: str, request: Request):
    require_admin(request)
    things = _things_collection()
    thing_id_clean = str(thing_id).strip()
    
    if things.delete_one({"id": thing_id_clean}).deleted_count == 0:
        raise HTTPException(status_code=404, detail="Non trouve")
    
    # Supprimer tous les mots-clés associés à cet objet
    index_collection = _index_collection()
    deleted_keywords = index_collection.delete_many({"thingId": thing_id_clean}).deleted_count
    
    # Nettoyer aussi les mots-clés orphelins si besoin
    orphain_count = _cleanup_orphan_keywords()
    
    create_notification(
        target_role="admin",
        title="Objet supprime",
        message=f"Objet supprime: {thing_id}. {deleted_keywords} mots-cles supprimes.",
        notif_type="warning",
        metadata={"thing_id": thing_id, "action": "delete", "keywords_deleted": deleted_keywords, "orphans_cleaned": orphain_count},
    )
    return {"success": True, "keywords_deleted": deleted_keywords, "orphans_cleaned": orphain_count}


@crud_router.post("/maintenance/cleanup-orphan-keywords")
def cleanup_orphan_keywords_endpoint(request: Request):
    """Endpoint de maintenance pour nettoyer les mots-clés orphelins."""
    require_admin(request)
    
    cleaned_count = _cleanup_orphan_keywords()
    
    create_notification(
        target_role="admin",
        title="Maintenance: Nettoyage des mots-clés",
        message=f"{cleaned_count} mots-clés orphelins supprimes.",
        notif_type="info",
        metadata={"action": "cleanup_keywords", "count": cleaned_count},
    )
    
    return {"success": True, "orphan_keywords_deleted": cleaned_count}