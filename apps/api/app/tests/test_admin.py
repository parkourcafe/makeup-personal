from fastapi.testclient import TestClient


def test_admin_can_crud_look(client: TestClient) -> None:
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
        "source_label": "Mock availability for demo. Not live inventory.",
    }
    offer_response = client.post("/admin/store-offers", json=offer_payload)
    assert offer_response.status_code == 201
    offer_id = offer_response.json()["id"]

    updated = client.put(f"/admin/store-offers/{offer_id}", json={"price": 19.5})
    assert updated.status_code == 200
    assert updated.json()["price"] == 19.5

    assert client.delete(f"/admin/store-offers/{offer_id}").status_code == 204
    assert client.delete(f"/admin/stores/{store_id}").status_code == 204
