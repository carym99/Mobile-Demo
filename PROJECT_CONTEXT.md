# PROJECT_CONTEXT.md

> AI PERMANENT MEMORY — Read this file before implementing any feature, refactor, or config change.
> This is an architectural contract, not human tutorial documentation.
> Prefer this file over assumptions. Prefer existing code over inventing new patterns.

---

# 1. Project Overview

Portfolio-quality **mobile UI automation framework** for Android.

**Purpose:** Demonstrate Senior QA Automation engineering: scalable Appium + WebdriverIO + Cucumber architecture, maintainable Page Object Model, CI-ready paths, and clear test design.

**Goal:** Build a scalable Appium automation framework that follows industry best practices and remains easy to extend (auth → catalog → cart → checkout → suites → CI).

**Target app:** Sauce Labs My Demo App RN (`apps/Android-MyDemoAppRN.1.3.0.build-244.apk`).

---

# 2. Technology Stack

| Layer | Choice |
|---|---|
| Automation | Appium 3 |
| Client | WebdriverIO v9 |
| BDD | Cucumber (`@wdio/cucumber-framework`) |
| Language | JavaScript **ES Modules** (`"type": "module"`) |
| Device | Android Emulator (`emulator-5554`) |
| Runtime | Node.js + npm |
| Design | Page Object Model (POM) |
| Assertions | expect-webdriverio |
| Config entry | `config/wdio.conf.js` |
| Run command | `npm test` → `npx wdio run ./config/wdio.conf.js` |

**Do not introduce TypeScript. Do not add libraries unless explicitly requested.**

---

# 3. Framework Architecture

Layered design. Dependencies flow **downward only**.

```text
Feature (Gherkin)
    → Step Definitions (thin orchestration)
        → Page Objects (locators + business actions)
            → BasePage (shared waits/actions)
                → WebdriverIO / Appium
```

Cross-cutting:

| Layer | Responsibility |
|---|---|
| **Page Object Model** | Encapsulate screen UI and user actions. Own all selectors. |
| **BasePage** | Shared primitive actions/waits. Extended by every page. |
| **Feature Files** | Business behaviour in Gherkin. No selectors. No technical steps. |
| **Step Definitions** | Map Gherkin → Page Object calls. Thin. No locators. |
| **Test Data** | Credentials, products, addresses, payment — outside steps. |
| **Hooks** | Lightweight Before/After lifecycle, tagging, isolation helpers. |
| **Utilities** | Shared helpers (driver, constants, data accessors). Not page logic. |
| **Reports** | Spec now; Allure/HTML/artifacts later. Keep report dirs stable. |
| **Apps Folder** | APK binaries only. Referenced via `path.resolve`, never absolute OS paths. |

**Config:** Capabilities, reporters, cucumber require paths live in `config/wdio.conf.js`.

---

# 4. Current Folder Structure

```text
appium-demo/
├── apps/
│   └── Android-MyDemoAppRN.1.3.0.build-244.apk
├── config/
│   └── wdio.conf.js
├── features/
│   ├── authentication/
│   │   └── login.feature
│   ├── cart/
│   │   └── shopping-cart.feature
│   ├── catalog/
│   │   └── products.feature
│   ├── step-definitions/
│   │   ├── authentication/
│   │   ├── cart/
│   │   └── catalog/
│   └── support/
│       └── hooks.js
├── pageobjects/
│   ├── BasePage.js
│   ├── LoginPage.js
│   ├── ProductsPage.js
│   ├── ProductDetailsPage.js
│   └── CartPage.js
├── test-data/
│   ├── users.js
│   └── products.js
├── utils/
│   ├── constants.js
│   ├── driver.js
│   └── testData.js
├── reports/
├── package.json
├── PROJECT_CONTEXT.md
└── PROMPT_TEMPLATE.md
```

**Preserve this layout.** Do not move folders without justification in the response.

**Note:** WDIO config lives under `config/`, not project root. App path resolves relative to that file: `../apps/...`.

---

# 5. Coding Standards

Mandatory:

- ES Modules only (`import` / `export`). No CommonJS.
- `async` / `await` only. No callback-style Appium flows.
- Meaningful method names that describe user intent (`login`, `addToCart`).
- No duplicated logic — extract to BasePage or shared utils when reused ≥2 times.
- Prefer reusable methods over copy/paste.
- Keep methods short; one responsibility each (SRP).
- Production-ready code only — no debug leftovers, no commented-out experiments in final output.
- Prefer composition / inheritance from BasePage over reimplementing waits/clicks.
- Match existing file style (quotes, indentation, export patterns).

---

# 6. Page Object Standards

| Rule | Requirement |
|---|---|
| Locators | Inside Page Objects only (getters). |
| Business logic | Inside Page Objects. |
| Steps | Readable English orchestration only. |
| Selectors in steps | **Forbidden.** |
| BasePage | Always extend and reuse. Never reimplement `click`/`type`/waits. |
| Page load | Prefer `waitForPage()` / page-loaded element pattern. |

Step style:

- **GOOD:** `When I login with valid credentials`
- **BAD:** `When I click username` / `When I enter password` / `When I click login`

---

# 7. Locator Strategy

Preferred order:

1. **Accessibility ID** (`$("~...")`) — stable, intent-based, CI-friendly  
2. **Resource ID** — acceptable when accessibility ID missing  
3. **XPath** — last resort only  

**Why:** Accessibility IDs survive layout changes better than brittle XPath; they are readable and align with accessibility quality. XPath is fragile and slower.

**If XPath is used:** Explain why in the Architecture Review section of the response.

Current codebase already prefers accessibility IDs (e.g. `~Username input field`, `~Login button`).

---

# 8. BasePage Responsibilities

`pageobjects/BasePage.js` currently provides:

| Method | Role |
|---|---|
| `waitForElement(element)` | Explicit wait until displayed |
| `click(element)` | Wait + click |
| `type(element, text)` | Wait + clear + setValue |
| `getText(element)` | Wait + getText |
| `isDisplayed(element)` | Safe display check (false on timeout) |
| `waitUntilHidden(element)` | Wait until not displayed |
| `timeout` | Default 10000 ms |

**Rules:**

- Add new BasePage methods only when reusable across multiple pages.
- Do not put screen-specific logic in BasePage.
- Prefer extending BasePage over creating parallel helper classes for clicks/waits.

---

# 9. Feature File Standards

- One feature file ≈ one business capability (auth, catalog, cart, checkout).
- Readable Gherkin; scenarios stay short.
- Reuse existing steps whenever possible.
- No implementation details (no “tap xpath”, no “wait 5 seconds”).
- Group under domain folders: `features/authentication`, `features/catalog`, `features/cart`, etc.

---

# 10. Step Definition Standards

- Keep steps **thin**.
- No locators.
- No business rules beyond mapping data → page methods.
- Import page objects and `test-data/*`.
- Avoid duplicated step logic — share helpers or reuse step text.
- Mirror feature domain folders under `features/step-definitions/`.

---

# 11. Test Data Strategy

Location: `test-data/`

| File | Purpose |
|---|---|
| `users.js` | Credentials (valid, lockedOut, …) — **exists** |
| `products.js` | Product names/SKUs — add when needed |
| `addresses.js` | Shipping addresses — add when needed |
| `payment.js` | Payment fixtures — add when needed |

Rules:

- Export structured objects (named keys), not magic strings in steps.
- No hardcoded usernames/passwords/product names inside step definitions.
- Prefer importing from `test-data/` over `utils/testData.js` for fixtures; keep utils for accessors/helpers only.

Current `users.js` keys: `users.valid`, `users.lockedOut`.

---

# 12. Hooks Strategy

File: `features/support/hooks.js`

Current: lightweight `Before` / `After` logging of scenario names.

Expected evolution (when needed):

| Hook | Purpose |
|---|---|
| `Before` | Scenario start logging, reset state if required |
| `After` | Cleanup, screenshots on failure (future) |
| `@Before` tags | Conditional setup (e.g. `@authenticated`) |
| Scenario isolation | Each scenario independent; avoid leaked cart/session state |
| Auth hooks | Login via page objects + test-data when tag requires authenticated user |

**Hooks must stay lightweight.** Heavy flows belong in page objects or dedicated helpers — not giant hooks.

---

# 13. CI/CD Standards

Mandatory path rules:

- APK lives in `apps/`.
- Resolve with Node `path` APIs — **never** `C:\Users\...`.
- Prefer `path.resolve(__dirname, ...)` from the config file (ESM: rebuild `__dirname` via `import.meta.url`).
- `process.cwd()` acceptable when intentionally project-root relative and documented.
- Paths must work on Windows, macOS, Linux, and GitHub Actions runners.

Current app capability:

```js
'appium:app': path.resolve(__dirname, '../apps/Android-MyDemoAppRN.1.3.0.build-244.apk')
```

Device capability currently pins `appium:udid: 'emulator-5554'` — accept for local; make env-driven when adding CI.

---

# 14. Reporting

| Status | Tool |
|---|---|
| Current | Spec Reporter (`reporters: ['spec']`) |
| Future | Allure (deps partially present: `allure-commandline`; npm script `allure` exists — **not wired in wdio reporters yet**) |
| Future | HTML reports |
| Future | GitHub Actions artifacts from `reports/` |

Do not break Spec Reporter when adding reporters. Keep `reports/` as the output root.

---

# 15. Error Handling Strategy

- Prefer **explicit waits** (`waitForDisplayed`, BasePage helpers).
- **Forbidden:** fixed `browser.pause(...)` / sleep-based sync unless justified as last resort.
- Failures should surface meaningful messages (assertion text / thrown errors that name the expected UI state).
- Use BasePage waits before interactions; do not click blindly.
- Catch only when converting timeout → boolean (`isDisplayed`) or enriching errors — never swallow failures silently in steps.

---

# 16. Naming Conventions

| Kind | Convention | Examples |
|---|---|---|
| Page Objects | PascalCase + `Page` suffix | `LoginPage`, `ProductsPage`, `CartPage` |
| Page files | Match class name | `LoginPage.js` |
| Methods | camelCase verb phrases | `login()`, `logout()`, `addToCart()` |
| Selector getters | camelCase noun + role | `loginButton`, `usernameInput`, `passwordInput` |
| Features | kebab-case capability | `login.feature`, `add-to-cart.feature` |
| Steps files | domain + `.steps.js` | `login.steps.js`, `cart.steps.js` |
| Test data keys | camelCase intent | `valid`, `lockedOut` |

---

# 17. Automation Design Principles

- **Independent tests** — scenarios must not rely on execution order.
- **Reusable code** — BasePage + shared steps + test-data.
- **Maintainability** — change a locator once (in the page object).
- **Scalability** — domain folders for features/steps/pages as the suite grows.
- **Readability** — Gherkin reads as product behaviour.
- **Minimal duplication** — extend, don’t copy.
- **Production-ready architecture** — CI-safe paths, no local-machine assumptions, no TS/iOS scope creep without request.

If a requested design is weaker than an existing pattern, **recommend the better approach first**, then implement the recommended approach.

---

# 18. Current Project Status

Checklist for AI planning (update this section when capabilities land):

- ✅ Appium configured (`appium` dep + WDIO local runner)
- ✅ Emulator capability configured (`UiAutomator2`, `emulator-5554`)
- ✅ CI-friendly APK path via `apps/` + `path.resolve`
- ✅ BasePage created with core actions/waits
- ✅ Authentication automation (`login.feature`: successful login + locked-out user)
- ✅ Product Catalog automation (`products.feature`: load, info, details, browse, scroll, consistency)
- ✅ Shopping Cart automation (`shopping-cart.feature`: add, update qty, remove, multi-product)
- ✅ `@authenticated` hook for login reuse where login is required (e.g. catalog)
- ✅ Cart scenarios use `@resetApp` only — guest users can add to cart without login
- ✅ `test-data/products.js` for catalog fixtures
- ⬜ Checkout flows
- ⬜ Logout flows
- ⬜ End-to-End Purchase journey
- ✅ Smoke Suite tagging (`@smoke`)
- ✅ Regression Suite tagging (`@regression`)
- ✅ Allure reporter wired in `wdio.conf.js`
- ✅ GitHub Actions workflow (`.github/workflows/mobile-ci.yml`)
- ✅ Env-driven device/UDID/app path for CI (`ANDROID_UDID`, `APPIUM_HOST`, `APPIUM_PORT`)
- ✅ Screenshot-on-failure in hooks
- ⬜ Expanded test-data (`addresses.js`, `payment.js`)

---

# 19. Known Constraints

- **No TypeScript** — JavaScript ESM only.
- **Android only** — no iOS support yet.
- **Local emulator first** — no BrowserStack/Sauce/cloud device grid yet.
- **Do not add dependencies** unless requested.
- **Do not break working auth/catalog/cart flows** while extending.
- **Do not rename/move core folders** without explicit architectural justification.
- WDIO config is under `config/` (not root) — preserve unless migrating deliberately.

---

# 20. Instructions for Future AI Sessions

Before writing code:

1. Read **this file** (`PROJECT_CONTEXT.md`) and the relevant existing sources.
2. Review architecture; call out improvements and risks before coding.
3. Prefer extending existing Page Objects / BasePage / steps over new patterns.
4. Never duplicate existing functionality.
5. Never change architecture without justification in the response.
6. Never break existing working functionality.
7. Never hardcode absolute Windows paths.
8. Never put selectors in step definitions.
9. Never hardcode test data in steps — use `test-data/`.
10. Prefer Accessibility ID → Resource ID → XPath.
11. Keep steps thin; keep pages rich; keep hooks light.
12. When the requested design is not production-ready, **stop, propose the better approach, then implement the better approach**.
13. Output only modified files’ full contents; do not regenerate unchanged files.
14. After meaningful framework milestones, update **Section 18 (Current Project Status)** in this file.


**This document is the permanent architectural reference for the project.**

---

# Decision Log

This section records important architectural decisions.

## Decision 001

Created an `apps` folder at the project root.

Reason:
To support CI/CD and eliminate machine-specific absolute paths.

---

## Decision 002

Reused BasePage across all Page Objects.

Reason:
To centralize common actions and reduce duplication.

---

## Decision 003

Organized features by business capability.

Examples:

authentication/

products/

cart/

checkout/

Reason:
Improves maintainability and scalability.

---

## Decision 004

Keep each Cucumber step definition unique across the suite. Shared steps live in one file only (e.g. `login.steps.js`); domain-specific steps stay in their own files. Enable `failAmbiguousDefinitions: true`. For ESM, load support code via `cucumberOpts.import` with `path.resolve`.

Reason:
Duplicate step text is reported as AMBIGUOUS and shown as “skipped” by the Spec reporter, which silently breaks scenarios.

---

## Decision 005

Merged authentication scenarios into `features/authentication/login.feature` and reset app data in a `Before` hook via `mobile: clearApp` + `activateApp`.

Reason:
One feature file per business capability. App session/auth survives `terminateApp`, so clearing app data is required for independent scenarios in the same feature.

---

## Decision 006

Scoped app data reset to scenarios tagged `@resetApp` (Authentication). Other features only wait for the Products screen after session launch.

Reason:
Global `clearApp` made the full suite slow and fragile on cold starts while only Authentication needed cross-scenario isolation.

---

## Decision 007

Expanded cart coverage into `shopping-cart.feature` with `@resetApp`, rich `CartPage` / `ProductDetailsPage` APIs, and `test-data/products.js`. Added `BasePage.getChildText()` for nested TextView labels. Cart does not require `@authenticated` because the app allows guest checkout/cart use.

Reason:
Demonstrate realistic cart journeys while keeping steps thin and preparing reusable page methods for checkout.

---

## Decision 008

Expanded `products.feature` into a full Product Catalog suite. Added catalog introspection helpers on `ProductsPage`, details validators on `ProductDetailsPage`, and `BasePage.swipeVertical()` for list scrolling.

Reason:
Validate listing quality (title, cards, scroll, catalog↔details consistency) without duplicating cart/auth flows.

---

## Decision 009

Hardened `@resetApp` with terminate → clearApp → activate, a recover path, longer `APP_LAUNCH_TIMEOUT` (90s), and idempotent `@authenticated` via `ProductsPage.isLoggedIn()`.

Reason:
Long suites with many clearApp cycles can stall UiAutomator2; soft recovery must not fail when a session is already authenticated.

---

(Add future architectural decisions here.)
