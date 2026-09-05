import prisma from "../lib/prisma.js";

interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
}

interface UpdateTodoInput {
  title?: string;
  description?: string | null;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  completed?: boolean;
  dueDate?: string | null;
}

interface GetTodosInput {
  status?: string | undefined;
  priority?: string | undefined;
  search?: string | undefined;
  page?: number;
  limit?: number;
}

export const createTodo = async (data: CreateTodoInput) => {
  return prisma.todo.create({
    data: {
      title: data.title,
      ...(data.description !== undefined && { description: data.description }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
    },
  });
};

export const getTodos = async ({
  status,
  priority,
  search,
  page = 1,
  limit = 10,
}: GetTodosInput) => {
  const skip = (page - 1) * limit;

  const where: any = {};

  if (status === "completed") {
    where.completed = true;
  }

  if (status === "pending") {
    where.completed = false;
  }

  if (priority) {
    where.priority = priority;
  }

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const [todos, total] = await Promise.all([
    prisma.todo.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.todo.count({
      where,
    }),
  ]);

  return {
    todos,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getTodoById = async (id: string) => {
  return prisma.todo.findUnique({
    where: {
      id,
    },
  });
};

export const updateTodo = async (
  id: string,
  data: UpdateTodoInput
) => {
  return prisma.todo.update({
    where: {
      id,
    },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.completed !== undefined && { completed: data.completed }),
      ...(data.dueDate === null
        ? { dueDate: null }
        : data.dueDate !== undefined
        ? { dueDate: new Date(data.dueDate) }
        : {}),
    },
  });
};

export const toggleTodo = async (id: string) => {
  const todo = await getTodoById(id);

  if (!todo) {
    return null;
  }

  return prisma.todo.update({
    where: {
      id,
    },
    data: {
      completed: !todo.completed,
    },
  });
};

export const deleteTodo = async (id: string) => {
  const todo = await getTodoById(id);

  if (!todo) {
    return null;
  }

  await prisma.todo.delete({
    where: {
      id,
    },
  });

  return todo;
};