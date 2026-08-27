import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class PropertyTaxBasePage extends BasePage {
  protected readonly mastersHeader: Locator;
  protected readonly ptisHeader: Locator;
  protected readonly dashboardHeader: Locator;
  protected readonly reportHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.mastersHeader = page.getByText('Masters', { exact: true }).first();
    this.ptisHeader = page.getByText('PTIS', { exact: true }).first();
    this.dashboardHeader = page.getByText('Dashboard', { exact: true }).first();
    this.reportHeader = page.getByText('Report', { exact: true }).first();
  }

  /**
   * Helper to expand the Masters section if not expanded, and click a submenu
   */
  async selectMasterSubmenu(submenuName: string): Promise<void> {
    const submenu = this.page.getByText(submenuName, { exact: true }).first();

    await this.page.getByRole('complementary').hover();
    await this.mastersHeader.hover();
    if (!(await submenu.isVisible())) {
      await this.mastersHeader.click();
    }

    await submenu.click();
    await this.waitForPageReady();
  }

  /**
   * Helper to expand the PTIS section if not expanded, and click a submenu
   */
  async selectPTISSubmenu(submenuName: string): Promise<void> {
    const submenu = this.page.locator(`nav, div, ul`).locator(`text=${submenuName}`).first();
    
    // Check if the submenu is already visible. If not, click PTIS to expand
    if (!(await submenu.isVisible())) {
      await this.ptisHeader.click();
    }
    
    await submenu.click();
    await this.waitForPageReady();
  }
}
