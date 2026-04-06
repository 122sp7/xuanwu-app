## Phase: maintenance
## Task: Serena project configuration blocker tracking
## Date: 2026-04-06

### Scope
- Record the current Serena project-level configuration issue that affects direct health-check and SerenaAgent initialization.

### Decisions / Findings
- `.serena/project.yml` includes `included_optional_tools: ['serena/*', 'context7/*']`.
- Serena CLI `project health-check` fails with `Invalid tool name 'serena/*' provided for inclusion` in the current environment.
- Serena CLI `project index` still succeeds, so symbol-cache refresh remains available even while health-check is degraded.
- The valid tool-name baseline should come from `serena tools list`, which exposes concrete tool names rather than wildcard namespaces.

### Validation / Evidence
- Queried official Serena docs through Context7 for project workflow, indexing, contexts/modes, and project-level configuration.
- Ran `serena tools list`, `serena project health-check`, and `serena project index`.

### Deviations / Risks
- Full `.serena/project.yml` repair was not applied because this session does not expose the Serena file-creation/edit path needed to modify protected `.serena/` config files without bypassing repo policy.

### Open Questions
- none