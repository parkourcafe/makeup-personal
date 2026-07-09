from fastapi.testclient import TestClient


def test_user_products_can_be_created_listed_and_deleted(client: TestClient) -> None:
    initial = client.get("/users/1/products")
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
    created = client.post("/users/1/products", json=payload)
    assert created.status_code == 201
    product_id = created.json()["id"]

    after_create = client.get("/users/1/products")
    assert after_create.status_code == 200
    assert len(after_create.json()) == 33

    deleted = client.delete(f"/users/1/products/{product_id}")
    assert deleted.status_code == 204

    after_delete = client.get("/users/1/products")
    assert after_delete.status_code == 200
    assert len(after_delete.json()) == 32
