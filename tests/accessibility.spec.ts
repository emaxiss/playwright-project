import { expect, test } from "../page-objects/pageFixture";
import { ColumnStatus } from "../page-objects/pages/kanban.page";

/** Returns true while focus sits inside the given container. */
async function focusInside(
  page: import("@playwright/test").Page,
  selector: string,
): Promise<boolean> {
  return page.evaluate((sel) => {
    const container = document.querySelector(sel);
    return !!(container && container.contains(document.activeElement));
  }, selector);
}

test.describe("Keyboard access", () => {
  test.beforeEach(async ({ kanbanPage, seedBoard }) => {
    await seedBoard([
      { id: "a1", title: "Keyboard task", status: "To Do", tags: ["Bug"] },
      { id: "a2", title: "Another task", status: "To Do" },
    ]);
    await kanbanPage.open();
  });

  test("opens a task with the keyboard alone", async ({ kanbanPage, page }) => {
    const card = kanbanPage
      .getColumnByStatus(ColumnStatus.TO_DO)
      .getTaskByTitle("Keyboard task");

    await card.element.focus();
    await page.keyboard.press("Enter");

    await expect(kanbanPage.panel.element).toBeVisible();
    await expect(kanbanPage.panel.titleInput).toHaveValue("Keyboard task");
  });

  test("keeps focus inside the task panel", async ({ kanbanPage, page }) => {
    await kanbanPage
      .getColumnByStatus(ColumnStatus.TO_DO)
      .getTaskByTitle("Keyboard task")
      .open();
    await expect(kanbanPage.panel.element).toBeVisible();

    // focus must start inside the dialog, not on the page behind it
    expect(await focusInside(page, ".panel")).toBe(true);

    for (let i = 0; i < 20; i++) {
      await page.keyboard.press("Tab");
      expect(await focusInside(page, ".panel")).toBe(true);
    }

    await page.keyboard.press("Shift+Tab");
    expect(await focusInside(page, ".panel")).toBe(true);
  });

  test("keeps focus inside the confirm dialog above the panel", async ({
    kanbanPage,
    page,
  }) => {
    await kanbanPage
      .getColumnByStatus(ColumnStatus.TO_DO)
      .getTaskByTitle("Keyboard task")
      .open();
    await kanbanPage.panel.deleteButton.click();
    await expect(kanbanPage.confirmDialog).toBeVisible();

    expect(await focusInside(page, ".dialog")).toBe(true);

    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
      expect(await focusInside(page, ".dialog")).toBe(true);
    }
  });

  test("closes the topmost layer first with Escape", async ({
    kanbanPage,
    page,
  }) => {
    await kanbanPage
      .getColumnByStatus(ColumnStatus.TO_DO)
      .getTaskByTitle("Keyboard task")
      .open();
    await kanbanPage.panel.deleteButton.click();
    await expect(kanbanPage.confirmDialog).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(kanbanPage.confirmDialog).toBeHidden();
    await expect(kanbanPage.panel.element).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(kanbanPage.panel.element).toBeHidden();
  });

  test("makes the board inert while a modal is open", async ({
    kanbanPage,
    page,
  }) => {
    const background = page.locator(".shell-content");
    await expect(background).not.toHaveAttribute("inert", /.*/);

    await kanbanPage
      .getColumnByStatus(ColumnStatus.TO_DO)
      .getTaskByTitle("Keyboard task")
      .open();

    await expect(background).toHaveAttribute("inert", /.*/);

    await kanbanPage.panel.closeButton.click();
    await expect(background).not.toHaveAttribute("inert", /.*/);
  });
});
