import type { ColumnStatus, Task } from "../types";
import { COLUMN_DOTS } from "../types";
import { TaskCard } from "./TaskCard";
import { SkeletonColumn } from "./Feedback";

interface ColumnProps {
  status: ColumnStatus;
  tasks: Task[];
  loading: boolean;
  draggedId: string | null;
  isDropTarget: boolean;
  onOpen: (task: Task) => void;
  onRequestDelete: (task: Task) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDragOverColumn: (status: ColumnStatus | null) => void;
  onDrop: (status: ColumnStatus) => void;
}

export function Column({
  status,
  tasks,
  loading,
  draggedId,
  isDropTarget,
  onOpen,
  onRequestDelete,
  onDragStart,
  onDragEnd,
  onDragOverColumn,
  onDrop,
}: ColumnProps) {
  return (
    <section
      className={`column${isDropTarget ? " is-drop-target" : ""}`}
      aria-label={status}
      data-status={status}
      onDragOver={(event) => {
        event.preventDefault();
        onDragOverColumn(status);
      }}
      onDragLeave={() => onDragOverColumn(null)}
      onDrop={() => onDrop(status)}
    >
      <h2>
        <span
          className="column-dot"
          style={{ background: COLUMN_DOTS[status] }}
        />
        {status}
        <span className="column-count" aria-label={`${status} task count`}>
          {tasks.length}
        </span>
      </h2>

      {loading ? (
        <SkeletonColumn />
      ) : tasks.length === 0 ? (
        <p className="column-empty">No tasks</p>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            dragging={draggedId === task.id}
            onOpen={onOpen}
            onRequestDelete={onRequestDelete}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))
      )}
    </section>
  );
}
