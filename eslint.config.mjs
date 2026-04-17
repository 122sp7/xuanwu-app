import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsdoc from "eslint-plugin-jsdoc";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tseslint from "typescript-eslint";

// ─── Globs ───────────────────────────────────────────────────────────────────
const srcGlobs = ["**/*.{js,jsx,mjs,cjs,ts,tsx}"];
const tsGlobs = ["**/*.{ts,tsx}"];

// src/modules/ adapter boundary globs
const srcModuleOutboundAdapterGlobs = ["src/modules/*/adapters/outbound/**/*.{ts,tsx,js,jsx}"];
const srcModuleInboundReactAdapterGlobs = ["src/modules/*/adapters/inbound/react/**/*.{ts,tsx,tsx}"];
// src/modules files that are NOT adapters/outbound — integration-* must stay out
const srcModuleNonOutboundGlobs = ["src/modules/**/*.{ts,tsx,js,jsx}"];

// ─── Module boundary helpers ─────────────────────────────────────────────────
const WARN = "warn";

const normalizeWarnSeverity = (ruleConfig) => {
  if (Array.isArray(ruleConfig)) {
    const [severity, ...rest] = ruleConfig;
    const normalizedSeverity = severity === "error" || severity === 2 ? WARN : severity;

    return rest.length ? [normalizedSeverity, ...rest] : normalizedSeverity;
  }

  return ruleConfig === "error" || ruleConfig === 2 ? WARN : ruleConfig;
};

const mapRulesToWarn = (rules = {}) =>
  Object.fromEntries(
    Object.entries(rules).map(([ruleName, ruleConfig]) => [ruleName, normalizeWarnSeverity(ruleConfig)]),
  );

const restrictedImportsRule = (patterns, extraOptions = {}) => [WARN, { patterns, ...extraOptions }];

// ─── Restricted import patterns ───────────────────────────────────────────────
const legacyAliases = [
  { group: ["@/shared/*"], message: "Use @ui-shadcn/* for UI or direct relative imports from src/modules/shared/ instead." },
  { group: ["@/infrastructure/*"], message: "Use @integration-firebase/* instead." },
  { group: ["@/libs/*"], message: "Use @integration-firebase/* or standard npm package imports instead." },
  { group: ["@/ui/shadcn/*"], message: "Use @ui-shadcn/* instead." },
  { group: ["@/ui/vis", "@/ui/vis/*"], message: "Use @ui-shadcn/* instead. There is no @ui-vis package in this project." },
  { group: ["@/interfaces/*"], message: "Import from module boundaries (src/modules/<context>/index.ts) instead." },
];

// ─── Config ───────────────────────────────────────────────────────────────────
export default defineConfig([
  ...nextVitals,
  ...nextTs,

  // JSDoc
  {
    files: srcGlobs,
    plugins: { jsdoc },
    settings: { jsdoc: { mode: "typescript" } },
    rules: {
      "jsdoc/check-alignment": WARN,
      "jsdoc/check-syntax":    WARN,
      "jsdoc/check-tag-names": WARN,
      "jsdoc/no-blank-blocks": WARN,
    },
  },

  // TypeScript naming + type imports + unused vars
  {
    files: tsGlobs,
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      "@typescript-eslint/naming-convention": [WARN,
        { selector: "typeLike",     format: ["PascalCase"] },
        { selector: "typeParameter", format: ["PascalCase"] },
        { selector: "variable", modifiers: ["destructured"], format: null },
        { selector: "function", format: ["camelCase", "PascalCase"], leadingUnderscore: "allow" },
        { selector: "variable", format: ["camelCase", "PascalCase", "UPPER_CASE"], leadingUnderscore: "allow", trailingUnderscore: "allow" },
        { selector: "parameter", modifiers: ["destructured"], format: null },
        { selector: "parameter", format: ["camelCase"], leadingUnderscore: "allow" },
        { selector: "enumMember", format: ["PascalCase", "UPPER_CASE"] },
      ],
      "@typescript-eslint/consistent-type-imports": [WARN, { prefer: "type-imports", fixStyle: "inline-type-imports" }],
      "@typescript-eslint/no-unused-vars": [WARN, { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }],
    },
  },

  // React + a11y
  {
    files: ["**/*.{jsx,tsx}"],
    rules: {
      "react/react-in-jsx-scope":       "off",
      "react/prop-types":               "off",
      "react/self-closing-comp":        WARN,
      "react/jsx-no-useless-fragment":  [WARN, { allowExpressions: true }],
      "react-hooks/rules-of-hooks":     "error",
      "react-hooks/exhaustive-deps":    WARN,
      ...mapRulesToWarn(jsxA11y.flatConfigs.recommended.rules),
    },
  },

  // Legacy alias migration
  { rules: { "no-restricted-imports": restrictedImportsRule(legacyAliases) } },

  // src/modules: @integration-* packages must only appear in adapters/outbound/.
  // Domain, application, and inbound adapters must remain infrastructure-agnostic.
  {
    files: srcModuleNonOutboundGlobs,
    ignores: srcModuleOutboundAdapterGlobs,
    rules: {
      "no-restricted-imports": restrictedImportsRule([
        {
          group: ["@integration-*", "@integration-firebase", "@integration-firebase/*", "@integration-upstash", "@integration-upstash/*"],
          message: "Integration packages (@integration-*) are only allowed in adapters/outbound/. Domain, application, and inbound adapter layers must remain infrastructure-agnostic.",
        },
      ]),
    },
  },

  // src/modules: @ui-shadcn and @ui-vis must only appear in adapters/inbound/react/.
  // Domain, application, and outbound adapter layers must be UI-framework-agnostic.
  {
    files: srcModuleNonOutboundGlobs,
    ignores: srcModuleInboundReactAdapterGlobs,
    rules: {
      "no-restricted-imports": restrictedImportsRule([
        {
          group: ["@ui-shadcn", "@ui-shadcn/*", "@ui-vis", "@ui-vis/*"],
          message: "@ui-shadcn and @ui-vis are only allowed in adapters/inbound/react/. Keep UI framework dependencies out of domain, application, and outbound layers.",
        },
      ]),
    },
  },

  globalIgnores([".agents/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);