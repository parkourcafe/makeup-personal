# Admin

Pass 3 uses API-only admin endpoints instead of a separate web app.

Admin endpoints are exposed in FastAPI OpenAPI docs at `/docs`.

Implemented CRUD resources:

- `POST|PUT|DELETE /admin/looks`
- `POST|PUT|DELETE /admin/look-roles`
- `POST|PUT|DELETE /admin/tutorials`
- `POST|PUT|DELETE /admin/tutorial-steps`
- `POST|PUT|DELETE /admin/stores`
- `POST|PUT|DELETE /admin/store-offers`

Example:

```bash
curl -X POST http://127.0.0.1:8000/admin/store-offers \
  -H "Content-Type: application/json" \
  -d '{
    "store_id": 1,
    "product_name": "Mock Gloss",
    "brand": "Mock Brand",
    "category": "lip_gloss",
    "color_family": "nude",
    "price": 18,
    "currency": "USD",
    "availability_status": "mock_in_stock",
    "source_label": "Mock availability for demo. Not live inventory."
  }'
```

There is no production authentication in this MVP pass.
