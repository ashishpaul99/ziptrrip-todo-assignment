export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TodoResponse {
  success: boolean;
  data: Todo;
}

export interface TodosResponse {
  success: boolean;
  data: Todo[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
