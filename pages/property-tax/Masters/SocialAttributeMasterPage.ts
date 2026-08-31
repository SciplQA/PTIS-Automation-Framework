import { expect, Locator, Page } from '@playwright/test';
import { PropertyTaxBasePage } from '../PropertyTaxBasePage';

export class SocialAttributeMasterPage extends PropertyTaxBasePage {
    readonly addSocialAttributeButton: Locator;
    readonly socialAttributeCodeInput: Locator;
    readonly socialAttributeNameInput: Locator;
    readonly dataTypeDropdown: Locator;
    readonly unitDropdown: Locator;
    readonly saveButton: Locator;
    readonly searchInput: Locator;
    readonly editButton: Locator;
    readonly activeSwitch: Locator;
    readonly updateButton: Locator;
    readonly unitCombobox: Locator;
    readonly adminButton: Locator;
    readonly languageButton: Locator;
    readonly dataTypeFilter: Locator;
    readonly attributeFilter: Locator;

    constructor(page: Page) {
        super(page);

        

        // ==========================================
        // ADD SOCIAL ATTRIBUTE BUTTON
        // ==========================================

        this.addSocialAttributeButton =
            page.getByText('Add Social Attribute', {
                exact: true
            });


        // ==========================================
        // ADD FORM INPUTS
        // ==========================================

        this.socialAttributeCodeInput =
            page.locator('input[name="socialAttributeCode"]');

        this.socialAttributeNameInput =
            page.locator('input[name="socialAttributeName"]');


        // ==========================================
        // DATA TYPE
        // ==========================================

        this.dataTypeDropdown =
            page.getByText('Select Data Type', {
                exact: true
            });


        // ==========================================
        // UNIT
        // ==========================================

        this.unitDropdown =
            page.getByText('Select Unit', {
                exact: true
            });


        // ==========================================
        // SAVE
        // ==========================================

        this.saveButton =
            page.getByText('Save', {
                exact: true
            });


        // ==========================================
        // SEARCH
        // ==========================================

        this.searchInput =
            page.getByPlaceholder(
                'Search by code or name'
            );


// ==========================================
// EDIT
// ==========================================

this.editButton =
    page.getByRole('button', {
        name: 'Edit'
    }).first();


// ==========================================
// ACTIVE SWITCH
// ==========================================

this.activeSwitch =
    page.getByRole('switch', {
        name: 'Active'
    }).last();


// ==========================================
// UPDATE
// ==========================================

this.updateButton =
    page.getByRole('button', {
        name: 'Update'
    }).last();


// ==========================================
// UNIT DROPDOWN
// ==========================================

this.unitCombobox =
    page.getByRole('combobox', {
        name: 'Unit'
    });


// ==========================================
// ADMIN MENU
// ==========================================

this.adminButton =
    page.getByRole('button', {
        name: 'Admin scipl pvt A'
    });


// ==========================================
// LANGUAGE
// ==========================================

this.languageButton =
    page.getByRole('button', {
        name: /Language/
    });


// ==========================================
// DATA TYPE FILTER
// ==========================================

this.dataTypeFilter =
    page.getByRole('combobox', {
        name: 'All Data Types'
    });


// ==========================================
// ATTRIBUTE FILTER
// ==========================================

this.attributeFilter =
    page.getByRole('combobox', {
        name: /Attribute Type|All Attributes/i
    });


    }

    async navigateFromPropertyTaxModule(): Promise<void> {
        await this.selectMasterSubmenu('Social Attribute Master');
    }

    async expectLoaded(): Promise<void> {
        await expect(this.addSocialAttributeButton).toBeVisible({ timeout: 15000 });
        await expect(this.searchInput).toBeVisible({ timeout: 15000 });
    }


    // =====================================================
    // VERIFY ADD BUTTON
    // =====================================================

    async verifyAddSocialAttributeButton() {

        await this.addSocialAttributeButton.waitFor({
            state: 'visible',
            timeout: 15000
        });

        console.log(
            'Add Social Attribute button is visible'
        );
    }


    // =====================================================
    // OPEN ADD SOCIAL ATTRIBUTE FORM
    // =====================================================

    async clickAddSocialAttribute() {

        await this.addSocialAttributeButton.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.addSocialAttributeButton.click();

        //await this.page.waitForTimeout(1000);

        console.log(
            'Add Social Attribute form opened'
        );
    }


    // =====================================================
    // ENTER SOCIAL ATTRIBUTE CODE
    // =====================================================
async enterSocialAttributeCode(code: string) {

    // Find the Add Social Attribute form
    const form = this.page.locator('form').filter({
        has: this.page.locator('input[name="socialAttributeCode"]')
    }).last();

    const input = form.locator(
        'input[name="socialAttributeCode"]'
    );

    await input.waitFor({
        state: 'visible',
        timeout: 15000
    });

    console.log('Old Code:', await input.inputValue());

    await input.click();

    await input.fill('');

    // await this.page.waitForTimeout(300);

    console.log(
        'After clear:',
        await input.inputValue()
    );

    await input.fill(code);

  //await this.page.waitForTimeout(1000);

    console.log(
        'After entering:',
        await input.inputValue()
    );

    // If application restores old value, try typing again
    if (await input.inputValue() !== code) {

        await input.click();

        await input.press('Control+A');

        await input.press('Backspace');

        await input.type(code, {
            delay: 100
        });

        //await this.page.waitForTimeout(1000);
    }

    const actualValue = await input.inputValue();

    console.log('--------------------------------');
    console.log('Expected Code:', code);
    console.log('Actual Code:', actualValue);
    console.log('--------------------------------');

    if (actualValue !== code) {
        throw new Error(
            `Code was not updated. Expected: ${code}, Actual: ${actualValue}`
        );
    }

    console.log(
        'Social Attribute Code entered successfully'
    );
}
    // =====================================================
    // ENTER SOCIAL ATTRIBUTE NAME
    // =====================================================

    async enterSocialAttributeName(name: string) {

    const input = this.page.locator(
        'input[name="socialAttributeName"]:visible'
    );

    await input.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await input.click();

    // Select existing value
    await input.press('Control+A');

    // Delete existing value
    await input.press('Backspace');

    // Type new value
    await input.pressSequentially(name, {
        delay: 50
    });

    // await this.page.waitForTimeout(500);

    const actualValue = await input.inputValue();

    console.log('------------------------------------------');
    console.log('SOCIAL ATTRIBUTE NAME FIELD');
    console.log('Expected Name:', name);
    console.log('Actual Name:', actualValue);
    console.log('------------------------------------------');

    if (actualValue !== name) {
        throw new Error(
            `Name was not updated. Expected: ${name}, Actual: ${actualValue}`
        );
    }

    console.log(
        'Social Attribute Name entered successfully'
    );
}

    // =====================================================
    // SELECT DATA TYPE - DECIMAL
    // =====================================================

    async selectDecimalDataType() {

    // Click Data Type dropdown
    const dropdown = this.page.getByText(
        'Select Data Type',
        {
            exact: true
        }
    ).last();

    await dropdown.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await dropdown.click();

   //await this.page.waitForTimeout(1000);

    // Select DECIMAL option
    const decimalOption = this.page.getByText(
        'DECIMAL (e.g. 10.5)',
        {
            exact: true
        }
    );

    await decimalOption.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await decimalOption.click();

    // await this.page.waitForTimeout(500);

    console.log(
        'Decimal data type selected successfully'
    );
}

    // =====================================================
    // SELECT UNIT - LITRE
    // =====================================================

    async selectLitreUnit() {

        const dropdown =
            this.page.getByText(
                'Select Unit',
                {
                    exact: true
                }
            ).last();

        await dropdown.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await dropdown.click();

        // await this.page.waitForTimeout(500);

        const litreOption =
            this.page.getByText(
                'Litre - L',
                {
                    exact: true
                }
            ).last();

        await litreOption.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await litreOption.click();

        // await this.page.waitForTimeout(500);

        console.log(
            'Litre - L unit selected'
        );
    }


    // =====================================================
    // SAVE SOCIAL ATTRIBUTE
    // =====================================================

    async clickSave() {

        const saveButton =
            this.page.getByText(
                'Save',
                {
                    exact: true
                }
            ).last();

        await saveButton.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await saveButton.click();

        //await this.page.waitForTimeout(2000);

        console.log(
            'Save button clicked successfully'
        );
    }


    // =====================================================
    // SEARCH SOCIAL ATTRIBUTE
    // =====================================================

    async searchSocialAttribute(value: string) {

        await this.searchInput.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await this.searchInput.fill(value);

       //await this.page.waitForTimeout(1000);

        console.log(
            `Search value entered: ${value}`
        );
    }


    // =====================================================
    // CLEAR SEARCH
    // =====================================================

    async clearSearch() {

        await this.searchInput.fill('');

        // await this.page.waitForTimeout(500);

        console.log(
            'Search cleared'
        );
    }



    
    // =====================================================
// SELECT BIT THEN INT DATA TYPE
// =====================================================

// =====================================================
// SELECT BIT THEN INT DATA TYPE
// =====================================================

async selectBitThenIntDataType() {

    // ================================================
    // CLICK ALL DATA TYPES DROPDOWN
    // ================================================

    const dataTypeFilter = this.page
        .getByText('All Data Types', {
            exact: true
        })
        .last();

    await dataTypeFilter.waitFor({
        state: 'visible',
        timeout: 15000
    });

    // Scroll to dropdown
    await dataTypeFilter.scrollIntoViewIfNeeded();

    // Wait so you can see the dropdown
    //await this.page.waitForTimeout(2000);

    await dataTypeFilter.click();

    console.log('All Data Types dropdown opened');

    // Wait so dropdown options are visible
    //await this.page.waitForTimeout(2000);


    // ================================================
    // SELECT BIT
    // ================================================

    const bitOption = this.page
        .getByText('BIT', {
            exact: true
        })
        .last();

    await bitOption.waitFor({
        state: 'visible',
        timeout: 15000
    });

    // Scroll BIT into view
    await bitOption.scrollIntoViewIfNeeded();

    // Wait so you can SEE BIT
    //await this.page.waitForTimeout(2000);

    await bitOption.click();

    console.log('BIT data type selected');

    // Wait after BIT selection
    //await this.page.waitForTimeout(3000);


    // ================================================
    // OPEN DATA TYPE DROPDOWN AGAIN
    // ================================================

    const selectedDataType = this.page
        .getByText('BIT', {
            exact: true
        })
        .last();

    await selectedDataType.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await selectedDataType.scrollIntoViewIfNeeded();

    // Wait so you can see BIT selected
    //await this.page.waitForTimeout(2000);

    await selectedDataType.click();

    console.log('Data Type dropdown opened again');

    // Wait for INT option
    //await this.page.waitForTimeout(2000);


    // ================================================
    // SELECT INT
    // ================================================

    const intOption = this.page
        .getByText('INT', {
            exact: true
        })
        .last();

    await intOption.waitFor({
        state: 'visible',
        timeout: 15000
    });

    // Scroll INT into view
    await intOption.scrollIntoViewIfNeeded();

    // Wait so you can SEE INT
    //await this.page.waitForTimeout(2000);

    await intOption.click();

    console.log('INT data type selected');

    // Wait after INT selection
    //await this.page.waitForTimeout(3000);

    console.log(
        'BIT and INT data types selected successfully'
    );
}


// =====================================================
// SELECT PARENT ONLY THEN DISCOUNT APPLICABLE
// =====================================================

async selectParentOnlyThenDiscountApplicable() {

    // =================================================
    // CLICK ALL ATTRIBUTES DROPDOWN
    // =================================================

    const allAttributesDropdown = this.page
        .getByText('All Attributes', {
            exact: true
        })
        .last();

    await allAttributesDropdown.waitFor({
        state: 'visible',
        timeout: 15000
    });

    // Keep dropdown visible on screen
    await allAttributesDropdown.scrollIntoViewIfNeeded();

    // Wait 2 seconds so you can see the dropdown
    //await this.page.waitForTimeout(2000);

    await allAttributesDropdown.click();

    console.log(
        'All Attributes dropdown opened'
    );

    // Wait for dropdown options to be visible
    //await this.page.waitForTimeout(2000);


    // =================================================
    // SELECT PARENT ONLY
    // =================================================

    const parentOnlyOption = this.page
        .getByText('Parent Only', {
            exact: true
        })
        .last();

    await parentOnlyOption.waitFor({
        state: 'visible',
        timeout: 15000
    });

    // Scroll option into view
    await parentOnlyOption.scrollIntoViewIfNeeded();

    // Wait 2 seconds so you can SEE Parent Only
    //await this.page.waitForTimeout(2000);

    await parentOnlyOption.click();

    console.log(
        'Parent Only selected'
    );

    // Wait 3 seconds after selection
    // so you can see the selected value
    //await this.page.waitForTimeout(3000);


    // =================================================
    // OPEN ALL ATTRIBUTES DROPDOWN AGAIN
    // =================================================

    const selectedParentOnly = this.page
        .getByText('Parent Only', {
            exact: true
        })
        .last();

    await selectedParentOnly.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await selectedParentOnly.scrollIntoViewIfNeeded();

    // Wait 2 seconds
    //await this.page.waitForTimeout(2000);

    await selectedParentOnly.click();

    console.log(
        'All Attributes dropdown opened again'
    );

    // Wait for options to appear
    //await this.page.waitForTimeout(2000);


    // =================================================
    // SELECT DISCOUNT APPLICABLE
    // =================================================

    const discountApplicableOption = this.page
        .getByText('Discount Applicable', {
            exact: true
        })
        .last();

    await discountApplicableOption.waitFor({
        state: 'visible',
        timeout: 15000
    });

    // Scroll option into view
    await discountApplicableOption.scrollIntoViewIfNeeded();

    // Wait 2 seconds so you can SEE the option
    //await this.page.waitForTimeout(2000);

    await discountApplicableOption.click();

    console.log(
        'Discount Applicable selected'
    );

    // Wait 3 seconds after selection
    //await this.page.waitForTimeout(3000);

    console.log(
        'Parent Only and Discount Applicable selected successfully'
    );
}

    // =====================================================
    // TC18 - CLICK FIRST EDIT OPTION
    // =====================================================

    async clickFirstEdit() {

        const editButton = this.page
            .getByRole('button', {
                name: 'Edit'
            })
            .first();

        await editButton.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await editButton.scrollIntoViewIfNeeded();

        // Wait so Edit button is visible on screen
        //await this.page.waitForTimeout(2000);

        await editButton.click();

        console.log(
            'First Edit option clicked successfully'
        );

        // Wait for Edit drawer/form to open
        //await this.page.waitForTimeout(2000);
    }


    // =====================================================
    // TC19 - SWITCH ACTIVE OFF
    // =====================================================

    async switchActiveOff() {

        const activeSwitch = this.page
            .getByRole('switch', {
                name: 'Active'
            })
            .last();

        await activeSwitch.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await activeSwitch.scrollIntoViewIfNeeded();

        // Wait so Active switch is visible
        //await this.page.waitForTimeout(2000);

        await activeSwitch.click();

        console.log(
            'Active switch turned OFF'
        );

        // Wait 2 seconds after OFF
        //await this.page.waitForTimeout(2000);
    }


    // =====================================================
    // TC20 - SWITCH ACTIVE ON
    // =====================================================

    async switchActiveOn() {

        const activeSwitch = this.page
            .getByRole('switch', {
                name: 'Active'
            })
            .last();

        await activeSwitch.waitFor({
            state: 'visible',
            timeout: 15000
        });

        await activeSwitch.scrollIntoViewIfNeeded();

        // Wait so Active switch is visible
        //await this.page.waitForTimeout(2000);

        await activeSwitch.click();

        console.log(
            'Active switch turned ON'
        );

        // Wait 2 seconds after ON
        //await this.page.waitForTimeout(2000);
    }

// =====================================================
// OPEN SELECT UNIT DROPDOWN
// =====================================================

async openSelectUnitDropdown() {

    const unitDropdown = this.page
        .locator('span.truncate.text-left.flex-1.text-sm.text-gray-800')
        .filter({
            hasText: /^(Select Unit|Litre - L)$/
        })
        .last();

    await unitDropdown.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await unitDropdown.scrollIntoViewIfNeeded();

    // Wait so you can see the Unit dropdown
    //await this.page.waitForTimeout(2000);

    await unitDropdown.click();

    console.log(
        'Select Unit dropdown opened'
    );

    // Wait so dropdown options are visible
    //await this.page.waitForTimeout(2000);
}


// =====================================================
// SELECT LITRE UNIT
// =====================================================

// =====================================================
// SELECT LITRE UNIT FROM EDIT
// =====================================================

async selectLitreUnitFromEdit() {

    const litreOption = this.page
        .getByText('Litre - L', {
            exact: true
        })
        .last();

    await litreOption.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await litreOption.scrollIntoViewIfNeeded();

    // Wait so you can SEE Litre option
    //await this.page.waitForTimeout(2000);

    await litreOption.click();

    console.log(
        'Litre - L selected from edit form'
    );

    // Wait after selection
    //await this.page.waitForTimeout(2000);
}

// =====================================================
// CLICK UPDATE
// =====================================================

async clickUpdate() {

    const updateButton = this.page
        .getByText('Update', {
            exact: true
        })
        .last();

    await updateButton.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await updateButton.scrollIntoViewIfNeeded();

    //await this.page.waitForTimeout(2000);

    await updateButton.click();

    console.log(
        'Update button clicked successfully'
    );

    // Wait for update operation to complete
    //await this.page.waitForTimeout(3000);
}
    // =====================================================
    // TC25 - WAIT AFTER UPDATE
    // =====================================================

    async waitAfterUpdate() {

        //await this.page.waitForTimeout(2000);

        console.log(
            'Wait completed after Update'
        );
    }
// =====================================================
// PAGINATION
// =====================================================

async clickPaginationPage(pageNumber: number) {

    const pageButton = this.page.getByRole(
        'button',
        {
            name: `Go to page ${pageNumber}`
        }
    );

    await pageButton.waitFor({
        state: 'visible',
        timeout: 15000
    });

    // Keep pagination visible on screen
    await pageButton.scrollIntoViewIfNeeded();

    // Wait so you can see the page button
    //await this.page.waitForTimeout(2000);

    await pageButton.click();

    console.log(
        `Pagination Page ${pageNumber} clicked`
    );

    // Wait for page data/UI to update
    //await this.page.waitForTimeout(2000);
}



// =====================================================
// WAIT AFTER LITRE SELECTION
// =====================================================

async waitAfterLitreSelection() {

    //await this.page.waitForTimeout(2000);

    console.log(
        'Wait completed after Litre selection'
    );
}

// =====================================================
// SELECT ROWS PER PAGE - 5
// =====================================================

async selectRowsPerPageFive() {

    const rowsPerPageDropdown = this.page.locator(
        'select[aria-label="Rows per page"]'
    );

    await rowsPerPageDropdown.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await rowsPerPageDropdown.scrollIntoViewIfNeeded();

    //await this.page.waitForTimeout(1000);

    // Select value 5
    await rowsPerPageDropdown.selectOption('5');

    //await this.page.waitForTimeout(2000);

    // Verify selected value
    const selectedValue =
        await rowsPerPageDropdown.inputValue();

    console.log(
        'Rows per page selected:',
        selectedValue
    );

    if (selectedValue !== '5') {
        throw new Error(
            `Rows per page was not selected correctly. Expected: 5, Actual: ${selectedValue}`
        );
    }

    console.log(
        'Rows per page 5 selected successfully'
    );
}


// =====================================================
// SEARCH HAS_SOLA
// =====================================================

async searchHasSolar() {

    await this.searchInput.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await this.searchInput.fill('HAS_SOLA');

    //await this.page.waitForTimeout(2000);

    console.log(
        'HAS_SOLA searched successfully'
    );
}


// =====================================================
// CLICK EDIT
// =====================================================

async clickEdit() {

    const editButton = this.page
        .getByRole('button', {
            name: 'Edit'
        })
        .first();

    await editButton.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await editButton.scrollIntoViewIfNeeded();

    //await this.page.waitForTimeout(2000);

    await editButton.click();

    //await this.page.waitForTimeout(2000);

    console.log(
        'Edit button clicked successfully'
    );
}



// =====================================================
// SWITCH ACTIVE OFF
// =====================================================

async switchActiveOffFromEdit() {

    const activeSwitch = this.page
        .getByRole('switch', {
            name: 'Active'
        })
        .last();

    await activeSwitch.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await activeSwitch.scrollIntoViewIfNeeded();

    //await this.page.waitForTimeout(2000);

    await activeSwitch.click();

    //await this.page.waitForTimeout(2000);

    console.log(
        'Active switched OFF'
    );
}



// =====================================================
// SWITCH ACTIVE ON
// =====================================================

async switchActiveOnFromEdit() {

    const inactiveSwitch = this.page
        .getByRole('switch', {
            name: 'Inactive'
        })
        .last();

    await inactiveSwitch.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await inactiveSwitch.scrollIntoViewIfNeeded();

    //await this.page.waitForTimeout(2000);

    await inactiveSwitch.click();

    //await this.page.waitForTimeout(2000);

    console.log(
        'Active switched ON'
    );
}



// =====================================================
// UPDATE
// =====================================================

async updateSocialAttribute() {

    const updateButton = this.page
        .getByRole('button', {
            name: 'Update'
        })
        .last();

    await updateButton.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await updateButton.scrollIntoViewIfNeeded();

    //await this.page.waitForTimeout(2000);

    await updateButton.click();

    ////await this.page.waitForTimeout(3000);

    console.log(
        'Social Attribute updated successfully'
    );
}



// =====================================================
// SEARCH EV CHARGING
// =====================================================

async searchEvCharging() {

    await this.searchInput.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await this.searchInput.fill('HAS_EV_CHARGING');

    //await this.page.waitForTimeout(2000);

    console.log(
        'HAS_EV_CHARGING searched successfully'
    );
}



// =====================================================
// CLICK EV CHARGING EDIT
// =====================================================

async clickEvChargingEdit() {

    const editButton = this.page
        .getByRole('row', {
            name: /HAS_EV_CHARGING EV Charging/
        })
        .getByLabel('Edit');

    await editButton.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await editButton.scrollIntoViewIfNeeded();

    //await this.page.waitForTimeout(2000);

    await editButton.click();

    //await this.page.waitForTimeout(2000);

    console.log(
        'EV Charging Edit clicked'
    );
}



// =====================================================
// OPEN UNIT DROPDOWN
// =====================================================

async openUnitDropdown() {

    await this.unitCombobox.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await this.unitCombobox.click();

    //await this.page.waitForTimeout(2000);

    console.log(
        'Unit dropdown opened'
    );
}




// =====================================================
// SELECT LITRE
// =====================================================

async selectLitreOption() {

    const litreOption = this.page
        .getByRole('option', {
            name: 'Litre - L'
        });

    await litreOption.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await litreOption.click();

    //await this.page.waitForTimeout(2000);

    console.log(
        'Litre - L selected'
    );
}




// =====================================================
// UPDATE EV CHARGING
// =====================================================

async updateEvCharging() {

    await this.updateSocialAttribute();

    console.log(
        'EV Charging updated'
    );
}




// =====================================================
// OPEN ADMIN MENU
// =====================================================

async openAdminMenu() {

    await this.adminButton.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await this.adminButton.click();

    //await this.page.waitForTimeout(2000);

    console.log(
        'Admin menu opened'
    );
}



// =====================================================
// OPEN LANGUAGE MENU
// =====================================================

async openLanguageMenu() {

    const languageButton = this.page
        .getByRole('button', {
            name: /Language/
        });

    await languageButton.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await languageButton.click();

    //await this.page.waitForTimeout(2000);

    console.log(
        'Language menu opened'
    );
}



// =====================================================
// SELECT MARATHI
// =====================================================

async selectMarathi() {

    const marathiOption = this.page.getByRole('option', { name: /Marathi|मराठी/i }).first();

    await marathiOption.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await marathiOption.click();

    //await this.page.waitForTimeout(3000);

    console.log(
        'Marathi selected'
    );
}


// =====================================================
// OPEN DATA TYPE FILTER
// =====================================================

async openDataTypeFilter() {
    // Support both labels while the language switch is settling.
    const filter = this.page.getByRole('combobox', { name: /Data Type|\u0921\u0947\u091f\u093e/ }).first();

    await filter.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await filter.click();

    //await this.page.waitForTimeout(2000);

    console.log(
        'Data Type filter opened'
    );
}




// =====================================================
// SELECT BIT
// =====================================================

async selectBitOption() {

    const bitOption = this.page
        .getByRole('option', {
            name: 'BIT'
        });

    await bitOption.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await bitOption.click();

    //await this.page.waitForTimeout(3000);

    console.log(
        'BIT selected'
    );
}





// =====================================================
// SELECT CHILD ATTRIBUTE
// =====================================================

async selectChildAttribute() {

    // The language switch can leave this control in English while the
    // translated label is still being applied. Prefer the stable English
    // locator and retain a translated-label fallback.
    const filter = this.attributeFilter.or(
        this.page.getByRole('combobox', { name: /attribute.*filter|वैशिष्ट्य/i })
    ).first();

    await filter.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await filter.click();

    //await this.page.waitForTimeout(2000);

    const childOption = this.page.getByRole('option', { name: /Child Only|केवळ उप|उप.*चाइल्ड/i }).first();

    await childOption.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await childOption.click();

    //await this.page.waitForTimeout(3000);

    console.log(
        'Child attribute selected'
    );
}




// =====================================================
// RESET AND CHANGE LANGUAGE TO ENGLISH
// =====================================================

async resetAndChangeToEnglish() {

    const resetButton = this.page.getByRole('button', { name: /Reset|रीसेट/i }).first();

    await resetButton.waitFor({
        state: 'visible',
        timeout: 15000
    });

    await resetButton.click();

    //await this.page.waitForTimeout(2000);

    const adminButton = this.page
        .getByRole('button', {
            name: 'Admin scipl pvt A'
        });

    await adminButton.click();

    //await this.page.waitForTimeout(1000);

    const languageButton = this.page.getByRole('button', { name: /Language|भाषा/i }).first();

    await languageButton.click();

    //await this.page.waitForTimeout(1000);

    const englishOption = this.page
        .getByRole('option', {
            name: 'English'
        });

    await englishOption.click();

    //await this.page.waitForTimeout(3000);

    console.log(
        'Filters reset and language changed to English'
    );
}


}


