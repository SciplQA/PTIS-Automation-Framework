import { test, expect } from '../../../fixtures/pageFixtures';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Property Tax - Construction Type Master', () => {
  test.beforeEach(async ({ loginPage, page, dashboardPage }) => {
    await loginPage.navigate();
    await loginPage.login(process.env.ADMIN_USERNAME!, process.env.ADMIN_PASSWORD!);
    await expect(page).toHaveURL(/\/en\/home/);
    await dashboardPage.selectPropertyTaxModule();
  });

  test('should open the Construction Type Master screen', async ({ constructionTypeMasterPage, page }) => {
    await constructionTypeMasterPage.navigateFromPropertyTaxModule();
    await constructionTypeMasterPage.expectLoaded();

    await expect(page).toHaveURL(/\/en\/property-tax\/constructiontype/);
    await expect(page.getByRole('heading', { name: 'Construction Type Master' })).toBeVisible();
  });
});