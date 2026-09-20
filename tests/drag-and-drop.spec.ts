import { expect, test } from "../page-objects/pageFixture";
import { ColumnStatus } from "../page-objects/pages/kanban.page";

/**
 * These tests move tasks between columns, so each one seeds its own board.
 * Sharing the server seed would let parallel workers observe each other's moves.
 */
test.describe("Drag and drop", () => {
  test.beforeEach(async ({ kanbanPage, seedBoard }) => {
    await seedBoard([
      { id: "d1", title: "Fix navigation bug", status: "To Do" },
      { id: "d2", title: "Implement user authentication", status: "To Do" },
      { id: "d3", title: "Design system updates", status: "In Progress" },
    ]);
    await kanbanPage.open();
  });

  test("moves a task to another column", async ({ kanbanPage }) => {
    const todo = kanbanPage.getColumnByStatus(ColumnStatus.TO_DO);
    const inProgress = kanbanPage.getColumnByStatus(ColumnStatus.IN_PROGRESS);

    await expect(todo.count).toHaveText("2");
    await expect(inProgress.count).toHaveText("1");

    await todo.getTaskByTitle("Fix navigation bug").dragTo(inProgress.element);

    await expect(
      inProgress.getTaskByTitle("Fix navigation bug").element,
    ).toBeVisible();
    await expect(
      todo.getTaskByTitle("Fix navigation bug").element,
    ).toBeHidden();
    await expect(inProgress.count).toHaveText("2");
    await expect(todo.count).toHaveText("1");
  });

  test("keeps the task in place when dropped on its own column", async ({
    kanbanPage,
  }) => {
    const todo = kanbanPage.getColumnByStatus(ColumnStatus.TO_DO);
    const task = todo.getTaskByTitle("Fix navigation bug");

    await task.dragTo(todo.element);

    await expect(task.element).toBeVisible();
    await expect(todo.count).toHaveText("2");
  });

  test("moves a task into an empty column", async ({ kanbanPage }) => {
    const todo = kanbanPage.getColumnByStatus(ColumnStatus.TO_DO);
    const done = kanbanPage.getColumnByStatus(ColumnStatus.DONE);

    await expect(done.emptyMessage).toBeVisible();

    await todo.getTaskByTitle("Fix navigation bug").dragTo(done.element);

    await expect(
      done.getTaskByTitle("Fix navigation bug").element,
    ).toBeVisible();
    await expect(done.emptyMessage).toBeHidden();
  });
});
