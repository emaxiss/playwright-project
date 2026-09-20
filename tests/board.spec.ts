import { expect, test } from "../page-objects/pageFixture";
import { ColumnStatus } from "../page-objects/pages/kanban.page";

/**
 * The seeded board is served through the route fixture rather than read from
 * the API, so these assertions do not depend on tasks another spec created,
 * moved or deleted in the shared server state.
 */
const SEEDED_TASKS = [
  {
    id: "b1",
    title: "Implement user authentication",
    status: "To Do",
    tags: ["Feature", "High Priority"],
    assignee: "Ada Cole",
  },
  {
    id: "b2",
    title: "Fix navigation bug",
    status: "To Do",
    tags: ["Bug"],
    assignee: "Ravi Menon",
  },
  {
    id: "b3",
    title: "Design system updates",
    status: "In Progress",
    tags: ["Design"],
    assignee: "Ada Cole",
  },
  {
    id: "b4",
    title: "API integration",
    status: "Review",
    tags: ["Feature"],
    assignee: "Jo Park",
  },
  {
    id: "b5",
    title: "Update documentation",
    status: "Done",
    tags: ["Feature"],
    assignee: "Ravi Menon",
  },
];

test.describe("Board display", () => {
  test.beforeEach(async ({ kanbanPage, seedBoard }) => {
    await seedBoard(SEEDED_TASKS);
    await kanbanPage.open();
  });

  SEEDED_TASKS.forEach(({ title, status, tags, assignee }) => {
    test(`shows "${title}" in the ${status} column`, async ({ kanbanPage }) => {
      const task = kanbanPage
        .getColumnByStatus(status as ColumnStatus)
        .getTaskByTitle(title);

      await expect(task.element).toBeVisible();
      await expect(task.tags).toHaveText(tags);
      await expect(task.assignee).toContainText(assignee);
    });
  });

  test("counts the tasks in each column", async ({ kanbanPage }) => {
    await expect(
      kanbanPage.getColumnByStatus(ColumnStatus.TO_DO).count,
    ).toHaveText("2");
    await expect(
      kanbanPage.getColumnByStatus(ColumnStatus.IN_PROGRESS).count,
    ).toHaveText("1");
    await expect(
      kanbanPage.getColumnByStatus(ColumnStatus.DONE).count,
    ).toHaveText("1");
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

  test("distinguishes tasks whose titles share a prefix", async ({
    kanbanPage,
    seedBoard,
  }) => {
    await seedBoard([
      { id: "p1", title: "Rate limit the API", status: "To Do" },
      { id: "p2", title: "Rate limit the API for partners", status: "To Do" },
    ]);
    await kanbanPage.open();

    const todo = kanbanPage.getColumnByStatus(ColumnStatus.TO_DO);
    await expect(
      todo.getTaskByTitle("Rate limit the API").element,
    ).toBeVisible();
    await expect(
      todo.getTaskByTitle("Rate limit the API for partners").element,
    ).toBeVisible();
  });
});

test.describe("Board switching", () => {
  test.beforeEach(async ({ kanbanPage }) => {
    await kanbanPage.open();
  });

  test("switches between boards", async ({ kanbanPage }) => {
    await expect(kanbanPage.boardName).toHaveText("Web Application");

    await kanbanPage.openMobileAppBoard();

    await expect(kanbanPage.boardName).toHaveText("Mobile Application");
    await expect(kanbanPage.navMenu.activeProject()).toHaveText(
      "Mobile Application",
    );
  });

  test("clears an active search when switching boards", async ({
    kanbanPage,
  }) => {
    await kanbanPage.search("navigation");
    await expect(kanbanPage.searchInput).toHaveValue("navigation");

    await kanbanPage.openMobileAppBoard();

    await expect(kanbanPage.searchInput).toHaveValue("");
    await expect(kanbanPage.boardName).toHaveText("Mobile Application");
  });

  test("switches boards once the task panel is closed", async ({
    kanbanPage,
  }) => {
    await kanbanPage
      .getColumnByStatus(ColumnStatus.TO_DO)
      .cards.first()
      .click();
    await expect(kanbanPage.panel.element).toBeVisible();

    await kanbanPage.panel.closeButton.click();
    await expect(kanbanPage.panel.element).toBeHidden();

    await kanbanPage.openMarketingBoard();
    await expect(kanbanPage.boardName).toHaveText("Marketing Campaign");
  });
});
