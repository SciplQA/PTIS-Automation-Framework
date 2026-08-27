import { Locator, Page, expect } from '@playwright/test';
import { PropertyTaxBasePage } from '../PropertyTaxBasePage';

export class PolicyConfigurationMasterPage extends PropertyTaxBasePage {
  private readonly editDrawer: Locator;
  private readonly closeEditButton: Locator;
  readonly searchField: Locator;
  readonly tableRows: Locator;
  readonly noDataMessage: Locator;
  readonly assessmentYearRecord: Locator;
  readonly successMessage: Locator;
  readonly requiredMessage: Locator;
  readonly policyValueInput: Locator;
  readonly unitInput: Locator;
  readonly statusToggle: Locator;
  readonly updateButton: Locator;

  constructor(page: Page) {
    super(page);
    this.editDrawer = page.locator('div[role="dialog"][aria-modal="true"]');
    this.closeEditButton = this.editDrawer.getByRole('button').first();
    this.searchField = page.getByPlaceholder('Search by Code, Category');
    this.tableRows = page.locator('tbody tr');
    this.noDataMessage = page.getByText('No data available', { exact: true });
    this.assessmentYearRecord = page.getByText('AssessmentYear', { exact: true }).first();
    this.successMessage = page.getByText(
      'Policy Configuration updated successfully',
      { exact: true }
    ).last();
    this.requiredMessage = page.getByText('Policy Value is required', { exact: true });
    this.policyValueInput = page.locator('input[name="policyValue"]');
    this.unitInput = page.locator('input[name="unit"]');
    this.statusToggle = page.getByRole('switch', { name: 'Active' });
    this.updateButton = page.getByText('Update', { exact: true });
  }

  async navigateFromPropertyTaxModule(): Promise<void> {
    await this.selectMasterSubmenu('Policy Configuration Master');
  }

  async expectLoaded(): Promise<void> {
    await this.page.waitForURL('**/en/property-tax/policy-configuration');
    await this.searchField.waitFor({ state: 'visible' });
  }

  async searchPolicy(searchText: string): Promise<void> {
    await this.searchField.fill(searchText);
    await this.page.waitForTimeout(1000);
  }

  async clearSearch(): Promise<void> {
    await this.searchField.fill('');
    await expect(this.searchField).toHaveValue('');
    await this.page.waitForTimeout(1200);
  }

  async getAssessmentYearRow(): Promise<Locator> {
    return this.tableRows.filter({ hasText: 'AssessmentYear' }).first();
  }

  async clickAssessmentYearEdit(): Promise<void> {
    const row = await this.getAssessmentYearRow();
    await row.getByRole('button', { name: 'Edit' }).click();
    await this.policyValueInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  async getToggleState(): Promise<string | null> {
    return this.statusToggle.getAttribute('aria-checked');
  }

  async toggleStatus(): Promise<{ oldState: string | null; newState: string | null }> {
    const oldState = await this.getToggleState();
    await this.statusToggle.click();
    await this.page.waitForTimeout(300);
    const newState = await this.getToggleState();
    return { oldState, newState };
  }

  async enterPolicyValue(value: string): Promise<void> {
    await this.policyValueInput.fill(value);
  }

  async getPolicyValue(): Promise<string> {
    return this.policyValueInput.inputValue();
  }

  async enterUnit(value: string): Promise<void> {
    await this.unitInput.fill(value);
  }

  async getUnitValue(): Promise<string> {
    return this.unitInput.inputValue();
  }

  async clickUpdate(): Promise<void> {
    await this.updateButton.click();
    await this.page.waitForTimeout(500);
  }

  async closeEditDrawer(): Promise<void> {
    if (!(await this.policyValueInput.isVisible().catch(() => false))) return;
    await this.closeEditButton.click();
    await this.policyValueInput.waitFor({ state: 'hidden', timeout: 5000 });
  }

  async getAssessmentYearStatus(): Promise<string> {
    const row = await this.getAssessmentYearRow();
    return (await row.locator('td').nth(7).innerText()).trim();
  }

  async getTablePolicyValue(): Promise<string> {
    const row = await this.getAssessmentYearRow();
    return (await row.locator('td').nth(4).innerText()).trim();
  }

  async getTableUnit(): Promise<string> {
    const row = await this.getAssessmentYearRow();
    return (await row.locator('td').nth(6).innerText()).trim();
  }
}
