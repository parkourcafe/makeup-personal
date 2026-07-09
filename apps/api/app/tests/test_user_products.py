from fastapi.testclient import TestClient


def test_user_products_can_be_created_listed_and_deleted(
    client: TestClient,
    demo_auth_headers: dict[str, str],
) -> None:
    initial = client.get("/users/1/products", headers=demo_auth_headers)
    assert initial.status_code == 200
    assert len(initial.json()) == 32

    payload = {
        "brand": "Test Brand",
        "name": "Sheer Taupe Shadow",
        "category": "eyeshadow",
        "color_family": "taupe",
        "undertone": "neutral",
        "finish": "matte",
        "texture": "powder",
        "coverage": "medium",
        "intensity": 3,
        "is_multi_use_safe": False,
        "confidence": 1.0,
    }
    created = client.post("/users/1/products", json=payload, headers=demo_auth_headers)
    assert created.status_code == 201
    product_id = created.json()["id"]

    after_create = client.get("/users/1/products", headers=demo_auth_headers)
    assert after_create.status_code == 200
    assert len(after_create.json()) == 33

    deleted = client.delete(f"/users/1/products/{product_id}", headers=demo_auth_headers)
    assert deleted.status_code == 204

    after_delete = client.get("/users/1/products", headers=demo_auth_headers)
    assert after_delete.status_code == 200
    assert len(after_delete.json()) == 32


def test_user_products_require_owner_token(client: TestClient, demo_auth_headers: dict[str, str]) -> None:
    assert client.get("/users/1/products").status_code == 401

    registered = client.post(
        "/auth/register",
        json={"email": "product-owner@example.com", "password": "strong-pass-123", "display_name": "Owner"},
    ).json()
    other_user_headers = {"Authorization": f"Bearer {registered['access_token']}"}

    forbidden = client.get("/users/1/products", headers=other_user_headers)
    assert forbidden.status_code == 403
