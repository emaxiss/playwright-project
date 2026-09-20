import type { ColumnStatus, Task } from "../types";
import { TaskCard } from "./TaskCard";

interface ColumnProps {
  status: ColumnStatus;
  tasks: Task[];
  onDelete: (id: string) => void;
  onDragStart: (id: string) => void;
  onDrop: (status: ColumnStatus) => void;
}

export function Column({
  status,
  tasks,
  onDelete,
  onDragStart,
  onDrop,
}: ColumnProps) {
  return (
    <section
      className="column"
      aria-label={status}
      onDragOver={(event) => event.preventDefault()}
      onDrop={() => onDrop(status)}
      data-status={status}
    >
      <h2>
        {status}
        <span className="column-count" aria-label={`${status} task count`}>
          {tasks.length}
        </span>
      </h2>

      {tasks.length === 0 ? (
        <p className="column-empty">No tasks</p>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={onDelete}
            onDragStart={onDragStart}
          />
        ))
      )}
    </section>
  );
}
