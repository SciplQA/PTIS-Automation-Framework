import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { MastersPage } from '../pages/property-tax/MastersPage';
import { ConstructionTypeMasterPage } from '../pages/property-tax/Masters/Construction-type-master';
import { PolicyConfigurationMasterPage } from '../pages/property-tax/Masters/Policy-configuration-master';
import { MoujaMasterPage } from '../pages/property-tax/Masters/Mouja-master';

// Define types for all page objects we want to inject
export type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  mastersPage: MastersPage;
  constructionTypeMasterPage: ConstructionTypeMasterPage;
  policyConfigurationMasterPage: PolicyConfigurationMasterPage;
  moujaMasterPage: MoujaMasterPage;
};

// Extend base test to declare custom fixtures
export const test = baseTest.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  mastersPage: async ({ page }, use) => {
    const mastersPage = new MastersPage(page);
    await use(mastersPage);
  },

  constructionTypeMasterPage: async ({ page }, use) => {
    const constructionTypeMasterPage = new ConstructionTypeMasterPage(page);
    await use(constructionTypeMasterPage);
  },

  policyConfigurationMasterPage: async ({ page }, use) => {
    const policyConfigurationMasterPage = new PolicyConfigurationMasterPage(page);
    await use(policyConfigurationMasterPage);
  },

  moujaMasterPage: async ({ page }, use) => {
    const moujaMasterPage = new MoujaMasterPage(page);
    await use(moujaMasterPage);
  },
});

export { expect } from '@playwright/test';
