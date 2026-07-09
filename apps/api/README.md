# Makeup Coach API

FastAPI backend for Pass 1 of the Makeup AI Personal Coach MVP.

## Stack

- Python 3.12-compatible application code
- FastAPI
- SQLAlchemy 2.x
- Alembic
- Pydantic v2
- Pytest
- SQLite by default

`DATABASE_URL` is supported. If unset, local commands use `sqlite:///./makeup_coach.db`.

## Local Setup

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
python -m app.seed.run
pytest
uvicorn app.main:app --reload
```

## API Endpoints

- `GET /health`
- `GET /looks`
- `GET /looks/{look_id}`
- `GET /looks/{look_id}/tutorial`
- `GET /users/{user_id}/products`
- `POST /users/{user_id}/products`
- `DELETE /users/{user_id}/products/{product_id}`
- `POST /users/{user_id}/looks/{look_id}/readiness`

The demo seed creates user `1`, four active looks, tutorials, and 20 manually entered user products.

## Matching

Matching rules are documented in `../../docs/matching-rules.md`.

The backend returns `needs_confirmation` instead of guessing when confidence is low or role-required attributes are missing.
