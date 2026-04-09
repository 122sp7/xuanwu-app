## Phase: review
## Task: assess platform subdomain naming clarity
## Date: 2026-04-09

### Scope
- Reviewed platform canonical subdomain docs and current subdomain directory names.

### Decisions / Findings
- Canonical docs define 14 platform subdomains: identity, account-profile, organization-directory, access-control, security-policies, platform-configuration, feature-toggles, external-integrations, process-workflows, notification-delivery, audit-trail, observability, billing, user-subscriptions.
- Current directory tree also contains analytics, compliance, and content, which are outside the canonical inventory and are likely the highest confusion sources.
- Strong rename candidates for better Copilot comprehension are identity, analytics, process-workflows, and billing.

### Validation / Evidence
- Reviewed modules/platform/README.md, modules/platform/subdomains.md, modules/platform/AGENT.md, modules/platform/ubiquitous-language.md, and modules/bounded-contexts.md.
- Confirmed live subdomain directory listing under modules/platform/subdomains/.

### Deviations / Risks
- Worktree is dirty and several subdomain README/AGENT files are currently deleted, so folder names now carry more semantic load.

### Open Questions
- Whether analytics should be renamed to a narrower term or removed/folded into observability, audit-trail, billing, or another canonical subdomain.