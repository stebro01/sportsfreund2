from fastapi import HTTPException

from .user_service import load_users, save_users


def send_request(uid: str, friend_uid: str) -> None:
    """Add a friend request from ``uid`` to ``friend_uid``."""
    users = load_users()
    if friend_uid not in users:
        raise HTTPException(status_code=404, detail="Friend not found")
    target = users[friend_uid]
    if uid not in target.get("requests", []):
        target.setdefault("requests", []).append(uid)
    save_users(users)


def accept_request(uid: str, friend_uid: str) -> None:
    """Accept a friend request for ``uid`` from ``friend_uid``."""
    users = load_users()
    user = users.get(uid)
    friend = users.get(friend_uid)
    if not user or not friend:
        raise HTTPException(status_code=404, detail="User not found")
    if friend_uid in user.get("requests", []):
        user["requests"].remove(friend_uid)
        user.setdefault("friends", []).append(friend_uid)
        friend.setdefault("friends", []).append(uid)
    save_users(users)
