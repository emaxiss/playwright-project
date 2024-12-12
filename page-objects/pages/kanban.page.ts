import { Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import TaskCard from "../components/card";

export default class KanbanPage extends BasePage {
  readonly url = "/";

  getColumnByStatus(columnStatus: ColumnStatus): Column {
    const columnElement = this.page.locator(`h2:has-text("${columnStatus}")`).locator('..');
    return new Column(columnElement);
  }
}

class Column {
  constructor(public readonly element: Locator) {}

  getTaskByTitle(taskTitle: string): TaskCard {
    return new TaskCard(this.element.locator(`h3:has-text("${taskTitle}")`).locator('..'));
  }
}

export enum ColumnStatus {
  TO_DO = 'To Do',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  DONE = 'Done'
}
