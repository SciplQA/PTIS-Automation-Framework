const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const reportDir = path.join(projectRoot, 'allure-report');
// Allure 3 may leave the selected plugin in a nested directory on Windows
// when a directory rename is locked. Support the Allure 2-style renderer and
// finalize its files at the project report root.
const allureCli = path.join(projectRoot, 'node_modules', 'allure', 'cli.js');

const result = spawnSync(
  process.execPath,
  [
    allureCli,
    'allure2',
    './allure-results',
    '--output',
    './allure-report',
    '--name',
    'PTIS Automation Report',
  ],
  {
    cwd: projectRoot,
    encoding: 'utf8',
  },
);

const nestedReportDir = ['allure2', 'classic', 'awesome']
  .map(name => path.join(reportDir, name))
  .find(candidate => fs.existsSync(path.join(candidate, 'index.html')));

if (result.status !== 0 && nestedReportDir) {
  for (const entry of fs.readdirSync(nestedReportDir)) {
    fs.cpSync(
      path.join(nestedReportDir, entry),
      path.join(reportDir, entry),
      { recursive: true, force: true },
    );
  }

  fs.rmSync(nestedReportDir, { recursive: true, force: true });
  console.log('Allure CLI hit a Windows directory lock; finalized the generated report safely.');
} else if (result.status !== 0) {
  process.stdout.write(result.stdout || '');
  process.stderr.write(result.stderr || '');
  process.exit(result.status || 1);
} else {
  process.stdout.write(result.stdout || '');
  process.stderr.write(result.stderr || '');
}

const reportIndex = path.join(reportDir, 'index.html');

if (!fs.existsSync(reportIndex)) {
  console.error('Allure generation did not produce allure-report/index.html');
  process.exit(1);
}

// The Allure 2 renderer currently falls back to its default title even when
// the CLI name option is supplied. Keep the dashboard title consistent with
// the project name in the generated HTML and summary metadata.
for (const file of [
  reportIndex,
  path.join(reportDir, 'widgets', 'summary.json'),
  path.join(reportDir, 'widgets', 'history-trend.json'),
]) {
  if (!fs.existsSync(file)) continue;
  const contents = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(file, contents.replace(/Allure Report/g, 'PTIS Automation Report'));
}

console.log('Allure report generated successfully: allure-report/index.html');
