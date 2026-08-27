import { Page, Locator } from '@playwright/test';
import { PropertyTaxBasePage } from './PropertyTaxBasePage';

export class MastersPage extends PropertyTaxBasePage {
  // Selectors for Rate Section Master form
  private readonly rateSectionCodeInput: Locator;
  private readonly rateSectionNameInput: Locator;
  private readonly effectiveDateInput: Locator;
  private readonly saveButton: Locator;
  
  // Alert/Toaster elements
  private readonly successAlert: Locator;
  private readonly errorAlert: Locator;

  constructor(page: Page) {
    super(page);
    
    // Define locator templates (replace with actual selectors when forms are inspected)
    this.rateSectionCodeInput = page.locator('input[placeholder*="Code"], input[name*="code"]');
    this.rateSectionNameInput = page.locator('input[placeholder*="Name"], input[name*="name"]');
    this.effectiveDateInput = page.locator('input[type="date"], input[name*="date"]');
    this.saveButton = page.locator('button:has-text("Save"), button:has-text("Submit")');

    this.successAlert = page.locator('.alert-success, .toast-success, text=success');
    this.errorAlert = page.locator('.alert-danger, .error-message, .text-red-500');
  }

  /**
   * Helper to navigate to the Rate Section Master sub-menu
   */
  async navigateToRateSection(): Promise<void> {
    await this.selectMasterSubmenu('Rate Section Master');
  }

  /**
   * Fill out the Rate Section form
   */
  async fillRateSectionForm(code: string, name: string, date: string): Promise<void> {
    if (code) await this.rateSectionCodeInput.fill(code);
    if (name) await this.rateSectionNameInput.fill(name);
    if (date) await this.effectiveDateInput.fill(date);
  }

  /**
   * Submit the form
   */
  async submitForm(): Promise<void> {
    await this.saveButton.click();
    await this.waitForLoaderToDisappear();
  }

  /**
   * Retrieve success toaster/alert message text
   */
  async getSuccessMessage(): Promise<string | null> {
    if (await this.successAlert.first().isVisible()) {
      return this.successAlert.first().innerText();
    }
    return null;
  }

  /**
   * Retrieve error message text
   */
  async getErrorMessage(): Promise<string | null> {
    if (await this.errorAlert.first().isVisible()) {
      return this.errorAlert.first().innerText();
    }
    return null;
  }
}
