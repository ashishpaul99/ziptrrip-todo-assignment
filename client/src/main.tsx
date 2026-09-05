import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TodosPage from "./pages/TodosPage";
import "./styles/index.css";
import "./styles/layout.css";
import "./styles/todo.css";
import "./styles/form.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TodosPage />
  </StrictMode>
);
