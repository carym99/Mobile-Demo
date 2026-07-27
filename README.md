# Appium Mobile Automation Framework

Production-ready Android UI automation framework built with **Appium 3**, **WebdriverIO v9**, and **Cucumber**. Demonstrates Senior QA Automation practices: Page Object Model, BDD test design, CI/CD integration, and Allure reporting.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Automation Server | Appium 3 |
| Test Client | WebdriverIO v9 |
| BDD Framework | Cucumber (`@wdio/cucumber-framework`) |
| Language | JavaScript (ES Modules) |
| Assertions | expect-webdriverio |
| Reporting | Spec Reporter + Allure |
| CI/CD | GitHub Actions |
| Target App | Sauce Labs My Demo App RN |

## Architecture

```text
Feature (Gherkin)
    → Step Definitions (thin orchestration)
        → Page Objects (locators + business actions)
            → BasePage (shared waits/actions)
                → WebdriverIO / Appium
```

**Design principles:** Page Object Model, DRY, independent scenarios, accessibility-first locators, platform-independent paths, and environment-driven configuration for local and CI execution.

## Folder Structure

```text
appium-demo/
├── .github/
│   ├── scripts/
│   │   └── run-android-tests.sh    # CI test runner script
│   └── workflows/
│       └── mobile-ci.yml           # GitHub Actions pipeline
├── apps/
│   └── Android-MyDemoAppRN.1.3.0.build-244.apk
├── config/
│   └── wdio.conf.js                # WebdriverIO + Appium + Cucumber config
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
│   └── constants.js
├── reports/                        # Allure + WDIO logs (gitignored)
├── screenshots/                    # Failure screenshots (gitignored)
├── package.json
├── PROJECT_CONTEXT.md              # Architectural reference
└── README.md
```

## Prerequisites

- **Node.js** 20 LTS or newer
- **Java** 17+ (required by Android SDK / Appium)
- **Android SDK** with platform tools and emulator
- **Android Emulator** running (default UDID: `emulator-5554`)

## Installation

```bash
git clone <repository-url>
cd appium-demo
npm ci
npm run appium:install-driver
```

Ensure an Android emulator is running before executing tests:

```bash
adb devices
```

## Running Tests

| Command | Description |
|---------|-------------|
| `npm test` | Run the full test suite |
| `npm run test:smoke` | Run `@smoke` scenarios only |
| `npm run test:regression` | Run all `@regression` scenarios |
| `npm run test:authentication` | Authentication feature only |
| `npm run test:products` | Product catalog feature only |
| `npm run test:cart` | Shopping cart feature only |

### Examples

```bash
# Full suite
npm test

# Smoke suite (login + catalog load + add to cart)
npm run test:smoke

# Regression suite
npm run test:regression

# Single feature
npm run test:cart
```

### Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `ANDROID_UDID` | `emulator-5554` | Device UDID |
| `ANDROID_DEVICE_NAME` | `Android Emulator` | Capability device name |
| `APPIUM_HOST` | `127.0.0.1` | Appium server host |
| `APPIUM_PORT` | `4723` | Appium server port |
| `CUCUMBER_TAGS` | _(all)_ | Cucumber tag expression |

## Allure Reports

```bash
# Run tests first, then generate and open the report
npm test
npm run allure:generate
npm run allure:open
```

Reports are written to:

- `reports/allure-results/` — raw results
- `reports/allure-report/` — generated HTML report

## GitHub Actions

The workflow [`.github/workflows/mobile-ci.yml`](.github/workflows/mobile-ci.yml) runs on **push** and **pull_request**:

1. Installs Node.js LTS and caches npm dependencies
2. Installs Java 17
3. Installs project dependencies and Appium UiAutomator2 driver
4. Boots an Android emulator (API 34, x86_64)
5. Installs the demo APK
6. Executes the WebdriverIO test suite
7. Generates Allure report
8. Uploads artifacts: `allure-results`, `allure-report`, `screenshots`, `logs`

The pipeline **fails if any test fails**.

## Screenshots

<!-- Replace with actual screenshot paths after first run -->
| Screen | Preview |
|--------|---------|
| Products Catalog | _Add `docs/screenshots/products.png`_ |
| Product Details | _Add `docs/screenshots/product-details.png`_ |
| Shopping Cart | _Add `docs/screenshots/cart.png`_ |
| Allure Report | _Add `docs/screenshots/allure-report.png`_ |

## Test Coverage

| Domain | Feature File | Scenarios |
|--------|--------------|-----------|
| Authentication | `login.feature` | Successful login, locked-out user |
| Product Catalog | `products.feature` | Load, info validation, browse, scroll, consistency |
| Shopping Cart | `shopping-cart.feature` | Add, update quantity, remove, multi-product |

## Future Improvements

- Checkout and end-to-end purchase flows
- Logout scenarios
- BrowserStack / Sauce Labs cloud device grid
- Parallel execution across multiple emulators
- Visual regression testing
- GitHub Pages Allure report publishing

## License

MIT (or your chosen license)
