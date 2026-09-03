import { expect, Locator, Page } from '@playwright/test';
import { PropertyTaxBasePage } from '../PropertyTaxBasePage';

export class TaxZonePage extends PropertyTaxBasePage {
    readonly searchInput: Locator;
    readonly addZoneButton: Locator;
    readonly zoneNoInput: Locator;
    readonly zoneTypeInput: Locator;
    readonly remarkInput: Locator;
    readonly saveButton: Locator;
    readonly editButton: Locator;
    readonly activeButton: Locator;
    readonly updateButton: Locator;
    readonly cancelButton: Locator;
    readonly deleteButton: Locator;
    readonly deleteConfirmButton: Locator;

    constructor(page: Page) {
        super(page);

        

        // ==========================================
        // SEARCH TAX ZONE SCREEN
        // ==========================================

        this.searchInput = page.getByPlaceholder(
            'Search by Zone No, Zone Type, Remark...'
        );

        // Add Zone button
        this.addZoneButton = page.getByRole('button', {
            name: /Add Zone/i
        });


        // ==========================================
        // TAX ZONE FORM
        // ==========================================

        // Zone No
        this.zoneNoInput = page.locator(
            'input[name="taxZoneNo"]'
        );

        // Zone Type
        this.zoneTypeInput = page.locator(
            'input[name="taxZoneType"]'
        );

        // Remark
        this.remarkInput = page.locator(
            'input[name="remark"]'
        );


        // ==========================================
        // BUTTONS
        // ==========================================

        // Save button
        this.saveButton = page.getByRole('button', {
            name: /Save/i
        });

        // Edit button
        this.editButton = page.locator(
            'button[aria-label="Edit"]'
        ).first();

        // Active / Deactive switch
        this.activeButton = page.getByRole('switch', {
            name: 'Active'
        });

        // Update button
        this.updateButton = page.getByRole('button', {
            name: 'Update'
        });


        // Cancel button
this.cancelButton = page.getByRole('button', {
    name: /Cancel/i
});



// ==========================================
// DELETE TAX ZONE
// ==========================================

this.deleteButton = page.getByLabel('Delete').first();

this.deleteConfirmButton = page.getByRole('dialog').getByRole('button', {
    name: 'Delete',
    exact: true
});


    }

    async navigateFromPropertyTaxModule(): Promise<void> {
        await this.selectMasterSubmenu('Tax Zone');
    }

    async expectLoaded(): Promise<void> {
        await expect(this.searchInput).toBeVisible({ timeout: 15000 });
        await expect(this.addZoneButton).toBeVisible({ timeout: 15000 });
    }

    private waitForTableRefresh() {
        return this.page.waitForResponse(
            response =>
                response.url().includes('/taxzone-master/taxzone') &&
                response.url().includes('_rsc='),
            { timeout: 1500 }
        ).catch(() => null);
    }


    // ==========================================
    // SEARCH
    // ==========================================

    async searchTaxZone(searchText: string) {

        await this.searchInput.waitFor({
            state: 'visible'
        });

        for (let attempt = 0; attempt < 3; attempt++) {
            const tableRefresh = this.waitForTableRefresh();
            await this.searchInput.fill(searchText);
            await tableRefresh;

            if (await this.searchInput.inputValue() === searchText) {
                break;
            }
        }

        await expect(this.searchInput).toHaveValue(searchText);

        console.log(
            'Search value:',
            await this.searchInput.inputValue()
        );
    }


    async clearSearch() {

        await this.searchInput.waitFor({
            state: 'visible'
        });

        for (let attempt = 0; attempt < 3; attempt++) {
            const tableRefresh = this.waitForTableRefresh();
            await this.searchInput.fill('');
            await tableRefresh;

            if (await this.searchInput.inputValue() === '') {
                break;
            }
        }

        await expect(this.searchInput).toHaveValue('');
    }


    // ==========================================
    // ADD ZONE
    // ==========================================

    async clickAddZone() {

        await this.addZoneButton.waitFor({
            state: 'visible'
        });

        await this.addZoneButton.click();
        await expect(this.zoneNoInput).toBeVisible();
    }


    // ==========================================
    // ZONE NO
    // ==========================================

    async enterZoneNo(zoneNo: string) {

        await this.zoneNoInput.waitFor({
            state: 'visible'
        });

        await this.zoneNoInput.scrollIntoViewIfNeeded();

        await this.zoneNoInput.fill(zoneNo);

        console.log(
            'Zone No entered:',
            await this.zoneNoInput.inputValue()
        );
    }


    // ==========================================
    // ZONE TYPE
    // ==========================================

    async enterZoneType(zoneType: string) {

        await this.zoneTypeInput.waitFor({
            state: 'visible'
        });

        await this.zoneTypeInput.scrollIntoViewIfNeeded();

        await this.zoneTypeInput.click();

        await this.zoneTypeInput.fill(zoneType);

        console.log(
            'Zone Type entered:',
            await this.zoneTypeInput.inputValue()
        );
    }


    // ==========================================
    // REMARK
    // ==========================================

    async enterRemark(remark: string) {

        await this.remarkInput.waitFor({
            state: 'visible'
        });

        await this.remarkInput.scrollIntoViewIfNeeded();

        await this.remarkInput.click();

        await this.remarkInput.fill(remark);

        console.log(
            'Remark entered:',
            await this.remarkInput.inputValue()
        );
    }


    // ==========================================
    // SAVE
    // ==========================================

    async clickSave() {

        await this.saveButton.waitFor({
            state: 'visible'
        });

        await this.saveButton.click();
        await expect(this.zoneNoInput).toBeHidden();

        console.log(
            'Tax Zone saved successfully'
        );
    }


    // ==========================================
    // EDIT ZONE
    // ==========================================

    async clickEdit(zoneNo?: string) {

        const editButton = zoneNo
            ? this.page.getByRole('row')
                .filter({ hasText: zoneNo })
                .locator('button[aria-label="Edit"]')
            : this.editButton;

        // Keep this as one auto-waiting action so a table re-render cannot
        // detach the element between a separate wait/scroll and the click.
        await editButton.click({ timeout: 15000 });
        await expect(this.zoneTypeInput).toBeVisible();

        console.log(
            'Edit drawer opened'
        );
    }


    // ==========================================
    // EDIT ZONE TYPE
    // ==========================================

    async editZoneType(zoneType: string) {

        await this.zoneTypeInput.waitFor({
            state: 'visible'
        });

        await this.zoneTypeInput.scrollIntoViewIfNeeded();

        await this.zoneTypeInput.click();

        await this.zoneTypeInput.press('Control+A');

        await this.zoneTypeInput.fill(zoneType);

        console.log(
            'Zone Type updated to:',
            await this.zoneTypeInput.inputValue()
        );
    }


    // ==========================================
    // ACTIVE / DEACTIVE
    // ==========================================

    async toggleActive() {

        await this.activeButton.waitFor({
            state: 'visible'
        });

        await this.activeButton.click();

        console.log(
            'Active status:',
            await this.activeButton.getAttribute(
                'aria-checked'
            )
        );
    }

        // ==========================================
    // PAGINATION - PAGE 1  page 1 got hitted and the ordered pagination happens from here 
    // ==========================================

    async clickPage1() {
        // A text locator for "1" also matches page 10. Use the exact
        // accessible pagination name so strict mode selects one button.
        const page1Button = this.page
            .getByRole('button', { name: 'Go to page 1', exact: true })
            .first();

        await page1Button.waitFor({
            state: 'visible',
            timeout: 10000
        });

        await page1Button.scrollIntoViewIfNeeded();

        await page1Button.click();

        console.log(
            'Page 1 opened'
        );
    }


    // ==========================================
    // PAGINATION - PAGE 2
    // ==========================================

    async clickPage2() {
        const page2Button = this.page
            .getByRole('button', { name: 'Go to page 2', exact: true })
            .first();

        await page2Button.waitFor({
            state: 'visible',
            timeout: 10000
        });

        await page2Button.scrollIntoViewIfNeeded();

        await page2Button.click();

        console.log(
            'Page 2 opened'
        );
    }


    // ==========================================
    // PAGINATION - PAGE 3  in this process the pagination is got performed 
    // ==========================================

    async clickPage3() {

        const page3Button = this.page.locator(
            'button:has(span:text("3"))'
        );

        await page3Button.waitFor({
            state: 'visible',
            timeout: 10000
        });

        await page3Button.scrollIntoViewIfNeeded();

        await page3Button.click();

        console.log(
            'Page 3 opened'
        );
    }




    // ==========================================
    // UPDATE
    // ==========================================

    async clickUpdate() {

        await this.updateButton.waitFor({
            state: 'visible'
        });

        await this.updateButton.click();
        await expect(this.zoneTypeInput).toBeHidden();

        console.log(
            'Tax Zone updated successfully'
        );
    }


    // ==========================================
    // ROWS PER PAGE
    // ==========================================

    async selectRowsPerPage(value: string) {

        const rowsPerPageDropdown =
            this.page.getByRole('combobox', {
                name: 'Rows per page'
            });

        await rowsPerPageDropdown.waitFor({
            state: 'visible',
            timeout: 10000
        });

        await rowsPerPageDropdown.scrollIntoViewIfNeeded();

        await rowsPerPageDropdown.click();

        await rowsPerPageDropdown.selectOption(value);

        console.log(
            `Rows per page selected: ${value}`
        );
    }

    // ==========================================
    // CLOSE ADD ZONE SCREEN
    // ==========================================

    async clickCloseAddZone() {

        const closeButton = this.page.locator(
            'button:has(svg.lucide-x)'
        ).last();

        await closeButton.waitFor({
            state: 'visible',
            timeout: 10000
        });

        await closeButton.scrollIntoViewIfNeeded();

        await closeButton.click();
        await expect(this.zoneNoInput).toBeHidden();

        console.log(
            'Add Zone screen closed'
        );
    }



// ==========================================
// CANCEL EDIT DRAWER
// ==========================================

async clickCancel() {

    await this.cancelButton.waitFor({
        state: 'visible',
        timeout: 10000
    });

    await this.cancelButton.scrollIntoViewIfNeeded();

    await this.cancelButton.click();
    await expect(this.zoneTypeInput).toBeHidden();

    console.log(
        'Cancel button clicked'
    );
}



// ==========================================
// DELETE TAX ZONE
// ==========================================

async clickDelete() {

    await this.deleteButton.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await this.deleteButton.scrollIntoViewIfNeeded();

    await this.deleteButton.click();
    await expect(this.deleteConfirmButton).toBeVisible();

    console.log(
        'Delete button clicked'
    );
}


async confirmDelete() {

    await this.deleteConfirmButton.waitFor({
        state: 'visible',
        timeout: 10000
    });

    await this.deleteConfirmButton.click();
    await expect(this.deleteConfirmButton).toBeHidden();

    console.log(
        'Tax Zone deletion confirmed'
    );
}







}
