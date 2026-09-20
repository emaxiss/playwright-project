import type { SortOption, Tag } from "../types";
import { AVAILABLE_TAGS } from "../types";
import { PlusIcon, SearchIcon } from "./Icons";

interface ToolbarProps {
  search: string;
  activeTags: Tag[];
  sort: SortOption;
  onSearch: (value: string) => void;
  onToggleTag: (tag: Tag) => void;
  onSort: (value: SortOption) => void;
  onNewTask: () => void;
}

export function Toolbar({
  search,
  activeTags,
  sort,
  onSearch,
  onToggleTag,
  onSort,
  onNewTask,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="search-field">
        <SearchIcon />
        <input
          id="filter"
          type="search"
          aria-label="Filter tasks"
          placeholder="Search tasks"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
        />
      </div>

      <div className="chips" role="group" aria-label="Filter by tag">
        {AVAILABLE_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            className="chip"
            aria-pressed={activeTags.includes(tag)}
            onClick={() => onToggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="toolbar-spacer" />

      <div className="sort-field">
        <label className="label" htmlFor="sort">
          Sort
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(event) => onSort(event.target.value as SortOption)}
        >
          <option value="manual">Manual</option>
          <option value="title">Title</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      <button type="button" className="btn btn-primary" onClick={onNewTask}>
        <PlusIcon />
        New Task
      </button>
    </div>
  );
}
