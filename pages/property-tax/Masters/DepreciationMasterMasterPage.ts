import { expect, Locator, Page } from '@playwright/test';
import { PropertyTaxBasePage } from '../PropertyTaxBasePage';

export type DepreciationRange = { min: number; max: number };

/** Page object for Property Tax > Masters > Depreciation Master. */
export class DepreciationMasterPage extends PropertyTaxBasePage {
  readonly pageHeading: Locator;
  readonly minimumAgeInput: Locator;
  readonly maximumAgeInput: Locator;
  readonly addRangeButton: Locator;
  readonly updateRatesButton: Locator;
  readonly rangeButtons: Locator;
  readonly rateInputs: Locator;
  readonly paginationInfo: Locator;
  readonly profileButton: Locator;
  readonly languageButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: /Depreciation Master|घसारा/i }).first();
    this.minimumAgeInput = page.getByPlaceholder(/Enter minimum age|न्यूनतम आयु दर्ज करें|किमान वय प्रविष्ट/i).first();
    this.maximumAgeInput = page.getByPlaceholder(/Enter maximum age|अधिकतम आयु दर्ज करें|कमाल वय प्रविष्ट/i).first();
    this.addRangeButton = page.getByRole('button', { name: /Add Range|रेंज जोड़ें|रेंज जोडा/i }).first();
    this.updateRatesButton = page.getByRole('button', { name: /Update Rates|रेंज अपडेट|रेंज अद्यतन/i }).first();
    this.rangeButtons = page.locator('button').filter({ hasText: /^\s*\d+\s*-\s*\d+/ });
    this.rateInputs = page.locator('input[type="number"][aria-label*=" for "]');
    this.paginationInfo = page.getByText(/Showing \d+ to \d+ of \d+ entries/i).first();
    this.profileButton = page.getByRole('button', { name: /Admin scipl pvt/i }).first();
    this.languageButton = page.getByRole('button', { name: /Language|\u092d\u093e\u0937\u093e/i }).first();
  }

  async navigateFromPropertyTaxModule(): Promise<void> {
    await this.selectMasterSubmenu('Depreciation Master');
  }

  async selectLanguage(language: 'English' | 'Hindi' | 'Marathi'): Promise<void> {
    const optionPattern = language === 'Marathi'
      ? /Marathi/i
      : language === 'Hindi'
        ? /Hindi/i
        : /English/i;
    const option = this.page.getByRole('option', { name: optionPattern }).first();
    if (!(await option.isVisible().catch(() => false))) {
      await this.profileButton.click();
      await this.languageButton.waitFor({ state: 'visible', timeout: 10000 });
      await this.languageButton.click();
    }
    await option.waitFor({ state: 'visible', timeout: 10000 });
    await option.click();
    const locale = language === 'English' ? 'en' : language === 'Hindi' ? 'hi' : 'mr';
    await expect.poll(() => this.page.evaluate(() => localStorage.getItem('NEXT_LOCALE')), { timeout: 10000 }).toBe(locale);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageHeading).toBeVisible({ timeout: 15000 });
    await expect(this.addRangeButton).toBeVisible({ timeout: 10000 });
    await expect(this.updateRatesButton).toBeVisible({ timeout: 10000 });
    await this.rateInputs.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => undefined);
  }

  async getRanges(): Promise<DepreciationRange[]> {
    const readCurrentPage = async (): Promise<DepreciationRange[]> => (await this.rangeButtons.allTextContents()).map(label => {
      const match = label.replace(/\s+/g, ' ').match(/(\d+)\s*-\s*(\d+)/);
      return match ? { min: Number(match[1]), max: Number(match[2]) } : null;
    }).filter((range): range is DepreciationRange => range !== null);

    const ranges: DepreciationRange[] = [];
    const pageInfo = await this.paginationInfo.innerText().catch(() => '');
    const pageMatch = pageInfo.match(/Showing\s+(\d+)\s+to\s+(\d+)\s+of\s+(\d+)/i);
    const pageSize = Number(await this.page.getByRole('combobox').first().inputValue().catch(() => '10')) || 10;
    const total = pageMatch ? Number(pageMatch[3]) : ranges.length;
    const lastPageNumber = Math.max(1, Math.ceil(total / pageSize));
    // Always begin at page one; beforeAll can inherit the page selected by a
    // previous test, which otherwise causes us to miss configured ranges.
    let currentInfo = await this.paginationInfo.innerText().catch(() => '');
    for (let pageIndex = 0; pageIndex < 50 && !/^Showing\s+1\s+to\s+/i.test(currentInfo); pageIndex += 1) {
      const before = currentInfo;
      const first = this.page.getByRole('button', { name: 'Go to first page' }).first();
      const previous = this.page.getByRole('button', { name: 'Go to previous page' }).first();
      try {
        if (await first.isEnabled().catch(() => false)) await first.click({ timeout: 3000 });
        else if (await previous.isEnabled().catch(() => false)) await previous.click({ timeout: 3000 });
      } catch {
        break;
      }
      await expect.poll(async () => this.paginationInfo.innerText().catch(() => ''), { timeout: 5000 })
        .not.toBe(before).catch(() => undefined);
      currentInfo = await this.paginationInfo.innerText().catch(() => '');
    }

    ranges.push(...await readCurrentPage());
    const nextPage = this.page.getByRole('button', { name: 'Go to next page' }).first();
    for (let pageNumber = 1; pageNumber < lastPageNumber; pageNumber += 1) {
      currentInfo = await this.paginationInfo.innerText().catch(() => '');
      if (!(await nextPage.isEnabled().catch(() => false))) break;
      try {
        await nextPage.click({ timeout: 5000 });
        await expect.poll(async () => this.paginationInfo.innerText().catch(() => ''), { timeout: 5000 })
          .not.toBe(currentInfo);
      } catch {
        break;
      }
      ranges.push(...await readCurrentPage());
    }

    const pageOne = this.page.getByRole('button', { name: 'Go to page 1' }).first();
    const finalInfo = await this.paginationInfo.innerText().catch(() => '');
    if (!/^Showing\s+1\s+to\s+/i.test(finalInfo)) {
      const firstPage = this.page.getByRole('button', { name: 'Go to first page' }).first();
      if (await firstPage.isEnabled().catch(() => false)) {
        await firstPage.click({ timeout: 5000 }).catch(() => undefined);
      } else {
        await pageOne.click({ timeout: 5000 }).catch(() => undefined);
      }
      await expect.poll(async () => this.paginationInfo.innerText().catch(() => ''), { timeout: 5000 })
        .toMatch(/^Showing\s+1\s+to\s+/i).catch(() => undefined);
    }

    const unique = new Map(ranges.map(range => [`${range.min}-${range.max}`, range]));
    return [...unique.values()].sort((a, b) => a.min - b.min || a.max - b.max);
  }

  async getNextContiguousRange(size = 4): Promise<DepreciationRange> {
    const ranges = await this.getRanges();
    if (ranges.length === 0) return { min: 0, max: size };

    // The application requires the next range to continue the configured
    // sequence. Use the first real gap, not simply the largest max value;
    // later records may exist while an earlier sequential range is missing.
    const ordered = [...ranges].sort((a, b) => a.min - b.min || a.max - b.max);
    let nextMax = ordered[0].max;
    for (const range of ordered.slice(1)) {
      const expectedMin = nextMax + 1;
      if (range.min > expectedMin) {
        return {
          min: expectedMin,
          max: Math.min(expectedMin + size, range.min - 1),
        };
      }
      if (range.min <= expectedMin && range.max >= expectedMin) {
        nextMax = Math.max(nextMax, range.max);
      }
    }
    const nextMin = nextMax + 1;
    return { min: nextMin, max: nextMin + size };
  }

  async openCreateRangeForm(): Promise<void> {
    await this.minimumAgeInput.scrollIntoViewIfNeeded();
    await expect(this.minimumAgeInput).toBeVisible();
    await expect(this.maximumAgeInput).toBeVisible();
  }

  async fillRange(range: DepreciationRange | { min?: string | number; max?: string | number }): Promise<void> {
    if (range.min !== undefined) await this.minimumAgeInput.fill(String(range.min));
    if (range.max !== undefined) await this.maximumAgeInput.fill(String(range.max));
  }

  async addRange(range: DepreciationRange): Promise<DepreciationRange> {
    // Deliberately submit from the page currently displayed by the test.  The
    // application must validate against all configured ranges, not just the
    // ranges rendered on the current pagination page.  Navigating to the last
    // page here would hide that product defect.
    await this.fillRange(range);
    await this.addRangeButton.click();
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
    try {
      // Newly-created ranges can land on the last pagination page. Verify
      // against all pages rather than only the currently visible page.
      await expect.poll(async () => {
        const ranges = await this.getRanges();
        return ranges.some(candidate => candidate.min === range.min && candidate.max === range.max);
      }, { timeout: 10000, intervals: [300, 700, 1200] }).toBe(true);
      return range;
    } catch {
      const validation = this.page
        .getByText(/Age range has a gap|Expected minimum age|Expected maximum age|overlaps with existing range|already exists/i)
        .first();
      const detail = (await validation.textContent().catch(() => ''))?.replace(/\s+/g, ' ').trim();
      throw new Error(`Depreciation range ${range.min}-${range.max} was not created${detail ? `: ${detail}` : '.'}`);
    }
  }

  /** Navigate to the final configured pagination page without fixed sleeps. */
  async goToLastPage(): Promise<void> {
    const lastPage = this.page.getByRole('button', { name: 'Go to last page' }).first();
    const previousInfo = await this.paginationInfo.innerText().catch(() => '');
    if (await lastPage.isEnabled().catch(() => false)) {
      await lastPage.click({ timeout: 5000 });
      await expect.poll(async () => this.paginationInfo.innerText().catch(() => ''), { timeout: 5000 })
        .not.toBe(previousInfo);
      return;
    }

    const nextPage = this.page.getByRole('button', { name: 'Go to next page' }).first();
    for (let pageIndex = 0; pageIndex < 50 && await nextPage.isEnabled().catch(() => false); pageIndex += 1) {
      const before = await this.paginationInfo.innerText().catch(() => '');
      await nextPage.click({ timeout: 5000 });
      await expect.poll(async () => this.paginationInfo.innerText().catch(() => ''), { timeout: 5000 })
        .not.toBe(before);
    }
  }

  /** Navigate exactly one pagination page forward and wait for its data. */
  async goToNextPage(): Promise<void> {
    const nextPage = this.page.getByRole('button', { name: 'Go to next page' }).first();
    await expect(nextPage).toBeEnabled({ timeout: 5000 });
    const previousInfo = await this.paginationInfo.innerText().catch(() => '');
    await nextPage.click({ timeout: 5000 });
    await expect.poll(async () => this.paginationInfo.innerText().catch(() => ''), { timeout: 5000 })
      .not.toBe(previousInfo);
  }

  /** Return to pagination page one without scanning or changing later pages. */
  async goToFirstPage(): Promise<void> {
    const firstPage = this.page.getByRole('button', { name: 'Go to first page' }).first();
    if (await firstPage.isEnabled().catch(() => false)) {
      const previousInfo = await this.paginationInfo.innerText().catch(() => '');
      await firstPage.click({ timeout: 5000 });
      await expect.poll(async () => this.paginationInfo.innerText().catch(() => ''), { timeout: 5000 })
        .not.toBe(previousInfo).catch(() => undefined);
      return;
    }
    const previous = this.page.getByRole('button', { name: 'Go to previous page' }).first();
    for (let pageIndex = 0; pageIndex < 50 && await previous.isEnabled().catch(() => false); pageIndex += 1) {
      const before = await this.paginationInfo.innerText().catch(() => '');
      await previous.click({ timeout: 5000 });
      await expect.poll(async () => this.paginationInfo.innerText().catch(() => ''), { timeout: 5000 })
        .not.toBe(before);
    }
  }

  async expectValidation(message?: RegExp): Promise<void> {
    const validation = message
      ? this.page.getByText(message).first()
      : this.page.locator('[role="alert"], p, span, div').filter({ hasText: /required|valid number|cannot be negative|less than|overlap|already exists|gap/i }).first();
    await expect(validation).toBeVisible({ timeout: 10000 });
  }

  private rangeButton(range: DepreciationRange): Locator {
    return this.page.getByRole('button', { name: new RegExp(`^${range.min}\\s*-\\s*${range.max}`) }).first();
  }

  /** Ensure a range card is on the currently rendered pagination page. */
  private async showRange(range: DepreciationRange): Promise<Locator | undefined> {
    const button = this.rangeButton(range);
    if (await button.isVisible().catch(() => false)) return button;

    // The range cards and the rates table have independent scrolling/rendering.
    // A range on a later table page may have no card button in the DOM, so use
    // its rate input as the reliable indication that pagination reached it.
    const rangeInput = this.page.locator(`input[aria-label*=" for ${range.min}-${range.max}"]`).first();
    if (await rangeInput.isVisible().catch(() => false)) return undefined;
    // Determine the target page from the complete, sorted range list instead
    // of repeatedly clicking a transient next button. This also handles a
    // range that was just created on page two while the test is on page one.
    const allRanges = await this.getRanges();
    const targetIndex = allRanges.findIndex(candidate => candidate.min === range.min && candidate.max === range.max);
    const pageSize = Number(await this.page.getByRole('combobox').first().inputValue().catch(() => '10')) || 10;
    const targetPage = targetIndex >= 0 ? Math.floor(targetIndex / pageSize) + 1 : 1;
    if (targetPage > 1) {
      const pageButton = this.page.getByRole('button', { name: `Go to page ${targetPage}` }).first();
      const previousInfo = await this.paginationInfo.innerText().catch(() => '');
      if (await pageButton.isVisible().catch(() => false)) {
        await pageButton.click({ timeout: 5000 });
        await expect.poll(async () => this.paginationInfo.innerText().catch(() => ''), { timeout: 5000 })
          .not.toBe(previousInfo);
      } else {
        const lastPage = this.page.getByRole('button', { name: 'Go to last page' }).first();
        await lastPage.click({ timeout: 5000 }).catch(() => undefined);
      }
    }
    await expect.poll(async () => (
      await button.isVisible().catch(() => false) || await rangeInput.isVisible().catch(() => false)
    ), { timeout: 10000 }).toBe(true).catch(() => undefined);
    return await button.isVisible().catch(() => false) ? button : undefined;
  }

  async selectRange(range: DepreciationRange): Promise<void> {
    const button = await this.showRange(range);
    const rangeInput = this.page.locator(`input[aria-label*=" for ${range.min}-${range.max}"]`).first();
    // Once the table row is rendered, editing can proceed directly. The
    // corresponding side-card may report as visible while an overlay or its
    // own scroll container still prevents a reliable click.
    if (!(await rangeInput.isVisible().catch(() => false)) && button) {
      await button.scrollIntoViewIfNeeded();
      try {
        await button.click({ timeout: 5000 });
      } catch {
        await this.rangeButton(range).click({ timeout: 5000 });
      }
    }
    await rangeInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  async getRateInput(constructionType: string, range: DepreciationRange): Promise<Locator> {
    await this.selectRange(range);
    const input = this.page.locator(`input[aria-label="${constructionType} for ${range.min}-${range.max}"]`).first();
    await input.waitFor({ state: 'visible', timeout: 10000 });
    return input;
  }

  /** Submit edited rates and accept the confirmation dialog when changes exist. */
  async updateRates(): Promise<void> {
    const updateButton = this.page.getByRole('button', {
      name: /Update Rates|\u0930\u0947\u0902\u091c \u0905\u092a\u0921\u0947\u091f|\u0930\u0947\u0902\u091c \u0905\u0926\u094d\u092f\u0924\u0928/i,
    }).first();
    await updateButton.waitFor({ state: 'visible', timeout: 10000 });
    try {
      await updateButton.click({ timeout: 5000 });
    } catch {
      // React may replace the button after an input blur; resolve a fresh
      // locator and click once more rather than waiting for a stale node.
      await this.page.getByRole('button', {
        name: /Update Rates|\u0930\u0947\u0902\u091c \u0905\u092a\u0921\u0947\u091f|\u0930\u0947\u0902\u091c \u0905\u0926\u094d\u092f\u0924\u0928/i,
      }).first().click({ timeout: 5000 });
    }
    const confirmation = this.page.getByRole('dialog').last();
    if (await confirmation.isVisible().catch(() => false)) {
      await confirmation.getByRole('button', { name: /^Update$/i }).click();
      await expect(confirmation).toBeHidden({ timeout: 15000 }).catch(() => undefined);
      await this.page.waitForLoadState('networkidle').catch(() => undefined);
    }
  }

  async expectNoRateChangesNotification(): Promise<void> {
    const notification = this.page
      .getByRole('region', { name: /Notifications/i })
      .getByText(/No changes to update|No changes|Nothing to update/i)
      .first();
    await expect(notification).toBeVisible({ timeout: 10000 });
  }

  async updateRate(constructionType: string, range: DepreciationRange, value: number | string): Promise<void> {
    const input = await this.getRateInput(constructionType, range);
    await input.fill(String(value));
    await this.updateRates();
    // Saving can reset the table pagination to page one. Re-select the target
    // range before asserting the persisted value; otherwise the old locator
    // can resolve to a hidden/stale row and report 0 incorrectly.
    const refreshedInput = await this.getRateInput(constructionType, range);
    await expect.poll(async () => Number(await refreshedInput.inputValue()), { timeout: 10000 }).toBe(Number(value));
  }

  async clickDeleteRange(range: DepreciationRange): Promise<void> {
    // Delete Range is a single panel-level control. Select the requested
    // range card first; do not search for a delete button inside the card.
    const rangeButton = this.rangeButton(range);
    await rangeButton.scrollIntoViewIfNeeded();
    await expect(rangeButton).toBeVisible({ timeout: 10000 });
    await rangeButton.click();
    // The delete control belongs to the panel, not to the card itself.
    const card = this.page;
    const deleteButton = card.getByRole('button', { name: /Delete Range|रेंज हटाएं|रेंज हटवा|रेंज हटाएँ/i }).first();
    await expect(deleteButton).toBeVisible({ timeout: 5000 });
    await expect(deleteButton).toBeEnabled({ timeout: 5000 });
    if (await deleteButton.isVisible().catch(() => false)) {
      await deleteButton.click();
    } else {
      await this.page.getByRole('button', { name: /Delete Range|रेंज हटाएं|रेंज हटवा|रेंज हटाएँ/i }).first().click();
    }
  }

  confirmationDialog(): Locator {
    return this.page.getByRole('dialog').or(this.page.getByRole('alertdialog')).first();
  }

  async cancelDelete(): Promise<void> {
    const dialog = this.confirmationDialog();
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await dialog.getByRole('button', { name: /Cancel|No/i }).first().click();
    await expect(dialog).toBeHidden({ timeout: 5000 });
  }

  async confirmDelete(): Promise<void> {
    const dialog = this.confirmationDialog();
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await dialog.getByRole('button', { name: /Delete|Confirm|Yes/i }).first().click();
    await expect(dialog).toBeHidden({ timeout: 10000 }).catch(() => undefined);
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
  }
}
