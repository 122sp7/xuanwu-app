// Global REST API route registry
export const API_ROUTES = {
  tasks: {
    list: "/api/tasks",
    detail: (id: string) => `/api/tasks/${id}`,
  },
} as const;
