import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "@typescript-eslint/eslint-plugin";
import boundaries from "eslint-plugin-boundaries";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsdoc from "eslint-plugin-jsdoc";
import jsxA11y from "eslint-plugin-jsx-a11y";
 
const sourceFileGlobs = ["**/*.{js,jsx,mjs,cjs,ts,tsx}"];
const typescriptFileGlobs = ["**/*.{ts,tsx}"];
const moduleFileGlobs = ["modules/**/*.{ts,tsx}"];
const boundaryRuleSeverity = "warn";
const moduleLayerTypes = ["module-domain", "module-application", "module-infrastructure", "module-interfaces"];

const moduleApiEntrypointMessage =
  "Module imports must use `@/modules/<module>/api` only (except approved system facade).";

const moduleApiEntrypointPattern = {
  regex: "^@/modules/(?!system$)[^/]+$",
  message: moduleApiEntrypointMessage,
};

const moduleNonApiSubpathPattern = {
  regex: "^@/modules/(?!system(?:/|$))[^/]+/(?!api(?:/|$)).+",
  message: "Cross-module dependencies must use `@/modules/<module>/api` only; internal module paths are forbidden.",
};

const explicitIndexPathPattern = {
  group: ["**/index", "**/index.ts", "**/index.tsx"],
  message: "Import the target file or public module boundary directly instead of using an explicit index path.",
};

const moduleInternalLayerPattern = {
  group: [
    "@/modules/*/application/**",
    "@/modules/*/domain/**",
    "@/modules/*/infrastructure/**",
    "@/modules/*/interfaces/**",
  ],
  message: "Cross-module dependencies must go through `@/modules/<module>/api`, not an internal layer path.",
};

const moduleElements = [
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
];

const sameModuleCapture = { module: "{{from.captured.module}}" };
const sameModuleTarget = (type) => ({ to: { type, captured: sameModuleCapture } });

const crossModuleApiRules = moduleLayerTypes.map((type) => ({
  from: { type },
  allow: [{ to: { type: "module-api" } }],
  message: "Cross-module imports must go through `modules/<target>/api`.",
}));

const sameModuleRootRules = moduleLayerTypes.map((type) => ({
  from: { type },
  allow: [sameModuleTarget("module-root")],
  message: "Module root barrel is allowed only for the same module.",
}));

const apiLayerRule = {
  from: { type: "module-api" },
  allow: ["module-api", ...moduleLayerTypes].map(sameModuleTarget),
  message: "API layer may depend only on same-module layers.",
};

const sameModuleLayerAllowMap = {
  "module-domain": ["module-domain"],
  "module-application": ["module-application", "module-domain"],
  "module-infrastructure": ["module-infrastructure", "module-application", "module-domain"],
  "module-interfaces": ["module-interfaces", "module-application", "module-infrastructure", "module-domain"],
};

const sameModuleLayerMessageMap = {
  "module-domain": "Domain may only depend on domain of the same module.",
  "module-application": "Application may depend only on application/domain in the same module.",
  "module-infrastructure": "Infrastructure may depend only on infrastructure/application/domain in the same module.",
  "module-interfaces": "Interfaces may depend only on interfaces/application/infrastructure/domain in the same module.",
};

const sameModuleLayerRules = moduleLayerTypes.map((type) => ({
  from: { type },
  allow: sameModuleLayerAllowMap[type].map(sameModuleTarget),
  message: sameModuleLayerMessageMap[type],
}));

const moduleDependencyRules = [
  ...crossModuleApiRules,
  ...sameModuleRootRules,
  apiLayerRule,
  ...sameModuleLayerRules,
];

const packageAliasMigrationPatterns = [
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
];

const wikiIsolationPatterns = [
  {
    group: ["@/modules/wiki-beta", "@/modules/wiki-beta/*"],
    message: "wiki 與 wiki-beta 必須完全隔離，禁止從 wiki 引用 wiki-beta。",
  },
  {
    group: ["@/app/(shell)/wiki-beta", "@/app/(shell)/wiki-beta/*"],
    message: "wiki 與 wiki-beta 必須完全隔離，禁止從 wiki 引用 wiki-beta route。",
  },
];

const wikiBetaIsolationPatterns = [
  {
    group: ["@/modules/wiki", "@/modules/wiki/*"],
    message: "wiki-beta 與 wiki 必須完全隔離，禁止從 wiki-beta 引用 wiki。",
  },
  {
    group: ["@/app/(shell)/wiki", "@/app/(shell)/wiki/*"],
    message: "wiki-beta 與 wiki 必須完全隔離，禁止從 wiki-beta 引用 wiki route。",
  },
];

const createRestrictedImportsRule = (patterns) => [
  boundaryRuleSeverity,
  {
    patterns,
  },
];

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
  // ─── Consistent type-only imports ──────────────────────────────────────
  // Enforces `import type` for type-only imports, improving tree-shaking and
  // making module-boundary intent explicit (matches project MDDD conventions).
  {
    files: typescriptFileGlobs,
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
    },
  },
  // ─── React best-practices ───────────────────────────────────────────────
  // eslint-config-next already pulls in react / react-hooks rules via its
  // own config; these overrides make project-specific settings explicit and
  // add missing checks not covered by the base config.
  {
    files: ["**/*.{jsx,tsx}"],
    rules: {
      "react/react-in-jsx-scope": "off",   // Not needed with Next.js 13+ JSX transform
      "react/prop-types": "off",            // TypeScript types replace PropTypes
      "react/self-closing-comp": "warn",    // Prefer <Foo /> over <Foo></Foo>
      "react/jsx-no-useless-fragment": ["warn", { allowExpressions: true }],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  // ─── Accessibility (jsx-a11y) ───────────────────────────────────────────
  // eslint-plugin-jsx-a11y is installed by Next.js but never explicitly
  // activated here.  Enabling recommended rules as warn catches common a11y
  // mistakes without breaking the zero-error baseline.
  {
    files: ["**/*.{jsx,tsx}"],
    rules: {
      ...Object.fromEntries(
        Object.entries(jsxA11y.flatConfigs.recommended.rules ?? {}).map(([rule, config]) => {
          // Rule config can be a string ("error"), a number (2), or an array (["error", opts]).
          // Downgrade all errors to warnings to preserve the zero-error baseline.
          if (Array.isArray(config)) {
            const [severity, ...rest] = config;
            const normalised = severity === "error" || severity === 2 ? "warn" : severity;
            return [rule, rest.length > 0 ? [normalised, ...rest] : normalised];
          }
          const normalised = config === "error" || config === 2 ? "warn" : config;
          return [rule, normalised];
        }),
      ),
    },
  },
  {
    files: moduleFileGlobs,
    plugins: {
      boundaries,
    },
    settings: {
      "boundaries/include": moduleFileGlobs,
      "boundaries/elements": moduleElements,
    },
    rules: {
      "boundaries/dependencies": [
        boundaryRuleSeverity,
        {
          default: "disallow",
          rules: moduleDependencyRules,
        },
      ],
    },
  },
  // ─── Package boundary enforcement ───────────────────────────────────────
  // Forbid legacy import paths that were migrated to packages/*.
  {
    rules: {
      "no-restricted-imports": createRestrictedImportsRule(packageAliasMigrationPatterns),
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
      "no-restricted-imports": createRestrictedImportsRule([
        moduleApiEntrypointPattern,
        moduleNonApiSubpathPattern,
      ]),
    },
  },
  // ─── Module import boundary enforcement (kept after global restricted imports so it is not overridden) ───
  {
    files: moduleFileGlobs,
    rules: {
      "no-restricted-imports": createRestrictedImportsRule([
        explicitIndexPathPattern,
        moduleApiEntrypointPattern,
        moduleNonApiSubpathPattern,
        moduleInternalLayerPattern,
      ]),
    },
  },
  // ─── Wiki / Wiki-Beta isolation boundaries ───────────────────────────────
  {
    files: ["modules/wiki/**/*.{ts,tsx}", "app/(shell)/wiki/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": createRestrictedImportsRule(wikiIsolationPatterns),
    },
  },
  {
    files: ["modules/wiki-beta/**/*.{ts,tsx}", "app/(shell)/wiki-beta/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": createRestrictedImportsRule(wikiBetaIsolationPatterns),
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
