from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Header, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import AuthSession, User
from app.schemas import AuthLogin, AuthRegister, AuthResponse, UserRead
from app.security import create_session_token, hash_password, hash_session_token, session_expires_at, verify_password


router = APIRouter(prefix="/auth", tags=["auth"])


def get_current_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> User:
    token = bearer_token(authorization)
    if token is None:
        raise HTTPException(status_code=401, detail="missing bearer token")
    session = db.scalar(
        select(AuthSession)
        .where(AuthSession.token_hash == hash_session_token(token))
        .where(AuthSession.expires_at > datetime.now(timezone.utc))
    )
    if session is None:
        raise HTTPException(status_code=401, detail="invalid bearer token")
    user = db.get(User, session.user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="invalid bearer token")
    return user


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: AuthRegister, db: Session = Depends(get_db)) -> AuthResponse:
    email = normalize_email(payload.email)
    existing_user = db.scalar(select(User).where(User.email == email))
    if existing_user is not None:
        raise HTTPException(status_code=409, detail="email already registered")

    user = User(
        email=email,
        password_hash=hash_password(payload.password),
        display_name=payload.display_name,
        language="ru",
        skin_depth=payload.skin_depth,
        skin_undertone=payload.skin_undertone,
    )
    db.add(user)
    db.flush()
    token = create_and_store_session(db, user)
    db.commit()
    db.refresh(user)
    return AuthResponse(access_token=token, user=user)


@router.post("/login", response_model=AuthResponse)
def login(payload: AuthLogin, db: Session = Depends(get_db)) -> AuthResponse:
    user = db.scalar(select(User).where(User.email == normalize_email(payload.email)))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="invalid email or password")
    token = create_and_store_session(db, user)
    db.commit()
    db.refresh(user)
    return AuthResponse(access_token=token, user=user)


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)) -> User:
    return current_user


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> Response:
    token = bearer_token(authorization)
    if token is not None:
        session = db.scalar(select(AuthSession).where(AuthSession.token_hash == hash_session_token(token)))
        if session is not None:
            db.delete(session)
            db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


def create_and_store_session(db: Session, user: User) -> str:
    token = create_session_token()
    db.add(
        AuthSession(
            user_id=user.id,
            token_hash=hash_session_token(token),
            expires_at=session_expires_at(),
        )
    )
    return token


def bearer_token(authorization: str | None) -> str | None:
    if not authorization:
        return None
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        return None
    return token


def normalize_email(email: str) -> str:
    return email.strip().lower()
