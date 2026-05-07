from fastapi import APIRouter, Body, HTTPException
from pydantic import BaseModel
from rapidfuzz import fuzz, process
import math
import re

from ..base import keyword_index_collection, things_collection
from .main_borrow import expire_due_borrows
from .main_localisation import ARCHI_DATA, canonical_room_name, compute_distance_and_room_flags, normalize_text

recherche_router = APIRouter(tags=["recherche"])


class SearchRequest(BaseModel):
    search_query: str = ""
    user_x: float = 0
    user_y: float = 0
    user_z: float = 0
    user_room: str = ""


SYNONYM_GROUPS = [
    {"light", "lights", "lamp", "lampe", "luminaire", "ampoule", "eclairage", "lighting", "lumiere", "led", "spot", "neon", "plafonnier"},
    {"switchlight", "variateur", "dimmer", "interrupteur", "interrupteur_lumiere", "lightswitch"},
    {"smartplug", "prise", "priseconnectee", "outlet", "socket", "plug", "powerplug", "smart_socket"},
    {"powerstrip", "multiprise", "pdu", "rackpdu", "distribution", "powerbar"},
    {"printer", "imprimante", "imprim", "print", "imprimante3d", "print3d", "laserjet", "inkjet"},
    {"scanner", "scan", "numeriseur", "scaner", "scannerdoc"},
    {"copier", "photocopieur", "photocopie", "xerox", "multifonction", "mfp"},
    {"projector", "projecteur", "videoprojecteur", "beamer", "projo"},
    {"screen", "ecranprojection", "projector_screen", "toile", "canvas"},
    {"tv", "tele", "televiseur", "television", "smarttv", "ecran", "screen", "display"},
    {"monitor", "moniteur", "display", "ecranpc", "desktopmonitor"},
    {"whiteboard", "tableau", "smartboard", "interactiveboard", "tableauinteractif"},
    {"speaker", "hautparleur", "enceinte", "audio", "soundbar", "sono"},
    {"microphone", "mic", "micro", "conference_mic", "speakerphone"},
    {"headset", "casque", "ecouteur", "earbuds", "headphone"},
    {"cam", "camera", "webcam", "surveillance", "cctv", "ipcam", "ptz", "videocam"},
    {"doorcam", "interphonevideo", "videophone", "visiophone", "doorbellcam"},
    {"intercom", "interphone", "combinetelephonique", "talkback"},
    {"phone", "telephone", "tel", "ipphone", "voip", "deskphone", "handset"},
    {"tablet", "tablette", "ipad", "androidtablet", "slate"},
    {"laptop", "pcportable", "notebook", "ultrabook", "portable"},
    {"desktop", "pcfixe", "workstation", "ordinateur", "computer", "poste"},
    {"keyboard", "clavier", "keypad"},
    {"mouse", "souris", "trackpad", "pointer"},
    {"dock", "dockingstation", "stationaccueil", "dockusb", "usb_c_dock"},
    {"router", "routeur", "gateway", "box", "internetbox"},
    {"switch", "commutateur", "switchreseau", "lan_switch", "ethernetswitch"},
    {"accesspoint", "ap", "wifi", "bornewifi", "wifiap", "hotspot"},
    {"modem", "fibermodem", "adslmodem", "fai"},
    {"firewall", "parefeu", "utm", "securitygateway"},
    {"server", "serveur", "rackserver", "blade", "node"},
    {"nas", "stockage", "storageserver", "filer", "fileserver"},
    {"ups", "onduleur", "batterybackup", "alimentationsecours"},
    {"sensor", "capteur", "detecteur", "detector", "probe", "sonde"},
    {"motionsensor", "detecteurmouvement", "pir", "presence", "occupancy"},
    {"doorsensor", "fenetresensor", "contactsensor", "reed", "magnetique"},
    {"tempsensor", "temperature", "thermometer", "thermique", "temp"},
    {"humidity", "humidite", "hygrometre", "humid", "rh"},
    {"co2", "carbon", "carbon_dioxide", "qualiteair", "airquality"},
    {"smoke", "fumee", "smokedetector", "firealarm", "alarmeincendie"},
    {"leak", "fuite", "waterleak", "inondation", "floodsensor"},
    {"noise", "soundlevel", "decibel", "dbmeter", "bruit"},
    {"vibration", "vibrationsensor", "shock", "impact"},
    {"pressure", "pression", "barometre", "pressuresensor"},
    {"meter", "compteur", "energy_meter", "powermeter", "smartmeter"},
    {"thermostat", "thermostatconnecte", "temperaturecontrol", "setpoint"},
    {"hvac", "cvc", "clim", "climatisation", "climate", "ventilation", "airhandling"},
    {"ac", "airconditioner", "climatiseur", "aircon"},
    {"heater", "chauffage", "radiateur", "boiler", "chaudiere"},
    {"fan", "ventilateur", "extracteur", "soufflage"},
    {"airpurifier", "purificateur", "filtration", "hepa"},
    {"humidifier", "humidificateur", "brumisateur"},
    {"dehumidifier", "deshumidificateur", "dryair"},
    {"blind", "store", "volet", "rideau", "curtain", "shutter"},
    {"door", "porte", "entrance", "accessdoor"},
    {"lock", "serrure", "smartlock", "doorlock", "verrou", "badge"},
    {"reader", "badgeuse", "rfid", "nfc", "cardreader", "controleacces"},
    {"turnstile", "tourniquet", "portique", "gate", "barriere"},
    {"elevator", "ascenseur", "lift", "montecharges"},
    {"escalator", "escaliermecanique", "movingstairs"},
    {"coffee", "cafe", "cafes", "cafeteria", "cafetiere", "espresso", "nespresso", "percolateur", "coffeehouse", "barista"},
    {"machine", "maker", "coffeemaker", "coffeemachine", "cafemachine", "distributeur", "dispenser", "vending"},
    {"fridge", "refrigerateur", "refrigeration", "cooler", "minibar"},
    {"microwave", "microondes", "fourmicroonde", "microwaveoven"},
    {"dishwasher", "lavevaisselle", "dish_washer"},
    {"washingmachine", "lavelinge", "washer"},
    {"dryer", "sechelinge", "dryer_machine"},
    {"robot", "robotcleaner", "roomba", "aspirateurrobot", "agv"},
    {"drone", "uav", "quadcopter", "multirotor"},
    {"electromenager", "electro", "menager", "electro-menager", "appliance", "device"},
]

PHRASE_TO_INTENT = {
    "machine a cafe": "coffee_machine",
    "machine cafe": "coffee_machine",
    "coffee machine": "coffee_machine",
    "coffee maker": "coffee_machine",
    "coffee maker pro": "coffee_machine",
    "cafetiere expresso": "coffee_machine",
    "cafetiere espresso": "coffee_machine",
    "machine expresso": "coffee_machine",
    "machine espresso": "coffee_machine",
    "smart tv": "television",
    "ecran tv": "television",
    "video projector": "projector",
}

INTENT_PATTERNS = {
    "coffee_machine": [
        "machine a cafe",
        "machine cafe",
        "coffee machine",
        "coffee maker",
        "coffee maker pro",
        "cafetiere",
        "coffeemaker",
        "coffeemachine",
        "espresso machine",
    ],
    "television": ["tv", "tele", "televiseur", "television", "smart tv"],
    "projector": ["projecteur", "videoprojecteur", "projector", "beamer"],
}

TOKEN_TYPO_CORRECTIONS = {
    "cofee": "coffee",
    "coffe": "coffee",
    "cofffee": "coffee",
    "caffee": "cafe",
    "cafetier": "cafetiere",
    "cafetere": "cafetiere",
    "televsion": "television",
    "televion": "television",
    "telvision": "television",
    "lamppe": "lampe",
    "projeteur": "projecteur",
    "imprimate": "imprimante",
}


def _build_synonym_map() -> dict[str, set[str]]:
    synonym_map: dict[str, set[str]] = {}
    for group in SYNONYM_GROUPS:
        normalized_group = {normalize_text(term) for term in group if normalize_text(term)}
        for term in normalized_group:
            synonym_map.setdefault(term, set()).update(normalized_group)
    return synonym_map


SYNONYM_MAP = _build_synonym_map()

STATUS_VALUES = ["active", "inactive", "disponible", "en_utilisation", "indisponible", "hors-ligne", "hors ligne"]

TERM_VOCAB = sorted(
    set(SYNONYM_MAP.keys())
    | {normalize_text(x) for x in STATUS_VALUES}
    | {"coffee", "cafe", "machine", "cafetiere", "television", "projecteur", "imprimante"}
)

SHORT_TOKEN_SYNONYM_WHITELIST = {
    "tv", "cam", "nas", "ups", "ap", "rfid", "nfc", "co2", "ac", "cvc", "led", "mic", "pir"
}

FLOOR_BY_ROOM_NORM = {
    normalize_text(room): int(floor.get("id", -1))
    for floor in ARCHI_DATA
    for room in (floor.get("rooms") or [])
    if normalize_text(room)
}


def _tokenize_query(text: str) -> list[str]:
    # Tokenization robuste: retire ponctuation/accents et conserve uniquement les mots utiles.
    return [tok for tok in re.findall(r"[a-z0-9]+", normalize_text(text)) if len(tok) >= 2]


def _correct_token(token: str) -> str:
    fixed = TOKEN_TYPO_CORRECTIONS.get(token, token)
    if fixed != token:
        return fixed

    if len(token) < 4:
        return token

    best = process.extractOne(token, TERM_VOCAB, scorer=fuzz.ratio)
    if not best:
        return token

    candidate, score, _ = best
    return candidate if score >= 88 else token


def _normalize_phrase(text: str) -> str:
    return " ".join(_tokenize_query(text))


def _token_set(text: str) -> set[str]:
    return set(_tokenize_query(text))


def _extract_floor_query(raw_query: str) -> int | None:
    q_norm = normalize_text(raw_query)
    if not q_norm:
        return None

    if q_norm.isdigit():
        try:
            return int(q_norm)
        except (TypeError, ValueError):
            return None

    if "rdc" in q_norm or "rez de chaussee" in q_norm or "rez-de-chaussee" in q_norm:
        return 0

    match = re.search(r"(?:etage|etg|niveau|floor)\s*([0-9]{1,2})", q_norm)
    if not match:
        match = re.search(r"([0-9]{1,2})\s*(?:e|eme|er)?\s*(?:etage|etg|niveau|floor)", q_norm)
    if not match:
        return None

    try:
        return int(match.group(1))
    except (TypeError, ValueError):
        return None


def _get_item_floor_id(item: dict) -> int | None:
    loc = item.get("location", "")
    room_value = ""
    floor_raw = ""

    if isinstance(loc, dict):
        room_value = str(loc.get("room") or loc.get("name") or "").strip()
        floor_raw = str(loc.get("etage") or loc.get("floor") or loc.get("level") or "").strip()
    else:
        room_value = str(loc or "").strip()

    if floor_raw:
        floor_norm = normalize_text(floor_raw)
        if "rdc" in floor_norm or "rez de chaussee" in floor_norm or "rez-de-chaussee" in floor_norm:
            return 0
        match = re.search(r"([0-9]{1,2})", floor_norm)
        if match:
            try:
                return int(match.group(1))
            except (TypeError, ValueError):
                pass

    if room_value:
        canonical = canonical_room_name(room_value) or room_value
        floor_id = FLOOR_BY_ROOM_NORM.get(normalize_text(canonical))
        if floor_id is not None and floor_id >= 0:
            return floor_id

    return None


def _floor_matches_filter(floor_id: int | None, raw_query: str, floor_filter: int | None) -> bool:
    if floor_filter is None:
        return True
    if floor_id is None:
        return False

    if floor_filter < 10:
        tail_pattern = rf"(?:etage|etg|niveau|floor)\s*{floor_filter}$"
        if re.search(tail_pattern, normalize_text(raw_query)):
            return str(floor_id).startswith(str(floor_filter))

    return floor_id == floor_filter


def _is_floor_only_query(raw_query: str, floor_filter: int | None) -> bool:
    if floor_filter is None:
        return False
    q_norm = normalize_text(raw_query)
    if not q_norm:
        return False
    if q_norm.isdigit():
        return True
    return bool(re.fullmatch(r"(?:etage|etg|niveau|floor)\s*[0-9]{1,2}", q_norm))


def _pattern_matches_content(pattern: str, content_norm: str, content_tokens: set[str]) -> bool:
    pattern_norm = _normalize_phrase(pattern)
    if not pattern_norm:
        return False

    pattern_tokens = pattern_norm.split()
    if len(pattern_tokens) == 1:
        return pattern_tokens[0] in content_tokens

    return pattern_norm in content_norm


def _extract_query_intents(raw_query: str, expanded_tokens: list[str]) -> set[str]:
    intents: set[str] = set()
    phrase = _normalize_phrase(raw_query)

    for phrase_alias, intent in PHRASE_TO_INTENT.items():
        alias_norm = _normalize_phrase(phrase_alias)
        if alias_norm and alias_norm in phrase:
            intents.add(intent)

    expanded = set(expanded_tokens)
    if ({"coffee", "cafe", "cafetiere", "espresso"} & expanded) and ({"machine", "maker", "coffeemaker", "coffeemachine"} & expanded):
        intents.add("coffee_machine")

    if {"tv", "tele", "televiseur", "television", "smarttv"} & expanded:
        intents.add("television")

    if {"projecteur", "videoprojecteur", "projector", "beamer"} & expanded:
        intents.add("projector")

    return intents


def _intent_hits(content_norm: str, content_tokens: set[str], intents: set[str]) -> int:
    hits = 0
    for intent in intents:
        patterns = INTENT_PATTERNS.get(intent, [])
        if any(_pattern_matches_content(pattern, content_norm, content_tokens) for pattern in patterns):
            hits += 1
    return hits


def _expand_tokens(tokens: list[str]) -> list[str]:
    expanded: list[str] = []
    seen: set[str] = set()
    for token in tokens:
        variants = SYNONYM_MAP.get(token, {token})
        for variant in variants:
            if variant not in seen:
                expanded.append(variant)
                seen.add(variant)
    return expanded


def _expand_tokens_contextual(tokens: list[str]) -> list[str]:
    """Expansion prudente: evite les collisions semantiques sur tokens courts (ex: tele)."""
    expanded: list[str] = []
    seen: set[str] = set()

    for token in tokens:
        # Les tokens courts restent litteraux sauf une whitelist metier explicite.
        if len(token) <= 4 and token not in SHORT_TOKEN_SYNONYM_WHITELIST:
            variants = {token}
        else:
            variants = SYNONYM_MAP.get(token, {token})
        for variant in variants:
            if variant not in seen:
                expanded.append(variant)
                seen.add(variant)

    return expanded


def _collect_lexical_candidates(query_norm: str, tokens: list[str], limit: int = 800) -> list[dict]:
    """Recupere des candidats par matching direct multi-champs, utile pendant la saisie lettre-par-lettre."""
    terms = [t for t in tokens if t]
    if query_norm:
        terms.append(query_norm)

    # Retirer les doublons en conservant l'ordre.
    uniq_terms: list[str] = []
    seen: set[str] = set()
    for t in terms:
        if t not in seen:
            uniq_terms.append(t)
            seen.add(t)

    if not uniq_terms:
        return []

    mongo_or = []
    is_ultra_short = len(query_norm) <= 1
    is_short = len(query_norm) <= 2
    for term in uniq_terms:
        safe = re.escape(term)
        # Pendant la saisie initiale, utiliser des matchs prefixes pour eviter le bruit.
        if is_ultra_short:
            mongo_or.extend([
                {"search_name_norm": {"$regex": f"^{safe}", "$options": "i"}},
                {"name": {"$regex": f"^{safe}", "$options": "i"}},
                {"type": {"$regex": f"^{safe}", "$options": "i"}},
                {"location.room": {"$regex": f"^{safe}", "$options": "i"}},
            ])
        elif is_short:
            mongo_or.extend([
                {"search_name_norm": {"$regex": f"^{safe}", "$options": "i"}},
                {"name": {"$regex": f"^{safe}", "$options": "i"}},
                {"type": {"$regex": safe, "$options": "i"}},
                {"location.room": {"$regex": safe, "$options": "i"}},
                {"description": {"$regex": safe, "$options": "i"}},
            ])
        else:
            mongo_or.extend([
                {"search_name_norm": {"$regex": safe, "$options": "i"}},
                {"name": {"$regex": safe, "$options": "i"}},
                {"type": {"$regex": safe, "$options": "i"}},
                {"description": {"$regex": safe, "$options": "i"}},
                {"location.room": {"$regex": safe, "$options": "i"}},
                {"location": {"$regex": safe, "$options": "i"}},
                {"status": {"$regex": safe, "$options": "i"}},
                {"availability": {"$regex": safe, "$options": "i"}},
            ])

    adaptive_limit = 120 if is_ultra_short else (260 if is_short else limit)
    return list(things_collection.find({"$or": mongo_or}).limit(adaptive_limit))


def _weighted_field_score(item: dict, expanded_tokens: list[str], query_phrase_norm: str) -> int:
    name_norm = normalize_text(item.get("name", ""))
    type_norm = normalize_text(item.get("type", ""))
    desc_norm = normalize_text(item.get("description", ""))
    room_norm = normalize_text((item.get("location") or {}).get("room", "") if isinstance(item.get("location"), dict) else item.get("location", ""))

    name_tokens = _token_set(name_norm)
    type_tokens = _token_set(type_norm)
    desc_tokens = _token_set(desc_norm)
    room_tokens = _token_set(room_norm)

    score = 0

    for token in expanded_tokens:
        if token in name_tokens:
            score += 14
        if token in type_tokens:
            score += 9
        if token in room_tokens:
            score += 7
        if token in desc_tokens:
            score += 3

    if query_phrase_norm and query_phrase_norm in name_norm:
        score += 45
    elif query_phrase_norm and query_phrase_norm in f"{name_norm} {type_norm}":
        score += 20

    return score


def _compute_adaptive_score(
    item: dict,
    *,
    q_norm: str,
    tokens: list[str],
    expanded_tokens: list[str],
    keyword_score: int,
    fuzzy_score: int,
    content_norm: str,
    query_intents: set[str],
) -> int:
    content_tokens = _token_set(content_norm)
    matched_tokens = 0
    for tok in tokens:
        variants = SYNONYM_MAP.get(tok, {tok})
        if any(variant in content_tokens for variant in variants):
            matched_tokens += 1

    token_coverage = matched_tokens / max(1, len(tokens))
    intent_score = _intent_hits(content_norm, content_tokens, query_intents) * 20
    field_score = _weighted_field_score(item, expanded_tokens, q_norm)

    views = max(0, int(item.get("view_count", 0)))
    popularity_score = min(18, int(round(math.log1p(views) * 4)))

    total = (
        int(fuzzy_score)
        + int(keyword_score)
        + int(round(token_coverage * 30))
        + int(intent_score)
        + int(field_score)
        + int(popularity_score)
    )
    return total


def _compute_spatial_bonus(item: dict) -> int:
    """Bonus spatial base sur la proximite: meme salle et distance logique."""
    same_room_bonus = 50 if item.get("same_room") else 0
    distance = float(item.get("distance", 10**9))
    # Bonus decroissant avec la distance, borne pour rester stable.
    distance_bonus = max(0.0, 30.0 - min(distance, 30.0))
    return int(round(same_room_bonus + distance_bonus))


def _has_defined_position(data: SearchRequest) -> bool:
    room = str(data.user_room or "").strip()
    try:
        ux = float(data.user_x)
        uy = float(data.user_y)
        uz = float(data.user_z)
    except Exception:
        ux, uy, uz = 0.0, 0.0, 0.0
    return bool(room) or not (ux == 0.0 and uy == 0.0 and uz == 0.0)


def _prefix_bonus(item: dict, query_norm: str, tokens: list[str]) -> int:
    """Bonus de stabilisation pendant la frappe (requetes prefixes)."""
    if not query_norm:
        return 0

    name_norm = normalize_text(item.get("name", ""))
    type_norm = normalize_text(item.get("type", ""))
    room_norm = normalize_text((item.get("location") or {}).get("room", "") if isinstance(item.get("location"), dict) else item.get("location", ""))
    desc_norm = normalize_text(item.get("description", ""))

    bonus = 0

    # Forte priorite sur prefixe du nom (meilleure stabilite UX).
    if name_norm.startswith(query_norm):
        bonus += 45
    elif f" {query_norm}" in name_norm:
        bonus += 22

    if type_norm.startswith(query_norm):
        bonus += 18
    if room_norm.startswith(query_norm):
        bonus += 12
    if desc_norm.startswith(query_norm):
        bonus += 6

    # Bonus par token prefixe pour les requetes multi-mots.
    for tok in tokens:
        if not tok:
            continue
        if name_norm.startswith(tok):
            bonus += 10
        if type_norm.startswith(tok):
            bonus += 5

    return bonus


def _search_logic(data: SearchRequest) -> list[dict]:
    raw_query = (data.search_query or "").strip()
    position_defined = _has_defined_position(data)
    floor_filter = _extract_floor_query(raw_query)

    if not raw_query:
        results = list(things_collection.find({}).sort("name", 1))
        if position_defined:
            compute_distance_and_room_flags(results, data.user_x, data.user_y, data.user_z, data.user_room)
        else:
            for item in results:
                item["same_room"] = False
                item["distance"] = None

        if position_defined:
            results.sort(key=lambda x: (
                float(x.get("distance", 10**9)) if x.get("distance") is not None else 10**9,
                -int(x.get("view_count", 0)),
                normalize_text(x.get("name", "")),
                str(x.get("id", "")),
            ))
        else:
            results.sort(key=lambda x: (
                0 if x.get("same_room") else 1,
                float(x.get("distance", 10**9)) if x.get("distance") is not None else 10**9,
                -int(x.get("view_count", 0)),
                normalize_text(x.get("name", "")),
                str(x.get("id", "")),
            ))

        for item in results:
            item["_id"] = str(item["_id"])
        return results

    q_norm = normalize_text(raw_query)

    matching_status = [
        s.replace("hors ligne", "hors-ligne")
        for s in STATUS_VALUES
        if normalize_text(s).startswith(q_norm)
    ]

    tokens = _tokenize_query(raw_query)
    if not tokens and q_norm:
        tokens = [q_norm]
    tokens = [_correct_token(tok) for tok in tokens]

    expanded_tokens = _expand_tokens_contextual(tokens)
    query_intents = _extract_query_intents(raw_query, expanded_tokens)
    index_scores = _collect_index_scores(expanded_tokens)

    # Etape A: interroger l'index inverse en premier (noyau principal).
    candidate_ids = list(index_scores.keys())
    candidates = list(things_collection.find({"id": {"$in": candidate_ids}})) if candidate_ids else []

    # Ajout lexical direct (nom/type/salle/description) pour support saisie progressive.
    lexical_candidates = _collect_lexical_candidates(q_norm, tokens)
    if lexical_candidates:
        by_id = {str(item.get("id", "")).strip(): item for item in candidates if str(item.get("id", "")).strip()}
        for item in lexical_candidates:
            item_id = str(item.get("id", "")).strip()
            if item_id:
                by_id[item_id] = item
        candidates = list(by_id.values())

    # Etape B: fallback flou si aucun candidat index.
    if not candidates:
        potential = list(things_collection.find({}).limit(400))
        for item in potential:
            focus = _focus_text(item)
            fuzzy_score = int(fuzz.partial_ratio(q_norm, focus))
            if fuzzy_score >= 80:
                candidates.append(item)

    if floor_filter is not None:
        if not candidates or _is_floor_only_query(raw_query, floor_filter):
            candidates = list(things_collection.find({}))
        candidates = [item for item in candidates if _floor_matches_filter(_get_item_floor_id(item), raw_query, floor_filter)]

    # Etape C: scoreTextuel + bonusSpatial => scoreFinal.
    if position_defined:
        compute_distance_and_room_flags(candidates, data.user_x, data.user_y, data.user_z, data.user_room)
    else:
        for item in candidates:
            item["same_room"] = False
            item["distance"] = None

    for item in candidates:
        item_id = str(item.get("id", "")).strip()
        score_index = int(index_scores.get(item_id, 0))
        score_pertinence = _weighted_field_score(item, expanded_tokens, q_norm)
        content_norm = " ".join(normalize_text(f) for f in _extract_searchable_fields(item))
        content_tokens = _token_set(content_norm)
        intent_bonus = _intent_hits(content_norm, content_tokens, query_intents) * 20
        focus = _focus_text(item)
        fuzzy_score = int(fuzz.partial_ratio(q_norm, focus))
        fuzzy_bonus = int(round(max(0, fuzzy_score - 60) * 0.25))

        status_bonus = 0
        if matching_status:
            item_status = normalize_text(str(item.get("status", item.get("availability", "")))).replace("hors ligne", "hors-ligne")
            if any(item_status == normalize_text(s).replace("hors ligne", "hors-ligne") for s in matching_status):
                status_bonus = 15

        # Bonus lexical direct quand la requete apparait textuellement dans les champs metier.
        fields_norm = [normalize_text(x) for x in _extract_searchable_fields(item)]
        lexical_hit_bonus = 0
        if q_norm and any(q_norm in f for f in fields_norm):
            lexical_hit_bonus += 18
        for tok in tokens:
            if tok and any(tok in f for f in fields_norm):
                lexical_hit_bonus += 4
        prefix_bonus = _prefix_bonus(item, q_norm, tokens)
        score_textuel = score_index + score_pertinence
        score_textuel += lexical_hit_bonus + intent_bonus + status_bonus + fuzzy_bonus + prefix_bonus
        bonus_spatial = _compute_spatial_bonus(item) if position_defined else 0
        item["_score_final"] = int(score_textuel + bonus_spatial)

    # Etape D + E: tri par score final puis tie-break spatial/popularite/nom.
    if position_defined:
        candidates.sort(key=lambda x: (
            float(x.get("distance", 10**9)) if x.get("distance") is not None else 10**9,
            -int(x.get("_score_final", 0)),
            -int(x.get("view_count", 0)),
            normalize_text(x.get("name", "")),
            str(x.get("id", "")),
        ))
    else:
        candidates.sort(key=lambda x: (
            -int(x.get("_score_final", 0)),
            0 if x.get("same_room") else 1,
            float(x.get("distance", 10**9)) if x.get("distance") is not None else 10**9,
            -int(x.get("view_count", 0)),
            normalize_text(x.get("name", "")),
            str(x.get("id", "")),
        ))

    for item in candidates:
        item["_id"] = str(item["_id"])
        item.pop("_score_final", None)

    return candidates


class SearchBenchmarkCase(BaseModel):
    query: str
    expected_ids: list[str]
    user_x: float = 0
    user_y: float = 0
    user_z: float = 0
    user_room: str = ""


class SearchBenchmarkRequest(BaseModel):
    cases: list[SearchBenchmarkCase]
    k: int = 5


@recherche_router.post("/things/search/benchmark")
def benchmark_search(data: SearchBenchmarkRequest = Body(...)):
    """
    Endpoint de metriques formelles (Precision@K, Recall@K, MRR).
    """
    if not data.cases:
        return {
            "precision_at_k": 0.0,
            "recall_at_k": 0.0,
            "mrr_at_k": 0.0,
            "evaluated_cases": 0,
            "k": max(1, int(data.k or 5)),
            "details": [],
        }

    k = max(1, int(data.k or 5))
    precisions = []
    recalls = []
    mrrs = []
    details = []

    for case in data.cases:
        search_payload = SearchRequest(
            search_query=case.query,
            user_x=case.user_x,
            user_y=case.user_y,
            user_z=case.user_z,
            user_room=case.user_room,
        )
        results = _search_logic(search_payload)
        top_ids = [str(r.get("id", "")).strip() for r in results[:k] if str(r.get("id", "")).strip()]
        expected = {str(x).strip() for x in case.expected_ids if str(x).strip()}

        if not expected:
            continue

        hits = sum(1 for rid in top_ids if rid in expected)
        precision = hits / float(k)
        recall = hits / float(len(expected))

        rr = 0.0
        for idx, rid in enumerate(top_ids, start=1):
            if rid in expected:
                rr = 1.0 / float(idx)
                break

        precisions.append(precision)
        recalls.append(recall)
        mrrs.append(rr)
        details.append(
            {
                "query": case.query,
                "top_ids": top_ids,
                "expected_ids": sorted(expected),
                "precision": round(precision, 4),
                "recall": round(recall, 4),
                "reciprocal_rank": round(rr, 4),
            }
        )

    evaluated = len(precisions)
    if evaluated == 0:
        return {
            "precision_at_k": 0.0,
            "recall_at_k": 0.0,
            "mrr_at_k": 0.0,
            "evaluated_cases": 0,
            "k": k,
            "details": details,
        }

    return {
        "precision_at_k": round(sum(precisions) / evaluated, 4),
        "recall_at_k": round(sum(recalls) / evaluated, 4),
        "mrr_at_k": round(sum(mrrs) / evaluated, 4),
        "evaluated_cases": evaluated,
        "k": k,
        "details": details,
    }


def _extract_searchable_fields(item: dict) -> list[str]:
    res = [
        str(item.get("name", "")),
        str(item.get("type", "")),
        str(item.get("description", "")),
        str(item.get("status", "")),
        str(item.get("availability", "")),
    ]

    loc = item.get("location", "")
    if isinstance(loc, dict):
        res.append(str(loc.get("room", "")))
        res.append(str(loc.get("etage", "")))
    else:
        res.append(str(loc))
    return res


def _focus_text(item: dict) -> str:
    parts = [
        normalize_text(item.get("name", "")),
        normalize_text(item.get("type", "")),
    ]
    loc = item.get("location", {})
    if isinstance(loc, dict):
        parts.append(normalize_text(loc.get("room", "")))
    else:
        parts.append(normalize_text(str(loc)))
    return " ".join([p for p in parts if p])


def _collect_index_scores(tokens: list[str]) -> dict[str, int]:
    if not tokens:
        return {}
    docs = list(keyword_index_collection.find({"mot": {"$in": tokens}}).limit(5000))
    score_by_thing: dict[str, int] = {}
    for doc in docs:
        thing_id = str(doc.get("thingId") or "").strip()
        if not thing_id:
            continue
        weight = int(doc.get("poids") or 1)
        freq = int(doc.get("frequence") or 1)
        score_by_thing[thing_id] = score_by_thing.get(thing_id, 0) + (weight * max(1, freq))
    return score_by_thing


@recherche_router.post("/things/{thing_id}/view")
def increment_view_count(thing_id: str):
    """Enregistre une consultation d'objet et incrémente le compteur de vues."""
    try:
        thing = things_collection.find_one({"id": thing_id})
        if not thing:
            raise HTTPException(status_code=404, detail="Objet introuvable")
        
        result = things_collection.update_one(
            {"id": thing_id},
            {"$inc": {"view_count": 1}}
        )
        
        return {
            "thing_id": thing_id,
            "view_count": thing.get("view_count", 0) + 1,
            "success": result.modified_count > 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur enregistrement consultation: {e}")


@recherche_router.get("/things/suggest")
def suggest_things(q: str = ""):
    if not q or len(q.strip()) < 2:
        return []

    q_norm = normalize_text(q)
    query = {"search_name_norm": {"$regex": f"^{re.escape(q_norm)}", "$options": "i"}}
    results = list(things_collection.find(query).limit(5))
    suggestions = [item.get("name") for item in results if item.get("name")]
    return list(dict.fromkeys(suggestions))


@recherche_router.post("/things/search")
def search_things(data: SearchRequest = Body(...)):
    try:
        expire_due_borrows()
        return _search_logic(data)

    except Exception as e:
        print(f"Erreur search: {e}")
        raise HTTPException(status_code=500, detail="Erreur recherche")
