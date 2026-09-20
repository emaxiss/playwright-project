import { Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import Column from "../components/column";
import TaskPanel from "../components/panel";

export enum ColumnStatus {
  TO_DO = "To Do",
  IN_PROGRESS = "In Progress",
  REVIEW = "Review",
  DONE = "Done",
}

export type SortOption = "Manual" | "Title" | "Priority";

export interface NewTask {
  title: string;
  description?: string;
  status?: ColumnStatus;
  assignee?: string;
  tags?: string[];
}

export default class KanbanPage extends BasePage {
  readonly url = "/";
  readonly panel = new TaskPanel(this.page);
  readonly searchInput: Locator = this.page.getByRole("searchbox", {
    name: "Filter tasks",
  });
  readonly sortSelect: Locator = this.page.getByLabel("Sort");
  readonly newTaskButton: Locator = this.page.getByRole("button", {
    name: "New Task",
  });
  readonly confirmDialog: Locator = this.page.getByRole("alertdialog");
  readonly toast: Locator = this.page.locator(".toast");

  getColumnByStatus(status: ColumnStatus): Column {
    return new Column(this.page.getByRole("region", { name: status }));
  }

  tagFilter(tag: string): Locator {
    return this.page
      .getByRole("group", { name: "Filter by tag" })
      .getByRole("button", { name: tag });
  }

  async search(text: string): Promise<void> {
    await this.searchInput.fill(text);
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortSelect.selectOption(option.toLowerCase());
  }

  async createTask({
    title,
    description = "",
    status = ColumnStatus.TO_DO,
    assignee,
    tags = [],
  }: NewTask): Promise<void> {
    await this.newTaskButton.click();
    await this.panel.titleInput.fill(title);
    await this.panel.descriptionInput.fill(description);
    await this.panel.statusSelect.selectOption(status);
    if (assignee) await this.panel.assigneeSelect.selectOption(assignee);
    await this.panel.setTags(tags);
    await this.panel.saveButton.click();
  }

  async confirmDelete(): Promise<void> {
    await this.confirmDialog.getByRole("button", { name: "Delete" }).click();
  }

  async cancelDelete(): Promise<void> {
    await this.confirmDialog.getByRole("button", { name: "Cancel" }).click();
  }

  async undoLastAction(): Promise<void> {
    await this.toast.getByRole("button", { name: "Undo" }).click();
  }
}
