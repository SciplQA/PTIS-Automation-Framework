# Adding an Internal PTIS Screen

Internal Property Tax screens share one authenticated browser session. Do not
add login or logout calls to an internal screen test file.

## Page-object boilerplate

```ts
import { Locator, Page } from '@playwright/test';
import { PropertyTaxBasePage } from '../PropertyTaxBasePage';

export class ExampleMasterPage extends PropertyTaxBasePage {
  readonly pageHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Example Master' });
  }

  async navigateFromPropertyTaxModule(): Promise<void> {
    // Uses the visible PTIS sidebar: Masters -> Example Master.
    await this.selectMasterSubmenu('Example Master');
  }

  async expectLoaded(): Promise<void> {
    await this.pageHeading.waitFor({ state: 'visible' });
  }
}
```

## Test-file boilerplate

```ts
import { internalTest as test, expect } from '../../../fixtures/internalSessionFixtures';
import { ExampleMasterPage } from '../../../pages/property-tax/Masters/Example-master';

test.describe('Property Tax - Example Master', () => {
  let exampleMasterPage: ExampleMasterPage;

  test.beforeAll(async ({ internalSession }) => {
    exampleMasterPage = new ExampleMasterPage(internalSession.page);
    await exampleMasterPage.navigateFromPropertyTaxModule();
    await exampleMasterPage.expectLoaded();
  });

  test('TC01 - Example Master page loads', async () => {
    await expect(exampleMasterPage.pageHeading).toBeVisible();
  });
});
```

`internalSession` logs in once for all internal screen files running in the
same one-worker command and logs out once after the final internal suite.

## Run selected tests

Run Mouja TC30 and TC31 only:

```powershell
npx playwright test tests/property-tax/Masters/mouja-master.spec.ts --project=chromium --no-deps --headed -g "TC(30|31)"
```

To keep one session while running Mouja TC30/TC31 and all Policy tests, select
both files in one command:

```powershell
npx playwright test tests/property-tax/Masters/mouja-master.spec.ts tests/property-tax/Masters/policy-configuration.spec.ts --project=chromium --no-deps --headed -g "TC(30|31)|Policy Configuration Master.*TC(0[1-9]|1[0-5])"
```
