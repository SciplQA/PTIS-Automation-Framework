import { expect, test as baseTest } from '@playwright/test';
import { Page } from '@playwright/test';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ConstructionTypeMasterPage } from '../pages/property-tax/Masters/Construction-type-master';
import { MoujaMasterPage } from '../pages/property-tax/Masters/Mouja-master';
import { PolicyConfigurationMasterPage } from '../pages/property-tax/Masters/Policy-configuration-master';
import { SocialAttributeMasterPage } from '../pages/property-tax/Masters/SocialAttributeMasterPage';
import { TaxZonePage } from '../pages/property-tax/Masters/TaxZonePage';
import { TaxZoningPage } from '../pages/property-tax/Masters/TaxZoningPage';
import { DepreciationMasterPage } from '../pages/property-tax/Masters/DepreciationMasterMasterPage';

export type InternalSession = {
  page: Page;
  constructionTypeMasterPage: ConstructionTypeMasterPage;
  moujaMasterPage: MoujaMasterPage;
  policyConfigurationMasterPage: PolicyConfigurationMasterPage;
  socialAttributeMasterPage: SocialAttributeMasterPage;
  taxZonePage: TaxZonePage;
  taxZoningPage: TaxZoningPage;
  depreciationMasterPage: DepreciationMasterPage;
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

    // This worker fixture owns one context/page for the complete suite. Record
    // that whole flow once, rather than creating one video per test.
    const videoDir = path.resolve('test-results', '_suite-video');
    fs.mkdirSync(videoDir, { recursive: true });
    const context = await browser.newContext({
      viewport: workerInfo.project.use.viewport,
      recordVideo: {
        dir: videoDir,
        size: { width: 1280, height: 720 },
      },
    });
    const page = await context.newPage();
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
      depreciationMasterPage: new DepreciationMasterPage(page),
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
        // Keep the authenticated page alive until the worker context is
        // closed. A failed test must not trigger logout or a second login;
        // afterEach recovery in the feature suite navigates to the next page.
      }
      const video = page.video();
      await context.close();

      // Video files are finalized only after the context closes. Keep one
      // copy with test artifacts and archive another timestamped copy locally.
      if (video) {
        const source = await video.path().catch(() => undefined);
        if (source && fs.existsSync(source)) {
          const stamp = new Date().toISOString().replace(/[:.]/g, '-');
          const filename = `ptis-suite-${workerInfo.project.name}-${stamp}.webm`;
          const testResultsCopy = path.resolve('test-results', filename);
          const archiveDir = path.join(os.homedir(), 'Videos', 'Automation screen recoriing');
          fs.mkdirSync(archiveDir, { recursive: true });
          fs.copyFileSync(source, testResultsCopy);
          const archiveCopy = path.join(archiveDir, filename);
          fs.copyFileSync(source, archiveCopy);

          // The worker fixture is finalized after the last test runtime has
          // closed, so the Allure facade cannot attach at this point. Add the
          // finalized file to allure-results and link it to the most recently
          // written test result instead. This makes the recording visible in
          // the test details of the generated report.
          const allureResultsDir = path.resolve('allure-results');
          if (fs.existsSync(allureResultsDir)) {
            const allureAttachment = path.join(allureResultsDir, filename);
            fs.copyFileSync(source, allureAttachment);
            const resultFiles = fs.readdirSync(allureResultsDir)
              .filter(entry => entry.endsWith('-result.json'))
              .map(entry => ({
                entry,
                modified: fs.statSync(path.join(allureResultsDir, entry)).mtimeMs,
              }))
              .sort((a, b) => b.modified - a.modified);
            const targetResults = resultFiles.filter(({ entry }) => {
              const resultPath = path.join(allureResultsDir, entry);
              try {
                const result = JSON.parse(fs.readFileSync(resultPath, 'utf8')) as { name?: string };
                return /DM-FN-TC-018|DM-FN-TC-019/.test(result.name ?? '');
              } catch {
                return false;
              }
            });
            const resultsToAttach = targetResults.length > 0 ? targetResults : resultFiles.slice(0, 1);
            for (const resultFile of resultsToAttach) {
              const resultPath = path.join(allureResultsDir, resultFile.entry);
              const result = JSON.parse(fs.readFileSync(resultPath, 'utf8')) as {
                attachments?: Array<{ name: string; type: string; source: string }>;
              };
              result.attachments ??= [];
              if (!result.attachments.some(attachment => attachment.source === filename)) {
                result.attachments.push({
                  name: 'PTIS suite screen recording',
                  type: 'video/webm',
                  source: filename,
                });
                fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
              }
            }
          }
        }
      }
    }
  }, { scope: 'worker' }],
});

export { expect } from '@playwright/test';
