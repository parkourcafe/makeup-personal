from fastapi.testclient import TestClient


def test_readiness_report_returns_role_level_matches(client: TestClient, soft_rose_look_id: int) -> None:
    response = client.post(f"/users/1/looks/{soft_rose_look_id}/readiness")

    assert response.status_code == 200
    report = response.json()
    assert report["user_id"] == 1
    assert report["look_id"] == soft_rose_look_id
    assert report["overall_status"] == "shopping_gaps"
    assert report["readiness_score"] > 0
    assert len(report["role_matches"]) == 7


def test_matching_golden_cases_from_rules_doc(client: TestClient, soft_rose_look_id: int) -> None:
    response = client.post(f"/users/1/looks/{soft_rose_look_id}/readiness")
    report = response.json()
    matches = {match["role_key"]: match for match in report["role_matches"]}

    assert matches["skin_prep"]["status"] == "enough"
    assert matches["cream_blush"]["status"] == "use_differently"
    assert matches["glossy_lip"]["status"] == "not_suitable"
    assert matches["glow_balm"]["status"] == "missing"
    assert matches["soft_liner"]["status"] == "needs_confirmation"


def test_missing_required_role_creates_shopping_gap(client: TestClient, soft_rose_look_id: int) -> None:
    response = client.post(f"/users/1/looks/{soft_rose_look_id}/readiness")
    matches = {match["role_key"]: match for match in response.json()["role_matches"]}

    assert matches["glow_balm"]["status"] == "missing"
    assert matches["glow_balm"]["shopping_gap"] == {
        "gap_id": f"look-{soft_rose_look_id}-role-{matches['glow_balm']['look_role_id']}",
        "needed_category": "highlighter",
        "needed_description": "Деликатное сияние: Прозрачное сияние на скулах без заметных блесток.",
    }


def test_low_confidence_product_returns_needs_confirmation(client: TestClient, soft_rose_look_id: int) -> None:
    response = client.post(f"/users/1/looks/{soft_rose_look_id}/readiness")
    matches = {match["role_key"]: match for match in response.json()["role_matches"]}

    assert matches["soft_liner"]["status"] == "needs_confirmation"
    assert "confidence" in matches["soft_liner"]["reason"]
