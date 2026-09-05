import { useEffect, useState } from "react";
import type { Todo } from "../types/todo";
import {
  getTodos,
  toggleTodo,
  deleteTodo,
} from "../services/todoApi";
import type { GetTodosParams } from "../services/todoApi";
import TodoForm from "../components/TodoForm";
import PriorityBadge from "../components/PriorityBadge";

type StatusFilter = "all" | "pending" | "completed";
type PriorityFilter = "all" | "LOW" | "MEDIUM" | "HIGH";

const formatDueDate = (dueDate: string | null) => {
  if (!dueDate) return null;

  return new Date(dueDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const isOverdue = (todo: Todo) =>
  !todo.completed && !!todo.dueDate && new Date(todo.dueDate) < new Date();

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [priority, setPriority] = useState<PriorityFilter>("all");

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: GetTodosParams = {
        page: 1,
        limit: 10,
        ...(status !== "all" && { status }),
        ...(priority !== "all" && { priority }),
        ...(search && { search }),
      };

      const response = await getTodos(params);

      setTodos(response.data);
    } catch (err) {
      console.error("Failed to load todos", err);
      setError("Failed to load todos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [status, priority, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleToggle = async (id: string) => {
    await toggleTodo(id);
    loadTodos();
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this todo?"
    );

    if (!confirmed) return;

    await deleteTodo(id);
    loadTodos();
  };

  return (
    <div className="app-container">
      <div className="topbar">
        <span className="topbar__mark">Z</span>
        <span className="topbar__name">ziptrrip todos</span>
      </div>

      <header className="app-header">
        <div className="app-header__text">
          <h1>My Todos</h1>
          <p>Organize and manage your tasks efficiently.</p>
        </div>

        {!showForm && (
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingTodo(null);
              setShowForm(true);
            }}
          >
            + Add Todo
          </button>
        )}
      </header>

      {showForm && (
        <TodoForm
          {...(editingTodo && { todo: editingTodo })}
          onSaved={() => {
            setShowForm(false);
            setEditingTodo(null);
            loadTodos();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingTodo(null);
          }}
        />
      )}

      <div className="toolbar">
        <div className="toolbar__search">
          <input
            type="text"
            className="field-input"
            placeholder="Search todos..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="toolbar__select">
          <select
            className="field-select"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="toolbar__select">
          <select
            className="field-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as PriorityFilter)}
          >
            <option value="all">All Priorities</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>
      </div>

      {loading && <div className="state-message">Loading todos...</div>}

      {!loading && error && <p className="error-banner">{error}</p>}

      {!loading && !error && todos.length === 0 && (
        <div className="state-message">
          No todos found matching your filters.
        </div>
      )}

      {!loading && !error && todos.length > 0 && (
        <div className="todo-list">
          {todos.map((todo) => {
            const dueDate = formatDueDate(todo.dueDate);

            return (
              <div
                key={todo.id}
                className={`todo-card${
                  todo.completed ? " todo-card--completed" : ""
                }`}
              >
                <input
                  type="checkbox"
                  className="todo-card__checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo.id)}
                  aria-label={
                    todo.completed ? "Mark as pending" : "Mark as complete"
                  }
                />

                <div className="todo-card__body">
                  <div className="todo-card__top">
                    <span className="todo-card__title">{todo.title}</span>
                    <PriorityBadge priority={todo.priority} />
                    <span
                      className={`badge badge-status${
                        todo.completed ? " badge-status--completed" : ""
                      }`}
                    >
                      {todo.completed ? "Completed" : "Pending"}
                    </span>
                  </div>

                  {todo.description && (
                    <p className="todo-card__description">
                      {todo.description}
                    </p>
                  )}

                  {dueDate && (
                    <div className="todo-card__meta">
                      <span
                        className={`due-date${
                          isOverdue(todo) ? " due-date--overdue" : ""
                        }`}
                      >
                        Due {dueDate}
                      </span>
                    </div>
                  )}
                </div>

                <div className="todo-card__actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      window.location.href = `/todo.html?id=${todo.id}`;
                    }}
                  >
                    View
                  </button>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setEditingTodo(todo);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(todo.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
