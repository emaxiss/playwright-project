import { useCallback, useEffect, useRef, useState } from "react";
import { Column } from "./components/Column";
import { LoginScreen } from "./components/LoginScreen";
import { Toolbar } from "./components/Toolbar";
import { TaskPanel, type TaskDraft } from "./components/TaskPanel";
import {
  ConfirmDialog,
  ErrorBanner,
  Toasts,
  type Toast,
} from "./components/Feedback";
import type { Board, ColumnStatus, SortOption, Tag, Task, User } from "./types";
import { COLUMN_STATUSES, initials } from "./types";

const BOARDS = [
  { id: "web", label: "Web Application" },
  { id: "mobile", label: "Mobile Application" },
  { id: "marketing", label: "Marketing Campaign" },
];

const SESSION_KEY = "kanban.session";

interface Session {
  token: string;
  user: User;
}

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function App() {
  const [session, setSession] = useState<Session | null>(readSession);
  const [boardId, setBoardId] = useState("web");
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState<Tag[]>([]);
  const [sort, setSort] = useState<SortOption>("manual");

  const [panelTask, setPanelTask] = useState<Task | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const [pendingDelete, setPendingDelete] = useState<Task | null>(null);

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<ColumnStatus | null>(null);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  /** Lets async callbacks tell whether the user has since switched boards. */
  const boardIdRef = useRef(boardId);
  useEffect(() => {
    boardIdRef.current = boardId;
  }, [boardId]);

  const pushToast = useCallback(
    (
      text: string,
      variant: Toast["variant"] = "success",
      undo?: () => void,
    ) => {
      const id = ++toastId.current;
      setToasts((current) => [...current, { id, text, variant, undo }]);
      setTimeout(
        () => setToasts((current) => current.filter((item) => item.id !== id)),
        5000,
      );
    },
    [],
  );

  const request = useCallback(
    async (path: string, init: RequestInit = {}) => {
      return fetch(path, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token ?? ""}`,
          ...(init.headers ?? {}),
        },
      });
    },
    [session],
  );

  const loadBoard = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      const response = await request(`/api/boards/${boardId}`);
      if (response.status === 401) {
        localStorage.removeItem(SESSION_KEY);
        setSession(null);
        return;
      }
      if (!response.ok) throw new Error("Unable to load board");
      setBoard(await response.json());
      setError("");
    } catch {
      setBoard(null);
      setError("Unable to load board");
    } finally {
      setLoading(false);
    }
  }, [boardId, request, session]);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  async function signIn(username: string, password: string) {
    const response = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) return "Invalid username or password";
    const next = (await response.json()) as Session;
    localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    setSession(next);
    return null;
  }

  function signOut() {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setBoard(null);
  }

  function selectBoard(id: string) {
    if (id === boardId) return;
    setBoardId(id);
    setSearch("");
    setActiveTags([]);
    setPanelOpen(false);
    setPanelTask(null);
    setPendingDelete(null);
  }

  async function saveTask(draft: TaskDraft) {
    const editing = panelTask;
    const response = editing
      ? await request(`/api/boards/${boardId}/tasks/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(draft),
        })
      : await request(`/api/boards/${boardId}`, {
          method: "POST",
          body: JSON.stringify(draft),
        });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      return body.error ?? "Unable to save task";
    }

    setPanelOpen(false);
    setPanelTask(null);
    await loadBoard();
    pushToast(editing ? "Task updated" : "Task created");
    return null;
  }

  async function confirmDelete() {
    const task = pendingDelete;
    if (!task) return;
    setPendingDelete(null);
    setPanelOpen(false);
    setPanelTask(null);

    const response = await request(`/api/boards/${boardId}/tasks/${task.id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      pushToast("Unable to delete task", "error");
      return;
    }
    await loadBoard();

    const deletedFrom = boardId;
    pushToast(`Deleted "${task.title}"`, "success", async () => {
      await request(`/api/boards/${deletedFrom}`, {
        method: "POST",
        body: JSON.stringify(task),
      });
      if (deletedFrom === boardIdRef.current) await loadBoard();
    });
  }

  async function moveTask(status: ColumnStatus) {
    const id = draggedId;
    setDraggedId(null);
    setDropTarget(null);
    if (!id) return;

    const task = board?.tasks.find((item) => item.id === id);
    if (!task || task.status === status) return;

    const response = await request(`/api/boards/${boardId}/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      pushToast("Unable to move task", "error");
      return;
    }
    await loadBoard();
    pushToast(`Moved to ${status}`);
  }

  if (!session) return <LoginScreen onSignIn={signIn} />;

  const priority = (task: Task) =>
    task.tags.includes("High Priority") ? 0 : task.tags.includes("Bug") ? 1 : 2;

  const visible = (board?.tasks ?? [])
    .filter((task) =>
      task.title.toLowerCase().includes(search.trim().toLowerCase()),
    )
    .filter(
      (task) =>
        activeTags.length === 0 ||
        activeTags.every((tag) => task.tags.includes(tag)),
    )
    .sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "priority") return priority(a) - priority(b);
      return 0;
    });

  const modalOpen = panelOpen || pendingDelete !== null;

  function closePanel() {
    setPanelOpen(false);
    setPanelTask(null);
  }

  return (
    <div className="shell">
      {/* the board is inert while a modal is open so tab and screen readers
          cannot reach content the dialog claims is unavailable */}
      <div className="shell-content" inert={modalOpen || undefined}>
        <header className="topbar">
          <span className="brand">
            <span className="brand-mark" aria-hidden="true">
              K
            </span>
            Kanban
          </span>

          <nav className="tabs" aria-label="Boards">
            {BOARDS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                className="tab"
                aria-current={id === boardId}
                onClick={() => selectBoard(id)}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="topbar-spacer" />

          <span className="user-chip">
            <span className="avatar" aria-hidden="true">
              {initials(session.user.name)}
            </span>
            {session.user.name}
          </span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={signOut}
          >
            Logout
          </button>
        </header>

        <main className="workspace">
          <div className="board-head">
            <div>
              <h1>{board?.name ?? "Board"}</h1>
              <p>{board?.description}</p>
            </div>
          </div>

          <Toolbar
            search={search}
            activeTags={activeTags}
            sort={sort}
            onSearch={setSearch}
            onToggleTag={(tag) =>
              setActiveTags((current) =>
                current.includes(tag)
                  ? current.filter((item) => item !== tag)
                  : [...current, tag],
              )
            }
            onSort={setSort}
            onNewTask={() => {
              setPanelTask(null);
              setPanelOpen(true);
            }}
          />

          {error && <ErrorBanner message={error} />}

          <div className="columns">
            {COLUMN_STATUSES.map((status) => (
              <Column
                key={status}
                status={status}
                tasks={visible.filter((task) => task.status === status)}
                loading={loading}
                draggedId={draggedId}
                isDropTarget={dropTarget === status}
                onOpen={(task) => {
                  setPanelTask(task);
                  setPanelOpen(true);
                }}
                onRequestDelete={setPendingDelete}
                onDragStart={setDraggedId}
                onDragEnd={() => {
                  setDraggedId(null);
                  setDropTarget(null);
                }}
                onDragOverColumn={setDropTarget}
                onDrop={moveTask}
              />
            ))}
          </div>
        </main>
      </div>

      {panelOpen && (
        <TaskPanel
          key={panelTask?.id ?? "new"}
          task={panelTask}
          onSave={saveTask}
          onRequestDelete={setPendingDelete}
          onClose={closePanel}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete task"
          message={`"${pendingDelete.title}" will be removed from the board. You can undo this from the notification.`}
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      <Toasts
        toasts={toasts}
        onDismiss={(id) =>
          setToasts((current) => current.filter((item) => item.id !== id))
        }
      />
    </div>
  );
}
