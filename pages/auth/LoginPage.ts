import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Enter your username');
    this.passwordInput = page.getByPlaceholder('Enter your password');
    this.signInButton = page.getByRole('button', { name: 'SIGN IN' });
  }

  /**
   * Navigates to the login screen (homepage of base url)
   */
  async navigate(): Promise<void> {
    await this.navigateTo('/');
  }

  /**
   * Actions to enter credentials and click sign in
   */
  async fillCredentials(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  /**
   * Clicks the submit button
   */
  async clickSignIn(): Promise<void> {
    await this.signInButton.click();
  }

  /**
   * Complete login sequence
   */
  async login(username: string, password: string): Promise<void> {
    await this.fillCredentials(username, password);
    await this.clickSignIn();
    await this.waitForPageReady();
  }
}
