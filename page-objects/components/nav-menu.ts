import { Locator } from "@playwright/test";

export default class NavMenu {
  readonly webAppProject: Locator;
  readonly mobileAppProject: Locator;
  readonly marketingCampProject: Locator;

  constructor(public readonly element: Locator) {
    this.webAppProject = this.element.getByRole("button", {
      name: "Web Application",
    });
    this.mobileAppProject = this.element.getByRole("button", {
      name: "Mobile Application",
    });
    this.marketingCampProject = this.element.getByRole("button", {
      name: "Marketing Campaign",
    });
  }
}
