import { Locator } from "@playwright/test";

export default class Header {
  readonly brand: Locator;
  readonly userName: Locator;
  readonly logoutButton: Locator;

  constructor(public readonly element: Locator) {
    this.brand = this.element.locator(".brand");
    this.userName = this.element.locator(".user-chip");
    this.logoutButton = this.element.getByRole("button", { name: "Logout" });
  }
}
