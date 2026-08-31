import { expect, Locator, Page } from '@playwright/test';
import { PropertyTaxBasePage } from '../PropertyTaxBasePage';

export class ConstructionTypeMasterPage extends PropertyTaxBasePage {
	readonly pageHeading: Locator;
	readonly addButton: Locator;
	readonly tableRows: Locator;
	readonly columnCode: Locator;
	readonly columnDescription: Locator;
	readonly columnSequence: Locator;
	readonly columnStatus: Locator;
	readonly columnActions: Locator;
	readonly paginationInfo: Locator;
	readonly searchInput: Locator;
	readonly drawerHeading: Locator;
	readonly codeInput: Locator;
	readonly descriptionInput: Locator;
	readonly sequenceInput: Locator;
	readonly saveButton: Locator;
	readonly cancelButton: Locator;
	readonly validationErrors: Locator;

	constructor(page: Page) {
		super(page);
		this.pageHeading = page.locator('h1, h2, h3').filter({ hasText: /Construction Type/i }).first();
		this.addButton = page.getByRole('button', { name: /Add Construction Type/i }).first();
		this.tableRows = page.locator('table tbody tr');
		this.columnCode = page.locator('th').filter({ hasText: /Construction Type/i }).first();
		this.columnDescription = page.locator('th').filter({ hasText: /Description/i }).first();
		this.columnSequence = page.locator('th').filter({ hasText: /Search Sequence/i }).first();
		this.columnStatus = page.locator('th').filter({ hasText: /Status/i }).first();
		this.columnActions = page.locator('th').filter({ hasText: /Actions/i }).first();
		this.paginationInfo = page.getByText(/Showing \d+ to \d+ of \d+ entries/i).first();
		this.searchInput = page.getByPlaceholder('Search by Construction Type or Description...');
		this.drawerHeading = page.locator('h2, h3').filter({ hasText: /Add Construction Type|Edit Construction Type|Update Construction Type/i }).first();
		this.codeInput = page.locator('input[name="constructionCode"]');
		this.descriptionInput = page.locator('input[name="description"]');
		this.sequenceInput = page.locator('input[name="searchSequence"]');
		this.saveButton = page.locator('button:has-text("Save"):not(.text-gray-400), button:has-text("Update")').first();
		this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true }).last();
		this.validationErrors = page.locator('p, span, div').filter({ hasText: /required|mandatory|invalid/i });
	}

	async navigateFromPropertyTaxModule(): Promise<void> {
		await this.selectMasterSubmenu('Construction Type');
	}

	async expectLoaded(): Promise<void> {
		await this.pageHeading.waitFor({ state: 'visible', timeout: 15000 });
		// The heading renders before the table request completes. Ensure each
		// navigation has finished loading rows before a search is applied.
		await this.tableRows.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => undefined);
	}

	async verifyPageLoaded(): Promise<void> {
		await this.expectLoaded();
	}

	async getRowCount(): Promise<number> {
		return this.tableRows.count();
	}

	getRowByCode(code: string): Locator {
		return this.tableRows.filter({ hasText: code }).first();
	}

	async isRowVisible(code: string): Promise<boolean> {
		return this.getRowByCode(code).isVisible().catch(() => false);
	}

	async search(query: string): Promise<void> {
		await this.searchInput.waitFor({ state: 'visible', timeout: 10000 });
		await this.searchInput.click();
		if (query) {
			for (let attempt = 0; attempt < 3; attempt += 1) {
				await this.searchInput.fill(query);
				if (await this.searchInput.inputValue() !== query) continue;
				try {
					await this.getRowByCode(query).waitFor({ state: 'visible', timeout: 5000 });
					return;
				} catch {
					// Retry if the table refresh overwrote the controlled input.
				}
			}
			await expect(this.searchInput).toHaveValue(query, { timeout: 5000 });
			await this.getRowByCode(query).waitFor({ state: 'visible', timeout: 10000 });
		} else {
			await this.page.waitForLoadState('networkidle').catch(() => undefined);
		}
	}

	async clearSearch(): Promise<void> {
		await this.search('');
	}

	async clickEditForRow(code: string): Promise<void> {
		const row = this.getRowByCode(code);
		await row.waitFor({ state: 'visible', timeout: 10000 });
		await row.locator('button[aria-label="Edit"], button[title="Edit"]').first().click();
		await this.descriptionInput.waitFor({ state: 'visible', timeout: 10000 });
	}

	async clickDeleteForRow(code: string): Promise<void> {
		const row = this.getRowByCode(code);
		await row.waitFor({ state: 'visible', timeout: 10000 });
		await row.locator('button[aria-label="Delete"], button[title="Delete"]').first().click();
	}

	async openAddDrawer(): Promise<void> {
		// Open the canonical add route directly; clicking the button can be lost
		// while the previous drawer's close transition is still completing.
		await this.page.goto('/en/property-tax/constructiontype/add', { waitUntil: 'domcontentloaded' });
		await this.codeInput.waitFor({ state: 'visible', timeout: 10000 });
	}

	async fillForm(data: { code?: string; description?: string; sequence?: string | number }): Promise<void> {
		if (data.code !== undefined && !(await this.codeInput.isDisabled().catch(() => false))) {
			await this.codeInput.fill(data.code);
		}
		if (data.description !== undefined) await this.descriptionInput.fill(data.description);
		if (data.sequence !== undefined && !(await this.sequenceInput.isDisabled().catch(() => false))) {
			await this.sequenceInput.fill(String(data.sequence));
		}
	}

	async clickSave(): Promise<void> {
		await this.saveButton.click();
		await this.codeInput.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => undefined);
		// The drawer closes before the list API finishes refreshing. Wait for the
		// list page itself, otherwise the first search can be overwritten by the
		// pending navigation and the newly-created row is missed.
		await this.page.waitForURL(/\/en\/property-tax\/constructiontype(?:\?.*)?$/, { timeout: 15000 }).catch(() => undefined);
		await this.pageHeading.waitFor({ state: 'visible', timeout: 15000 });
		await this.tableRows.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => undefined);
		await this.page.waitForLoadState('networkidle').catch(() => undefined);
	}

	async clickCancel(): Promise<void> {
		if (!(await this.codeInput.isVisible().catch(() => false))) return;
		await this.cancelButton.click();
		await this.codeInput.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => undefined);
	}

	private confirmationDialog(): Locator {
		return this.page.getByRole('dialog').or(this.page.getByRole('alertdialog')).first();
	}

	async confirmDelete(): Promise<void> {
		const dialog = this.confirmationDialog();
		await dialog.waitFor({ state: 'visible', timeout: 5000 });
		await dialog.getByRole('button', { name: /Delete|Confirm|Yes|Remove/i }).first().click();
		await dialog.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => undefined);
	}

	async cancelDelete(): Promise<void> {
		const dialog = this.confirmationDialog();
		await dialog.waitFor({ state: 'visible', timeout: 5000 });
		await dialog.getByRole('button', { name: /Cancel|No/i }).first().click();
		await dialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => undefined);
	}

}
