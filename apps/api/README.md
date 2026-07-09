# Makeup Coach API

FastAPI backend for Pass 1 of the Makeup AI Personal Coach MVP.

## Stack

- Python 3.12-compatible application code
- FastAPI
- SQLAlchemy 2.x
- Alembic
- Pydantic v2
- Pytest
- SQLite by default for local development; Postgres is supported through `DATABASE_URL`

`DATABASE_URL` is supported. If unset, local commands use `sqlite:///./makeup_coach.db`.
Set `ADMIN_API_TOKEN` in deployed environments to protect `/admin/*`; local development can leave it unset.

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
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`
- `GET /vocabulary`
- `GET /looks`
- `GET /looks/{look_id}`
- `GET /looks/{look_id}/tutorial`
- `GET /users/{user_id}/products`
- `POST /users/{user_id}/products`
- `DELETE /users/{user_id}/products/{product_id}`
- `POST /users/{user_id}/looks/{look_id}/readiness`
- `GET /shopping-gaps/{gap_id}/mock-offers`
- `GET|POST|PUT|DELETE /admin/looks`
- `GET|POST|PUT|DELETE /admin/look-roles`
- `GET|POST|PUT|DELETE /admin/tutorials`
- `GET|POST|PUT|DELETE /admin/tutorial-steps`
- `GET|POST|PUT|DELETE /admin/stores`
- `GET|POST|PUT|DELETE /admin/store-offers`

The demo seed creates user `1` (`Алина`), 12 active looks, tutorials, 32 manually entered user products, 3 mock stores, and mock store offers.

User-specific `/users/{user_id}/*` endpoints require a bearer token for that same user.

## Deployment

`render.yaml`, `Dockerfile`, and `scripts/start.sh` are included for a simple hosted demo API.
Vercel deployment config is included through `pyproject.toml`, `api/index.py`, `.python-version`, and `vercel.json`.

For production, set `DATABASE_URL` to Postgres, run `alembic upgrade head`, and seed once with `python -m app.seed.run`. Add `--reset` only for local/demo resets.

Current Vercel demo API:

```txt
https://makeup-personal-api.vercel.app
```

The current Vercel deployment still uses demo storage until Neon terms are accepted and a Postgres resource is connected:

```bash
DATABASE_URL=sqlite:///:memory:
AUTO_SEED_DEMO=true
CORS_ORIGINS=*
ADMIN_API_TOKEN=<set in production>
```

That makes it a deterministic demo deployment. It is not persistent storage.

Docker smoke command:

```bash
docker build -t makeup-personal-api .
docker run --rm -p 8000:8000 -e SEED_ON_STARTUP=true makeup-personal-api
```

## Seed Reset

```bash
python -m app.seed.run
```

The seed command skips when looks already exist. Use `python -m app.seed.run --reset` to delete and recreate deterministic demo data.

## Matching

Matching rules are documented in `../../docs/matching-rules.md`.

The backend returns `needs_confirmation` instead of guessing when confidence is low or role-required attributes are missing.
