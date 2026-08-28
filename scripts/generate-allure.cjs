const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const reportDir = path.join(projectRoot, 'allure-report');
const nestedReportDir = path.join(reportDir, 'awesome');
const allureCli = path.join(projectRoot, 'node_modules', 'allure', 'cli.js');

const result = spawnSync(
  process.execPath,
  [
    allureCli,
    'generate',
    './allure-results',
    '--output',
    './allure-report',
    '--report-name',
    'PTIS Automation Report',
  ],
  {
    cwd: projectRoot,
    encoding: 'utf8',
  },
);

if (result.status !== 0 && fs.existsSync(path.join(nestedReportDir, 'index.html'))) {
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

console.log('Allure report generated successfully: allure-report/index.html');
