import { expect, test } from "../page-objects/pageFixture";
import { ColumnStatus } from "../page-objects/pages/kanban.page";

test.describe("Board display", () => {
  test.beforeEach(async ({ kanbanPage }) => {
    await kanbanPage.open();
  });

  const testCases = [
    {
      title: "Implement user authentication",
      board: "web",
      status: ColumnStatus.TO_DO,
      tags: ["Feature", "High Priority"],
    },
    {
      title: "Fix navigation bug",
      board: "web",
      status: ColumnStatus.TO_DO,
      tags: ["Bug"],
    },
    {
      title: "Design system updates",
      board: "web",
      status: ColumnStatus.IN_PROGRESS,
      tags: ["Design"],
    },
    {
      title: "Push notification system",
      board: "mobile",
      status: ColumnStatus.TO_DO,
      tags: ["Feature"],
    },
    {
      title: "Offline mode",
      board: "mobile",
      status: ColumnStatus.IN_PROGRESS,
      tags: ["Feature", "High Priority"],
    },
    {
      title: "App icon design",
      board: "mobile",
      status: ColumnStatus.DONE,
      tags: ["Design"],
    },
  ];

  testCases.forEach(({ title, board, status, tags }) => {
    test(`shows "${title}" in the ${board} ${status} column`, async ({
      kanbanPage,
    }) => {
      if (board === "mobile") {
        await kanbanPage.openMobileAppBoard();
      }

      const task = kanbanPage.getColumnByStatus(status).getTaskByTitle(title);
      await expect(task.element).toBeVisible();
      await expect(task.tags).toHaveText(tags);
    });
  });

  test("switches between boards", async ({ kanbanPage }) => {
    await expect(kanbanPage.boardName).toHaveText("Web Application");

    await kanbanPage.openMarketingBoard();
    await expect(kanbanPage.boardName).toHaveText("Marketing Campaign");
    await expect(kanbanPage.navMenu.activeProject()).toHaveText(
      "Marketing Campaign",
    );
  });

  test("shows an empty state for a column with no tasks", async ({
    kanbanPage,
  }) => {
    await kanbanPage.openMarketingBoard();
    const done = kanbanPage.getColumnByStatus(ColumnStatus.DONE);

    await expect(done.emptyMessage).toBeVisible();
    await expect(done.count).toHaveText("0");
  });
});
