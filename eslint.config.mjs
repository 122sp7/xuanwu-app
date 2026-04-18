import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import boundaries from "eslint-plugin-boundaries";
import functional from "eslint-plugin-functional";
import importPlugin from "eslint-plugin-import";
import jsdoc from "eslint-plugin-jsdoc";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import sonarjs from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";

const WARN = "warn";
const srcGlobs = ["src/**/*.{js,jsx,mjs,cjs,ts,tsx}", "packages/**/*.{js,jsx,mjs,cjs,ts,tsx}"];
const tsGlobs = ["**/*.{ts,tsx}"];
const reactGlobs = ["**/*.{jsx,tsx}"];
const srcModuleGlobs = ["src/modules/**/*.{ts,tsx,js,jsx}"];
const srcAppGlobs = ["src/app/**/*.{ts,tsx,js,jsx}"];
const packageGlobs = ["packages/**/*.{ts,tsx,js,jsx}"];
const srcModuleOutboundAdapterGlobs = [
  "src/modules/*/adapters/outbound/**/*.{ts,tsx,js,jsx}",
  "src/modules/*/subdomains/*/adapters/outbound/**/*.{ts,tsx,js,jsx}",
];
const srcModuleInboundReactAdapterGlobs = ["src/modules/*/adapters/inbound/react/**/*.{ts,tsx,js,jsx}"];
const srcModuleNonOutboundGlobs = ["src/modules/**/*.{ts,tsx,js,jsx}"];

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

const legacyAliases = [
  { group: ["@/shared/*"], message: "Use @ui-shadcn/* for UI or direct relative imports from src/modules/shared/ instead." },
  { group: ["@/infrastructure/*"], message: "Use @integration-firebase/* instead." },
  { group: ["@/libs/*"], message: "Use @integration-firebase/* or standard npm package imports instead." },
  { group: ["@/ui/shadcn/*"], message: "Use @ui-shadcn/* instead." },
  { group: ["@/ui/vis", "@/ui/vis/*"], message: "Use @ui-shadcn/* instead. There is no @ui-vis package in this project." },
  { group: ["@/interfaces/*"], message: "Import from module boundaries (src/modules/<context>/index.ts) instead." },
];

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    files: srcGlobs,
    plugins: {
      boundaries,
      import: importPlugin,
      jsdoc,
      sonarjs,
    },
    settings: {
      jsdoc: { mode: "typescript" },
      // Used by boundaries/no-unknown-files and reserved for future boundaries/dependencies migration.
      "boundaries/elements": [
        { type: "module-public", pattern: "src/modules/*/index.ts", mode: "full", capture: ["context"] },
        { type: "module-internal", pattern: "src/modules/*/**/*.{ts,tsx,js,jsx}", mode: "full", capture: ["context"] },
        { type: "app", pattern: "src/app/**/*.{ts,tsx,js,jsx}", mode: "full" },
        { type: "package", pattern: "packages/**/*.{ts,tsx,js,jsx}", mode: "full" },
      ],
    },
    rules: {
      // TypeScript + Next path aliases are resolved by TS/Next; keep import plugin checks that are resolver-agnostic.
      "import/no-unresolved": "off",
      "import/named": "off",
      "import/default": "off",
      "import/no-named-as-default-member": "off",
      "import/no-duplicates": WARN,
      "sonarjs/cognitive-complexity": [WARN, 20],
      "jsdoc/check-alignment": WARN,
      "jsdoc/check-syntax": WARN,
      "jsdoc/check-tag-names": WARN,
      "jsdoc/no-blank-blocks": WARN,
      "boundaries/no-unknown-files": WARN,
    },
  },

  {
    files: tsGlobs,
    plugins: { "@typescript-eslint": tseslint.plugin },
    languageOptions: {
      parser: tseslint.parser,
    },
    rules: {
      "@typescript-eslint/naming-convention": [WARN,
        { selector: "typeLike", format: ["PascalCase"] },
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

  {
    files: reactGlobs,
    rules: {
      ...mapRulesToWarn(reactPlugin.configs.flat.recommended.rules),
      ...mapRulesToWarn(reactPlugin.configs.flat["jsx-runtime"].rules),
      ...mapRulesToWarn(jsxA11y.flatConfigs.recommended.rules),
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/self-closing-comp": WARN,
      "react/jsx-no-useless-fragment": [WARN, { allowExpressions: true }],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": WARN,
    },
  },

  {
    files: srcModuleGlobs,
    rules: {
      "no-restricted-imports": restrictedImportsRule([
        {
          group: [
            "@/src/modules/*/*",
            "@/src/modules/*/adapters/*",
            "@/src/modules/*/application/*",
            "@/src/modules/*/domain/*",
            "@/src/modules/*/infrastructure/*",
            "@/src/modules/*/interfaces/*",
            "@/src/modules/*/subdomains/*",
            "@/modules/*/*",
            "@/modules/*/adapters/*",
            "@/modules/*/application/*",
            "@/modules/*/domain/*",
            "@/modules/*/infrastructure/*",
            "@/modules/*/interfaces/*",
            "@/modules/*/subdomains/*",
          ],
          message: "Cross-module access must go through `src/modules/<context>/index.ts` public boundaries.",
        },
      ]),
    },
  },

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

  {
    files: srcAppGlobs,
    rules: {
      "no-restricted-imports": restrictedImportsRule([
        {
          group: [
            "@/src/modules/*/adapters/*",
            "@/src/modules/*/application/*",
            "@/src/modules/*/domain/*",
            "@/src/modules/*/infrastructure/*",
            "@/src/modules/*/interfaces/*",
            "@/src/modules/*/subdomains/*",
            "@/modules/*/adapters/*",
            "@/modules/*/application/*",
            "@/modules/*/domain/*",
            "@/modules/*/infrastructure/*",
            "@/modules/*/interfaces/*",
            "@/modules/*/subdomains/*",
          ],
          message: "src/app should compose from module public boundaries (`src/modules/<context>/index.ts`) instead of internal module layers.",
        },
      ]),
    },
  },

  {
    files: packageGlobs,
    rules: {
      "no-restricted-imports": restrictedImportsRule([
        {
          group: ["@/src/modules/*", "@/src/app/*", "@/modules/*", "@/app/*"],
          message: "packages/ should remain framework-agnostic and must not depend on app/module implementation internals.",
        },
      ]),
    },
  },

  {
    files: ["src/modules/**/domain/**/*.{ts,tsx,js,jsx}"],
    plugins: { functional },
    rules: {
      "functional/no-let": WARN,
      "functional/no-loop-statements": WARN,
    },
  },

  { rules: { "no-restricted-imports": restrictedImportsRule(legacyAliases) } },

  globalIgnores([".agents/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
