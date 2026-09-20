import { expect, test } from "../page-objects/pageFixture";
import { ColumnStatus } from "../page-objects/pages/kanban.page";

test.describe("Error handling", () => {
  test("shows an error when the board fails to load", async ({
    kanbanPage,
    failBoardRequest,
  }) => {
    await failBoardRequest(500);
    await kanbanPage.open();

    await expect(kanbanPage.errorBanner).toBeVisible();
    await expect(kanbanPage.errorBanner).toContainText("Unable to load board");
  });

  test("shows an error when the board is missing", async ({
    kanbanPage,
    failBoardRequest,
  }) => {
    await failBoardRequest(404);
    await kanbanPage.open();

    await expect(kanbanPage.errorBanner).toContainText("Unable to load board");
  });

  test("renders an empty board without errors", async ({
    kanbanPage,
    seedBoard,
  }) => {
    await seedBoard([]);
    await kanbanPage.open();

    await expect(kanbanPage.errorBanner).toBeHidden();
    for (const status of Object.values(ColumnStatus)) {
      await expect(
        kanbanPage.getColumnByStatus(status).emptyMessage,
      ).toBeVisible();
    }
  });
});
