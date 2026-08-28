const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const targets = process.argv.includes('--report-only')
  ? ['allure-report']
  : ['allure-results', 'allure-report'];

for (const target of targets) {
  fs.rmSync(path.join(projectRoot, target), { recursive: true, force: true });
}

console.log(`Removed old Allure folders: ${targets.join(', ')}`);
