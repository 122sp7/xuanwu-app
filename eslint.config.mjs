import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  // ─── Package boundary enforcement ───────────────────────────────────────
  // Forbid legacy import paths that were migrated to packages/*.
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/shared/*"],
              message: "Use @shared-types, @shared-utils, @shared-validators, @shared-constants, or @shared-hooks instead.",
            },
            {
              group: ["@/infrastructure/*"],
              message: "Use @integration-firebase, @integration-upstash, or @integration-http instead.",
            },
            {
              group: ["@/libs/*"],
              message: "Use the corresponding @lib-* or @integration-* package alias instead.",
            },
            {
              group: ["@/ui/shadcn/*"],
              message: "Use @ui-shadcn/* instead.",
            },
            {
              group: ["@/ui/vis", "@/ui/vis/*"],
              message: "Use @ui-vis instead.",
            },
            {
              group: ["@/interfaces/*"],
              message: "Use @api-contracts instead.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
