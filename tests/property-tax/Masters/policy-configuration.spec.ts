import { internalTest as test, expect } from '../../../fixtures/internalSessionFixtures';
import { Page } from '@playwright/test';
import { PolicyConfigurationMasterPage } from '../../../pages/property-tax/Masters/Policy-configuration-master';
import { failBlockedFeature } from '../../../helpers/allureHelper';

// Keep source order on the single worker without serial-mode skip cascading.
test.describe.configure({ mode: 'default' });
test.describe('Property Tax - Policy Configuration Master', () => {
  let page: Page;
  let policyConfigurationMasterPage: PolicyConfigurationMasterPage;
  let screenBlockReason: string | undefined;

  test.beforeAll(async ({ internalSession }) => {
    page = internalSession.page;
    policyConfigurationMasterPage = internalSession.policyConfigurationMasterPage;
    try {
      await policyConfigurationMasterPage.navigateFromPropertyTaxModule();
      await policyConfigurationMasterPage.expectLoaded();
    } catch (error) {
      screenBlockReason = error instanceof Error ? error.message : String(error);
    }
  });

  test.beforeEach(async () => {
    if (screenBlockReason) {
      await failBlockedFeature(`Policy Configuration Master is not available or could not be opened on the QA server.\n\n${screenBlockReason}`);
    }
  });

  test('TC01 - Policy Configuration page load', async () => {
    await expect(policyConfigurationMasterPage.searchField).toBeVisible();
    await expect(policyConfigurationMasterPage.tableRows.first()).toBeVisible();
  });

  test('TC02 - Search with valid code', async () => {
    await policyConfigurationMasterPage.searchPolicy('AssessmentYear');
    await expect(policyConfigurationMasterPage.assessmentYearRecord).toBeVisible();
    await expect(policyConfigurationMasterPage.noDataMessage).not.toBeVisible();
  });

  test('TC03 - Search with invalid code', async () => {
    await policyConfigurationMasterPage.clearSearch();
    await policyConfigurationMasterPage.searchPolicy('XYZ12345');
    await expect(policyConfigurationMasterPage.noDataMessage).toBeVisible();
  });

  test('TC04 - Blank search shows records', async () => {
    await policyConfigurationMasterPage.clearSearch();
    await expect(policyConfigurationMasterPage.tableRows.first()).toBeVisible();
    await expect(policyConfigurationMasterPage.noDataMessage).not.toBeVisible();
  });

  test('TC05 - Special character search is handled', async () => {
    await policyConfigurationMasterPage.searchPolicy('@#$%^&*');
    const rowCount = await policyConfigurationMasterPage.tableRows.count();
    const noDataVisible = await policyConfigurationMasterPage.noDataMessage.isVisible();
    expect(rowCount > 0 || noDataVisible).toBeTruthy();
  });

  test('TC06 - AssessmentYear record shows expected details', async () => {
    await policyConfigurationMasterPage.searchPolicy('AssessmentYear');
    const row = await policyConfigurationMasterPage.getAssessmentYearRow();
    await expect(row).toContainText('AssessmentYear');
    await expect(row).toContainText('General');
    await expect(row).toContainText('Assessment Base Year');
  });

  test('TC07 - Edit and toggle Active status', async () => {
    await policyConfigurationMasterPage.searchPolicy('AssessmentYear');
    await policyConfigurationMasterPage.clickAssessmentYearEdit();
    const result = await policyConfigurationMasterPage.toggleStatus();
    expect(result.newState).not.toBe(result.oldState);
    await policyConfigurationMasterPage.clickUpdate();
    await expect(policyConfigurationMasterPage.successMessage).toBeVisible({ timeout: 10000 });

    await policyConfigurationMasterPage.clickAssessmentYearEdit();
    await policyConfigurationMasterPage.toggleStatus();
    await policyConfigurationMasterPage.clickUpdate();
  });

  test('TC08 - AssessmentYear status is valid', async () => {
    await policyConfigurationMasterPage.searchPolicy('AssessmentYear');
    await expect(await policyConfigurationMasterPage.getAssessmentYearRow()).toBeVisible();
    expect(['Active', 'Inactive']).toContain(await policyConfigurationMasterPage.getAssessmentYearStatus());
  });

  test('TC09 - Edit sidebar opens', async () => {
    await policyConfigurationMasterPage.searchPolicy('AssessmentYear');
    await policyConfigurationMasterPage.clickAssessmentYearEdit();
    await expect(policyConfigurationMasterPage.policyValueInput).toBeVisible();
    await expect(policyConfigurationMasterPage.unitInput).toBeVisible();
    await expect(policyConfigurationMasterPage.updateButton).toBeVisible();
    await policyConfigurationMasterPage.closeEditDrawer();
  });

  test('TC10 - Policy value can be updated', async () => {
    await policyConfigurationMasterPage.searchPolicy('AssessmentYear');
    await policyConfigurationMasterPage.clickAssessmentYearEdit();
    const originalValue = await policyConfigurationMasterPage.getPolicyValue();
    await policyConfigurationMasterPage.enterPolicyValue('25');
    await policyConfigurationMasterPage.clickUpdate();
    await expect(policyConfigurationMasterPage.successMessage).toBeVisible({ timeout: 10000 });
    await policyConfigurationMasterPage.clearSearch();
    await policyConfigurationMasterPage.searchPolicy('AssessmentYear');
    expect(await policyConfigurationMasterPage.getTablePolicyValue()).toBe('25');

    await policyConfigurationMasterPage.clickAssessmentYearEdit();
    await policyConfigurationMasterPage.enterPolicyValue(originalValue);
    await policyConfigurationMasterPage.clickUpdate();
  });

  test('TC11 - Policy value trims spaces', async () => {
    await policyConfigurationMasterPage.searchPolicy('AssessmentYear');
    await policyConfigurationMasterPage.clickAssessmentYearEdit();
    await policyConfigurationMasterPage.enterPolicyValue('   ');
    const value = await policyConfigurationMasterPage.getPolicyValue();
    expect(value).not.toContain(' ');
    expect(value.trim()).toBe('');
    await policyConfigurationMasterPage.closeEditDrawer();
  });

  test('TC12 - Policy value rejects spaces between values', async () => {
    await policyConfigurationMasterPage.searchPolicy('AssessmentYear');
    await policyConfigurationMasterPage.clickAssessmentYearEdit();
    await policyConfigurationMasterPage.enterPolicyValue('25 50');
    expect(await policyConfigurationMasterPage.getPolicyValue()).not.toContain(' ');
    await policyConfigurationMasterPage.closeEditDrawer();
  });

  test('TC13 - Blank policy value shows required validation', async () => {
    await policyConfigurationMasterPage.searchPolicy('AssessmentYear');
    await policyConfigurationMasterPage.clickAssessmentYearEdit();
    await policyConfigurationMasterPage.enterPolicyValue('');
    await policyConfigurationMasterPage.clickUpdate();
    await expect(policyConfigurationMasterPage.requiredMessage).toBeVisible({ timeout: 5000 });
    await expect(policyConfigurationMasterPage.policyValueInput).toBeVisible();
    await expect(policyConfigurationMasterPage.unitInput).toBeVisible();
    await expect(policyConfigurationMasterPage.updateButton).toBeVisible();
    await policyConfigurationMasterPage.closeEditDrawer();
  });

  test('TC14 - Unit accepts spaces', async () => {
    await policyConfigurationMasterPage.searchPolicy('AssessmentYear');
    await policyConfigurationMasterPage.clickAssessmentYearEdit();
    await policyConfigurationMasterPage.enterPolicyValue('25');
    await policyConfigurationMasterPage.enterUnit('Test Unit');
    expect(await policyConfigurationMasterPage.getUnitValue()).toBe('Test Unit');
    await policyConfigurationMasterPage.closeEditDrawer();
  });

  test('TC15 - Unit can be updated', async () => {
    await policyConfigurationMasterPage.searchPolicy('AssessmentYear');
    await policyConfigurationMasterPage.clickAssessmentYearEdit();
    const originalUnit = await policyConfigurationMasterPage.getUnitValue();
    await policyConfigurationMasterPage.enterPolicyValue('25');
    await policyConfigurationMasterPage.enterUnit('Test Unit');
    await policyConfigurationMasterPage.clickUpdate();
    await expect(policyConfigurationMasterPage.successMessage).toBeVisible({ timeout: 10000 });
    await policyConfigurationMasterPage.clearSearch();
    await policyConfigurationMasterPage.searchPolicy('AssessmentYear');
    expect(await policyConfigurationMasterPage.getTableUnit()).toBe('Test Unit');

    await policyConfigurationMasterPage.clickAssessmentYearEdit();
    await policyConfigurationMasterPage.enterUnit(originalUnit);
    await policyConfigurationMasterPage.clickUpdate();
  });

  test.afterAll(async () => {
    await policyConfigurationMasterPage?.closeEditDrawer().catch(() => undefined);
  });
});
