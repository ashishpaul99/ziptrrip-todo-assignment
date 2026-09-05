import type { Request, Response } from "express";

import {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  toggleTodo,
  deleteTodo,
} from "../services/todo.services.js";

export const createTodoController = async (
  req: Request,
  res: Response
) => {
  try {
    const todo = await createTodo(req.body);

    res.status(201).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create todo",
    });
  }
};

export const getTodosController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      status,
      priority,
      search,
      page = "1",
      limit = "10",
    } = req.query;

    const result = await getTodos({
      status: typeof status === "string" ? status : undefined,
      priority: typeof priority === "string" ? priority : undefined,
      search: typeof search === "string" ? search : undefined,
      page: Number(page),
      limit: Number(limit),
    });

    res.status(200).json({
      success: true,
      data: result.todos,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch todos",
    });
  }
};

export const getTodoController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Todo id is required",
      });
    }

    const todo = await getTodoById(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch todo",
    });
  }
};

export const updateTodoController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Todo id is required",
      });
    }

    const existingTodo = await getTodoById(id);

    if (!existingTodo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    const todo = await updateTodo(id, req.body);

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update todo",
    });
  }
};

export const toggleTodoController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Todo id is required",
      });
    }

    const todo = await toggleTodo(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to toggle todo status",
    });
  }
};

export const deleteTodoController = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Todo id is required",
      });
    }

    const todo = await deleteTodo(id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete todo",
    });
  }
};