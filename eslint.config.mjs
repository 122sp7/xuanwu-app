import { defineConfig, globalIgnores } from "eslint/config";
import boundaries from "eslint-plugin-boundaries";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsdoc from "eslint-plugin-jsdoc";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tseslint from "typescript-eslint";

// ─── Globs ───────────────────────────────────────────────────────────────────
const srcGlobs = ["**/*.{js,jsx,mjs,cjs,ts,tsx}"];
const tsGlobs = ["**/*.{ts,tsx}"];
const moduleCodeGlobs = ["modules/**/*.{js,jsx,ts,tsx}"];
const moduleApiGlobs = ["modules/*/api/**/*.{js,jsx,ts,tsx}", "modules/*/subdomains/*/api/**/*.{js,jsx,ts,tsx}"];
const interfaceScreenGlobs = ["modules/*/**/interfaces/**/components/screens/**/*.{ts,tsx}"];
const outerAdapterGlobs = ["app/**/*.{ts,tsx,js,jsx}", "providers/**/*.{ts,tsx,js,jsx}", "debug/**/*.{ts,tsx,js,jsx}"];
const packageGlobs = ["packages/**/*.{ts,tsx,js,jsx}"];
const downstreamInterfaceGlobs = [
  "modules/notebooklm/**/interfaces/**/*.{ts,tsx,js,jsx}",
  "modules/notion/**/interfaces/**/*.{ts,tsx,js,jsx}",
  "modules/workspace/**/interfaces/**/*.{ts,tsx,js,jsx}",
];
const downstreamInfrastructureGlobs = [
  "modules/notebooklm/**/infrastructure/**/*.{ts,tsx,js,jsx}",
  "modules/notion/**/infrastructure/**/*.{ts,tsx,js,jsx}",
  "modules/workspace/**/infrastructure/**/*.{ts,tsx,js,jsx}",
];
const workspaceConsumerInterfaceGlobs = [
  "modules/notebooklm/**/interfaces/**/*.{ts,tsx,js,jsx}",
  "modules/notion/**/interfaces/**/*.{ts,tsx,js,jsx}",
];

// ─── Module boundary helpers ─────────────────────────────────────────────────
const WARN = "warn";
const LINT_GUARDRAIL_OPTIONS = {
  skipBlankLines: true,
  skipComments: true,
};

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

const maxLinesRule = (max) => [WARN, { max, ...LINT_GUARDRAIL_OPTIONS }];
const restrictedImportsRule = (patterns, extraOptions = {}) => [WARN, { patterns, ...extraOptions }];
const restrictedSyntaxRule = (selectors) => [WARN, ...selectors];

const mainDomainElements = [
  { type: "main-domain-api", pattern: "modules/*/api/**/*", mode: "file", capture: ["domain"] },
  { type: "main-domain-domain", pattern: "modules/*/domain/**/*", mode: "file", capture: ["domain"] },
  { type: "main-domain-application", pattern: "modules/*/application/**/*", mode: "file", capture: ["domain"] },
  { type: "main-domain-infrastructure", pattern: "modules/*/infrastructure/**/*", mode: "file", capture: ["domain"] },
  { type: "main-domain-interfaces", pattern: "modules/*/interfaces/**/*", mode: "file", capture: ["domain"] },
];

const subdomainElements = [
  { type: "subdomain-api", pattern: "modules/*/subdomains/*/api/**/*", mode: "file", capture: ["domain", "subdomain"] },
  { type: "subdomain-domain", pattern: "modules/*/subdomains/*/domain/**/*", mode: "file", capture: ["domain", "subdomain"] },
  { type: "subdomain-application", pattern: "modules/*/subdomains/*/application/**/*", mode: "file", capture: ["domain", "subdomain"] },
];

const moduleElements = [...subdomainElements, ...mainDomainElements];

const sameDomain = (type) => ({
  to: {
    type,
    captured: {
      domain: "{{ from.captured.domain }}",
    },
  },
});

const sameSubdomain = (type) => ({
  to: {
    type,
    captured: {
      domain: "{{ from.captured.domain }}",
      subdomain: "{{ from.captured.subdomain }}",
    },
  },
});

const anyDomain = (type) => ({ to: { type } });

const moduleElementTypeRules = [
  { from: { type: "main-domain-domain" }, allow: [sameDomain("main-domain-domain")] },
  { from: { type: "main-domain-application" }, allow: [sameDomain("main-domain-application"), sameDomain("main-domain-domain"), sameDomain("subdomain-api"), sameDomain("subdomain-application")] },
  { from: { type: "main-domain-infrastructure" }, allow: [sameDomain("main-domain-infrastructure"), sameDomain("main-domain-application"), sameDomain("main-domain-domain"), sameDomain("subdomain-domain"), sameDomain("subdomain-application"), anyDomain("main-domain-api")] },
  { from: { type: "main-domain-interfaces" }, allow: [sameDomain("main-domain-interfaces"), sameDomain("main-domain-application"), sameDomain("main-domain-domain"), sameDomain("main-domain-infrastructure"), sameDomain("subdomain-api"), sameDomain("subdomain-application"), sameDomain("subdomain-domain"), anyDomain("main-domain-api")] },
  { from: { type: "main-domain-api" }, allow: [sameDomain("main-domain-api"), sameDomain("main-domain-interfaces"), sameDomain("main-domain-application"), sameDomain("main-domain-domain"), sameDomain("main-domain-infrastructure"), sameDomain("subdomain-api")] },
  { from: { type: "subdomain-domain" }, allow: [sameSubdomain("subdomain-domain"), sameDomain("main-domain-domain")] },
  { from: { type: "subdomain-application" }, allow: [sameSubdomain("subdomain-application"), sameSubdomain("subdomain-domain"), sameDomain("main-domain-domain")] },
  { from: { type: "subdomain-api" }, allow: [sameSubdomain("subdomain-api"), sameSubdomain("subdomain-application"), sameSubdomain("subdomain-domain"), sameDomain("subdomain-api"), sameDomain("main-domain-infrastructure"), anyDomain("main-domain-api")] },
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

const restrictedDownstreamInterfaceFirebase = {
  group: ["@integration-firebase", "@integration-firebase/*", "firebase/*"],
  message:
    "Downstream interface layers must not import Firebase directly. Use platform API boundaries (Infrastructure/Service APIs) instead.",
};

const restrictedDownstreamInfrastructureFirebase = {
  group: ["@integration-firebase", "@integration-firebase/*", "firebase/*"],
  message:
    "Downstream infrastructure layers must not import Firebase directly. Delegate through @/modules/platform/api infrastructure APIs.",
};

const restrictedWorkspaceContextInternalImports = {
  group: [
    "@/modules/workspace/interfaces/**",
    "@/modules/workspace/subdomains/*/interfaces/**",
  ],
  message:
    "notion/notebooklm interface layers must receive workspace scope via props from workspace composition; do not import workspace context directly.",
};

const restrictedWorkspaceContextApiPath = {
  name: "@/modules/workspace/api",
  importNames: ["useWorkspaceContext", "WorkspaceContextProvider"],
  message:
    "notion/notebooklm interface layers must not consume workspace context APIs directly. Receive scope via props from workspace composition.",
};

const moduleBoundaryPatterns = [moduleRootBarrel, subdomainRootBarrel, nonApiModuleSubpath];
const internalLayerPatterns = [explicitIndex, ...moduleBoundaryPatterns, internalLayer];
const downstreamInterfacePatterns = [...internalLayerPatterns, restrictedDownstreamInterfaceFirebase];
const workspaceConsumerPatterns = [...downstreamInterfacePatterns, restrictedWorkspaceContextInternalImports];

const restrictedRequireSyntax = [
  {
    selector: "CallExpression[callee.name='require']",
    message: "require() in modules is a cyclic-dependency smell signal. Prefer ports, factories, or explicit dependency injection; keep lazy require only as a documented temporary workaround.",
  },
];

const restrictedApiWildcardSyntax = [
  {
    selector: "ExportAllDeclaration[source.value=/^\\.\\.\\/application$/]",
    message: "api/index.ts must not wildcard re-export application. Export explicit public contracts instead.",
  },
  {
    selector: "ExportAllDeclaration[source.value=/^\\.\\.\\/interfaces$/]",
    message: "api/index.ts must not wildcard re-export interfaces. Publish only focused UI or hook contracts explicitly.",
  },
];

const legacyAliases = [
  { group: ["@/shared/*"], message: "Use @shared-types / @shared-utils / … instead." },
  { group: ["@/infrastructure/*"], message: "Use @integration-firebase / @integration-upstash / … instead." },
  { group: ["@/libs/*"], message: "Use the corresponding @lib-* or @integration-* alias." },
  { group: ["@/ui/shadcn/*"], message: "Use @ui-shadcn/* instead." },
  { group: ["@/ui/vis", "@/ui/vis/*"], message: "Use @ui-vis instead." },
  { group: ["@/interfaces/*"], message: "Use @api-contracts instead." },
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

  // Module boundaries (eslint-plugin-boundaries)
  {
    files: moduleCodeGlobs,
    plugins: { boundaries },
    settings: {
      "boundaries/include": moduleCodeGlobs,
      "boundaries/elements": moduleElements,
      "boundaries/dependency-nodes": ["import"],
      "boundaries/legacy-templates": false,
    },
    rules: {
      "boundaries/dependencies": [WARN, { default: "disallow", rules: moduleElementTypeRules }],
    },
  },

  // File-size guardrails per Hexagonal DDD layer
  { files: ["modules/*/interfaces/**/*.{ts,tsx}"], rules: { "max-lines": maxLinesRule(300) } },
  { files: ["modules/*/application/**/*.{ts,tsx}"], rules: { "max-lines": maxLinesRule(300) } },
  { files: ["modules/*/infrastructure/**/*.{ts,tsx}"], rules: { "max-lines": maxLinesRule(400) } },
  { files: moduleApiGlobs, rules: { "max-lines": maxLinesRule(140) } },
  { files: interfaceScreenGlobs, rules: { "max-lines": maxLinesRule(240) } },

  // Legacy alias migration
  { rules: { "no-restricted-imports": restrictedImportsRule(legacyAliases) } },

  // app / providers / debug → only module api entrypoints
  {
    files: outerAdapterGlobs,
    rules: { "no-restricted-imports": restrictedImportsRule(moduleBoundaryPatterns) },
  },

  // modules → strict entrypoint + internal layer enforcement
  {
    files: moduleCodeGlobs,
    rules: { "no-restricted-imports": restrictedImportsRule(internalLayerPatterns) },
  },

  // Cyclic-dependency smell signal: lazy require should remain exceptional, not normal composition.
  {
    files: moduleCodeGlobs,
    rules: {
      "no-restricted-syntax": restrictedSyntaxRule(restrictedRequireSyntax),
    },
  },

  // Dependency-leakage smell signal: api boundaries must not wildcard re-export inner layers.
  {
    files: moduleApiGlobs,
    rules: {
      "no-restricted-syntax": restrictedSyntaxRule(restrictedApiWildcardSyntax),
    },
  },

  // packages must not depend on application modules
  {
    files: packageGlobs,
    rules: { "no-restricted-imports": restrictedImportsRule([packageToModules]) },
  },

  // Genkit must be centralized in platform AI infrastructure adapter.
  {
    files: ["modules/**/*.{ts,tsx,js,jsx}"],
    ignores: ["modules/platform/subdomains/ai/infrastructure/**"],
    rules: {
      "no-restricted-imports": [WARN, restrictedGenkitImports],
    },
  },

  // Downstream interfaces must consume platform APIs, not Firebase SDK wrappers directly.
  {
    files: downstreamInterfaceGlobs,
    rules: {
      "no-restricted-imports": restrictedImportsRule(downstreamInterfacePatterns),
    },
  },

  // Downstream infrastructure must delegate Firebase access via platform infrastructure APIs.
  {
    files: downstreamInfrastructureGlobs,
    rules: {
      "no-restricted-imports": [WARN, { patterns: [restrictedDownstreamInfrastructureFirebase] }],
    },
  },

  // notion/notebooklm interface layers must not read workspace context directly.
  {
    files: workspaceConsumerInterfaceGlobs,
    rules: {
      "no-restricted-imports": restrictedImportsRule(workspaceConsumerPatterns, {
        paths: [restrictedWorkspaceContextApiPath],
      }),
    },
  },

  globalIgnores([".agents/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);