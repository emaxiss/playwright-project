import { BasePage } from "./base.page";

export default class KanbanPage extends BasePage {
  readonly url = "/";

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
