import { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { internalTest as test, expect } from '../../../fixtures/internalSessionFixtures';
import { DepreciationMasterPage, DepreciationRange } from '../../../pages/property-tax/Masters/DepreciationMasterMasterPage';

// Keep tests independent so one failed assertion is reported while later
// cases still execute. The worker-scoped page remains sequential because the
// project uses one worker.
test.describe.configure({ mode: 'default', timeout: 120000 });
test.describe('Property Tax - Depreciation Master', () => {
  test.setTimeout(120000);

  let page: Page;
  let depreciation: DepreciationMasterPage;
  let testRange: DepreciationRange;
  let existingRange: DepreciationRange;
  let constructionType = '';
  let rangeCreated = false;

  test.beforeAll(async ({ internalSession }) => {
    page = internalSession.page;
    depreciation = internalSession.depreciationMasterPage;
    await depreciation.navigateFromPropertyTaxModule();
    await depreciation.expectLoaded();
    const ranges = await depreciation.getRanges();
    existingRange = ranges[0];
    testRange = await depreciation.getNextContiguousRange();
    const firstRate = depreciation.rateInputs.first();
    const aria = await firstRate.getAttribute('aria-label');
    constructionType = aria?.split(' for ')[0] || '';
  });

  test.afterEach(async ({ internalSession }, testInfo) => {
    // A failed action can leave a modal or pagination state open. Keep the
    // same authenticated browser and recover through the sidebar so the next
    // test starts from the Depreciation Master screen instead of relogging.
    if (testInfo.status === 'failed' && !internalSession.page.isClosed()) {
      await internalSession.page.keyboard.press('Escape').catch(() => undefined);
      await internalSession.depreciationMasterPage.navigateFromPropertyTaxModule().catch(() => undefined);
      await internalSession.depreciationMasterPage.expectLoaded().catch(() => undefined);
    }
  });

  test.afterAll(async () => {
    // If a later assertion aborts the serial flow, remove only the range this
    // suite successfully created. This prevents failed runs from polluting
    // the next dynamic-range calculation.
    if (!rangeCreated || !page || page.isClosed()) return;
    const stillPresent = (await depreciation.getRanges())
      .some(range => range.min === testRange.min && range.max === testRange.max);
    if (stillPresent) {
      await depreciation.clickDeleteRange(testRange).catch(() => undefined);
      await depreciation.confirmDelete().catch(() => undefined);
    }
  });

  test('DM-UI-TC-001 - verifies page heading and key controls', async () => {
    await expect(depreciation.pageHeading).toBeVisible();
    await expect(depreciation.minimumAgeInput).toBeVisible();
    await expect(depreciation.maximumAgeInput).toBeVisible();
    await expect(depreciation.addRangeButton).toBeVisible();
    await expect(depreciation.updateRatesButton).toBeVisible();
  });

  test('DM-UI-TC-002 - verifies configured age ranges and rates', async () => {
    expect((await depreciation.getRanges()).length).toBeGreaterThan(0);
    await expect(depreciation.rangeButtons.first()).toBeVisible();
    await expect(depreciation.rateInputs.first()).toBeVisible();
  });

  test('DM-UI-TC-003 - verifies pagination/status information', async () => {
    await expect(depreciation.paginationInfo).toBeVisible();
    // Depreciation rows expose status through the configured data set rather
    // than an “Active” badge on this screen; pagination is the deterministic
    // status/data-area indicator available in the rendered DOM.
    expect((await depreciation.getRanges()).length).toBeGreaterThan(0);
  });

  test('DM-PAG-TC-004 - navigates between configured range pages', async () => {
    // Use the smallest supported page size so pagination is exercised even
    // when the environment currently has fewer than 20 configured ranges.
    const pageSize = page.getByRole('combobox').first();
    if (await pageSize.isVisible().catch(() => false)) {
      const selectedSize = await pageSize.inputValue().catch(() => '');
      if (selectedSize !== '10') {
        const previousInfo = await depreciation.paginationInfo.innerText().catch(() => '');
        await pageSize.selectOption('10').catch(() => undefined);
        await expect.poll(async () => depreciation.paginationInfo.innerText().catch(() => ''), { timeout: 5000 })
          .not.toBe(previousInfo).catch(() => undefined);
      }
    }
    const nextPage = page.getByRole('button', { name: 'Go to next page' });
    const pageInfo = await depreciation.paginationInfo.innerText();
    const pageMatch = pageInfo.match(/Showing\s+\d+\s+to\s+\d+\s+of\s+(\d+)\s+entries/i);
    const configuredCount = pageMatch ? Number(pageMatch[1]) : 0;
    const configuredPageSize = Number(await pageSize.inputValue().catch(() => '10')) || 10;
    test.skip(configuredCount <= configuredPageSize, 'Configured ranges fit on one page');
    await expect(nextPage).toBeEnabled({ timeout: 5000 });
    const firstPageInfo = await depreciation.paginationInfo.innerText();
    await nextPage.click();
    await expect(depreciation.paginationInfo).not.toHaveText(firstPageInfo);
    const previousPage = page.getByRole('button', { name: 'Go to previous page' });
    await previousPage.click();
    await expect(previousPage).toBeDisabled();
  });

  test('DM-PAG-NEG-TC-005 - blocks pagination beyond first and last pages', async () => {
    const previousPage = page.getByRole('button', { name: 'Go to previous page' });
    await expect(previousPage).toBeDisabled();

    const nextPage = page.getByRole('button', { name: 'Go to next page' });
    let moved = false;
    for (let pageIndex = 0; pageIndex < 50 && await nextPage.isEnabled().catch(() => false); pageIndex += 1) {
      const previousInfo = await depreciation.paginationInfo.innerText().catch(() => '');
      try {
        await nextPage.click({ timeout: 5000 });
        await expect.poll(async () => depreciation.paginationInfo.innerText().catch(() => ''), { timeout: 5000 })
          .not.toBe(previousInfo);
      } catch {
        break;
      }
      moved = true;
    }
    if (moved) {
      await expect(nextPage).toBeDisabled({ timeout: 5000 });
      await page.getByRole('button', { name: 'Go to first page' }).click({ timeout: 5000 }).catch(() => undefined);
      await expect(previousPage).toBeDisabled();
    }
  });

  test('DM-I18N-TC-006 - exposes and switches supported languages', async () => {
    test.setTimeout(30000);
    await depreciation.profileButton.click();
    await depreciation.languageButton.click();
    await expect(page.getByRole('option', { name: 'English', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: /Hindi/i })).toBeVisible();
    await expect(page.getByRole('option', { name: /Marathi/i })).toBeVisible();

    try {
      await depreciation.selectLanguage('Marathi');
      await expect(depreciation.pageHeading).toBeVisible();
      await expect(depreciation.addRangeButton).toBeVisible();
    } finally {
      // Restore the default locale without reopening a translated menu. This
      // cleanup path must not consume the test timeout if the menu animation
      // is still settling.
      await page.evaluate(() => localStorage.setItem('NEXT_LOCALE', 'en')).catch(() => undefined);
      await page.reload({ waitUntil: 'domcontentloaded' }).catch(() => undefined);
      await depreciation.expectLoaded().catch(() => undefined);
    }
  });

  test('DM-FN-TC-007 - opens the Create Range form', async () => {
    await depreciation.openCreateRangeForm();
  });

  test('DM-VAL-TC-008 - rejects both ages blank', async () => {
    await depreciation.fillRange({ min: '', max: '' });
    await depreciation.addRangeButton.click();
    await depreciation.expectValidation(/both minimum and maximum age|required/i);
  });

  test('DM-VAL-TC-009 - rejects a blank minimum age', async () => {
    await depreciation.fillRange({ min: '', max: 5 });
    await depreciation.addRangeButton.click();
    await depreciation.expectValidation(/both minimum and maximum age|required/i);
  });

  test('DM-VAL-TC-010- rejects a blank maximum age', async () => {
    await depreciation.fillRange({ min: 5, max: '' });
    await depreciation.addRangeButton.click();
    await depreciation.expectValidation(/both minimum and maximum age|required/i);
  });

  test('DM-VAL-TC-011 - rejects equal ages', async () => {
    await depreciation.fillRange({ min: 50, max: 50 });
    await depreciation.addRangeButton.click();
    await depreciation.expectValidation(/less than|minimum.*maximum/i);
  });

  test('DM-VAL-TC-012 - rejects reversed ages', async () => {
    await depreciation.fillRange({ min: 60, max: 50 });
    await depreciation.addRangeButton.click();
    await depreciation.expectValidation(/less than|minimum.*maximum/i);
  });

  test('DM-VAL-TC-013 - rejects a negative age', async () => {
    await depreciation.fillRange({ min: -1, max: 5 });
    await depreciation.addRangeButton.click();
    // The browser enforces the configured minimum and normalizes a negative
    // value before the application receives it. Verify that no range is added.
    await expect(depreciation.rangeButtons.filter({ hasText: /^-1\s*-\s*5/ })).toHaveCount(0);
  });

  test('DM-VAL-TC-014 - rejects a non-numeric age', async () => {
    await depreciation.fillRange({ min: 'abc', max: 5 });
    await depreciation.addRangeButton.click();
    await expect(depreciation.minimumAgeInput).toHaveValue('');
    await depreciation.expectValidation(/both minimum and maximum age|required|valid number/i);
  });

  test('DM-VAL-TC-015 - rejects an exact duplicate range', async () => {
    await depreciation.fillRange({ min: existingRange.min, max: existingRange.max });
    await depreciation.addRangeButton.click();
    await depreciation.expectValidation(/overlap|already exists/i);
  });

  test('DM-VAL-TC-016 - rejects an overlapping range', async () => {
    const overlapMin = Math.max(0, existingRange.min - 1);
    await depreciation.fillRange({ min: overlapMin, max: existingRange.max });
    await depreciation.addRangeButton.click();
    await depreciation.expectValidation(/overlap|already exists/i);
  });

  test('DM-RATE-TC-017 - reports no changes when rates are not edited', async () => {
    await depreciation.updateRates();
    await depreciation.expectNoRateChangesNotification();
  });


    // Ensure only page one is opened before this test's save action. Do not
    // scan page two here: the purpose of this case is to expose whether the
    // application validates later-page ranges while the user remains on page1.
  test('DM-FN-TC-018 - reports first-page range validation defect', async () => {
  
   
    await depreciation.goToFirstPage();
    const pagination = await depreciation.paginationInfo.innerText().catch(() => '');
    const visibleRanges = (await depreciation.rangeButtons.allTextContents())
      .map(text => text.replace(/\s+/g, ' ').match(/(\d+)\s*-\s*(\d+)/))
      .filter((match): match is RegExpMatchArray => Boolean(match))
      .map(match => ({ min: Number(match[1]), max: Number(match[2]) }));
    await test.info().attach('range-creation-context', {
      body: JSON.stringify({
        requestedRange: testRange,
        submittedFrom: 'pagination page 1',
        pagination,
        visibleRanges,
      }, null, 2),
      contentType: 'application/json',
    });

    const pageMatch = pagination.match(/Showing\s+\d+\s+to\s+\d+\s+of\s+(\d+)\s+entries/i);
    const totalRanges = pageMatch ? Number(pageMatch[1]) : 0;
    const pageSize = Number(await page.getByRole('combobox').first().inputValue().catch(() => '10')) || 10;
    test.skip(totalRanges <= pageSize, 'Two pagination pages are required for this defect check');

    try {
      testRange = await depreciation.addRange(testRange);
      rangeCreated = true;
    } catch (error) {
      // This is a real product failure for TC018. The describe block is
      // intentionally non-serial, so throwing here reports a red test while
      // Playwright continues with TC019 on the same authenticated page.
      throw new Error(
        `Development defect: creating contiguous range ${testRange.min}-${testRange.max} from pagination page 1 was rejected. ` +
        `Validation must consider ranges on every pagination page. ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  });

  test('DM-FN-TC-019 - creates the range from its pagination page', async () => {
    await allure.link(
      'https://jam.dev/c/270049cd-54e0-496e-873b-5079e504bae2',
      'Jam reference recording',
    );
    const pagination = await depreciation.paginationInfo.innerText().catch(() => '');
    const pageMatch = pagination.match(/Showing\s+\d+\s+to\s+\d+\s+of\s+(\d+)\s+entries/i);
    const totalRanges = pageMatch ? Number(pageMatch[1]) : 0;
    const pageSize = Number(await page.getByRole('combobox').first().inputValue().catch(() => '10')) || 10;
    test.skip(totalRanges <= pageSize, 'Two pagination pages are required for this pagination-path check');

    // If page one accepted the range, there is nothing to create again. This
    // branch does not inspect or navigate any other pagination page.
    if (rangeCreated) {
      rangeCreated = true;
      return;
    }

    // Current defect workaround: the same valid range is accepted when the
    // user first opens the page containing the highest configured ages.
    await depreciation.goToLastPage();
    testRange = await depreciation.addRange(testRange);
    rangeCreated = true;
  });

  test('DM-FN-TC-020 - creates rate rows for the new range', async () => {
    test.skip(!rangeCreated, 'The dynamic range was not created; dependent rate checks are not applicable');
    await depreciation.selectRange(testRange);
    const rangeInputs = page.locator(`input[aria-label*=" for ${testRange.min}-${testRange.max}"]`);
    expect(await rangeInputs.count()).toBeGreaterThan(0);
    await expect(rangeInputs.first()).toBeVisible();
  });

  test('DM-RATE-TC-021 - updates one Construction Type rate', async () => {
    test.skip(!rangeCreated, 'The dynamic range was not created');
    test.skip(!constructionType, 'No Construction Type rate input is available');
    await depreciation.updateRate(constructionType, testRange, 12);
    const input = await depreciation.getRateInput(constructionType, testRange);
    await expect.poll(async () => Number(await input.inputValue())).toBe(12);
  });

  test('DM-RATE-TC-022 - accepts a zero depreciation rate', async () => {
    test.skip(!rangeCreated, 'The dynamic range was not created');
    test.skip(!constructionType, 'No Construction Type rate input is available');
    await depreciation.updateRate(constructionType, testRange, 0);
    const input = await depreciation.getRateInput(constructionType, testRange);
    await expect.poll(async () => Number(await input.inputValue())).toBe(0);
  });

  test('DM-RATE-TC-023 - saves a decimal depreciation rate', async () => {
    test.skip(!rangeCreated, 'The dynamic range was not created');
    test.skip(!constructionType, 'No Construction Type rate input is available');
    await depreciation.updateRate(constructionType, testRange, 2.8);
    const input = await depreciation.getRateInput(constructionType, testRange);
    await expect.poll(async () => Number(await input.inputValue())).toBe(2.8);
  });

  test('DM-RATE-TC-024 - updates two construction type rates together', async () => {
    test.skip(!rangeCreated, 'The dynamic range was not created');
    test.skip(!constructionType, 'No Construction Type rate input is available');
    const inputs = page.locator(`input[aria-label*=" for ${testRange.min}-${testRange.max}"]`);
    const count = await inputs.count();
    test.skip(count < 2, 'Fewer than two construction type rates are available');
    const firstType = (await inputs.nth(0).getAttribute('aria-label'))?.split(' for ')[0] || constructionType;
    const secondType = (await inputs.nth(1).getAttribute('aria-label'))?.split(' for ')[0] || '';
    await depreciation.updateRate(firstType, testRange, 4.2);
    if (secondType) await depreciation.updateRate(secondType, testRange, 5.3);
    const firstRate = await depreciation.getRateInput(firstType, testRange);
    const secondRate = secondType ? await depreciation.getRateInput(secondType, testRange) : inputs.nth(1);
    await expect.poll(async () => Number(await firstRate.inputValue())).toBe(4.2);
    await expect.poll(async () => Number(await secondRate.inputValue())).toBe(5.3);
  });

  test('DM-PER-TC-025 - retains an updated rate after refresh', async () => {
    test.skip(!rangeCreated, 'The dynamic range was not created');
    test.skip(!constructionType, 'No Construction Type rate input is available');
    await page.reload();
    await depreciation.expectLoaded();
    await depreciation.selectRange(testRange);
    const input = await depreciation.getRateInput(constructionType, testRange);
    await expect.poll(async () => Number(await input.inputValue())).toBe(4.2);
  });

  test('DM-DEL-TC-026 - cancelling deletion keeps the range', async () => {
    test.skip(!rangeCreated, 'The dynamic range was not created');
    await depreciation.clickDeleteRange(testRange);
    await depreciation.cancelDelete();
    await expect(depreciation.rangeButtons.filter({ hasText: new RegExp(`^${testRange.min}\\s*-\\s*${testRange.max}`) }).first()).toBeVisible();
  });

  test('DM-DEL-TC-027 - confirms deletion of the test range', async () => {
    test.skip(!rangeCreated, 'The dynamic range was not created');
    await depreciation.clickDeleteRange(testRange);
    await depreciation.confirmDelete();
    // Deletion can leave the current pagination DOM stale. Reload and scan all
    // pages before asserting that the record is gone.
    await page.reload({ waitUntil: 'domcontentloaded' });
    await depreciation.expectLoaded();
    const remainingRanges = await depreciation.getRanges();
    expect(remainingRanges.some(range => range.min === testRange.min && range.max === testRange.max)).toBe(false);
    rangeCreated = false;
  });
});
