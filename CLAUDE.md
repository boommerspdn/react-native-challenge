# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Expo Version

This project uses **Expo SDK 54**. Always read the versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code — do not rely on generic Expo knowledge.

## Commands

```bash
npm start          # Start Expo dev server (scan QR with Expo Go or press i/a)
npm run ios        # Start on iOS Simulator directly
npm run android    # Start on Android Emulator directly
```

```bash
npm run lint       # ESLint with eslint-config-expo (TypeScript + React + RN rules)
```

No test runner configured yet.

## Stack

- **Expo SDK 54** (managed workflow, new architecture enabled)
- **React Native 0.81.5** / **React 19**
- **TypeScript** (strict mode, extends `expo/tsconfig.base`)
- **React Navigation v7** — `@react-navigation/native` + `@react-navigation/native-stack`
- `react-native-safe-area-context` and `react-native-screens` pre-installed

## Architecture (planned)

The app is a Team Directory with three screens connected via a native stack:

```
App.tsx  →  NavigationContainer  →  AppNavigator (native stack)
                                        ├── UserListScreen   (GET /users?page=1)
                                        ├── UserDetailScreen (GET /users/:id)
                                        └── AddTeammateScreen (POST /users)
```

Planned `src/` layout:
- `api/client.ts` — single `BASE_URL` constant + typed `fetch` wrapper; all API calls go here
- `types/index.ts` — shared TypeScript interfaces for API shapes
- `navigation/AppNavigator.tsx` — stack definition and `RootStackParamList` param types
- `screens/` — one file per screen

The API base is `https://reqres.in/api` (ReqRes public API — no auth required).

## Entry Point

`index.ts` calls `registerRootComponent(App)`. `App.tsx` is the root component.
