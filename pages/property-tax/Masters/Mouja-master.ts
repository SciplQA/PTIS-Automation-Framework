import { Locator, Page } from '@playwright/test';
import { PropertyTaxBasePage } from '../PropertyTaxBasePage';

export class MoujaMasterPage extends PropertyTaxBasePage {
  private readonly navigationLink: Locator;
  readonly searchField: Locator;
  readonly table: Locator;
  readonly tableRows: Locator;
  readonly moujaNumberCells: Locator;
  readonly moujaNameCells: Locator;
  readonly statusCells: Locator;
  readonly noDataMessage: Locator;
  readonly duplicateMoujaMessage: Locator;
  readonly addMoujaButton: Locator;
  readonly addMoujaDrawer: Locator;
  readonly moujaNumberInput: Locator;
  readonly moujaNameInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly closeDrawerButton: Locator;

  constructor(page: Page) {
    super(page);
    this.navigationLink = page.locator('a[href="/en/property-tax/moujamaster"]');
    this.searchField = page.getByPlaceholder('Search by Mouja Number or Name...');
    this.table = page.locator('table');
    this.tableRows = page.locator('table tbody tr');
    this.moujaNumberCells = page.locator('table tbody tr td:nth-child(1)');
    this.moujaNameCells = page.locator('table tbody tr td:nth-child(2)');
    this.statusCells = page.locator('table tbody tr td:nth-child(3)');
    this.noDataMessage = page.getByText('No data available', { exact: true });
    this.duplicateMoujaMessage = page.getByText(
      'Please check Mouja Number and Name - duplicates not allowed.',
      { exact: true }
    );
    this.addMoujaButton = page.getByText('Add Mouja', { exact: true });
    this.addMoujaDrawer = page.locator('div[role="dialog"][aria-modal="true"]').filter({
      hasText: 'Add Mouja'
    });
    this.moujaNumberInput = this.addMoujaDrawer.locator('input[name="moujaNo"]');
    this.moujaNameInput = this.addMoujaDrawer.locator('input[name="moujaName"]');
    this.saveButton = this.addMoujaDrawer.getByRole('button', { name: 'Save' });
    this.cancelButton = this.addMoujaDrawer.getByRole('button', { name: 'Cancel' });
    this.closeDrawerButton = this.addMoujaDrawer.locator('button').filter({
      has: page.locator('svg.lucide-x')
    }).first();
  }

  async navigateFromPropertyTaxModule(): Promise<void> {
    await this.selectMasterSubmenu('Mouja Master');
  }

  async expectLoaded(): Promise<void> {
    await this.navigationLink.waitFor({ state: 'visible' });
    await this.page.waitForURL('**/en/property-tax/moujamaster');
    await this.searchField.waitFor({ state: 'visible' });
  }

  async searchMouja(searchText: string): Promise<void> {
    await this.searchField.fill(searchText);
    await this.page.waitForTimeout(1000);
  }

  async clearSearch(): Promise<void> {
    await this.searchField.fill('');
    await this.page.waitForTimeout(1000);
  }

  async getRowCount(): Promise<number> {
    return this.tableRows.filter({ hasNotText: 'No data available' }).count();
  }

  async getMoujaNumbers(): Promise<string[]> {
    return this.tableRows.filter({ hasNotText: 'No data available' })
      .locator('td:nth-child(1)').allTextContents();
  }

  async getMoujaNames(): Promise<string[]> {
    return this.tableRows.filter({ hasNotText: 'No data available' })
      .locator('td:nth-child(2)').allTextContents();
  }

  async getStatuses(): Promise<string[]> {
    return this.tableRows.filter({ hasNotText: 'No data available' })
      .locator('td:nth-child(3)').allTextContents();
  }

  async getRowTexts(): Promise<string[]> {
    return this.tableRows.filter({ hasNotText: 'No data available' }).allTextContents();
  }

  async clickAddMouja(): Promise<void> {
    await this.addMoujaButton.click();
    await this.addMoujaDrawer.waitFor({ state: 'visible', timeout: 5000 });
  }

  async fillMoujaNumber(value: string): Promise<void> {
    await this.moujaNumberInput.fill(value);
  }

  async fillMoujaName(value: string): Promise<void> {
    await this.moujaNameInput.fill(value);
  }

  async fillAddMoujaForm(moujaNumber: string, moujaName: string): Promise<void> {
    await this.fillMoujaNumber(moujaNumber);
    await this.fillMoujaName(moujaName);
  }

  async clickSave(): Promise<void> {
    await this.saveButton.click();
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
    await this.addMoujaDrawer.waitFor({ state: 'hidden', timeout: 3000 });
  }

  async closeDrawer(): Promise<void> {
    await this.closeDrawerButton.click();
    await this.addMoujaDrawer.waitFor({ state: 'hidden', timeout: 3000 });
  }

  async isAddDrawerVisible(): Promise<boolean> {
    return this.addMoujaDrawer.isVisible();
  }

  async getFieldValidation(field: 'moujaNo' | 'moujaName'): Promise<{ required: boolean; validationMessage: string }> {
    const input = field === 'moujaNo' ? this.moujaNumberInput : this.moujaNameInput;
    return input.evaluate((element: HTMLInputElement) => ({
      required: element.required,
      validationMessage: element.validationMessage
    }));
  }
}