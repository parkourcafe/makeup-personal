# Makeup AI Personal Coach MVP

This repository contains Pass 1 of the Makeup AI Personal Coach MVP.

The MVP is a deterministic coaching product:

1. Teach the user how to reproduce a curated makeup look.
2. Match the user's existing makeup bag to the look roles.
3. Recommend shopping only for missing or unsuitable roles.

Implemented in this pass:

- FastAPI backend in `apps/api`
- SQLAlchemy models and Alembic migration
- deterministic matching service
- demo seed data
- pytest coverage for the product loop
- placeholder folders for future mobile and admin passes

See `apps/api/README.md` for local setup and validation commands.
