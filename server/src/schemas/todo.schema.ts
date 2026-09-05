import { z } from "zod";

export const createTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters")
    .optional(),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH"])
    .optional()
    .default("MEDIUM"),

  dueDate: z
    .string()
    .date("Due date must be in YYYY-MM-DD format")
    .optional(),
});

export const updateTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(100)
    .optional(),

  description: z
    .string()
    .trim()
    .max(500)
    .nullable()
    .optional(),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH"])
    .optional(),

  completed: z
    .boolean()
    .optional(),

  dueDate: z
    .string()
    .date("Due date must be in YYYY-MM-DD format")
    .nullable()
    .optional(),
});