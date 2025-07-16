import json
import os
from pathlib import Path
from fastapi import HTTPException


def appdata_dir() -> Path:
    """Return path to application data directory, creating it if needed."""
    base = Path(os.getenv("APPDATA_PATH", Path(__file__).resolve().parent.parent / "appdata"))
    base.mkdir(parents=True, exist_ok=True)
    return base


def users_file() -> Path:
    return appdata_dir() / "user.json"


def log_file() -> Path:
    return appdata_dir() / "log.json"


def _load_json(path: Path, default):
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists():
        try:
            return json.loads(path.read_text())
        except json.JSONDecodeError:
            return default
    return default


def _save_json(path: Path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data))


def load_users():
    """Load user dictionary from disk."""
    return _load_json(users_file(), {})


def save_users(data):
    """Persist user dictionary to disk."""
    _save_json(users_file(), data)


def update_user(uid: str, values: dict) -> None:
    """Update ``uid`` with given ``values`` and save."""
    users = load_users()
    user = users.get(uid)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.update(values)
    save_users(users)


def delete_user(uid: str) -> None:
    """Remove ``uid`` from stored users."""
    users = load_users()
    if uid not in users:
        raise HTTPException(status_code=404, detail="User not found")
    users.pop(uid)
    save_users(users)

