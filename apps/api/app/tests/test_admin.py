from fastapi.testclient import TestClient


def test_admin_requires_token_when_configured(client: TestClient, monkeypatch) -> None:
    monkeypatch.setenv("ADMIN_API_TOKEN", "secret-admin-token")

    missing = client.get("/admin/looks")
    assert missing.status_code == 401

    invalid = client.get("/admin/looks", headers={"X-Admin-Token": "wrong"})
    assert invalid.status_code == 401

    valid = client.get("/admin/looks", headers={"X-Admin-Token": "secret-admin-token"})
    assert valid.status_code == 200


def test_admin_can_crud_look(client: TestClient) -> None:
    listed = client.get("/admin/looks")
    assert listed.status_code == 200
    assert len(listed.json()) == 12

    payload = {
        "slug": "admin-test-look",
        "title": "Admin Test Look",
        "description": "Temporary look for admin smoke test.",
        "difficulty": "beginner",
        "occasion": "qa",
        "reference_image_url": None,
        "is_active": True,
    }
    created = client.post("/admin/looks", json=payload)
    assert created.status_code == 201
    look_id = created.json()["id"]

    updated = client.put(f"/admin/looks/{look_id}", json={"title": "Updated Admin Look"})
    assert updated.status_code == 200
    assert updated.json()["title"] == "Updated Admin Look"

    deleted = client.delete(f"/admin/looks/{look_id}")
    assert deleted.status_code == 204


def test_admin_can_crud_store_offer(client: TestClient) -> None:
    store_payload = {
        "name": "Mock Admin Store",
        "city": "Bali",
        "country": "Indonesia",
        "latitude": -8.7,
        "longitude": 115.2,
    }
    store_response = client.post("/admin/stores", json=store_payload)
    assert store_response.status_code == 201
    store_id = store_response.json()["id"]

    offer_payload = {
        "store_id": store_id,
        "product_name": "Mock Admin Gloss",
        "brand": "Mock Brand",
        "category": "lip_gloss",
        "color_family": "nude",
        "price": 18.0,
        "currency": "USD",
        "availability_status": "mock_in_stock",
        "source_label": "Техническая демонстрация доступности. Не live-остатки.",
    }
    offer_response = client.post("/admin/store-offers", json=offer_payload)
    assert offer_response.status_code == 201
    offer_id = offer_response.json()["id"]

    updated = client.put(f"/admin/store-offers/{offer_id}", json={"price": 19.5})
    assert updated.status_code == 200
    assert updated.json()["price"] == 19.5

    assert client.delete(f"/admin/store-offers/{offer_id}").status_code == 204
    assert client.delete(f"/admin/stores/{store_id}").status_code == 204


def test_admin_can_list_roles_tutorials_and_offers(client: TestClient, soft_rose_look_id: int) -> None:
    roles = client.get(f"/admin/look-roles?look_id={soft_rose_look_id}")
    assert roles.status_code == 200
    assert len(roles.json()) >= 1

    tutorials = client.get(f"/admin/tutorials?look_id={soft_rose_look_id}")
    assert tutorials.status_code == 200
    tutorial_id = tutorials.json()[0]["id"]

    steps = client.get(f"/admin/tutorial-steps?tutorial_id={tutorial_id}")
    assert steps.status_code == 200
    assert len(steps.json()) >= 1

    stores = client.get("/admin/stores")
    assert stores.status_code == 200
    assert len(stores.json()) == 3

    offers = client.get("/admin/store-offers")
    assert offers.status_code == 200
    assert len(offers.json()) == 10
