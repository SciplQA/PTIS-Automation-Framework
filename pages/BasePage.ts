import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;
  
  // Common header & sidebar elements
  protected readonly headerTitle: Locator;
  protected readonly profileDropdown: Locator;
  protected readonly logoutButton: Locator;
  protected readonly loadingOverlay: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Selectors from screenshots & standard headers
    this.headerTitle = page.locator('text=Thane Municipal Corporation QA');
    this.profileDropdown = page.getByRole('button', { name: /Admin scipl pvt/ });
    this.logoutButton = page.locator('text=Logout');
    
    // Standard spinner / loader overlays (can be customized if they have unique classes)
    this.loadingOverlay = page.locator('.loading-overlay, .spinner, .loader');
  }

  /**
   * Helper to wait for the page to be fully loaded and all loaders to disappear
   */
  async waitForPageReady(): Promise<void> {
    await this.page.waitForLoadState('load');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle').catch(() => {
      // Ignore networkidle timeouts as some analytics or long-polling resources might keep it active
    });
    await this.waitForLoaderToDisappear();
  }

  /**
   * Wait for common loading spinners to disappear
   */
  async waitForLoaderToDisappear(): Promise<void> {
    if (await this.loadingOverlay.first().isVisible()) {
      await this.loadingOverlay.first().waitFor({ state: 'hidden', timeout: 15000 });
    }
  }

  /**
   * Logs out the user from the application
   */
  async logout(): Promise<void> {
    await this.profileDropdown.click();
    await this.logoutButton.click();
    await this.page.waitForURL('**/login');
  }

  /**
   * Safe navigate wrapper that waits for loader completion
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
    await this.waitForPageReady();
  }
}
