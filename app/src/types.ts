export type ColumnStatus = "To Do" | "In Progress" | "Review" | "Done";

export const COLUMN_STATUSES: ColumnStatus[] = [
  "To Do",
  "In Progress",
  "Review",
  "Done",
];

export type Tag = "Feature" | "Bug" | "Design" | "High Priority";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: ColumnStatus;
  tags: Tag[];
}

export interface Board {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
}
