import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "@typescript-eslint/eslint-plugin";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsdoc from "eslint-plugin-jsdoc";
 
const sourceFileGlobs = ["**/*.{js,jsx,mjs,cjs,ts,tsx}"];
const typescriptFileGlobs = ["**/*.{ts,tsx}"];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: sourceFileGlobs,
    plugins: {
      jsdoc,
    },
    settings: {
      jsdoc: {
        mode: "typescript",
      },
    },
    rules: {
      "jsdoc/check-alignment": "warn",
      "jsdoc/check-syntax": "warn",
      "jsdoc/check-tag-names": "warn",
      "jsdoc/no-blank-blocks": "warn",
    },
  },
  {
    files: typescriptFileGlobs,
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "typeParameter",
          format: ["PascalCase"],
        },
        {
          selector: "variable",
          modifiers: ["destructured"],
          format: null,
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "variable",
          format: ["camelCase", "PascalCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        {
          selector: "parameter",
          modifiers: ["destructured"],
          format: null,
        },
        {
          selector: "parameter",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "enumMember",
          format: ["PascalCase", "UPPER_CASE"],
        },
      ],
    },
  },
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
  // ─── Wiki / Wiki-Beta isolation boundaries ───────────────────────────────
  {
    files: ["modules/wiki/**/*.{ts,tsx}", "app/(shell)/wiki/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/modules/wiki-beta", "@/modules/wiki-beta/*"],
              message: "wiki 與 wiki-beta 必須完全隔離，禁止從 wiki 引用 wiki-beta。",
            },
            {
              group: ["@/app/(shell)/wiki-beta", "@/app/(shell)/wiki-beta/*"],
              message: "wiki 與 wiki-beta 必須完全隔離，禁止從 wiki 引用 wiki-beta route。",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["modules/wiki-beta/**/*.{ts,tsx}", "app/(shell)/wiki-beta/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/modules/wiki", "@/modules/wiki/*"],
              message: "wiki-beta 與 wiki 必須完全隔離，禁止從 wiki-beta 引用 wiki。",
            },
            {
              group: ["@/app/(shell)/wiki", "@/app/(shell)/wiki/*"],
              message: "wiki-beta 與 wiki 必須完全隔離，禁止從 wiki-beta 引用 wiki route。",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".agents/**",
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
