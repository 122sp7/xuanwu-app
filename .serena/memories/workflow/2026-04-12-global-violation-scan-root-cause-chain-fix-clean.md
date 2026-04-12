# Scope
- Executed AGENTS-oriented global scan and elimination pass.
- Completed boundaries-v6 migration and cleaned remaining lint warnings.

# Global Scan Result
- Scan-A (internal layer alias import bypass): no matches.
- Scan-B (downstream direct Firebase/Genkit imports): no matches.
- Scan-C (platform importing downstream modules): no matches.

# Root Causes Addressed
1) Convention debt in eslint boundaries config (legacy rule + legacy selector/template syntax).
2) Minor code hygiene debt (2 a11y autoFocus warnings, 1 unused type import).

# End-to-End Fix
- eslint.config.mjs: migrated boundaries/element-types to boundaries/dependencies.
- eslint.config.mjs: migrated selector rules to object-based syntax and handlebars templates.
- eslint.config.mjs: set boundaries/dependency-nodes=["import"] for behavior parity.
- modules/platform/subdomains/subscription/domain/aggregates/Subscription.ts: removed unused PlanCode import.
- modules/notion/subdomains/knowledge/interfaces/components/PageDialog.tsx: removed autoFocus prop.
- modules/workspace/subdomains/scheduling/interfaces/components/CreateDemandForm.tsx: removed autoFocus prop.

# Validation
- npm run lint: clean (0 errors, 0 warnings).
- npm run build: pass.
- post-fix AGENTS scans A/B/C: no matches.
- npm run repomix:skill executed.

# Notes
- Serena LSP explicit restart tool was not available in the exposed toolset; state refreshed via active project workflow and full lint/build + scan validation.
