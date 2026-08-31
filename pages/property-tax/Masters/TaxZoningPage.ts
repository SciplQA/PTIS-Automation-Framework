import { Locator, Page } from '@playwright/test';
import { PropertyTaxBasePage } from '../PropertyTaxBasePage';

type ZoningFormData = {
  ward?: string;
  from?: string;
  to?: string;
  zone?: string;
  description?: string;
};

/**
 * Page Object Model: Masters > Tax Zoning
 */
export class TaxZoningPage extends PropertyTaxBasePage {
  readonly pageHeading: Locator;
  readonly viewRecordsHeading: Locator;
  readonly btnViewZoningList: Locator;
  readonly btnDownloadZoningList: Locator;
  readonly btnDeleteZoningList: Locator;
  readonly btnViewZoneMap: Locator;
  readonly btnDownloadZoneMap: Locator;
  readonly btnDeleteZoneMap: Locator;
  readonly btnUploadZoneMap: Locator;
  readonly cardTotalProperties: Locator;
  readonly cardPropertiesCovered: Locator;
  readonly cardPropertiesPending: Locator;
  readonly scrollZoneCounts: Locator;
  readonly filterWardInput: Locator;
  readonly filterFromInput: Locator;
  readonly filterToInput: Locator;
  readonly filterZoneInput: Locator;
  readonly filterDescriptionInput: Locator;
  readonly btnApplyFilters: Locator;
  readonly btnResetFilters: Locator;
  readonly btnPendingList: Locator;
  readonly btnExportExcel: Locator;
  readonly btnZoningAbstract: Locator;
  readonly btnOpenAddDrawer: Locator;
  readonly btnOpenBulkDrawer: Locator;
  readonly tableRows: Locator;
  readonly rowsPerPageSelect: Locator;
  readonly paginationInfo: Locator;
  readonly addDrawerTitle: Locator;
  readonly btnSelectWardCombobox: Locator;
  readonly addFromInput: Locator;
  readonly addToInput: Locator;
  readonly addTaxZoneInput: Locator;
  readonly addDescriptionTextarea: Locator;
  readonly btnResetAddForm: Locator;
  readonly btnSaveAddRange: Locator;
  readonly bulkDrawerTitle: Locator;
  readonly btnDownloadTemplate: Locator;
  readonly btnChooseExcelFile: Locator;
  readonly bulkFileInput: Locator;
  readonly btnCancelBulkUpdate: Locator;
  readonly btnValidateUpdate: Locator;
  readonly editDrawerTitle: Locator;
  readonly btnSaveUpdateRange: Locator;
  readonly btnDrawerCloseX: Locator;
  readonly abstractDrawerTitle: Locator;
  readonly abstractSearchInput: Locator;
  readonly abstractBtnSearch: Locator;
  readonly abstractBtnExportExcel: Locator;
  readonly abstractBtnClose: Locator;
  readonly abstractTableRows: Locator;

  constructor(page: Page) {
    super(page);

    // ── Page Heading & Loaded Indicator ──────────────────────────────────────
    this.pageHeading = page.locator('h2').filter({ hasText: /Certified Zoning Documents/i }).first();
    this.viewRecordsHeading = page.locator('h2').filter({ hasText: /View Tax Zoning Records/i }).first();

    // ── Certified Zoning Documents Section ───────────────────────────────────
    // Certified Zoning List
    this.btnViewZoningList = page.locator('button[aria-label="View"]').first();
    this.btnDownloadZoningList = page.locator('button[aria-label="Download"]').first();
    this.btnDeleteZoningList = page.locator('button[aria-label="Delete"]').first();
    
    // Certified Zone Map
    this.btnViewZoneMap = page.locator('button[aria-label="View"]').nth(1);
    this.btnDownloadZoneMap = page.locator('button[aria-label="Download"]').nth(1);
    this.btnDeleteZoneMap = page.locator('button[aria-label="Delete"]').nth(1);
    this.btnUploadZoneMap = page.locator('div').filter({ has: page.locator('span, div', { hasText: /Certified Zone Map/i }) }).locator('button:has-text("Upload"), button:has(svg.lucide-upload)').first();

    // ── Stats Cards ──────────────────────────────────────────────────────────
    this.cardTotalProperties = page.locator('div, span, p').filter({ hasText: /TOTAL PROPERTIES/i }).first();
    this.cardPropertiesCovered = page.locator('div, span, p').filter({ hasText: /PROPERTIES COVERED IN ZONING/i }).first();
    this.cardPropertiesPending = page.locator('div, span, p').filter({ hasText: /PROPERTIES PENDING FOR ZONING/i }).first();
    this.scrollZoneCounts = page.locator('span, div').filter({ hasText: /^Zone 1$/ }).locator('xpath=./ancestor::div[contains(@class, "overflow-x-auto")][1]');

    // ── Main Page Filters ────────────────────────────────────────────────────
    this.filterWardInput = page.locator('input#filterWard');
    this.filterFromInput = page.locator('input#filterFrom');
    this.filterToInput = page.locator('input#filterTo');
    this.filterZoneInput = page.locator('input#filterZone');
    this.filterDescriptionInput = page.locator('input[placeholder="Search locality or zoning description"]');
    
    this.btnApplyFilters = page.locator('button:has-text("Apply")');
    this.btnResetFilters = page.locator('button:has-text("Reset")');

    // ── Buttons / Actions on Records ─────────────────────────────────────────
    this.btnPendingList = page.locator('button:has-text("Pending List")');
    this.btnExportExcel = page.locator('button:has-text("Export Excel")');
    this.btnZoningAbstract = page.locator('button:has-text("Ward-wise Zoning Abstract")');
    
    // Add Range
    this.btnOpenAddDrawer = page.locator('button:has-text("Add Zoning Range")');
    
    // Bulk Update
    this.btnOpenBulkDrawer = page.locator('button:has-text("Bulk Update")');

    // ── Table ─────────────────────────────────────────────────────────────────
    this.tableRows = page.locator('table tbody tr');
    this.rowsPerPageSelect = page.locator('select[aria-label="Rows per page"]');
    this.paginationInfo = page.locator('div, span, p').filter({ hasText: /Showing \d+ to \d+ of \d+ entries/i }).first();

    // ── Add Zoning Range Drawer ──────────────────────────────────────────────
    this.addDrawerTitle = page.locator('text=Add Zoning Range').first();
    this.btnSelectWardCombobox = page.locator('button:has-text("Select ward")').first();
    
    // In the drawer, "Property From" is the first search-select input, and "Property To" is the second
    this.addFromInput = page.locator('input#search-select').first();
    this.addToInput = page.locator('input#search-select').nth(1);
    this.addTaxZoneInput = page.locator('input#taxZone');
    this.addDescriptionTextarea = page.locator('textarea[placeholder*="Describe the locality"]').first();
    
    this.btnResetAddForm = page.locator('button:has-text("Reset Form")');
    this.btnSaveAddRange = page.locator('button[type="submit"]:has-text("Save")');
    
    // ── Bulk Tax Zone Update Drawer ──────────────────────────────────────────
    this.bulkDrawerTitle = page.locator('text=Bulk Tax Zone Update').first();
    this.btnDownloadTemplate = page.locator('button:has-text("Download Excel Template")');
    this.btnChooseExcelFile = page.locator('button:has-text("Choose Excel File")');
    this.bulkFileInput = page.locator('input[type="file"]');
    this.btnCancelBulkUpdate = page.locator('button:has-text("Cancel")').last();
    this.btnValidateUpdate = page.locator('button:has-text("Validate & Update")');

    // ── Update/Edit Drawer ───────────────────────────────────────────────────
    this.editDrawerTitle = page.locator('text=Update Zoning Range').first();
    this.btnSaveUpdateRange = page.locator('button[type="submit"]:has-text("Save")'); // Same save button but has update title

    // ── Shared Drawer close button (X) ───────────────────────────────────────
    this.btnDrawerCloseX = page.locator('button:has(svg.lucide-x)').first();

    // ── Ward-wise Zoning Abstract Drawer ─────────────────────────────────────
    this.abstractDrawerTitle = page.locator('text=Ward-wise and Zone-wise Zoning Abstract').first();
    this.abstractSearchInput = page.locator('input[placeholder="Search ward no..."]');
    this.abstractBtnSearch = page.locator('button:has-text("Search"), button:has(svg.lucide-search)');
    this.abstractBtnExportExcel = page.locator('div').filter({ has: this.abstractDrawerTitle }).locator('button:has-text("Export Excel")').first();
    this.abstractBtnClose = page.locator('div').filter({ has: this.abstractDrawerTitle }).locator('button.text-gray-400').first();
    this.abstractTableRows = page.locator('div').filter({ has: this.abstractDrawerTitle }).locator('table tbody tr');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Core Actions
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Verify the Tax Zoning page loads correctly
   */
  async navigateFromPropertyTaxModule(): Promise<void> {
    await this.selectMasterSubmenu('Tax Zoning');
  }

  async verifyPageLoaded(): Promise<void> {
    await this.pageHeading.waitFor({ state: 'visible', timeout: 15000 });
    await this.viewRecordsHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Click Apply filters button
   */
  async clickApply(): Promise<void> {
    await this.btnApplyFilters.click();
    // await this.page.waitForTimeout(1000);
  }

  /**
   * Click Reset filters button
   */
  async clickReset(): Promise<void> {
    await this.btnResetFilters.click();
    // await this.page.waitForTimeout(1000);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Combobox & Dropdown Helpers
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Select option from a generic input combobox dropdown
   */
  async selectComboboxOption(inputLocator: Locator, optionText: string): Promise<void> {
    await inputLocator.click();
    // await this.page.waitForTimeout(500);
    const option = this.page.locator('[role="option"], ul li, [role="listbox"] [role="option"]').filter({ hasText: optionText }).first();
    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.click();
    // await this.page.waitForTimeout(500);
  }

  /**
   * Select a ward option from the multiselect button dropdown in the Add drawer
   */
  async selectWardOption(optionText: string): Promise<void> {
    await this.btnSelectWardCombobox.click();
    // await this.page.waitForTimeout(500);
    const option = this.page.locator('[role="option"], ul li, [role="listbox"] [role="option"]').filter({ hasText: optionText }).first();
    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.click();
    // await this.page.waitForTimeout(500);
    // Click dropdown button again to close overlay
    await this.btnSelectWardCombobox.click();
    // await this.page.waitForTimeout(500);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Table Helpers
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Get row count
   */
  async getRowCount(): Promise<number> {
    return await this.tableRows.count();
  }

  /**
   * Get row by Ward No. and Property Range
   */
  getRowByDetails(wardNo: string, propertyRange: string): Locator {
    return this.page.locator('table tbody tr')
      .filter({ hasText: wardNo })
      .filter({ hasText: propertyRange })
      .first();
  }

  /**
   * Click Edit for a specific row
   */
  async clickEditForRow(wardNo: string, propertyRange: string): Promise<void> {
    const row = this.getRowByDetails(wardNo, propertyRange);
    await row.locator('button[aria-label="Edit"]').click();
    // await this.page.waitForTimeout(1000);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Add / Edit form methods
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Open the Add Zoning Range drawer
   */
  async openAddDrawer(): Promise<void> {
    await this.btnOpenAddDrawer.click();
    await this.addDrawerTitle.waitFor({ state: 'visible', timeout: 8000 });
  }

  /**
   * Close the currently open drawer using top-right X button
   */
  async closeDrawerViaX(): Promise<void> {
    await this.btnDrawerCloseX.click();
    // await this.page.waitForTimeout(1000);
  }

  /** Fill the Add/Edit form. */
  async fillForm({ ward, from, to, zone, description }: ZoningFormData): Promise<void> {
    if (ward) {
      await this.selectWardOption(ward);
    }
    if (from) {
      await this.selectComboboxOption(this.addFromInput, from);
    }
    if (to) {
      await this.selectComboboxOption(this.addToInput, to);
    }
    if (zone) {
      await this.selectComboboxOption(this.addTaxZoneInput, zone);
    }
    if (description) {
      await this.addDescriptionTextarea.clear();
      await this.addDescriptionTextarea.fill(description);
    }
  }

  /**
   * Open the Bulk Tax Zone Update drawer
   */
  async openBulkDrawer(): Promise<void> {
    await this.btnOpenBulkDrawer.click();
    await this.bulkDrawerTitle.waitFor({ state: 'visible', timeout: 8000 });
  }

  /**
   * Confirm Delete inside confirmation modal dialog
   */
  async confirmDelete(): Promise<void> {
    const confirmBtn = this.page.locator('[role="dialog"] button:has-text("Delete"), [role="alertdialog"] button:has-text("Delete"), button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Yes, Delete")').last();
    await confirmBtn.waitFor({ state: 'visible', timeout: 5000 });
    await confirmBtn.click();
    // await this.page.waitForTimeout(1000);
  }

  /**
   * Open the Ward-wise Zoning Abstract drawer
   */
  async openAbstractDrawer(): Promise<void> {
    await this.btnZoningAbstract.click();
    await this.abstractDrawerTitle.waitFor({ state: 'visible', timeout: 8000 });
  }

  /**
   * Search for a ward in the Abstract drawer
   */
  async searchAbstractWard(wardName: string): Promise<void> {
    await this.abstractSearchInput.clear();
    await this.abstractSearchInput.fill(wardName);
    await this.abstractBtnSearch.first().click();
    // await this.page.waitForTimeout(2000);
  }
}
