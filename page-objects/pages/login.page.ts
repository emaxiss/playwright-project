import { Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export default class LoginPage extends BasePage {
  readonly url = "/";
  readonly form: Locator = this.page.getByRole("form", { name: "Sign in" });
  readonly usernameInput: Locator = this.page.getByLabel("Username");
  readonly passwordInput: Locator = this.page.getByLabel("Password");
  readonly signInButton: Locator = this.page.getByRole("button", {
    name: "Sign In",
  });
  readonly errorMessage: Locator = this.form.getByRole("alert");

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
