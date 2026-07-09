from fastapi.testclient import TestClient


def test_user_can_register_login_and_read_profile(client: TestClient) -> None:
    payload = {
        "email": "New.User@example.com",
        "password": "strong-pass-123",
        "display_name": "Мария",
        "skin_depth": "medium",
        "skin_undertone": "neutral",
    }
    registered = client.post("/auth/register", json=payload)
    assert registered.status_code == 201
    registered_body = registered.json()
    assert registered_body["token_type"] == "bearer"
    assert registered_body["user"]["email"] == "new.user@example.com"
    assert registered_body["user"]["display_name"] == "Мария"

    token = registered_body["access_token"]
    me = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["email"] == "new.user@example.com"

    login = client.post("/auth/login", json={"email": payload["email"], "password": payload["password"]})
    assert login.status_code == 200
    assert login.json()["user"]["email"] == "new.user@example.com"


def test_duplicate_register_is_rejected(client: TestClient) -> None:
    payload = {"email": "dupe@example.com", "password": "strong-pass-123", "display_name": "Мария"}
    assert client.post("/auth/register", json=payload).status_code == 201
    assert client.post("/auth/register", json=payload).status_code == 409
