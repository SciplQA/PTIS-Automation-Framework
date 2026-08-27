# PTIS Playwright Commands

Run these commands from the project root:

```powershell
cd C:\Users\Pravin.Tambe\Desktop\PTIS-Automation-Framework
```

## After cloning from GitHub

Run these commands after `git clone` and before the first test run. They install project dependencies and Chromium; they do not perform any GitHub operation.

```powershell
npm install
npx playwright install chromium
Copy-Item .env.example .env
```

Open `.env` and set the real `BASE_URL`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` values. Do not commit `.env` or `.auth/admin.json`.

## First-time setup

Install project dependencies:

```powershell
npm install
```

Install Playwright browsers if needed:

```powershell
npx playwright install chromium
```

Make sure `.env` contains `BASE_URL`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD`.

## Common test commands

Run the complete test suite in Chromium without the separate setup project:

```powershell
npm test
```

Run all tests with the browser visible, using fresh feature logins:

```powershell
npm run test:headed
```

Run only the dashboard tests:

```powershell
npm run test:dashboard
```

Run only the 15 Policy Configuration tests with one login and one shared page:

```powershell
npm run test:policy
```

Run the Policy Configuration tests with the browser visible:

```powershell
npm run test:policy:headed
```

Run all 31 Mouja Master tests with one login and one shared page:

```powershell
npm run test:mouja
```

Run Mouja Master tests with the browser visible:

```powershell
npm run test:mouja:headed
```

Run all Master suites sequentially in one Chromium worker:

```powershell
npm run test:masters
```

Run the single-login Master workflow with the browser visible:

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

Run tests in debug mode:

```powershell
npm run test:debug
```

Run only the authentication setup:

```powershell
npx playwright test --project=setup
```

## Important command difference

Use the normal command when the test needs authentication setup:

```powershell
npm run test:policy
```

The `test:file` script includes `--no-deps`, so it skips the setup project. The active feature suites perform their own login, so this is the normal mode for them:

```powershell
npm run test:file -- tests/property-tax/Masters/policy-configuration.spec.ts
```

The Policy Configuration suite clears storage state, logs in once in `beforeAll`, runs serially on one shared page, and logs out once in `afterAll`. Its npm commands use `--no-deps` so `auth.setup.ts` does not perform a second login.

## Reports

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
| `pages/dashboard/DashboardPage.ts` | Dashboard page actions and Property Tax module navigation |
| `pages/property-tax/Masters/Policy-configuration-master.ts` | Policy selectors and reusable screen actions |
| `fixtures/pageFixtures.ts` | Injects page objects into tests |
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

`playwright.config.ts` has one browser project, `chromium`, and `workers: 1`. The Policy and Mouja feature suites deliberately create one shared page for their serial workflows. The dashboard and other independent tests use fresh pages and log in themselves. This prevents the expired `.auth/admin.json` setup state from blocking the full run.

Do not use one shared page in `beforeAll` for independent tests. That makes later tests depend on earlier tests and can hide failures caused by leftover state.

## Logout behavior

The migrated suites do not call application logout after every test. Each test uses a fresh Playwright page/context, and Playwright closes that context automatically after the test. This is safer than sharing one page across 46 independent cases.

The Policy Configuration and Mouja suites use one shared page and one final UI logout when run individually. `test:masters` uses `masters-sequential.spec.ts`, which is the combined one-login workflow for Construction Type, Mouja, and Policy Configuration. The full command skips the separate setup project, so there is no extra setup login.

## Source versus generated files

The active automation source is under `pages/`, `fixtures/`, and `tests/`. `allure-report/`, `allure-report-current/`, `allure-results/`, `playwright-report/`, and `test-results/` are generated reports or run artifacts. They can be removed and regenerated; they are not needed to execute the tests.

`implementation_plan.md`, `implementation_plan1.md`, `conversation .md`, `Note.md`, and `prompt.md'` are documentation or historical working notes. They are not imported by Playwright and do not affect test execution.
