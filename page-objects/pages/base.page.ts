import { type Page } from "@playwright/test";
import Header from "../components/header";
import NavMenu from "../components/nav-menu";

export abstract class BasePage {
  abstract url: string;
  readonly header: Header;
  readonly navMenu: NavMenu;

  constructor(readonly page: Page) {
    this.header = new Header(this.page.locator("header"));
    this.navMenu = new NavMenu(this.page.locator("nav"));
  }

  async open(url?: string): Promise<void> {
    const targetUrl = url || this.url;
    if (!targetUrl) {
      throw new Error("URL is not defined for this page.");
    }
    await this.page.goto(targetUrl, { waitUntil: "domcontentloaded" });
  }

  async logout(): Promise<void> {
    await this.header.logoutButton.click();
  }
}
