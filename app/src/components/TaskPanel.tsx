import { useState } from "react";
import { useFocusTrap } from "../useFocusTrap";
import type { ColumnStatus, Tag, Task } from "../types";
import { AVAILABLE_TAGS, COLUMN_STATUSES } from "../types";
import { AlertIcon, CloseIcon } from "./Icons";

export interface TaskDraft {
  title: string;
  description: string;
  status: ColumnStatus;
  tags: Tag[];
  assignee: string;
}

const ASSIGNEES = [
  "Ada Cole",
  "Ravi Menon",
  "Jo Park",
  "Lena Fischer",
  "Unassigned",
];

interface TaskPanelProps {
  task: Task | null;
  onSave: (draft: TaskDraft) => Promise<string | null>;
  onRequestDelete: (task: Task) => void;
  onClose: () => void;
}

export function TaskPanel({
  task,
  onSave,
  onRequestDelete,
  onClose,
}: TaskPanelProps) {
  const isEdit = task !== null;
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [status, setStatus] = useState<ColumnStatus>(task?.status ?? "To Do");
  const [tags, setTags] = useState<Tag[]>(task?.tags ?? []);
  const [assignee, setAssignee] = useState(task?.assignee ?? "Ada Cole");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const panelRef = useFocusTrap<HTMLElement>(onClose);

  function toggleTag(tag: Tag) {
    setTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setError("");
    setPending(true);
    const message = await onSave({
      title: title.trim(),
      description,
      status,
      tags,
      assignee,
    });
    setPending(false);
    if (message) setError(message);
  }

  return (
    <>
      <div className="panel-scrim" onClick={onClose} />
      <aside
        ref={panelRef}
        className="panel"
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "Task details" : "New task"}
      >
        <div className="panel-head">
          <h2>{isEdit ? "Task details" : "New task"}</h2>
          <button
            type="button"
            className="btn btn-icon"
            aria-label="Close panel"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        <form
          id="task-form"
          className="panel-body"
          onSubmit={handleSubmit}
          aria-label={isEdit ? "Edit task" : "Create task"}
        >
          <div className="field">
            <label htmlFor="task-title">Title</label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="task-status">Status</label>
            <select
              id="task-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as ColumnStatus)
              }
            >
              {COLUMN_STATUSES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="task-assignee">Assignee</label>
            <select
              id="task-assignee"
              value={assignee}
              onChange={(event) => setAssignee(event.target.value)}
            >
              {ASSIGNEES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <span className="label" id="tags-label">
              Tags
            </span>
            <div
              className="tag-picker"
              role="group"
              aria-labelledby="tags-label"
            >
              {AVAILABLE_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="chip"
                  aria-pressed={tags.includes(tag)}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="field-error" role="alert">
              <AlertIcon size={14} />
              {error}
            </p>
          )}
        </form>

        <div className="panel-foot">
          <button
            type="submit"
            form="task-form"
            className="btn btn-primary"
            disabled={pending}
          >
            {isEdit ? "Save changes" : "Create task"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          {isEdit && (
            <button
              type="button"
              className="btn btn-danger-quiet"
              onClick={() => onRequestDelete(task)}
            >
              Delete
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
