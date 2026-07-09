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

The demo seed creates user `1` (`Алина`), four active looks, tutorials, and 20 manually entered user products.

## Deployment

`render.yaml`, `Dockerfile`, and `scripts/start.sh` are included for a simple hosted demo API.

Default deployment behavior:

- runs Alembic migrations;
- seeds demo data when `SEED_ON_STARTUP=true`;
- starts Uvicorn on `$PORT`;
- allows mobile clients through `CORS_ORIGINS`.

For a persistent production-like environment, replace the default SQLite `DATABASE_URL` with Postgres and decide whether seed reset on startup should stay enabled.

Docker smoke command:

```bash
docker build -t makeup-personal-api .
docker run --rm -p 8000:8000 -e SEED_ON_STARTUP=true makeup-personal-api
```

## Matching

Matching rules are documented in `../../docs/matching-rules.md`.

The backend returns `needs_confirmation` instead of guessing when confidence is low or role-required attributes are missing.
