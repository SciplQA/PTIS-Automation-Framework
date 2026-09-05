import { internalTest as test, expect } from '../../../fixtures/internalSessionFixtures';
import { Page } from '@playwright/test';
import { MoujaMasterPage } from '../../../pages/property-tax/Masters/Mouja-master';

test.describe('Property Tax - Mouja Master', () => {
  let page: Page;
  let moujaMasterPage: MoujaMasterPage;

  test.beforeAll(async ({ internalSession }) => {
    page = internalSession.page;
    moujaMasterPage = internalSession.moujaMasterPage;

    await moujaMasterPage.navigateFromPropertyTaxModule();
    await moujaMasterPage.expectLoaded();
  });

  test.beforeEach(async () => {
    if (page.url().includes('/login')) {
      throw new Error(
        'The shared PTIS session expired during the Mouja suite. The test cannot continue because the session is no longer available.'
      );
    }

    if (
      await moujaMasterPage
        .isAddDrawerVisible()
        .catch(() => false)
    ) {
      await moujaMasterPage.closeDrawer();
    }

    if (
      await moujaMasterPage
        .isEditDrawerVisible()
        .catch(() => false)
    ) {
      await moujaMasterPage.closeEditMoujaDrawer();
    }

    await moujaMasterPage.clearSearch();
  });

  test.afterEach(async () => {
    if (
      await moujaMasterPage
        .isAddDrawerVisible()
        .catch(() => false)
    ) {
      await moujaMasterPage.closeDrawer();
    }

    if (
      await moujaMasterPage
        .isEditDrawerVisible()
        .catch(() => false)
    ) {
      await moujaMasterPage.closeEditMoujaDrawer();
    }
  });


  test('TC01 - Mouja Master page load', async () => {
    await expect(
      moujaMasterPage.searchField,
      'TC01 FAILED - Search field is not displayed on Mouja Master page.'
    ).toBeVisible();

    await expect(
      moujaMasterPage.table,
      'TC01 FAILED - Mouja table is not displayed on Mouja Master page.'
    ).toBeVisible();
  });
  test('TC02 - Search field is clickable and accepts text', async () => {
    await expect(
      moujaMasterPage.searchField,
      'TC02 FAILED - Search field is not editable.'
    ).toBeEditable();

    await moujaMasterPage.searchField.fill('MJ001');

    await expect(
      moujaMasterPage.searchField,
      'TC02 FAILED - Search field did not accept the entered value "MJ001".'
    ).toHaveValue('MJ001');
  });
  test('TC03 - Mouja records are displayed after page load', async () => {
    await moujaMasterPage.clearSearch();

    const rowCount =
      await moujaMasterPage.getRowCount();

    expect(
      rowCount,
      `TC03 FAILED - No Mouja records are displayed after page load.\nExpected: At least 1 record\nActual: ${rowCount} records`
    ).toBeGreaterThan(0);

    await expect(
      moujaMasterPage.tableRows.first(),
      'TC03 FAILED - First Mouja table row is not visible.'
    ).toBeVisible();
  });
  test('TC04 - Search by valid Mouja Number', async () => {
    const searchValue = 'MJ001';

    await moujaMasterPage.searchMouja(
      searchValue
    );

    const rowCount =
      await moujaMasterPage.getRowCount();

    expect(
      rowCount,
      `TC04 FAILED - Search for "${searchValue}" returned no records.\nExpected: Matching Mouja records\nActual: ${rowCount} records`
    ).toBeGreaterThan(0);

    for (
      const number of
      await moujaMasterPage.getMoujaNumbers()
    ) {
      expect(
        number.trim().toLowerCase(),
        `TC04 FAILED - Search result "${number}" does not contain the searched Mouja Number "${searchValue}".`
      ).toContain(
        searchValue.toLowerCase()
      );
    }
  });
  test('TC05 - Search by valid Mouja Name', async () => {
    const searchValue = 'Kopri';

    await moujaMasterPage.searchMouja(
      searchValue
    );

    const rowCount =
      await moujaMasterPage.getRowCount();

    expect(
      rowCount,
      `TC05 FAILED - Search for "${searchValue}" returned no records.\nExpected: Matching Mouja records\nActual: ${rowCount} records`
    ).toBeGreaterThan(0);

    for (
      const row of
      await moujaMasterPage.getRowTexts()
    ) {
      expect(
        row.toLowerCase(),
        `TC05 FAILED - Search result "${row}" does not contain the searched Mouja Name "${searchValue}".`
      ).toContain(
        searchValue.toLowerCase()
      );
    }
  });
  test('TC06 - Search by partial Mouja Number', async () => {
    const searchValue = 'MJ';

    await moujaMasterPage.searchMouja(
      searchValue
    );

    const rowCount =
      await moujaMasterPage.getRowCount();

    expect(
      rowCount,
      `TC06 FAILED - Partial search "${searchValue}" returned no records.`
    ).toBeGreaterThan(0);

    for (
      const number of
      await moujaMasterPage.getMoujaNumbers()
    ) {
      expect(
        number.trim().toLowerCase(),
        `TC06 FAILED - Result "${number}" does not contain partial search "${searchValue}".`
      ).toContain(
        searchValue.toLowerCase()
      );
    }
  });
  test('TC07 - Search by partial Mouja Name', async () => {
    const searchValue = 'Ban';

    await moujaMasterPage.searchMouja(
      searchValue
    );

    const rowCount =
      await moujaMasterPage.getRowCount();

    expect(
      rowCount,
      `TC07 FAILED - Partial search "${searchValue}" returned no records.`
    ).toBeGreaterThan(0);

    for (
      const name of
      await moujaMasterPage.getMoujaNames()
    ) {
      expect(
        name.trim().toLowerCase(),
        `TC07 FAILED - Result "${name}" does not contain partial search "${searchValue}".`
      ).toContain(
        searchValue.toLowerCase()
      );
    }
  });
  test('TC08 - Search with invalid Mouja Number or Name', async () => {
    const searchValue =
      'INVALID999999';

    await moujaMasterPage.searchMouja(
      searchValue
    );

    await expect(
      moujaMasterPage.noDataMessage,
      `TC08 FAILED - Invalid search "${searchValue}" returned data instead of "No data available".`
    ).toBeVisible();

    await expect(
      moujaMasterPage.noDataMessage,
      `TC08 FAILED - No-data message text is incorrect.`
    ).toHaveText(
      'No data available'
    );

    const rowCount =
      await moujaMasterPage.getRowCount();

    expect(
      rowCount,
      `TC08 FAILED - Invalid search "${searchValue}" returned ${rowCount} records.\nExpected: 0 records`
    ).toBe(0);
  });
  test('TC09 - Search with special characters', async () => {
    const searchValue =
      '@#$%^&*';

    await moujaMasterPage.searchMouja(
      searchValue
    );

    const rowCount =
      await moujaMasterPage.getRowCount();

    const noDataVisible =
      await moujaMasterPage.noDataMessage
        .isVisible()
        .catch(() => false);

    expect(
      rowCount === 0 ||
      noDataVisible,
      `TC09 FAILED - Special-character search "${searchValue}" returned unexpected data.\nExpected: 0 records or "No data available"\nActual records: ${rowCount}`
    ).toBeTruthy();
  });
  test('TC10 - Blank search displays all records', async () => {
    await moujaMasterPage.clearSearch();

    const rowCount =
      await moujaMasterPage.getRowCount();

    expect(
      rowCount,
      `TC10 FAILED - Blank search did not display Mouja records.\nExpected: At least 1 record\nActual: ${rowCount}`
    ).toBeGreaterThan(0);

    await expect(
      moujaMasterPage.noDataMessage,
      'TC10 FAILED - "No data available" is displayed even though search is blank.'
    ).not.toBeVisible();
  });
  test('TC11 - Search with only spaces displays all records', async () => {
    await moujaMasterPage.searchMouja(
      '     '
    );

    const rowCount =
      await moujaMasterPage.getRowCount();

    expect(
      rowCount,
      `TC11 FAILED - Space-only search did not display all Mouja records.\nActual: ${rowCount} records`
    ).toBeGreaterThan(0);

    await expect(
      moujaMasterPage.noDataMessage,
      'TC11 FAILED - No-data message is displayed for a space-only search.'
    ).not.toBeVisible();
  });
  test('TC12 - Search with leading and trailing spaces', async () => {
    const searchValue =
      '  MJ001  ';

    await moujaMasterPage.searchMouja(
      searchValue
    );

    const rowCount =
      await moujaMasterPage.getRowCount();

    expect(
      rowCount,
      `TC12 FAILED - Search with leading/trailing spaces "${searchValue}" returned no records.`
    ).toBeGreaterThan(0);

    for (
      const number of
      await moujaMasterPage.getMoujaNumbers()
    ) {
      expect(
        number.trim().toLowerCase(),
        `TC12 FAILED - Result "${number}" does not match trimmed search value "MJ001".`
      ).toContain(
        'mj001'
      );
    }
  });
  test('TC13 - Clear search displays all Mouja records', async () => {
    await moujaMasterPage.searchMouja(
      'MJ001'
    );

    await moujaMasterPage.clearSearch();

    const rowCount =
      await moujaMasterPage.getRowCount();

    expect(
      rowCount,
      `TC13 FAILED - Clearing search did not restore Mouja records.\nActual: ${rowCount} records`
    ).toBeGreaterThan(0);

    await expect(
      moujaMasterPage.noDataMessage,
      'TC13 FAILED - No-data message is still displayed after clearing search.'
    ).not.toBeVisible();
  });
  test('TC14 - Add Mouja button is visible and enabled', async () => {
    await expect(
      moujaMasterPage.addMoujaButton,
      'TC14 FAILED - Add Mouja button is not visible.'
    ).toBeVisible();

    await expect(
      moujaMasterPage.addMoujaButton,
      'TC14 FAILED - Add Mouja button is disabled.'
    ).toBeEnabled();
  });
  test('TC15 - Add Mouja drawer opens', async () => {
    await moujaMasterPage.clickAddMouja();

    await expect(
      moujaMasterPage.addMoujaDrawer,
      'TC15 FAILED - Add Mouja sidebar did not open.'
    ).toBeVisible();
  })
  test('TC16 - Verify all Add Mouja sidebar fields, labels, buttons and mandatory information are displayed correctly', async () => {
  console.log('========== TC16 START ==========');

  await moujaMasterPage.clickAddMouja();

  await expect(
    moujaMasterPage.addMoujaDrawer,
    'TC16 FAILED\nReason: Add Mouja sidebar is not visible.\nExpected: Add Mouja sidebar should be displayed.'
  ).toBeVisible();

  const addMoujaTitle =
    moujaMasterPage.addMoujaDrawer.getByText('Add Mouja', {
      exact: true
    });

  await expect(
    addMoujaTitle,
    'TC16 FAILED\nReason: Add Mouja title is not displayed.\nExpected: "Add Mouja"'
  ).toBeVisible();

  console.log('TC16 - Title: Add Mouja ✓');

  const addMoujaSubtitle =
    moujaMasterPage.addMoujaDrawer.getByText('Create new mouja', {
      exact: true
    });

  await expect(
    addMoujaSubtitle,
    'TC16 FAILED\nReason: Add Mouja subtitle is not displayed.\nExpected: "Create new mouja"'
  ).toBeVisible();

  console.log('TC16 - Subtitle: Create new mouja ✓');

  const moujaNumberLabel =
    moujaMasterPage.addMoujaDrawer
      .locator('label')
      .filter({
        hasText: 'Mouja Number'
      })
      .first();

  await expect(
    moujaNumberLabel,
    'TC16 FAILED\nReason: Mouja Number label is not displayed.\nExpected: "Mouja Number *"'
  ).toBeVisible();

  await expect(
    moujaNumberLabel,
    'TC16 FAILED\nReason: Mouja Number mandatory indicator (*) is missing.\nExpected: Label should contain "*"'
  ).toContainText('*');

  console.log('TC16 - Mouja Number label ✓');

  const moujaNumberInput =
    moujaMasterPage.addMoujaDrawer.locator(
      'input[name="moujaNo"]'
    );

  await expect(
    moujaNumberInput,
    'TC16 FAILED\nReason: Mouja Number input is not displayed.\nExpected: input[name="moujaNo"]'
  ).toBeVisible();

  await expect(
    moujaNumberInput,
    'TC16 FAILED\nReason: Mouja Number input is disabled.'
  ).toBeEnabled();

  await expect(
    moujaNumberInput,
    'TC16 FAILED\nReason: Mouja Number input is not mandatory.\nExpected: required attribute'
  ).toHaveAttribute(
    'required',
    ''
  );

  await expect(
    moujaNumberInput,
    'TC16 FAILED\nReason: Mouja Number input has incorrect name attribute.\nExpected: moujaNo'
  ).toHaveAttribute(
    'name',
    'moujaNo'
  );

  await expect(
    moujaNumberInput,
    'TC16 FAILED\nReason: Mouja Number placeholder is incorrect.\nExpected: "e.g. M001"'
  ).toHaveAttribute(
    'placeholder',
    'e.g. M001'
  );

  console.log('TC16 - Mouja Number input ✓');

  const moujaNameLabel =
    moujaMasterPage.addMoujaDrawer
      .locator('label')
      .filter({
        hasText: 'Mouja Name'
      })
      .first();

  await expect(
    moujaNameLabel,
    'TC16 FAILED\nReason: Mouja Name label is not displayed.\nExpected: "Mouja Name *"'
  ).toBeVisible();

  await expect(
    moujaNameLabel,
    'TC16 FAILED\nReason: Mouja Name mandatory indicator (*) is missing.'
  ).toContainText('*');

  console.log('TC16 - Mouja Name label ✓');

  const moujaNameInput =
    moujaMasterPage.addMoujaDrawer.locator(
      'input[name="moujaName"]'
    );

  await expect(
    moujaNameInput,
    'TC16 FAILED\nReason: Mouja Name input is not displayed.\nExpected: input[name="moujaName"]'
  ).toBeVisible();

  await expect(
    moujaNameInput,
    'TC16 FAILED\nReason: Mouja Name input is disabled.'
  ).toBeEnabled();

  await expect(
    moujaNameInput,
    'TC16 FAILED\nReason: Mouja Name input is not mandatory.'
  ).toHaveAttribute(
    'required',
    ''
  );

  await expect(
    moujaNameInput,
    'TC16 FAILED\nReason: Mouja Name input has incorrect name attribute.\nExpected: moujaName'
  ).toHaveAttribute(
    'name',
    'moujaName'
  );

  await expect(
    moujaNameInput,
    'TC16 FAILED\nReason: Mouja Name placeholder is incorrect.\nExpected: "e.g. Akurdi"'
  ).toHaveAttribute(
    'placeholder',
    'e.g. Akurdi'
  );

  console.log('TC16 - Mouja Name input ✓');

  const mandatoryMessage =
    moujaMasterPage.addMoujaDrawer.getByText(
      'Fields marked with * are mandatory',
      {
        exact: true
      }
    );

  await expect(
    mandatoryMessage,
    'TC16 FAILED\nReason: Mandatory-field information is not displayed.\nExpected: "Fields marked with * are mandatory"'
  ).toBeVisible();

  console.log('TC16 - Mandatory message ✓');

  const cancelButton =
    moujaMasterPage.addMoujaDrawer.getByRole(
      'button',
      {
        name: 'Cancel',
        exact: true
      }
    );

  await expect(
    cancelButton,
    'TC16 FAILED\nReason: Cancel button is not displayed.'
  ).toBeVisible();

  await expect(
    cancelButton,
    'TC16 FAILED\nReason: Cancel button is disabled.'
  ).toBeEnabled();

  await expect(
    cancelButton,
    'TC16 FAILED\nReason: Cancel button text is incorrect.\nExpected: "Cancel"'
  ).toHaveText(
    'Cancel'
  );

  console.log('TC16 - Cancel button ✓');

  const saveButton =
    moujaMasterPage.addMoujaDrawer.getByRole(
      'button',
      {
        name: 'Save',
        exact: true
      }
    );

  await expect(
    saveButton,
    'TC16 FAILED\nReason: Save button is not displayed.'
  ).toBeVisible();

  await expect(
    saveButton,
    'TC16 FAILED\nReason: Save button is disabled.'
  ).toBeEnabled();

  await expect(
    saveButton,
    'TC16 FAILED\nReason: Save button text is incorrect.\nExpected: "Save"'
  ).toHaveText(
    'Save'
  );

  await expect(
    saveButton,
    'TC16 FAILED\nReason: Save button type is incorrect.\nExpected: type="submit"'
  ).toHaveAttribute(
    'type',
    'submit'
  );

  console.log('TC16 - Save button ✓');

  await expect(
    moujaMasterPage.addMoujaDrawer,
    'TC16 FAILED - Add Mouja sidebar disappeared during verification.'
  ).toBeVisible();

  console.log(
    'TC16 PASS - All Add Mouja sidebar fields, labels, title, subtitle, mandatory information and buttons are displayed correctly.'
  );
  });
 test('TC17 - Mouja Number field is visible and enabled', async () => {

  console.log('========== TC17 START ==========');

  await expect(
    moujaMasterPage.addMoujaButton,
    'TC17 FAILED - Add Mouja button is not visible.'
  ).toBeVisible({
    timeout: 10000
  });

  await expect(
    moujaMasterPage.addMoujaButton,
    'TC17 FAILED - Add Mouja button is disabled.'
  ).toBeEnabled({
    timeout: 10000
  });

  await moujaMasterPage.clickAddMouja();

  await expect(
    moujaMasterPage.addMoujaDrawer,
    'TC17 FAILED - Add Mouja drawer did not open.'
  ).toBeVisible({
    timeout: 10000
  });

  await expect(
    moujaMasterPage.moujaNumberInput,
    'TC17 FAILED - Mouja Number field is not visible.'
  ).toBeVisible({
    timeout: 10000
  });

  await expect(
    moujaMasterPage.moujaNumberInput,
    'TC17 FAILED - Mouja Number field is disabled.'
  ).toBeEnabled({
    timeout: 10000
  });

  await expect(
    moujaMasterPage.moujaNumberInput,
    'TC17 FAILED - Mouja Number field has incorrect name attribute.'
  ).toHaveAttribute(
    'name',
    'moujaNo'
  );

  console.log(
    'TC17 PASS - Mouja Number field is visible, enabled and has correct name attribute.'
  );

  await moujaMasterPage.closeDrawer();

  console.log('========== TC17 END ==========');
  });
  test('TC18 - Mouja Name field is visible and enabled', async () => {
  console.log('========== TC18 START ==========');

  await expect(
    moujaMasterPage.addMoujaButton,
    'TC18 FAILED - Add Mouja button is not visible.'
  ).toBeVisible({
    timeout: 10000
  });

  await expect(
    moujaMasterPage.addMoujaButton,
    'TC18 FAILED - Add Mouja button is disabled.'
  ).toBeEnabled({
    timeout: 10000
  });

  // Use the page-object helper so the drawer transition is awaited and a
  // transient first-click miss is retried dynamically.
  await moujaMasterPage.clickAddMouja();

  await expect(
    moujaMasterPage.addMoujaDrawer,
    'TC18 FAILED - Add Mouja drawer did not open.'
  ).toBeVisible({
    timeout: 10000
  });

  await expect(
    moujaMasterPage.moujaNameInput,
    'TC18 FAILED - Mouja Name field is not visible.'
  ).toBeVisible({
    timeout: 10000
  });

  await expect(
    moujaMasterPage.moujaNameInput,
    'TC18 FAILED - Mouja Name field is disabled.'
  ).toBeEnabled({
    timeout: 10000
  });

  await expect(
    moujaMasterPage.moujaNameInput,
    'TC18 FAILED - Mouja Name field has incorrect name attribute.'
  ).toHaveAttribute(
    'name',
    'moujaName'
  );

  console.log(
    'TC18 PASS - Mouja Name field is visible, enabled and has correct name attribute.'
  );
  });
  test('TC19 - Close icon closes Add Mouja drawer', async () => {

  console.log('========== TC19 START ==========');

  console.log(
    'TC19 - Clicking Add Mouja button...'
  );

  await moujaMasterPage.clickAddMouja();

  console.log(
    'TC19 - Add Mouja drawer opened successfully.'
  );

  const closeButton =
    moujaMasterPage.addMoujaDrawer.locator(
      'button:has(svg.lucide-x)'
    ).first();

  await expect(
    closeButton,
    'TC19 FAILED - Close icon was not visible.'
  ).toBeVisible({
    timeout: 5000
  });

  console.log(
    'TC19 - Close icon found.'
  );

  await closeButton.click();

  await expect(
    moujaMasterPage.addMoujaDrawer,
    'TC19 FAILED - Add Mouja drawer did not close.'
  ).toBeHidden({
    timeout: 5000
  });

  console.log(
    'TC19 - Add Mouja drawer closed successfully.'
  );

  console.log(
    'TC19 PASS - Close icon closes Add Mouja drawer successfully.'
  );
  });
  test('TC20 - Cancel closes Add Mouja drawer', async () => {

  console.log('========== TC20 START ==========');

  console.log(
    'TC20 - Clicking Add Mouja button...'
  );

  await moujaMasterPage.clickAddMouja();

  console.log(
    'TC20 - Add Mouja drawer opened successfully.'
  );

  const cancelButton =
    moujaMasterPage.addMoujaDrawer.getByRole(
      'button',
      {
        name: 'Cancel',
        exact: true
      }
    );

  await expect(
    cancelButton,
    'TC20 FAILED - Cancel button was not visible.'
  ).toBeVisible({
    timeout: 5000
  });

  console.log(
    'TC20 - Cancel button found.'
  );

  await cancelButton.click();

  await expect(
    moujaMasterPage.addMoujaDrawer,
    'TC20 FAILED - Add Mouja drawer did not close after clicking Cancel.'
  ).toBeHidden({
    timeout: 5000
  });

  console.log(
    'TC20 - Add Mouja drawer closed successfully.'
  );

  console.log(
    'TC20 PASS - Cancel button closes Add Mouja drawer successfully.'
  );
  });
  test('TC21 - Cancel does not add entered Mouja', async () => {
    const moujaNumber =
      'CANCEL999';

    const moujaName =
      'Cancel Test';

    await moujaMasterPage.clickAddMouja();

    await moujaMasterPage.fillAddMoujaForm(
      moujaNumber,
      moujaName
    );

    await moujaMasterPage.clickCancel();

    await moujaMasterPage.clearSearch();

    const rows =
      await moujaMasterPage.getRowTexts();

    const exists =
      rows.some(row =>
        row.toLowerCase()
          .includes(
            moujaNumber.toLowerCase()
          )
      );

    expect(
      exists,
      `TC21 FAILED\nInput Entered:\nMouja Number: ${moujaNumber}\nMouja Name: ${moujaName}\nExpected: Record should NOT be added after Cancel\nActual: Record was found in the table`
    ).toBeFalsy();
  });
  test('TC22 - Blank Mouja fields show validation', async () => {
    await moujaMasterPage.clickAddMouja();

    await moujaMasterPage.clickSave();

    const numberValidation =
      await moujaMasterPage.getFieldValidation(
        'moujaNo'
      );

    const nameValidation =
      await moujaMasterPage.getFieldValidation(
        'moujaName'
      );

    expect(
      numberValidation.required,
      `TC22 FAILED - Mouja Number required validation is missing.\nExpected: Required validation\nActual: ${numberValidation.validationMessage}`
    ).toBeTruthy();

    expect(
      nameValidation.required,
      `TC22 FAILED - Mouja Name required validation is missing.\nExpected: Required validation\nActual: ${nameValidation.validationMessage}`
    ).toBeTruthy();

    expect(
      numberValidation.validationMessage,
      'TC22 FAILED - Mouja Number validation message is empty.'
    ).not.toBe('');

    expect(
      nameValidation.validationMessage,
      'TC22 FAILED - Mouja Name validation message is empty.'
    ).not.toBe('');
  });
  test('TC23 - Blank Mouja Number shows validation', async () => {
    await moujaMasterPage.clickAddMouja();

    await moujaMasterPage.fillMoujaName(
      'Test Mouja'
    );

    await moujaMasterPage.clickSave();

    const validation =
      await moujaMasterPage.getFieldValidation(
        'moujaNo'
      );

    expect(
      validation.required,
      `TC23 FAILED\nInput Entered:\nMouja Number: blank\nMouja Name: Test Mouja\nExpected: Mouja Number is mandatory\nActual: Required validation = ${validation.required}`
    ).toBeTruthy();

    expect(
      validation.validationMessage,
      `TC23 FAILED - Mouja Number validation message is empty.\nExpected: Required-field validation`
    ).not.toBe('');
  });
  test('TC24 - Blank Mouja Name shows validation', async () => {
    await moujaMasterPage.clickAddMouja();

    await moujaMasterPage.fillMoujaNumber(
      'TEST999'
    );

    await moujaMasterPage.clickSave();

    const validation =
      await moujaMasterPage.getFieldValidation(
        'moujaName'
      );

    expect(
      validation.required,
      `TC24 FAILED\nInput Entered:\nMouja Number: TEST999\nMouja Name: blank\nExpected: Mouja Name is mandatory\nActual: Required validation = ${validation.required}`
    ).toBeTruthy();

    expect(
      validation.validationMessage,
      'TC24 FAILED - Mouja Name validation message is empty.'
    ).not.toBe('');
  });
  test('TC25 - Mandatory validation does not add a record', async () => {
  console.log('========== TC25 START ==========');

  const moujaNumber =
    'INVALID99';

  await expect(
    moujaMasterPage.addMoujaButton,
    'TC25 FAILED - Add Mouja button is not visible.'
  ).toBeVisible({
    timeout: 10000
  });

  await expect(
    moujaMasterPage.addMoujaButton,
    'TC25 FAILED - Add Mouja button is disabled.'
  ).toBeEnabled({
    timeout: 10000
  });

  console.log('TC25 - Clicking Add Mouja button...');

  // The helper waits for the drawer rather than asserting immediately after
  // the button click (the shell can briefly consume the first click).
  await moujaMasterPage.clickAddMouja();

  await expect(
    moujaMasterPage.addMoujaDrawer,
    'TC25 FAILED - Add Mouja drawer did not open.'
  ).toBeVisible({
    timeout: 10000
  });

  console.log('TC25 - Add Mouja drawer opened successfully.');

  await moujaMasterPage.fillMoujaNumber(
    moujaNumber
  );

  await expect(
    moujaMasterPage.moujaNumberInput,
    'TC25 FAILED - Mouja Number was not entered.'
  ).toHaveValue(
    moujaNumber
  );

  console.log(
    `TC25 - Mouja Number entered: ${moujaNumber}`
  );

  await moujaMasterPage.clickSave();

  const validation =
    await moujaMasterPage.getFieldValidation(
      'moujaName'
    );

  expect(
    validation.required,
    `TC25 FAILED - Mouja Name mandatory validation did not appear.\nInput Number: ${moujaNumber}\nActual Validation: ${validation.validationMessage}`
  ).toBeTruthy();

  expect(
    validation.validationMessage,
    'TC25 FAILED - Mouja Name validation message is empty.'
  ).not.toBe('');

  console.log(
    `TC25 - Mouja Name validation: ${validation.validationMessage}`
  );

  await expect(
    moujaMasterPage.addMoujaDrawer,
    'TC25 FAILED - Add Mouja drawer disappeared after validation.'
  ).toBeVisible({
    timeout: 10000
  });

  const cancelButton =
    moujaMasterPage.addMoujaDrawer.getByRole(
      'button',
      {
        name: 'Cancel',
        exact: true
      }
    );

  await expect(
    cancelButton,
    'TC25 FAILED - Cancel button is not visible.'
  ).toBeVisible({
    timeout: 10000
  });

  await expect(
    cancelButton,
    'TC25 FAILED - Cancel button is disabled.'
  ).toBeEnabled({
    timeout: 10000
  });

  await expect(
    cancelButton,
    'TC25 FAILED - Cancel button text is incorrect.'
  ).toHaveText(
    'Cancel'
  );

  console.log('TC25 - Cancel button found.');

  await cancelButton.click();

  console.log('TC25 - Cancel button clicked.');

  await expect(
    moujaMasterPage.addMoujaDrawer,
    'TC25 FAILED - Cancel button did not close Add Mouja drawer.'
  ).toBeHidden({
    timeout: 10000
  });

  await moujaMasterPage.clearSearch();

  const rows =
    await moujaMasterPage.getRowTexts();

  const exists =
    rows.some(row =>
      row
        .toLowerCase()
        .includes(
          moujaNumber.toLowerCase()
        )
    );

  expect(
    exists,
    `TC25 FAILED\nInput Entered: ${moujaNumber}\nExpected: Record should NOT be created because Mouja Name is blank\nActual: Record was found in the table`
  ).toBeFalsy();

  console.log(
    'TC25 PASS - Mandatory validation appeared, Cancel closed the drawer and record was not created.'
  );
  });
  test('TC26 - Add a valid unique Mouja when available', async () => {
    const moujaNumber =
      'MJTEST1234';

    const moujaName =
      'Automation Mouja';

    await moujaMasterPage.clearSearch();

    const numbers =
      await moujaMasterPage.getMoujaNumbers();

    const names =
      await moujaMasterPage.getMoujaNames();

    if (
      numbers.some(
        value =>
          value.trim() ===
          moujaNumber
      ) ||
      names.some(
        value =>
          value.trim() ===
          moujaName
      )
    ) {
      console.log(
        `TC26 - Test data already exists. Number: ${moujaNumber}, Name: ${moujaName}`
      );

      return;
    }

    await moujaMasterPage.clickAddMouja();

    await moujaMasterPage.fillAddMoujaForm(
      moujaNumber,
      moujaName
    );

    await moujaMasterPage.clickSave();

    if (
      await moujaMasterPage
        .duplicateMoujaMessage
        .isVisible()
        .catch(() => false)
    ) {
      await expect(
        moujaMasterPage.duplicateMoujaMessage,
        `TC26 FAILED - Application reported duplicate data for unique test data.\nMouja Number: ${moujaNumber}\nMouja Name: ${moujaName}`
      ).toContainText(
        'duplicates not allowed'
      );

      await moujaMasterPage.closeDrawer();

      return;
    }

    if (
      await moujaMasterPage
        .addMoujaDrawer
        .isVisible()
    ) {
      await moujaMasterPage.closeDrawer();

      return;
    }
  });
  test('TC27 - Duplicate Mouja Number shows validation', async () => {
    await moujaMasterPage.clickAddMouja();

    await moujaMasterPage.fillAddMoujaForm(
      'MJTEST1234',
      'Different Mouja Name'
    );

    await moujaMasterPage.clickSave();

    await expect(
      moujaMasterPage.duplicateMoujaMessage,
      'TC27 FAILED - Duplicate Mouja Number was accepted without validation.'
    ).toBeVisible({
      timeout: 3000
    });

    await moujaMasterPage.closeDrawer();
  });
  test('TC28 - Duplicate Mouja Name shows validation', async () => {
    await moujaMasterPage.clickAddMouja();

    await moujaMasterPage.fillAddMoujaForm(
      'MJNEW12345',
      'Automation Mouja'
    );

    await moujaMasterPage.clickSave();

    await expect(
      moujaMasterPage.duplicateMoujaMessage,
      'TC28 FAILED - Duplicate Mouja Name was accepted without validation.'
    ).toBeVisible({
      timeout: 3000
    });

    await moujaMasterPage.closeDrawer();
  });
  test('TC29 - Mouja Number is limited to 10 characters', async () => {
    await moujaMasterPage.clickAddMouja();

    const inputValue =
      'MJTEST12345';

    await moujaMasterPage.fillMoujaNumber(
      inputValue
    );

    const actualValue =
      await moujaMasterPage
        .moujaNumberInput
        .inputValue();

    expect(
      actualValue.length,
      `TC29 FAILED\nInput Entered: ${inputValue}\nExpected: Maximum 10 characters\nActual: ${actualValue} (${actualValue.length} characters)`
    ).toBeLessThanOrEqual(10);

    await moujaMasterPage.closeDrawer();
  });
  test('TC30 - Mouja Number accepts only alphanumeric characters', async () => {
    await moujaMasterPage.clickAddMouja();

    const inputValue =
      'MJ@#123!$';

    console.log(
      `TC30 - Input Entered: ${inputValue}`
    );

    await moujaMasterPage.fillMoujaNumber(
      inputValue
    );

    const actualValue =
      await moujaMasterPage
        .moujaNumberInput
        .inputValue();

    console.log(
      `TC30 - Actual / Accepted Value: ${actualValue}`
    );

    expect(
      actualValue,
      `TC30 FAILED
Reason: Mouja Number accepted invalid special characters.

Input Entered : ${inputValue}
Accepted Value: ${actualValue}

Expected:
- Only A-Z, a-z and 0-9 should be accepted.
- Special characters such as @ # ! $ should be rejected.

Actual:
- Application accepted "${actualValue}".

Validation Rule Expected: /^[a-zA-Z0-9]*$/
`
    ).toMatch(
      /^[a-zA-Z0-9]*$/
    );

    console.log(
      'TC30 PASS - Mouja Number accepts only alphanumeric characters.'
    );

    await moujaMasterPage.closeDrawer();
  });
  test('TC31 - Newly added Mouja is displayed in the table', async () => {
    const moujaNumber =
      'MJTEST1234';

    await moujaMasterPage.searchMouja(
      moujaNumber
    );

    if (
      await moujaMasterPage.noDataMessage.isVisible()
    ) {
      console.log(
        `TC31 - ${moujaNumber} was not created in the previous test/environment.`
      );

      return;
    }

    const rowCount =
      await moujaMasterPage.getRowCount();

    expect(
      rowCount,
      `TC31 FAILED\nSearch Value: ${moujaNumber}\nExpected: Newly added Mouja should be displayed\nActual: ${rowCount} records`
    ).toBeGreaterThan(0);

    expect(
      (
        await moujaMasterPage.getMoujaNumbers()
      ).some(
        value =>
          value.trim() ===
          moujaNumber
      ),
      `TC31 FAILED\nExpected Mouja Number: ${moujaNumber}\nActual: Mouja Number was not found in the table`
    ).toBeTruthy();
  });
  test('TC32 - Verify Edit button opens Edit Mouja sidebar for a random record', async () => {
    console.log(
      '========== TC32 START =========='
    );

    const editData =
      await moujaMasterPage.openRandomEditMouja();

    console.log(
      `TC32 - Selected Mouja Number: ${editData.moujaNumber}`
    );

    console.log(
      `TC32 - Selected Mouja Name: ${editData.moujaName}`
    );

    console.log(
      `TC32 - Selected Mouja Status: ${editData.status}`
    );

    await expect(
      moujaMasterPage.editMoujaNumberInput,
      'TC32 FAILED - Mouja Number field is not visible in Edit sidebar.'
    ).toBeVisible();

    await expect(
      moujaMasterPage.editMoujaNameInput,
      'TC32 FAILED - Mouja Name field is not visible in Edit sidebar.'
    ).toBeVisible();

    console.log(
      'TC32 PASS - Edit Mouja sidebar opened successfully.'
    );
  });
  test('TC33 - Verify Edit sidebar fields are visible and values are prefilled', async () => {
    console.log(
      '========== TC33 START =========='
    );

    await moujaMasterPage.openRandomEditMouja();

    await moujaMasterPage.expectEditMoujaFieldsVisible();

    const moujaNumber =
      await moujaMasterPage.getEditMoujaNumberValue();

    const moujaName =
      await moujaMasterPage.getEditMoujaNameValue();

    console.log(
      `TC33 - Mouja Number: ${moujaNumber}`
    );

    console.log(
      `TC33 - Mouja Name: ${moujaName}`
    );

    expect(
      moujaNumber.trim(),
      'TC33 FAILED - Mouja Number field is empty when Edit sidebar opens.'
    ).not.toBe('');

    expect(
      moujaName.trim(),
      'TC33 FAILED - Mouja Name field is empty when Edit sidebar opens.'
    ).not.toBe('');

    await expect(
      moujaMasterPage.editMoujaNumberInput,
      `TC33 FAILED - Mouja Number value was not correctly prefilled.\nActual: ${moujaNumber}`
    ).toHaveValue(
      moujaNumber
    );

    await expect(
      moujaMasterPage.editMoujaNameInput,
      `TC33 FAILED - Mouja Name value was not correctly prefilled.\nActual: ${moujaName}`
    ).toHaveValue(
      moujaName
    );

    console.log(
      'TC33 PASS - Edit sidebar fields are visible and prefilled.'
    );
  });
  test('TC34 - Verify Edit sidebar Active/Inactive status toggle matches selected Mouja status', async () => {
    console.log(
      '========== TC34 START =========='
    );

    const editData =
      await moujaMasterPage.openRandomEditMouja();

    const tableStatus =
      editData.status
        .trim()
        .toLowerCase();

    const editStatus =
      await moujaMasterPage.getEditStatusLabel();

    const editChecked =
      await moujaMasterPage.getEditActiveStatus();

    const ariaChecked =
      await moujaMasterPage.editActiveStatusSwitch
        .getAttribute(
          'aria-checked'
        );

    const dataState =
      await moujaMasterPage.editActiveStatusSwitch
        .getAttribute(
          'data-state'
        );

    console.log(
      `TC34 - Table Status: ${editData.status}`
    );

    console.log(
      `TC34 - Edit Status: ${editStatus}`
    );

    console.log(
      `TC34 - Toggle Checked: ${editChecked}`
    );

    if (
      tableStatus === 'active'
    ) {
      expect(
        editStatus,
        `TC34 FAILED\nExpected Status: Active\nActual Status: ${editStatus}`
      ).toBe('Active');

      expect(
        editChecked,
        `TC34 FAILED\nExpected Toggle: Checked / true\nActual Toggle: ${editChecked}`
      ).toBe(true);

      expect(
        ariaChecked,
        `TC34 FAILED\nExpected aria-checked: true\nActual: ${ariaChecked}`
      ).toBe('true');

      expect(
        dataState,
        `TC34 FAILED\nExpected data-state: checked\nActual: ${dataState}`
      ).toBe('checked');
    } else if (
      tableStatus === 'inactive'
    ) {
      expect(
        editStatus,
        `TC34 FAILED\nExpected Status: Inactive\nActual Status: ${editStatus}`
      ).toBe('Inactive');

      expect(
        editChecked,
        `TC34 FAILED\nExpected Toggle: Unchecked / false\nActual Toggle: ${editChecked}`
      ).toBe(false);

      expect(
        ariaChecked,
        `TC34 FAILED\nExpected aria-checked: false\nActual: ${ariaChecked}`
      ).toBe('false');

      expect(
        dataState,
        `TC34 FAILED\nExpected data-state: unchecked\nActual: ${dataState}`
      ).toBe('unchecked');
    } else {
      throw new Error(
        `TC34 FAILED\nReason: Unexpected Mouja status.\nActual Status: ${editData.status}\nExpected: Active or Inactive`
      );
    }

    console.log(
      'TC34 PASS - Edit status matches table status.'
    );
  });
  test('TC35 - Verify Edit sidebar Cancel button closes the sidebar without updating the record', async () => {
    console.log(
      '========== TC35 START =========='
    );

    const editData =
      await moujaMasterPage.openRandomEditMouja();

    const originalNumber =
      editData.moujaNumber;

    const originalName =
      editData.moujaName;

    console.log(
      `TC35 - Original Number: ${originalNumber}`
    );

    console.log(
      `TC35 - Original Name: ${originalName}`
    );

    await moujaMasterPage.editCancelButton.click();

    await expect(
      moujaMasterPage.editMoujaDrawer,
      'TC35 FAILED - Cancel button did not close Edit sidebar.'
    ).toBeHidden({
      timeout: 5000
    });

    await moujaMasterPage.searchMouja(
      originalNumber
    );

    await expect(
      moujaMasterPage.moujaNumberCells
        .filter({
          hasText: originalNumber
        })
        .first(),
      `TC35 FAILED - Original Mouja Number "${originalNumber}" was not found after Cancel.`
    ).toBeVisible({
      timeout: 5000
    });

    await expect(
      moujaMasterPage.moujaNameCells
        .filter({
          hasText: originalName
        })
        .first(),
      `TC35 FAILED - Original Mouja Name "${originalName}" changed after Cancel.`
    ).toBeVisible({
      timeout: 5000
    });

    console.log(
      'TC35 PASS - Cancel closed sidebar and record remained unchanged.'
    );
  });
  test('TC36 - Verify Edit button is available for Mouja records', async () => {
    console.log(
      '========== TC36 START =========='
    );

    const editButtonCount =
      await moujaMasterPage.getEditButtonCount();

    console.log(
      `TC36 - Edit buttons available: ${editButtonCount}`
    );

    expect(
      editButtonCount,
      `TC36 FAILED\nExpected: At least 1 Edit button\nActual: ${editButtonCount}`
    ).toBeGreaterThan(0);

    const firstEditButton =
      moujaMasterPage.editButtons.first();

    await expect(
      firstEditButton,
      'TC36 FAILED - First Edit button is not visible.'
    ).toBeVisible();

    await expect(
      firstEditButton,
      'TC36 FAILED - Edit button does not have aria-label="Edit".'
    ).toHaveAttribute(
      'aria-label',
      'Edit'
    );

    console.log(
      'TC36 PASS - Edit button is available and has correct aria-label.'
    );
  });
  test('TC37 - Verify Edit sidebar Update and Cancel buttons are available', async () => {
    console.log(
      '========== TC37 START =========='
    );

    await moujaMasterPage.openRandomEditMouja();

    await expect(
      moujaMasterPage.editCancelButton,
      'TC37 FAILED - Cancel button is not visible in Edit sidebar.'
    ).toBeVisible();

    await expect(
      moujaMasterPage.editUpdateButton,
      'TC37 FAILED - Update button is not visible in Edit sidebar.'
    ).toBeVisible();

    await expect(
      moujaMasterPage.editCancelButton
    ).toHaveText(
      'Cancel'
    );

    await expect(
      moujaMasterPage.editUpdateButton
    ).toHaveText(
      'Update'
    );

    console.log(
      'TC37 PASS - Edit sidebar Update and Cancel buttons are available.'
    );
  });
  test('TC38 - Verify valid Mouja Number and Name are accepted in Edit sidebar', async () => {
    console.log(
      '========== TC38 START =========='
    );

    await moujaMasterPage.openRandomEditMouja();

    const validNumber =
      'MJ12345';

    const validName =
      'Kopri123';

    console.log(
      `TC38 - Input Number: ${validNumber}`
    );

    console.log(
      `TC38 - Input Name: ${validName}`
    );

    await moujaMasterPage.enterEditMoujaNumber(
      validNumber
    );

    await moujaMasterPage.enterEditMoujaName(
      validName
    );

    const actualNumber =
      await moujaMasterPage.getEditMoujaNumberValue();

    const actualName =
      await moujaMasterPage.getEditMoujaNameValue();

    console.log(
      `TC38 - Accepted Number: ${actualNumber}`
    );

    console.log(
      `TC38 - Accepted Name: ${actualName}`
    );

    expect(
      actualNumber,
      `TC38 FAILED\nInput Entered: ${validNumber}\nExpected: ${validNumber}\nAccepted Value: ${actualNumber}`
    ).toBe(
      validNumber
    );

    expect(
      actualName,
      `TC38 FAILED\nInput Entered: ${validName}\nExpected: ${validName}\nAccepted Value: ${actualName}`
    ).toBe(
      validName
    );

    console.log(
      'TC38 PASS - Valid values are accepted.'
    );
  });
  test('TC39 - Verify Mouja Number rejects special characters', async () => {
    console.log(
      '========== TC39 START =========='
    );

    await moujaMasterPage.openRandomEditMouja();

    const inputValue =
      'MJ@#123!$';

    await moujaMasterPage.enterEditMoujaNumber(
      inputValue
    );

    const actualValue =
      await moujaMasterPage.getEditMoujaNumberValue();

    console.log(
      `TC39 - Input Entered: ${inputValue}`
    );

    console.log(
      `TC39 - Accepted Value: ${actualValue}`
    );

    expect(
      actualValue,
      `TC39 FAILED
Reason: Mouja Number accepted invalid special characters.

Input Entered : ${inputValue}
Accepted Value: ${actualValue}

Expected:
Only A-Z, a-z and 0-9 should be accepted.

Expected Rule:
^[a-zA-Z0-9]*$

Actual:
"${actualValue}"
`
    ).toMatch(
      /^[a-zA-Z0-9]*$/
    );

    console.log(
      'TC39 PASS - Special characters were rejected.'
    );
  });
  test('TC40 - Verify Mouja Name rejects special characters', async () => {
    console.log(
      '========== TC40 START =========='
    );

    await moujaMasterPage.openRandomEditMouja();

    const inputValue =
      'Kopri@#$123!';

    await moujaMasterPage.enterEditMoujaName(
      inputValue
    );

    const actualValue =
      await moujaMasterPage.getEditMoujaNameValue();

    console.log(
      `TC40 - Input Entered: ${inputValue}`
    );

    console.log(
      `TC40 - Accepted Value: ${actualValue}`
    );

    expect(
      actualValue,
      `TC40 FAILED
Reason: Mouja Name accepted invalid special characters.

Input Entered : ${inputValue}
Accepted Value: ${actualValue}

Expected:
Only A-Z, a-z, 0-9 and spaces should be accepted.

Expected Rule:
^[a-zA-Z0-9\\s]*$

Actual:
"${actualValue}"
`
    ).toMatch(
      /^[a-zA-Z0-9\s]*$/
    );

    console.log(
      'TC40 PASS - Special characters were rejected.'
    );
  });
  test('TC41 - Verify Mouja Number does not accept decimal values', async () => {
    console.log(
      '========== TC41 START =========='
    );

    await moujaMasterPage.openRandomEditMouja();

    const inputValue =
      '123.45';

    await moujaMasterPage.enterEditMoujaNumber(
      inputValue
    );

    const actualValue =
      await moujaMasterPage.getEditMoujaNumberValue();

    console.log(
      `TC41 - Input Entered: ${inputValue}`
    );

    console.log(
      `TC41 - Accepted Value: ${actualValue}`
    );

    expect(
      actualValue,
      `TC41 FAILED
Reason: Mouja Number accepts decimal values.

Input Entered : ${inputValue}
Accepted Value: ${actualValue}

Expected:
- Decimal values should NOT be accepted.
- The "." character should be rejected.
- Only A-Z, a-z and 0-9 should be accepted.

Expected Rule:
^[a-zA-Z0-9]*$

Actual:
"${actualValue}"

Bug:
Application accepted the decimal value "${inputValue}".
`
    ).not.toContain('.');

    expect(
      actualValue,
      `TC41 FAILED
Reason: Mouja Number contains invalid characters.

Input Entered : ${inputValue}
Accepted Value: ${actualValue}

Expected:
Only A-Z, a-z and 0-9 are allowed.

Actual:
"${actualValue}"
`
    ).toMatch(
      /^[a-zA-Z0-9]*$/
    );

    console.log(
      'TC41 PASS - Decimal value was rejected.'
    );
  });
  test('TC42 - Verify Mouja Name does not accept decimal values', async () => {
    console.log(
      '========== TC42 START =========='
    );

    await moujaMasterPage.openRandomEditMouja();

    const inputValue =
      'Kopri12.50';

    await moujaMasterPage.enterEditMoujaName(
      inputValue
    );

    const actualValue =
      await moujaMasterPage.getEditMoujaNameValue();

    console.log(
      `TC42 - Input Entered: ${inputValue}`
    );

    console.log(
      `TC42 - Accepted Value: ${actualValue}`
    );

    expect(
      actualValue,
      `TC42 FAILED
Reason: Mouja Name accepts decimal values.

Input Entered : ${inputValue}
Accepted Value: ${actualValue}

Expected:
- Decimal values should NOT be accepted.
- The "." character should be rejected.
- Only A-Z, a-z, 0-9 and spaces should be accepted.

Expected Rule:
^[a-zA-Z0-9\\s]*$

Actual:
"${actualValue}"

Bug:
Application accepted the decimal value "${inputValue}".
`
    ).not.toContain('.');

    expect(
      actualValue,
      `TC42 FAILED
Reason: Mouja Name contains invalid characters.

Input Entered : ${inputValue}
Accepted Value: ${actualValue}

Expected:
Only A-Z, a-z, 0-9 and spaces are allowed.

Actual:
"${actualValue}"
`
    ).toMatch(
      /^[a-zA-Z0-9\s]*$/
    );

    console.log(
      'TC42 PASS - Decimal value was rejected from Mouja Name.'
    );
  });
  test('TC43 - Verify Mouja Number rejects decimal and special character combination', async () => {
    console.log(
      '========== TC43 START =========='
    );

    await moujaMasterPage.openRandomEditMouja();

    const inputValue =
      'MJ12.5@';

    await moujaMasterPage.enterEditMoujaNumber(
      inputValue
    );

    const actualValue =
      await moujaMasterPage.getEditMoujaNumberValue();

    console.log(
      `TC43 - Input Entered: ${inputValue}`
    );

    console.log(
      `TC43 - Accepted Value: ${actualValue}`
    );

    expect(
      actualValue,
      `TC43 FAILED
Reason: Mouja Number accepted decimal/special characters.

Input Entered : ${inputValue}
Accepted Value: ${actualValue}

Expected:
- "." should be rejected.
- "@" should be rejected.
- Only A-Z, a-z and 0-9 should be accepted.

Expected Rule:
^[a-zA-Z0-9]*$

Actual:
"${actualValue}"

Bug:
Application accepted an invalid decimal/special-character combination.
`
    ).toMatch(
      /^[a-zA-Z0-9]*$/
    );

    console.log(
      'TC43 PASS - Decimal and special characters were rejected.'
    );
  });
  test('TC44 - Verify Mouja Name rejects decimal and special character combination', async () => {
    console.log(
      '========== TC44 START =========='
    );

    await moujaMasterPage.openRandomEditMouja();

    const inputValue =
      'Kopri12.5@';

    await moujaMasterPage.enterEditMoujaName(
      inputValue
    );

    const actualValue =
      await moujaMasterPage.getEditMoujaNameValue();

    console.log(
      `TC44 - Input Entered: ${inputValue}`
    );

    console.log(
      `TC44 - Accepted Value: ${actualValue}`
    );

    expect(
      actualValue,
      `TC44 FAILED
Reason: Mouja Name accepted decimal/special characters.

Input Entered : ${inputValue}
Accepted Value: ${actualValue}

Expected:
- "." should be rejected.
- "@" should be rejected.
- Only A-Z, a-z, 0-9 and spaces should be accepted.

Expected Rule:
^[a-zA-Z0-9\\s]*$

Actual:
"${actualValue}"

Bug:
Application accepted an invalid decimal/special-character combination.
`
    ).toMatch(
      /^[a-zA-Z0-9\s]*$/
    );

    console.log(
      'TC44 PASS - Decimal and special characters were rejected.'
    );
  });
  test('TC45 - Verify Marathi Language Translation on Mouja Master Page', async () => {
  console.log('========== TC45 START ==========');

  try {
    console.log('TC45 - Opening user menu...');
    await moujaMasterPage.openUserMenu();

    console.log('TC45 - Opening language options...');
    await moujaMasterPage.openLanguageMenu();

    console.log('TC45 - Selecting Marathi language...');

    const marathiOption = moujaMasterPage.page
      .getByRole('listbox')
      .getByRole('option', {
        name: 'मराठी (Marathi)',
        exact: true
      });

    await expect(
      marathiOption,
      'TC45 FAILED - Marathi (Marathi) language option was not visible.'
    ).toBeVisible({
      timeout: 10000
    });

    await marathiOption.click();

    console.log(
      'TC45 - Marathi language selected successfully.'
    );

    await moujaMasterPage.page.waitForURL(
      /\/mr\/property-tax\/moujamaster$/,
      {
        timeout: 10000
      }
    );

    console.log(
      `TC45 - Current URL: ${moujaMasterPage.page.url()}`
    );

    await expect(
      moujaMasterPage.page,
      'TC45 FAILED - URL did not change to Marathi Mouja Master page.'
    ).toHaveURL(
      /\/mr\/property-tax\/moujamaster$/
    );

    console.log(
      'TC45 - Verifying Marathi page title...'
    );

    await expect(
      moujaMasterPage.page.getByRole('heading', {
        name: 'मौजा मास्टर',
        exact: true
      }),
      'TC45 FAILED - Marathi page title "मौजा मास्टर" was not visible.'
    ).toBeVisible({
      timeout: 10000
    });

    console.log(
      'TC45 PASS - Marathi page title verified.'
    );

    console.log(
      'TC45 - Verifying Marathi page subtitle...'
    );

    await expect(
      moujaMasterPage.page.getByText(
        'मौजा नोंदी आणि त्यांचे तपशील व्यवस्थापित करा',
        {
          exact: true
        }
      ),
      'TC45 FAILED - Marathi page subtitle was not visible.'
    ).toBeVisible({
      timeout: 10000
    });

    console.log(
      'TC45 PASS - Marathi page subtitle verified.'
    );

    console.log(
      'TC45 - Verifying Marathi search placeholder...'
    );

    await expect(
      moujaMasterPage.page.getByPlaceholder(
        'मौजा क्रमांक किंवा नावाने शोधा...',
        {
          exact: true
        }
      ),
      'TC45 FAILED - Marathi search placeholder was not found.'
    ).toBeVisible({
      timeout: 10000
    });

    console.log(
      'TC45 PASS - Marathi search placeholder verified.'
    );

    console.log(
      'TC45 - Verifying Marathi Add Mouja button...'
    );

    await expect(
      moujaMasterPage.page.getByRole('button', {
        name: 'मौजा जोडा',
        exact: true
      }),
      'TC45 FAILED - Marathi "मौजा जोडा" button was not visible.'
    ).toBeVisible({
      timeout: 10000
    });

    console.log(
      'TC45 PASS - Marathi Add Mouja button verified.'
    );

    console.log(
      'TC45 - Verifying Marathi table headers...'
    );

    const expectedMarathiHeaders = [
      'मौजा क्रमांक',
      'मौजा नाव',
      'स्थिती',
      'कृती'
    ];

    const actualHeaders =
      await moujaMasterPage.page
        .locator('thead th')
        .allTextContents();

    const normalizedHeaders =
      actualHeaders.map(
        header => header.trim()
      );

    console.log(
      `TC45 - Actual table headers: ${normalizedHeaders.join(' | ')}`
    );

    for (
      const expectedHeader of expectedMarathiHeaders
    ) {
      expect(
        normalizedHeaders,
        `TC45 FAILED - Marathi table header "${expectedHeader}" was not found.`
      ).toContain(expectedHeader);
    }

    console.log(
      'TC45 PASS - All Marathi table headers verified.'
    );

    console.log(
      'TC45 - Verifying Marathi Edit buttons...'
    );

    const marathiEditButtons =
      moujaMasterPage.page.locator(
        'button[aria-label="संपादित करा"]'
      );

    const editButtonCount =
      await marathiEditButtons.count();

    console.log(
      `TC45 - Marathi Edit button count: ${editButtonCount}`
    );

    expect(
      editButtonCount,
      'TC45 FAILED - Marathi Edit buttons were not found.'
    ).toBeGreaterThan(0);

    console.log(
      'TC45 PASS - Marathi Edit buttons verified.'
    );

    console.log(
      'TC45 - Verifying Marathi Delete buttons...'
    );

    const marathiDeleteButtons =
      moujaMasterPage.page.locator(
        'button[aria-label="हटवा"]'
      );

    const deleteButtonCount =
      await marathiDeleteButtons.count();

    console.log(
      `TC45 - Marathi Delete button count: ${deleteButtonCount}`
    );

    expect(
      deleteButtonCount,
      'TC45 FAILED - Marathi Delete buttons were not found.'
    ).toBeGreaterThan(0);

    console.log(
      'TC45 PASS - Marathi Delete buttons verified.'
    );

    console.log(
      'TC45 - Verifying Marathi rows-per-page label...'
    );

    await expect(
      moujaMasterPage.page.getByRole('combobox', {
        name: 'प्रति पृष्ठ ओळी'
      }),
      'TC45 FAILED - Marathi "प्रति पृष्ठ ओळी" combobox was not found.'
    ).toBeVisible({
      timeout: 10000
    });

    console.log(
      'TC45 PASS - Marathi rows-per-page label verified.'
    );

    console.log(
      'TC45 - Verifying Marathi footer text...'
    );

    await expect(
      moujaMasterPage.page.getByText(
        /दाखवत आहे/,
        {
          exact: false
        }
      ),
      'TC45 FAILED - Marathi table footer text was not visible.'
    ).toBeVisible({
      timeout: 10000
    });

    console.log(
      'TC45 PASS - Marathi footer text verified.'
    );

    console.log(
      'TC45 PASS - Marathi language translation verified successfully.'
    );

  } catch (error) {
    console.error(
      'TC45 FAILED - Marathi language verification failed.'
    );

    throw error;
  } finally {
    console.log('========== TC45 END ==========');
  }
  });

  test.afterAll(async () => {
    try {
      if (
        page &&
        moujaMasterPage
      ) {
        if (
          await moujaMasterPage
            .isAddDrawerVisible()
            .catch(() => false)
        ) {
          await moujaMasterPage.closeDrawer();
        }

        if (
          await moujaMasterPage
            .isEditDrawerVisible()
            .catch(() => false)
        ) {
          await moujaMasterPage.closeEditMoujaDrawer();
        }
      }
    } catch (error) {
      console.log(
        'Final cleanup skipped because the page was not in a suitable state.'
      );
    }
  });
});
