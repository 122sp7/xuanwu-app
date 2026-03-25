## Phase: impl
## Task: enforce-cross-module-api-only-in-eslint
## Date: 2026-03-25

### Scope
- Hardened eslint.config.mjs to enforce module boundary intent: cross-module communication via api only.

### Decisions / Findings
- Added module-root element classification to capture modules/*/index.ts.
- Enforced boundaries/element-types default disallow with same-module layer rules and cross-module api allowance.
- Added explicit module-only no-restricted-imports block after global restricted-imports block to avoid rule override in flat config order.
- Corrected interfaces layer policy to exclude direct infrastructure dependency.

### Validation / Evidence
- print-config confirms module-root element is present.
- print-config confirms module boundary no-restricted-imports patterns are active.
- lint runs with expected existing repo warnings/errors (not config loading failures).

### Deviations / Risks
- Strict rule now forbids `@/modules/<module>` imports within modules; existing violations must be refactored to `@/modules/<module>/api`.

### Open Questions
- none
