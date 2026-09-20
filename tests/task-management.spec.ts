import { expect, test } from "../page-objects/pageFixture";
import { ColumnStatus } from "../page-objects/pages/kanban.page";

test.describe("Task management", () => {
  test.beforeEach(async ({ kanbanPage }) => {
    await kanbanPage.open();
  });

  test("creates a task in the selected column", async ({
    kanbanPage,
    seedBoard,
  }) => {
    await seedBoard([]);
    await kanbanPage.open();
    const title = "Audit logging";

    await kanbanPage.createTask({
      title,
      description: "Record admin actions",
      status: ColumnStatus.REVIEW,
      tags: ["Feature", "High Priority"],
    });

    const task = kanbanPage
      .getColumnByStatus(ColumnStatus.REVIEW)
      .getTaskByTitle(title);

    await expect(task.element).toBeVisible();
    await expect(task.description).toHaveText("Record admin actions");
    await expect(task.tags).toHaveText(["Feature", "High Priority"]);
  });

  test("rejects a task with no title", async ({ kanbanPage }) => {
    await kanbanPage.submitEmptyForm();

    await expect(kanbanPage.errorMessage).toBeVisible();
    await expect(kanbanPage.errorMessage).toHaveText("Title is required");
    await expect(kanbanPage.form).toBeVisible();
  });

  test("deletes a task", async ({ kanbanPage, seedBoard }) => {
    await seedBoard([
      { id: "t1", title: "Temporary task", status: "To Do" },
      { id: "t2", title: "Surviving task", status: "To Do" },
    ]);
    await kanbanPage.open();

    const column = kanbanPage.getColumnByStatus(ColumnStatus.TO_DO);
    await expect(column.cards).toHaveCount(2);

    await column.getTaskByTitle("Temporary task").delete();

    await expect(column.getTaskByTitle("Temporary task").element).toBeHidden();
    await expect(column.getTaskByTitle("Surviving task").element).toBeVisible();
  });

  test("filters tasks by title", async ({ kanbanPage, seedBoard }) => {
    await seedBoard([
      { id: "t1", title: "Payment gateway", status: "To Do" },
      { id: "t2", title: "Payment refunds", status: "To Do" },
      { id: "t3", title: "Search indexing", status: "To Do" },
    ]);
    await kanbanPage.open();

    const column = kanbanPage.getColumnByStatus(ColumnStatus.TO_DO);
    await expect(column.cards).toHaveCount(3);

    await kanbanPage.filterBy("payment");

    await expect(column.cards).toHaveCount(2);
    expect(await column.taskTitles()).toEqual([
      "Payment gateway",
      "Payment refunds",
    ]);
  });
});
