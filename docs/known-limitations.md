# Known Limitations

- No production authentication.
- No real AR try-on, face tracking, camera shade detection, or beauty filtering.
- No real product scraping, store inventory, checkout, or nearby availability.
- Store offers are mock data and must be labeled: "Mock availability for demo. Not live inventory."
- SQLite is the local default. Use `DATABASE_URL` with Postgres for a persistent deployment.
- Seed content is demo content, not final expert-approved editorial content.
- Mobile product entry is manual and intentionally basic.
- Admin is API-only through FastAPI OpenAPI docs in this pass.
