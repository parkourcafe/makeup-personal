# Mobile App

Expo React Native vertical slice for Pass 2.

Implemented screens:

- Auth
- Look Library
- Look Detail
- Makeup Bag
- Readiness Report
- Tutorial Player

The mobile app calls the live backend API. It does not duplicate matching logic.
Mock store offers appear only after backend readiness reports return shopping gaps, and are labeled as demo availability.

## Configuration

Create `.env` from `.env.example`:

```bash
EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

If `EXPO_PUBLIC_API_BASE_URL` is not set, development falls back to `http://127.0.0.1:8000` and production builds fall back to the deployed API.

Use the deployed API URL for device testing:

```bash
EXPO_PUBLIC_API_BASE_URL=https://your-deployed-api.example.com
```

Current Vercel web deployment:

```txt
https://www.mirari.makeup
```

Current Vercel API deployment:

```txt
https://makeup-personal-api.vercel.app
```

For a physical phone against a local backend, use the computer's LAN IP instead of `127.0.0.1`.

## Run

```bash
cd apps/mobile
npm install
npm run typecheck
npm run lint
npm start
```

## Native Production

`eas.json` contains `preview` and `production` profiles for iOS/Android. The profiles point at the Vercel API through `EXPO_PUBLIC_API_BASE_URL`.

```bash
npm run eas:preview
npm run eas:production
```

## Product Notes

The UI is Russian in this pass. Preview means a reference look, role map, and tutorial framing. It is not AR try-on and does not claim camera-based shade detection.
