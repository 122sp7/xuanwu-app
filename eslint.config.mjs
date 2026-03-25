import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "@typescript-eslint/eslint-plugin";
import boundaries from "eslint-plugin-boundaries";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsdoc from "eslint-plugin-jsdoc";
 
const sourceFileGlobs = ["**/*.{js,jsx,mjs,cjs,ts,tsx}"];
const typescriptFileGlobs = ["**/*.{ts,tsx}"];
const moduleFileGlobs = ["modules/**/*.{ts,tsx}"];
const boundaryRuleSeverity = "warn";

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
  {
    files: moduleFileGlobs,
    plugins: {
      boundaries,
    },
    settings: {
      "boundaries/include": moduleFileGlobs,
      "boundaries/elements": [
        {
          type: "module-root",
          pattern: "modules/*/index.ts",
          capture: ["module"],
        },
        {
          type: "module-api",
          pattern: "modules/*/api/**/*",
          capture: ["module"],
        },
        {
          type: "module-domain",
          pattern: "modules/*/domain/**/*",
          capture: ["module"],
        },
        {
          type: "module-application",
          pattern: "modules/*/application/**/*",
          capture: ["module"],
        },
        {
          type: "module-infrastructure",
          pattern: "modules/*/infrastructure/**/*",
          capture: ["module"],
        },
        {
          type: "module-interfaces",
          pattern: "modules/*/interfaces/**/*",
          capture: ["module"],
        },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        boundaryRuleSeverity,
        {
          default: "disallow",
          rules: [
            {
              from: { type: "module-domain" },
              allow: [{ to: { type: "module-api" } }],
              message: "Cross-module imports must go through `modules/<target>/api`.",
            },
            {
              from: { type: "module-application" },
              allow: [{ to: { type: "module-api" } }],
              message: "Cross-module imports must go through `modules/<target>/api`.",
            },
            {
              from: { type: "module-infrastructure" },
              allow: [{ to: { type: "module-api" } }],
              message: "Cross-module imports must go through `modules/<target>/api`.",
            },
            {
              from: { type: "module-interfaces" },
              allow: [{ to: { type: "module-api" } }],
              message: "Cross-module imports must go through `modules/<target>/api`.",
            },
            {
              from: { type: "module-domain" },
              allow: [
                {
                  to: {
                    type: "module-root",
                    captured: { module: "{{from.captured.module}}" },
                  },
                },
              ],
              message: "Module root barrel is allowed only for the same module.",
            },
            {
              from: { type: "module-application" },
              allow: [
                {
                  to: {
                    type: "module-root",
                    captured: { module: "{{from.captured.module}}" },
                  },
                },
              ],
              message: "Module root barrel is allowed only for the same module.",
            },
            {
              from: { type: "module-infrastructure" },
              allow: [
                {
                  to: {
                    type: "module-root",
                    captured: { module: "{{from.captured.module}}" },
                  },
                },
              ],
              message: "Module root barrel is allowed only for the same module.",
            },
            {
              from: { type: "module-interfaces" },
              allow: [
                {
                  to: {
                    type: "module-root",
                    captured: { module: "{{from.captured.module}}" },
                  },
                },
              ],
              message: "Module root barrel is allowed only for the same module.",
            },
            {
              from: { type: "module-api" },
              allow: [
                { to: { type: "module-api", captured: { module: "{{from.captured.module}}" } } },
                { to: { type: "module-domain", captured: { module: "{{from.captured.module}}" } } },
                { to: { type: "module-application", captured: { module: "{{from.captured.module}}" } } },
                { to: { type: "module-interfaces", captured: { module: "{{from.captured.module}}" } } },
                { to: { type: "module-infrastructure", captured: { module: "{{from.captured.module}}" } } },
              ],
              message: "API layer may depend only on same-module layers.",
            },
            {
              from: { type: "module-domain" },
              allow: [
                {
                  to: {
                    type: "module-domain",
                    captured: { module: "{{from.captured.module}}" },
                  },
                },
              ],
              message: "Domain may only depend on domain of the same module.",
            },
            {
              from: { type: "module-application" },
              allow: [
                { to: { type: "module-application", captured: { module: "{{from.captured.module}}" } } },
                { to: { type: "module-domain", captured: { module: "{{from.captured.module}}" } } },
              ],
              message: "Application may depend only on application/domain in the same module.",
            },
            {
              from: { type: "module-infrastructure" },
              allow: [
                { to: { type: "module-infrastructure", captured: { module: "{{from.captured.module}}" } } },
                { to: { type: "module-application", captured: { module: "{{from.captured.module}}" } } },
                { to: { type: "module-domain", captured: { module: "{{from.captured.module}}" } } },
              ],
              message: "Infrastructure may depend only on infrastructure/application/domain in the same module.",
            },
            {
              from: { type: "module-interfaces" },
              allow: [
                { to: { type: "module-interfaces", captured: { module: "{{from.captured.module}}" } } },
                { to: { type: "module-application", captured: { module: "{{from.captured.module}}" } } },
                { to: { type: "module-infrastructure", captured: { module: "{{from.captured.module}}" } } },
                { to: { type: "module-domain", captured: { module: "{{from.captured.module}}" } } },
              ],
              message: "Interfaces may depend only on interfaces/application/infrastructure/domain in the same module.",
            },
          ],
        },
      ],
    },
  },
  // ─── Package boundary enforcement ───────────────────────────────────────
  // Forbid legacy import paths that were migrated to packages/*.
  {
    rules: {
      "no-restricted-imports": [
        boundaryRuleSeverity,
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
  // ─── Strict module entrypoint enforcement ───────────────────────────────
  {
    files: [
      "app/**/*.{ts,tsx,js,jsx}",
      "providers/**/*.{ts,tsx,js,jsx}",
      "debug/**/*.{ts,tsx,js,jsx}",
    ],
    rules: {
      "no-restricted-imports": [
        boundaryRuleSeverity,
        {
          patterns: [
            {
              regex: "^@/modules/(?!system$)[^/]+$",
              message: "Module imports must use `@/modules/<module>/api` only (except approved system facade).",
            },
          ],
        },
      ],
    },
  },
  // ─── Module import boundary enforcement (kept after global restricted imports so it is not overridden) ───
  {
    files: moduleFileGlobs,
    rules: {
      "no-restricted-imports": [
        boundaryRuleSeverity,
        {
          patterns: [
            {
              group: ["**/index", "**/index.ts", "**/index.tsx"],
              message: "Import the target file or public module boundary directly instead of using an explicit index path.",
            },
            {
              regex: "^@/modules/(?!system$)[^/]+$",
              message: "Module imports must use `@/modules/<module>/api` only (except approved system facade).",
            },
            {
              group: [
                "@/modules/*/application/**",
                "@/modules/*/domain/**",
                "@/modules/*/infrastructure/**",
                "@/modules/*/interfaces/**",
              ],
              message: "Cross-module dependencies must go through `@/modules/<module>/api`, not an internal layer path.",
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
        boundaryRuleSeverity,
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
        boundaryRuleSeverity,
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
