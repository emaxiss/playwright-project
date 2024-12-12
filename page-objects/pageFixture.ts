import { test as base } from "@playwright/test";
import type { Page } from "@playwright/test";
import LoginPage from "./pages/login.page";
import KanbanPage from "./pages/kanban.page";

export type PageFixtures = {
  loginPage: LoginPage;
  kanbanPage: KanbanPage;
};

function createPageFixture<T>(PageObject: new (page: Page) => T) {
  return async ({ page }, use) => {
    const pageObject = new PageObject(page);
    await use(pageObject);
  };
}

export const test = base.extend<PageFixtures>({
  loginPage: createPageFixture(LoginPage),
  kanbanPage: createPageFixture(KanbanPage),

  // teardown for page and context
  context: async ({ browser }, use) => {
    const context = await browser.newContext();
    await use(context);
    await context.close();
  },
  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
    await page.close();
  },
});

export { expect } from "@playwright/test";
