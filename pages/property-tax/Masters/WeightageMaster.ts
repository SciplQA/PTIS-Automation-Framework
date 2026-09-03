import { expect, Locator, Page } from '@playwright/test';
import { PropertyTaxBasePage } from '../PropertyTaxBasePage';

export class WeightageMasterPage extends PropertyTaxBasePage {
	readonly pageHeading: Locator;

	readonly floorWeightageTab: Locator;
	readonly natureBuildingTab: Locator;
	readonly useCategoryTab: Locator;
	readonly ageOfBuildingTab: Locator;

	readonly generateAllButton: Locator;
	readonly applyButton: Locator;
	readonly clearButton: Locator;
	readonly updateButton: Locator;
	readonly cancelButton: Locator;

	readonly assessmentYearSelect: Locator;
	readonly constructionTypeSelect: Locator;
	readonly typeOfUseSelect: Locator;
	readonly ageRangeSelect: Locator;

	readonly tableRows: Locator;
	readonly constructionCodeHeader: Locator;
	readonly descriptionHeader: Locator;
	readonly factorHeader: Locator;
	readonly assessmentYearHeader: Locator;
	readonly statusHeader: Locator;
	readonly actionHeader: Locator;
	readonly subTypeHeader: Locator;
	readonly ageFromHeader: Locator;
	readonly ageToHeader: Locator;
	readonly constructionTypeHeader: Locator;

	readonly searchInput: Locator;
	readonly activeStatusBadge: Locator;
	readonly inactiveStatusBadge: Locator;
	readonly paginationInfo: Locator;
	readonly paginationNextButton: Locator;

	readonly generatedUpdateButton: Locator;
	readonly nonGeneratedCreateButton: Locator;

	readonly addWeightageButton: Locator;
	readonly addAgeFormHeading: Locator;
	readonly addAgeFromInput: Locator;
	readonly addAgeToInput: Locator;
	readonly factorNameInput: Locator;
	readonly weightageValueInput: Locator;
	readonly effectiveFromInput: Locator;
	readonly saveButton: Locator;
	readonly formCancelButton: Locator;
	readonly validationErrors: Locator;

	readonly editSubTypeModalHeader: Locator;
	readonly editAgeModalHeader: Locator;
	readonly mandatoryWarningMessage: Locator;
	readonly editFactorInput: Locator;

	readonly addAgeButton: Locator;

	constructor(page: Page) {
		super(page);

		this.pageHeading = page.locator('h1, h2, h3').filter({ hasText: /Weightage Master|Weightage/i }).first();

		this.floorWeightageTab = page.getByRole('button', { name: /Floor Weightage/i })
			.or(page.getByRole('tab', { name: /Floor Weightage/i }))
			.first();
		this.natureBuildingTab = page.getByRole('button', { name: /Nature.*Type of Building/i })
			.or(page.getByRole('tab', { name: /Nature.*Type of Building/i }))
			.or(page.getByText(/Nature & Type of Building/i, { exact: true }))
			.first();
		this.useCategoryTab = page.getByRole('button', { name: /Use Category/i })
			.or(page.getByRole('tab', { name: /Use Category/i }))
			.first();
		this.ageOfBuildingTab = page.getByRole('button', { name: /Age Of Building/i })
			.or(page.getByRole('tab', { name: /Age Of Building/i }))
			.first();

		this.generateAllButton = page.getByRole('button', { name: /Generate All/i }).first();
		this.applyButton = page.getByRole('button', { name: /^Apply$/i }).first();
		this.clearButton = page.getByRole('button', { name: /^Clear$/i }).first();
		this.updateButton = page.getByRole('button', { name: /^Update$/i }).first();
		this.cancelButton = page.getByRole('button', { name: /^Cancel$/i }).first();

		this.assessmentYearSelect = page.locator(
			'select[name*="assessmentYear"], select#assessmentYear, div:has-text("Assessment Year") select'
		).first();
		this.constructionTypeSelect = page.locator(
			'select[name*="constructionType"], select#constructionType, div:has-text("Construction Type") select'
		).first();
		this.typeOfUseSelect = page.locator(
			'select[name*="typeOfUse"], select#typeOfUse, div:has-text("Type Of Use") select'
		).first();
		this.ageRangeSelect = page.locator(
			'select[name*="ageRange"], div:has-text("Age Range") select'
		).first();

		this.tableRows = page.locator('table tbody tr');
		this.constructionCodeHeader = page.locator('th').filter({ hasText: /Construction Code/i }).first();
		this.descriptionHeader = page.locator('th').filter({ hasText: /Description/i }).first();
		this.factorHeader = page.locator('th').filter({ hasText: /^Factor$/i }).first();
		this.assessmentYearHeader = page.locator('th').filter({ hasText: /Assessment Year/i }).first();
		this.statusHeader = page.locator('th').filter({ hasText: /Status/i }).first();
		this.actionHeader = page.locator('th').filter({ hasText: /Action/i }).first();
		this.subTypeHeader = page.locator('th').filter({ hasText: /Sub Type/i }).first();
		this.ageFromHeader = page.locator('th').filter({ hasText: /Age From/i }).first();
		this.ageToHeader = page.locator('th').filter({ hasText: /Age To/i }).first();
		this.constructionTypeHeader = page.locator('th').filter({ hasText: /Construction Type/i }).first();

		this.searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="Weightage"], input[type="search"]').first();
		this.activeStatusBadge = page.getByText('Active', { exact: true });
		this.inactiveStatusBadge = page.getByText('Inactive', { exact: true });
		this.paginationInfo = page.getByText(/Showing \d+ to \d+ of \d+ entries/i).first();
		this.paginationNextButton = page.locator('.pagination a, .pagination button').filter({ hasText: /Next|>/i }).first();

		this.generatedUpdateButton = page.getByRole('button', { name: /^Update$/i });
		this.nonGeneratedCreateButton = page.getByRole('button', { name: /^Create$/i });

		// The live screen exposes the add form from the Age Of Building tab as
		// "Add Age" (there is no standalone Add Weightage button on Floor).
		this.addWeightageButton = page.getByRole('button', { name: /Add Weightage|Create Weightage|^Add Age$/i }).first();
		this.factorNameInput = page.locator(
			'input[name="factorName"], input[name="description"], #factorName, input[name="name"]'
		).first();
		this.weightageValueInput = page.locator(
			'input[name="weightageValue"], input[name="rate"], input[name="percentage"], #weightageValue, input[type="number"]'
		).first();
		this.effectiveFromInput = page.locator('input[name="effectiveFrom"], input[type="date"]').first();
		this.saveButton = page.getByRole('button', { name: /^Add$/i }).first();
		this.formCancelButton = page.getByRole('button', { name: /^Cancel$/i }).first();
		this.validationErrors = page.locator('p, span, div').filter({
			hasText: /required|mandatory|invalid|Please provide both From and To age/i,
		});
		this.addAgeFormHeading = page.getByRole('heading', { name: 'Add Age Range', exact: true });
		this.addAgeFromInput = page.getByPlaceholder('e.g. 0', { exact: true });
		this.addAgeToInput = page.getByPlaceholder('e.g. 5', { exact: true });

		this.editSubTypeModalHeader = page.getByText(/Edit Sub Type Weightage|Update sub type weightage details/i).first();
		this.editAgeModalHeader = page.getByText(/Edit Age Weightage/i).first();
		this.mandatoryWarningMessage = page.getByText(/Fields marked with \* are mandatory/i).first();
		this.editFactorInput = page.locator('div:has-text("Factor") input, input[name*="factor"]').first();

		this.addAgeButton = page.getByRole('button', { name: /Add Age/i }).first();
	}

	async navigateFromPropertyTaxModule(): Promise<void> {
		await this.selectMasterSubmenu('Weightage Master');
	}

	async expectLoaded(): Promise<void> {
		await this.page.waitForLoadState('load').catch(() => undefined);
		await this.pageHeading.waitFor({ state: 'visible', timeout: 15000 });
		await this.floorWeightageTab.waitFor({ state: 'visible', timeout: 15000 });
		await this.page.waitForURL(/\/en\/property-tax\/weightage-master(?:\?.*)?$/, { timeout: 15000 }).catch(() => undefined);
	}

	async verifyPageLoaded(): Promise<void> {
		await this.expectLoaded();
	}

	async getRowCount(): Promise<number> {
		return this.tableRows.count();
	}

	async getTableTextContent(tableIndex = 0): Promise<string> {
		const tables = this.page.locator('table');
		if ((await tables.count()) <= tableIndex) return '';
		return (await tables.nth(tableIndex).textContent()) ?? '';
	}

	async search(query: string): Promise<void> {
		await this.searchInput.waitFor({ state: 'visible', timeout: 10000 });
		await this.searchInput.fill(query);
		await expect(this.searchInput).toHaveValue(query);
	}

	async clearSearch(): Promise<void> {
		if (await this.searchInput.isVisible().catch(() => false)) {
			await this.searchInput.fill('');
		}
	}

	private async clickTab(tab: Locator): Promise<void> {
		await tab.waitFor({ state: 'visible', timeout: 10000 });
		await tab.click();
		// The tab click can trigger a route transition. Waiting for the selected
		// state avoids reading the previous panel while React is still hydrating.
		await expect(tab).toHaveAttribute('aria-selected', 'true', { timeout: 15000 });
		await this.page.waitForLoadState('load').catch(() => undefined);
		// Tab changes are SPA updates. Wait for any application loader to finish
		// instead of sleeping for a fixed amount of time.
		await this.waitForLoaderToDisappear().catch(() => undefined);
	}

	async openFloorWeightageTab(): Promise<void> {
		await this.clickTab(this.floorWeightageTab);
	}

	async openNatureBuildingTab(): Promise<void> {
		await this.clickTab(this.natureBuildingTab);
		await this.constructionCodeHeader.waitFor({ state: 'visible', timeout: 10000 });
	}

	async openUseCategoryTab(): Promise<void> {
		await this.clickTab(this.useCategoryTab);
		await this.page.locator('table').first().waitFor({ state: 'visible', timeout: 10000 });
	}

	async openAgeOfBuildingTab(): Promise<void> {
		await this.clickTab(this.ageOfBuildingTab);
		await this.ageFromHeader.waitFor({ state: 'visible', timeout: 10000 });
	}

	async clickGenerateAll(): Promise<void> {
		await this.generateAllButton.waitFor({ state: 'visible', timeout: 10000 });
		await this.generateAllButton.click();
	}

	async clickApply(): Promise<void> {
		await this.applyButton.waitFor({ state: 'visible', timeout: 10000 });
		await this.applyButton.click();
	}

	async clickClear(): Promise<void> {
		await this.clearButton.waitFor({ state: 'visible', timeout: 10000 });
		await this.clearButton.click();
	}

	async selectAssessmentYear(index = 1): Promise<void> {
		await this.selectByIndex(this.assessmentYearSelect, index);
	}

	async selectConstructionType(index = 1): Promise<void> {
		await this.selectByIndex(this.constructionTypeSelect, index);
	}

	async selectTypeOfUse(index = 1): Promise<void> {
		await this.selectByIndex(this.typeOfUseSelect, index);
	}

	async selectAgeRange(index = 1): Promise<void> {
		await this.selectByIndex(this.ageRangeSelect, index);
	}

	private async selectByIndex(select: Locator, index: number): Promise<void> {
		await select.waitFor({ state: 'visible', timeout: 10000 });
		const count = await select.locator('option').count();
		if (count > index) await select.selectOption({ index });
	}

	async openAddWeightage(): Promise<void> {
		if (!(await this.addWeightageButton.isVisible().catch(() => false))) {
			await this.openAgeOfBuildingTab();
		}
		await this.addWeightageButton.waitFor({ state: 'visible', timeout: 15000 });
		await this.addWeightageButton.click();
		await this.addAgeFormHeading.waitFor({ state: 'visible', timeout: 10000 });
	}

	async fillWeightageDetails(data: {
		factorName?: string;
		weightageValue?: string | number;
		effectiveFrom?: string;
	}): Promise<void> {
		if (data.factorName !== undefined && await this.factorNameInput.isVisible().catch(() => false)) {
			await this.factorNameInput.fill(data.factorName);
		}
		if (data.weightageValue !== undefined && await this.weightageValueInput.isVisible().catch(() => false)) {
			await this.weightageValueInput.fill(String(data.weightageValue));
		}
		if (data.effectiveFrom !== undefined && await this.effectiveFromInput.isVisible().catch(() => false)) {
			await this.effectiveFromInput.fill(data.effectiveFrom);
		}
	}

	async clickSave(): Promise<void> {
		await this.saveButton.waitFor({ state: 'visible', timeout: 10000 });
		await this.saveButton.click();
	}

	async clickFormCancel(): Promise<void> {
		if (await this.formCancelButton.isVisible().catch(() => false)) {
			await this.formCancelButton.click();
			await this.addAgeFormHeading.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => undefined);
		}
	}

	getRowByText(value: string): Locator {
		return this.tableRows.filter({ hasText: value }).first();
	}

	async updateRowFactorByCode(code: string, factor: string | number): Promise<void> {
		const row = this.getRowByText(code);
		await row.waitFor({ state: 'visible', timeout: 10000 });

		const input = row.locator('input[type="text"], input[type="number"]').first();
		if (await input.isVisible().catch(() => false)) {
			await input.fill(String(factor));
		}

		const update = row.getByRole('button', { name: /^Update$/i }).first();
		if (await update.isVisible().catch(() => false)) {
			await update.click();
		}
	}

	async clickMasterCategoryCode(code: string): Promise<void> {
		const firstTable = this.page.locator('table').first();
		const row = firstTable.locator('tbody tr').filter({ hasText: code }).first();
		await row.waitFor({ state: 'visible', timeout: 10000 });

		const link = row.getByRole('link', { name: new RegExp(code, 'i') }).first();
		if (await link.isVisible().catch(() => false)) {
			await link.click();
			return;
		}

		await row.click();
	}

	private generatedRow(): Locator {
		return this.tableRows.filter({
			has: this.page.getByRole('button', { name: /^Update$/i })
		}).first();
	}

	async clickEditForGeneratedRecord(): Promise<void> {
		const row = this.generatedRow();
		await row.waitFor({ state: 'visible', timeout: 10000 });
		await row.locator('button[aria-label="Edit"], button[title="Edit"], a[href*="edit"]').first().click();
	}

	async clickDeleteForGeneratedRecord(): Promise<void> {
		const row = this.generatedRow();
		await row.waitFor({ state: 'visible', timeout: 10000 });
		await row.locator('button[aria-label="Delete"], button[title="Delete"], .btn-danger').first().click();
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

	async clickAddAge(): Promise<void> {
		await this.addAgeButton.waitFor({ state: 'visible', timeout: 10000 });
		await this.addAgeButton.click();
	}

	async clickAgeRowClear(): Promise<void> {
		const row = this.generatedRow();
		await row.waitFor({ state: 'visible', timeout: 10000 });
		const clear = row.getByRole('button', { name: /^Clear$/i }).first();
		if (await clear.isVisible().catch(() => false)) await clear.click();
	}

	async clickAgePaginationPage2(): Promise<void> {
		const page2 = this.page.locator('.pagination a, .pagination button').filter({ hasText: /^2$/ }).first();
		if (await page2.isVisible().catch(() => false)) {
			await page2.click();
			await expect(page2).toHaveAttribute('aria-current', 'page', { timeout: 10000 }).catch(() => undefined);
		}
	}

	async getPaginationInfoText(): Promise<string> {
		if (!(await this.paginationInfo.isVisible().catch(() => false))) return '';
		return (await this.paginationInfo.textContent()) ?? '';
	}
}
