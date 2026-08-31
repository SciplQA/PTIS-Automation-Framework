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
    await this.propertyTaxCard.waitFor({ state: 'visible', timeout: 30000 });
    await this.propertyTaxCard.click({ force: true });
    await this.waitForPageReady();
  }

  /**
   * Reveal the labels in the responsive property-tax sidebar.  The sidebar
   * starts in icon-only mode at the headed-test viewport; clicking its first
   * navigation group mirrors the user interaction that pins it open.
   */
  async revealSidebarMenus(): Promise<void> {
    const sidebar = this.page.getByRole('complementary');
    const masters = sidebar.getByText('Masters', { exact: true }).first();
    const ptis = sidebar.getByText('PTIS', { exact: true }).first();

    await sidebar.waitFor({ state: 'visible', timeout: 15000 });
    await sidebar.hover({ position: { x: 8, y: 180 } });

    if (!(await masters.isVisible()) || !(await ptis.isVisible())) {
      const firstGroup = sidebar.getByRole('group').first();
      await firstGroup.click({ force: true });
    }

    await masters.waitFor({ state: 'visible', timeout: 5000 });
    await ptis.waitFor({ state: 'visible', timeout: 5000 });
  }
}
