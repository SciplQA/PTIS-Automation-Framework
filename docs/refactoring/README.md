# PTIS Automation Refactoring Plan

## Purpose

This folder defines how to evolve the current Playwright framework into a
maintainable professional test project without performing a large risky rewrite.
The current test behavior remains unchanged until each migration phase is
reviewed and approved.

## Current baseline

- 131 Playwright tests across 7 test files.
- One Chromium worker and one shared authenticated internal page.
- Page Object Model for Property Tax screens.
- Reusable sidebar navigation and one final logout.
- Large sequential suites for Social Attribute and Tax Zone.

## Main problems to solve

1. Some Page Objects and spec files are too large to review safely.
2. Many tests depend on state created by earlier tests.
3. A failure in a serial suite skips all later cases.
4. Fixed `waitForTimeout()` calls make execution slow and timing-dependent.
5. Test data can remain in QA when a create/delete sequence fails halfway.
6. Some copied cases only wait or print a message without testing behavior.
7. A central fixture must currently be edited whenever a module is added.

## Proposed outcome

- Keep common authentication, navigation, reporting, and browser configuration
  in framework-level fixtures and helpers.
- Organize each module around small workflow specs such as page load, search,
  create, edit, filters, pagination, and deletion.
- Keep one Page Object per screen and extract reusable screen components only
  when they have a real responsibility, such as a drawer or paginated table.
- Make regression tests independently runnable wherever possible.
- Keep a separate sequential journey suite when one-login, screen-to-screen
  behavior must be verified exactly like a manual user journey.
- Preserve every current TC identifier in a traceability map before cases are
  merged, renamed, or retired.

## Documents

- [TARGET_ARCHITECTURE.md](TARGET_ARCHITECTURE.md): proposed folders,
  responsibilities, fixture model, and coding rules.
- [MIGRATION_PLAN.md](MIGRATION_PLAN.md): safe phases, order of modules,
  acceptance criteria, and rollback points.
- [MODULE_CHECKLIST.md](MODULE_CHECKLIST.md): repeatable checklist and
  boilerplate for every new module.

## Decisions to discuss before implementation

1. Keep only the current one-page sequential model, or create two lanes:
   isolated regression tests plus a one-login journey suite?
2. Should empty cases such as “browser opened” and “wait completed” be retired,
   or retained only for external test-management traceability?
3. Which QA records are approved for update tests, and must their original
   values always be restored?
4. Should newly created test data always be deleted, or should selected records
   remain as reusable seeded data?
5. Which module should be the first refactoring pilot? Tax Zone is recommended
   because it covers CRUD, pagination, drawers, and deletion in one module.

## Definition of success

The refactoring is successful when:

- `npm run test:masters` still covers all approved behavior.
- A failure in one regression test does not skip unrelated tests.
- No module performs its own login or final logout.
- No test relies on arbitrary delays for application readiness.
- Created data is cleaned up and edited data is restored.
- A new module can be added using the checklist without changing unrelated
  modules.

