import json
import logging
import os
import uuid
from pathlib import Path
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect

from .services import friend_service, user_service

app = FastAPI()


def _log_dir() -> Path:
    """Return path to application data directory."""
    return user_service.appdata_dir()


def _configure_logger() -> logging.Logger:
    """Configure logger to log to console and a file."""
    base = _log_dir()
    base.mkdir(parents=True, exist_ok=True)
    log_path = base / "logs.txt"

    logger = logging.getLogger("server")
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        formatter = logging.Formatter(
            "%(asctime)s - %(levelname)s - %(message)s"
        )
        fh = logging.FileHandler(log_path)
        fh.setFormatter(formatter)
        ch = logging.StreamHandler()
        ch.setFormatter(formatter)
        logger.addHandler(fh)
        logger.addHandler(ch)
    return logger


logger = _configure_logger()


def _paths():
    return user_service.users_file(), user_service.log_file()


def _load_json(path: Path, default):
    return user_service._load_json(path, default)


def _save_json(path: Path, data):
    user_service._save_json(path, data)




def log_event(entry):
    _, log_file = _paths()
    log = _load_json(log_file, [])
    log.append(entry)
    _save_json(log_file, log)
    logger.info(json.dumps(entry))


@app.post('/log')
def log_message(payload: dict):
    """Append arbitrary log messages to the server logger."""
    message = payload.get('message', '')
    logger.info(message)
    return {'status': 'ok'}


@app.post('/register', status_code=201)
def register(payload: dict):
    username = payload['username']
    password = payload['password']
    users = user_service.load_users()
    if any(u['username'] == username for u in users.values()):
        raise HTTPException(status_code=400, detail='User exists')
    uid = str(uuid.uuid4())
    users[uid] = {
        'uid': uid,
        'username': username,
        'password': password,
        'friends': [],
        'requests': []
    }
    user_service.save_users(users)
    log_event({'event': 'register', 'uid': uid})
    return {'uid': uid}


@app.post('/login')
def login(payload: dict):
    username = payload['username']
    password = payload['password']
    users = user_service.load_users()
    for u in users.values():
        if u['username'] == username and u['password'] == password:
            log_event({'event': 'login', 'uid': u['uid']})
            return {'uid': u['uid']}
    raise HTTPException(status_code=401, detail='Invalid credentials')


@app.post('/friend/request')
def friend_request(payload: dict):
    uid = payload['uid']
    friend_uid = payload['friend_uid']
    friend_service.send_request(uid, friend_uid)
    log_event({'event': 'friend_request', 'uid': uid, 'friend_uid': friend_uid})
    return {'status': 'sent'}


@app.post('/friend/accept')
def friend_accept(payload: dict):
    uid = payload['uid']
    friend_uid = payload['friend_uid']
    friend_service.accept_request(uid, friend_uid)
    log_event({'event': 'friend_accept', 'uid': uid, 'friend_uid': friend_uid})
    return {'status': 'accepted'}


class ConnectionManager:
    def __init__(self):
        self.active = {}

    async def connect(self, uid: str, websocket: WebSocket):
        await websocket.accept()
        self.active[uid] = websocket
        log_event({"event": "ws_connect", "uid": uid})

    def disconnect(self, uid: str):
        self.active.pop(uid, None)
        log_event({"event": "ws_disconnect", "uid": uid})

    async def send_personal(self, uid: str, message: str):
        if uid in self.active:
            await self.active[uid].send_text(message)


manager = ConnectionManager()


@app.websocket('/ws/{uid}')
async def websocket_endpoint(websocket: WebSocket, uid: str):
    await manager.connect(uid, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            recipient = data['to']
            message = data['message']
            await manager.send_personal(
                recipient,
                json.dumps({'from': uid, 'message': message})
            )
            log_event({'event': 'message', 'from': uid, 'to': recipient, 'message': message})
    except WebSocketDisconnect:
        manager.disconnect(uid)

