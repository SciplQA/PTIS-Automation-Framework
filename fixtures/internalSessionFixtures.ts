import { expect, test as baseTest } from '@playwright/test';
import { Page } from '@playwright/test';
import fs from 'fs';
import os from 'os';
import path from 'path';
import util from 'util';
import { spawnSync } from 'child_process';
import { LoginPage } from '../pages/auth/LoginPage';
import { ConstructionTypeMasterPage } from '../pages/property-tax/Masters/Construction-type-master';
import { MoujaMasterPage } from '../pages/property-tax/Masters/Mouja-master';
import { PolicyConfigurationMasterPage } from '../pages/property-tax/Masters/Policy-configuration-master';
import { SocialAttributeMasterPage } from '../pages/property-tax/Masters/SocialAttributeMasterPage';
import { TaxZonePage } from '../pages/property-tax/Masters/TaxZonePage';
import { TaxZoningPage } from '../pages/property-tax/Masters/TaxZoningPage';
import { DepreciationMasterPage } from '../pages/property-tax/Masters/DepreciationMasterMasterPage';
import { PtisPropertyTypeMasterPage } from '../pages/property-tax/Masters/PropertyTypeMasterPage';
import { WeightageMasterPage } from '../pages/property-tax/Masters/WeightageMaster';
import { STORAGE_STATE } from '../playwright.config';

type FailedTestVideoWindow = {
  title: string;
  startedAt: number;
  finishedAt: number;
};

// The authenticated worker context records one continuous high-quality video.
// These timestamps let the worker finalizer extract a short clip for only the
// tests that actually failed, without creating a new context or logging in
// again between tests.
const failedTestVideoWindows: FailedTestVideoWindow[] = [];
let suiteVideoStartedAt = 0;

const failedStatus = (status: string): boolean =>
  status === 'failed' || status === 'timedOut' || status === 'broken';

const fileSlug = (value: string): string =>
  value.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 90) || 'failed-test';

const findAllureResultForTest = (allureResultsDir: string, title: string): string | undefined => {
  const candidates = fs.readdirSync(allureResultsDir)
    .filter(entry => entry.endsWith('-result.json'))
    .map(entry => {
      const resultPath = path.join(allureResultsDir, entry);
      try {
        const result = JSON.parse(fs.readFileSync(resultPath, 'utf8')) as { name?: string; start?: number };
        return { resultPath, name: result.name ?? '', start: result.start ?? 0, modified: fs.statSync(resultPath).mtimeMs };
      } catch {
        return undefined;
      }
    })
    .filter((candidate): candidate is { resultPath: string; name: string; start: number; modified: number } => Boolean(candidate))
    .filter(candidate => candidate.name === title || candidate.name.includes(title))
    .sort((a, b) => (b.start - a.start) || (b.modified - a.modified));
  return candidates[0]?.resultPath;
};

const attachAllureFile = (
  allureResultsDir: string,
  testTitle: string,
  filePath: string,
  attachmentName: string,
  contentType: string,
): void => {
  if (!fs.existsSync(allureResultsDir) || !fs.existsSync(filePath)) return;
  const resultPath = findAllureResultForTest(allureResultsDir, testTitle);
  if (!resultPath) return;
  const source = path.basename(filePath);
  const allureAttachmentPath = path.join(allureResultsDir, source);
  if (!fs.existsSync(allureAttachmentPath)) fs.copyFileSync(filePath, allureAttachmentPath);
  const result = JSON.parse(fs.readFileSync(resultPath, 'utf8')) as {
    attachments?: Array<{ name: string; type: string; source: string }>;
  };
  result.attachments ??= [];
  if (!result.attachments.some(attachment => attachment.source === source)) {
    result.attachments.push({ name: attachmentName, type: contentType, source });
    fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
  }
};

const ffmpegAvailable = (): boolean => {
  try {
    return spawnSync('ffmpeg', ['-version'], { stdio: 'ignore', windowsHide: true }).status === 0;
  } catch {
    return false;
  }
};

const createFailureVideoClips = (
  source: string,
  suiteCopy: string,
  archiveDir: string,
  allureResultsDir: string,
): void => {
  if (!suiteVideoStartedAt || failedTestVideoWindows.length === 0) return;
  const canClip = ffmpegAvailable();
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');

  for (const [index, window] of failedTestVideoWindows.entries()) {
    // Include a little context before and after the failed action so the
    // report shows the screen state and the validation/error that followed.
    const startSeconds = Math.max(0, (window.startedAt - suiteVideoStartedAt) / 1000 - 2);
    const endSeconds = Math.max(startSeconds + 3, (window.finishedAt - suiteVideoStartedAt) / 1000 + 2);
    const durationSeconds = Math.min(45, Math.max(5, endSeconds - startSeconds));
    const clipName = `ptis-failed-${fileSlug(window.title)}-${stamp}-${index + 1}.webm`;
    const clipPath = path.resolve('test-results', 'failed-clips', clipName);
    fs.mkdirSync(path.dirname(clipPath), { recursive: true });

    let outputPath: string | undefined;
    if (canClip) {
      const clipArgs = [
        '-hide_banner', '-loglevel', 'error', '-y',
        '-ss', startSeconds.toFixed(3), '-i', source,
        '-t', durationSeconds.toFixed(3), '-c', 'copy', clipPath,
      ];
      const clipResult = spawnSync('ffmpeg', clipArgs, { stdio: 'ignore', windowsHide: true });
      if (clipResult.status === 0 && fs.existsSync(clipPath) && fs.statSync(clipPath).size > 0) outputPath = clipPath;
    }

    if (outputPath) {
      const archiveClip = path.join(archiveDir, clipName);
      fs.copyFileSync(outputPath, archiveClip);
      attachAllureFile(allureResultsDir, window.title, outputPath, 'Failed test screen video clip', 'video/webm');
    } else {
      // A missing ffmpeg must never turn a test failure into a reporting
      // failure. The complete recording remains available and is linked to
      // this failed test until ffmpeg is installed on the machine.
      attachAllureFile(allureResultsDir, window.title, suiteCopy, 'Failed test video (full suite fallback)', 'video/webm');
    }
  }
};

export type InternalSession = {
  page: Page;
  constructionTypeMasterPage: ConstructionTypeMasterPage;
  moujaMasterPage: MoujaMasterPage;
  policyConfigurationMasterPage: PolicyConfigurationMasterPage;
  socialAttributeMasterPage: SocialAttributeMasterPage;
  taxZonePage: TaxZonePage;
  taxZoningPage: TaxZoningPage;
  depreciationMasterPage: DepreciationMasterPage;
  propertyTypeMasterPage: PtisPropertyTypeMasterPage;
  weightageMasterPage: WeightageMasterPage;
};

type InternalSessionWorkerFixtures = {
  internalSession: InternalSession;
};

type InternalSessionTestFixtures = {
  // Reuse the worker-owned authenticated page for suites that were converted
  // from the legacy page fixture. This prevents a second unauthenticated
  // browser context from being created for `{ page }` in those specs.
  page: Page;
  /** Automatically attaches readable runtime data and logs to Allure. */
  testDiagnostics: void;
};

/**
 * A one-worker session for all authenticated PTIS feature suites.
 *
 * With `workers: 1`, Playwright creates this fixture once for the internal
 * suites, keeps the same browser page across test files, and disposes it only
 * after the last suite. New feature suites should import `internalTest` and
 * navigate from the existing Property Tax sidebar instead of logging in.
 */
export const internalTest = baseTest.extend<InternalSessionTestFixtures, InternalSessionWorkerFixtures>({
  testDiagnostics: [async ({ internalSession }, use, testInfo) => {
    const testStartedAt = Date.now();
    const output: string[] = [];
    const originalLog = console.log;
    const originalError = console.error;
    const capture = (level: string, args: unknown[]) => {
      output.push(`[${level}] ${args.map(value => typeof value === 'string' ? value : util.inspect(value, { depth: 4, breakLength: 140 })).join(' ')}`);
    };

    console.log = (...args: unknown[]) => {
      capture('INFO', args);
      originalLog(...args);
    };
    console.error = (...args: unknown[]) => {
      capture('ERROR', args);
      originalError(...args);
    };
    const pageErrorHandler = (error: Error) => capture('PAGE ERROR', [error.message, error.stack ?? '']);
    internalSession.page.on('pageerror', pageErrorHandler);

    try {
      await use();
    } finally {
      internalSession.page.removeListener('pageerror', pageErrorHandler);
      console.log = originalLog;
      console.error = originalError;

      if (failedStatus(testInfo.status)) {
        failedTestVideoWindows.push({
          title: testInfo.title,
          startedAt: testStartedAt,
          finishedAt: Date.now(),
        });
        // This is available immediately in Allure, even when ffmpeg is not
        // installed to cut the short video after the worker context closes.
        if (!internalSession.page.isClosed()) {
          const failedScreen = await internalSession.page
            .screenshot({ type: 'png', fullPage: false, animations: 'disabled' })
            .catch(() => undefined);
          if (failedScreen) {
            await testInfo.attach('failed-screen-at-error', {
              body: failedScreen,
              contentType: 'image/png',
            }).catch(() => undefined);
          }
        }
      }

      const currentUrl = (() => {
        try {
          return internalSession.page.url();
        } catch {
          return '(page closed)';
        }
      })();
      const details = {
        test: testInfo.title,
        titlePath: testInfo.titlePath,
        status: testInfo.status,
        expectedStatus: testInfo.expectedStatus,
        durationMs: testInfo.duration,
        project: testInfo.project.name,
        url: currentUrl,
        annotations: testInfo.annotations,
        data: output,
      };
      const readable = [
        `Test: ${details.test}`,
        `Status: ${details.status} (expected: ${details.expectedStatus})`,
        `Duration: ${details.durationMs} ms`,
        `Project: ${details.project}`,
        `URL: ${details.url}`,
        '',
        'Runtime data and execution log:',
        output.length > 0 ? output.join('\n') : '(No console data was emitted)',
      ].join('\n');

      await testInfo.attach('test-data-and-execution-log', {
        body: readable,
        contentType: 'text/plain',
      }).catch(() => undefined);
      await testInfo.attach('test-execution-details', {
        body: JSON.stringify(details, null, 2),
        contentType: 'application/json',
      }).catch(() => undefined);
    }
  }, { auto: true }],
  page: async ({ internalSession }, use) => {
    await use(internalSession.page);
  },
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
    const savedAuthState = fs.existsSync(STORAGE_STATE) ? STORAGE_STATE : undefined;
    const context = await browser.newContext({
      // `viewport: null` delegates sizing to the native headed window. In
      // this environment Chromium starts at an 800px mobile breakpoint, so
      // the property-tax sidebar is translated off-screen and navigation
      // cannot reach Masters. Keep the worker context at the same 1280x720
      // dimensions as the recording instead of relying on window maximize.
      viewport: workerInfo.project.use.viewport,
      storageState: savedAuthState,
      recordVideo: {
        dir: videoDir,
        size: { width: 1280, height: 720 },
      },
    });
    // The PTIS shell checks this tab marker in sessionStorage before it
    // accepts the auth cookies. Playwright storageState persists cookies and
    // localStorage, but intentionally does not persist sessionStorage, so a
    // freshly-created worker context otherwise gets "Session expired" even
    // when auth_token/refresh_token are still valid. Seed it before any app
    // script runs; it is scoped to this context and is never copied between
    // test cases.
    await context.addInitScript(() => {
      window.sessionStorage.setItem('is_tab_active_session', 'true');
    });
    suiteVideoStartedAt = Date.now();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);

    // Reuse the setup project's cookies/refresh token. The application can
    // still reject a structurally valid storage file after its server-side
    // session expires, so validate the rendered dashboard and refresh the
    // state with one credential login only when necessary. This bootstrap is
    // performed once per worker; a failed test never logs out or logs in again.
    if (savedAuthState) {
      await page.goto('/en/home', {
        waitUntil: 'domcontentloaded',
        timeout: 20000,
      }).catch(() => undefined);
    }

    // The dashboard renders desktop and responsive copies of this card. A
    // role locator can resolve the hidden copy first, which makes the later
    // click fail even though the dashboard is loaded. Restrict it to the
    // currently visible card.
    const propertyTaxCard = page
      .locator('a[aria-label="Navigate to Property Tax"]:visible')
      .first();

    const loginAndSaveState = async (): Promise<void> => {
      // Do not use BasePage.navigateTo/login here: its network-idle wait is
      // unsuitable for this application (long polling can keep it open for
      // 30 seconds and make the beforeAll hook appear to hang).
      await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => undefined);
      // The login shell renders a desktop and responsive form together. Use
      // the visible named inputs and first submit control to avoid strict-mode
      // ambiguity while still targeting the real form.
      await page.locator('input[name="username"]:visible').first().fill(username, { timeout: 10000 });
      await page.locator('input[name="password"]:visible').first().fill(password, { timeout: 10000 });
      await page.getByRole('button', { name: 'SIGN IN' }).first().click();
      await page.waitForURL(/\/en\/home(?:[/?#]|$)/, { timeout: 20000 });
      await propertyTaxCard.waitFor({ state: 'visible', timeout: 15000 });
      await page.context().storageState({ path: STORAGE_STATE });
      console.log('AUTH BOOTSTRAP: stored session was rejected; refreshed it once.');
    };

    const authenticated = await propertyTaxCard
      .waitFor({ state: 'visible', timeout: 8000 })
      .then(() => true)
      .catch(() => false);

    if (!authenticated) {
      await loginAndSaveState();
    } else {
      console.log('AUTH BOOTSTRAP: reused saved session state.');
    }

    // Enter Property Tax without the network-idle wait. The module route and
    // its own visible controls are the deterministic readiness signals.
    await propertyTaxCard.click({ force: true });
    await page.waitForURL(/\/en\/property-tax(?:[/?#]|$)/, { timeout: 15000 }).catch(() => undefined);
    await page.waitForLoadState('domcontentloaded').catch(() => undefined);

    // A stale server-side session can render the dashboard card from the
    // cached shell, then redirect to the login page only after the module is
    // opened. Detect that second-stage rejection and refresh once, still
    // during worker bootstrap and never as a response to an individual test.
    const sessionExpired = await page
      .getByText(/Session expired\. Please login again/i)
      .isVisible({ timeout: 1500 })
      .catch(() => false);
    const propertyTaxSidebar = page.getByRole('complementary');
    const moduleLoaded = await propertyTaxSidebar
      .isVisible({ timeout: 5000 })
      .catch(() => false);
    if (sessionExpired || !moduleLoaded || /\/login(?:[/?#]|$)/i.test(page.url())) {
      await loginAndSaveState();
      await propertyTaxCard.click({ force: true });
      await page.waitForURL(/\/en\/property-tax(?:[/?#]|$)/, { timeout: 15000 }).catch(() => undefined);
      await propertyTaxSidebar.waitFor({ state: 'visible', timeout: 15000 });
    }

    const internalSession: InternalSession = {
      page,
      constructionTypeMasterPage: new ConstructionTypeMasterPage(page),
      moujaMasterPage: new MoujaMasterPage(page),
      policyConfigurationMasterPage: new PolicyConfigurationMasterPage(page),
      socialAttributeMasterPage: new SocialAttributeMasterPage(page),
      taxZonePage: new TaxZonePage(page),
      taxZoningPage: new TaxZoningPage(page),
      depreciationMasterPage: new DepreciationMasterPage(page),
      propertyTypeMasterPage: new PtisPropertyTypeMasterPage(page),
      weightageMasterPage: new WeightageMasterPage(page),
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

          // Add a short, failure-specific clip to each failed test. This is
          // performed after context.close() because Playwright finalizes the
          // WebM only at that point. If ffmpeg is unavailable, the same test
          // receives the full-suite video as a safe fallback instead.
          createFailureVideoClips(source, testResultsCopy, archiveDir, allureResultsDir);
        }
      }
    }
  }, { scope: 'worker' }],
});

export { expect } from '@playwright/test';
