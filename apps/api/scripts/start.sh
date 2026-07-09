#!/bin/sh
set -eu

alembic upgrade head

if [ "${SEED_ON_STARTUP:-true}" = "true" ]; then
  python -m app.seed.run
fi

uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
