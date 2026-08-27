import { internalTest as test, expect } from '../../../fixtures/internalSessionFixtures';

test.describe('Property Tax - Construction Type Master', () => {
  test('should open the Construction Type Master screen', async ({ internalSession }) => {
    const { constructionTypeMasterPage, page } = internalSession;
    await constructionTypeMasterPage.navigateFromPropertyTaxModule();
    await constructionTypeMasterPage.expectLoaded();

    await expect(page).toHaveURL(/\/en\/property-tax\/constructiontype/);
    await expect(page.getByRole('heading', { name: 'Construction Type Master' })).toBeVisible();
  });
});
