import json
from pathlib import Path
from .user_service import appdata_dir, _load_json, _save_json


def messages_file() -> Path:
    return appdata_dir() / "messages.json"


def load_messages():
    return _load_json(messages_file(), {})


def save_messages(data):
    _save_json(messages_file(), data)


def room_id(uid1: str, uid2: str) -> str:
    return "_".join(sorted([uid1, uid2]))


def add_message(room: str, message: dict) -> None:
    data = load_messages()
    data.setdefault(room, []).append(message)
    save_messages(data)


def get_history(room: str):
    data = load_messages()
    return data.get(room, [])
