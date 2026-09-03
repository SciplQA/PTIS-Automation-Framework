import fs from 'fs';
import { Page, TestInfo } from '@playwright/test';
import * as allure from 'allure-js-commons';

type AllureMetadata = {
  testId: string;
  feature: string;
  story: string;
  preConditions: string;
  expectedResult: string;
};

/** Add consistent business metadata to an Allure test result. */
export async function addAllureMetadata(metadata: AllureMetadata): Promise<void> {
  await Promise.all([
    allure.testCaseId(metadata.testId),
    allure.feature(metadata.feature),
    allure.story(metadata.story),
    allure.tags('property-tax', 'ui'),
    allure.description(
      `**Preconditions:** ${metadata.preConditions}\n\n` +
      `**Expected result:** ${metadata.expectedResult}`,
    ),
  ]);
}

/**
 * Mark a test as a development/environment blocker when its required screen
 * or control cannot be reached. This keeps blocked functionality visible in
 * Allure's severity view instead of turning it into a misleading pass/skip.
 */
export async function markBlockedFeature(reason: string): Promise<void> {
  await Promise.all([
    allure.severity('blocker'),
    allure.tags('blocked', 'development-blocker'),
    allure.description(`**Blocked before execution**\n\n${reason}`),
    allure.attachment('blocker-diagnostic', reason, 'text/plain'),
  ]);
}

/** Mark the current test as blocked and fail it with a report-friendly error. */
export async function failBlockedFeature(reason: string): Promise<never> {
  await markBlockedFeature(reason);
  throw new Error(`BLOCKER: ${reason}`);
}

/**
 * Compatibility helper for imported suites that recorded their own video.
 * The shared internal session normally relies on Playwright's configured
 * failure artifacts, but attaches a video here when the page has one.
 */
export async function attachVideoOnCompletion(page: Page, testInfo: TestInfo): Promise<void> {
  const video = page.video();
  if (!video) {
    return;
  }

  const videoPath = await video.path().catch(() => undefined);
  if (videoPath && fsExists(videoPath)) {
    await testInfo.attach('Browser video', {
      path: videoPath,
      contentType: 'video/webm',
    });
  }
}

function fsExists(filePath: string): boolean {
  try {
    fs.accessSync(filePath);
    return true;
  } catch {
    return false;
  }
}
