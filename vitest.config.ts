import { resolve } from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@shared-types": resolve(__dirname, "packages/shared-types/index.ts"),
      "@lib-zod": resolve(__dirname, "packages/lib-zod/index.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["**/*.{test,spec}.{ts,tsx,js,jsx}"],
    exclude: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
      "**/__pycache__/**",
    ],
  },
});