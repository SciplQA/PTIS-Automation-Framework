/**
 * Keep the generated report on the Allure 2-style dashboard used by the team.
 * The npm generator invokes the explicit `allure2` command so this remains
 * consistent even when the installed Allure 3 default changes.
 */
export default {
  name: 'PTIS Automation Report',
  output: './allure-report',
  plugins: {
    allure2: {
      options: {
        reportLanguage: 'en',
        singleFile: false,
      },
    },
  },
};
