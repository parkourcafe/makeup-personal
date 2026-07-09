from fastapi.testclient import TestClient


def test_shopping_gap_returns_mock_offers(client: TestClient, soft_rose_look_id: int) -> None:
    report = client.post(f"/users/1/looks/{soft_rose_look_id}/readiness").json()
    glow_gap = next(match["shopping_gap"] for match in report["role_matches"] if match["role_key"] == "glow_balm")

    response = client.get(f"/shopping-gaps/{glow_gap['gap_id']}/mock-offers")

    assert response.status_code == 200
    offers = response.json()
    assert len(offers) >= 1
    assert {offer["category"] for offer in offers} == {"highlighter"}
    assert all(offer["source_label"] == "Mock availability for demo. Not live inventory." for offer in offers)


def test_unknown_shopping_gap_returns_404(client: TestClient) -> None:
    response = client.get("/shopping-gaps/look-999-role-999/mock-offers")

    assert response.status_code == 404
