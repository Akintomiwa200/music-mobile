# music-mobile

An unofficial, educational Spotify-style music app built with **Expo**, **React Native**, **Expo Router**, and **NativeWind (Tailwind)**.

> **Disclaimer:** This project is not affiliated with, endorsed by, or connected to Spotify AB. "Spotify" is a trademark of Spotify AB.

## Features

- Spotify-inspired UI (home, search, library, player)
- Personalization & settings (genres, mood, home layout, playback)
- Mobile drawer / desktop sidebar navigation
- Queue management

## Requirements

- Node.js 18+
- [pnpm](https://pnpm.io/) 9+

## Getting started

```bash
pnpm install
pnpm start
```

## Spotify integration

Connect your real Spotify account for live data:

1. Create an app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Copy `.env.example` → `.env` and set `EXPO_PUBLIC_SPOTIFY_CLIENT_ID`
3. Add redirect URI: `spotify://redirect`
4. Restart with `pnpm start -- --clear`
5. Tap **Connect Spotify** on Home or go to **Settings → Account**

**Playback:** Uses Spotify's 30-second preview URLs where available. Tracks without previews open in the Spotify app. Full in-app streaming requires Spotify Premium + native SDK (not included).

**Lyrics:** Fetched from LRCLIB when available.

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `pnpm start`   | Start Expo dev server    |
| `pnpm android` | Run on Android           |
| `pnpm ios`     | Run on iOS               |
| `pnpm web`     | Run in browser           |

## Legal

- [LICENSE](./LICENSE) — MIT License + project disclaimer
- [CODE OF CONDUCT](./CODE_OF_CONDUCT.md) — community guidelines
- [NOTICE](./NOTICE) — trademark & third-party notices

## Contributing

Contributions are welcome. Please read the Code of Conduct before participating.
Use **pnpm** for all package management (`npm` and `yarn` are blocked via `only-allow`).
