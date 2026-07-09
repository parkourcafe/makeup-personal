# Known Limitations

- Basic email/password authentication exists; production RBAC and external identity provider review are still pending.
- No real AR try-on, face tracking, camera shade detection, or beauty filtering.
- No real product scraping, store inventory, checkout, or nearby availability.
- Store offers are technical demo data and must be labeled: "Техническая демонстрация доступности. Не live-остатки."
- SQLite is the local default. Use `DATABASE_URL` with Postgres for a persistent deployment.
- Seed content is demo content, not final expert-approved editorial content.
- Mobile product entry is manual and intentionally basic.
- Admin has a deployable web UI, but it is still an internal MVP surface and needs role-based access control before broader use.
