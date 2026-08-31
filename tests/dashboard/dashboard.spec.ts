import { test, expect } from '../../fixtures/pageFixtures';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Dashboard and Module Navigation', () => {
  
  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(process.env.ADMIN_USERNAME!, process.env.ADMIN_PASSWORD!);
    await expect(page).toHaveURL(/\/en\/home/);
  });

  test('Verify landing page and navigate to Property Tax module', async ({ dashboardPage, page }) => {
    // 1. Verify we are on the Home Dashboard and the central header is visible
    await expect(page).toHaveURL(/.*\/en\/home/);
    
    // 2. Select the Property Tax module card
    await dashboardPage.selectPropertyTaxModule();

    // 3. Verify page loads and redirects to Property Tax Department view
    // The screen should show the Welcome message or sidebar
    const welcomeHeader = page.locator('text=Welcome to Property Tax Department');
    await expect(welcomeHeader).toBeVisible({ timeout: 15000 });
  });

  test('Verify sidebar navigation menus are present in Property Tax Department', async ({ dashboardPage, page }) => {
    // Enter the Property Tax module
    await dashboardPage.selectPropertyTaxModule();
    await dashboardPage.revealSidebarMenus();

    // Verify sidebar menu sections exist (e.g. Masters, Dashboard, PTIS, Report)
    const mastersMenu = page.getByText('Masters', { exact: true }).first();
    const ptisMenu = page.getByText('PTIS', { exact: true }).first();
    
    await expect(mastersMenu).toBeVisible();
    await expect(ptisMenu).toBeVisible();
  });
});
