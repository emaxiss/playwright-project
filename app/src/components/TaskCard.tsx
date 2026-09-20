import type { Task } from "../types";

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onDragStart: (id: string) => void;
}

export function TaskCard({ task, onDelete, onDragStart }: TaskCardProps) {
  return (
    <article
      className="task-card"
      draggable
      onDragStart={() => onDragStart(task.id)}
      aria-label={task.title}
      data-task-id={task.id}
    >
      <h3>{task.title}</h3>
      <p className="task-description">{task.description}</p>
      <ul className="task-tags" aria-label="Tags">
        {task.tags.map((tag) => (
          <li key={tag} className="task-tag">
            {tag}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="task-delete"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete ${task.title}`}
      >
        Delete
      </button>
    </article>
  );
}
