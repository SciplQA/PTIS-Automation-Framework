# Target Architecture

## Recommended structure

```text
fixtures/
  auth.fixture.ts
  property-tax.fixture.ts

pages/
  components/
    Drawer.ts
    PaginatedTable.ts
  property-tax/
    PropertyTaxBasePage.ts
    masters/
      tax-zone/
        TaxZonePage.ts
        TaxZoneForm.ts
      social-attribute/
        SocialAttributePage.ts
        SocialAttributeForm.ts

tests/
  property-tax/
    masters/
      tax-zone/
        page-load-and-search.spec.ts
        create-and-delete.spec.ts
        edit.spec.ts
        pagination.spec.ts
        test-data.ts
        traceability.md
      social-attribute/
        page-load-and-search.spec.ts
        create.spec.ts
        edit.spec.ts
        filters-and-language.spec.ts
        test-data.ts
        traceability.md
  journeys/
    property-tax-masters.journey.spec.ts
```

Names may be adjusted during implementation. The important rule is separation
by responsibility, not creating folders merely to reduce line counts.

## Test execution lanes

### Regression lane

- Authentication state is prepared once and reused without repeating the login
  form for every test.
- Each test receives a clean page or context using that authenticated state.
- Tests prepare their own required data and restore or delete it afterward.
- Tests can run alone, in a different order, or after another test fails.

### Journey lane

- Uses one page and one login.
- Navigates from module to module through the visible sidebar.
- Verifies the manual end-to-end workflow requested for headed runs.
- Contains only essential journey checks, not every field-level regression case.

This two-lane model preserves the current manual-style flow while preventing
one failed validation test from skipping the rest of the regression suite.

## Responsibilities

### Page Object

A Page Object should contain:

- Stable locators for one screen.
- User actions such as `openAddDrawer()`, `search()`, and `save()`.
- Screen-state waits such as `expectLoaded()`.
- Small queries such as `getRowByZoneNumber()`.

A Page Object should not contain:

- Login or logout logic.
- Test-case assertions unrelated to confirming action completion.
- Generated test data.
- Long business scenarios combining many independent behaviors.
- Console messages used as substitutes for assertions.

### Component object

Extract a component only when the same UI responsibility appears repeatedly.
Good examples are a drawer, confirmation dialog, pagination control, or common
data table. Avoid splitting every input into a separate class.

### Spec file

A spec should contain test intent and assertions. A professional test should:

1. Arrange only the state it needs.
2. Perform one coherent behavior.
3. Assert the visible result.
4. Restore edited data or delete generated data.

### Fixture

Fixtures own infrastructure concerns:

- Authentication.
- Browser/page lifecycle.
- Property Tax module entry.
- Common cleanup that must occur even after failures.

Module Page Objects should normally be created from the fixture page inside the
module fixture or spec. The central fixture should not need a new property for
every screen forever.

## File-size guidance

Line count is a warning, not an absolute rule:

- Page Object target: approximately 150–350 lines.
- Spec target: approximately 100–250 lines.
- Helper/component target: approximately 50–200 lines.

Split a file when it has multiple responsibilities, repeated code, or sections
that change for different reasons. Do not split a cohesive file only because it
crosses a number.

## Waiting rules

Prefer observable conditions:

- `expect(locator).toBeVisible()`
- `expect(locator).toHaveValue()`
- `expect.poll()` for refreshed table data
- response or URL waits when they represent the actual completion condition
- drawer/dialog visible or hidden state

Avoid `waitForTimeout()` except when intentionally testing a time-based product
requirement. Slow motion for demonstration should be a runtime option, not part
of test logic.

## Data-management rules

- Generate unique values through a shared data factory.
- Record every created entity immediately.
- Delete generated entities in `finally` or cleanup fixtures.
- Capture original values before editing seeded records and restore them.
- Never depend silently on a hardcoded QA record; declare seeded records in a
  clearly named data file and verify that they exist.
- Cleanup must be safe to run when setup failed halfway.

## Serial-test rules

Use serial mode only for a deliberate journey. Field validation, search,
pagination, and CRUD regression checks should be independently executable.
If multiple existing TC numbers describe one indivisible workflow, combine them
into one test and preserve the mapping in `traceability.md`.

