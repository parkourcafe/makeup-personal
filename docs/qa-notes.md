# QA Notes

## Final MVP Walkthrough

1. Open the mobile web app at `https://www.mirari.makeup`.
2. Register or log in.
3. Open the look library and confirm looks load from the live API.
4. Open a look detail page and verify the copy frames it as a reference look, not virtual try-on.
5. Open the makeup bag.
6. Add a manual product using vocabulary-backed category/color/finish/texture fields.
7. Delete a product and confirm the list updates.
8. Generate a readiness report for a look.
9. Confirm role-level statuses, matched products, reasons, usage instructions, and shopping gaps.
10. Open tutorial steps and confirm matched products are used where available.
11. When a shopping gap appears, confirm mock offers are labeled as demo availability and not live inventory.

## Admin Walkthrough

1. Open `https://admin-ashy-zeta.vercel.app`.
2. Paste the production `ADMIN_API_TOKEN` into the token field.
3. Load looks from `https://makeup-personal-api.vercel.app`.
4. Create, edit, and delete a test look.
5. For an existing look, create, edit, reorder, and delete a role.
6. Create or edit a tutorial.
7. Create, edit, reorder, and delete tutorial steps.
8. Create, edit, and delete a mock store.
9. Create, edit, and delete a mock store offer.
10. Confirm mock offer source labels still say the data is technical demo availability, not live stock.

## Expected Demo Signals

- `/health` returns OK.
- `/looks` returns 12 active looks.
- Demo user `1` exists in seeded demo data; production users use auth.
- Seeded demo data includes enough products to trigger every `match_status`.
- `soft-rose-everyday` readiness can exercise `enough`, `use_differently`, `not_suitable`, `missing`, and `needs_confirmation`.
- Shopping gaps include a `gap_id`.
- `GET /shopping-gaps/{gap_id}/mock-offers` returns only mock offers and the Russian demo source label.
- Mobile UI labels are Russian.
- No UI copy claims AR, scanning, live inventory, or real nearby stock.

## Validation Command Set

API:

```bash
cd apps/api
pytest
```

Mobile:

```bash
cd apps/mobile
npm run typecheck
npm run lint
npm run build
npx expo prebuild --platform android --no-install --clean
```

Admin:

```bash
cd apps/admin
npm run build
```

Deployment checks:

```bash
curl -I https://makeup-personal-api.vercel.app/health
curl -I https://www.mirari.makeup
curl -I https://admin-ashy-zeta.vercel.app
```

## Native Build Notes

Android local prebuild should complete without Expo warnings. EAS cloud builds require either an interactive Expo login or an `EXPO_TOKEN`; without that, `npm run eas:preview:android -- --non-interactive --no-wait` stops before queueing the build.

## Latest Local Validation

Run on 2026-07-10:

- `cd apps/api && ./.venv/bin/python -m pytest` -> 23 passed, 1 Starlette/httpx deprecation warning.
- `cd apps/mobile && npm run typecheck` -> passed.
- `cd apps/mobile && npm run lint` -> passed.
- `cd apps/mobile && npm run build` -> passed.
- `cd apps/admin && npm run build` -> passed.
- `curl -s https://makeup-personal-api.vercel.app/health` -> `{"status":"ok"}`.
- `curl -I https://www.mirari.makeup` -> HTTP 200.
- `curl -I https://admin-ashy-zeta.vercel.app` -> HTTP 200 after production deploy `dpl_G4RHaahDedKMduf49qGi5owmZBxF`.

Notes:

- Plain `pytest` and `python3 -m pytest` were not available from the global Python environment; API tests were run through the existing project venv.
- EAS Android preview command was previously verified to reach EAS CLI, but cloud queueing is blocked until Expo login or `EXPO_TOKEN` is available.
