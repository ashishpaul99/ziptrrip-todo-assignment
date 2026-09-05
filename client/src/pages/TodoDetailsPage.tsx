import { useEffect, useState } from "react";
import type { Todo } from "../types/todo";
import { getTodoById, toggleTodo, deleteTodo } from "../services/todoApi";
import TodoForm from "../components/TodoForm";
import PriorityBadge from "../components/PriorityBadge";

export default function TodoDetailsPage() {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const todoId = params.get("id");

  const loadTodo = async () => {
    if (!todoId) {
      setLoading(false);
      return;
    }

    try {
      setError(null);

      const data = await getTodoById(todoId);

      setTodo(data);
    } catch (err) {
      console.error("Failed to load todo", err);
      setError("Failed to load this todo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodo();
  }, [todoId]);

  const handleToggle = async () => {
    if (!todo) return;

    const updatedTodo = await toggleTodo(todo.id);

    setTodo(updatedTodo);
  };

  const handleDelete = async () => {
    if (!todo) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this todo?"
    );

    if (!confirmed) return;

    await deleteTodo(todo.id);

    window.location.href = "/";
  };

  const goBack = () => {
    window.location.href = "/";
  };

  const topbar = (
    <div className="topbar">
      <span className="topbar__mark">Z</span>
      <span className="topbar__name">ziptrrip todos</span>
    </div>
  );

  if (loading) {
    return (
      <div className="app-container">
        {topbar}
        <div className="state-message">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        {topbar}
        <p className="error-banner">{error}</p>
        <button className="btn btn-secondary" onClick={goBack}>
          Back to Todos
        </button>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="app-container">
        {topbar}
        <div className="state-message">Todo not found</div>
        <br />
        <button className="btn btn-secondary" onClick={goBack}>
          Back to Todos
        </button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="app-container">
        {topbar}
        <button className="back-link" onClick={goBack}>
          ← Back to Todos
        </button>

        <h1 style={{ marginBottom: 20 }}>Todo Details</h1>

        <TodoForm
          todo={todo}
          onSaved={(updatedTodo) => {
            setTodo(updatedTodo);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="app-container">
      {topbar}
      <button className="back-link" onClick={goBack}>
        ← Back to Todos
      </button>

      <div
        className={`details-card${
          todo.completed ? " details-card--completed" : ""
        }`}
      >
        <h1 className="details-card__title">{todo.title}</h1>

        <div className="details-card__badges">
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
          <p className="details-card__description">{todo.description}</p>
        )}

        <dl className="details-grid">
          <div className="details-grid__item">
            <dt>Due Date</dt>
            <dd>
              {todo.dueDate
                ? new Date(todo.dueDate).toLocaleDateString()
                : "No due date"}
            </dd>
          </div>

          <div className="details-grid__item">
            <dt>Created</dt>
            <dd>{new Date(todo.createdAt).toLocaleString()}</dd>
          </div>
        </dl>

        <div className="details-actions">
          <button className="btn btn-secondary" onClick={handleToggle}>
            {todo.completed ? "Mark Pending" : "Mark Complete"}
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => setIsEditing(true)}
          >
            Edit Todo
          </button>

          <button className="btn btn-danger" onClick={handleDelete}>
            Delete Todo
          </button>
        </div>
      </div>
    </div>
  );
}
