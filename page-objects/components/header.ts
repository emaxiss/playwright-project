import { Locator } from "@playwright/test";

export default class Header {
  readonly logoutButton: Locator;
  readonly boardName: Locator;
  readonly boardDescription: Locator;

  constructor(public readonly element: Locator) {
    this.logoutButton = this.element.getByRole("button", { name: "Logout" });
    this.boardName = this.element.getByRole("heading", { level: 1 });
    this.boardDescription = this.element.locator("header p");
  }
}
