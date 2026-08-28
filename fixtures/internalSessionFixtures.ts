import { expect, test as baseTest } from '@playwright/test';
import { Page } from '@playwright/test';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ConstructionTypeMasterPage } from '../pages/property-tax/Masters/Construction-type-master';
import { MoujaMasterPage } from '../pages/property-tax/Masters/Mouja-master';
import { PolicyConfigurationMasterPage } from '../pages/property-tax/Masters/Policy-configuration-master';
import { SocialAttributeMasterPage } from '../pages/property-tax/Masters/SocialAttributeMasterPage';
import { TaxZonePage } from '../pages/property-tax/Masters/TaxZonePage';
import { TaxZoningPage } from '../pages/property-tax/Masters/TaxZoningPage';

export type InternalSession = {
  page: Page;
  constructionTypeMasterPage: ConstructionTypeMasterPage;
  moujaMasterPage: MoujaMasterPage;
  policyConfigurationMasterPage: PolicyConfigurationMasterPage;
  socialAttributeMasterPage: SocialAttributeMasterPage;
  taxZonePage: TaxZonePage;
  taxZoningPage: TaxZoningPage;
};

type InternalSessionWorkerFixtures = {
  internalSession: InternalSession;
};

/**
 * A one-worker session for all authenticated PTIS feature suites.
 *
 * With `workers: 1`, Playwright creates this fixture once for the internal
 * suites, keeps the same browser page across test files, and disposes it only
 * after the last suite. New feature suites should import `internalTest` and
 * navigate from the existing Property Tax sidebar instead of logging in.
 */
export const internalTest = baseTest.extend<{}, InternalSessionWorkerFixtures>({
  internalSession: [async ({ browser }, use, workerInfo) => {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD must be defined in the .env file');
    }

    // This worker fixture owns its page, so explicitly forward the configured
    // viewport. With no viewport configured Playwright keeps its default size;
    // with `viewport: null` the page uses the maximized native browser window.
    const page = await browser.newPage({
      viewport: workerInfo.project.use.viewport,
    });
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.navigate();
    await loginPage.login(username, password);
    await expect(page).toHaveURL(/\/en\/home/);
    await dashboardPage.selectPropertyTaxModule();

    const internalSession: InternalSession = {
      page,
      constructionTypeMasterPage: new ConstructionTypeMasterPage(page),
      moujaMasterPage: new MoujaMasterPage(page),
      policyConfigurationMasterPage: new PolicyConfigurationMasterPage(page),
      socialAttributeMasterPage: new SocialAttributeMasterPage(page),
      taxZonePage: new TaxZonePage(page),
      taxZoningPage: new TaxZoningPage(page),
    };

    try {
      await use(internalSession);
    } finally {
      if (!page.isClosed() && !page.url().includes('/login')) {
        // Prevent an assertion failure with an open confirmation modal from
        // blocking the profile menu and causing a second teardown timeout.
        const openDialog = page.getByRole('dialog').last();
        if (await openDialog.isVisible().catch(() => false)) {
          await page.keyboard.press('Escape').catch(() => undefined);
          await openDialog.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => undefined);
        }
        await dashboardPage.logout();
      }
      if (!page.isClosed()) {
        await page.close();
      }
    }
  }, { scope: 'worker' }],
});

export { expect } from '@playwright/test';
