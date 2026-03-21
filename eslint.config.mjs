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
  {
    files: [
      "app/**/*.{ts,tsx,mts}",
      "modules/**/*.{ts,tsx,mts}",
      "infrastructure/**/*.{ts,tsx,mts}",
      "interfaces/**/*.{ts,tsx,mts}",
      "core/**/*.{ts,tsx,mts}",
      "libs/**/*.{ts,tsx,mts}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/shared/*"],
              message: "Use the explicit package aliases like @shared-types or @shared-utils instead of legacy shared/* paths.",
            },
            {
              group: ["@/libs/*"],
              message: "Import through the package boundary (@lib-*, @integration-*, @ui-shadcn) instead of legacy libs/* paths.",
            },
            {
              group: ["@/ui/shadcn/ui/*", "@/ui/shadcn/utils/*"],
              message: "Import shadcn primitives through @ui-shadcn so the app uses a single public UI boundary.",
            },
            {
              group: ["@/infrastructure/firebase", "@/infrastructure/firebase/*", "@/infrastructure/upstash", "@/infrastructure/upstash/*"],
              message: "Use @integration-firebase or @integration-upstash instead of legacy infrastructure shim paths.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["packages/**/*.{ts,tsx,mts}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/*", "@/modules/*", "@/interfaces/*", "@/infrastructure/*"],
              message: "packages/* must stay below app/modules/interfaces/infrastructure and only expose stable shared or integration boundaries.",
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
