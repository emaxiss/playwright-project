import { Locator } from "@playwright/test";

export default class Header {
  readonly logoutButton: Locator;
  readonly boardName: Locator;
  readonly boardDescription: Locator;

  constructor(public readonly elemment: Locator) {
    this.logoutButton = this.elemment.getByRole("button", { name: "Logout" });
    this.boardName = this.elemment.getByRole("heading", { level: 1 });
    this.boardDescription = this.elemment.locator("header p");
  }
}
