import { Locator } from "@playwright/test";

export default class TaskCard {
  readonly title: Locator;
  readonly description: Locator;
  readonly tags: Locator;
  readonly assignee: Locator;
  readonly deleteButton: Locator;

  constructor(public readonly element: Locator) {
    this.title = this.element.getByRole("heading", { level: 3 });
    this.description = this.element.locator(".task-description");
    this.tags = this.element
      .getByRole("list", { name: "Tags" })
      .getByRole("listitem");
    this.assignee = this.element.locator(".task-meta");
    this.deleteButton = this.element.getByRole("button", { name: /^Delete / });
  }

  async open(): Promise<void> {
    await this.element.click();
  }

  async dragTo(target: Locator): Promise<void> {
    await this.element.dragTo(target);
  }

  async requestDelete(): Promise<void> {
    await this.element.hover();
    await this.deleteButton.click();
  }
}
