import { expect, test } from "../page-objects/pageFixture";
import { ColumnStatus } from "../page-objects/pages/kanban.page";

test.describe("Filtering and sorting", () => {
  test.beforeEach(async ({ kanbanPage, seedBoard }) => {
    await seedBoard([
      {
        id: "f1",
        title: "Payment gateway",
        status: "To Do",
        tags: ["Feature"],
      },
      { id: "f2", title: "Payment refunds", status: "To Do", tags: ["Bug"] },
      {
        id: "f3",
        title: "Audit logging",
        status: "To Do",
        tags: ["Feature", "High Priority"],
      },
    ]);
    await kanbanPage.open();
  });

  test("filters tasks by title", async ({ kanbanPage }) => {
    const column = kanbanPage.getColumnByStatus(ColumnStatus.TO_DO);
    await expect(column.cards).toHaveCount(3);

    await kanbanPage.search("payment");

    await expect(column.cards).toHaveCount(2);
    expect(await column.taskTitles()).toEqual([
      "Payment gateway",
      "Payment refunds",
    ]);
  });

  test("filters tasks by tag", async ({ kanbanPage }) => {
    const column = kanbanPage.getColumnByStatus(ColumnStatus.TO_DO);

    await kanbanPage.tagFilter("Feature").click();

    await expect(column.cards).toHaveCount(2);
    expect(await column.taskTitles()).toEqual([
      "Payment gateway",
      "Audit logging",
    ]);
  });

  test("combines tag filters", async ({ kanbanPage }) => {
    const column = kanbanPage.getColumnByStatus(ColumnStatus.TO_DO);

    await kanbanPage.tagFilter("Feature").click();
    await kanbanPage.tagFilter("High Priority").click();

    await expect(column.cards).toHaveCount(1);
    expect(await column.taskTitles()).toEqual(["Audit logging"]);
  });

  test("sorts tasks by title", async ({ kanbanPage }) => {
    const column = kanbanPage.getColumnByStatus(ColumnStatus.TO_DO);

    await kanbanPage.sortBy("Title");

    expect(await column.taskTitles()).toEqual([
      "Audit logging",
      "Payment gateway",
      "Payment refunds",
    ]);
  });

  test("sorts high priority tasks first", async ({ kanbanPage }) => {
    const column = kanbanPage.getColumnByStatus(ColumnStatus.TO_DO);

    await kanbanPage.sortBy("Priority");

    expect((await column.taskTitles())[0]).toBe("Audit logging");
  });
});
