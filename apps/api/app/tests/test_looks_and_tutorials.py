from fastapi.testclient import TestClient


def test_looks_list_returns_seeded_looks(client: TestClient) -> None:
    response = client.get("/looks")

    assert response.status_code == 200
    looks = response.json()
    assert len(looks) == 4
    assert {look["slug"] for look in looks} >= {
        "soft-rose-everyday",
        "latte-soft-smoke",
        "clean-girl-polished",
        "berry-date-night",
    }


def test_look_detail_includes_roles(client: TestClient, soft_rose_look_id: int) -> None:
    response = client.get(f"/looks/{soft_rose_look_id}")

    assert response.status_code == 200
    look = response.json()
    assert look["slug"] == "soft-rose-everyday"
    assert len(look["roles"]) == 7
    assert {role["role_key"] for role in look["roles"]} >= {"fresh_base", "cream_blush", "glossy_lip"}


def test_tutorial_returns_ordered_steps(client: TestClient, soft_rose_look_id: int) -> None:
    response = client.get(f"/looks/{soft_rose_look_id}/tutorial")

    assert response.status_code == 200
    tutorial = response.json()
    step_numbers = [step["step_number"] for step in tutorial["steps"]]
    assert step_numbers == sorted(step_numbers)
    assert step_numbers == list(range(1, len(step_numbers) + 1))
