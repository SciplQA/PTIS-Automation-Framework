# PTIS Playwright Commands

## Install from GitHub

### Prerequisites

- Git
- Node.js 20 LTS or newer (includes npm)

Clone the repository and enter its folder:

```powershell
git clone https://github.com/SciplQA/PTIS-Automation-Framework.git
cd PTIS-Automation-Framework
```

Install the exact package versions from `package-lock.json`, install Chromium,
and create the local environment file:

```powershell
npm ci
npx playwright install chromium
Copy-Item .env.example .env
```

Open `.env` and set `BASE_URL`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` for the
environment you will test. Never commit `.env` or `.auth/`.

For an existing local clone, use the same commands after pulling dependency
changes. Use `npm install` instead of `npm ci` only when intentionally updating
dependencies.

## First verification

Run the login checks in a visible, maximized Chromium window:

```powershell
npx playwright test tests/auth/login.spec.ts --project=chromium --no-deps --headed
```

## Common test commands

Run the complete test suite in Chromium without the separate setup project:

```powershell
npm test
```

Run all tests with the browser visible in one maximized Chromium window:

```powershell
npm run test:headed
```

Run only the dashboard tests:

```powershell
npm run test:dashboard
```

Run only the 15 Policy Configuration tests with one shared login:

```powershell
npm run test:policy
```

Run the Policy Configuration tests with the browser visible:

```powershell
npm run test:policy:headed
```

Run all 31 Mouja Master tests with one shared login:

```powershell
npm run test:mouja
```

Run Mouja Master tests with the browser visible:

```powershell
npm run test:mouja:headed
```

Run all 43 Social Attribute Master tests with the shared PTIS login:

```powershell
npm run test:social
```

Run Social Attribute Master tests with the browser visible:

```powershell
npm run test:social:headed
```

Run all 37 Tax Zone Master tests with the shared PTIS login:

```powershell
npm run test:tax-zone
```

Run Tax Zone Master tests with the browser visible:

```powershell
npm run test:tax-zone:headed
```

Run all 14 Tax Zoning tests with the shared PTIS login:

```powershell
npm run test:tax-zoning
```

Run Tax Zoning tests with the browser visible:

```powershell
npm run test:tax-zoning:headed
```

Run all Master suites with one shared PTIS login. The first internal Master
suite logs in and enters Property Tax; later Master files reuse that same page,
navigate through the sidebar, and log out only after the final Master suite:

```powershell
npm run test:masters
```

Run all Master suites with the browser visible in one shared session:

```powershell
npm run test:masters:headed
```

Run one test by its title:

```powershell
npx playwright test tests/property-tax/Masters/policy-configuration.spec.ts --project=chromium -g "TC03 - Search with invalid code"
```

Run one test file with the browser visible:

```powershell
npx playwright test tests/property-tax/Masters/policy-configuration.spec.ts --project=chromium --headed
```

Run Mouja TC30 and TC31 only:

```powershell
npx playwright test tests/property-tax/Masters/mouja-master.spec.ts --project=chromium --no-deps --headed -g "TC(30|31)"
```

Run Mouja TC30/TC31 followed by all Policy tests in one shared session:

```powershell
npx playwright test tests/property-tax/Masters/mouja-master.spec.ts tests/property-tax/Masters/policy-configuration.spec.ts --project=chromium --no-deps --headed -g "TC(30|31)|Policy Configuration Master.*TC(0[1-9]|1[0-5])"
```

Run tests in debug mode:

```powershell
npm run test:debug
```

Run only the authentication setup:

```powershell
npx playwright test --project=setup
```

## Important command difference

`--no-deps` skips the separate `auth.setup.ts` project. The internal Property
Tax suites use their own shared worker session, so this is the normal mode for
running a selected feature file:

```powershell
npm run test:file -- tests/property-tax/Masters/policy-configuration.spec.ts
```

When more than one internal feature file is selected in the same command,
`internalSessionFixtures.ts` logs in once, keeps the same page while the files
navigate through the visible PTIS sidebar, and logs out once at the end.

## Reports

Every Playwright command now clears `allure-results/` before execution, so a
new report contains only the current run. Generate a fresh static Allure report:

```powershell
npm run allure:generate
```

Open the latest HTML report:

```powershell
npx playwright show-report
```

Serve the Allure report:

```powershell
npm run allure:serve
```

Open the existing Allure report:

```powershell
npm run allure:open
```

Remove both the raw Allure results and generated report manually:

```powershell
npm run allure:clean
```

## Useful maintenance commands

List all discovered tests without running them:

```powershell
npx playwright test --list
```

List only Policy Configuration tests:

```powershell
npx playwright test tests/property-tax/Masters/policy-configuration.spec.ts --list
```

Delete generated Playwright result folders before a clean run:

```powershell
Remove-Item -Recurse -Force test-results, playwright-report -ErrorAction SilentlyContinue
```

## Folder and file meaning

| Path | Purpose |
|---|---|
| `tests/dashboard/dashboard.spec.ts` | Two dashboard and Property Tax navigation tests |
| `tests/property-tax/Masters/policy-configuration.spec.ts` | The 15 Policy Configuration test cases |
| `tests/property-tax/Masters/mouja-master.spec.ts` | The 31 Mouja Master test cases |
| `tests/property-tax/Masters/social-attribute.spec.ts` | The 43 Social Attribute Master test cases |
| `tests/property-tax/Masters/tax-zone.spec.ts` | The 37 Tax Zone Master test cases |
| `tests/property-tax/Masters/tax-zoning.spec.ts` | The 14 Tax Zoning workflow test cases |
| `pages/dashboard/DashboardPage.ts` | Dashboard page actions and Property Tax module navigation |
| `pages/property-tax/Masters/Policy-configuration-master.ts` | Policy selectors and reusable screen actions |
| `pages/property-tax/Masters/SocialAttributeMasterPage.ts` | Social Attribute selectors and reusable screen actions |
| `pages/property-tax/Masters/TaxZonePage.ts` | Tax Zone selectors and reusable screen actions |
| `pages/property-tax/Masters/TaxZoningPage.ts` | Tax Zoning selectors and reusable screen actions |
| `fixtures/pageFixtures.ts` | Injects page objects into independent tests |
| `fixtures/internalSessionFixtures.ts` | One shared login/page for internal Property Tax suites |
| `tests/auth/auth.setup.ts` | Logs in and creates `.auth/admin.json` |
| `playwright.config.ts` | Chromium project, one worker, reporters, base URL, and setup dependency |
| `test-results/` | Failure screenshots, videos, traces, and result artifacts |
| `playwright-report/` | HTML report |
| `allure-results/` | Raw Allure result files |

## Policy file clarification

There are two TypeScript files related to Policy Configuration, but they have different responsibilities:

1. `tests/property-tax/Masters/policy-configuration.spec.ts` is the test file. It contains the 15 test cases and assertions.
2. `pages/property-tax/Masters/Policy-configuration-master.ts` is the page object. It contains locators and methods used by the tests.

This separation is correct. Keep test cases in `tests/` and UI selectors/actions in `pages/`. Do not place both responsibilities in one file.

## Single-browser behavior

`playwright.config.ts` has one browser project, `chromium`, and `workers: 1`.
Headed runs open Chromium maximized. Login and dashboard validations remain
independent; Construction Type, Mouja, Policy Configuration, and future
internal screen files use the worker-scoped shared session.

Do not use one shared page in `beforeAll` for independent tests. That makes later tests depend on earlier tests and can hide failures caused by leftover state.

## Logout behavior

Construction Type, Mouja, and Policy Configuration use `fixtures/internalSessionFixtures.ts`. This worker-scoped fixture logs in once, enters Property Tax once, shares the same page across the internal test files, and logs out once after the final internal suite. Each screen's test file only navigates to its own sidebar route; it must not add its own login or logout. With the configured `workers: 1`, this also applies when `npm run test:headed` runs the complete suite: login screen tests remain independent, then the internal Master suites share one authenticated session.

## Source versus generated files

The active automation source is under `pages/`, `fixtures/`, and `tests/`. `allure-report/`, `allure-report-current/`, `allure-results/`, `playwright-report/`, and `test-results/` are generated reports or run artifacts. They can be removed and regenerated; they are not needed to execute the tests.

`implementation_plan.md`, `implementation_plan1.md`, `conversation .md`, `Note.md`, and `prompt.md'` are documentation or historical working notes. They are not imported by Playwright and do not affect test execution.
