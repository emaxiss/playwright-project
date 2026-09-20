import type { Task } from "../types";
import { initials } from "../types";
import { TrashIcon } from "./Icons";

interface TaskCardProps {
  task: Task;
  dragging: boolean;
  onOpen: (task: Task) => void;
  onRequestDelete: (task: Task) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}

export function TaskCard({
  task,
  dragging,
  onOpen,
  onRequestDelete,
  onDragStart,
  onDragEnd,
}: TaskCardProps) {
  return (
    <article
      className={`task-card${dragging ? " is-dragging" : ""}`}
      draggable
      onDragStart={() => onDragStart(task.id)}
      onDragEnd={onDragEnd}
      onClick={() => onOpen(task)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(task);
        }
      }}
      tabIndex={0}
      aria-label={task.title}
      data-task-id={task.id}
    >
      <h3>{task.title}</h3>
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <ul className="task-tags" aria-label="Tags">
        {task.tags.map((tag) => (
          <li key={tag} className="task-tag" data-tag={tag}>
            {tag}
          </li>
        ))}
      </ul>

      <div className="task-meta">
        <span className="task-assignee" aria-hidden="true">
          {initials(task.assignee)}
        </span>
        <span>{task.assignee}</span>
      </div>

      <div className="task-actions">
        <button
          type="button"
          className="btn btn-icon"
          aria-label={`Delete ${task.title}`}
          onClick={(event) => {
            event.stopPropagation();
            onRequestDelete(task);
          }}
        >
          <TrashIcon />
        </button>
      </div>
    </article>
  );
}
