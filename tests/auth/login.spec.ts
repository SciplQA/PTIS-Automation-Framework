import { test, expect } from '../../fixtures/pageFixtures';

// Reset the storage state to empty so we don't start already logged in
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login Screen Validations', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('Should not login with invalid credentials', async ({ loginPage, page }) => {
    // Attempt login with invalid credentials
    await loginPage.login('InvalidUser', 'WrongPassword123');

    // Verify we are NOT redirected to home page
    await expect(page).not.toHaveURL(/.*\/en\/home/);

    // Verify we are still on the login page (or page has inputs visible)
    await expect(page.getByPlaceholder('Enter your username')).toBeVisible();
  });

  test('Should show visual elements of login page correctly', async ({ page }) => {
    // Assert page title or presence of primary elements
    await expect(page.getByRole('button', { name: 'SIGN IN' })).toBeVisible();
    await expect(page.getByPlaceholder('Enter your username')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
  });
});
