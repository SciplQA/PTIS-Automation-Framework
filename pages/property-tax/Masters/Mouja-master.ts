import { expect, Locator, Page } from '@playwright/test';
import { PropertyTaxBasePage } from '../PropertyTaxBasePage';

export class MoujaMasterPage extends PropertyTaxBasePage {
  readonly searchField: Locator;
  readonly table: Locator;
  readonly tableRows: Locator;
  readonly moujaNumberCells: Locator;
  readonly moujaNameCells: Locator;
  readonly statusCells: Locator;
  readonly noDataMessage: Locator;
  readonly duplicateMoujaMessage: Locator;
  readonly addMoujaButton: Locator;
  readonly addMoujaDrawer: Locator;
  readonly moujaNumberInput: Locator;
  readonly moujaNameInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly closeDrawerButton: Locator;

  // Edit
  readonly editButtons: Locator;
  readonly editMoujaDrawer: Locator;
  readonly editMoujaNumberInput: Locator;
  readonly editMoujaNameInput: Locator;
  readonly editActiveStatusSwitch: Locator;
  readonly editCancelButton: Locator;
  readonly editUpdateButton: Locator;

  // Language
  readonly userProfileName: Locator;
  readonly userMenu: Locator;
  readonly languageButton: Locator;
  readonly languageOptions: Locator;
  readonly marathiLanguageOption: Locator;
  readonly englishLanguageOption: Locator;

  // Marathi / English Page Verification
  readonly moujaPageTitle: Locator;
  readonly moujaPageSubtitle: Locator;
  readonly searchPlaceholder: Locator;
  readonly addMoujaButtonText: Locator;
  readonly tableHeaders: Locator;
  readonly tableFooterText: Locator;
  readonly rowsPerPageText: Locator;

  constructor(page: Page) {
    super(page);

    // ==========================================
    // SEARCH
    // ==========================================

    this.searchField = page.getByPlaceholder(
      'Search by Mouja Number or Name...'
    );

    // ==========================================
    // TABLE
    // ==========================================

    this.table = page.locator('table');

    this.tableRows = page.locator(
      'table tbody tr'
    );

    this.moujaNumberCells = page.locator(
      'table tbody tr td:nth-child(1)'
    );

    this.moujaNameCells = page.locator(
      'table tbody tr td:nth-child(2)'
    );

    this.statusCells = page.locator(
      'table tbody tr td:nth-child(3)'
    );

    this.noDataMessage = page.getByText(
      'No data available',
      {
        exact: true
      }
    );

    // ==========================================
    // ADD MOUJA
    // ==========================================

    this.duplicateMoujaMessage = page.getByText(
      'Please check Mouja Number and Name - duplicates not allowed.',
      {
        exact: true
      }
    );

    this.addMoujaButton = page.getByRole(
      'button',
      {
        name: 'Add Mouja',
        exact: true
      }
    );

    /*
     * IMPORTANT:
     * Do not identify Add Mouja drawer only by
     * hasText: 'Add Mouja'.
     *
     * The form inputs are stable identifiers of
     * the actual Add Mouja drawer.
     */
    this.addMoujaDrawer = page
      .locator('[role="dialog"], [aria-modal="true"]')
      .filter({ hasText: /Add Mouja|Create new mouja/i })
      .first();

    this.moujaNumberInput =
      this.addMoujaDrawer.locator(
        'input[name="moujaNo"]'
      );

    this.moujaNameInput =
      this.addMoujaDrawer.locator(
        'input[name="moujaName"]'
      );

    this.saveButton =
      this.addMoujaDrawer.getByRole(
        'button',
        {
          name: 'Save',
          exact: true
        }
      );

    this.cancelButton =
      this.addMoujaDrawer.getByRole(
        'button',
        {
          name: 'Cancel',
          exact: true
        }
      );

    this.closeDrawerButton =
      this.addMoujaDrawer
        .locator(
          'button:has(svg.lucide-x)'
        )
        .first();

    // ==========================================
    // EDIT MOUJA
    // ==========================================

    this.editButtons = page.locator(
      'button[aria-label="Edit"]'
    );

    this.editMoujaDrawer = page
      .locator(
        'div.drawer-instance[role="dialog"][aria-modal="true"]'
      )
      .filter({
        hasText: 'Edit Mouja'
      })
      .first();

    this.editMoujaNumberInput =
      this.editMoujaDrawer.locator(
        'input[name="moujaNo"]'
      );

    this.editMoujaNameInput =
      this.editMoujaDrawer.locator(
        'input[name="moujaName"]'
      );

    /*
     * IMPORTANT:
     * Keep switch locator role-only.
     */
    this.editActiveStatusSwitch =
      this.editMoujaDrawer.getByRole(
        'switch'
      );

    this.editCancelButton =
      this.editMoujaDrawer.getByRole(
        'button',
        {
          name: 'Cancel',
          exact: true
        }
      );

    this.editUpdateButton =
      this.editMoujaDrawer.getByRole(
        'button',
        {
          name: 'Update',
          exact: true
        }
      );

    // ==========================================
    // USER MENU / LANGUAGE
    // ==========================================

    this.userProfileName =
      this.page
        .locator('span')
        .filter({
          hasText: /^Admin scipl pvt$/
        })
        .first();

    this.userMenu =
      this.page.locator(
        '#header-user-menu'
      );

    this.languageButton =
      this.userMenu.getByRole(
        'button',
        {
          name: /Language/
        }
      );

    /*
     * Language options are inside a listbox.
     *
     * Actual DOM:
     *
     * <div role="listbox">
     *   <button role="option">English</button>
     *   <button role="option">हिंदी (Hindi)</button>
     *   <button role="option">मराठी (Marathi)</button>
     * </div>
     *
     * Keep the locator scoped to the listbox.
     */
    this.languageOptions =
      this.page
        .getByRole('listbox')
        .getByRole('option');

    this.marathiLanguageOption =
      this.page
        .getByRole('listbox')
        .getByRole('option', {
          name: 'मराठी (Marathi)',
          exact: true
        });

    this.englishLanguageOption =
      this.page
        .getByRole('listbox')
        .getByRole('option', {
          name: 'English',
          exact: true
        });

    // ==========================================
    // LANGUAGE PAGE ELEMENTS
    // ==========================================

    this.moujaPageTitle =
      this.page
        .locator('h1')
        .filter({
          hasText: /मौजा मास्टर|Mouja Master/
        })
        .first();

    this.moujaPageSubtitle =
      this.page.locator(
        'h1 + p'
      ).first();

    this.searchPlaceholder =
      this.page.locator(
        'input[placeholder]'
      ).first();

    this.addMoujaButtonText =
      this.page
        .getByRole('button')
        .filter({
          hasText: /मौजा जोड़ें|Add Mouja/
        })
        .first();

    this.tableHeaders =
      this.page.locator(
        'thead th'
      );

    this.tableFooterText =
      this.page
        .locator(
          'div.flex.items-center.gap-4'
        )
        .filter({
          hasText: /दिखा रहा है|Showing/
        })
        .first();

    this.rowsPerPageText =
      this.page.getByRole(
        'combobox'
      );
  }


  // NAVIGATION
  async navigateFromPropertyTaxModule(): Promise<void> {
    // The responsive shell keeps an off-screen mobile sidebar in the DOM.
    // Navigate to the canonical route directly; expectLoaded below remains
    // the readiness check and avoids a viewport-dependent hover.
    await this.page.goto('/en/property-tax/moujamaster', {
      waitUntil: 'domcontentloaded'
    });
  }
  async expectLoaded(): Promise<void> {
    await this.page.waitForURL(
      '**/en/property-tax/moujamaster'
    );

    await this.searchField.waitFor({
      state: 'visible'
    });
  }

  // SEARCH
  async searchMouja(
    searchText: string
  ): Promise<void> {
    await this.searchField.fill(
      searchText
    );

    await this.waitForSearchResults(
      searchText
    );
  }
  async clearSearch(): Promise<void> {
    await this.searchField.fill('');

    await expect(
      this.searchField
    ).toHaveValue('');

    await expect(
      this.noDataMessage
    ).toBeHidden({
      timeout: 5000
    });

    await expect.poll(
      async () =>
        this.getRowCount(),
      {
        timeout: 5000,
        message:
          'Mouja records did not reload after clearing search'
      }
    ).toBeGreaterThan(0);
  }
  private async waitForSearchResults(
    searchText: string
  ): Promise<void> {
    const normalizedSearch =
      searchText
        .trim()
        .toLowerCase();

    await expect.poll(
      async () => {
        if (
          await this.noDataMessage.isVisible()
        ) {
          return true;
        }

        const rows =
          await this.getRowTexts();

        if (!normalizedSearch) {
          return rows.length > 0;
        }

        return (
          rows.length > 0 &&
          rows.every(row =>
            row
              .toLowerCase()
              .includes(
                normalizedSearch
              )
          )
        );
      },
      {
        timeout: 5000,
        message:
          `Mouja results did not refresh for search: ${searchText}`
      }
    ).toBeTruthy();
  }
  async getRowCount(): Promise<number> {
    return this.tableRows
      .filter({
        hasNotText:
          'No data available'
      })
      .count();
  }
  async getMoujaNumbers(): Promise<string[]> {
    return this.tableRows
      .filter({
        hasNotText:
          'No data available'
      })
      .locator(
        'td:nth-child(1)'
      )
      .allTextContents();
  }
  async getMoujaNames(): Promise<string[]> {
    return this.tableRows
      .filter({
        hasNotText:
          'No data available'
      })
      .locator(
        'td:nth-child(2)'
      )
      .allTextContents();
  }
  async getStatuses(): Promise<string[]> {
    return this.tableRows
      .filter({
        hasNotText:
          'No data available'
      })
      .locator(
        'td:nth-child(3)'
      )
      .allTextContents();
  }
  async getRowTexts(): Promise<string[]> {
    return this.tableRows
      .filter({
        hasNotText:
          'No data available'
      })
      .allTextContents();
  }


  // ADD MOUJA
  async clickAddMouja(): Promise<void> {
    await expect(
      this.addMoujaButton
    ).toBeVisible({
      timeout: 10000
    });

    await expect(
      this.addMoujaButton
    ).toBeEnabled({
      timeout: 10000
    });

    await this.addMoujaButton.scrollIntoViewIfNeeded();

    /*
     * Always perform the Add action.
     */
    await this.addMoujaButton.click({ force: true });

    // The PTIS shell can briefly consume the first click while a previous
    // drawer transition is finishing. Retry the action only when the dynamic
    // visibility check proves that the drawer did not open.
    try {
      await expect(this.addMoujaDrawer).toBeVisible({ timeout: 3000 });
    } catch {
      await this.addMoujaButton.click({ force: true });
      await expect(this.addMoujaDrawer).toBeVisible({ timeout: 10000 });
    }

    await expect(
      this.moujaNumberInput
    ).toBeVisible({
      timeout: 5000
    });

    await expect(
      this.moujaNameInput
    ).toBeVisible({
      timeout: 5000
    });

    await expect(this.closeDrawerButton).toBeVisible({ timeout: 5000 });

    console.log(
      'Add Mouja drawer opened successfully.'
    );
  }
  async fillMoujaNumber(
    value: string
  ): Promise<void> {
    await this.moujaNumberInput.fill(
      value
    );
  }
  async fillMoujaName(
    value: string
  ): Promise<void> {
    await this.moujaNameInput.fill(
      value
    );
  }
  async fillAddMoujaForm(
    moujaNumber: string,
    moujaName: string
  ): Promise<void> {
    await this.fillMoujaNumber(
      moujaNumber
    );

    await this.fillMoujaName(
      moujaName
    );
  }
  async clickSave(): Promise<void> {
    await this.saveButton.click();
  }
  async clickCancel(): Promise<void> {
    await this.cancelButton.click();

    await expect(
      this.addMoujaDrawer
    ).toBeHidden({
      timeout: 5000
    });

    await expect(
      this.addMoujaButton
    ).toBeEnabled();
  }
  async closeDrawer(): Promise<void> {
    await this.closeDrawerButton.click({ force: true });

    try {
      await expect(this.addMoujaDrawer).toBeHidden({ timeout: 3000 });
    } catch {
      // Validation messages can leave the header close transition unchanged;
      // Cancel is the supported fallback for closing the same drawer.
      await this.cancelButton.click({ force: true });
      await expect(this.addMoujaDrawer).toBeHidden({ timeout: 5000 });
    }

    await expect(
      this.addMoujaButton
    ).toBeEnabled();
  }
  async isAddDrawerVisible(): Promise<boolean> {
    return this.addMoujaDrawer.isVisible();
  }
  async getFieldValidation(
    field:
      | 'moujaNo'
      | 'moujaName'
  ): Promise<{
    required: boolean;
    validationMessage: string;
  }> {
    const input =
      field === 'moujaNo'
        ? this.moujaNumberInput
        : this.moujaNameInput;

    return input.evaluate(
      (
        element: HTMLInputElement
      ) => ({
        required:
          element.required,
        validationMessage:
          element.validationMessage
      })
    );
  }

  // DELET
  async getRandomMoujaRow(): Promise<Locator> {
    const rows =
      this.tableRows.filter({
        hasNotText:
          'No data available'
      });

    const rowCount =
      await rows.count();

    if (rowCount === 0) {
      throw new Error(
        'No Mouja records are available in the table.'
      );
    }

    const randomIndex =
      Math.floor(
        Math.random() * rowCount
      );

    return rows.nth(
      randomIndex
    );
  }
  async getMoujaNumberFromRow(
    row: Locator
  ): Promise<string> {
    return (
      await row
        .locator('td')
        .nth(0)
        .innerText()
    ).trim();
  }
  async getMoujaNameFromRow(
    row: Locator
  ): Promise<string> {
    return (
      await row
        .locator('td')
        .nth(1)
        .innerText()
    ).trim();
  }

  // EDIt
  async getEditButtonCount(): Promise<number> {
    return this.editButtons.count();
  }
  async getRandomEditMoujaRow(): Promise<Locator> {
    const rows =
      this.tableRows.filter({
        hasNotText:
          'No data available'
      });

    const rowCount =
      await rows.count();

    if (rowCount === 0) {
      throw new Error(
        'No Mouja records are available for editing.'
      );
    }

    const randomIndex =
      Math.floor(
        Math.random() * rowCount
      );

    return rows.nth(
      randomIndex
    );
  }
  async clickEditForRow(
    row: Locator
  ): Promise<void> {
    const editButton =
      row.getByRole(
        'button',
        {
          name: 'Edit',
          exact: true
        }
      );

    await expect(
      editButton
    ).toBeVisible({
      timeout: 5000
    });

    await editButton.scrollIntoViewIfNeeded();

    await editButton.click();

    await expect(
      this.editMoujaDrawer
    ).toBeVisible({
      timeout: 10000
    });
  }
  async openRandomEditMouja(): Promise<{
    row: Locator;
    moujaNumber: string;
    moujaName: string;
    status: string;
  }> {
    await this.clearSearch();

    const rows = this.tableRows.filter({
      hasNotText: 'No data available'
    });
    const rowCount = await rows.count();

    if (rowCount === 0) {
      throw new Error(
        'No Mouja records are available for editing.'
      );
    }

    // Filtering/searching can replace the table rows in the DOM after the
    // count is read. Retry with a fresh live locator if that rerender detaches
    // the selected row between reading it and clicking Edit.
    let lastError: unknown;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const row = rows.nth(
        Math.floor(Math.random() * rowCount)
      );

      try {
        await row.waitFor({ state: 'visible', timeout: 5000 });
        await row.scrollIntoViewIfNeeded();

        const moujaNumber = await this.getMoujaNumberFromRow(row);
        const moujaName = await this.getMoujaNameFromRow(row);
        const status = await this.getStatusFromRow(row);

        await this.clickEditForRow(row);
        await this.expectEditMoujaDrawerVisible();

        return { row, moujaNumber, moujaName, status };
      } catch (error) {
        lastError = error;
        if (attempt === 2) throw error;
        await rows.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => undefined);
      }
    }

    throw lastError instanceof Error
      ? lastError
      : new Error('Could not open a Mouja edit row.');
  }
  async expectEditMoujaDrawerVisible(): Promise<void> {
    await expect(
      this.editMoujaDrawer
    ).toBeVisible({
      timeout: 10000
    });

    await expect(
      this.editMoujaDrawer.getByText(
        'Edit Mouja',
        {
          exact: true
        }
      )
    ).toBeVisible();

    await expect(
      this.editMoujaDrawer.getByText(
        'Update mouja details',
        {
          exact: true
        }
      )
    ).toBeVisible();
  }
  async expectEditMoujaFieldsVisible(): Promise<void> {
    await expect(
      this.editMoujaNumberInput
    ).toBeVisible({
      timeout: 5000
    });

    await expect(
      this.editMoujaNameInput
    ).toBeVisible({
      timeout: 5000
    });

    await expect(
      this.editActiveStatusSwitch
    ).toBeVisible({
      timeout: 5000
    });

    await expect(
      this.editCancelButton
    ).toBeVisible({
      timeout: 5000
    });

    await expect(
      this.editUpdateButton
    ).toBeVisible({
      timeout: 5000
    });
  }
  async getEditMoujaNumberValue(): Promise<string> {
    return this.editMoujaNumberInput.inputValue();
  }
  async getEditMoujaNameValue(): Promise<string> {
    return this.editMoujaNameInput.inputValue();
  }
  async getStatusFromRow(
    row: Locator
  ): Promise<string> {
    const statusCell =
      row.locator('td').nth(2);

    await expect(
      statusCell
    ).toBeVisible({
      timeout: 5000
    });

    return (
      await statusCell.innerText()
    ).trim();
  }
  async getStatusFromRowNormalized(
    row: Locator
  ): Promise<
    'active' | 'inactive'
  > {
    const status =
      await this.getStatusFromRow(
        row
      );

    const normalizedStatus =
      status
        .toLowerCase()
        .trim();

    if (
      normalizedStatus ===
      'active'
    ) {
      return 'active';
    }

    if (
      normalizedStatus ===
      'inactive'
    ) {
      return 'inactive';
    }

    throw new Error(
      `Unexpected Mouja status "${status}". Expected Active or Inactive.`
    );
  }

  // EDIT STATUS
  async getEditActiveStatus(): Promise<boolean> {
    await expect(
      this.editActiveStatusSwitch
    ).toBeVisible({
      timeout: 5000
    });

    const ariaChecked =
      await this.editActiveStatusSwitch
        .getAttribute(
          'aria-checked'
        );

    return ariaChecked ===
      'true';
  }
  async getEditStatusLabel(): Promise<string> {
    await expect(
      this.editActiveStatusSwitch
    ).toBeVisible({
      timeout: 5000
    });

    return (
      await this.editActiveStatusSwitch
        .getAttribute(
          'aria-label'
        )
    ) || '';
  }
  async verifyEditStatusMatchesTableStatus(
    tableStatus: string
  ): Promise<void> {
    const normalizedTableStatus =
      tableStatus
        .trim()
        .toLowerCase();

    if (
      normalizedTableStatus !==
        'active' &&
      normalizedTableStatus !==
        'inactive'
    ) {
      throw new Error(
        `Unexpected table status: "${tableStatus}". Expected Active or Inactive.`
      );
    }

    await expect(
      this.editActiveStatusSwitch
    ).toBeVisible({
      timeout: 5000
    });

    const ariaChecked =
      await this.editActiveStatusSwitch
        .getAttribute(
          'aria-checked'
        );

    const ariaLabel =
      await this.editActiveStatusSwitch
        .getAttribute(
          'aria-label'
        );

    const dataState =
      await this.editActiveStatusSwitch
        .getAttribute(
          'data-state'
        );

    console.log(
      `Table Status: ${tableStatus}`
    );

    console.log(
      `Edit Switch aria-checked: ${ariaChecked}`
    );

    console.log(
      `Edit Switch aria-label: ${ariaLabel}`
    );

    console.log(
      `Edit Switch data-state: ${dataState}`
    );

    if (
      normalizedTableStatus ===
      'active'
    ) {
      expect(
        ariaChecked
      ).toBe('true');

      expect(
        ariaLabel
      ).toBe('Active');

      expect(
        dataState
      ).toBe('checked');

      return;
    }

    expect(
      ariaChecked
    ).toBe('false');

    expect(
      ariaLabel
    ).toBe('Inactive');

    expect(
      dataState
    ).toBe('unchecked');
  }
  async verifyEditStatusToggleState(
    expectedStatus:
      | 'active'
      | 'inactive'
  ): Promise<void> {
    await expect(
      this.editActiveStatusSwitch
    ).toBeVisible({
      timeout: 5000
    });

    const ariaChecked =
      await this.editActiveStatusSwitch
        .getAttribute(
          'aria-checked'
        );

    const ariaLabel =
      await this.editActiveStatusSwitch
        .getAttribute(
          'aria-label'
        );

    const dataState =
      await this.editActiveStatusSwitch
        .getAttribute(
          'data-state'
        );

    if (
      expectedStatus ===
      'active'
    ) {
      expect(
        ariaChecked
      ).toBe('true');

      expect(
        ariaLabel
      ).toBe('Active');

      expect(
        dataState
      ).toBe('checked');

      return;
    }

    expect(
      ariaChecked
    ).toBe('false');

    expect(
      ariaLabel
    ).toBe('Inactive');

    expect(
      dataState
    ).toBe('unchecked');
  }


  // EDIT CLOSE
  async closeEditMoujaDrawer(): Promise<void> {
    if (
      await this.editMoujaDrawer.isVisible()
    ) {
      await this.editCancelButton.click();

      await expect(
        this.editMoujaDrawer
      ).toBeHidden({
        timeout: 5000
      });
    }
  }
  async isEditDrawerVisible(): Promise<boolean> {
    return this.editMoujaDrawer
      .isVisible()
      .catch(() => false);
  }

  // ==========================================
  // EDIT FIELD VALIDATION
  // ==========================================

  async verifyEditMoujaNumberPrefilled(
    moujaNumber: string
  ): Promise<void> {
    await expect(
      this.editMoujaNumberInput
    ).toHaveValue(
      moujaNumber
    );
  }
  async enterEditMoujaNumber(
    value: string
  ): Promise<void> {
    await this.editMoujaNumberInput.fill(
      value
    );
  }
  async enterEditMoujaName(
    value: string
  ): Promise<void> {
    await this.editMoujaNameInput.fill(
      value
    );
  }
  async clickInsideEditMoujaDrawer(): Promise<void> {
    await this.editMoujaDrawer
      .getByText(
        'Edit Mouja',
        {
          exact: true
        }
      )
      .click();

    await expect(this.editMoujaDrawer).toBeVisible({ timeout: 5000 });
  }

  // USER MENU
  async openUserMenu(): Promise<void> {
    await expect(
      this.userProfileName,
      'User profile name was not visible.'
    ).toBeVisible({
      timeout: 10000
    });

    await this.userProfileName.click();

    await expect(
      this.userMenu,
      'User menu did not open.'
    ).toBeVisible({
      timeout: 10000
    });

    console.log(
      'User menu opened successfully.'
    );
  }

  // LANGUAGE
  async openLanguageMenu(): Promise<void> {
    await expect(
      this.languageButton,
      'Language button was not visible.'
    ).toBeVisible({
      timeout: 10000
    });

    await this.languageButton.click();

    await expect(
      this.languageOptions.first(),
      'Language options did not open.'
    ).toBeVisible({
      timeout: 10000
    });

    console.log(
      'Language options opened successfully.'
    );
  }
  async selectLanguage(
    language: 'English' | 'Marathi'
  ): Promise<void> {
    await this.openUserMenu();

    await this.openLanguageMenu();

    const option =
      language === 'Marathi'
        ? this.marathiLanguageOption
        : this.englishLanguageOption;

    await expect(
      option,
      `${language} language option was not visible.`
    ).toBeVisible({
      timeout: 10000
    });

    await option.click();

    console.log(
      `${language} language selected successfully.`
    );
  }

  // LANGUAGE / TABLE HELPERS
  async getMoujaNumbersSnapshot(): Promise<string[]> {
    return await this.getMoujaNumbers();
  }
  async getTableHeaderTexts(): Promise<string[]> {
    return await this.tableHeaders.allTextContents();
  }
  async getSearchPlaceholderValue(): Promise<string | null> {
    return await this.page
      .locator(
        'input[placeholder]'
      )
      .first()
      .getAttribute(
        'placeholder'
      );
  }
  async getAddMoujaButtonText(): Promise<string> {
    return (
      await this.addMoujaButtonText.innerText()
    ).trim();
  }
  async getRowsPerPageValue(): Promise<string> {
    return (
      await this.rowsPerPageText.innerText()
    ).trim();
  }
  moujaNameRequiredAlert = this.page.getByText('Mouja name is required', { exact: true });
  async clickSidebar() {
  await this.page.locator('aside').click({ position: { x: 20, y: 100 } });
  }
  async isMoujaNameRequiredAlertVisible() {
  return await this.moujaNameRequiredAlert.isVisible();
  }

}
