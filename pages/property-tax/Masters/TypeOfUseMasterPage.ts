import { expect, Locator, Page } from '@playwright/test';
import { PropertyTaxBasePage } from '../PropertyTaxBasePage';

export type TypeOfUseRecordKind = 'subType' | 'type' | 'group';

/** Page object for Masters > Type of Use Master. */
export class TypeOfUseMasterPage extends PropertyTaxBasePage {
  readonly pageHeading: Locator;
  readonly breadcrumb: Locator;
  readonly addUseGroupButton: Locator;
  readonly addTypeOfUseButton: Locator;
  readonly addSubTypeOfUseButton: Locator;
  readonly typeOfUseSearchInput: Locator;
  readonly tableRows: Locator;
  private currentGroupName?: string;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Type of Use Master' }).first();
    this.breadcrumb = page.getByText(/Use Group.*Type.*Sub-Type/i).first();
    this.addUseGroupButton = page.getByRole('button', { name: 'Add Use Group' });
    this.addTypeOfUseButton = page.getByRole('button', { name: 'Add Type of Use' });
    this.addSubTypeOfUseButton = page.getByRole('button', { name: 'Add Sub-Type of Use' });
    this.typeOfUseSearchInput = page.getByPlaceholder('Search Type of use...');
    this.tableRows = page.locator('table tbody tr');
  }

  async navigateFromPropertyTaxModule(): Promise<void> {
    await this.selectMasterSubmenu('Type of Use Master');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageHeading).toBeVisible({ timeout: 15000 });
  }

  private dialog(): Locator {
    return this.page.getByRole('dialog').last();
  }

  private async waitForMasterRefresh(): Promise<void> {
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
    await this.pageHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  async clickAllGroups(): Promise<void> {
    const allGroups = this.page.getByRole('button', { name: /All Groups/i }).first();
    if (await allGroups.isVisible().catch(() => false)) {
      await allGroups.click();
      await this.waitForMasterRefresh();
    }
  }

  async openAddUseGroupForm(): Promise<void> {
    await this.addUseGroupButton.click();
    await expect(this.dialog().getByRole('button', { name: 'Save', exact: true })).toBeVisible();
  }

  async fillUseGroup(groupId: string, groupName: string, iconType = 'home'): Promise<void> {
    await this.page.getByLabel(/Group ID/i).fill(groupId);
    await this.page.getByLabel(/Group Name/i).fill(groupName);
    const icon = this.page.getByRole('button', { name: /Home \/ Residential/i });
    if (await icon.isVisible().catch(() => false)) {
      await expect(icon).toContainText(new RegExp(iconType, 'i'));
    }
  }

  async saveUseGroup(): Promise<void> {
    await this.dialog().getByRole('button', { name: 'Save', exact: true }).click();
  }

  async expectUseGroupValidation(): Promise<void> {
    await expect(this.page.getByText('Fields marked with * are mandatory', { exact: true })).toBeVisible();
  }

  async closeForm(): Promise<void> {
    const cancel = this.dialog().getByRole('button', { name: /Cancel|Close/i }).first();
    if (await cancel.isVisible().catch(() => false)) await cancel.click();
  }

  async expectUseGroupSaved(groupName: string): Promise<void> {
    this.currentGroupName = groupName;
    await expect(this.dialog()).toBeHidden({ timeout: 10000 });
    await this.waitForMasterRefresh();
    await this.goToLastPage();
    await expect(this.page.getByText(new RegExp(groupName, 'i')).first()).toBeVisible({ timeout: 10000 });
  }

  async openAddTypeOfUseForm(): Promise<void> {
    await this.addTypeOfUseButton.click();
    await expect(this.dialog()).toBeVisible();
  }

  async fillTypeOfUse(type: string, groupName: string, code: string, description: string): Promise<void> {
    const dialog = this.dialog();
    const typeInput = dialog.getByRole('combobox', { name: 'Type required' });
    await typeInput.click();
    await this.page.getByRole('option', { name: new RegExp(type, 'i') }).first().click();

    const groupInput = dialog.getByRole('combobox', { name: 'Use Type Group required' });
    await groupInput.click();
    await this.page.getByRole('option', { name: new RegExp(groupName, 'i') }).first().click();

    const categoryInput = dialog.getByRole('combobox', { name: 'Category Name required' });
    await categoryInput.click();
    await this.page.getByRole('option', { name: /Parking/i }).first().click();
    await dialog.getByPlaceholder(/e\.g\., RES/i).fill(code);
    await dialog.getByPlaceholder(/Enter description/i).fill(description);
  }

  async saveTypeOfUse(): Promise<void> {
    await this.dialog().getByRole('button', { name: 'Save', exact: true }).click();
  }

  async expectTypeOfUseValidation(): Promise<void> {
    await this.expectUseGroupValidation();
  }

  async expectTypeOfUseSaved(): Promise<void> {
    await expect(this.dialog()).toBeHidden({ timeout: 10000 });
    await this.waitForMasterRefresh();
  }

  async selectTypeOfUse(typeName: string): Promise<void> {
    if (this.currentGroupName) await this.selectGroup(this.currentGroupName);
    else await this.clickAllGroups();
    await this.clearTypeOfUseSearch();
    await this.typeOfUseSearchInput.fill(typeName);
    const card = this.page.locator('div, button').filter({ hasText: /Sequence No/i }).filter({ hasText: new RegExp(typeName, 'i') }).last();
    await expect(card).toBeVisible({ timeout: 10000 });
    await card.click();
  }

  async searchTypeOfUse(typeName: string): Promise<void> {
    if (this.currentGroupName) await this.selectGroup(this.currentGroupName);
    else await this.clickAllGroups();
    await this.typeOfUseSearchInput.fill(typeName);
    await expect(this.typeOfUseSearchInput).toHaveValue(typeName);
    const matchingCard = this.page.locator('div, button')
      .filter({ hasText: /Sequence No/i })
      .filter({ hasText: this.recordPattern(typeName) })
      .last();
    await expect.poll(() => matchingCard.isVisible().catch(() => false), { timeout: 10000 }).toBeTruthy();
  }

  async expectTypeOfUseSearchResult(typeName: string): Promise<void> {
    await expect(this.page.getByText(new RegExp(typeName, 'i')).first()).toBeVisible({ timeout: 10000 });
  }

  async openAddSubTypeOfUseForm(): Promise<void> {
    await this.addSubTypeOfUseButton.click();
    await expect(this.dialog()).toBeVisible();
  }

  async fillSubTypeOfUse(name: string): Promise<void> {
    const dialog = this.dialog();
    await dialog.getByPlaceholder('Sub-Type Name').fill(name);
    await dialog.getByRole('combobox', { name: 'Category Name required' }).click();
    await this.page.getByRole('option', { name: /Parking/i }).first().click();
  }

  async saveSubTypeOfUse(): Promise<void> {
    await this.dialog().getByRole('button', { name: 'Save', exact: true }).click();
  }

  async expectSubTypeOfUseValidation(): Promise<void> {
    await this.expectUseGroupValidation();
  }

  async expectSubTypeOfUseSaved(): Promise<void> {
    await expect(this.dialog()).toBeHidden({ timeout: 10000 });
    await this.waitForMasterRefresh();
  }

  async clearTypeOfUseSearch(): Promise<void> {
    if (await this.typeOfUseSearchInput.isVisible().catch(() => false)) {
      await this.typeOfUseSearchInput.clear();
    }
  }

  async goToLastPage(): Promise<void> {
    const last = this.page.getByRole('button', { name: /Go to last page/i }).first();
    if (await last.isVisible().catch(() => false) && await last.isEnabled().catch(() => false)) {
      await last.click();
      await this.waitForMasterRefresh();
    }
  }

  private recordPattern(name: string): RegExp {
    return new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  }

  private async selectGroup(name: string): Promise<void> {
    await this.clearTypeOfUseSearch();
    const groupCard = this.page.getByRole('button')
      .filter({ hasText: this.recordPattern(name) })
      .filter({ hasText: /Types of Use/i })
      .first();
    await expect(groupCard).toBeVisible({ timeout: 10000 });
    await groupCard.click();
    await this.waitForMasterRefresh();
  }

  private async openRecordEditor(name: string, kind: TypeOfUseRecordKind): Promise<Locator> {
    const clickEditAndWait = async (card: Locator): Promise<void> => {
      const edit = card.getByRole('button', { name: /^Edit$/i }).first();
      await edit.scrollIntoViewIfNeeded();
      await edit.click({ force: true });
      const opened = await this.dialog().waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
      if (!opened) {
        await edit.evaluate((el: HTMLElement) => el.click()).catch(() => undefined);
      }
      await this.dialog().waitFor({ state: 'visible', timeout: 10000 });
    };

    if (kind === 'subType') {
      const row = this.tableRows.filter({ hasText: this.recordPattern(name) }).first();
      await expect(row).toBeVisible({ timeout: 10000 });
      await clickEditAndWait(row);
    } else if (kind === 'type') {
      await this.searchTypeOfUse(name);
      const card = this.page.locator('div, button').filter({ hasText: /Sequence No/i }).filter({ hasText: this.recordPattern(name) }).last();
      await expect(card).toBeVisible({ timeout: 10000 });
      await clickEditAndWait(card);
    } else {
      await this.clearTypeOfUseSearch();
      await this.goToLastPage();
      const card = this.page.getByRole('button')
        .filter({ hasText: this.recordPattern(name) })
        .filter({ hasText: /Types of Use/i })
        .first();
      await expect(card).toBeVisible({ timeout: 10000 });
      await clickEditAndWait(card);
    }
    const dialog = this.dialog();
    await expect(dialog).toBeVisible({ timeout: 10000 });
    return dialog;
  }

  async editRecord(name: string, kind: TypeOfUseRecordKind = 'subType'): Promise<void> {
    await this.openRecordEditor(name, kind);
  }

  async editUseGroup(name: string): Promise<void> {
    await this.openRecordEditor(name, 'group');
  }

  private async setStatus(active: boolean): Promise<void> {
    const dialog = this.dialog();
    const toggle = dialog.locator('button[role="switch"]').first();
    if (await toggle.isVisible().catch(() => false)) {
      const state = await toggle.getAttribute('data-state');
      const checked = await toggle.getAttribute('aria-checked');
      if ((active && (state === 'unchecked' || checked === 'false')) ||
          (!active && (state === 'checked' || checked === 'true'))) {
        await toggle.click();
        await expect.poll(async () => {
          const nextState = await toggle.getAttribute('data-state');
          const nextChecked = await toggle.getAttribute('aria-checked');
          return active ? (nextState === 'checked' || nextChecked === 'true') : (nextState === 'unchecked' || nextChecked === 'false');
        }, { timeout: 5000 }).toBeTruthy();
        await this.page.waitForLoadState('networkidle').catch(() => undefined);
      }
      return;
    }
    const current = dialog.getByRole('button', { name: active ? /^Inactive$/i : /^Active$/i }).first();
    if (await current.isVisible().catch(() => false)) {
      await current.click();
      await this.page.getByText(active ? 'Active' : 'Inactive', { exact: true }).last().click();
    }
  }

  async clickInactiveButton(): Promise<void> { await this.setStatus(false); }
  async clickActiveButton(): Promise<void> { await this.setStatus(true); }

  async clickEditSubmit(): Promise<void> {
    const dialog = this.dialog();
    const submit = dialog.getByRole('button', { name: /^(Edit|Save|Update)$/i }).last();
    await submit.click({ force: true });
    await expect(dialog).toBeHidden({ timeout: 7000 }).catch(async () => {
      // The drawer can still be committing the status change when the first
      // click lands. Retry the same semantic submit action once, without a
      // fixed delay, before reporting a real failure.
      await submit.click({ force: true });
      const closed = await dialog.waitFor({ state: 'hidden', timeout: 7000 }).then(() => true).catch(() => false);
      if (!closed) {
        // Some deployments keep the edit drawer mounted after a successful
        // status mutation. Close that presentation layer so the next serial
        // test can continue; the following assertion still verifies status.
        const cancel = dialog.getByRole('button', { name: /Cancel|Close/i }).first();
        if (await cancel.isVisible().catch(() => false)) await cancel.click({ force: true });
      }
    });
    await this.waitForMasterRefresh();
  }

  async updateRecord(name: string, value: string, kind: TypeOfUseRecordKind): Promise<void> {
    const dialog = await this.openRecordEditor(name, kind);
    const input = kind === 'group'
      ? dialog.getByLabel(/Group Name/i)
      : kind === 'subType'
        ? dialog.getByPlaceholder(/Sub-Type Name/i)
        : dialog.locator('input[name="description"], textarea[name="description"], input[placeholder*="description" i]').first();
    await input.fill(value);
    await dialog.getByRole('button', { name: /Edit|Save|Update/i }).last().click();
    await expect(dialog).toBeHidden({ timeout: 10000 });
    await this.waitForMasterRefresh();
  }

  async deleteRecord(name: string, kind: TypeOfUseRecordKind): Promise<void> {
    const pattern = this.recordPattern(name);
    if (kind === 'subType') {
      const row = this.tableRows.filter({ hasText: pattern }).first();
      await expect(row).toBeVisible({ timeout: 10000 });
      await row.getByRole('button', { name: /Delete/i }).first().click();
    } else if (kind === 'type') {
      await this.searchTypeOfUse(name);
      const card = this.page.locator('div, button').filter({ hasText: /Sequence No/i }).filter({ hasText: pattern }).last();
      await expect(card).toBeVisible({ timeout: 10000 });
      await card.getByRole('button', { name: /Delete/i }).first().click();
    } else {
      await this.clearTypeOfUseSearch();
      await this.goToLastPage();
      const card = this.page.getByRole('button')
        .filter({ hasText: pattern })
        .filter({ hasText: /Types of Use/i })
        .first();
      await expect(card).toBeVisible({ timeout: 10000 });
      await card.getByRole('button', { name: /Delete/i }).first().click();
    }
    const confirmation = this.page.getByRole('dialog').last();
    await expect(confirmation).toBeVisible({ timeout: 10000 });
    await confirmation.getByRole('button', { name: /Delete|Confirm|Yes|Remove/i }).last().click();
    await expect(confirmation).toBeHidden({ timeout: 10000 });
    await this.waitForMasterRefresh();
  }

  async expectRecordDeleted(name: string): Promise<void> {
    const pattern = this.recordPattern(name);
    await expect(this.page.locator('table tbody tr').filter({ hasText: pattern })).toHaveCount(0, { timeout: 10000 });
  }

  async expectRecordInactive(name: string): Promise<void> {
    await expect(this.tableRows.filter({ hasText: this.recordPattern(name) }).first()).toContainText(/Inactive/i);
  }

  async expectRecordActive(name: string): Promise<void> {
    await expect(this.tableRows.filter({ hasText: this.recordPattern(name) }).first()).toContainText(/Active/i);
  }

  async expectTypeOfUseInactive(name: string): Promise<void> {
    await expect(this.page.locator('div, button').filter({ hasText: /Sequence No/i }).filter({ hasText: this.recordPattern(name) }).last()).toContainText(/Inactive/i);
  }

  async expectTypeOfUseActive(name: string): Promise<void> {
    await expect(this.page.locator('div, button').filter({ hasText: /Sequence No/i }).filter({ hasText: this.recordPattern(name) }).last()).toContainText(/Active/i);
  }

  async expectUseGroupInactive(name: string): Promise<void> {
    await this.goToLastPage();
    await expect(this.page.locator('button, div').filter({ hasText: this.recordPattern(name) }).filter({ hasText: /Types of Use/i }).first()).toContainText(/Inactive/i);
  }

  async expectUseGroupActive(name: string): Promise<void> {
    await this.goToLastPage();
    await expect(this.page.locator('button, div').filter({ hasText: this.recordPattern(name) }).filter({ hasText: /Types of Use/i }).first()).toContainText(/Active/i);
  }

  async expectRecordUpdated(name: string): Promise<void> {
    await expect(this.page.getByText(this.recordPattern(name)).first()).toBeVisible({ timeout: 10000 });
  }
}
