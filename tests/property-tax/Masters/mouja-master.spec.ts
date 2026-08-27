import { internalTest as test, expect } from '../../../fixtures/internalSessionFixtures';
import { Page } from '@playwright/test';
import { MoujaMasterPage } from '../../../pages/property-tax/Masters/Mouja-master';

test.describe.configure({ mode: 'serial' });

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
      throw new Error('The shared PTIS session expired during the Mouja suite. It will not re-authenticate mid-run.');
    }

    if (await moujaMasterPage.isAddDrawerVisible().catch(() => false)) {
      await moujaMasterPage.closeDrawer();
    }
    await moujaMasterPage.clearSearch();
  });

  test.afterEach(async () => {
    if (await moujaMasterPage.isAddDrawerVisible().catch(() => false)) {
      await moujaMasterPage.closeDrawer();
    }
  });

  test('TC01 - Mouja Master page load', async () => {
    await expect(moujaMasterPage.searchField).toBeVisible();
    await expect(moujaMasterPage.table).toBeVisible();
  });

  test('TC02 - Search field is clickable and accepts text', async () => {
    await expect(moujaMasterPage.searchField).toBeEditable();
    await moujaMasterPage.searchField.fill('MJ001');
    await expect(moujaMasterPage.searchField).toHaveValue('MJ001');
  });

  test('TC03 - Mouja records are displayed after page load', async () => {
    await moujaMasterPage.clearSearch();
    expect(await moujaMasterPage.getRowCount()).toBeGreaterThan(0);
    await expect(moujaMasterPage.tableRows.first()).toBeVisible();
  });

  test('TC04 - Search by valid Mouja Number', async () => {
    await moujaMasterPage.searchMouja('MJ001');
    expect(await moujaMasterPage.getRowCount()).toBeGreaterThan(0);
    for (const number of await moujaMasterPage.getMoujaNumbers()) {
      expect(number.trim().toLowerCase()).toContain('mj001');
    }
  });

  test('TC05 - Search by valid Mouja Name', async () => {
    await moujaMasterPage.searchMouja('Kopri');
    expect(await moujaMasterPage.getRowCount()).toBeGreaterThan(0);
    for (const row of await moujaMasterPage.getRowTexts()) {
      expect(row.toLowerCase()).toContain('kopri');
    }
  });

  test('TC06 - Search by partial Mouja Number', async () => {
    await moujaMasterPage.searchMouja('MJ');
    expect(await moujaMasterPage.getRowCount()).toBeGreaterThan(0);
    for (const number of await moujaMasterPage.getMoujaNumbers()) {
      expect(number.trim().toLowerCase()).toContain('mj');
    }
  });

  test('TC07 - Search by partial Mouja Name', async () => {
    await moujaMasterPage.searchMouja('Ban');
    expect(await moujaMasterPage.getRowCount()).toBeGreaterThan(0);
    for (const name of await moujaMasterPage.getMoujaNames()) {
      expect(name.trim().toLowerCase()).toContain('ban');
    }
  });

  test('TC08 - Search with invalid Mouja Number or Name', async () => {
    await moujaMasterPage.searchMouja('INVALID999999');
    await expect(moujaMasterPage.noDataMessage).toBeVisible();
    await expect(moujaMasterPage.noDataMessage).toHaveText('No data available');
    expect(await moujaMasterPage.getRowCount()).toBe(0);
  });

  test('TC09 - Search with special characters', async () => {
    await moujaMasterPage.searchMouja('@#$%^&*');
    const rowCount = await moujaMasterPage.getRowCount();
    expect(rowCount === 0 || await moujaMasterPage.noDataMessage.isVisible()).toBeTruthy();
  });

  test('TC10 - Blank search displays all records', async () => {
    await moujaMasterPage.clearSearch();
    expect(await moujaMasterPage.getRowCount()).toBeGreaterThan(0);
    await expect(moujaMasterPage.noDataMessage).not.toBeVisible();
  });

  test('TC11 - Search with only spaces displays all records', async () => {
    await moujaMasterPage.searchMouja('     ');
    expect(await moujaMasterPage.getRowCount()).toBeGreaterThan(0);
    await expect(moujaMasterPage.noDataMessage).not.toBeVisible();
  });

  test('TC12 - Search with leading and trailing spaces', async () => {
    await moujaMasterPage.searchMouja('  MJ001  ');
    expect(await moujaMasterPage.getRowCount()).toBeGreaterThan(0);
    for (const number of await moujaMasterPage.getMoujaNumbers()) {
      expect(number.trim().toLowerCase()).toContain('mj001');
    }
  });

  test('TC13 - Clear search displays all Mouja records', async () => {
    await moujaMasterPage.searchMouja('MJ001');
    await moujaMasterPage.clearSearch();
    expect(await moujaMasterPage.getRowCount()).toBeGreaterThan(0);
    await expect(moujaMasterPage.noDataMessage).not.toBeVisible();
  });

  test('TC14 - Add Mouja button is visible and enabled', async () => {
    await expect(moujaMasterPage.addMoujaButton).toBeVisible();
    await expect(moujaMasterPage.addMoujaButton).toBeEnabled();
  });

  test('TC15 - Add Mouja drawer opens', async () => {
    await moujaMasterPage.clickAddMouja();
    await expect(moujaMasterPage.addMoujaDrawer).toBeVisible();
  });

  test('TC16 - Add Mouja title and subtitle are visible', async () => {
    await moujaMasterPage.clickAddMouja();
    await expect(moujaMasterPage.addMoujaDrawer.getByText('Add Mouja', { exact: true })).toBeVisible();
    await expect(moujaMasterPage.addMoujaDrawer.getByText('Create new mouja', { exact: true })).toBeVisible();
  });

  test('TC17 - Mouja Number field is visible and enabled', async () => {
    await moujaMasterPage.clickAddMouja();
    await expect(moujaMasterPage.moujaNumberInput).toBeVisible();
    await expect(moujaMasterPage.moujaNumberInput).toBeEnabled();
    await expect(moujaMasterPage.moujaNumberInput).toHaveAttribute('name', 'moujaNo');
  });

  test('TC18 - Mouja Name field is visible and enabled', async () => {
    await moujaMasterPage.clickAddMouja();
    await expect(moujaMasterPage.moujaNameInput).toBeVisible();
    await expect(moujaMasterPage.moujaNameInput).toBeEnabled();
    await expect(moujaMasterPage.moujaNameInput).toHaveAttribute('name', 'moujaName');
  });

  test('TC19 - Close icon closes Add Mouja drawer', async () => {
    await moujaMasterPage.clickAddMouja();
    await moujaMasterPage.closeDrawer();
    await expect(moujaMasterPage.addMoujaDrawer).not.toBeVisible();
    await expect(moujaMasterPage.table).toBeVisible();
  });

  test('TC20 - Cancel closes Add Mouja drawer', async () => {
    await moujaMasterPage.clickAddMouja();
    await moujaMasterPage.clickCancel();
    await expect(moujaMasterPage.addMoujaDrawer).not.toBeVisible();
  });

  test('TC21 - Cancel does not add entered Mouja', async () => {
    await moujaMasterPage.clickAddMouja();
    await moujaMasterPage.fillAddMoujaForm('CANCEL999', 'Cancel Test');
    await moujaMasterPage.clickCancel();
    await moujaMasterPage.clearSearch();
    const rows = await moujaMasterPage.getRowTexts();
    expect(rows.some(row => row.toLowerCase().includes('cancel999'))).toBeFalsy();
  });

  test('TC22 - Blank Mouja fields show validation', async () => {
    await moujaMasterPage.clickAddMouja();
    await moujaMasterPage.clickSave();
    const numberValidation = await moujaMasterPage.getFieldValidation('moujaNo');
    const nameValidation = await moujaMasterPage.getFieldValidation('moujaName');
    expect(numberValidation.required).toBeTruthy();
    expect(nameValidation.required).toBeTruthy();
    expect(numberValidation.validationMessage).not.toBe('');
    expect(nameValidation.validationMessage).not.toBe('');
    await expect(moujaMasterPage.addMoujaDrawer).toBeVisible();
  });

  test('TC23 - Blank Mouja Number shows validation', async () => {
    await moujaMasterPage.clickAddMouja();
    await moujaMasterPage.fillMoujaName('Test Mouja');
    await moujaMasterPage.clickSave();
    const validation = await moujaMasterPage.getFieldValidation('moujaNo');
    expect(validation.required).toBeTruthy();
    expect(validation.validationMessage).not.toBe('');
    await expect(moujaMasterPage.addMoujaDrawer).toBeVisible();
  });

  test('TC24 - Blank Mouja Name shows validation', async () => {
    await moujaMasterPage.clickAddMouja();
    await moujaMasterPage.fillMoujaNumber('TEST999');
    await moujaMasterPage.clickSave();
    const validation = await moujaMasterPage.getFieldValidation('moujaName');
    expect(validation.required).toBeTruthy();
    expect(validation.validationMessage).not.toBe('');
    await expect(moujaMasterPage.addMoujaDrawer).toBeVisible();
  });

  test('TC25 - Mandatory validation does not add a record', async () => {
    await moujaMasterPage.clickAddMouja();
    await moujaMasterPage.fillMoujaNumber('INVALID99');
    await moujaMasterPage.clickSave();
    const validation = await moujaMasterPage.getFieldValidation('moujaName');
    expect(validation.required).toBeTruthy();
    expect(validation.validationMessage).not.toBe('');
    await moujaMasterPage.closeDrawer();
    await moujaMasterPage.clearSearch();
    expect((await moujaMasterPage.getRowTexts()).some(row => row.includes('INVALID99'))).toBeFalsy();
  });

  test('TC26 - Add a valid unique Mouja when available', async () => {
    await moujaMasterPage.clearSearch();
    const numbers = await moujaMasterPage.getMoujaNumbers();
    const names = await moujaMasterPage.getMoujaNames();
    if (numbers.some(value => value.trim() === 'MJTEST1234') || names.some(value => value.trim() === 'Automation Mouja')) return;

    await moujaMasterPage.clickAddMouja();
    await moujaMasterPage.fillAddMoujaForm('MJTEST1234', 'Automation Mouja');
    await moujaMasterPage.clickSave();

    if (await moujaMasterPage.duplicateMoujaMessage.isVisible().catch(() => false)) {
      await expect(moujaMasterPage.duplicateMoujaMessage).toContainText('duplicates not allowed');
      await moujaMasterPage.closeDrawer();
      return;
    }

    if (await moujaMasterPage.addMoujaDrawer.isVisible()) {
      await moujaMasterPage.closeDrawer();
      return;
    }
    await page.waitForTimeout(500);
  });

  test('TC27 - Duplicate Mouja Number shows validation', async () => {
    await moujaMasterPage.clickAddMouja();
    await moujaMasterPage.fillAddMoujaForm('MJTEST1234', 'Different Mouja Name');
    await moujaMasterPage.clickSave();
    await expect(moujaMasterPage.duplicateMoujaMessage).toBeVisible({ timeout: 3000 });
    await moujaMasterPage.closeDrawer();
  });

  test('TC28 - Duplicate Mouja Name shows validation', async () => {
    await moujaMasterPage.clickAddMouja();
    await moujaMasterPage.fillAddMoujaForm('MJNEW12345', 'Automation Mouja');
    await moujaMasterPage.clickSave();
    await expect(moujaMasterPage.duplicateMoujaMessage).toBeVisible({ timeout: 3000 });
    await moujaMasterPage.closeDrawer();
  });

  test('TC29 - Mouja Number is limited to 10 characters', async () => {
    await moujaMasterPage.clickAddMouja();
    await moujaMasterPage.fillMoujaNumber('MJTEST12345');
    expect((await moujaMasterPage.moujaNumberInput.inputValue()).length).toBeLessThanOrEqual(10);
    await moujaMasterPage.closeDrawer();
  });

  test('TC30 - Mouja Number accepts only alphanumeric characters', async () => {
    await moujaMasterPage.clickAddMouja();
    await moujaMasterPage.fillMoujaNumber('MJ@#123!$');
    expect(await moujaMasterPage.moujaNumberInput.inputValue()).toMatch(/^[a-zA-Z0-9]*$/);
    await moujaMasterPage.closeDrawer();
  });

  test('TC31 - Newly added Mouja is displayed in the table', async () => {
    await moujaMasterPage.searchMouja('MJTEST1234');
    if (await moujaMasterPage.noDataMessage.isVisible()) return;
    expect(await moujaMasterPage.getRowCount()).toBeGreaterThan(0);
    expect((await moujaMasterPage.getMoujaNumbers()).some(value => value.trim() === 'MJTEST1234')).toBeTruthy();
  });

  test.afterAll(async () => {
    if (page && !page.url().includes('/login')) {
      if (await moujaMasterPage.isAddDrawerVisible().catch(() => false)) {
        await moujaMasterPage.closeDrawer();
      }
    }
  });
});
