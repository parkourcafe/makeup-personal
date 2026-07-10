# Mirari Admin

Vite/React admin UI for internal MVP content operations.

The admin manages:

- looks;
- look roles;
- tutorials;
- tutorial steps;
- mock stores;
- mock store offers.

The backend exposes full CRUD for all of these resources under `/admin/*`. The web UI supports create, edit, and delete flows for the same MVP resource set.

## Access

The API protects `/admin/*` when `ADMIN_API_TOKEN` is set. Paste that value into the admin UI token field; it is sent as `X-Admin-Token` and saved in browser local storage.

Production admin:

```txt
https://admin-ashy-zeta.vercel.app
```

Production API:

```txt
https://makeup-personal-api.vercel.app
```

## Configuration

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000
```

If `VITE_API_BASE_URL` is not set, local development falls back to `http://127.0.0.1:8000` and production builds fall back to `https://makeup-personal-api.vercel.app`.

For Vercel production:

```bash
VITE_API_BASE_URL=https://makeup-personal-api.vercel.app
```

## Run

```bash
cd apps/admin
npm install
npm run build
npm run dev
```

## Product Boundaries

This is an internal MVP admin, not a public CMS. It intentionally uses a single admin token rather than role-based RBAC. Mock store offers must remain labeled as demo availability, not live inventory.
