import { Page } from '@playwright/test';
import { internalTest as test, expect } from '../../../fixtures/internalSessionFixtures';
import { TypeOfUseMasterPage } from '../../../pages/property-tax/Masters/TypeOfUseMasterPage';
import { failBlockedFeature } from '../../../helpers/allureHelper';

// Keep source order on the single worker without serial-mode skip cascading.
test.describe.configure({ mode: 'default' });
test.describe('Property Tax - Type of Use Master', () => {
  test.setTimeout(120000);

  let page: Page;
  let typeOfUsePage: TypeOfUseMasterPage;
  let screenBlockReason: string | undefined;
  const suffix = `${Date.now()}`.slice(-6);
  const groupId = `R${suffix}`;
  const groupName = `residential${suffix}`;
  const typeName = `Residential${suffix}`;
  const updatedTypeName = `${typeName} updated`;
  const subTypeName = `res-sub-${suffix}`;
  const updatedGroupName = `${groupName} updated`;

  test.beforeAll(async ({ internalSession }) => {
    page = internalSession.page;
    typeOfUsePage = new TypeOfUseMasterPage(page);
    try {
      await typeOfUsePage.navigateFromPropertyTaxModule();
      await typeOfUsePage.expectLoaded();
    } catch (error) {
      screenBlockReason = error instanceof Error ? error.message : String(error);
    }
  });

  test.beforeEach(async () => {
    if (screenBlockReason) {
      await failBlockedFeature(`Type of Use Master is not available or could not be opened on the QA server.\n\n${screenBlockReason}`);
    }
  });

  test('TC01 - validates empty Add Use Group form', async () => {
    await typeOfUsePage.openAddUseGroupForm();
    await typeOfUsePage.saveUseGroup();
    await typeOfUsePage.expectUseGroupValidation();
    await typeOfUsePage.closeForm();
  });

  test('TC02 - adds a valid use group', async () => {
    await typeOfUsePage.openAddUseGroupForm();
    await typeOfUsePage.fillUseGroup(groupId, groupName, 'home');
    await typeOfUsePage.saveUseGroup();
    await typeOfUsePage.expectUseGroupSaved(groupName);
  });

  test('TC03 - validates empty Add Type of Use form', async () => {
    await typeOfUsePage.openAddTypeOfUseForm();
    await typeOfUsePage.saveTypeOfUse();
    await typeOfUsePage.expectTypeOfUseValidation();
    await typeOfUsePage.closeForm();
  });

  test('TC04 - adds a valid type of use', async () => {
    await typeOfUsePage.openAddTypeOfUseForm();
    await typeOfUsePage.fillTypeOfUse('Residential', groupName, `RE${suffix}`, typeName);
    await typeOfUsePage.saveTypeOfUse();
    await typeOfUsePage.expectTypeOfUseSaved();
    await typeOfUsePage.selectTypeOfUse(typeName);
  });

  test('TC05 - searches for a type of use', async () => {
    await typeOfUsePage.searchTypeOfUse(typeName);
    await typeOfUsePage.expectTypeOfUseSearchResult(typeName);
  });

  test('TC06 - validates empty Add Sub-Type of Use form', async () => {
    await typeOfUsePage.selectTypeOfUse(typeName);
    await typeOfUsePage.openAddSubTypeOfUseForm();
    await typeOfUsePage.saveSubTypeOfUse();
    await typeOfUsePage.expectSubTypeOfUseValidation();
    await typeOfUsePage.closeForm();
  });

  test('TC07 - adds a valid sub-type of use', async () => {
    await typeOfUsePage.selectTypeOfUse(typeName);
    await typeOfUsePage.openAddSubTypeOfUseForm();
    await typeOfUsePage.fillSubTypeOfUse(subTypeName);
    await typeOfUsePage.saveSubTypeOfUse();
    await typeOfUsePage.expectSubTypeOfUseSaved();
  });

  test('TC08 - edits the added sub-type of use to inactive', async () => {
    await typeOfUsePage.editRecord(subTypeName, 'subType');
    await typeOfUsePage.clickInactiveButton();
    await typeOfUsePage.clickEditSubmit();
    await typeOfUsePage.expectRecordInactive(subTypeName);
  });

  test('TC09 - activates the inactive sub-type of use', async () => {
    await typeOfUsePage.editRecord(subTypeName, 'subType');
    await typeOfUsePage.clickActiveButton();
    await typeOfUsePage.clickEditSubmit();
    await typeOfUsePage.expectRecordActive(subTypeName);
  });

  test('TC10 - deletes the sub-type of use', async () => {
    await typeOfUsePage.deleteRecord(subTypeName, 'subType');
    await typeOfUsePage.expectRecordDeleted(subTypeName);
  });

  test('TC11 - edits the added type of use to inactive', async () => {
    await typeOfUsePage.editRecord(typeName, 'type');
    await typeOfUsePage.clickInactiveButton();
    await typeOfUsePage.clickEditSubmit();
    await typeOfUsePage.expectTypeOfUseInactive(typeName);
  });

  test('TC12 - activates the inactive type of use', async () => {
    await typeOfUsePage.editRecord(typeName, 'type');
    await typeOfUsePage.clickActiveButton();
    await typeOfUsePage.clickEditSubmit();
    await typeOfUsePage.expectTypeOfUseActive(typeName);
  });

  test('TC13 - updates the type of use', async () => {
    await typeOfUsePage.updateRecord(typeName, updatedTypeName, 'type');
    await typeOfUsePage.expectRecordUpdated(updatedTypeName);
  });

  test('TC14 - edits the added use group to inactive', async () => {
    await typeOfUsePage.editUseGroup(groupName);
    await typeOfUsePage.clickInactiveButton();
    await typeOfUsePage.clickEditSubmit();
    await typeOfUsePage.expectUseGroupInactive(groupName);
  });

  test('TC15 - activates the inactive use group', async () => {
    await typeOfUsePage.editUseGroup(groupName);
    await typeOfUsePage.clickActiveButton();
    await typeOfUsePage.clickEditSubmit();
    await typeOfUsePage.expectUseGroupActive(groupName);
  });

  test('TC16 - updates the use group', async () => {
    await typeOfUsePage.updateRecord(groupName, updatedGroupName, 'group');
    await typeOfUsePage.expectRecordUpdated(updatedGroupName);
  });

  test('TC17 - deletes the updated type of use before its group', async () => {
    await typeOfUsePage.deleteRecord(updatedTypeName, 'type');
    await typeOfUsePage.expectRecordDeleted(updatedTypeName);
  });

  test('TC18 - deletes the updated use group', async () => {
    await typeOfUsePage.deleteRecord(updatedGroupName, 'group');
    await typeOfUsePage.expectRecordDeleted(updatedGroupName);
  });
});
