# Mirari Makeup Personal Coach MVP

Mirari is a deterministic makeup coaching MVP. The product hierarchy is:

1. Teach the user how to reproduce a curated makeup look.
2. Match the user's existing makeup bag to the look roles.
3. Recommend shopping only for missing or unsuitable roles.

This is not a shopping-first app, not AR try-on, and not a beauty filter. Matching is backend-owned and deterministic; uncertain inputs return `needs_confirmation`.

## Current Status

The original three-pass MVP is implemented and deployed:

| Area | Path | Status | Live URL |
| --- | --- | --- | --- |
| API | `apps/api` | FastAPI, SQLAlchemy/Alembic, deterministic matching, auth, admin API, mock offers, Neon Postgres production DB | https://makeup-personal-api.vercel.app |
| Mobile web / Expo app | `apps/mobile` | Russian UI, auth, look library, makeup bag, readiness report, tutorial player, EAS build prep | https://www.mirari.makeup |
| Admin web | `apps/admin` | Token-gated web UI for looks, roles, tutorials, steps, stores, offers | https://admin-ashy-zeta.vercel.app |

## MVP Coverage

- Pass 1 backend core: complete.
- Pass 2 mobile vertical slice over live API: complete.
- Pass 3 admin, expanded content, mocked stores, QA docs: complete for MVP demo.
- Production hardening already added: Vercel deploys, Neon Postgres, admin token gate, user accounts, mobile app assets, EAS profiles.

## Local Run

API:

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

Mobile:

```bash
cd apps/mobile
npm install
npm run typecheck
npm run lint
npm run build
npm start
```

Admin:

```bash
cd apps/admin
npm install
npm run build
npm run dev
```

## Production Notes

- Vercel API production uses Neon Postgres through `DATABASE_URL`.
- `AUTO_SEED_DEMO=false` in production; seed was run once.
- `/admin/*` is protected by `ADMIN_API_TOKEN`; the admin UI sends it as `X-Admin-Token`.
- User makeup bag endpoints require the matching bearer token for that user.
- Mock store availability is demo-only and must stay visibly labeled as not live inventory.
- EAS cloud builds require Expo login or `EXPO_TOKEN`; local Android prebuild has been validated.

## Documentation

- Matching rules: `docs/matching-rules.md`
- Preview strategy: `docs/preview-strategy.md`
- QA notes and walkthrough: `docs/qa-notes.md`
- Known limitations: `docs/known-limitations.md`

## Known Limitations

Seed and tutorial content are demo/editorial draft content, not final expert-approved beauty content. There is no AR, scanning, scraping, checkout, live inventory, or real nearby stock. See `docs/known-limitations.md` for the full list.
