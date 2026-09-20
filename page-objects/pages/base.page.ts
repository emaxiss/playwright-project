import { type Page, type Locator } from "@playwright/test";
import NavMenu from "../components/nav-menu";

export abstract class BasePage {
  abstract url: string;
  readonly navMenu: NavMenu;
  readonly boardName: Locator;
  readonly boardDescription: Locator;
  readonly errorMessage: Locator;

  constructor(readonly page: Page) {
    this.navMenu = new NavMenu(
      this.page.getByRole("navigation", { name: "Boards" }),
    );
    this.boardName = this.page.getByRole("heading", { level: 1 });
    this.boardDescription = this.page.locator("header p");
    this.errorMessage = this.page.getByRole("alert");
  }

  async open(url?: string): Promise<void> {
    await this.page.goto(url ?? this.url, { waitUntil: "domcontentloaded" });
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
