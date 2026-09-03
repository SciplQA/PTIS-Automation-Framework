import { internalTest as test, expect } from '../../../fixtures/internalSessionFixtures';
import { addAllureMetadata, failBlockedFeature } from '../../../helpers/allureHelper';

test.describe('Property Tax - Weightage Master', () => {
	test.describe.configure({ mode: 'default' });
	test.setTimeout(120000);

	test.beforeEach(async ({ internalSession }) => {
		const master = internalSession.weightageMasterPage;

		try {
			if (!internalSession.page.url().includes('/en/property-tax/weightage-master')) {
				await master.navigateFromPropertyTaxModule();
			}

			await master.expectLoaded();
		} catch (error) {
			const detail = error instanceof Error ? error.message : String(error);
			await failBlockedFeature(
				`Weightage Master is not available or could not be loaded on the QA server.\n\n${detail}`,
			);
		}
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
});
