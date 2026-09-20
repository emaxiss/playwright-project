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
      assignee: "Ada Cole",
    },
    {
      title: "Fix navigation bug",
      board: "web",
      status: ColumnStatus.TO_DO,
      tags: ["Bug"],
      assignee: "Ravi Menon",
    },
    {
      title: "Design system updates",
      board: "web",
      status: ColumnStatus.IN_PROGRESS,
      tags: ["Design"],
      assignee: "Ada Cole",
    },
    {
      title: "Push notification system",
      board: "mobile",
      status: ColumnStatus.TO_DO,
      tags: ["Feature"],
      assignee: "Jo Park",
    },
    {
      title: "Biometric unlock",
      board: "mobile",
      status: ColumnStatus.REVIEW,
      tags: ["Feature", "High Priority"],
      assignee: "Ravi Menon",
    },
    {
      title: "App icon design",
      board: "mobile",
      status: ColumnStatus.DONE,
      tags: ["Design"],
      assignee: "Lena Fischer",
    },
  ];

  testCases.forEach(({ title, board, status, tags, assignee }) => {
    test(`shows "${title}" in the ${board} ${status} column`, async ({
      kanbanPage,
    }) => {
      if (board === "mobile") await kanbanPage.openMobileAppBoard();

      const task = kanbanPage.getColumnByStatus(status).getTaskByTitle(title);
      await expect(task.element).toBeVisible();
      await expect(task.tags).toHaveText(tags);
      await expect(task.assignee).toContainText(assignee);
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
    seedBoard,
  }) => {
    await seedBoard([{ id: "s1", title: "Only task", status: "To Do" }]);
    await kanbanPage.open();

    const done = kanbanPage.getColumnByStatus(ColumnStatus.DONE);
    await expect(done.emptyMessage).toBeVisible();
    await expect(done.count).toHaveText("0");
  });
});
