# Known Limitations

- Basic email/password authentication exists; production RBAC and external identity provider review are still pending.
- No real AR try-on, face tracking, camera shade detection, or beauty filtering.
- No real product scraping, store inventory, checkout, or nearby availability.
- Store offers are technical demo data and must be labeled: "Техническая демонстрация доступности. Не live-остатки."
- SQLite is the local default. Use `DATABASE_URL` with Postgres for a persistent deployment.
- The current Vercel API remains in in-memory demo storage until Neon/Postgres is connected, so live accounts, sessions, and products can reset across function instances.
- Seed content is demo content, not final expert-approved editorial content.
- Mobile product entry is manual and intentionally basic.
- Admin has a deployable web UI and token-gated API access, but it is still an internal MVP surface and needs role-based RBAC before broader use.
