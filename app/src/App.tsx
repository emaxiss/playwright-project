import { useCallback, useEffect, useState } from "react";
import { Column } from "./components/Column";
import { NewTaskForm } from "./components/NewTaskForm";
import type { Board, ColumnStatus, Tag } from "./types";
import { COLUMN_STATUSES } from "./types";

const BOARDS = [
  { id: "web", label: "Web Application" },
  { id: "mobile", label: "Mobile Application" },
  { id: "marketing", label: "Marketing Campaign" },
];

export function App() {
  const [boardId, setBoardId] = useState("web");
  const [board, setBoard] = useState<Board | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const loadBoard = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/boards/${boardId}`);
      if (!response.ok) throw new Error("Unable to load board");
      setBoard(await response.json());
      setError("");
    } catch {
      setBoard(null);
      setError("Unable to load board");
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  async function createTask(input: {
    title: string;
    description: string;
    status: ColumnStatus;
    tags: Tag[];
  }) {
    const response = await fetch(`/api/boards/${boardId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      setError("Unable to create task");
      return;
    }
    await loadBoard();
  }

  async function deleteTask(id: string) {
    const response = await fetch(`/api/boards/${boardId}/tasks/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      setError("Unable to delete task");
      return;
    }
    await loadBoard();
  }

  async function moveTask(status: ColumnStatus) {
    if (!draggedId) return;
    const id = draggedId;
    setDraggedId(null);
    const response = await fetch(`/api/boards/${boardId}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      setError("Unable to move task");
      return;
    }
    await loadBoard();
  }

  const visibleTasks = (board?.tasks ?? []).filter((task) =>
    task.title.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="app">
      <header>
        <h1>{board?.name ?? "Board"}</h1>
        <p>{board?.description}</p>
      </header>

      <nav aria-label="Boards">
        {BOARDS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setBoardId(id)}
            aria-current={id === boardId}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="toolbar">
        <label htmlFor="filter">Filter tasks</label>
        <input
          id="filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder="Search by title"
        />
        <NewTaskForm onCreate={createTask} />
      </div>

      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}

      {loading ? (
        <p>Loading board...</p>
      ) : (
        <main className="columns">
          {COLUMN_STATUSES.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={visibleTasks.filter((task) => task.status === status)}
              onDelete={deleteTask}
              onDragStart={setDraggedId}
              onDrop={moveTask}
            />
          ))}
        </main>
      )}
    </div>
  );
}
