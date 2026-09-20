import { useState } from "react";
import type { ColumnStatus, Tag } from "../types";
import { COLUMN_STATUSES } from "../types";

const AVAILABLE_TAGS: Tag[] = ["Feature", "Bug", "Design", "High Priority"];

interface NewTaskFormProps {
  onCreate: (input: {
    title: string;
    description: string;
    status: ColumnStatus;
    tags: Tag[];
  }) => Promise<void>;
}

export function NewTaskForm({ onCreate }: NewTaskFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ColumnStatus>("To Do");
  const [tags, setTags] = useState<Tag[]>([]);
  const [error, setError] = useState("");

  function toggleTag(tag: Tag) {
    setTags((current) =>
      current.includes(tag)
        ? current.filter((t) => t !== tag)
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
    await onCreate({ title: title.trim(), description, status, tags });
    setTitle("");
    setDescription("");
    setTags([]);
    setOpen(false);
  }

  if (!open) {
    return (
      <button type="button" className="primary" onClick={() => setOpen(true)}>
        New Task
      </button>
    );
  }

  return (
    <form className="new-task-form" onSubmit={handleSubmit} aria-label="New task">
      <label htmlFor="task-title">Title</label>
      <input
        id="task-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <label htmlFor="task-description">Description</label>
      <input
        id="task-description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <label htmlFor="task-status">Status</label>
      <select
        id="task-status"
        value={status}
        onChange={(event) => setStatus(event.target.value as ColumnStatus)}
      >
        {COLUMN_STATUSES.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <fieldset>
        <legend>Tags</legend>
        {AVAILABLE_TAGS.map((tag) => (
          <label key={tag} className="tag-option">
            <input
              type="checkbox"
              checked={tags.includes(tag)}
              onChange={() => toggleTag(tag)}
            />
            {tag}
          </label>
        ))}
      </fieldset>

      {error && <p role="alert">{error}</p>}

      <div className="form-actions">
        <button type="submit" className="primary">
          Create Task
        </button>
        <button type="button" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
