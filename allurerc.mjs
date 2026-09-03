import { defineConfig } from 'allure';

/** Allure 3 Awesome report configuration. */
export default defineConfig({
  name: 'PTIS Automation Report',
  output: './allure-report',
  plugins: {
    awesome: {
      options: {
        reportLanguage: 'en',
        singleFile: false,
        // Keep the report's test navigation aligned with the repository
        // layout: project/parent suite -> folder suite -> spec/describe.
        // The Coverage Diff Map intentionally remains epic/feature/story
        // based; Allure uses those labels for behavior coverage analysis.
        groupBy: ['parentSuite', 'suite', 'subSuite'],
      },
    },
  },
});
