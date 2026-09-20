import { adminUser } from "../data/test.user";
import { expect, test } from "../page-objects/pageFixture";

const authFile = ".auth/user.json";

/**
 * Signs in once and stores the session so the rest of the suite starts
 * authenticated. The session lives in localStorage, which storageState
 * captures alongside cookies.
 */
test("authenticate", async ({ loginPage, kanbanPage }) => {
  await loginPage.open();
  await loginPage.login(adminUser.username, adminUser.password);

  await expect(kanbanPage.header.logoutButton).toBeVisible();
  await expect(kanbanPage.boardName).toHaveText("Web Application");

  await loginPage.page.context().storageState({ path: authFile });
});
