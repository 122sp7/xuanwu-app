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
const moduleCodeGlobs = ["modules/**/*.{js,jsx,ts,tsx}"];
const outerAdapterGlobs = ["app/**/*.{ts,tsx,js,jsx}","providers/**/*.{ts,tsx,js,jsx}","debug/**/*.{ts,tsx,js,jsx}"];
const packageGlobs = ["packages/**/*.{ts,tsx,js,jsx}"];

// ─── Module boundary helpers ─────────────────────────────────────────────────
const WARN = "warn";

const mainDomainElements = [
  { type: "main-domain-api", pattern: "modules/*/api/**/*", mode: "file", capture: ["domain"] },
  { type: "main-domain-domain", pattern: "modules/*/domain/**/*", mode: "file", capture: ["domain"] },
  { type: "main-domain-application", pattern: "modules/*/application/**/*", mode: "file", capture: ["domain"] },
  { type: "main-domain-infrastructure", pattern: "modules/*/infrastructure/**/*", mode: "file", capture: ["domain"] },
  { type: "main-domain-interfaces", pattern: "modules/*/interfaces/**/*", mode: "file", capture: ["domain"] },
];

const subdomainElements = [
  { type: "subdomain-api", pattern: "modules/*/subdomains/*/api/**/*", mode: "file", capture: ["domain","subdomain"] },
  { type: "subdomain-domain", pattern: "modules/*/subdomains/*/domain/**/*", mode: "file", capture: ["domain","subdomain"] },
  { type: "subdomain-application", pattern: "modules/*/subdomains/*/application/**/*", mode: "file", capture: ["domain","subdomain"] },
  { type: "subdomain-infrastructure", pattern: "modules/*/subdomains/*/infrastructure/**/*", mode: "file", capture: ["domain","subdomain"] },
  { type: "subdomain-interfaces", pattern: "modules/*/subdomains/*/interfaces/**/*", mode: "file", capture: ["domain","subdomain"] },
];

const moduleElements = [...subdomainElements, ...mainDomainElements];

const sameDomain = (type) => [type, { domain: "${from.domain}" }];
const sameSubdomain = (type) => [type, { domain: "${from.domain}", subdomain: "${from.subdomain}" }];

const moduleElementTypeRules = [
  { from: ["main-domain-domain"], allow: [sameDomain("main-domain-domain")] },
  { from: ["main-domain-application"], allow: [sameDomain("main-domain-application"), sameDomain("main-domain-domain"), sameDomain("subdomain-api")] },
  { from: ["main-domain-infrastructure"], allow: [sameDomain("main-domain-infrastructure"), sameDomain("main-domain-application"), sameDomain("main-domain-domain")] },
  { from: ["main-domain-interfaces"], allow: [sameDomain("main-domain-interfaces"), sameDomain("main-domain-application"), sameDomain("main-domain-domain"), sameDomain("subdomain-api"), "main-domain-api"] },
  { from: ["main-domain-api"], allow: [sameDomain("main-domain-api"), sameDomain("main-domain-interfaces"), sameDomain("main-domain-application"), sameDomain("main-domain-domain"), sameDomain("main-domain-infrastructure"), sameDomain("subdomain-api")] },
  { from: ["subdomain-domain"], allow: [sameSubdomain("subdomain-domain"), sameDomain("main-domain-domain")] },
  { from: ["subdomain-application"], allow: [sameSubdomain("subdomain-application"), sameSubdomain("subdomain-domain"), sameDomain("main-domain-domain")] },
  { from: ["subdomain-infrastructure"], allow: [sameSubdomain("subdomain-infrastructure"), sameSubdomain("subdomain-application"), sameSubdomain("subdomain-domain"), sameDomain("main-domain-domain"), "main-domain-api"] },
  { from: ["subdomain-interfaces"], allow: [sameSubdomain("subdomain-interfaces"), sameSubdomain("subdomain-application"), sameSubdomain("subdomain-domain"), sameSubdomain("subdomain-api"), "main-domain-api"] },
  { from: ["subdomain-api"], allow: [sameSubdomain("subdomain-api"), sameSubdomain("subdomain-interfaces"), sameSubdomain("subdomain-application"), sameSubdomain("subdomain-domain"), sameSubdomain("subdomain-infrastructure"), sameDomain("subdomain-api"), "main-domain-api"] },
];

// ─── Restricted import patterns ───────────────────────────────────────────────
const moduleRootBarrel = { regex: "^@/modules/(?!system$)[^/]+$", message: "Do not import module root barrels; use @/modules/<main-domain>/api." };
const subdomainRootBarrel = { regex: "^@/modules/[^/]+/subdomains/[^/]+$", message: "Do not import subdomain root barrels; use @/modules/<main-domain>/subdomains/<subdomain>/api." };
const nonApiModuleSubpath = { regex: "^@/modules/(?!system(?:/|$))[^/]+/(?!api(?:/|$)|subdomains/[^/]+/api(?:/|$)).+", message: "Cross-boundary dependencies must use API boundaries only." };
const explicitIndex = { group: ["**/index","**/index.ts","**/index.tsx"], message: "Import the boundary path, not an explicit index file." };
const internalLayer = {
  group: [
    "@/modules/*/domain/**",
    "@/modules/*/application/**",
    "@/modules/*/infrastructure/**",
    "@/modules/*/interfaces/**",
    "@/modules/*/subdomains/*/domain/**",
    "@/modules/*/subdomains/*/application/**",
    "@/modules/*/subdomains/*/infrastructure/**",
    "@/modules/*/subdomains/*/interfaces/**",
  ],
  message: "Use the owning API boundary instead of internal layer paths.",
};
const packageToModules = { regex: "^@/modules/", message: "packages/* must remain independent of application modules." };
const restrictedGenkitImports = {
  paths: [
    {
      name: "genkit",
      message: "Import Genkit only in modules/platform/subdomains/ai/infrastructure/**.",
    },
    {
      name: "@genkit-ai/google-genai",
      message: "Import Genkit only in modules/platform/subdomains/ai/infrastructure/**.",
    },
  ],
};

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
    files: moduleCodeGlobs,
    plugins: { boundaries },
    settings: { "boundaries/include": moduleCodeGlobs, "boundaries/elements": moduleElements },
    rules: {
      "boundaries/element-types": [WARN, { default: "disallow", rules: moduleElementTypeRules }],
    },
  },

  // File-size guardrails per Hexagonal DDD layer
  { files: ["modules/*/interfaces/**/*.{ts,tsx}"],    rules: { "max-lines": [WARN, { max: 300, skipBlankLines: true, skipComments: true }] } },
  { files: ["modules/*/application/**/*.{ts,tsx}"],   rules: { "max-lines": [WARN, { max: 300, skipBlankLines: true, skipComments: true }] } },
  { files: ["modules/*/infrastructure/**/*.{ts,tsx}"],rules: { "max-lines": [WARN, { max: 400, skipBlankLines: true, skipComments: true }] } },

  // Legacy alias migration
  { rules: { [restrictedImports(legacyAliases)[0]]: restrictedImports(legacyAliases)[1] } },

  // app / providers / debug → only module api entrypoints
  {
    files: outerAdapterGlobs,
    rules: { [restrictedImports([moduleRootBarrel, subdomainRootBarrel, nonApiModuleSubpath])[0]]: restrictedImports([moduleRootBarrel, subdomainRootBarrel, nonApiModuleSubpath])[1] },
  },

  // modules → strict entrypoint + internal layer enforcement
  {
    files: moduleCodeGlobs,
    rules: { [restrictedImports([explicitIndex, moduleRootBarrel, subdomainRootBarrel, nonApiModuleSubpath, internalLayer])[0]]: restrictedImports([explicitIndex, moduleRootBarrel, subdomainRootBarrel, nonApiModuleSubpath, internalLayer])[1] },
  },

  // packages must not depend on application modules
  {
    files: packageGlobs,
    rules: { [restrictedImports([packageToModules])[0]]: restrictedImports([packageToModules])[1] },
  },

  // Genkit must be centralized in platform AI infrastructure adapter.
  {
    files: ["modules/**/*.{ts,tsx,js,jsx}"],
    ignores: ["modules/platform/subdomains/ai/infrastructure/**"],
    rules: {
      "no-restricted-imports": [WARN, restrictedGenkitImports],
    },
  },

  globalIgnores([".agents/**",".next/**","out/**","build/**","next-env.d.ts"]),
]);