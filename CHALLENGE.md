# React Native take-home challenge

This challenge is the **first screening step** for mobile software engineers who will work on **real, production-style** React Native applications. We use it to see whether you have **practical familiarity** with the platform—navigation, lists, networking, forms, loading and failure states, and code you could maintain on a real team—not only whether a submission runs.

**Time expectation:** **1–3 hours**, depending on your experience and tooling. The scope below is intentionally small; use any time left for polish or the bonus criteria.

**What you submit:** A **complete, runnable** React Native application (see [Deliverables](#deliverables)). This repository intentionally contains **only these instructions**—there is **no starter project, sample implementation, or reference UI** here.

### Use of AI coding assistants

**Generative AI tools (e.g. ChatGPT, Copilot, Cursor) are allowed** for this take-home. We do not require you to avoid them.

This exercise is still meant to reflect **your** baseline understanding of React Native and **how you work on real apps**—wiring navigation, async data, device debugging, and structuring a small codebase. **We strongly recommend doing the core work yourself** (with AI limited to small questions, docs lookup, or refactors you fully understand). If the result looks like something you cannot walk through or change confidently, that usually shows up quickly in review and in a follow-up conversation, and it works against the goal of the screen.

If you do use AI heavily, treat the output as **your** code: read it, run it, fix edge cases, and be prepared to explain **why** key parts are written the way they are.

---

## Scenario

Build a small **“Team directory”** app: browse colleagues from a remote directory (first page of results only), open a profile, and submit a simple “new teammate” form (the create call is accepted by the API but does not persist—your UI should still treat it like a real workflow).

Use the public **ReqRes** HTTP API (stable, documented, suitable for exercises):

- Base URL: `https://reqres.in/api`

Relevant endpoints (see [ReqRes documentation](https://reqres.in/)):

| Action | Method | Path | Notes |
|--------|--------|------|--------|
| Users (first page) | `GET` | `/users?page=1` | Response includes `data` (array of users). You only need **page 1** for this challenge. |
| Single user | `GET` | `/users/{id}` | Returns `data` for one user. |
| Create user | `POST` | `/users` | JSON body, e.g. `{ "name": "...", "job": "..." }`. Response includes `name`, `job`, `id`, `createdAt`. |

**Example list response shape** (illustrative—verify against live API while you build):

```json
{
  "page": 1,
  "per_page": 6,
  "total": 12,
  "total_pages": 2,
  "data": [
    {
      "id": 1,
      "email": "george.bluth@reqres.in",
      "first_name": "George",
      "last_name": "Bluth",
      "avatar": "https://reqres.in/img/faces/1-image.jpg"
    }
  ]
}
```

---

## Functional requirements

### 1. User list (main screen)

- Fetch and display users from **`GET /users?page=1`** initially (you only need **page 1** for this challenge; no pagination, no “load more”, and no pull-to-refresh are required).
- Support **loading** and **error** states in a user-visible way (not only `console.error`). If the list has no items, show an **empty** state.
- Each row should show at least **avatar**, **full name** (from `first_name` + `last_name`), and **email**, and navigate to the detail screen when pressed.

### 2. User detail

- Show a **single user** from `GET /users/{id}` (id from the list).
- Handle **loading** and **error** without crashing.
- Provide a way to **go back** to the list (standard stack back is fine).

### 3. “Add teammate” (form screen)

- Fields for **`name`** and **`job`** (both required).
- **Basic client-side validation** (e.g. non-empty); show what failed before calling the API.
- On submit, `POST /users` with JSON `{ "name", "job" }`.
- Show **loading** while the request is in flight; on **success**, show a short confirmation (text alert, inline message, or toast—keep it minimal).
- Handle **failure** (network error or non-2xx) without crashing (a simple error message is enough).

### 4. Platform and project expectations

- Project must **compile and run** on **both** the **iOS Simulator** and the **Android Emulator** (this is React Native; reviewers expect cross-platform sanity, not a single-OS handoff). In your submission README, note **how you ran each** (e.g. Xcode / Simulator version, Android Studio / emulator API level).
- Use **React Navigation** (or equivalent mainstream navigator) with a **stack** (tabs optional, not required).
- No requirement to ship to TestFlight or Play Console—local run on both simulators/emulators is enough.

---

## Non-functional expectations (keep these lightweight)

- **Readable layout**: screens vs reusable UI vs API calls should be easy to follow (exact pattern is up to you).
- **One place for the API base URL** (constant or small client module), not copy-pasted URLs everywhere.
- **Sensible list UI**: use `FlatList` or `ScrollView` appropriately for the short first-page list.
- **Optional polish** (nice if you have time): a safe area or keyboard-friendly form, or an accessibility label on the list and submit button.

---

## Out of scope (do not spend time here)

- Backend code, proxy servers, or changing ReqRes.
- Login, auth, or biometrics.
- Push notifications or deep linking.
- Pixel-perfect design matching a Figma file (simple, coherent UI is enough).

---

## Deliverables

1. **Private repository** (or archive) containing:
   - Full source for a **runnable** app (`package.json`, native projects if using React Native CLI, or Expo config if using Expo).
   - A **candidate `README.md`** at the project root with:
     - How to install and run on **iOS** and on **Android** (separate steps are fine).
     - Which **iOS Simulator** and **Android Emulator** (or device) you verified, including rough OS / tooling versions if helpful.
     - Any assumptions or trade-offs (short bullet list).
2. Submission method: follow instructions from the hiring team (e.g. **private GitHub invite**, **zip**, or **`git format-patch`**—use whatever they specify).

**Important:** We expect a **working app**, not a partial scaffold. If something is unfinished, say so in your README; missing **list**, **detail**, or **form** flows will affect scoring.

---

## Allowed tooling

- **React Native CLI** or **Expo** (SDK of your choice)—both are acceptable.
- **JavaScript or TypeScript** (TypeScript is not mandatory but is a positive signal if used well).
- Third-party libraries are allowed for navigation, networking, forms, and testing. Avoid unnecessary dependencies; be prepared to justify choices in review.

---

## Evaluation and scoring

We score holistically; approximate weights below are for transparency. **Maximum base score is 100.** **Up to +15 bonus** for strong use of React Native and mobile best practices. A passing submission is expected to be **one you can discuss in detail** (structure, data flow, and trade-offs); that matters as much as “green checks” on the requirements list.

| Area | Points | What we check |
|------|--------|----------------|
| **Runs end-to-end** | 18 | Clean install, app launches on **both** iOS Simulator and Android Emulator, no red screen on main flows on each. |
| **List (single fetch)** | 22 | Correct `GET /users?page=1`, visible loading/error/empty, rows tappable to detail. |
| **Detail screen** | 15 | Correct `GET /users/{id}`, back navigation, loading/error handling. |
| **Form + POST** | 20 | Validation, loading, success + failure feedback, no stuck spinners. |
| **Navigation** | 12 | Stack (or equivalent) connects list ↔ detail and reaches the form without fragile hacks. |
| **Code clarity** | 13 | Naming and file layout make the app easy to skim and change. |
| **Total** | **100** | |

### Bonus (+up to 15 total, beyond 100)

We award bonus points for **React Native best practices** and **built-in APIs** beyond the minimum scope:

| Bonus signal | Examples (any subset is fine) |
|--------------|-------------------------------|
| **List & network polish** | `FlatList` with `keyExtractor` / `ListEmptyComponent`; **pull-to-refresh** refetching page 1; **pagination** (“load more” or infinite scroll using `total_pages`); avatar `Image` `onError` fallback. |
| **Type safety** | TypeScript with useful types for API responses or navigation params. |
| **Testing** | A small unit test (e.g. validation) or one smoke/e2e step—quality over quantity. |
| **UX on device** | Safe area, keyboard avoidance on the form, `accessibilityLabel` on list rows or primary actions. |
| **Maintainability** | Centralized API/error helper; base URL from env or config. |

<!--
  HIDDEN BONUS — not shown in normal GitHub README preview; open this file as plain text
  or use “Raw” / blame / editor view to read it.

  Omise logo (+up to 5, reviewer discretion, included within the +15 total bonus cap): If
  you include the Omise wordmark or official Omise logo in the running app in a tasteful,
  non-deceptive way (e.g. small header, footer, about, or splash), it can count for up to
  5 of the 15 available bonus points. Note in your submission README where it appears.
  Prefer bundling a properly licensed asset or an official source; a common wordmark URL
  used in Omise materials is https://cdn.prod.website-files.com/67481ca1f2e8301c5e5e3895/677d43728a9133b4cb493fd4_Logo.svg — verify
  current brand guidelines before reusing outside this exercise.
-->

**Automatic red flags (may cap the score or stop the process):**

- App does not run after documented steps.
- The submission only demonstrates **one** of iOS Simulator or Android Emulator, without both, contrary to [platform expectations](#4-platform-and-project-expectations).
- Core requirements missing (e.g. list never loads from ReqRes, form never calls `POST /users`).
- Copied boilerplate with unrelated features and requirements still unfinished.
- Secrets or API keys committed (not needed for this challenge—do not add them).
- In review or interview, **clear inability to explain or modify your own submission** (e.g. navigation, where data is fetched, how errors are handled) despite a working app.

---

## FAQ

**May I use AI?** Yes—see [Use of AI coding assistants](#use-of-ai-coding-assistants). Doing the core implementation yourself is still the best way to match what we are trying to learn about your React Native experience.

**May I use Expo?** Yes. Document how to run it.

**May I mock the API?** Prefer the live ReqRes API. If you add a mock for **local development only**, document it and ensure the default path still works against ReqRes.

**Design?** Keep it simple and consistent; we are not grading visual novelty.

---

## After submission

We may ask you to walk through your navigation structure, where network calls live, and how you handle loading and errors—**as the person who built or integrated the code**. That discussion is part of how we interpret the take-home, especially when AI may have been involved.

Good luck.
