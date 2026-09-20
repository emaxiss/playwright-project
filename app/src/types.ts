export type ColumnStatus = "To Do" | "In Progress" | "Review" | "Done";

export const COLUMN_STATUSES: ColumnStatus[] = [
  "To Do",
  "In Progress",
  "Review",
  "Done",
];

export const COLUMN_DOTS: Record<ColumnStatus, string> = {
  "To Do": "#a89c92",
  "In Progress": "#bd7149",
  Review: "#96682a",
  Done: "#356a4a",
};

export type Tag = "Feature" | "Bug" | "Design" | "High Priority";

export const AVAILABLE_TAGS: Tag[] = [
  "Feature",
  "Bug",
  "Design",
  "High Priority",
];

export type SortOption = "manual" | "title" | "priority";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: ColumnStatus;
  tags: Tag[];
  assignee: string;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
}

export interface User {
  username: string;
  name: string;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
