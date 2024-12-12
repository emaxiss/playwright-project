import { Locator } from "@playwright/test";

export default class TaskCard {
  readonly taskTitle: Locator;
  readonly taskTag: Locator;

  constructor(public readonly element: Locator) {
    this.taskTitle = this.element.getByRole("heading", { level: 3 });
    this.taskTag = this.element.locator("span.px-2");
  }
}
