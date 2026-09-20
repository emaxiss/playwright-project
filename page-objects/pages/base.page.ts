import { type Page, type Locator } from "@playwright/test";
import Header from "../components/header";
import NavMenu from "../components/nav-menu";

export abstract class BasePage {
  abstract url: string;
  readonly header: Header;
  readonly navMenu: NavMenu;
  readonly boardName: Locator;
  readonly boardDescription: Locator;
  readonly errorBanner: Locator;

  constructor(readonly page: Page) {
    this.header = new Header(this.page.locator(".topbar"));
    this.navMenu = new NavMenu(
      this.page.getByRole("navigation", { name: "Boards" }),
    );
    this.boardName = this.page.getByRole("heading", { level: 1 });
    this.boardDescription = this.page.locator(".board-head p");
    this.errorBanner = this.page.locator(".banner-error");
  }

  async open(url?: string): Promise<void> {
    await this.page.goto(url ?? this.url, { waitUntil: "domcontentloaded" });
  }

  async logout(): Promise<void> {
    await this.header.logoutButton.click();
  }

  async openWebAppBoard(): Promise<void> {
    await this.navMenu.webAppProject.click();
  }

  async openMobileAppBoard(): Promise<void> {
    await this.navMenu.mobileAppProject.click();
  }

  async openMarketingBoard(): Promise<void> {
    await this.navMenu.marketingCampProject.click();
  }
}
