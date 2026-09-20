import { test as base } from "@playwright/test";
import type { Page, Route } from "@playwright/test";
import KanbanPage from "./pages/kanban.page";

export type PageFixtures = {
  kanbanPage: KanbanPage;
  seedBoard: (tasks: SeededTask[]) => Promise<void>;
  failBoardRequest: (status?: number) => Promise<void>;
};

export interface SeededTask {
  id: string;
  title: string;
  description?: string;
  status: string;
  tags?: string[];
}

function createPageFixture<T>(PageObject: new (page: Page) => T) {
  return async ({ page }: { page: Page }, use: (value: T) => Promise<void>) => {
    await use(new PageObject(page));
  };
}

export const test = base.extend<PageFixtures>({
  kanbanPage: createPageFixture(KanbanPage),

  /**
   * Serves the board from an in-memory set of tasks so a test does not depend
   * on the seed data or on tasks left behind by another test. Writes are
   * applied to that set, so a create, move or delete stays visible on reload.
   */
  seedBoard: async ({ page }, use) => {
    await use(async (tasks: SeededTask[]) => {
      const state = tasks.map((task) => ({
        description: "",
        tags: [],
        ...task,
      }));

      await page.route("**/api/boards/**", async (route: Route) => {
        const request = route.request();
        const taskId = request.url().match(/\/tasks\/([\w-]+)$/)?.[1];

        switch (request.method()) {
          case "DELETE": {
            const index = state.findIndex((task) => task.id === taskId);
            if (index !== -1) state.splice(index, 1);
            return route.fulfill({ status: 204, body: "" });
          }
          case "PATCH": {
            const task = state.find((item) => item.id === taskId);
            if (task) Object.assign(task, request.postDataJSON());
            return route.fulfill({
              status: 200,
              contentType: "application/json",
              body: JSON.stringify(task ?? {}),
            });
          }
          case "POST": {
            const input = request.postDataJSON();
            state.push({
              id: `seeded-${state.length + 1}`,
              description: "",
              tags: [],
              ...input,
            });
            return route.fulfill({ status: 201, body: "{}" });
          }
          default:
            return route.fulfill({
              status: 200,
              contentType: "application/json",
              body: JSON.stringify({
                id: "web",
                name: "Web Application",
                description: "Main web application development board",
                tasks: state,
              }),
            });
        }
      });
    });
  },

  /** Forces the board request to fail so error handling can be asserted. */
  failBoardRequest: async ({ page }, use) => {
    await use(async (status = 500) => {
      await page.route("**/api/boards/*", (route: Route) =>
        route.fulfill({
          status,
          contentType: "application/json",
          body: JSON.stringify({ error: "Server error" }),
        }),
      );
    });
  },
});

export { expect } from "@playwright/test";
