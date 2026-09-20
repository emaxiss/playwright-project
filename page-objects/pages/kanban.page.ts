import { Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import Column from "../components/column";

export enum ColumnStatus {
  TO_DO = "To Do",
  IN_PROGRESS = "In Progress",
  REVIEW = "Review",
  DONE = "Done",
}

export interface NewTask {
  title: string;
  description?: string;
  status?: ColumnStatus;
  tags?: string[];
}

export default class KanbanPage extends BasePage {
  readonly url = "/";
  readonly filterInput: Locator = this.page.getByLabel("Filter tasks");
  readonly newTaskButton: Locator = this.page.getByRole("button", {
    name: "New Task",
  });
  readonly form: Locator = this.page.getByRole("form", { name: "New task" });

  getColumnByStatus(status: ColumnStatus): Column {
    return new Column(this.page.getByRole("region", { name: status }));
  }

  async filterBy(text: string): Promise<void> {
    await this.filterInput.fill(text);
  }

  async createTask({
    title,
    description = "",
    status = ColumnStatus.TO_DO,
    tags = [],
  }: NewTask): Promise<void> {
    await this.newTaskButton.click();
    await this.form.getByLabel("Title").fill(title);
    await this.form.getByLabel("Description").fill(description);
    await this.form.getByLabel("Status").selectOption(status);
    for (const tag of tags) {
      await this.form.getByRole("checkbox", { name: tag }).check();
    }
    await this.form.getByRole("button", { name: "Create Task" }).click();
  }

  async submitEmptyForm(): Promise<void> {
    await this.newTaskButton.click();
    await this.form.getByRole("button", { name: "Create Task" }).click();
  }
}
