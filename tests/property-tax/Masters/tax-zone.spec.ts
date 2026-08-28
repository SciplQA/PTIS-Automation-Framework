import { Page } from '@playwright/test';
import { internalTest as test, expect } from '../../../fixtures/internalSessionFixtures';
import { TaxZonePage } from '../../../pages/property-tax/Masters/TaxZonePage';
import { generateUniqueNumber, generateUniqueUppercase } from './randomData.js';


test.describe.configure({ mode: 'serial' });
test.describe('Property Tax - Tax Zone Master', () => {

    let page: Page;
    let taxZonePage: TaxZonePage;
    let createdZoneNo: string;
    let deleteZoneNo: string;


    // =====================================================
    // LOGIN + NAVIGATION ONLY ONCE
    // =====================================================

    test.beforeAll(async ({ internalSession }) => {
        page = internalSession.page;
        taxZonePage = internalSession.taxZonePage;
        await taxZonePage.navigateFromPropertyTaxModule();
        await taxZonePage.expectLoaded();
    });


    // =====================================================
    // TC01
    // =====================================================

    test('TC01 - Verify Tax Zone Master Screen', async () => {

        await expect(
            taxZonePage.searchInput
        ).toBeVisible();

        console.log('TC01 Passed');
    });


    // =====================================================
    // TC02
    // =====================================================

    test('TC02 - Verify Search Field', async () => {

        await expect(
            taxZonePage.searchInput
        ).toBeVisible();

        console.log('TC02 Passed');
    });


    // =====================================================
    // TC03
    // =====================================================

    test('TC03 - Search Tax Zone', async () => {

        await taxZonePage.searchTaxZone('Zone 1');

        await expect(
            taxZonePage.searchInput
        ).toHaveValue('Zone 1');

        await taxZonePage.clearSearch();

        console.log('TC03 Passed');
    });


    // =====================================================
    // TC04
    // =====================================================

    test('TC04 - Search Multiple Values', async () => {

        const searchData = [
            '1',
            '2',
            '3',
            'Zone 1',
            'Residential',
            'Commercial',
            'Test'
        ];

        for (const value of searchData) {

            await taxZonePage.searchTaxZone(value);

            await expect(
                taxZonePage.searchInput
            ).toHaveValue(value);
        }

        await taxZonePage.clearSearch();

        console.log('TC04 Passed');
    });


    // =====================================================
    // TC05
    // =====================================================

    test('TC05 - Clear Search', async () => {

        await taxZonePage.searchTaxZone('Zone 1');

        await taxZonePage.clearSearch();

        await expect(
            taxZonePage.searchInput
        ).toHaveValue('');

        console.log('TC05 Passed');
    });


    // =====================================================
    // TC06
    // =====================================================

    test('TC06 - Open Add Tax Zone', async () => {

        await taxZonePage.clickAddZone();

        await expect(
            taxZonePage.zoneNoInput
        ).toBeVisible();

        console.log('TC06 Passed');
    });


    // =====================================================
    // TC07
    // =====================================================

    test('TC07 - Enter Zone No', async () => {

    createdZoneNo = generateUniqueNumber(6);

    await taxZonePage.enterZoneNo(
        createdZoneNo
    );

    await expect(
        taxZonePage.zoneNoInput
    ).toHaveValue(createdZoneNo);

    console.log(`TC07 Passed - Zone No: ${createdZoneNo}`);
});


    // =====================================================
    // TC08
    // =====================================================

    test('TC08 - Enter Zone Type', async () => {

    const randomZoneType =
        `Residential${generateUniqueUppercase(3)}`;

    await taxZonePage.enterZoneType(
        randomZoneType
    );
    await expect(
        taxZonePage.zoneTypeInput
    ).toHaveValue(randomZoneType);

    console.log(`TC08 Passed - Zone Type: ${randomZoneType}`);
});
    // =====================================================
    // TC09
    // =====================================================

    test('TC09 - Enter Remark', async () => {

        await taxZonePage.enterRemark(
            'Automation Test Zone11'
        );

        await expect(
            taxZonePage.remarkInput
        ).toHaveValue(
            'Automation Test Zone11'
        );

        console.log('TC09 Passed');
    });


    // =====================================================
    // TC10
    // =====================================================

    test('TC10 - Save Tax Zone', async () => {

        await taxZonePage.clickSave();

        // await page.waitForTimeout(3000);

        console.log(
            'TC10 Passed - Tax Zone saved'
        );
    });


    // =====================================================
    // TC11
    // =====================================================

    test('TC11 - Search Existing Zone', async () => {

        await taxZonePage.searchTaxZone(
            createdZoneNo
        );

        await expect(
            taxZonePage.searchInput
        ).toHaveValue(createdZoneNo);

        console.log(
            'TC11 Passed - Existing Zone searched'
        );
    });


    // =====================================================
    // TC12
    // =====================================================

    test('TC12 - Open Edit Drawer', async () => {

        await taxZonePage.clickEdit(createdZoneNo);

        await expect(
            taxZonePage.zoneTypeInput
        ).toBeVisible();

        console.log(
            'TC12 Passed - Edit drawer opened'
        );
    });


    // =====================================================
    // TC13
    // =====================================================

    test('TC13 - Change Zone Type', async () => {

        const updatedZoneType =
            `Commercial${generateUniqueUppercase(4)}`;

        await taxZonePage.editZoneType(
            updatedZoneType
        );

        await expect(
            taxZonePage.zoneTypeInput
        ).toHaveValue(updatedZoneType);

        console.log(
            'TC13 Passed - Zone Type changed'
        );
    });


    // =====================================================
    // TC14
    // =====================================================

    test('TC14 - Deactivate Zone', async () => {

        const status =
            await taxZonePage.activeButton
                .getAttribute('aria-checked');

        if (status === 'true') {

            await taxZonePage.toggleActive();
        }

        await expect(
            taxZonePage.activeButton
        ).toHaveAttribute(
            'aria-checked',
            'false'
        );

        console.log(
            'TC14 Passed - Zone deactivated'
        );
    });


    // =====================================================
    // TC15
    // =====================================================

    test('TC15 - Activate Zone', async () => {

        const status =
            await taxZonePage.activeButton
                .getAttribute('aria-checked');

        if (status === 'false') {

            await taxZonePage.toggleActive();
        }

        await expect(
            taxZonePage.activeButton
        ).toHaveAttribute(
            'aria-checked',
            'true'
        );

        console.log(
            'TC15 Passed - Zone activated'
        );
    });


    // =====================================================
    // TC16
    // =====================================================

    test('TC16 - Update Tax Zone', async () => {

        await taxZonePage.clickUpdate();

        // await page.waitForTimeout(3000);

        console.log(
            'TC16 Passed - Tax Zone updated'
        );
    });


    // =====================================================
    // TC17
    // =====================================================

    test('TC17 - Pagination Page 2', async () => {

        await taxZonePage.clickPage2();

        console.log(
            'TC17 Passed - Page 2 opened'
        );
    });


    // =====================================================
    // TC18
    // =====================================================

    test('TC18 - Final Verification', async () => {

        await expect(
            taxZonePage.searchInput
        ).toBeVisible();

        console.log(
            'TC18 Passed - Final verification completed'
        );
    });


            // =====================================================
    // TC19
    // =====================================================

    test('TC19 - Navigate Page 1 to Page 2', async () => {

        // First go to Page 1
        await taxZonePage.clickPage1();

        // await page.waitForTimeout(2000);

        // Then go from Page 1 to Page 2
        await taxZonePage.clickPage2();

        // await page.waitForTimeout(2000);

        console.log(
            'TC19 Passed - Page 1 to Page 2'
        );
    });


    // =====================================================
    // TC20
    // =====================================================

    test('TC20 - Navigate Page 2 to Page 3', async () => {

        await taxZonePage.clickPage3();

        // await page.waitForTimeout(2000);

        console.log(
            'TC20 Passed - Page 2 to Page 3'
        );
    });


    // =====================================================
    // TC21
    // =====================================================

    test('TC21 - Navigate Page 3 to Page 2', async () => {

        await taxZonePage.clickPage2();

        // await page.waitForTimeout(2000);

        console.log(
            'TC21 Passed - Page 3 to Page 2'
        );
    });


    // =====================================================
    // TC22
    // =====================================================

    test('TC22 - Navigate Page 2 to Page 1', async () => {

        await taxZonePage.clickPage1();

        // await page.waitForTimeout(2000);

        console.log(
            'TC22 Passed - Page 2 to Page 1'
        );
    });



test('TC23 - Select 5 Rows Per Page', async () => {

        await taxZonePage.selectRowsPerPage('5');

        console.log(
            'TC23 Passed - 5 rows per page selected'
        );
    });




        // =====================================================
    // TC24
    // =====================================================

    test('TC24 - Select 10 Rows Per Page', async () => {

        await taxZonePage.selectRowsPerPage('10');

        console.log(
            'TC24 Passed - 10 rows per page selected'
        );
    });


        // =====================================================
    // TC25
    // =====================================================

    test('TC25 - Open Add Zone Screen Again', async () => {

        await taxZonePage.clickAddZone();

        // await page.waitForTimeout(2000);

        await expect(
            taxZonePage.zoneNoInput
        ).toBeVisible();

        console.log(
            'TC25 Passed - Add Zone screen opened again'
        );
    });



        // =====================================================
    // TC26
    // =====================================================

    test('TC26 - Close Add Zone Screen', async () => {

        await taxZonePage.clickCloseAddZone();

        // await page.waitForTimeout(2000);

        await expect(
            taxZonePage.zoneNoInput
        ).not.toBeVisible();

        console.log(
            'TC26 Passed - Add Zone screen closed'
        );
    });


    // =====================================================
// TC27
// =====================================================

test('TC27 - Verify Edit Button', async () => {

    await expect(
        taxZonePage.editButton
    ).toBeVisible();

    console.log(
        'TC27 Passed - Edit button is visible'
    );
});




// =====================================================
// TC28
// =====================================================

test('TC28 - Click Edit Button', async () => {

    await taxZonePage.clickEdit();

    // await page.waitForTimeout(2000);

    console.log(
        'TC28 Passed - Edit button clicked'
    );
});


// =====================================================
// TC29
// =====================================================

test('TC29 - Verify Edit Drawer Opened', async () => {

    await expect(
        taxZonePage.zoneTypeInput
    ).toBeVisible();

    console.log(
        'TC29 Passed - Edit drawer opened'
    );
});
// =====================================================
// TC30
// =====================================================

test('TC30 - Verify Zone No in Edit Drawer', async () => {

    await expect(
        taxZonePage.zoneNoInput
    ).toBeVisible();

    console.log(
        'TC30 Passed - Zone No is visible'
    );
});



// =====================================================
// TC31
// =====================================================

test('TC31 - Verify Zone Type in Edit Drawer', async () => {

    await expect(
        taxZonePage.zoneTypeInput
    ).toBeVisible();

    console.log(
        'TC31 Passed - Zone Type is visible'
    );
});
// =====================================================
// TC32
// =====================================================

test('TC32 - Verify Cancel Button', async () => {

    await expect(
        taxZonePage.cancelButton
    ).toBeVisible();

    console.log(
        'TC32 Passed - Cancel button is visible'
    );
});

// =====================================================
// TC33  when i want to create the data and when attempted to logged in 
// =====================================================

test('TC33 - Click Cancel and Close Edit Drawer', async () => {

    await taxZonePage.clickCancel();

    // await page.waitForTimeout(2000);

    await expect(
        taxZonePage.zoneTypeInput
    ).not.toBeVisible();
    console.log(
        'TC33 Passed - Edit drawer closed successfully'
    );
});
//TC 34        
test('TC34 - Create Tax Zone for Deletion', async () => {

    deleteZoneNo = generateUniqueNumber(6);

    const deleteZoneType =
        `Delete${generateUniqueUppercase(4)}`;

    await taxZonePage.clickAddZone();

    await taxZonePage.enterZoneNo(
        deleteZoneNo
    );

    await taxZonePage.enterZoneType(
        deleteZoneType
    );

    await taxZonePage.enterRemark(
        'Automation Delete Test'
    );

    await taxZonePage.clickSave();

    // await page.waitForTimeout(3000);

    console.log(
        `TC34 Passed - Delete Test Zone Created: ${deleteZoneNo}`
    );
});

//TC 35 

test('TC35 - Search Created Tax Zone', async () => {

    await taxZonePage.searchTaxZone(
        deleteZoneNo
    );

    // await page.waitForTimeout(2000);

    await expect(
        taxZonePage.searchInput
    ).toHaveValue(
        deleteZoneNo
    );

    console.log(
        `TC35 Passed - Tax Zone ${deleteZoneNo} searched`
    );
});

// =====================================================
// TC36
// =====================================================

test('TC36 - Verify Delete Button', async () => {

    await expect(
        taxZonePage.deleteButton
    ).toBeVisible();

    console.log(
        'TC36 Passed - Delete button is visible'
    );
});

// =====================================================
// TC37
// =====================================================

test('TC37 - Click Delete Button', async () => {

    await taxZonePage.clickDelete();

    await expect(
        taxZonePage.deleteConfirmButton
    ).toBeVisible();

    await taxZonePage.confirmDelete();

    console.log(
        'TC37 Passed - Delete confirmed and test zone removed'
    );
});
});
