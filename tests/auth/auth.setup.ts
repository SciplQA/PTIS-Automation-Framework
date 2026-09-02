import { test as setup, expect } from '@playwright/test';
import { STORAGE_STATE } from '../../playwright.config';

setup('authenticate as admin', async ({ page }) => {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD must be defined in the .env file');
  }

  // PTIS requires this per-tab marker in addition to its auth cookies. It is
  // not included in Playwright's storageState file, so seed it before the
  // login page (and subsequent dashboard navigation) is loaded.
  await page.addInitScript(() => {
    window.sessionStorage.setItem('is_tab_active_session', 'true');
  });

  // Navigate to base URL
  await page.goto('/');

  // Perform login
  await page.locator('input[name="username"]:visible').first().fill(username);
  await page.locator('input[name="password"]:visible').first().fill(password);
  await page.getByRole('button', { name: 'SIGN IN' }).click();

  // Wait for login to complete and navigate to the dashboard homepage
  await page.waitForURL('**/en/home');

  // Verify that we are logged in successfully by checking for the Property Tax module card
  const propertyTaxCard = page.getByRole('link', { name: 'Navigate to Property Tax' });
  await expect(propertyTaxCard).toBeVisible({ timeout: 15000 });

  // Log sessionStorage and localStorage for debugging
  const localStorageContent = await page.evaluate(() => JSON.stringify(localStorage));
  const sessionStorageContent = await page.evaluate(() => JSON.stringify(sessionStorage));
  console.log('DIAGNOSTIC - Local Storage:', localStorageContent);
  console.log('DIAGNOSTIC - Session Storage:', sessionStorageContent);

  // Save the authenticated storage state
  await page.context().storageState({ path: STORAGE_STATE });
});
