# Makeup Personal Admin

Vite/React admin UI for managing looks, look roles, tutorials, tutorial steps, stores, and store offers.

The API protects `/admin/*` when `ADMIN_API_TOKEN` is set. Paste that value into the admin UI token field; it is sent as `X-Admin-Token` and saved in browser local storage.

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
