# Previewing In The Loop

This is an Expo app. The safest preview path depends on where the dev server is running.

## Local laptop preview

```bash
npm install
npm start
```

Then scan the QR code with Expo Go, or press `w` to open the web preview.

## GitHub Codespaces / github.dev preview

Do not open the forwarded Metro URL directly on your phone. Metro may return an Expo manifest that points at `127.0.0.1`, which is only valid inside the remote workspace and cannot be reached by your iPhone.

Use a tunnel instead:

```bash
npm install
npm run tunnel
```

Then scan the tunnel QR code in Expo Go.

## Web preview

Expo web requires `react-dom` and `react-native-web`; both are listed in `package.json` for this project.

```bash
npm install
npm run web
```

If the web preview shows raw JSON, you are looking at the native Metro manifest endpoint rather than the web app. Stop the server and restart it with `npm run web`.

## Quick checks

```bash
npm run typecheck
```
