# Mobile Test Automation Framework — Project Report

**Project:** Appium + WebdriverIO + Cucumber Android Automation Framework  
**Repository:** [https://github.com/carym99/Mobile-Demo](https://github.com/carym99/Mobile-Demo)  
**Author:** Cary M  
**Date:** 27 July 2026  
**Status:** Production-ready — CI/CD enabled

---

## Executive Summary

This report documents the design, implementation, and CI/CD preparation of a portfolio-quality mobile UI automation framework targeting the **Sauce Labs My Demo App RN** on Android. The framework demonstrates Senior QA Automation engineering practices: scalable Page Object Model architecture, behaviour-driven test design, platform-independent configuration, and automated execution via GitHub Actions.

The solution automates **12 test scenarios** across three business domains — Authentication, Product Catalog, and Shopping Cart — with smoke and regression suite support, Allure reporting, and failure screenshot capture.

---

## 1. Objectives

| Objective | Status |
|-----------|--------|
| Build a scalable Appium + WebdriverIO + Cucumber framework | ✅ Complete |
| Implement Page Object Model with reusable base actions | ✅ Complete |
| Automate Authentication, Catalog, and Cart flows | ✅ Complete |
| Remove machine-specific dependencies and hardcoded paths | ✅ Complete |
| Prepare repository for GitHub with professional `.gitignore` | ✅ Complete |
| Implement GitHub Actions CI pipeline with Android emulator | ✅ Complete |
| Integrate Allure reporting with artifact uploads | ✅ Complete |
| Tag-based smoke and regression test execution | ✅ Complete |

**Out of scope (future work):** Checkout flows, logout scenarios, end-to-end purchase journey, cloud device grid (BrowserStack/Sauce Labs).

---

## 2. Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Automation Server | Appium | 3.x |
| Test Client | WebdriverIO | v9 |
| BDD Framework | Cucumber (`@wdio/cucumber-framework`) | 9.x |
| Language | JavaScript (ES Modules) | — |
| Assertions | expect-webdriverio | 5.x |
| Reporting | Spec Reporter + Allure | — |
| CI/CD | GitHub Actions | — |
| Device | Android Emulator (UiAutomator2) | API 34 |
| Target Application | Sauce Labs My Demo App RN | v1.3.0 build-244 |

---

## 3. Framework Architecture

### 3.1 Layered Design

Dependencies flow downward only. Each layer has a single, well-defined responsibility.

```text
Feature Files (Gherkin)
        ↓
Step Definitions (thin orchestration — no locators)
        ↓
Page Objects (locators + business actions)
        ↓
BasePage (shared waits, clicks, typing, swipes)
        ↓
WebdriverIO / Appium
```

### 3.2 Cross-Cutting Concerns

| Component | Responsibility |
|-----------|----------------|
| **Page Object Model** | Encapsulates screen UI and user actions; owns all selectors |
| **BasePage** | Shared primitive actions: `click`, `type`, `waitForElement`, `swipeVertical` |
| **Test Data** | Credentials and product fixtures externalised in `test-data/` |
| **Hooks** | Scenario lifecycle: app reset (`@resetApp`), login (`@authenticated`), screenshots on failure |
| **Configuration** | Centralised in `config/wdio.conf.js` with environment-driven overrides |
| **Reporting** | Spec console output + Allure HTML reports |

### 3.3 Design Principles Applied

- **Page Object Model (POM)** — UI changes require updates in one place only
- **DRY** — Shared logic in `BasePage` and reusable step definitions
- **SRP** — Each page method performs one user-intent action
- **Independent tests** — Scenarios do not depend on execution order
- **Accessibility-first locators** — Stable, intent-based selectors preferred over XPath

---

## 4. Project Structure

```text
appium-demo/
├── .github/
│   ├── scripts/run-android-tests.sh    # CI test execution script
│   └── workflows/mobile-ci.yml         # GitHub Actions pipeline
├── apps/
│   └── Android-MyDemoAppRN.1.3.0.build-244.apk
├── config/
│   └── wdio.conf.js                    # WebdriverIO + Appium configuration
├── features/
│   ├── authentication/login.feature
│   ├── cart/shopping-cart.feature
│   ├── catalog/products.feature
│   ├── step-definitions/               # Domain-mirrored step files
│   └── support/hooks.js
├── pageobjects/
│   ├── BasePage.js
│   ├── LoginPage.js
│   ├── ProductsPage.js
│   ├── ProductDetailsPage.js
│   └── CartPage.js
├── test-data/
│   ├── users.js
│   └── products.js
├── utils/constants.js
├── reports/                            # Allure results + logs (gitignored)
├── screenshots/                        # Failure screenshots (gitignored)
├── README.md
├── PROJECT_CONTEXT.md
└── package.json
```

---

## 5. Test Coverage

### 5.1 Authentication (`login.feature`)

| Scenario | Tags | Description |
|----------|------|-------------|
| Successful login | `@smoke` `@regression` `@resetApp` | Valid user logs in and reaches Products page |
| Locked out user cannot login | `@regression` `@resetApp` | Locked account shows error message |

### 5.2 Product Catalog (`products.feature`)

| Scenario | Tags | Description |
|----------|------|-------------|
| Products page loads | `@smoke` `@regression` `@resetApp` | Validates title, menu, cart icon, product list |
| Verify product information | `@regression` `@resetApp` | Image, name, price on every visible card |
| Open product details and return | `@regression` `@resetApp` | Details page elements and back navigation |
| Browse multiple products | `@regression` `@resetApp` | Open and verify three named products |
| Scroll the product catalog | `@regression` `@resetApp` | Scroll down/up with visibility assertions |
| Product details match catalog | `@regression` `@resetApp` | Name and price consistency catalog ↔ details |

### 5.3 Shopping Cart (`shopping-cart.feature`)

| Scenario | Tags | Description |
|----------|------|-------------|
| Add a product to cart | `@smoke` `@regression` `@resetApp` | Color, quantity, badge, cart totals |
| Update quantity in the cart | `@regression` `@resetApp` | Increase quantity and verify totals |
| Remove product from the cart | `@regression` `@resetApp` | Remove item and verify empty state |
| Add multiple products to the cart | `@regression` `@resetApp` | Multi-SKU cart with combined totals |

**Totals:** 3 feature files · 12 scenarios · 3 smoke · 12 regression

---

## 6. Locator Strategy

| Priority | Strategy | Usage |
|----------|----------|-------|
| 1 | Accessibility ID (`~...`) | Primary — login fields, buttons, screens, cart elements |
| 2 | Resource ID | Used where accessibility ID is unavailable |
| 3 | XPath | Last resort — product rows, logout confirm, named catalog labels |

XPath is used only where accessibility IDs cannot uniquely identify an element (e.g. combining `content-desc` with visible text for a specific product row). All XPath usage is documented in the relevant Page Object with inline comments.

---

## 7. Configuration & Portability

### 7.1 Path Resolution

All file paths use Node.js `path.resolve()` from the project root. No absolute Windows or macOS paths exist in the codebase.

```javascript
'appium:app': path.resolve(projectRoot, 'apps/Android-MyDemoAppRN.1.3.0.build-244.apk')
```

### 7.2 Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `ANDROID_UDID` | `emulator-5554` | Target device UDID |
| `ANDROID_DEVICE_NAME` | `Android Emulator` | Capability device name |
| `APPIUM_HOST` | `127.0.0.1` | Appium server host |
| `APPIUM_PORT` | `4723` | Appium server port |
| `CUCUMBER_TAGS` | _(all)_ | Tag filter for smoke/regression |
| `CI` | `false` | Enables CI-tuned timeouts and log levels |

---

## 8. NPM Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `npm test` | Full suite | Run all feature files |
| `npm run test:smoke` | `@smoke` tag | Critical path (3 scenarios) |
| `npm run test:regression` | `@regression` tag | Full regression (12 scenarios) |
| `npm run test:authentication` | Auth feature only | Login scenarios |
| `npm run test:products` | Catalog feature only | Product catalog scenarios |
| `npm run test:cart` | Cart feature only | Shopping cart scenarios |
| `npm run allure:generate` | Generate HTML report | From `reports/allure-results` |
| `npm run allure:open` | Open report in browser | Local report viewing |

---

## 9. CI/CD Pipeline

### 9.1 Workflow: `.github/workflows/mobile-ci.yml`

**Triggers:** Push to `main`, `master`, `develop` · Pull requests

**Pipeline steps:**

1. Checkout repository
2. Install Node.js LTS with npm dependency caching
3. Install Java 17 (Temurin)
4. Install project dependencies (`npm ci`)
5. Install and verify Appium UiAutomator2 driver
6. Enable KVM for hardware-accelerated emulator
7. Boot Android Emulator (API 34, Pixel 6, x86_64)
8. Wait for emulator boot completion
9. Install demo APK via `adb`
10. Execute WebdriverIO test suite
11. Generate Allure report
12. Upload artifacts: `allure-results`, `allure-report`, `screenshots`, `logs`

**Failure behaviour:** The workflow fails if any test fails (non-zero exit from `npm test`).

### 9.2 Artifact Outputs

| Artifact | Contents |
|----------|----------|
| `allure-results` | Raw Allure JSON results |
| `allure-report` | Generated HTML report |
| `screenshots` | Failure screenshots captured in hooks |
| `logs` | WebdriverIO and Appium server logs |

---

## 10. Architecture Review Findings

### 10.1 Strengths

- Clean separation of concerns across all framework layers
- Thin step definitions with no embedded locators or test data
- Reusable `BasePage` eliminates duplicated wait/click/type logic
- `@resetApp` and `@authenticated` hooks provide reliable scenario isolation
- `failAmbiguousDefinitions: true` prevents silent step definition conflicts
- Platform-independent paths suitable for Windows, macOS, Linux, and CI runners

### 10.2 Improvements Made During CI Preparation

| Item | Action Taken |
|------|--------------|
| Hardcoded paths | Replaced with `path.resolve()` throughout |
| Missing Appium service | Added `@wdio/appium-service` to auto-start Appium |
| No Allure reporter | Wired `@wdio/allure-reporter` in `wdio.conf.js` |
| No CI workflow | Created GitHub Actions pipeline with emulator |
| No smoke/regression tags | Added `@smoke` and `@regression` to all scenarios |
| No failure screenshots | Added screenshot capture in `After` hook |
| Empty utility files | Removed unused `utils/driver.js` and `utils/testData.js` |
| Dead step definitions | Removed unused steps from `products.steps.js` |
| Incomplete `.gitignore` | Replaced with comprehensive Node/Appium/Allure ignores |

### 10.3 Known Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| `@resetApp` on every scenario | Longer CI runtime (~15–25 min) | Smoke suite available for fast feedback |
| XPath for product rows | Fragile if app layout changes | Documented; accessibility IDs used elsewhere |
| Android only | No iOS coverage | Out of scope; architecture supports extension |
| Local emulator first | No cloud grid | Future: BrowserStack/Sauce Labs integration |
| No checkout flow | Incomplete purchase journey | Planned future feature |

---

## 11. Best Practices Compliance

| Practice | Implementation |
|----------|----------------|
| Page Object Model | ✅ All pages extend `BasePage` |
| DRY | ✅ Shared waits, actions, hooks, test data |
| SOLID (SRP) | ✅ One responsibility per page method |
| BDD / Gherkin | ✅ Business-readable scenarios, no technical steps |
| Explicit waits | ✅ `waitForDisplayed` via BasePage; no blind clicks |
| Externalised test data | ✅ `test-data/users.js`, `test-data/products.js` |
| Independent scenarios | ✅ `@resetApp` clears app state between scenarios |
| CI-safe configuration | ✅ Environment variables, portable paths |
| Reporting | ✅ Spec + Allure with CI artifact upload |
| Version control hygiene | ✅ `.gitignore` excludes runtime outputs and secrets |

---

## 12. Repository

| Item | Detail |
|------|--------|
| **URL** | [https://github.com/carym99/Mobile-Demo](https://github.com/carym99/Mobile-Demo) |
| **Branch** | `master` |
| **Initial commit** | `6d4b7aa` — Prepare Appium framework for GitHub CI |

### Committed

- Framework source code (config, features, page objects, test data, utils)
- Demo APK (`apps/Android-MyDemoAppRN.1.3.0.build-244.apk`)
- CI workflow and scripts (`.github/`)
- Documentation (`README.md`, `PROJECT_CONTEXT.md`)
- `package.json`, `package-lock.json`

### Excluded (via `.gitignore`)

- `node_modules/`
- `reports/*`, `screenshots/*` (runtime outputs)
- `.env` (secrets)
- IDE and OS files

---

## 13. How to Run

### Local

```bash
git clone https://github.com/carym99/Mobile-Demo.git
cd Mobile-Demo
npm ci
npm run appium:install-driver
# Start Android emulator (emulator-5554)
npm test
npm run allure:generate
npm run allure:open
```

### CI

Push to `master` or open a pull request. The Mobile CI workflow runs automatically. View results in the **Actions** tab and download artifacts from the completed run.

---

## 14. Future Improvements

1. **Checkout automation** — shipping, payment, order confirmation flows
2. **Logout scenarios** — session teardown validation
3. **End-to-end purchase journey** — login → browse → cart → checkout
4. **Cloud device grid** — BrowserStack or Sauce Labs for parallel execution
5. **GitHub Pages Allure publishing** — hosted report from CI artifacts
6. **Visual regression** — screenshot comparison for UI changes
7. **Expanded test data** — `addresses.js`, `payment.js` fixtures
8. **Git LFS** — optional for APK binary if repository size becomes a concern

---

## 15. Conclusion

The Mobile Demo automation framework is a production-ready, CI-enabled solution that demonstrates industry-standard QA Automation architecture. It provides comprehensive coverage of Authentication, Product Catalog, and Shopping Cart functionality for the Sauce Labs My Demo App RN, with scalable Page Object Model design, behaviour-driven test organisation, Allure reporting, and automated GitHub Actions execution on an Android emulator.

The framework is maintainable, portable across operating systems, and ready for extension into checkout flows and cloud device execution.

---

*Report generated for project submission — Appium Mobile Automation Framework*
