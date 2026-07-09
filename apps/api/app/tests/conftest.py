import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app import models  # noqa: F401
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models import AuthSession
from app.seed.data import seed_demo_data
from app.security import create_session_token, hash_session_token, session_expires_at


@pytest.fixture()
def client() -> TestClient:
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        future=True,
    )
    TestingSessionLocal = sessionmaker(
        bind=engine,
        autoflush=False,
        autocommit=False,
        expire_on_commit=False,
        future=True,
    )
    Base.metadata.create_all(bind=engine)

    demo_token = create_session_token()
    with TestingSessionLocal() as db:
        seed_demo_data(db, reset=True)
        db.add(
            AuthSession(
                user_id=1,
                token_hash=hash_session_token(demo_token),
                expires_at=session_expires_at(),
            )
        )
        db.commit()

    def override_get_db():
        with TestingSessionLocal() as db:
            yield db

    app.dependency_overrides[get_db] = override_get_db
    app.state.demo_auth_token = demo_token
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
    del app.state.demo_auth_token
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def soft_rose_look_id(client: TestClient) -> int:
    looks = client.get("/looks").json()
    return next(look["id"] for look in looks if look["slug"] == "soft-rose-everyday")


@pytest.fixture()
def demo_auth_headers(client: TestClient) -> dict[str, str]:
    return {"Authorization": f"Bearer {client.app.state.demo_auth_token}"}
