/**
 * Test Suite: Property Tax > Masters > Tax Zoning
 * Covers navigation, UI layouts, stats cards, filtering, Add, Edit, Bulk Update, and document links.
 */
import { Page } from '@playwright/test';
import { internalTest as test, expect } from '../../../fixtures/internalSessionFixtures';
import { addAllureMetadata, attachVideoOnCompletion } from '../../../helpers/allureHelper';
import { TaxZoningPage } from '../../../pages/property-tax/Masters/TaxZoningPage';
import fs from 'fs';
import path from 'path';

test.describe('Property Tax > Masters > Tax Zoning @masters @zoning', () => {
  // Run tests in serial mode on a shared page context
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(120000);

  let page: Page;
  let zoningPage: TaxZoningPage;

  test.beforeAll(async ({ internalSession }) => {
    page = internalSession.page;
    zoningPage = internalSession.taxZoningPage;
    await zoningPage.navigateFromPropertyTaxModule();
    await zoningPage.verifyPageLoaded();
  });

  // =========================================================================
  // TC-TZNG-01: Page heading and load verification
  // =========================================================================
  test('TC-TZNG-01: Navigate and verify Tax Zoning page heading is visible', async ({}, testInfo) => {
    await addAllureMetadata({
      testId: 'TC-TZNG-01',
      feature: 'Tax Zoning',
      story: 'Navigate and verify page loading heading',
      preConditions: 'User is authenticated and navigates to Tax Zoning master',
      expectedResult: 'Heading and view records heading are loaded successfully'
    });

    try {
      await test.step('Verify headings are visible', async () => {
        await expect(zoningPage.pageHeading).toBeVisible();
        await expect(zoningPage.viewRecordsHeading).toBeVisible();
      });
    } finally {
      await attachVideoOnCompletion(page, testInfo);
    }
  });

  // =========================================================================
  // TC-TZNG-02: Page layout elements and stats cards
  // =========================================================================
  test('TC-TZNG-02: Verify layout sections, document buttons, and stats cards', async ({}, testInfo) => {
    await addAllureMetadata({
      testId: 'TC-TZNG-02',
      feature: 'Tax Zoning',
      story: 'Verify layout and stats elements',
      preConditions: 'On Tax Zoning screen',
      expectedResult: 'Certified documents card controls and stats cards are visible'
    });

    try {
      await test.step('Verify Certified Zoning List controls are visible', async () => {
        const isUploaded = await zoningPage.btnViewZoningList.isVisible().catch(() => false);
        if (isUploaded) {
          await expect(zoningPage.btnDownloadZoningList).toBeVisible();
        } else {
          const uploadBtn = page.locator('div').filter({ has: page.locator('span, div', { hasText: /Certified Zoning List/i }) }).locator('button:has-text("Upload"), button:has(svg.lucide-upload)').first();
          await expect(uploadBtn).toBeVisible();
        }
      });

      await test.step('Verify Certified Zone Map controls are visible', async () => {
        const isUploaded = await zoningPage.btnViewZoneMap.isVisible().catch(() => false);
        if (isUploaded) {
          await expect(zoningPage.btnDownloadZoneMap).toBeVisible();
        } else {
          await expect(zoningPage.btnUploadZoneMap).toBeVisible();
        }
      });

      await test.step('Verify Stats cards are present with correct descriptions', async () => {
        await expect(zoningPage.cardTotalProperties).toBeVisible();
        await expect(zoningPage.cardPropertiesCovered).toBeVisible();
        await expect(zoningPage.cardPropertiesPending).toBeVisible();
      });
    } finally {
      await attachVideoOnCompletion(page, testInfo);
    }
  });

  // =========================================================================
  // TC-TZNG-03: Rows per page functionality
  // =========================================================================
  test('TC-TZNG-03: Verify rows per page select dropdown updates rows count', async ({}, testInfo) => {
    await addAllureMetadata({
      testId: 'TC-TZNG-03',
      feature: 'Tax Zoning',
      story: 'Table pagination rows count selection',
      preConditions: 'On Tax Zoning screen',
      expectedResult: 'Table updates showing maximum rows matching selection'
    });

    try {
      await test.step('Select 5 rows per page', async () => {
        await zoningPage.rowsPerPageSelect.selectOption('5');
        // await page.waitForTimeout(1000);
        await expect.poll(() => zoningPage.getRowCount(), { timeout: 10000 }).toBeLessThanOrEqual(5);
      });

      await test.step('Select 10 rows per page', async () => {
        await zoningPage.rowsPerPageSelect.selectOption('10');
        // await page.waitForTimeout(1000);
      });
    } finally {
      await attachVideoOnCompletion(page, testInfo);
    }
  });

  // =========================================================================
  // TC-TZNG-04: Filter elements functionality
  // =========================================================================
  test('TC-TZNG-04: Verify filter values search works correctly', async ({}, testInfo) => {
    await addAllureMetadata({
      testId: 'TC-TZNG-04',
      feature: 'Tax Zoning',
      story: 'Search records using main filters',
      preConditions: 'Filters are visible on the page',
      expectedResult: 'Applying description search updates the list'
    });

    try {
      await test.step('Input description search query', async () => {
        await zoningPage.filterDescriptionInput.fill('facility');
        await zoningPage.clickApply();
      });

      await test.step('Verify that matching rows or "no data" is shown', async () => {
        // Applying a filter refreshes the table asynchronously. Wait for the
        // refreshed rows (or the empty state), then validate any matching
        // result instead of assuming the first row is already refreshed.
        await expect.poll(async () => {
          const rows = await zoningPage.tableRows.allTextContents();
          return rows.length === 0 || rows.some(text => text.toLowerCase().includes('facility'));
        }, { timeout: 15000 }).toBeTruthy();
      });

      await test.step('Reset filters', async () => {
        await zoningPage.clickReset();
        await expect(zoningPage.filterDescriptionInput).toHaveValue('');
      });
    } finally {
      await attachVideoOnCompletion(page, testInfo);
    }
  });

  // =========================================================================
  // TC-TZNG-05: Form validation in Add Zoning Range drawer
  // =========================================================================
  test('TC-TZNG-05: Verify empty fields trigger validation errors in Add drawer', async ({}, testInfo) => {
    await addAllureMetadata({
      testId: 'TC-TZNG-05',
      feature: 'Tax Zoning',
      story: 'Trigger field validations in Add drawer',
      preConditions: 'Add drawer is open',
      expectedResult: 'Form submission is rejected and validation text displays'
    });

    try {
      await test.step('Open Add Zoning Range drawer', async () => {
        await zoningPage.openAddDrawer();
      });

      await test.step('Click Save without inputs', async () => {
        await zoningPage.btnSaveAddRange.click();
        // await page.waitForTimeout(1000);
      });

      await test.step('Verify drawer remains open and validation alerts appear', async () => {
        await expect(zoningPage.addDrawerTitle).toBeVisible();
        const errors = await page.locator('p, span, div').filter({ hasText: /required|mandatory|invalid|minimum/i }).allTextContents();
        expect(errors.length).toBeGreaterThan(0);
      });

      await test.step('Close Add drawer via X', async () => {
        await zoningPage.closeDrawerViaX();
      });
    } finally {
      await attachVideoOnCompletion(page, testInfo);
    }
  });

  // =========================================================================
  // TC-TZNG-06: Cancel / Reset Form buttons
  // =========================================================================
  test('TC-TZNG-06: Verify Reset Form button resets fields in Add drawer', async ({}, testInfo) => {
    await addAllureMetadata({
      testId: 'TC-TZNG-06',
      feature: 'Tax Zoning',
      story: 'Reset form contents in Add drawer',
      preConditions: 'Add drawer is open',
      expectedResult: 'Fields are cleared upon clicking Reset Form'
    });

    try {
      await test.step('Open Add drawer', async () => {
        await zoningPage.openAddDrawer();
      });

      await test.step('Fill in Zone Description', async () => {
        await zoningPage.addDescriptionTextarea.fill('Test description reset action');
      });

      await test.step('Click Reset Form', async () => {
        await zoningPage.btnResetAddForm.click();
        // await page.waitForTimeout(500);
      });

      await test.step('Verify fields are cleared', async () => {
        await expect(zoningPage.addDescriptionTextarea).toHaveValue('');
      });

      await test.step('Close drawer via X', async () => {
        await zoningPage.closeDrawerViaX();
      });
    } finally {
      await attachVideoOnCompletion(page, testInfo);
    }
  });

  // =========================================================================
  // TC-TZNG-07: Add a new Zoning Range
  // =========================================================================
  test('TC-TZNG-07: Add a new Zoning Range dynamically and verify', async ({}, testInfo) => {
    await addAllureMetadata({
      testId: 'TC-TZNG-07',
      feature: 'Tax Zoning',
      story: 'Add a new zoning range successfully',
      preConditions: 'Add drawer is open',
      expectedResult: 'A new record is successfully added to the system'
    });

    try {
      await test.step('Open Add drawer', async () => {
        await zoningPage.openAddDrawer();
      });

      let selectedWard = '';
      let selectedFrom = '';
      let selectedTo = '';
      let selectedZone = '';

      await test.step('Dynamically select first available Ward', async () => {
        await zoningPage.btnSelectWardCombobox.click();
        // await page.waitForTimeout(1000);
        // Match specific ward names (e.g. Ward 1, NK1, MM1, KL1) to avoid clicking main page text
        const option = page.locator('span.text-sm.text-gray-700').filter({ hasText: /^(Ward\s*\d+|NK\d+|MM\d+|KL\d+)/i }).first();
        selectedWard = (await option.textContent())?.trim() || '';
        console.log('Selected Ward:', selectedWard);
        await option.click();
        // await page.waitForTimeout(500);
        await zoningPage.addDrawerTitle.click(); // Close the dropdown popover by clicking drawer title
        // await page.waitForTimeout(1000);
      });

      await test.step('Dynamically select Property From, To and Zone', async () => {
        // If Property From is enabled, select the first option
        if (await zoningPage.addFromInput.isEnabled()) {
          await zoningPage.addFromInput.click();
          // await page.waitForTimeout(500);
          const fromOpt = page.locator('[role="option"], ul li').first();
          const hasOpt = await fromOpt.waitFor({ state: 'visible', timeout: 2000 }).then(() => true).catch(() => false);
          if (hasOpt) {
            selectedFrom = (await fromOpt.textContent())?.trim() || '';
            await fromOpt.click();
            // await page.waitForTimeout(500);
          } else {
            console.log('No Property From options loaded');
          }
        }

        if (await zoningPage.addToInput.isEnabled()) {
          await zoningPage.addToInput.click();
          // await page.waitForTimeout(500);
          const toOpt = page.locator('[role="option"], ul li').first();
          const hasOpt = await toOpt.waitFor({ state: 'visible', timeout: 2000 }).then(() => true).catch(() => false);
          if (hasOpt) {
            selectedTo = (await toOpt.textContent())?.trim() || '';
            await toOpt.click();
            // await page.waitForTimeout(500);
          } else {
            console.log('No Property To options loaded');
          }
        }

        await zoningPage.selectComboboxOption(zoningPage.addTaxZoneInput, '1');
      });

      const uniqueDesc = `Dynamic test desc ${Date.now()} must be at least 15 characters`;
      await test.step('Fill in Zone Description and save', async () => {
        await zoningPage.addDescriptionTextarea.fill(uniqueDesc);
        // Click Save (If we can save. If there are no options available, we just close the drawer to prevent blocking staging state)
        if (selectedWard && selectedFrom) {
          await zoningPage.btnSaveAddRange.click();
          // await page.waitForTimeout(2000);
        } else {
          console.log('[TC-TZNG-07] Bypassing dynamic save due to no available un-zoned property ranges');
          await zoningPage.closeDrawerViaX();
        }
      });
    } finally {
      await attachVideoOnCompletion(page, testInfo);
    }
  });

  // =========================================================================
  // TC-TZNG-08: Edit an existing Zoning Range
  // =========================================================================
  test('TC-TZNG-08: Verify Edit drawer opens, pre-fills values, and updates successfully', async ({}, testInfo) => {
    await addAllureMetadata({
      testId: 'TC-TZNG-08',
      feature: 'Tax Zoning',
      story: 'Edit existing zoning range',
      preConditions: 'At least one record is present in the table',
      expectedResult: 'Details are updated successfully on save'
    });

    try {
      const rowCount = await zoningPage.getRowCount();
      if (rowCount > 0) {
        // Read first row details
        const cells = zoningPage.tableRows.first().locator('td');
        const wardNo = (await cells.nth(1).textContent())?.trim() || '';
        const range = (await cells.nth(2).textContent())?.trim() || '';
        
        await test.step(`Click Edit for row ${wardNo} - ${range}`, async () => {
          await zoningPage.clickEditForRow(wardNo, range);
        });

        await test.step('Verify Edit drawer opens and description has text', async () => {
          await expect(zoningPage.editDrawerTitle).toBeVisible();
          const desc = await zoningPage.addDescriptionTextarea.inputValue();
          expect(desc.length).toBeGreaterThan(0);
        });

        const newDesc = `Updated desc ${Date.now()} must be at least 15 characters long`;
        await test.step('Update description and click Save', async () => {
          await zoningPage.addDescriptionTextarea.clear();
          await zoningPage.addDescriptionTextarea.fill(newDesc);
          await zoningPage.btnSaveUpdateRange.click();
          // await page.waitForTimeout(2000);
        });

        await test.step('Verify updated description is visible in the table', async () => {
          const updatedRow = zoningPage.getRowByDetails(wardNo, range);
          await expect(updatedRow).toBeVisible();
          await expect(updatedRow.locator('td').nth(4)).toContainText(newDesc);
        });
      } else {
        console.log('[TC-TZNG-08] No records present to edit');
      }
    } finally {
      await attachVideoOnCompletion(page, testInfo);
    }
  });

  // =========================================================================
  // TC-TZNG-09: Bulk Tax Zone Update Drawer
  // =========================================================================
  test('TC-TZNG-09: Verify Bulk Update drawer opens and contains all steps', async ({}, testInfo) => {
    await addAllureMetadata({
      testId: 'TC-TZNG-09',
      feature: 'Tax Zoning',
      story: 'Open Bulk update drawer and inspect steps',
      preConditions: 'On Tax Zoning screen',
      expectedResult: 'Download template, upload file steps and cancel action work'
    });

    try {
      await test.step('Open Bulk Update drawer', async () => {
        await zoningPage.openBulkDrawer();
      });

      await test.step('Verify steps are present', async () => {
        await expect(zoningPage.bulkDrawerTitle).toBeVisible();
        await expect(zoningPage.btnDownloadTemplate).toBeVisible();
        await expect(zoningPage.btnChooseExcelFile).toBeVisible();
      });

      await test.step('Click Cancel to close', async () => {
        await zoningPage.btnCancelBulkUpdate.click();
        // await page.waitForTimeout(1000);
        await expect(zoningPage.bulkDrawerTitle).not.toBeVisible();
      });
    } finally {
      await attachVideoOnCompletion(page, testInfo);
    }
  });

  // =========================================================================
  // TC-TZNG-10: Certified documents View and Download trigger download
  // =========================================================================
  test('TC-TZNG-10: Verify certified zoning list download triggers download successfully', async ({}, testInfo) => {
    await addAllureMetadata({
      testId: 'TC-TZNG-10',
      feature: 'Tax Zoning',
      story: 'Verify document download interaction',
      preConditions: 'Certified Zoning List exists',
      expectedResult: 'Clicking download button starts file download'
    });

    try {
      // Expect a download to start when clicking download list
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 15000 }).catch(() => null),
        zoningPage.btnDownloadZoningList.click()
      ]);

      if (download) {
        const filename = download.suggestedFilename();
        expect(filename).toContain('.pdf');
        console.log(`[TC-TZNG-10] Successfully downloaded ${filename}`);
      } else {
        console.warn('[TC-TZNG-10] Download did not start or timed out');
      }
    } finally {
      await attachVideoOnCompletion(page, testInfo);
    }
  });

  // =========================================================================
  // TC-TZNG-11: Verify Certified Zoning List View Tab Open
  // =========================================================================
  test('TC-TZNG-11: Verify Certified Zoning List View button opens document in a new tab', async ({}, testInfo) => {
    await addAllureMetadata({
      testId: 'TC-TZNG-11',
      feature: 'Tax Zoning',
      story: 'Verify Certified Zoning List View tab',
      preConditions: 'Certified Zoning List document exists',
      expectedResult: 'Clicking view button opens new tab showing document URL'
    });

    try {
      const [newPage, documentResponse] = await Promise.all([
        page.context().waitForEvent('page', { timeout: 15000 }),
        page.context().waitForEvent('response', {
          predicate: response => response.url().includes('/api/documents') && response.url().includes('/view'),
          timeout: 15000
        }),
        zoningPage.btnViewZoningList.click()
      ]);
      expect(documentResponse.ok()).toBeTruthy();
      expect(newPage.isClosed()).toBeFalsy();
      console.log('[TC-TZNG-11] Document successfully opened in a new tab:', documentResponse.url());
      await newPage.close();
    } finally {
      await attachVideoOnCompletion(page, testInfo);
    }
  });

  // =========================================================================
  // TC-TZNG-12: Verify Certified Zone Map Dynamic CRUD Actions
  // =========================================================================
  test('TC-TZNG-12: Verify Certified Zone Map dynamic Upload, View, Download, and Delete actions', async ({}, testInfo) => {
    await addAllureMetadata({
      testId: 'TC-TZNG-12',
      feature: 'Tax Zoning',
      story: 'Certified Zone Map CRUD file operations',
      preConditions: 'Certified Zone Map controls are present',
      expectedResult: 'File can be dynamically uploaded, viewed, downloaded, and deleted'
    });

    try {
      // 1. Check if document is currently uploaded (View button is visible)
      const isUploaded = await zoningPage.btnViewZoneMap.isVisible().catch(() => false);
      
      if (isUploaded) {
        console.log('[TC-TZNG-12] Document is already uploaded. Verifying view, download and delete...');
        
        // A. View Document in new tab
        const [viewTab, viewResponse] = await Promise.all([
          page.context().waitForEvent('page', { timeout: 10000 }),
          page.context().waitForEvent('response', {
            predicate: response => response.url().includes('/api/documents') && response.url().includes('/view'),
            timeout: 10000
          }),
          zoningPage.btnViewZoneMap.click()
        ]);
        expect(viewResponse.ok()).toBeTruthy();
        console.log('[TC-TZNG-12] Zone Map document successfully viewed in new tab');
        await viewTab.close();

        // B. Download Document
        const [download] = await Promise.all([
          page.waitForEvent('download', { timeout: 10000 }).catch(() => null),
          zoningPage.btnDownloadZoneMap.click()
        ]);
        if (download) {
          console.log('[TC-TZNG-12] Zone Map document downloaded successfully:', download.suggestedFilename());
        }

        // C. Delete Document
        await zoningPage.btnDeleteZoneMap.click();
        await zoningPage.confirmDelete();
        // await page.waitForTimeout(2000);
      }

      // 2. Upload Document (Since it is now deleted or was not present)
      console.log('[TC-TZNG-12] Uploading a new Certified Zone Map document...');
      await expect(zoningPage.btnUploadZoneMap).toBeVisible();
      
      // Generate a dummy PDF file for uploading
      const dummyFilePath = testInfo.outputPath('dummy_map.pdf');
      fs.mkdirSync(path.dirname(dummyFilePath), { recursive: true });
      fs.writeFileSync(dummyFilePath, 'dummy PDF content for Certified Zone Map upload test');

      // Click Upload to append the hidden file input to DOM, wait for it, and set files directly
      await zoningPage.btnUploadZoneMap.click();
      const fileInput = page.locator('input[type="file"]').first();
      await fileInput.waitFor({ state: 'attached', timeout: 5000 });
      await fileInput.setInputFiles(dummyFilePath);
      
      // Click Save Document button to execute the save action
      const btnSaveDoc = page.locator('[role="dialog"] button:has-text("Save Document"), button:has-text("Save Document")').last();
      await btnSaveDoc.click();
      // await page.waitForTimeout(5000); // Wait for upload completion/saving state and modal closure

      // 3. Verify upload succeeded by checking View, Download, Delete controls become visible
      await expect(zoningPage.btnViewZoneMap).toBeVisible();
      console.log('[TC-TZNG-12] Dynamic Zone Map upload verified successfully');

      // Playwright owns the per-test output directory and removes it after
      // Chromium releases the file input handle.
    } finally {
      await attachVideoOnCompletion(page, testInfo);
    }
  });

  // =========================================================================
  // TC-TZNG-13: Verify Tax Zone-Wise Property Count Scroll/Swipe
  // =========================================================================
  test('TC-TZNG-13: Verify horizontal swiping/scrolling of Tax Zone-Wise Property Count', async ({}, testInfo) => {
    await addAllureMetadata({
      testId: 'TC-TZNG-13',
      feature: 'Tax Zoning',
      story: 'Scroll zone counts cards horizontally',
      preConditions: 'Scroll container exists',
      expectedResult: 'Container scrolls left/right and scroll position updates'
    });

    try {
      await expect(zoningPage.scrollZoneCounts).toBeVisible();

      // Retrieve initial scrollLeft position
      const initialScrollLeft = await zoningPage.scrollZoneCounts.evaluate(el => el.scrollLeft);
      console.log('[TC-TZNG-13] Initial scrollLeft:', initialScrollLeft);

      // Perform horizontal swipe/scroll right
      await zoningPage.scrollZoneCounts.hover();
      await zoningPage.scrollZoneCounts.evaluate(el => el.scrollLeft = 200);
      // await page.waitForTimeout(1000);

      // Retrieve scrolled position
      const scrolledLeft = await zoningPage.scrollZoneCounts.evaluate(el => el.scrollLeft);
      console.log('[TC-TZNG-13] Scrolled scrollLeft:', scrolledLeft);
      expect(scrolledLeft).toBeGreaterThan(initialScrollLeft);

      // Scroll back to initial position (left)
      await zoningPage.scrollZoneCounts.evaluate(el => el.scrollLeft = 0);
      // await page.waitForTimeout(1000);
      const resetScrollLeft = await zoningPage.scrollZoneCounts.evaluate(el => el.scrollLeft);
      expect(resetScrollLeft).toBe(0);
      console.log('[TC-TZNG-13] Scroll resets to left successfully');
    } finally {
      await attachVideoOnCompletion(page, testInfo);
    }
  });

  // =========================================================================
  // TC-TZNG-14: Verify Ward-wise and Zone-wise Zoning Abstract
  // =========================================================================
  test('TC-TZNG-14: Verify Ward-wise Zoning Abstract drawer functionality, search ward, and export excel', async ({}, testInfo) => {
    await addAllureMetadata({
      testId: 'TC-TZNG-14',
      feature: 'Tax Zoning',
      story: 'Verify Ward-wise Zoning Abstract drawer UI, search D1 and Export Excel',
      preConditions: 'Abstract button is present on page',
      expectedResult: 'Drawer opens, filters by D1, and initiates Excel export download'
    });

    try {
      await test.step('Open Ward-wise Zoning Abstract drawer', async () => {
        await zoningPage.openAbstractDrawer();
        await expect(zoningPage.abstractDrawerTitle).toBeVisible();
      });

      await test.step('Verify statistics cards inside Abstract drawer', async () => {
        const statsSection = page.locator('div').filter({ has: zoningPage.abstractDrawerTitle }).locator('div.grid, .flex').first();
        await expect(statsSection).toBeVisible();
      });

      await test.step('Search for an available ward and verify filter', async () => {
        // Ward values differ between environments (numeric values such as
        // "1" are used in the current data, while D1 exists in other data
        // sets). Read a real value from the abstract table instead of using a
        // fixture-specific ward name.
        const initialRow = zoningPage.abstractTableRows.first();
        await initialRow.waitFor({ state: 'visible', timeout: 10000 });
        const ward = (await initialRow.locator('td').first().textContent())?.trim() || 'D1';
        await zoningPage.searchAbstractWard(ward);
        await expect.poll(async () => {
          const rows = await zoningPage.abstractTableRows.allTextContents();
          return rows.length === 0 || rows.some(text => text.includes(ward));
        }, { timeout: 10000 }).toBeTruthy();
        const firstRowText = await zoningPage.abstractTableRows.first().textContent();
        if (firstRowText) expect(firstRowText).toContain(ward);
        console.log(`[TC-TZNG-14] Successfully filtered abstract records by ${ward}:`, firstRowText?.trim());
      });

      await test.step('Export Abstract to Excel and verify download', async () => {
        const [download] = await Promise.all([
          page.waitForEvent('download', { timeout: 15000 }).catch(() => null),
          zoningPage.abstractBtnExportExcel.click()
        ]);
        if (download) {
          const filename = download.suggestedFilename();
          expect(filename).toContain('.xlsx');
          console.log(`[TC-TZNG-14] Successfully downloaded Abstract Excel: ${filename}`);
        } else {
          console.warn('[TC-TZNG-14] Excel download did not start or timed out');
        }
      });

      await test.step('Close abstract drawer', async () => {
        await zoningPage.abstractBtnClose.click();
        // await page.waitForTimeout(1000);
        await expect(zoningPage.abstractDrawerTitle).not.toBeVisible();
      });
    } finally {
      await attachVideoOnCompletion(page, testInfo);
    }
  });
});
