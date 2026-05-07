from backend.base import things_collection
from backend.routers.main_localisation import canonical_room_name, coords_from_room


def normalize_rooms_once() -> int:
    rows = list(things_collection.find({}))
    updated = 0

    for row in rows:
        loc = row.get("location") if isinstance(row.get("location"), dict) else {}
        raw = str(loc.get("room") or loc.get("name") or "").strip()
        if not raw:
            continue

        canonical = canonical_room_name(raw)
        coords = coords_from_room(canonical)
        needs_update = (
            str(loc.get("room") or "").strip() != canonical
            or str(loc.get("name") or "").strip() != canonical
            or float(loc.get("x", 0.0) or 0.0) != float(coords["x"])
            or float(loc.get("y", 0.0) or 0.0) != float(coords["y"])
            or float(loc.get("z", 0.0) or 0.0) != float(coords["z"])
        )

        if not needs_update:
            continue

        new_loc = dict(loc)
        new_loc["room"] = canonical
        new_loc["name"] = canonical
        if (coords["x"], coords["y"], coords["z"]) != (0.0, 0.0, 0.0):
            new_loc["x"] = coords["x"]
            new_loc["y"] = coords["y"]
            new_loc["z"] = coords["z"]

        things_collection.update_one(
            {"_id": row.get("_id")},
            {"$set": {"location": new_loc}},
        )
        updated += 1

    return updated


if __name__ == "__main__":
    count = normalize_rooms_once()
    print(f"normalized_rooms_updated={count}")
