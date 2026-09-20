import { Locator, Page } from "@playwright/test";

export default class TaskPanel {
  readonly element: Locator;
  readonly heading: Locator;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly statusSelect: Locator;
  readonly assigneeSelect: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly deleteButton: Locator;
  readonly closeButton: Locator;
  readonly error: Locator;

  constructor(private readonly page: Page) {
    this.element = this.page.getByRole("dialog");
    this.heading = this.element.getByRole("heading", { level: 2 });
    this.titleInput = this.element.getByLabel("Title");
    this.descriptionInput = this.element.getByLabel("Description");
    this.statusSelect = this.element.getByLabel("Status");
    this.assigneeSelect = this.element.getByLabel("Assignee");
    this.saveButton = this.element.getByRole("button", {
      name: /Save changes|Create task/,
    });
    this.cancelButton = this.element.getByRole("button", { name: "Cancel" });
    this.deleteButton = this.element.getByRole("button", { name: "Delete" });
    this.closeButton = this.element.getByRole("button", {
      name: "Close panel",
    });
    this.error = this.element.getByRole("alert");
  }

  tagOption(tag: string): Locator {
    return this.element
      .getByRole("group", { name: "Tags" })
      .getByRole("button", { name: tag });
  }

  async setTags(tags: string[]): Promise<void> {
    for (const tag of tags) {
      await this.tagOption(tag).click();
    }
  }
}
