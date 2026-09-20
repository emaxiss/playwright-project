import { Locator } from "@playwright/test";
import TaskCard from "./card";

export default class Column {
  readonly heading: Locator;
  readonly count: Locator;
  readonly emptyMessage: Locator;
  readonly cards: Locator;

  constructor(public readonly element: Locator) {
    this.heading = this.element.getByRole("heading", { level: 2 });
    this.count = this.element.locator(".column-count");
    this.emptyMessage = this.element.getByText("No tasks");
    this.cards = this.element.getByRole("article");
  }

  getTaskByTitle(title: string): TaskCard {
    return new TaskCard(
      this.element.getByRole("article", { name: title, exact: true }),
    );
  }

  async taskTitles(): Promise<string[]> {
    return this.cards.getByRole("heading", { level: 3 }).allTextContents();
  }
}
