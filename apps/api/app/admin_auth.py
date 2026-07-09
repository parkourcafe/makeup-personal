import os
import secrets

from fastapi import Header, HTTPException


def configured_admin_token() -> str | None:
    token = os.getenv("ADMIN_API_TOKEN")
    return token if token else None


def require_admin_token(x_admin_token: str | None = Header(default=None)) -> None:
    expected_token = configured_admin_token()
    if expected_token is None:
        return
    if x_admin_token is None or not secrets.compare_digest(x_admin_token, expected_token):
        raise HTTPException(status_code=401, detail="invalid admin token")
