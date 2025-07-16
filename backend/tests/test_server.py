import json
import os
from pathlib import Path
from fastapi.testclient import TestClient
from backend.server import app


def setup_env(tmp_path):
    os.environ['APPDATA_PATH'] = str(tmp_path)
    return TestClient(app)


def test_ping(tmp_path):
    client = setup_env(tmp_path)
    r = client.get('/ping')
    assert r.status_code == 200


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


def test_user_get(tmp_path):
    client = setup_env(tmp_path)
    uid = client.post('/register', json={'username': 'alice', 'password': 'x'}).json()['uid']
    r = client.get(f'/user/{uid}')
    assert r.status_code == 200
    data = r.json()
    assert data['uid'] == uid
    assert data['username'] == 'alice'


def test_friend_request_accept(tmp_path):
    client = setup_env(tmp_path)
    u1 = client.post('/register', json={'username': 'a', 'password': 'p'}).json()['uid']
    u2 = client.post('/register', json={'username': 'b', 'password': 'p'}).json()['uid']
    with client.websocket_connect(f'/ws/{u2}') as ws:
        client.post('/friend/request', json={'uid': u1, 'friend_uid': u2})
        data = json.loads(ws.receive_text())
        assert data['event'] == 'chat_request'
        assert data['from'] == u1
    users = json.load(open(tmp_path/'user.json'))
    assert u1 in users[u2]['requests']
    client.post('/friend/accept', json={'uid': u2, 'friend_uid': u1})
    users = json.load(open(tmp_path/'user.json'))
    assert u1 not in users[u2]['requests']
    assert u1 in users[u2]['friends']
    assert u2 in users[u1]['friends']


def test_friend_request_decline(tmp_path):
    client = setup_env(tmp_path)
    u1 = client.post('/register', json={'username': 'a', 'password': 'p'}).json()['uid']
    u2 = client.post('/register', json={'username': 'b', 'password': 'p'}).json()['uid']
    client.post('/friend/request', json={'uid': u1, 'friend_uid': u2})
    users = json.load(open(tmp_path/'user.json'))
    assert u1 in users[u2]['requests']
    client.post('/friend/decline', json={'uid': u2, 'friend_uid': u1})
    users = json.load(open(tmp_path/'user.json'))
    assert u1 not in users[u2].get('requests', [])
    assert u1 not in users[u2].get('friends', [])


def test_status_updates(tmp_path):
    client = setup_env(tmp_path)
    u1 = client.post('/register', json={'username': 'a', 'password': 'p'}).json()['uid']
    u2 = client.post('/register', json={'username': 'b', 'password': 'p'}).json()['uid']
    with client.websocket_connect(f'/ws/{u1}') as ws1:
        assert json.loads(ws1.receive_text())['uid'] == u1
        with client.websocket_connect(f'/ws/{u2}') as ws2:
            assert json.loads(ws2.receive_text())['uid'] == u2
            data = json.loads(ws1.receive_text())
            assert data['event'] == 'status_update'
            assert data['uid'] == u2
            assert data['online'] is True
        data = json.loads(ws1.receive_text())
        assert data['event'] == 'status_update'
        assert data['uid'] == u2
        assert data['online'] is False


def test_friend_accept_notify(tmp_path):
    client = setup_env(tmp_path)
    u1 = client.post('/register', json={'username': 'a', 'password': 'p'}).json()['uid']
    u2 = client.post('/register', json={'username': 'b', 'password': 'p'}).json()['uid']
    with client.websocket_connect(f'/ws/{u1}') as ws:
        ws.receive_text()  # own status update
        client.post('/friend/request', json={'uid': u1, 'friend_uid': u2})
        client.post('/friend/accept', json={'uid': u2, 'friend_uid': u1})
        data = json.loads(ws.receive_text())
        assert data['event'] == 'friend_accept'
        assert data['from'] == u2


def test_websocket_chat(tmp_path):
    client = setup_env(tmp_path)
    u1 = client.post('/register', json={'username': 'a', 'password': 'p'}).json()['uid']
    u2 = client.post('/register', json={'username': 'b', 'password': 'p'}).json()['uid']
    with client.websocket_connect(f'/ws/{u1}') as ws1:
        with client.websocket_connect(f'/ws/{u2}') as ws2:
            ws2.receive_text()  # status update
            ws1.receive_text()  # status update about u2
            ws1.send_json({'to': u2, 'message': 'hi'})
            data = json.loads(ws2.receive_text())
            assert data['from'] == u1
            assert data['message'] == 'hi'
    hist = client.get(f'/messages/{u1}/{u2}').json()
    assert hist[0]['message'] == 'hi'


def test_log_endpoint(tmp_path):
    client = setup_env(tmp_path)
    msg = 'test message'
    r = client.post('/log', json={'message': msg})
    assert r.status_code == 200
    log_file = Path(__file__).resolve().parent.parent / 'appdata' / 'logs.txt'
    assert log_file.exists()
    contents = log_file.read_text()
    assert msg in contents


def test_cors_options(tmp_path):
    client = setup_env(tmp_path)
    r = client.options(
        "/login",
        headers={
            "Origin": "http://localhost:8080",
            "Access-Control-Request-Method": "POST",
        },
    )
    assert r.status_code == 200
    assert r.headers.get("access-control-allow-origin") == "http://localhost:8080"


def test_user_update_delete(tmp_path):
    client = setup_env(tmp_path)
    uid = client.post('/register', json={'username': 'alice', 'password': 'x'}).json()['uid']
    r = client.put(f'/user/{uid}', json={'username': 'bob', 'age': 30, 'password': 'y'})
    assert r.status_code == 200
    data = json.load(open(tmp_path / 'user.json'))
    assert data[uid]['username'] == 'bob'
    assert data[uid]['age'] == 30
    assert data[uid]['password'] == 'y'
    r = client.delete(f'/user/{uid}')
    assert r.status_code == 200
    data = json.load(open(tmp_path / 'user.json'))
    assert uid not in data
