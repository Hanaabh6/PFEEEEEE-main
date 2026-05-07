from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv


BACKEND_DIR = Path(__file__).resolve().parent
ROOT_DIR = BACKEND_DIR.parent
FRONTEND_DIR = ROOT_DIR / "frontend"
HOME_PAGE = FRONTEND_DIR / "p1.html"
ENV_FILE = ROOT_DIR / "bdd.env"

load_dotenv(ENV_FILE)

MONGO_URI = os.getenv("MONGO_URI", "").strip()
SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip()
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "").strip()
SUPABASE_SERVICE_ROLE = (
    os.getenv("SUPABASE_SERVICE_ROLE", "").strip()
    or os.getenv("SUPABASE_SERVICE_KEY", "").strip()
)
PUBLIC_BASE_URL = os.getenv("PUBLIC_BASE_URL", "").strip().rstrip("/")

_DEFAULT_FRONTEND_ORIGINS = [
    "http://127.0.0.1:8000",
    "http://localhost:8000",
    "http://127.0.0.1:5501",
    "http://localhost:5501",
    "http://127.0.0.1:5500",
    "http://localhost:5500",
]


def _read_origins() -> list[str]:
    raw = os.getenv("FRONTEND_ORIGINS", "")
    configured = [value.strip().rstrip("/") for value in raw.split(",") if value.strip()]
    origins = configured or list(_DEFAULT_FRONTEND_ORIGINS)
    if PUBLIC_BASE_URL and PUBLIC_BASE_URL not in origins:
        origins.append(PUBLIC_BASE_URL)
    return origins


FRONTEND_ORIGINS = _read_origins()


def resolve_public_base_url(request_base_url: str | None = None) -> str:
    if PUBLIC_BASE_URL:
        return PUBLIC_BASE_URL

    for origin in FRONTEND_ORIGINS:
        if not origin.startswith(
            ("http://127.0.0.1", "https://127.0.0.1", "http://localhost", "https://localhost")
        ):
            return origin

    if request_base_url:
        return request_base_url.rstrip("/")

    return FRONTEND_ORIGINS[0]
