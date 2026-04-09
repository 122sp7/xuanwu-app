import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "@typescript-eslint/eslint-plugin";
import boundaries from "eslint-plugin-boundaries";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsdoc from "eslint-plugin-jsdoc";
import jsxA11y from "eslint-plugin-jsx-a11y";

// ─── Globs ───────────────────────────────────────────────────────────────────
const srcGlobs = ["**/*.{js,jsx,mjs,cjs,ts,tsx}"];
const tsGlobs  = ["**/*.{ts,tsx}"];
const modGlobs = ["modules/**/*.{ts,tsx}"];

// ─── Module boundary helpers ─────────────────────────────────────────────────
const WARN = "warn";

const moduleElements = ["domain","application","infrastructure","interfaces"].flatMap((layer) => [
  { type: `module-${layer}`, pattern: `modules/*/${layer}/**/*`, capture: ["module"] },
]);
moduleElements.unshift(
  { type: "module-root",           pattern: "modules/*/index.ts",               capture: ["module"] },
  { type: "module-api",            pattern: "modules/*/api/**/*",                capture: ["module"] },
  { type: "module-interfaces-api", pattern: "modules/*/interfaces/api/**/*",    capture: ["module"] },
  { type: "module-interfaces-web", pattern: "modules/*/interfaces/web/**/*",    capture: ["module"] },
);

const layers = ["module-domain","module-application","module-infrastructure","module-interfaces"];
const sameModule = (type) => ({ to: { type, captured: { module: "{{from.captured.module}}" } } });

const layerAllows = {
  "module-domain":         ["module-domain"],
  "module-application":    ["module-application","module-domain"],
  "module-infrastructure": ["module-infrastructure","module-application","module-domain"],
  "module-interfaces":     ["module-interfaces","module-application","module-infrastructure","module-domain"],
};

const moduleDependencyRules = [
  // cross-module → must go through api, interfaces/api, or interfaces/web
  ...layers.map((type) => ({ from: { type }, allow: [{ to: { type: "module-api" } }, { to: { type: "module-interfaces-api" } }, { to: { type: "module-interfaces-web" } }] })),
  // same-module root barrel allowed
  ...layers.map((type) => ({ from: { type }, allow: [sameModule("module-root")] })),
  // api layer owns same-module layers
  { from: { type: "module-api" }, allow: ["module-api",...layers].map(sameModule) },
  // interfaces/api and interfaces/web as same-module public adapter layers
  { from: { type: "module-interfaces-api" }, allow: ["module-interfaces-api","module-interfaces-web","module-api",...layers].map(sameModule) },
  { from: { type: "module-interfaces-web" }, allow: ["module-interfaces-web","module-interfaces-api","module-api",...layers].map(sameModule) },
  // same-module layer purity
  ...layers.map((type) => ({ from: { type }, allow: layerAllows[type].map(sameModule) })),
];

// ─── Restricted import patterns ───────────────────────────────────────────────
const apiEntrypoint   = { regex: "^@/modules/(?!system$)[^/]+$",                          message: "Use @/modules/<module>/api only." };
const nonApiSubpath   = { regex: "^@/modules/(?!system(?:/|$))[^/]+/(?!api(?:/|$)|interfaces/(?:api|web)(?:/|$)).+", message: "Cross-module deps must use @/modules/<module>/api, @/modules/<module>/interfaces/api, or @/modules/<module>/interfaces/web." };
const explicitIndex   = { group: ["**/index","**/index.ts","**/index.tsx"],                message: "Import the target file directly, not an index path." };
const internalLayer   = { group: ["domain","application","infrastructure"].flatMap((l) => [`@/modules/*/${l}/**`]), message: "Use @/modules/<module>/api, @/modules/<module>/interfaces/api, or @/modules/<module>/interfaces/web — not internal layer paths." };

const legacyAliases = [
  { group: ["@/shared/*"],        message: "Use @shared-types / @shared-utils / … instead." },
  { group: ["@/infrastructure/*"],message: "Use @integration-firebase / @integration-upstash / … instead." },
  { group: ["@/libs/*"],          message: "Use the corresponding @lib-* or @integration-* alias." },
  { group: ["@/ui/shadcn/*"],     message: "Use @ui-shadcn/* instead." },
  { group: ["@/ui/vis","@/ui/vis/*"], message: "Use @ui-vis instead." },
  { group: ["@/interfaces/*"],    message: "Use @api-contracts instead." },
];

const restrictedImports = (patterns) => ["no-restricted-imports", [WARN, { patterns }]];

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
    plugins: { "@typescript-eslint": tseslint },
    rules: {
      "@typescript-eslint/naming-convention": [WARN,
        { selector: "typeLike",     format: ["PascalCase"] },
        { selector: "typeParameter",format: ["PascalCase"] },
        { selector: "variable",     modifiers: ["destructured"], format: null },
        { selector: "function",     format: ["camelCase","PascalCase"], leadingUnderscore: "allow" },
        { selector: "variable",     format: ["camelCase","PascalCase","UPPER_CASE"], leadingUnderscore: "allow", trailingUnderscore: "allow" },
        { selector: "parameter",    modifiers: ["destructured"], format: null },
        { selector: "parameter",    format: ["camelCase"], leadingUnderscore: "allow" },
        { selector: "enumMember",   format: ["PascalCase","UPPER_CASE"] },
      ],
      "@typescript-eslint/consistent-type-imports": [WARN, { prefer: "type-imports", fixStyle: "inline-type-imports" }],
      "@typescript-eslint/no-unused-vars":          [WARN, { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }],
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
      ...Object.fromEntries(
        Object.entries(jsxA11y.flatConfigs.recommended.rules ?? {}).map(([rule, cfg]) => {
          if (Array.isArray(cfg)) {
            const [sev, ...rest] = cfg;
            const w = sev === "error" || sev === 2 ? WARN : sev;
            return [rule, rest.length ? [w, ...rest] : w];
          }
          return [rule, cfg === "error" || cfg === 2 ? WARN : cfg];
        }),
      ),
    },
  },

  // Module boundaries (eslint-plugin-boundaries)
  {
    files: modGlobs,
    plugins: { boundaries },
    settings: { "boundaries/include": modGlobs, "boundaries/elements": moduleElements },
    rules: {
      "boundaries/dependencies": [WARN, { default: "disallow", rules: moduleDependencyRules }],
    },
  },

  // File-size guardrails per MDDD layer
  { files: ["modules/*/interfaces/**/*.{ts,tsx}"],    rules: { "max-lines": [WARN, { max: 300, skipBlankLines: true, skipComments: true }] } },
  { files: ["modules/*/application/**/*.{ts,tsx}"],   rules: { "max-lines": [WARN, { max: 300, skipBlankLines: true, skipComments: true }] } },
  { files: ["modules/*/infrastructure/**/*.{ts,tsx}"],rules: { "max-lines": [WARN, { max: 400, skipBlankLines: true, skipComments: true }] } },

  // Legacy alias migration
  { rules: { [restrictedImports(legacyAliases)[0]]: restrictedImports(legacyAliases)[1] } },

  // app / providers / debug → only module api entrypoints
  {
    files: ["app/**/*.{ts,tsx,js,jsx}","providers/**/*.{ts,tsx,js,jsx}","debug/**/*.{ts,tsx,js,jsx}"],
    rules: { [restrictedImports([apiEntrypoint, nonApiSubpath])[0]]: restrictedImports([apiEntrypoint, nonApiSubpath])[1] },
  },

  // modules → strict entrypoint + internal layer enforcement
  {
    files: modGlobs,
    rules: { [restrictedImports([explicitIndex, apiEntrypoint, nonApiSubpath, internalLayer])[0]]: restrictedImports([explicitIndex, apiEntrypoint, nonApiSubpath, internalLayer])[1] },
  },

  globalIgnores([".agents/**","modules/platform/**",".next/**","out/**","build/**","next-env.d.ts"]),
]);