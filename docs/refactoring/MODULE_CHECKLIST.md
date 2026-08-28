# Module Checklist

Use this checklist when adding or refactoring a Property Tax module.

## Before coding

- [ ] Record the visible sidebar label and expected screen heading.
- [ ] Inventory the existing TC identifiers and expected results.
- [ ] Identify read-only, create, update, delete, filter, and journey cases.
- [ ] Identify required seeded QA records.
- [ ] Decide cleanup and restoration behavior.
- [ ] Capture a passing baseline for the existing module.

## Page Object

- [ ] Extends `PropertyTaxBasePage`.
- [ ] Navigates through `selectMasterSubmenu()` using visible UI text.
- [ ] Implements `expectLoaded()` using screen-specific elements.
- [ ] Uses role, label, placeholder, or stable attributes before CSS structure.
- [ ] Scopes drawer/dialog controls inside their container.
- [ ] Uses observable waits instead of fixed delays.
- [ ] Contains actions and queries, not complete test scenarios.

## Tests

- [ ] Uses project fixtures; does not log in or log out directly.
- [ ] Can run from its documented command.
- [ ] Each regression test arranges the state it needs.
- [ ] Assertions verify application behavior rather than console output.
- [ ] A failed test does not skip unrelated regression checks.
- [ ] Generated data is unique and recorded for cleanup.
- [ ] Edited seeded values are restored.
- [ ] Destructive actions target only data created or explicitly approved for
      the test.

## Suggested module layout

```text
tests/property-tax/masters/example/
  page-load-and-search.spec.ts
  create-and-delete.spec.ts
  edit.spec.ts
  test-data.ts
  traceability.md

pages/property-tax/masters/example/
  ExamplePage.ts
  ExampleForm.ts        # only if the form has enough responsibility
```

## Traceability template

```markdown
| Existing case | New test | Decision | Notes |
|---|---|---|---|
| TC01 | page loads | Keep | Independent smoke test |
| TC02–TC05 | search scenarios | Keep/split | Data-driven search test |
| TC06–TC10 | create workflow | Merge | One coherent create case |
| TC11 | wait completed | Retire | No product behavior asserted |
```

No existing case is removed solely because it looks redundant. Merging or
retiring a case requires review of its original expected result.

## Verification commands

```powershell
# List cases without opening a browser
npx playwright test tests/property-tax/Masters/example --list --project=chromium --no-deps

# Run the module in headed Chromium
npx playwright test tests/property-tax/Masters/example --project=chromium --no-deps --headed

# Run a selected case while refactoring
npx playwright test tests/property-tax/Masters/example --project=chromium --no-deps --headed -g "TC01"
```

## Completion criteria

- [ ] All approved cases mapped.
- [ ] Module tests pass independently.
- [ ] Module passes within `test:masters`.
- [ ] Previous and next sidebar transitions pass.
- [ ] One-login journey remains valid.
- [ ] No temporary QA data remains.
- [ ] Documentation and npm commands are current.

