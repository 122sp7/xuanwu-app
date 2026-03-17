// Task API adapter - connects application layer to HTTP layer
export const TASK_API_ROUTES = {
  list: "/api/tasks",
  detail: (id: string) => `/api/tasks/${id}`,
  create: "/api/tasks",
  update: (id: string) => `/api/tasks/${id}`,
  delete: (id: string) => `/api/tasks/${id}`,
} as const;
