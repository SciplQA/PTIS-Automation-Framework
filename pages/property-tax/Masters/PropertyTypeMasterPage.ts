import { expect, type Locator, type Page, type TestInfo } from '@playwright/test';

/**
 * Page Object Model for PTIS Property Type Master Screen
 * URL: /en/property-tax/propertytype
 */
class PtisPropertyTypeMasterPage {
    page: Page;
    pageHeading: Locator;
    pageSubtitle: Locator;
    addPropertyTypeBtn: Locator;
    searchInput: Locator;
    table: Locator;
    tableHeader: Locator;
    tableBody: Locator;
    tableRows: Locator;
    sortPropertyDescriptionBtn: Locator;
    sortTypeBtn: Locator;
    paginationContainer: Locator;
    paginationText: Locator;
    rowsPerPageDropdown: Locator;
    prevPageBtn: Locator;
    nextPageBtn: Locator;
    firstPageBtn: Locator;
    lastPageBtn: Locator;
    drawer: Locator;
    drawerTitle: Locator;
    drawerCloseBtn: Locator;
    propertyDescriptionInput: Locator;
    typeDropdown: Locator;
    categoryDropdown: Locator;
    searchSequenceInput: Locator;
    statusToggleBtn: Locator;
    typeOfUseSearchInput: Locator;
    typeOfUseSelectAllBtn: Locator;
    typeOfUseClearAllBtn: Locator;
    typeOfUseSelectionCounter: Locator;
    typeOfUseCheckboxes: Locator;
    drawerSaveBtn: Locator;
    drawerUpdateBtn: Locator;
    drawerCancelBtn: Locator;
    mandatoryBanner: Locator;
    descriptionError: Locator;
    deleteDialog: Locator;
    deleteConfirmBtn: Locator;
    deleteCancelBtn: Locator;
    typeOfUseDetailsModal: Locator;
    typeOfUseDetailsCloseBtn: Locator;
    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page: Page) {
        this.page = page;

        // Page Header & Controls
        this.pageHeading = page.getByRole('heading', { name: 'Property Type Master' });
        this.pageSubtitle = page.locator('p:has-text("Manage property types and their classifications")').or(
            page.getByText('Manage property types and their classifications')
        );
        this.addPropertyTypeBtn = page.getByRole('button', { name: /Add Property Type/i }).or(
            page.locator('button:has-text("Add Property Type")')
        );
        this.searchInput = page.locator('input[placeholder*="Search by Property Description"]').or(
            page.getByPlaceholder(/Search by Property Description or Type/i)
        );

        // Table & Elements
        this.table = page.locator('table');
        this.tableHeader = page.locator('table thead');
        this.tableBody = page.locator('table tbody');
        this.tableRows = page.locator('table tbody tr');

        // Column Sort Buttons
        this.sortPropertyDescriptionBtn = page.locator('button[aria-label="Sort by Property Description"]');
        this.sortTypeBtn = page.locator('button[aria-label="Sort by Type"]');

        // Pagination Controls
        this.paginationContainer = page.locator('div:has-text("Showing")').last();
        this.paginationText = page.locator('p:has-text("Showing"), span:has-text("Showing"), div:has-text("Showing")').filter({ hasText: /Showing \d+ to \d+ of \d+ entries/i }).first();
        this.rowsPerPageDropdown = page.locator('button[aria-label="Rows per page"]').or(
            page.getByRole('combobox', { name: /Rows per page/i })
        );
        this.prevPageBtn = page.locator('button[aria-label="Go to previous page"]').first();
        this.nextPageBtn = page.locator('button[aria-label="Go to next page"]').first();
        this.firstPageBtn = page.locator('button[aria-label="Go to first page"]').first();
        this.lastPageBtn = page.locator('button[aria-label="Go to last page"]').first();

        // Drawer / Modal (Add & Edit)
        this.drawer = page.locator('[role="dialog"], [aria-modal="true"]').first();
        this.drawerTitle = this.drawer.locator('.text-lg.font-bold, h2, h3, [class*="title"]').first();
        this.drawerCloseBtn = this.drawer.locator('button:has(svg.lucide-x), button[aria-label="Close"]').first();
        this.propertyDescriptionInput = this.drawer.locator('input[name="propertyDescription"]').or(
            this.drawer.locator('input#input-_r_2_, input[placeholder*="Private School"]').first()
        );
        this.typeDropdown = this.drawer.locator('button[role="combobox"]').first();
        this.categoryDropdown = this.drawer.locator('button[role="combobox"]').nth(1);
        this.searchSequenceInput = this.drawer.locator('input[name="searchSequence"]').or(
            this.drawer.locator('input[maxlength="3"], input[inputmode="numeric"]').first()
        );
        this.statusToggleBtn = this.drawer.locator('button[aria-label="Active"], button[aria-label="Inactive"]').or(
            this.drawer.getByRole('button', { name: /Active|Inactive/i })
        );

        // Type of Use Assignment in Drawer
        this.typeOfUseSearchInput = this.drawer.locator('input[placeholder*="Search by code or description"]').first();
        this.typeOfUseSelectAllBtn = this.drawer.getByRole('button', { name: /Select All/i }).first();
        this.typeOfUseClearAllBtn = this.drawer.getByRole('button', { name: /Clear All/i }).first();
        this.typeOfUseSelectionCounter = this.drawer.locator('span:has-text("selected")').first();
        this.typeOfUseCheckboxes = this.drawer.locator('button[role="checkbox"], input[type="checkbox"]');

        // Drawer Action Buttons
        this.drawerSaveBtn = this.drawer.getByRole('button', { name: /^Save$/i }).or(
            this.drawer.locator('button[type="submit"]:has-text("Save")')
        );
        this.drawerUpdateBtn = this.drawer.getByRole('button', { name: /^Update$/i }).or(
            this.drawer.locator('button[type="submit"]:has-text("Update")')
        );
        this.drawerCancelBtn = this.drawer.getByRole('button', { name: /^Cancel$/i }).first();

        // Validation Elements
        this.mandatoryBanner = this.drawer.locator('div:has-text("Fields marked with * are mandatory")').first();
        this.descriptionError = this.drawer.locator('p:has-text("Property description is required"), span:has-text("Property description is required")').first();

        // Delete Dialog Controls
        this.deleteDialog = page.locator('[role="dialog"], [aria-modal="true"]').first();
        this.deleteConfirmBtn = this.deleteDialog.getByRole('button', { name: /^Delete$/i }).first();
        this.deleteCancelBtn = this.deleteDialog.getByRole('button', { name: /Cancel|No/i }).first();

        // Type of Use Details Modal (from Table Row badge)
        this.typeOfUseDetailsModal = page.locator('[role="dialog"], [aria-modal="true"]').first();
        this.typeOfUseDetailsCloseBtn = this.typeOfUseDetailsModal.getByRole('button', { name: /Close/i }).first();
    }

    /**
     * Navigate to Property Type Master screen
     */
    async navigateToPropertyTypeMaster() {
        if (this.page.url().includes('/en/property-tax/propertytype') && await this.pageHeading.isVisible().catch(() => false)) {
            // This page object is reused by the worker-scoped session. A
            // previous pagination test may have left the table on page 2 or
            // later, so every test must start from the deterministic first
            // page even when navigation is not required.
            await this.resetToFirstPage();
            return;
        }
        await this.page.goto('/en/property-tax/propertytype', { waitUntil: 'domcontentloaded' });
        await this.page.waitForLoadState('networkidle').catch(() => {});
        await expect(this.pageHeading).toBeVisible({ timeout: 20000 });
        await expect(this.table).toBeVisible({ timeout: 20000 });
        await this.resetToFirstPage();
    }

    /** Return the table to page one using the rendered pagination controls. */
    async resetToFirstPage(): Promise<void> {
        const first = this.firstPageBtn.first();
        await first.waitFor({ state: 'visible', timeout: 5000 }).catch(() => undefined);
        if (await first.isEnabled().catch(() => false)) {
            const before = await this.paginationText.innerText().catch(() => '');
            await first.click({ force: true });
            await expect.poll(() => this.paginationText.innerText().catch(() => ''), { timeout: 5000 })
                .not.toBe(before).catch(() => undefined);
            return;
        }

        const previous = this.prevPageBtn.first();
        for (let attempt = 0; attempt < 50 && await previous.isEnabled().catch(() => false); attempt += 1) {
            const before = await this.paginationText.innerText().catch(() => '');
            await previous.click({ force: true });
            await expect.poll(() => this.paginationText.innerText().catch(() => ''), { timeout: 5000 })
                .not.toBe(before).catch(() => undefined);
        }
    }

    /**
     * Verify Header and Subtitle
     */
    async verifyPageHeaders() {
        await expect(this.pageHeading).toBeVisible();
        await expect(this.pageSubtitle).toBeVisible();
        await expect(this.addPropertyTypeBtn).toBeVisible();
        await expect(this.searchInput).toBeVisible();
    }

    /**
     * Verify table column headers
     */
    async getColumnHeaders() {
        const headers = await this.tableHeader.locator('th').allInnerTexts();
        return headers.map(h => h.trim());
    }

    /**
     * Get number of table rows currently visible
     */
    async getTableRowCount() {
        return await this.tableRows.count();
    }

    /**
     * Get table row matching specific text
     */
    getRowByText(text: string): Locator {
        return this.tableRows.filter({ hasText: text }).first();
    }

    /**
     * Perform Search
     */
    async searchPropertyType(keyword: string): Promise<void> {
        await this.searchInput.fill(keyword);
        await this.searchInput.dispatchEvent('input');
        await this.searchInput.dispatchEvent('change');
        await this.page.waitForTimeout(1000);
        await this.table.locator('text=Loading...').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
    }

    /**
     * Clear Search
     */
    async clearSearch() {
        await this.searchInput.fill('');
        await this.searchInput.dispatchEvent('input');
        await this.searchInput.dispatchEvent('change');
        await this.page.waitForTimeout(1000);
        await this.table.locator('text=Loading...').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {});
    }

    /**
     * Open Add Property Type Drawer
     */
    async openAddDrawer() {
        await this.addPropertyTypeBtn.click();
        await expect(this.drawer).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(300);
    }

    /**
     * Close Drawer
     */
    async closeDrawer() {
        if (await this.drawerCloseBtn.isVisible()) {
            await this.drawerCloseBtn.click();
        } else if (await this.drawerCancelBtn.isVisible()) {
            await this.drawerCancelBtn.click();
        }
        await expect(this.drawer).not.toBeVisible({ timeout: 5000 });
    }

    /**
     * Fill Property Type Form (Add or Edit)
     */
    async fillPropertyTypeForm({ description, type, category, selectAllUse = false }: { description?: string; type?: string; category?: string; selectAllUse?: boolean }): Promise<void> {
        if (description !== undefined) {
            await this.propertyDescriptionInput.fill(description);
        }

        if (category) {
            await this.categoryDropdown.click();
            await this.page.waitForTimeout(200);
            const catOption = this.page.getByRole('option', { name: new RegExp(category, 'i') }).first();
            await catOption.click();
            await this.page.waitForTimeout(200);
        }

        if (type) {
            await this.typeDropdown.click();
            await this.page.waitForTimeout(200);
            const typeOption = this.page.getByRole('option', { name: new RegExp(`^${type}$`, 'i') }).first();
            await typeOption.click();
            await this.page.waitForTimeout(200);
        }

        if (selectAllUse) {
            if (await this.typeOfUseSelectAllBtn.isVisible()) {
                await this.typeOfUseSelectAllBtn.click();
                await this.page.waitForTimeout(200);
            }
        }
    }

    /**
     * Submit Add Form (Click Save)
     */
    async submitAddForm() {
        await this.drawerSaveBtn.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Submit Edit Form (Click Update)
     */
    async submitEditForm() {
        await this.drawerUpdateBtn.click();
        await expect(this.drawer).not.toBeVisible({ timeout: 15000 }).catch(async () => {
            if (await this.drawerUpdateBtn.isVisible().catch(() => false)) {
                await this.drawerUpdateBtn.click().catch(() => {});
            }
            await expect(this.drawer).not.toBeVisible({ timeout: 10000 });
        });
        await this.page.waitForTimeout(500);
    }

    /**
     * Open Edit Drawer for a specific record
     */
    async openEditDrawer(recordText: string): Promise<void> {
        const row = this.getRowByText(recordText);
        await expect(row).toBeVisible({ timeout: 10000 });
        const editBtn = row.locator('button[aria-label="Edit"], button:has(.lucide-pencil)').first();
        await editBtn.click();
        await expect(this.drawer).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(300);
    }

    /**
     * Open Delete Dialog for a specific record
     */
    async openDeleteDialog(recordText: string): Promise<void> {
        const row = this.getRowByText(recordText);
        await expect(row).toBeVisible({ timeout: 10000 });
        const deleteBtn = row.locator('button[aria-label="Delete"], button:has(.lucide-trash-2)').first();
        await deleteBtn.click();
        await expect(this.deleteDialog).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(300);
    }

    /**
     * Confirm Delete
     */
    async confirmDelete() {
        await this.deleteConfirmBtn.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Cancel Delete
     */
    async cancelDelete() {
        await this.deleteCancelBtn.click();
        await expect(this.deleteDialog).not.toBeVisible({ timeout: 5000 });
    }

    /**
     * Open Type of Use details badge popup on a table row
     */
    async openTypeOfUseBadgeModal(rowIndex: number = 0): Promise<void> {
        const badge = this.tableRows.nth(rowIndex).locator('[title*="Click to view details"], span[title*="Click to view details"], button[title*="Click to view details"]').first();
        await badge.click();
        await expect(this.typeOfUseDetailsModal).toBeVisible({ timeout: 5000 });
        await this.page.waitForTimeout(300);
    }

    /**
     * Close Type of Use details badge modal
     */
    async closeTypeOfUseBadgeModal() {
        await this.typeOfUseDetailsCloseBtn.click();
        await expect(this.typeOfUseDetailsModal).not.toBeVisible({ timeout: 5000 });
    }

    /**
     * Capture evidence screenshot and attach to testInfo
     */
    async captureEvidence(testInfo: TestInfo, screenshotName: string, targetLocator: Locator | null = null): Promise<void> {
        await this.page.waitForTimeout(200);
        const screenshotBuffer = targetLocator
            ? await targetLocator.screenshot()
            : await this.page.screenshot({ fullPage: false });

        await testInfo.attach(screenshotName, {
            body: screenshotBuffer,
            contentType: 'image/png'
        });
    }
}

export { PtisPropertyTypeMasterPage };
export { PtisPropertyTypeMasterPage as PropertyTypeMasterPage };
