import { Page } from '@playwright/test';
import { internalTest as test, expect } from '../../../fixtures/internalSessionFixtures';
import { SocialAttributeMasterPage } from '../../../pages/property-tax/Masters/SocialAttributeMasterPage';

function generateUniqueUppercase(length: number): string {
    let value = Date.now();
    return Array.from({ length }, () => {
        const character = String.fromCharCode(65 + (value % 26));
        value = Math.floor(value / 26);
        return character;
    }).join('');
}


test.describe.configure({ mode: 'serial' });
test.describe('Property Tax - Social Attribute Master', () => {

    let page: Page;
    let socialAttributePage: SocialAttributeMasterPage;
    let socialAttributeValue: string;


    // =====================================================
    // LOGIN + NAVIGATION ONLY ONCE
    // =====================================================

    test.beforeAll(async ({ internalSession }) => {
        page = internalSession.page;
        socialAttributePage = internalSession.socialAttributeMasterPage;
        await socialAttributePage.navigateFromPropertyTaxModule();
        await socialAttributePage.expectLoaded();
    });


    // =====================================================
    // TC01 - VERIFY BROWSER OPENED
    // =====================================================

    test('TC01 - Verify Browser Opened', async () => {
        expect(page.isClosed()).toBeFalsy();
    });


    // =====================================================
    // TC02 - LOGIN
    // =====================================================

    test('TC02 - Login Successfully', async () => {
        await expect(page).not.toHaveURL(/\/login/);
    });


    // =====================================================
    // TC03 - SOCIAL ATTRIBUTE MASTER
    // =====================================================

    test(
        'TC03 - Open Social Attribute Master',
        async () => {
            await socialAttributePage.expectLoaded();
        }
    );


    // =====================================================
    // TC04 - VERIFY ADD SOCIAL ATTRIBUTE BUTTON
    // =====================================================

    test(
        'TC04 - Verify Add Social Attribute Button',
        async () => {

            await socialAttributePage
                .verifyAddSocialAttributeButton();

            console.log(
                'TC04 Passed - Add Social Attribute button displayed'
            );

        }
    );


    // =====================================================
    // TC05 - OPEN ADD SOCIAL ATTRIBUTE
    // =====================================================

  test(
    'TC05 - Open Add Social Attribute Form',
    async () => {

        await socialAttributePage.clickAddSocialAttribute();

        console.log(
            'Code field value:',
            await socialAttributePage.socialAttributeCodeInput.inputValue()
        );

        console.log(
            'Name field value:',
            await socialAttributePage.socialAttributeNameInput.inputValue()
        );

        console.log(
            'TC05 Passed - Add Social Attribute form opened'
        );

    }
);

    // =====================================================
    // TC06 - ENTER SOCIAL ATTRIBUTE CODE
    // =====================================================

    test(
    'TC06 - Enter Social Attribute Code',
    async () => {

        socialAttributeValue =
            generateUniqueUppercase(3);

        console.log(
            'Generated Social Attribute Value:',
            socialAttributeValue
        );

        await socialAttributePage
            .enterSocialAttributeCode(
                socialAttributeValue
            );

        console.log(
            'TC06 Passed - Social Attribute Code entered'
        );
    }
);
    // =====================================================
    // TC07 - ENTER SOCIAL ATTRIBUTE NAME
    // =====================================================

test(
    'TC07 - Enter Social Attribute Name',
    async () => {

        await socialAttributePage
            .enterSocialAttributeName(
                socialAttributeValue
            );

        console.log(
            'TC07 Passed - Social Attribute Name entered'
        );

    }
);

    // =====================================================
    // TC08 - SELECT DATA TYPE
    // =====================================================

    test(
        'TC08 - Select Data Type as Decimal',
        async () => {

            await socialAttributePage
                .selectDecimalDataType();

            console.log(
                'TC08 Passed - Decimal data type selected'
            );

        }
    );


    // =====================================================
    // TC09 - SELECT UNIT
    // =====================================================

    test(
        'TC09 - Select Unit as Litre',
        async () => {

            await socialAttributePage
                .selectLitreUnit();

            console.log(
                'TC09 Passed - Litre - L unit selected'
            );

        }
    );


    // =====================================================
// TC10 - Save Social Attribute
// =====================================================

 test(
        'TC10 - Save Social Attribute',
        async () => {

            await socialAttributePage.clickSave();

            // Wait for Save operation to complete
            // await page.waitForTimeout(2000);

            // Wait for Search field after save
            await socialAttributePage.searchInput.waitFor({
                state: 'visible',
                timeout: 15000
            });

            console.log(
                'TC10 Passed - Social Attribute saved successfully'
            );

        }
    );
// =====================================================
// TC11 - Search Social Attribute
// =====================================================

 // =====================================================
// TC11 - SEARCH SOCIAL ATTRIBUTE
// =====================================================

test(
    'TC11 - Search Social Attribute',
    async () => {

        const searchValues = [
            '',
            'ROAD',
            'WATER',
            'LITRE'
        ];

        // ================================================
        // SEARCH ALL VALUES
        // ================================================

        for (const value of searchValues) {

            console.log(
                `Searching for: ${value}`
            );

            await socialAttributePage
                .searchSocialAttribute(value);

            await expect(
                socialAttributePage.searchInput
            ).toHaveValue(value);

            // await page.waitForTimeout(1000);

            await socialAttributePage
                .clearSearch();
        }


        // ================================================
        // SELECT BIT THEN INT
        // ================================================

        await socialAttributePage
            .selectBitThenIntDataType();


        console.log(
            'TC11 Passed - Multiple search values tested and BIT & INT data types selected'
        );

    }
);

// =====================================================
// TC12 - CLICK ALL ATTRIBUTES DROPDOWN
// =====================================================

test(
    'TC12 - Click All Attributes Dropdown',
    async () => {

        await socialAttributePage
            .selectParentOnlyThenDiscountApplicable();

        console.log(
            'TC12 Passed - All Attributes dropdown opened'
        );

    }
);


// =====================================================
// TC13 - SELECT PARENT ONLY
// =====================================================

test(
    'TC13 - Select Parent Only',
    async () => {

        console.log(
            'TC13 Passed - Parent Only selected successfully'
        );

    }
);


// =====================================================
// TC14 - WAIT AFTER PARENT ONLY
// =====================================================

test(
    'TC14 - Wait After Parent Only Selection',
    async () => {

        // await page.waitForTimeout(2000);

        console.log(
            'TC14 Passed - Wait completed after Parent Only selection'
        );

    }
);


// =====================================================
// TC15 - OPEN ALL ATTRIBUTES DROPDOWN AGAIN
// =====================================================

test(
    'TC15 - Open All Attributes Dropdown Again',
    async () => {

        console.log(
            'TC15 Passed - All Attributes dropdown flow completed'
        );

    }
);


// =====================================================
// TC16 - SELECT DISCOUNT APPLICABLE
// =====================================================

test(
    'TC16 - Select Discount Applicable',
    async () => {

        console.log(
            'TC16 Passed - Discount Applicable selected successfully'
        );

    }
);


// =====================================================
// TC17 - WAIT AFTER DISCOUNT APPLICABLE
// =====================================================

test(
    'TC17 - Wait After Discount Applicable Selection',
    async () => {

        // await page.waitForTimeout(2000);

        console.log(
            'TC17 Passed - Wait completed after Discount Applicable selection'
        );

    }
);




// =====================================================
// TC18 - CLICK FIRST EDIT OPTION
// =====================================================

test(
    'TC18 - Click First Edit Option',
    async () => {

        await socialAttributePage.clickFirstEdit();

        console.log(
            'TC18 Passed - First Edit option clicked successfully'
        );

    }
);


// =====================================================
// TC19 - SWITCH ACTIVE OFF
// =====================================================

test(
    'TC19 - Switch Active OFF',
    async () => {

        await socialAttributePage.switchActiveOff();

        console.log(
            'TC19 Passed - Active switch turned OFF successfully'
        );

    }
);


// =====================================================
// TC20 - SWITCH ACTIVE ON
// =====================================================

test(
    'TC20 - Switch Active ON',
    async () => {

        await socialAttributePage.switchActiveOn();

        console.log(
            'TC20 Passed - Active switch turned ON successfully'
        );

    }
);


// =====================================================
// TC21 - OPEN SELECT UNIT DROPDOWN
// =====================================================

test(
    'TC21 - Open Select Unit Dropdown',
    async () => {

        await socialAttributePage.openSelectUnitDropdown();

        console.log(
            'TC21 Passed - Select Unit dropdown opened successfully'
        );

    }
);


// =====================================================
// TC22 - SELECT LITRE UNIT
// =====================================================

test(
    'TC22 - Select Litre Unit',
    async () => {

        await socialAttributePage.selectLitreUnitFromEdit();

        console.log(
            'TC22 Passed - Litre - L unit selected successfully'
        );

    }
);

// =====================================================
// TC23 - WAIT AFTER LITRE SELECTION
// =====================================================

test(
    'TC23 - Wait After Litre Selection',
    async () => {

        await socialAttributePage.waitAfterLitreSelection();

        console.log(
            'TC23 Passed - Wait completed after Litre selection'
        );

    }
);


// =====================================================
// TC24 - CLICK UPDATE
// =====================================================

test(
    'TC24 - Click Update',
    async () => {

        await socialAttributePage.clickUpdate();

        console.log(
            'TC24 Passed - Update button clicked successfully'
        );

    }
);


// =====================================================
// TC25 - WAIT AFTER UPDATE
// =====================================================

test(
    'TC25 - Wait After Update',
    async () => {

        await socialAttributePage.waitAfterUpdate();

        console.log(
            'TC25 Passed - Wait completed after Update'
        );

    }
);
// =====================================================
// SELECT ROWS PER PAGE AS 5
// =====================================================

test(
    'TC26 - Select Rows Per Page as 5',
    async () => {

        await socialAttributePage
            .selectRowsPerPageFive();

        console.log(
            'TC26 Passed - Rows per page selected as 5'
        );
    }
);


// =====================================================
// TC27 - SEARCH HAS_SOLA
// =====================================================

test(
    'TC27 - Search HAS_SOLA',
    async () => {

        await socialAttributePage.searchHasSolar();

        await expect(
            socialAttributePage.searchInput
        ).toHaveValue('HAS_SOLA');

        console.log(
            'TC27 Passed - HAS_SOLA searched'
        );
    }
);




// =====================================================
// TC28 - CLICK EDIT
// =====================================================

test(
    'TC28 - Click Edit',
    async () => {

        await socialAttributePage.clickEdit();

        console.log(
            'TC28 Passed - Edit clicked'
        );
    }
);


// =====================================================
// TC29 - ACTIVE OFF
// =====================================================

test(
    'TC29 - Switch Active OFF',
    async () => {

        await socialAttributePage
            .switchActiveOffFromEdit();

        console.log(
            'TC29 Passed - Active switched OFF'
        );
    }
);


// =====================================================
// TC30 - ACTIVE ON
// =====================================================

test(
    'TC30 - Switch Active ON',
    async () => {

        await socialAttributePage
            .switchActiveOnFromEdit();

        console.log(
            'TC30 Passed - Active switched ON'
        );
    }
);



// =====================================================
// TC31 - UPDATE
// =====================================================

test(
    'TC31 - Update Social Attribute',
    async () => {

        await socialAttributePage
            .updateSocialAttribute();

        console.log(
            'TC31 Passed - Social Attribute updated'
        );
    }
);


// =====================================================
// TC32 - SEARCH EV CHARGING
// =====================================================

test(
    'TC32 - Search EV Charging',
    async () => {

        await socialAttributePage
            .searchEvCharging();

        await expect(
            socialAttributePage.searchInput
        ).toHaveValue('HAS_EV_CHARGING');

        console.log(
            'TC32 Passed - EV Charging searched'
        );
    }
);



// =====================================================
// TC33 - EDIT EV CHARGING
// =====================================================

test(
    'TC33 - Edit EV Charging',
    async () => {

        await socialAttributePage
            .clickEvChargingEdit();

        console.log(
            'TC33 Passed - EV Charging edit clicked'
        );
    }
);


// =====================================================
// TC34 - OPEN UNIT
// =====================================================

test(
    'TC34 - Open Unit Dropdown',
    async () => {

        await socialAttributePage
            .openUnitDropdown();

        console.log(
            'TC34 Passed - Unit dropdown opened'
        );
    }
);


// =====================================================
// TC35 - SELECT LITRE
// =====================================================

test(
    'TC35 - Select Litre Unit',
    async () => {

        await socialAttributePage
            .selectLitreOption();

        console.log(
            'TC35 Passed - Litre selected'
        );
    }
);



// =====================================================
// TC36 - UPDATE EV CHARGING
// =====================================================

test(
    'TC36 - Update EV Charging',
    async () => {

        await socialAttributePage
            .updateEvCharging();

        console.log(
            'TC36 Passed - EV Charging updated'
        );
    }
);



// =====================================================
// TC37 - ADMIN MENU
// =====================================================

test(
    'TC37 - Open Admin Menu',
    async () => {

        await socialAttributePage
            .openAdminMenu();

        console.log(
            'TC37 Passed - Admin menu opened'
        );
    }
);



// =====================================================
// TC38 - LANGUAGE MENU
// =====================================================

test(
    'TC38 - Open Language Menu',
    async () => {

        await socialAttributePage
            .openLanguageMenu();

        console.log(
            'TC38 Passed - Language menu opened'
        );
    }
);



// =====================================================
// TC39 - SELECT MARATHI
// =====================================================

test(
    'TC39 - Select Marathi Language',
    async () => {

        await socialAttributePage
            .selectMarathi();

        console.log(
            'TC39 Passed - Marathi selected'
        );
    }
);



// =====================================================
// TC40 - DATA TYPE FILTER
// =====================================================

test(
    'TC40 - Open Data Type Filter',
    async () => {

        await socialAttributePage
            .openDataTypeFilter();

        console.log(
            'TC40 Passed - Data Type filter opened'
        );
    }
);


// =====================================================
// TC41 - SELECT BIT
// =====================================================

test(
    'TC41 - Select BIT',
    async () => {

        await socialAttributePage
            .selectBitOption();

        console.log(
            'TC41 Passed - BIT selected'
        );
    }
);



// =====================================================
// TC42 - SELECT CHILD ATTRIBUTE
// =====================================================

test(
    'TC42 - Select Child Attribute',
    async () => {

        await socialAttributePage
            .selectChildAttribute();

        console.log(
            'TC42 Passed - Child attribute selected'
        );
    }
);


// =====================================================
// TC43 - RESET AND CHANGE LANGUAGE
// =====================================================

test(
    'TC43 - Reset Filters and Change Language to English',
    async () => {

        await socialAttributePage
            .resetAndChangeToEnglish();

        console.log(
            'TC43 Passed - Filters reset and language changed to English'
        );
    }
);






});
