# Team Directory — React Native Challenge

A small team directory app built with **Expo SDK 54** (managed workflow) and **TypeScript**. Browse colleagues from the [ReqRes](https://reqres.in/) public API, open a profile, and submit a new teammate form.

---

## Prerequisites

- Node.js 20+
- [Expo Go](https://expo.dev/go) (for physical device) or simulators below
- Xcode 26 (iOS) / Android Studio with API 35 emulator (Android)

---

## API Key

ReqRes now requires an API key. Get one for free at [reqres.in](https://app.reqres.in/) and add it to a `.env` file at the project root:

```
EXPO_PUBLIC_REQRES_API_KEY=your_api_key_here
```

The app reads this via `process.env.EXPO_PUBLIC_REQRES_API_KEY` and sends it as an `x-api-key` header on every request. Without it, all API calls will return `401`.

---

## Install

```bash
npm install
```

---

## Run on iOS

```bash
npm run ios
```

Opens the app directly on the iOS Simulator via Expo.

**Verified on:** iPhone 17 Pro — iOS 26 (Xcode 26)

---

## Run on Android

```bash
npm run android
```

Opens the app directly on the Android Emulator via Expo.

**Verified on:** Medium Phone — API 35 (Android 15, Android Studio)

---

## Run tests

```bash
npm test
```

Runs Jest unit tests for the API client (`src/api/__tests__/client.test.ts`).

---

## Screens

| Screen | Route | Description |
|--------|-------|-------------|
| User List | `UserList` | Fetches `GET /users?page=1`, shows avatar + name + email in a `FlatList` |
| User Detail | `UserDetail` | Fetches `GET /users/:id`, shows full profile |
| Add Teammate | `AddTeammate` | Form that `POST /users` with name + job |

---

## Features implemented

**Core requirements**
- User list with loading, error, and empty states
- User detail with loading and error handling; back navigation via stack header
- Add Teammate form with client-side validation, loading spinner, inline success/error feedback, and auto-dismiss on success

**Bonus**
- **Skeleton loading** — animated placeholder rows while the first fetch is in flight
- **Pull-to-refresh** — swipe down on the list to re-fetch page 1
- **Pagination** — "Load more" button appends subsequent pages using `total_pages` from the API
- **Avatar fallback** — broken image URLs show a grey placeholder (`UserAvatar` component)
- **TypeScript** — strict mode, typed API responses and navigation params throughout
- **Unit tests** — Jest/jest-expo tests covering the API client's `getUsers`, `getUser`, and `createUser` calls
- **Keyboard avoidance** — `KeyboardAvoidingView` on the form screen (iOS `padding` behavior)
- **Accessibility labels** — on list rows (`accessibilityLabel="View profile of …"`) and the submit button
- **Centralized API client** — single `BASE_URL` constant in `src/api/client.ts`; all fetch calls go through one typed `request()` helper
- **Omise branding** — Omise wordmark displayed in the navigation header of the User List screen

---

## Assumptions and trade-offs

- **No local state management library** — `useState` + `useEffect` is sufficient for three screens with independent data needs; adding Redux or Zustand would be premature.
- **Intentional 1 s fetch delay** — ReqRes responds very quickly, so a 1 s delay is added to make the skeleton loader and pull-to-refresh spinner observable. This is deliberate: the skeleton is a bonus UX feature and would be invisible without the delay on a fast API.
- **ReqRes does not persist POST data** — the form submits to the real endpoint and treats the `201` response as success, matching the challenge spec. The new teammate will not appear in the list.
- **API key via env var** — `EXPO_PUBLIC_REQRES_API_KEY` is read from the environment and sent as `x-api-key` on every request. ReqRes recently moved from a public API to requiring a key; without it all requests return `401`.
- **Page 1 only for pull-to-refresh** — refreshing always resets to page 1 and replaces the list, which is the expected behavior for a standard pull-to-refresh pattern.

---

## Project structure

```
src/
  api/
    client.ts          # BASE_URL + typed fetch wrapper; all API calls
    __tests__/
      client.test.ts   # Jest unit tests for the API client
  components/
    UserAvatar.tsx     # Image with broken-URL fallback
  navigation/
    AppNavigator.tsx   # Native stack + RootStackParamList types
  screens/
    UserListScreen.tsx
    UserDetailScreen.tsx
    AddTeammateScreen.tsx
  types/
    index.ts           # Shared TypeScript interfaces for API shapes
App.tsx                # NavigationContainer root
```
