import { resolve } from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
      "@shared-types": resolve(__dirname, "packages/shared-types/index.ts"),
      "@shared-utils": resolve(__dirname, "packages/shared-utils/index.ts"),
      "@lib-zod": resolve(__dirname, "packages/lib-zod/index.ts"),
      "@lib-uuid": resolve(__dirname, "packages/lib-uuid/index.ts"),
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