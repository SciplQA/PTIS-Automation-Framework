import fs from 'fs';
import path from 'path';

/**
 * Start every Playwright invocation with an empty Allure results directory.
 * This prevents result JSON files from earlier executions appearing in the
 * next report, including when Playwright is run directly with npx.
 */
export default function globalSetup(): void {
  const resultsDirectory = path.resolve(__dirname, 'allure-results');
  fs.rmSync(resultsDirectory, { recursive: true, force: true });
  fs.mkdirSync(resultsDirectory, { recursive: true });
}
