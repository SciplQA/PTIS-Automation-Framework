import { internalTest as test, expect } from '../../../fixtures/internalSessionFixtures';
import { addAllureMetadata } from '../../../helpers/allureHelper';

test.describe('Property Tax - Construction Type Master', () => {
  // Keep reporting independent: a failed test does not skip the remaining tests.
  test.describe.configure({ mode: 'default' });
  test.setTimeout(120000);

  const runId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  // The application accepts a maximum seven-character construction code.
  // Keep the generated value within that limit (TC + four digits).
  const testCode = `TC${Math.floor(1000 + Math.random() * 9000)}`;
  const testData = { code: testCode, description: `Auto Test Description ${runId}`, sequence: '55' };
  const editedData = { description: `Updated Description ${runId}`, sequence: '77' };

  test.beforeEach(async ({ internalSession }) => {
    const master = internalSession.constructionTypeMasterPage;
    // Reuse the current master page between CRUD steps. Re-navigating before
    // every test can race the list refresh and temporarily hide the record
    // created by TC-CT-06.
    if (!internalSession.page.url().includes('/en/property-tax/constructiontype')) {
      await master.navigateFromPropertyTaxModule();
    }
    await master.expectLoaded();
  });

  test('TC-CT-01: Navigate and verify Construction Type page heading is visible', async ({ internalSession }) => {
    await addAllureMetadata({ testId: 'TC-CT-01', feature: 'Construction Type', story: 'Verify page heading loads', preConditions: 'Authenticated user is on the master page', expectedResult: 'Construction Type heading is visible' });
    await expect(internalSession.constructionTypeMasterPage.pageHeading).toBeVisible();
  });

  test('TC-CT-02: Verify Construction Type table headers', async ({ internalSession }) => {
    await addAllureMetadata({ testId: 'TC-CT-02', feature: 'Construction Type', story: 'Verify table headers', preConditions: 'Master page is loaded', expectedResult: 'All table headers are visible' });
    const master = internalSession.constructionTypeMasterPage;
    for (const header of [master.columnCode, master.columnDescription, master.columnSequence, master.columnStatus, master.columnActions]) await expect(header).toBeVisible();
  });

  test('TC-CT-03: Verify pagination info and rows', async ({ internalSession }) => {
    await addAllureMetadata({ testId: 'TC-CT-03', feature: 'Construction Type', story: 'Verify pagination', preConditions: 'Master page is loaded', expectedResult: 'Rows and pagination information are displayed' });
    const master = internalSession.constructionTypeMasterPage;
    expect(await master.getRowCount()).toBeGreaterThan(0);
    await expect(master.paginationInfo).toBeVisible();
  });

  test('TC-CT-04: Verify Add Construction Type drawer fields', async ({ internalSession }) => {
    await addAllureMetadata({ testId: 'TC-CT-04', feature: 'Construction Type', story: 'Verify add form', preConditions: 'Master page is loaded', expectedResult: 'Required fields and buttons are visible' });
    const master = internalSession.constructionTypeMasterPage;
    await master.openAddDrawer();
    for (const field of [master.codeInput, master.descriptionInput, master.sequenceInput, master.saveButton, master.cancelButton]) await expect(field).toBeVisible();
    await master.clickCancel();
  });

  test('TC-CT-05: Verify empty fields trigger validation errors', async ({ internalSession }) => {
    await addAllureMetadata({ testId: 'TC-CT-05', feature: 'Construction Type', story: 'Verify empty form validation', preConditions: 'Add form is open', expectedResult: 'Validation errors are shown and form remains open' });
    const master = internalSession.constructionTypeMasterPage;
    await master.openAddDrawer();
    await master.saveButton.click();
    await expect(master.codeInput).toBeVisible();
    await expect(master.validationErrors.first()).toBeVisible();
    await master.clickCancel();
  });

  test('TC-CT-06: Add a Construction Type with dynamic data', async ({ internalSession }) => {
    await addAllureMetadata({ testId: 'TC-CT-06', feature: 'Construction Type', story: 'Add a record', preConditions: 'Master page is loaded', expectedResult: `Record ${testCode} appears` });
    const master = internalSession.constructionTypeMasterPage;
    await master.openAddDrawer();
    await master.fillForm(testData);
    await master.clickSave();
    await master.search(testCode);
    await expect(master.getRowByCode(testCode)).toBeVisible();
  });

  test('TC-CT-07: Search for the added Construction Type', async ({ internalSession }) => {
    await addAllureMetadata({ testId: 'TC-CT-07', feature: 'Construction Type', story: 'Search a record', preConditions: `Record ${testCode} exists`, expectedResult: 'Matching record and description are visible' });
    const master = internalSession.constructionTypeMasterPage;
    await master.search(testCode);
    const row = master.getRowByCode(testCode);
    await expect(row).toBeVisible();
    await expect(row.locator('td').nth(1)).toContainText(testData.description);
    await master.clearSearch();
  });

  test('TC-CT-08: Edit and update the Construction Type', async ({ internalSession }) => {
    await addAllureMetadata({ testId: 'TC-CT-08', feature: 'Construction Type', story: 'Update a record', preConditions: `Record ${testCode} exists`, expectedResult: 'Updated description and sequence are visible' });
    const master = internalSession.constructionTypeMasterPage;
    await master.search(testCode);
    await master.clickEditForRow(testCode);
    await master.fillForm(editedData);
    await master.clickSave();
    await master.search(testCode);
    const row = master.getRowByCode(testCode);
    await expect(row).toBeVisible();
    await expect(row.locator('td').nth(1)).toContainText(editedData.description);
    await expect(row.locator('td').nth(2)).toContainText(editedData.sequence);
  });

  test('TC-CT-09: Cancel delete keeps the record', async ({ internalSession }) => {
    await addAllureMetadata({ testId: 'TC-CT-09', feature: 'Construction Type', story: 'Cancel deletion', preConditions: `Record ${testCode} exists`, expectedResult: 'Record remains visible' });
    const master = internalSession.constructionTypeMasterPage;
    await master.search(testCode);
    await master.clickDeleteForRow(testCode);
    await master.cancelDelete();
    await expect(master.getRowByCode(testCode)).toBeVisible();
  });

  test('TC-CT-10: Confirm delete removes the Construction Type', async ({ internalSession }) => {
    await addAllureMetadata({ testId: 'TC-CT-10', feature: 'Construction Type', story: 'Confirm deletion', preConditions: `Record ${testCode} exists`, expectedResult: 'Record is removed' });
    const master = internalSession.constructionTypeMasterPage;
    await master.search(testCode);
    await master.clickDeleteForRow(testCode);
    await master.confirmDelete();
    await master.search(testCode);
    await expect(master.getRowByCode(testCode)).not.toBeVisible();
  });
});
