import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class DashboardPage extends BasePage {
  private readonly propertyTaxCard: Locator;

  constructor(page: Page) {
    super(page);
    this.propertyTaxCard = page.getByRole('link', {
      name: 'Navigate to Property Tax',
    });
  }

  /**
   * Clicks on the Property Tax services card to navigate into the Property Tax module
   */
  async selectPropertyTaxModule(): Promise<void> {
    await this.propertyTaxCard.click();
    await this.waitForPageReady();
  }
}
