from app.db.url import normalize_database_url


def test_normalize_postgres_urls_to_psycopg_driver() -> None:
    assert (
        normalize_database_url("postgresql://user:pass@host/db")
        == "postgresql+psycopg://user:pass@host/db"
    )
    assert (
        normalize_database_url("postgres://user:pass@host/db")
        == "postgresql+psycopg://user:pass@host/db"
    )
    assert (
        normalize_database_url("sqlite:///./makeup_coach.db")
        == "sqlite:///./makeup_coach.db"
    )
