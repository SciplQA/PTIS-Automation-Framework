# Migration Plan

## Safety principles

- Refactor one module at a time.
- Establish a passing baseline before editing a module.
- Preserve selectors and behavior until replacement tests pass.
- Keep a TC traceability table during every migration.
- Do not combine framework redesign and application-behavior changes in one
  step.
- Commit or checkpoint after each accepted phase so rollback is straightforward.

## Phase 0 — Agree on policy

Discuss and record decisions from `README.md`, especially:

- Regression versus journey execution lanes.
- Test-data retention and cleanup.
- Treatment of no-assertion and wait-only cases.
- Approved seeded records for update scenarios.

No production test files change during this phase.

## Phase 1 — Foundation

1. Add shared authentication-state and Property Tax fixtures.
2. Keep the current one-login fixture available for journey tests.
3. Add reusable data factory and cleanup registry.
4. Add common drawer, confirmation, and pagination helpers where justified.
5. Define tags such as `@smoke`, `@regression`, `@crud`, and `@journey`.
6. Add commands for each lane.

Acceptance criteria:

- Existing tests continue to run.
- Login is not repeated unnecessarily.
- A forced test failure still allows safe browser teardown.

## Phase 2 — Tax Zone pilot

Tax Zone is the recommended pilot because it exercises search, create, edit,
status, pagination, drawers, confirmation, and cleanup.

Proposed split:

- `page-load-and-search.spec.ts`: current TC01–TC05.
- `create-and-delete.spec.ts`: current TC06–TC10 and TC34–TC37.
- `edit.spec.ts`: current TC11–TC16 and TC27–TC33.
- `pagination.spec.ts`: current TC17–TC24.

Required improvements:

- Replace fixed waits with UI-state waits.
- Stop modifying hardcoded record `708525` without restoration.
- Make creation and deletion one recoverable workflow.
- Map all 37 TC identifiers to the new tests.

Acceptance criteria:

- Each regression spec runs independently.
- All approved Tax Zone behaviors pass.
- Generated records are removed even when an assertion fails.
- The journey suite can still navigate into and out of Tax Zone.

## Phase 3 — Social Attribute

Proposed split:

- Page load and search.
- Create Social Attribute.
- Edit/status/unit workflows.
- Pagination and filters.
- Language-switching journey.

Special attention:

- TC13–TC17 currently include message/wait-only cases that should be merged
  with the filter workflow or retired after approval.
- Language must always return to English in guaranteed cleanup.
- Updated seeded records must be restored.

## Phase 4 — Mouja Master

- Separate search, drawer validation, creation, and duplicate validation.
- Remove remaining cross-test dependency on `MJTEST1234`.
- Ensure created records have an agreed cleanup policy.
- Keep search-result waits based on rendered data.

## Phase 5 — Policy Configuration and Construction Type

- Separate read-only checks from update/restore checks.
- Guarantee restoration of policy values, units, and status.
- Expand Construction Type only when its complete cases are available.

## Phase 6 — Journey suite

Create a short headed journey that performs:

```text
Login once
  -> Property Tax
  -> Construction Type
  -> Mouja
  -> Policy Configuration
  -> Social Attribute
  -> Tax Zone
  -> Logout once
```

This suite verifies sidebar transitions and session continuity. Detailed field
validation remains in isolated regression specs.

## Phase 7 — Reporting and CI

- Run smoke checks on every pull request.
- Run full regression on schedule or before release.
- Retain trace/screenshots/videos only on failure where practical.
- Publish Allure or HTML reports as CI artifacts.
- Track flaky tests separately; do not hide them with unlimited retries.

## Per-phase review checklist

- [ ] Baseline results recorded.
- [ ] TC traceability reviewed.
- [ ] New structure reviewed before deleting old files.
- [ ] Selected headed verification passed.
- [ ] Independent spec execution passed.
- [ ] Journey transition passed.
- [ ] Cleanup verified after both pass and forced failure.
- [ ] Commands and documentation updated.
- [ ] No unrelated user changes overwritten.

