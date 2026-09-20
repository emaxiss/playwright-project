import { Locator } from "@playwright/test";

export default class TaskCard {
  readonly title: Locator;
  readonly description: Locator;
  readonly tags: Locator;
  readonly deleteButton: Locator;

  constructor(public readonly element: Locator) {
    this.title = this.element.getByRole("heading", { level: 3 });
    this.description = this.element.locator(".task-description");
    this.tags = this.element
      .getByRole("list", { name: "Tags" })
      .getByRole("listitem");
    this.deleteButton = this.element.getByRole("button", { name: /^Delete / });
  }

  async dragTo(target: Locator): Promise<void> {
    await this.element.dragTo(target);
  }

  async delete(): Promise<void> {
    await this.deleteButton.click();
  }
}
