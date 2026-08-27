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
    const sidebar = this.page.getByRole('complementary');
    const mastersGroup = sidebar.getByRole('group').first();
    const mastersHeader = sidebar.getByText('Masters', { exact: true }).first();
    const submenu = sidebar.getByText(submenuName, { exact: true }).first();

    await sidebar.waitFor({ state: 'visible' });

    // The application can render the sidebar either expanded or icon-only,
    // depending on the native window size. Hover first to reveal its labels.
    if (!(await submenu.isVisible())) {
      await sidebar.hover();
    }

    // In the icon-only layout hovering may not pin the menu open. Clicking the
    // Masters group mirrors the manual sidebar click and works in both layouts.
    if (!(await mastersHeader.isVisible()) && !(await submenu.isVisible())) {
      await mastersGroup.click();
    }

    if (!(await submenu.isVisible())) {
      await mastersHeader.waitFor({ state: 'visible', timeout: 5000 });
      await mastersHeader.click();
    }

    await submenu.waitFor({ state: 'visible', timeout: 5000 });
    await submenu.scrollIntoViewIfNeeded();
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
