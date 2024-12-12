import { adminUser } from "../data/test.user";
import { test, expect } from "../page-objects/pageFixture";

const authFilePath = ".auth/user.json";

// set storage state
test("Authenticate with UI", async ({ loginPage, kanbanPage }) => {
  await loginPage.open();
  await loginPage.login(adminUser.username, adminUser.password);
  await kanbanPage.page.waitForURL(kanbanPage.url);
  await expect(kanbanPage.header.boardName).toBeVisible();
  await kanbanPage.page.context().storageState({ path: authFilePath });
});
