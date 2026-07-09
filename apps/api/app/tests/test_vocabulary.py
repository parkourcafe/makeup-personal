from fastapi.testclient import TestClient


def test_vocabulary_endpoint_exposes_matching_terms(client: TestClient) -> None:
    response = client.get("/vocabulary")
    assert response.status_code == 200
    payload = response.json()
    assert "blush" in payload["categories"]
    assert "mauve" in payload["color_families"]
    assert "satin" in payload["finishes"]


def test_product_category_is_validated(client: TestClient) -> None:
    payload = {
        "brand": "Test Brand",
        "name": "Mystery Product",
        "category": "random",
        "color_family": "taupe",
        "undertone": "neutral",
        "finish": "matte",
        "texture": "powder",
        "coverage": "medium",
        "intensity": 3,
        "is_multi_use_safe": False,
        "confidence": 1.0,
    }
    response = client.post("/users/1/products", json=payload)
    assert response.status_code == 422
