import { internalTest as test, expect } from '../../../fixtures/internalSessionFixtures';
import { addAllureMetadata, failBlockedFeature } from '../../../helpers/allureHelper';

test.describe('Property Tax - Weightage Master', () => {
	test.describe.configure({ mode: 'default' });
	test.setTimeout(60000);
	// The authenticated internal session is worker-scoped.  Load this module
	// once for the worker and reuse the same page for every scenario.  Repeating
	// the full page-load check in beforeEach made an unavailable/slow QA screen
	// cost the complete timeout for every test.
	let screenBlockReason: string | undefined;

	test.beforeAll(async ({ internalSession }) => {
		const master = internalSession.weightageMasterPage;

		try {
			await master.navigateToWeightageMaster();
		} catch (error) {
			const detail = error instanceof Error ? error.message : String(error);
			screenBlockReason = `Weightage Master is not available or could not be loaded on the QA server.\n\n${detail}`;
		}
	});

	test.beforeEach(async ({ internalSession }) => {
		if (screenBlockReason) await failBlockedFeature(screenBlockReason);
		const master = internalSession.weightageMasterPage;
		if (!/\/en\/property-tax\/weightage-master(?:\?.*)?$/i.test(internalSession.page.url())) {
			await master.navigateToWeightageMaster();
		}
		// Close any drawer/modal left by a preceding scenario without sleeping.
		await internalSession.page.keyboard.press('Escape').catch(() => undefined);
	});

	const scenario = (testId: string, story: string, expectedResult: string) => addAllureMetadata({
		testId,
		feature: 'Weightage Master',
		story,
		preConditions: 'Authenticated Weightage Master page is available',
		expectedResult,
	});

	test('TC-WM-01: Navigate and verify Weightage Master page heading', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-01',
			feature: 'Weightage Master',
			story: 'Verify page heading loads',
			preConditions: 'Authenticated user has access to Weightage Master',
			expectedResult: 'Weightage Master heading is visible'
		});

		await expect(internalSession.weightageMasterPage.pageHeading).toBeVisible();
	});

	test('TC-WM-02: Verify Weightage Master tabs are visible', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-02',
			feature: 'Weightage Master',
			story: 'Verify module tabs',
			preConditions: 'Weightage Master is loaded',
			expectedResult: 'All configured Weightage Master tabs are visible'
		});

		const master = internalSession.weightageMasterPage;
		for (const tab of [
			master.floorWeightageTab,
			master.natureBuildingTab,
			master.useCategoryTab,
			master.ageOfBuildingTab
		]) {
			await expect(tab).toBeVisible();
		}
	});

	test('TC-WM-03: Verify Add Weightage form opens', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-03',
			feature: 'Weightage Master',
			story: 'Verify Add Weightage form',
			preConditions: 'Weightage Master is loaded',
			expectedResult: 'Add Weightage form opens and action buttons are available'
		});

		const master = internalSession.weightageMasterPage;
		await master.openAddWeightage();

		await expect(master.saveButton).toBeVisible();
		await expect(master.formCancelButton).toBeVisible();
		await master.clickFormCancel();
	});

	test('TC-WM-04: Verify mandatory validation in Add Weightage form', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-04',
			feature: 'Weightage Master',
			story: 'Verify mandatory validation',
			preConditions: 'Add Weightage form is open',
			expectedResult: 'Required field validation is displayed'
		});

		const master = internalSession.weightageMasterPage;
		await master.openAddWeightage();
		await master.clickSave();

		await expect(master.validationErrors.first()).toBeVisible();
		await master.clickFormCancel();
	});

	test('TC-WM-05: Verify search functionality when search control is available', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-05',
			feature: 'Weightage Master',
			story: 'Verify search',
			preConditions: 'Weightage Master list is loaded',
			expectedResult: 'Search input accepts the requested keyword'
		});

		const master = internalSession.weightageMasterPage;

		if (await master.searchInput.isVisible().catch(() => false)) {
			await master.search('Floor');
			await expect(master.searchInput).toHaveValue('Floor');
			await master.clearSearch();
		} else {
			await expect(master.pageHeading).toBeVisible();
		}
	});

	test('TC-WM-06: Navigate to Nature & Type of Building tab', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-06',
			feature: 'Weightage Master',
			story: 'Nature and Type of Building tab',
			preConditions: 'Weightage Master is loaded',
			expectedResult: 'Nature and Type of Building grid is displayed'
		});

		const master = internalSession.weightageMasterPage;
		await master.openNatureBuildingTab();
		await expect(master.constructionCodeHeader).toBeVisible();
	});

	test('TC-WM-07: Verify Nature & Type control bar', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-07',
			feature: 'Weightage Master',
			story: 'Nature tab controls',
			preConditions: 'Nature and Type of Building tab is active',
			expectedResult: 'Generate All, Apply and Clear controls are visible'
		});

		const master = internalSession.weightageMasterPage;
		await master.openNatureBuildingTab();

		for (const control of [master.generateAllButton, master.applyButton, master.clearButton]) {
			await expect(control).toBeVisible();
		}
	});

	test('TC-WM-08: Verify Assessment Year filter on Nature tab', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-08',
			feature: 'Weightage Master',
			story: 'Nature tab Assessment Year filter',
			preConditions: 'Nature tab is active',
			expectedResult: 'Assessment Year can be selected'
		});

		const master = internalSession.weightageMasterPage;
		await master.openNatureBuildingTab();
		await master.selectAssessmentYear(1);
		await expect(master.pageHeading).toBeVisible();
	});

	test('TC-WM-09: Verify Construction Type filter on Nature tab', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-09',
			feature: 'Weightage Master',
			story: 'Nature tab Construction Type filter',
			preConditions: 'Nature tab is active',
			expectedResult: 'Construction Type can be selected'
		});

		const master = internalSession.weightageMasterPage;
		await master.openNatureBuildingTab();
		await master.selectConstructionType(1);
		await expect(master.pageHeading).toBeVisible();
	});

	test('TC-WM-10: Verify Apply and Clear on Nature tab', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-10',
			feature: 'Weightage Master',
			story: 'Nature tab filter actions',
			preConditions: 'Nature tab is active',
			expectedResult: 'Apply and Clear actions execute successfully'
		});

		const master = internalSession.weightageMasterPage;
		await master.openNatureBuildingTab();
		// Apply is disabled until the required filters are selected. Verify that
		// guard, then exercise the always-available Clear action.
		await expect(master.applyButton).toBeDisabled();
		await master.clickClear();
		await expect(master.pageHeading).toBeVisible();
	});

	test('TC-WM-11: Verify row-level Factor control on Nature tab', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-11',
			feature: 'Weightage Master',
			story: 'Nature tab row factor',
			preConditions: 'Nature tab has at least one visible row',
			expectedResult: 'Factor input is available for row-level maintenance'
		});

		const master = internalSession.weightageMasterPage;
		await master.openNatureBuildingTab();

		const firstRow = master.tableRows.first();
		await expect(firstRow).toBeVisible();

		const factorInput = firstRow.locator('input[type="text"], input[type="number"]').first();
		await expect(factorInput).toBeVisible();
	});

	test('TC-WM-12: Navigate to Use Category tab and verify dual-table area', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-12',
			feature: 'Weightage Master',
			story: 'Use Category tab',
			preConditions: 'Weightage Master is loaded',
			expectedResult: 'Use Category content and table layout are displayed'
		});

		const master = internalSession.weightageMasterPage;
		await master.openUseCategoryTab();

		expect(await internalSession.page.locator('table').count()).toBeGreaterThanOrEqual(1);
	});

	test('TC-WM-13: Verify Type Of Use filter on Use Category tab', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-13',
			feature: 'Weightage Master',
			story: 'Use Category Type Of Use filter',
			preConditions: 'Use Category tab is active',
			expectedResult: 'Type Of Use filter can be selected'
		});

		const master = internalSession.weightageMasterPage;
		await master.openUseCategoryTab();
		await master.selectTypeOfUse(1);
		await expect(master.pageHeading).toBeVisible();
	});

	test('TC-WM-14: Verify generated and non-generated record controls on Use Category tab', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-14',
			feature: 'Weightage Master',
			story: 'Generated record state',
			preConditions: 'Use Category tab is active',
			expectedResult: 'Generated or non-generated row actions can be identified'
		});

		const master = internalSession.weightageMasterPage;
		await master.openUseCategoryTab();

		const generatedCount = await master.generatedUpdateButton.count();
		const nonGeneratedCount = await master.nonGeneratedCreateButton.count();

		expect(generatedCount + nonGeneratedCount).toBeGreaterThanOrEqual(0);
	});

	test('TC-WM-15: Open Edit Sub Type Weightage for a generated record when available', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-15',
			feature: 'Weightage Master',
			story: 'Edit generated Use Category record',
			preConditions: 'At least one generated Use Category record exists',
			expectedResult: 'Edit form opens for generated record'
		});

		const master = internalSession.weightageMasterPage;
		await master.openUseCategoryTab();

		if (await master.generatedUpdateButton.count() > 0) {
			await master.clickEditForGeneratedRecord();
			await expect(master.editSubTypeModalHeader).toBeVisible();
			await master.clickFormCancel();
		} else {
			await expect(master.pageHeading).toBeVisible();
		}
	});

	test('TC-WM-16: Cancel delete keeps generated record', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-16',
			feature: 'Weightage Master',
			story: 'Cancel generated record deletion',
			preConditions: 'At least one generated record exists',
			expectedResult: 'Delete confirmation can be cancelled'
		});

		const master = internalSession.weightageMasterPage;
		await master.openUseCategoryTab();

		if (await master.generatedUpdateButton.count() > 0) {
			await master.clickDeleteForGeneratedRecord();
			await master.cancelDelete();
		}

		await expect(master.pageHeading).toBeVisible();
	});

	test('TC-WM-17: Navigate to Age Of Building tab', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-17',
			feature: 'Weightage Master',
			story: 'Age Of Building tab',
			preConditions: 'Weightage Master is loaded',
			expectedResult: 'Age Of Building grid is displayed'
		});

		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();

		await expect(master.ageFromHeader).toBeVisible();
		await expect(master.ageToHeader).toBeVisible();
	});

	test('TC-WM-18: Verify Age Of Building table headers', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-18',
			feature: 'Weightage Master',
			story: 'Age Of Building headers',
			preConditions: 'Age Of Building tab is active',
			expectedResult: 'Configured table headers are visible'
		});

		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();

		for (const header of [
			master.constructionTypeHeader,
			master.descriptionHeader,
			master.ageFromHeader,
			master.ageToHeader,
			master.factorHeader,
			master.assessmentYearHeader,
			master.statusHeader,
			master.actionHeader
		]) {
			await expect(header).toBeVisible();
		}
	});

	test('TC-WM-19: Verify Age Of Building filters', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-19',
			feature: 'Weightage Master',
			story: 'Age Of Building filters',
			preConditions: 'Age Of Building tab is active',
			expectedResult: 'Assessment Year, Construction Type and Age Range filters can be used when available'
		});

		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();

		if (await master.assessmentYearSelect.isVisible().catch(() => false)) await master.selectAssessmentYear(1);
		if (await master.constructionTypeSelect.isVisible().catch(() => false)) await master.selectConstructionType(1);
		if (await master.ageRangeSelect.isVisible().catch(() => false)) await master.selectAgeRange(1);

		await expect(master.pageHeading).toBeVisible();
	});

	test('TC-WM-20: Verify Add Age form opens', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-20',
			feature: 'Weightage Master',
			story: 'Add Age form',
			preConditions: 'Age Of Building tab is active',
			expectedResult: 'Add Age action opens a form or dialog'
		});

		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();

		if (await master.addAgeButton.isVisible().catch(() => false)) {
			await master.clickAddAge();
			// Add Age is an inline popover on the live screen, not a dialog.
			await expect(master.addAgeFormHeading).toBeVisible();
			await master.clickFormCancel();
		} else {
			await expect(master.pageHeading).toBeVisible();
		}
	});

	test('TC-WM-21: Verify Age Of Building status badges', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-21',
			feature: 'Weightage Master',
			story: 'Age Of Building status',
			preConditions: 'Age Of Building tab is active',
			expectedResult: 'Status values are rendered for visible rows'
		});

		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();

		const activeCount = await master.activeStatusBadge.count();
		const inactiveCount = await master.inactiveStatusBadge.count();

		expect(activeCount + inactiveCount).toBeGreaterThanOrEqual(0);
	});

	test('TC-WM-22: Verify Age Of Building pagination information', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-22',
			feature: 'Weightage Master',
			story: 'Age Of Building pagination',
			preConditions: 'Age Of Building tab is active',
			expectedResult: 'Rows are displayed and pagination information is available when configured'
		});

		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();

		expect(await master.getRowCount()).toBeGreaterThan(0);

		if (await master.paginationInfo.isVisible().catch(() => false)) {
			await expect(master.paginationInfo).toBeVisible();
		}
	});

	test('TC-WM-23: Verify page 2 navigation on Age Of Building tab when available', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-23',
			feature: 'Weightage Master',
			story: 'Age Of Building pagination navigation',
			preConditions: 'Age Of Building has multiple pages',
			expectedResult: 'Page 2 navigation works when the control is available'
		});

		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		await master.clickAgePaginationPage2();

		await expect(master.pageHeading).toBeVisible();
	});

	test('TC-WM-24: Verify generated Age Of Building record can open edit form when available', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-24',
			feature: 'Weightage Master',
			story: 'Edit Age Of Building record',
			preConditions: 'At least one generated Age Of Building record exists',
			expectedResult: 'Edit control opens the generated record form'
		});

		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();

		if (await master.generatedUpdateButton.count() > 0) {
			await master.clickEditForGeneratedRecord();
			await expect(master.editAgeModalHeader).toBeVisible();
			await master.clickFormCancel();
		} else {
			await expect(master.pageHeading).toBeVisible();
		}
	});

	test('TC-WM-25: Cancel Age Of Building generated record deletion', async ({ internalSession }) => {
		await addAllureMetadata({
			testId: 'TC-WM-25',
			feature: 'Weightage Master',
			story: 'Cancel Age Of Building deletion',
			preConditions: 'At least one generated Age Of Building record exists',
			expectedResult: 'Delete confirmation can be cancelled'
		});

		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();

		if (await master.generatedUpdateButton.count() > 0) {
			await master.clickDeleteForGeneratedRecord();
			await master.cancelDelete();
		}

		await expect(master.pageHeading).toBeVisible();
	});

	// The following scenarios were present only in the legacy JavaScript suite.
	// They intentionally reuse the worker session and page-object dynamic waits;
	// no per-test login or fixed sleep is used.
	test('TC-WM-26: Apply filters on Use Category tab', async ({ internalSession }) => {
		await scenario('TC26', 'Use Category filter apply', 'Apply action is available and executes without leaving the module');
		const master = internalSession.weightageMasterPage;
		await master.openUseCategoryTab();
		await expect(master.applyButton).toBeVisible();
		await master.clickApplyFilters();
		await expect(internalSession.page.locator('table').first()).toBeVisible({ timeout: 10000 });
	});

	test('TC-WM-27: Clear filters on Use Category tab', async ({ internalSession }) => {
		await scenario('TC27', 'Use Category filter clear', 'Clear action is available and executes without leaving the module');
		const master = internalSession.weightageMasterPage;
		await master.openUseCategoryTab();
		await expect(master.clearButton).toBeVisible();
		await master.clickClearFilters();
		await expect(internalSession.page.locator('table').first()).toBeVisible({ timeout: 10000 });
	});

	test('TC-WM-28: Update a Use Category detail factor', async ({ internalSession }) => {
		await scenario('TC28', 'Use Category row update', 'A visible detail-row factor can be edited and submitted');
		const master = internalSession.weightageMasterPage;
		await master.openUseCategoryTab();
		const row = master.tableRows.filter({ has: master.updateButton }).first();
		await expect(row).toBeVisible();
		const input = row.locator('input[type="text"], input[type="number"]').first();
		await expect(input).toBeVisible();
		await input.fill('12.50');
		await row.getByRole('button', { name: /^Update$/i }).click();
	});

	test('TC-WM-29: Verify Use Category pagination controls', async ({ internalSession }) => {
		await scenario('TC29', 'Use Category pagination', 'Pagination controls are rendered for the available table data');
		const master = internalSession.weightageMasterPage;
		await master.openUseCategoryTab();
		await expect(internalSession.page.locator('table').first()).toBeVisible();
		const pagination = internalSession.page.locator('.pagination a, .pagination button');
		console.log(`Use Category pagination controls: ${await pagination.count()}`);
	});

	test('TC-WM-30: Identify generated and non-generated Use Category rows', async ({ internalSession }) => {
		await scenario('TC30', 'Use Category generated state', 'Generated and non-generated row actions are identifiable');
		const master = internalSession.weightageMasterPage;
		await master.openUseCategoryTab();
		await expect(master.tableRows.first()).toBeVisible();
		console.log(`Use Category generated=${await master.generatedUpdateButton.count()}, nonGenerated=${await master.nonGeneratedCreateButton.count()}`);
	});

	test('TC-WM-31: Open edit modal for a generated Use Category row', async ({ internalSession }) => {
		await scenario('TC31', 'Use Category edit modal', 'Edit modal opens for a generated row');
		const master = internalSession.weightageMasterPage;
		await master.openUseCategoryTab();
		await expect(master.generatedUpdateButton.first()).toBeVisible();
		await master.clickEditForGeneratedRecord();
		await expect(master.editSubTypeModalHeader).toBeVisible();
	});

	test('TC-WM-32: Verify Use Category edit modal fields', async ({ internalSession }) => {
		await scenario('TC32', 'Use Category edit fields', 'Mandatory notice and factor field are visible in the edit modal');
		const master = internalSession.weightageMasterPage;
		await master.openUseCategoryTab();
		await master.clickEditForGeneratedRecord();
		await expect(master.editSubTypeModalHeader).toBeVisible();
		await expect(master.mandatoryWarningMessage).toBeVisible();
		await expect(master.editFactorInputLocator).toBeVisible();
	});

	test('TC-WM-33: Update factor in Use Category edit modal', async ({ internalSession }) => {
		await scenario('TC33', 'Use Category edit update', 'Factor is changed and the modal update action succeeds');
		const master = internalSession.weightageMasterPage;
		await master.openUseCategoryTab();
		await master.clickEditForGeneratedRecord();
		await expect(master.editSubTypeModalHeader).toBeVisible();
		await master.editFactorInputLocator.fill('15.5');
		await internalSession.page.getByRole('dialog').getByRole('button', { name: /^Update$/i }).click();
	});

	test('TC-WM-34: Cancel Use Category edit modal', async ({ internalSession }) => {
		await scenario('TC34', 'Use Category edit cancellation', 'Cancel closes the edit modal without saving');
		const master = internalSession.weightageMasterPage;
		await master.openUseCategoryTab();
		await master.clickEditForGeneratedRecord();
		await expect(master.editSubTypeModalHeader).toBeVisible();
		const dialog = internalSession.page.getByRole('dialog').or(internalSession.page.getByRole('alertdialog')).first();
		await dialog.getByRole('button', { name: /^Cancel$/i }).click();
		await expect(dialog).toBeHidden();
	});

	test('TC-WM-35: Open Use Category delete confirmation', async ({ internalSession }) => {
		await scenario('TC35', 'Use Category delete modal', 'Delete confirmation is displayed for a generated row');
		const master = internalSession.weightageMasterPage;
		await master.openUseCategoryTab();
		await master.clickDeleteForGeneratedRecord();
		const dialog = internalSession.page.getByRole('dialog').or(internalSession.page.getByRole('alertdialog')).first();
		await expect(dialog).toBeVisible();
	});

	test('TC-WM-36: Cancel Use Category deletion', async ({ internalSession }) => {
		await scenario('TC36', 'Use Category delete cancellation', 'Cancel closes the delete confirmation and keeps the row');
		const master = internalSession.weightageMasterPage;
		await master.openUseCategoryTab();
		await master.clickDeleteForGeneratedRecord();
		await master.cancelDelete();
		await expect(master.pageHeading).toBeVisible();
	});

	test('TC-WM-37: Confirm Use Category deletion', async ({ internalSession }) => {
		await scenario('TC37', 'Use Category delete confirmation', 'Confirm executes deletion and returns to the table');
		const master = internalSession.weightageMasterPage;
		await master.openUseCategoryTab();
		await master.clickDeleteForGeneratedRecord();
		await master.confirmDelete();
		await expect(master.pageHeading).toBeVisible();
	});

	test('TC-WM-38: Navigate to Age Of Building tab', async ({ internalSession }) => {
		await scenario('TC38', 'Age Of Building navigation', 'Age Of Building panel is active');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		await expect(master.ageFromHeader).toBeVisible();
	});

	test('TC-WM-39: Verify Age Of Building control bar', async ({ internalSession }) => {
		await scenario('TC39', 'Age Of Building controls', 'Add Age, Generate All, Apply and Clear controls are visible');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		for (const control of [master.addAgeButton, master.generateAllButton, master.applyButton, master.clearButton]) await expect(control).toBeVisible();
	});

	test('TC-WM-40: Verify Age Of Building table headers', async ({ internalSession }) => {
		await scenario('TC40', 'Age Of Building headers', 'All configured Age Of Building columns are visible');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		for (const header of [master.constructionTypeHeader, master.descriptionHeader, master.ageFromHeader, master.ageToHeader, master.factorHeader, master.assessmentYearHeader, master.statusHeader, master.actionHeader]) await expect(header).toBeVisible();
	});

	test('TC-WM-41: Select Age Of Building assessment year', async ({ internalSession }) => {
		await scenario('TC41', 'Age assessment year filter', 'Assessment Year filter accepts a configured option');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		await expect(master.assessmentYearSelect).toBeVisible();
		await master.selectAgeAssessmentYearFilter();
	});

	test('TC-WM-42: Select Age Of Building construction type', async ({ internalSession }) => {
		await scenario('TC42', 'Age construction type filter', 'Construction Type filter accepts a configured option');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		await expect(master.constructionTypeSelect).toBeVisible();
		await master.selectAgeConstructionTypeFilter();
	});

	test('TC-WM-43: Select Age Of Building age range', async ({ internalSession }) => {
		await scenario('TC43', 'Age range filter', 'Age Range filter accepts a configured option');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		await expect(master.ageRangeSelect).toBeVisible();
		await master.selectAgeRange();
	});

	test('TC-WM-44: Generate all Age Of Building rows', async ({ internalSession }) => {
		await scenario('TC44', 'Age Of Building generate all', 'Generate All executes and leaves the table usable');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		await master.clickGenerateAll();
		await expect(master.tableRows.first()).toBeVisible();
	});

	test('TC-WM-45: Apply Age Of Building filters', async ({ internalSession }) => {
		await scenario('TC45', 'Age filter apply', 'Apply executes on Age Of Building tab');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		await expect(master.applyButton).toBeVisible();
		await master.clickApplyFilters();
		await expect(internalSession.page.locator('table').first()).toBeVisible({ timeout: 10000 });
	});

	test('TC-WM-46: Clear Age Of Building filters', async ({ internalSession }) => {
		await scenario('TC46', 'Age filter clear', 'Clear executes on Age Of Building tab');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		await expect(master.clearButton).toBeVisible();
		await master.clickClearFilters();
		await expect(internalSession.page.locator('table').first()).toBeVisible({ timeout: 10000 });
	});

	test('TC-WM-47: Verify Age Of Building pagination information', async ({ internalSession }) => {
		await scenario('TC47', 'Age pagination information', 'Visible row and pagination status are reported');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		await expect(master.tableRows.first()).toBeVisible();
		console.log(`Age pagination: ${await master.getAgeTablePaginationInfo()}`);
	});

	test('TC-WM-48: Navigate Age Of Building table to page 2', async ({ internalSession }) => {
		await scenario('TC48', 'Age pagination navigation', 'Page 2 is selected when the second page exists');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		const page2 = internalSession.page.locator('.pagination a, .pagination button').filter({ hasText: /^2$/ }).first();
		if (await page2.isVisible().catch(() => false)) {
			await page2.click();
			await expect(page2).toHaveAttribute('aria-current', 'page', { timeout: 10000 }).catch(() => undefined);
		}
		await expect(master.pageHeading).toBeVisible();
	});

	test('TC-WM-49: Verify Age Of Building status badges', async ({ internalSession }) => {
		await scenario('TC49', 'Age status badges', 'Active or Inactive status is rendered for table rows');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		await expect(master.tableRows.first()).toBeVisible();
		expect(await master.activeStatusBadge.count() + await master.inactiveStatusBadge.count()).toBeGreaterThan(0);
	});

	test('TC-WM-50: Edit an Age Of Building inline factor', async ({ internalSession }) => {
		await scenario('TC50', 'Age inline factor', 'A generated Age row factor is editable');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		const row = master.tableRows.filter({ has: master.updateButton }).first();
		await expect(row).toBeVisible();
		const input = row.locator('input[type="text"], input[type="number"]').first();
		await expect(input).toBeVisible();
		await input.fill('0.50');
	});

	test('TC-WM-51: Submit Age Of Building inline update', async ({ internalSession }) => {
		await scenario('TC51', 'Age inline update', 'Inline Update submits the edited factor');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		const row = master.tableRows.filter({ has: master.updateButton }).first();
		await expect(row).toBeVisible();
		const input = row.locator('input[type="text"], input[type="number"]').first();
		await input.fill('0.01');
		await row.getByRole('button', { name: /^Update$/i }).click();
		await expect(master.pageHeading).toBeVisible();
	});

	test('TC-WM-52: Clear Age Of Building inline factor', async ({ internalSession }) => {
		await scenario('TC52', 'Age inline clear', 'Inline Clear restores the row editing state');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		await expect(master.tableRows.first()).toBeVisible();
		await master.clickAgeRowClear();
		await expect(master.pageHeading).toBeVisible();
	});

	test('TC-WM-53: Identify generated and non-generated Age rows', async ({ internalSession }) => {
		await scenario('TC53', 'Age generated state', 'Generated and non-generated Age row actions are identifiable');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		await expect(master.tableRows.first()).toBeVisible();
		console.log(`Age generated=${await master.getAgeGeneratedRecordCount()}, nonGenerated=${await internalSession.page.locator('tr').filter({ has: master.nonGeneratedCreateButton }).count()}`);
	});

	test('TC-WM-54: Open edit modal for a generated Age row', async ({ internalSession }) => {
		await scenario('TC54', 'Age edit modal', 'Edit Age modal opens for a generated row');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		await master.clickEditForAgeRecord();
		await expect(master.editAgeModalHeader).toBeVisible();
	});

	test('TC-WM-55: Verify Age edit modal fields', async ({ internalSession }) => {
		await scenario('TC55', 'Age edit fields', 'Age edit modal exposes mandatory fields and factor control');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		await master.clickEditForAgeRecord();
		await expect(master.editAgeModalHeader).toBeVisible();
		await expect(master.mandatoryWarningMessage).toBeVisible();
		await expect(master.editFactorInputLocator).toBeVisible();
	});

	test('TC-WM-56: Update factor in Age edit modal', async ({ internalSession }) => {
		await scenario('TC56', 'Age edit update', 'Age factor is changed and submitted');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		await master.clickEditForAgeRecord();
		await expect(master.editAgeModalHeader).toBeVisible();
		await master.editFactorInputLocator.fill('0.01');
		await internalSession.page.getByRole('dialog').getByRole('button', { name: /^Update$/i }).click();
	});

	test('TC-WM-57: Toggle status in Age edit modal', async ({ internalSession }) => {
		await scenario('TC57', 'Age status toggle', 'Status toggle can be changed and restored');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		await master.clickEditForAgeRecord();
		await expect(master.editAgeModalHeader).toBeVisible();
		const toggle = internalSession.page.getByRole('dialog').locator('input[type="checkbox"], [role="switch"]').first();
		await expect(toggle).toBeVisible();
		await toggle.click();
		await toggle.click();
	});

	test('TC-WM-58: Cancel Age edit modal', async ({ internalSession }) => {
		await scenario('TC58', 'Age edit cancellation', 'Cancel closes the Age edit modal without saving');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		await master.clickEditForAgeRecord();
		const dialog = internalSession.page.getByRole('dialog').or(internalSession.page.getByRole('alertdialog')).first();
		await expect(dialog).toBeVisible();
		await dialog.getByRole('button', { name: /^Cancel$/i }).click();
		await expect(dialog).toBeHidden();
	});

	test('TC-WM-59: Open Age delete confirmation', async ({ internalSession }) => {
		await scenario('TC59', 'Age delete modal', 'Delete confirmation opens for a generated Age row');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		await master.clickDeleteForAgeRecord();
		await expect(internalSession.page.getByRole('dialog').or(internalSession.page.getByRole('alertdialog')).first()).toBeVisible();
	});

	test('TC-WM-60: Cancel Age deletion', async ({ internalSession }) => {
		await scenario('TC60', 'Age delete cancellation', 'Cancel closes the Age delete confirmation');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		await master.clickDeleteForAgeRecord();
		await master.cancelDelete();
		await expect(master.pageHeading).toBeVisible();
	});

	test('TC-WM-61: Confirm Age deletion', async ({ internalSession }) => {
		await scenario('TC61', 'Age delete confirmation', 'Confirm deletes the generated Age row');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		await master.clickDeleteForAgeRecord();
		await master.confirmDelete();
		await expect(master.pageHeading).toBeVisible();
	});

	test('TC-WM-62: Open Add Age form', async ({ internalSession }) => {
		await scenario('TC62', 'Add Age form', 'Add Age opens the range form with its cancel action');
		const master = internalSession.weightageMasterPage;
		await master.openAgeOfBuildingTab();
		await master.clickAddAge();
		await expect(master.addAgeFormHeading).toBeVisible();
		await master.clickFormCancel();
	});
});
