# Known Limitations

- Seed content is demo/editorial draft content, not final expert-approved beauty content.
- Reference previews use curated image/role/tutorial framing only. There is no real AR try-on, face tracking, camera shade detection, or beauty filtering.
- Product entry is manual. There is no real scanning, barcode parsing, photo recognition, or shade detection.
- Matching is deterministic and vocabulary-based. It intentionally returns `needs_confirmation` instead of guessing when data is missing or confidence is low.
- Store offers are technical demo data and must be labeled: "Техническая демонстрация доступности. Не live-остатки."
- There is no real product scraping, store inventory API, checkout, payment, or nearby availability.
- Basic email/password authentication exists, but production RBAC, password reset, email verification, and external identity-provider review are still pending.
- Admin uses a single token gate for `/admin/*`. It is deployable for internal MVP operations, but not a public CMS.
- SQLite is the local default. Vercel API production is connected to Neon Postgres for persistent storage.
- EAS profiles are configured, Android local prebuild has been validated, but cloud native builds require Expo login or `EXPO_TOKEN`.
- `npm audit --omit=dev` reports moderate transitive issues through Expo config tooling. The current safe path is to stay on the latest Expo 57 release; `npm audit fix --force` suggests a breaking Expo downgrade and should not be applied.
