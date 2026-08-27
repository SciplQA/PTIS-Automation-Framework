import { Locator, Page } from '@playwright/test';
import { PropertyTaxBasePage } from '../PropertyTaxBasePage';

export class ConstructionTypeMasterPage extends PropertyTaxBasePage {
	private readonly pageHeading: Locator;

	constructor(page: Page) {
		super(page);
		this.pageHeading = page.getByRole('heading', { name: 'Construction Type Master' });
	}

	async navigateFromPropertyTaxModule(): Promise<void> {
		await this.selectMasterSubmenu('Construction Type');
	}

	async expectLoaded(): Promise<void> {
		await this.pageHeading.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(5000);
	}
     

}
