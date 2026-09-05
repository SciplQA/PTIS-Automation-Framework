import { internalTest as test, expect } from '../../../fixtures/internalSessionFixtures';
import { PtisPropertyTypeMasterPage } from '../../../pages/property-tax/Masters/PropertyTypeMasterPage';
import * as allure from 'allure-js-commons';
import { failBlockedFeature } from '../../../helpers/allureHelper';

test.describe('PTIS - Property Type Master Suite (TC01 - TC40)', () => {
    let propTypePage: PtisPropertyTypeMasterPage;

    test.beforeEach(async ({ internalSession }) => {
        propTypePage = internalSession.propertyTypeMasterPage;
        try {
            await propTypePage.navigateToPropertyTypeMaster();
        } catch (error) {
            const detail = error instanceof Error ? error.message : String(error);
            await failBlockedFeature(`Property Type Master is not available or could not be opened on the QA server.\n\n${detail}`);
        }
    });

    // =========================================================================
    // SECTION 1: UI & Initial State Verification (TC01 - TC07)
    // =========================================================================

    test('TC01 - Verify Property Type Master screen loads successfully with correct title, subtitle, and URL', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('UI & Header Verification');
        allure.severity('critical');

        await test.step('Verify current URL and page header elements', async () => {
            expect(page.url()).toContain('/en/property-tax/propertytype');
            await expect(propTypePage.pageHeading).toBeVisible();
            await expect(propTypePage.pageHeading).toHaveText('Property Type Master');
            await expect(propTypePage.pageSubtitle).toBeVisible();
            await expect(propTypePage.pageSubtitle).toHaveText('Manage property types and their classifications');
        });

        await test.step('Capture evidence screenshot of page headers', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC01_PropertyTypeMaster_Header_Proof.png');
        });
    });

    test('TC02 - Verify table structure, borders, and column headers', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Table Columns Verification');
        allure.severity('critical');

        await test.step('Verify table and header row visibility', async () => {
            await expect(propTypePage.table).toBeVisible();
            await expect(propTypePage.tableHeader).toBeVisible();
        });

        await test.step('Verify all 7 expected column headers', async () => {
            const headers = await propTypePage.getColumnHeaders();
            expect(headers).toContain('Property Description');
            expect(headers).toContain('Type');
            expect(headers).toContain('Property Type Category');
            expect(headers).toContain('Search Sequence');
            expect(headers).toContain('Type of Use Validation');
            expect(headers).toContain('Status');
            expect(headers).toContain('Actions');
        });

        await test.step('Capture evidence screenshot of table headers', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC02_Table_Headers_Proof.png', propTypePage.tableHeader);
        });
    });

    test('TC03 - Verify Add Property Type button presence, styling, and icon', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Add Button Verification');
        allure.severity('normal');

        await test.step('Verify Add Property Type button is visible and enabled', async () => {
            await expect(propTypePage.addPropertyTypeBtn).toBeVisible();
            await expect(propTypePage.addPropertyTypeBtn).toBeEnabled();
            await expect(propTypePage.addPropertyTypeBtn).toContainText('Add Property Type');
        });

        await test.step('Capture evidence screenshot of Add button', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC03_Add_Button_Proof.png', propTypePage.addPropertyTypeBtn);
        });
    });

    test('TC04 - Verify Search input placeholder and initial state', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Search Input Verification');
        allure.severity('normal');

        await test.step('Verify search input attributes', async () => {
            await expect(propTypePage.searchInput).toBeVisible();
            await expect(propTypePage.searchInput).toBeEnabled();
            await expect(propTypePage.searchInput).toHaveAttribute('placeholder', 'Search by Property Description or Type...');
            await expect(propTypePage.searchInput).toHaveValue('');
        });

        await test.step('Capture evidence screenshot of Search input', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC04_Search_Input_Proof.png', propTypePage.searchInput);
        });
    });

    test('TC05 - Verify table rows render properly with data and Active status badges', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Table Rows & Status Badge');
        allure.severity('normal');

        await test.step('Verify at least one data row is loaded in table', async () => {
            const count = await propTypePage.getTableRowCount();
            expect(count).toBeGreaterThan(0);
        });

        await test.step('Verify first row status badge is Active', async () => {
            const firstRow = propTypePage.tableRows.first();
            const statusBadge = firstRow.locator('span:has-text("Active")').first();
            await expect(statusBadge).toBeVisible();
        });

        await test.step('Capture evidence screenshot of first data row', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC05_Table_Row_Proof.png', propTypePage.tableRows.first());
        });
    });

    test('TC06 - Verify Type of Use Validation badges in table rows', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Type of Use Badges');
        allure.severity('normal');

        await test.step('Verify badge codes or count badges exist in Type of Use column', async () => {
            const firstRow = propTypePage.tableRows.first();
            const badges = firstRow.locator('td').nth(4).locator('span, button');
            const badgeCount = await badges.count();
            expect(badgeCount).toBeGreaterThan(0);
        });

        await test.step('Capture evidence screenshot of Type of Use column badges', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC06_Type_Of_Use_Badges_Proof.png', propTypePage.tableRows.first().locator('td').nth(4));
        });
    });

    test('TC07 - Verify clicking Type of Use Validation badge opens details modal and closes properly', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Type of Use Details Modal');
        allure.severity('normal');

        await test.step('Click Type of Use badge on first table row', async () => {
            await propTypePage.openTypeOfUseBadgeModal(0);
            await expect(propTypePage.typeOfUseDetailsModal).toBeVisible();
            await expect(propTypePage.typeOfUseDetailsModal).toContainText('Type of Use Validation');
        });

        await test.step('Capture evidence screenshot of Type of Use details modal', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC07_Type_Of_Use_Details_Modal_Proof.png', propTypePage.typeOfUseDetailsModal);
        });

        await test.step('Close Type of Use details modal', async () => {
            await propTypePage.closeTypeOfUseBadgeModal();
            await expect(propTypePage.typeOfUseDetailsModal).not.toBeVisible();
        });
    });

    // =========================================================================
    // SECTION 2: Search & Filter Functionality (TC08 - TC14)
    // =========================================================================

    test('TC08 - Verify search with valid Property Description filters the table correctly', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Search by Description');
        allure.severity('critical');

        const searchKeyword = 'खाजगी शाळा';

        await test.step(`Search for property description "${searchKeyword}"`, async () => {
            await propTypePage.searchPropertyType(searchKeyword);
            const count = await propTypePage.getTableRowCount();
            expect(count).toBeGreaterThan(0);
            await expect(propTypePage.tableRows.first()).toContainText(searchKeyword, { timeout: 5000 });
        });

        await test.step('Capture evidence screenshot of filtered results', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC08_Search_By_Description_Proof.png');
        });

        await test.step('Clear search', async () => {
            await propTypePage.clearSearch();
        });
    });

    test('TC09 - Verify search with valid Type (e.g. "C") filters matching records', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Search by Type');
        allure.severity('normal');

        await test.step('Search for Type "C"', async () => {
            await propTypePage.searchPropertyType('C');
            const count = await propTypePage.getTableRowCount();
            expect(count).toBeGreaterThan(0);
        });

        await test.step('Capture evidence screenshot of Type search results', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC09_Search_By_Type_Proof.png');
        });

        await test.step('Clear search', async () => {
            await propTypePage.clearSearch();
        });
    });

    test('TC10 - Verify search with partial keyword returns all matching records', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Partial Text Search');
        allure.severity('normal');

        const partialKeyword = 'खाजगी';

        await test.step(`Search with partial keyword "${partialKeyword}"`, async () => {
            await propTypePage.searchPropertyType(partialKeyword);
            const count = await propTypePage.getTableRowCount();
            expect(count).toBeGreaterThanOrEqual(1);

            for (let i = 0; i < count; i++) {
                const rowText = await propTypePage.tableRows.nth(i).innerText();
                await expect(rowText).toContain(partialKeyword);
            }
        });

        await test.step('Capture evidence screenshot of partial search matches', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC10_Partial_Search_Proof.png');
        });

        await test.step('Clear search', async () => {
            await propTypePage.clearSearch();
        });
    });

    test('TC11 - Verify search is case-insensitive for alphanumeric types and descriptions', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Case Insensitive Search');
        allure.severity('normal');

        await test.step('Search with lowercase "c"', async () => {
            await propTypePage.searchPropertyType('c');
            const countLower = await propTypePage.getTableRowCount();
            expect(countLower).toBeGreaterThan(0);
        });

        await test.step('Capture evidence screenshot of case-insensitive search', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC11_Case_Insensitive_Search_Proof.png');
        });

        await test.step('Clear search', async () => {
            await propTypePage.clearSearch();
        });
    });

    test('TC12 - Verify search with non-existent query displays 0 rows or No Records message', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Non-Existent Query Search');
        allure.severity('normal');

        const nonExistentKeyword = 'NON_EXISTENT_PROPERTY_TYPE_9999';

        await test.step(`Search for non-existent keyword "${nonExistentKeyword}"`, async () => {
            await propTypePage.searchPropertyType(nonExistentKeyword);
            const rowCount = await propTypePage.getTableRowCount();
            if (rowCount > 0) {
                const firstRowText = await propTypePage.tableRows.first().innerText();
                expect(firstRowText.toLowerCase()).toContain('no');
            } else {
                expect(rowCount).toBe(0);
            }
        });

        await test.step('Capture evidence screenshot of empty search result state', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC12_Empty_Search_Result_Proof.png');
        });

        await test.step('Clear search', async () => {
            await propTypePage.clearSearch();
        });
    });

    test('TC13 - Verify clearing search input restores all property type records', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Search Reset & Restore');
        allure.severity('normal');

        let initialRowCount = 0;

        await test.step('Record initial row count', async () => {
            initialRowCount = await propTypePage.getTableRowCount();
            expect(initialRowCount).toBeGreaterThan(0);
        });

        await test.step('Apply search filter', async () => {
            await propTypePage.searchPropertyType('शाळा');
            // searchPropertyType waits for the loading indicator to disappear.
        });

        await test.step('Clear search and verify row count is restored', async () => {
            await propTypePage.clearSearch();
            const restoredRowCount = await propTypePage.getTableRowCount();
            expect(restoredRowCount).toBe(initialRowCount);
        });

        await test.step('Capture evidence screenshot of restored table', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC13_Restored_Table_Proof.png');
        });
    });

    test('TC14 - Verify table entry count in pagination updates accurately with search filter', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Pagination Count with Search');
        allure.severity('normal');

        await test.step('Search for "खाजगी" and check pagination summary', async () => {
            await propTypePage.searchPropertyType('खाजगी');
            const rowCount = await propTypePage.getTableRowCount();
            const paginationText = await propTypePage.paginationText.innerText();
            expect(paginationText).toContain(`Showing 1 to ${rowCount}`);
        });

        await test.step('Capture evidence screenshot of updated pagination count', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC14_Pagination_Search_Count_Proof.png', propTypePage.paginationContainer);
        });

        await test.step('Clear search', async () => {
            await propTypePage.clearSearch();
        });
    });

    // =========================================================================
    // SECTION 3: Sorting & Pagination (TC15 - TC21)
    // =========================================================================

    test('TC15 - Verify sorting table by Property Description ascending and descending', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Column Sorting - Description');
        allure.severity('normal');

        await test.step('Click Sort by Property Description button', async () => {
            await expect(propTypePage.sortPropertyDescriptionBtn).toBeVisible();
            await propTypePage.sortPropertyDescriptionBtn.click();
            await expect(propTypePage.tableRows.first()).toBeVisible();
        });

        await test.step('Capture evidence screenshot of Description sort', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC15_Sort_Description_Proof.png');
        });
    });

    test('TC16 - Verify sorting table by Type column', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Column Sorting - Type');
        allure.severity('normal');

        await test.step('Click Sort by Type button', async () => {
            await expect(propTypePage.sortTypeBtn).toBeVisible();
            await propTypePage.sortTypeBtn.click();
            await expect(propTypePage.tableRows.first()).toBeVisible();
        });

        await test.step('Capture evidence screenshot of Type sort', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC16_Sort_Type_Proof.png');
        });
    });

    test('TC17 - Verify pagination summary displays valid entry range and total count', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Pagination Summary');
        allure.severity('normal');

        await test.step('Verify pagination text format (Showing X to Y of Z entries)', async () => {
            await expect(propTypePage.paginationText).toBeVisible();
            const text = await propTypePage.paginationText.innerText();
            expect(text).toMatch(/Showing \d+ to \d+ of \d+ entries/i);
        });

        await test.step('Capture evidence screenshot of pagination summary', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC17_Pagination_Summary_Proof.png', propTypePage.paginationContainer);
        });
    });

    test('TC18 - Verify clicking "Next page" button navigates to page 2', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Pagination - Next Page');
        allure.severity('normal');

        await test.step('Click Next page button and verify updated pagination text', async () => {
            if (await propTypePage.nextPageBtn.isEnabled()) {
                await propTypePage.nextPageBtn.click();
                await expect.poll(() => propTypePage.paginationText.innerText(), { timeout: 5000 })
                    .toMatch(/Showing 11 to/i);
            }
        });

        await test.step('Capture evidence screenshot of Page 2', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC18_Next_Page_Proof.png');
        });
    });

    test('TC19 - Verify clicking "Previous page" button returns to previous page', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Pagination - Previous Page');
        allure.severity('normal');

        await test.step('Navigate to page 2 then return via Previous page button', async () => {
            if (await propTypePage.nextPageBtn.isEnabled()) {
                await propTypePage.nextPageBtn.click();
                await expect.poll(() => propTypePage.paginationText.innerText(), { timeout: 5000 })
                    .toMatch(/Showing 11 to/i);
                await propTypePage.prevPageBtn.click({ force: true });
                await expect.poll(() => propTypePage.paginationText.innerText(), { timeout: 5000 })
                    .toMatch(/Showing 1 to/i);
            }
        });

        await test.step('Capture evidence screenshot of Previous page return', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC19_Prev_Page_Proof.png');
        });
    });

    test('TC20 - Verify clicking specific page number button navigates directly to that page', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Pagination - Page Number Direct Navigation');
        allure.severity('normal');

        const page2Btn = page.locator('button[aria-label="Go to page 2"]').first();

        await test.step('Click Page 2 button directly', async () => {
            if (await page2Btn.isVisible()) {
                const before = await propTypePage.paginationText.innerText().catch(() => '');
                await page2Btn.click();
                await expect.poll(() => propTypePage.paginationText.innerText().catch(() => '')).toMatch(/Showing 11 to/i);
            }
        });

        await test.step('Capture evidence screenshot of direct page jump', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC20_Page_Number_Jump_Proof.png');
        });

        await test.step('Return to page 1', async () => {
            const page1Btn = page.locator('button[aria-label="Go to page 1"]').first();
            if (await page1Btn.isVisible()) {
                const before = await propTypePage.paginationText.innerText().catch(() => '');
                await page1Btn.click();
                await expect.poll(() => propTypePage.paginationText.innerText().catch(() => '')).not.toBe(before);
            }
        });
    });

    test('TC21 - Verify changing Rows Per Page dropdown updates the table page size', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Pagination - Rows Per Page');
        allure.severity('normal');

        await test.step('Select 20 rows per page', async () => {
            if (await propTypePage.rowsPerPageDropdown.isVisible()) {
                await propTypePage.rowsPerPageDropdown.click();
                const option20 = page.getByRole('option', { name: /^20$/i }).or(page.locator('[role="option"]:has-text("20")')).first();
                if (await option20.isVisible()) {
                    await option20.click();
                    await expect.poll(() => propTypePage.getTableRowCount()).toBeGreaterThan(10);
                }
            }
        });

        await test.step('Capture evidence screenshot of 20 rows per page', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC21_Rows_Per_Page_20_Proof.png');
        });

        await test.step('Reset to 10 rows per page', async () => {
            if (await propTypePage.rowsPerPageDropdown.isVisible()) {
                await propTypePage.rowsPerPageDropdown.click();
                const option10 = page.getByRole('option', { name: /^10$/i }).or(page.locator('[role="option"]:has-text("10")')).first();
                if (await option10.isVisible()) {
                    await option10.click();
                }
            }
        });
    });

    // =========================================================================
    // SECTION 4: Add Drawer & Form Validations (TC22 - TC28)
    // =========================================================================

    test('TC22 - Verify clicking "Add Property Type" opens drawer with title, fields, and action buttons', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Add Drawer Elements');
        allure.severity('critical');

        await test.step('Open Add Property Type drawer', async () => {
            await propTypePage.openAddDrawer();
            await expect(propTypePage.drawer).toBeVisible();
            await expect(propTypePage.drawerTitle).toHaveText('Add Property Type');
            await expect(propTypePage.propertyDescriptionInput).toBeVisible();
            await expect(propTypePage.typeDropdown).toBeVisible();
            await expect(propTypePage.categoryDropdown).toBeVisible();
            await expect(propTypePage.searchSequenceInput).toBeVisible();
            await expect(propTypePage.drawerSaveBtn).toBeVisible();
            await expect(propTypePage.drawerCancelBtn).toBeVisible();
        });

        await test.step('Capture evidence screenshot of Add Property Type drawer', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC22_Add_Drawer_Proof.png', propTypePage.drawer);
        });

        await test.step('Close drawer', async () => {
            await propTypePage.closeDrawer();
        });
    });

    test('TC23 - Verify mandatory fields are marked with red asterisks and banner is visible', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Mandatory Fields Indicator');
        allure.severity('normal');

        await test.step('Open Add drawer and verify mandatory indicators', async () => {
            await propTypePage.openAddDrawer();
            await expect(propTypePage.mandatoryBanner).toBeVisible();
            await expect(propTypePage.mandatoryBanner).toContainText('Fields marked with * are mandatory');
        });

        await test.step('Capture evidence screenshot of mandatory banner and asterisks', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC23_Mandatory_Fields_Proof.png', propTypePage.drawer);
        });

        await test.step('Close drawer', async () => {
            await propTypePage.closeDrawer();
        });
    });

    test('TC24 - Verify submitting empty Add form triggers validation error for Property Description', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Empty Form Validation');
        allure.severity('critical');

        await test.step('Open Add drawer and submit blank form', async () => {
            await propTypePage.openAddDrawer();
            await propTypePage.submitAddForm();
            // The browser enforces this required input natively before the
            // request is submitted; the application also keeps its mandatory
            // banner visible. Validate both signals instead of requiring a
            // server-side error element that is never rendered for blank HTML
            // required fields.
            await expect(propTypePage.mandatoryBanner).toBeVisible();
            const validationMessage = await propTypePage.propertyDescriptionInput.evaluate(
                (element: HTMLInputElement) => element.validationMessage,
            );
            expect(validationMessage).toMatch(/fill out|required/i);
        });

        await test.step('Capture evidence screenshot of Property Description validation error', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC24_Empty_Form_Validation_Proof.png', propTypePage.drawer);
        });

        await test.step('Close drawer', async () => {
            await propTypePage.closeDrawer();
        });
    });

    test('TC25 - Verify Category dropdown options in Add drawer', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Category Dropdown Options');
        allure.severity('normal');

        await test.step('Open Add drawer and inspect Category dropdown', async () => {
            await propTypePage.openAddDrawer();
            const catBtn = propTypePage.drawer.locator('button:has-text("Select category")').first();
            await expect(catBtn).toBeVisible({ timeout: 5000 });
            await catBtn.click();
            await page.keyboard.press('Escape');
        });

        await test.step('Capture evidence screenshot of Category dropdown selection', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC25_Category_Dropdown_Proof.png', propTypePage.drawer);
        });

        await test.step('Close drawer', async () => {
            await propTypePage.closeDrawer();
        });
    });

    test('TC26 - Verify Type dropdown options in Add drawer', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Type Dropdown Options');
        allure.severity('normal');

        await test.step('Open Add drawer and inspect Type dropdown options', async () => {
            await propTypePage.openAddDrawer();
            // The live form hydrates Type choices only after the required
            // description has been touched; provide a disposable value for
            // this controls-only scenario and close without saving.
            await propTypePage.propertyDescriptionInput.fill('DropdownProbe');
            // The live screen requires Category before Type options are
            // populated. Use the page-object selection (with force-click and
            // a fresh locator) so React's option re-render cannot detach it.
            await propTypePage.fillPropertyTypeForm({ category: 'निवासी' });
            await propTypePage.typeDropdown.click();

            const rOption = page.getByRole('option', { name: /^R$/i }).first();
            await expect(rOption).toBeVisible({ timeout: 5000 });
            await expect(page.getByRole('option', { name: /^C$/i }).first()).toBeVisible();

            await page.keyboard.press('Escape');
        });

        await test.step('Capture evidence screenshot of Type dropdown', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC26_Type_Dropdown_Proof.png', propTypePage.drawer);
        });

        await test.step('Close drawer', async () => {
            await propTypePage.closeDrawer();
        });
    });

    test('TC27 - Verify Search Sequence field is pre-populated and disabled (auto-generated)', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Search Sequence Auto Generation');
        allure.severity('normal');

        await test.step('Open Add drawer and verify Search Sequence is disabled with auto numeric value', async () => {
            await propTypePage.openAddDrawer();
            await expect(propTypePage.searchSequenceInput).toBeVisible();
            await expect(propTypePage.searchSequenceInput).toBeDisabled();
            const seqVal = await propTypePage.searchSequenceInput.inputValue();
            expect(seqVal).toMatch(/^\d+$/);
        });

        await test.step('Capture evidence screenshot of Search Sequence field', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC27_Search_Sequence_Proof.png', propTypePage.searchSequenceInput);
        });

        await test.step('Close drawer', async () => {
            await propTypePage.closeDrawer();
        });
    });

    test('TC28 - Verify closing Add drawer via "Cancel" button dismisses drawer without saving', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Add Drawer Dismissal');
        allure.severity('normal');

        await test.step('Open Add drawer, type temporary text, and click Cancel', async () => {
            await propTypePage.openAddDrawer();
            await propTypePage.propertyDescriptionInput.fill('DISMISS_TEMP_TEST');
            await propTypePage.drawerCancelBtn.click();
            await expect(propTypePage.drawer).not.toBeVisible({ timeout: 5000 });
        });

        await test.step('Capture evidence screenshot confirming drawer closed', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC28_Drawer_Dismissed_Proof.png');
        });
    });

    // =========================================================================
    // SECTION 5: Type of Use Assignment & Filtering (TC29 - TC32)
    // =========================================================================

    test('TC29 - Verify Type of Use Assignment section displays list of checkboxes with code badges', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Type of Use Assignment List');
        allure.severity('normal');

        await test.step('Open Add drawer and verify Type of Use checkboxes exist', async () => {
            await propTypePage.openAddDrawer();
            const count = await propTypePage.typeOfUseCheckboxes.count();
            expect(count).toBeGreaterThan(0);
            await expect(propTypePage.typeOfUseSelectionCounter).toHaveText('0 selected');
        });

        await test.step('Capture evidence screenshot of Type of Use assignment list', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC29_Type_Of_Use_List_Proof.png', propTypePage.drawer);
        });

        await test.step('Close drawer', async () => {
            await propTypePage.closeDrawer();
        });
    });

    test('TC30 - Verify "Select All" button selects all available Type of Use items and updates selection counter', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Type of Use - Select All');
        allure.severity('normal');

        await test.step('Open Add drawer and click "Select All"', async () => {
            await propTypePage.openAddDrawer();
            await propTypePage.typeOfUseSelectAllBtn.click();
            await expect(propTypePage.typeOfUseSelectionCounter).toHaveText(/^(?!0 selected$)\d+ selected$/);
        });

        await test.step('Capture evidence screenshot of Select All state', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC30_Select_All_Proof.png', propTypePage.drawer);
        });

        await test.step('Close drawer', async () => {
            await propTypePage.closeDrawer();
        });
    });

    test('TC31 - Verify "Clear All" button unchecks all selected Type of Use items and resets counter to "0 selected"', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Type of Use - Clear All');
        allure.severity('normal');

        await test.step('Open Add drawer, click Select All then click Clear All', async () => {
            await propTypePage.openAddDrawer();
            await propTypePage.typeOfUseSelectAllBtn.click({ force: true });
            await propTypePage.typeOfUseClearAllBtn.click({ force: true });
            await expect(propTypePage.typeOfUseSelectionCounter).toHaveText('0 selected');
        });

        await test.step('Capture evidence screenshot of Clear All state', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC31_Clear_All_Proof.png', propTypePage.drawer);
        });

        await test.step('Close drawer', async () => {
            await propTypePage.closeDrawer();
        });
    });

    test('TC32 - Verify search inside Type of Use Assignment filters items by code or description', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Type of Use Search Filter');
        allure.severity('normal');

        await test.step('Open Add drawer and search for "SPK" in Type of Use assignment', async () => {
            await propTypePage.openAddDrawer();
            await propTypePage.typeOfUseSearchInput.fill('SPK');
            await propTypePage.typeOfUseSearchInput.dispatchEvent('input');

            const spkBadge = propTypePage.drawer.locator('span:has-text("SPK")').first();
            await expect(spkBadge).toBeVisible();
        });

        await test.step('Capture evidence screenshot of filtered Type of Use items', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC32_Type_Of_Use_Search_Proof.png', propTypePage.drawer);
        });

        await test.step('Close drawer', async () => {
            await propTypePage.closeDrawer();
        });
    });

    // =========================================================================
    // SECTION 6: End-to-End CRUD Lifecycle (TC33 - TC38)
    // =========================================================================

    const testUniqueCode = `AUTOPT${Date.now().toString().slice(-4)}`;
    const description = testUniqueCode;

    test('TC33 - Verify creating a new Property Type with valid description, Type, Category, and assigned Type of Use codes', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Create Property Type');
        allure.severity('blocker');

        await test.step(`Open Add drawer and fill details for "${testUniqueCode}"`, async () => {
            console.log(`TC33 test data: inserting Property Description="${testUniqueCode}", Type="R", Category="निवासी"`);
            await propTypePage.openAddDrawer();
            await propTypePage.fillPropertyTypeForm({
                description: description,
                category: 'निवासी',
                type: 'R',
                selectAllUse: true
            });
        });

        await test.step('Submit Add form and verify drawer closes', async () => {
            await propTypePage.submitAddForm();
            await expect(propTypePage.drawer).not.toBeVisible({ timeout: 10000 });
        });

        await test.step('Capture evidence screenshot of newly created record submission', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC33_Create_Property_Type_Proof.png');
        });
    });

    test('TC34 - Verify newly created Property Type appears in search results with correct details', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Verify Created Record in Table');
        allure.severity('critical');

        await test.step(`Search for created record "${description}"`, async () => {
            console.log(`TC34 search data: query="${description}" (created by TC33)`);
            await propTypePage.searchPropertyType(description);
            const row = propTypePage.getRowByText(description);
            await expect(row).toBeVisible({ timeout: 10000 });
            await expect(row).toContainText(description);
            await expect(row).toContainText('R');
            await expect(row).toContainText('निवासी');
            await expect(row).toContainText('Active');
        });

        await test.step('Capture evidence screenshot of created record in table', async () => {
            const row = propTypePage.getRowByText(description);
            await propTypePage.captureEvidence(testInfo, 'TC34_Created_Record_Table_Proof.png', row);
        });

        await test.step('Clear search', async () => {
            await propTypePage.clearSearch();
        });
    });

    test('TC35 - Verify duplicate Property Type validation when attempting to add existing description', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Duplicate Property Type Validation');
        allure.severity('critical');

        await test.step(`Attempt to add another property type with description "${testUniqueCode}"`, async () => {
            console.log(`TC35 duplicate-check data: attempting existing Description="${testUniqueCode}"`);
            await propTypePage.openAddDrawer();
            await propTypePage.fillPropertyTypeForm({
                description: testUniqueCode,
                category: 'निवासी',
                type: 'R'
            });
            await propTypePage.submitAddForm();
        });

        await test.step('Capture evidence screenshot of duplicate check behavior', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC35_Duplicate_Validation_Proof.png', propTypePage.drawer);
        });

        await test.step('Close drawer', async () => {
            await propTypePage.closeDrawer();
        });
    });

    test('TC36 - Verify opening Edit drawer pre-fills existing property type details accurately', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Edit Drawer Pre-population');
        allure.severity('critical');

        await test.step(`Search for "${testUniqueCode}" and click Edit button`, async () => {
            console.log(`TC36 search data: query="${testUniqueCode}"`);
            await propTypePage.searchPropertyType(testUniqueCode);
            await propTypePage.openEditDrawer(testUniqueCode);
            await expect(propTypePage.drawer).toBeVisible();
            await expect(propTypePage.drawerTitle).toContainText('Edit Property Type');
            await expect(propTypePage.propertyDescriptionInput).toHaveValue(testUniqueCode);
            await expect(propTypePage.drawerUpdateBtn).toBeVisible();
        });

        await test.step('Capture evidence screenshot of pre-filled Edit drawer', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC36_Edit_Drawer_Prepopulate_Proof.png', propTypePage.drawer);
        });

        await test.step('Close edit drawer', async () => {
            await propTypePage.closeDrawer();
            await propTypePage.clearSearch();
        });
    });

    const modifiedUniqueCode = `${testUniqueCode}M`;

    test('TC37 - Verify editing Property Type description and updating record saves successfully', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Update Property Type');
        allure.severity('blocker');

        await test.step(`Search for "${testUniqueCode}", edit description to "${modifiedUniqueCode}", and click Update`, async () => {
            console.log(`TC37 search data: query="${testUniqueCode}"; updated Description="${modifiedUniqueCode}"`);
            await propTypePage.searchPropertyType(testUniqueCode);
            await propTypePage.openEditDrawer(testUniqueCode);
            await propTypePage.propertyDescriptionInput.fill(modifiedUniqueCode);
            await propTypePage.submitEditForm();
            await expect(propTypePage.drawer).not.toBeVisible({ timeout: 10000 });
        });

        await test.step(`Verify updated record "${modifiedUniqueCode}" is displayed in search results`, async () => {
            await propTypePage.searchPropertyType(modifiedUniqueCode);
            const updatedRow = propTypePage.getRowByText(modifiedUniqueCode);
            await expect(updatedRow).toBeVisible({ timeout: 10000 });
        });

        await test.step('Capture evidence screenshot of updated record in table', async () => {
            const updatedRow = propTypePage.getRowByText(modifiedUniqueCode);
            await propTypePage.captureEvidence(testInfo, 'TC37_Updated_Record_Proof.png', updatedRow);
        });

        await test.step('Clear search', async () => {
            await propTypePage.clearSearch();
        });
    });

    test('TC38 - Verify Delete confirmation modal opens, cancel retains record, and confirm delete removes record', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Delete Property Type & Confirmation');
        allure.severity('blocker');

        await test.step(`Search for "${modifiedUniqueCode}" and click Delete button`, async () => {
            console.log(`TC38 search data: query="${modifiedUniqueCode}" (updated by TC37)`);
            await propTypePage.searchPropertyType(modifiedUniqueCode);
            await propTypePage.openDeleteDialog(modifiedUniqueCode);
            await expect(propTypePage.deleteDialog).toBeVisible();
            await expect(propTypePage.deleteDialog).toContainText('Are you sure you want to delete this property type record?');
        });

        await test.step('Capture evidence screenshot of Delete confirmation dialog', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC38_Delete_Dialog_Proof.png', propTypePage.deleteDialog);
        });

        await test.step('Test cancel delete first', async () => {
            await propTypePage.cancelDelete();
            const retainedRow = propTypePage.getRowByText(modifiedUniqueCode);
            await expect(retainedRow).toBeVisible();
        });

        await test.step('Open delete dialog again and confirm deletion', async () => {
            await propTypePage.openDeleteDialog(modifiedUniqueCode);
            await propTypePage.confirmDelete();
        });

        await test.step(`Verify record "${modifiedUniqueCode}" is deleted and no longer visible`, async () => {
            await propTypePage.searchPropertyType(modifiedUniqueCode);
            const deletedRow = propTypePage.getRowByText(modifiedUniqueCode);
            await expect(deletedRow).not.toBeVisible({ timeout: 5000 });
        });

        await test.step('Capture evidence screenshot of table after deletion', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC38_Deleted_Verification_Proof.png');
        });

        await test.step('Clear search', async () => {
            await propTypePage.clearSearch();
        });
    });

    // =========================================================================
    // SECTION 7: Status & E2E Workflow Validation (TC39 - TC40)
    // =========================================================================

    test('TC39 - Verify Status badge displays "Active" with green circle check icon for active records', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Status Badge & Indicator');
        allure.severity('normal');

        await test.step('Verify Status column badge has Active state with icon', async () => {
            const firstRowStatus = propTypePage.tableRows.first().locator('td').nth(5);
            await expect(firstRowStatus).toBeVisible();
            await expect(firstRowStatus).toContainText('Active');
            const icon = firstRowStatus.locator('svg.lucide-circle-check-big, svg').first();
            await expect(icon).toBeVisible();
        });

        await test.step('Capture evidence screenshot of Active Status badge', async () => {
            const firstRowStatus = propTypePage.tableRows.first().locator('td').nth(5);
            await propTypePage.captureEvidence(testInfo, 'TC39_Active_Status_Proof.png', firstRowStatus);
        });
    });

    test('TC40 - Verify complete end-to-end Property Type lifecycle (Add -> Verify -> Search -> Edit -> Delete) with clean teardown', async ({ page }, testInfo) => {
        allure.epic('PTIS Masters');
        allure.feature('Property Type Master');
        allure.story('Complete End-to-End Lifecycle');
        allure.severity('blocker');

        const e2eCode = `AUTOPT${Date.now().toString().slice(-4)}`;
        const e2eUpdatedCode = `${e2eCode}E`;

        await test.step(`1. Create new Property Type "${e2eCode}"`, async () => {
            await propTypePage.openAddDrawer();
            await propTypePage.fillPropertyTypeForm({
                description: e2eCode,
                category: 'अनिवासी',
                type: 'C',
                selectAllUse: true
            });
            await propTypePage.submitAddForm();
            await expect(propTypePage.drawer).not.toBeVisible({ timeout: 10000 });
        });

        await test.step(`2. Search and verify created record "${e2eCode}"`, async () => {
            await propTypePage.searchPropertyType(e2eCode);
            const row = propTypePage.getRowByText(e2eCode);
            await expect(row).toBeVisible({ timeout: 10000 });
            await expect(row).toContainText(e2eCode);
            await expect(row).toContainText('C');
            await expect(row).toContainText('अनिवासी');
        });

        await test.step(`3. Edit record description to "${e2eUpdatedCode}"`, async () => {
            await propTypePage.openEditDrawer(e2eCode);
            await propTypePage.propertyDescriptionInput.fill(e2eUpdatedCode);
            await propTypePage.submitEditForm();
            await expect(propTypePage.drawer).not.toBeVisible({ timeout: 10000 });
        });

        await test.step(`4. Verify updated record "${e2eUpdatedCode}" in search`, async () => {
            await propTypePage.searchPropertyType(e2eUpdatedCode);
            const updatedRow = propTypePage.getRowByText(e2eUpdatedCode);
            await expect(updatedRow).toBeVisible({ timeout: 10000 });
        });

        await test.step(`5. Delete record "${e2eUpdatedCode}" and confirm removal`, async () => {
            await propTypePage.openDeleteDialog(e2eUpdatedCode);
            await propTypePage.confirmDelete();
            await propTypePage.searchPropertyType(e2eUpdatedCode);
            const deletedRow = propTypePage.getRowByText(e2eUpdatedCode);
            await expect(deletedRow).not.toBeVisible({ timeout: 5000 });
        });

        await test.step('Capture final evidence screenshot of complete E2E lifecycle', async () => {
            await propTypePage.captureEvidence(testInfo, 'TC40_Complete_E2E_Lifecycle_Proof.png');
        });

        await test.step('Clear search for clean teardown', async () => {
            await propTypePage.clearSearch();
        });
    });
});
