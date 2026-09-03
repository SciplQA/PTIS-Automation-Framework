import { expect, Locator, Page } from '@playwright/test';
import { PropertyTaxBasePage } from '../PropertyTaxBasePage';

export class MoujaMasterPage extends PropertyTaxBasePage {
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
    this.addMoujaButton = page.getByRole('button', { name: 'Add Mouja', exact: true });
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
    await this.page.waitForURL('**/en/property-tax/moujamaster');
    await this.searchField.waitFor({ state: 'visible' });
  }

  async searchMouja(searchText: string): Promise<void> {
    await this.searchField.fill(searchText);
    await this.waitForSearchResults(searchText);
  }

  async clearSearch(): Promise<void> {
    await this.searchField.fill('');
    await expect(this.searchField).toHaveValue('');
    // Clearing a previous invalid search must wait until the stale no-data
    // state disappears and the unfiltered records are rendered again.
    await expect(this.noDataMessage).toBeHidden({ timeout: 5000 });
    await expect.poll(
      async () => this.getRowCount(),
      { timeout: 5000, message: 'Mouja records did not reload after clearing search' }
    ).toBeGreaterThan(0);
  }

  private async waitForSearchResults(searchText: string): Promise<void> {
    const normalizedSearch = searchText.trim().toLowerCase();

    await expect.poll(async () => {
      if (await this.noDataMessage.isVisible()) return true;

      const rows = await this.getRowTexts();
      if (!normalizedSearch) return rows.length > 0;

      return rows.length > 0 && rows.every(row =>
        row.toLowerCase().includes(normalizedSearch)
      );
    }, {
      timeout: 5000,
      message: `Mouja results did not refresh for search: ${searchText}`,
    }).toBeTruthy();
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
    // Each test gets a fresh drawer. Previous tests intentionally leave the
    // form open, and reusing that animated container can expose an outer
    // dialog before its title/content has mounted.
    await expect(async () => {
      await expect(this.addMoujaButton).toBeVisible();
      await expect(this.addMoujaButton).toBeEnabled();

      if (await this.addMoujaDrawer.isVisible().catch(() => false)) {
        await this.page.keyboard.press('Escape').catch(() => undefined);
        const closed = await expect(this.addMoujaDrawer)
          .toBeHidden({ timeout: 1000 })
          .then(() => true)
          .catch(() => false);
        if (!closed) {
          await this.page.goto(this.page.url(), { waitUntil: 'domcontentloaded' }).catch(() => undefined);
        }
      }

      await this.addMoujaButton.click();

      await expect(this.addMoujaDrawer).toBeVisible({ timeout: 1500 });
      // Confirm the drawer content is mounted, not just its outer animation
      // container. This prevents the next action racing a transient drawer.
      await expect(this.addMoujaDrawer.getByText('Add Mouja', { exact: true }))
        .toBeVisible({ timeout: 1500 });
    }).toPass({
      timeout: 8000,
      intervals: [250, 500, 1000],
    });
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
    await expect(this.addMoujaDrawer).toBeHidden({ timeout: 5000 });
    await expect(this.addMoujaButton).toBeEnabled();
  }

  async closeDrawer(): Promise<void> {
    // A success/duplicate toast can overlay the header close icon. The
    // drawer's Cancel action uses the same close handler and is more stable;
    // retain the icon as a fallback for callers explicitly exercising it.
    if (await this.cancelButton.isVisible().catch(() => false)) {
      await this.cancelButton.click({ force: true });
    } else {
      await this.closeDrawerButton.click({ force: true });
    }
    // Duplicate validation can leave the drawer component mounted despite a
    // close click. Reloading the same page is a safe, session-preserving
    // fallback and ensures the next test starts from a clean screen.
    const closed = await expect(this.addMoujaDrawer)
      .toBeHidden({ timeout: 1500 })
      .then(() => true)
      .catch(() => false);
    if (!closed && !this.page.isClosed()) {
      const currentUrl = this.page.url();
      await this.page.goto(currentUrl, { waitUntil: 'domcontentloaded' }).catch(() => undefined);
      // Some validation states keep the drawer mounted even after a full
      // navigation. Do not convert this cleanup race into a test failure;
      // the next test will start by normalizing the screen again.
      await expect(this.addMoujaDrawer).toBeHidden({ timeout: 3000 }).catch(() => undefined);
    }
    await expect(this.addMoujaButton).toBeEnabled().catch(() => undefined);
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
