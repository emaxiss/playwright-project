import { adminUser } from "../data/test.user";
import { expect, test } from "../page-objects/pageFixture";

test.describe("Authentication", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test("signs in with valid credentials", async ({ loginPage, kanbanPage }) => {
    await loginPage.login(adminUser.username, adminUser.password);

    await expect(kanbanPage.header.logoutButton).toBeVisible();
    await expect(kanbanPage.header.userName).toContainText(adminUser.name);
  });

  test("rejects an invalid username", async ({ loginPage }) => {
    await loginPage.login("wrong_user", adminUser.password);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(
      "Invalid username or password",
    );
  });

  test("rejects an invalid password", async ({ loginPage }) => {
    await loginPage.login(adminUser.username, "wrong_password");

    await expect(loginPage.errorMessage).toHaveText(
      "Invalid username or password",
    );
  });

  test("keeps the board hidden until signed in", async ({
    loginPage,
    kanbanPage,
  }) => {
    await expect(loginPage.signInButton).toBeVisible();
    await expect(kanbanPage.newTaskButton).toBeHidden();
  });
});

test.describe("Sign out", () => {
  test("returns to the sign in screen", async ({ kanbanPage, loginPage }) => {
    await kanbanPage.open();
    await kanbanPage.logout();

    await expect(loginPage.signInButton).toBeVisible();
    await expect(kanbanPage.newTaskButton).toBeHidden();
  });
});
