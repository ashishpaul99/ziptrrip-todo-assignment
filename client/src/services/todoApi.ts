import axios from "axios";
import type { TodosResponse, TodoResponse } from "../types/todo";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string | null;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  completed?: boolean;
  dueDate?: string | null;
}

export interface GetTodosParams {
  status?: "pending" | "completed";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  search?: string;
  page?: number;
  limit?: number;
}

export const getTodos = async (params?: GetTodosParams) => {
  const response = await api.get<TodosResponse>("/todos", {
    params,
  });

  return response.data;
};

export const getTodoById = async (id: string) => {
  const response = await api.get<TodoResponse>(`/todos/${id}`);

  return response.data.data;
};

export const createTodo = async (data: CreateTodoInput) => {
  const response = await api.post<TodoResponse>("/todos", data);

  return response.data.data;
};

export const updateTodo = async (id: string, data: UpdateTodoInput) => {
  const response = await api.put<TodoResponse>(`/todos/${id}`, data);

  return response.data.data;
};

export const toggleTodo = async (id: string) => {
  const response = await api.patch<TodoResponse>(`/todos/${id}/toggle`);

  return response.data.data;
};

export const deleteTodo = async (id: string) => {
  await api.delete(`/todos/${id}`);
};
