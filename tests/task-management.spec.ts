import { expect, test } from "../page-objects/pageFixture";
import { ColumnStatus } from "../page-objects/pages/kanban.page";

test.describe("Task management", () => {
  test.beforeEach(async ({ kanbanPage, seedBoard }) => {
    await seedBoard([
      { id: "m1", title: "Existing task", status: "To Do", tags: ["Bug"] },
      { id: "m2", title: "Second task", status: "To Do" },
    ]);
    await kanbanPage.open();
  });

  test("creates a task in the selected column", async ({ kanbanPage }) => {
    await kanbanPage.createTask({
      title: "Rate limit the API",
      description: "Throttle per client key",
      status: ColumnStatus.REVIEW,
      assignee: "Jo Park",
      tags: ["Feature", "High Priority"],
    });

    const task = kanbanPage
      .getColumnByStatus(ColumnStatus.REVIEW)
      .getTaskByTitle("Rate limit the API");

    await expect(task.element).toBeVisible();
    await expect(task.description).toHaveText("Throttle per client key");
    await expect(task.tags).toHaveText(["Feature", "High Priority"]);
    await expect(task.assignee).toContainText("Jo Park");
    await expect(kanbanPage.toast).toContainText("Task created");
  });

  test("rejects a task with no title", async ({ kanbanPage }) => {
    await kanbanPage.newTaskButton.click();
    await kanbanPage.panel.saveButton.click();

    await expect(kanbanPage.panel.error).toHaveText("Title is required");
    await expect(kanbanPage.panel.element).toBeVisible();
  });

  test("edits an existing task", async ({ kanbanPage }) => {
    const todo = kanbanPage.getColumnByStatus(ColumnStatus.TO_DO);
    await todo.getTaskByTitle("Existing task").open();

    await expect(kanbanPage.panel.heading).toHaveText("Task details");
    await expect(kanbanPage.panel.titleInput).toHaveValue("Existing task");

    await kanbanPage.panel.titleInput.fill("Renamed task");
    await kanbanPage.panel.statusSelect.selectOption(ColumnStatus.DONE);
    await kanbanPage.panel.saveButton.click();

    await expect(
      kanbanPage
        .getColumnByStatus(ColumnStatus.DONE)
        .getTaskByTitle("Renamed task").element,
    ).toBeVisible();
    await expect(todo.getTaskByTitle("Existing task").element).toBeHidden();
    await expect(kanbanPage.toast).toContainText("Task updated");
  });

  test("closes the panel without saving", async ({ kanbanPage }) => {
    const todo = kanbanPage.getColumnByStatus(ColumnStatus.TO_DO);
    await todo.getTaskByTitle("Existing task").open();

    await kanbanPage.panel.titleInput.fill("Discarded name");
    await kanbanPage.panel.cancelButton.click();

    await expect(kanbanPage.panel.element).toBeHidden();
    await expect(todo.getTaskByTitle("Existing task").element).toBeVisible();
  });

  test("asks for confirmation before deleting", async ({ kanbanPage }) => {
    const todo = kanbanPage.getColumnByStatus(ColumnStatus.TO_DO);
    await todo.getTaskByTitle("Existing task").requestDelete();

    await expect(kanbanPage.confirmDialog).toBeVisible();
    await kanbanPage.cancelDelete();

    await expect(kanbanPage.confirmDialog).toBeHidden();
    await expect(todo.getTaskByTitle("Existing task").element).toBeVisible();
  });

  test("deletes a task after confirmation", async ({ kanbanPage }) => {
    const todo = kanbanPage.getColumnByStatus(ColumnStatus.TO_DO);
    await expect(todo.cards).toHaveCount(2);

    await todo.getTaskByTitle("Existing task").requestDelete();
    await kanbanPage.confirmDelete();

    await expect(todo.getTaskByTitle("Existing task").element).toBeHidden();
    await expect(todo.cards).toHaveCount(1);
    await expect(kanbanPage.toast).toContainText('Deleted "Existing task"');
  });

  test("restores a deleted task with undo", async ({ kanbanPage }) => {
    const todo = kanbanPage.getColumnByStatus(ColumnStatus.TO_DO);

    await todo.getTaskByTitle("Existing task").requestDelete();
    await kanbanPage.confirmDelete();
    await expect(todo.cards).toHaveCount(1);

    await kanbanPage.undoLastAction();

    await expect(todo.getTaskByTitle("Existing task").element).toBeVisible();
    await expect(todo.cards).toHaveCount(2);
  });

  test("keeps undo scoped to the board the task was deleted from", async ({
    kanbanPage,
    page,
  }) => {
    const todo = kanbanPage.getColumnByStatus(ColumnStatus.TO_DO);
    await todo.getTaskByTitle("Existing task").requestDelete();
    await kanbanPage.confirmDelete();
    await expect(todo.cards).toHaveCount(1);

    // record where the undo write lands once the user has moved on
    const restores: string[] = [];
    page.on("request", (request) => {
      if (request.method() === "POST" && request.url().includes("/api/boards/"))
        restores.push(new URL(request.url()).pathname);
    });

    await kanbanPage.openMobileAppBoard();
    await kanbanPage.undoLastAction();
    await expect(kanbanPage.toast).toBeHidden();

    // the restore targets the board the task came from, not the visible one
    expect(restores).toEqual(["/api/boards/web"]);
  });

  test("shows only the newest toast action after repeated deletes", async ({
    kanbanPage,
  }) => {
    const todo = kanbanPage.getColumnByStatus(ColumnStatus.TO_DO);

    await todo.getTaskByTitle("Existing task").requestDelete();
    await kanbanPage.confirmDelete();
    await todo.getTaskByTitle("Second task").requestDelete();
    await kanbanPage.confirmDelete();

    await expect(todo.cards).toHaveCount(0);
    await expect(kanbanPage.toast).toContainText('Deleted "Second task"');

    await kanbanPage.undoLastAction();

    await expect(todo.getTaskByTitle("Second task").element).toBeVisible();
  });
});
