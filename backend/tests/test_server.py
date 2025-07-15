import json
import os
from fastapi.testclient import TestClient
from backend.server import app


def setup_env(tmp_path):
    os.environ['APPDATA_PATH'] = str(tmp_path)
    return TestClient(app)


def test_register_login(tmp_path):
    client = setup_env(tmp_path)
    r = client.post('/register', json={'username': 'alice', 'password': 'x'})
    assert r.status_code == 201
    uid = r.json()['uid']
    r = client.post('/login', json={'username': 'alice', 'password': 'x'})
    assert r.status_code == 200
    assert r.json()['uid'] == uid
    data = json.load(open(tmp_path/'user.json'))
    assert uid in data


def test_friend_request_accept(tmp_path):
    client = setup_env(tmp_path)
    u1 = client.post('/register', json={'username': 'a', 'password': 'p'}).json()['uid']
    u2 = client.post('/register', json={'username': 'b', 'password': 'p'}).json()['uid']
    client.post('/friend/request', json={'uid': u1, 'friend_uid': u2})
    users = json.load(open(tmp_path/'user.json'))
    assert u1 in users[u2]['requests']
    client.post('/friend/accept', json={'uid': u2, 'friend_uid': u1})
    users = json.load(open(tmp_path/'user.json'))
    assert u1 in users[u2]['friends']
    assert u2 in users[u1]['friends']


def test_websocket_chat(tmp_path):
    client = setup_env(tmp_path)
    u1 = client.post('/register', json={'username': 'a', 'password': 'p'}).json()['uid']
    u2 = client.post('/register', json={'username': 'b', 'password': 'p'}).json()['uid']
    with client.websocket_connect(f'/ws/{u1}') as ws1:
        with client.websocket_connect(f'/ws/{u2}') as ws2:
            ws1.send_json({'to': u2, 'message': 'hi'})
            data = json.loads(ws2.receive_text())
            assert data['from'] == u1
            assert data['message'] == 'hi'
