// ─── REST API Route Registry ──────────────────────────────────────────────────

export const API_ROUTES = {
  tasks: {
    list: "/api/tasks",
    detail: (id: string) => `/api/tasks/${id}`,
  },
} as const;

// ─── GraphQL Schema ───────────────────────────────────────────────────────────

export const typeDefs = `
  type Query {
    hello: String
  }
`;
