# Features

## Todo Management

- **Create Todo** — Add a new todo via the "Add Todo" button on the Todo List page, which opens an inline form (title required; description, priority, and due date optional).
- **View All Todos** — The Todo List page (`index.html`) fetches and displays todos as cards, respecting the active search and filter state.
- **View Todo Details** — Clicking "View" on a todo card navigates to `todo.html?id=<todo-id>`, a dedicated details page for that single todo.
- **Edit Todo** — Available from both the Todo List page ("Edit" button per card) and the Todo Details page ("Edit Todo" button). Both reuse the same `TodoForm` component, pre-filled with the todo's current data.
- **Delete Todo** — Available from both the Todo List page and the Todo Details page, with a confirmation prompt (`window.confirm`) before the delete request is sent.
- **Mark Complete** — Toggling the checkbox on a todo card, or clicking "Mark Complete" on the details page, flips the todo to completed.
- **Mark Pending** — The same checkbox/button toggles a completed todo back to pending.

## Todo Information

Each todo displays:

- **Title** — required field, shown on both the list card and the details page.
- **Description** — optional; shown on the card and details page only when present.
- **Priority** — LOW, MEDIUM, or HIGH, shown as a colored badge on both pages.
- **Due Date** — optional; shown on the card ("Due <date>") and on the details page, formatted as a localized date. Cards visually flag an incomplete todo whose due date has passed ("overdue").
- **Completion Status** — shown as a "Pending" or "Completed" badge on both the card and the details page.
- **Created Date** — shown on the Todo Details page only, formatted as a localized date/time.

## Search and Filtering

- **Search** — a text input ("Search todos...") on the Todo List page filters todos by matching the search term against the todo's title or description (case-insensitive), per the backend's `GET /api/todos?search=` implementation. Input is debounced (400ms) before triggering a request, so it does not fire on every keystroke.
- **Status Filter** — a dropdown with All / Pending / Completed, mapped to the backend's `status=pending` / `status=completed` query parameter (omitted entirely when "All" is selected).
- **Priority Filter** — a dropdown with All Priorities / LOW / MEDIUM / HIGH, mapped to the backend's `priority=` query parameter (omitted when "All Priorities" is selected).
- **Combined Filters** — search, status, and priority are independent state values that are all included in the same `GET /api/todos` request when active, so they narrow the result set together (e.g. `?search=assignment&status=pending&priority=HIGH`). Changing any one filter re-fetches the list with all currently active filters applied.

## Multiple Page Application

The frontend is a true Multiple Page Application, not a single-page app with client-side routing:

- **Todo List page** — served from `index.html`, mounted by `src/main.tsx` into its own React root, rendering `TodosPage`.
- **Todo Details page** — served from `todo.html`, mounted by `src/todo-main.tsx` into a separate React root, rendering `TodoDetailsPage`.
- **Separate HTML entry points** — Vite is configured (`vite.config.ts`, `build.rollupOptions.input`) with both `index.html` and `todo.html` as independent build entries, each with its own bundle.
- **Query parameter usage** — the Todo Details page reads the todo's id from the URL query string:

  ```
  todo.html?id=<todo-id>
  ```

  parsed with `URLSearchParams(window.location.search)`. Navigation between the two pages uses real browser navigation (`window.location.href`), not a router.

## User Experience

- **Responsive layout** — the app container, header, toolbar, todo cards, and details page use flex/grid layouts with media queries (`max-width: 640px`) that stack controls and actions vertically on narrow screens.
- **Loading state** — both pages show a "Loading todos..." / "Loading..." message while their initial data fetch is in progress.
- **Error state** — both pages display a dedicated error message (in a styled banner) if the API request fails, instead of a blank or broken screen.
- **Empty state** — the Todo List page shows "No todos found matching your filters." when the current search/filter combination returns no results.
- **Form validation** — the shared `TodoForm` requires a non-empty title before submitting and shows an inline error if it's missing; API/network failures during save are also caught and shown as a distinguishable create- vs. update-specific error message.
- **Priority badges** — LOW, MEDIUM, and HIGH each render with a distinct, subtly colored badge (`PriorityBadge` component), consistent across the list and details pages.
- **Completed todo styling** — a completed todo's card and details view show a muted title with strikethrough text and a muted description, plus a "Completed" status badge, visually distinguishing it from pending todos.
