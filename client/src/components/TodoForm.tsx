import { useState } from "react";
import type { SyntheticEvent } from "react";
import { createTodo, updateTodo } from "../services/todoApi";
import type { CreateTodoInput } from "../services/todoApi";
import type { Todo } from "../types/todo";

type Priority = CreateTodoInput["priority"];

interface TodoFormProps {
  todo?: Todo;
  onSaved: (todo: Todo) => void;
  onCancel: () => void;
}

const toDateInputValue = (dueDate: string | null): string => {
  if (!dueDate) return "";
  return dueDate.slice(0, 10);
};

export default function TodoForm({ todo, onSaved, onCancel }: TodoFormProps) {
  const isEditMode = Boolean(todo);

  const [title, setTitle] = useState(todo?.title ?? "");
  const [description, setDescription] = useState(todo?.description ?? "");
  const [priority, setPriority] = useState<Priority>(todo?.priority ?? "MEDIUM");
  const [dueDate, setDueDate] = useState(toDateInputValue(todo?.dueDate ?? null));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setSubmitting(true);

      let saved: Todo;

      if (isEditMode && todo) {
        saved = await updateTodo(todo.id, {
          title: title.trim(),
          description: description.trim() ? description.trim() : null,
          priority,
          dueDate: dueDate ? dueDate : null,
        });
      } else {
        const data: CreateTodoInput = {
          title: title.trim(),
          ...(description.trim() && { description: description.trim() }),
          ...(priority && { priority }),
          ...(dueDate && { dueDate }),
        };

        saved = await createTodo(data);
      }

      onSaved(saved);
    } catch (err) {
      console.error("Failed to save todo", err);
      setError(
        isEditMode
          ? "Failed to update todo. Please try again."
          : "Failed to create todo. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <h2 className="todo-form__title">
        {isEditMode ? "Edit Todo" : "Add Todo"}
      </h2>

      {error && <p className="form-error">{error}</p>}

      <div className="form-field">
        <label
          htmlFor="title"
          className="form-field__label form-field__label--required"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          className="field-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
        />
      </div>

      <div className="form-field">
        <label htmlFor="description" className="form-field__label">
          Description
        </label>
        <textarea
          id="description"
          className="field-textarea"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details (optional)"
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="priority" className="form-field__label">
            Priority
          </label>
          <select
            id="priority"
            className="field-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="dueDate" className="form-field__label">
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            className="field-input"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? "Saving..." : isEditMode ? "Update Todo" : "Save Todo"}
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
