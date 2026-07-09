# QA Notes

## Main Flow

1. Start the backend.
2. Seed demo data.
3. Start the Expo app.
4. Open Look Library.
5. Select a curated look.
6. Open Makeup Bag.
7. Add or delete a manual product.
8. Generate readiness report.
9. Confirm role-level statuses, reasons, and shopping gaps.
10. Open Tutorial Player and verify steps connect to matched products when available.

## Expected Demo Signals

- `/looks` returns 12 active looks.
- Demo user `1` has 32 products.
- `soft-rose-everyday` readiness includes every `match_status`.
- Shopping gaps include a `gap_id`.
- `GET /shopping-gaps/{gap_id}/mock-offers` returns only mock offers and the Russian demo source label.
- Mobile UI labels are Russian.
- No UI copy claims AR, scanning, live inventory, or real nearby stock.
