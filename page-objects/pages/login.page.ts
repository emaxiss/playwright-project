import { BasePage } from "./base.page";

export default class LoginPage extends BasePage {
  readonly url = "/";
  readonly signInButton = this.page.getByRole("button", { name: "Sign In" });
  readonly usernameInput = this.page.getByLabel("Username");
  readonly passwordInput = this.page.getByLabel("Password");
  readonly errorMessage = this.page.getByText("Invalid username or password");

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
