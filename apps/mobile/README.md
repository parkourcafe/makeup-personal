# Mirari Mobile App

Expo React Native app for the Mirari MVP.

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

## Native Build

`app.json` uses the production display name `Mirari`, stable native identifiers, and bundled base assets:

- iOS bundle id: `com.parkourcafe.makeuppersonal`
- Android package id: `com.parkourcafe.makeuppersonal`
- Version: `0.1.0`
- Icon, splash, adaptive icon, and favicon: `assets/`

`eas.json` contains Android-first preview and store production profiles. All native profiles point at the Vercel API through `EXPO_PUBLIC_API_BASE_URL`.

```bash
npm run eas:preview:android
npm run eas:preview:ios
npm run eas:production:android
npm run eas:production:ios
npm run eas:preview
npm run eas:production
```

Production Android builds use an AAB (`android.buildType=app-bundle`). Production iOS builds use store distribution and are ready for TestFlight submission once Apple credentials are configured in EAS.

Current blocker for cloud native builds: Expo CLI must be logged in or `EXPO_TOKEN` must be set. Android prebuild has been validated locally, but EAS cloud preview was not queued without account credentials.

## Product Notes

The UI is Russian in this pass. Preview means a reference look, role map, and tutorial framing. It is not AR try-on and does not claim camera-based shade detection.
