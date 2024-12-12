import { expect, test } from "../page-objects/pageFixture";
import { adminUser } from "../data/test.user";

test.describe("Login", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test("should login with valid credentials", async ({
    loginPage,
    kanbanPage,
  }) => {
    await loginPage.login(adminUser.username, adminUser.password);
    await kanbanPage.page.waitForURL(kanbanPage.url);
    await expect(kanbanPage.header.logoutButton).toBeVisible();
  });

  test("should not allow login with invalid username", async ({
    loginPage,
  }) => {
    const invalidUsername = "invalid_username";

    await loginPage.login(invalidUsername, adminUser.password);
    await expect(loginPage.errorMessage).toBeInViewport();
  });

  test("should not allow login with invalid password", async ({
    loginPage,
  }) => {
    const invalidPassword = "invalid_password";

    await loginPage.login(adminUser.username, invalidPassword);
    await expect(loginPage.errorMessage).toBeInViewport();
  });
});

test.describe("Logout", () => {
  test("should allow the user to logout", async ({ loginPage, kanbanPage }) => {
    await kanbanPage.open();
    await kanbanPage.logout();
    await loginPage.page.waitForURL(loginPage.url);
    await expect(loginPage.signInButton).toBeInViewport();
  });
});
