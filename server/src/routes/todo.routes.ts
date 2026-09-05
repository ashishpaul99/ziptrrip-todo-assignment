import { Router } from "express";

import {
  createTodoController,
  getTodosController,
  getTodoController,
  updateTodoController,
  toggleTodoController,
  deleteTodoController,
} from "../controllers/todo.controller.js";

import { validate } from "../middleware/validate.middleware.js";

import {
  createTodoSchema,
  updateTodoSchema,
} from "../schemas/todo.schema.js";

const router = Router();

router.post(
  "/",
  validate(createTodoSchema),
  createTodoController
);

router.get("/", getTodosController);

router.get("/:id", getTodoController);

router.put(
  "/:id",
  validate(updateTodoSchema),
  updateTodoController
);

router.patch("/:id/toggle", toggleTodoController);

router.delete("/:id", deleteTodoController);

export default router;