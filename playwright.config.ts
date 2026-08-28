import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import os from 'os';
import path from 'path';

// Read environment variables from file.
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Path where the authentication state will be stored.
 */
export const STORAGE_STATE = path.join(__dirname, '.auth/admin.json');

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  globalSetup: require.resolve('./global-setup'),
  /* Run the suite through one Chromium worker for predictable application state. */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Use one worker locally and in CI. The only browser project is Chromium. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['line'],
    ['allure-playwright', {
      resultsDir: 'allure-results',
      detail: true,
      suiteTitle: true,
      globalLabels: {
        epic: 'PTIS',
        layer: 'UI',
      },
      environmentInfo: {
        Application: 'PTIS Property Tax',
        Environment: process.env.TEST_ENVIRONMENT || 'QA',
        'Base URL': process.env.BASE_URL || 'https://ptisqa.scipl.info.in',
        Browser: 'Chromium',
        'Operating System': `${os.platform()} ${os.release()}`,
        'Node.js': process.version,
      },
      categories: [
        {
          name: 'Timeouts',
          matchedStatuses: ['failed', 'broken'],
          messageRegex: '.*[Tt]imeout.*',
        },
        {
          name: 'Assertion failures',
          matchedStatuses: ['failed'],
          messageRegex: '.*expect\\(.*',
        },
        {
          name: 'Automation errors',
          matchedStatuses: ['broken'],
        },
      ],
    }],
    ['html', { open: 'never' }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.BASE_URL || 'https://ptisqa.scipl.info.in',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    // Setup project to log in once and save cookies/session state
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: {
        browserName: 'chromium',
        // To maximize a headed Chromium window later, uncomment these lines:
        // viewport: null,
        // launchOptions: { args: ['--start-maximized'] },
      },
    },

    // Main chromium browser execution (depends on 'setup' project to run first)
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        // Use the authenticated state saved by the setup project
        storageState: STORAGE_STATE,
        // To maximize a headed Chromium window later, uncomment these lines:
        // viewport: null,
        // launchOptions: { args: ['--start-maximized'] },
      },
      dependencies: ['setup'],
    },

    // {
    //   name: 'firefox',
    //   use: { 
    //     ...devices['Desktop Firefox'],
    //     storageState: STORAGE_STATE,
    //   },
    //   dependencies: ['setup'],
    // },

    // {
    //   name: 'webkit',
    //   use: { 
    //     ...devices['Desktop Safari'],
    //     storageState: STORAGE_STATE,
    //   },
    //   dependencies: ['setup'],
    // },
  ],
});
