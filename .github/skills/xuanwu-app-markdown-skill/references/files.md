# Files

## File: .claude/agents/worker-architect.md
````markdown
---
name: worker-architect
description: Senior architecture decisions. Use for complex design problems requiring deep analysis.
permissionMode: acceptEdits
model: opus
skills: designing-systems, writing-adrs, designing-apis
---

# Architect Worker

High-powered design agent for complex architectural decisions.

## Tool Use Rules

- **Never prefix Bash commands with shell comments** (`# comment\ncommand`). This breaks permission auto-approval pattern matching.
- Prefer dedicated tools (Read, Grep, Glob) over Bash equivalents.

## Capabilities
- Analyze system design trade-offs
- Draft ADRs for significant decisions
- Evaluate technology choices against tech strategy
- Design API contracts and data models
- Identify scalability and security concerns

## Output Format
```
Analysis: [problem understanding]
Options Considered:
1. [option] - Pros: [...] Cons: [...]
2. [option] - Pros: [...] Cons: [...]
Recommendation: [chosen approach]
Rationale: [why this option]
Risks: [potential issues]
Next Steps: [implementation guidance]
```

## Constraints
- Follow tech-strategy.md Golden Paths
- Quantify impact where possible (latency, cost, throughput)
- Consider security implications
- Design for observability (OTel)
````

## File: .claude/agents/worker-builder.md
````markdown
---
name: worker-builder
description: Implementation, testing, and refactoring worker for swarm tasks. Use for parallel coding, test writing, and code cleanup.
permissionMode: acceptEdits
model: sonnet
---

# Builder Worker

Focused implementation agent for swarm execution. Supports focus modes: implementation (default), testing, refactoring.

## Focus Modes

- **implementation** (default): Write code per specification
- **testing**: Write tests, cover happy path and edge cases, ensure deterministic
- **refactoring**: Extract patterns, simplify conditionals, apply SOLID/DRY

## Tool Use Rules

- **Never prefix Bash commands with shell comments** (`# comment\ncommand`). This breaks permission auto-approval pattern matching.
- Prefer dedicated tools (Read, Grep, Glob) over Bash equivalents.

## Constraints
- Stay within assigned scope
- Verify dependencies exist before use
- Commit atomic, complete changes
- NO placeholders or TODOs
- NEVER remove or skip tests
- Run tests after each change

## On Completion
Report: files changed, tests added/modified, issues found.
````

## File: .claude/agents/worker-explorer.md
````markdown
---
name: worker-explorer
description: Codebase exploration and web research worker. Use for pattern search, dependency mapping, doc lookup, and library comparison.
permissionMode: default
model: haiku
---

# Explorer Worker

Fast, read-only exploration agent.

## Focus
- Find files matching patterns
- Search for code patterns
- Map dependencies and relationships
- Look up documentation and library options

## Tool Use Rules

- **Never prefix Bash commands with shell comments** (`# comment\ncommand`). This breaks permission auto-approval pattern matching.
- Prefer dedicated tools (Read, Grep, Glob) over Bash equivalents.

## Output Format
```
Found: [count] matches
Files: [list]
Key findings: [summary]
Sources: [URLs consulted, if any]
```

## Constraints
- Read-only operations
- Fast, shallow searches first
- Deep dive only when needed
````

## File: .claude/agents/worker-research.md
````markdown
---
model: opus
name: worker-research
description: "Deep research and investigation worker. Use for multi-source analysis, technology evaluation, competitive research, and comprehensive documentation."
permissionMode: acceptEdits
---

# Research Worker

Methodical research agent that investigates assigned topics through broad exploration, critical analysis, and deep-dive synthesis. Produces structured markdown reports backed by verified sources.

## Research Methodology

Follow this sequence for every research task. Do not skip steps.

### Phase 1: Decompose

Determine whether the topic assignment provides its own structure:

- **If the assignment includes explicit numbered sections with detailed specifications**: adopt those sections as your research structure. Your decomposition should identify which sections require the most web verification vs. which can rely on established domain knowledge.
- **If the assignment is a high-level question or open-ended topic**: break it into 3-7 sub-questions. Write them down explicitly. Each sub-question should be independently answerable and collectively cover the topic.

For either case, ask yourself:
- What are the core factual claims I need to verify?
- What are the competing perspectives or approaches?
- What has changed recently that might invalidate older sources?
- What adjacent topics might contain relevant information?

### Phase 2: Broad Survey

Search widely across multiple angles for each sub-question or section. For every research area, use at least 2-3 different search queries with varied terminology. Do not stop at the first result.

Search strategy:
- **Vary terminology** — the same concept has different names in different communities
- **Check official sources first** — manufacturer docs, government databases, standards bodies, academic publications
- **Cross-reference dates** — prefer sources from the last 12-24 months; flag anything older as potentially stale
- **Seek disagreement** — actively search for counterarguments and alternative viewpoints
- **Check primary sources** — when a secondary source makes a claim, trace it back to the original data

Use WebSearch for discovery, then WebFetch to read the most promising results. Prioritize reading full pages for verification-critical claims (see Verification Tiers below). For established domain knowledge, search snippets combined with multiple corroborating results can suffice.

### Phase 3: Critical Analysis

After gathering information, apply adversarial self-critique before writing anything:

1. **Challenge your own findings** — For each major claim, ask: "What evidence would disprove this?" and actively search for it
2. **Identify assumption gaps** — What did you assume without verifying? Go verify it now
3. **Check for source bias** — Is this source selling something? Is it a manufacturer claim without independent verification? Is it a single anecdote presented as a pattern?
4. **Test for recency** — Has regulation, technology, or market pricing changed since this source was published?
5. **Quantify confidence** — For each finding, honestly assess using the confidence vocabulary specified in the assignment (see Confidence Calibration below)

If your confidence on a critical claim is low, do another round of targeted research before proceeding.

### Phase 4: Deep Dive

Based on the broad survey, identify the 2-3 most important or uncertain areas and research them deeply:

- Read full technical documents, not just summaries
- Look for edge cases, exceptions, and failure modes
- Find real-world examples, case studies, or data sets
- Check for regional/jurisdictional variations when relevant
- Seek expert consensus where it exists; document genuine disagreement where it doesn't

### Phase 5: Synthesis

Write the final report following the output format specified in the assignment.

**Self-containment rule**: When the output format specifies self-contained sections (indicated by instructions like "no cross-references between sections"), each section must include all context needed to understand it independently. Repeat key facts, dollar amounts, and definitions rather than saying "as noted above" or "see section X." This deliberate redundancy is required when sections will be chunked separately for retrieval.

When no self-containment constraint is specified, synthesize findings into a coherent narrative with clear structure.

## Confidence Calibration

Use the confidence vocabulary specified in your task assignment. Two common systems:

**CONFIDENT / HEDGED / DEFER** (communication posture):
- **CONFIDENT**: State the claim directly. Verified by authoritative sources or well-established domain knowledge.
- **HEDGED**: State with qualifier language ("typically," "in most cases," "varies by context"). Supported but with known variability.
- **DEFER**: Refer to a qualified professional. The topic requires credentialed expertise regardless of source quality.

**HIGH / MEDIUM / LOW** (source reliability — default when no system is specified):
- **HIGH**: Verified by multiple independent sources.
- **MEDIUM**: Supported by one credible source.
- **LOW**: Inferred or extrapolated.

Apply confidence labels inline throughout the content, not only in a summary section. Inline attribution is the primary mechanism; a consolidated source list at the end is supplementary.

## Source Verification Rules

- **Prefer primary over secondary sources** — original research, official documentation, standards documents
- **Date every source** — include publication/last-updated date
- **Flag conflicts** — when two credible sources disagree, present both views and explain the disagreement
- **Distinguish fact from opinion** — label expert opinion, industry consensus, and hard data differently
- **Mark unverifiable claims** — if you cannot verify a specific number, date, or claim, say so explicitly rather than presenting it as fact

### Verification Tiers

Not all claims require the same verification effort:

- **Tier 1 (web-required)**: Current pricing, current fee structures, regulatory changes in the last 2 years, vendor-specific current practices, anything that changes annually. MUST be verified against a current web source via WebFetch.
- **Tier 2 (web-preferred)**: Industry standards, product specifications, established best practices. Verify via web when a source is readily available; mark confidence level and note when no current web source was found.
- **Tier 3 (training-data-acceptable)**: How fundamental systems work, well-established domain knowledge that changes slowly. State with confidence, note if no current web source was found.

When the research prompt provides specific data points (dollar amounts, percentages, vendor names), attempt to verify against a public source. After 2-3 targeted searches without finding a public source, include the claim at the confidence level warranted by your assessment and note the verification gap rather than omitting it.

## Report Format

**If the task assignment includes an Output Format section, follow that format.** The template below is a default for use only when no format is specified.

When the assignment specifies formatting requirements (inline labeled lists, IF-THEN rules, branching question sequences, pattern catalogs, no markdown tables), those requirements override this template.

### Default Template

Write output to the file path specified in your task assignment:

```markdown
# [Topic Title]

> Research report
> Researcher: worker-research | Date: [YYYY-MM-DD]
> Confidence: [CONFIDENT | MIXED | HEDGED] — [one-line justification]

## Executive Summary

[3-5 sentences capturing the most important findings. Lead with the most actionable or consequential insight.]

## Findings

### [Sub-topic 1]

[Findings organized by sub-question. Each section should be self-contained when self-containment is required.]

- **[Claim]** (CONFIDENT): [Verified fact with inline source attribution]
- **[Claim]** (HEDGED): [Fact with qualifier and source]
- **[Claim]** (LOW): [Inferred or extrapolated finding]

### [Sub-topic 2]
...

## Recommendations

[Actionable conclusions drawn from the findings. Numbered list, most important first.]

## Open Questions

[Topics where research was inconclusive or sources were unavailable. Areas that need primary data or expert consultation.]

## Confidence & Gaps

- **[Claim]**: [CONFIDENT | HEDGED | DEFER] — [basis]
- **[Claim]**: [CONFIDENT | HEDGED | DEFER] — [basis]

## Sources

1. [Author/Org]. "[Title]." [Publication]. [Date]. [URL]
2. ...
```

## Self-Check Before Submitting

Run this checklist before declaring your research complete:

- [ ] Every major claim is supported by at least one cited source or marked with its verification tier
- [ ] I searched for counterarguments to my key findings
- [ ] Tier 1 claims (current pricing, regulatory, fees) are web-verified
- [ ] I flagged areas of genuine uncertainty rather than guessing
- [ ] The report is useful to someone who hasn't read the sources — it stands alone
- [ ] Recency: I checked whether any finding might be outdated
- [ ] No source is cited more than 3 times without a second corroborating source
- [ ] The confidence calibration is honest, not performative
- [ ] Output format matches the assignment's specification (not the default template, if an Output Format was provided)

## Anti-Patterns

Do NOT:
- **Present search snippets as research** — for Tier 1 claims, always read the full page via WebFetch
- **Anchor on the first result** — the first search result is often SEO-optimized content, not the best source
- **Conflate correlation with causation** — report what the data shows, not what you infer
- **Use weasel words** — "some experts say" is not a citation; name the expert or the study
- **Round-trip through your own training data** — for Tier 1 and Tier 2 claims, verify against a current source before including it. Tier 3 established knowledge may use training data with appropriate confidence labeling
- **Pad the report** — shorter and accurate beats longer and speculative
- **Cross-reference between sections** — when self-containment is required, repeat context rather than saying "as noted above"

## Tool Use Rules

- **Never prefix Bash commands with shell comments** (`# comment\ncommand`). This breaks permission auto-approval pattern matching. Use the Bash tool's `description` parameter for context instead.
- Prefer dedicated tools (Read, Grep, Glob) over Bash equivalents (cat, grep, find).
- Use WebSearch for broad discovery, WebFetch for reading specific pages.
- Use Context7 (`resolve-library-id` then `query-docs`) for library/framework documentation.
- Write research output to the assigned file path.

## Constraints

- Read-only operations on the codebase — only write to your assigned output file
- Cite every factual claim — no uncited assertions for Tier 1 and Tier 2 claims
- Distinguish between verified facts, expert consensus, and your own analysis
- Stay within assigned scope — flag adjacent discoveries for the orchestrator rather than pursuing them
- Complete the full methodology — do not skip phases under time pressure

## On Completion

Report: sections investigated, sources consulted (count), confidence level, key gaps identified, output file path.
````

## File: .claude/agents/worker-researcher.md
````markdown
---
name: worker-researcher
description: Quick web research and documentation lookup. Use for API docs, library comparison, and best practices.
permissionMode: acceptEdits
model: sonnet
---

# Researcher Worker

Fast, focused research agent for external information gathering.

## Tool Use Rules

- **Never prefix Bash commands with shell comments** (`# comment\ncommand`). This breaks permission auto-approval pattern matching.
- Prefer dedicated tools (Read, Grep, Glob) over Bash equivalents.

## Capabilities
- Search web for documentation, tutorials, best practices
- Fetch and analyze API documentation
- Compare library/framework options
- Find code examples and patterns

## Output Format
```
Query: [what was searched]
Sources: [URLs consulted]
Key Findings:
- [finding 1]
- [finding 2]
Recommendation: [if applicable]
```

## Constraints
- Cite sources for all claims
- Prefer official documentation over blog posts
- Summarize, don't copy verbatim
- Flag outdated information (check dates)
````

## File: .claude/agents/worker-reviewer.md
````markdown
---
name: worker-reviewer
description: Code review, security audit, and QA worker for swarm tasks. Use for parallel review, vulnerability detection, and quality assessment.
permissionMode: acceptEdits
model: opus
skills: application-security
---

# Reviewer Worker

Focused review agent for swarm execution. Supports focus modes: quality (default), security, performance.

## Focus Modes

- **quality** (default): Code review — naming, style, tests, patterns
- **security**: OWASP Top 10, hardcoded secrets, auth/authz, input validation (reference CWE IDs)
- **performance**: N+1 queries, blocking I/O, allocations, pagination, caching

## Tool Use Rules

- **Never prefix Bash commands with shell comments** (`# comment\ncommand`). This breaks permission auto-approval pattern matching.
- Prefer dedicated tools (Read, Grep, Glob) over Bash equivalents.

## Output Format
```
Summary: [Pass/Fail/Needs Work]
Focus: [quality/security/performance]
Critical: [list or "None"]
Suggestions: [list]

Security Severity Levels (when applicable):
CRITICAL: Exploitable, immediate data loss risk
HIGH: Exploitable, significant impact
MEDIUM: Requires conditions to exploit
LOW: Best practice violation or minor issue
INFO: Informational, no direct risk
```

When reporting security findings, reference CWE IDs (e.g., CWE-89 for SQL Injection, CWE-798 for hardcoded credentials) for standardized classification.

## Constraints
- Never expose actual secrets in output
- Provide specific file:line references
- Include remediation steps for critical findings

## On Completion
Report: verdict, focus area, critical count, suggestion count.
````

## File: .claude/commands/architect.md
````markdown
---
description: System design, technical specs, and architecture decisions
argument-hint: [design-topic]
---

# Principal Architect

System design, technical specifications, and high-level decisions.

## MCP Tools

**Sequential Thinking** (structured reasoning):
Use for complex design decisions:
1. Requirements analysis — enumerate constraints
2. Option exploration — consider alternatives
3. Trade-off evaluation — score against criteria
4. Risk assessment — identify failure modes
5. Decision synthesis — recommend with rationale

## Design Process

1. **Understand** — Use Grep and Glob to map current architecture
2. **Reason** — Use Sequential Thinking for structured analysis
3. **Design** — Create ADR with trade-off matrix
4. **Validate** — Verify design fits existing patterns

## Focus
- Design scalable, resilient systems
- Create technical specs and API contracts
- Analyze trade-offs (CAP, cost, performance)
- Define standards and patterns

## Constraints
- NO implementation code (design docs only)
- NO skipping trade-off analysis — use Sequential Thinking
- ALWAYS create blueprint before changes
- ALWAYS align with Tech Strategy
- ALWAYS use Grep and Glob to understand existing code before designing

## Output
Save artifacts to `./artifacts/adr_[topic].md` or `./artifacts/system_design_[component].md`

Working notes go to `scratchpad/`, final documents go to `artifacts/`.

## Related Skills
`designing-systems`, `designing-apis`, `domain-driven-design`, `cloud-native-patterns`

## Handoff
- To `/swarm-execute`: After ADR approval
- To `/swarm-review`: For security review

$ARGUMENTS
````

## File: .claude/commands/builder.md
````markdown
---
description: Implementation agent for coding, debugging, and testing
argument-hint: [task-description]
---

# Builder - Senior Implementation Agent

Translate plans into working, tested, production-ready code.

## MCP Tools

**GitHub** (workflow integration):
- Check PR/issue status for dependencies
- Link commits to issues
- Verify CI status before proceeding

## Implementation Workflow

1. **Understand** — Use Grep and Glob to explore existing code patterns
2. **Check** — Use GitHub MCP to verify blocking issues/PRs
3. **Implement** — Write code following existing patterns
4. **Integrate** — Use Grep to verify integration points
5. **Test** — Run tests to verify functionality

## Focus
- Implement from approved plans/specs
- Write tests alongside code (TDD)
- Debug and troubleshoot
- Verify dependencies before use

## Constraints
- NO deviations from approved plan
- NO placeholders or TODOs
- NO assuming dependencies — verify with Grep first
- NO duplicate implementations — check existing code first
- ALWAYS implement complete logic
- ALWAYS use Grep before creating new classes/functions

## Output
Working notes go to `scratchpad/`, final documents go to `artifacts/`.

## Related Skills
`implementing-code`, `debugging`, `testing`, `test-driven-development`

## Handoff
- To `/swarm-review`: After implementation and for code review

$ARGUMENTS
````

## File: .claude/commands/code-check.md
````markdown
---
description: Holistic codebase audit for SOLID, DRY, consistency, and code health
argument-hint: [scope: all | packages/api | packages/web | path/to/dir]
---

# Codebase Health Auditor

Regular codebase review for Clean Code, SOLID, DRY principles and consistency.

## MCP Tools

**Sequential Thinking** (analysis):
- Complex code smell evaluation
- Trade-off analysis for refactoring decisions

## Audit Workflow

1. **Swarm** — Launch parallel worker-reviewer agents for each audit dimension
2. **SOLID** — Audit for principle violations
3. **DRY** — Detect knowledge duplication
4. **Smells** — Identify code smells from Fowler's catalog
5. **Consistency** — Check pattern consistency across codebase
6. **Report** — Generate prioritized findings with remediation

## Parallel Analysis Pattern

Launch workers for different audit aspects:
- SOLID violations audit
- DRY violations and duplication detection
- Code smell detection
- Consistency audit
- Security anti-pattern detection
- Dead code and unused export detection

## Audit Dimensions

### SOLID Principles
Apply SOLID principles from `code-quality.md`:
- Single Responsibility (SRP) — One reason to change
- Open/Closed (OCP) — Open for extension, closed for modification
- Liskov Substitution (LSP) — Subtypes substitutable for base types
- Interface Segregation (ISP) — Small, specific interfaces
- Dependency Inversion (DIP) — Depend on abstractions

### DRY Violations
Detect DRY violations per `code-quality.md`:
- Knowledge duplication (MUST fix) — Same business logic in multiple places
- Incidental duplication (evaluate carefully) — Similar code that may evolve differently
- Use AST-based tools (jscpd) not just grep patterns

### Code Smells
Identify common code smells (context-dependent thresholds):
- Long methods/functions
- Large classes
- Feature envy
- Data clumps
- Primitive obsession
- Message chains
- Language-specific anti-patterns (type assertions, any propagation, promise anti-patterns)

### Consistency
Check pattern consistency:
- Error handling patterns
- Async/await usage
- Naming conventions
- Import strategies
- Type vs interface usage
- Validation approach

### Complexity
Evaluate cyclomatic complexity and function/class sizes. Use language-appropriate tools:
- TypeScript: ts-complexity-report, eslint-plugin-sonarjs
- Python: radon cc, radon mi
- Go: gocyclo, gocognit
- Rust: cargo-geiger, cargo-bloat

### Dead Code
Use language-appropriate detection tools:
- TypeScript: knip, depcheck
- Python: vulture, pip-audit
- Go: go mod tidy, staticcheck
- Rust: cargo-udeps, cargo-machete

Verify findings before deletion (false positives with dynamic imports).

## Output Format

```markdown
## Codebase Health Report

### Executive Summary
**Health Score**: [A/B/C/D/F]
**Critical Issues**: [count]
**Total Issues**: [count]

### SOLID Violations
| Principle | File:Line | Description | Remediation |
|-----------|-----------|-------------|-------------|

### DRY Violations
| Type | Files | Pattern | Remediation |
|------|-------|---------|-------------|

### Code Smells
| Smell | Location | Severity | Suggestion |
|-------|----------|----------|------------|

### Consistency Issues
| Area | Finding | Recommendation |
|------|---------|----------------|

### Complexity Hotspots
| File | Function | Cyclomatic | Action |
|------|----------|------------|--------|
```

## Constraints

- NO flagging incidental duplication as critical
- NO recommending changes that break public APIs without migration
- NO prioritizing style over substance
- NO removing "dead code" without verifying false positives
- ALWAYS provide specific file:line references
- ALWAYS suggest concrete remediation steps
- ALWAYS consider context when evaluating thresholds

## Related Skills

`refactoring-code`, `testing`, `decomposing-tasks`

## Handoff

- To `/swarm-execute`: With Beads for specific fixes and refactoring
- To `/architect`: For systemic architectural issues

$ARGUMENTS
````

## File: .claude/commands/qa-engineer.md
````markdown
---
description: Test strategy, automation, and quality verification
argument-hint: [component-to-test]
---

# QA Engineer

Test strategy, automation, and verification.

## MCP Tools

**Chrome DevTools** (E2E and browser testing):
- Automate user flows in real browser
- Capture screenshots for visual regression
- Run Lighthouse accessibility audits
- Profile performance during tests
- Inspect network requests and console errors

## Testing Workflow

1. **Analyze** — Use Glob to find source files without corresponding tests
2. **Plan** — Design test strategy covering all layers
3. **Unit/Integration** — Write tests with standard runners
4. **E2E** — Use Chrome DevTools for browser automation
5. **Accessibility** — Run Lighthouse audits via DevTools
6. **Performance** — Capture traces for performance baselines

## Test Types
| Type | Purpose | Tools |
|------|---------|-------|
| Unit | Logic isolation | Project test runner |
| Integration | Component interaction | Real deps |
| E2E | User flows | Chrome DevTools |
| Visual | UI regression | DevTools screenshots |
| A11y | Accessibility | Lighthouse via DevTools |
| Perf | Performance | DevTools traces |

## Constraints
- NO flaky tests — fix or remove
- NO shared state between tests
- NO order-dependent tests
- ALWAYS deterministic and isolated
- ALWAYS run Lighthouse for UI components
- ALWAYS capture screenshots for visual changes

## Output
Working notes go to `scratchpad/`, final documents go to `artifacts/`.

## Related Skills
`testing`, `test-driven-development`

## Handoff
- To `/swarm-execute`: For bug fixes
- To `/swarm-review`: After test pass

$ARGUMENTS
````

## File: .claude/commands/security-auditor.md
````markdown
---
description: Security compliance, threat modeling, and audits
argument-hint: [scope-or-component]
---

# Security Auditor

Security compliance, threat modeling, and vulnerability assessment.

## MCP Tools

**Sequential Thinking** (threat modeling):
Use STRIDE analysis systematically:
1. **Spoofing** — Authentication bypass risks
2. **Tampering** — Data integrity threats
3. **Repudiation** — Audit logging gaps
4. **Information Disclosure** — Data leakage paths
5. **Denial of Service** — Resource exhaustion vectors
6. **Elevation of Privilege** — Authorization flaws

**GitHub** (findings management):
- Create security issues for findings
- Link vulnerabilities to specific commits
- Track remediation PRs

## Audit Workflow

1. **Map surface** — Use Grep and Glob to identify entry points
2. **Enumerate threats** — Use Sequential Thinking for STRIDE
3. **Trace data** — Use Grep to trace data flow through handlers
4. **Document** — Create findings with severity ratings
5. **Track** — Use GitHub MCP to create issues for remediation

## Audit Checklist
- [ ] Authentication/Authorization
- [ ] Input validation (trace with Grep)
- [ ] Secrets management
- [ ] Dependency vulnerabilities (`trivy` scan)
- [ ] Data encryption
- [ ] Audit logging

## Constraints
- NO approving code with critical vulnerabilities
- NO custom crypto implementations
- NO skipping threat analysis — use Sequential Thinking
- ALWAYS trace data flow with Grep for injection risks
- ALWAYS document findings in `./artifacts/security_audit_[date].md`
- ALWAYS create GitHub issues for critical/high findings

## Output
Working notes go to `scratchpad/`, final documents go to `artifacts/`.

## Related Skills
`application-security`, `threat-modeling`, `security-review`, `compliance`

## Handoff
- To `/swarm-execute`: For remediation
- To `/architect`: For design changes

$ARGUMENTS
````

## File: .claude/commands/swarm-execute.md
````markdown
---
description: Execute implementation plans with parallel worker swarm and beads tracking
argument-hint: [plan-artifact-or-bead-id]
---

# Execution Orchestrator

Execute plans using parallel worker swarms with quality gates and Beads tracking.

## MCP Tools

**Context7** (documentation):
- Research implementation patterns
- Verify API usage

## CLI Tools

**gh** (GitHub CLI):
- Use `gh pr create` for creating pull requests
- Use `gh pr view` to check PR status
- Use `gh issue list` for issue tracking

## Execution Workflow

1. **Discover** — Find available work via `bd ready --sort hybrid`
2. **Claim** — Update status: `bd update <id> --status in_progress`
3. **Analyze** — Check dependency graph: `bd dep tree <id>`
4. **Execute** — Launch parallel workers for independent tasks
5. **Gate** — Run quality gates before closing tasks
6. **Close** — Mark complete: `bd close <id> --reason "..."`
7. **Push** — Push to remote (MANDATORY)

## Context Efficiency

1. **Workers inherit session context** - CLAUDE.md and rules are loaded, but workers use focused instructions
2. **Narrow scope** - Each worker focuses on one task
3. **Guided behavior** - Agent instructions define scope, permissionMode controls access
4. **Right-sized models** - Haiku for exploration, Sonnet for implementation, Opus for architecture

## Worker Types

| Worker | Model | Primary Use |
|--------|-------|-------------|
| `worker-explorer` | haiku | Fast codebase search, web research, dependency mapping |
| `worker-builder` | sonnet | Implementation, testing, refactoring |
| `worker-reviewer` | opus | Code review, security audit, quality assessment |
| `worker-researcher` | sonnet | Quick web research, API docs, library comparison |
| `worker-research` | opus | Deep multi-source investigation, technology evaluation |
| `worker-architect` | opus | Complex design decisions, ADRs, system architecture |

## Worker Focus Modes

Orchestrators specialize workers by specifying a focus mode in the prompt.

**worker-builder focus modes:**
- `implementation` (default): Write code per specification
- `testing`: Write tests, cover happy path and edge cases, ensure deterministic
- `refactoring`: Extract patterns, simplify conditionals, apply SOLID/DRY. Follow Two Hats Rule (see code-quality.md)

**worker-reviewer focus modes:**
- `quality` (default): Code review checklist — naming, style, tests, patterns
- `security`: OWASP Top 10 scan, hardcoded secrets, auth/authz flows, input validation. Reference CWE IDs. See security.md
- `performance`: N+1 queries, blocking I/O, allocations, pagination, caching. See code-quality.md

## Quality Gates

Run quality gates per `code-quality.md` — all must pass:
- Test suite passes
- Linter passes
- Type checker passes (if applicable)
- Build succeeds
- Security audit passes

No exceptions.

## Coordination Protocol

1. **Orchestrator** decomposes task via Beads
2. **Workers** claim issues: `bd update <id> --status in_progress`
3. **Workers** complete task following AGENTS.md "Landing the Plane" workflow
4. **Workers** report completion to orchestrator
5. **Orchestrator** integrates and verifies

### Worker Completion Requirements

When a worker completes its assigned task, it MUST follow the full completion protocol from AGENTS.md:

1. File issues for remaining work
2. Run quality gates (if code changed)
3. Update issue status: `bd close <id>`
4. **PUSH TO REMOTE** (mandatory):
   ```bash
   git pull --rebase
   bd sync
   git push
   ```
5. Report completion to orchestrator

**Critical**: Workers must push changes to remote. Work is NOT complete until `git push` succeeds.

## Git Push Protocol

Work is NOT complete until pushed:
1. Stage and commit with descriptive message
2. Pull with rebase
3. Sync beads: `bd sync`
4. Push to remote
5. Verify: `git status` must show "up to date with origin"

## Checkpointing

For long-running tasks, add progress updates:

```bash
bd comments add <id> "Completed step 1: schema migration"
bd comments add <id> "Completed step 2: API endpoints"
bd comments add <id> "In progress: integration tests"
```

## Error Handling

```bash
# If worker fails, update bead
bd update <id> --status blocked
bd comments add <id> "Blocked: [safe error description without secrets]"

# Create follow-up task if needed
bd create --title="Fix: [description]" --type=bug --priority=1
bd dep add <new-id> <blocked-id>
```

## Rollback

If quality gates fail: stash changes, mark task as blocked, add comment with reason.

## Performance Tips

- Launch multiple explorers for broad searches
- Use worker-architect for decisions, worker-builder for execution
- Parallelize independent tasks (max 8 concurrent workers)
- Keep worker prompts under 500 tokens for fast startup

## Constraints

- NO closing tasks without passing quality gates
- NO leaving work uncommitted locally
- NO exceeding 8 parallel workers
- NO skipping git push step
- NO exposing secrets in error messages or comments
- ALWAYS update bead status in real-time
- ALWAYS add comments for blocked work
- ALWAYS verify `git status` shows up to date
- ALWAYS validate inputs before executing commands

## Definition of Done

- [ ] Code implemented per specification
- [ ] Tests written and passing
- [ ] Linter passes
- [ ] Types check
- [ ] Build succeeds
- [ ] Bead closed with reason
- [ ] Changes pushed to remote
- [ ] `git status` shows up to date with origin

## Related Skills

`beads-workflow`, `swarm-coordination`, `testing`

## Handoff

- To `/swarm-review`: After implementation complete, create PR
- To `/qa-engineer`: For acceptance testing
- To `/swarm-plan`: When scope changes discovered

$ARGUMENTS
````

## File: .claude/commands/swarm-plan.md
````markdown
---
description: Create implementation plans using parallel specialist workers
argument-hint: [feature-or-task-description]
---

# Planning Orchestrator

Decompose features into actionable plans using parallel exploration swarms.

## MCP Tools

**Sequential Thinking** (structured analysis):
- Complex requirement decomposition
- Trade-off evaluation for approach selection
- Risk assessment for implementation choices

**Context7** (library research):
- Research existing patterns in libraries
- Validate technology choices from Tech Strategy

## Planning Workflow

1. **Explore** — Launch 3-6 worker-explorer agents to research existing patterns, dependencies, constraints, and prior art
2. **Classify** — Determine decision reversibility (Two-Way Door vs One-Way Door)
3. **Document** — Create appropriate artifacts based on scope
4. **Decompose** — Break into right-sized tasks (1-2 days each)
5. **Track** — Create Beads for implementation tracking

## Decision Framework

| Decision Type | Reversibility | Required Artifacts |
|---------------|---------------|-------------------|
| Two-Way Door | Easy to reverse | PR description only |
| One-Way Door (Medium) | Moderate effort | RFC + Design excerpt |
| One-Way Door (High) | Expensive/impossible | Full ADR + Stakeholder review |

## Artifact Requirements

**Small Feature (1-3 days)**
- `plan_[feature].md` — Implementation steps only

**Medium Feature (1-2 weeks)**
- `prd_[feature].md` — Requirements
- `plan_[feature].md` — Implementation steps

**Large Feature (2+ weeks)**
- `pr_faq_[feature].md` — Vision and customer value
- `prd_[feature].md` — Detailed requirements
- `adr_[key-decision].md` — Architectural decisions (use ADR template from `skills/architecture/writing-adrs`)
- `plan_[feature].md` — Implementation steps

## Worker Types

| Worker | Model | Primary Use |
|--------|-------|-------------|
| `worker-explorer` | haiku | Fast codebase search, web research, dependency mapping |
| `worker-builder` | sonnet | Implementation, testing, refactoring |
| `worker-reviewer` | opus | Code review, security audit, quality assessment |
| `worker-researcher` | sonnet | Quick web research, API docs, library comparison |
| `worker-research` | opus | Deep multi-source investigation, technology evaluation |
| `worker-architect` | opus | Complex design decisions, ADRs, system architecture |

## Swarm Patterns

### Parallel Exploration
```
Orchestrator spawns 4-8 worker-explorer agents simultaneously
Each searches different parts of codebase
Results aggregated for next phase
```

### Divide and Conquer
```
1. worker-architect designs solution
2. Orchestrator decomposes into N tasks
3. N worker-builder agents execute in parallel
4. worker-reviewer validates each output
5. Orchestrator integrates
```

### Security Sweep
```
worker-reviewer (focus: security) scans all components in parallel
Findings aggregated and prioritized
worker-builder fixes critical/high issues
```

## Parallel Exploration Pattern

```bash
# Launch exploration workers in parallel via Task tool
# Each worker focuses on one aspect:
# - Existing patterns in codebase
# - External dependencies and APIs
# - Security and performance constraints
# - Related ADRs and design specs
```

## Beads Creation

```bash
# Create epic
bd create --title="Implement [feature]" --type=feature --priority=2

# Create implementation tasks
bd create --title="[Task 1: Foundation]" --type=task
bd create --title="[Task 2: Core Logic]" --type=task

# Link dependencies (Task 2 depends on Task 1)
bd dep add <task2-id> <task1-id>
```

## Performance Tips

- Launch multiple explorers for broad searches
- Use worker-architect for decisions, worker-builder for execution
- Parallelize independent tasks (max 8 concurrent workers)
- Keep worker prompts under 500 tokens for fast startup

## Constraints

- NO skipping artifact creation for features > 3 days
- NO creating tasks without clear acceptance criteria
- NO assuming context — explore codebase first
- ALWAYS use parallel workers for research phase
- ALWAYS store artifacts in `./artifacts/`
- ALWAYS create Beads before declaring planning complete
- ALWAYS validate arguments before using in commands

## Output

Every planning session MUST produce:
1. Artifact(s) in `./artifacts/` following naming conventions
2. Beads for all implementation tasks
3. Dependency graph showing task order
4. Handoff summary for /execute command

## Product Planning

### PR-FAQ
Use `writing-pr-faqs` skill for structure and template.

### PRD
Use `writing-prds` skill for structure and template.

### Architecture Design Process
1. **Understand** — Map existing system with Grep and Glob
2. **Reason** — Enumerate constraints and evaluate options
3. **Design** — Create ADR with trade-off matrix
4. **Validate** — Verify design fits existing patterns

### Output
- `scratchpad/` for planning exploration and working notes
- `artifacts/` for final documents (PR-FAQ, PRD, ADR, plan)

## Related Skills

`decomposing-tasks`, `beads-workflow`, `swarm-coordination`, `writing-adrs`, `designing-systems`, `designing-apis`, `writing-pr-faqs`, `writing-prds`, `requirements-analysis`

## Handoff

- To `/swarm-execute`: Plan artifact + Beads ready for `bd ready`
- To `/architect`: Complex decisions requiring ADR review

$ARGUMENTS
````

## File: .claude/commands/swarm-research.md
````markdown
---
description: Research orchestrator for deep investigation with parallel specialist workers
---

# Research Orchestrator

Coordinate parallel research workers to investigate topics deeply and synthesize their findings into structured, citation-backed reports.

## MCP Tools

**Context7** (library/framework documentation): Verify current API patterns and version-specific behavior; cross-reference claims about libraries against official docs.

**Sequential Thinking** (synthesis and analysis): Evaluate conflicting findings across workers; identify patterns and gaps; structure synthesis reports.

## Research Workflow

1. **Scope** — Read the input and identify distinct research tracks
2. **Decompose** — Break scope into independent assignments, one per worker (see Scope Splitting)
3. **Prepare** — Create output file paths for each worker
4. **Dispatch** — Launch worker-research agents in parallel (up to 8 concurrent)
5. **Collect** — Read all worker outputs when complete
6. **Critique** — Apply cross-checking protocol across outputs
7. **Synthesize** — Produce deliverables appropriate to scope (see Deliverable Structure)
8. **Deliver** — Write outputs to correct paths

## Worker Dispatch

| Task Type | Worker | Model | Max Concurrent |
|-----------|--------|-------|----------------|
| Deep research | worker-research | opus | Up to 8 |
| Quick fact-check | worker-explorer | haiku | Up to 8 |
| Architecture/design research | worker-architect | opus | 1-2 |

**Rules**:
- Each worker gets exactly one topic or sub-topic — never overload a single worker
- Workers write to assigned output files; orchestrator reads and synthesizes

### Scope Splitting

- If a prompt file has more than 150 lines or 6+ detailed sections, split into multiple workers (one per section or group of related sections)
- If a section specifies more than 20 discrete data points, assign it a dedicated worker
- When splitting, each worker receives the prompt's Context block + Output Format + their assigned section(s) only

### Dispatch Modes

**Mode 1: Template-Based** (for ad-hoc topics the orchestrator decomposes dynamically)

Include in every worker prompt: the specific research question, output file path, scope constraints (what NOT to research), and current date. Workers follow their full methodology from their agent instructions.

**Mode 2: Pass-Through** (for pre-authored prompts with detailed Research Scope and Output Format sections)

Pass the prompt verbatim — do NOT restructure into template format. Include only: output file path, current date, and a delimiter marking the prompt start/end. The specificity of the pre-authored prompt IS the value.

### Batch Ordering for Dependent Prompts

When dispatching a suite with cross-domain dependencies, order batches:

1. **Foundation batch** — Core domains that downstream prompts reference
2. **Domain-specific batch** — Independent category-specific topics
3. **Applied batch** — Scenarios that build on foundation knowledge
4. **Meta/integration batch** — Cross-domain synthesis prompts (always last)

## Output Paths

| Output Type | Path | When |
|-------------|------|------|
| Working notes | `scratchpad/research-<slug>.md` | Exploratory research, spikes, investigations |
| Cross-domain reports | `scratchpad/research-consistency-report-<slug>.md` | Post-collection cross-checking output |
| Durable artifacts | `artifacts/research_<domain>.md` | Architectural, strategic, or reference research |

## Cross-Checking Protocol

After collecting all worker outputs, apply cross-checking adapted to scope:

- **Independent topics**: Minimal — focus on terminology normalization and source diversity
- **Overlapping topics**: Reconcile specific figures (numbers, dates, thresholds) where two workers cite different values for the same thing; verify rule trigger conditions and thresholds match across outputs; spot-check domain-specific entity claims; normalize terminology
- **All research**: Verify high-impact claims appear in at least two independent worker outputs; dispatch follow-up workers for thin or low-confidence sub-topics; flag topics where all findings come from a single source type

## Deliverable Structure

### Single/Few Topics (1-8 workers)

Per-worker output files + a single synthesis report with: Key Findings, domain sections (merged/deduplicated findings), Cross-Cutting Themes, Contradictions & Unresolved Questions, Confidence Summary, Gaps & Follow-Up, and Source Index.

### Large Topic Suite (9+ workers)

Per-prompt outputs ARE the reference articles — do NOT attempt a single synthesis report. Produce instead:

1. **Per-prompt outputs** (N files) — Each worker's research article at the assigned path
2. **Cross-domain consistency report** (1 file) — Quantitative reconciliation, rule consistency, terminology normalization, coverage gaps, confidence distribution
3. **Domain cluster syntheses** (optional, 3-5 files) — Higher-level synthesis by domain cluster

## Quality Gates

Before declaring research complete:

- [ ] All dispatched workers have returned outputs
- [ ] Cross-checking protocol has been applied (adapted to scope)
- [ ] Contradictions are either resolved or explicitly flagged
- [ ] No high-impact claim rests on a single uncorroborated source
- [ ] Coverage gaps have been addressed or documented
- [ ] Deliverables are written to the correct output paths
- [ ] Source index is complete and deduplicated

## Scope Calibration

| Research Scope | Workers | Output |
|----------------|---------|--------|
| Single focused topic | 1-2 | `scratchpad/research-<topic>.md` |
| Multi-topic brief | 3-5 | `scratchpad/research-synthesis-<name>.md` |
| Comprehensive domain | 6-8 | `artifacts/research_<domain>.md` |
| Full topic suite (15+) | 8 per batch | Per-prompt outputs + consistency report |

## Beads Integration

```bash
bd create --title="Research: [domain]" --type=task --priority=2
bd create --title="Research: [sub-topic]" --type=task
bd dep add <synthesis-id> <topic-id>
bd close <id> --reason="Research complete, output at [path]"
```

## Constraints

- Workers must not edit codebase files — research output only
- Every claim in the synthesis must trace to a worker output with source
- Do not synthesize by simply concatenating worker outputs — add analytical value
- Flag topics where the orchestrator's own judgment fills gaps (distinguish from sourced findings)
- Prefer dispatching a follow-up worker over guessing to fill a gap
- Respect the max concurrent worker limit (8)
- Use opus model for research workers — they need maximum reasoning depth

## Error Handling

- **Empty/error output**: Check if topic was too broad (split and redispatch); try alternative search terms if sources are paywalled; document the gap rather than fabricating content
- **Contradicting workers**: Launch a fact-check worker-explorer targeting the specific contradiction; present both findings with evidence quality; mark as UNRESOLVED if neither can be definitively verified

## Related Skills

`swarm-coordination`, `beads-workflow`

## Handoff

- To `/swarm-execute`: when research produces actionable implementation tasks
- To `/swarm-plan`: when research reveals scope or architecture decisions needed
- To `/swarm-review`: when research findings inform a code review
- From `/swarm-plan`: when planning identifies knowledge gaps requiring investigation

$ARGUMENTS
````

## File: .claude/commands/swarm-review.md
````markdown
---
description: Adversarial multi-perspective review of code changes on a branch
argument-hint: [branch-name-or-pr-number]
---

# Adversarial Reviewer

Multi-perspective code review with root cause analysis and security focus.

## MCP Tools

**Sequential Thinking** (analysis):
- Root cause investigation
- Trade-off evaluation
- Risk assessment

## CLI Tools

**gh** (GitHub CLI):
- Use `gh pr diff` to fetch PR diffs
- Use `gh pr view --json commits` for commit history
- Use `gh pr review` to approve or request changes
- Use `gh pr comment` for inline feedback

## Review Workflow

1. **Gather** — Get diff and commit history for the branch
2. **Analyze** — Launch parallel review workers for each perspective
3. **Interrogate** — Apply adversarial questioning
4. **Root Cause** — Investigate systemic issues with Five Whys
5. **Verdict** — Approve or request changes with clear feedback

## Parallel Review Perspectives

Launch worker-reviewer agents for each perspective:
- Security review — See `security.md` for OWASP Top 10 and severity classification
- Performance review — See `code-quality.md` for performance checklist (N+1 queries, blocking I/O, memory allocations, pagination, algorithms, caching)
- Architecture review — See `code-quality.md` for SOLID principles
- Test coverage review
- Code quality review

## Adversarial Questions

**Challenge Assumptions**
- "What if this assumption is wrong?"
- "Under what conditions would this fail?"
- "What edge cases weren't considered?"

**Question Design**
- "Why this approach over alternatives?"
- "What are the hidden costs?"
- "How does this scale?"

**Probe Weaknesses**
- "What happens when [X] fails?"
- "How does this behave under load?"
- "What if the input is malicious?"

## Root Cause Analysis (Five Whys)

Apply until reaching systemic cause (may be 3-7 whys):

```markdown
**Issue**: [Describe the problem]

**Why 1**: [First-level cause]
**Why 2**: [Deeper cause]
**Why 3**: [Even deeper]
**Why 4**: [Getting to root]
**Why 5**: [Root cause — systemic/organizational]

**Systemic Fix**: [What prevents recurrence]
```

## Verdict Framework

**Approve** when:
- All Critical/High issues resolved
- Change improves codebase health
- Tests pass and coverage adequate
- Matches project conventions

**Request Changes** when:
- Security vulnerabilities present
- Breaking changes without migration
- Tests missing for new logic
- Architectural violations

## Output Format

```markdown
## Code Review: [Branch/PR]

### Summary
**Verdict**: ✅ Approved | ⚠️ Needs Work | ❌ Request Changes

### Positive Observations
- [What was done well]

### Critical Issues (Must Fix)
- [ ] [File:Line] [Issue] - [Remediation]

### High Priority
- [ ] [File:Line] [Issue] - [Remediation]

### Medium Priority
- [ ] [File:Line] [Issue] - [Suggestion]

### Root Cause Analysis
[If systemic issues found]
```

## Constraints

- NO approving with unresolved Critical/High issues
- NO nitpicking style when using Biome/Prettier
- NO blocking on personal preference
- NEVER recommend removing a symbol without verifying all references via Grep first
- ALWAYS reference specific files and lines
- ALWAYS explain reasoning behind concerns
- ALWAYS suggest alternatives, not just problems

## Related Skills

`testing`, `refactoring-code`, `application-security`, `swarm-coordination`

## Handoff

- To `/swarm-execute`: With specific remediation tasks
- To `/architect`: For architectural concerns requiring ADR
- To `/security-auditor`: For deep security analysis

$ARGUMENTS
````

## File: .claude/commands/ui-ux-designer.md
````markdown
---
description: Interface design, visual assets, and accessibility
argument-hint: [component-or-flow]
---

# UI/UX Designer

Interface design, visual consistency, and accessibility.

## MCP Tools

**Chrome DevTools** (design validation):
- Test responsive layouts across breakpoints
- Run Lighthouse accessibility audits
- Capture screenshots at multiple viewport sizes
- Inspect computed styles and layout
- Verify color contrast ratios
- Test keyboard navigation

## Design Workflow

1. **Design** — Create specifications and wireframes
2. **Validate responsive** — Use DevTools to test breakpoints
3. **Check accessibility** — Run Lighthouse WCAG audits
4. **Verify contrast** — Use DevTools color picker
5. **Test interactions** — Automate keyboard/mouse flows
6. **Document** — Capture screenshots for spec

## Focus
- Design user interfaces and flows
- Create component specifications
- Ensure accessibility (WCAG 2.1 AA)
- Maintain design system consistency

## Deliverables
- Wireframes and mockups
- Component specifications
- Interaction patterns
- Accessibility requirements
- **Screenshots** at mobile/tablet/desktop breakpoints
- **Lighthouse report** for accessibility score

Working notes go to `scratchpad/`, final documents go to `artifacts/`.

## Constraints
- NO inaccessible designs — verify with Lighthouse
- NO inconsistent with design system
- NO lorem ipsum in final designs
- ALWAYS mobile-first
- ALWAYS test at 320px, 768px, 1024px, 1440px breakpoints
- ALWAYS verify color contrast via DevTools
- ALWAYS save to `./artifacts/design_spec_[component].md`

## Related Skills
`interface-design`, `accessibility`, `design-systems`

## Handoff
- To `/swarm-execute`: After design approval
- To `/swarm-review`: For accessibility testing

$ARGUMENTS
````

## File: .claude/rules/agent-constraints.md
````markdown
# Agent Constraints

Rules that apply to all agent workflows.

## Anti-Patterns

- NO loading full context into workers
- NO sharing state between workers (use Beads)
- NO workers spawning workers (single-level only)
- NO long-running workers (timeout at 5 min)
- NO opus for simple tasks (cost optimization)
- NO skipping git push (work is NOT complete until pushed)
````

## File: .claude/rules/code-quality.md
````markdown
# Code Quality Standards

Deep-dive reference for SOLID principles and type safety. See Core Principles in CLAUDE.md for the essentials.

## SOLID Principles

1. **Single Responsibility**: Each module/class should have one reason to change
2. **Open/Closed**: Open for extension, closed for modification
3. **Liskov Substitution**: Subtypes must be substitutable for base types
4. **Interface Segregation**: Prefer small, specific interfaces over large general ones
5. **Dependency Inversion**: Depend on abstractions, not concretions

## DRY (Don't Repeat Yourself)

- **Knowledge duplication** (must fix): Same business logic in multiple places
- **Incidental duplication** (evaluate carefully): Similar code that may evolve differently
- Maintain a single source of truth for business logic

## Type Safety

- Use strict typing where available
- Avoid `any` types in TypeScript (if applicable)
- Use type narrowing and discriminated unions
- Leverage compile-time type checking

## Performance Checklist

- N+1 query patterns (loops with DB calls)
- Blocking I/O in async paths (readFileSync, execSync)
- Excessive memory allocations
- Missing pagination
- Inefficient algorithms (O(n²) when O(n) possible)
- Cache opportunities missed

## Quality Gates

All of these must pass before committing:

- Tests pass
- Linter passes
- Type checker passes (if applicable)
- Build succeeds
- Security audit passes

## Refactoring Discipline

**Two Hats Rule**: Never mix refactoring and optimization in the same session.

- **Hat 1: Refactoring** - Change structure, NOT behavior. Tests must pass unchanged.
- **Hat 2: Optimization** - Improve performance, NOT behavior. Benchmarks required.

When switching hats, commit first, then switch context.

## Naming Conventions (suggested defaults)

Suggested defaults — customize per project.

- **Files**: camelCase (e.g., `userService.ts`, `authMiddleware.py`)
- **Components**: PascalCase (e.g., `UserProfile.tsx`, `LoginForm.vue`)
- **Directories**: kebab-case for multi-word (e.g., `api-utils/`, `auth-handlers/`)
- **Constants**: UPPER_SNAKE_CASE
- **Variables/functions**: camelCase (JS/TS), snake_case (Python/Go/Rust)

## Structured Logging

- Use a structured logger instead of raw console/print calls
- Include correlation IDs for request tracing
- Log levels: ERROR (failures), WARN (degraded), INFO (key events), DEBUG (troubleshooting)
- Never log secrets, tokens, or PII

## Automated Quality Suite

Generic categories — configure with the tools appropriate for your stack.

| Phase | Checks |
|-------|--------|
| Pre-commit | Lint + format + type check + secret scan |
| CI pipeline | Lint + secret scan + vulnerability scan + tests |
| Continuous | Dependency updates + security advisories |
````

## File: .claude/rules/core-directives.md
````markdown
# Core Directives

Operational rules that support the Core Principles in CLAUDE.md.

## Purpose

These directives translate the Core Principles into concrete, day-to-day operating rules. When in doubt, return to the Core Principles. When the Core Principles are clear, these directives specify how to act on them.

## Constraints

- Always branch from `main` — never commit directly to the main branch
- Verify artifacts exist before proceeding to the next phase in the planning flow
- Consult `tech-strategy.md` for all technology choices — do not deviate without explicit instruction

## Seven Rules

### 1. Tech Strategy Is Authoritative

Follow the golden paths defined in `.claude/rules/tech-strategy.md` for every technology choice — language, runtime, framework, database, infrastructure, and tooling. Do not suggest alternatives unless explicitly instructed. Use the latest stable version unless a version is pinned.

### 2. Check Skills First

Before generating an ad-hoc solution, search `.claude/skills/` for an existing workflow or pattern. Use established patterns before inventing new ones. Skills encode accumulated best practices and save time for both agents and reviewers.

### 3. Write Tests

Every feature gets tests. Every bug fix gets a regression test. Tests must be deterministic and isolated. Run all quality gates — tests, linter, type checker, build — before committing. Do not skip or remove existing tests.

### 4. Durable Artifacts Go in `./artifacts/`

Plans, ADRs, PRDs, design specs, security audits, and post-mortems belong in `./artifacts/`. Follow the naming conventions defined in CLAUDE.md. Artifacts are the permanent record of decisions and must be checked in.

### 5. Ephemeral Notes Go in `./scratchpad/`

Working notes, exploration output, draft content, and in-progress thinking belong in `./scratchpad/`. This directory is for disposable content that supports the current session. Do not treat scratchpad files as authoritative artifacts.

### 6. Follow the Planning Flow

Use the prescribed planning sequence: PR-FAQ → PRD → ADR → Design Spec → Plan → Implementation. Do not skip phases. Each phase produces an artifact that gates the next. Skipping phases creates unvalidated assumptions that surface as bugs or rework.

### 7. Follow Command Protocols

Respect the handoff requirements between commands. Every handoff must include an artifact reference. Follow the protocols defined in the command definitions. Never hand off work without a concrete artifact that the receiving command can verify.

## Decision Hierarchy

When rules conflict, resolve using this order of precedence:

```
Security > Tech Strategy > Core Directives > Skill Conventions > Local Judgment
```

- **Security**: No tradeoff overrides a security requirement
- **Tech Strategy**: Golden paths override convenience preferences
- **Core Directives**: These rules override skill-level conventions
- **Skill Conventions**: Patterns in `.claude/skills/` override ad-hoc choices
- **Local Judgment**: Use judgment only when no higher rule applies

## Output Standards

### Commits

Write atomic, descriptive commit messages. Each commit should represent one complete, working change. Do not bundle unrelated changes. Do not commit broken states.

### Artifacts

Store all durable planning output in `./artifacts/` using the naming conventions from CLAUDE.md. Every architectural decision, requirement, and plan must have a corresponding artifact before implementation begins.

### Scratchpad

Store all ephemeral working content in `./scratchpad/`. This includes exploration notes, draft outlines, and intermediate analysis. Do not reference scratchpad files in handoffs or final deliverables.

### Handoffs

Every handoff between commands or agents must include explicit artifact references — file path and a one-line description of what the artifact contains. The receiving agent must be able to verify the artifact exists before proceeding.
````

## File: .claude/rules/security.md
````markdown
# Security Standards

Deep-dive reference for security reviews. See Core Principle 3 ("Keep It Safe") in CLAUDE.md for the essentials.

## Security Checklist

- [ ] No hardcoded secrets or credentials (enforce via pre-commit secret scanner + CI)
- [ ] All user input is validated and sanitized (enforce via input validation middleware)
- [ ] SQL queries use parameterized statements
- [ ] Authentication and authorization are properly implemented
- [ ] Sensitive data is encrypted at rest and in transit
- [ ] Error messages don't expose internal details
- [ ] Dependencies are up to date and vulnerability-free (enforce via automated dependency scanning)

## Data Routing

**No Silent External Data Routing**: Data must not leave the system boundary without explicit authorization and documentation.

- All external API calls, webhooks, and data exports must be explicitly documented in the architecture and code
- No data should leave the system boundary without clear authorization from an appropriate owner
- Log all outbound data transfers for audit purposes
- This applies to third-party integrations, analytics pipelines, and monitoring agents — any component that transmits data externally must be inventoried and reviewed

## OWASP Top 10 2021

| Category | Check For |
|----------|-----------|
| Broken Access Control | Missing authorization checks |
| Cryptographic Failures | Unencrypted sensitive data |
| Injection | SQL, Command, XSS vulnerabilities |
| Insecure Design | Missing threat modeling |
| Security Misconfiguration | Default credentials, debug enabled |
| Vulnerable Components | Outdated/CVE-affected packages |
| Auth Failures | Weak passwords, session issues |
| Integrity Failures | Unsigned updates, untrusted deserialization |
| Logging Failures | Missing audit trails |
| SSRF | Unvalidated URLs in server requests |

## Severity Classification

| Severity | Definition | Action |
|----------|------------|--------|
| Critical | Exploitable vulnerability, data loss risk, high impact | MUST fix before merge |
| High | Exploitable vulnerability, breaking change, moderate impact, major bug | MUST fix before merge |
| Medium | Requires conditions to exploit, performance issue, code smell | SHOULD fix, can negotiate |
| Low | Best practice violation, style, minor improvement | COULD fix, optional |

## CWE References

When reporting findings, reference CWE (Common Weakness Enumeration) IDs for standardized vulnerability classification. Example: `CWE-89` for SQL Injection, `CWE-798` for hardcoded credentials.

## Dependency Safety

- Warn about deprecated or vulnerable dependencies
- Audit new dependencies before adding
- Keep dependencies updated
- Use automated scanning (Trivy, Snyk, Dependabot)

## Output Guidelines

- Never expose actual secrets in analysis output
- Provide specific file locations and line numbers
- Include concrete remediation steps
- Check both code AND configuration files
````

## File: .claude/rules/tech-strategy.md
````markdown
# Tech Strategy - Golden Paths (Customize for Your Project)

This is the **SINGLE SOURCE OF TRUTH** for technology choices.

## Customization Required

**IMPORTANT**: This file contains example technology choices. Customize it for your project.

Replace the Golden Paths below with your actual tech stack. The framework enforces whatever you put here.

## Compliance

1. **Follow This File**: Use the technologies listed in the Golden Paths below
2. **No Deviations**: Do not suggest alternatives unless explicitly instructed
3. **Latest Stable**: Always use the latest stable version unless pinned

## Language Golden Paths

### TypeScript / JavaScript (Web Standard)

| Component | Choice |
|-----------|--------|
| Runtime | Node.js LTS (Prod), Bun (Local Scripts) |
| Build | Vite |
| Hygiene | Biome |
| Testing | Vitest |
| Frameworks | React 19, Nuxt 4, Next.js |
| Package Manager | pnpm |

### Python (AI & Data Standard)

| Component | Choice |
|-----------|--------|
| Runtime | Python 3.13+ |
| Server | Granian |
| Framework | Litestar |
| Tooling | uv (Manager), Ruff (Linter) |
| Validation | msgspec |
| Database | asyncpg |

### Go (Systems Standard)

| Component | Choice |
|-----------|--------|
| Runtime | Go 1.25+ (PGO) |
| Framework | Gin or Chi |
| Data | sqlc + pgx v5 |
| Linting | golangci-lint |
| Images | Wolfi base |

### Rust (Performance Standard)

| Component | Choice |
|-----------|--------|
| Edition | Rust 2024 |
| Async | Tokio (general), Monoio (high-throughput) |
| Framework | Axum |
| Data | sqlx, rkyv |
| Linker | Mold (dev) |

### Swift (iOS Standard)

| Component | Choice |
|-----------|--------|
| Runtime | Swift 5.10+ / Xcode 16+ |
| UI Framework | SwiftUI (primary), UIKit (legacy) |
| Testing | Swift Testing + XCTest |
| Linting | SwiftLint |
| Formatting | SwiftFormat |
| CI/CD | fastlane |
| Package Manager | Swift Package Manager |
| Architecture | MVVM + Combine |

### Kotlin (Android Standard)

| Component | Choice |
|-----------|--------|
| Runtime | Kotlin 2.0+ / JDK 17 |
| UI Framework | Jetpack Compose |
| Testing | JUnit 5 + Compose Testing |
| Linting | Detekt + ktlint |
| Build | Gradle (Kotlin DSL) |
| CI/CD | GitHub Actions + Gradle |
| Architecture | MVVM + ViewModel + StateFlow |

## Infrastructure

| Component | Choice |
|-----------|--------|
| Static/Frontend | GitHub Pages |
| Agile/PoC | Railway (PaaS) |
| Production | AWS (ECS/Fargate/Lambda) |
| Mobile Distribution | TestFlight (iOS), Google Play (Android) |
| IaC | Terraform |
| Edge/CDN | Cloudflare |
| Secrets | GitHub Secrets / AWS Secrets Manager |

## Data

| Component | Choice |
|-----------|--------|
| Relational (OLTP) | PostgreSQL |
| Object Storage | AWS S3 |
| Vector & AI | pgvector |

## Observability

| Component | Choice |
|-----------|--------|
| Standard | OpenTelemetry (OTel) |
| Protocol | OTLP (gRPC/HTTP) |
| Collector | OTel Collector |
| Dashboard | Aspire (Local), Grafana/Prometheus (Prod) |

## CI/CD

| Component | Choice |
|-----------|--------|
| Platform | GitHub Actions |
| Auth | OIDC |
| Security | Trivy |

## Graduated Hosting Strategy

1. **Static Tier** (Frontend): GitHub Pages - maximum performance, zero maintenance
2. **Agile Tier** (PoC/MVP): Railway - maximum velocity, zero infrastructure code
3. **Production Tier** (Scale): AWS - maximum control, infinite scale
````

## File: .claude/skills/architecture/capacity-planning/SKILL.md
````markdown
---
name: capacity-planning
description: Plan infrastructure capacity for expected load. Use when sizing systems, planning for growth, or analyzing resource requirements. Covers load estimation and resource sizing.
---

# Capacity Planning

## Workflows

- [ ] **Baseline**: Measure current resource usage
- [ ] **Forecast**: Project future growth
- [ ] **Size**: Calculate required resources
- [ ] **Buffer**: Add headroom for spikes
- [ ] **Monitor**: Track actual vs. predicted

## Key Metrics

### Compute
- CPU utilization (target: 60-70%)
- Memory usage
- Request latency (P50, P95, P99)

### Storage
- Disk IOPS
- Throughput (MB/s)
- Capacity growth rate

### Network
- Bandwidth utilization
- Connection counts
- Packet loss

## Estimation Framework

### Little's Law
```
L = λ × W

L = Average number of items in system
λ = Average arrival rate
W = Average time in system
```

### Example Calculation
```
Given:
- 1000 requests/second
- 100ms average response time

Required concurrent connections:
L = 1000 × 0.1 = 100 concurrent connections
```

## Resource Sizing

### Database Connections
```
connections = (requests_per_second × avg_query_time) × 1.5
```

### Memory
```
memory = (concurrent_users × memory_per_user) + base_overhead
```

### CPU Cores
```
cores = (peak_rps × cpu_time_per_request) / target_utilization
```

## Growth Planning

### Traffic Growth
- Historical growth rate
- Planned marketing/launches
- Seasonal patterns

### Data Growth
- Records per day
- Record size
- Retention policy

## Capacity Planning Document

1. Current state metrics
2. Growth assumptions
3. Resource projections (3, 6, 12 months)
4. Cost estimates
5. Scaling triggers and thresholds
````

## File: .claude/skills/architecture/cloud-native-patterns/SKILL.md
````markdown
---
name: cloud-native-patterns
description: Apply cloud-native architecture patterns. Use when designing for scalability, resilience, or cloud deployment. Covers microservices, containers, and distributed systems.
---

# Cloud-Native Patterns

## Twelve-Factor App

1. **Codebase**: One codebase, many deploys
2. **Dependencies**: Explicitly declare and isolate
3. **Config**: Store in environment
4. **Backing Services**: Treat as attached resources
5. **Build, Release, Run**: Strictly separate stages
6. **Processes**: Execute as stateless processes
7. **Port Binding**: Export services via port
8. **Concurrency**: Scale out via process model
9. **Disposability**: Fast startup and graceful shutdown
10. **Dev/Prod Parity**: Keep environments similar
11. **Logs**: Treat as event streams
12. **Admin Processes**: Run as one-off processes

## Resilience Patterns

### Circuit Breaker
Prevent cascading failures by failing fast.

```typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailure?: Date;

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.isOpen()) {
      throw new Error('Circuit is open');
    }
    try {
      const result = await fn();
      this.reset();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }
}
```

### Retry with Backoff
```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000); // Exponential backoff
    }
  }
}
```

### Bulkhead
Isolate failures to prevent system-wide impact.

## Service Communication

### Synchronous
- REST/HTTP
- gRPC

### Asynchronous
- Message queues (RabbitMQ, SQS)
- Event streaming (Kafka)

## Health Checks

```typescript
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.get('/ready', async (req, res) => {
  const dbHealthy = await checkDatabase();
  const cacheHealthy = await checkCache();

  if (dbHealthy && cacheHealthy) {
    res.json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not ready' });
  }
});
```

## Container Best Practices

- One process per container
- Use multi-stage builds
- Run as non-root user
- Use health checks
- Keep images small
````

## File: .claude/skills/architecture/defense-in-depth/SKILL.md
````markdown
---
name: defense-in-depth
description: Apply layered security architecture. Use when designing security controls, hardening systems, or reviewing security posture. Covers multiple security layers.
---

# Defense in Depth

## Security Layers

```
┌─────────────────────────────────┐
│         Perimeter Security       │  WAF, DDoS Protection
├─────────────────────────────────┤
│         Network Security         │  Firewalls, VPNs, Segmentation
├─────────────────────────────────┤
│         Host Security            │  OS Hardening, Patching
├─────────────────────────────────┤
│         Application Security     │  AuthN, AuthZ, Input Validation
├─────────────────────────────────┤
│         Data Security            │  Encryption, Access Control
└─────────────────────────────────┘
```

## Layer Controls

### 1. Perimeter
- Web Application Firewall (WAF)
- DDoS protection
- Rate limiting
- Bot detection

### 2. Network
- Network segmentation (VPCs, subnets)
- Security groups / firewalls
- VPN for internal access
- Zero-trust network access

### 3. Host
- OS hardening
- Patch management
- Endpoint protection
- File integrity monitoring

### 4. Application
- Authentication (OAuth2, OIDC)
- Authorization (RBAC, ABAC)
- Input validation
- Output encoding
- Session management
- Secure headers

### 5. Data
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Key management
- Data masking
- Access logging

## Security Checklist

- [ ] WAF configured with OWASP rules
- [ ] Network segmentation in place
- [ ] All traffic encrypted (TLS)
- [ ] Authentication on all endpoints
- [ ] Least privilege access controls
- [ ] Secrets managed securely
- [ ] Audit logging enabled
- [ ] Backups encrypted and tested

## Principle of Least Privilege

Grant only the minimum permissions needed:
- Use IAM roles, not long-lived credentials
- Scope permissions to specific resources
- Regular access reviews
- Just-in-time access for sensitive operations
````

## File: .claude/skills/architecture/designing-apis/SKILL.md
````markdown
---
name: designing-apis
description: Design clean, consistent APIs. Use when creating new endpoints, defining contracts, or improving API ergonomics. Covers REST, versioning, and error handling.
---

# Designing APIs

## Workflows

- [ ] **Resources**: Identify resources and relationships
- [ ] **Endpoints**: Define URL structure and methods
- [ ] **Request/Response**: Define payloads and schemas
- [ ] **Errors**: Define error responses
- [ ] **Document**: Create OpenAPI spec

## REST Principles

### Resource Naming
- Use nouns, not verbs: `/users` not `/getUsers`
- Use plural: `/users` not `/user`
- Use kebab-case: `/user-profiles` not `/userProfiles`
- Nest for relationships: `/users/{id}/orders`

### HTTP Methods
| Method | Purpose | Idempotent |
|--------|---------|------------|
| GET | Read | Yes |
| POST | Create | No |
| PUT | Replace | Yes |
| PATCH | Update | Yes |
| DELETE | Remove | Yes |

### Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 500 | Internal Server Error |

## Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

## Versioning

### URL Versioning (Recommended)
```
GET /api/v1/users
GET /api/v2/users
```

### Header Versioning
```
GET /api/users
Accept: application/vnd.api+json;version=1
```

## Pagination

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

## OpenAPI Example

```yaml
openapi: 3.0.0
info:
  title: Users API
  version: 1.0.0
paths:
  /users:
    get:
      summary: List users
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
```
````

## File: .claude/skills/architecture/designing-systems/resources/adr.template.md
````markdown
# ADR: [Decision Title]

## Status

[Proposed | Accepted | Rejected | Deprecated | Superseded]

## Context

[What is the issue we're addressing? What forces are at play?]

## Decision

[What is the change we're proposing or have agreed to implement?]

## Rationale

[Why is this the best choice among the alternatives?]

## Alternatives Considered

### Alternative 1: [Name]
- **Pros**: ...
- **Cons**: ...
- **Why Not**: ...

### Alternative 2: [Name]
- **Pros**: ...
- **Cons**: ...
- **Why Not**: ...

## Consequences

### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Trade-off 1]
- [Trade-off 2]

### Risks
- [Risk 1]: [Mitigation]

## References

- [Link to related documents]
- [Link to external resources]
````

## File: .claude/skills/architecture/designing-systems/resources/system-design.template.md
````markdown
# System Design: [System Name]

## Meta

| Field | Value |
|-------|-------|
| Status | Draft / In Review / Approved |
| Owner | [Name] |
| Reviewers | [Names] |
| Related PRD | `./artifacts/prd_[feature].md` |

## Executive Summary

[2-3 sentences describing what this system does and why it's needed]

## Architecture Overview

```mermaid
graph TB
    Client[Client App] --> API[API Gateway]
    API --> Auth[Auth Service]
    API --> Core[Core Service]
    Core --> DB[(Database)]
    Core --> Cache[(Redis)]
```

## Key Decisions & Trade-offs

| Decision | Choice | Alternatives | Rationale |
|----------|--------|--------------|-----------|
| Database | PostgreSQL | MongoDB, DynamoDB | Relational data, ACID requirements |
| Cache | Redis | Memcached | Rich data types, pub/sub |
| API | REST | GraphQL | Simpler clients, caching |

## Components

### [Component 1]
- **Responsibility**: [What it does]
- **Technology**: [Stack]
- **Scaling**: [How it scales]

### [Component 2]
...

## API Design

### Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/resources | List resources |
| POST | /api/v1/resources | Create resource |

## Data Model

```sql
CREATE TABLE resources (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Non-Functional Requirements

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| Availability | 99.9% | Monthly uptime |
| Latency (P95) | <200ms | API response time |
| Throughput | 1000 RPS | Peak load |

## Implementation Plan

1. [ ] Phase 1: Core service MVP
2. [ ] Phase 2: Authentication integration
3. [ ] Phase 3: Caching layer
4. [ ] Phase 4: Monitoring and alerting

## Open Questions

- [ ] [Question 1]
- [ ] [Question 2]
````

## File: .claude/skills/architecture/designing-systems/SKILL.md
````markdown
---
name: designing-systems
description: Design scalable, reliable software systems. Use when planning new systems, major features, or architecture changes. Covers C4 diagrams, trade-off analysis, and system decomposition.
---

# Designing Systems

## Workflows

- [ ] **Requirements**: Gather functional and non-functional requirements
- [ ] **Diagrams**: Create C4 diagrams (Context, Container)
- [ ] **Data**: Define data model and storage strategy
- [ ] **API**: Define interfaces and contracts
- [ ] **Risks**: Identify single points of failure
- [ ] **Document**: Save to `./artifacts/adr_[topic].md`

## Feedback Loops

1. Draft design document
2. Review with stakeholders
3. Create POC for risky components
4. Refine design based on POC
5. Finalize ADR

## Blueprint Template

Every system design should include:

1. **High-Level Diagram**: Mermaid graph showing components
2. **Component Boundaries**: Clear responsibility definitions
3. **API Definitions**: OpenAPI or GraphQL specs
4. **Data Models**: Schema definitions
5. **Trade-off Analysis**: Rationale for key decisions

## C4 Model Levels

### Level 1: Context
Who uses the system? What external systems does it interact with?

### Level 2: Container
What are the major deployable units? (APIs, databases, queues)

### Level 3: Component
What are the major building blocks within each container?

### Level 4: Code
Class/function level (usually not needed in architecture docs)

## Trade-off Analysis

For major decisions, explicitly document:

| Decision | Option A | Option B |
|----------|----------|----------|
| Pros | ... | ... |
| Cons | ... | ... |
| When to Choose | ... | ... |

## Non-Functional Requirements

Always consider:
- **Scalability**: Expected load, growth rate
- **Availability**: SLA targets, failure modes
- **Latency**: P50, P95, P99 requirements
- **Security**: Authentication, authorization, data protection
- **Cost**: Infrastructure, operational overhead

## Resources

- [System Design Template](./resources/system-design.template.md)
- [ADR Template](./resources/adr.template.md)
````

## File: .claude/skills/architecture/domain-driven-design/SKILL.md
````markdown
---
name: domain-driven-design
description: Apply Domain-Driven Design patterns. Use when modeling complex business domains, defining bounded contexts, or designing aggregates. Covers entities, value objects, and repositories.
---

# Domain-Driven Design

## Core Concepts

### Ubiquitous Language
Use the same terminology as domain experts. Code should read like business documentation.

### Bounded Context
A boundary within which a particular domain model is defined and applicable.

### Context Map
Shows how bounded contexts relate to each other.

## Building Blocks

### Entity
Has identity that persists over time. Equality based on ID.

```typescript
class User {
  constructor(
    public readonly id: UserId,
    public email: Email,
    public name: string
  ) {}
}
```

### Value Object
Immutable, equality based on attributes.

```typescript
class Email {
  private constructor(public readonly value: string) {}

  static create(value: string): Email {
    if (!value.includes('@')) {
      throw new Error('Invalid email');
    }
    return new Email(value);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
```

### Aggregate
Cluster of entities and value objects with a root entity.

```typescript
class Order { // Aggregate Root
  private items: OrderItem[] = [];

  addItem(product: ProductId, quantity: number): void {
    // Business rules enforced here
    this.items.push(new OrderItem(product, quantity));
  }

  get total(): Money {
    return this.items.reduce((sum, item) => sum.add(item.subtotal), Money.zero());
  }
}
```

### Repository
Abstracts data access for aggregates.

```typescript
interface OrderRepository {
  findById(id: OrderId): Promise<Order | null>;
  save(order: Order): Promise<void>;
}
```

### Domain Event
Something that happened in the domain.

```typescript
class OrderPlaced {
  constructor(
    public readonly orderId: OrderId,
    public readonly userId: UserId,
    public readonly occurredAt: Date
  ) {}
}
```

## Strategic Patterns

### Anti-Corruption Layer
Translate between your model and external systems.

### Shared Kernel
Shared subset of domain model between contexts.

### Customer-Supplier
Upstream provides what downstream needs.
````

## File: .claude/skills/architecture/writing-adrs/SKILL.md
````markdown
---
name: writing-adrs
description: Document architectural decisions. Use when making significant technical decisions that should be recorded. Covers ADR format and decision documentation.
---

# Writing Architecture Decision Records

## What is an ADR?

An Architecture Decision Record captures an important architectural decision along with its context and consequences.

## When to Write an ADR

- Choosing a framework or library
- Selecting a database or storage solution
- Defining API patterns
- Establishing coding conventions
- Making infrastructure decisions
- Any decision that affects multiple components

## ADR Structure

### Title
Short phrase describing the decision.

### Status
- **Proposed**: Under discussion
- **Accepted**: Decision made
- **Rejected**: Considered but not adopted
- **Deprecated**: No longer valid
- **Superseded**: Replaced by another ADR

### Context
What is the situation? What forces are at play?

### Decision
What is the change we're making?

### Rationale
Why is this the best choice?

### Consequences
What are the trade-offs? Both positive and negative.

## Example ADR

```markdown
# ADR: Use PostgreSQL for Primary Database

## Status
Accepted

## Context
We need a database for our new service. Requirements:
- ACID transactions
- JSON support
- Strong ecosystem
- Team familiarity

## Decision
We will use PostgreSQL 15+ as our primary database.

## Rationale
- Mature, reliable RDBMS
- Excellent JSON support with JSONB
- Strong extension ecosystem (pgvector, PostGIS)
- Team has deep PostgreSQL experience
- Well-supported by all cloud providers

## Consequences
### Positive
- Reliable, battle-tested technology
- Rich feature set
- Easy to find developers

### Negative
- Vertical scaling has limits
- Requires careful connection management
- More operational overhead than managed NoSQL
```

## Best Practices

1. **Keep them short**: 1-2 pages max
2. **Write when deciding**: Not after the fact
3. **Include alternatives**: Show what was considered
4. **Update status**: Mark deprecated/superseded ADRs
5. **Number sequentially**: `ADR-001`, `ADR-002`, etc.
````

## File: .claude/skills/core-engineering/data-management/SKILL.md
````markdown
---
name: data-management
description: Design and manage data storage effectively. Use when working with databases, schemas, or data migrations. Covers schema design, migrations, and data integrity.
---

# Data Management

## Workflows

- [ ] **Schema Design**: Define tables, relationships, constraints
- [ ] **Migrations**: Version control schema changes
- [ ] **Indexing**: Add indexes for query performance
- [ ] **Backup**: Ensure data recovery capability

## Schema Design Principles

### Normalization
- **1NF**: Atomic values, no repeating groups
- **2NF**: No partial dependencies
- **3NF**: No transitive dependencies

### When to Denormalize
- Read-heavy workloads
- Reporting/analytics
- Caching layers

## Migration Best Practices

### Forward-Only Migrations
Each migration should be a single forward step.

```sql
-- migrations/001_create_users.sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### Safe Migrations
- Add columns as nullable first
- Create indexes concurrently
- Never drop columns in the same deploy

## Indexing Strategy

```sql
-- B-tree (default): Equality and range queries
CREATE INDEX idx_users_email ON users(email);

-- Partial index: When you query a subset
CREATE INDEX idx_active_users ON users(id) WHERE active = true;

-- Composite index: Multiple columns
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);
```

## Connection Management

```typescript
// Use connection pooling
const pool = new Pool({
  max: 20,                    // Max connections
  idleTimeoutMillis: 30000,   // Close idle connections
  connectionTimeoutMillis: 2000
});
```

## Data Integrity

- Use foreign key constraints
- Add NOT NULL where appropriate
- Use CHECK constraints for validation
- Consider using ENUM types for fixed values
````

## File: .claude/skills/core-engineering/data-to-ui/SKILL.md
````markdown
---
name: data-to-ui
description: Data-to-UI pipeline patterns. Use when transforming JSON data into React components, creating TypeScript types from schemas, building derived types, or creating data utilities.
---

# Data to UI

## Overview
Patterns for transforming static data into type-safe React components. This skill covers JSON → TypeScript → React pipelines with emphasis on semantic color systems, derived types, and formatting utilities.

## Workflows

### 1. JSON Schema → TypeScript Types
- [ ] Read JSON schema/data structure
- [ ] Create base TypeScript interfaces matching JSON shape
- [ ] Export union types for enums (e.g., `type Severity = 'safety_hazard' | 'repair_needed'`)
- [ ] Use optional properties (`?`) for nullable/missing fields
- [ ] Add JSDoc comments for complex types

### 2. Derived Types for UI
- [ ] Create composed types extending base types with `extends`
- [ ] Use `Pick<T, K>` and `Omit<T, K>` for component props
- [ ] Build intersection types with `&` for joined data (e.g., `FindingWithAsset`)
- [ ] Create aggregate interfaces for statistics/summaries

### 3. Color Mapping Systems
- [ ] Define `Record<EnumType, ColorValue>` for semantic colors
- [ ] Provide multiple color formats: badge, bg, text, border, dot
- [ ] Use Tailwind utility classes (e.g., `'bg-red-500 text-red-600'`)
- [ ] Export accessor functions (e.g., `getSeverityColors()`)
- [ ] Document color choices with comments

### 4. Icon Mapping
- [ ] Create `Record<EnumType, string>` mapping to lucide-react icon names
- [ ] Use PascalCase icon names (e.g., `'AlertTriangle'`, `'Thermometer'`)
- [ ] Export accessor function (e.g., `getSeverityIcon()`)

### 5. Formatting Utilities
- [ ] Currency: Use `Intl.NumberFormat` with USD, no decimals
- [ ] Dates: Use `toLocaleDateString` with short month format
- [ ] Calculations: Create helpers for years, percentages, lifespans
- [ ] Labels: Create human-readable label maps

### 6. Aggregation & Grouping
- [ ] Implement `groupBy` patterns using reduce or forEach
- [ ] Sort with custom comparators using severity/priority order
- [ ] Calculate summary statistics (min, max, avg, count)
- [ ] Return strongly-typed aggregates

## Reference Implementation

### Color Mapping System
```typescript
// Single source of truth for semantic colors
export interface SeverityColors {
  badge: string;  // 'text-red-600 bg-red-100'
  bg: string;     // 'bg-red-500'
  text: string;   // 'text-red-600'
  border: string; // 'border-red-500'
  dot: string;    // 'bg-red-500'
}

const SEVERITY_COLOR_MAP: Record<Severity, SeverityColors> = {
  safety_hazard: {
    badge: 'text-red-600 bg-red-100',
    bg: 'bg-red-500',
    text: 'text-red-600',
    dot: 'bg-red-500',
    border: 'border-red-500',
  },
  // ... other severities
};

export function getSeverityColors(severity: Severity): SeverityColors {
  return SEVERITY_COLOR_MAP[severity];
}
```

### Icon Mapping
```typescript
export function getSeverityIcon(severity: Severity): string {
  const icons: Record<Severity, string> = {
    safety_hazard: 'AlertTriangle',
    repair_needed: 'Wrench',
    maintenance_item: 'Settings',
    monitor: 'Eye',
    informational: 'Info'
  };
  return icons[severity];
}
```

### Derived Types
```typescript
// Base type
export interface Finding {
  id: string;
  assetId?: string | null;
  severity: Severity;
  title: string;
}

// Derived type with relationship
export interface FindingWithAsset extends Finding {
  asset?: Asset;
}

// Aggregate type
export interface PropertyWithDetails {
  property: Property;
  inspectionReport: InspectionReport;
  findings: Finding[];
  assets: Asset[];
}
```

### Formatting Utilities
```typescript
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function yearsSince(dateString: string): number {
  const date = new Date(dateString);
  const now = new Date();
  return Math.floor((now.getTime() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}
```

### Aggregation Patterns
```typescript
// Group by enum value
export function groupFindingsBySeverity(findings: Finding[]): Record<Severity, Finding[]> {
  const grouped: Record<Severity, Finding[]> = {
    safety_hazard: [],
    repair_needed: [],
    maintenance_item: [],
    monitor: [],
    informational: []
  };

  findings.forEach(f => grouped[f.severity].push(f));
  return grouped;
}

// Sort by priority
export function sortFindingsBySeverity(findings: Finding[]): Finding[] {
  const severityOrder: Record<Severity, number> = {
    safety_hazard: 0,
    repair_needed: 1,
    maintenance_item: 2,
    monitor: 3,
    informational: 4
  };
  return [...findings].sort((a, b) =>
    severityOrder[a.severity] - severityOrder[b.severity]
  );
}
```

## Best Practices

- **Single Source of Truth**: All color/icon mappings in one place with accessor functions
- **Multi-Format Colors**: Provide badge, bg, text, border, dot variants for flexibility
- **Type Safety**: Use `Record<EnumType, Value>` instead of plain objects
- **Intl APIs**: Use `Intl.NumberFormat` and `Intl.DateTimeFormat` for localization
- **Immutability**: Use spread operator when sorting/filtering arrays
- **Documentation**: Add JSDoc comments explaining color choices and data structures
- **Colocate Utilities**: Keep types and utilities in same file for easy import

## Anti-Patterns

- **DO NOT** use generic color names without semantic meaning (e.g., `'red'` instead of `'safety_hazard'`)
- **DO NOT** inline color classes in components; always use mapping functions
- **DO NOT** use `any` types; prefer `unknown` and type guards
- **DO NOT** mutate input arrays in sort/filter functions; always create copies
- **DO NOT** hardcode date formats; use `Intl.DateTimeFormat` for consistency
- **DO NOT** create separate files for simple utilities; colocate with types
- **DO NOT** forget to handle null/undefined in optional fields
- **DO NOT** use snake_case or kebab-case for TypeScript file names; use camelCase

## Feedback Loops

1. **Type Checking**: Run `tsc --noEmit` to validate types
2. **Runtime Validation**: Consider Zod for JSON schema validation at runtime
3. **Visual Testing**: Build Storybook stories to verify color systems
4. **Data Consistency**: Compare aggregated stats with source data counts
5. **Import Verification**: Ensure all utilities are exported and importable

## Related Skills

- `interface-design` - Use color systems in React components
- `refactoring-code` - Consolidate duplicate color/formatting logic
````

## File: .claude/skills/core-engineering/debugging/SKILL.md
````markdown
---
name: debugging
description: Troubleshoot and fix bugs systematically. Use when errors occur, tests fail, or unexpected behavior is observed. Covers root cause analysis and debugging strategies.
---

# Debugging and Troubleshooting

## MCP Tools

**Chrome DevTools** (frontend debugging):
- Capture console errors and network failures
- Set breakpoints and inspect state
- Profile performance bottlenecks
- Capture screenshots of error states

## Workflows

- [ ] **Reproduce**: Can you reliably reproduce the issue?
- [ ] **Isolate**: What is the minimal code that exhibits the bug?
- [ ] **Trace**: Use Grep to follow the call chain
- [ ] **Hypothesize**: What could cause this behavior?
- [ ] **Test**: Verify or disprove your hypothesis
- [ ] **Fix**: Implement the solution
- [ ] **Verify**: Confirm the fix and add regression test

## Debugging Strategy

### 1. Gather Information
- Read error messages and stack traces carefully
- Check logs for context around the error
- Identify when the issue started (recent changes?)
- **Use Grep** to locate related code around the error

### 2. Trace the Flow
- Use Grep to trace data flow through function calls
- Map the call chain from entry point to error
- Identify where data transforms unexpectedly

### 3. Reproduce Consistently
- Create a minimal test case
- Document exact steps to reproduce
- For frontend bugs, use Chrome DevTools to record network/console

### 4. Common Causes
- **Null/undefined**: Check for missing null checks
- **Off-by-one**: Verify loop boundaries and array indices
- **Async timing**: Check race conditions and await usage
- **State mutation**: Look for unexpected side effects
- **Type coercion**: Verify type handling (especially in JS/TS)

## Tools (Examples by Language)

```bash
# Check logs
tail -f /var/log/app.log

# Search for error patterns
grep -r "ERROR" ./logs/

# Debug Node.js
node --inspect-brk app.js

# Python debugging
python -m pdb script.py
```

## Frontend Debugging with Chrome DevTools

- Open DevTools → Console for errors
- Network tab for failed requests
- Sources tab for breakpoints
- Performance tab for slow operations

## Post-Fix Checklist

- [ ] Root cause identified and documented
- [ ] Regression test added
- [ ] Similar code checked (use Grep to locate)
- [ ] Fix reviewed by another developer
````

## File: .claude/skills/core-engineering/dependency-management/SKILL.md
````markdown
---
name: dependency-management
description: Manage project dependencies effectively. Use when adding, updating, or auditing dependencies. Covers version management, security scanning, and lockfiles.
---

# Dependency Management

## Workflows

- [ ] **Audit**: Check for known vulnerabilities
- [ ] **Update**: Keep dependencies reasonably current
- [ ] **Lock**: Ensure reproducible builds
- [ ] **Minimize**: Remove unused dependencies

## Security Scanning

```bash
# Node.js
npm audit
pnpm audit

# Python
pip-audit
safety check

# Go
govulncheck ./...

# Rust
cargo audit
```

## Version Management

### Semantic Versioning
- **Major** (1.0.0): Breaking changes
- **Minor** (0.1.0): New features, backward compatible
- **Patch** (0.0.1): Bug fixes, backward compatible

### Version Constraints

```json
// package.json
{
  "dependencies": {
    "exact": "1.2.3",        // Exactly 1.2.3
    "patch": "~1.2.3",       // 1.2.x (patch updates)
    "minor": "^1.2.3",       // 1.x.x (minor updates)
    "range": ">=1.2.3 <2.0.0" // Range
  }
}
```

## Lockfiles

Always commit lockfiles for reproducible builds:
- `package-lock.json` or `pnpm-lock.yaml` (Node.js)
- `poetry.lock` or `uv.lock` (Python)
- `go.sum` (Go)
- `Cargo.lock` (Rust)

## Best Practices

1. **Pin Versions in Production**: Use exact versions or lockfiles
2. **Update Regularly**: Don't let dependencies get too stale
3. **Review Changelogs**: Check breaking changes before major updates
4. **Test After Updates**: Run full test suite after dependency changes
5. **Minimize Dependencies**: Each dependency is a liability

## Removing Unused Dependencies

```bash
# Node.js
npx depcheck

# Python
pip-autoremove

# Go
go mod tidy
```
````

## File: .claude/skills/core-engineering/implementing-code/SKILL.md
````markdown
---
name: implementing-code
description: Write clean, efficient, maintainable code. Use when implementing features, writing functions, or creating new modules. Covers SOLID principles, error handling, and code organization.
---

# Implementing Code

## Workflows

- [ ] **Security Check**: Injection flaws, auth issues, sensitive data exposure
- [ ] **Performance Check**: N+1 queries, memory leaks, inefficient algorithms
- [ ] **Readability Check**: SOLID principles, naming conventions, comments
- [ ] **Testing Check**: Edge cases, error paths, happy paths

## Feedback Loops

1. Implement feature or fix
2. Run local tests (unit/integration)
3. Run linter/formatter
4. If failure, fix and repeat

## Reference Implementation

### SOLID Compliant Class (TypeScript)

```typescript
// Abstraction (Interface Segregation)
interface ILogger {
  log(message: string): void;
}

interface IUserRepository {
  save(user: User): Promise<void>;
}

// Domain Entity
class User {
  constructor(public readonly id: string, public readonly email: string) {}
}

// Implementation (Single Responsibility)
class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly logger: ILogger
  ) {}

  public async registerUser(email: string): Promise<User> {
    if (!email.includes('@')) {
      throw new Error("Invalid email format");
    }

    const user = new User(crypto.randomUUID(), email);
    await this.userRepository.save(user);
    this.logger.log(`User registered: ${user.id}`);

    return user;
  }
}
```

## Code Review Checklist

- [ ] No hardcoded secrets or credentials
- [ ] Input validation on all external data
- [ ] Proper error handling with meaningful messages
- [ ] No N+1 query patterns
- [ ] Functions follow single responsibility principle
- [ ] Dependencies injected, not instantiated inline
- [ ] Tests cover happy path and edge cases
````

## File: .claude/skills/core-engineering/optimizing-code/SKILL.md
````markdown
---
name: optimizing-code
description: Improve code performance without changing behavior. Use when code fails latency/throughput requirements. Covers profiling, caching, and algorithmic optimization.
---

# Optimizing Code

## The Optimization Hat

When optimizing, you improve **performance** without changing **behavior**. Always measure before and after.

## Golden Rules

1. **Measure First**: Never optimize without a benchmark
2. **Profile Before Guessing**: Find the actual bottleneck
3. **Optimize the Right Thing**: Focus on the critical path
4. **Measure After**: Verify the optimization worked

## Workflows

- [ ] **Benchmark**: Establish baseline performance metrics
- [ ] **Profile**: Identify the actual bottleneck
- [ ] **Hypothesize**: What optimization will help?
- [ ] **Implement**: Make the change
- [ ] **Measure**: Verify improvement
- [ ] **Document**: Record the optimization and results

## Common Optimizations

### Algorithm Complexity
- Replace O(n²) with O(n log n) or O(n)
- Use appropriate data structures (Set for lookups, Map for key-value)

### Caching
```typescript
// Memoization
const cache = new Map<string, Result>();

function expensiveCalculation(input: string): Result {
  if (cache.has(input)) {
    return cache.get(input)!;
  }
  const result = /* expensive work */;
  cache.set(input, result);
  return result;
}
```

### Database Queries
- Add indexes for frequently queried columns
- Avoid N+1 queries (use eager loading)
- Use pagination for large result sets

### Memory
- Avoid creating unnecessary objects in loops
- Use streaming for large files
- Release references when done

## Profiling Tools

```bash
# Node.js
node --prof app.js
node --prof-process isolate-*.log

# Python
python -m cProfile -s cumtime script.py

# Go
go test -bench=. -cpuprofile=cpu.prof
go tool pprof cpu.prof
```

## Anti-Patterns to Avoid

- Premature optimization (no benchmark)
- Micro-optimizations (negligible impact)
- Optimizing cold paths
- Sacrificing readability for minor gains
````

## File: .claude/skills/core-engineering/refactoring-code/SKILL.md
````markdown
---
name: refactoring-code
description: Improve code structure without changing behavior. Use when code is hard to read, modify, or test. Covers Extract Method, Rename, and other safe refactorings.
---

# Refactoring Code

## The Refactoring Hat

When refactoring, you change **structure** without changing **behavior**. Always have tests passing before and after.

## Workflows

- [ ] **Tests Green**: Ensure all tests pass before starting
- [ ] **Analyze**: Use Grep to understand dependencies
- [ ] **Small Steps**: Make one small change at a time
- [ ] **Verify Usages**: Use Grep to find all usages before changes
- [ ] **Commit Often**: Commit after each successful refactoring
- [ ] **Tests Green**: Verify tests still pass after each change

## Common Refactorings

### Extract Method
When a code block does one thing, extract it to a named method.

1. Use Grep to verify extraction won't break callers
2. Extract the method
3. Run tests

### Rename for Clarity
Names should reveal intent.

1. Use Grep to find ALL usages
2. Use Edit with replace_all for codebase-wide rename
3. Verify no missed references

### Remove Dead Code
1. Use Grep to verify code is unused
2. If zero references, safe to remove
3. If references exist, trace to understand usage

## Code Smells to Address

- **Long Method**: Extract smaller methods
- **Long Parameter List**: Introduce parameter object
- **Duplicate Code**: Extract to shared function (use Grep to locate duplicates)
- **Feature Envy**: Move method to the class it uses most
- **Data Clumps**: Group related data into objects
- **Primitive Obsession**: Replace primitives with value objects

## Safety Rules

1. Never refactor and add features simultaneously
2. **Always use Grep to find all usages before removing/renaming**
3. Run tests after every change
4. Use targeted Edit operations instead of broad find-replace
5. Commit working states frequently
````

## File: .claude/skills/core-engineering/test-driven-development/SKILL.md
````markdown
---
name: test-driven-development
description: Write tests before implementation code. Use when starting new features or fixing bugs. Covers Red-Green-Refactor cycle and TDD best practices.
---

# Test-Driven Development

## The TDD Cycle

1. **Red**: Write a failing test
2. **Green**: Write minimal code to pass
3. **Refactor**: Improve code while keeping tests green

## Workflows

- [ ] **Write Test**: Write a test that describes desired behavior
- [ ] **Run Test**: Verify it fails (Red)
- [ ] **Implement**: Write minimal code to pass
- [ ] **Run Test**: Verify it passes (Green)
- [ ] **Refactor**: Clean up while tests stay green
- [ ] **Repeat**: Next test case

## TDD Example

### Step 1: Red - Write Failing Test

```typescript
describe("Calculator", () => {
  test("adds two numbers", () => {
    const calc = new Calculator();
    expect(calc.add(2, 3)).toBe(5);
  });
});

// Run: FAIL - Calculator is not defined
```

### Step 2: Green - Minimal Implementation

```typescript
class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }
}

// Run: PASS
```

### Step 3: Refactor (if needed)

Code is already clean, move to next test.

### Step 4: Next Test

```typescript
test("subtracts two numbers", () => {
  const calc = new Calculator();
  expect(calc.subtract(5, 3)).toBe(2);
});

// Run: FAIL - subtract is not defined
```

## TDD Benefits

- **Design Feedback**: Tests reveal design issues early
- **Documentation**: Tests document expected behavior
- **Confidence**: Refactor fearlessly with test safety net
- **Focus**: One behavior at a time

## TDD Tips

1. **Start Simple**: Begin with the simplest test case
2. **One Assert**: Each test should verify one behavior
3. **Descriptive Names**: Test names are documentation
4. **No Logic in Tests**: Tests should be obvious
5. **Fast Feedback**: Tests should run in milliseconds

## When to Use TDD

- New features with clear requirements
- Bug fixes (write failing test first)
- Complex business logic
- API contract development

## When TDD is Less Useful

- Exploratory/prototype code
- UI layout changes
- Simple CRUD operations
````

## File: .claude/skills/core-engineering/testing/SKILL.md
````markdown
---
name: testing
description: Write effective tests for code quality and reliability. Use when implementing features, fixing bugs, or improving coverage. Covers unit, integration, and E2E testing.
---

# Testing Software

## MCP Tools

**Chrome DevTools** (E2E testing):
- Automate user flows in real browser
- Capture screenshots for visual regression
- Run Lighthouse for accessibility testing
- Profile performance during test runs

## Testing Pyramid

1. **Unit Tests** (Many): Fast, isolated, test single units
2. **Integration Tests** (Some): Test component interactions
3. **E2E Tests** (Few): Test complete user flows — use Chrome DevTools

## Workflows

- [ ] **Analyze**: Use Glob and Grep to identify untested code
- [ ] **Unit Tests**: Cover all public functions
- [ ] **Edge Cases**: Test boundaries and error conditions
- [ ] **Integration**: Test external dependencies
- [ ] **E2E**: Use Chrome DevTools for browser automation
- [ ] **Regression**: Add test for each bug fix

## Test Quality Standards

### Deterministic
Tests must produce the same result every time.

### Isolated
Tests should not depend on each other or shared state.

### Clear
Test names should describe the behavior being tested.

## Test Patterns

### Arrange-Act-Assert (AAA) (TypeScript Example)

```typescript
test("user registration sends welcome email", async () => {
  // Arrange
  const emailService = new MockEmailService();
  const userService = new UserService(emailService);

  // Act
  await userService.register("test@example.com");

  // Assert
  expect(emailService.sentEmails).toContainEqual({
    to: "test@example.com",
    subject: "Welcome!"
  });
});
```

## E2E Testing with Chrome DevTools

```javascript
// Use Chrome DevTools MCP for browser automation
// - Navigate to pages
// - Fill forms and click buttons
// - Capture screenshots for visual regression
// - Run Lighthouse accessibility audits
// - Check console for errors
```

## Commands (Examples by Language)

```bash
# Run tests
npm test
pytest
go test ./...

# With coverage
npm test -- --coverage
pytest --cov=src
go test -cover ./...
```

## Finding Untested Code

Use Glob and Grep to identify gaps:
1. Use Glob to find all source files and test files
2. Check which source files have corresponding test files
3. Use Grep to see if functions are referenced in tests
````

## File: .claude/skills/design/accessibility/SKILL.md
````markdown
---
name: accessibility
description: Ensure digital accessibility. Use when designing for accessibility, auditing WCAG compliance, or implementing a11y features. Covers WCAG 2.1 guidelines.
---

# Accessibility

## WCAG 2.1 Principles (POUR)

### Perceivable
Content must be presentable in ways users can perceive.

### Operable
Interface must be operable by all users.

### Understandable
Content and operation must be understandable.

### Robust
Content must work with current and future technologies.

## Common Issues & Fixes

### Images
```html
<!-- Bad -->
<img src="chart.png">

<!-- Good -->
<img src="chart.png" alt="Sales increased 25% in Q4 2024">
```

### Forms
```html
<!-- Bad -->
<input type="email" placeholder="Email">

<!-- Good -->
<label for="email">Email</label>
<input id="email" type="email" aria-describedby="email-hint">
<span id="email-hint">We'll never share your email</span>
```

### Color Contrast
- Normal text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- UI components: 3:1 minimum

### Keyboard Navigation
- All interactive elements focusable
- Visible focus indicator
- Logical tab order
- Skip links for navigation

### Screen Readers
```html
<!-- Hidden visually but accessible -->
<span class="sr-only">Open menu</span>

<!-- Live regions for updates -->
<div aria-live="polite">Item added to cart</div>
```

## ARIA Basics

```html
<!-- Roles -->
<nav role="navigation">

<!-- States -->
<button aria-expanded="false">Menu</button>

<!-- Properties -->
<input aria-required="true">

<!-- Labels -->
<button aria-label="Close dialog">×</button>
```

## Testing Checklist

- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Color contrast passes
- [ ] Focus visible
- [ ] Form labels present
- [ ] Images have alt text
- [ ] Headings hierarchical
- [ ] Links descriptive

## Tools

- Axe DevTools (browser extension)
- WAVE (web accessibility evaluator)
- Lighthouse (Chrome DevTools)
- Screen readers: NVDA, VoiceOver, JAWS
````

## File: .claude/skills/design/component-recipes/SKILL.md
````markdown
---
name: component-recipes
description: Tailwind CSS component recipes. Use when building UI components with consistent styling. Provides copy-paste patterns for cards, badges, buttons, modals, inputs, and more.
---

# Component Recipes

## Overview
Ready-to-use Tailwind CSS patterns for demo components.

## Card Recipes

### Basic Card
```tsx
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  {children}
</div>
```

### Clickable Card
```tsx
<button className="w-full text-left bg-white rounded-lg shadow-md p-6 hover:shadow-lg hover:ring-2 hover:ring-brand-primary/20 transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary">
  {children}
</button>
```

### Selected Card
```tsx
<div className="bg-white rounded-lg shadow-md p-6 ring-2 ring-brand-primary">
  {children}
</div>
```

## Badge Recipes

### Severity Badges
```tsx
// Safety Hazard
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
  {label}
</span>

// Repair Needed
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
  {label}
</span>

// Maintenance Item
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
  {label}
</span>

// Monitor
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
  {label}
</span>

// Informational
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
  {label}
</span>
```

### Condition Badges
```tsx
// Excellent
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
  {label}
</span>

// Good
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-lime-100 text-lime-800">
  {label}
</span>

// Fair / Poor (use yellow-100/orange-100)
```

### Badge Sizes
```tsx
// Small
className="px-2 py-0.5 text-xs"

// Medium (default)
className="px-2.5 py-0.5 text-xs"

// Large
className="px-3 py-1 text-sm"
```

## Button Recipes

### Primary Button
```tsx
<button className="px-4 py-2 bg-brand-primary text-white rounded-md font-medium hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-colors">
  {label}
</button>
```

### Secondary Button
```tsx
<button className="px-4 py-2 bg-white text-neutral-700 border border-neutral-300 rounded-md font-medium hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-colors">
  {label}
</button>
```

### Ghost Button
```tsx
<button className="px-4 py-2 text-brand-primary rounded-md font-medium hover:bg-brand-primary/10 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors">
  {label}
</button>
```

### Icon Button
```tsx
<button className="p-2 text-neutral-500 rounded-md hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors">
  <Icon className="w-5 h-5" />
</button>
```

## Modal Recipes

### Modal Overlay
```tsx
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
```

### Modal Content
```tsx
<div className="fixed inset-0 flex items-center justify-center p-4">
  <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto">
    <div className="p-6">
      {children}
    </div>
  </div>
</div>
```

### Modal Header
```tsx
<div className="flex items-center justify-between pb-4 border-b border-neutral-200">
  <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
  <button className="p-1 text-neutral-400 hover:text-neutral-600 rounded">
    <X className="w-5 h-5" />
  </button>
</div>
```

## Input Recipes

### Text Input
```tsx
<input
  type="text"
  className="w-full px-3 py-2 border border-neutral-300 rounded-md text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-shadow"
  placeholder="Enter text..."
/>
```

### Input with Error
```tsx
<input
  className="w-full px-3 py-2 border border-red-500 rounded-md text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
/>
<p className="mt-1 text-sm text-red-600">{errorMessage}</p>
```

## Progress Recipes

### Progress Bar
```tsx
<div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
  <div
    className="h-full bg-brand-primary transition-all duration-500"
    style={{ width: `${percentage}%` }}
  />
</div>
```

### Colored Progress (Condition-based)
```tsx
// className based on condition
const progressColor = {
  excellent: 'bg-green-500',
  good: 'bg-lime-500',
  fair: 'bg-yellow-500',
  poor: 'bg-orange-500',
}[condition];
```

## Layout Recipes

### Page Container
```tsx
<div className="min-h-screen bg-neutral-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {children}
  </div>
</div>
```

### Card Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

### Section Header
```tsx
<div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl font-semibold text-neutral-900">{title}</h2>
  <div className="flex items-center gap-2">
    {actions}
  </div>
</div>
```

## Best Practices

- Use semantic color tokens (brand-primary, severity-*, condition-*)
- Maintain consistent spacing (4px grid)
- Include focus states for accessibility
- Use transition classes for smooth interactions

## Anti-Patterns

- NO hardcoded hex colors
- NO inconsistent border-radius
- NO missing focus states
- NO arbitrary spacing values
````

## File: .claude/skills/design/demo-design-tokens/SKILL.md
````markdown
---
name: demo-design-tokens
description: Default design tokens for demo applications. Use when building demos without a formal design system. Provides colors, typography, spacing, shadows, and transitions.
---

# Demo Design Tokens

## Overview
Pre-configured design tokens for graceful demo UI without a formal design system.

## Color System

### Brand Colors
```css
--brand-primary: #2563EB;    /* Blue-600 */
--brand-secondary: #1E40AF;  /* Blue-800 */
--brand-accent: #7C3AED;     /* Violet-600 */
```

### Neutral Colors
```css
--neutral-50: #F8FAFC;   /* Background */
--neutral-100: #F1F5F9;  /* Surface alt */
--neutral-200: #E2E8F0;  /* Border */
--neutral-300: #CBD5E1;  /* Border hover */
--neutral-500: #64748B;  /* Text secondary */
--neutral-700: #334155;  /* Text primary */
--neutral-900: #0F172A;  /* Text emphasis */
```

### Semantic Colors
```css
/* Status */
--success: #22C55E;      /* Green-500 */
--warning: #EAB308;      /* Yellow-500 */
--error: #EF4444;        /* Red-500 */
--info: #3B82F6;         /* Blue-500 */

/* Severity (for data visualization) */
--severity-critical: #DC2626;  /* Red-600 */
--severity-high: #F97316;      /* Orange-500 */
--severity-medium: #EAB308;    /* Yellow-500 */
--severity-low: #3B82F6;       /* Blue-500 */
--severity-info: #6B7280;      /* Gray-500 */

/* Condition */
--condition-excellent: #22C55E;  /* Green-500 */
--condition-good: #84CC16;       /* Lime-500 */
--condition-fair: #EAB308;       /* Yellow-500 */
--condition-poor: #F97316;       /* Orange-500 */
```

## Typography

### Font Stack
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', monospace;
```

### Type Scale
| Token | Size | Line Height | Weight | Use |
|-------|------|-------------|--------|-----|
| --text-xs | 12px | 16px | 400 | Labels, captions |
| --text-sm | 14px | 20px | 400 | Secondary text |
| --text-base | 16px | 24px | 400 | Body |
| --text-lg | 18px | 28px | 500 | Emphasis |
| --text-xl | 20px | 28px | 600 | Card titles |
| --text-2xl | 24px | 32px | 600 | Section headers |
| --text-3xl | 30px | 36px | 700 | Page titles |
| --text-4xl | 36px | 40px | 700 | Hero text |

## Spacing Scale

Based on 4px grid:

| Token | Value | Tailwind |
|-------|-------|----------|
| --space-1 | 4px | p-1 |
| --space-2 | 8px | p-2 |
| --space-3 | 12px | p-3 |
| --space-4 | 16px | p-4 |
| --space-5 | 20px | p-5 |
| --space-6 | 24px | p-6 |
| --space-8 | 32px | p-8 |
| --space-10 | 40px | p-10 |
| --space-12 | 48px | p-12 |

## Shadows

| Token | Value | Use |
|-------|-------|-----|
| --shadow-sm | 0 1px 2px rgba(0,0,0,0.05) | Subtle elevation |
| --shadow-md | 0 4px 6px rgba(0,0,0,0.1) | Cards |
| --shadow-lg | 0 10px 15px rgba(0,0,0,0.1) | Modals, dropdowns |
| --shadow-xl | 0 20px 25px rgba(0,0,0,0.15) | Popovers |

## Border Radius

| Token | Value | Use |
|-------|-------|-----|
| --radius-sm | 4px | Buttons, inputs |
| --radius-md | 8px | Cards |
| --radius-lg | 12px | Modals |
| --radius-xl | 16px | Large containers |
| --radius-full | 9999px | Pills, avatars |

## Transitions

| Token | Value | Use |
|-------|-------|-----|
| --duration-fast | 150ms | Micro-interactions |
| --duration-normal | 300ms | Default |
| --duration-slow | 500ms | Page transitions |
| --ease-out | cubic-bezier(0, 0, 0.2, 1) | Entrances |
| --ease-in-out | cubic-bezier(0.4, 0, 0.2, 1) | Transitions |

## Tailwind Config Extension

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2563EB',
          secondary: '#1E40AF',
          accent: '#7C3AED',
        },
        severity: {
          critical: '#DC2626',
          high: '#F97316',
          medium: '#EAB308',
          low: '#3B82F6',
          info: '#6B7280',
        },
        condition: {
          excellent: '#22C55E',
          good: '#84CC16',
          fair: '#EAB308',
          poor: '#F97316',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
    },
  },
};
```

## Best Practices

- Use semantic tokens over raw values
- Maintain consistent spacing rhythm
- Pair shadows with border radius
- Test colors for WCAG contrast

## Anti-Patterns

- NO hardcoded hex values in components
- NO inconsistent spacing values
- NO mixing design systems
````

## File: .claude/skills/design/design-systems/SKILL.md
````markdown
---
name: design-systems
description: Build and maintain design systems. Use when creating component libraries, design tokens, or style guides. Covers atomic design and tokens.
---

# Design Systems

## What is a Design System?

A collection of reusable components, guided by clear standards, that can be assembled to build applications.

## Components

### Atomic Design

**Atoms**: Basic building blocks
- Buttons, inputs, labels, icons

**Molecules**: Simple combinations
- Search bar (input + button)
- Form field (label + input + error)

**Organisms**: Complex components
- Header, sidebar, card

**Templates**: Page layouts
- Dashboard, settings page

**Pages**: Specific instances
- User dashboard, admin settings

## Design Tokens

```json
{
  "color": {
    "primary": {
      "50": "#f0f9ff",
      "500": "#0ea5e9",
      "900": "#0c4a6e"
    },
    "neutral": {
      "100": "#f5f5f5",
      "900": "#171717"
    }
  },
  "spacing": {
    "1": "0.25rem",
    "2": "0.5rem",
    "4": "1rem",
    "8": "2rem"
  },
  "font": {
    "family": {
      "sans": "Inter, sans-serif",
      "mono": "JetBrains Mono, monospace"
    },
    "size": {
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem"
    }
  },
  "radius": {
    "sm": "0.25rem",
    "md": "0.375rem",
    "lg": "0.5rem"
  }
}
```

## Component API

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
}
```

## Documentation

Each component should document:
- **Usage**: When to use
- **Props**: Available options
- **Examples**: Common patterns
- **Accessibility**: A11y considerations
- **Do/Don't**: Best practices

## Resources

- [Design Framework Template](./resources/design-framework.template.md)
````

## File: .claude/skills/design/interface-design/resources/design-framework.template.md
````markdown
# Design Framework: [Project Name]

## Core Principles

1. **[Principle 1]**: [Description]
2. **[Principle 2]**: [Description]
3. **[Principle 3]**: [Description]

---

## Design Tokens

### Colors

#### Primary
| Token | Value | Usage |
|-------|-------|-------|
| `primary-50` | #f0f9ff | Backgrounds |
| `primary-500` | #0ea5e9 | Interactive elements |
| `primary-900` | #0c4a6e | Text on light |

#### Neutral
| Token | Value | Usage |
|-------|-------|-------|
| `neutral-100` | #f5f5f5 | Backgrounds |
| `neutral-500` | #737373 | Secondary text |
| `neutral-900` | #171717 | Primary text |

#### Semantic
| Token | Value | Usage |
|-------|-------|-------|
| `success` | #22c55e | Success states |
| `warning` | #f59e0b | Warning states |
| `error` | #ef4444 | Error states |

### Typography

| Token | Font | Size | Weight | Line Height |
|-------|------|------|--------|-------------|
| `heading-1` | Inter | 2.25rem | 700 | 1.2 |
| `heading-2` | Inter | 1.875rem | 600 | 1.25 |
| `body` | Inter | 1rem | 400 | 1.5 |
| `caption` | Inter | 0.875rem | 400 | 1.4 |

### Spacing

| Token | Value |
|-------|-------|
| `space-1` | 0.25rem (4px) |
| `space-2` | 0.5rem (8px) |
| `space-4` | 1rem (16px) |
| `space-8` | 2rem (32px) |

---

## Components

### Atoms

#### Button
```
Variants: primary, secondary, ghost
Sizes: sm, md, lg
States: default, hover, active, disabled, loading
```

#### Input
```
Types: text, email, password, search
States: default, focus, error, disabled
```

### Molecules

#### Form Field
- Label + Input + Helper Text + Error Message

#### Search Bar
- Input + Button + Clear action

### Organisms

#### Header
- Logo + Navigation + User menu

---

## Accessibility

- All interactive elements keyboard accessible
- Color contrast minimum 4.5:1
- Focus states visible
- Error messages announced to screen readers

---

## Responsive Breakpoints

| Name | Min Width |
|------|-----------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
````

## File: .claude/skills/design/interface-design/SKILL.md
````markdown
---
name: interface-design
description: Design user interfaces. Use when creating layouts, wireframes, or UI specifications. Covers design principles and UI patterns.
---

# Interface Design

## Design Principles

### 1. Clarity
Make the interface obvious. Users shouldn't have to guess.

### 2. Consistency
Same actions, same results. Maintain patterns throughout.

### 3. Feedback
Respond to every action. Show progress, confirm success, explain errors.

### 4. Efficiency
Minimize steps. Optimize common workflows.

### 5. Forgiveness
Allow undo. Confirm destructive actions. Recover gracefully.

## UI Patterns

### Navigation
- **Top Nav**: Primary navigation, global actions
- **Side Nav**: Section navigation, hierarchical content
- **Breadcrumbs**: Show location in hierarchy
- **Tabs**: Switch between related views

### Forms
- Label above input
- Clear validation messages
- Inline validation where helpful
- Logical field grouping
- Clear call-to-action

### Feedback
- Loading states
- Success confirmations
- Error messages
- Empty states
- Progress indicators

### Actions
- Primary action prominent
- Secondary actions subtle
- Destructive actions require confirmation
- Disabled states clear

## Layout Principles

### Visual Hierarchy
- Size indicates importance
- Color draws attention
- Spacing groups elements
- Alignment creates order

### Grid System
```css
.container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}
```

### Responsive Design
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px
- Fluid typography
- Flexible images

## Design Specification

When handing off to development:
- [ ] Color values (hex/RGB)
- [ ] Typography (font, size, weight, line-height)
- [ ] Spacing (margins, padding)
- [ ] Component states (default, hover, active, disabled)
- [ ] Responsive behavior
- [ ] Animations/transitions
````

## File: .claude/skills/design/visual-assets/SKILL.md
````markdown
---
name: visual-assets
description: Create and manage visual assets. Use when creating graphics, icons, or images. Covers asset formats and optimization.
---

# Visual Assets

## Asset Types

### Icons
- **SVG**: Scalable, small file size, CSS styling
- **Icon fonts**: Easy to use, limited styling
- **PNG sprites**: Legacy, larger files

### Images
- **JPEG**: Photos, complex images
- **PNG**: Transparency, screenshots
- **WebP**: Modern, smaller files
- **AVIF**: Newest, best compression

### Graphics
- **SVG**: Illustrations, logos, charts
- **Lottie**: Animations, complex motion

## Optimization

### Image Compression
```bash
# WebP conversion
cwebp -q 80 input.png -o output.webp

# AVIF conversion
avifenc input.png output.avif

# PNG optimization
pngquant --quality=65-80 input.png
```

### Responsive Images
```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description"
       srcset="image-400.jpg 400w,
               image-800.jpg 800w,
               image-1200.jpg 1200w"
       sizes="(max-width: 600px) 100vw, 50vw">
</picture>
```

### SVG Optimization
```bash
# SVGO optimization
svgo input.svg -o output.svg
```

## Icon Guidelines

- Consistent stroke width
- Consistent sizing (24x24, 20x20)
- Optical alignment
- Clear at small sizes

## File Organization

```
assets/
├── icons/
│   ├── ui/
│   └── brand/
├── images/
│   ├── originals/
│   └── optimized/
└── illustrations/
```

## Performance Tips

1. Lazy load below-fold images
2. Use appropriate format for content
3. Serve responsive sizes
4. Consider CDN delivery
5. Set cache headers
````

## File: .claude/skills/languages/bash/SKILL.md
````markdown
---
name: bash
description: Write Bash scripts following best practices. Use when creating shell scripts, automation, or CLI tools. Covers safe scripting patterns.
---

# Bash Scripting

## Script Template

```bash
#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

# Script description
# Usage: ./script.sh <arg1> <arg2>

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

main() {
    local arg1="${1:-default}"

    # Script logic here
    echo "Running with: $arg1"
}

main "$@"
```

## Safety Settings

```bash
set -e          # Exit on error
set -u          # Error on undefined variables
set -o pipefail # Catch pipe failures
set -x          # Debug: print commands
```

## Variables

```bash
# Declaration
readonly CONST="immutable"
local var="function scoped"

# Default values
name="${1:-default}"      # Use default if unset
name="${1:?Error: missing}"  # Error if unset

# String operations
"${var^^}"    # Uppercase
"${var,,}"    # Lowercase
"${var#prefix}"  # Remove prefix
"${var%suffix}"  # Remove suffix
```

## Conditionals

```bash
# File tests
[[ -f "$file" ]]  # Is file
[[ -d "$dir" ]]   # Is directory
[[ -r "$file" ]]  # Is readable
[[ -x "$file" ]]  # Is executable

# String tests
[[ -z "$var" ]]   # Is empty
[[ -n "$var" ]]   # Is not empty
[[ "$a" == "$b" ]] # Equals

# Numeric tests
(( num > 5 ))     # Greater than
(( num == 5 ))    # Equals
```

## Functions

```bash
log() {
    local level="$1"
    local message="$2"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] [$level] $message" >&2
}

die() {
    log "ERROR" "$1"
    exit 1
}

require_command() {
    command -v "$1" >/dev/null 2>&1 || die "Required command not found: $1"
}
```

## Error Handling

```bash
# Trap for cleanup
cleanup() {
    rm -rf "$TMP_DIR"
}
trap cleanup EXIT

# Catch errors
if ! result=$(some_command 2>&1); then
    die "Command failed: $result"
fi
```

## Loops

```bash
# For loop
for item in "${array[@]}"; do
    echo "$item"
done

# While read
while IFS= read -r line; do
    echo "$line"
done < file.txt

# Process substitution
while read -r line; do
    echo "$line"
done < <(command)
```

## Best Practices

1. Quote all variables: `"$var"`
2. Use `[[` instead of `[`
3. Use `local` in functions
4. Use `readonly` for constants
5. Always use `set -euo pipefail`
6. Use shellcheck for linting
````

## File: .claude/skills/languages/biome/SKILL.md
````markdown
---
name: biome
description: Biome 2.x linting and formatting patterns. Use when configuring code quality tools, setting up linting rules, formatting code, or integrating with CI/CD. Covers migration from ESLint/Prettier.
---

# Biome 2.x

## Overview

Fast, all-in-one toolchain for linting and formatting JavaScript, TypeScript, JSX, and JSON. Biome 2.x replaces ESLint and Prettier with a single, performant tool written in Rust.

**Install**: `pnpm add -D @biomejs/biome`

> **API Reference:** Use Context7 MCP for full rule reference and CLI flags (`mcp__context7__resolve-library-id` → `@biomejs/biome`).

## Workflows

**Initial setup:**
1. [ ] Install Biome: `pnpm add -D @biomejs/biome`
2. [ ] Initialize config: `pnpm biome init`
3. [ ] Configure biome.json with project standards
4. [ ] Install VS Code extension: `biomejs.biome`
5. [ ] Add npm scripts to package.json
6. [ ] Test: `pnpm biome check .`

**Migrating from ESLint/Prettier:**
1. [ ] Run migration helper: `pnpm biome migrate eslint --write`
2. [ ] Review generated biome.json
3. [ ] Remove ESLint/Prettier configs and dependencies
4. [ ] Update pre-commit hooks and CI scripts
5. [ ] Run full check: `pnpm biome check --write .`

**Daily usage:**
1. [ ] Format on save (VS Code integration)
2. [ ] Run `pnpm biome check .` before commits
3. [ ] Fix auto-fixable issues: `pnpm biome check --write .`
4. [ ] Review manual fixes for remaining issues

## Configuration

### biome.json Structure

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "organizeImports": { "enabled": true },
  "linter": {
    "enabled": true,
    "rules": { "recommended": true }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "always",
      "trailingCommas": "es5",
      "arrowParentheses": "asNeeded"
    }
  },
  "files": {
    "ignore": ["dist", "build", "node_modules", "*.min.js", "coverage"]
  }
}
```

### TypeScript / React Project Config

```json
{
  "linter": {
    "rules": {
      "recommended": true,
      "a11y": { "noBlankTarget": "error", "useAltText": "error", "useButtonType": "error" },
      "complexity": { "noExcessiveCognitiveComplexity": "warn", "noUselessFragments": "error" },
      "correctness": { "noUnusedVariables": "error", "useExhaustiveDependencies": "warn", "useHookAtTopLevel": "error" },
      "performance": { "noAccumulatingSpread": "warn" },
      "security": { "noDangerouslySetInnerHtml": "warn" },
      "style": { "noNonNullAssertion": "warn", "useConst": "error", "useImportType": "error" },
      "suspicious": { "noExplicitAny": "error", "noDebugger": "error", "noConsoleLog": "warn" }
    }
  },
  "javascript": {
    "formatter": { "jsxQuoteStyle": "double", "quoteStyle": "single" }
  }
}
```

### Per-File Overrides

```json
{
  "overrides": [
    {
      "include": ["tests/**/*.ts"],
      "linter": { "rules": { "suspicious": { "noExplicitAny": "off" } } }
    },
    {
      "include": ["scripts/**/*.js"],
      "formatter": { "lineWidth": 120 }
    }
  ]
}
```

## CLI Commands

```bash
# Check (lint + format) — use this for most tasks
pnpm biome check .
pnpm biome check --write .          # auto-fix
pnpm biome check --write --dry-run . # preview changes

# Lint or format only
pnpm biome lint --write .
pnpm biome format --write .

# Diagnostics
pnpm biome rage                     # effective config + diagnostics
pnpm biome explain src/App.tsx      # explain failures for a file
pnpm biome migrate eslint --write   # migrate from ESLint
pnpm biome migrate prettier --write # migrate from Prettier
```

## Package.json Scripts

```json
{
  "scripts": {
    "lint": "biome lint .",
    "format": "biome format --write .",
    "check": "biome check .",
    "fix": "biome check --write .",
    "typecheck": "tsc --noEmit",
    "quality": "pnpm lint && pnpm typecheck && pnpm build"
  }
}
```

## Editor Integration

### VS Code settings.json

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "eslint.enable": false,
  "prettier.enable": false,
  "[javascript]": { "editor.defaultFormatter": "biomejs.biome" },
  "[typescript]": { "editor.defaultFormatter": "biomejs.biome" },
  "[typescriptreact]": { "editor.defaultFormatter": "biomejs.biome" },
  "[json]": { "editor.defaultFormatter": "biomejs.biome" },
  "biome.lspBin": "./node_modules/@biomejs/biome/bin/biome"
}
```

## Ignoring Code

```typescript
// biome-ignore lint/suspicious/noExplicitAny: legacy code
function legacy(param: any) { return param; }

// biome-ignore format: preserve matrix formatting
const matrix = [
  1, 0, 0,
  0, 1, 0,
  0, 0, 1,
];
```

Prefer `files.ignore` in biome.json for ignoring entire directories over inline comments.

## Git Hooks Integration

**Using lint-staged + Husky:**

```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,json}": ["biome check --write --no-errors-on-unmatched"]
  }
}
```

**Using Lefthook (`lefthook.yml`):**
```yaml
pre-commit:
  parallel: true
  commands:
    biome:
      glob: "*.{js,ts,jsx,tsx,json}"
      run: biome check --write --no-errors-on-unmatched {staged_files}
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Code Quality
on: [push, pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 10 }
      - uses: actions/setup-node@v4
        with: { node-version: '24', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm biome check .
      - run: pnpm typecheck
```

## ESLint Rule Equivalents

| ESLint Rule | Biome Rule |
|-------------|------------|
| `no-unused-vars` | `correctness/noUnusedVariables` |
| `@typescript-eslint/no-explicit-any` | `suspicious/noExplicitAny` |
| `react-hooks/exhaustive-deps` | `correctness/useExhaustiveDependencies` |
| `no-console` | `suspicious/noConsoleLog` |
| `prefer-const` | `style/useConst` |
| `jsx-a11y/alt-text` | `a11y/useAltText` |

## Best Practices

- **Use recommended ruleset** as baseline, then customize specific rules
- **Enable format-on-save** in VS Code for seamless workflow
- **Run check before commits** using git hooks (Husky/Lefthook)
- **Use biome check** (not lint + format separately) for unified workflow
- **Ignore generated files** in biome.json, not inline comments
- **Use overrides** for different rules in tests vs source
- **Commit biome.json** to version control for team consistency
- **Document custom rules** with comments explaining why they're needed

## Anti-Patterns

- Running lint and format separately (use `check` instead)
- Disabling recommended rules without justification
- Using biome-ignore excessively (fix the underlying issue)
- Not committing biome.json to version control
- Mixing ESLint and Biome in the same project
- Ignoring files via inline comments instead of configuration
- Not testing migration thoroughly before removing ESLint/Prettier
- Skipping pre-commit hooks for "quick fixes"
- Using outdated schema version in biome.json

## Feedback Loops

```bash
# Preview formatting changes without writing
pnpm biome format --write --dry-run .

# Diagnose config issues
pnpm biome rage

# CI test locally (exit code 0 = success)
pnpm biome check . --error-on-warnings && echo "OK"
```

Verify VS Code integration: Command Palette → "Biome: Show Output Channel" → should show LSP server logs.
````

## File: .claude/skills/languages/expo-router/SKILL.md
````markdown
---
name: expo-router
description: Expo Router 6.x file-based routing for React Native. Use when setting up navigation, creating screens, handling route params, or structuring app layouts with Stack/Tabs navigators.
---

# Expo Router

## Overview

File-based routing for React Native using Expo Router 6.x. Maps file system structure in the `app/` directory to navigation screens. Supports Stack and Tab navigators, route groups, dynamic parameters, and nested layouts.

**Install**: Included with Expo SDK 54+. Ensure `expo-router` is in dependencies.

## Workflows

**Setting up routing:**
1. [ ] Create `app/_layout.tsx` as root layout (providers, global chrome)
2. [ ] Create route group directories: `app/(demo)/`, `app/(auth)/`
3. [ ] Add `_layout.tsx` in each group for group-specific navigation
4. [ ] Add `index.tsx` for default screens
5. [ ] Add `[param].tsx` for dynamic routes
6. [ ] Add `+not-found.tsx` for 404 handling

**Adding a new screen:**
1. [ ] Create file in appropriate route group
2. [ ] Export default React component
3. [ ] Configure screen options in parent `_layout.tsx` or via `<Stack.Screen options={...} />`
4. [ ] Navigate using `useRouter()` or `<Link>`

## Guidance

### File Conventions

| File | Purpose |
|------|---------|
| `_layout.tsx` | Layout wrapper for directory (providers, navigators) |
| `index.tsx` | Default screen for directory |
| `[param].tsx` | Dynamic route segment |
| `[...catchAll].tsx` | Catch-all route |
| `+not-found.tsx` | 404 screen |
| `(group)/` | Route group (no URL segment) |

### Root Layout Pattern

The root `_layout.tsx` is the entry point. Use it for global providers:

```
app/_layout.tsx → GestureHandlerRootView > SafeAreaProvider > Context > Stack
```

Keep the root layout thin — push chrome (tabs, headers) into group layouts.

### Route Groups

Route groups `(name)/` organize screens without affecting the URL path. Common pattern:

```
app/
├── _layout.tsx          # Root: providers + Stack
├── (demo)/
│   ├── _layout.tsx      # Tabs or Stack for demo scenes
│   ├── index.tsx        # Home screen
│   └── [id].tsx         # Detail screen
└── +not-found.tsx
```

### Navigation

- **Programmatic**: `const router = useRouter()` → `router.push('/detail/123')`, `router.back()`
- **Declarative**: `<Link href="/detail/123">` component
- **Params**: `const { id } = useLocalSearchParams<{ id: string }>()`
- **Redirect**: `<Redirect href="/login" />` for conditional routing

### Screen Options

Configure screen presentation via layout or inline:

- In layout: `<Stack.Screen name="detail" options={{ title: 'Detail', headerShown: false }} />`
- Inline: `<Stack.Screen options={{ presentation: 'modal' }} />`
- Common options: `title`, `headerShown`, `presentation` ('card' | 'modal'), `animation`

### Layout Nesting

Nest providers in root, chrome in groups:

- Root `_layout.tsx`: `GestureHandlerRootView`, `SafeAreaProvider`, theme context, `<Stack />`
- Group `_layout.tsx`: `<Tabs />` or `<Stack />` with screen options, header configuration

## Best Practices

- Keep route files thin — delegate to view components in `/components/views/`
- Use route groups to separate concerns without affecting URLs
- Type route params with generics: `useLocalSearchParams<{ id: string }>()`
- Set `headerShown: false` when providing custom headers
- Use `<Stack screenOptions={{ animation: 'slide_from_right' }} />` for consistent transitions
- Place shared providers (theme, data context) in root `_layout.tsx`
- Use `+not-found.tsx` for graceful 404 handling

## Anti-Patterns

- Placing business logic in route files (keep them thin, delegate to components)
- Deeply nesting route groups beyond 2 levels
- Using React Navigation directly instead of Expo Router abstractions
- Hardcoding navigation paths as strings without a constants file for complex apps
- Forgetting to export default from route files (causes blank screens)
- Putting providers in group layouts when they should be in root layout
````

## File: .claude/skills/languages/expo-sdk/SKILL.md
````markdown
---
name: expo-sdk
description: Expo SDK 54+ platform patterns. Use when configuring Expo apps, setting up root layouts, using expo-image, expo-haptics, safe areas, bottom sheets, FlashList, or StatusBar.
---

# Expo SDK

## Overview

Expo SDK 54+ provides a managed React Native development environment with file-based routing (Expo Router), native module access, and streamlined build tooling. This skill covers app configuration, the root layout provider pattern, and key Expo/RN libraries.

**Prerequisite**: `npx create-expo-app` or Expo SDK 54+ in `package.json`

## Workflows

**Setting up a new Expo demo:**
1. [ ] Create project: `npx create-expo-app [demo-name] --template blank-typescript`
2. [ ] Install core dependencies: `pnpm add expo-router expo-image expo-haptics react-native-reanimated react-native-gesture-handler react-native-safe-area-context @gorhom/bottom-sheet @shopify/flash-list lucide-react-native nativewind tailwindcss@3`
3. [ ] Configure NativeWind (see `nativewind` skill)
4. [ ] Set up root layout with provider stack
5. [ ] Configure `app.json` with scheme, name, splash
6. [ ] Add route groups and screens
7. [ ] Run: `pnpm start` (Expo dev server)

**Adding a new library:**
1. [ ] Install with pnpm: `pnpm add [library]`
2. [ ] Check if Expo config plugin needed in `app.json`
3. [ ] Rebuild dev client if native module added: `npx expo prebuild`

## Guidance

### app.json Configuration

Key fields for demo apps:

| Field | Purpose |
|-------|---------|
| `expo.name` | Display name |
| `expo.slug` | URL-safe identifier |
| `expo.scheme` | Deep link scheme (e.g., `myapp`) |
| `expo.orientation` | `portrait` (default for demos) |
| `expo.splash` | Splash screen configuration |
| `expo.ios.bundleIdentifier` | iOS bundle ID |
| `expo.android.package` | Android package name |
| `expo.plugins` | Expo config plugins (e.g., `expo-router`) |

### Root Layout Provider Pattern

The root `app/_layout.tsx` wraps the entire app with providers. Standard order:

```
GestureHandlerRootView (flex: 1)
  └── SafeAreaProvider
       └── ThemeProvider / Context
            └── Stack (Expo Router)
```

- `GestureHandlerRootView` must be outermost (required by gesture handler and bottom sheets)
- `SafeAreaProvider` provides safe area insets to all descendants
- App-level context providers go between SafeAreaProvider and Stack
- `<Stack screenOptions={{ headerShown: false }} />` for custom headers

### expo-image (replaces RN Image)

Use `expo-image` for all image rendering — provides caching, blurhash placeholders, content-fit modes, and animated transitions.

Key props:
- `source` — URI string or require() for local images
- `placeholder` — blurhash string for loading state
- `contentFit` — `'cover'` | `'contain'` | `'fill'`
- `transition` — fade-in duration in ms (e.g., `300`)

### expo-haptics

Provide tactile feedback on interactions:

- `Haptics.selectionAsync()` — light tap for selections, toggles
- `Haptics.impactAsync(ImpactFeedbackStyle.Medium)` — button press, card tap
- `Haptics.notificationAsync(NotificationFeedbackType.Success)` — action completion

Use sparingly — haptics on every touch is annoying.

### Safe Area Insets

Account for device notch, status bar, and home indicator:

- `useSafeAreaInsets()` — returns `{ top, bottom, left, right }` in points
- Apply to screen containers: `paddingTop: insets.top`
- NativeWind classes: use `pt-[${insets.top}px]` or wrap in SafeAreaView

### @gorhom/bottom-sheet

Replaces Radix Dialog for mobile modal patterns:

- Use for detail views, selections, filters, forms
- Define snap points: `snapPoints={['25%', '50%', '90%']}`
- Backdrop: `backdropComponent` with press-to-dismiss
- `BottomSheetScrollView` for scrollable content inside sheets
- Requires `GestureHandlerRootView` as ancestor

### FlashList (replaces FlatList)

High-performance list rendering from `@shopify/flash-list`:

- Drop-in FlatList replacement with mandatory `estimatedItemSize` prop
- `estimatedItemSize={80}` — estimated height of each item in points
- Recycling architecture for smooth 60fps scrolling
- Use `contentContainerClassName` for NativeWind styling

### lucide-react-native

Icon library for React Native (matches web lucide-react):

- Import individual icons: `import { Home, Settings, ChevronRight } from 'lucide-react-native'`
- Props: `size`, `color`, `strokeWidth`
- Consistent icon set across mobile and web codebases

### StatusBar

Configure status bar appearance per screen:

- `<StatusBar style="dark" />` for light backgrounds
- `<StatusBar style="light" />` for dark backgrounds
- Import from `expo-status-bar`

## Best Practices

- Wrap root layout in `GestureHandlerRootView` with `style={{ flex: 1 }}`
- Use expo-image for all images (caching, blurhash, performance)
- Add haptics to primary actions only (buttons, major selections) — not every touch
- Set `estimatedItemSize` on all FlashList components
- Place providers in root `_layout.tsx`, not in individual screens
- Use `useSafeAreaInsets()` for manual padding, `SafeAreaView` for simple wrapping
- Test on real device for haptics and performance verification

## Anti-Patterns

- Using React Native `Image` instead of `expo-image`
- Using `FlatList` for large datasets instead of `FlashList`
- Forgetting `GestureHandlerRootView` (causes bottom sheet and gesture crashes)
- Overusing haptics on every interaction
- Hardcoding status bar height instead of using safe area insets
- Missing `estimatedItemSize` on FlashList (required prop, console warning)
- Placing `SafeAreaView` inside ScrollView (causes layout issues)
- Not including `expo-router` plugin in `app.json` plugins array
````

## File: .claude/skills/languages/framer-motion/SKILL.md
````markdown
---
name: framer-motion
description: Framer Motion animation patterns. Use when adding animations, transitions, gestures, or layout animations to React applications. Covers performance optimization and accessibility.
---

# Framer Motion

> **Platform:** Web only. For mobile animations, see the **react-native-reanimated** skill.

## Overview

Animation patterns for React using Framer Motion 12.x. Provides declarative animations, gesture handling, layout transitions, and page animations with performance and accessibility built-in.

**Install**: `pnpm add framer-motion`

## Workflows

**Adding animations:**
1. [ ] Import motion component: `import { motion } from 'framer-motion'`
2. [ ] Replace element with motion variant: `<div>` → `<motion.div>`
3. [ ] Add animation props: initial, animate, transition
4. [ ] Test with reduced motion enabled
5. [ ] Verify 60fps performance in DevTools

**Complex sequences:**
1. [ ] Define variants object with named states
2. [ ] Apply variants to parent and children
3. [ ] Use orchestration props: staggerChildren, delayChildren
4. [ ] Wrap with AnimatePresence if unmounting
5. [ ] Add accessibility fallbacks

## Animation Primitives

### Basic Motion Components

```tsx
import { motion } from 'framer-motion';

// Simple fade-in
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>

// Slide up with fade
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
  Content
</motion.div>
```

### Variants for Complex Animations

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: { opacity: 0, transition: { duration: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

<motion.ul variants={containerVariants} initial="hidden" animate="visible" exit="exit">
  {items.map(item => (
    <motion.li key={item.id} variants={itemVariants}>
      {item.name}
    </motion.li>
  ))}
</motion.ul>
```

## Transitions

### Standard Timings

```tsx
// Use consistent timing across app
const timing = {
  fast: 0.15,    // Micro-interactions
  normal: 0.3,   // Default animations
  slow: 0.5,     // Page transitions
  stagger: 0.05  // Between items
};

// Duration and easing
<motion.div
  animate={{ x: 100 }}
  transition={{ duration: timing.normal, ease: 'easeInOut' }}
/>

// Spring physics (preferred for natural motion)
<motion.div
  animate={{ scale: 1.2 }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
/>

// Keyframes
<motion.div
  animate={{ scale: [1, 1.2, 1] }}
  transition={{ duration: 0.5, times: [0, 0.5, 1] }}
/>

// Repeat
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
/>
```

## Gestures

### Hover, Tap, Focus

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  whileFocus={{ outline: '2px solid blue' }}
  transition={{ duration: 0.15 }}
>
  Click me
</motion.button>

// Complex hover state
<motion.div
  initial="rest"
  whileHover="hover"
  variants={{
    rest: { scale: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    hover: { scale: 1.02, boxShadow: '0 8px 16px rgba(0,0,0,0.15)' }
  }}
>
  Card content
</motion.div>
```

### Drag with Constraints

```tsx
import { useRef } from 'react';

const constraintsRef = useRef(null);

<div ref={constraintsRef} style={{ width: 400, height: 400 }}>
  <motion.div
    drag
    dragConstraints={constraintsRef}
    dragElastic={0.1}
    whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
  >
    Drag me
  </motion.div>
</div>

// Drag along single axis
<motion.div drag="x" dragConstraints={{ left: -100, right: 100 }}>
  Slide horizontal
</motion.div>
```

## Layout Animations

### Automatic Layout Animation

```tsx
// Auto-animates position/size changes
<motion.div layout>
  {expanded ? <FullContent /> : <Summary />}
</motion.div>

// Shared element transitions
<motion.div layoutId="card-123">
  <motion.img layoutId="card-image-123" src={image} />
</motion.div>

// Coordinate sibling animations
import { LayoutGroup } from 'framer-motion';

<LayoutGroup>
  {items.map(item => (
    <motion.div key={item.id} layout>
      {item.content}
    </motion.div>
  ))}
</LayoutGroup>
```

## Page Transitions

### AnimatePresence for Exit Animations

```tsx
import { AnimatePresence } from 'framer-motion';

// Single element
<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      Content
    </motion.div>
  )}
</AnimatePresence>

// Route transitions (with React Router)
import { useLocation } from 'react-router-dom';

const location = useLocation();

<AnimatePresence mode="wait" initial={false}>
  <motion.div
    key={location.pathname}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.3 }}
  >
    <Routes location={location}>
      {/* routes */}
    </Routes>
  </motion.div>
</AnimatePresence>
```

## Stagger Patterns

```tsx
// Parent orchestration
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

<motion.ul variants={listVariants} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.li key={item.id} variants={itemVariants}>
      {item.name}
    </motion.li>
  ))}
</motion.ul>

// Custom stagger with useAnimate
import { useAnimate, stagger } from 'framer-motion';

const [scope, animate] = useAnimate();

useEffect(() => {
  animate('.item', { opacity: 1 }, { delay: stagger(0.05) });
}, []);
```

## Performance

### GPU-Accelerated Properties

```tsx
// ✅ FAST: Only transform and opacity
<motion.div
  animate={{
    opacity: 1,
    scale: 1.2,
    x: 100,
    rotate: 45
  }}
/>

// ❌ SLOW: Layout-affecting properties
<motion.div
  animate={{
    width: 300,    // Triggers layout
    height: 200,   // Triggers layout
    top: 50        // Triggers layout
  }}
/>
```

### willChange Optimization

```tsx
// Hint browser before expensive animations
<motion.div
  style={{ willChange: 'transform' }}
  whileHover={{ scale: 1.1 }}
>
  Content
</motion.div>

// Auto willChange with layout animations
<motion.div layout transition={{ layout: { duration: 0.3 } }}>
  Content
</motion.div>
```

## Accessibility

### Reduced Motion Support

```tsx
import { useReducedMotion } from 'framer-motion';

function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
    >
      Content
    </motion.div>
  );
}

// Disable animations completely
const prefersReducedMotion = useReducedMotion();

<motion.div
  {...(prefersReducedMotion ? {} : {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  })}
>
  Content
</motion.div>
```

### Focus Management

```tsx
// Maintain focus during animations
<AnimatePresence>
  {isOpen && (
    <motion.dialog
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onAnimationComplete={() => {
        // Focus first input after enter animation
        dialogRef.current?.querySelector('input')?.focus();
      }}
    >
      <form>...</form>
    </motion.dialog>
  )}
</AnimatePresence>
```

## Scroll Animations

### useScroll and useInView

```tsx
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';

// Scroll progress indicator
function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

// Parallax effect
function ParallaxSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <div ref={ref}>
      <motion.div style={{ y }}>
        Parallax content
      </motion.div>
    </div>
  );
}

// Trigger animation when element enters viewport
function AnimateOnScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
```

## MotionConfig

### Global Animation Settings

```tsx
import { MotionConfig } from 'framer-motion';

// Apply global settings to all descendants
function App() {
  return (
    <MotionConfig
      reducedMotion="user"  // Respect prefers-reduced-motion
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <YourApp />
    </MotionConfig>
  );
}

// Override transitions for a section
function FastSection() {
  return (
    <MotionConfig transition={{ duration: 0.15 }}>
      <motion.div animate={{ scale: 1.1 }}>
        Uses fast transition
      </motion.div>
    </MotionConfig>
  );
}
```

## Best Practices

- **Use variants** for complex multi-step animations instead of inline objects
- **Prefer spring physics** over duration-based easing for natural motion
- **Only animate transform and opacity** for 60fps performance
- **Always test with reduced motion** enabled (System Preferences → Accessibility)
- **Use layoutId** for shared element transitions between routes/states
- **Wrap exit animations** in AnimatePresence with unique keys
- **Set willChange** on elements with frequent animations
- **Use staggerChildren** instead of manual delays for list animations
- **Combine layout + whileHover** for dynamic interactive layouts
- **Keep transitions under 500ms** for perceived performance

## Anti-Patterns

- ❌ Animating width/height directly (use scale + layout instead)
- ❌ Forgetting AnimatePresence around conditional renders
- ❌ Hardcoding timing values (use constants)
- ❌ Ignoring prefers-reduced-motion
- ❌ Animating non-GPU properties (top, left, width, height, margin)
- ❌ Using motion on every element (overhead for static content)
- ❌ Deep nesting of layout animations (performance hit)
- ❌ Missing keys on AnimatePresence children
- ❌ Using exit without AnimatePresence
- ❌ Animating during SSR (causes hydration mismatches)

## Feedback Loops

**Animation quality:**
```bash
# Check frame rate in Chrome DevTools
# Performance → Record → Look for dropped frames
# Target: 60fps (16.67ms per frame)
```

**Reduced motion test:**
```bash
# macOS: System Settings → Accessibility → Display → Reduce Motion
# Test all animations with this enabled
```

**Performance profiling:**
```tsx
// Use React DevTools Profiler
// Measure commit duration with/without animations
// Aim for <16ms commits
```
````

## File: .claude/skills/languages/go/SKILL.md
````markdown
---
name: go
description: Write Go code following best practices. Use when developing Go applications. Covers error handling, concurrency, and project structure.
---

# Go Development

## Project Structure

```
myproject/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── handler/
│   ├── service/
│   └── repository/
├── pkg/
│   └── shared/
├── go.mod
└── go.sum
```

## Error Handling

```go
// Custom error types
type NotFoundError struct {
    Resource string
    ID       string
}

func (e *NotFoundError) Error() string {
    return fmt.Sprintf("%s not found: %s", e.Resource, e.ID)
}

// Error wrapping
func GetUser(id string) (*User, error) {
    user, err := db.FindUser(id)
    if err != nil {
        return nil, fmt.Errorf("GetUser(%s): %w", id, err)
    }
    return user, nil
}

// Error checking
if errors.Is(err, sql.ErrNoRows) {
    return nil, &NotFoundError{Resource: "user", ID: id}
}
```

## Concurrency

```go
// Goroutines with errgroup
func fetchAll(ctx context.Context, urls []string) ([]Response, error) {
    g, ctx := errgroup.WithContext(ctx)
    results := make([]Response, len(urls))

    for i, url := range urls {
        i, url := i, url // capture loop variables
        g.Go(func() error {
            resp, err := fetch(ctx, url)
            if err != nil {
                return err
            }
            results[i] = resp
            return nil
        })
    }

    if err := g.Wait(); err != nil {
        return nil, err
    }
    return results, nil
}

// Channels
func producer(ch chan<- int) {
    for i := 0; i < 10; i++ {
        ch <- i
    }
    close(ch)
}

func consumer(ch <-chan int) {
    for v := range ch {
        fmt.Println(v)
    }
}
```

## HTTP Handler

```go
func (h *Handler) GetUser(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()
    id := chi.URLParam(r, "id")

    user, err := h.service.GetUser(ctx, id)
    if err != nil {
        var notFound *NotFoundError
        if errors.As(err, &notFound) {
            http.Error(w, err.Error(), http.StatusNotFound)
            return
        }
        http.Error(w, "Internal error", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(user)
}
```

## Testing

```go
func TestGetUser(t *testing.T) {
    t.Parallel()

    tests := []struct {
        name    string
        id      string
        want    *User
        wantErr bool
    }{
        {
            name: "existing user",
            id:   "123",
            want: &User{ID: "123", Email: "test@example.com"},
        },
        {
            name:    "non-existent user",
            id:      "999",
            wantErr: true,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got, err := service.GetUser(context.Background(), tt.id)
            if (err != nil) != tt.wantErr {
                t.Errorf("error = %v, wantErr %v", err, tt.wantErr)
            }
            if !reflect.DeepEqual(got, tt.want) {
                t.Errorf("got = %v, want %v", got, tt.want)
            }
        })
    }
}
```

## Tooling

```bash
# Format
gofmt -w .
goimports -w .

# Lint
golangci-lint run

# Test
go test -v -race -cover ./...
```
````

## File: .claude/skills/languages/hono/SKILL.md
````markdown
---
name: hono
description: Hono 4.x web framework patterns. Use when building APIs, middleware, routing, or server-side applications. Covers multi-runtime support (Node, Bun, Cloudflare Workers), validation, CORS, and error handling.
---

# Hono

> Use Context7 MCP (`resolve-library-id` then `query-docs`) for full API reference, all built-in middleware, and additional runtime setup examples.

## Overview

Lightweight, fast web framework for APIs and server-side applications. Hono 4.x works across Node.js, Bun, Deno, Cloudflare Workers with a consistent API.

**Install**: `pnpm add hono`

## Workflows

**Creating a basic API:**
1. [ ] Create Hono app instance: `const app = new Hono()`
2. [ ] Define routes with HTTP methods
3. [ ] Add middleware (CORS, logger, error handling)
4. [ ] Export app for runtime adapter
5. [ ] Test endpoints with curl or Postman

**Adding validation:**
1. [ ] Install Zod: `pnpm add zod @hono/zod-validator`
2. [ ] Define schemas with Zod
3. [ ] Apply `zValidator` middleware to routes
4. [ ] Handle validation errors
5. [ ] Access type-safe request data via `c.req.valid()`

## Runtime Setup

```typescript
// Node.js
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
const app = new Hono();
serve({ fetch: app.fetch, port: 3000 });

// Bun
export default { port: 3000, fetch: app.fetch };

// Cloudflare Workers
export default app;
```

## Routing

```typescript
// HTTP methods
app.get('/users', (c) => c.json({ users: [] }));
app.post('/users', (c) => c.json({ created: true }, 201));
app.put('/users/:id', (c) => c.json({ updated: true }));
app.delete('/users/:id', (c) => c.json({ deleted: true }));
app.on(['GET', 'POST'], '/multi', (c) => c.text(c.req.method));

// Path parameters
app.get('/users/:id', (c) => {
  const id = c.req.param('id');
  return c.json({ userId: id });
});

// Multiple params
app.get('/posts/:postId/comments/:commentId', (c) => {
  const { postId, commentId } = c.req.param();
  return c.json({ postId, commentId });
});

// Wildcard
app.get('/files/*', (c) => c.text('File handler'));

// Regex constraint (only numeric IDs)
app.get('/posts/:id{[0-9]+}', (c) => c.json({ id: c.req.param('id') }));
```

### Route Groups

```typescript
const v1 = new Hono();
v1.get('/users', (c) => c.json({ version: 1, users: [] }));

const v2 = new Hono();
v2.get('/users', (c) => c.json({ version: 2, users: [] }));

app.route('/api/v1', v1);
app.route('/api/v2', v2);
```

## Request Handling

```typescript
// Query params
app.get('/search', (c) => {
  const q = c.req.query('q');
  const page = c.req.query('page') ?? '1';
  return c.json({ q, page });
});

// JSON body
app.post('/users', async (c) => {
  const body = await c.req.json();
  return c.json({ received: body });
});

// Headers
app.get('/me', (c) => {
  const auth = c.req.header('Authorization');
  c.header('X-Custom-Header', 'value');
  return c.json({ auth });
});
```

## Response Types

```typescript
c.json({ data: 'value' })          // JSON (default 200)
c.json({ created: true }, 201)     // JSON with status
c.text('OK')                       // Plain text
c.html('<h1>Hello</h1>')           // HTML
c.redirect('/new')                 // 302 redirect
c.redirect('https://example.com', 301)
c.notFound()                       // 404
```

## Middleware

```typescript
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { prettyJSON } from 'hono/pretty-json';

app.use('*', logger());
app.use('*', secureHeaders());
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://example.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
if (process.env.NODE_ENV === 'development') {
  app.use('*', prettyJSON());
}
```

### Custom Middleware

```typescript
// Auth middleware — store data in context
const authMiddleware = async (c, next) => {
  const token = c.req.header('Authorization');
  if (!token) return c.json({ error: 'Unauthorized' }, 401);
  c.set('user', { id: 1, name: 'Alice' }); // stored in context
  await next();
};

app.use('/api/*', authMiddleware);

app.get('/api/profile', (c) => {
  const user = c.get('user');
  return c.json({ user });
});
```

## Validation with Zod

```typescript
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const userSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().int().min(0).max(120).optional(),
});

// Validate body
app.post('/users', zValidator('json', userSchema), async (c) => {
  const user = c.req.valid('json'); // fully typed
  return c.json({ created: true, user }, 201);
});

// Validate path params
app.get('/users/:id', zValidator('param', z.object({ id: z.string().regex(/^\d+$/) })), (c) => {
  const { id } = c.req.valid('param');
  return c.json({ userId: id });
});

// Custom validation error response
app.post('/users', zValidator('json', userSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: 'Validation failed', details: result.error.flatten() }, 400);
  }
}), handler);
```

## Error Handling

```typescript
import { HTTPException } from 'hono/http-exception';

// Global error handler
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message, status: err.status }, err.status);
  }
  return c.json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  }, 500);
});

// 404 handler
app.notFound((c) => c.json({ error: 'Not Found', path: c.req.path }, 404));

// Throw HTTP exceptions from route handlers
app.get('/protected', (c) => {
  throw new HTTPException(403, { message: 'Forbidden' });
});
```

## Type Safety

### Typed Context Variables

```typescript
type Env = {
  Variables: { user: { id: number; name: string } };
};

const app = new Hono<Env>();

app.use('/api/*', async (c, next) => {
  c.set('user', { id: 1, name: 'Alice' }); // type-checked
  await next();
});

app.get('/api/profile', (c) => {
  const user = c.get('user'); // fully typed
  return c.json({ user });
});
```

### RPC Type Safety (Hono Client)

```typescript
// server.ts — export the app type
const app = new Hono()
  .get('/posts', (c) => c.json({ posts: [] }))
  .post('/posts', async (c) => c.json({ created: true }, 201));

export type AppType = typeof app;

// client.ts — fully typed calls, no separate OpenAPI spec needed
import { hc } from 'hono/client';
import type { AppType } from './server';

const client = hc<AppType>('http://localhost:3000');
const res = await client.posts.$get();
const data = await res.json(); // { posts: [] }
```

## Testing

```typescript
import { describe, it, expect } from 'vitest';

describe('API', () => {
  const app = new Hono();
  app.get('/hello', (c) => c.json({ message: 'Hello' }));

  it('returns hello', async () => {
    const res = await app.request('/hello');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: 'Hello' });
  });

  it('handles POST', async () => {
    app.post('/users', async (c) => {
      const body = await c.req.json();
      return c.json({ created: true, user: body }, 201);
    });

    const res = await app.request('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Alice' }),
    });

    expect(res.status).toBe(201);
  });
});
```

## Best Practices

- **Use route groups** to organize related endpoints into modular routers
- **Validate all inputs** with Zod for type safety and runtime validation
- **Apply middleware sparingly** - only use what you need per route group
- **Set explicit CORS policies** for production — never use permissive CORS in prod
- **Use typed contexts** (`Hono<Env>`) for variables set in middleware
- **Handle errors globally** with `app.onError()` for consistent error responses
- **Use `HTTPException`** instead of manually constructing error responses
- **Test with `app.request()`** — Hono's built-in test utility (no server needed)
- **Leverage RPC types** for type-safe client-server communication

## Anti-Patterns

- ❌ Applying logger middleware after routes (won't log those routes)
- ❌ Forgetting to `await next()` in middleware (breaks middleware chain)
- ❌ Using `cors()` only on specific routes (preflight requests need global CORS)
- ❌ Parsing request body multiple times (cache after first parse)
- ❌ Not validating path parameters (always validate user input)
- ❌ Using `any` type instead of proper Hono generics
- ❌ Hardcoding origins in CORS config (use environment variables)
- ❌ Missing error handlers (leads to unhandled promise rejections)
- ❌ Forgetting to export app for runtime adapters

## Feedback Loops

**Testing endpoints:**
```bash
curl -X GET http://localhost:3000/api/users
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com"}'
```

**Validation testing:**
```bash
# Should return 400 with validation details
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"","email":"invalid"}'
```

**Performance testing:**
```bash
pnpm add -D autocannon
npx autocannon -c 100 -d 10 http://localhost:3000/api/users
# Target: <10ms p99 latency for simple endpoints
```
````

## File: .claude/skills/languages/kotlin/SKILL.md
````markdown
---
name: kotlin
description: Write Kotlin code for Android following best practices. Use when developing with Jetpack Compose, Android SDK, or Kotlin projects. Covers coroutines, state management, and tooling.
---

# Kotlin / Android Development

## Project Setup

### Gradle Kotlin DSL
```kotlin
// settings.gradle.kts
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "MyApp"
include(":app")
```

### build.gradle.kts (app)
```kotlin
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.example.myapp"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.myapp"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }

    buildFeatures {
        compose = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.material3)

    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
}
```

### Version Catalog (libs.versions.toml)
```toml
[versions]
kotlin = "2.0.0"
compose-bom = "2024.06.00"
lifecycle = "2.8.0"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version = "1.13.1" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycle" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "compose-bom" }

[plugins]
android-application = { id = "com.android.application", version = "8.5.0" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
```

## Type Patterns

### Null Safety
```kotlin
// Safe call operator
val length = name?.length

// Elvis operator
val displayName = user?.name ?: "Guest"

// Safe cast
val number = value as? Int

// Not-null assertion (use sparingly)
val name = user!!.name

// let for null checks
user?.let { safeUser ->
    println(safeUser.name)
}
```

### Sealed Classes
```kotlin
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val exception: Throwable) : Result<Nothing>()
    data object Loading : Result<Nothing>()
}

// Exhaustive when
fun handleResult(result: Result<User>) = when (result) {
    is Result.Success -> showUser(result.data)
    is Result.Error -> showError(result.exception)
    Result.Loading -> showLoading()
}
```

### Data Classes
```kotlin
data class User(
    val id: String,
    val email: String,
    val name: String,
    val createdAt: Instant = Instant.now()
)

// Copy with modifications
val updatedUser = user.copy(name = "New Name")

// Destructuring
val (id, email, name) = user
```

### Value Classes
```kotlin
@JvmInline
value class UserId(val value: String)

@JvmInline
value class Email(val value: String) {
    init {
        require(value.contains("@")) { "Invalid email" }
    }
}
```

## Error Handling

### Result Type
```kotlin
fun parseNumber(input: String): Result<Int> {
    return try {
        Result.success(input.toInt())
    } catch (e: NumberFormatException) {
        Result.failure(e)
    }
}

// Usage
parseNumber("123")
    .onSuccess { number -> println("Parsed: $number") }
    .onFailure { error -> println("Error: ${error.message}") }

// Transform
val doubled = parseNumber("42")
    .map { it * 2 }
    .getOrDefault(0)
```

### runCatching
```kotlin
val result = runCatching {
    riskyOperation()
}.getOrElse { error ->
    logError(error)
    defaultValue
}

// Chain operations
runCatching { fetchUser(id) }
    .mapCatching { user -> processUser(user) }
    .onSuccess { result -> display(result) }
    .onFailure { error -> showError(error) }
```

## Coroutines

### Basic Coroutines
```kotlin
// Suspend function
suspend fun fetchUser(id: String): User {
    return withContext(Dispatchers.IO) {
        api.getUser(id)
    }
}

// Launch coroutine
viewModelScope.launch {
    try {
        val user = fetchUser("123")
        _uiState.value = UiState.Success(user)
    } catch (e: Exception) {
        _uiState.value = UiState.Error(e.message)
    }
}
```

### Flow
```kotlin
// Create flow
fun observeUsers(): Flow<List<User>> = flow {
    while (true) {
        emit(repository.getUsers())
        delay(5000)
    }
}.flowOn(Dispatchers.IO)

// Collect flow
viewModelScope.launch {
    observeUsers()
        .catch { e -> emit(emptyList()) }
        .collect { users ->
            _users.value = users
        }
}
```

### StateFlow
```kotlin
class UserViewModel : ViewModel() {
    private val _uiState = MutableStateFlow<UiState>(UiState.Loading)
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    fun loadUser(id: String) {
        viewModelScope.launch {
            _uiState.value = UiState.Loading
            try {
                val user = repository.getUser(id)
                _uiState.value = UiState.Success(user)
            } catch (e: Exception) {
                _uiState.value = UiState.Error(e.message ?: "Unknown error")
            }
        }
    }
}
```

## Jetpack Compose

### Basic Composable
```kotlin
@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
        text = "Hello, $name!",
        modifier = modifier.padding(16.dp),
        style = MaterialTheme.typography.headlineMedium
    )
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    MyAppTheme {
        Greeting("Android")
    }
}
```

### State Management
```kotlin
@Composable
fun Counter() {
    var count by remember { mutableIntStateOf(0) }

    Column(
        modifier = Modifier.padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Count: $count",
            style = MaterialTheme.typography.headlineMedium
        )
        Spacer(modifier = Modifier.height(8.dp))
        Button(onClick = { count++ }) {
            Text("Increment")
        }
    }
}
```

### ViewModel Integration
```kotlin
@Composable
fun UserScreen(
    viewModel: UserViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    when (val state = uiState) {
        is UiState.Loading -> CircularProgressIndicator()
        is UiState.Success -> UserContent(state.user)
        is UiState.Error -> ErrorMessage(state.message)
    }
}

@Composable
fun UserContent(user: User) {
    Column(modifier = Modifier.padding(16.dp)) {
        Text(user.name, style = MaterialTheme.typography.titleLarge)
        Text(user.email, style = MaterialTheme.typography.bodyMedium)
    }
}
```

### Side Effects
```kotlin
@Composable
fun UserDetailScreen(userId: String, viewModel: UserViewModel = hiltViewModel()) {
    // Run once when userId changes
    LaunchedEffect(userId) {
        viewModel.loadUser(userId)
    }

    // Run on every recomposition
    SideEffect {
        analytics.trackScreen("UserDetail")
    }

    // Cleanup when leaving composition
    DisposableEffect(Unit) {
        val listener = viewModel.addListener()
        onDispose {
            listener.remove()
        }
    }
}
```

## Testing

### Unit Tests (JUnit 5)
```kotlin
class UserViewModelTest {
    @Test
    fun `loadUser updates state to success`() = runTest {
        val repository = mockk<UserRepository>()
        coEvery { repository.getUser("123") } returns User("123", "test@example.com")

        val viewModel = UserViewModel(repository)
        viewModel.loadUser("123")

        assertEquals(
            UiState.Success(User("123", "test@example.com")),
            viewModel.uiState.value
        )
    }

    @Test
    fun `loadUser updates state to error on failure`() = runTest {
        val repository = mockk<UserRepository>()
        coEvery { repository.getUser(any()) } throws IOException("Network error")

        val viewModel = UserViewModel(repository)
        viewModel.loadUser("123")

        assertTrue(viewModel.uiState.value is UiState.Error)
    }
}
```

### Compose UI Tests
```kotlin
class UserScreenTest {
    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun displaysUserName() {
        val user = User("1", "test@example.com", "John Doe")

        composeTestRule.setContent {
            MyAppTheme {
                UserContent(user = user)
            }
        }

        composeTestRule.onNodeWithText("John Doe").assertIsDisplayed()
        composeTestRule.onNodeWithText("test@example.com").assertIsDisplayed()
    }

    @Test
    fun buttonClickIncrementsCounter() {
        composeTestRule.setContent {
            MyAppTheme {
                Counter()
            }
        }

        composeTestRule.onNodeWithText("Count: 0").assertIsDisplayed()
        composeTestRule.onNodeWithText("Increment").performClick()
        composeTestRule.onNodeWithText("Count: 1").assertIsDisplayed()
    }
}
```

## Tooling

```bash
# Build
./gradlew build
./gradlew assembleDebug
./gradlew assembleRelease

# Run tests
./gradlew test                          # Unit tests
./gradlew connectedAndroidTest          # Instrumented tests

# Linting
./gradlew detekt                        # Code smells
./gradlew ktlintCheck                   # Style check
./gradlew ktlintFormat                  # Auto-fix style

# Code analysis
./gradlew lint                          # Android Lint

# Clean
./gradlew clean
```

### detekt.yml
```yaml
build:
  maxIssues: 0

complexity:
  LongMethod:
    threshold: 30
  ComplexCondition:
    threshold: 4

style:
  MaxLineLength:
    maxLineLength: 120
  WildcardImport:
    active: true

naming:
  FunctionNaming:
    functionPattern: '[a-z][a-zA-Z0-9]*'
```

### .editorconfig (ktlint)
```ini
[*.{kt,kts}]
indent_size = 4
max_line_length = 120
ktlint_code_style = android_studio
```
````

## File: .claude/skills/languages/nativewind/SKILL.md
````markdown
---
name: nativewind
description: NativeWind 4.x styling for React Native. Use when applying Tailwind classes to RN components, configuring NativeWind, or converting web Tailwind patterns to mobile.
---

# NativeWind

## Overview

NativeWind 4.x bridges Tailwind CSS 3.x into React Native, enabling `className` props on View, Text, Pressable, ScrollView, and other RN components. Provides familiar Tailwind utility classes with native rendering.

**Install**: `pnpm add nativewind tailwindcss@3` + babel/metro configuration

## Workflows

**Initial setup:**
1. [ ] Install: `pnpm add nativewind tailwindcss@3`
2. [ ] Create `tailwind.config.js` with content paths pointing to `app/`, `components/`, etc.
3. [ ] Create `global.css` with `@tailwind base; @tailwind components; @tailwind utilities;`
4. [ ] Update `babel.config.js`: add `nativewind/babel` preset
5. [ ] Update `metro.config.js`: wrap with `withNativeWind`
6. [ ] Create `nativewind-env.d.ts` with `/// <reference types="nativewind/types" />`
7. [ ] Import `global.css` in root `_layout.tsx`

**Styling a component:**
1. [ ] Import RN component (View, Text, Pressable, etc.)
2. [ ] Apply `className` prop with Tailwind utilities
3. [ ] Use `contentContainerClassName` for ScrollView/FlashList inner styling
4. [ ] Test on device/simulator to verify rendering

## Guidance

### Configuration Files

Three config files are required:

**`babel.config.js`**: Add NativeWind preset
```
presets: ['babel-preset-expo', 'nativewind/babel']
```

**`metro.config.js`**: Wrap Metro config with NativeWind
```
withNativeWind(config, { input: './global.css' })
```

**`tailwind.config.js`**: Standard Tailwind 3.x config with RN content paths
```
content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}']
```

### className Prop

NativeWind adds `className` support to all RN core components:

- `<View className="flex-1 bg-white p-4">`
- `<Text className="text-lg font-bold text-gray-900">`
- `<Pressable className="bg-blue-500 rounded-lg p-3">`
- `<ScrollView className="flex-1" contentContainerClassName="p-4 gap-3">`

### Key Differences from Web Tailwind

| Web Tailwind | NativeWind (RN) | Notes |
|-------------|-----------------|-------|
| `hover:bg-gray-100` | Not available | No hover on touch devices |
| `cursor-pointer` | Not applicable | Use Pressable instead |
| `flex` (row default) | `flex` (column default) | RN flexbox defaults to column |
| Bare strings | Must wrap in `<Text>` | RN requires Text component |
| `div` | `View` | No HTML elements |
| `gap-4` | `gap-4` | Supported in NativeWind 4.x |
| `grid` | Not available | Use flex layouts |

### Conditional Classes

Concatenate class strings conditionally:

```
className={`px-4 py-2 rounded-lg ${isActive ? 'bg-blue-500' : 'bg-gray-200'}`}
```

Or use a utility like `clsx`/`cn` for cleaner conditionals.

### ScrollView Styling

ScrollView has two className targets:

- `className` — outer container styling
- `contentContainerClassName` — inner content styling (padding, gap, alignment)

Always use `contentContainerClassName` for padding and spacing of scroll content.

### Theme Customization

Extend via `tailwind.config.js` theme:

```
theme: {
  extend: {
    colors: { brand: { 50: '...', 500: '...', 900: '...' } },
    fontFamily: { sans: ['Inter'] }
  }
}
```

## Best Practices

- Always create `nativewind-env.d.ts` for TypeScript `className` type support
- Use `contentContainerClassName` on ScrollView, not `className` for inner spacing
- Remember flex defaults to column in RN — add `flex-row` explicitly when needed
- Import `global.css` at the top of root `_layout.tsx`
- Use Tailwind's spacing scale consistently (avoid mixing with StyleSheet)
- Keep `tailwind.config.js` content paths accurate to avoid missing styles
- Use `gap-*` instead of margin between siblings for consistent spacing

## Anti-Patterns

- Mixing `StyleSheet.create()` with `className` in the same component (pick one)
- Using `hover:` or `cursor-` utilities (not available on mobile)
- Forgetting `contentContainerClassName` on ScrollView (padding won't work on `className`)
- Using `grid` utilities (not supported in RN — use flex layouts)
- Placing bare strings without `<Text>` wrapper (crashes on RN)
- Not including all source directories in `tailwind.config.js` content array
- Using Tailwind CSS 4.x syntax (NativeWind requires Tailwind 3.x)
````

## File: .claude/skills/languages/python/SKILL.md
````markdown
---
name: python
description: Write Python code following best practices. Use when developing Python applications. Covers type hints, async, and modern tooling.
---

# Python Development

## Project Setup

```bash
# Create project with uv
uv init my-project
cd my-project

# Add dependencies
uv add litestar
uv add --dev pytest ruff mypy
```

### pyproject.toml
```toml
[project]
name = "my-project"
version = "0.1.0"
requires-python = ">=3.13"
dependencies = ["litestar>=2.0"]

[tool.ruff]
line-length = 88
target-version = "py313"

[tool.mypy]
strict = true
python_version = "3.13"
```

## Type Hints

```python
from typing import TypeVar, Generic
from collections.abc import Sequence

T = TypeVar('T')

class Repository(Generic[T]):
    async def find_by_id(self, id: str) -> T | None:
        ...

    async def save(self, entity: T) -> T:
        ...

def process_items(items: Sequence[str]) -> list[str]:
    return [item.upper() for item in items]
```

## Async Patterns

```python
import asyncio
from collections.abc import AsyncIterator

async def fetch_all(urls: list[str]) -> list[Response]:
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_one(session, url) for url in urls]
        return await asyncio.gather(*tasks)

async def stream_data() -> AsyncIterator[bytes]:
    async with aiofiles.open('large.csv', 'rb') as f:
        async for chunk in f:
            yield chunk
```

## Error Handling

```python
from dataclasses import dataclass
from typing import TypeVar, Generic

T = TypeVar('T')
E = TypeVar('E')

@dataclass
class Ok(Generic[T]):
    value: T

@dataclass
class Err(Generic[E]):
    error: E

Result = Ok[T] | Err[E]

def divide(a: int, b: int) -> Result[float, str]:
    if b == 0:
        return Err("Division by zero")
    return Ok(a / b)
```

## Testing with pytest

```python
import pytest
from unittest.mock import AsyncMock

@pytest.mark.asyncio
async def test_create_user():
    repo = AsyncMock()
    service = UserService(repo)

    user = await service.create("test@example.com")

    assert user.email == "test@example.com"
    repo.save.assert_called_once()

@pytest.fixture
def mock_database():
    with patch('app.database') as mock:
        yield mock
```

## Tooling

```bash
# Ruff (linting + formatting)
ruff check --fix .
ruff format .

# MyPy (type checking)
mypy --strict .

# pytest
pytest -v --cov=src
```
````

## File: .claude/skills/languages/radix-ui/SKILL.md
````markdown
---
name: radix-ui
description: Radix UI primitive patterns. Use when building accessible, unstyled UI components like dialogs, dropdowns, tooltips, tabs, and selects. Covers Tailwind styling, keyboard navigation, animations, and portal management.
---

# Radix UI

> **Platform:** Web only. For mobile modals/sheets, see the **expo-sdk** and **react-native-patterns** skills.

> Use Context7 MCP (`resolve-library-id` then `query-docs`) for full API reference, all component props, and additional examples.

## Overview

Unstyled, accessible UI primitives for React with built-in keyboard navigation, focus management, and ARIA attributes. Designed to be composed with Tailwind CSS and Framer Motion.

**Version**: Latest (individual packages) or `radix-ui` unified package

**Install (individual packages)**:
```bash
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-tooltip @radix-ui/react-tabs
```

**Install (unified package)**:
```bash
pnpm add radix-ui
```

The unified `radix-ui` package bundles all primitives - use this for simpler dependency management.

## Workflows

**Adding a Dialog:**
1. [ ] Install: `pnpm add @radix-ui/react-dialog`
2. [ ] Import Dialog parts: Root, Trigger, Portal, Overlay, Content
3. [ ] Wrap Overlay and Content in Portal for proper stacking
4. [ ] Style with Tailwind and data-[state=] selectors
5. [ ] Test keyboard navigation (Esc to close, Tab trap)
6. [ ] Add Framer Motion animations if needed

**Adding a Select:**
1. [ ] Install: `pnpm add @radix-ui/react-select`
2. [ ] Import Select parts: Root, Trigger, Portal, Content, Item
3. [ ] Add Icon and Value to Trigger for visual feedback
4. [ ] Style open/closed states with data-[state=open]
5. [ ] Test keyboard (Arrow keys, Enter, Type-ahead)
6. [ ] Ensure proper z-index for Portal

**Adding Tooltips:**
1. [ ] Install: `pnpm add @radix-ui/react-tooltip`
2. [ ] Wrap app with TooltipProvider (once, at root)
3. [ ] Compose Trigger and Content for each tooltip
4. [ ] Set delayDuration for hover timing
5. [ ] Verify screen reader announcements

## Dialog (Modal)

```tsx
import * as Dialog from '@radix-ui/react-dialog';
// OR: import { Dialog } from 'radix-ui';

function ModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Open Dialog</button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[85vh] w-[90vw] max-w-[500px] rounded-lg bg-white p-6 shadow-lg">
          {/* Title and Description are required for accessibility */}
          <Dialog.Title className="text-lg font-semibold mb-2">Dialog Title</Dialog.Title>
          <Dialog.Description className="text-sm text-gray-600 mb-4">
            Screen readers announce this description.
          </Dialog.Description>

          <div className="flex justify-end gap-2 mt-6">
            <Dialog.Close asChild>
              <button className="px-4 py-2 border rounded">Cancel</button>
            </Dialog.Close>
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

**Framer Motion animations**: Use `forceMount` on Portal and wrap with `AnimatePresence`. Pass `asChild` to Overlay/Content and use `motion.div` as the child.

## Select (Dropdown)

```tsx
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons';

function SelectExample() {
  return (
    <Select.Root defaultValue="apple">
      <Select.Trigger className="inline-flex items-center justify-between rounded px-4 py-2 text-sm bg-white border gap-2 data-[placeholder]:text-gray-400 min-w-[200px]">
        <Select.Value placeholder="Select a fruit..." />
        <Select.Icon><ChevronDownIcon /></Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg border">
          <Select.Viewport className="p-1">
            <Select.Item value="apple" className="relative flex items-center px-8 py-2 rounded text-sm hover:bg-blue-50 outline-none cursor-pointer data-[disabled]:opacity-50">
              <Select.ItemIndicator className="absolute left-2"><CheckIcon /></Select.ItemIndicator>
              <Select.ItemText>Apple</Select.ItemText>
            </Select.Item>
            <Select.Item value="banana" className="relative flex items-center px-8 py-2 rounded text-sm hover:bg-blue-50 outline-none cursor-pointer">
              <Select.ItemIndicator className="absolute left-2"><CheckIcon /></Select.ItemIndicator>
              <Select.ItemText>Banana</Select.ItemText>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
```

Use `Select.Group` + `Select.Label` for grouped options, `Select.Separator` for dividers.

## Styling with Tailwind

### Key Data Attribute Selectors

```tsx
// Open/closed state
className="data-[state=open]:bg-blue-50 data-[state=closed]:bg-gray-50"

// Disabled
className="data-[disabled]:opacity-50 data-[disabled]:pointer-events-none"

// Checked (checkboxes, radio items)
className="data-[state=checked]:bg-blue-600"

// Side-based positioning
className="data-[side=top]:animate-slide-down data-[side=bottom]:animate-slide-up"
```

### Common Layout Patterns

```tsx
// Focus ring (required for keyboard UX)
className="outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"

// Centered modal
className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"

// Backdrop overlay
className="fixed inset-0 bg-black/50 backdrop-blur-sm"
```

## Accessibility

**Keyboard navigation** (handled automatically):
- **Dialog**: Esc to close, Tab trap inside modal
- **Select**: Arrow keys, Enter to select, type-ahead search
- **DropdownMenu**: Arrow keys, Enter to select
- **Tabs**: Arrow keys, Home/End for first/last
- **Tooltip**: Focus trigger shows tooltip

**ARIA** (added automatically):
- Dialog: `role="dialog"`, `aria-labelledby` (Title), `aria-describedby` (Description)
- Select: `role="combobox"`, `aria-expanded`, `aria-controls`

**Always provide** `Dialog.Title` and `Dialog.Description` — screen readers depend on them.

**Custom focus management:**
```tsx
<Dialog.Content
  onOpenAutoFocus={(e) => { e.preventDefault(); customRef.current?.focus(); }}
  onCloseAutoFocus={(e) => { e.preventDefault(); triggerRef.current?.focus(); }}
>
```

## Controlled vs Uncontrolled

```tsx
// Uncontrolled — component manages its own state
<Dialog.Root defaultOpen={false}>

// Controlled — parent manages state (preferred for complex UIs)
const [open, setOpen] = useState(false);
<Dialog.Root open={open} onOpenChange={setOpen}>
```

## Portal Usage

Always portal overlays and dropdowns to avoid z-index conflicts, `overflow: hidden` clipping, and CSS transform issues:

```tsx
<Dialog.Portal>          {/* renders at document.body */}
  <Dialog.Overlay />
  <Dialog.Content />
</Dialog.Portal>

{/* Custom container */}
<Dialog.Portal container={customContainerRef.current}>
```

## Best Practices

- **Use `asChild` prop** to compose with custom elements without wrapper divs
- **Always Portal** overlays and dropdowns to avoid z-index issues
- **Provide Title and Description** for all Dialogs (accessibility requirement)
- **Use data-[state=] selectors** for open/closed state styling
- **Prefer controlled** for complex state management
- **One TooltipProvider** at app root — not per tooltip
- **Test keyboard navigation** for every interactive component

## Anti-Patterns

- ❌ Forgetting `Dialog.Portal` (causes z-index issues)
- ❌ Missing `Dialog.Title` or `Dialog.Description` (fails a11y)
- ❌ Not using `asChild` with custom triggers (creates wrapper divs)
- ❌ Multiple `TooltipProvider` instances (unnecessary overhead)
- ❌ Using controlled without `onOpenChange`/`onValueChange`
- ❌ Mixing controlled and uncontrolled patterns
- ❌ Forgetting `focus:ring` styles (poor keyboard UX)
- ❌ Not testing with keyboard navigation

## Feedback Loops

**Accessibility testing:**
```bash
# Test with keyboard only (no mouse)
# Tab through all interactive elements
# Esc should close Dialogs, Dropdowns, Selects
# Arrow keys should navigate menus and selects
```

**Screen reader testing:**
```bash
# macOS: VoiceOver (Cmd+F5)
# Verify Dialog.Title and Dialog.Description are announced
# Check for proper role attributes
```

**Visual regression**: Test all states: Closed vs Open, Hover vs Focus, Selected vs Unselected, Disabled, different viewport sizes.

**Framer Motion**: Use `forceMount` + `AnimatePresence`. Test that focus management still works with animations.
````

## File: .claude/skills/languages/react-native-patterns/SKILL.md
````markdown
---
name: react-native-patterns
description: React Native component and interaction patterns. Use when building Pressable components, ScrollViews, lists, bottom sheets, accessibility, navigation, or handling RN-specific requirements like Text wrapping and touch targets.
---

# React Native Patterns

## Overview

Patterns for building maintainable React Native components. Covers touch interactions (Pressable), list rendering (FlashList), modal patterns (bottom sheets), accessibility, navigation, and RN-specific requirements that differ from web React.

> For React web patterns (hooks, context, composition), see the **react-patterns** skill.

## Workflows

**Building an interactive screen:**
1. [ ] Set up SafeAreaView or apply safe area insets
2. [ ] Use Pressable for all interactive elements (44pt minimum)
3. [ ] Add haptic feedback on primary actions
4. [ ] Use FlashList for lists, ScrollView for fixed content
5. [ ] Implement bottom sheet for detail/modal views
6. [ ] Add accessibility labels to all interactive elements
7. [ ] Test on device for touch targets and scroll performance

## Guidance

### Pressable (not TouchableOpacity)

`Pressable` is the standard touch component. `TouchableOpacity` is deprecated.

Key principles:
- **44pt minimum touch target** on all interactive elements
- Use `hitSlop` to expand touch area beyond visual bounds: `hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}`
- Style feedback via `style` function: `style={({ pressed }) => [pressed && { opacity: 0.7 }]}`
- Or use NativeWind: `className="active:opacity-70"`
- Add haptics on press for primary actions: `onPress={() => { Haptics.impactAsync(); doAction(); }}`

### Text-Only Strings Rule

React Native requires all visible text to be wrapped in `<Text>`:

```
✅ <View><Text>Hello</Text></View>
❌ <View>Hello</View>  // Crashes at runtime
```

This applies to conditional renders, string interpolation, and JSX expressions. Always wrap strings in Text.

### ScrollView Patterns

Two className targets:
- `className` — outer container (flex, background)
- `contentContainerClassName` — inner content (padding, gap, alignment)

Use `ScrollView` for screens with fixed, non-dynamic content. Use `FlashList` for dynamic lists.

`showsVerticalScrollIndicator={false}` for cleaner visual when custom scroll indicators are used.

### FlashList Patterns

High-performance list rendering:
- `estimatedItemSize` is **required** — estimate average item height in points
- `renderItem` receives `{ item, index }` — keep render function pure
- `keyExtractor` — use unique string ID from data
- `contentContainerClassName` — NativeWind styling for inner content
- `ItemSeparatorComponent` — consistent spacing between items
- `ListEmptyComponent` — graceful empty state

### Bottom Sheet as Modal

`@gorhom/bottom-sheet` replaces web modal dialogs:

- Define `snapPoints` array: `['25%', '50%', '90%']`
- Use `BottomSheetModal` with `BottomSheetModalProvider` for imperative control
- `BottomSheetScrollView` for scrollable sheet content
- `BottomSheetBackdrop` for press-to-dismiss overlay
- Present: `bottomSheetRef.current?.present()`
- Dismiss: `bottomSheetRef.current?.dismiss()`

### expo-image Patterns

Use for all image display:
- Remote images: `source={{ uri: 'https://...' }}`
- Local images: `source={require('../assets/image.png')}`
- Blurhash placeholder: `placeholder="LKO2?U%2Tw=w]~RBVZRi}"` for loading state
- `contentFit="cover"` for card thumbnails, `"contain"` for full images
- `transition={300}` for smooth fade-in on load

### Accessibility

Required accessibility props for interactive elements:

| Prop | Purpose | Example |
|------|---------|---------|
| `accessibilityRole` | Semantic role | `"button"`, `"link"`, `"image"` |
| `accessibilityLabel` | Screen reader text | `"Open settings"` |
| `accessibilityHint` | Action description | `"Opens the settings screen"` |
| `accessibilityState` | Dynamic state | `{ selected: true, disabled: false }` |
| `accessible` | Marks as accessible | Default `true` for Pressable |

Guidelines:
- All Pressable elements need `accessibilityLabel`
- Images need `accessibilityLabel` describing content
- Use `accessibilityRole="header"` for screen titles
- Toggle/checkbox: set `accessibilityState={{ checked: isChecked }}`
- Disabled elements: `accessibilityState={{ disabled: true }}`

### Chat-Forward Component Patterns

Demos use a chat-forward interface where the conversation thread is the primary UI.

#### Chat Screen Layout

Three zones:
- **Header**: Minimal — title, back nav, optional status. Uses safe area top inset.
- **Message stream**: FlashList or inverted ScrollView for the conversation. Agent and user messages alternate. Rich content is embedded within agent message components.
- **Input bar**: Text input pinned to bottom. Uses `KeyboardAvoidingView` (iOS) or `android:windowSoftInputMode="adjustResize"`. Safe area bottom inset for home indicator. Optional quick-action chips above the text field.

#### Message Bubble

Agent and user bubbles have distinct styling (alignment, color, shape):
- **Agent bubble**: Left-aligned, neutral background, can contain child components (cards, summaries, action buttons)
- **User bubble**: Right-aligned, accent background, text only
- Bubbles animate in with `FadeInDown.duration(300)` on append

#### Inline Rich Card

Compact data card rendered as a child of an agent message bubble:
- Photo thumbnail (expo-image) + title + key metric + status badge
- Tappable — opens bottom sheet with full detail
- For card sets: horizontal `ScrollView` within the message, or vertical stack
- Stagger animation: `FadeInDown.delay(index * 50).duration(300)`

#### Summary Card

Running totals/status that updates as the conversation progresses:
- Shows aggregated state: Keep ($X), Sell ($Y), Donate ($Z), Progress (N%)
- Can be rendered as a sticky element above the input bar for persistent visibility
- Content crossfades on update (150ms timing)

#### Prompt Card

Agent suggestion with embedded action buttons:
- Text prompt + 1-3 action buttons inline
- Buttons are Pressable with 44pt targets, haptic on press
- After tap, the prompt card updates to show the confirmed action
- E.g., *"Want me to find pickup options?"* → [Yes] [Not now]

#### Comparison View

Before/after or side-by-side content within a message:
- Two expo-image instances with labels (Before / After)
- Optional delta annotation (e.g., "New scratch detected")

#### Timeline View

Chronological event list rendered inline within an agent message:
- Compact: date + title + icon per event
- Expandable: tap to show detail (inline expand or bottom sheet)
- Vertical line connector between events

#### Notification Message

Proactive agent alert that appears as a new message in the thread:
- Distinctive styling (icon + emphasis color) to differentiate from regular agent messages
- Can contain inline action buttons
- E.g., *"Storm season starts in 6 weeks. Your basement still shows moisture risk."*

### Navigation from Components

Use Expo Router's `useRouter()` hook:

- `router.push('/path')` — navigate forward (adds to stack)
- `router.replace('/path')` — replace current screen
- `router.back()` — go back
- `router.canGoBack()` — check if back navigation possible
- Pass params: `router.push({ pathname: '/detail/[id]', params: { id: '123' } })`

## Best Practices

- Always use `Pressable` over `TouchableOpacity` or `TouchableHighlight`
- Enforce 44pt minimum touch targets — use `hitSlop` when visual is smaller
- Wrap every visible string in `<Text>` — no bare strings in JSX
- Use `expo-image` for all images (never RN `Image`)
- Add `accessibilityLabel` to every interactive element
- Use `FlashList` with `estimatedItemSize` for any list with >10 items
- Use `contentContainerClassName` for ScrollView/FlashList inner styling
- Add haptic feedback sparingly — primary actions only
- Test touch targets on real device (simulator touch is imprecise)

## Anti-Patterns

- Using `TouchableOpacity` (deprecated — use Pressable)
- Touch targets smaller than 44pt without `hitSlop` compensation
- Bare strings without `<Text>` wrapper (runtime crash)
- Using RN `Image` instead of `expo-image` (no caching, no blurhash)
- Forgetting `estimatedItemSize` on FlashList
- Using `FlatList` for large datasets (FlashList is faster)
- Missing `accessibilityLabel` on interactive elements
- Using `Alert.alert()` for complex choices (use bottom sheet instead)
- Padding on `className` of ScrollView (use `contentContainerClassName`)
- Inline anonymous functions in FlashList `renderItem` (causes re-renders — extract component)
````

## File: .claude/skills/languages/react-patterns/SKILL.md
````markdown
---
name: react-patterns
description: React development patterns. Use when building React components, managing state, creating custom hooks, or optimizing React applications. Covers React 19 features, TypeScript integration, and composition patterns.
---

# React Patterns

> **Platform:** Web and Mobile (shared React patterns). For React Native-specific patterns (Pressable, ScrollView, FlashList, safe areas), see the **react-native-patterns** skill.

## Overview
Patterns for building maintainable React applications with TypeScript, leveraging React 19 features and composition patterns.

> **API Reference:** Use Context7 MCP for full React API reference (`mcp__context7__resolve-library-id` → `react`).

## Workflows

- [ ] Choose appropriate component composition pattern
- [ ] Apply TypeScript types for props and events
- [ ] Implement custom hooks for shared logic
- [ ] Add performance optimizations where needed
- [ ] Handle loading and error states with Suspense/boundaries
- [ ] Validate component render behavior

## Feedback Loops

- [ ] Components render without TypeScript errors
- [ ] Props are properly typed and validated
- [ ] Custom hooks have clear return types
- [ ] No unnecessary re-renders (use React DevTools Profiler)
- [ ] Error boundaries catch component errors
- [ ] Loading states work with Suspense

## Reference Implementation

### 1. Component Composition

#### Compound Components
```tsx
// Shares implicit state between parent and children
const TabsContext = createContext<{ activeTab: string; setActiveTab: (id: string) => void } | null>(null);

function Tabs({ children, defaultTab }: { children: ReactNode; defaultTab: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return <TabsContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabsContext.Provider>;
}

function Tab({ id, children }: { id: string; children: ReactNode }) {
  const ctx = use(TabsContext);
  if (!ctx) throw new Error('Tab must be used within Tabs');
  return (
    <button role="tab" aria-selected={ctx.activeTab === id} onClick={() => ctx.setActiveTab(id)}>
      {children}
    </button>
  );
}
```

#### Slot Pattern
```tsx
// Named slots for flexible composition
interface CardProps { header?: ReactNode; footer?: ReactNode; children: ReactNode; }

function Card({ header, footer, children }: CardProps) {
  return (
    <div className="card">
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}
```

### 2. React 19 Features

#### use() Hook
```tsx
// Unwrap promises and context — simpler than useContext
function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise); // Suspends until resolved
  return <div>{user.name}</div>;
}
```

#### useActionState
```tsx
async function updateUser(prevState: { error?: string }, formData: FormData) {
  'use server';
  return { error: undefined };
}

function UserForm() {
  const [state, formAction, isPending] = useActionState(updateUser, {});
  return (
    <form action={formAction}>
      <input name="name" disabled={isPending} />
      {state.error && <p className="error">{state.error}</p>}
      <button disabled={isPending}>{isPending ? 'Saving...' : 'Save'}</button>
    </form>
  );
}
```

#### useOptimistic
```tsx
function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, newTodo]
  );
  async function handleAdd(formData: FormData) {
    const todo = { id: crypto.randomUUID(), text: formData.get('text') as string };
    addOptimisticTodo(todo);
    await saveTodo(todo);
  }
  return (
    <form action={handleAdd}>
      {optimisticTodos.map(todo => <li key={todo.id}>{todo.text}</li>)}
      <input name="text" /><button>Add</button>
    </form>
  );
}
```

### 3. Custom Hooks

```tsx
// Object return for multiple named values
function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const login = async (credentials: Credentials) => { setUser(await api.login(credentials)); };
  return { user, loading, login };
}

// Tuple return for positional access (like useState)
function useToggle(initial = false): [boolean, () => void] {
  const [value, setValue] = useState(initial);
  return [value, useCallback(() => setValue(v => !v), [])];
}

// Composing hooks
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue] as const;
}
```

### 4. TypeScript + React

```tsx
// Extend HTML element props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}
function Button({ variant = 'primary', loading, children, ...props }: ButtonProps) {
  return <button className={variant} disabled={loading} {...props}>{loading ? 'Loading...' : children}</button>;
}

// Generic components with full type inference
interface ListProps<T> { items: T[]; renderItem: (item: T) => ReactNode; keyExtractor: (item: T) => string; }
function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return <ul>{items.map(item => <li key={keyExtractor(item)}>{renderItem(item)}</li>)}</ul>;
}

// Refs as props (React 19+) — forwardRef is deprecated
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  ref?: React.Ref<HTMLInputElement>;
}
function Input({ label, ref, ...props }: InputProps) {
  return <label>{label}<input ref={ref} {...props} /></label>;
}
```

### 5. State Management

#### useReducer for Complex State
```tsx
type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: User[] }
  | { type: 'FETCH_ERROR'; payload: string };

function reducer(state: { data: User[]; loading: boolean; error: string | null }, action: Action) {
  switch (action.type) {
    case 'FETCH_START': return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS': return { ...state, loading: false, data: action.payload };
    case 'FETCH_ERROR': return { ...state, loading: false, error: action.payload };
  }
}
```

### 6. Performance Patterns

```tsx
// memo + useCallback prevent unnecessary re-renders
const ListItem = memo(function ListItem({ item, onDelete }: ItemProps) {
  return <li>{item.name}<button onClick={() => onDelete(item.id)}>Delete</button></li>;
});

function List() {
  const [items, setItems] = useState<Item[]>([]);
  const handleDelete = useCallback((id: string) => {
    setItems(items => items.filter(item => item.id !== id));
  }, []);
  return <>{items.map(item => <ListItem key={item.id} item={item} onDelete={handleDelete} />)}</>;
}

// Lazy loading with Suspense
const Dashboard = lazy(() => import('./Dashboard'));
function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes><Route path="/dashboard" element={<Dashboard />} /></Routes>
    </Suspense>
  );
}
```

### 7. Error Handling

```tsx
class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError(): { hasError: boolean } { return { hasError: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error(error, info); }
  render() {
    return this.state.hasError ? (this.props.fallback ?? <div>Something went wrong</div>) : this.props.children;
  }
}

// Wrap async data loading with Suspense
function UserProfile({ userId }: { userId: string }) {
  const user = use(fetchUser(userId)); // Suspends
  return <div>{user.name}</div>;
}
```

## Best Practices

- **Composition over inheritance** - Use composition patterns for flexibility
- **Type everything** - Leverage TypeScript for compile-time safety
- **Colocate state** - Keep state as close to where it's used as possible
- **Extract custom hooks** - Share logic across components with hooks
- **Stable references** - Use useCallback/useMemo to prevent unnecessary re-renders
- **Error boundaries** - Wrap component trees to catch rendering errors
- **Suspense for loading** - Use Suspense instead of manual loading states
- **Avoid prop drilling** - Use context or composition for deeply nested props

## Anti-Patterns

- **Using forwardRef in React 19** - Use ref as a regular prop instead
- **Class components for new code** - Use function components and hooks
- **Mutating state directly** - Always use setState or reducer actions
- **Missing dependency arrays** - Include all dependencies in useEffect/useMemo/useCallback
- **Overusing useMemo/useCallback** - Only optimize when necessary (profile first)
- **Context for everything** - Use context sparingly; prefer props or state management library
- **Derived state in useState** - Compute derived values during render instead
- **useEffect for derived state** - Use useMemo or compute directly in render
- **Index as key** - Use stable unique IDs for list keys
- **Ignoring TypeScript errors** - Never use 'any' or '// @ts-ignore' as shortcuts
````

## File: .claude/skills/languages/reanimated/SKILL.md
````markdown
---
name: react-native-reanimated
description: React Native Reanimated 4.x animation patterns. Use when adding animations, transitions, entering/exiting effects, or gesture-driven animations to React Native screens. Replaces Framer Motion for mobile.
---

# React Native Reanimated

## Overview

UI-thread animation library for React Native. Reanimated 4.x runs animations on the native UI thread for guaranteed 60fps performance, replacing Framer Motion for mobile applications. Provides shared values, animated styles, declarative entering/exiting transitions, and gesture integration.

**Install**: `pnpm add react-native-reanimated` (included with Expo SDK 54+)

## Workflows

**Adding animations to a screen:**
1. [ ] Import from `react-native-reanimated`: `Animated`, `useSharedValue`, `useAnimatedStyle`, `withTiming`
2. [ ] Create shared values for animated properties
3. [ ] Define animated styles using `useAnimatedStyle`
4. [ ] Apply to `Animated.View`, `Animated.Text`, etc.
5. [ ] Check `useReducedMotion()` and skip animations when true
6. [ ] Test on device for smooth 60fps

**Adding entering/exiting transitions:**
1. [ ] Import layout animations: `FadeInDown`, `FadeOutUp`, `SlideInRight`, etc.
2. [ ] Apply `entering` and `exiting` props on `Animated.View`
3. [ ] Chain modifiers: `.duration(300).easing(...).delay(100)`
4. [ ] Verify reduced motion handling

## Guidance

### Core Primitives

- **`useSharedValue(initialValue)`**: Mutable value that lives on UI thread
- **`useAnimatedStyle(() => ({...}))`**: Derives style object from shared values
- **`withTiming(toValue, config)`**: Duration-based animation
- **`withSpring(toValue, config)`**: Physics-based spring animation
- **`withDelay(ms, animation)`**: Delay before animation starts
- **`withSequence(...animations)`**: Run animations in sequence
- **`withRepeat(animation, count, reverse)`**: Repeat animation

### Standard Timing Configs

Consistent with demo-development.md durations:

| Type | Duration | Use |
|------|----------|-----|
| Fast | 150ms | Micro-interactions, haptic responses |
| Normal | 300ms | Default transitions, entering |
| Slow | 500ms | Emphasis, screen transitions |
| Stagger offset | 50ms per item | List item reveals |

Easing: `Easing.out(Easing.cubic)` for entrances, `Easing.inOut(Easing.cubic)` for transitions, `Easing.in(Easing.cubic)` for exits.

### Declarative Entering/Exiting

Apply directly to `Animated.View` — no parent wrapper needed (unlike AnimatePresence):

- **Entering**: `FadeIn`, `FadeInDown`, `FadeInUp`, `SlideInRight`, `ZoomIn`
- **Exiting**: `FadeOut`, `FadeOutUp`, `FadeOutDown`, `SlideOutLeft`, `ZoomOut`
- **Chain modifiers**: `.duration(300)`, `.delay(100)`, `.easing(Easing.out(Easing.cubic))`
- **Spring**: `.springify().damping(15).stiffness(150)`

### Stagger Pattern

Use `withDelay` with index multiplication:

```
entering={FadeInDown.delay(index * 50).duration(300)}
```

Or for imperative animations:
```
offset.value = withDelay(index * 50, withTiming(1, { duration: 300 }))
```

### Accessibility — Reduced Motion

Always respect the user's accessibility preference:

```
const reducedMotion = useReducedMotion();
```

When `reducedMotion` is true:
- Skip all animations (set values instantly)
- Use `duration(0)` or don't apply entering/exiting props
- Still show content — just don't animate it

### Animated Components

Use `Animated.View`, `Animated.Text`, `Animated.ScrollView`, etc. Or create animated versions:

```
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
```

### Performance

- **Animate only `transform` and `opacity`** — these run on the UI thread
- Avoid animating `width`, `height`, `margin`, `padding` (causes layout recalculation)
- Shared values update on UI thread without JS bridge overhead
- `useAnimatedStyle` worklets run on UI thread — keep them pure
- For lists, use `entering`/`exiting` on items rather than animating the container

## Best Practices

- Use declarative `entering`/`exiting` for mount/unmount animations — simpler than manual shared values
- Prefer `withSpring` for natural-feeling interactions (drag, gestures)
- Prefer `withTiming` for UI transitions (screen enter, fade in)
- Always check `useReducedMotion()` before applying animations
- Keep standard durations consistent: 150ms / 300ms / 500ms
- Use `withDelay(index * 50, ...)` for staggered list reveals
- Combine with `react-native-gesture-handler` for gesture-driven animations
- Use `Easing.out(Easing.cubic)` as default easing for entrances

## Anti-Patterns

- Using React Native's built-in `Animated` API instead of Reanimated
- Animating layout properties (`width`, `height`, `margin`) — use `transform` and `opacity`
- Forgetting `useReducedMotion()` accessibility check
- Running JS-thread-heavy logic inside `useAnimatedStyle` worklets
- Hardcoding duration values (use constants: 150/300/500ms)
- Nesting many animated views unnecessarily (performance overhead)
- Using `setTimeout` for stagger instead of `withDelay`
- Applying entering animations without testing on real device
````

## File: .claude/skills/languages/rust/SKILL.md
````markdown
---
name: rust
description: Write Rust code following best practices. Use when developing Rust applications. Covers ownership, error handling, and async patterns.
---

# Rust Development

## Project Structure

```
my-project/
├── Cargo.toml
├── src/
│   ├── main.rs
│   ├── lib.rs
│   └── handlers/
│       └── mod.rs
└── tests/
    └── integration.rs
```

## Error Handling

```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("User not found: {0}")]
    NotFound(String),

    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),

    #[error("Validation error: {0}")]
    Validation(String),
}

// Using Result
async fn get_user(id: &str) -> Result<User, AppError> {
    let user = sqlx::query_as!(User, "SELECT * FROM users WHERE id = $1", id)
        .fetch_optional(&pool)
        .await?
        .ok_or_else(|| AppError::NotFound(id.to_string()))?;

    Ok(user)
}

// Using ? operator
fn process() -> Result<(), AppError> {
    let user = get_user("123")?;
    validate(&user)?;
    save(&user)?;
    Ok(())
}
```

## Ownership & Borrowing

```rust
// Ownership transfer
fn take_ownership(s: String) {
    println!("{}", s);
} // s is dropped here

// Borrowing (immutable)
fn borrow(s: &String) {
    println!("{}", s);
}

// Mutable borrowing
fn mutate(s: &mut String) {
    s.push_str(" world");
}

// Lifetimes
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
```

## Async with Tokio

```rust
use tokio;

#[tokio::main]
async fn main() {
    let result = fetch_data().await;
}

async fn fetch_all(urls: Vec<String>) -> Vec<Response> {
    let futures: Vec<_> = urls
        .into_iter()
        .map(|url| tokio::spawn(async move { fetch(&url).await }))
        .collect();

    let results = futures::future::join_all(futures).await;
    results.into_iter().filter_map(|r| r.ok()).collect()
}
```

## Axum Web Handler

```rust
use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};

async fn get_user(
    State(pool): State<PgPool>,
    Path(id): Path<String>,
) -> Result<Json<User>, (StatusCode, String)> {
    let user = sqlx::query_as!(User, "SELECT * FROM users WHERE id = $1", id)
        .fetch_optional(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::NOT_FOUND, "User not found".to_string()))?;

    Ok(Json(user))
}
```

## Testing

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validation() {
        let result = validate("valid@email.com");
        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn test_async_operation() {
        let result = fetch_data().await;
        assert!(result.is_ok());
    }
}
```

## Tooling

```bash
# Format
cargo fmt

# Lint
cargo clippy -- -D warnings

# Test
cargo test

# Build release
cargo build --release
```
````

## File: .claude/skills/languages/swift/SKILL.md
````markdown
---
name: swift
description: Write Swift code for iOS/macOS following best practices. Use when developing with SwiftUI, UIKit, or Swift packages. Covers type safety, concurrency, and tooling.
---

# Swift / iOS Development

## Project Setup

### Swift Package Manager
```bash
# Initialize new package
swift package init --type executable

# Add dependencies to Package.swift
# swift package update
```

### Package.swift
```swift
// swift-tools-version: 5.10
import PackageDescription

let package = Package(
    name: "MyApp",
    platforms: [.iOS(.v17), .macOS(.v14)],
    products: [
        .library(name: "MyApp", targets: ["MyApp"]),
    ],
    dependencies: [
        // Add dependencies here
    ],
    targets: [
        .target(name: "MyApp", dependencies: []),
        .testTarget(name: "MyAppTests", dependencies: ["MyApp"]),
    ]
)
```

### Xcode Project
```bash
# Create new Xcode project via Xcode or:
# Use SwiftUI App template for new projects
# Target iOS 17+ for latest APIs
```

## Type Patterns

### Optionals
```swift
// Safe unwrapping
if let user = optionalUser {
    print(user.name)
}

// Guard for early exit
guard let user = optionalUser else {
    return
}

// Optional chaining
let name = user?.profile?.displayName ?? "Anonymous"

// Nil coalescing
let displayName = user?.name ?? "Guest"
```

### Result Type
```swift
enum NetworkError: Error {
    case invalidURL
    case noData
    case decodingFailed
}

func fetchUser(id: String) async -> Result<User, NetworkError> {
    guard let url = URL(string: "https://api.example.com/users/\(id)") else {
        return .failure(.invalidURL)
    }

    do {
        let (data, _) = try await URLSession.shared.data(from: url)
        let user = try JSONDecoder().decode(User.self, from: data)
        return .success(user)
    } catch {
        return .failure(.decodingFailed)
    }
}

// Usage
switch await fetchUser(id: "123") {
case .success(let user):
    print("Got user: \(user.name)")
case .failure(let error):
    print("Error: \(error)")
}
```

### Protocols & Extensions
```swift
protocol Identifiable {
    var id: UUID { get }
}

protocol Displayable {
    var displayName: String { get }
}

extension User: Identifiable, Displayable {
    var displayName: String {
        "\(firstName) \(lastName)"
    }
}
```

## Error Handling

```swift
// Throwing functions
func loadConfig() throws -> Config {
    guard let data = FileManager.default.contents(atPath: configPath) else {
        throw ConfigError.fileNotFound
    }
    return try JSONDecoder().decode(Config.self, from: data)
}

// Do-catch
do {
    let config = try loadConfig()
    print(config)
} catch ConfigError.fileNotFound {
    print("Config file missing")
} catch {
    print("Unknown error: \(error)")
}

// Try? for optional result
let config = try? loadConfig()

// Try! only when failure is impossible
let bundledConfig = try! loadBundledConfig()
```

## Async/Await Patterns

### Basic Async
```swift
func fetchUsers() async throws -> [User] {
    let (data, _) = try await URLSession.shared.data(from: usersURL)
    return try JSONDecoder().decode([User].self, from: data)
}

// Calling async functions
Task {
    do {
        let users = try await fetchUsers()
        await MainActor.run {
            self.users = users
        }
    } catch {
        print("Failed: \(error)")
    }
}
```

### Structured Concurrency
```swift
// Parallel execution
async let users = fetchUsers()
async let posts = fetchPosts()
let (userList, postList) = try await (users, posts)

// Task groups
func fetchAllUserData(ids: [String]) async throws -> [UserData] {
    try await withThrowingTaskGroup(of: UserData.self) { group in
        for id in ids {
            group.addTask {
                try await fetchUserData(id: id)
            }
        }
        return try await group.reduce(into: []) { $0.append($1) }
    }
}
```

### Actors
```swift
actor UserCache {
    private var cache: [String: User] = [:]

    func get(_ id: String) -> User? {
        cache[id]
    }

    func set(_ user: User) {
        cache[user.id] = user
    }
}

// Usage
let cache = UserCache()
await cache.set(user)
let cached = await cache.get("123")
```

## SwiftUI Patterns

### View with State
```swift
struct ContentView: View {
    @State private var count = 0
    @State private var username = ""

    var body: some View {
        VStack(spacing: 16) {
            Text("Count: \(count)")
                .font(.title)

            Button("Increment") {
                count += 1
            }

            TextField("Username", text: $username)
                .textFieldStyle(.roundedBorder)
        }
        .padding()
    }
}
```

### Observable ViewModel
```swift
@Observable
class UserViewModel {
    var users: [User] = []
    var isLoading = false
    var error: Error?

    func loadUsers() async {
        isLoading = true
        defer { isLoading = false }

        do {
            users = try await userService.fetchAll()
        } catch {
            self.error = error
        }
    }
}

struct UserListView: View {
    @State private var viewModel = UserViewModel()

    var body: some View {
        List(viewModel.users) { user in
            UserRow(user: user)
        }
        .task {
            await viewModel.loadUsers()
        }
        .overlay {
            if viewModel.isLoading {
                ProgressView()
            }
        }
    }
}
```

### Environment & Dependency Injection
```swift
// Define environment key
struct UserServiceKey: EnvironmentKey {
    static let defaultValue: UserService = .live
}

extension EnvironmentValues {
    var userService: UserService {
        get { self[UserServiceKey.self] }
        set { self[UserServiceKey.self] = newValue }
    }
}

// Use in view
struct ProfileView: View {
    @Environment(\.userService) private var userService

    var body: some View {
        // Use userService
    }
}
```

## Testing

### Swift Testing (Swift 6+)
```swift
import Testing

@Suite("UserService Tests")
struct UserServiceTests {
    let service = UserService()

    @Test("creates user with valid email")
    func createUser() async throws {
        let user = try await service.create(email: "test@example.com")
        #expect(user.email == "test@example.com")
    }

    @Test("throws on invalid email")
    func invalidEmail() async {
        await #expect(throws: ValidationError.self) {
            try await service.create(email: "invalid")
        }
    }

    @Test("fetches user by ID", arguments: ["user1", "user2", "user3"])
    func fetchUser(id: String) async throws {
        let user = try await service.fetch(id: id)
        #expect(user.id == id)
    }
}
```

### XCTest (Legacy)
```swift
import XCTest
@testable import MyApp

final class UserServiceTests: XCTestCase {
    var service: UserService!

    override func setUp() {
        super.setUp()
        service = UserService()
    }

    func testCreateUser() async throws {
        let user = try await service.create(email: "test@example.com")
        XCTAssertEqual(user.email, "test@example.com")
    }

    func testInvalidEmailThrows() async {
        do {
            _ = try await service.create(email: "invalid")
            XCTFail("Expected error")
        } catch {
            XCTAssertTrue(error is ValidationError)
        }
    }
}
```

## Tooling

```bash
# SwiftLint (linting)
brew install swiftlint
swiftlint lint
swiftlint lint --fix

# SwiftFormat (formatting)
brew install swiftformat
swiftformat .
swiftformat . --lint

# Run tests
swift test
xcodebuild test -scheme MyApp -destination 'platform=iOS Simulator,name=iPhone 15'

# Build
swift build
xcodebuild build -scheme MyApp

# fastlane (CI/CD)
brew install fastlane
fastlane init
fastlane ios test
fastlane ios beta  # Deploy to TestFlight
```

### .swiftlint.yml
```yaml
disabled_rules:
  - trailing_whitespace
  - line_length

opt_in_rules:
  - empty_count
  - empty_string

excluded:
  - Pods
  - .build
```

### .swiftformat
```
--indent 4
--allman false
--wraparguments before-first
--wrapparameters before-first
--self remove
--importgrouping alphabetized
```
````

## File: .claude/skills/languages/tailwind-css/SKILL.md
````markdown
---
name: tailwind-css
description: Tailwind CSS 4.x utility-first styling patterns. Use when building UI components, creating responsive layouts, implementing design systems, or customizing themes. Covers CSS-first configuration, @theme directive, and component patterns.
---

# Tailwind CSS 4.x

> **Platform:** Web (Tailwind CSS 4.x). For mobile styling, see the **nativewind** skill (Tailwind 3.x for React Native).

## Overview

Utility-first CSS framework for rapid UI development. Tailwind CSS 4.x introduces a CSS-first configuration approach, automatic content detection, and improved performance with a new engine.

**Install**: `pnpm add -D tailwindcss @tailwindcss/vite`

> **API Reference:** Use Context7 MCP for full utility class reference (`mcp__context7__resolve-library-id` → `tailwindcss`).

## Key Changes in v4

- **CSS-first configuration** - Use `@theme` in CSS instead of `tailwind.config.js`
- **Single import** - Use `@import "tailwindcss"` instead of separate directives
- **Automatic content detection** - No `content` array needed
- **New color system** - OKLCH colors with wide gamut support
- **Built-in Vite plugin** - `@tailwindcss/vite` for optimal integration

## Workflows

**Setting up Tailwind v4:**
1. [ ] Install dependencies: `pnpm add -D tailwindcss @tailwindcss/vite`
2. [ ] Add Vite plugin to `vite.config.ts`
3. [ ] Create `index.css` with `@import "tailwindcss"`
4. [ ] Customize theme with `@theme` directive
5. [ ] Test build process and verify styles load

**Creating components:**
1. [ ] Start with semantic HTML structure
2. [ ] Apply utility classes for layout (flex, grid)
3. [ ] Add spacing utilities (p-*, m-*, gap-*)
4. [ ] Style with color, typography, borders
5. [ ] Add responsive variants (sm:, md:, lg:)
6. [ ] Test in multiple viewports

**Custom theme:**
1. [ ] Define design tokens using `@theme` in CSS
2. [ ] Add custom colors, spacing, fonts
3. [ ] Create semantic color aliases
4. [ ] Verify tokens work across components

## Configuration

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### CSS Entry Point

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  /* Brand colors (OKLCH for wide gamut) */
  --color-primary: oklch(0.6 0.2 250);
  --color-secondary: oklch(0.6 0.15 300);
  --color-success: oklch(0.7 0.2 150);
  --color-warning: oklch(0.8 0.15 85);
  --color-danger: oklch(0.6 0.25 25);

  /* Typography */
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "Fira Code", monospace;

  /* Custom spacing */
  --spacing-128: 32rem;

  /* Custom animations */
  --animate-fade-in: fade-in 0.3s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Dark mode variant */
@variant dark (&:where(.dark, .dark *));
```

## Responsive Design

Default breakpoints (mobile-first): `sm: 640px` | `md: 768px` | `lg: 1024px` | `xl: 1280px` | `2xl: 1536px`

```tsx
// Stack on mobile, grid on desktop
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/2">Left</div>
  <div className="w-full md:w-1/2">Right</div>
</div>

// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <div key={item.id} className="rounded-lg border p-4">{item.content}</div>)}
</div>

// Responsive typography
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Scales with viewport</h1>

// Show/hide at breakpoints
<div className="hidden lg:block">Desktop only</div>
<div className="block lg:hidden">Mobile only</div>
```

Custom breakpoints: add `--breakpoint-demo: 1440px;` in `@theme`.

## Dark Mode

```tsx
function App() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => { document.documentElement.classList.toggle('dark', isDark); }, [isDark]);
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <button onClick={() => setIsDark(!isDark)}>Toggle Dark Mode</button>
    </div>
  );
}
```

## Component Patterns

### Buttons

```tsx
// Primary
<button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
  Primary
</button>

// Secondary
<button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
  Secondary
</button>
```

### Cards

```tsx
// Basic card
<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
  <h3 className="text-lg font-semibold text-gray-900">Card Title</h3>
  <p className="mt-2 text-sm text-gray-600">Description</p>
</div>

// Card with header/footer
<div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
  <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
    <h3 className="text-lg font-semibold text-gray-900">Header</h3>
  </div>
  <div className="p-6"><p className="text-sm text-gray-600">Content</p></div>
  <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Action</button>
  </div>
</div>
```

### Form Input

```tsx
<div className="space-y-1">
  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
  <input
    type="email"
    id="email"
    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    placeholder="you@example.com"
  />
</div>
```

## Advanced Patterns

### Variant Modifiers

```tsx
// Group hover — child reacts to parent hover
<div className="group hover:bg-gray-100">
  <h3 className="group-hover:text-blue-600">Changes on parent hover</h3>
</div>

// Peer — sibling state
<input type="checkbox" className="peer" />
<label className="peer-checked:text-blue-600">Changes when checked</label>

// Data attributes
<div data-state="active" className="data-[state=active]:bg-blue-100">Active state</div>

// Structural: first:, last:, odd:, even:
<li className="first:rounded-t-lg last:rounded-b-lg border-b last:border-b-0">Item</li>
```

### Arbitrary Values and Custom Utilities

```tsx
// Arbitrary values with []
<div className="top-[117px] bg-[#1da1f2] grid-cols-[1fr_500px_2fr]">Custom values</div>
<div className="w-[calc(100%-2rem)] bg-[var(--brand-color)]">CSS var + calc</div>
```

```css
/* Custom utilities with @utility */
@utility scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
}
```

## Migration from v3

| v3 Pattern | v4 Pattern |
|------------|------------|
| `tailwind.config.js` | `@theme` in CSS |
| `@tailwind base;` etc. | `@import "tailwindcss"` |
| `content: [...]` | Automatic detection |
| PostCSS plugin | `@tailwindcss/vite` plugin |

**Steps:** Install new packages → replace PostCSS config with Vite plugin → replace `@tailwind` directives → move theme to `@theme` → remove `content` array → test.

## Best Practices

- **Mobile-first approach** - Start with base styles, add responsive variants
- **Use semantic color names** - primary, secondary, danger via `@theme`
- **Keep classes organized** - Layout → Spacing → Colors → Typography → States
- **Use arbitrary values sparingly** - Prefer theme tokens
- **Group hover/focus states** with group-* and peer-* utilities
- **Use the Vite plugin** - `@tailwindcss/vite` for best performance

## Anti-Patterns

- Using `tailwind.config.js` for customization (use `@theme`)
- Using `@tailwind` directives (use `@import "tailwindcss"`)
- Manually configuring `content` array (auto-detected in v4)
- Using PostCSS plugin with Vite (use `@tailwindcss/vite`)
- Desktop-first responsive design (not mobile-friendly)
- Hardcoding colors instead of using theme tokens
- Ignoring accessibility (missing focus states)

## Feedback Loops

```bash
# Check generated CSS size (target < 50KB)
pnpm build

# Watch for changes
pnpm dev
```

Test focus states by tabbing through interactive elements. Verify `focus:ring-*` utilities are visible. Check color contrast in browser devtools.
````

## File: .claude/skills/languages/terraform/SKILL.md
````markdown
---
name: terraform
description: Write Terraform infrastructure code. Use when provisioning cloud resources, managing infrastructure as code, or automating deployments. Covers HCL patterns.
---

# Terraform Development

## Project Structure

```
terraform/
├── main.tf           # Main resources
├── variables.tf      # Input variables
├── outputs.tf        # Output values
├── providers.tf      # Provider config
├── versions.tf       # Version constraints
├── terraform.tfvars  # Variable values
└── modules/
    └── vpc/
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
```

## Provider Configuration

```hcl
# versions.tf
terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}
```

## Variables

```hcl
# variables.tf
variable "environment" {
  description = "Environment name"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "instance_config" {
  description = "EC2 instance configuration"
  type = object({
    instance_type = string
    ami_id        = string
    volume_size   = number
  })

  default = {
    instance_type = "t3.micro"
    ami_id        = "ami-12345678"
    volume_size   = 20
  }
}
```

## Resources

```hcl
# main.tf
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true

  tags = {
    Name = "${var.project}-vpc"
  }
}

resource "aws_subnet" "private" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "${var.project}-private-${count.index + 1}"
  }
}
```

## Modules

```hcl
# Using a module
module "vpc" {
  source = "./modules/vpc"

  project     = var.project
  environment = var.environment
  cidr_block  = "10.0.0.0/16"
}

# Module outputs
output "vpc_id" {
  value = module.vpc.vpc_id
}
```

## Data Sources

```hcl
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_instance" "web" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = var.instance_type
}
```

## Workflow

```bash
# Initialize
terraform init

# Format
terraform fmt -recursive

# Validate
terraform validate

# Plan
terraform plan -out=tfplan

# Apply
terraform apply tfplan

# Destroy
terraform destroy
```

## Best Practices

1. Use remote state with locking
2. Use modules for reusability
3. Use variables for all configurable values
4. Use data sources for existing resources
5. Tag all resources
6. Use workspaces or directories for environments
````

## File: .claude/skills/languages/typescript/SKILL.md
````markdown
---
name: typescript
description: Write TypeScript code following best practices. Use when developing TypeScript/JavaScript applications. Covers type safety, patterns, and tooling.
---

# TypeScript Development

## Project Setup

```bash
# Initialize with pnpm
pnpm init
pnpm add -D typescript @types/node

# TypeScript config
npx tsc --init
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

## Type Patterns

### Discriminated Unions
```typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: Error };

function handleResult(result: Result<User>) {
  if (result.success) {
    console.log(result.data); // User
  } else {
    console.error(result.error); // Error
  }
}
```

### Branded Types
```typescript
type UserId = string & { readonly brand: unique symbol };
type OrderId = string & { readonly brand: unique symbol };

function createUserId(id: string): UserId {
  return id as UserId;
}
```

### Utility Types
```typescript
// Make all properties optional
Partial<User>

// Make all properties required
Required<User>

// Pick specific properties
Pick<User, 'id' | 'email'>

// Omit specific properties
Omit<User, 'password'>

// Make properties readonly
Readonly<User>
```

## Error Handling

```typescript
// Result type pattern
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const user = await db.users.findById(id);
    if (!user) {
      return { ok: false, error: new Error('User not found') };
    }
    return { ok: true, value: user };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
}
```

## Testing with Vitest

```typescript
import { describe, test, expect, vi } from 'vitest';

describe('UserService', () => {
  test('creates user with valid email', async () => {
    const service = new UserService(mockRepo);
    const user = await service.create('test@example.com');
    expect(user.email).toBe('test@example.com');
  });

  test('throws on invalid email', async () => {
    const service = new UserService(mockRepo);
    await expect(service.create('invalid')).rejects.toThrow();
  });
});
```

## Tooling

```bash
# Biome (linting + formatting)
pnpm add -D @biomejs/biome
pnpm biome check --apply .

# Vitest (testing)
pnpm add -D vitest
pnpm vitest
```
````

## File: .claude/skills/languages/vite/SKILL.md
````markdown
---
name: vite
description: Vite 7.x build tool patterns. Use when configuring build setup, development server, environment variables, asset handling, or optimizing production builds for React applications.
---

# Vite

> **Platform:** Web only. Mobile demos use Expo with Metro bundler. See the **expo-sdk** skill.

> Use Context7 MCP (`resolve-library-id` then `query-docs`) for full API reference, plugin ecosystem, and advanced configuration options.

## Overview

Build tool and development server for Vite 7.x. Provides instant server start, fast HMR, optimized production builds, and first-class TypeScript support.

**Install**: `pnpm add -D vite`

## Workflows

**Initial setup:**
1. [ ] Create `vite.config.ts` with TypeScript types
2. [ ] Install React plugin: `pnpm add -D @vitejs/plugin-react`
3. [ ] Configure path aliases for clean imports
4. [ ] Set up environment variables with `.env` files
5. [ ] Test dev server: `pnpm vite`

**Production optimization:**
1. [ ] Configure code splitting and chunk optimization
2. [ ] Enable build compression (gzip/brotli)
3. [ ] Run production build: `pnpm vite build`
4. [ ] Preview build locally: `pnpm vite preview`

## Basic Configuration

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
    }
  },

  server: {
    port: 5173,
    strictPort: true,
    open: true,
    hmr: { overlay: true },
    proxy: {
      '/api': { target: 'http://localhost:3000', changeOrigin: true }
    }
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
  }
});
```

**Update tsconfig.json paths to match aliases:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"]
    }
  }
}
```

**React with SWC** (faster alternative): `pnpm add -D @vitejs/plugin-react-swc`, import from `@vitejs/plugin-react-swc`.

Fast Refresh is enabled by default — no configuration needed.

## Environment Variables

```bash
# .env - Base config (committed)
VITE_APP_NAME=MyApp
VITE_API_VERSION=v1

# .env.local - Local overrides (gitignored — put secrets here)
VITE_API_URL=http://localhost:3000

# .env.development / .env.production - mode-specific defaults
```

**CRITICAL**: All env vars must start with `VITE_` to be exposed to client code.

```typescript
// Access in code
const apiUrl = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
const mode = import.meta.env.MODE; // 'development' | 'production'

// Type-safe env vars — add to vite-env.d.ts or src/env.d.ts
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_API_URL: string;
}

// Runtime validation
if (!import.meta.env.VITE_API_URL) {
  throw new Error('VITE_API_URL is required');
}
```

**Dynamic config with `loadEnv`:**
```typescript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: { port: Number(env.PORT) || 5173 }
  };
});
```

## Build Optimization

### Code Splitting

```typescript
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 500, // KB
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'animation-vendor': ['framer-motion'],
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      }
    }
  }
});
```

**Advanced function-based chunking** — use when you need per-view splitting:
```typescript
manualChunks(id) {
  if (id.includes('node_modules')) {
    if (id.includes('framer-motion')) return 'vendor-animation';
    if (id.includes('react')) return 'vendor-react';
    return 'vendor';
  }
}
```

### Compression

```typescript
import { compression } from 'vite-plugin-compression2';
// pnpm add -D vite-plugin-compression2

plugins: [
  compression({ algorithm: 'gzip', include: /\.(js|css|html|svg)$/ }),
  compression({ algorithm: 'brotliCompress', include: /\.(js|css|html|svg)$/ }),
]
```

For production-only minification:
```typescript
minify: isDev ? false : 'terser',
terserOptions: { compress: { drop_console: true, drop_debugger: true } }
```

## CSS and Assets

**PostCSS / Tailwind**: Point `css.postcss` to your `postcss.config.js`. Enable `cssCodeSplit: true` (default) for large apps.

**Asset handling**:
```typescript
// src/assets — processed by Vite (hashed, optimized)
import logo from '@/assets/logo.svg';

// /public — served as-is, NOT processed
<img src="/images/logo.svg" />
// ❌ Never import from public directory
```

**Inline limit**: Assets under 4 KB are inlined as base64 by default (`assetsInlineLimit: 4096`).

**Base path for subdirectory hosting**: `base: '/my-app/'`

## Vite 7 Notes

- **Rolldown** — new Rust-based bundler (optional, faster builds)
- Improved TypeScript support and tree-shaking
- Default config works for most projects; advanced bundler options rarely needed

## Best Practices

- **Use path aliases** to avoid `../../../` import hell
- **Prefix client env vars** with `VITE_` for automatic exposure
- **Split large vendors** into separate chunks for better caching
- **Use `.env.local`** for secrets — never commit to git
- **Configure proxy** for API calls to avoid CORS in development
- **Preview builds** before deploying: `pnpm vite build && pnpm vite preview`
- **Use esbuild** for faster builds, terser for smaller output
- **Set `strictPort: true`** to avoid silent port conflicts

## Anti-Patterns

- ❌ Forgetting `VITE_` prefix on environment variables
- ❌ Importing from `/public` directory instead of `src/assets`
- ❌ Committing `.env.local` with API keys
- ❌ Not configuring path aliases (messy imports)
- ❌ Using terser in development (unnecessary slowdown)
- ❌ Not setting `strictPort` (silent port conflicts)
- ❌ Ignoring chunk size warnings (impacts load time)
- ❌ Missing `tsconfig.json` paths when using aliases
- ❌ Hardcoding localhost URLs (use env vars)
- ❌ Placing all vendors in single chunk (defeats caching)

## Feedback Loops

**Build analysis:**
```bash
pnpm vite build
# Output shows chunk sizes:
# dist/js/vendor-react-abc123.js  142.34 kB
# dist/js/index-def456.js          87.21 kB
```

**Preview testing:**
```bash
pnpm vite build && pnpm vite preview
# Verify: all routes work, assets load, no console errors
```

**HMR speed**: Should be < 50ms for most updates. Check Chrome DevTools → Network → Filter by "vite".
````

## File: .claude/skills/operations/beads-workflow/SKILL.md
````markdown
---
name: beads-workflow
description: AI-native issue tracking with Beads. Use when managing work items, tracking issues, or coordinating tasks in multi-agent workflows. Covers bd commands, dependencies, and sync patterns.
---

# Beads Workflow

Beads is an AI-native issue tracker designed for agent workflows. Issues live in your repo, sync via git, and require no web UI.

## Core Commands

| Command | Description |
|---------|-------------|
| `bd create "Title" -t feature -p 2` | Create issue (type, priority) |
| `bd list --status open` | List open issues |
| `bd show <id>` | View issue details |
| `bd update <id> --status in_progress` | Update status or assignee |
| `bd close <id> --reason "..."` | Close with reason |
| `bd ready --sort hybrid` | Find unblocked issues |
| `bd dep add <blocking> <blocked> --type blocks` | Add dependency |
| `bd dep tree <id>` | View dependency tree |
| `bd dep rm <blocking> <blocked>` | Remove dependency |
| `bd sync` | Sync with git remote |
| `bd flush` | Force flush to JSONL |

## Workflow Patterns

### Starting a Session

1. **Check ready work**: `bd ready --sort hybrid`
2. **Claim an issue**: `bd update <id> --status in_progress`
3. **Review dependencies**: `bd dep tree <id>`
4. **Begin implementation**

### During Implementation

1. **Track sub-tasks**: `bd create "Sub-task" --parent <id>`
2. **Add blockers**: `bd dep add <new-blocker> <id> --type blocks`
3. **Update progress**: `bd comment <id> "Progress update"`

### Completing Work

1. **Verify completion**: All acceptance criteria met
2. **Close issue**: `bd close <id> --reason "Implemented X, PR #123"`
3. **Sync**: `bd sync`
4. **Check next**: `bd ready`

### Multi-Agent Coordination

```bash
# See who's working on what
bd list --status in_progress --json | jq '.[] | {id, title, assignee}'

# Hand off work
bd update <id> --assignee other-agent
bd comment <id> "Handoff: context and next steps"
```

## Issue Types

| Type | When to Use |
|------|-------------|
| `feature` | New functionality |
| `bug` | Defect fixes |
| `task` | General work items |
| `spike` | Research/investigation |
| `chore` | Maintenance, cleanup |

## Priority Levels

| Priority | Meaning |
|----------|---------|
| 0 | Critical - Drop everything |
| 1 | High - Next up |
| 2 | Medium - Normal flow |
| 3 | Low - When time permits |
| 4 | Backlog - Future consideration |

## Status Flow

```
open -> in_progress -> done
         |-> blocked -> in_progress
```

## Best Practices

1. **One issue per logical unit**: Don't combine unrelated work
2. **Clear titles**: Should explain what, not how
3. **Use dependencies**: Makes ready work visible
4. **Sync frequently**: Keep other agents informed
5. **Close promptly**: Don't leave stale in_progress issues

## Integration with Swarm

1. **Claim before editing**: Update status before touching code
2. **Document blockers**: Create issues for discovered blockers
3. **Handoff cleanly**: Update assignee and add context
4. **Sync before ending**: `bd sync` to share state

## Troubleshooting

```bash
# Check daemon health
bd daemons health

# View daemon logs
bd daemons logs

# Force reimport from JSONL
bd import --force

# Check for conflicts
bd sync --dry-run
```
````

## File: .claude/skills/operations/chaos-engineering/SKILL.md
````markdown
---
name: chaos-engineering
description: Test system resilience through controlled failures. Use when validating fault tolerance, disaster recovery, or system reliability. Covers chaos experiments.
---

# Chaos Engineering

## Principles

1. **Build a Hypothesis**: Define expected behavior
2. **Minimize Blast Radius**: Start small
3. **Run in Production**: Real conditions matter
4. **Automate**: Make experiments repeatable
5. **Minimize Impact**: Have abort conditions

## Experiment Process

1. **Steady State**: Define normal metrics
2. **Hypothesis**: "System will maintain X under condition Y"
3. **Introduce Variables**: Inject failure
4. **Observe**: Compare to steady state
5. **Analyze**: Confirm or disprove hypothesis

## Common Experiments

### Network Failures
```bash
# Add latency
tc qdisc add dev eth0 root netem delay 100ms

# Packet loss
tc qdisc add dev eth0 root netem loss 10%

# Remove
tc qdisc del dev eth0 root
```

### Resource Exhaustion
```bash
# CPU stress
stress --cpu 4 --timeout 60s

# Memory stress
stress --vm 2 --vm-bytes 1G --timeout 60s

# Disk fill
dd if=/dev/zero of=/tmp/fill bs=1M count=1024
```

### Service Failures
- Kill processes
- Restart containers
- Terminate instances
- Block dependencies

## Chaos Tools

- **Chaos Monkey**: Random instance termination
- **Gremlin**: Comprehensive chaos platform
- **Litmus**: Kubernetes chaos engineering
- **Chaos Mesh**: Cloud-native chaos

## Experiment Template

```markdown
## Experiment: [Name]

### Hypothesis
If [condition], then [expected behavior].

### Steady State
- Metric A: [baseline value]
- Metric B: [baseline value]

### Method
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Abort Conditions
- If [condition], stop immediately

### Results
[What happened]

### Findings
[What we learned]
```

## Safety Rules

1. Start in non-production
2. Have rollback ready
3. Monitor continuously
4. Communicate with team
5. Document everything
````

## File: .claude/skills/operations/deploy-aws-ecs/SKILL.md
````markdown
---
name: deploy-aws-ecs
description: Deploy containerized applications to AWS ECS/Fargate. Use when deploying containers to AWS, managing ECS services, or setting up Fargate tasks. Covers task definitions and ECR.
---

# Deploy to AWS ECS/Fargate

## Why ECS/Fargate?

- Serverless container orchestration
- No cluster management
- Auto-scaling built-in
- Deep AWS integration
- Pay-per-use pricing
- Production-grade reliability

## Quick Start

```bash
# Install AWS CLI
aws --version

# Configure credentials (use OIDC in production)
aws configure

# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
```

## ECR Setup

### Create Repository
```bash
# Create ECR repository
aws ecr create-repository --repository-name myapp

# Build and tag image
docker build -t myapp:latest .
docker tag myapp:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/myapp:latest

# Push to ECR
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/myapp:latest
```

## Task Definition

### Basic task-definition.json
```json
{
  "family": "myapp-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::<account-id>:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "myapp",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/myapp:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "production"}
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:<account-id>:secret:db-url"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/myapp",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Register Task Definition
```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

## Service Creation

```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name myapp-cluster

# Create service with ALB
aws ecs create-service \
  --cluster myapp-cluster \
  --service-name myapp-service \
  --task-definition myapp-task \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=myapp,containerPort=8080"
```

## Deployment Workflow

### 1. Build and Push
```bash
# Build new version
docker build -t myapp:${VERSION} .

# Tag and push
docker tag myapp:${VERSION} ${ECR_REPO}:${VERSION}
docker tag myapp:${VERSION} ${ECR_REPO}:latest
docker push ${ECR_REPO}:${VERSION}
docker push ${ECR_REPO}:latest
```

### 2. Update Task Definition
```bash
# Register new task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### 3. Update Service
```bash
# Force new deployment
aws ecs update-service \
  --cluster myapp-cluster \
  --service myapp-service \
  --force-new-deployment
```

## Best Practices

1. **Use Secrets Manager**: Store sensitive data in AWS Secrets Manager, reference in task definition
2. **Health Checks**: Configure ALB health checks for reliability
3. **Auto-scaling**: Set up target tracking based on CPU/memory
4. **Logging**: Always use CloudWatch Logs for centralized logging
5. **Tags**: Tag all resources for cost tracking and organization
6. **IAM Roles**: Use task roles for least-privilege access to AWS services
7. **CI/CD**: Integrate with GitHub Actions using OIDC (no long-lived credentials)

## Common Commands

```bash
# List services
aws ecs list-services --cluster myapp-cluster

# Describe service
aws ecs describe-services --cluster myapp-cluster --services myapp-service

# View logs (requires CloudWatch)
aws logs tail /ecs/myapp --follow

# Scale service
aws ecs update-service --cluster myapp-cluster --service myapp-service --desired-count 4

# Stop all tasks (for maintenance)
aws ecs update-service --cluster myapp-cluster --service myapp-service --desired-count 0
```

## Resources

- [ECS Task Definitions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html)
- [Fargate Platform Versions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform_versions.html)
- [ECR User Guide](https://docs.aws.amazon.com/AmazonECR/latest/userguide/)
````

## File: .claude/skills/operations/deploy-cloudflare/SKILL.md
````markdown
---
name: deploy-cloudflare
description: Deploy to Cloudflare edge platform. Use when deploying static sites to Pages, serverless functions to Workers, or configuring CDN/DNS. Covers Wrangler CLI.
---

# Deploy to Cloudflare

## Why Cloudflare?

- Global edge network (300+ cities)
- Zero cold starts (Workers)
- Automatic HTTPS and DDoS protection
- Integrated CDN and DNS
- Generous free tier

## Quick Start

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Deploy Pages
wrangler pages deploy ./dist

# Deploy Worker
wrangler deploy
```

## Cloudflare Pages

### Deploy Static Site
```bash
# One-time deploy
wrangler pages deploy ./dist --project-name=my-app

# Connect Git repo (auto-deploy)
wrangler pages project create my-app --production-branch=main
```

### Build Configuration
```toml
# wrangler.toml (Pages Functions)
name = "my-app"
compatibility_date = "2025-01-01"

[build]
command = "npm run build"
```

## Cloudflare Workers

### Worker Configuration
```toml
# wrangler.toml
name = "my-worker"
main = "src/index.ts"
compatibility_date = "2025-01-01"

[vars]
ENVIRONMENT = "production"

[[kv_namespaces]]
binding = "MY_KV"
id = "abc123"
```

### Basic Worker
```typescript
export default {
  async fetch(request, env, ctx) {
    return new Response('Hello from the edge!', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
```

## Environment & Secrets

```bash
# Set secret (encrypted)
wrangler secret put API_KEY

# Set variable (plain text)
wrangler pages secret put API_URL

# Bulk upload
echo "SECRET_KEY" | wrangler secret put SECRET_KEY
```

## DNS Management

```bash
# List DNS records
wrangler dns list example.com

# Add A record
wrangler dns create example.com --type A --name www --content 1.2.3.4

# Update record
wrangler dns update example.com --type A --name www --content 5.6.7.8
```

## Deployment Workflow

### 1. Initialize Project
```bash
wrangler init my-project
cd my-project
```

### 2. Develop Locally
```bash
wrangler dev
```

### 3. Deploy
```bash
# Production
wrangler deploy

# Preview
wrangler deploy --env staging
```

## Best Practices

1. **Use Environments**: Separate staging and production
2. **Versioning**: Rollback via dashboard if needed
3. **Edge Caching**: Leverage Cache API for performance
4. **Rate Limiting**: Protect Workers with rate limits
5. **Monitoring**: Enable Workers Analytics

## Common Commands

```bash
# View logs (tail)
wrangler tail

# List deployments
wrangler deployments list

# Rollback
wrangler rollback --message "Revert breaking change"

# KV operations
wrangler kv:key put --binding=MY_KV "key" "value"
wrangler kv:key get --binding=MY_KV "key"
```

## Anti-Patterns

- **Don't** store secrets in wrangler.toml (use `wrangler secret`)
- **Don't** deploy without testing locally (`wrangler dev`)
- **Don't** ignore compatibility_date (affects runtime behavior)
- **Don't** use Workers for long-running tasks (30s limit)
````

## File: .claude/skills/operations/deploy-railway/SKILL.md
````markdown
---
name: deploy-railway
description: Deploy applications to Railway. Use when deploying services, databases, or full-stack applications to Railway PaaS. Covers Railway CLI and configuration.
---

# Deploy to Railway

## Why Railway?

- Zero config deployments
- Automatic HTTPS
- Built-in databases
- Environment management
- Preview environments

## Quick Start

```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

## Configuration

### railway.json
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Environment Variables
```bash
# Set variable
railway variables set DATABASE_URL=postgres://...

# Set from file
railway variables set < .env.production
```

## Database Setup

```bash
# Add PostgreSQL
railway add --database postgres

# Get connection URL
railway variables get DATABASE_URL
```

## Deployment Workflow

### 1. Connect Repo
```bash
railway link
```

### 2. Configure Build
Railway auto-detects most frameworks. Override with:
```bash
# Nixpacks (default)
railway up

# Dockerfile
railway up --dockerfile
```

### 3. Set Domain
```bash
railway domain
```

## Best Practices

1. **Use Preview Environments**: Test PRs before merge
2. **Separate Databases**: Different DB per environment
3. **Use Variables**: Never hardcode secrets
4. **Health Checks**: Enable for reliability
5. **Logs**: Use `railway logs` for debugging

## Common Commands

```bash
# View logs
railway logs

# Open dashboard
railway open

# Run command in environment
railway run npm run migrate

# List services
railway status
```
````

## File: .claude/skills/operations/incident-management/SKILL.md
````markdown
---
name: incident-management
description: Handle production incidents effectively. Use when responding to outages, conducting post-mortems, or improving reliability. Covers incident response and blameless culture.
---

# Incident Management

## Incident Severity

| Level | Impact | Response Time |
|-------|--------|---------------|
| SEV1 | Complete outage | Immediate |
| SEV2 | Major degradation | < 15 min |
| SEV3 | Minor degradation | < 1 hour |
| SEV4 | Low impact | Next business day |

## Incident Response

### 1. Detect
- Monitoring alerts
- Customer reports
- Error logs

### 2. Triage
- Assess severity
- Assign incident commander
- Create communication channel

### 3. Investigate
- Check recent changes
- Review logs and metrics
- Identify root cause

### 4. Mitigate
- Apply quick fix
- Rollback if needed
- Communicate status

### 5. Resolve
- Confirm fix
- Monitor for recurrence
- Close incident

### 6. Learn
- Post-mortem meeting
- Document findings
- Create action items

## Post-Mortem Template

```markdown
# Post-Mortem: [Incident Title]

## Summary
[Brief description of what happened]

## Timeline
- HH:MM - [Event]
- HH:MM - [Event]
- HH:MM - [Resolution]

## Impact
- Duration: [X hours]
- Users affected: [X]
- Revenue impact: [if applicable]

## Root Cause
[What caused this incident]

## Contributing Factors
- [Factor 1]
- [Factor 2]

## What Went Well
- [Positive 1]
- [Positive 2]

## What Could Be Improved
- [Improvement 1]
- [Improvement 2]

## Action Items
- [ ] [Action 1] - Owner: [Name]
- [ ] [Action 2] - Owner: [Name]
```

## Blameless Culture

- Focus on systems, not people
- "What failed?" not "Who failed?"
- Share learnings openly
- Celebrate near-misses
````

## File: .claude/skills/operations/infrastructure/SKILL.md
````markdown
---
name: infrastructure
description: Manage infrastructure as code. Use when provisioning resources, managing cloud infrastructure, or setting up environments. Covers Terraform and IaC patterns.
---

# Infrastructure as Code

## Principles

1. **Everything in Code**: No manual changes
2. **Version Controlled**: All changes tracked
3. **Idempotent**: Safe to run multiple times
4. **Tested**: Validate before apply

## Terraform Basics

### Project Structure
```
infrastructure/
├── main.tf           # Main configuration
├── variables.tf      # Input variables
├── outputs.tf        # Output values
├── providers.tf      # Provider config
├── terraform.tfvars  # Variable values
└── modules/
    └── vpc/          # Reusable modules
```

### Example: AWS VPC

```hcl
# providers.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# main.tf
resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr

  tags = {
    Name        = "${var.project}-vpc"
    Environment = var.environment
  }
}

# variables.tf
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}
```

## Workflows

```bash
# Initialize
terraform init

# Plan changes
terraform plan -out=tfplan

# Apply changes
terraform apply tfplan

# Destroy resources
terraform destroy
```

## Best Practices

1. **Use Remote State**: Store state in S3/GCS
2. **Lock State**: Prevent concurrent modifications
3. **Use Modules**: Reusable infrastructure components
4. **Environment Separation**: Separate state per environment
5. **Secret Management**: Never store secrets in code

## State Management

```hcl
terraform {
  backend "s3" {
    bucket         = "terraform-state-bucket"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```

## ECS/Fargate

```hcl
# Task Definition
resource "aws_ecs_task_definition" "app" {
  family                   = "${var.project}-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_execution.arn

  container_definitions = jsonencode([{
    name  = "app"
    image = "${aws_ecr_repository.app.repository_url}:latest"
    portMappings = [{
      containerPort = 8080
      protocol      = "tcp"
    }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = aws_cloudwatch_log_group.app.name
        awslogs-region        = var.aws_region
        awslogs-stream-prefix = "app"
      }
    }
  }])
}

# ECS Service
resource "aws_ecs_service" "app" {
  name            = "${var.project}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.app_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = aws_subnet.private[*].id
    security_groups = [aws_security_group.app.id]
  }
}
```

## S3 Buckets

```hcl
resource "aws_s3_bucket" "assets" {
  bucket = "${var.project}-assets-${var.environment}"
}

resource "aws_s3_bucket_versioning" "assets" {
  bucket = aws_s3_bucket.assets.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
```
````

## File: .claude/skills/operations/observability/SKILL.md
````markdown
---
name: observability
description: Implement observability solutions. Use when setting up monitoring, logging, or tracing. Covers OpenTelemetry, metrics, and alerting.
---

# Observability

## Three Pillars

### 1. Logs
Discrete events with context.

```json
{
  "timestamp": "2024-01-01T12:00:00Z",
  "level": "error",
  "message": "Failed to process order",
  "orderId": "123",
  "error": "Payment declined",
  "traceId": "abc123"
}
```

### 2. Metrics
Numeric measurements over time.

```
http_requests_total{method="GET", status="200"} 1234
http_request_duration_seconds{quantile="0.95"} 0.23
```

### 3. Traces
Request flow through services.

```
Trace: abc123
├── API Gateway (50ms)
│   ├── Auth Service (10ms)
│   └── Order Service (35ms)
│       └── Database (20ms)
```

## OpenTelemetry Setup

```typescript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: 'http://collector:4318/v1/traces',
  }),
  serviceName: 'my-service',
});

sdk.start();
```

## Key Metrics

### RED Method (Request-focused)
- **R**ate: Requests per second
- **E**rrors: Failed requests per second
- **D**uration: Request latency

### USE Method (Resource-focused)
- **U**tilization: % time busy
- **S**aturation: Queue depth
- **E**rrors: Error count

## Alerting

### Good Alerts
- Actionable: Something can be done
- Urgent: Needs immediate attention
- Specific: Clear what's wrong

### Alert Template
```yaml
alert: HighErrorRate
expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.01
for: 5m
labels:
  severity: critical
annotations:
  summary: "High error rate on {{ $labels.service }}"
  description: "Error rate is {{ $value | humanizePercentage }}"
```

## Dashboards

Essential panels:
1. Request rate
2. Error rate
3. Latency (P50, P95, P99)
4. Saturation (CPU, memory)
5. Active alerts
````

## File: .claude/skills/operations/swarm-coordination/SKILL.md
````markdown
---
name: swarm-coordination
description: Coordinate multi-agent swarm workflows. Use when working in parallel with other agents, managing shared resources, or orchestrating distributed tasks. Covers conflict prevention, handoffs, and state synchronization.
---

# Swarm Coordination

Protocols and patterns for consistent, conflict-free multi-agent development. Follow these guidelines when working alongside other Claude Code agents in the same codebase.

## Core Principles

1. **Beads as Source of Truth**: All work items tracked via `bd` commands
2. **File Locking**: Hooks automatically manage file locks - respect them
3. **Session Isolation**: Each agent has a unique session ID for tracking
4. **Clean Handoffs**: Always leave state that another agent can continue

## File-Based Output

Workers write results to `scratchpad/<task-id>.md`, not direct context. Only durable artifacts (ADRs, plans, PRDs) go to `artifacts/`. Orchestrator creates output targets before launching workers; workers write to assigned files; orchestrator reads and synthesizes.

## Workflows

### Starting Work

- [ ] **Check Beads**: Run `bd ready` to find unblocked issues
- [ ] **Claim Work**: Update issue status: `bd update <id> --status in_progress`
- [ ] **Check Conflicts**: Review `.claude/hooks/.file-tracker.log` for recent edits
- [ ] **Coordinate**: If another agent is active, coordinate via Beads comments

### During Work

- [ ] **Atomic Changes**: Make small, complete changes that don't leave broken state
- [ ] **Frequent Commits**: Commit often to reduce merge conflicts
- [ ] **Update Progress**: Add comments to Beads issues for visibility
- [ ] **Respect Locks**: If a file is locked, wait or work on something else

### Completing Work

- [ ] **Run Tests**: Verify changes don't break existing functionality
- [ ] **Close Issue**: `bd close <id> --reason "Completed: <description>"`
- [ ] **Sync Beads**: `bd sync` to share updates with other agents
- [ ] **Clean State**: Commit all changes, leave no uncommitted work

## Conflict Prevention

### File Lock Protocol

Hooks automatically acquire/release locks. If you encounter a lock:

```bash
# Check who holds the lock
cat .claude/hooks/.locks/<filename>.lock

# Lock automatically expires after 60 seconds
# If urgent, coordinate via Beads or wait
```

### Merge Conflict Strategy

1. Pull frequently: Keep your branch up to date
2. Small PRs: Easier to merge than large changes
3. Coordinate: Use Beads to claim files/features before editing
4. Resolve quickly: Address conflicts immediately when detected

## Communication Patterns

### Handoff Message

When ending a session with incomplete work:

```bash
# Create handoff for next agent
echo '{"message": "Continue implementing auth middleware. Tests passing but needs error handling in src/auth.ts:45"}' > .claude/hooks/.state/handoff.json
```

### Issue Comments (via Beads)

```bash
# Add context for other agents
bd comment <issue-id> "Implemented base class. Needs: validation, tests, docs"
```

## Multi-Agent Patterns

### Queen-Worker Pattern

For complex tasks, one agent orchestrates while others execute:

1. **Queen**: Plans, decomposes, assigns via Beads
2. **Workers**: Claim issues, implement, report completion
3. **Sync Point**: All workers sync before final integration

### Parallel Streams

For independent features:

1. Create separate Beads issues for each stream
2. Each agent claims one stream
3. Avoid editing same files across streams
4. Merge streams at defined integration points

## State Files

| File | Purpose |
|------|---------|
| `.claude/hooks/.state/session_*.json` | Active agent sessions |
| `.claude/hooks/.state/handoff.json` | Handoff messages between sessions |
| `.claude/hooks/.locks/*.lock` | File edit locks |
| `.claude/hooks/.file-tracker.log` | Recent file modifications |

## Best Practices

1. **Check Before Edit**: Always verify no active locks on target files
2. **Complete Units**: Finish logical units of work before switching
3. **Document Intent**: Use Beads issues to declare what you're working on
4. **Test Locally**: Run tests before pushing to catch issues early
5. **Sync Often**: Keep Beads and git in sync with other agents

## Emergency Procedures

### Deadlock Detection

If agents are waiting on each other:

```bash
# Check active sessions
ls -la .claude/hooks/.state/session_*.json

# Check active locks
ls -la .claude/hooks/.locks/

# Force release stale locks (use with caution)
find .claude/hooks/.locks -mmin +5 -delete
```

### Recovery from Conflict

1. Save current work to a new branch
2. Sync with main: `git fetch && git rebase origin/main`
3. Resolve conflicts file by file
4. Update Beads: `bd sync`
5. Continue work

## Integration with Beads

```bash
# View all open work
bd list --status open

# Get ready (unblocked) items
bd ready --sort hybrid

# Claim an issue
bd update <id> --status in_progress --assignee claude

# Add dependency
bd dep add <blocking-id> <blocked-id> --type blocks

# Complete work
bd close <id> --reason "Implemented feature X"

# Sync state
bd sync
```
````

## File: .claude/skills/product/agile-methodology/SKILL.md
````markdown
---
name: agile-methodology
description: Apply agile development practices. Use when planning sprints, running ceremonies, or improving team processes. Covers Scrum, Kanban, and agile principles.
---

# Agile Methodology

## Agile Principles

1. Individuals and interactions over processes
2. Working software over documentation
3. Customer collaboration over contracts
4. Responding to change over following plans

## Scrum Framework

### Roles
- **Product Owner**: Defines what to build
- **Scrum Master**: Facilitates process
- **Development Team**: Builds the product

### Ceremonies

#### Sprint Planning
- Review backlog
- Select sprint goals
- Break into tasks

#### Daily Standup
- What did you do yesterday?
- What will you do today?
- Any blockers?

#### Sprint Review
- Demo completed work
- Gather feedback
- Update backlog

#### Sprint Retrospective
- What went well?
- What could improve?
- Action items

### Artifacts
- **Product Backlog**: Prioritized list of work
- **Sprint Backlog**: Work for current sprint
- **Increment**: Potentially shippable product

## Kanban

### Principles
- Visualize workflow
- Limit work in progress (WIP)
- Manage flow
- Make policies explicit

### Board Example
```
| To Do | In Progress (3) | Review | Done |
|-------|-----------------|--------|------|
| Task1 | Task4           | Task6  | Task7|
| Task2 | Task5           |        | Task8|
| Task3 |                 |        |      |
```

## Metrics

### Velocity
Story points completed per sprint.

### Lead Time
Time from request to delivery.

### Cycle Time
Time from start to completion.

### Work in Progress
Number of items being worked on.

## Best Practices

1. Keep sprints short (1-2 weeks)
2. Definition of Done is clear
3. Backlog is prioritized
4. Retrospectives lead to action
5. Demos are regular
````

## File: .claude/skills/product/brainstorming/SKILL.md
````markdown
---
name: brainstorming
description: Generate and explore ideas effectively. Use when starting new projects, solving problems, or exploring solutions. Covers ideation techniques and divergent thinking.
---

# Brainstorming

## Principles

1. **Quantity over quality**: Generate many ideas first
2. **No judgment**: Defer criticism until later
3. **Build on ideas**: Combine and extend
4. **Wild ideas welcome**: Encourage creativity

## Techniques

### Mind Mapping
Start with central concept, branch out associations.

```
                    ┌── Mobile App
                    │
         ┌── UI ────┼── Web App
         │          │
         │          └── CLI
         │
Product ─┼── Features ── [list features]
         │
         │          ┌── PostgreSQL
         └── Data ──┤
                    └── Redis
```

### SCAMPER
- **S**ubstitute: What can be replaced?
- **C**ombine: What can be merged?
- **A**dapt: What can be borrowed from elsewhere?
- **M**odify: What can be changed?
- **P**ut to other uses: Different applications?
- **E**liminate: What can be removed?
- **R**everse: What if we flip it?

### How Might We (HMW)
Reframe problems as opportunities.

```
Problem: Users abandon signup
HMW: How might we make signup feel rewarding?
HMW: How might we reduce signup friction?
HMW: How might we show value before signup?
```

### Crazy 8s
1. Fold paper into 8 sections
2. 8 ideas in 8 minutes
3. One idea per section
4. Sketch or write

## Idea Evaluation

After brainstorming, evaluate ideas:

| Idea | Impact | Effort | Risk | Priority |
|------|--------|--------|------|----------|
| Idea 1 | High | Low | Low | Do First |
| Idea 2 | High | High | Med | Plan |
| Idea 3 | Low | Low | Low | Maybe |

## Diverge → Converge

1. **Diverge**: Generate many ideas (no filter)
2. **Organize**: Group similar ideas
3. **Converge**: Select best ideas to pursue
````

## File: .claude/skills/product/context-management/SKILL.md
````markdown
---
name: context-management
description: Manage project context effectively. Use when onboarding, context switching, or maintaining project knowledge. Covers context capture and sharing.
---

# Context Management

## Why Context Matters

- Reduces ramp-up time
- Prevents repeated mistakes
- Enables informed decisions
- Facilitates collaboration

## Context Types

### Project Context
- What the project does
- Why it exists
- Who uses it
- Key constraints

### Technical Context
- Architecture decisions (ADRs)
- Technology choices
- Coding conventions
- Known issues

### Historical Context
- Why decisions were made
- What was tried before
- Lessons learned

## Context Capture

### Decision Log
```markdown
## Decision: [Title]
**Date**: [Date]
**Context**: [Why this came up]
**Decision**: [What was decided]
**Rationale**: [Why this choice]
**Consequences**: [What changed]
```

### Knowledge Base
- README for project overview
- ADRs for architecture
- CONTRIBUTING for development
- CHANGELOG for history

### Code Comments
```typescript
// CONTEXT: This retry logic exists because the external API
// has intermittent failures. See incident-123 for details.
// We chose exponential backoff after testing showed it
// reduces error rate by 80%.
```

## Context Sharing

### New Team Member
1. Start with README
2. Review key ADRs
3. Pair on first task
4. Introduce to stakeholders

### Handoff
1. Document current state
2. List open questions
3. Identify risks
4. Warm handoff meeting

## Best Practices

1. **Write it down**: Don't rely on memory
2. **Keep it current**: Update as things change
3. **Make it findable**: Organize logically
4. **Be specific**: Include the "why"
5. **Review regularly**: Remove stale info
````

## File: .claude/skills/product/decomposing-tasks/SKILL.md
````markdown
---
name: decomposing-tasks
description: Break down large tasks into smaller, actionable items. Use when planning sprints, estimating work, or creating implementation plans. Covers task breakdown strategies.
---

# Decomposing Tasks

## Workflows

- [ ] **Understand Scope**: What is the full scope of work?
- [ ] **Identify Components**: What are the major pieces?
- [ ] **Break Down**: Split into 1-2 day tasks
- [ ] **Order**: Define dependencies and sequence
- [ ] **Validate**: Can each task be demo'd/tested?

## Task Size Guidelines

### Too Big
- "Build the authentication system"
- Cannot be completed in 1-2 days
- Cannot be tested independently

### Just Right
- "Create login API endpoint"
- "Add password validation"
- "Implement JWT token generation"

### Too Small
- "Add semicolon"
- "Rename variable"
- Not worth tracking separately

## Decomposition Strategies

### Vertical Slicing
Cut through all layers for one feature.

```
Feature: User Login
├── API endpoint (POST /login)
├── Input validation
├── Database query
├── JWT generation
├── Error handling
└── Integration test
```

### Horizontal Slicing
Complete one layer at a time.

```
Database Layer
├── Users table
├── Sessions table
└── Indexes

API Layer
├── Login endpoint
├── Logout endpoint
└── Refresh endpoint
```

### SPIDR Method

- **Spike**: Research/investigation task
- **Path**: Main flow implementation
- **Interface**: API/UI contract
- **Data**: Storage and schemas
- **Rules**: Business logic and validation

## Task Template

```markdown
## Task: [Title]

**Description**: [What needs to be done]

**Acceptance Criteria**:
- [ ] [Criterion 1]
- [ ] [Criterion 2]

**Dependencies**: [What must be done first]

**Estimate**: [X hours/points]
```

## Definition of Done

Every task should have:
- [ ] Code complete and reviewed
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] Deployed to staging
````

## File: .claude/skills/product/documentation/SKILL.md
````markdown
---
name: documentation
description: Write clear technical documentation. Use when creating READMEs, API docs, or user guides. Covers documentation types and best practices.
---

# Technical Documentation

## Documentation Types

### README
First thing users see. Include:
- What the project does
- How to install/setup
- Basic usage examples
- Where to find more info

### API Documentation
- Endpoints and methods
- Request/response formats
- Authentication
- Error codes
- Examples

### Architecture Documentation
- System overview
- Component diagrams
- Data flow
- Key decisions (ADRs)

### User Guides
- Step-by-step instructions
- Screenshots/examples
- Common workflows
- Troubleshooting

## Writing Principles

### 1. Know Your Audience
- Developer? User? Admin?
- What do they already know?
- What do they need to accomplish?

### 2. Be Concise
- Short sentences
- Active voice
- Remove filler words

### 3. Show, Don't Tell
```markdown
# Bad
The function handles errors properly.

# Good
The function returns an Error object:
  ```typescript
  const result = await fetchUser(id);
  if (result.error) {
    console.error(result.error.message);
  }
  ```
```

### 4. Structure for Scanning
- Use headings
- Use bullet points
- Use code blocks
- Use tables

## README Template

```markdown
# Project Name

Brief description of what this does.

## Installation

\`\`\`bash
npm install project-name
\`\`\`

## Quick Start

\`\`\`typescript
import { thing } from 'project-name';
thing.doSomething();
\`\`\`

## Documentation

[Full documentation](./docs/)

## Contributing

[Contributing guide](./CONTRIBUTING.md)

## License

MIT
```

## API Documentation Example

```markdown
## POST /api/users

Create a new user.

### Request

\`\`\`json
{
  "email": "user@example.com",
  "name": "John Doe"
}
\`\`\`

### Response

\`\`\`json
{
  "id": "123",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-01T00:00:00Z"
}
\`\`\`

### Errors

| Code | Description |
|------|-------------|
| 400 | Invalid request body |
| 409 | Email already exists |
```
````

## File: .claude/skills/product/estimating-work/SKILL.md
````markdown
---
name: estimating-work
description: Estimate effort for development tasks. Use when planning sprints, roadmaps, or project timelines. Covers story points, relative estimation, and uncertainty.
---

# Estimating Work

## Estimation Approaches

### Story Points
Relative complexity, not time.

| Points | Complexity |
|--------|------------|
| 1 | Trivial, well understood |
| 2 | Simple, minor unknowns |
| 3 | Moderate complexity |
| 5 | Complex, some unknowns |
| 8 | Very complex, significant unknowns |
| 13 | Extremely complex, many unknowns |
| 21+ | Too big, needs decomposition |

### T-Shirt Sizing
For high-level estimates.

| Size | Relative Effort |
|------|-----------------|
| XS | Hours |
| S | 1-2 days |
| M | 3-5 days |
| L | 1-2 weeks |
| XL | 2-4 weeks |

## Estimation Factors

Consider:
- **Complexity**: How difficult is the problem?
- **Uncertainty**: How much is unknown?
- **Effort**: How much work is involved?
- **Risk**: What could go wrong?

## Estimation Techniques

### Planning Poker
1. Present the task
2. Everyone selects estimate privately
3. Reveal simultaneously
4. Discuss outliers
5. Re-estimate if needed

### Three-Point Estimation
```
Expected = (Optimistic + 4×Likely + Pessimistic) / 6
```

### Reference Stories
Keep calibration stories:
- "This 3-point story took 2 days"
- "This 8-point story took a week"

## Common Pitfalls

- **Anchoring**: First estimate biases others
- **Optimism**: Underestimating unknowns
- **Scope Creep**: Original estimate doesn't match final scope
- **Ignoring Overhead**: Code review, testing, deployment

## Tips

1. Estimate in ranges, not points
2. Include buffer for unknowns
3. Track actual vs. estimated
4. Re-estimate when scope changes
5. Don't estimate in hours (use relative sizing)
````

## File: .claude/skills/product/execution-roadmaps/resources/execution-roadmap.template.md
````markdown
# Execution Roadmap: [Project Name]

## Overview

[Brief description of the project and its goals]

## Timeline Overview

```
Phase 1: Foundation     [Week 1-2]
Phase 2: MVP           [Week 3-4]
Phase 3: Enhancement   [Week 5-6]
Phase 4: Launch        [Week 7]
Phase 5: Iteration     [Ongoing]
```

---

## Phase 1: Foundation

**Goal**: [What this phase achieves]

### Deliverables
- [ ] [Deliverable 1]
- [ ] [Deliverable 2]
- [ ] [Deliverable 3]

### Success Criteria
- [Criterion 1]
- [Criterion 2]

### Risks
- [Risk 1]: [Mitigation]

---

## Phase 2: MVP

**Goal**: [What this phase achieves]

### Deliverables
- [ ] [Deliverable 1]
- [ ] [Deliverable 2]

### Success Criteria
- [Criterion 1]
- [Criterion 2]

### Dependencies
- Phase 1 complete

---

## Phase 3: Enhancement

**Goal**: [What this phase achieves]

### Deliverables
- [ ] [Deliverable 1]
- [ ] [Deliverable 2]

---

## Phase 4: Launch

**Goal**: Production deployment

### Deliverables
- [ ] Production environment ready
- [ ] Monitoring and alerting configured
- [ ] Documentation complete
- [ ] Support runbook created

### Go/No-Go Criteria
- [ ] All tests passing
- [ ] Security review approved
- [ ] Performance benchmarks met
- [ ] Rollback plan tested

---

## Phase 5: Iteration

**Goal**: Continuous improvement

### Activities
- Monitor metrics
- Gather user feedback
- Address bugs
- Plan next features

---

## Key Milestones

| Milestone | Target Date | Owner | Status |
|-----------|-------------|-------|--------|
| MVP Complete | [Date] | [Name] | Not Started |
| Launch Ready | [Date] | [Name] | Not Started |
| v1.0 Release | [Date] | [Name] | Not Started |

## Open Questions

- [ ] [Question 1]
- [ ] [Question 2]
````

## File: .claude/skills/product/execution-roadmaps/SKILL.md
````markdown
---
name: execution-roadmaps
description: Create execution roadmaps for projects. Use when planning multi-phase projects or feature rollouts. Covers phased delivery and milestone planning.
---

# Execution Roadmaps

## Workflows

- [ ] **Define Phases**: Break work into logical phases
- [ ] **Set Milestones**: Define measurable checkpoints
- [ ] **Identify Dependencies**: Map critical path
- [ ] **Assign Ownership**: Who is responsible
- [ ] **Save Artifact**: Save to `./artifacts/roadmap_[project].md`

## Roadmap Structure

### Phase 1: Foundation
- Core infrastructure
- Basic functionality
- Initial testing

### Phase 2: MVP
- Key features
- User testing
- Feedback integration

### Phase 3: Enhancement
- Additional features
- Performance optimization
- Scale preparation

### Phase 4: Launch
- Production deployment
- Monitoring
- Documentation

### Phase 5: Iteration
- User feedback
- Bug fixes
- Continuous improvement

## Milestone Definition

Each milestone should have:
- **Name**: Clear, descriptive
- **Criteria**: What defines completion
- **Date**: Target completion
- **Owner**: Who is accountable
- **Dependencies**: What must be done first

## Example Milestone

```markdown
## Milestone: Authentication MVP

**Target**: Week 4

**Criteria**:
- [ ] Login/logout working
- [ ] Password reset implemented
- [ ] Session management secure
- [ ] Integration tests passing
- [ ] Security review complete

**Owner**: Auth Team

**Dependencies**:
- Database schema complete
- API framework selected
```

## Resources

- [Roadmap Template](./resources/execution-roadmap.template.md)
````

## File: .claude/skills/product/reaching-consensus/SKILL.md
````markdown
---
name: reaching-consensus
description: Facilitate group decision-making. Use when teams need to align on decisions, resolve disagreements, or make collective choices. Covers consensus techniques.
---

# Reaching Consensus

## Consensus vs. Voting

**Voting**: Majority wins, minority loses
**Consensus**: Everyone can support the decision

## Consensus Levels

| Level | Meaning |
|-------|---------|
| 1 | Fully support |
| 2 | Support with minor concerns |
| 3 | Can live with it |
| 4 | Have serious concerns |
| 5 | Cannot support |

Goal: Everyone at level 3 or better.

## Techniques

### Fist of Five
Quick check on support:
- **5 fingers**: Fully support
- **4 fingers**: Support
- **3 fingers**: OK with it
- **2 fingers**: Concerns
- **1 finger**: Strong concerns
- **Fist**: Block

### Gradients of Agreement
1. Enthusiastic Yes
2. Supportive Yes
3. Willing Yes
4. Reservations
5. Stand Aside
6. Block

### Proposal-Based
1. Present proposal
2. Clarifying questions
3. Quick reactions
4. Amendments
5. Check for consensus
6. Iterate if needed

## When Stuck

### Disagree and Commit
- Debate thoroughly
- Make decision
- Everyone commits
- Review later

### Time-Boxing
- Set decision deadline
- If no consensus, fallback option
- Owner makes final call

### Smaller Group
- Delegate to experts
- Report back
- Full group ratifies

## Facilitation Tips

1. Ensure everyone speaks
2. Summarize positions
3. Find common ground
4. Address concerns directly
5. Document the decision
6. Include dissenting views
````

## File: .claude/skills/product/requirements-analysis/SKILL.md
````markdown
---
name: requirements-analysis
description: Analyze and refine product requirements. Use when clarifying scope, identifying gaps, or validating requirements. Covers requirement types and analysis techniques.
---

# Requirements Analysis

## Requirement Types

### Functional Requirements
What the system should DO.
- "Users can log in with email and password"
- "System sends order confirmation email"

### Non-Functional Requirements
How the system should BEHAVE.
- Performance: "Page loads in < 2 seconds"
- Security: "Passwords stored with bcrypt"
- Scalability: "Supports 10,000 concurrent users"

### Constraints
Limitations on the solution.
- "Must use existing authentication system"
- "Must run on AWS"

## Analysis Techniques

### Ask "Why?" Five Times
Uncover the real requirement.

```
Requirement: "Add export to Excel button"
Why? → "Users need to share reports"
Why? → "Finance reviews monthly sales"
Why? → "They compare against targets"
Why? → "To identify underperforming regions"
Real Need: Regional performance dashboard
```

### SMART Criteria
Requirements should be:
- **S**pecific: Clear and unambiguous
- **M**easurable: Can verify completion
- **A**chievable: Technically feasible
- **R**elevant: Aligned with goals
- **T**ime-bound: Has deadline

### Edge Case Analysis
- What happens with no data?
- What happens with too much data?
- What if the user is offline?
- What if permissions are denied?

## Requirement Validation

- [ ] Is it testable?
- [ ] Is it achievable?
- [ ] Is it necessary?
- [ ] Is it consistent with other requirements?
- [ ] Is it complete?
- [ ] Is the priority clear?

## Documenting Requirements

```markdown
**REQ-001**: User Authentication

**Description**: Users must authenticate to access the system.

**Acceptance Criteria**:
1. Given valid credentials, user gains access
2. Given invalid credentials, user sees error
3. After 5 failed attempts, account is locked

**Priority**: Must Have
**Dependencies**: REQ-002 (User Management)
```
````

## File: .claude/skills/product/writing-pr-faqs/resources/pr-faq.template.md
````markdown
# PR/FAQ: [Product Name]

---

## Press Release

### [Headline: Company Announces Product that Provides Key Benefit]

**[City, State] - [Date]** - [Company] today announced [Product Name], a [product category] that [primary benefit] for [target customer].

### The Problem

[Describe the customer problem in 2-3 sentences. What pain do they experience today?]

### The Solution

[Describe how the product solves this problem. What does it do?]

### Quote from Leadership

> "[Quote explaining why this matters to the company and customers]"
>
> — [Name], [Title], [Company]

### How It Works

[2-3 paragraphs explaining how the product works. Be specific but accessible.]

### Customer Quote

> "[Quote from a hypothetical customer describing the benefit they received]"
>
> — [Customer Name], [Title], [Company]

### Getting Started

[Call to action. How can customers start using this?]

---

## Internal FAQ

### Why should we build this?
[Business justification]

### What is the market opportunity?
[Market size, growth rate]

### Who are the competitors?
[Competitive landscape]

### What are the risks?
[Technical, market, execution risks]

### What resources are required?
[Team, time, budget]

### How will we measure success?
[Key metrics and targets]

---

## External FAQ

### What is [Product Name]?
[Clear, simple explanation]

### Who is this for?
[Target customer description]

### How much does it cost?
[Pricing model]

### How do I get started?
[Onboarding steps]

### Is my data secure?
[Security assurances]

### Where can I get help?
[Support options]
````

## File: .claude/skills/product/writing-pr-faqs/SKILL.md
````markdown
---
name: writing-pr-faqs
description: Write Press Release / FAQ documents. Use when proposing new products or features using Amazon's working backwards method. Covers PR/FAQ format.
---

# Writing PR/FAQs

## What is a PR/FAQ?

A document that starts with the end in mind:
- **Press Release**: Announcement of the finished product
- **FAQ**: Questions stakeholders would ask

## Structure

### 1. Press Release

#### Headline
Attention-grabbing summary of the benefit.

#### Subheadline
Target customer and key benefit.

#### Problem Statement
What problem does this solve?

#### Solution
How does this product solve it?

#### Quote from Leader
Why this matters to the company.

#### How It Works
Brief explanation of the product.

#### Quote from Customer
Testimonial about the benefit.

#### Call to Action
How to get started.

### 2. Internal FAQ

Business-focused questions:
- Why should we build this?
- What's the market size?
- Who are competitors?
- What are the risks?
- What does success look like?

### 3. External FAQ

Customer-focused questions:
- What is this product?
- Who is it for?
- How much does it cost?
- How do I get started?

## Example Headline

```
[Company] Launches [Product] to Help [Customer] [Benefit]

[City, State] - [Date] - [Company] today announced [Product],
a new [category] that [key benefit] for [target customer].
```

## Tips

1. Write like it's real (present tense)
2. Focus on customer benefit
3. Be specific with metrics
4. Address hard questions in FAQ
5. Iterate based on feedback

## Resources

- [PR/FAQ Template](./resources/pr-faq.template.md)
````

## File: .claude/skills/product/writing-prds/resources/prd.template.md
````markdown
# PRD: [Feature Name]

## Overview

[Brief description of the feature and its purpose]

## Goals & Objectives

### Business Goals
- [Goal 1]
- [Goal 2]

### Success Metrics
| Metric | Current | Target |
|--------|---------|--------|
| [Metric 1] | [Value] | [Value] |
| [Metric 2] | [Value] | [Value] |

## User Stories

### Story 1: [Title]
**As a** [role],
**I want** [feature],
**So that** [benefit].

**Acceptance Criteria:**
- Given [context], when [action], then [outcome]
- Given [context], when [action], then [outcome]

### Story 2: [Title]
...

## Functional Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-1 | [Description] | Must Have | |
| FR-2 | [Description] | Should Have | |
| FR-3 | [Description] | Nice to Have | |

## Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1 | Response Time | < 200ms P95 |
| NFR-2 | Availability | 99.9% |

## Out of Scope

- [What we're NOT building]
- [Features explicitly excluded]

## Assumptions

- [Assumption 1]
- [Assumption 2]

## Dependencies

- [Dependency 1]
- [Dependency 2]

## Open Questions

- [ ] [Question 1]
- [ ] [Question 2]

## Appendix

[Additional context, mockups, research]
````

## File: .claude/skills/product/writing-prds/SKILL.md
````markdown
---
name: writing-prds
description: Create Product Requirements Documents. Use when defining new features, projects, or initiatives. Covers user stories, acceptance criteria, and scope definition.
---

# Writing PRDs

## Workflows

- [ ] **Define Goals**: Articulate business goals and success metrics
- [ ] **Identify Stakeholders**: List all relevant stakeholders
- [ ] **Draft User Stories**: Capture user needs
- [ ] **Detail Requirements**: List functional and non-functional requirements
- [ ] **Save Artifact**: Save to `./artifacts/prd_[feature].md`
- [ ] **Review**: Conduct stakeholder review

## PRD Structure

1. **Overview**: What and why
2. **Goals & Success Metrics**: How we measure success
3. **User Stories**: Who benefits and how
4. **Requirements**: What must be built
5. **Out of Scope**: What we're NOT building
6. **Timeline**: Key milestones

## User Story Format

```
As a [role],
I want [feature],
So that [benefit].
```

### Example
```
As a registered user,
I want to reset my password via email,
So that I can regain access to my account if I forget it.
```

## Acceptance Criteria

Use Given/When/Then format:

```
Given I am on the login page
When I click "Forgot Password"
Then I see a form to enter my email

Given I enter a valid registered email
When I submit the form
Then I receive a password reset email within 5 minutes
```

## INVEST Criteria

Good user stories are:
- **I**ndependent: Can be developed separately
- **N**egotiable: Details can be discussed
- **V**aluable: Delivers user value
- **E**stimable: Can be sized
- **S**mall: Fits in a sprint
- **T**estable: Has clear acceptance criteria

## Resources

- [PRD Template](./resources/prd.template.md)
````

## File: .claude/skills/security/application-security/SKILL.md
````markdown
---
name: application-security
description: Secure applications against common vulnerabilities. Use when reviewing code for security, implementing security controls, or hardening applications. Covers OWASP Top 10.
---

# Application Security

## OWASP Top 10 (2021)

### 1. Broken Access Control
**Risk**: Users accessing unauthorized resources.

**Prevention**:
- Deny by default
- Implement RBAC/ABAC
- Validate permissions server-side
- Log access failures

### 2. Cryptographic Failures
**Risk**: Sensitive data exposure.

**Prevention**:
- Encrypt data at rest and in transit
- Use strong algorithms (AES-256, RSA-2048+)
- Never store passwords in plaintext
- Use secure key management

### 3. Injection
**Risk**: Malicious input executed as code.

**Prevention**:
```typescript
// BAD - SQL injection
const query = `SELECT * FROM users WHERE id = ${userId}`;

// GOOD - Parameterized query
const query = 'SELECT * FROM users WHERE id = $1';
db.query(query, [userId]);
```

### 4. Insecure Design
**Risk**: Missing security controls by design.

**Prevention**:
- Threat modeling
- Security requirements
- Defense in depth

### 5. Security Misconfiguration
**Risk**: Default or weak configuration.

**Prevention**:
- Disable unnecessary features
- Remove default credentials
- Keep software updated
- Harden server configuration

### 6. Vulnerable Components
**Risk**: Using libraries with known vulnerabilities.

**Prevention**:
- Regular dependency audits
- Keep dependencies updated
- Monitor CVE databases

### 7. Authentication Failures
**Risk**: Weak or broken authentication.

**Prevention**:
- Multi-factor authentication
- Strong password policies
- Secure session management
- Rate limiting on login

### 8. Software & Data Integrity
**Risk**: Untrusted sources for updates.

**Prevention**:
- Verify code signatures
- Use SRI for CDN resources
- Secure CI/CD pipeline

### 9. Logging & Monitoring Failures
**Risk**: Attacks go undetected.

**Prevention**:
- Log security events
- Monitor for anomalies
- Alert on suspicious activity

### 10. Server-Side Request Forgery
**Risk**: Server makes requests to unintended destinations.

**Prevention**:
- Validate URLs
- Use allowlists
- Block internal IPs
````

## File: .claude/skills/security/compliance/SKILL.md
````markdown
---
name: compliance
description: Ensure regulatory compliance. Use when implementing GDPR, HIPAA, PCI-DSS, or SOC2 requirements. Covers compliance frameworks and controls.
---

# Compliance

## Common Frameworks

### GDPR (General Data Protection Regulation)
EU data protection regulation.

**Key Requirements**:
- Lawful basis for processing
- Data minimization
- Right to erasure
- Data portability
- Breach notification (72 hours)
- Privacy by design

### HIPAA (Health Insurance Portability and Accountability Act)
US healthcare data protection.

**Key Requirements**:
- Access controls
- Audit controls
- Integrity controls
- Transmission security
- Business Associate Agreements

### PCI-DSS (Payment Card Industry Data Security Standard)
Payment card data protection.

**Key Requirements**:
- Network segmentation
- Encryption of cardholder data
- Access restrictions
- Regular testing
- Security policies

### SOC 2 (Service Organization Control 2)
Trust service criteria.

**Principles**:
- Security
- Availability
- Processing Integrity
- Confidentiality
- Privacy

## Common Controls

### Access Control
```markdown
- [ ] Unique user IDs
- [ ] Strong authentication
- [ ] Role-based access
- [ ] Regular access reviews
- [ ] Termination procedures
```

### Data Protection
```markdown
- [ ] Encryption at rest
- [ ] Encryption in transit
- [ ] Key management
- [ ] Data classification
- [ ] Retention policies
```

### Audit & Monitoring
```markdown
- [ ] Audit logging enabled
- [ ] Log retention (1+ year)
- [ ] Regular log review
- [ ] Alerting on anomalies
- [ ] Incident response plan
```

### Documentation
```markdown
- [ ] Security policies
- [ ] Procedures documented
- [ ] Evidence collection
- [ ] Regular reviews
- [ ] Training records
```

## Compliance Checklist

| Control | GDPR | HIPAA | PCI | SOC2 |
|---------|------|-------|-----|------|
| Encryption | Yes | Yes | Yes | Yes |
| Access Control | Yes | Yes | Yes | Yes |
| Audit Logging | Yes | Yes | Yes | Yes |
| Breach Notification | Yes | Yes | Yes | Yes |
| Risk Assessment | Yes | Yes | Yes | Yes |
````

## File: .claude/skills/security/identity-access/SKILL.md
````markdown
---
name: identity-access
description: Implement identity and access management. Use when designing authentication, authorization, or user management. Covers OAuth2, OIDC, and RBAC.
---

# Identity & Access Management

## Authentication vs Authorization

- **Authentication (AuthN)**: Who are you?
- **Authorization (AuthZ)**: What can you do?

## OAuth 2.0 Flows

### Authorization Code (Web Apps)
```
User -> App -> Auth Server -> User Login
User -> Auth Server -> App (code)
App -> Auth Server (code + secret) -> tokens
```

### PKCE (Mobile/SPA)
Like Authorization Code but with code verifier/challenge instead of secret.

### Client Credentials (Machine-to-Machine)
```
App -> Auth Server (client_id + secret) -> token
```

## OpenID Connect (OIDC)

OAuth 2.0 + identity layer.

**Key additions**:
- ID Token (JWT with user info)
- UserInfo endpoint
- Standard claims (sub, email, name)

## JWT Structure

```
header.payload.signature

Header: {"alg": "RS256", "typ": "JWT"}
Payload: {"sub": "123", "exp": 1234567890}
Signature: RSASHA256(header + payload, privateKey)
```

## Role-Based Access Control (RBAC)

```typescript
interface Role {
  name: string;
  permissions: Permission[];
}

interface Permission {
  resource: string;
  action: 'read' | 'write' | 'delete';
}

function hasPermission(user: User, resource: string, action: string): boolean {
  return user.roles.some(role =>
    role.permissions.some(p =>
      p.resource === resource && p.action === action
    )
  );
}
```

## Best Practices

### Passwords
- Minimum 12 characters
- Hash with Argon2id or bcrypt
- Never store plaintext
- Implement rate limiting

### Sessions
- Use secure, HttpOnly cookies
- Implement CSRF protection
- Set appropriate expiration
- Invalidate on logout

### Tokens
- Short-lived access tokens (15 min)
- Longer refresh tokens (days)
- Rotate refresh tokens
- Store securely (not localStorage)

### MFA
- Support TOTP (Google Authenticator)
- Consider WebAuthn/passkeys
- Backup codes for recovery
````

## File: .claude/skills/security/security-review/SKILL.md
````markdown
---
name: security-review
description: Conduct security code reviews. Use when reviewing code for vulnerabilities, assessing security posture, or auditing applications. Covers security review checklist.
---

# Security Review

## Review Checklist

### Authentication
- [ ] Strong password requirements enforced
- [ ] MFA implemented for sensitive operations
- [ ] Session tokens are cryptographically secure
- [ ] Session timeout is appropriate
- [ ] Logout properly invalidates session

### Authorization
- [ ] Access controls checked server-side
- [ ] Least privilege principle applied
- [ ] Role-based access properly implemented
- [ ] Direct object references validated

### Input Validation
- [ ] All input validated server-side
- [ ] Input type and length checked
- [ ] Special characters properly handled
- [ ] File uploads validated and restricted

### Output Encoding
- [ ] HTML output properly encoded
- [ ] JSON responses use proper content type
- [ ] Error messages don't leak information

### Cryptography
- [ ] Strong algorithms used (AES-256, RSA-2048+)
- [ ] No custom crypto implementations
- [ ] Keys properly managed
- [ ] TLS 1.2+ enforced

### Error Handling
- [ ] Exceptions handled gracefully
- [ ] Error messages don't expose internals
- [ ] Failed operations logged

### Logging
- [ ] Security events logged
- [ ] Sensitive data not logged
- [ ] Logs protected from tampering

## Code Patterns to Flag

### SQL Injection
```typescript
// DANGER
db.query(`SELECT * FROM users WHERE id = ${id}`);
```

### XSS
```typescript
// DANGER
element.innerHTML = userInput;
```

### Hardcoded Secrets
```typescript
// DANGER
const API_KEY = "sk-abc123...";
```

### Insecure Random
```typescript
// DANGER
Math.random(); // For security purposes
```

## Security Review Report

```markdown
## Security Review: [Component]

### Summary
- Critical: [X]
- High: [X]
- Medium: [X]
- Low: [X]

### Findings

#### [CRITICAL] SQL Injection in UserService
**Location**: src/services/user.ts:47
**Description**: User input concatenated into SQL query
**Remediation**: Use parameterized queries
**Code**:
```typescript
// Current (vulnerable)
// Recommended fix
```
```
````

## File: .claude/skills/security/threat-modeling/SKILL.md
````markdown
---
name: threat-modeling
description: Identify and analyze security threats. Use when designing systems, reviewing architecture, or assessing risk. Covers STRIDE methodology.
---

# Threat Modeling

## MCP Tools

**Sequential Thinking** (systematic analysis):
Use for structured STRIDE analysis:
1. Enumerate each threat category systematically
2. Consider attack vectors step-by-step
3. Evaluate mitigations with pros/cons
4. Document reasoning for risk acceptance

## Why Threat Model?

- Identify threats early
- Prioritize security efforts
- Document security assumptions
- Guide security testing

## STRIDE Methodology

Use **Sequential Thinking** to work through each category:

### S - Spoofing
Pretending to be someone else.
- **Example**: Forged authentication tokens
- **Mitigation**: Strong authentication, MFA

### T - Tampering
Modifying data without authorization.
- **Example**: Changing request parameters
- **Mitigation**: Integrity checks, signatures
- **Trace with Grep**: Find all input handlers

### R - Repudiation
Denying an action occurred.
- **Example**: User denies making transaction
- **Mitigation**: Audit logging, non-repudiation

### I - Information Disclosure
Exposing confidential data.
- **Example**: API returns sensitive fields
- **Mitigation**: Encryption, access controls
- **Trace with Grep**: Find data return points

### D - Denial of Service
Making system unavailable.
- **Example**: Resource exhaustion attack
- **Mitigation**: Rate limiting, auto-scaling

### E - Elevation of Privilege
Gaining unauthorized access.
- **Example**: User becomes admin
- **Mitigation**: Least privilege, input validation
- **Trace with Grep**: Find authorization checks

## Threat Modeling Process

### 1. Decompose System
- Use Grep and Glob to identify entry points
- Draw data flow diagrams
- Identify trust boundaries

### 2. Identify Threats
Use **Sequential Thinking** to systematically ask STRIDE questions for each component.

### 3. Trace Data Flow
Use Grep to trace:
- User input → processing → storage
- Authentication token flow
- Sensitive data paths

### 4. Rate Threats
Use DREAD or CVSS scoring:
- **D**amage potential
- **R**eproducibility
- **E**xploitability
- **A**ffected users
- **D**iscoverability

### 5. Mitigate
- Avoid: Remove the feature
- Transfer: Use third-party
- Mitigate: Add controls
- Accept: Document risk (use Sequential Thinking to justify)

## Threat Model Document

```markdown
## Asset: User Database

### Threats
| Threat | Type | Likelihood | Impact | Risk |
|--------|------|------------|--------|------|
| SQL Injection | Tampering | Medium | High | High |
| Data Breach | Info Disclosure | Low | Critical | High |

### Mitigations
1. Parameterized queries
2. Encryption at rest
3. Access logging
```
````

## File: .claude/templates/agent.template.md
````markdown
---
name: worker-[type]
description: [Brief description of worker purpose. Used for parallel [task type].]
permissionMode: acceptEdits
model: haiku
# skills: skill-name-1, skill-name-2
---

<!--
Agents are lightweight swarm workers spawned via Task tool.

Required fields:
  - name: lowercase, hyphens only, max 64 chars
  - description: max 1024 chars, include "when to use" triggers

Optional fields:
  - permissionMode: default|acceptEdits|bypassPermissions|plan
      Use "acceptEdits" for workers that read and write files (most workers).
      Use "bypassPermissions" only when the orchestrator has already validated safety.
  - model: haiku (fast), sonnet (balanced), opus (complex)
  - skills: Comma-separated skill names to auto-load

NOTE: Use permissionMode to control agent access, not "tools:". Restricting
individual tools via "tools:" is fragile; permissionMode provides the right
granularity for swarm workers.
-->

# [Worker Type] Worker

[One-line description of worker focus]

## Focus

- [Primary task 1]
- [Primary task 2]
- [Primary task 3]

## Output Format

```
[Field 1]: [description]
[Field 2]: [description]
[Field 3]: [description]
```

## Constraints

- [Constraint 1 - e.g., "Read-only operations"]
- [Constraint 2 - e.g., "Single task focus"]
- [Constraint 3 - e.g., "Timeout at 5 min"]

## On Completion

Report: [what to report back to orchestrator]
````

## File: .claude/templates/artifacts/adr.template.md
````markdown
# ADR: [Decision Title]

<!--
Architecture Decision Record
Filename: artifacts/adr_NNNN_[topic].md (e.g., adr_0001_database_choice.md)
Owner: Engineering
Handoff to: Engineering (implementation), /swarm-review (security review)
Related Skills: designing-systems, designing-apis, domain-driven-design, cloud-native-patterns, writing-adrs

Format: Based on MADR (Markdown Any Decision Records) - https://adr.github.io/madr/
Best Practices:
- Write ADRs BEFORE committing to implementation
- Keep them short, specific, and comparable across the codebase
- One decision per ADR (not groups of decisions)
- Quantify when possible (SLOs, latency budgets, cost envelopes)
-->

## Metadata

**Status:** Proposed | Accepted | Deprecated | Superseded
**Date:** [YYYY-MM-DD]
**Deciders:** [List of people involved]
**Beads Issue:** [bd://issue-id or N/A]
**Related PRD:** [Link to PRD]
**Tech Strategy Alignment:**
- [ ] Decision follows Golden Path in `.claude/rules/tech-strategy.md`
- [ ] OR deviation is explicitly justified in Rationale section
**Domain Tags:** [security | data | integration | infrastructure | api | frontend | devops]
**Supersedes:** [adr_NNNN if applicable]
**Superseded By:** [adr_NNNN if applicable]

## Context

[What is the issue that we're seeing that motivates this decision or change?]

## Decision Drivers

- [Driver 1: e.g., scalability requirements]
- [Driver 2: e.g., team expertise]
- [Driver 3: e.g., time constraints]
- [Driver 4: e.g., cost considerations]

## Considered Options

### Option 1: [Name]

**Description:** [Brief description]

| Pros | Cons |
|------|------|
| [Pro 1] | [Con 1] |
| [Pro 2] | [Con 2] |

### Option 2: [Name]

**Description:** [Brief description]

| Pros | Cons |
|------|------|
| [Pro 1] | [Con 1] |
| [Pro 2] | [Con 2] |

### Option 3: [Name]

**Description:** [Brief description]

| Pros | Cons |
|------|------|
| [Pro 1] | [Con 1] |
| [Pro 2] | [Con 2] |

## Decision Outcome

**Chosen Option:** [Option N]

**Rationale:** [Why this option was selected over others]

### Quantified Impact (where applicable)

| Metric | Before | After | Notes |
|--------|--------|-------|-------|
| Latency (p99) | [X]ms | [Y]ms | [Context] |
| Cost | $[X]/mo | $[Y]/mo | [Context] |
| Throughput | [X] req/s | [Y] req/s | [Context] |
| SLO Impact | [X]% | [Y]% | [Context] |

### Consequences

**Positive:**
- [Consequence 1]
- [Consequence 2]

**Negative:**
- [Consequence 1]
- [Consequence 2]

**Risks:**
- [Risk 1 and mitigation]

## Technical Details

### Architecture

```
[ASCII diagram or description of architecture]
```

### API Contract

```
[Key interfaces, endpoints, or contracts]
```

### Data Model

```
[Key entities and relationships]
```

## Implementation Plan

1. [ ] [Step 1]
2. [ ] [Step 2]
3. [ ] [Step 3]

## Validation

- [ ] Performance benchmarks meet requirements
- [ ] Security review completed
- [ ] Cost analysis approved

## Links

- [Related ADR 1](./adr_related.md)
- [PRD](./prd_feature.md)
- [External documentation]

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| [Date] | [Name] | Initial draft |
````

## File: .claude/templates/artifacts/design_spec.template.md
````markdown
# Design Spec: [Component Name]

<!--
Visual/UI Design Specification
Filename: artifacts/design_spec_[component].md
Owner: UI/UX Designer (/ui-ux-designer)
Handoff to: Engineering (implementation), /code-check for accessibility review
Related Skills: interface-design, accessibility, design-systems, visual-assets

Design Principles:
- Mobile-first responsive design
- WCAG 2.1 AA compliance required
- Design system consistency
-->

## Overview

**Status:** Draft | In Review | Approved
**Designer:** [Name]
**Date:** [YYYY-MM-DD]
**Beads Issue:** [bd://issue-id or N/A]
**Related PRD:** [Link to PRD]
**Approach:** Mobile-first

## Design Goals

- [Goal 1: e.g., Improve task completion rate]
- [Goal 2: e.g., Reduce cognitive load]
- [Goal 3: e.g., Maintain brand consistency]

## User Flow

```
[Start] → [Step 1] → [Step 2] → [Decision Point]
                                    ↓         ↓
                              [Path A]    [Path B]
                                    ↓         ↓
                                [End]     [End]
```

## Component Specifications

### [Component 1]

**Purpose:** [What this component does]

**States:**
| State | Description | Visual |
|-------|-------------|--------|
| Default | [Description] | [Link/Reference] |
| Hover | [Description] | [Link/Reference] |
| Active | [Description] | [Link/Reference] |
| Disabled | [Description] | [Link/Reference] |
| Error | [Description] | [Link/Reference] |

**Properties:**
| Property | Value | Notes |
|----------|-------|-------|
| Width | [Value] | |
| Height | [Value] | |
| Padding | [Value] | |
| Border Radius | [Value] | |

### [Component 2]

[Repeat structure above]

## Layout

### Desktop (1440px+)

```
┌─────────────────────────────────────┐
│  Header                             │
├─────────┬───────────────────────────┤
│         │                           │
│  Side   │     Main Content          │
│  Nav    │                           │
│         │                           │
├─────────┴───────────────────────────┤
│  Footer                             │
└─────────────────────────────────────┘
```

### Tablet (768px - 1439px)

[Layout description]

### Mobile (< 768px)

[Layout description]

## Typography

| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| H1 | [Font] | [Size] | [Weight] | [Height] |
| H2 | [Font] | [Size] | [Weight] | [Height] |
| Body | [Font] | [Size] | [Weight] | [Height] |
| Caption | [Font] | [Size] | [Weight] | [Height] |

## Colors

| Usage | Token | Light Mode | Dark Mode |
|-------|-------|------------|-----------|
| Primary | --color-primary | #XXXXXX | #XXXXXX |
| Secondary | --color-secondary | #XXXXXX | #XXXXXX |
| Background | --color-bg | #XXXXXX | #XXXXXX |
| Text | --color-text | #XXXXXX | #XXXXXX |
| Error | --color-error | #XXXXXX | #XXXXXX |

## Spacing

Using 8px grid system:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

## Animations

<!--
Keep animations subtle and purposeful. Respect prefers-reduced-motion.
Duration: 150-300ms for micro-interactions, 300-500ms for transitions.
-->

| Element | Trigger | Duration | Easing | Properties |
|---------|---------|----------|--------|------------|
| Button | Hover | 150ms | ease-in-out | background-color, transform |
| Modal | Open | 300ms | ease-out | opacity, transform |
| Dropdown | Expand | 200ms | ease-in-out | max-height, opacity |
| [Element] | [Trigger] | [Duration] | [Easing] | [Properties] |

## Accessibility

### Requirements

- [ ] Color contrast ratio ≥ 4.5:1 (AA)
- [ ] Focus indicators visible
- [ ] Keyboard navigation supported
- [ ] Screen reader compatible
- [ ] Touch targets ≥ 44px

### ARIA Labels

| Element | aria-label | aria-describedby |
|---------|------------|------------------|
| [Element] | [Label] | [Description ID] |

## Assets

| Asset | Format | Sizes | Location |
|-------|--------|-------|----------|
| [Icon 1] | SVG | 16, 24, 32 | /assets/icons/ |
| [Image 1] | WebP | 1x, 2x | /assets/images/ |

## Figma/Design Links

- [Main Design File](link)
- [Component Library](link)
- [Prototype](link)

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Design Lead | | | Pending |
| Product | | | Pending |
| Engineering | | | Pending |
````

## File: .claude/templates/artifacts/plan.template.md
````markdown
# Plan: [Task Name]

<!--
Implementation Plan
Filename: artifacts/plan_[task].md
Owner: Engineering
Handoff to: Engineering (implementation), /code-check (review), /swarm-review (audit)
Related Skills: implementing-code, debugging, testing, test-driven-development
-->

## Overview

**Status:** Draft | Approved | In Progress | Complete
**Author:** [Name]
**Date:** [YYYY-MM-DD]
**Beads Issue:** [bd://issue-id or N/A]
**Related PRD:** [Link to PRD]
**Related ADR:** [Link to ADR]

## Objective

[Clear, concise statement of what this plan will accomplish]

## Scope

### In Scope

- [Item 1]
- [Item 2]

### Out of Scope

- [Item 1]
- [Item 2]

## Technical Approach

### Architecture Changes

```
[Diagram or description of architectural changes]
```

### Key Decisions

| Decision | Rationale |
|----------|-----------|
| [Decision 1] | [Why] |
| [Decision 2] | [Why] |

## Implementation Steps

### Phase 1: [Setup/Preparation]

- [ ] **Step 1.1:** [Description]
  - Files: `path/to/file.ts`
  - Details: [Additional context]

- [ ] **Step 1.2:** [Description]
  - Files: `path/to/file.ts`
  - Details: [Additional context]

### Phase 2: [Core Implementation]

- [ ] **Step 2.1:** [Description]
  - Files: `path/to/file.ts`
  - Details: [Additional context]

- [ ] **Step 2.2:** [Description]
  - Files: `path/to/file.ts`
  - Details: [Additional context]

### Phase 3: [Testing & Cleanup]

- [ ] **Step 3.1:** Write unit tests
  - Files: `path/to/file.test.ts`
  - Coverage: [Target %]

- [ ] **Step 3.2:** Integration testing
  - Scenarios: [List]

- [ ] **Step 3.3:** Documentation
  - Update: [Files/sections]

## Files to Modify

| File | Action | Description |
|------|--------|-------------|
| `path/to/file.ts` | Create | [Purpose] |
| `path/to/existing.ts` | Modify | [Changes] |
| `path/to/old.ts` | Delete | [Reason] |

## Dependencies

### Code Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| [package] | [version] | [why needed] |

### Service Dependencies

| Service | Status | Notes |
|---------|--------|-------|
| [Service] | [Available/Needed] | [Notes] |

## Testing Strategy

### Unit Tests

| Component | Test Cases | Status |
|-----------|------------|--------|
| [Component 1] | [Cases] | Pending |
| [Component 2] | [Cases] | Pending |

### Integration Tests

| Scenario | Expected Outcome | Status |
|----------|------------------|--------|
| [Scenario 1] | [Outcome] | Pending |
| [Scenario 2] | [Outcome] | Pending |

### Manual Testing

- [ ] [Test case 1]
- [ ] [Test case 2]

## Rollback Plan

1. [Step to revert if issues arise]
2. [Step to restore previous state]
3. [Verification steps]

## Risks

| Risk | Mitigation |
|------|------------|
| [Risk 1] | [How to handle] |
| [Risk 2] | [How to handle] |

## Checklist

### Before Starting

- [ ] PRD/ADR approved
- [ ] Dependencies available
- [ ] Branch created from main

### Before PR

- [ ] All tests passing
- [ ] No linting errors
- [ ] Documentation updated
- [ ] Self-review complete

### Before Merge

- [ ] Code review approved
- [ ] QA sign-off
- [ ] No merge conflicts

## Notes

[Any additional context, considerations, or comments]

---

## Progress Log

| Date | Update |
|------|--------|
| [Date] | [What was done] |
````

## File: .claude/templates/artifacts/postmortem.template.md
````markdown
# Post-Mortem: [Incident Title]

<!--
Incident Post-Mortem Report
Filename: artifacts/postmortem_[incident-id].md
Owner: Engineering / SRE
Handoff to: Engineering for design changes and fixes
Related Skills: incident-management, observability, infrastructure

Blameless culture: Focus on systems and processes, not individuals.
-->

## Summary

**Incident ID:** [INC-XXXX]
**Date:** [YYYY-MM-DD]
**Duration:** [X hours Y minutes]
**Severity:** SEV1 | SEV2 | SEV3 | SEV4
**Status:** Draft | In Review | Complete
**Beads Issue:** [bd://issue-id or N/A]

**Author:** [Name]
**Incident Commander:** [Name]
**Reviewers:** [Names]

### One-Line Summary

[Brief description of what happened and impact]

---

## Impact

### User Impact

| Metric | Value |
|--------|-------|
| Users Affected | [Number or %] |
| Duration of Impact | [Time] |
| Error Rate Peak | [%] |
| Support Tickets | [Number] |

### Business Impact

| Metric | Value |
|--------|-------|
| Revenue Impact | [$X or N/A] |
| SLA Breach | [Yes/No] |
| Customer Notifications | [Number] |

### Systems Affected

- [System/Service 1]
- [System/Service 2]

---

## Timeline

All times in UTC.

| Time | Event |
|------|-------|
| HH:MM | [First alert/detection] |
| HH:MM | [Incident declared, severity assigned] |
| HH:MM | [Investigation started] |
| HH:MM | [Root cause identified] |
| HH:MM | [Mitigation applied] |
| HH:MM | [Service restored] |
| HH:MM | [Incident closed] |

---

## Root Cause

### What Happened

[Detailed technical explanation of the failure chain]

### Why It Happened

[Analysis of underlying causes - use 5 Whys if helpful]

1. **Why?** [First level cause]
2. **Why?** [Second level cause]
3. **Why?** [Third level cause]
4. **Why?** [Fourth level cause]
5. **Why?** [Root cause]

### Trigger

[What specific event or change triggered the incident?]

---

## Contributing Factors

Factors that made the incident possible or worse:

- [ ] **Detection Gap**: [Monitoring didn't catch it]
- [ ] **Process Gap**: [Missing runbook/procedure]
- [ ] **Testing Gap**: [Untested scenario]
- [ ] **Documentation Gap**: [Missing/outdated docs]
- [ ] **Capacity Issue**: [Resource constraints]
- [ ] **Dependency Failure**: [External service]
- [ ] **Configuration Error**: [Misconfiguration]
- [ ] **Code Defect**: [Bug in code]
- [ ] **Human Error**: [Manual mistake]

Details:
- [Factor 1]: [Explanation]
- [Factor 2]: [Explanation]

---

## Detection

### How Was It Detected?

- [ ] Automated monitoring/alerting
- [ ] Customer report
- [ ] Internal user report
- [ ] Scheduled check
- [ ] Other: [specify]

### Detection Delay

<!--
Key Incident Metrics:
- TTD: When did we first know something was wrong?
- TTA: When did someone acknowledge and start investigating?
- TTM: When was the bleeding stopped (even if not fully fixed)?
- TTR: When was the incident fully resolved?
- MTTR (Mean Time to Recovery) = TTR, used for aggregate reporting
-->

| Metric | Value | Notes |
|--------|-------|-------|
| Time to Detection (TTD) | [X minutes] | First alert or report |
| Time to Acknowledgment (TTA) | [X minutes] | Investigation started |
| Time to Mitigation (TTM) | [X minutes] | Bleeding stopped |
| Time to Resolution (TTR/MTTR) | [X minutes] | Fully resolved |

### Detection Gaps

[What should have alerted us but didn't?]

---

## Response

### What Went Well

- [Positive 1: e.g., "Quick escalation to on-call"]
- [Positive 2: e.g., "Clear communication in incident channel"]
- [Positive 3: e.g., "Runbook was helpful"]

### What Didn't Go Well

- [Issue 1: e.g., "Took too long to identify root cause"]
- [Issue 2: e.g., "Missing access to logs"]
- [Issue 3: e.g., "Unclear ownership"]

### Where We Got Lucky

- [Lucky break 1: e.g., "Engineer happened to be online"]
- [Lucky break 2: e.g., "Impact was during low-traffic period"]

---

## Resolution

### Immediate Fix

[What was done to stop the bleeding?]

```
[Commands/steps taken]
```

### Verification

[How did we confirm the fix worked?]

---

## Action Items

### Immediate (Within 1 Week)

| Action | Owner | Due Date | Status | Beads Issue |
|--------|-------|----------|--------|-------------|
| [Action 1] | [Name] | [Date] | Open | [bd://xxx] |
| [Action 2] | [Name] | [Date] | Open | [bd://xxx] |

### Short-Term (Within 1 Month)

| Action | Owner | Due Date | Status | Beads Issue |
|--------|-------|----------|--------|-------------|
| [Action 1] | [Name] | [Date] | Open | [bd://xxx] |

### Long-Term (Within 1 Quarter)

| Action | Owner | Due Date | Status | Beads Issue |
|--------|-------|----------|--------|-------------|
| [Action 1] | [Name] | [Date] | Open | [bd://xxx] |

---

## Prevention

### How Do We Prevent Recurrence?

[Specific technical and process changes]

### How Do We Detect Faster?

[New alerts, dashboards, or checks to add]

### How Do We Recover Faster?

[Runbook updates, automation, or process improvements]

---

## Lessons Learned

### Key Takeaways

1. [Lesson 1]
2. [Lesson 2]
3. [Lesson 3]

### Process Improvements

- [Improvement 1]
- [Improvement 2]

---

## Appendix

### Related Incidents

- [Link to similar past incidents]

### Relevant Logs/Dashboards

- [Link to logs]
- [Link to dashboard]
- [Link to traces]

### External References

- [Vendor post-mortem if applicable]
- [Related documentation]

---

## Sign-off

| Role | Name | Date |
|------|------|------|
| Author | | |
| Incident Commander | | |
| Engineering Lead | | |
| Product Owner | | |
````

## File: .claude/templates/artifacts/pr_faq.template.md
````markdown
# PR-FAQ: [Product/Feature Name]

<!--
Press Release / Frequently Asked Questions
Filename: artifacts/pr_faq_[feature].md
Owner: Product
Handoff to: Engineering for feasibility review, then PRD creation
Related Skills: writing-pr-faqs, brainstorming, requirements-analysis

This document comes BEFORE the PRD in the planning process.
Uses Amazon's "Working Backwards" methodology.

Best Practices:
- Write as if the product is already launched (future tense → past tense)
- Keep total length to 5-6 pages maximum
- Focus on customer benefits, not features or technical details
- Problem paragraph must demonstrate deep customer understanding
- Most PR-FAQs don't get approved — this is a feature, not a bug
- Iterate multiple times before presenting for approval

Reading process: Everyone reads the document in silence at the start of review meetings
(typically 20 minutes for 6 pages). Do not send as pre-read.
-->

## Overview

**Status:** Draft | In Review | Approved
**Author:** [Name]
**Date:** [YYYY-MM-DD]
**Beads Issue:** [bd://issue-id or N/A]

---

# PRESS RELEASE

## [Company] Launches [Product Name] to Help [Target Customer] [Key Benefit]

**[City, State] — [Date]** — [Company] today announced [Product Name], a new [product category] that enables [target customers] to [key benefit/outcome]. [Product Name] addresses [core problem] by providing [solution approach].

### The Problem

<!--
This is the most critical paragraph. Write from the CUSTOMER'S point of view.
- Be specific about pain points and emotional impact
- Describe current workarounds customers use
- Explain why existing solutions fall short
- Identify a problem with a large TAM (customers × willingness to pay)
-->

[2-3 sentences describing the customer problem. Be specific about pain points, current workarounds, and why existing solutions fall short.]

### The Solution

[2-3 sentences describing how this product solves the problem. Focus on customer benefits, not features. Use concrete examples.]

### How It Works

[3-5 bullet points explaining the product mechanics in simple terms]

- **[Step/Feature 1]**: [Benefit-focused description]
- **[Step/Feature 2]**: [Benefit-focused description]
- **[Step/Feature 3]**: [Benefit-focused description]

### Quote from Company Leader

> "[Quote expressing why this matters to the company's mission and customers. Should convey passion and vision.]"
>
> — [Name], [Title], [Company]

### Quote from Customer

> "[Testimonial quote describing the benefit experienced. Should be specific and measurable if possible.]"
>
> — [Name], [Title/Role], [Company/Context]

### Getting Started

[1-2 sentences on how customers can access/use the product. Include call to action.]

---

# INTERNAL FAQ

## Strategic Questions

### Why should we build this now?

[Answer addressing market timing, competitive landscape, and strategic alignment]

### What is the target market size?

| Metric | Value | Source |
|--------|-------|--------|
| TAM (Total Addressable Market) | $[X]B | [Source] |
| SAM (Serviceable Addressable Market) | $[X]M | [Source] |
| SOM (Serviceable Obtainable Market) | $[X]M | [Assumption] |

### Who are the competitors?

| Competitor | Strengths | Weaknesses | Our Differentiation |
|------------|-----------|------------|---------------------|
| [Competitor 1] | [Strengths] | [Weaknesses] | [How we're different] |
| [Competitor 2] | [Strengths] | [Weaknesses] | [How we're different] |

### What are the key risks?

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk 1] | [L/M/H] | [L/M/H] | [Strategy] |
| [Risk 2] | [L/M/H] | [L/M/H] | [Strategy] |
| [Risk 3] | [L/M/H] | [L/M/H] | [Strategy] |

### What does success look like?

| Timeframe | Metric | Target |
|-----------|--------|--------|
| Launch (Day 1) | [Metric] | [Target] |
| 30 days | [Metric] | [Target] |
| 90 days | [Metric] | [Target] |
| 1 year | [Metric] | [Target] |

### What resources are required?

| Resource | Estimate | Notes |
|----------|----------|-------|
| Engineering | [X FTEs for Y months] | |
| Design | [X FTEs for Y months] | |
| Infrastructure | [$X/month] | |
| Other | [Details] | |

## Technical Questions

### Is this technically feasible?

[Answer addressing technical approach, dependencies, and known challenges]

### What are the technical dependencies?

- [Dependency 1]
- [Dependency 2]

### What's the estimated timeline?

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Discovery | [X weeks] | [Deliverable] |
| MVP | [X weeks] | [Deliverable] |
| Launch | [X weeks] | [Deliverable] |

---

# EXTERNAL FAQ

## Customer Questions

### What is [Product Name]?

[1-2 sentence answer in plain language]

### Who is this for?

[Describe target customer persona]

### How much does it cost?

| Tier | Price | Includes |
|------|-------|----------|
| [Tier 1] | [Price] | [Features] |
| [Tier 2] | [Price] | [Features] |

### How do I get started?

1. [Step 1]
2. [Step 2]
3. [Step 3]

### What makes this different from [Competitor]?

[Clear differentiation statement]

### Is my data secure?

[Security and privacy assurance]

### What if I need help?

[Support options]

---

## Appendix

### Customer Research

[Link to or summary of customer interviews, surveys, etc.]

### Mockups/Visuals

[Link to or embed early concept visuals]

---

## Approval

| Role | Name | Date | Decision |
|------|------|------|----------|
| Product | | | Pending |
| Engineering | | | Pending |
| Leadership | | | Pending |

---

## Next Steps

After PR-FAQ approval:
1. [ ] Create detailed PRD (`artifacts/prd_[feature].md`)
2. [ ] Technical feasibility review with Architect
3. [ ] Create Beads issue for tracking
````

## File: .claude/templates/artifacts/prd.template.md
````markdown
# PRD: [Feature Name]

<!--
Product Requirements Document
Filename: artifacts/prd_[feature].md
Owner: Product
Handoff to: Engineering (technical feasibility), /ui-ux-designer (visual design)
Related Skills: writing-prds, decomposing-tasks, requirements-analysis
-->

## Overview

**Status:** Draft | In Review | Approved
**Author:** [Name]
**Date:** [YYYY-MM-DD]
**Version:** [1.0]
**Beads Issue:** [bd://issue-id or N/A]
**PR-FAQ:** [Link to approved PR-FAQ - required for new initiatives]
**Stakeholders:** [List]

## Problem Statement

[What problem are we solving? Who has this problem? Why does it matter?]

### Evidence

Great PRDs prove problems exist with evidence. Include both types:

**Quantitative Evidence** (numbers that demonstrate impact):
- [Financial metric: e.g., "$X lost per month due to..."]
- [Behavioral data: e.g., "Y% of users abandon at step Z"]
- [Volume indicator: e.g., "N support tickets/week about..."]

**Qualitative Evidence** (insights that explain the human side):
- [User quote: "Direct feedback from user research..."]
- [Support insight: "Common complaint pattern..."]
- [Observation: "During usability testing, we saw..."]

## Goals & Success Metrics

| Goal | Metric | Target |
|------|--------|--------|
| [Goal 1] | [Metric] | [Target value] |
| [Goal 2] | [Metric] | [Target value] |

## User Stories

<!--
Use INVEST criteria for all stories:
- Independent: Self-contained
- Negotiable: Not a contract
- Valuable: Delivers value
- Estimable: Can be sized
- Small: Fits in a sprint
- Testable: Clear acceptance criteria
-->

### [Persona 1]

- As a [persona], I want [capability] so that [benefit]
  - Acceptance: [Testable criteria]
- As a [persona], I want [capability] so that [benefit]
  - Acceptance: [Testable criteria]

### [Persona 2]

- As a [persona], I want [capability] so that [benefit]
  - Acceptance: [Testable criteria]

## Requirements

### Functional Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-1 | [Requirement] | Must Have | |
| FR-2 | [Requirement] | Should Have | |
| FR-3 | [Requirement] | Nice to Have | |

### Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1 | Performance | [e.g., < 200ms response time] |
| NFR-2 | Availability | [e.g., 99.9% uptime] |
| NFR-3 | Security | [e.g., SOC 2 compliant] |

## Scope

### In Scope

- [Feature/capability 1]
- [Feature/capability 2]

### Out of Scope

- [Explicitly excluded item 1]
- [Explicitly excluded item 2]

## Dependencies

| Dependency | Owner | Status | Risk |
|------------|-------|--------|------|
| [Dependency 1] | [Team/Person] | [Status] | [Low/Med/High] |

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk 1] | [L/M/H] | [L/M/H] | [Strategy] |

## Open Questions

- [ ] [Question 1]
- [ ] [Question 2]

## Appendix

### Mockups/Wireframes

[Link or embed]

### Research

[Link to user research, competitive analysis, etc.]

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product | | | Pending |
| Engineering | | | Pending |
| Design | | | Pending |

---

## Next Steps & Handoffs

After PRD approval:

1. [ ] **Architecture Review**: Technical feasibility assessment
   - Trigger: `/swarm-plan` or direct session
   - Output: ADR (`artifacts/adr_[topic].md`)

2. [ ] **UI/UX Designer**: Visual design and wireframes
   - Trigger: `/ui-ux-designer`
   - Output: Design Spec (`artifacts/design_spec_[component].md`)

3. [ ] **Engineering Estimate**: Effort estimation and decomposition
   - Trigger: `/swarm-plan`
   - Output: Implementation Plan (`artifacts/plan_[task].md`)

4. [ ] **Create Beads Issues**: Decompose into trackable work items
   - Command: `bd create "Title" -t feature`

**Related Artifacts**:
- ADR: [Link after architect review]
- Design Spec: [Link after designer review]
- Implementation Plan: [Link after decomposition]

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Date] | [Name] | Initial draft |
| | | | |

<!--
Track major requirement changes here. This helps stakeholders understand
how requirements have evolved and provides context for future reference.
-->
````

## File: .claude/templates/artifacts/roadmap.template.md
````markdown
# Roadmap: [Project Name]

<!--
Project Roadmap
Filename: artifacts/roadmap_[project].md
Owner: Product
Handoff to: Engineering and design as needed
Related Skills: execution-roadmaps, decomposing-tasks, estimating-work, agile-methodology
-->

## Overview

**Status:** Active | Planning | Completed
**Owner:** [Name]
**Last Updated:** [YYYY-MM-DD]
**Beads Issue:** [bd://issue-id or N/A]
**Timeline:** [Start Date] - [End Date]

## Vision

[One paragraph describing the end-state vision for this project]

## Goals

| Goal | Key Result | Status |
|------|------------|--------|
| [Goal 1] | [Measurable outcome] | Not Started |
| [Goal 2] | [Measurable outcome] | Not Started |
| [Goal 3] | [Measurable outcome] | Not Started |

## Phases

### Phase 1: [Name] (Foundation)

**Timeline:** [Start] - [End]
**Status:** Not Started | In Progress | Complete

**Deliverables:**
- [ ] [Deliverable 1]
- [ ] [Deliverable 2]
- [ ] [Deliverable 3]

**Dependencies:** None

**Risks:**
- [Risk 1]

---

### Phase 2: [Name] (Core Features)

**Timeline:** [Start] - [End]
**Status:** Not Started | In Progress | Complete

**Deliverables:**
- [ ] [Deliverable 1]
- [ ] [Deliverable 2]
- [ ] [Deliverable 3]

**Dependencies:** Phase 1 complete

**Risks:**
- [Risk 1]

---

### Phase 3: [Name] (Enhancement)

**Timeline:** [Start] - [End]
**Status:** Not Started | In Progress | Complete

**Deliverables:**
- [ ] [Deliverable 1]
- [ ] [Deliverable 2]
- [ ] [Deliverable 3]

**Dependencies:** Phase 2 complete

**Risks:**
- [Risk 1]

---

## Milestones

| Milestone | Target Date | Status | Notes |
|-----------|-------------|--------|-------|
| [Milestone 1] | [Date] | Pending | |
| [Milestone 2] | [Date] | Pending | |
| [Milestone 3] | [Date] | Pending | |
| [Launch] | [Date] | Pending | |

## Resource Allocation

| Phase | Engineering | Design | Product | QA |
|-------|-------------|--------|---------|-----|
| Phase 1 | [X FTEs] | [X FTEs] | [X FTEs] | [X FTEs] |
| Phase 2 | [X FTEs] | [X FTEs] | [X FTEs] | [X FTEs] |
| Phase 3 | [X FTEs] | [X FTEs] | [X FTEs] | [X FTEs] |

## Dependencies

### Dependency Diagram

<!--
Use Mermaid for complex dependency visualization.
ASCII diagram provided for quick reference.
-->

```
Phase 1 ──────┬──────→ Phase 2 ──────→ Phase 3
              │
              └──────→ [External Dependency]
```

<details>
<summary>Mermaid Diagram (for complex roadmaps)</summary>

```mermaid
graph LR
    P1[Phase 1: Foundation] --> P2[Phase 2: Core]
    P1 --> EXT[External Dependency]
    P2 --> P3[Phase 3: Enhancement]
    EXT -.-> P2
```

</details>

| Dependency | Owner | Status | Risk Level |
|------------|-------|--------|------------|
| [Dep 1] | [Team] | [Status] | [L/M/H] |
| [Dep 2] | [Team] | [Status] | [L/M/H] |

## Risks & Mitigations

<!--
Risk Score = Probability × Impact (L=1, M=2, H=3)
- Score 1-2: Monitor
- Score 3-4: Active mitigation required
- Score 6-9: Escalate immediately
-->

| Risk | Probability | Impact | Score | Mitigation | Owner |
|------|-------------|--------|-------|------------|-------|
| [Risk 1] | [L/M/H] | [L/M/H] | [1-9] | [Strategy] | [Name] |
| [Risk 2] | [L/M/H] | [L/M/H] | [1-9] | [Strategy] | [Name] |

## Communication Plan

| Audience | Frequency | Channel | Content |
|----------|-----------|---------|---------|
| Stakeholders | Weekly | Email | Status update |
| Team | Daily | Standup | Progress/blockers |
| Executives | Bi-weekly | Meeting | Milestone review |

## Success Criteria

### Launch Readiness

- [ ] All Phase 1-3 deliverables complete
- [ ] Performance benchmarks met
- [ ] Security review passed
- [ ] Documentation complete
- [ ] Support team trained

### Post-Launch

| Metric | Baseline | Target | Actual |
|--------|----------|--------|--------|
| [Metric 1] | [Value] | [Value] | TBD |
| [Metric 2] | [Value] | [Value] | TBD |

## Related Documents

- [PRD](./prd_feature.md)
- [ADR](./adr_topic.md)
- [Design Spec](./design_spec_component.md)

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| [Date] | [Name] | Initial roadmap |
````

## File: .claude/templates/artifacts/security_audit.template.md
````markdown
# Security Audit: [Scope/Component]

<!--
Security Audit Report
Filename: artifacts/security_audit_[date].md
Owner: Security / Engineering
Handoff to: Engineering for remediation, Architecture review for design changes
Related Skills: application-security, threat-modeling, security-review, compliance, identity-access

Methodology:
- STRIDE threat modeling (Spoofing, Tampering, Repudiation, Information Disclosure, DoS, Elevation)
- OWASP Top 10 (2021) - https://owasp.org/Top10/
- MITRE ATT&CK framework for advanced threat mapping - https://attack.mitre.org/
- CWE (Common Weakness Enumeration) for vulnerability classification
- Dependency scanning (Trivy, Snyk, or equivalent)

For cloud-native systems, also consider:
- Shared responsibility model (what's provider-managed vs customer-managed)
- IAM policies, roles, and service accounts
- Network segmentation (VPCs, security groups)
- Managed service configurations
-->

## Executive Summary

**Audit Date:** [YYYY-MM-DD]
**Auditor:** [Name]
**Beads Issue:** [bd://issue-id or N/A]
**Scope:** [What was audited]
**Overall Risk Level:** Critical | High | Medium | Low

### Summary of Findings

| Severity | Count | Remediated |
|----------|-------|------------|
| Critical | 0 | 0 |
| High | 0 | 0 |
| Medium | 0 | 0 |
| Low | 0 | 0 |
| Informational | 0 | N/A |

## Scope

### In Scope

- [Component/System 1]
- [Component/System 2]
- [API endpoints]
- [Data flows]

### Out of Scope

- [Explicitly excluded items]

### Methodology

- [ ] Static code analysis
- [ ] Dynamic testing
- [ ] Dependency scanning
- [ ] Configuration review
- [ ] Threat modeling (STRIDE)

### Pre-Audit Checklist

Pre-audit security checklist requirements:

- [ ] Authentication/Authorization reviewed
- [ ] Input validation verified
- [ ] Secrets management audited
- [ ] Dependency vulnerabilities scanned
- [ ] Data encryption confirmed
- [ ] Audit logging verified

## STRIDE Threat Analysis

| Threat | Description | Mitigated | Notes |
|--------|-------------|-----------|-------|
| **S**poofing | Identity impersonation | Yes/No/Partial | |
| **T**ampering | Data modification | Yes/No/Partial | |
| **R**epudiation | Deny actions | Yes/No/Partial | |
| **I**nformation Disclosure | Data exposure | Yes/No/Partial | |
| **D**enial of Service | Availability attacks | Yes/No/Partial | |
| **E**levation of Privilege | Unauthorized access | Yes/No/Partial | |

## Findings

### Critical Findings

#### [FINDING-001] [Title]

**Severity:** Critical
**Status:** Open | Remediated | Accepted Risk
**CWE:** [CWE-XXX]
**CVSS:** [Score]

**Description:**
[Detailed description of the vulnerability]

**Location:**
- File: `path/to/file.ts:123`
- Endpoint: `POST /api/vulnerable`

**Impact:**
[What could happen if exploited]

**Proof of Concept:**
```
[Code or steps to reproduce]
```

**Remediation:**
```
[Code fix or mitigation steps]
```

**References:**
- [OWASP Reference](link)
- [CVE if applicable](link)

---

### High Findings

#### [FINDING-002] [Title]

**Severity:** High
**Status:** Open | Remediated | Accepted Risk
**CWE:** [CWE-XXX]

[Same structure as above]

---

### Medium Findings

#### [FINDING-003] [Title]

**Severity:** Medium
**Status:** Open | Remediated | Accepted Risk
**CWE:** [CWE-XXX]

[Same structure as above]

---

### Low Findings

#### [FINDING-004] [Title]

**Severity:** Low
**Status:** Open | Remediated | Accepted Risk

[Same structure as above]

---

### Informational

#### [INFO-001] [Title]

[Observations, best practices, recommendations]

---

## OWASP Top 10 Assessment

| Category | Status | Notes |
|----------|--------|-------|
| A01: Broken Access Control | Pass/Fail | [Notes] |
| A02: Cryptographic Failures | Pass/Fail | [Notes] |
| A03: Injection | Pass/Fail | [Notes] |
| A04: Insecure Design | Pass/Fail | [Notes] |
| A05: Security Misconfiguration | Pass/Fail | [Notes] |
| A06: Vulnerable Components | Pass/Fail | [Notes] |
| A07: Auth Failures | Pass/Fail | [Notes] |
| A08: Data Integrity Failures | Pass/Fail | [Notes] |
| A09: Logging Failures | Pass/Fail | [Notes] |
| A10: SSRF | Pass/Fail | [Notes] |

## Cloud-Native Security Assessment

*Skip this section if not applicable to your architecture.*

### Shared Responsibility Model

| Security Control | Provider Managed | Customer Managed | Status |
|-----------------|------------------|------------------|--------|
| Physical security | ✅ | | N/A |
| Network infrastructure | ✅ | | N/A |
| Hypervisor | ✅ | | N/A |
| OS patching | [Varies] | [Varies] | [Status] |
| Application security | | ✅ | [Status] |
| Data encryption | [Varies] | ✅ | [Status] |
| IAM configuration | | ✅ | [Status] |
| Network configuration | | ✅ | [Status] |

### IAM Review

| Resource | Permissions | Least Privilege | Notes |
|----------|-------------|-----------------|-------|
| [Service Role] | [Permissions] | Yes/No | [Notes] |
| [User Role] | [Permissions] | Yes/No | [Notes] |

### Network Security

- [ ] VPC/Network isolation configured
- [ ] Security groups follow least privilege
- [ ] Private subnets used for sensitive workloads
- [ ] No public IPs on internal services
- [ ] VPC flow logs enabled

### Managed Services Configuration

| Service | Configuration Review | Status |
|---------|---------------------|--------|
| [RDS/Database] | Encryption, backups, public access | [Status] |
| [S3/Storage] | Bucket policies, encryption, versioning | [Status] |
| [Lambda/Compute] | IAM roles, VPC config, secrets | [Status] |

## Dependency Analysis

### Vulnerable Dependencies

| Package | Version | Vulnerability | Severity | Fix Version |
|---------|---------|---------------|----------|-------------|
| [pkg] | [ver] | [CVE-XXXX] | [Sev] | [ver] |

### Outdated Dependencies

| Package | Current | Latest | Risk |
|---------|---------|--------|------|
| [pkg] | [ver] | [ver] | [L/M/H] |

## Configuration Review

### Secrets Management

- [ ] No hardcoded secrets in code
- [ ] Environment variables properly configured
- [ ] Secrets rotation policy in place

### Authentication

- [ ] Strong password policy enforced
- [ ] MFA available/required
- [ ] Session management secure

### Authorization

- [ ] Principle of least privilege applied
- [ ] Role-based access control implemented
- [ ] API authorization consistent

### Data Protection

- [ ] Data encrypted at rest
- [ ] Data encrypted in transit (TLS 1.2+)
- [ ] PII handling compliant

## Recommendations

### Immediate Actions (Critical/High)

1. [Action 1]
2. [Action 2]

### Short-term (Medium)

1. [Action 1]
2. [Action 2]

### Long-term (Low/Best Practices)

1. [Action 1]
2. [Action 2]

## Remediation Tracking

| Finding | Owner | Due Date | Beads Issue | Status |
|---------|-------|----------|-------------|--------|
| FINDING-001 | [Name] | [Date] | [bd://issue-xxx] | Open |
| FINDING-002 | [Name] | [Date] | [bd://issue-yyy] | In Progress |

## MITRE ATT&CK Mapping

*For advanced persistent threat (APT) analysis. Skip for basic audits.*

| Tactic | Technique ID | Technique Name | Mitigated | Notes |
|--------|--------------|----------------|-----------|-------|
| Initial Access | T1190 | Exploit Public-Facing App | Yes/No | [Details] |
| Persistence | T1078 | Valid Accounts | Yes/No | [Details] |
| Privilege Escalation | T1068 | Exploitation for Priv Esc | Yes/No | [Details] |
| Defense Evasion | T1562 | Impair Defenses | Yes/No | [Details] |
| Credential Access | T1110 | Brute Force | Yes/No | [Details] |
| Lateral Movement | T1021 | Remote Services | Yes/No | [Details] |
| Exfiltration | T1048 | Exfil Over Alt Protocol | Yes/No | [Details] |

*Reference: https://attack.mitre.org/matrices/enterprise/*

## Appendix

### Tools Used

| Tool | Version | Purpose |
|------|---------|---------|
| [Tool 1] | [Ver] | [Purpose] |
| [Tool 2] | [Ver] | [Purpose] |

### Test Cases

[Detailed test cases if applicable]

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Security Lead | | | |
| Engineering Lead | | | |
| Product Owner | | | |
````

## File: .claude/templates/artifacts/system_design.template.md
````markdown
# System Design: [System/Feature Name]

<!--
System Design Document (Technical Architecture)
Filename: artifacts/system_design_[system].md
Owner: Engineering
Handoff to: Engineering (implementation), /swarm-review (security and reliability review)
Related Skills: designing-systems, designing-apis, cloud-native-patterns, domain-driven-design

This document covers TECHNICAL architecture. For UI/visual design, use design_spec.template.md
Uses C4 model for architecture visualization (Context → Container → Component → Code)
-->

## Metadata

**Status:** Draft | In Review | Approved | Implemented
**Author:** [Name]
**Date:** [YYYY-MM-DD]
**Beads Issue:** [bd://issue-id or N/A]
**Related PRD:** [Link to PRD]
**Related ADRs:** [Links to relevant ADRs]

**Tech Strategy Alignment:**
- [ ] Language/Framework follows Golden Path (`.claude/rules/tech-strategy.md`)
- [ ] Database choice aligns with Data section (PostgreSQL for OLTP)
- [ ] Infrastructure tier appropriate (Static/Agile/Production)
- [ ] Observability uses OpenTelemetry (OTel) with OTLP protocol
- [ ] Deviations documented in ADR with justification

## Executive Summary

[2-3 sentences describing the system, its purpose, and the problem it solves. What does this system do and why does it exist?]

---

## 1. Context (C4 Level 1)

### System Context Diagram

```mermaid
graph TB
    subgraph External
        User[("👤 User")]
        ExtSystem1["🔲 External System 1"]
        ExtSystem2["🔲 External System 2"]
    end

    System["🟦 [System Name]<br/>Description"]

    User -->|"uses"| System
    System -->|"integrates with"| ExtSystem1
    System -->|"sends data to"| ExtSystem2
```

### Actors & External Systems

| Actor/System | Type | Description | Interaction |
|--------------|------|-------------|-------------|
| [User Persona] | Person | [Description] | [How they interact] |
| [External System] | System | [Description] | [Integration type] |

---

## 2. Containers (C4 Level 2)

### Container Diagram

```mermaid
graph TB
    subgraph System ["System Boundary"]
        WebApp["🌐 Web Application<br/>React/Next.js"]
        API["⚙️ API Server<br/>Node.js/Python"]
        Worker["🔄 Background Worker<br/>Node.js/Python"]
        DB[("🗄️ Database<br/>PostgreSQL")]
        Cache[("⚡ Cache<br/>Redis")]
        Queue["📬 Message Queue<br/>SQS/RabbitMQ"]
    end

    User[("👤 User")] -->|"HTTPS"| WebApp
    WebApp -->|"REST/gRPC"| API
    API -->|"SQL"| DB
    API -->|"Read/Write"| Cache
    API -->|"Publish"| Queue
    Queue -->|"Subscribe"| Worker
    Worker -->|"SQL"| DB
```

### Container Descriptions

| Container | Technology | Purpose | Scaling Strategy |
|-----------|------------|---------|------------------|
| Web Application | [Tech stack] | [Purpose] | [How it scales] |
| API Server | [Tech stack] | [Purpose] | [How it scales] |
| Database | [Tech stack] | [Purpose] | [How it scales] |
| Cache | [Tech stack] | [Purpose] | [How it scales] |

---

## 3. Components (C4 Level 3)

### API Server Components

```mermaid
graph TB
    subgraph API ["API Server"]
        Router["Router<br/>Express/FastAPI"]
        AuthMiddleware["Auth Middleware<br/>JWT Validation"]
        Controllers["Controllers<br/>Request Handlers"]
        Services["Services<br/>Business Logic"]
        Repositories["Repositories<br/>Data Access"]
    end

    Router --> AuthMiddleware
    AuthMiddleware --> Controllers
    Controllers --> Services
    Services --> Repositories
```

### Component Responsibilities

| Component | Responsibility | Dependencies |
|-----------|---------------|--------------|
| [Component 1] | [Single responsibility] | [What it depends on] |
| [Component 2] | [Single responsibility] | [What it depends on] |

---

## 4. Key Design Decisions

| Decision | Options Considered | Chosen | Rationale |
|----------|-------------------|--------|-----------|
| Database | PostgreSQL, MongoDB, DynamoDB | PostgreSQL | ACID compliance, relational data |
| Caching | Redis, Memcached | Redis | Data structures, pub/sub support |
| Queue | SQS, RabbitMQ, Kafka | SQS | Managed service, AWS integration |

**For detailed decision rationale, see related ADRs.**

---

## 5. API Design

### Endpoints Overview

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/api/v1/resources` | List resources | Yes |
| GET | `/api/v1/resources/:id` | Get single resource | Yes |
| POST | `/api/v1/resources` | Create resource | Yes |
| PUT | `/api/v1/resources/:id` | Update resource | Yes |
| DELETE | `/api/v1/resources/:id` | Delete resource | Yes |

### Request/Response Examples

```typescript
// GET /api/v1/resources/:id
// Response 200 OK
interface Resource {
  id: string;
  name: string;
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
  metadata: Record<string, unknown>;
}

// POST /api/v1/resources
// Request Body
interface CreateResourceRequest {
  name: string;
  metadata?: Record<string, unknown>;
}

// Error Response (4xx/5xx)
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

### API Versioning Strategy

[Describe versioning approach: URL path, header, query param]

---

## 6. Data Model

### Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ RESOURCE : owns
    RESOURCE ||--o{ AUDIT_LOG : generates

    USER {
        uuid id PK
        string email UK
        string name
        timestamp created_at
        timestamp updated_at
    }

    RESOURCE {
        uuid id PK
        uuid user_id FK
        string name
        jsonb metadata
        timestamp created_at
        timestamp updated_at
    }

    AUDIT_LOG {
        uuid id PK
        uuid resource_id FK
        string action
        jsonb changes
        timestamp created_at
    }
```

### Key Entities

| Entity | Description | Retention Policy |
|--------|-------------|------------------|
| User | System users | Indefinite |
| Resource | Core business entity | [Policy] |
| Audit Log | Change tracking | [X] days |

### Data Migration Strategy

[How will data be migrated? What's the rollback plan?]

---

## 7. Security Architecture

### Authentication & Authorization

| Mechanism | Implementation | Notes |
|-----------|----------------|-------|
| Authentication | JWT / OAuth 2.0 | [Details] |
| Authorization | RBAC / ABAC | [Details] |
| API Security | Rate limiting, WAF | [Details] |

### Data Protection

- **In Transit:** TLS 1.3 minimum
- **At Rest:** AES-256 encryption
- **PII Handling:** [Approach]
- **Secrets Management:** [AWS Secrets Manager / HashiCorp Vault]

### Security Considerations

| STRIDE Threat | Mitigation |
|---------------|------------|
| Spoofing | [Mitigation strategy] |
| Tampering | [Mitigation strategy] |
| Repudiation | [Mitigation strategy] |
| Information Disclosure | [Mitigation strategy] |
| Denial of Service | [Mitigation strategy] |
| Elevation of Privilege | [Mitigation strategy] |

---

## 8. Non-Functional Requirements

### Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time (p50) | < 100ms | [Tool] |
| API Response Time (p99) | < 500ms | [Tool] |
| Throughput | [X] req/sec | [Tool] |
| Database Query Time | < 50ms | [Tool] |

### Scalability

| Dimension | Current Capacity | Target Capacity | Strategy |
|-----------|------------------|-----------------|----------|
| Users | [X] | [Y] | [How to scale] |
| Requests/sec | [X] | [Y] | [How to scale] |
| Data Volume | [X] GB | [Y] TB | [How to scale] |

### Availability & Reliability

| Metric | Target | Strategy |
|--------|--------|----------|
| Availability | 99.9% (3 nines) | Multi-AZ deployment |
| RTO | [X] hours | [Recovery strategy] |
| RPO | [X] minutes | [Backup strategy] |

### Observability

| Pillar | Implementation | Tools |
|--------|----------------|-------|
| Metrics | OpenTelemetry | Prometheus/Grafana |
| Logging | Structured JSON logs | [ELK/CloudWatch] |
| Tracing | Distributed tracing | Jaeger/X-Ray |
| Alerting | SLO-based alerts | [PagerDuty/OpsGenie] |

---

## 9. Infrastructure

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        AWS Region                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │                      VPC                          │   │
│  │  ┌─────────────┐  ┌─────────────┐               │   │
│  │  │  Public     │  │  Public     │               │   │
│  │  │  Subnet AZ1 │  │  Subnet AZ2 │               │   │
│  │  │  ┌───────┐  │  │  ┌───────┐  │               │   │
│  │  │  │  ALB  │  │  │  │  ALB  │  │               │   │
│  │  │  └───────┘  │  │  └───────┘  │               │   │
│  │  └─────────────┘  └─────────────┘               │   │
│  │  ┌─────────────┐  ┌─────────────┐               │   │
│  │  │  Private    │  │  Private    │               │   │
│  │  │  Subnet AZ1 │  │  Subnet AZ2 │               │   │
│  │  │  ┌───────┐  │  │  ┌───────┐  │               │   │
│  │  │  │  ECS  │  │  │  │  ECS  │  │               │   │
│  │  │  └───────┘  │  │  └───────┘  │               │   │
│  │  └─────────────┘  └─────────────┘               │   │
│  │  ┌─────────────────────────────────────────┐    │   │
│  │  │           RDS Multi-AZ                   │    │   │
│  │  └─────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Environment Configuration

| Environment | Purpose | Infrastructure |
|-------------|---------|----------------|
| Development | Local development | Docker Compose |
| Staging | Pre-production testing | [Reduced cloud setup] |
| Production | Live system | [Full cloud setup] |

### CI/CD Pipeline

```
Code Push → Lint/Test → Build → Security Scan → Deploy Staging → Integration Tests → Deploy Prod
```

---

## 10. Dependencies

### Internal Dependencies

| Service | Purpose | Criticality | Fallback |
|---------|---------|-------------|----------|
| [Service 1] | [Purpose] | High/Medium/Low | [Fallback strategy] |

### External Dependencies

| Service | Purpose | SLA | Fallback |
|---------|---------|-----|----------|
| [External API] | [Purpose] | [SLA] | [Fallback strategy] |

### Dependency Diagram

```mermaid
graph LR
    ThisSystem["This System"]
    InternalSvc["Internal Service"]
    ExternalAPI["External API"]

    ThisSystem --> InternalSvc
    ThisSystem --> ExternalAPI
```

---

## 11. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| [Risk 1] | High/Med/Low | High/Med/Low | [Strategy] |
| [Risk 2] | High/Med/Low | High/Med/Low | [Strategy] |

---

## 12. Implementation Phases

### Phase 1: Foundation
- [ ] Infrastructure setup (IaC)
- [ ] Database schema
- [ ] Basic API scaffolding
- [ ] CI/CD pipeline

### Phase 2: Core Features
- [ ] Core business logic
- [ ] API endpoints
- [ ] Authentication/Authorization

### Phase 3: Polish & Launch
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Documentation
- [ ] Monitoring & alerting

---

## 13. Open Questions

- [ ] [Question 1]
- [ ] [Question 2]

---

## Appendix

### Glossary

| Term | Definition |
|------|------------|
| [Term] | [Definition] |

### References

- [Link to related documentation]
- [Link to external resources]

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Architect | | | Pending |
| Engineering Lead | | | Pending |
| Security | | | Pending |
| SRE | | | Pending |

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| [Date] | [Name] | Initial design |
````

## File: .claude/templates/command.template.md
````markdown
---
description: [Short description for autocomplete - what this command does]
argument-hint: [task-description]
# model: sonnet
# disable-model-invocation: false
---

<!--
Commands define expert modes invoked via slash commands (e.g., /swarm-plan).

Required fields:
  - description: Short text shown in autocomplete

Optional fields:
  - argument-hint: Help text for command arguments
  - model: sonnet|opus|haiku (defaults to current model)
  - disable-model-invocation: true to prevent SlashCommand tool use

NOTE: Commands do not use tool restrictions. Tool access is controlled via
permissionMode in the agent definition, not in command frontmatter.
-->

# You are now the [Command Name]

[Clear identity statement describing who this command is and their primary focus. 2-3 sentences.]

## Responsibilities

- **[Responsibility 1]**: [Brief description]
- **[Responsibility 2]**: [Brief description]
- **[Responsibility 3]**: [Brief description]

## Methods

### [Method Category 1]

[Description of approach or methodology]

### [Method Category 2]

[Description of approach or methodology]

## Quality Standards

- [Standard 1]
- [Standard 2]
- [Standard 3]

## Constraints

- **DO NOT** [constraint 1]
- **DO NOT** [constraint 2]
- **ALWAYS** [requirement 1]
- **ALWAYS** [requirement 2]

## Related Skills

- `[skill-name]` - [When to use]
- `[skill-name]` - [When to use]

## Handoff Protocol

- To **[Command]**: [What to create/prepare before handoff]
- To **[Command]**: [What to create/prepare before handoff]

$ARGUMENTS
````

## File: .claude/templates/rule.template.md
````markdown
# [Rule Name]

<!--
NOTE: Rules are auto-loaded for ALL files in the project.
There is NO path-based conditional loading.
Keep rules concise to minimize token usage.
Place this file in: .claude/rules/[rule-name].md
-->

## Overview

[Brief description of what this rule covers and why it matters]

## Standards

### [Category 1]

1. [Standard 1]
2. [Standard 2]
3. [Standard 3]

### [Category 2]

1. [Standard 1]
2. [Standard 2]

## Best Practices

- [Practice 1]
- [Practice 2]
- [Practice 3]

## Tooling

| Tool | Purpose |
|------|---------|
| [Tool 1] | [Description] |
| [Tool 2] | [Description] |

## Examples

### Good

```[language]
// Example of correct usage
```

### Bad

```[language]
// Example of what to avoid
```

## Checklist

- [ ] [Verification item 1]
- [ ] [Verification item 2]
- [ ] [Verification item 3]
````

## File: .claude/templates/skill.template.md
````markdown
---
name: [skill-name]
description: [Clear description of what this skill does and when Claude should use it. Include trigger phrases like "Use when..." to help with skill invocation.]
---

<!--
Skills are model-invoked workflows discovered via description matching.

Required fields:
  - name: lowercase, hyphens only, max 64 chars, must match directory name
  - description: max 1024 chars, CRITICAL for auto-discovery

Optional fields:
  (none — skills do not support tool restrictions)

Description best practices:
  GOOD: "API design skill. Use when designing REST APIs, GraphQL schemas, or gRPC services."
  BAD:  "Helps with APIs"

Supporting files (auto-discovered):
  - FORMS.md: Input templates
  - REFERENCE.md: Technical reference
  - resources/: Additional materials

Location: .claude/skills/[domain]/[skill-name]/SKILL.md
-->

# [Skill Name]

## Overview

[Brief description of this skill's purpose and scope]

## Workflows

- [ ] **Step 1**: [Description]
- [ ] **Step 2**: [Description]
- [ ] **Step 3**: [Description]

## Feedback Loops

1. [Action]
2. [Validation]
3. If [condition], [correction]
4. Repeat until [success criteria]

## Reference Implementation

```[language]
// Example code demonstrating the pattern
```

## Best Practices

- [Practice 1]
- [Practice 2]
- [Practice 3]

## Anti-Patterns

- [What to avoid 1]
- [What to avoid 2]

## Resources

- [Resource Name](./resources/resource.md)
- [External Link](https://example.com)
````

## File: .github/agents/commands.md
````markdown
# Build, Lint & Development Commands

## Development

- `npm run dev` — Start Next.js development server (App Router, port 3000)
- `npm run build` — Production build (Next.js + TypeScript type-check)
- `npm run start` — Start production server from build output

## Lint & Type Check

- `npm run lint` — Run ESLint (flat config, `eslint.config.mjs`)
- TypeScript type-checking is included in `npm run build`

## Firebase Deployment

- `npm run deploy:firebase` — Deploy all Firebase resources
- `npm run deploy:firestore:indexes` — Deploy Firestore indexes only
- `npm run deploy:firestore:rules` — Deploy Firestore security rules only
- `npm run deploy:storage:rules` — Deploy Storage security rules only
- `npm run deploy:rules` — Deploy Firestore rules + Storage rules
- `npm run deploy:apphosting` — Deploy App Hosting configuration
- `npm run deploy:functions` — Deploy Cloud Functions (Python)
- `npm run deploy:functions:py-fn` — Deploy Python Cloud Functions only
- `npm run deploy:functions:all` — Deploy all Cloud Functions

## Repomix (AI Skill Generation)

- `npm run repomix:skill` — Generate a repomix skill from the full codebase
- `npm run repomix:remote` — Generate a skill from a remote GitHub repository
- `npm run repomix:local` — Generate a skill from a local directory

## Key Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js 16 App Router configuration |
| `tsconfig.json` | TypeScript config with `@alias` path mappings |
| `eslint.config.mjs` | ESLint flat config with package boundary enforcement |
| `tailwind.config.ts` | Tailwind CSS 4 configuration |
| `firebase.json` | Firebase project configuration |
| `firestore.rules` | Firestore security rules |
| `firestore.indexes.json` | Firestore composite indexes |
| `storage.rules` | Cloud Storage security rules |
| `components.json` | shadcn CLI configuration (aliases → `@ui-shadcn/*`) |
| `apphosting.yaml` | Firebase App Hosting configuration |

## Environment Setup

- **Node.js**: Version 24 required (see `engines` in `package.json`)
- **Package manager**: npm
- Install dependencies: `npm install`
- Firebase CLI: `npx firebase` (no global install required)
````

## File: .github/agents/workspace-audit.agent.md
````markdown

````

## File: docs/beads.md
````markdown
# Beads

AI-native issue tracking. Optional but useful for swarm coordination.

## Install

```bash
curl -sSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
bd init
```

## Commands

```bash
bd create "Task description"          # create
bd ready                              # find work
bd update <id> --status in_progress   # claim
bd close <id> --reason "Done"         # complete
bd sync                               # sync with team
bd doctor                             # health check
```

## Workflow

```
bd ready → claim → work → complete → bd sync
```

## Team Setup

```bash
bd init --branch beads-metadata
bd config set sync.branch "beads-metadata"
```

## Why CLI?

The CLI uses 98% fewer tokens than MCP tool calls.

---

[← Back to README](../README.md)
````

## File: docs/customization.md
````markdown
# Customization

Add your own commands, skills, rules, and hooks.

## Adding a Command

Create `.claude/commands/my-command.md`:

```yaml
---
description: What this command does
---
```

Add command instructions below the frontmatter.

See `.claude/templates/command.template.md` for the full format.

## Adding a Skill

1. Create `.claude/skills/[category]/my-skill/SKILL.md`:

```yaml
---
name: my-skill
description: What it does
---
```

2. Register in `.claude/skills/skill-rules.json`:

```json
{
  "name": "my-skill",
  "path": ".claude/skills/category/my-skill/SKILL.md",
  "triggers": {
    "keywords": ["keyword1", "keyword2"]
  },
  "priority": "medium"
}
```

See `.claude/templates/skill.template.md` for the full format.

## Adding a Rule

Create `.claude/rules/my-rule.md`:

```markdown
# My Rule

Rules here. Keep it short — rules load on every request.
```

Rules auto-load. No registration needed.

## Adding a Hook

See [hooks.md](hooks.md) for the full guide.

Quick version:

1. Create `.claude/hooks/my-hook.sh`
2. `chmod +x .claude/hooks/my-hook.sh`
3. Register in `.claude/settings.json`

## Adding a Swarm Worker

Create `.claude/agents/worker-mytype.md`:

```yaml
---
name: worker-mytype
description: What it does
permissionMode: acceptEdits
model: haiku
---
```

Models: `haiku` (fast), `sonnet` (capable), `opus` (complex reasoning)

Use `permissionMode: default` for workers that should prompt before editing (e.g., explorers).

## Required: Configure Your Tech Stack

**IMPORTANT**: The framework will not align with your project without this step.

Edit `.claude/rules/tech-strategy.md` to match your actual technology choices:

```markdown
### TypeScript
| Component | Choice |
|-----------|--------|
| Runtime | Deno |        # your choice
| Build | esbuild |       # your choice
```

The framework enforces these across all commands. Claude will use the technologies you specify here, not generic defaults.

---

[← Back to README](../README.md)
````

## File: docs/ddd/account/aggregates.md
````markdown
# Aggregates — account

## 聚合根：Account

### 職責
代表使用者在 Xuanwu 平台的業務身份記錄。管理 profile 資訊與帳戶狀態。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 帳戶主鍵（對應 Firebase uid） |
| `displayName` | `string` | 顯示名稱 |
| `email` | `string` | Email |
| `avatarUrl` | `string \| null` | 頭像 URL |
| `createdAt` | `Timestamp` | 建立時間 |

### 不變數

- 每個 Account 對應唯一一個 Firebase uid
- Account 建立後 id 不可變更

---

## 聚合根：AccountPolicy

### 職責
代表附加到帳戶的存取控制政策，定義哪些資源可存取、哪些動作被允許，並映射到 Firebase custom claims。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | Policy 主鍵 |
| `accountId` | `string` | 關聯的 Account ID |
| `rules` | `PolicyRule[]` | 存取控制規則列表 |
| `effect` | `"allow" \| "deny"` | 規則效果 |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `AccountRepository` | `save()`, `findById()`, `delete()` |
| `AccountQueryRepository` | `findById()`, `findByEmail()` |
| `AccountPolicyRepository` | `save()`, `findByAccountId()` |
````

## File: docs/ddd/account/application-services.md
````markdown
# account — Application Services

> **Canonical bounded context:** `account`
> **模組路徑:** `modules/account/`
> **Domain Type:** Generic Subdomain

本文件記錄 `account` 的 application layer 服務與 use cases。內容與 `modules/account/application/` 實作保持一致。

## Application Layer 職責

管理帳戶資料、偏好設定與帳戶政策，並在 server 端透過 identity/api 取得已驗證身份。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/use-cases/account-policy.use-cases.ts`
- `application/use-cases/account.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/account/README.md`
- 模組 AGENT：`../../../modules/account/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/account/application-services.md`
````

## File: docs/ddd/account/domain-events.md
````markdown
# Domain Events — account

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `account.created` | 新帳戶建立時 | `accountId`, `email`, `occurredAt` |
| `account.policy_updated` | AccountPolicy 更新時，觸發 custom claims 刷新 | `accountId`, `policyId`, `occurredAt` |

## 訂閱事件

| 來源 BC | 事件 | 行動 |
|---------|------|------|
| `identity` | `TokenRefreshSignal` | 觸發 custom claims 重新計算與 Firebase token 更新 |

## 事件格式

```typescript
interface AccountCreatedEvent {
  readonly type: "account.created";
  readonly accountId: string;
  readonly email: string;
  readonly occurredAt: string;  // ISO 8601
}

interface AccountPolicyUpdatedEvent {
  readonly type: "account.policy_updated";
  readonly accountId: string;
  readonly policyId: string;
  readonly occurredAt: string;
}
```
````

## File: docs/ddd/account/domain-services.md
````markdown
# account — Domain Services

> **Canonical bounded context:** `account`
> **模組路徑:** `modules/account/`
> **Domain Type:** Generic Subdomain

本文件整理 `account` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/account/domain-services.md`
- `../../../docs/ddd/account/aggregates.md`
````

## File: docs/ddd/account/repositories.md
````markdown
# account — Repositories

> **Canonical bounded context:** `account`
> **模組路徑:** `modules/account/`
> **Domain Type:** Generic Subdomain

本文件整理 `account` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/AccountPolicyRepository.ts`
- `domain/repositories/AccountQueryRepository.ts`
- `domain/repositories/AccountRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseAccountPolicyRepository.ts`
- `infrastructure/firebase/FirebaseAccountQueryRepository.ts`
- `infrastructure/firebase/FirebaseAccountRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/account/repositories.md`
- `../../../docs/ddd/account/aggregates.md`
````

## File: docs/ddd/account/ubiquitous-language.md
````markdown
# Ubiquitous Language — account

> **範圍：** 僅限 `modules/account/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 | 代碼位置 |
|------|------|------|---------|
| 帳戶 | Account | 使用者在平台的業務記錄，含 profile 資訊與狀態 | `modules/account/domain/entities/Account.ts` |
| 帳戶政策 | AccountPolicy | 附加到帳戶的存取控制政策，決定 Firebase custom claims 內容 | `modules/account/domain/entities/AccountPolicy.ts` |
| 帳戶 ID | accountId | Account 的業務主鍵（對應 Firebase uid，但在業務層使用 accountId 術語） | `Account.id` |
| 自訂宣告 | customClaims | Firebase ID token 中的自訂 claims，由 AccountPolicy 決定 | `Account.customClaims` |
| 帳戶查詢庫 | AccountQueryRepository | CQRS 讀取側 Repository port | `domain/repositories/AccountQueryRepository.ts` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Account` | `User`, `Profile` |
| `AccountPolicy` | `Permission`, `Role`, `AccessRule` |
| `accountId` | `userId`（帳戶層應使用 accountId） |
````

## File: docs/ddd/ai/AGENT.md
````markdown
# AGENT.md — ai BC

## 模組定位

`ai` 是 RAG 攝入管線的 Job 協調支援域。管理 IngestionJob 生命週期，協調 py_fn/ Python worker。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `IngestionJob` | Job、Task（在此 BC 內）、ParseJob |
| `IngestionDocument` | Document、File（在此 BC 內）|
| `IngestionChunk` | Chunk、VectorChunk |
| `IngestionStatus` | Status, JobStatus |

## 棄用檔案守衛

以下檔案都是 `@deprecated` stubs，已移至其他模組，**絕對不要** import：
- `modules/ai/domain/entities/graph-node.ts` → 移至 `modules/wiki/`
- `modules/ai/domain/entities/link.ts` → 移至 `modules/wiki/`
- `modules/ai/domain/repositories/GraphRepository.ts` → 移至 `modules/wiki/`

## 邊界規則

### ✅ 允許
```typescript
import { aiApi } from "@/modules/ai/api";
import type { IngestionJobDTO } from "@/modules/ai/api";
```

### ❌ 禁止
```typescript
import { IngestionJob } from "@/modules/ai/domain/entities/IngestionJob";
import { graph-node } from "@/modules/ai/domain/entities/graph-node"; // deprecated stub
```

## Runtime 邊界規則

- `ai` 模組只在 Next.js 端做 Job 協調
- Embedding 生成在 `py_fn/` 執行，不要在 `ai` module 加入 heavy ML 邏輯

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: docs/ddd/ai/aggregates.md
````markdown
# Aggregates — ai

## 聚合根：IngestionJob

### 職責
管理 RAG 攝入管線的單一工作記錄。追蹤從上傳到 indexed 的完整狀態機。

### 生命週期狀態機
```
uploaded ──► parsing ──► embedding ──► indexed
                │                         │
                └──────► failed ◄─────────┘
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | Job 主鍵 |
| `documentId` | `string` | 關聯 SourceDocument ID |
| `organizationId` | `string` | 所屬組織 |
| `workspaceId` | `string` | 所屬工作區 |
| `status` | `IngestionStatus` | 當前狀態 |
| `startedAt` | `string \| null` | ISO 8601 開始時間 |
| `completedAt` | `string \| null` | ISO 8601 完成時間 |
| `errorMessage` | `string \| null` | 失敗原因 |

### 不變數

- `indexed` 狀態後不可再轉換回其他狀態
- `failed` 狀態的 errorMessage 不可為空

---

## 實體：IngestionDocument

### 職責
交付給攝入管線的文件元資料，提供 `py_fn/` worker 所需的來源資訊。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 文件主鍵 |
| `sourceFileId` | `string` | 關聯 SourceDocument ID |
| `mimeType` | `string` | 檔案 MIME type |
| `storageUrl` | `string` | Firebase Storage URL |

---

## 值物件：IngestionChunk

### 職責
文件切分後的向量化 chunk，由 `py_fn/` 生成後寫入 Firestore。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | Chunk 主鍵 |
| `documentId` | `string` | 所屬文件 ID |
| `chunkIndex` | `number` | Chunk 在文件中的序號 |
| `content` | `string` | Chunk 文字內容 |
| `embedding` | `number[]` | 向量嵌入（由 py_fn/ 寫入） |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `IngestionJobRepository` | `save()`, `findByDocumentId()`, `listByWorkspace()`, `updateStatus()` |
````

## File: docs/ddd/ai/application-services.md
````markdown
# ai — Application Services

> **Canonical bounded context:** `ai`
> **模組路徑:** `modules/ai/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `ai` 的 application layer 服務與 use cases。內容與 `modules/ai/application/` 實作保持一致。

## Application Layer 職責

協調 RAG ingestion job 的生命週期，將重型 parse/chunk/embed 工作交給 py_fn/ 執行。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/link-extractor.service.ts`
- `application/use-cases/advance-ingestion-stage.use-case.ts`
- `application/use-cases/register-ingestion-document.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/ai/README.md`
- 模組 AGENT：`../../../modules/ai/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/ai/application-services.md`
````

## File: docs/ddd/ai/context-map.md
````markdown
# Context Map — ai

## 上游（依賴）

### source → ai（Customer/Supplier）

- `source.upload_completed` 觸發 `ai` 建立 IngestionJob
- `ai` 依賴 `source/api` 取得 SourceDocument 元資料（storageUrl、mimeType）

---

## 下游（被依賴）

### ai → search（Customer/Supplier）

- `ai.ingestion_completed` 通知 `search` 更新向量索引
- `search` 的 RAG 查詢依賴 `ai` 生成的 IngestionChunk

### ai → py_fn（Runtime Boundary）

**這不是 BC 間的 DDD 整合，而是 runtime 邊界分割：**

```
Next.js ai module ──[Firestore Job Record]──► py_fn/ worker
                   ──[Firebase Storage URL]──► py_fn/ worker
py_fn/ worker ──[Chunk + Embedding 寫回 Firestore]──► Next.js reads
```

- Next.js 端：Job 建立、狀態查詢、API
- `py_fn/`：parse / chunk / embed 實際執行

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| source → ai | source | ai | Published Language (Events) |
| ai → search | ai | search | Published Language (Events) |
| ai → py_fn | Next.js | py_fn | Runtime Boundary（非 DDD 邊界） |
````

## File: docs/ddd/ai/domain-events.md
````markdown
# Domain Events — ai

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `ai.ingestion_job_created` | 新 IngestionJob 建立 | `jobId`, `documentId`, `workspaceId`, `occurredAt` |
| `ai.ingestion_completed` | Job 狀態達到 `indexed` | `jobId`, `documentId`, `chunkCount`, `occurredAt` |
| `ai.ingestion_failed` | Job 狀態轉為 `failed` | `jobId`, `documentId`, `errorMessage`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `source` | `source.upload_completed` | 建立 IngestionJob，啟動攝入管線 |

## 消費 ai 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `search` | `ai.ingestion_completed` | 更新向量索引，RagDocument 標記為可查詢 |
| `source` | `ai.ingestion_completed` | 更新 SourceDocument 狀態為 ready |
| `workspace-audit` | `ai.ingestion_completed / failed` | 記錄攝入稽核軌跡 |
````

## File: docs/ddd/ai/domain-services.md
````markdown
# ai — Domain Services

> **Canonical bounded context:** `ai`
> **模組路徑:** `modules/ai/`
> **Domain Type:** Supporting Subdomain

本文件整理 `ai` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/ai/domain-services.md`
- `../../../docs/ddd/ai/aggregates.md`
````

## File: docs/ddd/ai/repositories.md
````markdown
# ai — Repositories

> **Canonical bounded context:** `ai`
> **模組路徑:** `modules/ai/`
> **Domain Type:** Supporting Subdomain

本文件整理 `ai` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/GraphRepository.ts`
- `domain/repositories/IngestionJobRepository.ts`

## Infrastructure Implementations

- `infrastructure/InMemoryGraphRepository.ts`
- `infrastructure/InMemoryIngestionJobRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/ai/repositories.md`
- `../../../docs/ddd/ai/aggregates.md`
````

## File: docs/ddd/ai/ubiquitous-language.md
````markdown
# Ubiquitous Language — ai

> **範圍：** 僅限 `modules/ai/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 攝入工作 | IngestionJob | RAG 攝入管線的單一工作記錄，追蹤 parse/chunk/embed 的執行狀態 |
| 攝入文件 | IngestionDocument | 交付給攝入管線的文件元資料記錄 |
| 攝入 Chunk | IngestionChunk | 文件切分後的向量化單元（由 py_fn/ 生成） |
| 攝入狀態 | IngestionStatus | Job 的生命週期狀態：`uploaded \| parsing \| embedding \| indexed \| failed` |
| 文件 ID | documentId | 關聯的 source 模組 SourceDocument ID |
| 工作區 ID | workspaceId | Job 所屬的工作區 |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `IngestionJob` | `Job`, `ParseJob`, `EmbedTask` |
| `IngestionDocument` | `Document`, `File`（在 ai BC 內） |
| `IngestionChunk` | `Chunk`, `VectorEntry` |
| `IngestionStatus` | `JobStatus`, `State` |
````

## File: docs/ddd/identity/aggregates.md
````markdown
# Aggregates — identity

## 聚合根：Identity

### 職責
代表一個已通過 Firebase Authentication 驗證的使用者。提供讀取身份資訊的能力。

### 屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `uid` | `string` | Firebase UID（主鍵） |
| `email` | `string \| null` | 使用者 Email |
| `displayName` | `string \| null` | 顯示名稱 |
| `photoURL` | `string \| null` | 頭像 URL |

### 不變數

- `uid` 永遠不為空（由 Firebase 保證）
- `Identity` 物件是唯讀的（由 Firebase Auth SDK 產生）

---

## 值物件：TokenRefreshSignal

### 職責
代表「token 需要刷新」的事件訊號，觸發 `account` 域更新 custom claims。

### 屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `uid` | `string` | 需要刷新 token 的使用者 UID |
| `occurredAt` | `string` | ISO 8601 時間戳 |

---

## Repository Interfaces

| 介面 | 主要方法 | 說明 |
|------|---------|------|
| `IdentityRepository` | `signIn()`, `signOut()`, `getCurrentIdentity()` | Firebase Auth 操作 |
| `TokenRefreshRepository` | `listenToTokenRefresh()` | 監聽 token 刷新事件 |
````

## File: docs/ddd/identity/application-services.md
````markdown
# identity — Application Services

> **Canonical bounded context:** `identity`
> **模組路徑:** `modules/identity/`
> **Domain Type:** Generic Subdomain

本文件記錄 `identity` 的 application layer 服務與 use cases。內容與 `modules/identity/application/` 實作保持一致。

## Application Layer 職責

封裝 Firebase Authentication，提供登入、登出與 token refresh 能力。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/identity-error-message.ts`
- `application/use-cases/identity.use-cases.ts`
- `application/use-cases/token-refresh.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/identity/README.md`
- 模組 AGENT：`../../../modules/identity/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/identity/application-services.md`
````

## File: docs/ddd/identity/context-map.md
````markdown
# Context Map — identity

## 此 BC 的整合模式

### 上游（依賴）

`identity` 是最基礎的 Generic Subdomain，不依賴任何其他業務 BC。

**外部依賴：** Firebase Authentication SDK（第三方服務，Anti-Corruption Layer 在 infrastructure 層）

---

### 下游（被依賴）

#### `account` ← identity（Customer/Supplier）

- **模式：** Customer/Supplier
- **方向：** `identity` 是 Supplier（上游），`account` 是 Customer（下游）
- **整合方式：** `account` application use-cases 在 server 端 import `identity/api` 取得身份上下文
- **關鍵規則：** `identity/api` 不得含任何 `"use client"` 匯出

```
identity/api ──import──► account/application/use-cases/*.ts（server-side）
```

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| identity → account | identity | account | Customer/Supplier |
| Firebase Auth → identity | Firebase | identity | Anti-Corruption Layer |
````

## File: docs/ddd/identity/domain-events.md
````markdown
# Domain Events — identity

## 發出事件

`identity` 域目前不發出 DomainEvent（Firebase Auth 事件由 SDK 直接處理，不經過領域事件匯流排）。

未來如需追蹤登入稽核，可考慮加入：

| 潛在事件 | 觸發條件 | 說明 |
|---------|---------|------|
| `identity.signed_in` | 使用者成功登入 | 供 `workspace-audit` 消費 |
| `identity.signed_out` | 使用者登出 | 供稽核紀錄消費 |

## 訂閱事件

`identity` 不訂閱其他 BC 的事件。

## TokenRefreshSignal（非正式事件）

`TokenRefreshSignal` 是透過 `TokenRefreshRepository.listenToTokenRefresh()` 的 Observable 訊號，不是正式的 DomainEvent，但語意上扮演事件角色：

```typescript
// account use-case 消費此訊號
identityApi.listenToTokenRefresh()
  .subscribe(() => accountApi.refreshCustomClaims(uid));
```
````

## File: docs/ddd/identity/domain-services.md
````markdown
# identity — Domain Services

> **Canonical bounded context:** `identity`
> **模組路徑:** `modules/identity/`
> **Domain Type:** Generic Subdomain

本文件整理 `identity` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/identity/domain-services.md`
- `../../../docs/ddd/identity/aggregates.md`
````

## File: docs/ddd/identity/repositories.md
````markdown
# identity — Repositories

> **Canonical bounded context:** `identity`
> **模組路徑:** `modules/identity/`
> **Domain Type:** Generic Subdomain

本文件整理 `identity` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/IdentityRepository.ts`
- `domain/repositories/TokenRefreshRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseIdentityRepository.ts`
- `infrastructure/firebase/FirebaseTokenRefreshRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/identity/repositories.md`
- `../../../docs/ddd/identity/aggregates.md`
````

## File: docs/ddd/identity/ubiquitous-language.md
````markdown
# Ubiquitous Language — identity

> **範圍：** 僅限 `modules/identity/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 | 代碼位置 |
|------|------|------|---------|
| 身份 | Identity | Firebase Auth 驗證後的使用者記錄，以 `uid` 為唯一識別碼 | `modules/identity/domain/entities/` |
| 唯一身份碼 | uid | Firebase Authentication 產生的使用者全域唯一 ID | `Identity.uid` |
| Token 刷新訊號 | TokenRefreshSignal | 代表 Firebase ID token 需要更新的訊號物件 | `domain/entities/` |
| 登入 | signIn | 透過 Email 或 OAuth 建立 Firebase Auth session | `IdentityRepository.signIn()` |
| 登出 | signOut | 終止 Firebase Auth session | `IdentityRepository.signOut()` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Identity` | `User`, `AuthUser`, `CurrentUser` |
| `uid` | `userId`, `id`, `accountId`（在此 BC 內） |
| `TokenRefreshSignal` | `RefreshToken`, `TokenEvent` |
````

## File: docs/ddd/knowledge/application-services.md
````markdown
# knowledge — Application Services

> **Canonical bounded context:** `knowledge`
> **模組路徑:** `modules/knowledge/`
> **Domain Type:** Core Domain

本文件記錄 `knowledge` 的 application layer 服務與 use cases。內容與 `modules/knowledge/application/` 實作保持一致。

## Application Layer 職責

管理知識頁面、內容區塊與版本歷史，是平台的核心知識內容領域。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/block-service.ts`
- `application/dto/knowledge.dto.ts`
- `application/use-cases/knowledge-block.use-cases.ts`
- `application/use-cases/knowledge-page.use-cases.ts`
- `application/use-cases/knowledge-version.use-cases.ts`
- `application/use-cases/wiki-pages.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/knowledge/README.md`
- 模組 AGENT：`../../../modules/knowledge/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/knowledge/application-services.md`
````

## File: docs/ddd/knowledge/context-map.md
````markdown
# Context Map — knowledge

## 上游（依賴）

### identity → knowledge（Customer/Supplier）
- 頁面操作驗證 `createdByUserId`

### workspace → knowledge（Customer/Supplier）
- 頁面隸屬於 `workspaceId`，需驗證工作區歸屬

---

## 下游（被依賴）

### knowledge → workspace-flow（Published Language / Customer-Supplier）

**這是平台最重要的跨 BC 整合點。**

- 整合方式：`knowledge.page_approved` 領域事件（Published Language）
- `workspace-flow` 的 `ContentToWorkflowMaterializer` Process Manager 訂閱此事件
- 從 `extractedTasks[]` 建立 Task，從 `extractedInvoices[]` 建立 Invoice

```
knowledge ─── knowledge.page_approved ───► workspace-flow
                                          (ContentToWorkflowMaterializer)
```

### knowledge → wiki（Customer/Supplier）

- `wiki` 訂閱 `knowledge.page_created` / `knowledge.block_updated` 以同步 GraphNode
- `wiki.GraphNode.id` 對應 `knowledge.KnowledgePage.id`

### knowledge → ai（Customer/Supplier）

- `knowledge.page_approved` 觸發 `ai` 域的 IngestionJob
- RAG 攝入管線的起點

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| identity → knowledge | identity | knowledge | Customer/Supplier |
| workspace → knowledge | workspace | knowledge | Customer/Supplier |
| knowledge → workspace-flow | knowledge | workspace-flow | Published Language (Events) |
| knowledge → wiki | knowledge | wiki | Customer/Supplier（Events） |
| knowledge → ai | knowledge | ai | Customer/Supplier（Events） |
````

## File: docs/ddd/knowledge/domain-events.md
````markdown
# Domain Events — knowledge

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `knowledge.page_created` | 新頁面建立時 | `pageId`, `accountId`, `workspaceId?`, `title`, `createdByUserId`, `occurredAt` |
| `knowledge.page_renamed` | 頁面標題變更 | `pageId`, `accountId`, `previousTitle`, `newTitle`, `occurredAt` |
| `knowledge.page_moved` | 頁面移動（parentPageId 變更） | `pageId`, `accountId`, `previousParentPageId`, `newParentPageId`, `occurredAt` |
| `knowledge.page_archived` | 頁面歸檔 | `pageId`, `accountId`, `occurredAt` |
| `knowledge.page_approved` | 使用者核准 AI 生成草稿 | 見下方詳細定義 |
| `knowledge.block_added` | 區塊新增 | `blockId`, `pageId`, `accountId`, `contentText`, `occurredAt` |
| `knowledge.block_updated` | 區塊內容更新 | `blockId`, `pageId`, `accountId`, `contentText`, `occurredAt` |
| `knowledge.block_deleted` | 區塊刪除 | `blockId`, `pageId`, `accountId`, `occurredAt` |
| `knowledge.version_published` | 版本快照手動發佈 | `versionId`, `pageId`, `accountId`, `label`, `createdByUserId`, `occurredAt` |

## 最重要事件：knowledge.page_approved

```typescript
// 代碼位置：modules/knowledge/domain/events/knowledge.events.ts
interface KnowledgePageApprovedEvent {
  readonly type: "knowledge.page_approved";
  readonly aggregateId: string;      // KnowledgePage ID
  readonly pageId: string;
  readonly occurredAt: string;       // ISO 8601（注意：此 BC 用 occurredAt，非 occurredAtISO）
  readonly extractedTasks: ReadonlyArray<{
    readonly title: string;
    readonly dueDate?: string;
    readonly description?: string;
  }>;
  readonly extractedInvoices: ReadonlyArray<{
    readonly amount: number;
    readonly description: string;
    readonly currency?: string;    // 預設 "TWD"
  }>;
  readonly actorId: string;          // 執行審批的使用者 ID
  readonly causationId: string;      // 觸發命令 ID
  readonly correlationId: string;    // 業務流程追蹤 ID
}
```

## 訂閱事件（消費端）

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `identity` | `TokenRefreshSignal` | 更新使用者 session |

## 消費 knowledge 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `workspace-flow` | `knowledge.page_approved` | ContentToWorkflowMaterializer 建立 Task、Invoice |
| `wiki` | `knowledge.page_created`, `knowledge.block_updated` | 同步 GraphNode |
| `ai` | `knowledge.page_approved` | 觸發 IngestionJob |
````

## File: docs/ddd/knowledge/domain-services.md
````markdown
# knowledge — Domain Services

> **Canonical bounded context:** `knowledge`
> **模組路徑:** `modules/knowledge/`
> **Domain Type:** Core Domain

本文件整理 `knowledge` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/knowledge/domain-services.md`
- `../../../docs/ddd/knowledge/aggregates.md`
````

## File: docs/ddd/knowledge/repositories.md
````markdown
# knowledge — Repositories

> **Canonical bounded context:** `knowledge`
> **模組路徑:** `modules/knowledge/`
> **Domain Type:** Core Domain

本文件整理 `knowledge` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/WikiPageRepository.ts`
- `domain/repositories/knowledge.repositories.ts`

## Infrastructure Implementations

- `infrastructure/InMemoryKnowledgeRepository.ts`
- `infrastructure/firebase/FirebaseContentBlockRepository.ts`
- `infrastructure/firebase/FirebaseContentPageRepository.ts`
- `infrastructure/index.ts`
- `infrastructure/repositories/firebase-wiki-page.repository.ts`
- `infrastructure/repositories/in-memory-wiki-page.repository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/knowledge/repositories.md`
- `../../../docs/ddd/knowledge/aggregates.md`
````

## File: docs/ddd/notebook/AGENT.md
````markdown
# AGENT.md — notebook BC

## 模組定位

`notebook` 是 AI 對話的支援域，管理 Thread/Message 生命週期並封裝 Genkit 呼叫。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Thread` | Conversation、Chat、Session |
| `Message` | ChatMessage、Msg |
| `MessageRole` | Role（單獨使用）、Speaker |
| `NotebookResponse` | AIResponse、GeneratedText |
| `NotebookRepository` | AIRepository、ChatRepository |

## 最重要規則：Server Action 隔離

```typescript
// ✅ 正確：在 app/(shell)/ai-chat/_actions.ts 中建立本地 action
"use server";
import { notebookApi } from "@/modules/notebook/api";
export async function generateResponse(input) {
  return notebookApi.generateResponse(input);
}

// ❌ 禁止：在 Client Component 直接 import notebook/api
// Genkit/gRPC 是 server-only，會導致打包失敗
import { notebookApi } from "@/modules/notebook/api"; // 在 "use client" 檔案中
```

## 邊界規則

### ✅ 允許
```typescript
// Server-side context only
import { notebookApi } from "@/modules/notebook/api";
import type { ThreadDTO, MessageDTO } from "@/modules/notebook/api";
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: docs/ddd/notebook/aggregates.md
````markdown
# Aggregates — notebook

## 聚合根：Thread

### 職責
代表一個 AI 對話串。持有有序的 Message 列表，管理對話歷史。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `ID` | Thread 主鍵 |
| `messages` | `Message[]` | 有序訊息列表 |
| `createdAt` | `string` | ISO 8601 |
| `updatedAt` | `string` | ISO 8601 |

### 不變數

- messages 列表維持追加順序，不可重新排序
- Thread 不可刪除 Message（只能追加）

---

## 值物件：Message

### 職責
Thread 中的單則訊息，不可變（immutable）。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `ID` | 訊息主鍵 |
| `role` | `MessageRole` | `"user" \| "assistant" \| "system"` |
| `content` | `string` | 訊息內容文字 |
| `createdAt` | `string` | ISO 8601 |

---

## Repository Interfaces

| 介面 | 說明 |
|------|------|
| `NotebookRepository` | 封裝 Genkit AI 呼叫：`generateResponse(input)` |

### GenerateNotebookResponseInput

```typescript
interface GenerateNotebookResponseInput {
  readonly prompt: string;
  readonly model?: string;    // 預設 Gemini 2.0 flash
  readonly system?: string;   // System prompt
}
```

### GenerateNotebookResponseResult

```typescript
type GenerateNotebookResponseResult =
  | { ok: true; data: NotebookResponse }
  | { ok: false; error: DomainError };

interface NotebookResponse {
  readonly text: string;
  readonly model: string;
  readonly finishReason?: string;
}
```
````

## File: docs/ddd/notebook/application-services.md
````markdown
# notebook — Application Services

> **Canonical bounded context:** `notebook`
> **模組路徑:** `modules/notebook/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `notebook` 的 application layer 服務與 use cases。內容與 `modules/notebook/application/` 實作保持一致。

## Application Layer 職責

管理 AI 對話 Thread/Message，並封裝模型生成回應。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/index.ts`
- `application/use-cases/answer-rag-query.use-case.ts`
- `application/use-cases/generate-agent-response.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/notebook/README.md`
- 模組 AGENT：`../../../modules/notebook/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/notebook/application-services.md`
````

## File: docs/ddd/notebook/domain-events.md
````markdown
# Domain Events — notebook

## 發出事件

`notebook` 域目前不發出 DomainEvent。AI 對話是使用者互動的即時回應，不需要下游事件消費。

未來可考慮：

| 潛在事件 | 觸發條件 | 說明 |
|---------|---------|------|
| `notebook.thread_created` | 新 Thread 建立 | 供 workspace-audit 記錄 |
| `notebook.response_generated` | AI 回應完成 | 供 token 使用量追蹤 |

## 訂閱事件

`notebook` 不訂閱其他 BC 的事件。

## 整合說明

`notebook` 透過**同步查詢**（非事件）消費其他 BC 的能力：

- **`search`**：呼叫 `search/api.answerRagQuery()` 取得語意相關 chunks（用於 RAG-augmented 對話）
- **`wiki`**：可查詢 wiki 圖譜以取得知識上下文（未來）
````

## File: docs/ddd/notebook/domain-services.md
````markdown
# notebook — Domain Services

> **Canonical bounded context:** `notebook`
> **模組路徑:** `modules/notebook/`
> **Domain Type:** Supporting Subdomain

本文件整理 `notebook` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/notebook/domain-services.md`
- `../../../docs/ddd/notebook/aggregates.md`
````

## File: docs/ddd/notebook/ubiquitous-language.md
````markdown
# Ubiquitous Language — notebook

> **範圍：** 僅限 `modules/notebook/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 對話串 | Thread | 一組有序的對話訊息集合，是 AI 對話的持久化單元 |
| 訊息 | Message | Thread 中的單則訊息（含 role 和 content） |
| 訊息角色 | MessageRole | 訊息發出者的角色：`"user" \| "assistant" \| "system"` |
| 筆記本回應 | NotebookResponse | AI 模型對一次 prompt 的回應結果（含 text、model） |
| 生成輸入 | GenerateNotebookResponseInput | 呼叫 AI 生成的輸入（prompt、model?、system?） |
| 筆記本庫 | NotebookRepository | 封裝 Genkit AI 呼叫的 Repository port |

## 棄用術語（已移至 search）

| 棄用術語 | 新位置 |
|----------|--------|
| `RagQuery` / `RagCitation` | `modules/search/domain/entities/RagQuery.ts` |
| `RagGenerationRepository` | `modules/search/domain/repositories/RagGenerationRepository.ts` |
| `RagRetrievalRepository` | `modules/search/domain/repositories/RagRetrievalRepository.ts` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Thread` | `Conversation`, `Chat`, `Session` |
| `Message` | `ChatMessage`, `Turn` |
| `NotebookResponse` | `AIResponse`, `LLMOutput` |
````

## File: docs/ddd/notification/AGENT.md
````markdown
# AGENT.md — notification BC

## 模組定位

`notification` 是通知分發的通用子域，負責系統通知的建立、發送與讀取。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `NotificationEntity` | Notification（作為 class 名），Alert, Message（作為通知） |
| `recipientId` | userId, receiverId |
| `NotificationType` | Type, AlertLevel |
| `DispatchNotificationInput` | CreateNotification, SendNotification |

## 邊界規則

### ✅ 允許
```typescript
import { notificationApi } from "@/modules/notification/api";
import type { NotificationDTO } from "@/modules/notification/api";
```

### ❌ 禁止
```typescript
import { NotificationEntity } from "@/modules/notification/domain/entities/Notification";
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: docs/ddd/notification/aggregates.md
````markdown
# Aggregates — notification

## 聚合根：NotificationEntity

### 職責
代表一則系統通知記錄。管理通知的發送與讀取狀態。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 通知主鍵 |
| `recipientId` | `string` | 接收者帳戶 ID |
| `title` | `string` | 通知標題 |
| `message` | `string` | 通知內容 |
| `type` | `NotificationType` | `info \| alert \| success \| warning` |
| `read` | `boolean` | 是否已讀 |
| `timestamp` | `number` | Unix timestamp（毫秒） |
| `sourceEventType` | `string?` | 觸發此通知的事件類型 |
| `metadata` | `Record<string, unknown>?` | 附加元資料 |

### 不變數

- `recipientId` 不可為空
- `title` 不可為空

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `NotificationRepository` | `save()`, `findByRecipient()`, `markAsRead()` |
````

## File: docs/ddd/notification/application-services.md
````markdown
# notification — Application Services

> **Canonical bounded context:** `notification`
> **模組路徑:** `modules/notification/`
> **Domain Type:** Generic Subdomain

本文件記錄 `notification` 的 application layer 服務與 use cases。內容與 `modules/notification/application/` 實作保持一致。

## Application Layer 職責

負責系統通知分發與通知讀取狀態管理。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/use-cases/notification.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/notification/README.md`
- 模組 AGENT：`../../../modules/notification/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/notification/application-services.md`
````

## File: docs/ddd/notification/context-map.md
````markdown
# Context Map — notification

## 上游（依賴）

### 所有業務 BC → notification（Published Language）

`notification` 訂閱各 BC 的業務事件，轉換為使用者通知。不直接依賴任何 BC 的 api。

---

## 下游（被依賴）

`notification` 不被其他 BC 依賴（通知是終端輸出，無下游）。

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| workspace → notification | workspace | notification | Published Language (Events) |
| workspace-flow → notification | workspace-flow | notification | Published Language (Events) |
| 其他 BC → notification | 各 BC | notification | Published Language (Events) |
````

## File: docs/ddd/notification/domain-events.md
````markdown
# Domain Events — notification

## 發出事件

`notification` 域不發出 DomainEvent（通知本身是事件的結果，而非事件的來源）。

## 訂閱事件

`notification` 是各 BC 事件的**消費端**，訂閱業務事件並轉換為使用者通知：

| 來源 BC | 訂閱事件 | 通知內容 |
|---------|---------|---------|
| `workspace` | `workspace.member_joined` | 新成員加入通知 |
| `workspace-flow` | `workspace-flow.task_status_changed` | 任務狀態變更通知 |
| `workspace-audit` | 稽核紀錄變化 | 重要稽核事件通知（未來） |

## 說明

通知系統的角色是「事件翻譯器」：
1. 其他 BC 發出領域事件
2. notification 訂閱並翻譯為使用者可讀的通知
3. 通知推送給對應的 recipientId

這是典型的 **Published Language** 模式，notification 作為 Conformist 消費者。
````

## File: docs/ddd/notification/domain-services.md
````markdown
# notification — Domain Services

> **Canonical bounded context:** `notification`
> **模組路徑:** `modules/notification/`
> **Domain Type:** Generic Subdomain

本文件整理 `notification` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/notification/domain-services.md`
- `../../../docs/ddd/notification/aggregates.md`
````

## File: docs/ddd/notification/repositories.md
````markdown
# notification — Repositories

> **Canonical bounded context:** `notification`
> **模組路徑:** `modules/notification/`
> **Domain Type:** Generic Subdomain

本文件整理 `notification` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/NotificationRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseNotificationRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/notification/repositories.md`
- `../../../docs/ddd/notification/aggregates.md`
````

## File: docs/ddd/notification/ubiquitous-language.md
````markdown
# Ubiquitous Language — notification

> **範圍：** 僅限 `modules/notification/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 通知 | NotificationEntity | 一則系統通知記錄（含標題、內容、類型、讀取狀態） |
| 接收者 ID | recipientId | 接收此通知的帳戶 ID |
| 通知類型 | NotificationType | `"info" \| "alert" \| "success" \| "warning"` |
| 分發通知輸入 | DispatchNotificationInput | 建立並發送通知的輸入物件 |
| 來源事件類型 | sourceEventType | 觸發此通知的業務事件類型（可選，用於追蹤） |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `NotificationEntity` | `Notification`（避免與 JS Notification API 衝突） |
| `recipientId` | `userId`, `receiverId` |
````

## File: docs/ddd/organization/AGENT.md
````markdown
# AGENT.md — organization BC

## 模組定位

`organization` 是 Xuanwu 的多租戶管理有界上下文，管理 Organization 聚合根、成員、隊伍與邀請流程。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Organization` | Company、Tenant、Team（作為頂層組織）、Client |
| `MemberReference` | Member、User（在組織上下文中）|
| `Team` | Group、Squad（作為組織子群組） |
| `PartnerInvite` | Invitation、InviteLink |
| `OrganizationRole` | Role、Permission（作為組織角色） |
| `Presence` | Status、OnlineStatus |

## 邊界規則

### ✅ 允許
```typescript
import { organizationApi } from "@/modules/organization/api";
import type { OrganizationDTO, MemberReferenceDTO } from "@/modules/organization/api";
```

### ❌ 禁止
```typescript
import { Organization } from "@/modules/organization/domain/entities/Organization";
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: docs/ddd/organization/aggregates.md
````markdown
# Aggregates — organization

## 聚合根：Organization

### 職責
代表一個企業或團隊租戶。管理所有成員、隊伍與合作夥伴邀請的生命週期。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 組織主鍵 |
| `name` | `string` | 組織名稱 |
| `members` | `MemberReference[]` | 成員列表（含 role） |
| `teams` | `Team[]` | 子隊伍列表 |
| `partnerInvites` | `PartnerInvite[]` | 未完成的邀請列表 |

### 不變數

- 同一 accountId 在同一 Organization 中只能有一個 MemberReference
- `Owner` 角色至少需要一位（不可移除最後一個 Owner）
- 過期的 PartnerInvite（`expired`）不能再被接受

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `MemberReference` | 成員快照（id, name, email, role, presence） |
| `Team` | 子群組（id, name, type, memberIds） |
| `PartnerInvite` | 邀請記錄（email, role, inviteState, invitedAt） |
| `OrganizationRole` | `"Owner" \| "Admin" \| "Member" \| "Guest"` |
| `Presence` | `"active" \| "away" \| "offline"` |
| `InviteState` | `"pending" \| "accepted" \| "expired"` |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `OrganizationRepository` | `save()`, `findById()`, `findByMemberId()` |
````

## File: docs/ddd/organization/application-services.md
````markdown
# organization — Application Services

> **Canonical bounded context:** `organization`
> **模組路徑:** `modules/organization/`
> **Domain Type:** Generic Subdomain

本文件記錄 `organization` 的 application layer 服務與 use cases。內容與 `modules/organization/application/` 實作保持一致。

## Application Layer 職責

管理多租戶組織、成員、隊伍與邀請流程。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/use-cases/organization-policy.use-cases.ts`
- `application/use-cases/organization.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/organization/README.md`
- 模組 AGENT：`../../../modules/organization/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/organization/application-services.md`
````

## File: docs/ddd/organization/context-map.md
````markdown
# Context Map — organization

## 上游（依賴）

### account → organization（Customer/Supplier）

- `organization.members[]` 中的 `MemberReference.id` 參照 `account` 的 accountId
- 查詢成員 profile 時呼叫 `account/api`

---

## 下游（被依賴）

### organization → workspace（Customer/Supplier）

- `Workspace.accountId + accountType="organization"` 關聯至 Organization
- 工作區列表依 organizationId 篩選

### organization → workspace-audit（Published Language）

- 成員加入/移除事件供 `workspace-audit` 消費（未來事件 sink 完成後）

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| account → organization | account | organization | Customer/Supplier |
| organization → workspace | organization | workspace | Customer/Supplier |
| organization → workspace-audit | organization | workspace-audit | Published Language (Events) |
````

## File: docs/ddd/organization/domain-events.md
````markdown
# Domain Events — organization

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `organization.created` | 新組織建立時 | `organizationId`, `name`, `ownerId`, `occurredAt` |
| `organization.member_invited` | 成員被邀請加入 | `organizationId`, `inviteId`, `email`, `role`, `occurredAt` |
| `organization.member_joined` | 邀請被接受，成員加入 | `organizationId`, `accountId`, `role`, `occurredAt` |
| `organization.member_removed` | 成員被移除 | `organizationId`, `accountId`, `occurredAt` |
| `organization.team_created` | 新 Team 建立 | `organizationId`, `teamId`, `occurredAt` |

## 訂閱事件

`organization` 不訂閱其他 BC 的事件（被動，等待 account 操作觸發）。

## 事件格式範例

```typescript
interface OrganizationMemberJoinedEvent {
  readonly type: "organization.member_joined";
  readonly organizationId: string;
  readonly accountId: string;
  readonly role: OrganizationRole;
  readonly occurredAt: string;  // ISO 8601
}
```
````

## File: docs/ddd/organization/domain-services.md
````markdown
# organization — Domain Services

> **Canonical bounded context:** `organization`
> **模組路徑:** `modules/organization/`
> **Domain Type:** Generic Subdomain

本文件整理 `organization` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/organization/domain-services.md`
- `../../../docs/ddd/organization/aggregates.md`
````

## File: docs/ddd/organization/repositories.md
````markdown
# organization — Repositories

> **Canonical bounded context:** `organization`
> **模組路徑:** `modules/organization/`
> **Domain Type:** Generic Subdomain

本文件整理 `organization` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/OrganizationRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseOrganizationRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/organization/repositories.md`
- `../../../docs/ddd/organization/aggregates.md`
````

## File: docs/ddd/organization/ubiquitous-language.md
````markdown
# Ubiquitous Language — organization

> **範圍：** 僅限 `modules/organization/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 組織 | Organization | 頂層多租戶單元，代表一個企業或團隊 |
| 成員參照 | MemberReference | 組織成員的輕量參照（含 accountId、role、presence） |
| 隊伍 | Team | 組織內的子群組（internal / external 類型） |
| 合作夥伴邀請 | PartnerInvite | 邀請外部合作夥伴加入隊伍的邀請記錄 |
| 組織角色 | OrganizationRole | 成員在組織中的角色：`Owner \| Admin \| Member \| Guest` |
| 在線狀態 | Presence | 成員的當前狀態：`active \| away \| offline` |
| 邀請狀態 | InviteState | 邀請的當前狀態：`pending \| accepted \| expired` |
| 政策效果 | PolicyEffect | 組織政策的效果：`allow \| deny` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Organization` | `Company`, `Tenant`, `Client` |
| `MemberReference` | `Member`, `OrgUser` |
| `OrganizationRole` | `Role`, `Permission` |
````

## File: docs/ddd/search/AGENT.md
````markdown
# AGENT.md — search BC

## 模組定位

`search` 是 RAG 語意檢索的支援域，提供向量搜尋、RAG answer 生成與查詢反饋收集。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `RagQuery` | Query、SearchQuery、VectorQuery |
| `RagQueryFeedback` | Feedback、Rating |
| `RagRetrievedChunk` | Chunk、SearchResult |
| `RagCitation` | Citation、Source、Reference |
| `VectorStore` | VectorDB、EmbeddingStore |
| `RagRetrievalRepository` | RetrievalRepo、SearchRepo |
| `RagGenerationRepository` | GenerationRepo、AIRepo |

## 最重要邊界規則：Server vs Client Import

```typescript
// ✅ server code（Server Action、API route）
import { searchApi } from "@/modules/search/api";

// ✅ client code（React Component）
import { RagView } from "@/modules/search"; // root barrel

// ❌ 禁止：在 /api barrel 匯出 "use client" UI 元件
// RagView, RagQueryView 只能從 root barrel 匯出
```

## 邊界規則

### ❌ 禁止
```typescript
// api/index.ts 不得 re-export "use client" 元件
export { RagView } from "./interfaces/components/RagView"; // 禁止在 api/
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: docs/ddd/search/aggregates.md
````markdown
# Aggregates — search

## 聚合根：RagQueryFeedback

### 職責
收集並持久化使用者對 RAG 查詢答案品質的反饋。支援持續改善 RAG 品質。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `feedbackId` | `string` | 反饋主鍵 |
| `queryId` | `string` | 關聯的查詢 ID |
| `helpful` | `boolean` | 是否有用 |
| `comment` | `string \| null` | 文字評論（可選） |
| `submittedAt` | `string` | ISO 8601 |

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `RagRetrievedChunk` | 檢索到的 chunk（chunkId, docId, chunkIndex, text, score, taxonomy） |
| `RagCitation` | 引用資訊（chunkId, docId, text, score） |
| `VectorDocument` | 向量索引文件（id, content, metadata, embedding） |
| `WikiCitation` | Wiki RAG 引用（pageId, pageTitle, text, score） |

---

## Ports（Hexagonal Architecture）

| Port | 說明 |
|------|------|
| `IVectorStore` | 向量資料庫抽象（`index()`, `search()`, `deleteByDocId()`） |
| `RagRetrievalRepository` | Chunk 向量搜尋操作 |
| `RagGenerationRepository` | AI 答案生成（組合 chunks + Genkit 呼叫） |
| `RagQueryFeedbackRepository` | 反饋持久化 |
| `WikiContentRepository` | Wiki 整合 RAG 查詢（`queryWikiRag()`, `reindexWikiDocument()`） |
````

## File: docs/ddd/search/application-services.md
````markdown
# search — Application Services

> **Canonical bounded context:** `search`
> **模組路徑:** `modules/search/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `search` 的 application layer 服務與 use cases。內容與 `modules/search/application/` 實作保持一致。

## Application Layer 職責

提供向量檢索、RAG answer 生成與查詢反饋收集。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/use-cases/answer-rag-query.use-case.ts`
- `application/use-cases/submit-rag-feedback.use-case.ts`
- `application/use-cases/wiki-rag.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/search/README.md`
- 模組 AGENT：`../../../modules/search/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/search/application-services.md`
````

## File: docs/ddd/search/context-map.md
````markdown
# Context Map — search

## 上游（依賴）

### ai → search（Customer/Supplier）

- `ai.ingestion_completed` 通知 `search` 更新向量索引
- `search` 依賴 `ai` 生成的 IngestionChunk（embedding 向量）

### wiki → search（Customer/Supplier）

- `wiki.node_activated` 觸發 `search` 更新節點向量表示

---

## 下游（被依賴）

### search → notebook（Customer/Supplier）

- `notebook` 呼叫 `search/api.answerRagQuery()` 取得 RAG chunks 與答案
- 這是同步查詢，不是事件

### search → Wiki UI（Interfaces）

- `RagView`, `RagQueryView` 從 `modules/search` root barrel 匯出（非 /api）
- Wiki 頁面直接呼叫 `search/api` Server Actions

---

## Import 路由

```
server code (Server Action, API route) → import from @/modules/search/api
client code (React Component)          → import from @/modules/search (root barrel)
```

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| ai → search | ai | search | Published Language (Events) |
| wiki → search | wiki | search | Published Language (Events) |
| search → notebook | search | notebook | Customer/Supplier（同步） |
| search → Wiki UI | search | app/ | Conformist |
````

## File: docs/ddd/search/domain-events.md
````markdown
# Domain Events — search

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `search.feedback_submitted` | 使用者提交 RagQueryFeedback | `feedbackId`, `queryId`, `helpful`, `occurredAt` |
| `search.index_updated` | 向量索引更新完成（文件重新索引） | `documentId`, `chunkCount`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `ai` | `ai.ingestion_completed` | 新 chunks 的 embedding 已就緒，觸發向量索引更新 |
| `wiki` | `wiki.node_activated` | 同步更新節點內容到向量索引 |

## 消費 search 事件的其他 BC

`search` 主要提供**同步查詢服務**（非事件），被 `notebook` 和 wiki RAG UI 直接呼叫：

```typescript
// notebook 呼叫 search 的同步查詢
const result = await searchApi.answerRagQuery({
  organizationId,
  userQuery,
  topK: 5,
});
```
````

## File: docs/ddd/search/domain-services.md
````markdown
# search — Domain Services

> **Canonical bounded context:** `search`
> **模組路徑:** `modules/search/`
> **Domain Type:** Supporting Subdomain

本文件整理 `search` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/search/domain-services.md`
- `../../../docs/ddd/search/aggregates.md`
````

## File: docs/ddd/search/repositories.md
````markdown
# search — Repositories

> **Canonical bounded context:** `search`
> **模組路徑:** `modules/search/`
> **Domain Type:** Supporting Subdomain

本文件整理 `search` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/RagGenerationRepository.ts`
- `domain/repositories/RagQueryFeedbackRepository.ts`
- `domain/repositories/RagRetrievalRepository.ts`
- `domain/repositories/WikiContentRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseRagQueryFeedbackRepository.ts`
- `infrastructure/firebase/FirebaseRagRetrievalRepository.ts`
- `infrastructure/firebase/FirebaseWikiContentRepository.ts`
- `infrastructure/genkit/GenkitRagGenerationRepository.ts`
- `infrastructure/genkit/client.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/search/repositories.md`
- `../../../docs/ddd/search/aggregates.md`
````

## File: docs/ddd/search/ubiquitous-language.md
````markdown
# Ubiquitous Language — search

> **範圍：** 僅限 `modules/search/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| RAG 查詢 | RagQuery | 一次 Retrieval-Augmented Generation 查詢請求 |
| RAG 已檢索 Chunk | RagRetrievedChunk | 向量搜尋返回的單一相關文件片段（含相似度分數） |
| RAG 引用 | RagCitation | AI 答案引用的 chunk 來源資訊 |
| RAG 答案輸出 | AnswerRagQueryOutput | 包含生成答案文字與引用列表的輸出 |
| 查詢反饋 | RagQueryFeedback | 使用者對 RAG 答案品質的評分記錄 |
| 向量存儲 | VectorStore | 向量資料庫的 Hexagonal Port（IVectorStore 介面） |
| Wiki 引用 | WikiCitation | Wiki 整合 RAG 的引用格式（含 pageId、pageTitle） |
| 向量文件 | VectorDocument | 要索引至向量資料庫的文件記錄 |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `RagQuery` | `SearchQuery`, `Query` |
| `RagRetrievedChunk` | `SearchResult`, `Chunk` |
| `RagCitation` | `Citation`, `Source` |
| `VectorStore` | `VectorDB`, `EmbeddingDB` |
````

## File: docs/ddd/shared/AGENT.md
````markdown
# AGENT.md — shared BC

## 模組定位

`shared` 是 Shared Kernel，提供所有 BC 共同依賴的最小基礎型別集。修改任何 shared/ 型別前，需確認所有消費方的影響。

## 最重要規則：DomainEvent 欄位名稱

```typescript
// ✅ 正確：occurredAt（ISO string）
interface MyEvent {
  readonly type: "module.action";
  readonly occurredAt: string;  // ISO 8601
}

// ❌ 錯誤：不存在 occurredAtISO 欄位
interface WrongEvent {
  readonly occurredAtISO: string;  // 不正確
}
```

## 通用語言

| 正確術語 | 禁止使用 |
|----------|----------|
| `DomainEvent` | BaseEvent, Event |
| `occurredAt` | occurredAtISO, timestamp（作為 DomainEvent 欄位） |
| `EventRecord` | AuditRecord（在此 BC 內） |

## 邊界規則

- `shared/` 內不放業務邏輯
- 只放多個 BC 都需要的最小型別
- 任何新增需要全域共識

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: docs/ddd/shared/application-services.md
````markdown
# shared — Application Services

> **Canonical bounded context:** `shared`
> **模組路徑:** `modules/shared/`
> **Domain Type:** Shared Kernel

本文件記錄 `shared` 的 application layer 服務與 use cases。內容與 `modules/shared/application/` 實作保持一致。

## Application Layer 職責

提供所有 bounded contexts 共用的最小型別與事件合約，是 Shared Kernel。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/publish-domain-event.ts`

## 設計對齊

- 模組 README：`../../../modules/shared/README.md`
- 模組 AGENT：`../../../modules/shared/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/shared/application-services.md`
````

## File: docs/ddd/shared/context-map.md
````markdown
# Context Map — shared

## Shared Kernel 的特殊地位

`shared` 不是普通的 Customer/Supplier 關係。它是 **Shared Kernel** 模式：

> 「兩個 Team 共同擁有一個小型共享模型，任何一方的修改都需要另一方的協調。」
> — Vaughn Vernon, IDDD

## 關係

所有 16 個 BC 都依賴 `shared/`，但這不是普通的依賴關係——它是**共同擁有的合約**：

```
modules/shared/
  ↑ import by all 16 BCs
```

## 規則

1. `shared/` 的任何變更（特別是 `DomainEvent` 介面）都必須同步更新所有消費方
2. 不允許任何 BC 反向依賴（shared/ 不 import 任何 BC）
3. `shared/` 只包含所有 BC 都認可的最小公共型別

## IDDD 整合模式

| 關係 | 模式 |
|------|------|
| shared ← 所有 BC | Shared Kernel |
````

## File: docs/ddd/shared/domain-events.md
````markdown
# Domain Events — shared

## 說明

`shared` 是 Shared Kernel，本身不發出或訂閱業務領域事件。

它提供的是**所有 BC 發出事件所需的基礎介面**：

```typescript
// 所有模組的領域事件都遵循此結構
interface DomainEvent {
  readonly type: string;        // "module.entity.action" 格式
  readonly occurredAt: string;  // ISO 8601
}
```

## 事件命名規範（全域）

| 規則 | 範例 |
|------|------|
| 格式 | `<module>.<entity>.<action>` 或 `<module>.<action>` |
| 大小寫 | 全小寫，底線分隔 |
| 時態 | **過去式**（代表已發生的事實） |

```typescript
// ✅ 正確命名
"knowledge.page_created"
"workspace.member_joined"
"workspace-flow.task_status_changed"

// ❌ 錯誤命名
"CreatePage"         // 現在式、大寫
"PageCreatedEvent"   // 有 Event 後綴
```
````

## File: docs/ddd/shared/domain-services.md
````markdown
# shared — Domain Services

> **Canonical bounded context:** `shared`
> **模組路徑:** `modules/shared/`
> **Domain Type:** Shared Kernel

本文件整理 `shared` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/shared/domain-services.md`
- `../../../docs/ddd/shared/aggregates.md`
````

## File: docs/ddd/shared/repositories.md
````markdown
# shared — Repositories

> **Canonical bounded context:** `shared`
> **模組路徑:** `modules/shared/`
> **Domain Type:** Shared Kernel

本文件整理 `shared` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- 目前沒有對應檔案。

## Infrastructure Implementations

- `infrastructure/InMemoryEventStoreRepository.ts`
- `infrastructure/NoopEventBusRepository.ts`
- `infrastructure/SimpleEventBus.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/shared/repositories.md`
- `../../../docs/ddd/shared/aggregates.md`
````

## File: docs/ddd/shared/ubiquitous-language.md
````markdown
# Ubiquitous Language — shared

> **範圍：** 跨所有 BC 的共享基礎術語（Shared Kernel）

## 術語定義

| 術語 | 英文 | 定義 | 代碼位置 |
|------|------|------|---------|
| 領域事件 | DomainEvent | 所有領域事件的基礎介面，含 `type` 和 `occurredAt` | `modules/shared/domain/events.ts` |
| 事件記錄 | EventRecord | 稽核/追蹤用的事件記錄（`eventId`, `occurredAt`, `actorId`） | `modules/shared/domain/event-record.ts` |
| 發生時間 | occurredAt | 事件發生時間，**ISO 8601 字串**格式（非 Date 物件） | `DomainEvent.occurredAt` |
| Slug | Slug | URL-safe 的識別符字串 | `modules/shared/domain/slug-utils.ts` |

## 關鍵規則

`occurredAt` 必須是 **ISO 8601 字串**（`string`），不是 `Date`、`Timestamp` 或數字。所有繼承 `DomainEvent` 的事件介面都必須遵守此規範。

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `occurredAt` | `occurredAtISO`, `timestamp`, `createdAt`（作為事件時間戳） |
| `DomainEvent` | `BaseEvent`, `Event` |
````

## File: docs/ddd/source/AGENT.md
````markdown
# AGENT.md — source BC

## 模組定位

`source` 是文件來源的支援域，負責上傳生命週期、版本快照與 RAG 文件登記。是 RAG ingestion pipeline 的業務入口。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `SourceDocument` | File、Document、Asset、Attachment |
| `WikiLibrary` | Library、Folder、Collection |
| `FileVersion` | Version、Snapshot、Revision |
| `RagDocument` | RagFile、IngestionDoc |
| `RetentionPolicy` | Policy、ExpiryRule |
| `AuditRecord` | Log、Event、History |
| `ActorContext` | User、CurrentUser |
| `IngestionHandoff` | Trigger、Signal |

## 邊界規則

### ✅ 允許
```typescript
import { sourceApi } from "@/modules/source/api";
import type { SourceDocumentDTO, WikiLibraryDTO } from "@/modules/source/api";
```

### ❌ 禁止
```typescript
import { File } from "@/modules/source/domain/entities/File";
```

## Firestore Timestamp 規則

```typescript
// ✅ 安全的調用方式
const date = (value.toDate as () => unknown)() as Date;

// ❌ 禁止解構賦值
const { toDate } = value; toDate(); // 'this' binding 失效
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: docs/ddd/source/aggregates.md
````markdown
# Aggregates — source

## 聚合根：SourceDocument（File.ts）

### 職責
管理文件的上傳生命週期，從上傳初始化到完成確認，以及版本快照與保留政策。

### 生命週期狀態機
```
pending_upload ──[upload_complete]──► uploaded ──[archive]──► archived
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 文件主鍵 |
| `name` | `string` | 檔案名稱 |
| `organizationId` | `string` | 所屬組織 |
| `workspaceId` | `string \| null` | 所屬工作區 |
| `status` | `FileStatus` | `pending_upload \| uploaded \| archived` |
| `versions` | `FileVersion[]` | 版本列表 |
| `retentionPolicy` | `RetentionPolicy \| null` | 保留政策 |
| `permissionSnapshot` | `PermissionSnapshot` | 上傳時授權快照 |

---

## 聚合根：WikiLibrary

### 職責
RAG 文件的邏輯集合容器，對應使用者在 UI 看到的「知識庫」概念。

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `FileVersion` | 版本快照（versionId, fileUrl, createdAt） |
| `RetentionPolicy` | 保留規則（retainDays, deleteAfterExpiry） |
| `PermissionSnapshot` | 上傳時的授權快照（不可變） |
| `AuditRecord` | 操作稽核記錄（append-only） |

---

## Ports（Hexagonal Architecture）

| Port | 說明 |
|------|------|
| `ActorContextPort` | 解析操作者身分與授權 |
| `OrganizationPolicyPort` | 查詢組織層級政策 |
| `WorkspaceGrantPort` | 驗證工作區授權 |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `FileRepository` | `save()`, `findById()`, `listByWorkspace()` |
| `RagDocumentRepository` | `save()`, `findByDocumentId()` |
| `WikiLibraryRepository` | `save()`, `findByWorkspaceId()` |
````

## File: docs/ddd/source/application-services.md
````markdown
# source — Application Services

> **Canonical bounded context:** `source`
> **模組路徑:** `modules/source/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `source` 的 application layer 服務與 use cases。內容與 `modules/source/application/` 實作保持一致。

## Application Layer 職責

管理文件上傳生命週期、版本快照與 RAG 文件登記。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/dto/file.dto.ts`
- `application/dto/rag-document.dto.ts`
- `application/index.ts`
- `application/use-cases/list-workspace-files.use-case.ts`
- `application/use-cases/register-uploaded-rag-document.use-case.ts`
- `application/use-cases/upload-complete-file.use-case.ts`
- `application/use-cases/upload-init-file.use-case.ts`
- `application/use-cases/wiki-libraries.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/source/README.md`
- 模組 AGENT：`../../../modules/source/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/source/application-services.md`
````

## File: docs/ddd/source/context-map.md
````markdown
# Context Map — source

## 上游（依賴）

### identity → source（Customer/Supplier）
- `ActorContextPort` 透過 `identity/api` 驗證上傳者身分

### workspace → source（Customer/Supplier）
- 文件隸屬 `workspaceId`，需透過 `WorkspaceGrantPort` 驗證授權

### organization → source（Customer/Supplier）
- `OrganizationPolicyPort` 解算組織層級保留政策

---

## 下游（被依賴）

### source → ai（Customer/Supplier）

- `source.upload_completed` 觸發 `ai` 域建立 IngestionJob
- **Runtime 邊界**：Next.js 端執行 upload-init/complete；`py_fn/` 執行 Embedding

### source → knowledge（Published Language）

- 文件關聯知識頁面時通知 `knowledge` 域

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| identity → source | identity | source | Customer/Supplier（Port） |
| workspace → source | workspace | source | Customer/Supplier（Port） |
| organization → source | organization | source | Customer/Supplier（Port） |
| source → ai | source | ai | Published Language (Events) |
| source → knowledge | source | knowledge | Published Language (Events) |
````

## File: docs/ddd/source/domain-events.md
````markdown
# Domain Events — source

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `source.upload_initiated` | upload-init 完成、簽名 URL 已產生 | `documentId`, `workspaceId`, `actorId`, `occurredAt` |
| `source.upload_completed` | upload-complete 確認完成 | `documentId`, `workspaceId`, `occurredAt` |
| `source.rag_document_registered` | RagDocument 成功登記進入攝入管線 | `documentId`, `ragDocumentId`, `occurredAt` |
| `source.file_archived` | 文件被封存 | `documentId`, `actorId`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `workspace` | `workspace.created` | 初始化工作區的 WikiLibrary |
| `identity` | `TokenRefreshSignal` | 更新 ActorContext 授權快照 |

## 消費 source 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `ai` | `source.upload_completed` | 建立 IngestionJob，啟動 RAG 攝入管線 |
| `knowledge` | `source.upload_completed` | 文件關聯知識頁面通知（可選） |
````

## File: docs/ddd/source/domain-services.md
````markdown
# source — Domain Services

> **Canonical bounded context:** `source`
> **模組路徑:** `modules/source/`
> **Domain Type:** Supporting Subdomain

本文件整理 `source` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- `domain/services/complete-upload-file.ts`
- `domain/services/resolve-file-organization-id.ts`

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/source/domain-services.md`
- `../../../docs/ddd/source/aggregates.md`
````

## File: docs/ddd/source/repositories.md
````markdown
# source — Repositories

> **Canonical bounded context:** `source`
> **模組路徑:** `modules/source/`
> **Domain Type:** Supporting Subdomain

本文件整理 `source` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/FileRepository.ts`
- `domain/repositories/RagDocumentRepository.ts`
- `domain/repositories/WikiLibraryRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseFileRepository.ts`
- `infrastructure/firebase/FirebaseRagDocumentRepository.ts`
- `infrastructure/index.ts`
- `infrastructure/repositories/in-memory-wiki-library.repository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/source/repositories.md`
- `../../../docs/ddd/source/aggregates.md`
````

## File: docs/ddd/source/ubiquitous-language.md
````markdown
# Ubiquitous Language — source

> **範圍：** 僅限 `modules/source/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 來源文件 | SourceDocument | 上傳的原始文件聚合根（對應 File.ts） |
| 知識庫 | WikiLibrary | RAG 文件的邏輯集合容器 |
| 檔案版本 | FileVersion | SourceDocument 的版本快照 |
| RAG 文件 | RagDocument | 已登記進入 RAG 管線的文件記錄 |
| 授權快照 | PermissionSnapshot | 上傳時的授權狀態快照（不可變） |
| 保留政策 | RetentionPolicy | 文件的保留期限與刪除規則 |
| 稽核記錄 | AuditRecord | 文件操作的不可變稽核軌跡 |
| 攝入交付 | IngestionHandoff | 上傳完成後交付 py_fn worker 的觸發信號 |
| 演員上下文 | ActorContext | 操作者身分與授權上下文（透過 ActorContextPort） |
| 工作區授權 | WorkspaceGrant | 工作區層級的授權快照（透過 WorkspaceGrantPort） |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `SourceDocument` | `File`, `Document`, `Asset` |
| `WikiLibrary` | `Library`, `Folder`, `Collection` |
| `RetentionPolicy` | `Policy`, `LifecycleRule` |
````

## File: docs/ddd/wiki/AGENT.md
````markdown
# AGENT.md — wiki BC

## 模組定位

`wiki` 是 Core Domain，負責 GraphNode 與 GraphEdge 的知識圖譜生命週期。是 Xuanwu 的核心差異化視覺特性。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `GraphNode` | Node、WikiNode、KnowledgeNode、Page（在圖譜上下文） |
| `GraphEdge` | Edge、Link、Connection、Relation |
| `EdgeType` | RelationType、LinkType |
| `NodeType` | NodeKind、PageType（在圖譜上下文） |
| `Backlink` | ReverseLink、InboundLink |
| `GraphTraversal` | Graph Walk、Traversal |
| `AutoLink` | AutoConnect、AutoRelate |

## 邊界規則

### ✅ 允許
```typescript
import { wikiApi } from "@/modules/wiki/api";
import type { GraphNodeDTO, GraphEdgeDTO } from "@/modules/wiki/api";
```

### ❌ 禁止
```typescript
import { GraphNode } from "@/modules/wiki/domain/entities/graph-node";
// modules/ai/domain/entities/graph-node.ts 是 @deprecated stub，不要使用
```

## 棄用守衛

`modules/ai/domain/entities/graph-node.ts` 和 `modules/ai/domain/entities/link.ts` 都是 `@deprecated` stub，已移至 `modules/wiki/domain/`。絕對不要 import 這些舊路徑。

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: docs/ddd/wiki/application-services.md
````markdown
# wiki — Application Services

> **Canonical bounded context:** `wiki`
> **模組路徑:** `modules/wiki/`
> **Domain Type:** Core Domain

本文件記錄 `wiki` 的 application layer 服務與 use cases。內容與 `modules/wiki/application/` 實作保持一致。

## Application Layer 職責

管理知識圖譜節點與邊，提供 backlink 與 graph traversal 能力。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/link-extractor.service.ts`
- `application/use-cases/auto-link.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/wiki/README.md`
- 模組 AGENT：`../../../modules/wiki/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/wiki/application-services.md`
````

## File: docs/ddd/wiki/context-map.md
````markdown
# Context Map — wiki

## 上游（依賴）

### knowledge → wiki（Customer/Supplier）

- `wiki` 訂閱 `knowledge` 的頁面事件以同步 GraphNode 生命週期
- `wiki.GraphNode.id` 對應 `knowledge.KnowledgePage.id`（共享主鍵）

```
knowledge.page_created ──► wiki: 建立 GraphNode
knowledge.block_updated ──► wiki: 更新 AutoLink GraphEdge
knowledge.page_archived ──► wiki: 歸檔 GraphNode
```

### workspace → wiki（Customer/Supplier）

- GraphNode 歸屬於 workspaceId

---

## 下游（被依賴）

### wiki → search（Customer/Supplier）

- `search` 消費 `wiki.node_activated` 以更新向量索引
- RAG 查詢結果中的圖譜上下文由 wiki 提供

### wiki → notebook（Customer/Supplier）

- AI 對話生成時，`notebook` 可查詢 wiki 圖譜以取得知識上下文

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| knowledge → wiki | knowledge | wiki | Published Language (Events) |
| workspace → wiki | workspace | wiki | Customer/Supplier |
| wiki → search | wiki | search | Customer/Supplier（Events） |
| wiki → notebook | wiki | notebook | Customer/Supplier（Query） |
````

## File: docs/ddd/wiki/domain-events.md
````markdown
# Domain Events — wiki

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `wiki.node_created` | 新 GraphNode 建立時 | `nodeId`, `workspaceId`, `nodeType`, `occurredAt` |
| `wiki.node_activated` | GraphNode 從 draft → active | `nodeId`, `workspaceId`, `occurredAt` |
| `wiki.node_archived` | GraphNode 歸檔 | `nodeId`, `workspaceId`, `occurredAt` |
| `wiki.edge_created` | 新 GraphEdge 建立時 | `edgeId`, `sourceNodeId`, `targetNodeId`, `edgeType`, `occurredAt` |
| `wiki.edge_activated` | GraphEdge 從 pending → active | `edgeId`, `occurredAt` |
| `wiki.edge_removed` | GraphEdge 移除 | `edgeId`, `occurredAt` |
| `wiki.autolink_created` | 系統自動建立 Backlink 關係 | `edgeId`, `sourceNodeId`, `targetNodeId`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `knowledge` | `knowledge.page_created` | 建立對應的 GraphNode |
| `knowledge` | `knowledge.block_updated` | 掃描區塊內容，建立/更新 AutoLink GraphEdge |
| `knowledge` | `knowledge.page_archived` | 將對應 GraphNode 設為 archived |

## 消費 wiki 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `search` | `wiki.node_activated` | 更新向量索引中的節點內容 |
| `notebook` | wiki 圖譜查詢（非事件） | AI 推理時參考圖譜結構 |
````

## File: docs/ddd/wiki/domain-services.md
````markdown
# wiki — Domain Services

> **Canonical bounded context:** `wiki`
> **模組路徑:** `modules/wiki/`
> **Domain Type:** Core Domain

本文件整理 `wiki` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/wiki/domain-services.md`
- `../../../docs/ddd/wiki/aggregates.md`
````

## File: docs/ddd/wiki/repositories.md
````markdown
# wiki — Repositories

> **Canonical bounded context:** `wiki`
> **模組路徑:** `modules/wiki/`
> **Domain Type:** Core Domain

本文件整理 `wiki` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/GraphRepository.ts`

## Infrastructure Implementations

- `infrastructure/InMemoryGraphRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/wiki/repositories.md`
- `../../../docs/ddd/wiki/aggregates.md`
````

## File: docs/ddd/wiki/ubiquitous-language.md
````markdown
# Ubiquitous Language — wiki

> **範圍：** 僅限 `modules/wiki/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 圖譜節點 | GraphNode | 知識圖譜中的一個節點，對應一個知識概念或頁面 |
| 圖譜邊 | GraphEdge | 兩個 GraphNode 之間的有向關係 |
| 節點類型 | NodeType | 節點的語意類型（concept, page, entity 等） |
| 邊類型 | EdgeType | 關係的語意類型（references, contains, related_to 等） |
| 反向連結 | Backlink | 指向特定節點的所有入向邊（inbound edges） |
| 圖遍歷 | GraphTraversal | 從起點節點沿邊向外擴展，取得關聯節點集 |
| 自動連結 | AutoLink | 系統自動識別內容引用並建立 GraphEdge 的機制 |
| 節點狀態 | NodeStatus | GraphNode 的生命週期狀態：`draft \| active \| archived` |
| 邊狀態 | EdgeStatus | GraphEdge 的生命週期狀態：`pending \| active \| inactive \| removed` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `GraphNode` | `Node`, `WikiNode`, `Page`（圖譜上下文中） |
| `GraphEdge` | `Edge`, `Link`, `Connection` |
| `Backlink` | `InboundLink`, `ReverseLink` |
````

## File: docs/ddd/workspace-audit/AGENT.md
````markdown
# AGENT.md — workspace-audit BC

## 模組定位

`workspace-audit` 是稽核紀錄支援域，維護 Append-Only 的 AuditLog，查詢工作區與組織稽核軌跡。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `AuditLog` | Log、Record、History、ActivityLog |
| `auditEventType` | EventType、ActionType |
| `actorId` | UserId、PerformerId |
| `workspaceId` / `organizationId` | Scope（作為稽核範圍） |

## 最重要規則：Append-Only

```typescript
// ✅ 只允許追加新記錄
await auditRepository.append(newAuditLog);

// ❌ 禁止修改或刪除
await auditRepository.update(id, changes);  // 違反 Append-Only
await auditRepository.delete(id);           // 違反 Append-Only
```

## 邊界規則

### ✅ 允許
```typescript
import { workspaceAuditApi } from "@/modules/workspace-audit/api";
import type { AuditLogDTO } from "@/modules/workspace-audit/api";
```

### ❌ 禁止
```typescript
import { AuditLog } from "@/modules/workspace-audit/domain/entities/AuditLog";
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: docs/ddd/workspace-audit/aggregates.md
````markdown
# Aggregates — workspace-audit

## 聚合根：AuditLog（Append-Only）

### 職責
記錄工作區或組織範圍內重要操作的不可變稽核軌跡。一旦寫入，永不修改或刪除。

### Append-Only 約束

> **核心不變數：** AuditLog 只能被建立，不能被更新或刪除。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 記錄主鍵（UUID） |
| `workspaceId` | `string \| null` | 所屬工作區（可選，組織級記錄可能無 workspaceId） |
| `organizationId` | `string` | 所屬組織 |
| `actorId` | `string` | 操作者帳戶 ID |
| `auditEventType` | `string` | 操作類型（如 `workspace.member_joined`） |
| `targetId` | `string \| null` | 操作對象 ID（可選） |
| `targetType` | `string \| null` | 操作對象類型（可選） |
| `metadata` | `Record<string, unknown>` | 附加資訊 |
| `auditedAt` | `string` | ISO 8601 操作時間 |

### 不變數

- `id` 建立後不可變
- `auditedAt` 使用記錄建立時的系統時間，不可後期修改
- 所有欄位建立後均不可修改（immutable record）

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `AuditLogRepository` | `append()`, `listByWorkspace()`, `listByOrganization()` |

**注意：** `AuditLogRepository` 不提供 `update()` 或 `delete()` 方法，強制執行 Append-Only。
````

## File: docs/ddd/workspace-audit/application-services.md
````markdown
# workspace-audit — Application Services

> **Canonical bounded context:** `workspace-audit`
> **模組路徑:** `modules/workspace-audit/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `workspace-audit` 的 application layer 服務與 use cases。內容與 `modules/workspace-audit/application/` 實作保持一致。

## Application Layer 職責

以 append-only 模式記錄工作區與組織範圍內的重要稽核軌跡。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/.gitkeep`
- `application/use-cases/audit.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/workspace-audit/README.md`
- 模組 AGENT：`../../../modules/workspace-audit/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/workspace-audit/application-services.md`
````

## File: docs/ddd/workspace-audit/context-map.md
````markdown
# Context Map — workspace-audit

## 上游（依賴）

`workspace-audit` 訂閱所有業務 BC 的事件，但**不依賴**任何 BC 的 api。它是純事件消費者。

```
所有業務 BC ──[Domain Events]──► workspace-audit（Terminal Sink）
```

### 主要事件來源

| 來源 BC | 整合模式 |
|---------|---------|
| `workspace` | Published Language（被動消費） |
| `organization` | Published Language（被動消費） |
| `workspace-flow` | Published Language（被動消費） |
| `workspace-scheduling` | Published Language（被動消費） |
| `source` | Published Language（被動消費） |
| `ai` | Published Language（被動消費） |

---

## 下游（被依賴）

### workspace-audit → WorkspaceDetailScreen（Interfaces）

- `workspace-audit/api` 提供稽核查詢 API 給 `workspace` 的 WorkspaceDetailScreen tab

---

## Terminal Sink 原則

`workspace-audit` 是事件消費的**終點**，不向其他 BC 發出事件。業務流程不應等待或依賴稽核記錄的完成。

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| 所有 BC → workspace-audit | 各 BC | workspace-audit | Published Language (Terminal Sink) |
| workspace-audit → workspace UI | workspace-audit | app/ | Customer/Supplier（查詢） |
````

## File: docs/ddd/workspace-audit/domain-events.md
````markdown
# Domain Events — workspace-audit

## 發出事件

`workspace-audit` 不發出 DomainEvent。它是事件的**最終消費者（Terminal Sink）**，不產生進一步的業務事件。

## 訂閱事件（消費端）

`workspace-audit` 訂閱所有需要留下稽核軌跡的業務事件：

| 來源 BC | 訂閱事件 | AuditLog.auditEventType |
|---------|---------|------------------------|
| `workspace` | `workspace.created` | `workspace.created` |
| `workspace` | `workspace.member_joined` | `workspace.member_joined` |
| `workspace` | `workspace.archived` | `workspace.archived` |
| `organization` | `organization.member_joined` | `organization.member_joined` |
| `organization` | `organization.member_removed` | `organization.member_removed` |
| `workspace-flow` | `workspace-flow.task_status_changed` | `task.status_changed` |
| `workspace-flow` | `workspace-flow.invoice_paid` | `invoice.paid` |
| `workspace-scheduling` | `workspace-scheduling.demand_status_changed` | `demand.status_changed` |
| `source` | `source.upload_completed` | `document.uploaded` |
| `ai` | `ai.ingestion_completed / failed` | `ingestion.completed / failed` |

## 說明

稽核模組是事件消費的「終點站」。業務 BC 不應依賴稽核模組的狀態，稽核只做記錄，不影響業務流程。
````

## File: docs/ddd/workspace-audit/domain-services.md
````markdown
# workspace-audit — Domain Services

> **Canonical bounded context:** `workspace-audit`
> **模組路徑:** `modules/workspace-audit/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-audit` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/workspace-audit/domain-services.md`
- `../../../docs/ddd/workspace-audit/aggregates.md`
````

## File: docs/ddd/workspace-audit/repositories.md
````markdown
# workspace-audit — Repositories

> **Canonical bounded context:** `workspace-audit`
> **模組路徑:** `modules/workspace-audit/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-audit` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/AuditRepository.ts`

## Infrastructure Implementations

- `infrastructure/.gitkeep`
- `infrastructure/firebase/FirebaseAuditRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/workspace-audit/repositories.md`
- `../../../docs/ddd/workspace-audit/aggregates.md`
````

## File: docs/ddd/workspace-audit/ubiquitous-language.md
````markdown
# Ubiquitous Language — workspace-audit

> **範圍：** 僅限 `modules/workspace-audit/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 稽核記錄 | AuditLog | 一條不可變的操作紀錄（Append-Only，永不修改） |
| 稽核事件類型 | auditEventType | 記錄的操作類型字串（如 `workspace.member_joined`） |
| 操作者 ID | actorId | 執行此操作的帳戶 ID |
| 稽核範圍 | auditScope | 此記錄的範圍（workspace 或 organization） |
| 稽核時間 | auditedAt | 操作發生時間，ISO 8601 |
| 元資料 | metadata | 操作的附加資訊（JSON，可選） |

## Append-Only 原則

`AuditLog` 一旦寫入即不可更改。任何試圖修改或刪除 AuditLog 的操作都違反此域的核心不變數。

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `AuditLog` | `Log`, `Record`, `History` |
| `actorId` | `userId`, `performerId` |
| `auditedAt` | `timestamp`, `createdAt`（在稽核上下文中） |
````

## File: docs/ddd/workspace-feed/AGENT.md
````markdown
# AGENT.md — workspace-feed BC

## 通用語言

| 正確術語 | 禁止使用 |
|----------|----------|
| `WorkspaceFeedPost` | Post、Tweet、Message |
| `WorkspaceFeedPostType` | Type、PostType |
| `authorAccountId` | authorId、userId |

## 邊界規則

```typescript
// ✅
import { workspaceFeedApi } from "@/modules/workspace-feed/api";
// ❌
import { WorkspaceFeedPost } from "@/modules/workspace-feed/domain/entities/WorkspaceFeedPost";
```
````

## File: docs/ddd/workspace-feed/aggregates.md
````markdown
# Aggregates — workspace-feed

## 聚合根：WorkspaceFeedPost

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 貼文主鍵 |
| `workspaceId` | `string` | 所屬工作區 |
| `authorAccountId` | `string` | 作者帳戶 ID |
| `type` | `WorkspaceFeedPostType` | `post \| reply \| repost` |
| `content` | `string` | 貼文內容 |
| `replyToPostId` | `string \| null` | 回覆目標 |
| `repostOfPostId` | `string \| null` | 轉貼目標 |
| `likeCount` | `number` | 按讚數 |
| `viewCount` | `number` | 瀏覽數 |

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `WorkspaceFeedRepository` | `save()`, `findById()`, `listByWorkspace()` |
````

## File: docs/ddd/workspace-feed/application-services.md
````markdown
# workspace-feed — Application Services

> **Canonical bounded context:** `workspace-feed`
> **模組路徑:** `modules/workspace-feed/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `workspace-feed` 的 application layer 服務與 use cases。內容與 `modules/workspace-feed/application/` 實作保持一致。

## Application Layer 職責

管理工作區的社交動態貼文與互動事件。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/dto/workspace-feed.dto.ts`
- `application/use-cases/workspace-feed.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/workspace-feed/README.md`
- 模組 AGENT：`../../../modules/workspace-feed/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/workspace-feed/application-services.md`
````

## File: docs/ddd/workspace-feed/context-map.md
````markdown
# Context Map — workspace-feed

## 上游（依賴）

### workspace → workspace-feed（Conformist）

- `WorkspaceFeedPost.workspaceId` 隸屬工作區

## 下游（被依賴）

### workspace-feed → notification（Published Language）

- `WorkspaceFeedPostCreated` 可觸發通知

### workspace-feed → workspace-audit（Published Language）

- 貼文操作記錄稽核軌跡

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| workspace → workspace-feed | workspace | workspace-feed | Conformist |
| workspace-feed → notification | workspace-feed | notification | Published Language |
| workspace-feed → workspace-audit | workspace-feed | workspace-audit | Published Language |
````

## File: docs/ddd/workspace-feed/domain-events.md
````markdown
# Domain Events — workspace-feed

## 發出事件

| 事件 | 觸發條件 |
|------|---------|
| `WorkspaceFeedPostCreated` | 新貼文發布 |
| `WorkspaceFeedReplyCreated` | 回覆發布 |
| `WorkspaceFeedRepostCreated` | 轉貼發布 |
| `WorkspaceFeedPostLiked` | 按讚 |
| `WorkspaceFeedPostViewed` | 瀏覽 |
| `WorkspaceFeedPostBookmarked` | 收藏 |
| `WorkspaceFeedPostShared` | 分享 |

所有事件繼承 `WorkspaceFeedBaseEvent`（`accountId`, `workspaceId`, `postId`, `actorAccountId`, `occurredAtISO`）。

## 訂閱事件

`workspace-feed` 不訂閱其他 BC 的事件。
````

## File: docs/ddd/workspace-feed/domain-services.md
````markdown
# workspace-feed — Domain Services

> **Canonical bounded context:** `workspace-feed`
> **模組路徑:** `modules/workspace-feed/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-feed` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/workspace-feed/domain-services.md`
- `../../../docs/ddd/workspace-feed/aggregates.md`
````

## File: docs/ddd/workspace-feed/repositories.md
````markdown
# workspace-feed — Repositories

> **Canonical bounded context:** `workspace-feed`
> **模組路徑:** `modules/workspace-feed/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-feed` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/workspace-feed.repositories.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseWorkspaceFeedInteractionRepository.ts`
- `infrastructure/firebase/FirebaseWorkspaceFeedPostRepository.ts`
- `infrastructure/index.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/workspace-feed/repositories.md`
- `../../../docs/ddd/workspace-feed/aggregates.md`
````

## File: docs/ddd/workspace-feed/ubiquitous-language.md
````markdown
# Ubiquitous Language — workspace-feed

| 術語 | 英文 | 定義 |
|------|------|------|
| 動態貼文 | WorkspaceFeedPost | 工作區社交動態貼文（post / reply / repost） |
| 貼文類型 | WorkspaceFeedPostType | `"post" \| "reply" \| "repost"` |
| 作者帳戶 ID | authorAccountId | 發文者帳戶 ID |
| 回覆目標 | replyToPostId | 此貼文回覆的原貼文 ID |
| 轉貼目標 | repostOfPostId | 此貼文轉貼的原貼文 ID |
````

## File: docs/ddd/workspace-flow/AGENT.md
````markdown
# AGENT.md — workspace-flow BC

## 模組定位

`workspace-flow` 是工作流程狀態機支援域，管理 Task/Issue/Invoice 三條業務線，並透過 ContentToWorkflowMaterializer 訂閱 knowledge 事件。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Task` | TodoItem、WorkItem |
| `TaskStatus` | Status（單獨使用）、State |
| `Issue` | Bug、Ticket、Problem |
| `IssueStatus` | Status（單獨使用） |
| `Invoice` | Bill、Receipt、Payment |
| `InvoiceStatus` | Status（單獨使用） |
| `MaterializedTask` | ConvertedTask、AutoTask |
| `sourceReference` | Origin、Source（作為物化來源） |
| `ContentToWorkflowMaterializer` | ContentProcessor、PageConverter |

## 狀態機（必須嚴格遵守）

```
TaskStatus:    draft → in_progress → qa → acceptance → accepted → archived
IssueStatus:   open → investigating → fixing → retest → resolved → closed
InvoiceStatus: draft → submitted → finance_review → approved → paid → closed
```

## 邊界規則

### ✅ 允許
```typescript
import { workspaceFlowApi } from "@/modules/workspace-flow/api";
import { WorkspaceFlowTab } from "@/modules/workspace-flow/api";
```

### ❌ 禁止
```typescript
import { Task } from "@/modules/workspace-flow/domain/entities/Task";
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: docs/ddd/workspace-flow/aggregates.md
````markdown
# Aggregates — workspace-flow

## 聚合根：Task

### 職責
可追蹤的工作單元，管理完整的任務生命週期狀態機。

### 生命週期狀態機
```
draft ──► in_progress ──► qa ──► acceptance ──► accepted ──► archived
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | Task 主鍵 |
| `workspaceId` | `string` | 所屬工作區 |
| `title` | `string` | 任務標題 |
| `status` | `TaskStatus` | 當前狀態 |
| `assigneeId` | `string \| null` | 負責人帳戶 ID |
| `dueDate` | `string \| null` | 截止日期 ISO 8601 |
| `sourceReference` | `SourceReference \| null` | 物化來源（pageId, causationId） |
| `currentUserId` | `string` | 當前操作者 ID |

---

## 聚合根：Issue

### 生命週期狀態機
```
open ──► investigating ──► fixing ──► retest ──► resolved ──► closed
```

### 關鍵屬性

| 屬性 | 說明 |
|------|------|
| `id`, `workspaceId`, `title` | 基本屬性 |
| `status` | `IssueStatus` |
| `severity` | `IssueStatus` 嚴重程度 |
| `reporterId` | 報告者帳戶 ID |
| `assigneeId` | 負責人帳戶 ID（可選） |

---

## 聚合根：Invoice

### 生命週期狀態機
```
draft ──► submitted ──► finance_review ──► approved ──► paid ──► closed
```

### 關鍵屬性

| 屬性 | 說明 |
|------|------|
| `id`, `workspaceId` | 基本屬性 |
| `status` | `InvoiceStatus` |
| `amount` | `number` |
| `currency` | `string`（預設 "TWD"） |
| `sourceReference` | 物化來源（可選） |

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `TaskStatus` | `"draft" \| "in_progress" \| "qa" \| "acceptance" \| "accepted" \| "archived"` |
| `IssueStatus` | `"open" \| "investigating" \| "fixing" \| "retest" \| "resolved" \| "closed"` |
| `InvoiceStatus` | `"draft" \| "submitted" \| "finance_review" \| "approved" \| "paid" \| "closed"` |
| `SourceReference` | `{ pageId: string, causationId: string }` |

---

## Repository Interfaces

| 介面 | 說明 |
|------|------|
| `TaskRepository` | Task CRUD + 狀態查詢 |
| `IssueRepository` | Issue CRUD + 狀態查詢 |
| `InvoiceRepository` | Invoice CRUD + 狀態查詢 |

---

## Domain Services

| 服務 | 說明 |
|------|------|
| `ContentToWorkflowMaterializer` | Process Manager：訂閱 `knowledge.page_approved`，建立 MaterializedTask 和 Invoice |
````

## File: docs/ddd/workspace-flow/application-services.md
````markdown
# workspace-flow — Application Services

> **Canonical bounded context:** `workspace-flow`
> **模組路徑:** `modules/workspace-flow/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `workspace-flow` 的 application layer 服務與 use cases。內容與 `modules/workspace-flow/application/` 實作保持一致。

## Application Layer 職責

管理 Task / Issue / Invoice 三條工作流程狀態機與流程物化。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/dto/add-invoice-item.dto.ts`
- `application/dto/create-task.dto.ts`
- `application/dto/invoice-query.dto.ts`
- `application/dto/issue-query.dto.ts`
- `application/dto/materialize-from-content.dto.ts`
- `application/dto/open-issue.dto.ts`
- `application/dto/pagination.dto.ts`
- `application/dto/remove-invoice-item.dto.ts`
- `application/dto/resolve-issue.dto.ts`
- `application/dto/task-query.dto.ts`
- `application/dto/update-invoice-item.dto.ts`
- `application/dto/update-task.dto.ts`
- `application/ports/InvoiceService.ts`
- `application/ports/IssueService.ts`
- `application/ports/TaskService.ts`
- `application/process-managers/content-to-workflow-materializer.ts`
- `application/use-cases/add-invoice-item.use-case.ts`
- `application/use-cases/approve-invoice.use-case.ts`
- `application/use-cases/approve-task-acceptance.use-case.ts`
- `application/use-cases/archive-task.use-case.ts`
- `application/use-cases/assign-task.use-case.ts`
- `application/use-cases/close-invoice.use-case.ts`
- `application/use-cases/close-issue.use-case.ts`
- `application/use-cases/create-invoice.use-case.ts`
- `application/use-cases/create-task.use-case.ts`
- `application/use-cases/fail-issue-retest.use-case.ts`
- `application/use-cases/fix-issue.use-case.ts`
- `application/use-cases/materialize-tasks-from-content.use-case.ts`
- `application/use-cases/open-issue.use-case.ts`
- `application/use-cases/pass-issue-retest.use-case.ts`
- `application/use-cases/pass-task-qa.use-case.ts`
- `application/use-cases/pay-invoice.use-case.ts`
- `application/use-cases/reject-invoice.use-case.ts`
- `application/use-cases/remove-invoice-item.use-case.ts`
- `application/use-cases/resolve-issue.use-case.ts`
- `application/use-cases/review-invoice.use-case.ts`
- `application/use-cases/start-issue.use-case.ts`
- `application/use-cases/submit-invoice.use-case.ts`
- `application/use-cases/submit-issue-retest.use-case.ts`
- `application/use-cases/submit-task-to-qa.use-case.ts`
- `application/use-cases/update-invoice-item.use-case.ts`
- `application/use-cases/update-task.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/workspace-flow/README.md`
- 模組 AGENT：`../../../modules/workspace-flow/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/workspace-flow/application-services.md`
````

## File: docs/ddd/workspace-flow/context-map.md
````markdown
# Context Map — workspace-flow

## 上游（依賴）

### knowledge → workspace-flow（Published Language）

**這是 workspace-flow 最重要的上游整合。**

- `workspace-flow` 的 `ContentToWorkflowMaterializer` 訂閱 `knowledge.page_approved`
- 從 `extractedTasks[]` 建立 MaterializedTask
- 從 `extractedInvoices[]` 建立 Invoice
- 每個物化實體中記錄 `sourceReference`（pageId + causationId）

```
knowledge.page_approved ──► ContentToWorkflowMaterializer
                            ├─► Task.create（extractedTask）
                            └─► Invoice.create（extractedInvoice）
```

### workspace → workspace-flow（Conformist）

- Task/Issue/Invoice 都隸屬 `workspaceId`
- `WorkspaceFlowTab` 接收 `workspaceId` + `currentUserId` 作為 props

---

## 下游（被依賴）

### workspace-flow → notification（Published Language）

- 狀態變更事件觸發通知（如 task_assigned）

### workspace-flow → workspace-audit（Published Language）

- 狀態轉換事件供稽核紀錄消費

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| knowledge → workspace-flow | knowledge | workspace-flow | Published Language (Events) |
| workspace → workspace-flow | workspace | workspace-flow | Conformist |
| workspace-flow → notification | workspace-flow | notification | Published Language |
| workspace-flow → workspace-audit | workspace-flow | workspace-audit | Published Language |
````

## File: docs/ddd/workspace-flow/domain-events.md
````markdown
# Domain Events — workspace-flow

## 發出事件

### Task 事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `workspace-flow.task_created` | Task 建立 | `taskId`, `workspaceId`, `title`, `createdByUserId`, `occurredAt` |
| `workspace-flow.task_status_changed` | Task 狀態變更 | `taskId`, `workspaceId`, `previousStatus`, `newStatus`, `occurredAt` |
| `workspace-flow.task_assigned` | Task 指派負責人 | `taskId`, `workspaceId`, `assigneeId`, `occurredAt` |
| `workspace-flow.task_materialized` | Task 由 ContentToWorkflowMaterializer 物化 | `taskId`, `workspaceId`, `sourceReference`, `occurredAt` |

### Issue 事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `workspace-flow.issue_opened` | Issue 開啟 | `issueId`, `workspaceId`, `title`, `reporterId`, `occurredAt` |
| `workspace-flow.issue_status_changed` | Issue 狀態變更 | `issueId`, `previousStatus`, `newStatus`, `occurredAt` |
| `workspace-flow.issue_resolved` | Issue 解決 | `issueId`, `workspaceId`, `occurredAt` |

### Invoice 事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `workspace-flow.invoice_created` | Invoice 建立 | `invoiceId`, `workspaceId`, `amount`, `currency`, `occurredAt` |
| `workspace-flow.invoice_status_changed` | Invoice 狀態變更 | `invoiceId`, `previousStatus`, `newStatus`, `occurredAt` |
| `workspace-flow.invoice_paid` | Invoice 標記已付款 | `invoiceId`, `workspaceId`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `knowledge` | `knowledge.page_approved` | ContentToWorkflowMaterializer 建立 MaterializedTask 與 Invoice |

## 消費 workspace-flow 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `notification` | `workspace-flow.task_assigned` | 通知被指派者 |
| `workspace-audit` | 所有狀態變更事件 | 記錄稽核軌跡 |
````

## File: docs/ddd/workspace-flow/domain-services.md
````markdown
# workspace-flow — Domain Services

> **Canonical bounded context:** `workspace-flow`
> **模組路徑:** `modules/workspace-flow/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-flow` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- `domain/services/invoice-guards.ts`
- `domain/services/invoice-transition-policy.ts`
- `domain/services/issue-transition-policy.ts`
- `domain/services/task-guards.ts`
- `domain/services/task-transition-policy.ts`

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/workspace-flow/domain-services.md`
- `../../../docs/ddd/workspace-flow/aggregates.md`
````

## File: docs/ddd/workspace-flow/repositories.md
````markdown
# workspace-flow — Repositories

> **Canonical bounded context:** `workspace-flow`
> **模組路徑:** `modules/workspace-flow/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-flow` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/InvoiceRepository.ts`
- `domain/repositories/IssueRepository.ts`
- `domain/repositories/TaskRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/invoice-item.converter.ts`
- `infrastructure/firebase/invoice.converter.ts`
- `infrastructure/firebase/issue.converter.ts`
- `infrastructure/firebase/sourceReference.converter.ts`
- `infrastructure/firebase/task.converter.ts`
- `infrastructure/firebase/workspace-flow.collections.ts`
- `infrastructure/repositories/FirebaseInvoiceItemRepository.ts`
- `infrastructure/repositories/FirebaseInvoiceRepository.ts`
- `infrastructure/repositories/FirebaseIssueRepository.ts`
- `infrastructure/repositories/FirebaseTaskRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/workspace-flow/repositories.md`
- `../../../docs/ddd/workspace-flow/aggregates.md`
````

## File: docs/ddd/workspace-flow/ubiquitous-language.md
````markdown
# Ubiquitous Language — workspace-flow

> **範圍：** 僅限 `modules/workspace-flow/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 任務 | Task | 可追蹤的工作單元，有狀態機與負責人 |
| 任務狀態 | TaskStatus | `draft \| in_progress \| qa \| acceptance \| accepted \| archived` |
| 問題 | Issue | 問題追蹤記錄（Bug / 需求問題） |
| 問題狀態 | IssueStatus | `open \| investigating \| fixing \| retest \| resolved \| closed` |
| 發票 | Invoice | 財務發票記錄 |
| 發票狀態 | InvoiceStatus | `draft \| submitted \| finance_review \| approved \| paid \| closed` |
| 物化任務 | MaterializedTask | 從 `knowledge.page_approved` 事件自動建立的任務 |
| 來源參照 | sourceReference | 物化任務/發票的來源頁面引用（pageId, causationId） |
| 工作流程物化器 | ContentToWorkflowMaterializer | 監聽 knowledge 事件並建立 Task/Invoice 的 Process Manager |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Task` | `TodoItem`, `WorkItem`, `Job` |
| `Issue` | `Bug`, `Ticket`, `Problem` |
| `Invoice` | `Bill`, `Receipt` |
| `MaterializedTask` | `ConvertedTask`, `AutoTask` |
````

## File: docs/ddd/workspace-scheduling/AGENT.md
````markdown
# AGENT.md — workspace-scheduling BC

## 模組定位

`workspace-scheduling` 是工作需求排程支援域，管理 WorkDemand 生命週期與日曆視圖。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `WorkDemand` | Demand、Request、Ticket、Requirement |
| `DemandStatus` | Status（單獨使用）、State |
| `DemandPriority` | Priority（單獨使用）、Urgency |
| `CalendarWidget` | Calendar、Scheduler |

## 狀態機（必須遵守）

```
DemandStatus: draft → open → in_progress → completed
DemandPriority: low | medium | high
```

## 邊界規則

### ✅ 允許
```typescript
import { workspaceSchedulingApi } from "@/modules/workspace-scheduling/api";
import type { WorkDemandDTO } from "@/modules/workspace-scheduling/api";
```

### ❌ 禁止
```typescript
import { WorkDemand } from "@/modules/workspace-scheduling/domain/types";
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: docs/ddd/workspace-scheduling/aggregates.md
````markdown
# Aggregates — workspace-scheduling

## 聚合根：WorkDemand

### 職責
代表一個工作需求記錄。管理需求的排程生命週期（draft → completed）。

### 生命週期狀態機
```
draft ──► open ──► in_progress ──► completed
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 需求主鍵 |
| `workspaceId` | `string` | 所屬工作區 |
| `accountId` | `string` | 所屬帳戶 |
| `title` | `string` | 需求標題 |
| `description` | `string \| null` | 描述（可選） |
| `status` | `DemandStatus` | `draft \| open \| in_progress \| completed` |
| `priority` | `DemandPriority` | `low \| medium \| high` |
| `dueDate` | `string \| null` | 截止日期 ISO 8601 |
| `createdAt` | `string` | ISO 8601 |
| `updatedAt` | `string` | ISO 8601 |

### 不變數

- `title` 不可為空
- `completed` 狀態不可逆回 `draft`

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `DemandStatus` | `"draft" \| "open" \| "in_progress" \| "completed"` |
| `DemandPriority` | `"low" \| "medium" \| "high"` |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `DemandRepository` | `save()`, `findById()`, `listByWorkspace()`, `updateStatus()` |
````

## File: docs/ddd/workspace-scheduling/application-services.md
````markdown
# workspace-scheduling — Application Services

> **Canonical bounded context:** `workspace-scheduling`
> **模組路徑:** `modules/workspace-scheduling/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `workspace-scheduling` 的 application layer 服務與 use cases。內容與 `modules/workspace-scheduling/application/` 實作保持一致。

## Application Layer 職責

管理 WorkDemand 的排程生命週期、優先級與日曆視圖。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/work-demand.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/workspace-scheduling/README.md`
- 模組 AGENT：`../../../modules/workspace-scheduling/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/workspace-scheduling/application-services.md`
````

## File: docs/ddd/workspace-scheduling/context-map.md
````markdown
# Context Map — workspace-scheduling

## 上游（依賴）

### workspace → workspace-scheduling（Conformist）

- WorkDemand 隸屬 `workspaceId`
- `WorkspaceSchedulingTab` 接收 `workspaceId` 作為 props

### account → workspace-scheduling（Customer/Supplier）

- `AccountSchedulingView` 按 `accountId` 聚合跨工作區排程視圖

---

## 下游（被依賴）

### workspace-scheduling → notification（Published Language）

- 需求建立/狀態變更事件觸發通知

### workspace-scheduling → workspace-audit（Published Language）

- 排程操作供稽核紀錄消費

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| workspace → workspace-scheduling | workspace | workspace-scheduling | Conformist |
| account → workspace-scheduling | account | workspace-scheduling | Customer/Supplier |
| workspace-scheduling → notification | workspace-scheduling | notification | Published Language |
| workspace-scheduling → workspace-audit | workspace-scheduling | workspace-audit | Published Language |
````

## File: docs/ddd/workspace-scheduling/domain-events.md
````markdown
# Domain Events — workspace-scheduling

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `workspace-scheduling.demand_created` | WorkDemand 建立 | `demandId`, `workspaceId`, `title`, `priority`, `occurredAt` |
| `workspace-scheduling.demand_status_changed` | 狀態轉換 | `demandId`, `previousStatus`, `newStatus`, `occurredAt` |
| `workspace-scheduling.demand_completed` | WorkDemand 完成 | `demandId`, `workspaceId`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `workspace-flow` | `workspace-flow.task_created` | 同步相關 WorkDemand 的排程狀態（可選） |

## 消費 workspace-scheduling 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `notification` | `workspace-scheduling.demand_created` | 通知相關成員 |
| `workspace-audit` | 所有狀態變更事件 | 記錄排程稽核軌跡 |
````

## File: docs/ddd/workspace-scheduling/domain-services.md
````markdown
# workspace-scheduling — Domain Services

> **Canonical bounded context:** `workspace-scheduling`
> **模組路徑:** `modules/workspace-scheduling/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-scheduling` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/workspace-scheduling/domain-services.md`
- `../../../docs/ddd/workspace-scheduling/aggregates.md`
````

## File: docs/ddd/workspace-scheduling/repositories.md
````markdown
# workspace-scheduling — Repositories

> **Canonical bounded context:** `workspace-scheduling`
> **模組路徑:** `modules/workspace-scheduling/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-scheduling` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- 目前沒有對應檔案。

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseDemandRepository.ts`
- `infrastructure/mock-demand-repository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/workspace-scheduling/repositories.md`
- `../../../docs/ddd/workspace-scheduling/aggregates.md`
````

## File: docs/ddd/workspace-scheduling/ubiquitous-language.md
````markdown
# Ubiquitous Language — workspace-scheduling

> **範圍：** 僅限 `modules/workspace-scheduling/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 工作需求 | WorkDemand | 一個已排程或待排程的工作請求，含標題、截止日期與優先級 |
| 需求狀態 | DemandStatus | WorkDemand 的生命週期狀態：`draft \| open \| in_progress \| completed` |
| 需求優先級 | DemandPriority | 工作緊急程度：`low \| medium \| high` |
| 日曆控件 | CalendarWidget | 顯示工作需求排程的日曆 UI 元件 |
| 帳戶排程視圖 | AccountSchedulingView | 跨工作區的帳戶級別排程總覽頁面 |

## 狀態標籤（顯示文字）

| 狀態 | 中文標籤 |
|------|---------|
| `draft` | 草稿 |
| `open` | 待處理 |
| `in_progress` | 進行中 |
| `completed` | 已完成 |
| `low` | 低 |
| `medium` | 中 |
| `high` | 高 |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `WorkDemand` | `Demand`, `Request`, `Ticket` |
| `DemandStatus` | `Status`, `WorkStatus` |
````

## File: docs/ddd/workspace/aggregates.md
````markdown
# Aggregates — workspace

## 聚合根：Workspace

### 職責
代表一個協作容器。管理工作區的生命週期（active → archived）與成員關係。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 工作區主鍵 |
| `name` | `string` | 工作區名稱 |
| `accountId` | `string` | 擁有者帳戶或組織 ID |
| `status` | `WorkspaceStatus` | `active \| archived` |
| `members` | `WorkspaceMember[]` | 成員列表 |

### 不變數

- archived 狀態的工作區不可新增成員
- workspaceId 建立後不可變更

---

## 聚合根：WikiContentTree

### 職責
維護工作區內 Wiki 頁面的樹狀層級結構，提供父子頁面關係的查詢能力。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `workspaceId` | `string` | 所屬工作區 |
| `nodes` | `WikiTreeNode[]` | 樹狀節點列表 |

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `WorkspaceMember` | 成員在工作區中的角色與狀態 |
| `WorkspaceStatus` | `"active" \| "archived"` |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `WorkspaceRepository` | `save()`, `findById()`, `findByAccountId()` |
| `WorkspaceQueryRepository` | `listByAccountId()`, `findById()` |
| `WikiWorkspaceRepository` | `getContentTree()`, `updateTree()` |
````

## File: docs/ddd/workspace/application-services.md
````markdown
# workspace — Application Services

> **Canonical bounded context:** `workspace`
> **模組路徑:** `modules/workspace/`
> **Domain Type:** Generic Subdomain

本文件記錄 `workspace` 的 application layer 服務與 use cases。內容與 `modules/workspace/application/` 實作保持一致。

## Application Layer 職責

管理工作區容器、成員與內容樹，並組合多個 workspace-* 子域。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/use-cases/wiki-content-tree.use-case.ts`
- `application/use-cases/workspace-member.use-cases.ts`
- `application/use-cases/workspace.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/workspace/README.md`
- 模組 AGENT：`../../../modules/workspace/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/workspace/application-services.md`
````

## File: docs/ddd/workspace/context-map.md
````markdown
# Context Map — workspace

## 上游（依賴）

### account / organization → workspace（Customer/Supplier）

- `workspace.accountId` 關聯 account 或 organization
- workspace 查詢時驗證 accountId 歸屬

---

## 下游（被依賴）

`workspace` 是多個 workspace-* 子模組的**組合宿主**：

### workspace → workspace-flow（Conformist）
- `WorkspaceDetailScreen` 組合 `WorkspaceFlowTab`（Tasks tab）
- 傳入 `workspaceId`, `currentUserId`

### workspace → workspace-scheduling（Conformist）
- `WorkspaceDetailScreen` 組合 `WorkspaceSchedulingTab`

### workspace → workspace-audit（Conformist）
- `WorkspaceDetailScreen` 組合 `WorkspaceAuditTab`

### workspace → workspace-feed（Conformist）
- `WorkspaceDetailScreen` 組合 feed 動態牆 tab

### workspace → knowledge（Customer/Supplier）
- 知識頁面（WikiPage）隸屬於 workspaceId
- Wiki 內容樹（WikiContentTree）按工作區組織

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| account → workspace | account | workspace | Customer/Supplier |
| organization → workspace | organization | workspace | Customer/Supplier |
| workspace → workspace-flow | workspace | workspace-flow | Conformist（workspaceId） |
| workspace → workspace-scheduling | workspace | workspace-scheduling | Conformist |
| workspace → workspace-audit | workspace | workspace-audit | Conformist |
| workspace → workspace-feed | workspace | workspace-feed | Conformist |
````

## File: docs/ddd/workspace/domain-events.md
````markdown
# Domain Events — workspace

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `workspace.created` | 新工作區建立時 | `workspaceId`, `accountId`, `name`, `occurredAt` |
| `workspace.archived` | 工作區歸檔時 | `workspaceId`, `accountId`, `occurredAt` |
| `workspace.member_joined` | 成員加入工作區 | `workspaceId`, `accountId`, `role`, `occurredAt` |
| `workspace.member_removed` | 成員被移除 | `workspaceId`, `accountId`, `occurredAt` |

## 訂閱事件

`workspace` 不直接訂閱其他 BC 的事件，由 app/ 路由層協調各 tab 組合。

## 事件格式範例

```typescript
interface WorkspaceCreatedEvent {
  readonly type: "workspace.created";
  readonly workspaceId: string;
  readonly accountId: string;
  readonly name: string;
  readonly occurredAt: string;  // ISO 8601
}
```
````

## File: docs/ddd/workspace/domain-services.md
````markdown
# workspace — Domain Services

> **Canonical bounded context:** `workspace`
> **模組路徑:** `modules/workspace/`
> **Domain Type:** Generic Subdomain

本文件整理 `workspace` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/workspace/domain-services.md`
- `../../../docs/ddd/workspace/aggregates.md`
````

## File: docs/ddd/workspace/repositories.md
````markdown
# workspace — Repositories

> **Canonical bounded context:** `workspace`
> **模組路徑:** `modules/workspace/`
> **Domain Type:** Generic Subdomain

本文件整理 `workspace` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/WikiWorkspaceRepository.ts`
- `domain/repositories/WorkspaceQueryRepository.ts`
- `domain/repositories/WorkspaceRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseWikiWorkspaceRepository.ts`
- `infrastructure/firebase/FirebaseWorkspaceQueryRepository.ts`
- `infrastructure/firebase/FirebaseWorkspaceRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/workspace/repositories.md`
- `../../../docs/ddd/workspace/aggregates.md`
````

## File: docs/ddd/workspace/ubiquitous-language.md
````markdown
# Ubiquitous Language — workspace

> **範圍：** 僅限 `modules/workspace/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 工作區 | Workspace | 協作容器，所有知識、任務、討論歸屬於此 |
| 工作區成員 | WorkspaceMember | 帳戶在工作區中的參與記錄（含角色） |
| Wiki 內容樹 | WikiContentTree | 工作區內 Wiki 頁面的樹狀層級結構 |
| 工作區 ID | workspaceId | Workspace 的業務主鍵 |
| 帳戶 ID | accountId | 擁有此工作區的帳戶或組織 ID |
| 工作區狀態 | WorkspaceStatus | `active \| archived` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Workspace` | `Project`, `Space` |
| `WorkspaceMember` | `Member`, `Participant` |
| `WikiContentTree` | `PageTree`, `Tree`, `Hierarchy` |
````

## File: docs/development/README.md
````markdown

````

## File: docs/getting-started.md
````markdown
# Getting Started

## Prerequisites

Install [Beads](https://github.com/steveyegge/beads) — the issue tracker that coordinates swarm workers:

```bash
curl -sSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
```

## Install

```bash
cd your-project
curl -sSL https://raw.githubusercontent.com/dralgorhythm/claude-agentic-framework/main/scripts/init-framework.sh | bash -s .
```

The script copies the framework files, installs hook dependencies, initializes Beads, and prompts before overwriting anything.

## Manual Install

```bash
git clone https://github.com/dralgorhythm/claude-agentic-framework.git
cp -r claude-agentic-framework/.claude your-project/
cp claude-agentic-framework/.mcp.json your-project/
cp claude-agentic-framework/CLAUDE.md your-project/
cp claude-agentic-framework/AGENTS.md your-project/
mkdir -p your-project/artifacts
cd your-project/.claude/hooks && npm install
cd your-project && bd init
```

## What Gets Installed

```
.claude/         Commands, skills, rules, hooks, agents, templates
.mcp.json        MCP server configuration
.beads/          Issue tracking database (coordinates swarm workers)
artifacts/       Where generated docs go (empty at first)
CLAUDE.md        Project context — customize this
AGENTS.md        Agent instructions for session completion
```

## Verify It Works

```bash
claude
```

Then try:
```
/architect hello
```

You should see Claude adopt the Architect command.

## Next Steps

1. **Edit CLAUDE.md** — Add your build commands (`npm test`, etc.)
2. **Edit `.claude/rules/tech-strategy.md`** — Configure your tech stack
3. **Try the workflow** — `/architect my-feature` then `/builder` then `/swarm-review`
4. **Check artifacts/** — Your ADRs and design docs appear here

See [beads.md](beads.md) for Beads usage and team setup.

---

[← Back to README](../README.md)
````

## File: docs/guides/explanation/architecture.md
````markdown
# 「Notion × Wiki × NotebookLM」融合架構學術指南

AI 知識系統與產品架構設計方法論（完整強化版）

---

## 一、研究背景：現代知識系統的三種典範

當代知識管理與文件系統，大致可分為三種代表性工具與架構思想：Notion、Wikipedia（Wiki 系統代表）、NotebookLM。這三者分別代表三種不同的知識系統設計哲學：

| 系統 | 核心模型 | 強項 |
| --- | --- | --- |
| Notion | Block + Database | UI / UX / 工作管理 |
| Wiki | Page + Link Graph | 知識結構 / 關聯 |
| NotebookLM | Document + Embedding | AI / RAG / 推理 |

產品級知識平台的發展方向不是選其中一個，而是三者融合。

---

## 二、Notion 核心功能完整解析

Notion 是以 Block Editor + Database System 為核心的工作空間平台，其設計哲學是「讓內容好整理、好使用」。

### 2.1 Block 系統（核心內容單元）

Notion 的最小單位是 Block，每個 Block 可獨立拖曳、轉換類型，並支援巢狀結構。

| Block 類型 | 說明 | 對應用途 |
| --- | --- | --- |
| Text / Heading | 純文字、H1 / H2 / H3 標題 | 文件撰寫 |
| Toggle | 可折疊的內容區塊 | FAQ / 摘要 |
| Callout | 強調提示框（含 emoji icon） | 警告 / 提示 |
| Code Block | 多語言語法高亮程式碼區塊 | 技術文件 |
| Quote | 引用樣式區塊 | 引言 / 備注 |
| Divider | 水平分隔線 | 版面分隔 |
| Table | 簡易表格（非 Database） | 靜態對比 |
| Image / Video / File | 媒體嵌入與檔案附件 | 富媒體內容 |
| Embed | 外部服務嵌入（Figma / YouTube / Map） | 整合外部工具 |
| Synced Block | 跨頁面同步區塊（修改一處全更新） | 共用內容模組 |
| Column Layout | 多欄排版（左右並排內容） | 版面設計 |
| Breadcrumb | 自動顯示頁面路徑麵包屑 | 導覽 |
| Table of Contents | 自動從 Heading 生成目錄 | 長文件導航 |

### 2.2 Database 系統（結構化資料核心）

Notion Database 是其最強大的功能，支援多種視圖與豐富的 Property 類型，本質是 NoSQL + 試算表的融合。

#### Database 視圖類型

| 視圖類型 | 說明 | 適用場景 |
| --- | --- | --- |
| Table View | 試算表式橫列縱欄顯示 | 資料總覽 / CRM |
| Board View | Kanban 看板（以 Select property 分欄） | 專案管理 / 工作流 |
| Gallery View | 卡片式圖片陳列 | 作品集 / 產品型錄 |
| List View | 簡潔清單（顯示標題 + 少量欄位） | 任務清單 / 閱讀清單 |
| Calendar View | 以日期 property 排列的月曆 | 排程 / 內容日曆 |
| Timeline View | 甘特圖式時間軸 | 專案時程規劃 |

#### Database Property 類型

| Property 類型 | 說明 |
| --- | --- |
| Text | 短文字或長文字輸入 |
| Number | 數字（支援格式化：貨幣、百分比、進度條） |
| Select | 單選下拉選單（含顏色標記） |
| Multi-select | 多選標籤 |
| Date | 日期 / 日期範圍 / 含提醒 |
| Checkbox | 完成狀態切換 |
| URL / Email / Phone | 格式化超連結輸入 |
| Person | 指定工作區成員 |
| Files & Media | 附件上傳 |
| Relation | 跨 Database 關聯（外鍵概念） |
| Rollup | 彙整 Relation 資料（sum / count / avg） |
| Formula | 自定義計算公式（引用其他 property） |
| Created time / Last edited time | 自動時間戳 |
| Created by / Last edited by | 自動記錄操作者 |
| ID | 自動遞增唯一識別碼 |
| Status | 工作流狀態（Not started / In progress / Done） |
| Button | 一鍵觸發動作（自動化 Action） |
| AI Property | 自動 AI 摘要 / 填寫（Notion AI 功能） |

### 2.3 Page 系統與導覽架構

| 功能 | 說明 |
| --- | --- |
| Page Tree（側邊欄） | 層階樹狀頁面結構，支援無限巢狀 |
| Breadcrumb | 頁面路徑顯示，支援快速跳轉 |
| Page Icon & Cover | 頁面圖示（emoji / 自訂圖片）與封面圖 |
| Sub-page | 頁面內建立子頁面（Block 形式嵌入） |
| Page Link / Mention | @mention 連結其他頁面（非雙向連結） |
| Favorites | 常用頁面加入收藏 |
| Backlinks | 顯示哪些頁面連結到此頁（弱版 Graph） |
| Page Lock | 鎖定頁面防止意外編輯 |

### 2.4 協作功能

| 功能 | 說明 |
| --- | --- |
| Real-time Collaboration | 多人同時編輯（即時同步） |
| Comment & Discussion | Block 層級留言與討論串 |
| Mention (@) | 提及成員觸發通知 |
| Page History | 頁面版本歷程（30 天 / 無限，依方案） |
| Permission System | 頁面層級權限（Full access / Can edit / Can comment / Can view） |
| Guest Access | 邀請外部用戶單頁存取 |
| Share to Web | 公開發布頁面為網頁 |
| Export | 匯出為 PDF / Markdown / HTML / CSV |

### 2.5 自動化與整合

| 功能 | 說明 |
| --- | --- |
| Notion AI | 內建 AI 寫作助手（摘要 / 翻譯 / 改寫 / Q&A） |
| Automation | Database 觸發自動化（當狀態改變時發通知 / 修改欄位） |
| API | 開放 REST API 供外部系統整合 |
| Webhook | 事件觸發 Webhook（搭配 Zapier / Make） |
| Template | 頁面與 Database 模板系統 |
| Import | 從 Confluence / Evernote / Markdown / CSV 匯入 |

---

## 三、Wiki 核心功能完整解析

Wiki 系統（以 Wikipedia / Confluence / MediaWiki 為代表）的本質是 Knowledge Graph，設計哲學是「讓知識彼此連結」。

### 3.1 頁面系統（Page = Graph Node）

| 功能 | 說明 |
| --- | --- |
| Page CRUD | 頁面建立 / 讀取 / 更新 / 刪除 |
| Namespace | 命名空間分類（Talk: / User: / Category: / File:） |
| Redirect | 重定向頁面（別名統一導向主條目） |
| Disambiguation | 消歧義頁面（同名詞條分流） |
| Stub | 不完整頁面標記（待補全提示） |
| Featured Article | 優質條目標記系統 |
| Page Protection | 頁面保護（防止匿名 / 新手 / 所有人編輯） |
| Transclusion | 跨頁面內容嵌入（Template 系統核心機制） |

### 3.2 連結與圖譜系統（Graph Model 核心）

| 功能 | 說明 | 技術意義 |
| --- | --- | --- |
| Internal Link | `[[頁面名稱]]` 雙方括號語法建立連結 | Knowledge Graph Edge |
| Backlinks | 自動追蹤「哪些頁面連結到此頁」 | 入度（In-degree）計算 |
| Redirect Link | 別名連結（同義詞指向正式頁面） | Entity Normalization |
| External Link | 引用外部網站 URL | 外部知識引用 |
| Interwiki Link | 跨 Wiki 站點連結（跨語言 / 跨站） | Federation |
| Category Link | 頁面隸屬分類（可多重分類） | Taxonomic Edge |
| Link Graph | 全站頁面連結視覺化圖譜 | Knowledge Map |
| Dead Link Detection | 偵測失效連結（紅色顯示） | Graph 完整性維護 |

### 3.3 版本控制系統（Version Control）

Wiki 的版本控制是其核心能力，每次編輯均自動快照，支援完整的比對與回溯。

| 功能 | 說明 |
| --- | --- |
| Edit History | 每次編輯自動記錄版本（含時間 / 作者 / 摘要） |
| Diff View | 逐行比對任意兩版本差異（增刪標色顯示） |
| Rollback | 一鍵回溯到任意歷史版本 |
| Blame（Annotate） | 每一行內容對應到最後一次修改的作者與版本 |
| Edit Summary | 每次提交附帶編輯說明（類似 Git commit message） |
| Minor Edit Flag | 標記為小修改（拼字更正 / 格式調整） |
| Pending Changes | 新手編輯需審核後才公開顯示 |
| Page Move History | 頁面重命名歷程追蹤（自動建立重定向） |

### 3.4 分類與標籤系統（Taxonomy Layer）

| 功能 | 說明 |
| --- | --- |
| Category System | 樹狀分類系統（Category 可繼承 / 巢狀） |
| Category Intersection | 多分類交集查詢（找同屬 A 且屬 B 的頁面） |
| Category Tree | 分類層級視覺化（根分類 → 子分類 → 頁面） |
| Template Tags | Template 作為語意標記（如 `{{Unreferenced}}` `{{Stub}}`） |
| Wikidata Integration | 連接結構化知識庫（Q-number 實體對齊） |

### 3.5 編輯與協作系統

| 功能 | 說明 |
| --- | --- |
| Wikitext / Markup | Wiki 專屬標記語法（`== 標題 ==` / `[[ ]]` 連結 / `{{ }}` Template） |
| Visual Editor | WYSIWYG 視覺化編輯器（無需學習 Wikitext） |
| Talk Page | 每個條目附帶討論頁（編輯協商空間） |
| User Page | 編輯者個人頁面（貢獻記錄 / 自我介紹） |
| Watchlist | 追蹤關注頁面的最新修改通知 |
| Edit Conflict Detection | 多人同時編輯時的衝突偵測與合併提示 |
| Rollback Permission | 快速回退惡意編輯（巡查員權限） |
| Patrol System | 新編輯標記「待審」，巡查員審核後標記通過 |

### 3.6 搜尋與導覽系統

| 功能 | 說明 |
| --- | --- |
| Full-text Search | 全文搜尋（含拼字糾正 / 近似詞匹配） |
| Prefix Search | 即時搜尋建議（輸入前綴自動補全） |
| Search by Category | 依分類篩選搜尋結果 |
| Special Pages | 系統自動生成的特殊頁面（孤立頁 / 死連結 / 最多連結頁） |
| Random Article | 隨機跳轉條目（知識探索功能） |
| What Links Here | 查詢哪些頁面連結到指定頁面（Backlink 探索） |
| Related Changes | 追蹤某頁面所有連結頁面的最新修改 |

### 3.7 Template 系統（知識模組化）

Template 是 Wiki 的代碼模組化機制，相當於 Wiki 的「元件系統」。

| 功能 | 說明 |
| --- | --- |
| Infobox Template | 右側資訊框（人物 / 地點 / 電影等結構化屬性） |
| Navigation Template | 底部導覽區塊（同系列條目快速跳轉） |
| Citation Template | 標準化引用格式（書籍 / 網站 / 期刊 cite 模板） |
| Warning Template | 條目品質警告標記（`{{POV}}` `{{Cleanup}}` 等） |
| Parameterized Template | 支援傳入參數的動態 Template（`{{{1}}}` 佔位符） |
| Transclusion | Template 內容直接嵌入目標頁面（非複製） |

---

## 四、Wiki 與 Notion 的本質差異（資料模型層）

### 4.1 Wiki：Graph Model（知識圖）

Wiki 系統本質資料模型：

```text
Page = Node
Link = Edge
→ Knowledge Graph
```

資料結構：pages / links / versions / categories / templates

特徵：
- 強調「知識與知識之間的關係」
- 非階層式，可形成網狀結構
- 雙向連結（Backlinks 自動維護）
- 適合知識庫、技術文件、研究資料

### 4.2 Notion：Block + Tree Model（內容結構）

Notion 資料模型：

```text
Page
 └── Blocks
     ├── Text
     ├── Heading
     ├── Table
     ├── Toggle
     └── Image
```

資料結構：pages / blocks / databases / properties / automations

特徵：
- 強調排版、資料表、UI 操作
- Relation property（單向 / 雙向）+ @mention（弱連結）
- 適合專案管理、文件、筆記、CRM

### 4.3 核心哲學差異對比

| 面向 | Wiki | Notion |
| --- | --- | --- |
| 核心 | 知識關聯 | 工作與內容 |
| 資料模型 | Graph | Tree + Database |
| 單位 | Page | Page + Block |
| 關聯 | Page Link（圖邊） | Relation Database（外鍵） |
| 連結方向 | 雙向（Backlink 追蹤） | 單向 / 雙向（需設定） |
| 版本控制 | 原生 Diff / Rollback | History（依方案） |
| 分類 | Category Tree（圖節點） | Tag / Filter（屬性） |
| Template | Transclusion 嵌入 | Template 頁面（複製） |
| 協作模式 | 開放編輯 + 審核制度 | 權限管理 + 即時協作 |
| 搜尋 | 全文 + Backlink + 分類 | 全文 + Database Filter |
| 強項 | 知識網絡 | UX / UI / 工作流 |
| 用途 | 知識庫 | 工作空間 |
| 思維 | Knowledge Graph | Structured Workspace |

關鍵一句話差異：
- **Wiki**：讓知識彼此連結
- **Notion**：讓內容好整理、好使用

---

## 五、NotebookLM 的角色（AI 層）

NotebookLM 代表第三種系統：AI 知識系統模型（RAG）。

資料流程：

```text
Documents
   ↓
Chunking
   ↓
Embedding
   ↓
Vector Database
   ↓
Retrieval
   ↓
LLM
   ↓
Answer / Summary / Reasoning
```

這種架構稱為：Retrieval-Augmented Generation（RAG）。

NotebookLM 本質不是筆記工具，而是 `AI Knowledge Reasoning System`，解決：文件理解、問答、摘要、推理、跨文件分析。

---

## 六、Query Understanding Layer（查詢理解層）

在使用者輸入問題到 RAG 系統之間，存在一層「查詢理解層」，負責解析、拆解與轉化查詢意圖。

### Query Planner 架構

```text
User Input
    ↓
Query Understanding Layer
    ├── Intent Classification（意圖分類）
    ├── Query Decomposition（查詢拆解）
    ├── Query Rewriting（查詢改寫）
    ├── Hypothetical Document Embedding (HyDE)
    └── Sub-query Generation（子查詢生成）
    ↓
Retrieval Layer
```

### 核心功能

| 功能 | 說明 |
| --- | --- |
| Intent Classification | 分類：問答 / 摘要 / 比較 / 推理 |
| Query Decomposition | 複雜問題拆成多個子問題 |
| Query Rewriting | 改寫為更適合向量搜尋的語句 |
| HyDE | 先生成假設文件再做 embedding 搜尋 |
| Multi-step Planning | 規劃多步推理路徑 |

Query Understanding 是提升 RAG 精準度的關鍵前處理層。

---

## 七、AI Memory Layer（三層記憶架構）

NotebookLM 的「記憶」由三種記憶類型組成：

```text
AI Memory Layer
├── 1. Semantic Memory（語意記憶）
│       → Embedding / Vector Database
├── 2. Episodic Memory（互動記憶）
│       → User Interaction History / Sessions
└── 3. Working Memory（上下文記憶）
        → Current Chat Context Window
```

### 三層記憶對比

| 記憶類型 | 範圍 | 持久性 | 技術實作 |
| --- | --- | --- | --- |
| Semantic Memory | 知識庫 | 長期 | Vector DB（Pinecone / Firestore Vector） |
| Episodic Memory | 使用者歷史 | 中期 | Session Store（Firestore sessions） |
| Working Memory | 當前對話 | 短期 | Context Buffer（in-memory） |

完整 AI Memory 層 = 三層協同運作，而非僅有 Embedding。

---

## 八、Indexing Strategy Layer（索引策略層）

索引策略決定了 RAG 的搜尋能力上限。單一 Vector Search 不足以支撐複雜查詢。

### Hybrid Retrieval（多索引融合）

```text
User Query
    ↓
┌─────────────────────────────────┐
│       Hybrid Retrieval Layer     │
│  ┌──────────┐  ┌─────────────┐  │
│  │  Dense   │  │   Sparse    │  │
│  │ Retrieval│  │  Retrieval  │  │
│  │(Vector)  │  │(BM25/TF-IDF)│  │
│  └────┬─────┘  └──────┬──────┘  │
│       └────────┬───────┘         │
│           ┌────┴──────┐          │
│           │  Reranker  │          │
│           └────────────┘          │
└─────────────────────────────────┘
    ↓
Top-K Results → LLM
```

### 索引策略類型

| 索引類型 | 說明 | 適用場景 |
| --- | --- | --- |
| Dense（Vector） | 語意相似性搜尋 | 概念性問題 |
| Sparse（BM25） | 關鍵字精確匹配 | 術語 / 代碼搜尋 |
| Hybrid | Dense + Sparse 融合 | 通用場景 |
| Graph Index | 知識圖譜關係搜尋 | 推理 / 關聯查詢 |
| Hierarchical | 階層式索引（文件→段落→句子） | 長文件 |

### Reranker（重排序）

```text
Initial Retrieval Results (Top-50)
    ↓
Cross-Encoder Reranker
    ↓
Final Top-K (Top-5 / Top-10)
    ↓
LLM Context
```

Hybrid Retrieval + Reranker 是企業級 RAG 系統標準配置。

---

## 九、Graph-Augmented RAG（圖增強檢索）

Graph-Augmented RAG 將知識圖譜與向量搜尋融合，解決純 Vector Search 無法處理的多跳推理問題。

### 架構圖

```text
User Query
    ↓
┌──────────────────────────────────────┐
│         Graph-Augmented RAG           │
│                                        │
│  ┌──────────────┐  ┌───────────────┐  │
│  │ Vector Search │  │  Graph Search │  │
│  │  (Semantic)   │  │ (Relational)  │  │
│  └──────┬────────┘  └───────┬───────┘  │
│         └──────────┬────────┘          │
│              ┌─────┴──────┐            │
│              │  Fusion     │            │
│              │  & Ranking  │            │
│              └─────────────┘            │
└──────────────────────────────────────┘
    ↓
LLM（with graph context）
```

### 知識圖譜結構

```text
Entity Node：概念 / 實體 / 頁面
    ↓
Relation Edge：IS_A / PART_OF / RELATED_TO / CAUSES
    ↓
Knowledge Graph（可導航推理路徑）
```

### Graph vs. Vector 比較

| 面向 | Vector Search | Graph Search |
| --- | --- | --- |
| 搜尋基礎 | 語意相似度 | 實體關係路徑 |
| 強項 | 模糊語意匹配 | 精確關係推理 |
| 弱點 | 無關係推理 | 稀疏圖效果差 |
| 融合效果 | 互補，共同支撐複雜查詢 | ← |

Graph-Augmented RAG 是下一代知識系統的核心競爭力。

---

## 十、Multi-Document Reasoning（跨文件推理）

### Multi-hop Reasoning（多步推理）

```text
Complex Question
    ↓
Query Decomposition（拆解子問題）
    ↓
Sub-query 1 → Document A
Sub-query 2 → Document B
Sub-query 3 → Document C
    ↓
Evidence Aggregation（證據彙整）
    ↓
Multi-hop Reasoning（多步推理）
    ↓
Final Answer（綜合回答）
```

### 推理類型

| 推理類型 | 說明 |
| --- | --- |
| Bridge Reasoning | A → B → C 鏈式推理 |
| Comparison Reasoning | A vs. B 比較推理 |
| Compositional Reasoning | 組合多條件推理 |
| Temporal Reasoning | 時間序列推理 |

### 跨文件分析能力

```text
Document 1（技術文件）
Document 2（規格書）
Document 3（會議記錄）
    ↓
Cross-Document Analysis
    ├── 矛盾偵測（Contradiction Detection）
    ├── 知識補全（Knowledge Completion）
    └── 時間線整合（Timeline Synthesis）
    ↓
Unified Answer with Source Attribution
```

---

## 十一、Source Grounding / Citation System（引用系統）

AI 回答必須可追溯（Traceable）與可驗證（Verifiable），這是企業級 AI 系統的核心需求。

### Citation 架構

```text
LLM Answer
    ↓
Citation Extraction（引用萃取）
    ↓
Source Mapping（來源對應）
    ├── Document ID
    ├── Chunk ID
    ├── Page / Section
    └── Confidence Score
    ↓
Grounded Answer（可追溯回答）
```

### 引用輸出格式

```text
回答：「根據文件 A 第 3 節¹ 與文件 B 第 7 頁²，系統設計應採用...」

¹ 文件A - 系統規格書 v2.1, 第3節, 第12頁
² 文件B - 架構設計文件, 第7頁
```

### Grounding 驗證層

| 驗證項目 | 說明 |
| --- | --- |
| Faithfulness | 回答是否忠實於來源文件 |
| Relevance | 引用來源是否與問題相關 |
| Completeness | 是否涵蓋所有必要資訊 |
| Hallucination Detection | 偵測 LLM 幻覺輸出 |

Source Grounding 讓 AI 回答從「黑盒」變成「可審計系統」。

---

## 十二、Ingestion Pipeline（資料生命週期）

完整的資料生命週期管理，從原始文件到可查詢知識庫的完整流程。

### 完整 Ingestion Pipeline

```text
Raw Documents（原始資料）
    ↓
1. Parse（解析）
   ├── PDF / DOCX / HTML / Markdown
   ├── Table Extraction
   └── Image OCR
    ↓
2. Clean（清洗）
   ├── Remove noise / boilerplate
   ├── Normalize encoding
   └── Language detection
    ↓
3. Taxonomy（分類標記）
   ├── Auto-tagging
   ├── Category classification
   └── Metadata extraction
    ↓
4. Chunk（分塊）
   ├── Semantic chunking
   ├── Hierarchical chunking
   └── Overlap strategy
    ↓
5. Chunk Metadata（塊 metadata）
   ├── source_doc_id
   ├── section / heading path
   ├── page_number
   └── chunk_index
    ↓
6. Embedding（向量化）
   ├── Embedding model selection
   └── Batch embedding generation
    ↓
7. Firestore Writes（持久化）
   ├── Vector store
   ├── Metadata store
   └── Document registry
    ↓
8. Mark Ready（標記就緒）
   └── status: "indexed" → available for query
```

### 資料狀態機

```text
uploaded → parsing → chunking → embedding → indexed → stale → re-indexing
```

### Ingestion 品質指標

| 指標 | 說明 |
| --- | --- |
| Parse Success Rate | 文件成功解析率 |
| Chunk Quality Score | 分塊語意完整性 |
| Embedding Coverage | Embedding 覆蓋率 |
| Index Latency | 完整 Pipeline 耗時 |

---

## 十三、Tool / Agent Layer（工具調用層）

AI 系統從「回答問題」進化到「執行動作」，需要 Tool / Agent 層支撐。

### Agent 架構

```text
User Request
    ↓
Agent Orchestrator
    ↓
┌─────────────────────────────────────┐
│              Tool Registry           │
│  ┌──────────┐  ┌──────────────────┐ │
│  │  Search  │  │  Knowledge Graph │ │
│  │  Tool    │  │  Query Tool      │ │
│  └──────────┘  └──────────────────┘ │
│  ┌──────────┐  ┌──────────────────┐ │
│  │  Create  │  │   Summarize      │ │
│  │  Doc     │  │   Tool           │ │
│  └──────────┘  └──────────────────┘ │
│  ┌──────────┐  ┌──────────────────┐ │
│  │  Link    │  │   External API   │ │
│  │  Pages   │  │   Connector      │ │
│  └──────────┘  └──────────────────┘ │
└─────────────────────────────────────┘
    ↓
Action Execution → Result → User
```

### 工具類型

| 工具類型 | 說明 | 對應功能 |
| --- | --- | --- |
| Retrieval Tool | 知識庫搜尋 | Vector + Graph Search |
| Creation Tool | 文件 / 頁面自動生成 | Auto-draft |
| Summarization Tool | 文件摘要 | Auto Summary |
| Linking Tool | 知識圖譜連結 | Auto Link |
| Classification Tool | 自動標記 / 分類 | Auto Tag |
| External Tool | 呼叫外部 API | 第三方整合 |

### ReAct / Chain-of-Thought 模式

```text
Thought: 使用者想了解 X，需要先查 Y 再推論 Z
Action: search_tool("Y")
Observation: [retrieved context]
Thought: 已取得 Y，現在推論 Z
Action: reasoning_tool("Z given Y")
Final Answer: [grounded answer with citations]
```

---

## 十四、Schema + Ontology Layer（知識語意層）

知識語意層定義「知識的意義」與「概念間的關係」，讓 AI 能理解領域語意而非僅做字串匹配。

### Ontology 結構

```text
Domain Ontology
    ├── Classes（類別）
    │       ├── Document
    │       ├── Person
    │       ├── Project
    │       └── Concept
    ├── Properties（屬性）
    │       ├── hasAuthor
    │       ├── createdAt
    │       └── relatedTo
    └── Relations（關係）
            ├── IS_A（繼承）
            ├── PART_OF（組成）
            ├── DEPENDS_ON（依賴）
            └── CONTRADICTS（矛盾）
```

### Schema 層用途

| 用途 | 說明 |
| --- | --- |
| Entity Normalization | 統一同義詞 / 別名 |
| Relation Typing | 為圖譜邊定義語意類型 |
| Query Semantics | 理解查詢的業務語意 |
| Knowledge Validation | 驗證知識一致性 |

### Ontology 與 RAG 整合

```text
User Query（自然語言）
    ↓
Ontology Mapping（概念對齊）
    ↓
Enriched Query（附帶語意上下文）
    ↓
Graph + Vector Retrieval
    ↓
Semantically Grounded Answer
```

Schema + Ontology 層讓知識系統從「資料庫」進化為「知識庫」。

---

## 十五、三種系統的架構分層（非常重要）

```text
┌──────────────────────┐
│        AI Layer       │  ← NotebookLM / RAG
├──────────────────────┤
│   Knowledge Graph     │  ← Wiki
├──────────────────────┤
│   Content / UI Layer  │  ← Notion
└──────────────────────┘
```

| 層 | 功能 | 對應系統 |
| --- | --- | --- |
| AI Layer | 搜尋、問答、推理 | NotebookLM / RAG |
| Graph Layer | 知識關聯 | Wiki |
| Content / UI Layer | 編輯、排版、資料庫 | Notion |

真正的 AI 知識平台 = 三層架構。

---

## 十六、產品級架構模型（AI SaaS 最強形態）

Notion × Wiki × NotebookLM 融合架構：

```text
               ┌──────────────┐
                │      AI       │
                │  RAG / Chat   │
                └──────┬───────┘
                       │
            ┌──────────┴──────────┐
            │    Knowledge Graph   │
            │   Page Links / Tags  │
            └──────────┬──────────┘
                       │
                ┌──────┴──────┐
                │  Block Editor│
                │   Database   │
                └──────────────┘
```

### 知識系統演化三階段

| 時代 | 系統 | 架構 |
| --- | --- | --- |
| Web 1.0 | Wiki | Knowledge Graph |
| Web 2.0 | Notion | Block + Database |
| AI Era | NotebookLM | RAG + LLM |
| 未來 | Hybrid | Graph + Block + AI |

工程公式：

```text
AI Knowledge System
= Editor
+ Database
+ Knowledge Graph
+ Vector Search
+ LLM
```

---

## 十七、對應到技術架構（Firestore + Genkit + Next.js）

### 17.1 Firestore Schema（資料層）

| Collection | 說明 | 對應概念 |
| --- | --- | --- |
| pages | 頁面文件（含 Block 樹 + Graph Node） | Wiki Page / Notion Page |
| blocks | Block 內容單元 | Notion Block |
| databases | 結構化 Database 定義 | Notion Database |
| relations | 跨 Database Relation | Notion Relation Property |
| page_links | 頁面連結（fromPageId / toPageId / type） | Wiki Internal Link |
| embeddings | pageId / blockId / vector / content | NotebookLM Semantic Memory |
| tags | 多維標籤 | Wiki Category / Notion Tag |
| comments | Block 層級留言 | Notion Comment |
| versions | 頁面版本快照 | Wiki Revision History |
| sessions | 使用者互動歷程 | Episodic Memory |

Graph 關聯：

```text
page_links
  fromPageId
  toPageId
  type（IS_A / RELATED_TO / PART_OF）
```

RAG：

```text
embeddings
  pageId
  blockId
  vector
  content
  chunkIndex
  sectionPath
```

### 17.2 Genkit Flow（AI 層）

| Flow | 說明 |
| --- | --- |
| QueryPlannerFlow | Intent 分類 + Query 拆解 + HyDE |
| RetrievalFlow | Hybrid RAG（Dense + Sparse + Graph + Reranker） |
| IngestionFlow | Parse → Chunk → Embed → Index Pipeline |
| AgentOrchestratorFlow | ReAct 模式多工具調用 |
| CitationFlow | Answer + Source Mapping + Faithfulness Check |

AI 功能：

- Chat with Docs
- Auto Summary
- Auto Tag
- Auto Link
- Knowledge Graph Expansion

### 17.3 Next.js Parallel Routes（UI 層）

```text
/workspace
    /@editor      → Block Editor（Notion Layer）
    /@graph       → Knowledge Graph View（Wiki Layer）
    /@chat        → AI Chat + RAG（NotebookLM Layer）
    /@database    → Database View（Notion Layer）
```

畫面佈局：

```text
┌───────────────┬───────────────┐
│   Page Tree   │    Editor     │
├───────────────┼───────────────┤
│ KnowledgeGraph│     AI Chat   │
└───────────────┴───────────────┘
```

這就是：`AI Knowledge Operating System`

---

## 十八、最終學術級結論（完整架構層次）

### 完整 AI 知識平台架構層次

```text
┌─────────────────────────────────────────────────┐
│                  User Interface                   │
│          （Block Editor / Chat / Graph View）      │
├─────────────────────────────────────────────────┤
│           Tool / Agent Layer（工具調用層）          │
│    Search / Create / Link / Summarize / External  │
├─────────────────────────────────────────────────┤
│        Query Understanding Layer（查詢理解層）      │
│    Intent / Decompose / Rewrite / Plan / HyDE     │
├──────────────────────┬──────────────────────────┤
│  Multi-Document      │   Source Grounding /      │
│  Reasoning（多步推理）│   Citation System（引用）  │
├──────────────────────┴──────────────────────────┤
│         Graph-Augmented RAG（圖增強檢索）          │
│          Vector Search + Graph Search + Reranker  │
├─────────────────────────────────────────────────┤
│         Indexing Strategy Layer（索引策略層）       │
│         Dense / Sparse / Graph / Hierarchical     │
├─────────────────────────────────────────────────┤
│              AI Memory Layer（記憶層）              │
│  Semantic Memory | Episodic Memory | Working Mem  │
├─────────────────────────────────────────────────┤
│           Ingestion Pipeline（資料生命週期）         │
│    Parse → Clean → Taxonomy → Chunk → Embed       │
│                → Persist → Mark Ready             │
├─────────────────────────────────────────────────┤
│       Schema + Ontology Layer（知識語意層）         │
│        Classes / Properties / Relations           │
├─────────────────────────────────────────────────┤
│         Knowledge Graph（知識圖譜層）               │
│     Page Links / Backlinks / Category / Template  │
│     Redirect / Namespace / Version Control        │
├─────────────────────────────────────────────────┤
│           Content / Data Layer（內容層）            │
│   Block Editor / Database / Views / Automation   │
│   Property Types / Collaboration / Template      │
└─────────────────────────────────────────────────┘
```

### 完整架構能力對照

| 能力 | 實現機制 | 層次 |
| --- | --- | --- |
| Query Planner | Intent classification + query decomposition | Query Understanding Layer |
| Multi-hop reasoning | Sub-query generation + evidence aggregation | Multi-Document Reasoning |
| Hybrid retrieval | Dense + Sparse + Reranker | Indexing Strategy Layer |
| Graph-augmented RAG | Vector + Graph fusion | Graph-Augmented RAG |
| Citation / grounding | Source mapping + faithfulness check | Citation System |
| Semantic Memory | Vector embeddings + persistent vector database | AI Memory Layer |
| Episodic Memory | User interaction history + cross-session store | AI Memory Layer |
| Working Memory | In-memory conversation buffer | AI Memory Layer |
| Ingestion pipeline | Parse → Embed → Index lifecycle | Ingestion Pipeline |
| Agent / tool layer | ReAct + tool registry | Tool / Agent Layer |
| Ontology / schema | Domain classes + relation types | Schema + Ontology Layer |
| Block Editor | Drag-drop / nested blocks / 13+ block types | Content / UI Layer |
| Database System | 6 views / 18+ property types / automation | Content / UI Layer |
| Knowledge Graph | Backlinks / redirects / category tree | Knowledge Graph Layer |
| Version Control | Diff / Rollback / Edit history / Blame | Knowledge Graph Layer |
| Template System | Transclusion / parameterized templates | Knowledge Graph Layer |

---

> 這就是現代 AI SaaS 文件 / 知識 / 協作 / AI 系統的完整理論架構。
>
> **下一代知識平台架構：**
> Notion（UI / Block / Database）+ Wiki（Knowledge Graph）+ NotebookLM（RAG / AI）= **AI Knowledge Platform**
````

## File: docs/guides/explanation/README.md
````markdown
# Explanation

Explanation pages are understanding-oriented and describe why the system works this way.

## Include

- Mental models
- Design trade-offs
- Architectural rationale
- Alternatives considered

## Exclude

- Procedural runbooks
- API field catalogs
- Beginner hand-holding steps
````

## File: docs/guides/how-to/README.md
````markdown
# How-to Guides

How-to guides are task-oriented procedures for users who already know the basics.

## Include

- Specific problem statement
- Preconditions
- Ordered procedure
- Verification and rollback notes
- Links to reference for exact parameters

## Exclude

- Introductory teaching flow
- Broad conceptual background
- Changelog history
````

## File: docs/handoffs.md
````markdown
# Handoffs

How work flows between commands and agents.

## Command Handoff Chain

```
/architect        →  artifacts/adr_*.md, system_design_*.md
       ↓
/builder          →  Code + tests
       ↓
/swarm-review     →  Feedback → back to /builder if needed
```

Each command reads the previous artifacts and builds on them.

## Swarm Orchestration Handoffs

```
/swarm-plan       →  artifacts/plan_*.md + Beads tasks
       ↓
/swarm-execute    →  Parallel workers implement tasks
       ↓
/swarm-review     →  Multi-perspective review (2-3x loop)
       ↓
PR creation       →  gh pr create
```

## Worker Completion

Every worker or session MUST follow the "Landing the Plane" protocol in `AGENTS.md`. The critical requirement: work is NOT complete until `git push` succeeds.

## Session Handoffs

Leave context for the next session:

```bash
# Write handoff message
echo '{"message": "Completed API endpoints. Remaining: tests for /users route."}' > .claude/hooks/.state/handoff.json
```

The next session's `session-start-loader.sh` will display this message on startup.

## Beads-Based Handoffs

Use Beads for structured handoffs between agents:

```bash
bd create "Continue: implement pagination for /users" --type=task
bd dep add <new-id> <completed-id>  # link dependency
```

Workers discover available work via `bd ready`.

---

[← Back to README](../README.md)
````

## File: docs/hooks.md
````markdown
# Hooks

Hooks run automatically at key points in Claude Code's lifecycle.

## Built-in Hooks

| Hook | Event | Purpose |
|------|-------|---------|
| `session-start-loader.sh` | SessionStart | Load Beads status, detect active swarm agents, process handoffs, cleanup stale sessions |
| `skill-activation-prompt.sh` | UserPromptSubmit | Suggest relevant skills based on context |
| `pre-tool-use-validator.sh` | PreToolUse | File locking, secret detection, protected file enforcement |
| `dangerous-command-guard.sh` | PreToolUse (Bash) | Guard against dangerous shell commands (force push, rm -rf, etc.) |
| `pre-push-main-blocker.sh` | PreToolUse (Bash) | Block direct pushes to main/master branch |
| `pre-commit-verification.sh` | PreToolUse (Bash) | Pre-commit quality checks |
| `post-tool-use-tracker.sh` | PostToolUse | Track file changes and sync with Beads |
| `stop-validator.sh` | Stop | Release file locks, cleanup session state, warn about uncommitted changes |
| `subagent-stop-validator.sh` | SubagentStop | Log swarm worker completion |

## Key Capabilities

### File Locking (pre-tool-use-validator.sh)

Prevents concurrent file edits in multi-agent swarm environments:
- Atomic lock acquisition via `mkdir` (race-condition safe)
- Lock auto-expires after 120 seconds
- Session-based: locks are tied to the session that created them
- Automatic release on session stop

### Secret Detection (pre-tool-use-validator.sh)

Scans Write/Edit content for 6 secret patterns:
1. Generic API keys, passwords, tokens
2. AWS access keys (`AKIA...`)
3. JWT tokens
4. Environment variable exports with secrets
5. GitHub personal access tokens (`ghp_...`)
6. Private keys (PEM format)

Test files (`*.test.ts`, `*.spec.ts`, etc.) are excluded to reduce false positives.

### Protected Files (pre-tool-use-validator.sh)

Blocks modifications to critical system files:
- `.beads/beads.db`, `.beads/daemon`
- `.git/`
- `.env`
- `.mcp.json`

### Push Blocking (pre-push-main-blocker.sh)

Enforces trunk-based development by blocking pushes to main/master:
- Detects explicit pushes (`git push origin main`)
- Detects implicit pushes (`git push` while on main branch)
- Provides remediation instructions (create feature branch, push there, create PR)

### Session Management (session-start-loader.sh + stop-validator.sh)

- Tracks active sessions in `.claude/hooks/.state/`
- Detects active swarm agents for coordination awareness
- Supports handoff messages between sessions
- Auto-cleans stale sessions older than 24 hours
- Warns about uncommitted changes on session stop
- Syncs Beads before exit

## Creating a Hook

1. Create `.claude/hooks/my-hook.sh`:

```bash
#!/bin/bash
input=$(cat)
# your logic
echo '{"continue": true}'
```

2. Make executable:
```bash
chmod +x .claude/hooks/my-hook.sh
```

3. Register in `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/my-hook.sh",
        "timeout": 5
      }]
    }]
  }
}
```

See `.claude/templates/hook.template.sh` for the full template.

## Hook Input

Hooks receive JSON via stdin:

```json
{
  "session_id": "abc123",
  "cwd": "/workspace",
  "prompt": "user message",
  "tool_name": "Write",
  "tool_input": {}
}
```

## Hook Output

For PreToolUse hooks, return a permission decision:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow|deny|ask",
    "permissionDecisionReason": "Explanation"
  }
}
```

## Runtime Directories

| Directory | Purpose | Gitignored |
|-----------|---------|------------|
| `.claude/hooks/.state/` | Session tracking files | Yes |
| `.claude/hooks/.locks/` | File lock files | Yes |

## Tips

- Keep hooks fast (< 5 seconds timeout)
- Test with: `echo '{}' | ./my-hook.sh`
- Override hooks via `settings.local.json`

---

[← Back to README](../README.md)
````

## File: docs/mcp-servers.md
````markdown
# MCP Servers

Model Context Protocol servers extend Claude's capabilities. The framework includes a curated set.

## Included Servers

### Sequential Thinking
Structured workspace for multi-step reasoning. Makes Claude's thought process visible and auditable.

**Best for:** Architecture decisions, debugging complex issues, planning

### Chrome DevTools
Browser automation with deep debugging — performance traces, network inspection, console access.

**Best for:** QA testing, frontend debugging, performance analysis

### Context7
Up-to-date documentation and code examples for any library via Context7.

**Best for:** Researching library APIs, finding code examples, validating implementation patterns

### Filesystem
File system operations beyond the workspace boundary.

**Best for:** Cross-project file access, operations outside the working directory

## Setup

The servers are configured in `.mcp.json`. Most work out of the box.

## Adding More Servers

Edit `.mcp.json`:

```json
{
  "mcpServers": {
    "new-server": {
      "command": "npx",
      "args": ["@example/mcp-server"],
      "env": {
        "API_KEY": "${API_KEY}"
      }
    }
  }
}
```

## Recommended Additions

| Server | Purpose | When to Add |
|--------|---------|-------------|
| GitHub | PRs, issues, code search | GitHub-heavy workflows (requires `GITHUB_TOKEN`) |
| PostgreSQL | Database queries | Working with Postgres |
| Brave Search | Web search | Research-heavy work |
| Slack | Team messaging | Team coordination |
| Linear | Issue tracking | If you use Linear |

### GitHub Example

```json
"github": {
  "command": "npx",
  "args": ["@anthropic-ai/mcp-server-github"],
  "env": {
    "GITHUB_TOKEN": "${GITHUB_TOKEN}"
  }
}
```

## Troubleshooting

### Server not starting

Check logs:
```bash
claude mcp list
```

### Permission denied

MCP servers run as your user. Check file permissions and API tokens.

## Resources

- [Official MCP Servers](https://github.com/modelcontextprotocol/servers)
- [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers)
- [MCP.so Directory](https://mcp.so/)

---

[← Back to README](../README.md)
````

## File: docs/personas.md
````markdown
# Commands

Commands are expert modes invoked via slash commands (e.g., `/architect`).

## Quick Reference

| Command | Role | Creates |
|---------|------|---------|
| `/architect` | System design | ADRs, system design docs |
| `/builder` | Implementation | Code, tests |
| `/qa-engineer` | Testing | Test plans, test suites |
| `/security-auditor` | Security | Audits, threat models |
| `/ui-ux-designer` | Interface design | Design specs, wireframes |
| `/code-check` | Codebase audit | SOLID/DRY violations, health report |
| `/swarm-plan` | Planning orchestrator | Parallel exploration, task decomposition |
| `/swarm-execute` | Execution orchestrator | Parallel workers, quality gates |
| `/swarm-review` | Adversarial reviewer | Multi-perspective code review |
| `/swarm-research` | Research orchestrator | Deep investigation, technology evaluation |

## Usage

Just use the command with your task:

```
/builder fix the caching bug
/architect design the payment system
/security-auditor payment system
```

Or chain them for a workflow:

```
/architect user auth           # writes design
/builder                       # reads design, implements
/swarm-review                  # reviews code
```

## How Handoffs Work

Each command reads the previous artifacts and builds on them. See [handoffs.md](handoffs.md).

## Creating Your Own

See [customization.md](customization.md#adding-a-command).

---

[← Back to README](../README.md)
````

## File: docs/README.md
````markdown
# Documentation

This docs skeleton is based on the Diataxis documentation framework as retrieved from Context7.

## Source of truth

- Framework: Diataxis four-purpose model
- Purposes: tutorials, how-to guides, reference, explanation
- IA rule: keep hierarchy shallow (max two levels under docs/)

## Structure

- tutorials/: learning-oriented, guided paths
- guides/how-to/: task-oriented procedures
- guides/explanation/: concept-oriented reasoning and trade-offs
- reference/: exact facts and reference material
- reference/specification/: specification documents
- architecture/: architecture docs, DDD reference, ADR collection
- development/: development process and implementation guides
- diagrams/: architecture and flow diagrams
- templates/: one template per purpose

## Authoring constraints

1. Each page serves exactly one purpose.
2. Do not mix tutorial/how-to/reference/explanation content in one page.
3. Keep folder depth to docs/<section>/<file>.md.
4. Cross-link related pages instead of mixing content types.
````

## File: docs/reference/README.md
````markdown
# Reference

Reference pages are information-oriented and must be exact, complete, and scannable.

## Include

- Signatures, fields, parameters, limits, defaults
- Request/response shapes or command syntax
- Error codes and edge conditions
- Versioned compatibility notes

## Exclude

- Step-by-step tutorials
- Opinionated implementation stories
- Extended rationale discussions
````

## File: docs/skills.md
````markdown
# Skills

Skills are structured workflows that Claude suggests based on what you're doing.

## How It Works

You don't invoke skills directly. Just describe what you need:

```
"I need to design an API for user management"
```

Claude sees relevant skills suggested (like `designing-apis`) and uses them to give you a better response.

## Available Skills

### Architecture
- `designing-systems` — Planning systems
- `designing-apis` — REST/GraphQL/gRPC
- `domain-driven-design` — Business domain modeling
- `cloud-native-patterns` — Microservices, containers
- `capacity-planning` — Scale and performance
- `writing-adrs` — Architecture Decision Records
- `defense-in-depth` — Layered security architecture

### Engineering
- `implementing-code` — Writing features
- `debugging` — Finding and fixing bugs
- `refactoring-code` — Improving structure
- `optimizing-code` — Performance
- `testing` — Writing tests
- `test-driven-development` — TDD workflow
- `dependency-management` — Package management
- `data-management` — Database design
- `data-to-ui` — JSON to React pipelines

### Product
- `writing-prds` — Product requirements
- `writing-pr-faqs` — Vision documents
- `decomposing-tasks` — Breaking down work
- `execution-roadmaps` — Project planning
- `requirements-analysis` — Clarifying scope
- `documentation` — Technical docs
- `estimating-work` — Effort sizing
- `brainstorming` — Ideation
- `agile-methodology` — Scrum/Kanban
- `context-management` — Onboarding/handoffs
- `reaching-consensus` — Decision facilitation

### Security
- `application-security` — Secure coding
- `threat-modeling` — Identifying threats
- `security-review` — Audits
- `compliance` — Regulatory requirements
- `identity-access` — Auth patterns

### Operations
- `infrastructure` — IaC, cloud setup
- `observability` — Logs, metrics, traces
- `incident-management` — Incident response
- `beads-workflow` — Issue tracking
- `swarm-coordination` — Multi-agent workflows
- `deploy-railway` — Railway deployments
- `deploy-aws-ecs` — ECS/Fargate deployments
- `deploy-cloudflare` — Cloudflare Pages/Workers
- `chaos-engineering` — Resilience testing

### Design
- `interface-design` — UI/UX
- `accessibility` — a11y
- `design-systems` — Component libraries
- `visual-assets` — Icons, images, graphics
- `component-recipes` — Tailwind component patterns
- `demo-design-tokens` — Default design tokens

### Languages & Frameworks
`typescript` · `python` · `go` · `rust` · `swift` · `kotlin` · `bash` · `terraform` · `react-patterns` · `biome` · `hono` · `tailwind-css` · `framer-motion` · `radix-ui` · `vite` · `expo-router` · `expo-sdk` · `react-native-patterns` · `nativewind` · `reanimated`

## What Triggers Skills

Skills activate based on **keywords** in your prompt (`"deploy"`, `"test"`, `"security"`). The skill-activation hook matches keywords defined in `.claude/skills/skill-rules.json`.

## Creating Your Own

See [customization.md](customization.md#adding-a-skill).

---

[← Back to README](../README.md)
````

## File: docs/SOURCE-OF-TRUTH.md
````markdown
# Source of Truth for Documentation Structure

This document defines the only source used for the docs skeleton in this task.

## Context7 source

- Library ID: /anivar/developer-docs-framework
- Framework basis: Diataxis four-purpose model
- IA basis: shallow hierarchy, two-level max recommendation

## Applied structural decisions

1. Top-level quadrants:
   - tutorials/
   - how-to/
   - reference/
   - explanation/
2. One purpose per document.
3. Shallow hierarchy target: docs/<section>/<file>.md.
4. Templates are purpose-specific and separated.

## Notes

- No project-internal content was used to design this skeleton.
- Cross-linking is preferred over mixing content types in one page.
````

## File: docs/swarm.md
````markdown
# Swarm Workers

Lightweight agents that work in parallel. Use them for big tasks.

## Orchestration Commands

| Command | Role | Use |
|---------|------|-----|
| `/swarm-plan` | Planning Orchestrator | Parallel exploration, task decomposition, artifact creation |
| `/swarm-execute` | Execution Orchestrator | Parallel workers, quality gates, git push protocol |
| `/swarm-review` | Adversarial Reviewer | Multi-perspective code review, root cause analysis |
| `/swarm-research` | Research Orchestrator | Deep multi-source investigation, technology evaluation |
| `/code-check` | Codebase Auditor | Holistic codebase audit for SOLID, DRY, consistency, and code health |

### Full Cycle

```
/swarm-plan <feature>  →  /swarm-execute <plan>  →  /swarm-review <branch> (2-3x)  →  PR
```

## Available Workers

| Worker | Model | Best For |
|--------|-------|----------|
| `worker-explorer` | Haiku | Fast codebase search, dependency mapping |
| `worker-builder` | Sonnet | Implementation, testing, refactoring |
| `worker-reviewer` | Opus | Code review, security analysis |
| `worker-researcher` | Sonnet | Quick web research, API docs |
| `worker-research` | Opus | Deep multi-source investigation |
| `worker-architect` | Opus | Complex design decisions, ADRs |

## When to Use

**Good:**
- Searching a large codebase
- Implementing independent features in parallel
- Security scanning all components
- Reviewing multiple files
- Planning complex features with parallel exploration

**Avoid:**
- Sequential tasks with dependencies
- Simple single-file changes

## Swarm Patterns

### Parallel Exploration (via /swarm-plan)
```
Orchestrator spawns 3-6 worker-explorer agents
Each researches different aspects (patterns, deps, constraints, prior art)
Results aggregated into plan artifact
```

### Divide and Conquer (via /swarm-execute)
```
1. worker-architect designs solution
2. Break into independent tasks via Beads
3. Multiple worker-builder agents implement in parallel
4. worker-reviewer validates each
5. Orchestrator integrates
```

### Adversarial Review (via /swarm-review)
```
Parallel reviewers from different perspectives:
- Security (OWASP Top 10)
- Performance (N+1, blocking I/O, algorithms)
- Architecture (SOLID, coupling, cohesion)
- Test coverage
- Code quality
Findings consolidated with severity classification
```

## Coordination

Workers use Beads to avoid conflicts:

```bash
bd create "Implement user service"
bd update <id> --status in_progress  # worker claims
bd close <id> --reason "Done"        # worker completes
bd sync                              # sync with git
```

## Worker Completion

Workers MUST follow the "Landing the Plane" protocol from AGENTS.md. Work is NOT complete until `git push` succeeds.

## Tips

- Use Haiku for read-only tasks (faster, cheaper)
- Max 8 concurrent workers
- Don't have workers spawn workers (single-level only)
- Keep worker prompts under 500 tokens for fast startup

---

[← Back to README](../README.md)
````

## File: docs/templates/explanation.template.md
````markdown
# <Explanation Title>

## Problem

What problem this design addresses.

## Decision

What was chosen.

## Why

Reasoning and trade-offs.

## Alternatives

- <Alternative A>: <why not>
- <Alternative B>: <why not>

## Consequences

- <Positive impact>
- <Known limitation>
````

## File: docs/templates/how-to.template.md
````markdown
# <How-to Title>

## Task

State the task in one line.

## Before you start

- <Precondition>

## Procedure

1. <Action 1>
2. <Action 2>
3. <Action 3>

## Verify

- <Success criteria>

## Related

- Reference: <target>
- Explanation: <target>
````

## File: docs/templates/reference.template.md
````markdown
# <Reference Title>

## Summary

One-line scope statement.

## Specification

| Item | Type | Required | Default | Notes |
|---|---|---|---|---|
| <name> | <type> | <yes/no> | <value> | <note> |

## Errors

| Code | Condition | Resolution |
|---|---|---|
| <code> | <when> | <fix> |

## Compatibility

- <Version and behavior notes>
````

## File: docs/templates/tutorial.template.md
````markdown
# <Tutorial Title>

## Goal

Describe the concrete outcome.

## Prerequisites

- <Requirement 1>
- <Requirement 2>

## Steps

1. <Step 1>
2. <Step 2>
3. <Step 3>

## Validate

- <Expected checkpoint>

## Next

- Related how-to: <target>
- Related reference: <target>
````

## File: docs/tutorials/README.md
````markdown
# Tutorials

Tutorials are learning-oriented and guide a user from zero to a working outcome.

## Include

- Goal and expected outcome
- Prerequisites
- Step-by-step sequence
- Validation checkpoints
- Next steps links

## Exclude

- Full API tables
- Exhaustive option matrices
- Deep conceptual essays
````

## File: knowledge_mddd_architecture.md
````markdown
# Notion + Wiki + NotebookLM × MDDD 架構設計完整總結

## 1. 系統整體定位
本系統是一個 Knowledge Platform（知識平台），目標是建立：
- 知識儲存系統
- 知識關聯圖譜
- AI 知識推理系統
- 文件來源管理
- 搜尋與檢索
- 外部系統同步（Notion 等）

系統本質不是筆記工具，而是 Knowledge Operating System。

整體分層：
- Storage / Management → Notion / Knowledge Domain
- Knowledge Structure → Wiki Domain
- AI Reasoning → Notebook / AI Domain
- Retrieval → Search Domain
- External Sources → Source Domain
- Integration → Sync Domain


## 2. DDD 分層概念
DDD 層級關係：

Domain
 → Subdomain
 → Bounded Context
 → Module
 → Code

Bounded Context = 模型邊界 + 語言邊界  
Module = 程式碼邊界  

一個 Bounded Context 對應一個 module。


## 3. Bounded Context / Modules 切分

modules/
  identity/
  organization/
  workspace/
  knowledge/
  wiki/
  notebook/
  source/
  ai/
  search/
  sync/
  notification/
  shared/


## 4. Domain 類型分類

Core Domain:
- knowledge
- wiki

Supporting Domain:
- notebook
- ai
- search
- source
- sync

Generic Domain:
- identity
- organization
- notification
- workspace


## 5. Module 標準結構

modules/{context}/
  api/
  application/
  domain/
  infrastructure/


domain/
  aggregates/
  entities/
  value-objects/
  repositories/
  domain-services/
  factories/
  events/


## 6. Context 依賴關係圖

Identity → Organization → Workspace
                         ↓
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
     Knowledge        Wiki           Notebook
        ↓               ↓               ↓
      Search            │               AI
        ↓               │               ↑
        └──── Source ───┘
                ↑
               Sync


## 7. Knowledge Domain 設計

Aggregate Roots:
- KnowledgeItem
- KnowledgeCollection
- Tag

Entities:
- Page
- Document
- Note
- Attachment
- Version

Value Objects:
- KnowledgeId
- Title
- Content
- TagId
- AuthorId
- CreatedAt
- VersionNumber

Factories:
- KnowledgeFactory
  - createPage()
  - createNote()
  - createDocument()


## 8. Wiki Domain 設計

Aggregate Roots:
- WikiPage
- WikiGraph

Entities:
- WikiPage
- WikiLink
- Backlink

Value Objects:
- PageId
- LinkType
- RelationType

Factories:
- WikiFactory
  - createWikiPage()
  - createLink()


## 9. Notebook Domain 設計

Aggregate Roots:
- Notebook
- ChatSession
- Summary
- Insight

Value Objects:
- Prompt
- Answer
- Citation
- TokenUsage

Factories:
- NotebookFactory
  - createNotebook()
  - createChatSession()
  - createSummary()


## 10. Source Domain 設計

Aggregate Roots:
- SourceDocument
- SourceCollection

Value Objects:
- FileType
- FileSize
- URL
- Hash
- MimeType


## 11. AI Domain 設計

Aggregate Roots:
- AIQuery
- Embedding
- VectorIndex

Value Objects:
- Prompt
- Model
- Temperature
- TokenCount
- EmbeddingVector


## 12. Search Domain 設計

Aggregate Roots:
- SearchIndex
- SearchQuery
- SearchResult


## 13. Sync Domain 設計（Anti-Corruption Layer）

負責：
- Notion Sync
- Google Docs Sync
- Drive Sync
- Import / Export
- Webhook
- ETL Pipeline

Aggregate Roots:
- SyncJob
- ExternalIntegration
- SyncMapping


## 14. 系統最重要架構規則

1. Module 之間不能直接引用對方 domain
2. 只能透過 module/api 呼叫
3. 每個 Bounded Context 有自己的 Ubiquitous Language
4. Core Domain 不依賴 Supporting Domain
5. 外部系統一定透過 Anti-Corruption Layer
6. Knowledge 是系統核心域
7. Wiki 是 Knowledge Graph
8. Notebook / AI 是推理層
9. Search 是檢索層
10. Source 是文件來源層
11. Sync 是整合層


## 15. 最終整體架構（一句話）

整個系統是一個以 Knowledge 為核心域、Wiki 為知識圖譜、Notebook 與 AI 為推理層、Search 為檢索層、Source 為文件來源、Sync 為外部系統整合層的 Modular Monolith / Microservice 可演進的 MDDD 架構知識平台。
````

## File: PERMISSIONS.md
````markdown
# Permissions

This repository currently documents RBAC and permission-related behavior in the shared system reference instead of a standalone permissions handbook.

## Canonical references

- [`docs/reference/specification/system-overview.md`](docs/reference/specification/system-overview.md) — system-level RBAC overview
- [`docs/guides/how-to/ui-ux/information-architecture.md`](docs/guides/how-to/ui-ux/information-architecture.md) — current permissions-related route surfaces

Update this file if the project later restores a dedicated permissions reference.
````

## File: py_fn/README.md
````markdown
# py_fn 架構規範（路徑級依賴版）

這份規範重點是「看完整路徑判斷依賴」，不是看資料夾名稱。
例如 services 這個名字在 application 和 domain 都存在，但它們是不同層，規則不同。

## 1. 全域依賴方向

```text
interface -> application -> domain
infrastructure -> application -> domain
app -> interface / application / infrastructure / core
core -> all layers
domain -> only core
```

## 2. 目錄基準（含子資料夾）

```text
py_fn/src
├─ app
│  ├─ config
│  ├─ bootstrap
│  ├─ container
│  └─ settings
├─ application
│  ├─ use_cases
│  ├─ dto
│  ├─ services
│  ├─ ports
│  │  ├─ input
│  │  └─ output
│  └─ mappers
├─ domain
│  ├─ entities
│  ├─ value_objects
│  ├─ repositories
│  ├─ services
│  ├─ events
│  └─ exceptions
├─ infrastructure
│  ├─ cache
│  ├─ audit
│  ├─ persistence
│  │  ├─ firestore
│  │  ├─ storage
│  │  └─ vector
│  ├─ external
│  │  ├─ openai
│  │  ├─ genkit
│  │  └─ http
│  ├─ repositories
│  ├─ config
│  └─ logging
├─ interface
│  ├─ controllers
│  ├─ middleware
│  ├─ handlers
│  ├─ schemas
│  └─ routes
└─ core
   ├─ utils
   ├─ types
   ├─ constants
   ├─ exceptions
   └─ security
```

## 3. 各層職責摘要

### app
- 啟動、組裝、注入。
- 這一層可以依賴所有層，但不承載核心業務規則。

### application
- 放 use case、application service、ports、DTO、mappers。
- 負責流程編排，不直接依賴 infrastructure 實作。

### domain
- 放 entities、value objects、repositories 介面、domain services、events、exceptions。
- 是最核心的層，必須保持純淨。

### infrastructure
- 放 Firestore、Storage、Vector、外部 API、repository implementation。
- 只負責技術實作，不主導業務流程。

### interface
- 放 controllers、handlers、routes、schemas、middleware。
- 接外部請求、驗證輸入、呼叫 use case。

### core
- 放所有層可共用的 utils、types、constants、exceptions、security。
- core 本身不依賴任何外層。

## 4.1 值物件與 DTO 規劃

### 應放在 domain/value_objects
- 純資料語意、無基礎設施細節、可被多個 use case 重用。
- 例如：`RagQueryInput`、`RagCitation`、`RagQueryResult`。

### 應放在 application/dto
- 某個 use case 的輸入/輸出模型。
- 例如：`RagIngestionResult` 這種 use case 輸出摘要。

### 不應放進 domain/value_objects
- 外部服務供應商回傳模型。
- 例如：`ParsedDocument` 屬於 Document AI adapter 的回傳型別，保留在 infrastructure/external。

### 目前 py_fn 的落點範例
- `domain/value_objects/rag.py`: `RagQueryInput`, `RagCitation`, `RagQueryResult`
- `domain/repositories/rag.py`: `RagQueryGateway`, `RagIngestionGateway`, `DocumentPipelineGateway`
- `application/dto/rag.py`: `RagIngestionResult`
- `infrastructure/external/documentai/client.py`: `ParsedDocument`

## 4.2 同名資料夾的判讀規則

- services 只看名稱會誤判，必須看完整路徑
       - domain/services 是核心業務規則
       - application/services 是應用層編排
       - infrastructure/services 若存在，只能是技術 adapter；若可拆回更明確目錄，優先拆回 cache / audit / external / persistence
- repositories 也一樣
       - domain/repositories 是介面（contracts）
       - infrastructure/repositories 是實作（implementations）
- config 也一樣
       - app/config 是啟動與組裝配置
       - infrastructure/config 是技術配置
       - core/constants 才是跨層可共用常量

## 5. 路徑級依賴矩陣（最重要）

| From 路徑 | Allowed To Import |
| --- | --- |
| interface/routes | interface/controllers, interface/handlers, core |
| interface/controllers | application/use_cases, application/dto, domain, core |
| interface/handlers | application/use_cases, application/ports/input, core |
| interface/middleware | core |
| interface/schemas | core, 同層 schema 模組 |
| application/use_cases | domain, application/ports/output, application/dto, core |
| application/services | domain, application/ports/output, core |
| application/mappers | application/dto, domain, core |
| application/ports/input | domain, core |
| application/ports/output | domain, core |
| domain/entities | domain/value_objects, core |
| domain/value_objects | core |
| domain/services | domain/entities, domain/value_objects, domain/repositories, core |
| domain/repositories | domain/entities, domain/value_objects, core |
| domain/events | domain/entities, core |
| domain/exceptions | core |
| infrastructure/repositories | domain/repositories, domain/entities, infrastructure/persistence, core |
| infrastructure/cache | infrastructure/external, core |
| infrastructure/audit | infrastructure/external, core |
| infrastructure/persistence | domain/entities, domain/value_objects, core |
| infrastructure/external | application/ports/output, domain, core |
| infrastructure/config | core |
| infrastructure/logging | core |
| app/bootstrap | app/config, app/container, infrastructure, application, interface, core |
| app/container | infrastructure, application, domain, core |
| app/settings | core |
| core/* | 不可依賴任何外層 |

## 6. 明確禁止規則

- domain 不可 import application/interface/infrastructure/app
- application 不可 import infrastructure 實作
- interface 不可直接 import infrastructure（除非經 app 組裝注入後由 application port 提供）
- infrastructure 不可主導業務流程（流程應在 application/use_cases）

## 7. 標準依賴流

```text
route -> controller/handler -> use case -> domain -> repository interface
                                                     ^
                                                     |
                           repository implementation (infrastructure)
```

## 8. import 範例

### interface controller

```python
from application.use_cases.create_user import CreateUserUseCase
from interface.schemas.user_schema import CreateUserRequest
```

### application use case

```python
from domain.repositories.user_repository import UserRepository
from domain.entities.user import User
```

### infrastructure repository implementation

```python
from domain.repositories.user_repository import UserRepository
from infrastructure.persistence.firestore.client import FirestoreClient
```

### app container

```python
from infrastructure.repositories.firestore_user_repository import FirestoreUserRepository
from application.use_cases.create_user import CreateUserUseCase
```

## 9. PR 檢查清單

- 是否用完整路徑判讀層級，而不是只看資料夾名稱
- domain 是否只依賴 core
- use case 是否只依賴抽象（ports/repository interface）
- infrastructure 是否只做技術實作
- app 是否是唯一組裝與注入入口

## 10. 附錄 A：快速記憶版

如果只想快速判斷，先記這張：

```text
Controller/Handler -> UseCase -> Domain -> Repository Interface
                                                                         ^
                                                                         |
                                                   Repository Implementation
                                                                         |
                                                                Database / API
```

對應路徑：

```text
interface/controllers or interface/handlers
application/use_cases
domain/entities or domain/services
domain/repositories
infrastructure/repositories
infrastructure/persistence or infrastructure/external
```

## 11. 附錄 B：高階流程圖

```text
HTTP Request
       -> interface (controller / handler)
       -> application (use case)
       -> domain (entity / service / repository interface)
       -> infrastructure (Firestore / Vector / API implementation)
```

## 12. 附錄 C：典型誤判案例

### services 同名但不同層
- `application/services/*` 可以編排流程，但不應放純領域規則。
- `domain/services/*` 才是純領域規則。

### repositories 同名但不同性質
- `domain/repositories/*` 是介面。
- `infrastructure/repositories/*` 是實作。

### config 同名但職責不同
- `app/config/*` 面向啟動與組裝。
- `infrastructure/config/*` 面向技術設定。
- 可跨層重用的常量優先放 `core/constants/*`。

## 13. 一句話總結

看完整路徑判斷層級，不看資料夾名稱猜責任。
````

## File: SPEC-WORKFLOW.md
````markdown
# Spec-Driven Development Workflow

This repository does not currently keep a standalone long-form spec workflow guide.

## Use these references instead

- [`docs/swarm.md`](docs/swarm.md) — planning, execution, and review flow
- [`docs/handoffs.md`](docs/handoffs.md) — handoff chain between planning, implementation, and review
- [`docs/reference/specification/system-overview.md`](docs/reference/specification/system-overview.md) — baseline product and system specification context

If the team revives a dedicated spec workflow document, update this file to point to that canonical source.
````

## File: .github/README.md
````markdown
# Xuanwu `.github/` Customization Index

This directory contains the repository-local Copilot customization set for Xuanwu App.

## Structure

- [`copilot-instructions.md`](./copilot-instructions.md) — repository-wide Copilot baseline
- [`terminology-glossary.md`](./terminology-glossary.md) — entry point for DDD terminology lookup
- [`agents/`](./agents/) — custom agent definitions plus local knowledge/commands indexes
- [`instructions/`](./instructions/) — `applyTo`-scoped behavioral rules
- [`prompts/`](./prompts/) — reusable task templates
- [`skills/`](./skills/) — installed and repomix-generated skills

## DDD Reference Set

Use `docs/ddd/` as the primary DDD documentation surface:

- [`../docs/ddd/subdomains.md`](../docs/ddd/subdomains.md)
- [`../docs/ddd/bounded-contexts.md`](../docs/ddd/bounded-contexts.md)
- `../docs/ddd/<context>/{README,ubiquitous-language,aggregates,domain-events,context-map,application-services,repositories,domain-services}.md`

## Skill Refresh

Regenerate the checked-in repomix skills with the repository scripts when `.github/*` or docs change materially:

```bash
npm run repomix:skill
npm run repomix:markdown
```

Keep this directory focused on active customizations. Remove stale references, broken links, and unused compatibility notes when the structure changes.
````

## File: docs/ddd/account/AGENT.md
````markdown
# AGENT.md — account BC

## 模組定位

`account` 是 Xuanwu 平台的**帳戶管理**有界上下文，負責用戶 profile 與存取控制政策。在伺服器端消費 `identity/api`。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Account` | User、Profile、Member（在此 BC 內） |
| `AccountPolicy` | Permission、AccessRule、Role（作為存取控制） |
| `customClaims` | Claims、FirebaseClaims |
| `accountId` | userId、uid（在此 BC 之外的引用應使用 accountId） |

## 邊界規則

### ✅ 允許
```typescript
import { accountApi } from "@/modules/account/api";
import type { AccountDTO, AccountPolicyDTO } from "@/modules/account/api";
```

### ❌ 禁止
```typescript
import { Account } from "@/modules/account/domain/entities/Account";
// account use-cases 在 server 端 — 不要在 use-cases 中 import React/client hooks
```

## 關鍵依賴規則

- `modules/account/application/use-cases/account.use-cases.ts` 與 `modules/account/application/use-cases/account-policy.use-cases.ts` 在 server 端執行，可 import `identity/api`
- 不要在 application 層 import 任何含 `"use client"` 的模組

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: docs/ddd/account/context-map.md
````markdown
# Context Map — account

## 上游（依賴）

### identity → account（Customer/Supplier）

- `account` 依賴 `identity/api` 取得 uid 與 TokenRefreshSignal
- `modules/account/application/use-cases/account.use-cases.ts` 在 server 端 import `identity/api`

```
identity/api ──► account/application (server-side use-cases)
```

---

## 下游（被依賴）

### account → organization（Customer/Supplier）

- `organization` 的 `MemberReference` 使用 `accountId` 參照 Account
- Organization 成員列表以 `accountId` 為主鍵

### account → workspace（Customer/Supplier）

- `Workspace.accountId` 關聯帳戶或組織

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| identity → account | identity | account | Customer/Supplier |
| account → organization | account | organization | Customer/Supplier |
| account → workspace | account | workspace | Customer/Supplier |
````

## File: docs/ddd/account/README.md
````markdown
# account — 帳戶上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/account/`  
> **開發狀態:** ✅ Done — 穩定

## 在 Knowledge Platform / Second Brain 中的角色

`account` 承接 `identity` 的已驗證身份，管理個人檔案、偏好設定與帳戶政策，讓平台具備使用者層級的個人化與權限落點。它位於平台基礎層，負責把「登入身份」轉成「可持久化的帳戶語意」。

## 主要職責

| 能力 | 說明 |
|---|---|
| 帳戶設定檔 | 維護顯示名稱、頭像、偏好與其他個人資料 |
| 帳戶政策 | 管理 AccountPolicy、custom claims 與存取控制輔助資訊 |
| 個人化入口 | 為組織、工作區與通知提供使用者側設定基礎 |

## 與其他 Bounded Context 協作

- `identity` 提供身份與 token 上下文。
- `organization`、`workspace` 與 `notification` 以帳戶資料作為使用者語意來源。

## 核心聚合 / 核心概念

- **`Account`**
- **`AccountPolicy`**
- **`AccountProfile`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: docs/ddd/ai/README.md
````markdown
# ai — AI 攝入上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/ai/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`ai` 是 NotebookLM-like 推理能力的攝入協調層，負責把 `source` 交付的來源文件轉成可供 `search` 與 `notebook` 消費的結構化索引材料。它不直接承載使用者問答體驗，而是保證後續推理層有可靠、可追溯的資料基礎。

## 主要職責

| 能力 | 說明 |
|---|---|
| Ingestion Job 管理 | 追蹤 uploaded → parsing → embedding → indexed / failed 狀態生命週期 |
| Worker Handoff | 協調 Next.js 與 `py_fn/` 之間的重型 ingestion 工作交接 |
| Chunk / Index 前處理 | 接收文件切塊與索引前資料，為檢索層準備輸入 |

## 與其他 Bounded Context 協作

- `source` 是上游，提供來源文件與交接事件。
- `search` 消費 `ai` 產生的索引就緒資料；`notebook` 間接建立在這個攝入基礎上。

## 核心聚合 / 核心概念

- **`IngestionJob`**
- **`IngestionDocument`**
- **`IngestionChunk`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: docs/ddd/identity/AGENT.md
````markdown
# AGENT.md — identity BC

## 模組定位

`identity` 是 Firebase Authentication 的 domain 薄層封裝。無業務邏輯，只有驗證基礎設施抽象。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Identity` | User、CurrentUser、AuthUser |
| `TokenRefreshSignal` | TokenEvent、RefreshToken |
| `signIn` | login、authenticate |
| `signOut` | logout |
| `uid` | userId、id（在此 BC 內） |

## 邊界規則

### ✅ 允許
```typescript
import { identityApi } from "@/modules/identity/api";
import type { IdentityDTO } from "@/modules/identity/api";
```

### ❌ 禁止
```typescript
import { useTokenRefreshListener } from "@/modules/identity/interfaces/hooks/useTokenRefreshListener";
// ❌ api/ 不能含 "use client" 匯出 — account use-cases 在 server 端 import api/
```

## 關鍵守衛

- `modules/identity/api/index.ts` 不得 re-export 任何含 `"use client"` 的檔案
- hooks（`useTokenRefreshListener`）只能從 interfaces 層使用，不可進入 api barrel

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: docs/ddd/identity/README.md
````markdown
# identity — 身份驗證上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/identity/`  
> **開發狀態:** ✅ Done — 穩定

## 在 Knowledge Platform / Second Brain 中的角色

`identity` 是整個平台的身份入口，封裝 Firebase Authentication 與 session 起點。它對產品價值並不差異化，但所有工作區、知識與 AI 互動都建立在正確的身份語意之上。

## 主要職責

| 能力 | 說明 |
|---|---|
| 登入 / 登出 | 處理 signIn、signOut 與身份狀態切換 |
| Token 生命週期 | 管理 token refresh 與相關身份訊號 |
| 身份上下文供應 | 向 `account`、`organization`、`workspace` 提供穩定的身份讀取入口 |

## 與其他 Bounded Context 協作

- `account` 直接消費 `identity/api` 提供的身份上下文。
- `organization` 與 `workspace` 依賴身份語意建立成員與存取規則。

## 核心聚合 / 核心概念

- **`Identity`**
- **`AuthenticatedUser`**
- **`TokenRefreshSignal`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: docs/ddd/knowledge/AGENT.md
````markdown
# AGENT.md — knowledge BC

## 模組定位

`knowledge` 是 Core Domain，管理 KnowledgePage 的完整生命週期。`knowledge.page_approved` 是平台的核心整合事件，觸發 workspace-flow 物化流程。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `KnowledgePage` | Page、Document |
| `ContentBlock` | Block、Node、Element |
| `ContentVersion` | Version、Snapshot、History |
| `BlockType` | Type、ContentType |

> `WikiPage` 為 `wiki` BC 的術語；`knowledge` BC 不使用 `WikiPage` 作為通用語言。

## 邊界規則

### ✅ 允許
```typescript
import { knowledgeApi } from "@/modules/knowledge/api";
import type { KnowledgePageDTO, ContentBlockDTO } from "@/modules/knowledge/api";
```

### ❌ 禁止
```typescript
import { ContentPage } from "@/modules/knowledge/domain/entities/content-page.entity";
import { KnowledgePageCreatedEvent } from "@/modules/knowledge/domain/events/knowledge.events";
import type { WikiPage } from "@/modules/wiki/domain/entities/...";
```

## page_approved 事件規則

`knowledge.page_approved` 必須包含：
- `extractedTasks[]` — 供 workspace-flow 建立 Task
- `extractedInvoices[]` — 供 workspace-flow 建立 Invoice
- `actorId`, `causationId`, `correlationId` — 追蹤鏈

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: docs/ddd/knowledge/aggregates.md
````markdown
# Aggregates — knowledge

## 聚合根：KnowledgePage（ContentPage）

### 職責
核心知識單元的聚合根。管理頁面標題、父子層級關係（parentPageId）、區塊引用列表（blockIds）及審批狀態。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 頁面主鍵 |
| `title` | `string` | 頁面標題 |
| `slug` | `string` | URL-safe 識別符 |
| `parentPageId` | `string \| null` | 父頁面 ID（樹狀層級） |
| `blockIds` | `string[]` | 關聯的 ContentBlock ID 列表 |
| `accountId` | `string` | 所屬帳戶 |
| `workspaceId` | `string?` | 所屬工作區（可選） |
| `status` | `KnowledgePageStatus` | `active \| archived` |
| `approvalState` | `KnowledgePageApprovalState?` | `pending \| approved`（AI 生成草稿使用） |
| `createdByUserId` | `string` | 建立者 ID |
| `createdAtISO` | `string` | ISO 8601 建立時間 |
| `updatedAtISO` | `string` | ISO 8601 更新時間 |

### 不變數

- `slug` 在同一 accountId 下必須唯一
- archived 頁面不可新增 ContentBlock

---

## 實體：ContentBlock（KnowledgeBlock）

### 職責
頁面內的原子內容單元，有序排列形成頁面內容。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 區塊主鍵 |
| `pageId` | `string` | 所屬頁面 ID |
| `accountId` | `string` | 所屬帳戶 |
| `content` | `BlockContent` | 型別化內容（含 `type: BlockType` 欄位） |
| `order` | `number` | 排列順序 |
| `createdAtISO` | `string` | ISO 8601 |
| `updatedAtISO` | `string` | ISO 8601 |

> `BlockContent.type` 為 `BlockType`（`text \| heading-1 \| heading-2 \| heading-3 \| image \| code \| bullet-list \| numbered-list \| divider \| quote`）。
> 代碼位置：`domain/value-objects/block-content.ts`

---

## 實體：ContentVersion（KnowledgeVersion）

### 職責
頁面的歷史版本快照，append-only。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 版本主鍵 |
| `pageId` | `string` | 所屬頁面 |
| `accountId` | `string` | 所屬帳戶 |
| `label` | `string` | 版本標籤（人類可讀描述） |
| `titleSnapshot` | `string` | 版本建立時的頁面標題快照 |
| `blocks` | `KnowledgeVersionBlock[]` | 版本時間點的區塊快照列表 |
| `createdByUserId` | `string` | 建立者帳戶 ID |
| `createdAtISO` | `string` | ISO 8601 |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `KnowledgePageRepository` | `create()`, `rename()`, `move()`, `archive()`, `approve()`, `findById()`, `listByAccountId()`, `listByWorkspaceId()` |
| `KnowledgeBlockRepository` | `add()`, `update()`, `delete()`, `findById()`, `listByPageId()` |
| `KnowledgeVersionRepository` | `create()`, `findById()`, `listByPageId()` |
| `WikiPageRepository` | `listByAccountId()`, `findById()`, `create()`, `update()` |
````

## File: docs/ddd/knowledge/README.md
````markdown
# knowledge — 知識內容上下文

> **Domain Type:** **Core Domain**（核心域）  
> **模組路徑:** `modules/knowledge/`  
> **開發狀態:** 🚧 Developing — 積極開發中

## 在 Knowledge Platform / Second Brain 中的角色

`knowledge` 是 Xuanwu 的 Notion-like 核心內容層，負責知識頁面、內容區塊、版本與審批生命週期。它是整個 Knowledge Platform / Second Brain 的中心，決定知識如何被建立、保存、演進與交付給下游協作。

## 主要職責

| 能力 | 說明 |
|---|---|
| Knowledge Page 生命週期 | 建立、編輯、版本化、歸檔與審批知識頁面 |
| 內容區塊管理 | 維護文字、標題、媒體、列表等內容區塊結構 |
| 審批後協作啟動 | 發出 `knowledge.page_approved` 等事件，驅動後續工作流程與知識流轉 |

## 與其他 Bounded Context 協作

- `workspace` 提供知識內容的歸屬容器；`source` 提供外部文件入口。
- `wiki` 把知識內容轉成結構化圖譜；`workspace-flow` 以審批事件物化任務與發票。
- `search` 與 `notebook` 消費知識內容做檢索、摘要與問答。

## 核心聚合 / 核心概念

- **`KnowledgePage`**
- **`ContentBlock`**
- **`ContentVersion`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: docs/ddd/knowledge/ubiquitous-language.md
````markdown
# Ubiquitous Language — knowledge

> **範圍：** 僅限 `modules/knowledge/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 | 代碼位置 |
|------|------|------|---------|
| 知識頁面 | KnowledgePage | 核心知識單元，含 title、parentPageId、blockIds | `domain/entities/content-page.entity.ts` |
| 內容區塊 | ContentBlock | 頁面內的原子內容單元（id、pageId、blockType、content、order） | `domain/entities/content-block.entity.ts` |
| 區塊類型 | BlockType | `text \| heading-1 \| heading-2 \| image \| code \| bullet-list \| ...` | `domain/entities/block.ts` |
| 版本快照 | ContentVersion | 頁面的歷史快照（snapshotBlocks、editSummary、authorId） | `domain/entities/content-version.entity.ts` |
| 頁面審批 | PageApproval | 使用者核准 AI 生成草稿的動作，觸發 `knowledge.page_approved` | — |
| 抽取任務 | ExtractedTask | 從頁面內容提取的任務定義（title、dueDate、description） | `domain/events/knowledge.events.ts` |
| 抽取發票 | ExtractedInvoice | 從頁面內容提取的發票定義（amount、description、currency） | `domain/events/knowledge.events.ts` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `KnowledgePage` | `Page`, `Document`, `Note` |
| `ContentBlock` | `Block`, `Node`, `Element` |
| `ContentVersion` | `History`, `Snapshot`, `Revision` |

> `WikiPage` 為 `wiki` BC 術語，不屬於 `knowledge` BC 通用語言。
````

## File: docs/ddd/notebook/context-map.md
````markdown
# Context Map — notebook

## 上游（依賴）

### search → notebook（Customer/Supplier）

- `notebook` 呼叫 `search/api` 取得語意相關 chunks（RAG retrieval）
- 用於 RAG-augmented 對話生成

### wiki → notebook（Customer/Supplier）

- `notebook` 可查詢 `wiki/api` 取得知識圖譜上下文（未來支援圖譜推理）

---

## 下游（被依賴）

### notebook → app/(shell)/ai-chat（Interfaces）

- AI Chat 頁面透過本地 `app/(shell)/ai-chat/_actions.ts` 呼叫 `notebook/api`
- **注意**：`notebook/api` barrel 不得在 Client Component 中直接 import（Genkit server-only）

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| search → notebook | search | notebook | Customer/Supplier（同步查詢） |
| wiki → notebook | wiki | notebook | Customer/Supplier（同步查詢） |
| notebook → AI Chat UI | notebook | app/ | Anti-Corruption Layer（`app/(shell)/ai-chat/_actions.ts`） |
````

## File: docs/ddd/notebook/README.md
````markdown
# notebook — Notebook 對話上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/notebook/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`notebook` 是 Xuanwu 的 NotebookLM-like 互動層，將檢索結果、知識內容與圖譜脈絡轉成對話、摘要、洞察與可引用回答。它是最接近使用者 AI 推理體驗的上下文。

## 主要職責

| 能力 | 說明 |
|---|---|
| 對話 Thread 管理 | 維護對話串與訊息歷史 |
| 摘要 / 問答互動 | 把檢索結果轉成可閱讀、可追問的回答 |
| 引用式輸出 | 保留 citation / source trace，支撐可信回答 |

## 與其他 Bounded Context 協作

- `search` 是主要上游，提供語意檢索與引用資料。
- `knowledge` 與 `wiki` 提供被推理的內容與結構脈絡；`ai` 提供底層攝入能力。

## 核心聚合 / 核心概念

- **`Thread`**
- **`Message`**
- **`Summary`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: docs/ddd/notification/README.md
````markdown
# notification — 通知上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/notification/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`notification` 提供跨平台的通知分發能力，將知識、工作流程與工作區互動轉成使用者可感知的訊息。它是典型平台配套能力，但對協作效率與回應速度很重要。

## 主要職責

| 能力 | 說明 |
|---|---|
| 通知分發 | 發送 info / alert / success / warning 等系統訊息 |
| 事件轉訊息 | 把其他上下文的事件轉成使用者可消費的通知 |
| 通知偏好支撐 | 配合 `account` 與 `workspace` 的偏好設定輸出通知行為 |

## 與其他 Bounded Context 協作

- `workspace-feed`、`workspace-flow`、`workspace` 等上下文會觸發通知需求。
- `account` 提供使用者偏好與收件對象語意。

## 核心聚合 / 核心概念

- **`NotificationEntity`**
- **`NotificationPayload`**
- **`NotificationPreference`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: docs/ddd/organization/README.md
````markdown
# organization — 組織上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/organization/`  
> **開發狀態:** ✅ Done — 穩定

## 在 Knowledge Platform / Second Brain 中的角色

`organization` 是平台多租戶治理層，負責定義團隊、成員與組織級關係。它把個人帳戶提升到群體協作層，為工作區與知識協作提供治理邊界。

## 主要職責

| 能力 | 說明 |
|---|---|
| 組織管理 | 建立與維護 Organization 聚合 |
| 成員與團隊治理 | 管理 MemberReference、Team 與組織內角色 |
| 邀請與夥伴協作 | 處理 PartnerInvite 與跨組織協作入口 |

## 與其他 Bounded Context 協作

- `account` 提供個人帳戶語意；`workspace` 以組織為主要歸屬邊界。
- `workspace-audit` 與 `notification` 會消費組織事件或範圍資訊。

## 核心聚合 / 核心概念

- **`Organization`**
- **`MemberReference`**
- **`Team`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: docs/ddd/search/README.md
````markdown
# search — 語意檢索上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/search/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`search` 是 NotebookLM-like 推理層的檢索核心，負責從向量索引與知識內容中擷取最相關的引用材料，為摘要、問答與洞察建立可追溯的語意上下文。

## 主要職責

| 能力 | 說明 |
|---|---|
| 向量檢索 | 執行語意相似度搜尋與結果排序 |
| RAG Answer 組合 | 組合 retrieved chunks、引用與答案內容 |
| 反饋收集 | 記錄 RagQueryFeedback 以改進檢索品質 |

## 與其他 Bounded Context 協作

- `ai` 提供索引就緒資料；`notebook` 是主要消費者。
- `knowledge` 與 `wiki` 提供被檢索的知識主體與結構資訊。

## 核心聚合 / 核心概念

- **`RagQuery`**
- **`RagQueryFeedback`**
- **`VectorStore`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: docs/ddd/shared/aggregates.md
````markdown
# Aggregates — shared

## 注意

`shared` 是 Shared Kernel，不包含業務聚合根。它只提供基礎型別定義。

---

## 基礎介面：DomainEvent

```typescript
// modules/shared/domain/events.ts
interface DomainEvent {
  readonly type: string;       // discriminant: "module.action"
  readonly occurredAt: string; // ISO 8601 — 不是 Date，不是 occurredAtISO
}
```

**所有模組的領域事件介面都繼承此基礎介面。**

---

## 基礎介面：EventRecord

```typescript
// modules/shared/domain/event-record.ts
interface EventRecord {
  readonly eventId: string;    // UUID v4
  readonly occurredAt: string; // ISO 8601
  readonly actorId?: string;   // 操作者 ID（可選）
  readonly correlationId?: string;
  readonly causationId?: string;
}
```

---

## 工具型別

| 型別 / 工具 | 說明 |
|------------|------|
| `ID` | string alias，用於所有業務 ID |
| `Timestamp` | Firebase Timestamp 型別別名 |
| `domain/slug-utils.ts` | URL-safe slug 生成（`toSlug()`, `isValidSlug()`） |
````

## File: docs/ddd/shared/README.md
````markdown
# shared — 共享核心上下文

> **Domain Type:** Shared Kernel  
> **模組路徑:** `modules/shared/`  
> **開發狀態:** ✅ Done — 穩定

## 在 Knowledge Platform / Second Brain 中的角色

`shared` 不是獨立業務能力，而是多個 bounded context 共同依賴的 Shared Kernel。它提供穩定共享的事件、值物件與工具型別，目標是減少重複而不形成隱性大泥球。

## 主要職責

| 能力 | 說明 |
|---|---|
| 共享型別 | 提供跨模組穩定共用的事件與值物件基礎型別 |
| 事件基礎語意 | 維持 `DomainEvent`、`EventRecord` 等跨域契約一致 |
| 工具與通用值物件 | 提供 slug、識別碼與其他低變動共享能力 |

## 與其他 Bounded Context 協作

- 所有上下文都可能依賴 `shared`，但只能消費穩定共享核心，不能把業務邏輯堆入此模組。
- `shared` 的變更需視為跨域契約變更處理。

## 核心聚合 / 核心概念

- **`DomainEvent`**
- **`EventRecord`**
- **`SlugUtils`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: docs/ddd/source/README.md
````markdown
# source — 文件來源上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/source/`  
> **開發狀態:** 🚧 Developing

## 在 Knowledge Platform / Second Brain 中的角色

`source` 是 Knowledge Platform 的文件入口，承接 Notion-like 內容系統之外的外部文件、附件與來源治理。它負責讓知識進入平台，並安全地交給 `ai` 攝入管線處理。

## 主要職責

| 能力 | 說明 |
|---|---|
| 來源文件生命週期 | 管理上傳初始化、上傳完成、版本快照與保留政策 |
| 來源集合管理 | 維護文件集合、library 與 workspace 範圍的來源視圖 |
| 攝入交接 | 把已完成上傳的來源資料交付 `ai` 進入攝入流程 |

## 與其他 Bounded Context 協作

- `workspace` 提供來源文件的歸屬邊界；`knowledge` 可能引用或轉寫來源內容。
- `ai` 接收來源文件並建立 ingestion job；`wiki` 與 `search` 最終消費來源衍生的結構與索引。

## 核心聚合 / 核心概念

- **`SourceDocument`**
- **`SourceCollection`**
- **`WikiLibrary`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: docs/ddd/wiki/aggregates.md
````markdown
# Aggregates — wiki

## 聚合根：GraphNode

### 職責
代表知識圖譜中的一個知識節點。管理節點的生命週期（draft → active → archived）與關聯邊列表。

### 生命週期狀態機
```
draft ──[activate]──► active ──[archive]──► archived
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 節點主鍵（對應 knowledge.KnowledgePage.id） |
| `title` | `string` | 節點標題 |
| `nodeType` | `NodeType` | 節點語意類型 |
| `status` | `NodeStatus` | `draft \| active \| archived` |
| `workspaceId` | `string?` | 所屬工作區（workspace BC 整合完成前為 optional） |
| `organizationId` | `string?` | 所屬組織（workspace BC 整合完成前為 optional） |
| `outboundEdgeIds` | `string[]?` | 出向邊 ID 列表（workspace BC 整合完成前為 optional） |

### 不變數

- archived 節點不可建立新 GraphEdge
- `id` 與 `knowledge.KnowledgePage.id` 一一對應

---

## 聚合根：GraphEdge

### 職責
代表兩個 GraphNode 之間的有向關係。管理邊的生命週期（pending → active → inactive → removed）。

### 生命週期狀態機
```
pending ──[activate]──► active ──[deactivate]──► inactive ──[remove]──► removed
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 邊主鍵 |
| `sourceNodeId` | `string` | 起點節點 ID |
| `targetNodeId` | `string` | 終點節點 ID |
| `edgeType` | `EdgeType` | 關係語意類型 |
| `status` | `EdgeStatus` | `pending \| active \| inactive \| removed` |
| `createdByUserId` | `string?` | 建立者 ID（系統自動建立時為 undefined） |

### 不變數

- sourceNodeId 與 targetNodeId 必須是有效的 GraphNode
- removed 的邊不可恢復

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `GraphRepository` | `saveNode()`, `saveEdge()`, `findNodeById()`, `findEdgesByTarget()`, `findEdgesBySource()`, `findEdgesByType()`, `listNodes()`, `listEdges()` |
````

## File: docs/ddd/wiki/README.md
````markdown
# wiki — 知識圖譜上下文

> **Domain Type:** **Core Domain**（核心域）  
> **模組路徑:** `modules/wiki/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`wiki` 是 Xuanwu 的 Wiki-like 結構層，負責把知識內容變成可連結、可遍歷、可回溯的節點與關聯網路。它與 `knowledge` 一起形成產品最核心的差異化價值。

## 主要職責

| 能力 | 說明 |
|---|---|
| Graph Node 管理 | 維護知識節點的生命週期與可見性 |
| Graph Edge 管理 | 維護節點之間的關聯、Backlink 與關係狀態 |
| 結構化知識導航 | 支撐圖譜遍歷、自動連結與知識關聯理解 |

## 與其他 Bounded Context 協作

- `knowledge` 提供被結構化的核心內容。
- `search` 與 `notebook` 消費圖譜脈絡做檢索與推理；`workspace` 提供圖譜的協作歸屬。

## 核心聚合 / 核心概念

- **`GraphNode`**
- **`GraphEdge`**
- **`WikiPage`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: docs/ddd/workspace-audit/README.md
````markdown
# workspace-audit — 工作區稽核上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/workspace-audit/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`workspace-audit` 是工作區治理的追溯層，透過 append-only 稽核紀錄保存重要操作的事後可查性。它不是直接創造知識價值的核心域，但對信任、治理與合規至關重要。

## 主要職責

| 能力 | 說明 |
|---|---|
| 稽核寫入 | 接收重要行為或事件並追加紀錄 |
| 稽核查詢 | 依工作區或組織範圍提供可查詢的 audit trail |
| 治理可見性 | 支援事後追查、責任歸屬與決策證據 |

## 與其他 Bounded Context 協作

- `workspace` 與 `organization` 提供查詢與可見性範圍。
- `workspace-flow`、`workspace-feed` 與其他上下文可作為稽核事件來源。

## 核心聚合 / 核心概念

- **`AuditLog`**
- **`AuditActor`**
- **`AuditScope`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: docs/ddd/workspace-feed/README.md
````markdown
# workspace-feed — 工作區動態上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/workspace-feed/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`workspace-feed` 是工作區的動態流與互動層，把知識、任務與協作事件轉成團隊可感知的貼文、回覆與互動紀錄。它提升知識平台的協作流動性與可見性。

## 主要職責

| 能力 | 說明 |
|---|---|
| 動態貼文 | 管理 post / reply / repost 等工作區動態內容 |
| 互動紀錄 | 記錄 like / view / bookmark / share 等互動 |
| 事件可見化 | 把協作行為轉成工作區成員可追蹤的活動流 |

## 與其他 Bounded Context 協作

- `workspace` 提供動態的歸屬邊界。
- `workspace-flow`、`knowledge`、`notification` 可與動態流形成聯動。

## 核心聚合 / 核心概念

- **`WorkspaceFeedPost`**
- **`FeedReaction`**
- **`FeedThread`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: docs/ddd/workspace-flow/README.md
````markdown
# workspace-flow — 工作流程上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/workspace-flow/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`workspace-flow` 把知識內容轉成可執行的業務流程，負責 Task、Issue、Invoice 三條工作線的狀態機與政策。它是知識平台從「記錄知識」走向「驅動執行」的主要協作引擎。

## 主要職責

| 能力 | 說明 |
|---|---|
| Task / Issue / Invoice 狀態機 | 管理主要工作流程聚合與轉換規則 |
| 物化流程 | 消費 `knowledge.page_approved` 等事件建立可執行項目 |
| 業務守衛 | 封裝狀態轉換、角色限制與流程政策 |

## 與其他 Bounded Context 協作

- `knowledge` 是最重要上游，提供審批後的內容事件。
- `workspace` 提供流程歸屬；`workspace-audit` 與 `workspace-feed` 消費流程結果或事件。

## 核心聚合 / 核心概念

- **`Task`**
- **`Issue`**
- **`Invoice`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: docs/ddd/workspace-scheduling/README.md
````markdown
# workspace-scheduling — 工作區排程上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/workspace-scheduling/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`workspace-scheduling` 讓知識與流程成果進一步進入時間與容量管理，將工作需求落入日曆、截止與排程視角。它支援團隊把抽象工作轉成可安排的協作負載。

## 主要職責

| 能力 | 說明 |
|---|---|
| 需求排程 | 建立與管理 WorkDemand 的狀態生命週期 |
| 時間視圖 | 提供日曆、截止與安排視角 |
| 容量協調 | 讓工作需求能與流程與工作區情境一起被安排 |

## 與其他 Bounded Context 協作

- `workspace-flow` 可作為排程需求來源。
- `workspace` 提供排程歸屬與成員範圍。

## 核心聚合 / 核心概念

- **`WorkDemand`**
- **`ScheduleWindow`**
- **`CapacityAllocation`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: docs/ddd/workspace/AGENT.md
````markdown
# AGENT.md — workspace BC

## 模組定位

`workspace` 是協作容器有界上下文，負責工作區生命週期、成員管理與 Wiki 內容樹。在 WorkspaceDetailScreen 中組合多個 workspace-* 子模組的 UI tab。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Workspace` | Project、Space、Room |
| `WorkspaceMember` | Member、Participant |
| `WikiContentTree` | PageTree、ContentHierarchy |
| `workspaceId` | projectId、spaceId |
| `accountId` | ownerId（在 Workspace 上下文中） |

## 邊界規則

### ✅ 允許
```typescript
import { workspaceApi } from "@/modules/workspace/api";
import type { WorkspaceDTO } from "@/modules/workspace/api";
```

### ❌ 禁止
```typescript
// workspace/infrastructure 禁止 import workspace/api（循環依賴）
import { workspaceApi } from "@/modules/workspace/api"; // 在 infrastructure 層
```

## 循環依賴守衛

`FirebaseWikiWorkspaceRepository` 使用相對路徑 import `FirebaseWorkspaceRepository`，絕對不能改為 `@/modules/workspace/api`。

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: docs/development/modules-implementation-guide.md
````markdown
# Modules Implementation Guide

本文件是 `modules/` 的實作導向說明，並對齊上位概念架構文件的設計方向。

- 上位概念架構文件：回答「為什麼」與「系統如何分層」。
- 本文件：回答「在 repository 內如何落地」。

---

## 1. 與概念架構文件的對位關係

上位概念架構文件定義三層融合：

1. Content / UI Layer
2. Knowledge Graph Layer
3. AI / RAG Layer

在本專案中的實作對位：

| 概念層（Architecture） | 主要承載位置（Implementation） | 說明 |
| --- | --- | --- |
| Content / UI Layer | `app/` + `modules/*/interfaces` | App Router、頁面組裝、互動入口 |
| Knowledge Graph Layer | `modules/knowledge`, `modules/wiki`, `modules/search` | 知識節點、連結、索引、檢索 |
| AI Layer | `modules/notebook` + `modules/search` + `py_fn/` | Orchestration、RAG query、向量處理與背景作業 |

> 原則：概念融合不代表模組耦合。融合在「體驗層」，隔離在「模組邊界」。

---

## 2. module 標準結構（MDDD）

```text
<domain-id>/
│
├── api/
│   └── index.ts
│
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── repositories/
│   ├── services/
│   └── events/
│
├── application/
│   ├── use-cases/
│   └── dto/
│
├── infrastructure/
│   ├── firebase/
│   ├── persistence/
│   ├── external/
│   └── repositories/
│
├── interfaces/
│   ├── _actions/
│   ├── api/
│   ├── queries/
│   ├── hooks/
│   └── components/
│
```

說明：

1. 不是每個 module 都需要全部子目錄，依 bounded context 取用。
2. 跨 module 存取僅能走目標 module 的 `api/` 公開邊界。
3. module 內部檔案使用相對路徑，不自我 import `api/` 邊界。

---

## 3. 依賴方向與邊界

全域依賴方向：

```text
interfaces -> application -> domain <- infrastructure
```

邊界規則：

1. `domain/` 不得依賴 framework 與外部 SDK。
2. `application/` 負責流程編排，不直接綁定具體外部實作。
3. `infrastructure/` 實作 domain 介面，不主導業務流程。
4. `interfaces/` 僅做輸入輸出適配（UI、API、Server Action、Query）。

---

## 4. 與 packages 的關係

模組共用能力必須透過 `packages/` 的 alias（例如 `@shared-types`, `@integration-firebase`, `@ui-shadcn`）使用，不直接耦合其他模組內部。

```text
modules/*
  -> packages/* (stable public boundary)
```

這個原則與上位概念架構文件的三層融合不衝突：

- 融合的是產品能力（編輯 + 關聯 + AI）
- 隔離的是程式邊界（module `api/` boundary + package boundary）

---

## 5. Next.js 路由與融合介面

上位概念架構文件的基礎平行路由示意：

```text
/workspace
    /@editor
    /@graph
    /@chat
    /@database
```

實作可依需求擴充，例如：

```text
/workspace
    /@editor
    /@graph
    /@chat
    /@database
    /@collab
    /@workflow
```

擴充原則：

1. 新 slot 必須能回對到既有 module ownership。
2. 不因 UI slot 增加而破壞 MDDD 依賴方向。

---

## 6. 目標對齊聲明

本文件以上位概念架構文件為基礎，並將其轉換為可執行的 module implementation 規範：

1. 保留內容體驗、知識關聯與 AI 能力的融合方向。
2. 明確化「融合體驗」與「邊界隔離」可同時成立。
3. 用 MDDD 與 package boundary 落地，避免跨模組內部耦合。

---

## 7. 以上位概念架構文件為準的落地限制

上位概念架構文件提供的是概念模型，不是額外的 canonical module map、固定領域數量或一次性規劃清單。

因此本文件只保留與概念模型一致的落地限制：

1. Notion 對應的是內容編輯與資料庫體驗，不等於整個知識域或單一模組。
2. Wiki 對應的是 Page 與 Link 所形成的知識關聯視角，不等於所有內容都應集中在同一模組。
3. NotebookLM 對應的是文件理解、檢索、問答與推理能力，不等於所有 AI 邏輯都可以脫離既有 runtime boundary。
4. 三層融合描述的是產品體驗，不直接推導出固定的模組數量、模組命名或跨模組 ownership。

## 8. 實作規劃時的最小檢查點

若要把三層模型落到實際模組，至少先確認：

1. 需求是在補強 Content / UI、Knowledge Graph、還是 AI / RAG 哪一層。
2. 新能力的 owner 是否已存在於目前 module inventory；若不存在，再依 MDDD 原則判斷是否需要新 bounded context。
3. 跨模組互動是否只經過目標模組的 `api/` 邊界。
4. UI 組裝、知識關聯、AI orchestration 是否仍維持 `interfaces -> application -> domain <- infrastructure`。
5. 若文件只是概念說明，不額外發明上位概念架構文件未定義的 canonical schema、固定規劃數量或模組對照表。
````

## File: docs/guides/how-to/ui-ux/component-patterns.md
````markdown
# UI 元件模式（Component Patterns）

> **參考文件類型**：本文件定義 Xuanwu App 中 UI 元件的使用規範、組合模式與常見陷阱。
> 元件實作以 **shadcn/ui** 為基礎，Lucide React 提供圖示。

---

## 1. 元件架構原則

### 1.1 元件分類

| 類型 | 分層 | 說明 |
|---|---|---|
| **基礎元件（Primitive）** | UI 元件庫層 | shadcn/ui 提供；不修改來源 |
| **功能元件（Feature）** | 模組介面層 | 業務功能元件；含狀態與資料 |
| **Shell 元件（Layout）** | 應用外殼層 | 版型元件；App Rail、Sidebar 等 |
| **頁面元件（Page）** | 頁面協調層 | 薄協調層；只組裝元件 |

### 1.2 Server vs Client 元件選擇

| 情況 | 選擇 |
|---|---|
| 靜態渲染、無互動 | `Server Component`（預設） |
| 需要 `useState`、`useEffect`、事件處理 | `'use client'` |
| 需要 Firestore `onSnapshot` 即時訂閱 | `'use client'` |
| 需要 `useRouter`、`useSearchParams` | `'use client'` |

---

## 2. 常用元件模式

### 2.1 卡片容器模式（Card Pattern）

用於包裝獨立功能區塊（上傳區、查詢區、結果區）。

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@ui-shadcn/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Upload File</CardTitle>
  </CardHeader>
  <CardContent>
    {/* 內容 */}
  </CardContent>
</Card>
```

**使用時機**：
- 功能明確邊界的操作區塊
- 統計摘要卡片
- 設定區塊

### 2.2 操作按鈕模式（Action Button Pattern）

主要操作（Primary Action）按鈕的標準 loading 狀態處理：

```tsx
import { Button } from "@ui-shadcn/ui/button";
import { Loader2 } from "lucide-react";

<Button
  onClick={handleAction}
  disabled={isLoading || !canSubmit}
>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 size-4 animate-spin" />
      上傳中...
    </>
  ) : (
    "上傳並啟動解析 ↑"
  )}
</Button>
```

**規則**：
- loading 時必須同時 `disabled` 防止重複提交。
- loading 文字以進行式動詞結尾（「上傳中...」而非「上傳」）。
- disabled（非 loading）時加 Tooltip 說明原因。

### 2.3 骨架屏模式（Skeleton Pattern）

資料載入時的占位元件：

```tsx
import { Skeleton } from "@ui-shadcn/ui/skeleton";

// 列表骨架屏
{isLoading ? (
  <div className="space-y-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
) : (
  <DataTable data={data} />
)}
```

### 2.4 空狀態模式（Empty State Pattern）

```tsx
{data.length === 0 && (
  <div className="flex flex-col items-center gap-4 py-16 text-center">
    <FileX className="size-12 text-muted-foreground" />
    <div>
      <p className="font-semibold">目前還沒有文件</p>
      <p className="text-sm text-muted-foreground">
        試著上傳第一份檔案。
      </p>
    </div>
    <Button variant="outline" onClick={scrollToUpload}>
      前往上傳
    </Button>
  </div>
)}
```

### 2.5 Toast 通知模式

```tsx
import { toast } from "sonner";

// 成功
toast.success("已觸發重整，稍後觀察 rag status 更新");

// 失敗（含原因）
toast.error(`上傳失敗：${error.message}`);

// 背景任務提示
toast.info("正在處理中，請稍候…");
```

**注意**：`<Toaster />` 已由全域 Provider 掛載，無需重複掛載。

### 2.6 Dropdown 選單模式

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui-shadcn/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="sm" aria-label="更多操作">
      <MoreHorizontal className="size-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={handleEdit}>編輯</DropdownMenuItem>
    <DropdownMenuItem
      className="text-destructive"
      onClick={handleDelete}
    >
      刪除
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### 2.7 狀態徽章模式（Status Badge Pattern）

```tsx
import { Badge } from "@ui-shadcn/ui/badge";

function StatusBadge({ status }: { status: "ready" | "processing" | "error" | "pending" }) {
  const map = {
    ready:      { label: "✓ ready",       variant: "success" },
    processing: { label: "⏳ processing",  variant: "secondary" },
    error:      { label: "✗ error",        variant: "destructive" },
    pending:    { label: "— pending",      variant: "outline" },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant as never}>{label}</Badge>;
}
```

**規則**：狀態徽章必須同時包含圖示與文字（不可只用顏色）。

### 2.8 Tooltip 模式

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui-shadcn/ui/tooltip";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button disabled aria-disabled>
        手動重整
      </Button>
    </TooltipTrigger>
    <TooltipContent>文件尚未完成解析</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

## 3. 表單元件模式

### 3.1 基本輸入框

```tsx
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";

<div className="space-y-2">
  <Label htmlFor="title">標題</Label>
  <Input
    id="title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="請輸入標題..."
    aria-invalid={!!error}
  />
  {error && (
    <p className="text-sm text-destructive" role="alert">
      {error}
    </p>
  )}
</div>
```

### 3.2 拖曳上傳區（Drop Zone）

Drop Zone 的可近用性規格：

```tsx
<div
  role="button"
  tabIndex={0}
  aria-label="點擊選擇檔案，或拖曳檔案至此上傳"
  className={cn(
    "rounded-lg border-2 border-dashed p-8 text-center transition-colors",
    isDragOver && "border-primary bg-primary/5",
    "focus:outline-none focus:ring-2 focus:ring-ring"
  )}
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") handleClick();
  }}
>
  {isDragOver ? "放開以上傳" : "點擊或拖曳上傳"}
</div>
```

---

## 4. 資料表格模式（Data Table Pattern）

使用 TanStack Table（`@lib-tanstack`）實作資料表格：

```tsx
// 簡易表格（列表較短時）
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>檔名</TableHead>
      <TableHead>狀態</TableHead>
      <TableHead>操作</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {documents.map((doc) => (
      <TableRow key={doc.id}>
        <TableCell>{doc.filename}</TableCell>
        <TableCell><StatusBadge status={doc.status} /></TableCell>
        <TableCell>
          <ActionButton doc={doc} />
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

**選用 TanStack Table 時機**：
- 需要排序功能
- 需要列選取（多選刪除）
- 需要虛擬化（列數 > 100）

---

## 5. 頁面組裝模式（Page Composition Pattern）

`page.tsx` 應保持薄協調，只組裝元件：

```tsx
// ✅ 正確：薄協調層
export default async function WikiDocumentsPage() {
  return <WikiDocumentsView />;
}

// ✅ 正確：有少量 Server-side data fetch
export default async function WorkspacePage({ params }: { params: { workspaceId: string } }) {
  const workspace = await getWorkspaceById(params.workspaceId);
  if (!workspace) notFound();
  return <WorkspaceOverview workspace={workspace} />;
}

// ❌ 錯誤：page 內有業務邏輯
export default async function DocumentsPage() {
  const db = getFirestore();
  const docs = await db.collection("documents").get(); // 直接在 page 呼叫 Firebase
  return <div>{/* ... */}</div>;
}
```

---

## 6. 常見反模式（Anti-patterns）

| 反模式 | 問題 | 正確做法 |
|---|---|---|
| 直接在 page 使用 Firebase SDK | 違反 MDDD 分層 | 透過 use-case 或 Server Action |
| 在元件內直接 `new FirebaseXxxRepository()` | 難以測試 | 由 use-case 透過 constructor injection |
| 只用顏色區分狀態 | 色盲使用者無法識別 | 同時包含圖示與文字 |
| Toast 成功但無失敗處理 | 靜默失敗 | try/catch 包覆，失敗也顯示 toast |
| Disabled 按鈕無 Tooltip | 使用者不知為何不可用 | 加 `Tooltip` 說明原因 |
| 空狀態顯示空白頁面 | 使用者困惑 | 實作 Empty State 元件 |
| `'use client'` 加在 layout 或不必要的元件 | 阻止 Server Component 優化 | 只在必要的最小範圍加 `'use client'` |

---

## 7. 元件命名規範

| 元件類型 | 命名格式 | 範例 |
|---|---|---|
| Feature 元件 | `{Module}{Feature}View` | `WikiDocumentsView` |
| 子元件（列表項） | `{Feature}Row` / `{Feature}Card` | `DocumentRow` |
| 表單元件 | `{Action}{Resource}Form` | `UploadDocumentForm` |
| Dialog 元件 | `{Action}{Resource}Dialog` | `CreateWorkspaceDialog` |
| 頁面 Shell 元件 | `{Module}Shell` | `WikiShell` |

---

## 8. 匯入規則

```tsx
// ✅ 正確
import { Button } from "@ui-shadcn/ui/button";
import { Card } from "@ui-shadcn/ui/card";
import { cn } from "@shared-utils";
import { Plus, Loader2 } from "lucide-react";

// ❌ 錯誤：使用 legacy 路徑
import { Button } from "@/ui/shadcn/ui/button";
import { cn } from "@/shared/utils";
```
````

## File: docs/guides/how-to/ui-ux/information-architecture.md
````markdown
# 資訊架構（Information Architecture）

> **參考文件類型**：本文件定義 Xuanwu App 的全站資訊架構、導覽層級、路由地圖與頁面組織原則。
> 實際路由以目前應用程式路由實作為準；本文件作為閱讀地圖與設計指引。

---

## 1. 全站資訊架構圖

```
Xuanwu App
├── (public)                          ← 未登入公開區域
│   ├── /login                        ← 登入頁
│   └── /register（planned）          ← 註冊頁
│
└── (shell)                           ← 已登入 Shell（三欄版型）
    ├── /workspace                    ← 工作區中心
    │   └── /workspace/[workspaceId]  ← 單一工作區
    │
    ├── /wiki                    ← 知識庫（Wiki）
    │   ├── /wiki（知識總覽）
    │   ├── /wiki/documents      ← 主操作頁
    │   ├── /wiki/rag-query      ← AI 問答
    │   ├── /wiki/rag-reindex    ← RAG 重整
    │   ├── /wiki/pages          ← 頁面管理
    │   └── /wiki/libraries      ← 資料庫管理
    │
    ├── /ai-chat                      ← AI 對話介面
    │
    ├── /organization                 ← 組織管理
    │   ├── /organization/members     ← 成員管理
    │   ├── /organization/teams       ← 團隊管理
    │   ├── /organization/permissions ← 權限管理
    │   ├── /organization/workspaces  ← 工作區管理
    │   ├── /organization/schedule    ← 排程管理
    │   ├── /organization/daily       ← 每日摘要
    │   └── /organization/audit       ← 稽核記錄
    │
    ├── /dashboard                    ← 個人儀表板
    │
    └── /settings                     ← 設定
```

---

## 2. Shell 版型層級

### 2.1 三欄結構

```
+--App Rail--+--Secondary Nav (Dashboard Sidebar)--+--Main Content--+
|   48px     |           240px（可收合）              |   flex-1       |
|            |                                       |                |
| 圖示導覽   |  依所在區域顯示次要導覽                |  page.tsx      |
|            |                                       |  協調層        |
+------------+---------------------------------------+----------------+
```

### 2.2 App Rail（最左欄）

App Rail 提供**跨功能區域**的頂層導覽，圖示帶 Tooltip。

| 圖示 | 路由 | 標籤 |
|---|---|---|
| `Building2` | `/workspace` | 工作區中心 |
| `BookOpen` | `/wiki` | Account Wiki |
| `Bot` | `/ai-chat` | AI 對話 |
| `Users` | `/organization` | 組織管理 |
| `FlaskConical` | `/dev-tools`（開發環境） | 開發工具 |
| `Settings` | `/settings` | 設定 |
| `Plus` | — | 快速建立工作區 / 組織 |

### 2.3 Dashboard Sidebar（次要側邊欄）

次要側邊欄根據**目前所在的功能區域**動態顯示對應的子導覽。

**工作區（/workspace/[id]）子導覽**：

| 群組 | 項目 |
|---|---|
| Primary | Overview、Members |
| Spaces | Spaces 列表 |
| Databases | Databases 列表 |
| Library | Files、Documents |
| Modules | Issues、Tasks、Schedule、Daily |

**Wiki（/wiki）子導覽**：

| 項目 | 路由 | 狀態 |
|---|---|---|
| 知識總覽 | `/wiki` | ✅ 現有 |
| RAG Query | `/wiki/rag-query` | ✅ 現有 |
| RAG Reindex | `/wiki/rag-reindex` | ✅ 現有 |
| Documents [+] | `/wiki/documents` | ✅ 現有 |
| Pages | `/wiki/pages` | ✅ 現有 |
| Libraries | `/wiki/libraries` | ✅ 現有 |
| Workspaces | — | ✅ 現有（可摺疊） |

**組織管理（/organization）子導覽**：

| 項目 | 路由 | 說明 |
|---|---|---|
| 成員 | `/organization/members` | 組織成員管理 |
| 團隊 | `/organization/teams` | 群組管理 |
| 權限 | `/organization/permissions` | RBAC 角色與權限 |
| 工作區 | `/organization/workspaces` | 組織下工作區管理 |
| 排程 | `/organization/schedule` | 排程管理 |
| 每日 | `/organization/daily` | 每日摘要 |
| 稽核 | `/organization/audit` | 操作稽核記錄 |

---

## 3. 路由設計原則

### 3.1 路由命名規則

| 類型 | 格式 | 範例 |
|---|---|---|
| 資源列表 | `/resource` | `/wiki/documents` |
| 資源詳情 | `/resource/[id]` | `/workspace/[workspaceId]` |
| 功能子頁 | `/context/function` | `/wiki/rag-query` |
| 設定頁 | `/resource/settings` | `/workspace/[id]/settings` |

### 3.2 路由群組（Route Groups）

Next.js App Router 使用路由群組 `(name)` 來共用 layout 而不影響 URL：

| 群組 | 路徑 | 共用 layout |
|---|---|---|
| `(public)` | — | 未登入頁面 layout（無 Shell） |
| `(shell)` | — | 已登入 Shell layout（三欄版型 + Auth guard） |

### 3.3 URL 參數規範

| 參數 | 說明 | 範例 |
|---|---|---|
| `workspaceId` | workspace 篩選視角 | `?workspaceId=ws_123` |
| `tab` | 功能頁籤切換 | `?tab=overview` |
| `q` | 搜尋關鍵字 | `?q=keyword` |

---

## 4. 資料範圍與 Scope 設計

Xuanwu App 的資料圍繞三層結構：

```
System
└── Account（個人帳號 / 組織帳號）
    └── Workspace（工作區）
        └── Resources（Pages、Files、Documents...）
```

| 層次 | 說明 | 存取範圍 |
|---|---|---|
| **Account** | 資料主範圍。所有資料歸屬於帳號，不跨帳號共用。 | 帳號擁有者 + 邀請成員 |
| **Workspace** | 帳號下的分組視角。workspace 是篩選，不是資料邊界。 | Workspace 成員 |
| **Namespace** | 路由 slug 機制，背景能力，不在 UI 中獨立暴露。 | 系統內部 |

**重要設計原則**：
- 使用者的 **預設視角** 為帳號全覽（account scope）。
- 切換 workspace 是「縮小視角」的操作，不是「換資料庫」的操作。
- 跨 workspace 的資料彙總需在 account 層完成。

---

## 5. 頁面類型分類

### 5.1 列表頁（List Page）

顯示某類資源的清單，支援篩選、排序與操作。

**必要元素**：
- 頁首標題 + 篩選狀態提示
- 載入中骨架屏（Skeleton）
- 空狀態（Empty State）+ 引導行動
- 每列的操作按鈕

**範例**：`/wiki/documents`、`/wiki/pages`

### 5.2 詳情頁（Detail Page）

顯示單一資源的完整資訊，支援編輯操作。

**必要元素**：
- 返回連結（Back button）
- 資源標題 + 元資料
- 內容主體
- 操作按鈕（Edit / Delete / Share）

**範例**：`/workspace/[workspaceId]`

### 5.3 功能操作頁（Functional Page）

以特定功能為主（非 CRUD 列表），例如 RAG 查詢、上傳操作。

**必要元素**：
- 操作輸入區
- 執行按鈕（含 loading 狀態）
- 結果顯示區
- 錯誤 / 空狀態處理

**範例**：`/wiki/rag-query`、`/wiki/rag-reindex`

### 5.4 總覽頁（Overview / Dashboard Page）

提供某功能區域的整體摘要與入口。

**必要元素**：
- 快速操作入口（Quick Actions）
- 統計摘要（Counters / Metrics）
- 最近活動或重要提示

**範例**：`/wiki`（知識總覽）

---

## 6. 導覽自訂化

使用者可透過「自訂導覽」對話框（`CustomizeNavigationDialog`）調整側邊欄顯示的項目：

- **偏好存儲**：`localStorage` key `xuanwu:nav-preferences`
- **偏好格式**：pinnedItems（置頂項目）+ workspaceOrder（工作區排序）
- **有效項目集合**：系統定義 `VALID_PINNED_ITEMS` 與 `VALID_WORKSPACE_ORDER_IDS`，確保偏好合法性

---

## 7. 搜尋與導覽輔助

### 7.1 全站搜尋（planned）

- **入口**：Header 右側搜尋圖示（`/search`）
- **範圍**：account 範圍內所有 Pages、Documents、Records
- **鍵盤捷徑**：`Cmd/Ctrl + K`

### 7.2 麵包屑（Breadcrumb）

- 目前各頁面使用「← 返回」按鈕
- 計畫在頁首加入麵包屑導覽（planned）

### 7.3 語言切換

- Header Controls 提供語言切換器（`translation-switcher.tsx`）
- 支援語言：中文（繁體）、英文（計畫中）
````

## File: docs/guides/how-to/ui-ux/ux-principles.md
````markdown
# UX 原則與互動規範

> **說明文件類型**：本文件說明 Xuanwu App 的使用者體驗設計哲學，定義互動模式、反饋機制與可近用性標準。
> 設計決策均與 Diátaxis 的「說明」象限對應 — 著重「為什麼」而非「如何做」。

---

## 1. 核心 UX 原則

### 1.1 UX1 — 操作可見（System Visibility）

> _使用者在任何時刻都知道系統正在做什麼。_

**來源**：Don Norman《The Design of Everyday Things》— 回饋原則。

**實作規範**：
- 所有非同步操作（上傳、查詢、刪除）必須有 loading 狀態指示。
- loading 狀態使用 **spinner + 文字** 雙重提示（例如「上傳中...」），不只有 spinner。
- 後台處理完成後（例如文件解析），以 **toast 通知** 明確告知結果。
- 即時變動的資料（例如文件 `status`）盡量使用 **Firestore `onSnapshot`** 讓狀態自動更新，而非需要使用者手動刷新。

### 1.2 UX2 — 降低認知負擔（Minimize Cognitive Load）

> _核心操作集中在一個頁面完成，不強迫使用者在多頁面間跳轉。_

**來源**：Steve Krug《Don't Make Me Think》— 最少點擊數。

**實作規範**：
- 每個主功能頁面（例如 `/wiki/documents`）自我完備 — 上傳、列表、操作三位一體。
- 側邊欄導覽項目最多顯示 **7 個頂層項目**（米勒定律：工作記憶限制）。
- 次要操作（例如快捷建立）使用 **hover 顯示** 的次要元素，不佔主要視覺空間。

### 1.3 UX3 — 錯誤可修復（Error Recovery）

> _出錯時顯示原因與建議的下一步行動。_

**來源**：Don Norman《The Design of Everyday Things》— 錯誤設計原則。

**實作規範**：
- 所有錯誤 toast 包含 **原因 + 建議行動**（例如「上傳失敗，請確認網路連線後重試」）。
- 格式驗證錯誤在使用者動作當下即時顯示，不等待 submit。
- 禁用按鈕（disabled）必須搭配 **tooltip 說明不可用原因**，不可靜默。

### 1.4 UX4 — 資料全覽預設（Default to Overview）

> _預設顯示 account 全覽，不因工作區切換讓資料「消失」。_

**來源**：Lean UX — 從使用者痛點出發的設計。

**實作規範**：
- 所有資料列表預設顯示 **account 範圍**，不以 workspace 為預設篩選。
- workspace 篩選為選擇性操作，透過 URL 參數（`?workspaceId=<id>`）觸發。
- 篩選啟動時，頁面需顯示明確的篩選提示（例如「workspace: {id} ×」）。

### 1.5 UX5 — 鍵盤可近用性（Keyboard Accessibility）

> _所有互動操作均可由鍵盤完整操作，不依賴滑鼠。_

**來源**：WCAG 2.1 AA 標準。

**實作規範**：
- 所有可互動元素（按鈕、連結、輸入框）可 Tab 鍵聚焦。
- Dropdown / Popover 支援 ↑↓ 導覽與 Enter 觸發、Esc 關閉。
- 焦點管理：開啟 Modal/Dialog 後焦點移入；關閉後焦點回到觸發元素。
- 焦點環（focus ring）在所有互動元素上清晰可見。

### 1.6 UX6 — 一致性（Consistency）

> _相同功能在全平台使用相同元件與文案模式。_

**來源**：Jakob Nielsen《10 Usability Heuristics》— Consistency and Standards。

**實作規範**：
- 統一使用 shadcn/ui 元件庫，不自行實作已有的基礎元件。
- 操作文案統一：「建立」（不混用「新增」和「新建」）、「刪除」（不混用「移除」）。
- 狀態圖示統一：`✓ ready`、`⏳ processing`、`✗ error`。

---

## 2. 互動模式規範

### 2.1 Toast 通知規則

Toast 是 Xuanwu App 的主要反饋機制，使用 **Sonner** 函式庫。

| 情境 | Toast 類型 | 顯示時間 |
|---|---|---|
| 操作成功（建立、儲存、觸發） | `success` | 3 秒自動消失 |
| 操作失敗（網路、驗證、權限） | `error` | 5 秒（或手動關閉） |
| 背景處理中（可能需要等待） | `info` | 4 秒自動消失 |
| 危險操作前的確認 | 不用 toast，用 Dialog | — |

**格式規範**：
```
成功：「已{動作} {對象}」        例：「已建立 工作區 Marketing」
失敗：「{動作}失敗：{原因}」     例：「上傳失敗：格式不支援」
處理中：「{動作}中，請稍候…」   例：「重整中，請稍候…」
```

**實作位置**：`<Toaster />` 已掛載於全域 Provider。

### 2.2 Loading 狀態規範

| 情境 | Loading 模式 |
|---|---|
| 頁面初始載入 | Skeleton（骨架屏） — 整頁占位符 |
| 列表資料載入 | Skeleton rows — 每列占位符 |
| 按鈕觸發的操作 | Inline spinner + 文字 + disabled |
| 單列操作（不影響其他列） | 僅該列顯示 spinner，其他列保持互動 |
| 全頁阻斷操作 | 避免使用；若必要，使用半透明 overlay |

### 2.3 空狀態設計

每個列表頁面須定義 **空狀態（Empty State）**，避免空白頁面讓使用者困惑。

| 場景 | 空狀態內容 |
|---|---|
| 無文件（Documents） | 說明文字 + 指向 Upload 卡的引導箭頭 |
| 無頁面（Pages） | 說明文字 + 「建立第一個頁面」按鈕 |
| 無查詢結果（RAG Query） | 說明文字 + 建議的下一步（確認文件已 indexed） |
| 無工作區 | 說明文字 + 「建立工作區」按鈕 |

**空狀態文案格式**：
```
「目前還沒有 {資源名稱}，{引導動作}。」
例：「目前還沒有文件，試著上傳第一份檔案。」
```

### 2.4 確認對話框規則

需要使用 Dialog 確認的操作：

| 操作類型 | 是否需要確認 |
|---|---|
| 刪除永久性資源 | ✅ 必須 |
| 批次刪除 | ✅ 必須 |
| 清除資料 | ✅ 必須 |
| 建立 | ❌ 不需要 |
| 儲存 | ❌ 不需要 |
| 觸發背景任務（例如 reindex） | ❌ 不需要（有 toast 反饋即可） |

---

## 3. 表單設計規範

### 3.1 輸入驗證時機

| 驗證類型 | 觸發時機 |
|---|---|
| 格式驗證（日期、Email） | blur（失去焦點時） |
| 必填欄位 | submit（提交時）；如果已 blur 過也可 blur 時顯示 |
| 即時搜尋 | change（每次輸入後，加 debounce） |
| 伺服器端驗證 | submit 後，以 toast 或 inline error 顯示 |

### 3.2 按鈕狀態

所有可提交的按鈕（Primary Button）遵循以下狀態：

```
idle → loading → success（toast） or error（toast）
```

- **idle**：正常可點擊狀態，顯示操作文字。
- **loading**：顯示 spinner + 操作進行中文字，按鈕 disabled。
- **success**：toast 顯示成功訊息，按鈕回到 idle（或 navigate）。
- **error**：toast 顯示錯誤訊息，按鈕回到 idle（允許重試）。

---

## 4. 導覽行為規範

### 4.1 側邊欄展開 / 收合

- **預設狀態**：展開。
- **收合觸發**：使用者點擊 `PanelLeftClose` 圖示，偏好存於 `localStorage`（key: `xuanwu:nav-preferences`）。
- **收合狀態**：僅顯示圖示，懸停（hover）顯示 Tooltip 提示完整名稱。

### 4.2 Active 狀態顯示

- 側邊欄以路由 prefix 判斷 active（`pathname.startsWith(href + "/")`）。
- Active 項目：背景色 `bg-accent`，文字加粗。

### 4.3 麵包屑（Breadcrumb）

目前未實作全站麵包屑；各功能區頁首有「返回」按鈕（例如「← 返回 Wiki Beta」）。

---

## 5. 可近用性完整清單

### 5.1 必要實作（WCAG 2.1 AA）

| 需求 | 實作細節 |
|---|---|
| 色彩對比 | 文字與背景對比 ≥ 4.5:1（一般文字）；≥ 3:1（大文字） |
| 鍵盤可操作 | 所有功能可不依賴滑鼠完成 |
| 螢幕閱讀器 | 圖示按鈕有 `aria-label`；狀態用 `aria-live` 或 `role="status"` |
| 焦點管理 | 開啟 Dialog/Popover 後焦點移入，關閉後焦點回到觸發元素 |
| 錯誤識別 | 錯誤訊息不僅依賴紅色，需有文字說明 |
| 選單鍵盤操作 | Arrow 鍵導覽、Enter 觸發、Esc 關閉 |

### 5.2 元件可近用性規格

| 元件 | 鍵盤行為 | ARIA 需求 |
|---|---|---|
| Drop Zone | Tab 聚焦；Enter/Space 觸發選檔 | `role="button"`, `aria-label` |
| Dropdown Menu | ↑↓ 導覽；Enter 選擇；Esc 關閉 | `role="menu"`, `role="menuitem"` |
| Dialog | Esc 關閉；焦點陷阱 | `role="dialog"`, `aria-labelledby` |
| Toast | 自動朗讀 | `role="alert"` 或 `aria-live="assertive"` |
| Table | Tab 導覽至互動元素 | `<table>` 語意標籤 |
| Badge / Status | — | 不可只用顏色；需有文字 |

---

## 6. 回應式設計規範

Xuanwu App 主要針對桌面（Desktop first），但核心頁面需支援平板與手機。

| 斷點 | Tailwind Prefix | 說明 |
|---|---|---|
| 手機 | （預設） | 單欄版型；隱藏 Secondary Nav |
| 平板 | `md:` | 可選性顯示 Secondary Nav |
| 桌面 | `lg:` | 完整三欄版型 |

**手機版規則**：
- App Rail 收合為底部導覽列（planned）。
- 資料列表改為卡片式呈現，取代桌面的表格。
- 複雜操作（例如上傳）維持可用，但版型調整為全寬。
````

## File: docs/guides/how-to/ui-ux/wireframes.md
````markdown
# 線框圖（Wireframes）

> **參考文件類型**：本文件包含 Xuanwu App 各主要功能區域的線框圖（Wireframe），以 ASCII 文字圖呈現布局結構與元件配置。
> 詳細的個別功能 UI 規格，請參閱系統規格索引。

---

## 1. Shell 版型（三欄結構）

所有已登入頁面共用三欄 Shell 版型：

```
+--[App Rail]--+--[Secondary Nav]--+--[Main Content]--+
|   48px       |    240px          |    flex-1         |
|              |  （可收合）        |                   |
| [Logo]       |  根據功能區域      |  page.tsx         |
|              |  動態顯示子導覽    |  協調層           |
| [Workspace]  |                   |                   |
| [Wiki Beta]  |                   |                   |
| [AI Chat]    |                   |                   |
| [Org]        |                   |                   |
|              |                   |                   |
| ─────────── |                   |                   |
| [Settings]   |                   |                   |
| [User Avatar]|                   |                   |
+--[App Rail]--+--[Secondary Nav]--+--[Main Content]--+
```

### Header（頁首）

```
+----------------------------------------------------------------+
| Breadcrumb / Page Title        [Search] [Lang] [Theme] [User] |
+----------------------------------------------------------------+
```

---

## 2. Wiki 功能區

### 2.1 `/wiki`（知識總覽）

```
+--App Rail--+--Wiki Nav--+------Main Content------+
|            | 知識總覽 ●      | [← 返回]               |
|            | RAG Query       |                        |
|            | RAG Reindex     | Wiki Beta              |
|            | Documents   [+] | ─────────────────────  |
|            | Pages           |                        |
|            | Libraries       | ┌─────────┐ ┌─────────┐|
|            | ─────────────  | │ 文件上傳 │ │RAG Query│|
|            | Workspaces ▼   | │  圖示+   │ │ 圖示+   │|
|            |  > ws-1         | │  說明文字│ │ 說明文字│|
|            |  > ws-2         | └─────────┘ └─────────┘|
|            |                 |                        |
|            |                 | 帳號統計               |
|            |                 | 文件：N  Ready：M      |
|            |                 | 工作區：K              |
+--App Rail--+--Wiki Nav--+------Main Content------+
```

### 2.2 `/wiki/documents`（主操作頁）

```
+--App Rail--+--Wiki Nav--+--------Main Content---------+
|            | 知識總覽        | Wiki Beta · Documents       |
|            | RAG Query       | account 全覽 / ws: {id} ×  |
|            | RAG Reindex     | ─────────────────────────── |
|            | Documents ● [+] |                             |
|            | Pages           | ┌── 上傳檔案 ─────────────┐|
|            | Libraries       | │                           │|
|            |                 | │  ╔═══════════════════╗   │|
|            |                 | │  ║ 點擊或拖曳上傳     ║   │|
|            |                 | │  ║ .pdf .tiff .png    ║   │|
|            |                 | │  ╚═══════════════════╝   │|
|            |                 | │                           │|
|            |                 | │  [上傳並啟動解析 ↑] [✕]  │|
|            |                 | └───────────────────────────┘|
|            |                 |                             |
|            |                 | ┌── Documents (帳號全覽) ───┐|
|            |                 | │ filename │ status │ rag   │|
|            |                 | │──────────│────────│───────│|
|            |                 | │report.pdf│✓ ready │✓ idx  │|
|            |                 | │scan.tiff │⏳ proc │⏳ pend│|
|            |                 | │error.pdf │✗ error │ —    │|
|            |                 | └───────────────────────────┘|
+--App Rail--+--Wiki Nav--+--------Main Content---------+
```

**Documents [+] 快捷選單（Popover）**：

```
Documents [+]
          │
          ▼
     ┌─────────────────┐
     │ ＋ 新增頁面      │
     │ ＋ 新增資料庫    │
     └─────────────────┘
```

### 2.3 `/wiki/rag-query`

```
+--App Rail--+--Wiki Nav--+--------Main Content---------+
|            | 知識總覽        | Wiki Beta · RAG Query       |
|            | RAG Query ●     | ─────────────────────────── |
|            | RAG Reindex     |                             |
|            | Documents   [+] | ┌── RAG Query ─────────────┐|
|            | Pages           | │                           │|
|            | Libraries       | │ ┌─────────────────────┐   │|
|            |                 | │ │ 請輸入你的問題...     │   │|
|            |                 | │ └─────────────────────┘   │|
|            |                 | │ top_k: [5 ▼] [送出查詢]  │|
|            |                 | └───────────────────────────┘|
|            |                 |                             |
|            |                 | ┌── Answer ────────────────┐|
|            |                 | │ AI 回答文字...            │|
|            |                 | │                           │|
|            |                 | │ [cache:hit][scope:acct]  │|
|            |                 | │ [vector:5][search:3]     │|
|            |                 | └───────────────────────────┘|
|            |                 |                             |
|            |                 | ┌── Citations (3 筆) ──────┐|
|            |                 | │ 1. report.pdf — 第5頁     │|
|            |                 | │    "...引用片段..."        │|
|            |                 | │ 2. scan.tiff — 第1頁      │|
|            |                 | └───────────────────────────┘|
+--App Rail--+--Wiki Nav--+--------Main Content---------+
```

### 2.4 `/wiki/pages`（Pages 頁面管理）

```
+--App Rail--+--Wiki Nav--+--------Main Content---------+
|            | 知識總覽        | Wiki Beta · Pages           |
|            | RAG Query       | ─────────────────────────── |
|            | RAG Reindex     |                  [新增頁面]  |
|            | Documents   [+] |                             |
|            | Pages ●         | ┌── 頁面列表 ───────────────┐|
|            | Libraries       | │ title     │ updatedAt │ → │|
|            |                 | │───────────│───────────│───│|
|            |                 | │ 專案概覽  │ 2026-03-20│ > │|
|            |                 | │   > 里程碑│ 2026-03-21│ > │|
|            |                 | │ 技術規格  │ 2026-03-22│ > │|
|            |                 | └───────────────────────────┘|
+--App Rail--+--Wiki Nav--+--------Main Content---------+
```

### 2.5 `/wiki/libraries`（Libraries 資料庫管理）

```
+--App Rail--+--Wiki Nav--+--------Main Content---------+
|            | 知識總覽        | Wiki Beta · Libraries       |
|            | RAG Query       | ─────────────────────────── |
|            | RAG Reindex     |              [新增資料庫]    |
|            | Documents   [+] |                             |
|            | Pages           | ┌── 資料庫列表 ─────────────┐|
|            | Libraries ●     | │ name      │ fields │ rows │|
|            |                 | │───────────│────────│──────│|
|            |                 | │ 任務追蹤  │ 5欄位  │ 20列 │|
|            |                 | │ 聯絡人    │ 3欄位  │ 8列  │|
|            |                 | └───────────────────────────┘|
+--App Rail--+--Wiki Nav--+--------Main Content---------+
```

---

## 3. 工作區（Workspace）

### 3.1 `/workspace`（工作區中心）

```
+--App Rail--+--Nav--+--------Main Content---------+
|            |       | 工作區中心                  |
|            |       | ─────────────────────────── |
|            |       | [建立工作區]                 |
|            |       |                             |
|            |       | ┌── 我的工作區 ─────────────┐|
|            |       | │ ┌─────────┐ ┌─────────┐  │|
|            |       | │ │  工作區  │ │  工作區  │  │|
|            |       | │ │  Marketing│ │ Product │  │|
|            |       | │ │  →進入    │ │  →進入  │  │|
|            |       | │ └─────────┘ └─────────┘  │|
|            |       | └───────────────────────────┘|
+--App Rail--+--Nav--+--------Main Content---------+
```

---

## 4. 組織管理（Organization）

### 4.1 `/organization/members`

```
+--App Rail--+--Org Nav--+--------Main Content---------+
|            | 成員 ●    | 組織 · 成員管理             |
|            | 團隊      | ─────────────────────────── |
|            | 權限      |                 [邀請成員]   |
|            | 工作區    |                             |
|            | 排程      | ┌── 成員列表 ───────────────┐|
|            | 每日      | │ 姓名  │ 角色   │ 狀態 │操作│|
|            | 稽核      | │───────│────────│──────│────│|
|            |           | │ Alice │ Admin  │ 活躍 │ … │|
|            |           | │ Bob   │ Member │ 活躍 │ … │|
|            |           | └───────────────────────────┘|
+--App Rail--+--Org Nav--+--------Main Content---------+
```

---

## 5. AI Chat

### 5.1 `/ai-chat`

```
+--App Rail--+--Nav--+--------Main Content---------+
|            |       | AI 對話                     |
|            |       | ─────────────────────────── |
|            |       | ┌── 對話歷史 ───────────────┐|
|            |       | │ 使用者: 這份文件說什麼?    │|
|            |       | │                           │|
|            |       | │ AI: 根據文件內容，...      │|
|            |       | │                           │|
|            |       | └───────────────────────────┘|
|            |       |                             |
|            |       | ┌── 輸入區 ─────────────────┐|
|            |       | │ 請輸入問題...    [送出 →]  │|
|            |       | └───────────────────────────┘|
+--App Rail--+--Nav--+--------Main Content---------+
```

---

## 6. 手機版線框圖

手機版（< 768px）調整三欄為單欄：

### 6.1 手機版 Documents

```
+--[Header: Wiki Beta · Documents]--+
| [← 返回]                [↺ 刷新] |
+-------------------------------------+
| ┌── 上傳檔案 ─────────────────────┐|
| │  .pdf .tiff .png .jpg            │|
| │  ╔═══════════════════╗           │|
| │  ║   點擊或拖曳上傳   ║           │|
| │  ╚═══════════════════╝           │|
| │  [上傳並啟動解析] [清除]         │|
| └─────────────────────────────────┘|
|                                     |
| ┌── Documents (N 筆) ──────────────┐|
| │ report.pdf                        │|
| │  ✓ ready · ✓ indexed · 12 頁    │|
| │  [手動重整]                       │|
| │─────────────────────────────────│|
| │ scan.tiff                         │|
| │  ⏳ processing · ⏳ pending      │|
| │  [— 解析中 —]                   │|
| └─────────────────────────────────┘|
```

### 6.2 手機版底部導覽（planned）

```
+─────────────────────────────────────+
| [工作區] [Wiki] [AI] [組織] [設定]  |
+─────────────────────────────────────+
```

---

## 7. 對話框（Dialog）設計

### 7.1 建立工作區 Dialog

```
+─────────────────────────────────────────+
│  建立工作區                          ✕  │
│                                         │
│  工作區名稱                             │
│  ┌─────────────────────────────────┐   │
│  │ 請輸入工作區名稱...              │   │
│  └─────────────────────────────────┘   │
│  {錯誤訊息（若有）}                    │
│                                         │
│                    [取消]  [建立工作區] │
+─────────────────────────────────────────+
```

### 7.2 刪除確認 Dialog

```
+─────────────────────────────────────────+
│  確認刪除                            ✕  │
│                                         │
│  您確定要刪除「{資源名稱}」嗎？         │
│  此操作無法復原。                       │
│                                         │
│                       [取消]  [確認刪除]│
+─────────────────────────────────────────+
```

---

## 8. 狀態元件規格

### 8.1 Status Badge

```
✓ ready         ← 綠色背景，白色文字
⏳ processing   ← 藍/琥珀色背景，白色文字
✗ error         ← 紅色背景，白色文字
— pending       ← 灰色背景，灰色文字
```

### 8.2 Loading Skeleton 

```
Documents 列表載入中：
+─────────────────────────────────────+
│ ▓▓▓▓▓▓▓▓▓▓▓ │ ▓▓▓▓▓▓▓ │ ▓▓▓▓▓  │
│ ▓▓▓▓▓▓▓▓    │ ▓▓▓▓▓▓▓ │ ▓▓▓    │
│ ▓▓▓▓▓▓▓▓▓▓  │ ▓▓▓▓▓▓  │ ▓▓▓▓   │
+─────────────────────────────────────+
（▓ 代表 Skeleton 骨架屏 pulse 動畫區塊）
```

---

## 相關主題

- 設計系統：色彩、字型規範
- UX 原則：互動規則、可近用性
- 資訊架構：全站路由地圖
- 規格索引：Wiki 與其他功能規格入口
````

## File: docs/reference/specification/system-overview.md
````markdown
# 系統全局規格（System Overview Specification）

> **規格文件類型**：本文件描述 Xuanwu App 的系統定位、目標用戶、核心功能、技術架構與運行時邊界。

---

## 1. 系統定位

**Xuanwu App** 是一個**企業知識管理與 AI 輔助的工作區平台**，提供：

- 內容頁面與結構化資料庫體驗（Content / UI Layer）
- 知識關聯與導航視角（Knowledge Graph Layer）
- 企業級 RAG（Retrieval-Augmented Generation）知識查詢
- 多工作區協作與組織管理
- 文件解析、向量化與智慧問答

### 1.1 核心價值主張

| 面向 | 價值 |
|---|---|
| **知識管理** | 以頁面、區塊、資料庫與知識關聯組織企業知識 |
| **AI 驅動** | 上傳文件後自動解析、向量化，支援自然語言查詢 |
| **多工作區** | 一個組織帳號可管理多個工作區，資料有效隔離 |
| **可觀測** | 文件處理狀態、RAG 索引狀態均可在 UI 即時觀測 |

---

## 2. 目標用戶

| 用戶類型 | 說明 | 核心需求 |
|---|---|---|
| **個人知識工作者** | 個人帳號使用者 | 個人頁面管理、文件上傳、AI 問答 |
| **企業團隊協作者** | 組織帳號成員 | 多工作區協作、文件共享、RAG 查詢 |
| **組織管理員（Admin）** | 擁有管理權限的成員 | 成員管理、權限設定、稽核記錄 |
| **系統管理員（Sysadmin）** | 後台操作人員 | 部署、監控、資料治理 |

---

## 3. 核心功能規格

### 3.1 Account 與 Workspace 管理

| 功能 | 說明 | 模組 |
|---|---|---|
| 個人帳號 | 用戶可建立個人帳號 | `account` |
| 組織帳號 | 用戶可建立組織，組織有獨立帳號 | `organization`, `account` |
| 工作區建立 | 帳號下可建立多個工作區 | `workspace` |
| 成員邀請 | 組織可邀請成員加入，分配角色 | `account`, `organization` |
| 角色與權限 | RBAC 模型；Admin / Member / Viewer 等角色 | `account` |

### 3.2 知識庫功能

| 功能 | 說明 | 模組 |
|---|---|---|
| 文件上傳 | 支援 PDF、TIFF、PNG、JPEG | `asset`, `knowledge` |
| 文件列表 | Account 全覽；workspace 篩選 | `asset` |
| 文件解析 | Google Document AI 自動解析 | `py_fn` |
| RAG 向量化 | 文件切塊 + OpenAI Embedding | `py_fn` |
| RAG 問答 | 自然語言問答，含引用來源 | `retrieval`, `agent` |
| RAG 重整 | 手動觸發 RAG 重新索引 | `retrieval`, `knowledge` |
| Pages | 區塊式頁面建立與管理 | `content` |
| Libraries | 結構化資料庫管理 | `asset` |

### 3.3 AI 功能

| 功能 | 說明 | 模組 |
|---|---|---|
| AI Chat | 通用 AI 對話介面 | `agent` |
| RAG 查詢 | 基於文件的智慧問答 | `retrieval`, `knowledge` |
| 知識摘要 | 文件自動摘要（RAG pipeline） | `py_fn` |

### 3.4 組織管理

| 功能 | 說明 | 模組 |
|---|---|---|
| 成員管理 | 邀請、移除、角色調整 | `account`, `organization` |
| 團隊管理 | 成員分組 | `organization` |
| 排程管理 | 雙向資源排程 | `workspace-scheduling` |
| 工作流程 | 工作區任務與流程管理 | `workspace-flow` |
| 稽核記錄 | 操作稽核追蹤 | `workspace-audit` |

---

## 4. 技術架構規格

### 4.1 運行時邊界

系統分為兩個主要運行時：

| 運行時 | 職責 | 技術 |
|---|---|---|
| **Next.js（前端/後端）** | 頁面渲染、互動 UI、Server Actions、查詢協調 | Next.js 16, React 19, TypeScript |
| **py_fn（Python Worker）** | 文件解析、向量化、RAG pipeline | Python 3.11, Firebase Cloud Functions |

**禁止跨越邊界**：
- Next.js 不執行 parse/chunk/embed（這些在 py_fn）。
- py_fn 不持有 UI 狀態或 session 邏輯。

### 4.2 資料層架構

```
Firebase Firestore    ← 主要資料儲存（accounts/{accountId}/...）
Firebase Storage      ← 檔案儲存（上傳文件）
Upstash Vector        ← 向量索引（RAG）
Upstash Redis         ← 快取（RAG query cache）
```

### 4.3 Firestore 資料模型（頂層）

```
accounts/{accountId}/
├── documents/{documentId}     ← 文件（Wiki）
├── pages/{pageId}             ← 頁面（Pages）
├── databases/{databaseId}     ← 資料庫（Libraries）
├── workspaces/{workspaceId}   ← 工作區（Workspace）
└── members/{memberId}         ← 成員（Account）
```

> **重要規則**：所有讀寫必須在 `accounts/{accountId}/...` 路徑下，禁止查詢頂層 collection。

### 4.4 認證與授權

```
Firebase Auth → AuthProvider（client） → Shell Guard → RBAC（account roles）
```

| 角色 | 說明 |
|---|---|
| `owner` | 帳號擁有者，全部權限 |
| `admin` | 管理員，可管理成員與設定 |
| `member` | 一般成員，可讀寫工作區資源 |
| `viewer` | 唯讀成員，只能查看 |

---

## 5. 模組責任邊界

16 個 MDDD 業務模組的責任分配：

| 模組 | 職責概要 |
|---|---|
| `account` | 用戶帳號、成員角色、帳號策略 |
| `agent` | AI 對話協調、RAG orchestration（不擁有資料） |
| `asset` | Wiki Library、RAG 文件記錄、檔案資產管理 |
| `content` | Block 編輯器頁面、WikiPage、版本歷程 |
| `identity` | 身份認證、Token 刷新 |
| `knowledge` | 文件攝入、IngestionDocument、Embedding 流程 |
| `knowledge-graph` | 圖節點、圖邊、連結、分類樹 |
| `notification` | 通知推送 |
| `organization` | 組織（租戶）管理、策略 |
| `retrieval` | RAG 查詢、Wiki RAG 類型、向量檢索 |
| `shared` | 共享領域原語：Slug 工具（原 namespace）、Event-store 原語（原 event）、BaseEntity、DomainEvent |
| `workspace` | 工作區管理、成員管理、WikiContentTree |
| `workspace-audit` | 不可變稽核記錄 |
| `workspace-feed` | 工作區動態摘要 |
| `workspace-flow` | 工作區任務與流程管理 |
| `workspace-scheduling` | 雙向資源排程 |

---

## 6. 整合點

| 整合對象 | 用途 | SDK/協議 |
|---|---|---|
| Firebase Firestore | 資料儲存 | Firebase SDK v12 |
| Firebase Storage | 檔案儲存 | Firebase SDK v12 |
| Firebase Auth | 身份認證 | Firebase SDK v12 |
| Firebase Cloud Functions | Callable 觸發 | Firebase SDK v12 |
| Google Document AI | PDF 解析 | Google Cloud SDK（py_fn） |
| Google Genkit | AI Flow 協調 | Genkit 1.30.1 |
| OpenAI | Embedding 生成 | OpenAI SDK（py_fn） |
| Upstash Vector | 向量搜尋 | Upstash SDK |
| Upstash Redis | 快取 | Upstash SDK |
| QStash | 非同步任務佇列 | Upstash QStash |

---

## 7. 驗收標準（系統級別）

| 代號 | 標準 |
|---|---|
| S1 | 使用者可登入並進入 Shell |
| S2 | 使用者可建立組織與工作區 |
| S3 | 使用者可上傳文件並在列表看到 |
| S4 | 文件解析後 `status` 更新為 `ready` |
| S5 | RAG 問答可回傳 answer 與 citations |
| S6 | 管理員可管理組織成員與角色 |
| S7 | Console 無初始化錯誤 |
| S8 | `npm run lint` 0 errors；`npm run build` 成功 |
````

## File: modules/account/aggregates.md
````markdown
# Aggregates — account

## 聚合根：Account

### 職責
代表使用者在 Xuanwu 平台的業務身份記錄。管理 profile 資訊與帳戶狀態。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 帳戶主鍵（對應 Firebase uid） |
| `displayName` | `string` | 顯示名稱 |
| `email` | `string` | Email |
| `avatarUrl` | `string \| null` | 頭像 URL |
| `createdAt` | `Timestamp` | 建立時間 |

### 不變數

- 每個 Account 對應唯一一個 Firebase uid
- Account 建立後 id 不可變更

---

## 聚合根：AccountPolicy

### 職責
代表附加到帳戶的存取控制政策，定義哪些資源可存取、哪些動作被允許，並映射到 Firebase custom claims。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | Policy 主鍵 |
| `accountId` | `string` | 關聯的 Account ID |
| `rules` | `PolicyRule[]` | 存取控制規則列表 |
| `effect` | `"allow" \| "deny"` | 規則效果 |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `AccountRepository` | `save()`, `findById()`, `delete()` |
| `AccountQueryRepository` | `findById()`, `findByEmail()` |
| `AccountPolicyRepository` | `save()`, `findByAccountId()` |
````

## File: modules/account/application-services.md
````markdown
# account — Application Services

> **Canonical bounded context:** `account`
> **模組路徑:** `modules/account/`
> **Domain Type:** Generic Subdomain

本文件記錄 `account` 的 application layer 服務與 use cases。內容與 `modules/account/application/` 實作保持一致。

## Application Layer 職責

管理帳戶資料、偏好設定與帳戶政策，並在 server 端透過 identity/api 取得已驗證身份。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/use-cases/account-policy.use-cases.ts`
- `application/use-cases/account.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/account/README.md`
- 模組 AGENT：`../../../modules/account/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/account/application-services.md`
````

## File: modules/account/domain-events.md
````markdown
# Domain Events — account

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `account.created` | 新帳戶建立時 | `accountId`, `email`, `occurredAt` |
| `account.policy_updated` | AccountPolicy 更新時，觸發 custom claims 刷新 | `accountId`, `policyId`, `occurredAt` |

## 訂閱事件

| 來源 BC | 事件 | 行動 |
|---------|------|------|
| `identity` | `TokenRefreshSignal` | 觸發 custom claims 重新計算與 Firebase token 更新 |

## 事件格式

```typescript
interface AccountCreatedEvent {
  readonly type: "account.created";
  readonly accountId: string;
  readonly email: string;
  readonly occurredAt: string;  // ISO 8601
}

interface AccountPolicyUpdatedEvent {
  readonly type: "account.policy_updated";
  readonly accountId: string;
  readonly policyId: string;
  readonly occurredAt: string;
}
```
````

## File: modules/account/domain-services.md
````markdown
# account — Domain Services

> **Canonical bounded context:** `account`
> **模組路徑:** `modules/account/`
> **Domain Type:** Generic Subdomain

本文件整理 `account` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/account/domain-services.md`
- `../../../docs/ddd/account/aggregates.md`
````

## File: modules/account/README.md
````markdown
# account — 帳戶上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/account/`  
> **開發狀態:** ✅ Done — 穩定

## 在 Knowledge Platform / Second Brain 中的角色

`account` 承接 `identity` 的已驗證身份，管理個人檔案、偏好設定與帳戶政策，讓平台具備使用者層級的個人化與權限落點。它位於平台基礎層，負責把「登入身份」轉成「可持久化的帳戶語意」。

## 主要職責

| 能力 | 說明 |
|---|---|
| 帳戶設定檔 | 維護顯示名稱、頭像、偏好與其他個人資料 |
| 帳戶政策 | 管理 AccountPolicy、custom claims 與存取控制輔助資訊 |
| 個人化入口 | 為組織、工作區與通知提供使用者側設定基礎 |

## 與其他 Bounded Context 協作

- `identity` 提供身份與 token 上下文。
- `organization`、`workspace` 與 `notification` 以帳戶資料作為使用者語意來源。

## 核心聚合 / 核心概念

- **`Account`**
- **`AccountPolicy`**
- **`AccountProfile`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/account/repositories.md
````markdown
# account — Repositories

> **Canonical bounded context:** `account`
> **模組路徑:** `modules/account/`
> **Domain Type:** Generic Subdomain

本文件整理 `account` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/AccountPolicyRepository.ts`
- `domain/repositories/AccountQueryRepository.ts`
- `domain/repositories/AccountRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseAccountPolicyRepository.ts`
- `infrastructure/firebase/FirebaseAccountQueryRepository.ts`
- `infrastructure/firebase/FirebaseAccountRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/account/repositories.md`
- `../../../docs/ddd/account/aggregates.md`
````

## File: modules/account/ubiquitous-language.md
````markdown
# Ubiquitous Language — account

> **範圍：** 僅限 `modules/account/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 | 代碼位置 |
|------|------|------|---------|
| 帳戶 | Account | 使用者在平台的業務記錄，含 profile 資訊與狀態 | `modules/account/domain/entities/Account.ts` |
| 帳戶政策 | AccountPolicy | 附加到帳戶的存取控制政策，決定 Firebase custom claims 內容 | `modules/account/domain/entities/AccountPolicy.ts` |
| 帳戶 ID | accountId | Account 的業務主鍵（對應 Firebase uid，但在業務層使用 accountId 術語） | `Account.id` |
| 自訂宣告 | customClaims | Firebase ID token 中的自訂 claims，由 AccountPolicy 決定 | `Account.customClaims` |
| 帳戶查詢庫 | AccountQueryRepository | CQRS 讀取側 Repository port | `domain/repositories/AccountQueryRepository.ts` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Account` | `User`, `Profile` |
| `AccountPolicy` | `Permission`, `Role`, `AccessRule` |
| `accountId` | `userId`（帳戶層應使用 accountId） |
````

## File: modules/ai/AGENT.md
````markdown
# AGENT.md — ai BC

## 模組定位

`ai` 是 RAG 攝入管線的 Job 協調支援域。管理 IngestionJob 生命週期，協調 py_fn/ Python worker。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `IngestionJob` | Job、Task（在此 BC 內）、ParseJob |
| `IngestionDocument` | Document、File（在此 BC 內）|
| `IngestionChunk` | Chunk、VectorChunk |
| `IngestionStatus` | Status, JobStatus |

## 棄用檔案守衛

以下檔案都是 `@deprecated` stubs，已移至其他模組，**絕對不要** import：
- `modules/ai/domain/entities/graph-node.ts` → 移至 `modules/wiki/`
- `modules/ai/domain/entities/link.ts` → 移至 `modules/wiki/`
- `modules/ai/domain/repositories/GraphRepository.ts` → 移至 `modules/wiki/`

## 邊界規則

### ✅ 允許
```typescript
import { aiApi } from "@/modules/ai/api";
import type { IngestionJobDTO } from "@/modules/ai/api";
```

### ❌ 禁止
```typescript
import { IngestionJob } from "@/modules/ai/domain/entities/IngestionJob";
import { graph-node } from "@/modules/ai/domain/entities/graph-node"; // deprecated stub
```

## Runtime 邊界規則

- `ai` 模組只在 Next.js 端做 Job 協調
- Embedding 生成在 `py_fn/` 執行，不要在 `ai` module 加入 heavy ML 邏輯

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/ai/aggregates.md
````markdown
# Aggregates — ai

## 聚合根：IngestionJob

### 職責
管理 RAG 攝入管線的單一工作記錄。追蹤從上傳到 indexed 的完整狀態機。

### 生命週期狀態機
```
uploaded ──► parsing ──► embedding ──► indexed
                │                         │
                └──────► failed ◄─────────┘
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | Job 主鍵 |
| `documentId` | `string` | 關聯 SourceDocument ID |
| `organizationId` | `string` | 所屬組織 |
| `workspaceId` | `string` | 所屬工作區 |
| `status` | `IngestionStatus` | 當前狀態 |
| `startedAt` | `string \| null` | ISO 8601 開始時間 |
| `completedAt` | `string \| null` | ISO 8601 完成時間 |
| `errorMessage` | `string \| null` | 失敗原因 |

### 不變數

- `indexed` 狀態後不可再轉換回其他狀態
- `failed` 狀態的 errorMessage 不可為空

---

## 實體：IngestionDocument

### 職責
交付給攝入管線的文件元資料，提供 `py_fn/` worker 所需的來源資訊。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 文件主鍵 |
| `sourceFileId` | `string` | 關聯 SourceDocument ID |
| `mimeType` | `string` | 檔案 MIME type |
| `storageUrl` | `string` | Firebase Storage URL |

---

## 值物件：IngestionChunk

### 職責
文件切分後的向量化 chunk，由 `py_fn/` 生成後寫入 Firestore。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | Chunk 主鍵 |
| `documentId` | `string` | 所屬文件 ID |
| `chunkIndex` | `number` | Chunk 在文件中的序號 |
| `content` | `string` | Chunk 文字內容 |
| `embedding` | `number[]` | 向量嵌入（由 py_fn/ 寫入） |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `IngestionJobRepository` | `save()`, `findByDocumentId()`, `listByWorkspace()`, `updateStatus()` |
````

## File: modules/ai/application-services.md
````markdown
# ai — Application Services

> **Canonical bounded context:** `ai`
> **模組路徑:** `modules/ai/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `ai` 的 application layer 服務與 use cases。內容與 `modules/ai/application/` 實作保持一致。

## Application Layer 職責

協調 RAG ingestion job 的生命週期，將重型 parse/chunk/embed 工作交給 py_fn/ 執行。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/link-extractor.service.ts`
- `application/use-cases/advance-ingestion-stage.use-case.ts`
- `application/use-cases/register-ingestion-document.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/ai/README.md`
- 模組 AGENT：`../../../modules/ai/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/ai/application-services.md`
````

## File: modules/ai/context-map.md
````markdown
# Context Map — ai

## 上游（依賴）

### source → ai（Customer/Supplier）

- `source.upload_completed` 觸發 `ai` 建立 IngestionJob
- `ai` 依賴 `source/api` 取得 SourceDocument 元資料（storageUrl、mimeType）

---

## 下游（被依賴）

### ai → search（Customer/Supplier）

- `ai.ingestion_completed` 通知 `search` 更新向量索引
- `search` 的 RAG 查詢依賴 `ai` 生成的 IngestionChunk

### ai → py_fn（Runtime Boundary）

**這不是 BC 間的 DDD 整合，而是 runtime 邊界分割：**

```
Next.js ai module ──[Firestore Job Record]──► py_fn/ worker
                   ──[Firebase Storage URL]──► py_fn/ worker
py_fn/ worker ──[Chunk + Embedding 寫回 Firestore]──► Next.js reads
```

- Next.js 端：Job 建立、狀態查詢、API
- `py_fn/`：parse / chunk / embed 實際執行

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| source → ai | source | ai | Published Language (Events) |
| ai → search | ai | search | Published Language (Events) |
| ai → py_fn | Next.js | py_fn | Runtime Boundary（非 DDD 邊界） |
````

## File: modules/ai/domain-events.md
````markdown
# Domain Events — ai

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `ai.ingestion_job_created` | 新 IngestionJob 建立 | `jobId`, `documentId`, `workspaceId`, `occurredAt` |
| `ai.ingestion_completed` | Job 狀態達到 `indexed` | `jobId`, `documentId`, `chunkCount`, `occurredAt` |
| `ai.ingestion_failed` | Job 狀態轉為 `failed` | `jobId`, `documentId`, `errorMessage`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `source` | `source.upload_completed` | 建立 IngestionJob，啟動攝入管線 |

## 消費 ai 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `search` | `ai.ingestion_completed` | 更新向量索引，RagDocument 標記為可查詢 |
| `source` | `ai.ingestion_completed` | 更新 SourceDocument 狀態為 ready |
| `workspace-audit` | `ai.ingestion_completed / failed` | 記錄攝入稽核軌跡 |
````

## File: modules/ai/domain-services.md
````markdown
# ai — Domain Services

> **Canonical bounded context:** `ai`
> **模組路徑:** `modules/ai/`
> **Domain Type:** Supporting Subdomain

本文件整理 `ai` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/ai/domain-services.md`
- `../../../docs/ddd/ai/aggregates.md`
````

## File: modules/ai/README.md
````markdown
# ai — AI 攝入上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/ai/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`ai` 是 NotebookLM-like 推理能力的攝入協調層，負責把 `source` 交付的來源文件轉成可供 `search` 與 `notebook` 消費的結構化索引材料。它不直接承載使用者問答體驗，而是保證後續推理層有可靠、可追溯的資料基礎。

## 主要職責

| 能力 | 說明 |
|---|---|
| Ingestion Job 管理 | 追蹤 uploaded → parsing → embedding → indexed / failed 狀態生命週期 |
| Worker Handoff | 協調 Next.js 與 `py_fn/` 之間的重型 ingestion 工作交接 |
| Chunk / Index 前處理 | 接收文件切塊與索引前資料，為檢索層準備輸入 |

## 與其他 Bounded Context 協作

- `source` 是上游，提供來源文件與交接事件。
- `search` 消費 `ai` 產生的索引就緒資料；`notebook` 間接建立在這個攝入基礎上。

## 核心聚合 / 核心概念

- **`IngestionJob`**
- **`IngestionDocument`**
- **`IngestionChunk`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/ai/repositories.md
````markdown
# ai — Repositories

> **Canonical bounded context:** `ai`
> **模組路徑:** `modules/ai/`
> **Domain Type:** Supporting Subdomain

本文件整理 `ai` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/GraphRepository.ts`
- `domain/repositories/IngestionJobRepository.ts`

## Infrastructure Implementations

- `infrastructure/InMemoryGraphRepository.ts`
- `infrastructure/InMemoryIngestionJobRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/ai/repositories.md`
- `../../../docs/ddd/ai/aggregates.md`
````

## File: modules/ai/ubiquitous-language.md
````markdown
# Ubiquitous Language — ai

> **範圍：** 僅限 `modules/ai/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 攝入工作 | IngestionJob | RAG 攝入管線的單一工作記錄，追蹤 parse/chunk/embed 的執行狀態 |
| 攝入文件 | IngestionDocument | 交付給攝入管線的文件元資料記錄 |
| 攝入 Chunk | IngestionChunk | 文件切分後的向量化單元（由 py_fn/ 生成） |
| 攝入狀態 | IngestionStatus | Job 的生命週期狀態：`uploaded \| parsing \| embedding \| indexed \| failed` |
| 文件 ID | documentId | 關聯的 source 模組 SourceDocument ID |
| 工作區 ID | workspaceId | Job 所屬的工作區 |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `IngestionJob` | `Job`, `ParseJob`, `EmbedTask` |
| `IngestionDocument` | `Document`, `File`（在 ai BC 內） |
| `IngestionChunk` | `Chunk`, `VectorEntry` |
| `IngestionStatus` | `JobStatus`, `State` |
````

## File: modules/identity/aggregates.md
````markdown
# Aggregates — identity

## 聚合根：Identity

### 職責
代表一個已通過 Firebase Authentication 驗證的使用者。提供讀取身份資訊的能力。

### 屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `uid` | `string` | Firebase UID（主鍵） |
| `email` | `string \| null` | 使用者 Email |
| `displayName` | `string \| null` | 顯示名稱 |
| `photoURL` | `string \| null` | 頭像 URL |

### 不變數

- `uid` 永遠不為空（由 Firebase 保證）
- `Identity` 物件是唯讀的（由 Firebase Auth SDK 產生）

---

## 值物件：TokenRefreshSignal

### 職責
代表「token 需要刷新」的事件訊號，觸發 `account` 域更新 custom claims。

### 屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `uid` | `string` | 需要刷新 token 的使用者 UID |
| `occurredAt` | `string` | ISO 8601 時間戳 |

---

## Repository Interfaces

| 介面 | 主要方法 | 說明 |
|------|---------|------|
| `IdentityRepository` | `signIn()`, `signOut()`, `getCurrentIdentity()` | Firebase Auth 操作 |
| `TokenRefreshRepository` | `listenToTokenRefresh()` | 監聽 token 刷新事件 |
````

## File: modules/identity/application-services.md
````markdown
# identity — Application Services

> **Canonical bounded context:** `identity`
> **模組路徑:** `modules/identity/`
> **Domain Type:** Generic Subdomain

本文件記錄 `identity` 的 application layer 服務與 use cases。內容與 `modules/identity/application/` 實作保持一致。

## Application Layer 職責

封裝 Firebase Authentication，提供登入、登出與 token refresh 能力。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/identity-error-message.ts`
- `application/use-cases/identity.use-cases.ts`
- `application/use-cases/token-refresh.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/identity/README.md`
- 模組 AGENT：`../../../modules/identity/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/identity/application-services.md`
````

## File: modules/identity/context-map.md
````markdown
# Context Map — identity

## 此 BC 的整合模式

### 上游（依賴）

`identity` 是最基礎的 Generic Subdomain，不依賴任何其他業務 BC。

**外部依賴：** Firebase Authentication SDK（第三方服務，Anti-Corruption Layer 在 infrastructure 層）

---

### 下游（被依賴）

#### `account` ← identity（Customer/Supplier）

- **模式：** Customer/Supplier
- **方向：** `identity` 是 Supplier（上游），`account` 是 Customer（下游）
- **整合方式：** `account` application use-cases 在 server 端 import `identity/api` 取得身份上下文
- **關鍵規則：** `identity/api` 不得含任何 `"use client"` 匯出

```
identity/api ──import──► account/application/use-cases/*.ts（server-side）
```

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| identity → account | identity | account | Customer/Supplier |
| Firebase Auth → identity | Firebase | identity | Anti-Corruption Layer |
````

## File: modules/identity/domain-events.md
````markdown
# Domain Events — identity

## 發出事件

`identity` 域目前不發出 DomainEvent（Firebase Auth 事件由 SDK 直接處理，不經過領域事件匯流排）。

未來如需追蹤登入稽核，可考慮加入：

| 潛在事件 | 觸發條件 | 說明 |
|---------|---------|------|
| `identity.signed_in` | 使用者成功登入 | 供 `workspace-audit` 消費 |
| `identity.signed_out` | 使用者登出 | 供稽核紀錄消費 |

## 訂閱事件

`identity` 不訂閱其他 BC 的事件。

## TokenRefreshSignal（非正式事件）

`TokenRefreshSignal` 是透過 `TokenRefreshRepository.listenToTokenRefresh()` 的 Observable 訊號，不是正式的 DomainEvent，但語意上扮演事件角色：

```typescript
// account use-case 消費此訊號
identityApi.listenToTokenRefresh()
  .subscribe(() => accountApi.refreshCustomClaims(uid));
```
````

## File: modules/identity/domain-services.md
````markdown
# identity — Domain Services

> **Canonical bounded context:** `identity`
> **模組路徑:** `modules/identity/`
> **Domain Type:** Generic Subdomain

本文件整理 `identity` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/identity/domain-services.md`
- `../../../docs/ddd/identity/aggregates.md`
````

## File: modules/identity/README.md
````markdown
# identity — 身份驗證上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/identity/`  
> **開發狀態:** ✅ Done — 穩定

## 在 Knowledge Platform / Second Brain 中的角色

`identity` 是整個平台的身份入口，封裝 Firebase Authentication 與 session 起點。它對產品價值並不差異化，但所有工作區、知識與 AI 互動都建立在正確的身份語意之上。

## 主要職責

| 能力 | 說明 |
|---|---|
| 登入 / 登出 | 處理 signIn、signOut 與身份狀態切換 |
| Token 生命週期 | 管理 token refresh 與相關身份訊號 |
| 身份上下文供應 | 向 `account`、`organization`、`workspace` 提供穩定的身份讀取入口 |

## 與其他 Bounded Context 協作

- `account` 直接消費 `identity/api` 提供的身份上下文。
- `organization` 與 `workspace` 依賴身份語意建立成員與存取規則。

## 核心聚合 / 核心概念

- **`Identity`**
- **`AuthenticatedUser`**
- **`TokenRefreshSignal`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/identity/repositories.md
````markdown
# identity — Repositories

> **Canonical bounded context:** `identity`
> **模組路徑:** `modules/identity/`
> **Domain Type:** Generic Subdomain

本文件整理 `identity` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/IdentityRepository.ts`
- `domain/repositories/TokenRefreshRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseIdentityRepository.ts`
- `infrastructure/firebase/FirebaseTokenRefreshRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/identity/repositories.md`
- `../../../docs/ddd/identity/aggregates.md`
````

## File: modules/identity/ubiquitous-language.md
````markdown
# Ubiquitous Language — identity

> **範圍：** 僅限 `modules/identity/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 | 代碼位置 |
|------|------|------|---------|
| 身份 | Identity | Firebase Auth 驗證後的使用者記錄，以 `uid` 為唯一識別碼 | `modules/identity/domain/entities/` |
| 唯一身份碼 | uid | Firebase Authentication 產生的使用者全域唯一 ID | `Identity.uid` |
| Token 刷新訊號 | TokenRefreshSignal | 代表 Firebase ID token 需要更新的訊號物件 | `domain/entities/` |
| 登入 | signIn | 透過 Email 或 OAuth 建立 Firebase Auth session | `IdentityRepository.signIn()` |
| 登出 | signOut | 終止 Firebase Auth session | `IdentityRepository.signOut()` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Identity` | `User`, `AuthUser`, `CurrentUser` |
| `uid` | `userId`, `id`, `accountId`（在此 BC 內） |
| `TokenRefreshSignal` | `RefreshToken`, `TokenEvent` |
````

## File: modules/knowledge/AGENT.md
````markdown
# AGENT.md — knowledge BC

## 模組定位

`knowledge` 是 Core Domain，管理 KnowledgePage 的完整生命週期。`knowledge.page_approved` 是平台的核心整合事件，觸發 workspace-flow 物化流程。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `KnowledgePage` | Page、Document |
| `ContentBlock` | Block、Node、Element |
| `ContentVersion` | Version、Snapshot、History |
| `BlockType` | Type、ContentType |

> `WikiPage` 為 `wiki` BC 的術語；`knowledge` BC 不使用 `WikiPage` 作為通用語言。

## 邊界規則

### ✅ 允許
```typescript
import { knowledgeApi } from "@/modules/knowledge/api";
import type { KnowledgePageDTO, ContentBlockDTO } from "@/modules/knowledge/api";
```

### ❌ 禁止
```typescript
import { ContentPage } from "@/modules/knowledge/domain/entities/content-page.entity";
import { KnowledgePageCreatedEvent } from "@/modules/knowledge/domain/events/knowledge.events";
import type { WikiPage } from "@/modules/wiki/domain/entities/...";
```

## page_approved 事件規則

`knowledge.page_approved` 必須包含：
- `extractedTasks[]` — 供 workspace-flow 建立 Task
- `extractedInvoices[]` — 供 workspace-flow 建立 Invoice
- `actorId`, `causationId`, `correlationId` — 追蹤鏈

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/knowledge/application-services.md
````markdown
# knowledge — Application Services

> **Canonical bounded context:** `knowledge`
> **模組路徑:** `modules/knowledge/`
> **Domain Type:** Core Domain

本文件記錄 `knowledge` 的 application layer 服務與 use cases。內容與 `modules/knowledge/application/` 實作保持一致。

## Application Layer 職責

管理知識頁面、內容區塊與版本歷史，是平台的核心知識內容領域。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/block-service.ts`
- `application/dto/knowledge.dto.ts`
- `application/use-cases/knowledge-block.use-cases.ts`
- `application/use-cases/knowledge-page.use-cases.ts`
- `application/use-cases/knowledge-version.use-cases.ts`
- `application/use-cases/wiki-pages.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/knowledge/README.md`
- 模組 AGENT：`../../../modules/knowledge/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/knowledge/application-services.md`
````

## File: modules/knowledge/context-map.md
````markdown
# Context Map — knowledge

## 上游（依賴）

### identity → knowledge（Customer/Supplier）
- 頁面操作驗證 `createdByUserId`

### workspace → knowledge（Customer/Supplier）
- 頁面隸屬於 `workspaceId`，需驗證工作區歸屬

---

## 下游（被依賴）

### knowledge → workspace-flow（Published Language / Customer-Supplier）

**這是平台最重要的跨 BC 整合點。**

- 整合方式：`knowledge.page_approved` 領域事件（Published Language）
- `workspace-flow` 的 `ContentToWorkflowMaterializer` Process Manager 訂閱此事件
- 從 `extractedTasks[]` 建立 Task，從 `extractedInvoices[]` 建立 Invoice

```
knowledge ─── knowledge.page_approved ───► workspace-flow
                                          (ContentToWorkflowMaterializer)
```

### knowledge → wiki（Customer/Supplier）

- `wiki` 訂閱 `knowledge.page_created` / `knowledge.block_updated` 以同步 GraphNode
- `wiki.GraphNode.id` 對應 `knowledge.KnowledgePage.id`

### knowledge → ai（Customer/Supplier）

- `knowledge.page_approved` 觸發 `ai` 域的 IngestionJob
- RAG 攝入管線的起點

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| identity → knowledge | identity | knowledge | Customer/Supplier |
| workspace → knowledge | workspace | knowledge | Customer/Supplier |
| knowledge → workspace-flow | knowledge | workspace-flow | Published Language (Events) |
| knowledge → wiki | knowledge | wiki | Customer/Supplier（Events） |
| knowledge → ai | knowledge | ai | Customer/Supplier（Events） |
````

## File: modules/knowledge/domain-events.md
````markdown
# Domain Events — knowledge

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `knowledge.page_created` | 新頁面建立時 | `pageId`, `accountId`, `workspaceId?`, `title`, `createdByUserId`, `occurredAt` |
| `knowledge.page_renamed` | 頁面標題變更 | `pageId`, `accountId`, `previousTitle`, `newTitle`, `occurredAt` |
| `knowledge.page_moved` | 頁面移動（parentPageId 變更） | `pageId`, `accountId`, `previousParentPageId`, `newParentPageId`, `occurredAt` |
| `knowledge.page_archived` | 頁面歸檔 | `pageId`, `accountId`, `occurredAt` |
| `knowledge.page_approved` | 使用者核准 AI 生成草稿 | 見下方詳細定義 |
| `knowledge.block_added` | 區塊新增 | `blockId`, `pageId`, `accountId`, `contentText`, `occurredAt` |
| `knowledge.block_updated` | 區塊內容更新 | `blockId`, `pageId`, `accountId`, `contentText`, `occurredAt` |
| `knowledge.block_deleted` | 區塊刪除 | `blockId`, `pageId`, `accountId`, `occurredAt` |
| `knowledge.version_published` | 版本快照手動發佈 | `versionId`, `pageId`, `accountId`, `label`, `createdByUserId`, `occurredAt` |

## 最重要事件：knowledge.page_approved

```typescript
// 代碼位置：modules/knowledge/domain/events/knowledge.events.ts
interface KnowledgePageApprovedEvent {
  readonly type: "knowledge.page_approved";
  readonly aggregateId: string;      // KnowledgePage ID
  readonly pageId: string;
  readonly occurredAt: string;       // ISO 8601（注意：此 BC 用 occurredAt，非 occurredAtISO）
  readonly extractedTasks: ReadonlyArray<{
    readonly title: string;
    readonly dueDate?: string;
    readonly description?: string;
  }>;
  readonly extractedInvoices: ReadonlyArray<{
    readonly amount: number;
    readonly description: string;
    readonly currency?: string;    // 預設 "TWD"
  }>;
  readonly actorId: string;          // 執行審批的使用者 ID
  readonly causationId: string;      // 觸發命令 ID
  readonly correlationId: string;    // 業務流程追蹤 ID
}
```

## 訂閱事件（消費端）

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `identity` | `TokenRefreshSignal` | 更新使用者 session |

## 消費 knowledge 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `workspace-flow` | `knowledge.page_approved` | ContentToWorkflowMaterializer 建立 Task、Invoice |
| `wiki` | `knowledge.page_created`, `knowledge.block_updated` | 同步 GraphNode |
| `ai` | `knowledge.page_approved` | 觸發 IngestionJob |
````

## File: modules/knowledge/domain-services.md
````markdown
# knowledge — Domain Services

> **Canonical bounded context:** `knowledge`
> **模組路徑:** `modules/knowledge/`
> **Domain Type:** Core Domain

本文件整理 `knowledge` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/knowledge/domain-services.md`
- `../../../docs/ddd/knowledge/aggregates.md`
````

## File: modules/knowledge/README.md
````markdown
# knowledge — 知識內容上下文

> **Domain Type:** **Core Domain**（核心域）  
> **模組路徑:** `modules/knowledge/`  
> **開發狀態:** 🚧 Developing — 積極開發中

## 在 Knowledge Platform / Second Brain 中的角色

`knowledge` 是 Xuanwu 的 Notion-like 核心內容層，負責知識頁面、內容區塊、版本與審批生命週期。它是整個 Knowledge Platform / Second Brain 的中心，決定知識如何被建立、保存、演進與交付給下游協作。

## 主要職責

| 能力 | 說明 |
|---|---|
| Knowledge Page 生命週期 | 建立、編輯、版本化、歸檔與審批知識頁面 |
| 內容區塊管理 | 維護文字、標題、媒體、列表等內容區塊結構 |
| 審批後協作啟動 | 發出 `knowledge.page_approved` 等事件，驅動後續工作流程與知識流轉 |

## 與其他 Bounded Context 協作

- `workspace` 提供知識內容的歸屬容器；`source` 提供外部文件入口。
- `wiki` 把知識內容轉成結構化圖譜；`workspace-flow` 以審批事件物化任務與發票。
- `search` 與 `notebook` 消費知識內容做檢索、摘要與問答。

## 核心聚合 / 核心概念

- **`KnowledgePage`**
- **`ContentBlock`**
- **`ContentVersion`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/knowledge/repositories.md
````markdown
# knowledge — Repositories

> **Canonical bounded context:** `knowledge`
> **模組路徑:** `modules/knowledge/`
> **Domain Type:** Core Domain

本文件整理 `knowledge` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/WikiPageRepository.ts`
- `domain/repositories/knowledge.repositories.ts`

## Infrastructure Implementations

- `infrastructure/InMemoryKnowledgeRepository.ts`
- `infrastructure/firebase/FirebaseContentBlockRepository.ts`
- `infrastructure/firebase/FirebaseContentPageRepository.ts`
- `infrastructure/index.ts`
- `infrastructure/repositories/firebase-wiki-page.repository.ts`
- `infrastructure/repositories/in-memory-wiki-page.repository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/knowledge/repositories.md`
- `../../../docs/ddd/knowledge/aggregates.md`
````

## File: modules/knowledge/ubiquitous-language.md
````markdown
# Ubiquitous Language — knowledge

> **範圍：** 僅限 `modules/knowledge/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 | 代碼位置 |
|------|------|------|---------|
| 知識頁面 | KnowledgePage | 核心知識單元，含 title、parentPageId、blockIds | `domain/entities/content-page.entity.ts` |
| 內容區塊 | ContentBlock | 頁面內的原子內容單元（id、pageId、blockType、content、order） | `domain/entities/content-block.entity.ts` |
| 區塊類型 | BlockType | `text \| heading-1 \| heading-2 \| image \| code \| bullet-list \| ...` | `domain/entities/block.ts` |
| 版本快照 | ContentVersion | 頁面的歷史快照（snapshotBlocks、editSummary、authorId） | `domain/entities/content-version.entity.ts` |
| 頁面審批 | PageApproval | 使用者核准 AI 生成草稿的動作，觸發 `knowledge.page_approved` | — |
| 抽取任務 | ExtractedTask | 從頁面內容提取的任務定義（title、dueDate、description） | `domain/events/knowledge.events.ts` |
| 抽取發票 | ExtractedInvoice | 從頁面內容提取的發票定義（amount、description、currency） | `domain/events/knowledge.events.ts` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `KnowledgePage` | `Page`, `Document`, `Note` |
| `ContentBlock` | `Block`, `Node`, `Element` |
| `ContentVersion` | `History`, `Snapshot`, `Revision` |

> `WikiPage` 為 `wiki` BC 術語，不屬於 `knowledge` BC 通用語言。
````

## File: modules/notebook/aggregates.md
````markdown
# Aggregates — notebook

## 聚合根：Thread

### 職責
代表一個 AI 對話串。持有有序的 Message 列表，管理對話歷史。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `ID` | Thread 主鍵 |
| `messages` | `Message[]` | 有序訊息列表 |
| `createdAt` | `string` | ISO 8601 |
| `updatedAt` | `string` | ISO 8601 |

### 不變數

- messages 列表維持追加順序，不可重新排序
- Thread 不可刪除 Message（只能追加）

---

## 值物件：Message

### 職責
Thread 中的單則訊息，不可變（immutable）。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `ID` | 訊息主鍵 |
| `role` | `MessageRole` | `"user" \| "assistant" \| "system"` |
| `content` | `string` | 訊息內容文字 |
| `createdAt` | `string` | ISO 8601 |

---

## Repository Interfaces

| 介面 | 說明 |
|------|------|
| `NotebookRepository` | 封裝 Genkit AI 呼叫：`generateResponse(input)` |

### GenerateNotebookResponseInput

```typescript
interface GenerateNotebookResponseInput {
  readonly prompt: string;
  readonly model?: string;    // 預設 Gemini 2.0 flash
  readonly system?: string;   // System prompt
}
```

### GenerateNotebookResponseResult

```typescript
type GenerateNotebookResponseResult =
  | { ok: true; data: NotebookResponse }
  | { ok: false; error: DomainError };

interface NotebookResponse {
  readonly text: string;
  readonly model: string;
  readonly finishReason?: string;
}
```
````

## File: modules/notebook/application-services.md
````markdown
# notebook — Application Services

> **Canonical bounded context:** `notebook`
> **模組路徑:** `modules/notebook/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `notebook` 的 application layer 服務與 use cases。內容與 `modules/notebook/application/` 實作保持一致。

## Application Layer 職責

管理 AI 對話 Thread/Message，並封裝模型生成回應。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/index.ts`
- `application/use-cases/answer-rag-query.use-case.ts`
- `application/use-cases/generate-agent-response.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/notebook/README.md`
- 模組 AGENT：`../../../modules/notebook/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/notebook/application-services.md`
````

## File: modules/notebook/domain-events.md
````markdown
# Domain Events — notebook

## 發出事件

`notebook` 域目前不發出 DomainEvent。AI 對話是使用者互動的即時回應，不需要下游事件消費。

未來可考慮：

| 潛在事件 | 觸發條件 | 說明 |
|---------|---------|------|
| `notebook.thread_created` | 新 Thread 建立 | 供 workspace-audit 記錄 |
| `notebook.response_generated` | AI 回應完成 | 供 token 使用量追蹤 |

## 訂閱事件

`notebook` 不訂閱其他 BC 的事件。

## 整合說明

`notebook` 透過**同步查詢**（非事件）消費其他 BC 的能力：

- **`search`**：呼叫 `search/api.answerRagQuery()` 取得語意相關 chunks（用於 RAG-augmented 對話）
- **`wiki`**：可查詢 wiki 圖譜以取得知識上下文（未來）
````

## File: modules/notebook/domain-services.md
````markdown
# notebook — Domain Services

> **Canonical bounded context:** `notebook`
> **模組路徑:** `modules/notebook/`
> **Domain Type:** Supporting Subdomain

本文件整理 `notebook` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/notebook/domain-services.md`
- `../../../docs/ddd/notebook/aggregates.md`
````

## File: modules/notebook/ubiquitous-language.md
````markdown
# Ubiquitous Language — notebook

> **範圍：** 僅限 `modules/notebook/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 對話串 | Thread | 一組有序的對話訊息集合，是 AI 對話的持久化單元 |
| 訊息 | Message | Thread 中的單則訊息（含 role 和 content） |
| 訊息角色 | MessageRole | 訊息發出者的角色：`"user" \| "assistant" \| "system"` |
| 筆記本回應 | NotebookResponse | AI 模型對一次 prompt 的回應結果（含 text、model） |
| 生成輸入 | GenerateNotebookResponseInput | 呼叫 AI 生成的輸入（prompt、model?、system?） |
| 筆記本庫 | NotebookRepository | 封裝 Genkit AI 呼叫的 Repository port |

## 棄用術語（已移至 search）

| 棄用術語 | 新位置 |
|----------|--------|
| `RagQuery` / `RagCitation` | `modules/search/domain/entities/RagQuery.ts` |
| `RagGenerationRepository` | `modules/search/domain/repositories/RagGenerationRepository.ts` |
| `RagRetrievalRepository` | `modules/search/domain/repositories/RagRetrievalRepository.ts` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Thread` | `Conversation`, `Chat`, `Session` |
| `Message` | `ChatMessage`, `Turn` |
| `NotebookResponse` | `AIResponse`, `LLMOutput` |
````

## File: modules/notification/AGENT.md
````markdown
# AGENT.md — notification BC

## 模組定位

`notification` 是通知分發的通用子域，負責系統通知的建立、發送與讀取。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `NotificationEntity` | Notification（作為 class 名），Alert, Message（作為通知） |
| `recipientId` | userId, receiverId |
| `NotificationType` | Type, AlertLevel |
| `DispatchNotificationInput` | CreateNotification, SendNotification |

## 邊界規則

### ✅ 允許
```typescript
import { notificationApi } from "@/modules/notification/api";
import type { NotificationDTO } from "@/modules/notification/api";
```

### ❌ 禁止
```typescript
import { NotificationEntity } from "@/modules/notification/domain/entities/Notification";
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/notification/aggregates.md
````markdown
# Aggregates — notification

## 聚合根：NotificationEntity

### 職責
代表一則系統通知記錄。管理通知的發送與讀取狀態。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 通知主鍵 |
| `recipientId` | `string` | 接收者帳戶 ID |
| `title` | `string` | 通知標題 |
| `message` | `string` | 通知內容 |
| `type` | `NotificationType` | `info \| alert \| success \| warning` |
| `read` | `boolean` | 是否已讀 |
| `timestamp` | `number` | Unix timestamp（毫秒） |
| `sourceEventType` | `string?` | 觸發此通知的事件類型 |
| `metadata` | `Record<string, unknown>?` | 附加元資料 |

### 不變數

- `recipientId` 不可為空
- `title` 不可為空

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `NotificationRepository` | `save()`, `findByRecipient()`, `markAsRead()` |
````

## File: modules/notification/application-services.md
````markdown
# notification — Application Services

> **Canonical bounded context:** `notification`
> **模組路徑:** `modules/notification/`
> **Domain Type:** Generic Subdomain

本文件記錄 `notification` 的 application layer 服務與 use cases。內容與 `modules/notification/application/` 實作保持一致。

## Application Layer 職責

負責系統通知分發與通知讀取狀態管理。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/use-cases/notification.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/notification/README.md`
- 模組 AGENT：`../../../modules/notification/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/notification/application-services.md`
````

## File: modules/notification/context-map.md
````markdown
# Context Map — notification

## 上游（依賴）

### 所有業務 BC → notification（Published Language）

`notification` 訂閱各 BC 的業務事件，轉換為使用者通知。不直接依賴任何 BC 的 api。

---

## 下游（被依賴）

`notification` 不被其他 BC 依賴（通知是終端輸出，無下游）。

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| workspace → notification | workspace | notification | Published Language (Events) |
| workspace-flow → notification | workspace-flow | notification | Published Language (Events) |
| 其他 BC → notification | 各 BC | notification | Published Language (Events) |
````

## File: modules/notification/domain-events.md
````markdown
# Domain Events — notification

## 發出事件

`notification` 域不發出 DomainEvent（通知本身是事件的結果，而非事件的來源）。

## 訂閱事件

`notification` 是各 BC 事件的**消費端**，訂閱業務事件並轉換為使用者通知：

| 來源 BC | 訂閱事件 | 通知內容 |
|---------|---------|---------|
| `workspace` | `workspace.member_joined` | 新成員加入通知 |
| `workspace-flow` | `workspace-flow.task_status_changed` | 任務狀態變更通知 |
| `workspace-audit` | 稽核紀錄變化 | 重要稽核事件通知（未來） |

## 說明

通知系統的角色是「事件翻譯器」：
1. 其他 BC 發出領域事件
2. notification 訂閱並翻譯為使用者可讀的通知
3. 通知推送給對應的 recipientId

這是典型的 **Published Language** 模式，notification 作為 Conformist 消費者。
````

## File: modules/notification/domain-services.md
````markdown
# notification — Domain Services

> **Canonical bounded context:** `notification`
> **模組路徑:** `modules/notification/`
> **Domain Type:** Generic Subdomain

本文件整理 `notification` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/notification/domain-services.md`
- `../../../docs/ddd/notification/aggregates.md`
````

## File: modules/notification/README.md
````markdown
# notification — 通知上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/notification/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`notification` 提供跨平台的通知分發能力，將知識、工作流程與工作區互動轉成使用者可感知的訊息。它是典型平台配套能力，但對協作效率與回應速度很重要。

## 主要職責

| 能力 | 說明 |
|---|---|
| 通知分發 | 發送 info / alert / success / warning 等系統訊息 |
| 事件轉訊息 | 把其他上下文的事件轉成使用者可消費的通知 |
| 通知偏好支撐 | 配合 `account` 與 `workspace` 的偏好設定輸出通知行為 |

## 與其他 Bounded Context 協作

- `workspace-feed`、`workspace-flow`、`workspace` 等上下文會觸發通知需求。
- `account` 提供使用者偏好與收件對象語意。

## 核心聚合 / 核心概念

- **`NotificationEntity`**
- **`NotificationPayload`**
- **`NotificationPreference`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/notification/repositories.md
````markdown
# notification — Repositories

> **Canonical bounded context:** `notification`
> **模組路徑:** `modules/notification/`
> **Domain Type:** Generic Subdomain

本文件整理 `notification` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/NotificationRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseNotificationRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/notification/repositories.md`
- `../../../docs/ddd/notification/aggregates.md`
````

## File: modules/notification/ubiquitous-language.md
````markdown
# Ubiquitous Language — notification

> **範圍：** 僅限 `modules/notification/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 通知 | NotificationEntity | 一則系統通知記錄（含標題、內容、類型、讀取狀態） |
| 接收者 ID | recipientId | 接收此通知的帳戶 ID |
| 通知類型 | NotificationType | `"info" \| "alert" \| "success" \| "warning"` |
| 分發通知輸入 | DispatchNotificationInput | 建立並發送通知的輸入物件 |
| 來源事件類型 | sourceEventType | 觸發此通知的業務事件類型（可選，用於追蹤） |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `NotificationEntity` | `Notification`（避免與 JS Notification API 衝突） |
| `recipientId` | `userId`, `receiverId` |
````

## File: modules/organization/AGENT.md
````markdown
# AGENT.md — organization BC

## 模組定位

`organization` 是 Xuanwu 的多租戶管理有界上下文，管理 Organization 聚合根、成員、隊伍與邀請流程。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Organization` | Company、Tenant、Team（作為頂層組織）、Client |
| `MemberReference` | Member、User（在組織上下文中）|
| `Team` | Group、Squad（作為組織子群組） |
| `PartnerInvite` | Invitation、InviteLink |
| `OrganizationRole` | Role、Permission（作為組織角色） |
| `Presence` | Status、OnlineStatus |

## 邊界規則

### ✅ 允許
```typescript
import { organizationApi } from "@/modules/organization/api";
import type { OrganizationDTO, MemberReferenceDTO } from "@/modules/organization/api";
```

### ❌ 禁止
```typescript
import { Organization } from "@/modules/organization/domain/entities/Organization";
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/organization/aggregates.md
````markdown
# Aggregates — organization

## 聚合根：Organization

### 職責
代表一個企業或團隊租戶。管理所有成員、隊伍與合作夥伴邀請的生命週期。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 組織主鍵 |
| `name` | `string` | 組織名稱 |
| `members` | `MemberReference[]` | 成員列表（含 role） |
| `teams` | `Team[]` | 子隊伍列表 |
| `partnerInvites` | `PartnerInvite[]` | 未完成的邀請列表 |

### 不變數

- 同一 accountId 在同一 Organization 中只能有一個 MemberReference
- `Owner` 角色至少需要一位（不可移除最後一個 Owner）
- 過期的 PartnerInvite（`expired`）不能再被接受

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `MemberReference` | 成員快照（id, name, email, role, presence） |
| `Team` | 子群組（id, name, type, memberIds） |
| `PartnerInvite` | 邀請記錄（email, role, inviteState, invitedAt） |
| `OrganizationRole` | `"Owner" \| "Admin" \| "Member" \| "Guest"` |
| `Presence` | `"active" \| "away" \| "offline"` |
| `InviteState` | `"pending" \| "accepted" \| "expired"` |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `OrganizationRepository` | `save()`, `findById()`, `findByMemberId()` |
````

## File: modules/organization/application-services.md
````markdown
# organization — Application Services

> **Canonical bounded context:** `organization`
> **模組路徑:** `modules/organization/`
> **Domain Type:** Generic Subdomain

本文件記錄 `organization` 的 application layer 服務與 use cases。內容與 `modules/organization/application/` 實作保持一致。

## Application Layer 職責

管理多租戶組織、成員、隊伍與邀請流程。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/use-cases/organization-policy.use-cases.ts`
- `application/use-cases/organization.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/organization/README.md`
- 模組 AGENT：`../../../modules/organization/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/organization/application-services.md`
````

## File: modules/organization/context-map.md
````markdown
# Context Map — organization

## 上游（依賴）

### account → organization（Customer/Supplier）

- `organization.members[]` 中的 `MemberReference.id` 參照 `account` 的 accountId
- 查詢成員 profile 時呼叫 `account/api`

---

## 下游（被依賴）

### organization → workspace（Customer/Supplier）

- `Workspace.accountId + accountType="organization"` 關聯至 Organization
- 工作區列表依 organizationId 篩選

### organization → workspace-audit（Published Language）

- 成員加入/移除事件供 `workspace-audit` 消費（未來事件 sink 完成後）

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| account → organization | account | organization | Customer/Supplier |
| organization → workspace | organization | workspace | Customer/Supplier |
| organization → workspace-audit | organization | workspace-audit | Published Language (Events) |
````

## File: modules/organization/domain-events.md
````markdown
# Domain Events — organization

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `organization.created` | 新組織建立時 | `organizationId`, `name`, `ownerId`, `occurredAt` |
| `organization.member_invited` | 成員被邀請加入 | `organizationId`, `inviteId`, `email`, `role`, `occurredAt` |
| `organization.member_joined` | 邀請被接受，成員加入 | `organizationId`, `accountId`, `role`, `occurredAt` |
| `organization.member_removed` | 成員被移除 | `organizationId`, `accountId`, `occurredAt` |
| `organization.team_created` | 新 Team 建立 | `organizationId`, `teamId`, `occurredAt` |

## 訂閱事件

`organization` 不訂閱其他 BC 的事件（被動，等待 account 操作觸發）。

## 事件格式範例

```typescript
interface OrganizationMemberJoinedEvent {
  readonly type: "organization.member_joined";
  readonly organizationId: string;
  readonly accountId: string;
  readonly role: OrganizationRole;
  readonly occurredAt: string;  // ISO 8601
}
```
````

## File: modules/organization/domain-services.md
````markdown
# organization — Domain Services

> **Canonical bounded context:** `organization`
> **模組路徑:** `modules/organization/`
> **Domain Type:** Generic Subdomain

本文件整理 `organization` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/organization/domain-services.md`
- `../../../docs/ddd/organization/aggregates.md`
````

## File: modules/organization/README.md
````markdown
# organization — 組織上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/organization/`  
> **開發狀態:** ✅ Done — 穩定

## 在 Knowledge Platform / Second Brain 中的角色

`organization` 是平台多租戶治理層，負責定義團隊、成員與組織級關係。它把個人帳戶提升到群體協作層，為工作區與知識協作提供治理邊界。

## 主要職責

| 能力 | 說明 |
|---|---|
| 組織管理 | 建立與維護 Organization 聚合 |
| 成員與團隊治理 | 管理 MemberReference、Team 與組織內角色 |
| 邀請與夥伴協作 | 處理 PartnerInvite 與跨組織協作入口 |

## 與其他 Bounded Context 協作

- `account` 提供個人帳戶語意；`workspace` 以組織為主要歸屬邊界。
- `workspace-audit` 與 `notification` 會消費組織事件或範圍資訊。

## 核心聚合 / 核心概念

- **`Organization`**
- **`MemberReference`**
- **`Team`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/organization/repositories.md
````markdown
# organization — Repositories

> **Canonical bounded context:** `organization`
> **模組路徑:** `modules/organization/`
> **Domain Type:** Generic Subdomain

本文件整理 `organization` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/OrganizationRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseOrganizationRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/organization/repositories.md`
- `../../../docs/ddd/organization/aggregates.md`
````

## File: modules/organization/ubiquitous-language.md
````markdown
# Ubiquitous Language — organization

> **範圍：** 僅限 `modules/organization/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 組織 | Organization | 頂層多租戶單元，代表一個企業或團隊 |
| 成員參照 | MemberReference | 組織成員的輕量參照（含 accountId、role、presence） |
| 隊伍 | Team | 組織內的子群組（internal / external 類型） |
| 合作夥伴邀請 | PartnerInvite | 邀請外部合作夥伴加入隊伍的邀請記錄 |
| 組織角色 | OrganizationRole | 成員在組織中的角色：`Owner \| Admin \| Member \| Guest` |
| 在線狀態 | Presence | 成員的當前狀態：`active \| away \| offline` |
| 邀請狀態 | InviteState | 邀請的當前狀態：`pending \| accepted \| expired` |
| 政策效果 | PolicyEffect | 組織政策的效果：`allow \| deny` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Organization` | `Company`, `Tenant`, `Client` |
| `MemberReference` | `Member`, `OrgUser` |
| `OrganizationRole` | `Role`, `Permission` |
````

## File: modules/search/AGENT.md
````markdown
# AGENT.md — search BC

## 模組定位

`search` 是 RAG 語意檢索的支援域，提供向量搜尋、RAG answer 生成與查詢反饋收集。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `RagQuery` | Query、SearchQuery、VectorQuery |
| `RagQueryFeedback` | Feedback、Rating |
| `RagRetrievedChunk` | Chunk、SearchResult |
| `RagCitation` | Citation、Source、Reference |
| `VectorStore` | VectorDB、EmbeddingStore |
| `RagRetrievalRepository` | RetrievalRepo、SearchRepo |
| `RagGenerationRepository` | GenerationRepo、AIRepo |

## 最重要邊界規則：Server vs Client Import

```typescript
// ✅ server code（Server Action、API route）
import { searchApi } from "@/modules/search/api";

// ✅ client code（React Component）
import { RagView } from "@/modules/search"; // root barrel

// ❌ 禁止：在 /api barrel 匯出 "use client" UI 元件
// RagView, RagQueryView 只能從 root barrel 匯出
```

## 邊界規則

### ❌ 禁止
```typescript
// api/index.ts 不得 re-export "use client" 元件
export { RagView } from "./interfaces/components/RagView"; // 禁止在 api/
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/search/aggregates.md
````markdown
# Aggregates — search

## 聚合根：RagQueryFeedback

### 職責
收集並持久化使用者對 RAG 查詢答案品質的反饋。支援持續改善 RAG 品質。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `feedbackId` | `string` | 反饋主鍵 |
| `queryId` | `string` | 關聯的查詢 ID |
| `helpful` | `boolean` | 是否有用 |
| `comment` | `string \| null` | 文字評論（可選） |
| `submittedAt` | `string` | ISO 8601 |

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `RagRetrievedChunk` | 檢索到的 chunk（chunkId, docId, chunkIndex, text, score, taxonomy） |
| `RagCitation` | 引用資訊（chunkId, docId, text, score） |
| `VectorDocument` | 向量索引文件（id, content, metadata, embedding） |
| `WikiCitation` | Wiki RAG 引用（pageId, pageTitle, text, score） |

---

## Ports（Hexagonal Architecture）

| Port | 說明 |
|------|------|
| `IVectorStore` | 向量資料庫抽象（`index()`, `search()`, `deleteByDocId()`） |
| `RagRetrievalRepository` | Chunk 向量搜尋操作 |
| `RagGenerationRepository` | AI 答案生成（組合 chunks + Genkit 呼叫） |
| `RagQueryFeedbackRepository` | 反饋持久化 |
| `WikiContentRepository` | Wiki 整合 RAG 查詢（`queryWikiRag()`, `reindexWikiDocument()`） |
````

## File: modules/search/application-services.md
````markdown
# search — Application Services

> **Canonical bounded context:** `search`
> **模組路徑:** `modules/search/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `search` 的 application layer 服務與 use cases。內容與 `modules/search/application/` 實作保持一致。

## Application Layer 職責

提供向量檢索、RAG answer 生成與查詢反饋收集。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/use-cases/answer-rag-query.use-case.ts`
- `application/use-cases/submit-rag-feedback.use-case.ts`
- `application/use-cases/wiki-rag.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/search/README.md`
- 模組 AGENT：`../../../modules/search/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/search/application-services.md`
````

## File: modules/search/context-map.md
````markdown
# Context Map — search

## 上游（依賴）

### ai → search（Customer/Supplier）

- `ai.ingestion_completed` 通知 `search` 更新向量索引
- `search` 依賴 `ai` 生成的 IngestionChunk（embedding 向量）

### wiki → search（Customer/Supplier）

- `wiki.node_activated` 觸發 `search` 更新節點向量表示

---

## 下游（被依賴）

### search → notebook（Customer/Supplier）

- `notebook` 呼叫 `search/api.answerRagQuery()` 取得 RAG chunks 與答案
- 這是同步查詢，不是事件

### search → Wiki UI（Interfaces）

- `RagView`, `RagQueryView` 從 `modules/search` root barrel 匯出（非 /api）
- Wiki 頁面直接呼叫 `search/api` Server Actions

---

## Import 路由

```
server code (Server Action, API route) → import from @/modules/search/api
client code (React Component)          → import from @/modules/search (root barrel)
```

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| ai → search | ai | search | Published Language (Events) |
| wiki → search | wiki | search | Published Language (Events) |
| search → notebook | search | notebook | Customer/Supplier（同步） |
| search → Wiki UI | search | app/ | Conformist |
````

## File: modules/search/domain-events.md
````markdown
# Domain Events — search

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `search.feedback_submitted` | 使用者提交 RagQueryFeedback | `feedbackId`, `queryId`, `helpful`, `occurredAt` |
| `search.index_updated` | 向量索引更新完成（文件重新索引） | `documentId`, `chunkCount`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `ai` | `ai.ingestion_completed` | 新 chunks 的 embedding 已就緒，觸發向量索引更新 |
| `wiki` | `wiki.node_activated` | 同步更新節點內容到向量索引 |

## 消費 search 事件的其他 BC

`search` 主要提供**同步查詢服務**（非事件），被 `notebook` 和 wiki RAG UI 直接呼叫：

```typescript
// notebook 呼叫 search 的同步查詢
const result = await searchApi.answerRagQuery({
  organizationId,
  userQuery,
  topK: 5,
});
```
````

## File: modules/search/domain-services.md
````markdown
# search — Domain Services

> **Canonical bounded context:** `search`
> **模組路徑:** `modules/search/`
> **Domain Type:** Supporting Subdomain

本文件整理 `search` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/search/domain-services.md`
- `../../../docs/ddd/search/aggregates.md`
````

## File: modules/search/README.md
````markdown
# search — 語意檢索上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/search/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`search` 是 NotebookLM-like 推理層的檢索核心，負責從向量索引與知識內容中擷取最相關的引用材料，為摘要、問答與洞察建立可追溯的語意上下文。

## 主要職責

| 能力 | 說明 |
|---|---|
| 向量檢索 | 執行語意相似度搜尋與結果排序 |
| RAG Answer 組合 | 組合 retrieved chunks、引用與答案內容 |
| 反饋收集 | 記錄 RagQueryFeedback 以改進檢索品質 |

## 與其他 Bounded Context 協作

- `ai` 提供索引就緒資料；`notebook` 是主要消費者。
- `knowledge` 與 `wiki` 提供被檢索的知識主體與結構資訊。

## 核心聚合 / 核心概念

- **`RagQuery`**
- **`RagQueryFeedback`**
- **`VectorStore`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/search/repositories.md
````markdown
# search — Repositories

> **Canonical bounded context:** `search`
> **模組路徑:** `modules/search/`
> **Domain Type:** Supporting Subdomain

本文件整理 `search` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/RagGenerationRepository.ts`
- `domain/repositories/RagQueryFeedbackRepository.ts`
- `domain/repositories/RagRetrievalRepository.ts`
- `domain/repositories/WikiContentRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseRagQueryFeedbackRepository.ts`
- `infrastructure/firebase/FirebaseRagRetrievalRepository.ts`
- `infrastructure/firebase/FirebaseWikiContentRepository.ts`
- `infrastructure/genkit/GenkitRagGenerationRepository.ts`
- `infrastructure/genkit/client.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/search/repositories.md`
- `../../../docs/ddd/search/aggregates.md`
````

## File: modules/search/ubiquitous-language.md
````markdown
# Ubiquitous Language — search

> **範圍：** 僅限 `modules/search/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| RAG 查詢 | RagQuery | 一次 Retrieval-Augmented Generation 查詢請求 |
| RAG 已檢索 Chunk | RagRetrievedChunk | 向量搜尋返回的單一相關文件片段（含相似度分數） |
| RAG 引用 | RagCitation | AI 答案引用的 chunk 來源資訊 |
| RAG 答案輸出 | AnswerRagQueryOutput | 包含生成答案文字與引用列表的輸出 |
| 查詢反饋 | RagQueryFeedback | 使用者對 RAG 答案品質的評分記錄 |
| 向量存儲 | VectorStore | 向量資料庫的 Hexagonal Port（IVectorStore 介面） |
| Wiki 引用 | WikiCitation | Wiki 整合 RAG 的引用格式（含 pageId、pageTitle） |
| 向量文件 | VectorDocument | 要索引至向量資料庫的文件記錄 |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `RagQuery` | `SearchQuery`, `Query` |
| `RagRetrievedChunk` | `SearchResult`, `Chunk` |
| `RagCitation` | `Citation`, `Source` |
| `VectorStore` | `VectorDB`, `EmbeddingDB` |
````

## File: modules/shared/AGENT.md
````markdown
# AGENT.md — shared BC

## 模組定位

`shared` 是 Shared Kernel，提供所有 BC 共同依賴的最小基礎型別集。修改任何 shared/ 型別前，需確認所有消費方的影響。

## 最重要規則：DomainEvent 欄位名稱

```typescript
// ✅ 正確：occurredAt（ISO string）
interface MyEvent {
  readonly type: "module.action";
  readonly occurredAt: string;  // ISO 8601
}

// ❌ 錯誤：不存在 occurredAtISO 欄位
interface WrongEvent {
  readonly occurredAtISO: string;  // 不正確
}
```

## 通用語言

| 正確術語 | 禁止使用 |
|----------|----------|
| `DomainEvent` | BaseEvent, Event |
| `occurredAt` | occurredAtISO, timestamp（作為 DomainEvent 欄位） |
| `EventRecord` | AuditRecord（在此 BC 內） |

## 邊界規則

- `shared/` 內不放業務邏輯
- 只放多個 BC 都需要的最小型別
- 任何新增需要全域共識

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/shared/application-services.md
````markdown
# shared — Application Services

> **Canonical bounded context:** `shared`
> **模組路徑:** `modules/shared/`
> **Domain Type:** Shared Kernel

本文件記錄 `shared` 的 application layer 服務與 use cases。內容與 `modules/shared/application/` 實作保持一致。

## Application Layer 職責

提供所有 bounded contexts 共用的最小型別與事件合約，是 Shared Kernel。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/publish-domain-event.ts`

## 設計對齊

- 模組 README：`../../../modules/shared/README.md`
- 模組 AGENT：`../../../modules/shared/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/shared/application-services.md`
````

## File: modules/shared/context-map.md
````markdown
# Context Map — shared

## Shared Kernel 的特殊地位

`shared` 不是普通的 Customer/Supplier 關係。它是 **Shared Kernel** 模式：

> 「兩個 Team 共同擁有一個小型共享模型，任何一方的修改都需要另一方的協調。」
> — Vaughn Vernon, IDDD

## 關係

所有 16 個 BC 都依賴 `shared/`，但這不是普通的依賴關係——它是**共同擁有的合約**：

```
modules/shared/
  ↑ import by all 16 BCs
```

## 規則

1. `shared/` 的任何變更（特別是 `DomainEvent` 介面）都必須同步更新所有消費方
2. 不允許任何 BC 反向依賴（shared/ 不 import 任何 BC）
3. `shared/` 只包含所有 BC 都認可的最小公共型別

## IDDD 整合模式

| 關係 | 模式 |
|------|------|
| shared ← 所有 BC | Shared Kernel |
````

## File: modules/shared/domain-events.md
````markdown
# Domain Events — shared

## 說明

`shared` 是 Shared Kernel，本身不發出或訂閱業務領域事件。

它提供的是**所有 BC 發出事件所需的基礎介面**：

```typescript
// 所有模組的領域事件都遵循此結構
interface DomainEvent {
  readonly type: string;        // "module.entity.action" 格式
  readonly occurredAt: string;  // ISO 8601
}
```

## 事件命名規範（全域）

| 規則 | 範例 |
|------|------|
| 格式 | `<module>.<entity>.<action>` 或 `<module>.<action>` |
| 大小寫 | 全小寫，底線分隔 |
| 時態 | **過去式**（代表已發生的事實） |

```typescript
// ✅ 正確命名
"knowledge.page_created"
"workspace.member_joined"
"workspace-flow.task_status_changed"

// ❌ 錯誤命名
"CreatePage"         // 現在式、大寫
"PageCreatedEvent"   // 有 Event 後綴
```
````

## File: modules/shared/domain-services.md
````markdown
# shared — Domain Services

> **Canonical bounded context:** `shared`
> **模組路徑:** `modules/shared/`
> **Domain Type:** Shared Kernel

本文件整理 `shared` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/shared/domain-services.md`
- `../../../docs/ddd/shared/aggregates.md`
````

## File: modules/shared/README.md
````markdown
# shared — 共享核心上下文

> **Domain Type:** Shared Kernel  
> **模組路徑:** `modules/shared/`  
> **開發狀態:** ✅ Done — 穩定

## 在 Knowledge Platform / Second Brain 中的角色

`shared` 不是獨立業務能力，而是多個 bounded context 共同依賴的 Shared Kernel。它提供穩定共享的事件、值物件與工具型別，目標是減少重複而不形成隱性大泥球。

## 主要職責

| 能力 | 說明 |
|---|---|
| 共享型別 | 提供跨模組穩定共用的事件與值物件基礎型別 |
| 事件基礎語意 | 維持 `DomainEvent`、`EventRecord` 等跨域契約一致 |
| 工具與通用值物件 | 提供 slug、識別碼與其他低變動共享能力 |

## 與其他 Bounded Context 協作

- 所有上下文都可能依賴 `shared`，但只能消費穩定共享核心，不能把業務邏輯堆入此模組。
- `shared` 的變更需視為跨域契約變更處理。

## 核心聚合 / 核心概念

- **`DomainEvent`**
- **`EventRecord`**
- **`SlugUtils`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/shared/repositories.md
````markdown
# shared — Repositories

> **Canonical bounded context:** `shared`
> **模組路徑:** `modules/shared/`
> **Domain Type:** Shared Kernel

本文件整理 `shared` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- 目前沒有對應檔案。

## Infrastructure Implementations

- `infrastructure/InMemoryEventStoreRepository.ts`
- `infrastructure/NoopEventBusRepository.ts`
- `infrastructure/SimpleEventBus.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/shared/repositories.md`
- `../../../docs/ddd/shared/aggregates.md`
````

## File: modules/shared/ubiquitous-language.md
````markdown
# Ubiquitous Language — shared

> **範圍：** 跨所有 BC 的共享基礎術語（Shared Kernel）

## 術語定義

| 術語 | 英文 | 定義 | 代碼位置 |
|------|------|------|---------|
| 領域事件 | DomainEvent | 所有領域事件的基礎介面，含 `type` 和 `occurredAt` | `modules/shared/domain/events.ts` |
| 事件記錄 | EventRecord | 稽核/追蹤用的事件記錄（`eventId`, `occurredAt`, `actorId`） | `modules/shared/domain/event-record.ts` |
| 發生時間 | occurredAt | 事件發生時間，**ISO 8601 字串**格式（非 Date 物件） | `DomainEvent.occurredAt` |
| Slug | Slug | URL-safe 的識別符字串 | `modules/shared/domain/slug-utils.ts` |

## 關鍵規則

`occurredAt` 必須是 **ISO 8601 字串**（`string`），不是 `Date`、`Timestamp` 或數字。所有繼承 `DomainEvent` 的事件介面都必須遵守此規範。

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `occurredAt` | `occurredAtISO`, `timestamp`, `createdAt`（作為事件時間戳） |
| `DomainEvent` | `BaseEvent`, `Event` |
````

## File: modules/source/aggregates.md
````markdown
# Aggregates — source

## 聚合根：SourceDocument（File.ts）

### 職責
管理文件的上傳生命週期，從上傳初始化到完成確認，以及版本快照與保留政策。

### 生命週期狀態機
```
pending_upload ──[upload_complete]──► uploaded ──[archive]──► archived
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 文件主鍵 |
| `name` | `string` | 檔案名稱 |
| `organizationId` | `string` | 所屬組織 |
| `workspaceId` | `string \| null` | 所屬工作區 |
| `status` | `FileStatus` | `pending_upload \| uploaded \| archived` |
| `versions` | `FileVersion[]` | 版本列表 |
| `retentionPolicy` | `RetentionPolicy \| null` | 保留政策 |
| `permissionSnapshot` | `PermissionSnapshot` | 上傳時授權快照 |

---

## 聚合根：WikiLibrary

### 職責
RAG 文件的邏輯集合容器，對應使用者在 UI 看到的「知識庫」概念。

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `FileVersion` | 版本快照（versionId, fileUrl, createdAt） |
| `RetentionPolicy` | 保留規則（retainDays, deleteAfterExpiry） |
| `PermissionSnapshot` | 上傳時的授權快照（不可變） |
| `AuditRecord` | 操作稽核記錄（append-only） |

---

## Ports（Hexagonal Architecture）

| Port | 說明 |
|------|------|
| `ActorContextPort` | 解析操作者身分與授權 |
| `OrganizationPolicyPort` | 查詢組織層級政策 |
| `WorkspaceGrantPort` | 驗證工作區授權 |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `FileRepository` | `save()`, `findById()`, `listByWorkspace()` |
| `RagDocumentRepository` | `save()`, `findByDocumentId()` |
| `WikiLibraryRepository` | `save()`, `findByWorkspaceId()` |
````

## File: modules/source/application-services.md
````markdown
# source — Application Services

> **Canonical bounded context:** `source`
> **模組路徑:** `modules/source/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `source` 的 application layer 服務與 use cases。內容與 `modules/source/application/` 實作保持一致。

## Application Layer 職責

管理文件上傳生命週期、版本快照與 RAG 文件登記。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/dto/file.dto.ts`
- `application/dto/rag-document.dto.ts`
- `application/index.ts`
- `application/use-cases/list-workspace-files.use-case.ts`
- `application/use-cases/register-uploaded-rag-document.use-case.ts`
- `application/use-cases/upload-complete-file.use-case.ts`
- `application/use-cases/upload-init-file.use-case.ts`
- `application/use-cases/wiki-libraries.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/source/README.md`
- 模組 AGENT：`../../../modules/source/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/source/application-services.md`
````

## File: modules/source/context-map.md
````markdown
# Context Map — source

## 上游（依賴）

### identity → source（Customer/Supplier）
- `ActorContextPort` 透過 `identity/api` 驗證上傳者身分

### workspace → source（Customer/Supplier）
- 文件隸屬 `workspaceId`，需透過 `WorkspaceGrantPort` 驗證授權

### organization → source（Customer/Supplier）
- `OrganizationPolicyPort` 解算組織層級保留政策

---

## 下游（被依賴）

### source → ai（Customer/Supplier）

- `source.upload_completed` 觸發 `ai` 域建立 IngestionJob
- **Runtime 邊界**：Next.js 端執行 upload-init/complete；`py_fn/` 執行 Embedding

### source → knowledge（Published Language）

- 文件關聯知識頁面時通知 `knowledge` 域

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| identity → source | identity | source | Customer/Supplier（Port） |
| workspace → source | workspace | source | Customer/Supplier（Port） |
| organization → source | organization | source | Customer/Supplier（Port） |
| source → ai | source | ai | Published Language (Events) |
| source → knowledge | source | knowledge | Published Language (Events) |
````

## File: modules/source/domain-events.md
````markdown
# Domain Events — source

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `source.upload_initiated` | upload-init 完成、簽名 URL 已產生 | `documentId`, `workspaceId`, `actorId`, `occurredAt` |
| `source.upload_completed` | upload-complete 確認完成 | `documentId`, `workspaceId`, `occurredAt` |
| `source.rag_document_registered` | RagDocument 成功登記進入攝入管線 | `documentId`, `ragDocumentId`, `occurredAt` |
| `source.file_archived` | 文件被封存 | `documentId`, `actorId`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `workspace` | `workspace.created` | 初始化工作區的 WikiLibrary |
| `identity` | `TokenRefreshSignal` | 更新 ActorContext 授權快照 |

## 消費 source 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `ai` | `source.upload_completed` | 建立 IngestionJob，啟動 RAG 攝入管線 |
| `knowledge` | `source.upload_completed` | 文件關聯知識頁面通知（可選） |
````

## File: modules/source/domain-services.md
````markdown
# source — Domain Services

> **Canonical bounded context:** `source`
> **模組路徑:** `modules/source/`
> **Domain Type:** Supporting Subdomain

本文件整理 `source` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- `domain/services/complete-upload-file.ts`
- `domain/services/resolve-file-organization-id.ts`

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/source/domain-services.md`
- `../../../docs/ddd/source/aggregates.md`
````

## File: modules/source/repositories.md
````markdown
# source — Repositories

> **Canonical bounded context:** `source`
> **模組路徑:** `modules/source/`
> **Domain Type:** Supporting Subdomain

本文件整理 `source` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/FileRepository.ts`
- `domain/repositories/RagDocumentRepository.ts`
- `domain/repositories/WikiLibraryRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseFileRepository.ts`
- `infrastructure/firebase/FirebaseRagDocumentRepository.ts`
- `infrastructure/index.ts`
- `infrastructure/repositories/in-memory-wiki-library.repository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/source/repositories.md`
- `../../../docs/ddd/source/aggregates.md`
````

## File: modules/source/ubiquitous-language.md
````markdown
# Ubiquitous Language — source

> **範圍：** 僅限 `modules/source/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 來源文件 | SourceDocument | 上傳的原始文件聚合根（對應 File.ts） |
| 知識庫 | WikiLibrary | RAG 文件的邏輯集合容器 |
| 檔案版本 | FileVersion | SourceDocument 的版本快照 |
| RAG 文件 | RagDocument | 已登記進入 RAG 管線的文件記錄 |
| 授權快照 | PermissionSnapshot | 上傳時的授權狀態快照（不可變） |
| 保留政策 | RetentionPolicy | 文件的保留期限與刪除規則 |
| 稽核記錄 | AuditRecord | 文件操作的不可變稽核軌跡 |
| 攝入交付 | IngestionHandoff | 上傳完成後交付 py_fn worker 的觸發信號 |
| 演員上下文 | ActorContext | 操作者身分與授權上下文（透過 ActorContextPort） |
| 工作區授權 | WorkspaceGrant | 工作區層級的授權快照（透過 WorkspaceGrantPort） |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `SourceDocument` | `File`, `Document`, `Asset` |
| `WikiLibrary` | `Library`, `Folder`, `Collection` |
| `RetentionPolicy` | `Policy`, `LifecycleRule` |
````

## File: modules/wiki/application-services.md
````markdown
# wiki — Application Services

> **Canonical bounded context:** `wiki`
> **模組路徑:** `modules/wiki/`
> **Domain Type:** Core Domain

本文件記錄 `wiki` 的 application layer 服務與 use cases。內容與 `modules/wiki/application/` 實作保持一致。

## Application Layer 職責

管理知識圖譜節點與邊，提供 backlink 與 graph traversal 能力。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/link-extractor.service.ts`
- `application/use-cases/auto-link.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/wiki/README.md`
- 模組 AGENT：`../../../modules/wiki/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/wiki/application-services.md`
````

## File: modules/wiki/context-map.md
````markdown
# Context Map — wiki

## 上游（依賴）

### knowledge → wiki（Customer/Supplier）

- `wiki` 訂閱 `knowledge` 的頁面事件以同步 GraphNode 生命週期
- `wiki.GraphNode.id` 對應 `knowledge.KnowledgePage.id`（共享主鍵）

```
knowledge.page_created ──► wiki: 建立 GraphNode
knowledge.block_updated ──► wiki: 更新 AutoLink GraphEdge
knowledge.page_archived ──► wiki: 歸檔 GraphNode
```

### workspace → wiki（Customer/Supplier）

- GraphNode 歸屬於 workspaceId

---

## 下游（被依賴）

### wiki → search（Customer/Supplier）

- `search` 消費 `wiki.node_activated` 以更新向量索引
- RAG 查詢結果中的圖譜上下文由 wiki 提供

### wiki → notebook（Customer/Supplier）

- AI 對話生成時，`notebook` 可查詢 wiki 圖譜以取得知識上下文

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| knowledge → wiki | knowledge | wiki | Published Language (Events) |
| workspace → wiki | workspace | wiki | Customer/Supplier |
| wiki → search | wiki | search | Customer/Supplier（Events） |
| wiki → notebook | wiki | notebook | Customer/Supplier（Query） |
````

## File: modules/wiki/domain-events.md
````markdown
# Domain Events — wiki

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `wiki.node_created` | 新 GraphNode 建立時 | `nodeId`, `workspaceId`, `nodeType`, `occurredAt` |
| `wiki.node_activated` | GraphNode 從 draft → active | `nodeId`, `workspaceId`, `occurredAt` |
| `wiki.node_archived` | GraphNode 歸檔 | `nodeId`, `workspaceId`, `occurredAt` |
| `wiki.edge_created` | 新 GraphEdge 建立時 | `edgeId`, `sourceNodeId`, `targetNodeId`, `edgeType`, `occurredAt` |
| `wiki.edge_activated` | GraphEdge 從 pending → active | `edgeId`, `occurredAt` |
| `wiki.edge_removed` | GraphEdge 移除 | `edgeId`, `occurredAt` |
| `wiki.autolink_created` | 系統自動建立 Backlink 關係 | `edgeId`, `sourceNodeId`, `targetNodeId`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `knowledge` | `knowledge.page_created` | 建立對應的 GraphNode |
| `knowledge` | `knowledge.block_updated` | 掃描區塊內容，建立/更新 AutoLink GraphEdge |
| `knowledge` | `knowledge.page_archived` | 將對應 GraphNode 設為 archived |

## 消費 wiki 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `search` | `wiki.node_activated` | 更新向量索引中的節點內容 |
| `notebook` | wiki 圖譜查詢（非事件） | AI 推理時參考圖譜結構 |
````

## File: modules/wiki/domain-services.md
````markdown
# wiki — Domain Services

> **Canonical bounded context:** `wiki`
> **模組路徑:** `modules/wiki/`
> **Domain Type:** Core Domain

本文件整理 `wiki` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/wiki/domain-services.md`
- `../../../docs/ddd/wiki/aggregates.md`
````

## File: modules/wiki/repositories.md
````markdown
# wiki — Repositories

> **Canonical bounded context:** `wiki`
> **模組路徑:** `modules/wiki/`
> **Domain Type:** Core Domain

本文件整理 `wiki` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/GraphRepository.ts`

## Infrastructure Implementations

- `infrastructure/InMemoryGraphRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/wiki/repositories.md`
- `../../../docs/ddd/wiki/aggregates.md`
````

## File: modules/wiki/ubiquitous-language.md
````markdown
# Ubiquitous Language — wiki

> **範圍：** 僅限 `modules/wiki/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 圖譜節點 | GraphNode | 知識圖譜中的一個節點，對應一個知識概念或頁面 |
| 圖譜邊 | GraphEdge | 兩個 GraphNode 之間的有向關係 |
| 節點類型 | NodeType | 節點的語意類型（concept, page, entity 等） |
| 邊類型 | EdgeType | 關係的語意類型（references, contains, related_to 等） |
| 反向連結 | Backlink | 指向特定節點的所有入向邊（inbound edges） |
| 圖遍歷 | GraphTraversal | 從起點節點沿邊向外擴展，取得關聯節點集 |
| 自動連結 | AutoLink | 系統自動識別內容引用並建立 GraphEdge 的機制 |
| 節點狀態 | NodeStatus | GraphNode 的生命週期狀態：`draft \| active \| archived` |
| 邊狀態 | EdgeStatus | GraphEdge 的生命週期狀態：`pending \| active \| inactive \| removed` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `GraphNode` | `Node`, `WikiNode`, `Page`（圖譜上下文中） |
| `GraphEdge` | `Edge`, `Link`, `Connection` |
| `Backlink` | `InboundLink`, `ReverseLink` |
````

## File: modules/workspace-audit/aggregates.md
````markdown
# Aggregates — workspace-audit

## 聚合根：AuditLog（Append-Only）

### 職責
記錄工作區或組織範圍內重要操作的不可變稽核軌跡。一旦寫入，永不修改或刪除。

### Append-Only 約束

> **核心不變數：** AuditLog 只能被建立，不能被更新或刪除。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 記錄主鍵（UUID） |
| `workspaceId` | `string \| null` | 所屬工作區（可選，組織級記錄可能無 workspaceId） |
| `organizationId` | `string` | 所屬組織 |
| `actorId` | `string` | 操作者帳戶 ID |
| `auditEventType` | `string` | 操作類型（如 `workspace.member_joined`） |
| `targetId` | `string \| null` | 操作對象 ID（可選） |
| `targetType` | `string \| null` | 操作對象類型（可選） |
| `metadata` | `Record<string, unknown>` | 附加資訊 |
| `auditedAt` | `string` | ISO 8601 操作時間 |

### 不變數

- `id` 建立後不可變
- `auditedAt` 使用記錄建立時的系統時間，不可後期修改
- 所有欄位建立後均不可修改（immutable record）

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `AuditLogRepository` | `append()`, `listByWorkspace()`, `listByOrganization()` |

**注意：** `AuditLogRepository` 不提供 `update()` 或 `delete()` 方法，強制執行 Append-Only。
````

## File: modules/workspace-audit/application-services.md
````markdown
# workspace-audit — Application Services

> **Canonical bounded context:** `workspace-audit`
> **模組路徑:** `modules/workspace-audit/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `workspace-audit` 的 application layer 服務與 use cases。內容與 `modules/workspace-audit/application/` 實作保持一致。

## Application Layer 職責

以 append-only 模式記錄工作區與組織範圍內的重要稽核軌跡。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/.gitkeep`
- `application/use-cases/audit.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/workspace-audit/README.md`
- 模組 AGENT：`../../../modules/workspace-audit/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/workspace-audit/application-services.md`
````

## File: modules/workspace-audit/context-map.md
````markdown
# Context Map — workspace-audit

## 上游（依賴）

`workspace-audit` 訂閱所有業務 BC 的事件，但**不依賴**任何 BC 的 api。它是純事件消費者。

```
所有業務 BC ──[Domain Events]──► workspace-audit（Terminal Sink）
```

### 主要事件來源

| 來源 BC | 整合模式 |
|---------|---------|
| `workspace` | Published Language（被動消費） |
| `organization` | Published Language（被動消費） |
| `workspace-flow` | Published Language（被動消費） |
| `workspace-scheduling` | Published Language（被動消費） |
| `source` | Published Language（被動消費） |
| `ai` | Published Language（被動消費） |

---

## 下游（被依賴）

### workspace-audit → WorkspaceDetailScreen（Interfaces）

- `workspace-audit/api` 提供稽核查詢 API 給 `workspace` 的 WorkspaceDetailScreen tab

---

## Terminal Sink 原則

`workspace-audit` 是事件消費的**終點**，不向其他 BC 發出事件。業務流程不應等待或依賴稽核記錄的完成。

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| 所有 BC → workspace-audit | 各 BC | workspace-audit | Published Language (Terminal Sink) |
| workspace-audit → workspace UI | workspace-audit | app/ | Customer/Supplier（查詢） |
````

## File: modules/workspace-audit/domain-events.md
````markdown
# Domain Events — workspace-audit

## 發出事件

`workspace-audit` 不發出 DomainEvent。它是事件的**最終消費者（Terminal Sink）**，不產生進一步的業務事件。

## 訂閱事件（消費端）

`workspace-audit` 訂閱所有需要留下稽核軌跡的業務事件：

| 來源 BC | 訂閱事件 | AuditLog.auditEventType |
|---------|---------|------------------------|
| `workspace` | `workspace.created` | `workspace.created` |
| `workspace` | `workspace.member_joined` | `workspace.member_joined` |
| `workspace` | `workspace.archived` | `workspace.archived` |
| `organization` | `organization.member_joined` | `organization.member_joined` |
| `organization` | `organization.member_removed` | `organization.member_removed` |
| `workspace-flow` | `workspace-flow.task_status_changed` | `task.status_changed` |
| `workspace-flow` | `workspace-flow.invoice_paid` | `invoice.paid` |
| `workspace-scheduling` | `workspace-scheduling.demand_status_changed` | `demand.status_changed` |
| `source` | `source.upload_completed` | `document.uploaded` |
| `ai` | `ai.ingestion_completed / failed` | `ingestion.completed / failed` |

## 說明

稽核模組是事件消費的「終點站」。業務 BC 不應依賴稽核模組的狀態，稽核只做記錄，不影響業務流程。
````

## File: modules/workspace-audit/domain-services.md
````markdown
# workspace-audit — Domain Services

> **Canonical bounded context:** `workspace-audit`
> **模組路徑:** `modules/workspace-audit/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-audit` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/workspace-audit/domain-services.md`
- `../../../docs/ddd/workspace-audit/aggregates.md`
````

## File: modules/workspace-audit/repositories.md
````markdown
# workspace-audit — Repositories

> **Canonical bounded context:** `workspace-audit`
> **模組路徑:** `modules/workspace-audit/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-audit` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/AuditRepository.ts`

## Infrastructure Implementations

- `infrastructure/.gitkeep`
- `infrastructure/firebase/FirebaseAuditRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/workspace-audit/repositories.md`
- `../../../docs/ddd/workspace-audit/aggregates.md`
````

## File: modules/workspace-audit/ubiquitous-language.md
````markdown
# Ubiquitous Language — workspace-audit

> **範圍：** 僅限 `modules/workspace-audit/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 稽核記錄 | AuditLog | 一條不可變的操作紀錄（Append-Only，永不修改） |
| 稽核事件類型 | auditEventType | 記錄的操作類型字串（如 `workspace.member_joined`） |
| 操作者 ID | actorId | 執行此操作的帳戶 ID |
| 稽核範圍 | auditScope | 此記錄的範圍（workspace 或 organization） |
| 稽核時間 | auditedAt | 操作發生時間，ISO 8601 |
| 元資料 | metadata | 操作的附加資訊（JSON，可選） |

## Append-Only 原則

`AuditLog` 一旦寫入即不可更改。任何試圖修改或刪除 AuditLog 的操作都違反此域的核心不變數。

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `AuditLog` | `Log`, `Record`, `History` |
| `actorId` | `userId`, `performerId` |
| `auditedAt` | `timestamp`, `createdAt`（在稽核上下文中） |
````

## File: modules/workspace-feed/AGENT.md
````markdown
# AGENT.md — workspace-feed BC

## 通用語言

| 正確術語 | 禁止使用 |
|----------|----------|
| `WorkspaceFeedPost` | Post、Tweet、Message |
| `WorkspaceFeedPostType` | Type、PostType |
| `authorAccountId` | authorId、userId |

## 邊界規則

```typescript
// ✅
import { workspaceFeedApi } from "@/modules/workspace-feed/api";
// ❌
import { WorkspaceFeedPost } from "@/modules/workspace-feed/domain/entities/WorkspaceFeedPost";
```
````

## File: modules/workspace-feed/aggregates.md
````markdown
# Aggregates — workspace-feed

## 聚合根：WorkspaceFeedPost

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 貼文主鍵 |
| `workspaceId` | `string` | 所屬工作區 |
| `authorAccountId` | `string` | 作者帳戶 ID |
| `type` | `WorkspaceFeedPostType` | `post \| reply \| repost` |
| `content` | `string` | 貼文內容 |
| `replyToPostId` | `string \| null` | 回覆目標 |
| `repostOfPostId` | `string \| null` | 轉貼目標 |
| `likeCount` | `number` | 按讚數 |
| `viewCount` | `number` | 瀏覽數 |

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `WorkspaceFeedRepository` | `save()`, `findById()`, `listByWorkspace()` |
````

## File: modules/workspace-feed/application-services.md
````markdown
# workspace-feed — Application Services

> **Canonical bounded context:** `workspace-feed`
> **模組路徑:** `modules/workspace-feed/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `workspace-feed` 的 application layer 服務與 use cases。內容與 `modules/workspace-feed/application/` 實作保持一致。

## Application Layer 職責

管理工作區的社交動態貼文與互動事件。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/dto/workspace-feed.dto.ts`
- `application/use-cases/workspace-feed.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/workspace-feed/README.md`
- 模組 AGENT：`../../../modules/workspace-feed/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/workspace-feed/application-services.md`
````

## File: modules/workspace-feed/context-map.md
````markdown
# Context Map — workspace-feed

## 上游（依賴）

### workspace → workspace-feed（Conformist）

- `WorkspaceFeedPost.workspaceId` 隸屬工作區

## 下游（被依賴）

### workspace-feed → notification（Published Language）

- `WorkspaceFeedPostCreated` 可觸發通知

### workspace-feed → workspace-audit（Published Language）

- 貼文操作記錄稽核軌跡

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| workspace → workspace-feed | workspace | workspace-feed | Conformist |
| workspace-feed → notification | workspace-feed | notification | Published Language |
| workspace-feed → workspace-audit | workspace-feed | workspace-audit | Published Language |
````

## File: modules/workspace-feed/domain-events.md
````markdown
# Domain Events — workspace-feed

## 發出事件

| 事件 | 觸發條件 |
|------|---------|
| `WorkspaceFeedPostCreated` | 新貼文發布 |
| `WorkspaceFeedReplyCreated` | 回覆發布 |
| `WorkspaceFeedRepostCreated` | 轉貼發布 |
| `WorkspaceFeedPostLiked` | 按讚 |
| `WorkspaceFeedPostViewed` | 瀏覽 |
| `WorkspaceFeedPostBookmarked` | 收藏 |
| `WorkspaceFeedPostShared` | 分享 |

所有事件繼承 `WorkspaceFeedBaseEvent`（`accountId`, `workspaceId`, `postId`, `actorAccountId`, `occurredAtISO`）。

## 訂閱事件

`workspace-feed` 不訂閱其他 BC 的事件。
````

## File: modules/workspace-feed/domain-services.md
````markdown
# workspace-feed — Domain Services

> **Canonical bounded context:** `workspace-feed`
> **模組路徑:** `modules/workspace-feed/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-feed` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/workspace-feed/domain-services.md`
- `../../../docs/ddd/workspace-feed/aggregates.md`
````

## File: modules/workspace-feed/README.md
````markdown
# workspace-feed — 工作區動態上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/workspace-feed/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`workspace-feed` 是工作區的動態流與互動層，把知識、任務與協作事件轉成團隊可感知的貼文、回覆與互動紀錄。它提升知識平台的協作流動性與可見性。

## 主要職責

| 能力 | 說明 |
|---|---|
| 動態貼文 | 管理 post / reply / repost 等工作區動態內容 |
| 互動紀錄 | 記錄 like / view / bookmark / share 等互動 |
| 事件可見化 | 把協作行為轉成工作區成員可追蹤的活動流 |

## 與其他 Bounded Context 協作

- `workspace` 提供動態的歸屬邊界。
- `workspace-flow`、`knowledge`、`notification` 可與動態流形成聯動。

## 核心聚合 / 核心概念

- **`WorkspaceFeedPost`**
- **`FeedReaction`**
- **`FeedThread`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/workspace-feed/repositories.md
````markdown
# workspace-feed — Repositories

> **Canonical bounded context:** `workspace-feed`
> **模組路徑:** `modules/workspace-feed/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-feed` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/workspace-feed.repositories.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseWorkspaceFeedInteractionRepository.ts`
- `infrastructure/firebase/FirebaseWorkspaceFeedPostRepository.ts`
- `infrastructure/index.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/workspace-feed/repositories.md`
- `../../../docs/ddd/workspace-feed/aggregates.md`
````

## File: modules/workspace-feed/ubiquitous-language.md
````markdown
# Ubiquitous Language — workspace-feed

| 術語 | 英文 | 定義 |
|------|------|------|
| 動態貼文 | WorkspaceFeedPost | 工作區社交動態貼文（post / reply / repost） |
| 貼文類型 | WorkspaceFeedPostType | `"post" \| "reply" \| "repost"` |
| 作者帳戶 ID | authorAccountId | 發文者帳戶 ID |
| 回覆目標 | replyToPostId | 此貼文回覆的原貼文 ID |
| 轉貼目標 | repostOfPostId | 此貼文轉貼的原貼文 ID |
````

## File: modules/workspace-flow/aggregates.md
````markdown
# Aggregates — workspace-flow

## 聚合根：Task

### 職責
可追蹤的工作單元，管理完整的任務生命週期狀態機。

### 生命週期狀態機
```
draft ──► in_progress ──► qa ──► acceptance ──► accepted ──► archived
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | Task 主鍵 |
| `workspaceId` | `string` | 所屬工作區 |
| `title` | `string` | 任務標題 |
| `status` | `TaskStatus` | 當前狀態 |
| `assigneeId` | `string \| null` | 負責人帳戶 ID |
| `dueDate` | `string \| null` | 截止日期 ISO 8601 |
| `sourceReference` | `SourceReference \| null` | 物化來源（pageId, causationId） |
| `currentUserId` | `string` | 當前操作者 ID |

---

## 聚合根：Issue

### 生命週期狀態機
```
open ──► investigating ──► fixing ──► retest ──► resolved ──► closed
```

### 關鍵屬性

| 屬性 | 說明 |
|------|------|
| `id`, `workspaceId`, `title` | 基本屬性 |
| `status` | `IssueStatus` |
| `severity` | `IssueStatus` 嚴重程度 |
| `reporterId` | 報告者帳戶 ID |
| `assigneeId` | 負責人帳戶 ID（可選） |

---

## 聚合根：Invoice

### 生命週期狀態機
```
draft ──► submitted ──► finance_review ──► approved ──► paid ──► closed
```

### 關鍵屬性

| 屬性 | 說明 |
|------|------|
| `id`, `workspaceId` | 基本屬性 |
| `status` | `InvoiceStatus` |
| `amount` | `number` |
| `currency` | `string`（預設 "TWD"） |
| `sourceReference` | 物化來源（可選） |

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `TaskStatus` | `"draft" \| "in_progress" \| "qa" \| "acceptance" \| "accepted" \| "archived"` |
| `IssueStatus` | `"open" \| "investigating" \| "fixing" \| "retest" \| "resolved" \| "closed"` |
| `InvoiceStatus` | `"draft" \| "submitted" \| "finance_review" \| "approved" \| "paid" \| "closed"` |
| `SourceReference` | `{ pageId: string, causationId: string }` |

---

## Repository Interfaces

| 介面 | 說明 |
|------|------|
| `TaskRepository` | Task CRUD + 狀態查詢 |
| `IssueRepository` | Issue CRUD + 狀態查詢 |
| `InvoiceRepository` | Invoice CRUD + 狀態查詢 |

---

## Domain Services

| 服務 | 說明 |
|------|------|
| `ContentToWorkflowMaterializer` | Process Manager：訂閱 `knowledge.page_approved`，建立 MaterializedTask 和 Invoice |
````

## File: modules/workspace-flow/application-services.md
````markdown
# workspace-flow — Application Services

> **Canonical bounded context:** `workspace-flow`
> **模組路徑:** `modules/workspace-flow/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `workspace-flow` 的 application layer 服務與 use cases。內容與 `modules/workspace-flow/application/` 實作保持一致。

## Application Layer 職責

管理 Task / Issue / Invoice 三條工作流程狀態機與流程物化。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/dto/add-invoice-item.dto.ts`
- `application/dto/create-task.dto.ts`
- `application/dto/invoice-query.dto.ts`
- `application/dto/issue-query.dto.ts`
- `application/dto/materialize-from-content.dto.ts`
- `application/dto/open-issue.dto.ts`
- `application/dto/pagination.dto.ts`
- `application/dto/remove-invoice-item.dto.ts`
- `application/dto/resolve-issue.dto.ts`
- `application/dto/task-query.dto.ts`
- `application/dto/update-invoice-item.dto.ts`
- `application/dto/update-task.dto.ts`
- `application/ports/InvoiceService.ts`
- `application/ports/IssueService.ts`
- `application/ports/TaskService.ts`
- `application/process-managers/content-to-workflow-materializer.ts`
- `application/use-cases/add-invoice-item.use-case.ts`
- `application/use-cases/approve-invoice.use-case.ts`
- `application/use-cases/approve-task-acceptance.use-case.ts`
- `application/use-cases/archive-task.use-case.ts`
- `application/use-cases/assign-task.use-case.ts`
- `application/use-cases/close-invoice.use-case.ts`
- `application/use-cases/close-issue.use-case.ts`
- `application/use-cases/create-invoice.use-case.ts`
- `application/use-cases/create-task.use-case.ts`
- `application/use-cases/fail-issue-retest.use-case.ts`
- `application/use-cases/fix-issue.use-case.ts`
- `application/use-cases/materialize-tasks-from-content.use-case.ts`
- `application/use-cases/open-issue.use-case.ts`
- `application/use-cases/pass-issue-retest.use-case.ts`
- `application/use-cases/pass-task-qa.use-case.ts`
- `application/use-cases/pay-invoice.use-case.ts`
- `application/use-cases/reject-invoice.use-case.ts`
- `application/use-cases/remove-invoice-item.use-case.ts`
- `application/use-cases/resolve-issue.use-case.ts`
- `application/use-cases/review-invoice.use-case.ts`
- `application/use-cases/start-issue.use-case.ts`
- `application/use-cases/submit-invoice.use-case.ts`
- `application/use-cases/submit-issue-retest.use-case.ts`
- `application/use-cases/submit-task-to-qa.use-case.ts`
- `application/use-cases/update-invoice-item.use-case.ts`
- `application/use-cases/update-task.use-case.ts`

## 設計對齊

- 模組 README：`../../../modules/workspace-flow/README.md`
- 模組 AGENT：`../../../modules/workspace-flow/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/workspace-flow/application-services.md`
````

## File: modules/workspace-flow/context-map.md
````markdown
# Context Map — workspace-flow

## 上游（依賴）

### knowledge → workspace-flow（Published Language）

**這是 workspace-flow 最重要的上游整合。**

- `workspace-flow` 的 `ContentToWorkflowMaterializer` 訂閱 `knowledge.page_approved`
- 從 `extractedTasks[]` 建立 MaterializedTask
- 從 `extractedInvoices[]` 建立 Invoice
- 每個物化實體中記錄 `sourceReference`（pageId + causationId）

```
knowledge.page_approved ──► ContentToWorkflowMaterializer
                            ├─► Task.create（extractedTask）
                            └─► Invoice.create（extractedInvoice）
```

### workspace → workspace-flow（Conformist）

- Task/Issue/Invoice 都隸屬 `workspaceId`
- `WorkspaceFlowTab` 接收 `workspaceId` + `currentUserId` 作為 props

---

## 下游（被依賴）

### workspace-flow → notification（Published Language）

- 狀態變更事件觸發通知（如 task_assigned）

### workspace-flow → workspace-audit（Published Language）

- 狀態轉換事件供稽核紀錄消費

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| knowledge → workspace-flow | knowledge | workspace-flow | Published Language (Events) |
| workspace → workspace-flow | workspace | workspace-flow | Conformist |
| workspace-flow → notification | workspace-flow | notification | Published Language |
| workspace-flow → workspace-audit | workspace-flow | workspace-audit | Published Language |
````

## File: modules/workspace-flow/domain-events.md
````markdown
# Domain Events — workspace-flow

## 發出事件

### Task 事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `workspace-flow.task_created` | Task 建立 | `taskId`, `workspaceId`, `title`, `createdByUserId`, `occurredAt` |
| `workspace-flow.task_status_changed` | Task 狀態變更 | `taskId`, `workspaceId`, `previousStatus`, `newStatus`, `occurredAt` |
| `workspace-flow.task_assigned` | Task 指派負責人 | `taskId`, `workspaceId`, `assigneeId`, `occurredAt` |
| `workspace-flow.task_materialized` | Task 由 ContentToWorkflowMaterializer 物化 | `taskId`, `workspaceId`, `sourceReference`, `occurredAt` |

### Issue 事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `workspace-flow.issue_opened` | Issue 開啟 | `issueId`, `workspaceId`, `title`, `reporterId`, `occurredAt` |
| `workspace-flow.issue_status_changed` | Issue 狀態變更 | `issueId`, `previousStatus`, `newStatus`, `occurredAt` |
| `workspace-flow.issue_resolved` | Issue 解決 | `issueId`, `workspaceId`, `occurredAt` |

### Invoice 事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `workspace-flow.invoice_created` | Invoice 建立 | `invoiceId`, `workspaceId`, `amount`, `currency`, `occurredAt` |
| `workspace-flow.invoice_status_changed` | Invoice 狀態變更 | `invoiceId`, `previousStatus`, `newStatus`, `occurredAt` |
| `workspace-flow.invoice_paid` | Invoice 標記已付款 | `invoiceId`, `workspaceId`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `knowledge` | `knowledge.page_approved` | ContentToWorkflowMaterializer 建立 MaterializedTask 與 Invoice |

## 消費 workspace-flow 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `notification` | `workspace-flow.task_assigned` | 通知被指派者 |
| `workspace-audit` | 所有狀態變更事件 | 記錄稽核軌跡 |
````

## File: modules/workspace-flow/domain-services.md
````markdown
# workspace-flow — Domain Services

> **Canonical bounded context:** `workspace-flow`
> **模組路徑:** `modules/workspace-flow/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-flow` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- `domain/services/invoice-guards.ts`
- `domain/services/invoice-transition-policy.ts`
- `domain/services/issue-transition-policy.ts`
- `domain/services/task-guards.ts`
- `domain/services/task-transition-policy.ts`

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/workspace-flow/domain-services.md`
- `../../../docs/ddd/workspace-flow/aggregates.md`
````

## File: modules/workspace-flow/repositories.md
````markdown
# workspace-flow — Repositories

> **Canonical bounded context:** `workspace-flow`
> **模組路徑:** `modules/workspace-flow/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-flow` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/InvoiceRepository.ts`
- `domain/repositories/IssueRepository.ts`
- `domain/repositories/TaskRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/invoice-item.converter.ts`
- `infrastructure/firebase/invoice.converter.ts`
- `infrastructure/firebase/issue.converter.ts`
- `infrastructure/firebase/sourceReference.converter.ts`
- `infrastructure/firebase/task.converter.ts`
- `infrastructure/firebase/workspace-flow.collections.ts`
- `infrastructure/repositories/FirebaseInvoiceItemRepository.ts`
- `infrastructure/repositories/FirebaseInvoiceRepository.ts`
- `infrastructure/repositories/FirebaseIssueRepository.ts`
- `infrastructure/repositories/FirebaseTaskRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/workspace-flow/repositories.md`
- `../../../docs/ddd/workspace-flow/aggregates.md`
````

## File: modules/workspace-flow/ubiquitous-language.md
````markdown
# Ubiquitous Language — workspace-flow

> **範圍：** 僅限 `modules/workspace-flow/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 任務 | Task | 可追蹤的工作單元，有狀態機與負責人 |
| 任務狀態 | TaskStatus | `draft \| in_progress \| qa \| acceptance \| accepted \| archived` |
| 問題 | Issue | 問題追蹤記錄（Bug / 需求問題） |
| 問題狀態 | IssueStatus | `open \| investigating \| fixing \| retest \| resolved \| closed` |
| 發票 | Invoice | 財務發票記錄 |
| 發票狀態 | InvoiceStatus | `draft \| submitted \| finance_review \| approved \| paid \| closed` |
| 物化任務 | MaterializedTask | 從 `knowledge.page_approved` 事件自動建立的任務 |
| 來源參照 | sourceReference | 物化任務/發票的來源頁面引用（pageId, causationId） |
| 工作流程物化器 | ContentToWorkflowMaterializer | 監聽 knowledge 事件並建立 Task/Invoice 的 Process Manager |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Task` | `TodoItem`, `WorkItem`, `Job` |
| `Issue` | `Bug`, `Ticket`, `Problem` |
| `Invoice` | `Bill`, `Receipt` |
| `MaterializedTask` | `ConvertedTask`, `AutoTask` |
````

## File: modules/workspace-flow/Workspace-Flow-File-Template.md
````markdown
## 1️⃣ 通用檔案頭模板

```ts
/**
 * @module <模組路徑>
 * @file <檔案名稱>
 * @description <檔案用途簡述>
 * @author <作者>
 * @created <YYYY-MM-DD>
 * @todo <未完成事項或提醒>
 */
```

* `<模組路徑>`: 如 `workspace-flow/domain/entities`
 * `<檔案名稱>`: 如 `modules/workspace-flow/domain/entities/Task.ts`
* `<檔案用途簡述>`: 簡單一句話說明這個檔案做什麼
* `@todo` 可以先留空

---

## 2️⃣ Class / Interface 範例模板

```ts
/**
 * Task Entity
 * @class Task
 * @description 代表一個任務及其狀態與行為
 */
export class Task {
    /**
     * 建立 Task 實例
     * @param {string} title - 任務標題
     * @param {TaskStatus} status - 任務狀態
     */
    constructor(public title: string, public status: TaskStatus) {}
    
    /**
     * 標記任務為完成
     */
    complete() {
        // TODO: 實作
    }
}
```

---

## 3️⃣ Function / Use Case 範例模板

```ts
/**
 * 建立新的 Task
 * @param {CreateTaskDto} dto - 新任務資料
 * @returns {Promise<Task>} 新建立的任務
 */
export async function createTask(dto: CreateTaskDto): Promise<Task> {
    // TODO: 實作
}
```

> 建議先把 **函數頭也加上 JSDoc**，即便目前沒有實作。好處：
>
> 1. 方便生成 API 文件。
> 2. 讓團隊知道參數與回傳型別。
> 3. 開發中 IDE 可以即時提示。

---

## 4️⃣ Mermaid 檔案模板

```mermaid
%% ======================================================
%% File: Workspace-Flow-Tree.mermaid
%% Module: workspace-flow
%% Description: 工作區任務流程結構樹
%% Created: 2026-03-25
%% ======================================================
flowchart TD
    %% TODO: 建立節點
```

---
````

## File: modules/workspace-scheduling/AGENT.md
````markdown
# AGENT.md — workspace-scheduling BC

## 模組定位

`workspace-scheduling` 是工作需求排程支援域，管理 WorkDemand 生命週期與日曆視圖。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `WorkDemand` | Demand、Request、Ticket、Requirement |
| `DemandStatus` | Status（單獨使用）、State |
| `DemandPriority` | Priority（單獨使用）、Urgency |
| `CalendarWidget` | Calendar、Scheduler |

## 狀態機（必須遵守）

```
DemandStatus: draft → open → in_progress → completed
DemandPriority: low | medium | high
```

## 邊界規則

### ✅ 允許
```typescript
import { workspaceSchedulingApi } from "@/modules/workspace-scheduling/api";
import type { WorkDemandDTO } from "@/modules/workspace-scheduling/api";
```

### ❌ 禁止
```typescript
import { WorkDemand } from "@/modules/workspace-scheduling/domain/types";
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/workspace-scheduling/aggregates.md
````markdown
# Aggregates — workspace-scheduling

## 聚合根：WorkDemand

### 職責
代表一個工作需求記錄。管理需求的排程生命週期（draft → completed）。

### 生命週期狀態機
```
draft ──► open ──► in_progress ──► completed
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 需求主鍵 |
| `workspaceId` | `string` | 所屬工作區 |
| `accountId` | `string` | 所屬帳戶 |
| `title` | `string` | 需求標題 |
| `description` | `string \| null` | 描述（可選） |
| `status` | `DemandStatus` | `draft \| open \| in_progress \| completed` |
| `priority` | `DemandPriority` | `low \| medium \| high` |
| `dueDate` | `string \| null` | 截止日期 ISO 8601 |
| `createdAt` | `string` | ISO 8601 |
| `updatedAt` | `string` | ISO 8601 |

### 不變數

- `title` 不可為空
- `completed` 狀態不可逆回 `draft`

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `DemandStatus` | `"draft" \| "open" \| "in_progress" \| "completed"` |
| `DemandPriority` | `"low" \| "medium" \| "high"` |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `DemandRepository` | `save()`, `findById()`, `listByWorkspace()`, `updateStatus()` |
````

## File: modules/workspace-scheduling/application-services.md
````markdown
# workspace-scheduling — Application Services

> **Canonical bounded context:** `workspace-scheduling`
> **模組路徑:** `modules/workspace-scheduling/`
> **Domain Type:** Supporting Subdomain

本文件記錄 `workspace-scheduling` 的 application layer 服務與 use cases。內容與 `modules/workspace-scheduling/application/` 實作保持一致。

## Application Layer 職責

管理 WorkDemand 的排程生命週期、優先級與日曆視圖。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/work-demand.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/workspace-scheduling/README.md`
- 模組 AGENT：`../../../modules/workspace-scheduling/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/workspace-scheduling/application-services.md`
````

## File: modules/workspace-scheduling/context-map.md
````markdown
# Context Map — workspace-scheduling

## 上游（依賴）

### workspace → workspace-scheduling（Conformist）

- WorkDemand 隸屬 `workspaceId`
- `WorkspaceSchedulingTab` 接收 `workspaceId` 作為 props

### account → workspace-scheduling（Customer/Supplier）

- `AccountSchedulingView` 按 `accountId` 聚合跨工作區排程視圖

---

## 下游（被依賴）

### workspace-scheduling → notification（Published Language）

- 需求建立/狀態變更事件觸發通知

### workspace-scheduling → workspace-audit（Published Language）

- 排程操作供稽核紀錄消費

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| workspace → workspace-scheduling | workspace | workspace-scheduling | Conformist |
| account → workspace-scheduling | account | workspace-scheduling | Customer/Supplier |
| workspace-scheduling → notification | workspace-scheduling | notification | Published Language |
| workspace-scheduling → workspace-audit | workspace-scheduling | workspace-audit | Published Language |
````

## File: modules/workspace-scheduling/domain-events.md
````markdown
# Domain Events — workspace-scheduling

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `workspace-scheduling.demand_created` | WorkDemand 建立 | `demandId`, `workspaceId`, `title`, `priority`, `occurredAt` |
| `workspace-scheduling.demand_status_changed` | 狀態轉換 | `demandId`, `previousStatus`, `newStatus`, `occurredAt` |
| `workspace-scheduling.demand_completed` | WorkDemand 完成 | `demandId`, `workspaceId`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `workspace-flow` | `workspace-flow.task_created` | 同步相關 WorkDemand 的排程狀態（可選） |

## 消費 workspace-scheduling 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `notification` | `workspace-scheduling.demand_created` | 通知相關成員 |
| `workspace-audit` | 所有狀態變更事件 | 記錄排程稽核軌跡 |
````

## File: modules/workspace-scheduling/domain-services.md
````markdown
# workspace-scheduling — Domain Services

> **Canonical bounded context:** `workspace-scheduling`
> **模組路徑:** `modules/workspace-scheduling/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-scheduling` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/workspace-scheduling/domain-services.md`
- `../../../docs/ddd/workspace-scheduling/aggregates.md`
````

## File: modules/workspace-scheduling/README.md
````markdown
# workspace-scheduling — 工作區排程上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/workspace-scheduling/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`workspace-scheduling` 讓知識與流程成果進一步進入時間與容量管理，將工作需求落入日曆、截止與排程視角。它支援團隊把抽象工作轉成可安排的協作負載。

## 主要職責

| 能力 | 說明 |
|---|---|
| 需求排程 | 建立與管理 WorkDemand 的狀態生命週期 |
| 時間視圖 | 提供日曆、截止與安排視角 |
| 容量協調 | 讓工作需求能與流程與工作區情境一起被安排 |

## 與其他 Bounded Context 協作

- `workspace-flow` 可作為排程需求來源。
- `workspace` 提供排程歸屬與成員範圍。

## 核心聚合 / 核心概念

- **`WorkDemand`**
- **`ScheduleWindow`**
- **`CapacityAllocation`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/workspace-scheduling/repositories.md
````markdown
# workspace-scheduling — Repositories

> **Canonical bounded context:** `workspace-scheduling`
> **模組路徑:** `modules/workspace-scheduling/`
> **Domain Type:** Supporting Subdomain

本文件整理 `workspace-scheduling` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- 目前沒有對應檔案。

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseDemandRepository.ts`
- `infrastructure/mock-demand-repository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/workspace-scheduling/repositories.md`
- `../../../docs/ddd/workspace-scheduling/aggregates.md`
````

## File: modules/workspace-scheduling/ubiquitous-language.md
````markdown
# Ubiquitous Language — workspace-scheduling

> **範圍：** 僅限 `modules/workspace-scheduling/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 工作需求 | WorkDemand | 一個已排程或待排程的工作請求，含標題、截止日期與優先級 |
| 需求狀態 | DemandStatus | WorkDemand 的生命週期狀態：`draft \| open \| in_progress \| completed` |
| 需求優先級 | DemandPriority | 工作緊急程度：`low \| medium \| high` |
| 日曆控件 | CalendarWidget | 顯示工作需求排程的日曆 UI 元件 |
| 帳戶排程視圖 | AccountSchedulingView | 跨工作區的帳戶級別排程總覽頁面 |

## 狀態標籤（顯示文字）

| 狀態 | 中文標籤 |
|------|---------|
| `draft` | 草稿 |
| `open` | 待處理 |
| `in_progress` | 進行中 |
| `completed` | 已完成 |
| `low` | 低 |
| `medium` | 中 |
| `high` | 高 |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `WorkDemand` | `Demand`, `Request`, `Ticket` |
| `DemandStatus` | `Status`, `WorkStatus` |
````

## File: modules/workspace/aggregates.md
````markdown
# Aggregates — workspace

## 聚合根：Workspace

### 職責
代表一個協作容器。管理工作區的生命週期（active → archived）與成員關係。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 工作區主鍵 |
| `name` | `string` | 工作區名稱 |
| `accountId` | `string` | 擁有者帳戶或組織 ID |
| `status` | `WorkspaceStatus` | `active \| archived` |
| `members` | `WorkspaceMember[]` | 成員列表 |

### 不變數

- archived 狀態的工作區不可新增成員
- workspaceId 建立後不可變更

---

## 聚合根：WikiContentTree

### 職責
維護工作區內 Wiki 頁面的樹狀層級結構，提供父子頁面關係的查詢能力。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `workspaceId` | `string` | 所屬工作區 |
| `nodes` | `WikiTreeNode[]` | 樹狀節點列表 |

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `WorkspaceMember` | 成員在工作區中的角色與狀態 |
| `WorkspaceStatus` | `"active" \| "archived"` |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `WorkspaceRepository` | `save()`, `findById()`, `findByAccountId()` |
| `WorkspaceQueryRepository` | `listByAccountId()`, `findById()` |
| `WikiWorkspaceRepository` | `getContentTree()`, `updateTree()` |
````

## File: modules/workspace/application-services.md
````markdown
# workspace — Application Services

> **Canonical bounded context:** `workspace`
> **模組路徑:** `modules/workspace/`
> **Domain Type:** Generic Subdomain

本文件記錄 `workspace` 的 application layer 服務與 use cases。內容與 `modules/workspace/application/` 實作保持一致。

## Application Layer 職責

管理工作區容器、成員與內容樹，並組合多個 workspace-* 子域。

Application layer 只負責：
- 協調 use cases / DTO / process manager
- 呼叫 domain repository ports 與 domain services
- 不承載 UI / framework-specific concerns

## 實際檔案

- `application/use-cases/wiki-content-tree.use-case.ts`
- `application/use-cases/workspace-member.use-cases.ts`
- `application/use-cases/workspace.use-cases.ts`

## 設計對齊

- 模組 README：`../../../modules/workspace/README.md`
- 模組 AGENT：`../../../modules/workspace/AGENT.md`
- 與 application layer 有關的模組內就地文件：`../../../modules/workspace/application-services.md`
````

## File: modules/workspace/context-map.md
````markdown
# Context Map — workspace

## 上游（依賴）

### account / organization → workspace（Customer/Supplier）

- `workspace.accountId` 關聯 account 或 organization
- workspace 查詢時驗證 accountId 歸屬

---

## 下游（被依賴）

`workspace` 是多個 workspace-* 子模組的**組合宿主**：

### workspace → workspace-flow（Conformist）
- `WorkspaceDetailScreen` 組合 `WorkspaceFlowTab`（Tasks tab）
- 傳入 `workspaceId`, `currentUserId`

### workspace → workspace-scheduling（Conformist）
- `WorkspaceDetailScreen` 組合 `WorkspaceSchedulingTab`

### workspace → workspace-audit（Conformist）
- `WorkspaceDetailScreen` 組合 `WorkspaceAuditTab`

### workspace → workspace-feed（Conformist）
- `WorkspaceDetailScreen` 組合 feed 動態牆 tab

### workspace → knowledge（Customer/Supplier）
- 知識頁面（WikiPage）隸屬於 workspaceId
- Wiki 內容樹（WikiContentTree）按工作區組織

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| account → workspace | account | workspace | Customer/Supplier |
| organization → workspace | organization | workspace | Customer/Supplier |
| workspace → workspace-flow | workspace | workspace-flow | Conformist（workspaceId） |
| workspace → workspace-scheduling | workspace | workspace-scheduling | Conformist |
| workspace → workspace-audit | workspace | workspace-audit | Conformist |
| workspace → workspace-feed | workspace | workspace-feed | Conformist |
````

## File: modules/workspace/domain-events.md
````markdown
# Domain Events — workspace

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `workspace.created` | 新工作區建立時 | `workspaceId`, `accountId`, `name`, `occurredAt` |
| `workspace.archived` | 工作區歸檔時 | `workspaceId`, `accountId`, `occurredAt` |
| `workspace.member_joined` | 成員加入工作區 | `workspaceId`, `accountId`, `role`, `occurredAt` |
| `workspace.member_removed` | 成員被移除 | `workspaceId`, `accountId`, `occurredAt` |

## 訂閱事件

`workspace` 不直接訂閱其他 BC 的事件，由 app/ 路由層協調各 tab 組合。

## 事件格式範例

```typescript
interface WorkspaceCreatedEvent {
  readonly type: "workspace.created";
  readonly workspaceId: string;
  readonly accountId: string;
  readonly name: string;
  readonly occurredAt: string;  // ISO 8601
}
```
````

## File: modules/workspace/domain-services.md
````markdown
# workspace — Domain Services

> **Canonical bounded context:** `workspace`
> **模組路徑:** `modules/workspace/`
> **Domain Type:** Generic Subdomain

本文件整理 `workspace` 的 domain services。若某模組目前沒有獨立的 domain service，表示其規則主要封裝在 aggregate methods、value objects 或 application layer orchestration 中。

## Domain Services 檔案

- 目前沒有獨立的 `domain/services/*` 檔案。

## 設計規則

- domain services 只承載無狀態、跨聚合或跨值物件的純業務規則
- 不得引入 React、Firebase SDK、HTTP client 等 framework-specific 依賴
- 若規則只屬於單一 aggregate，不應抽成 domain service

## 模組內對應文件

- `../../../modules/workspace/domain-services.md`
- `../../../docs/ddd/workspace/aggregates.md`
````

## File: modules/workspace/repositories.md
````markdown
# workspace — Repositories

> **Canonical bounded context:** `workspace`
> **模組路徑:** `modules/workspace/`
> **Domain Type:** Generic Subdomain

本文件整理 `workspace` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/WikiWorkspaceRepository.ts`
- `domain/repositories/WorkspaceQueryRepository.ts`
- `domain/repositories/WorkspaceRepository.ts`

## Infrastructure Implementations

- `infrastructure/firebase/FirebaseWikiWorkspaceRepository.ts`
- `infrastructure/firebase/FirebaseWorkspaceQueryRepository.ts`
- `infrastructure/firebase/FirebaseWorkspaceRepository.ts`

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/workspace/repositories.md`
- `../../../docs/ddd/workspace/aggregates.md`
````

## File: modules/workspace/ubiquitous-language.md
````markdown
# Ubiquitous Language — workspace

> **範圍：** 僅限 `modules/workspace/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 工作區 | Workspace | 協作容器，所有知識、任務、討論歸屬於此 |
| 工作區成員 | WorkspaceMember | 帳戶在工作區中的參與記錄（含角色） |
| Wiki 內容樹 | WikiContentTree | 工作區內 Wiki 頁面的樹狀層級結構 |
| 工作區 ID | workspaceId | Workspace 的業務主鍵 |
| 帳戶 ID | accountId | 擁有此工作區的帳戶或組織 ID |
| 工作區狀態 | WorkspaceStatus | `active \| archived` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Workspace` | `Project`, `Space` |
| `WorkspaceMember` | `Member`, `Participant` |
| `WikiContentTree` | `PageTree`, `Tree`, `Hierarchy` |
````

## File: README.md
````markdown
# Claude Agentic Framework

A drop-in template for Claude Code projects. Adds coordinated multi-agent swarms, specialized commands, 67 reusable skills, and safety hooks — all configured through a single install command.

## Install

Run this inside your project directory:

```bash
cd your-project
curl -sSL https://raw.githubusercontent.com/dralgorhythm/claude-agentic-framework/main/scripts/init-framework.sh | bash -s .
```

The script will:
- Copy `.claude/` (commands, skills, rules, hooks, agents, templates)
- Copy `.mcp.json` (MCP server configuration)
- Copy `CLAUDE.md` and `AGENTS.md` (project instructions)
- Create an `artifacts/` directory for planning documents
- Set up `.gitignore` entries
- Install hook dependencies
- Initialize [Beads](https://github.com/steveyegge/beads) issue tracking (required for swarm coordination)

### Beads Setup

Beads is the issue tracker that coordinates swarm workers — it's how agents claim tasks, track progress, and avoid conflicts. Install it before running the init script:

```bash
curl -sSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
```

The init script will then run `bd init` in your project automatically.

The script prompts before overwriting any existing files. Re-run it to pull in framework updates.

## After Install

1. **Edit `CLAUDE.md`** — Add your build/test commands and project context
2. **Edit `.claude/rules/tech-strategy.md`** — Configure your tech stack (this is required — the framework enforces whatever you put here)
3. Start Claude Code and try: `/architect hello`

## What You Get

### Commands

Single-agent expert modes, invoked via slash commands:

| Command | Role |
|---------|------|
| `/architect` | System design, ADRs |
| `/builder` | Implementation, debugging, testing |
| `/qa-engineer` | Test strategy, E2E, accessibility |
| `/security-auditor` | Threat modeling, security audits |
| `/ui-ux-designer` | Interface design, visual assets |
| `/code-check` | SOLID, DRY, consistency audit |

### Swarm Orchestrators

Multi-agent commands that fan work out across parallel workers:

| Command | What It Does |
|---------|-------------|
| `/swarm-plan` | Launches 3-6 explorer agents to research patterns, dependencies, and constraints — produces a decomposed plan |
| `/swarm-execute` | Picks up planned work, fans out across builder agents (up to 8 parallel), each running quality gates |
| `/swarm-review` | Launches 5 parallel reviewers (security, performance, architecture, tests, quality) — run 2-3 times |
| `/swarm-research` | Deep multi-source investigation with verification tiers |

### The Full Cycle

```
/architect <feature>  →  /swarm-plan  →  /swarm-execute  →  /swarm-review (2-3x)  →  PR
```

One agent thinks. Many agents build. Many agents review.

### Workers

Six specialized agent types tuned for cost and capability:

| Worker | Model | Use |
|--------|-------|-----|
| `worker-explorer` | Haiku | Fast codebase search, dependency mapping |
| `worker-builder` | Sonnet | Implementation, testing, refactoring |
| `worker-reviewer` | Opus | Code review, security analysis |
| `worker-researcher` | Sonnet | Quick web research, API docs |
| `worker-research` | Opus | Deep multi-source investigation |
| `worker-architect` | Opus | Complex design decisions, ADRs |

### Skills

67 skills across 7 categories — auto-suggested based on keywords in your prompt:

**Architecture** · **Engineering** · **Product** · **Security** · **Operations** · **Design** · **Languages & Frameworks**

Covers everything from `designing-systems` and `debugging` to `react-patterns`, `terraform`, and `application-security`. See [docs/skills.md](docs/skills.md) for the full list.

### Safety Hooks

Pre-configured hooks that run automatically:

- **Secret detection** — blocks commits containing API keys, tokens, private keys
- **Protected files** — prevents accidental modification of `.env`, `.mcp.json`, `.beads/`
- **Push blocking** — stops direct pushes to `main`/`master`
- **Dangerous command guard** — warns on `rm -rf`, force push, `terraform destroy`
- **File locking** — prevents concurrent edits in multi-agent swarms

### MCP Servers

Four servers pre-configured in `.mcp.json`:

| Server | Purpose |
|--------|---------|
| Sequential Thinking | Structured multi-step reasoning |
| Chrome DevTools | Browser testing, performance profiling |
| Context7 | Up-to-date library documentation |
| Filesystem | File operations beyond workspace |

## Customization

Everything is designed to be extended:

- Add commands → `.claude/commands/your-command.md`
- Add skills → `.claude/skills/category/your-skill/SKILL.md`
- Add rules → `.claude/rules/your-rule.md`
- Add hooks → `.claude/hooks/your-hook.sh`
- Add workers → `.claude/agents/worker-yourtype.md`

Templates for each are in `.claude/templates/`.

See [docs/customization.md](docs/customization.md) for details.

## Docs

- [Getting started](docs/getting-started.md)
- [Multi-agent swarms](docs/swarm.md)
- [Commands](docs/personas.md)
- [Skills reference](docs/skills.md)
- [MCP servers](docs/mcp-servers.md)
- [Hooks](docs/hooks.md)
- [Handoffs](docs/handoffs.md)
- [Beads setup & usage](docs/beads.md)
- [Customization](docs/customization.md)
````

## File: .github/agents/ai-genkit-lead.agent.md
````markdown
---
name: AI Genkit Lead
description: Lead Genkit-oriented AI orchestration with boundary-safe runtime split across Next.js and py_fn pipelines.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'todo']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Refine Genkit Flow
    agent: Genkit Flow Agent
    prompt: Refine the Genkit flow contract, tool orchestration boundaries, and fallback behavior for this scope.
  - label: Review RAG Boundary
    agent: RAG Lead
    prompt: Review the retrieval and worker-runtime contract impact for this AI scope.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this AI and Genkit change for regression risk, boundary safety, and validation gaps.

---

# AI Genkit Lead

## Target Scope

- `modules/agent/**`
- `app/**`
- `py_fn/**` when coordinating runtime boundaries and worker handoff contracts

## Focus

- Genkit flow ownership and app-side orchestration
- Contract-safe integration with ingestion and retrieval layers

## Guardrails

- Keep auth and chat orchestration in Next.js.
- Keep parsing, chunking, embedding in py_fn workers.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/app-router.agent.md
````markdown
---
name: App Router Agent
description: Diagnose and implement Next.js App Router behavior using runtime evidence and boundary-safe edits.
argument-hint: Provide route segment, expected behavior, and failing symptoms.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'todo', 'io.github.vercel/next-devtools-mcp/*']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Refine Parallel Routes
    agent: Parallel Routes Agent
    prompt: Refine the parallel-route composition, slot isolation, and one-way data flow for this route scope.
  - label: Write Server Action
    agent: Server Action Writer
    prompt: Implement or review the server action orchestration and validation boundary used by this route.
  - label: Verify End-to-End
    agent: E2E QA Agent
    prompt: Verify the affected route in a browser and collect runtime evidence for this change.

---

# App Router Agent

## Target Scope

- `app/**`
- `modules/**/interfaces/**`
- `providers/**`

## Workflow

1. Identify the target segment and rendering/data path.
2. Use Next runtime evidence when symptoms are ambiguous.
3. Apply least-change fixes in route composition or local route UI.
4. Validate only the affected route behavior and related module API usage.

## Guardrails

- Keep business logic in modules.
- Use runtime evidence when route behavior is unclear.
- Keep route slices composition-focused.

## Output

- Route scope and failure mode
- Changes applied
- Evidence checked
- Residual route risk

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/chunk-strategist.agent.md
````markdown
---
name: Chunk Strategist
description: Design chunking strategies for retrieval quality, context efficiency, and stable document traceability.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'todo']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Align Ingestion Inputs
    agent: Doc Ingest Agent
    prompt: Align document normalization and source attribution with the chunking strategy described above.
  - label: Configure Embeddings
    agent: Embedding Writer
    prompt: Implement or review embedding payloads and metadata that match this chunking strategy.
  - label: Review RAG Contract
    agent: RAG Lead
    prompt: Review this chunking strategy against retrieval quality, runtime boundaries, and indexing contracts.

---

# Chunk Strategist

## Target Scope

- `py_fn/**`
- `modules/retrieval/**`
- `modules/knowledge/**`

## Focus

- Chunk size and overlap policy
- Metadata fields for retrieval and attribution
- Domain-specific segmentation rules

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/doc-ingest.agent.md
````markdown
---
name: Doc Ingest Agent
description: Implement document ingestion flows from source conversion to normalized artifacts for downstream chunking and indexing.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'todo', 'microsoft/markitdown/*']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Design Chunk Strategy
    agent: Chunk Strategist
    prompt: Design the chunking policy and metadata boundaries for the normalized artifacts described above.
  - label: Write Embeddings
    agent: Embedding Writer
    prompt: Implement or review embedding generation and metadata writes for this ingestion output.
  - label: Review RAG Flow
    agent: RAG Lead
    prompt: Review this ingestion change for retrieval quality, runtime boundaries, and contract alignment.

---

# Doc Ingest Agent

## Target Scope

- `py_fn/**`
- `modules/retrieval/**`
- `modules/knowledge/**`

## Rules

- Keep conversion and normalization deterministic.
- Preserve source attribution fields.
- Align outputs with chunk and embedding contracts.
- Flag notable format-loss risk when source conversion may affect downstream retrieval.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/domain-lead.agent.md
````markdown
---
name: Domain Lead
description: Lead domain ownership decisions and enforce module boundaries, dependency direction, and API-only collaboration.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Refactor Module Boundary
    agent: MDDD Architect
    prompt: Refactor or review module boundaries, layer direction, and public API shape for this domain decision.
  - label: Update Contracts
    agent: TS Interface Writer
    prompt: Update the DTO, interface, or API contract surface that follows from this domain decision.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this domain change for behavioral risk, boundary regressions, and missing validation.

---

# Domain Lead

## Target Scope

- `modules/**`
- `packages/shared-types/**`
- `packages/api-contracts/**`

## Responsibilities

- Confirm owning bounded context before edits.
- Place logic in the correct layer.
- Prevent internal cross-module imports.

## Layer Placement Guide

- `domain`: business rules, entities, value objects, repository interfaces
- `application`: use cases and DTO orchestration
- `infrastructure`: external adapters and implementations
- `interfaces`: UI, hooks, queries, contracts, server actions
- `api`: only public cross-module boundary

## Validation

- Run lint for boundary and import changes.
- Run build when public types or exports are touched.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/e2e-qa.agent.md
````markdown
---
name: E2E QA Agent
description: Execute browser-level verification with Playwright MCP and report reproducible release-readiness evidence.
tools: ['serena/*', 'context7/*', 'read', 'search', 'todo', 'microsoft/playwright-mcp/*']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Summarize Quality Risk
    agent: Quality Lead
    prompt: Summarize the confirmed failures, residual risks, and release recommendation from this browser verification.
  - label: Expand Test Coverage
    agent: Test Scenario Writer
    prompt: Turn the executed browser paths and gaps into explicit scenario coverage recommendations.
  - label: Capture Support Follow-up
    agent: Support Architect
    prompt: Convert the confirmed failures and evidence into bounded support and follow-up actions.

---

# E2E QA Agent

## Target Scope

- `app/**`
- `modules/**/interfaces/**`
- `debug/**`

## Workflow

1. Build scenarios from acceptance criteria and user paths.
2. Execute browser interactions and capture runtime evidence.
3. Separate confirmed failures from improvement suggestions.

## Rules

- Capture clear reproduction steps.
- Separate confirmed failures from improvement ideas.
- Report console and network evidence when relevant.

## Output

- Scenarios executed
- Evidence collected
- Confirmed failures
- Release recommendation: ready | ready-with-risk | blocked

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/embedding-writer.agent.md
````markdown
---
name: Embedding Writer
description: Implement embedding generation and vector-write workflows with deterministic metadata and quality checks.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Review Chunk Inputs
    agent: Chunk Strategist
    prompt: Review the upstream chunking policy and metadata assumptions for this embedding workflow.
  - label: Refine Flow Integration
    agent: Genkit Flow Agent
    prompt: Refine the orchestration contract that consumes or coordinates this embedding workflow.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this embedding change for deterministic metadata, compatibility, and regression risk.

---

# Embedding Writer

## Target Scope

- `py_fn/**`
- `modules/retrieval/**`
- `modules/knowledge/**`

## Responsibilities

- Define embedding payload shape.
- Ensure consistent vector metadata.
- Validate write path and retrieval compatibility.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/firestore-schema.agent.md
````markdown
---
name: Firestore Schema Agent
description: Design Firestore document models, indexes, and access patterns aligned with module ownership and query workloads.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Plan Migration
    agent: Schema Migration Agent
    prompt: Plan the compatibility window, rollout path, and rollback strategy for this schema change.
  - label: Review Security Rules
    agent: Security Rules Agent
    prompt: Review the security-rule implications of this Firestore schema and access-pattern change.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this schema change for compatibility risk, query correctness, and missing validation.

---

# Firestore Schema Agent

## Target Scope

- `modules/**/infrastructure/**`
- `firestore.indexes.json`
- `firestore.rules`

## Responsibilities

- Model collections and documents for bounded contexts.
- Keep schema and index plans aligned with read and write paths.
- Track migration impact and backward compatibility.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/frontend-lead.agent.md
````markdown
---
name: Frontend Lead
description: Lead app route composition and component architecture while keeping business logic in modules and APIs.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute', 'shadcn/*']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Diagnose Route Behavior
    agent: App Router Agent
    prompt: Diagnose the App Router composition, rendering behavior, and runtime boundary impact for this frontend scope.
  - label: Compose UI Primitives
    agent: Shadcn Composer
    prompt: Compose or refactor the UI primitives and interaction states needed for this route-level frontend change.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this frontend change for UX regressions, ownership boundaries, and missing validation.

---

# Frontend Lead

## Target Scope

- `app/**`
- `modules/**/interfaces/**`
- `packages/ui-*/**`

## Mission

Deliver route-level UI slices with clear ownership and predictable data flow.

## Guardrails

- Keep app routes thin and composition-focused.
- Consume module behavior via module api only.
- Prefer server components unless client interactivity is required.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/genkit-flow.agent.md
````markdown
---
name: Genkit Flow Agent
description: Design and refine Genkit flow definitions, boundaries, and contract-safe integration with retrieval and worker pipelines.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'todo']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Review AI Ownership
    agent: AI Genkit Lead
    prompt: Review the Genkit orchestration ownership, runtime split, and app-side integration for this flow.
  - label: Review RAG Contract
    agent: RAG Lead
    prompt: Review this Genkit flow against retrieval contracts, worker boundaries, and indexing expectations.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this Genkit flow change for fallback behavior, contract safety, and validation gaps.

---

# Genkit Flow Agent

## Target Scope

- `modules/agent/**`
- `app/**`
- `modules/retrieval/**`

## Focus

- Flow inputs and outputs
- Prompt and tool orchestration boundaries
- Error handling and fallback behavior

## Guardrails

- Keep flow contracts explicit.
- Avoid leaking worker-only logic into app orchestration.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/kb-architect.agent.md
````markdown
---
name: KB Architect
description: Plan and optimize knowledge-base documentation structure, deduplication, and retrieval-friendly formatting.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'todo']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Refine Prompt Contracts
    agent: Prompt Engineer
    prompt: Refine the prompt contract, reusable workflow wording, and instruction clarity for this knowledge-base change.
  - label: Align Support Playbooks
    agent: Support Architect
    prompt: Align the support workflow, escalation notes, and operational follow-up with this knowledge-base update.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this knowledge-base change for clarity, consistency, and residual ambiguity.

---

# KB Architect

## Target Scope

- `docs/**`
- `.github/prompts/**`
- `.github/instructions/**`

## Focus

- Information hierarchy for docs and references
- Cross-document deduplication
- Stable glossary and index links

## Execution Pattern

- Process docs in leaf-to-root order when restructuring large doc trees.
- Prefer lint/compress/dedup/structure updates before index regeneration.
- Keep token usage efficient without changing technical meaning.

## Guardrails

- Do not change technical meaning while restructuring docs.
- Keep docs aligned with current module boundaries and contracts.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/knowledge-base.md
````markdown
# Knowledge Base — MDDD Domain & Architecture

This file contains domain knowledge about the xuanwu-app architecture and codebase. For coding rules, see [`../instructions/README.md`](../instructions/README.md).

## Module-Driven Domain Design (MDDD)

The project follows **Module-Driven Domain Design**: each business capability is a self-contained module under `modules/`. The architecture is **module-driven, not layer-driven** — code is grouped by domain context first, then by technical layer within each module.

### Core Principle

> Every module owns a bounded context. Modules communicate through `modules/<target-module>/api/` only, never by reaching into each other's internals.

### Global Dependency Direction

```
UI (interfaces/) → Application (application/) → Domain (domain/) ← Infrastructure (infrastructure/)
```

The domain layer has **zero outward dependencies**. Infrastructure implements domain-defined interfaces.

## Module Structure

Each module under `modules/` follows a four-layer Clean Architecture:

```
modules/<module-name>/
├── api/
│   └── index.ts                # Public cross-module API boundary (the ONLY import point for other modules)
├── index.ts                    # Optional local barrel for same-module composition
├── README.md                   # Module documentation (optional)
├── domain/
│   ├── entities/               # Aggregate roots, value objects, entity types
│   ├── repositories/           # Repository interfaces (contracts, NOT implementations)
│   ├── services/               # Pure domain services (stateless business rules)
│   ├── value-objects/          # DDD value objects (immutable, equality by value)
│   └── ports/                  # Hexagonal ports for cross-cutting dependencies (optional)
├── application/
│   ├── use-cases/              # One file per use case (single operation)
│   └── dto/                    # Data Transfer Objects for use-case I/O
├── infrastructure/
│   ├── firebase/               # Firebase Firestore repository implementations
│   ├── genkit/                 # AI/Genkit integrations (AI module)
│   ├── default/                # In-memory or simplified implementations
│   ├── memory/                 # In-memory stores (e.g., billing placeholder)
│   ├── persistence/            # Persistence adapters
│   └── repositories/           # Repository implementations (alternative layout)
└── interfaces/
    ├── components/             # React UI components
    ├── queries/                # TanStack Query hooks (read-side)
    ├── _actions/               # Next.js Server Actions (write-side)
    ├── hooks/                  # Custom React hooks
    ├── api/                    # REST API route controllers
    ├── contracts/              # API contracts
    └── view-models/            # View model transformations
```

Not every module has every subdirectory — only what it needs.

### Boundary Policy

- Every `modules/<module-name>/` is isolated.
- Cross-module imports are allowed only via `modules/<target-module>/api/`.
- Keep guidance generic by default: do not prescribe a fixed domain-to-module mapping unless a governing contract explicitly requires it.
- Keep boundaries explicit: business logic stays in `domain/` + `application/`; UI and UX concerns stay in `interfaces/` and `app/` composition.

## Module Inventory

Current module directories under `modules/` represent bounded contexts. Treat names as implementation-specific and avoid using this list as a hard-coded ownership policy for future design:

`account`, `agent`, `asset`, `content`, `identity`, `knowledge`, `knowledge-graph`, `notification`, `organization`, `retrieval`, `shared`, `workspace`, `workspace-audit`, `workspace-feed`, `workspace-flow`, `workspace-scheduling`.

> **Removed modules:** `wiki` (decomposed into `content`, `asset`, `workspace`, `retrieval`), `namespace` (slug utilities migrated to `shared`), `event` (event-store primitives migrated to `shared`). The following names in older docs are stale and no longer exist: `ai`, `audit`, `collaboration`, `file`, `graph`, `search`, `storage`.

## Package System (21 Packages)

Packages under `packages/` are **stable public boundaries** — the single source of truth for shared concerns. They contain actual implementations (no re-export chains).

### Import Rule

```typescript
// ✅ CORRECT — via @alias from tsconfig.json
import type { CommandResult, DomainError } from "@shared-types";
import { cn, formatDate } from "@shared-utils";
import { auth } from "@integration-firebase";

// ❌ NEVER — relative paths to package internals
import type { CommandResult } from "../../../../packages/shared-types/index";

// ❌ NEVER — legacy paths (ESLint will block)
import type { CommandResult } from "@/shared/types";
```

### Package Catalog

| Alias | Package | Purpose |
|-------|---------|---------|
| `@shared-types` | shared-types | `CommandResult`, `DomainError`, `Timestamp`, primitive types |
| `@shared-utils` | shared-utils | `cn()`, `formatDate()`, `generateId()` |
| `@shared-validators` | shared-validators | Zod schemas for cross-cutting validation |
| `@shared-constants` | shared-constants | `APP_NAME`, `PAGINATION_DEFAULTS` |
| `@shared-hooks` | shared-hooks | `useAppStore` (Zustand global state) |
| `@integration-firebase` | integration-firebase | Firebase client (auth, firestore, storage, messaging, functions, database, analytics, appcheck, performance, remote-config) |
| `@integration-http` | integration-http | Axios HTTP client with interceptors |
| `@api-contracts` | api-contracts | REST route registry + GraphQL schema |
| `@ui-shadcn` | ui-shadcn | shadcn/ui components, `cn()` utility, hooks |
| `@ui-vis` | ui-vis | Vis.js React components (VisNetwork, VisTimeline) |
| `@lib-date-fns` | lib-date-fns | date-fns v4 wrapper |
| `@lib-zod` | lib-zod | Zod v4 wrapper |
| `@lib-uuid` | lib-uuid | UUID v13 wrapper |
| `@lib-zustand` | lib-zustand | Zustand v5 wrapper |
| `@lib-xstate` | lib-xstate | XState v5 + React hooks |
| `@lib-tanstack` | lib-tanstack | TanStack Query/Form/Table/Virtual |
| `@lib-superjson` | lib-superjson | SuperJSON for serialization |
| `@lib-dragdrop` | lib-dragdrop | Atlaskit Pragmatic Drag and Drop |
| `@lib-react-markdown` | lib-react-markdown | react-markdown wrapper |
| `@lib-remark-gfm` | lib-remark-gfm | remark-gfm for GitHub-flavored markdown |

### ESLint Boundary Enforcement

Legacy import paths are blocked by `eslint.config.mjs`:

| Blocked Pattern | Replacement |
|----------------|-------------|
| `@/shared/*` | `@shared-types`, `@shared-utils`, `@shared-validators`, `@shared-constants`, `@shared-hooks` |
| `@/infrastructure/*` | `@integration-firebase`, `@integration-http` |
| `@/libs/*` | `@lib-*` or `@integration-*` |
| `@/ui/shadcn/*` | `@ui-shadcn/*` |
| `@/ui/vis*` | `@ui-vis` |
| `@/interfaces/*` | `@api-contracts` |

`modules/` 內也有額外邊界保護：

- `eslint-plugin-boundaries` 會檢查 `domain -> application / infrastructure / interfaces`、`application -> infrastructure / interfaces`、`infrastructure -> interfaces` 等違規依賴方向。
- `modules/*` 之間不可直接 import 對方的 `application/`、`domain/`、`infrastructure/`、`interfaces/`，必須走模組公開邊界（`@/modules/<module>` 或 `api/`）。
- 顯式 `index` 匯入（`../index`、`../index.ts`）在 `modules/` 內被封鎖，避免隱形跨層。

### 已知邊界警告（待修復）

以下為 `npm run lint` 中存在的既有 warning，尚未修復（0 errors，92 warnings 基準）：

目前沒有 `no-restricted-imports` 或 `boundaries/dependencies` 邊界違規。所有模組間的互動皆透過 `/api` 公開邊界。

> **已修復（2026-03）：** `modules/knowledge/api/index.ts` 原本直接 import `knowledge-graph/domain/`、`knowledge-graph/infrastructure/`、`knowledge-graph/application/`，現已改為透過 `../../knowledge-graph/api` 公開邊界。

> **已修復（2026-03）：** `modules/knowledge/application/use-cases/wiki-pages.use-case.ts` 與 `modules/source/application/use-cases/wiki-libraries.use-case.ts` 原本使用 `wiki_beta.*` 事件命名與 `"wiki-page"`/`"wiki-library"` aggregateType，現已改為符合模組所有權的 `content.page_*` / `content-page` 與 `asset.library_*` / `asset-library`。

## Tech Stack

| Concern | Technology | Version |
|---------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.7 |
| UI Library | React | 19.2.3 |
| Language | TypeScript | 5 |
| Backend | Firebase (client SDK) | 12 |
| Styling | Tailwind CSS | 4 |
| Validation | Zod | 4.3.6 |
| State (global) | Zustand | 5.0.12 |
| State (machines) | XState + @xstate/react | 5.28.0 / 6.1.0 |
| AI | Genkit + Google GenAI | 1.30.1 |
| Data Fetching | TanStack (Query, Table, Form, Virtual) | 5/8/1/3 |
| Visualization | Vis (network, timeline, graph3d, vis-data) | Various |
| Date Handling | date-fns | 4 |
| HTTP Client | Axios | 1.13.6 |
| Drag & Drop | @atlaskit/pragmatic-drag-and-drop | Latest |
| Node Engine | Node.js | 24 |

## Key Architectural Patterns

### Repository Pattern

- **Interface** lives in `domain/repositories/` — defines what the module needs
- **Implementation** lives in `infrastructure/` — how to fetch/persist (Firebase, memory, etc.)
- Domain layer never imports infrastructure

### Use Case Pattern

- Each use case is a single file under `application/use-cases/`
- Naming: `verb-noun.use-case.ts` (e.g., `list-workspace-files.use-case.ts`)
- One use case = one user-facing operation

### Hexagonal Ports (Advanced)

Example port shapes:
- `domain/ports/ActorContextPort.ts` — resolves who is acting
- `domain/ports/WorkspaceGrantPort.ts` — checks workspace permissions
- `domain/ports/OrganizationPolicyPort.ts` — checks tenant policies
- All access decisions flow through ports, not scattered in UI/router

### Domain Events

Event-store primitives live in `modules/shared` (migrated from the deleted `modules/event`):
- `EventRecord` — rich event-store entity (id, eventName, aggregateType, aggregateId, occurredAt, payload, metadata)
- `PublishDomainEventUseCase` — publishes events to the event store (`modules/shared/api`)
- `IEventStoreRepository` / `IEventBusRepository` — event-store repository interfaces
- `InMemoryEventStoreRepository` / `NoopEventBusRepository` — default implementations

Domain events within a module follow the discriminated-union pattern: `type: "module.event_name"` with top-level fields (no `payload` wrapper) and `occurredAtISO: string`.

### Internal Imports Within a Module

Inside a module, files use **relative imports** (not the module's own barrel export):

```typescript
// ✅ Inside modules/knowledge/application/use-cases/wiki-pages.use-case.ts
import { WikiPage } from "../../domain/entities/wiki-page.types";
import type { IWikiPageRepository } from "../../domain/repositories/WikiPageRepository";

// ❌ Do NOT self-import via the barrel
import { WikiPage } from "@/modules/knowledge";
```

### Cross-Module Imports

Between modules, always use the target module's `api/` boundary:

```typescript
// ✅ Cross-module import — event-store primitives are now in modules/shared
import { PublishDomainEventUseCase } from "@/modules/shared/api";

// ❌ Reaching into another module's internals
import { PublishDomainEventUseCase } from "@/modules/shared/application/publish-domain-event";
```

## Responsibility Boundaries

- Define ownership per feature or contract, not by hard-coded domain naming assumptions.
- If a capability spans modules, formalize the boundary in `api/` and keep each module's internals private.
- When ownership shifts, update contracts and architecture docs in the same change.
````

## File: .github/agents/lint-rule-enforcer.agent.md
````markdown
---
name: Lint Rule Enforcer
description: Enforce lint and boundary rules, identify violation causes, and propose minimal fixes without broad refactors.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Check Domain Boundary
    agent: Domain Lead
    prompt: Confirm whether this lint or boundary issue indicates a domain ownership or layer-placement problem.
  - label: Review Frontend Impact
    agent: Frontend Lead
    prompt: Review the frontend or route-composition impact of the lint and boundary issues identified above.
  - label: Summarize Quality Risk
    agent: Quality Lead
    prompt: Summarize the confirmed issues, fix status, and residual release risk after lint enforcement.

---

# Lint Rule Enforcer

## Target Scope

- `app/**`
- `modules/**`
- `packages/**`
- `providers/**`
- `py_fn/**`

## Mission

Keep rule compliance high while minimizing churn.

## Guardrails

- Fix root causes, not symptoms.
- Preserve existing architecture boundaries.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/mddd-architect.agent.md
````markdown
---
name: MDDD Architect
description: Design and refactor modules with strict MDDD ownership, layer direction, and API-only cross-module boundaries.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Confirm Domain Ownership
    agent: Domain Lead
    prompt: Confirm the owning bounded context and the required public API boundary for this module refactor.
  - label: Update Contracts
    agent: TS Interface Writer
    prompt: Update or review the public DTO and contract surface affected by this module refactor.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this module refactor for boundary regressions, compatibility risk, and missing validation.

---

# MDDD Architect

## Target Scope

- `modules/**`
- `packages/shared-types/**`
- `packages/api-contracts/**`

## Mission

Shape module structures without breaking bounded contexts.

## Rules

- Keep dependency direction: interfaces -> application -> domain <- infrastructure.
- Cross-module access must go through modules target api only.
- Keep domain framework-free.
- Run lint and build when boundaries or exports move.

## Module Lifecycle Operations

- Support create/refactor/split/merge/delete with explicit ownership mapping.
- Preserve public API compatibility or document migration steps in the same change.
- Replace internal cross-module imports with API contracts or event-driven collaboration.

## Output

- Ownership decision
- Boundary impact
- Files changed
- Validation evidence

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/prompt-engineer.agent.md
````markdown
---
name: Prompt Engineer
description: Create and refine high-signal prompts, templates, and prompt contracts for repeatable delivery workflows.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'todo']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Organize Knowledge Base
    agent: KB Architect
    prompt: Organize the surrounding knowledge-base structure, deduplication, and glossary alignment for this prompt work.
  - label: Refine Tool Strategy
    agent: Tool Caller
    prompt: Refine the tool sequencing, least-privilege access, and evidence flow expected by this prompt.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this prompt or workflow contract for ambiguity, missing constraints, and validation gaps.

---

# Prompt Engineer

## Target Scope

- `.github/prompts/**`
- `.github/instructions/**`
- `.github/agents/**`

## Focus

- Reusable prompt skeletons
- Clear input and output contracts
- Low-noise, high-precision instruction design

## Guardrails

- Keep prompts task-focused and testable.
- Avoid broad ambiguous directives.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/quality-lead.agent.md
````markdown
---
name: Quality Lead
description: Drive risk-first review and QA evidence, including regression detection, coverage gaps, and release recommendation.
tools: ['serena/*', 'context7/*', 'read', 'search', 'execute', 'todo']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Enforce Lint Rules
    agent: Lint Rule Enforcer
    prompt: Enforce the relevant lint and boundary rules and report the root causes for any remaining violations.
  - label: Verify Browser Flows
    agent: E2E QA Agent
    prompt: Execute the highest-risk browser scenarios and collect runtime evidence for this change.
  - label: Expand Test Scenarios
    agent: Test Scenario Writer
    prompt: Turn the residual risks and gaps into explicit unit, integration, or E2E scenario coverage.

---

# Quality Lead

## Target Scope

- `app/**`
- `modules/**`
- `packages/**`
- `providers/**`
- `py_fn/**`

## Mission

Verify correctness, boundary safety, and release readiness.

## Review Lenses

1. Correctness and behavioral regression risk
2. Ownership and boundary integrity
3. Validation completeness
4. Documentation completeness for changed behavior

## Workflow

1. Build scenario list from requirements and change scope.
2. Execute happy path, boundary, negative, and error scenarios.
3. Report findings by severity before summaries.

## Output

- Findings ordered by severity
- Evidence and reproduction details
- Residual risks and recommendation: ready, ready-with-risk, blocked

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/rag-lead.agent.md
````markdown
---
name: RAG Lead
description: Lead RAG ingest and retrieval contracts, runtime boundaries, and quality gates for chunk and vector pipelines.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'todo', 'microsoft/markitdown/*']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Normalize Ingestion
    agent: Doc Ingest Agent
    prompt: Normalize the ingestion inputs, attribution fields, and source-conversion flow for this RAG scope.
  - label: Design Chunk Strategy
    agent: Chunk Strategist
    prompt: Design the chunking policy, overlap, and metadata boundaries for this RAG scope.
  - label: Write Embeddings
    agent: Embedding Writer
    prompt: Implement or review the embedding payload, metadata writes, and compatibility guarantees for this RAG scope.

---

# RAG Lead

## Target Scope

- `py_fn/**`
- `modules/retrieval/**`
- `modules/knowledge/**`

## Focus

- Ingestion contract alignment
- Retrieval quality and index consistency
- Runtime split between app orchestration and worker processing

## Guardrails

- Validate contract alignment before changing ingestion shape.
- Keep Next.js orchestration and `py_fn` ingestion responsibilities separated.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/README.md
````markdown
# Xuanwu Agents

This folder contains the active workspace custom agents for VS Code Copilot.

## Active Agent Set

Use these files for role-specific routing only; repository-wide policy belongs in [`../copilot-instructions.md`](../copilot-instructions.md).

- Architecture and boundaries: `domain-architect.agent.md`, `mddd-architect.agent.md`, `domain-lead.agent.md`
- Next.js and UI: `app-router.agent.md`, `server-action-writer.agent.md`, `frontend-lead.agent.md`, `shadcn-composer.agent.md`
- Data / Firebase / security: `firestore-schema.agent.md`, `security-rules.agent.md`, `schema-migration.agent.md`
- AI / RAG: `ai-genkit-lead.agent.md`, `genkit-flow.agent.md`, `rag-lead.agent.md`, `doc-ingest.agent.md`, `chunk-strategist.agent.md`, `embedding-writer.agent.md`
- Quality and docs: `quality-lead.agent.md`, `lint-rule-enforcer.agent.md`, `e2e-qa.agent.md`, `test-scenario-writer.agent.md`, `prompt-engineer.agent.md`, `kb-architect.agent.md`

## Supporting Indexes

- [`commands.md`](./commands.md) — build, lint, test, and deployment commands
- [`knowledge-base.md`](./knowledge-base.md) — module inventory, aliases, and boundary facts

## Maintenance Rules

- Keep agent names unique and role-scoped.
- Keep tools least-privilege and remove stale skill tags when the referenced skills are not installed.
- Keep module-specific guides in `modules/<context>/AGENT.md`, not in `.github/agents/`.
- Update repomix-generated skills after meaningful `.github/*` changes.
````

## File: .github/agents/schema-migration.agent.md
````markdown
---
name: Schema Migration Agent
description: Plan and implement schema evolution with compatibility windows, data backfill steps, and rollback considerations.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Review Firestore Model
    agent: Firestore Schema Agent
    prompt: Review the source and target schema shape, query impact, and index needs for this migration plan.
  - label: Review Security Rules
    agent: Security Rules Agent
    prompt: Review the security-rule impact and access-policy compatibility for this migration plan.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this migration plan for rollout risk, rollback gaps, and validation completeness.

---

# Schema Migration Agent

## Target Scope

- `modules/**/infrastructure/**`
- `firestore.indexes.json`
- `firestore.rules`

## Workflow

1. Define source and target schema.
2. Plan compatibility and cutover phases.
3. Validate reads and writes before and after migration.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/security-rules.agent.md
````markdown
---
name: Security Rules Agent
description: Author and review Firestore and Storage security rules with least-privilege, tenancy isolation, and testable access policies.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Review Firestore Schema
    agent: Firestore Schema Agent
    prompt: Review the data model and access paths that this security-rules change must protect.
  - label: Verify Browser Impact
    agent: E2E QA Agent
    prompt: Verify the product flows affected by this rules change and capture evidence for any access regressions.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this security-rules change for least-privilege coverage, regression risk, and validation gaps.

---

# Security Rules Agent

## Target Scope

- `firestore.rules`
- `storage.rules`
- `modules/**/infrastructure/**`

## Mission

Prevent unauthorized access while preserving required product flows.

## Guardrails

- Enforce organization and workspace isolation.
- Prefer explicit allow conditions with clear actor checks.
- Pair rule changes with validation scenarios.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/server-action-writer.agent.md
````markdown
---
name: Server Action Writer
description: Write Next.js server actions that validate input, delegate to use cases, and return stable command results.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Update Contracts
    agent: TS Interface Writer
    prompt: Update or review the DTO and command-result contracts used by this server action.
  - label: Review Domain Boundary
    agent: Domain Lead
    prompt: Confirm the use-case boundary, layer placement, and API ownership for this server action.
  - label: Run Quality Review
    agent: Quality Lead
    prompt: Review this server action change for validation gaps, orchestration drift, and regression risk.

---

# Server Action Writer

## Target Scope

- `app/**`
- `modules/**/interfaces/**`
- `modules/**/application/**`

## Guardrails

- Keep actions thin and orchestration-only.
- Place business rules in module use cases.
- Preserve consistent command-result response shape.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/shadcn-composer.agent.md
````markdown
---
name: Shadcn Composer
description: Compose and refactor UI components using shadcn patterns while preserving route and module ownership boundaries.
argument-hint: Describe component goal, target route, and required interaction states.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'shadcn/*']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Review Frontend Ownership
    agent: Frontend Lead
    prompt: Review the route ownership, composition boundary, and data-flow assumptions behind this UI work.
  - label: Refine Parallel Routes
    agent: Parallel Routes Agent
    prompt: Refine the slot composition, state isolation, and route-level integration for this UI work.
  - label: Verify End-to-End
    agent: E2E QA Agent
    prompt: Verify the interaction states and browser behavior for this UI change.

---

# Shadcn Composer

## Target Scope

- `app/**`
- `modules/**/interfaces/components/**`
- `packages/ui-shadcn/**`

## Workflow

1. Confirm route ownership and API data shape before composing UI.
2. Reuse existing primitives and tokens first.
3. Validate interaction states and accessibility basics.

## Rules

- Reuse existing component primitives before adding new ones.
- Keep styling and behavior consistent with app composition boundaries.
- Validate interactive states and accessibility basics.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/test-scenario-writer.agent.md
````markdown
---
name: Test Scenario Writer
description: Write risk-based scenario suites for unit, integration, and E2E coverage with clear acceptance criteria.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'todo']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Review Quality Risk
    agent: Quality Lead
    prompt: Review these scenarios against the highest-risk behaviors, missing coverage, and release concerns.
  - label: Verify Browser Flows
    agent: E2E QA Agent
    prompt: Execute the E2E scenarios from this suite in the browser and collect runtime evidence.
  - label: Check Lint And Rules
    agent: Lint Rule Enforcer
    prompt: Check whether any structural or lint rule changes are needed to support the scenarios described above.

---

# Test Scenario Writer

## Target Scope

- `app/**`
- `modules/**`
- `py_fn/tests/**`

## Scope

- Happy path
- Boundary and negative paths
- Error handling and regression-sensitive paths

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/agents/ts-interface-writer.agent.md
````markdown
---
name: TS Interface Writer
description: Write and refactor TypeScript interfaces, DTOs, and contracts with stable naming and compatibility-aware changes.
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search']
model: 'GPT-5.3-Codex'
handoffs:
  - label: Review Domain Ownership
    agent: Domain Lead
    prompt: Confirm the owning bounded context and public API boundary for these contract changes.
  - label: Write Server Action
    agent: Server Action Writer
    prompt: Update the server action orchestration that consumes or returns these contract changes.
  - label: Review Firestore Shape
    agent: Firestore Schema Agent
    prompt: Review the persistence and index implications of these contract changes.

---

# TS Interface Writer

## Target Scope

- `modules/**/api/**`
- `modules/**/application/dto/**`
- `packages/shared-types/**`

## Focus

- Domain and application DTO contracts
- Backward-safe type evolution
- Explicit optional and required field transitions

## Guardrails

- Keep module interface and API contracts explicit and minimal.
- Do not leak private infrastructure/entity internals into public API contracts.
- Coordinate contract changes with consumer updates in the same change.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/copilot-instructions.md
````markdown
---
applyTo: **
description: Xuanwu Copilot Workspace Instructions
name: Xuanwu Copilot Workspace Instructions
---

# Xuanwu Copilot Workspace Instructions

Always-on workspace guidance for Copilot. Keep this file short, stable, and repository-wide. Put file-type, framework, or task-specific rules in [.github/instructions](./instructions), reusable workflows in prompts, and tool- or role-specific behavior in skills.

## Purpose

- Align Copilot with Xuanwu architecture, validation flow, and delivery boundaries.
- Keep always-on instructions low-noise so scoped `.instructions.md` files can do the detailed work.
- Prefer references to canonical docs over repeated policy text.

## Authoritative Sources

Read these in order before making non-trivial decisions:

1. [terminology-glossary.md](./terminology-glossary.md) for canonical terminology routing.
2. [AGENTS.md](../AGENTS.md) for repository-wide rules and validation commands.
3. [CLAUDE.md](../CLAUDE.md) for cross-agent compatibility.
4. [agents/knowledge-base.md](./agents/knowledge-base.md) for module ownership, aliases, and MDDD boundaries.
5. [agents/commands.md](./agents/commands.md) for build, lint, test, and deployment commands.
6. [CONTRIBUTING.md](../CONTRIBUTING.md) for review scope and evidence expectations.

## DDD Reference Authority

DDD knowledge is owned by `docs/ddd/`. Use the root DDD maps first and then the matching bounded-context reference set.

| Query | Canonical Document |
|-------|-------------------|
| Strategic subdomain classification | [`docs/ddd/subdomains.md`](../docs/ddd/subdomains.md) |
| Bounded Context boundaries / module map | [`docs/ddd/bounded-contexts.md`](../docs/ddd/bounded-contexts.md) |
| Context terminology | `docs/ddd/<context>/ubiquitous-language.md` |
| Context aggregates / entities / value objects | `docs/ddd/<context>/aggregates.md` |
| Context domain events | `docs/ddd/<context>/domain-events.md` |
| Context map | `docs/ddd/<context>/context-map.md` |
| Context repositories | `docs/ddd/<context>/repositories.md` |
| Context application services | `docs/ddd/<context>/application-services.md` |
| Context domain services | `docs/ddd/<context>/domain-services.md` |

**Rule**: `.github/instructions/` files contain **behavioral constraints** (what Copilot must do). `docs/ddd/` contains the repository's DDD knowledge set. Link instead of copying.

## Workspace-Wide Operating Rules

- Plan first for cross-module, cross-runtime, schema, or contract-governed changes.
- Treat the approved plan as the execution contract; stay within scope and update docs when boundaries or public APIs change.
- Search and read before editing. Prefer existing instructions, prompts, and skills over ad hoc restatement.
- Keep changes minimal, local, and boundary-safe.

## Architecture Guardrails

- Follow Module-Driven Domain Design: each `modules/<context>/` directory is an isolated bounded context.
- Cross-module access must go through the target module's `api/` boundary only.
- Keep dependency direction explicit: `interfaces/` -> `application/` -> `domain/` <- `infrastructure/`.
- Keep business logic in `domain/` and `application/`; keep UI, transport, and composition in `interfaces/` and `app/`.
- Use package aliases such as `@shared-*`, `@ui-*`, `@lib-*`, and `@integration-*`; do not introduce legacy `@/shared/*`, `@/libs/*`, or similar paths.
- Preserve the runtime split: Next.js owns browser-facing UX, auth/session, orchestration, and streaming; `py_fn/` owns ingestion, parsing, chunking, embedding, and worker jobs.

## Copilot Customization Design Rules

- Keep this file concise and self-contained; prefer short directive statements over long tutorial prose.
- Put scoped guidance in focused `.instructions.md` files with narrow `applyTo` patterns.
- Reuse canonical references instead of duplicating the same rules across instructions, prompts, agents, and skills.
- Do not turn temporary implementation details, current module counts, or migration mappings into permanent global rules.
- When customizations appear ignored, verify them with Chat customization diagnostics before changing the file structure.

## Serena MCP

Serena is mandatory for project memory, index management, and any `.serena/` operation.

- Activate the `xuanwu-app` project before memory operations.
- Never edit `.serena/` with direct file tools.
- Record phase-end memory updates through Serena tooling.
- See [skills/serena-mcp/SKILL.md](skills/serena-mcp/SKILL.md) for workflow details.

## Skill And Agent Routing

- Use [skills/xuanwu-app-skill/SKILL.md](skills/xuanwu-app-skill/SKILL.md) when repository structure or implementation location matters.
- Use [skills/xuanwu-app-markdown-skill/SKILL.md](skills/xuanwu-app-markdown-skill/SKILL.md) when markdown documentation structure or wording matters.
- Use boundary or contract skills only when the task actually crosses those concerns.
- Keep prompts, instructions, agents, and skills complementary. Do not duplicate the same policy in multiple layers unless the scope is different.

## Validation

- Run the matching validation for changed files by using [agents/commands.md](./agents/commands.md).
- Do not close work until required lint, build, test, and documentation updates are complete.

## Terminology

- Terminology routing is governed by [terminology-glossary.md](./terminology-glossary.md).
- Treat glossary terminology as canonical naming and vocabulary authority.
- Do not introduce new terms if an equivalent glossary term already exists.
- When multiple names exist, normalize to the glossary term before implementation.
- Use glossary-aligned wording for prompts, instructions, agents, skills, and DDD docs.
````

## File: .github/instructions/doc-governance.instructions.md
````markdown
---
description: 'IDDD-based documentation governance rules: single source of truth per DDD concept, Diataxis classification, and anti-bloat constraints.'
applyTo: 'docs/**/*.md'
---

# 文件治理規範 (Documentation Governance)

遵循 Vaughn Vernon《Implementing Domain-Driven Design》的 **Published Language** 原則：每個 DDD 概念只有一個公開、版本化的真相來源。

> 權威知識位置：[`docs/ddd/`](../../docs/ddd/)
> 文件框架來源：[`docs/SOURCE-OF-TRUTH.md`](../../docs/SOURCE-OF-TRUTH.md) (Diataxis)

## 核心規則（強制）

1. **唯一真相來源（Single Source of Truth）**：每個 DDD 概念在 `docs/ddd/` 中只能對應到一套根文件或一組 bounded-context 文件。新增文件前必須先確認 `docs/ddd/` 中不存在同主題內容。
2. **禁止複製（No Duplication）**：嚴禁將 `docs/ddd/` 的內容複製到 `.github/`、`modules/` 或其他位置。引用請使用 Markdown 相對連結。
3. **引用而非複製（Link, Don't Copy）**：
   ```markdown
   ✅ 正確：詳見 [bounded-contexts.md](../../docs/ddd/bounded-contexts.md)
   ❌ 錯誤：直接貼上 bounded-contexts.md 的內容
   ```
4. **Instructions 只含行為約束**：`.github/instructions/` 文件只描述 Copilot 的**行為規則**，不包含領域知識。知識連結到 `docs/ddd/`。
5. **術語查閱優先**：引入新術語前，先查 [`../../.github/terminology-glossary.md`](../../.github/terminology-glossary.md) 與對應 bounded context 的 `docs/ddd/<context>/ubiquitous-language.md`。

## 文件分類（Diataxis 四象限）

| 目錄 | 目的 | 寫作風格 |
|------|------|---------|
| `docs/tutorials/` | 學習導向，引導式操作 | 第二人稱，步驟化 |
| `docs/guides/how-to/` | 任務導向，解決特定問題 | 以目標開頭 |
| `docs/reference/` | 精確事實，API / 術語查詢 | 簡潔、可掃描 |
| `docs/guides/explanation/` | 概念導向，解釋「為什麼」 | 分析性散文 |
| `docs/ddd/` | Xuanwu 的 DDD 參考集 | 結構化 + 程式碼對照 |

## DDD 概念的文件定位

| 概念 | 唯一文件 | 其他地方的處理 |
|------|---------|--------------|
| 子域分類 | [`subdomains.md`](../../docs/ddd/subdomains.md) | 只能連結，不能複製 |
| 限界上下文 / 模組地圖 | [`bounded-contexts.md`](../../docs/ddd/bounded-contexts.md) | 只能連結，不能複製 |
| 通用語言 / 術語 | `docs/ddd/<context>/ubiquitous-language.md` | 只能連結，不能複製 |
| 聚合根 / 實體 / VO | `docs/ddd/<context>/aggregates.md` | 只能連結，不能複製 |
| 領域事件 | `docs/ddd/<context>/domain-events.md` | 只能連結，不能複製 |
| 上下文地圖 | `docs/ddd/<context>/context-map.md` | 只能連結，不能複製 |
| 儲存庫模式 | `docs/ddd/<context>/repositories.md` | 只能連結，不能複製 |
| 使用案例 / Application Services | `docs/ddd/<context>/application-services.md` | 只能連結，不能複製 |
| Domain Services | `docs/ddd/<context>/domain-services.md` | 只能連結，不能複製 |

## 防止文件膨脹的規則

- **新增前審查**：每個新 `docs/` 文件必須明確歸屬 Diataxis 的一個象限。
- **最大兩層深度**：`docs/<section>/<file>.md`，禁止更深的嵌套。
- **禁止跨象限混合**：一個文件只服務一個目的（tutorial / how-to / reference / explanation）。
- **技術文件屬於模組**：模組特定的實作細節放在 `modules/<context>/README.md`，不放在全局 `docs/`。
- **Repomix 技能同步**：`.github/skills/` 的 repomix 輸出必須透過 `package.json` 既有 scripts 重新生成，保持與 `.github/*` 和 `docs/ddd/*` 同步。

Tags: #use skill context7 #use skill xuanwu-app-skill
````

## File: .github/prompts/generate-aggregate.prompt.md
````markdown
---
name: generate-aggregate
description: 根據業務需求生成符合 IDDD 規範的 TypeScript 聚合根骨架，包含值對象、領域事件與 Zod Schema。
agent: Domain Architect
argument-hint: 提供聚合名稱、所屬限界上下文（模組）、核心業務規則與狀態欄位。
---

# 生成聚合根 (Generate Aggregate Root)

## 輸入

- **聚合名稱**：例如 `Workspace`、`KnowledgeBase`
- **所屬模組**：例如 `workspace`、`knowledge`
- **核心業務規則（不變數）**：列出需要保護的業務規則
- **狀態欄位**：列出聚合的主要屬性與型別
- **主要業務操作**：列出需要封裝的命令方法

## 工作流程

1. 查閱 `terminology-glossary.md` 確認命名符合通用語言規範。
2. 查閱 `.github/instructions/domain-modeling.instructions.md` 確認設計模式。
3. 在 `modules/<context>/domain/` 建立以下檔案：
   - `value-objects/<AggregateName>Id.ts` — 識別碼品牌型別
   - `aggregates/<AggregateName>.ts` — 聚合根類別
   - `events/<AggregateName>Created.ts` — 建立領域事件
4. 聚合根必須包含：
   - 私有建構函式 + 靜態工廠方法 `create()` 與 `reconstitute()`
   - Zod Schema 嚴格定義狀態型別
   - `_domainEvents: DomainEvent[]` 私有陣列
   - `pullDomainEvents()` 提取並清空事件的方法
   - `getSnapshot(): Readonly<State>` 唯讀快照方法
5. 每個業務方法必須：
   - 驗證不變數，違規時拋出帶有描述性訊息的 `Error`
   - 更新內部狀態
   - 將對應的領域事件推入 `_domainEvents`

## 輸出合約

- 識別碼值對象檔案（品牌 Zod Schema）
- 聚合根 TypeScript 類別（完整實作，含所有業務方法）
- 至少一個領域事件定義（Zod Schema + 推導型別）
- 更新 `modules/<context>/domain/aggregates/index.ts`（若存在）

## 驗證

- `npm run lint` — 確認無邊界違規與型別錯誤
- `npm run build` — 確認型別一致性

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/prompts/generate-domain-event.prompt.md
````markdown
---
name: generate-domain-event
description: 根據業務操作生成符合 IDDD 規範的 TypeScript 領域事件定義，包含 Zod Schema、型別推導與聚合整合。
agent: Domain Architect
argument-hint: 提供觸發事件的業務操作名稱、所屬聚合、Payload 欄位與所屬模組。
---

# 生成領域事件 (Generate Domain Event)

## 輸入

- **觸發業務操作**：例如「使用者建立工作空間」
- **事件名稱（過去式）**：例如 `WorkspaceCreated`
- **所屬聚合**：例如 `Workspace`
- **所屬模組**：例如 `workspace`
- **Payload 欄位**：列出事件需攜帶的資料與其型別

## 工作流程

1. 確認事件名稱符合**過去式**命名規範（查閱 `ubiquitous-language.instructions.md`）。
2. 確認 `discriminant` 格式為 `<module-name>.<action>`，例如 `workspace.created`。
3. 確認 `occurredAt` 使用 ISO string，遵循 `modules/shared/domain/events.ts` 的 `DomainEvent` 介面。
4. 在 `modules/<context>/domain/events/<EventName>.ts` 建立事件定義。
5. 在對應聚合根的業務方法中加入事件推入邏輯：`this._domainEvents.push({ ... })`。
6. 若需要，更新 `modules/<context>/domain/events/index.ts` 匯出。

## 事件定義模板

```typescript
import { z } from 'zod';

export const {EventName}Schema = z.object({
  type: z.literal('{module}.{action}'),
  eventId: z.string().uuid(),
  occurredAt: z.string().datetime(),   // ISO 8601，非 Date 物件
  payload: z.object({
    // 在此定義業務相關的 Payload 欄位
  }),
});

export type {EventName} = z.infer<typeof {EventName}Schema>;
```

## 輸出合約

- 領域事件 Zod Schema（完整定義）
- 推導出的 TypeScript 型別
- 更新對應聚合根，在業務方法中推入事件
- 更新 `modules/<context>/domain/events/index.ts` 匯出（若適用）

## 驗證

- 確認事件的 `occurredAt` 使用 ISO string 而非 `Date` 物件（與 `shared/domain/events.ts` 一致）。
- 確認事件 `type` discriminant 格式為 `<module>.<action>`，與模組命名一致。
- `npm run lint` — 確認無邊界違規。

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/terminology-glossary.md
````markdown
# Terminology Glossary Entry Point

Use this file as the stable glossary entry point referenced by `.github/*` customizations.

## DDD Reference Set

- Strategic classification: [`../docs/ddd/subdomains.md`](../docs/ddd/subdomains.md)
- Bounded context map: [`../docs/ddd/bounded-contexts.md`](../docs/ddd/bounded-contexts.md)
- Context terms: use the matching `../docs/ddd/<context>/ubiquitous-language.md`

## Bounded Context Glossaries

- [`account`](../docs/ddd/account/ubiquitous-language.md)
- [`ai`](../docs/ddd/ai/ubiquitous-language.md)
- [`identity`](../docs/ddd/identity/ubiquitous-language.md)
- [`knowledge`](../docs/ddd/knowledge/ubiquitous-language.md)
- [`notebook`](../docs/ddd/notebook/ubiquitous-language.md)
- [`notification`](../docs/ddd/notification/ubiquitous-language.md)
- [`organization`](../docs/ddd/organization/ubiquitous-language.md)
- [`search`](../docs/ddd/search/ubiquitous-language.md)
- [`shared`](../docs/ddd/shared/ubiquitous-language.md)
- [`source`](../docs/ddd/source/ubiquitous-language.md)
- [`wiki`](../docs/ddd/wiki/ubiquitous-language.md)
- [`workspace`](../docs/ddd/workspace/ubiquitous-language.md)
- [`workspace-audit`](../docs/ddd/workspace-audit/ubiquitous-language.md)
- [`workspace-feed`](../docs/ddd/workspace-feed/ubiquitous-language.md)
- [`workspace-flow`](../docs/ddd/workspace-flow/ubiquitous-language.md)
- [`workspace-scheduling`](../docs/ddd/workspace-scheduling/ubiquitous-language.md)

When a term is shared across contexts, prefer the local bounded-context glossary first and then reconcile with [`subdomains.md`](../docs/ddd/subdomains.md) and [`bounded-contexts.md`](../docs/ddd/bounded-contexts.md).
````

## File: CONTRIBUTING.md
````markdown
# Contributing to Xuanwu App

Contributions are welcome. Please follow these guidelines to keep the codebase consistent and easy to review.

## House Rules

### 👥 Prevent Work Duplication

Before opening a new issue or PR, check whether it already exists in [Issues](https://github.com/122sp7/xuanwu-app/issues) or [Pull Requests](https://github.com/122sp7/xuanwu-app/pulls).

### ✅ Work on Approved Issues

For new feature requests, wait for a maintainer to approve the issue before starting implementation. Bug fixes, security, performance, and documentation improvements can begin immediately.

### 🚫 One Concern per PR

Keep PRs small and focused. A PR should address one feature, bug, or refactor. Split large changes into a sequence of smaller PRs that can be reviewed and merged independently.

### 📚 Write for Future Readers

Every PR contributes to the long-term understanding of the codebase. Write clearly enough that someone — possibly you — can revisit it months later and still understand what happened and why.

### ✅ Summarize Your PR

Provide a short summary at the top of every PR describing the intent. Use `Closes #123` or `Fixes #456` in the description to auto-link related issues.

### 🧪 Describe What Was Tested

Explain how you validated your changes. For example: _"Tested locally with npm run dev, verified the new route renders without errors."_

---

## Development

### Prerequisites

- Node.js 24
- npm

### Setup

```bash
npm install
npm run dev      # Start Next.js dev server (port 3000)
```

### Validation

Before pushing, ensure these all pass:

```bash
npm run lint     # ESLint — must have 0 errors
npm run build    # Next.js production build + TypeScript type-check
```

For the Python worker:

```bash
cd py_fn && python -m compileall -q .
cd py_fn && python -m pytest tests/ -v
```

---

## Architecture Conventions

This project follows **Module-Driven Domain Design (MDDD)**. Before making changes, read:

- [`.github/agents/README.md`](.github/agents/README.md) — rules index
- [`.github/agents/knowledge-base.md`](.github/agents/knowledge-base.md) — domain knowledge and module inventory
- [`CLAUDE.md`](CLAUDE.md) — key architecture rules and patterns

### Key Rules

- Business logic lives in `modules/<context>/` with four layers: `domain/`, `application/`, `infrastructure/`, `interfaces/`.
- Dependency direction: `interfaces/ → application/ → domain/ ← infrastructure/`.
- `domain/` must be framework-free.
- Use `@alias` package imports (e.g., `@shared-types`, `@ui-shadcn`). Never use legacy `@/shared/*`, `@/libs/*`, `@/ui/*` paths.
- Keep Next.js Server Actions thin — delegate to use cases, return `CommandResult`.

### File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Domain entity | `PascalCase.ts` | `Organization.ts` |
| Repository interface | `MyRepository.ts` | `WorkspaceRepository.ts` |
| Firebase repository | `FirebaseMyRepository.ts` | `FirebaseWorkspaceRepository.ts` |
| Use case | `my-use-case.ts` | `create-workspace.ts` |
| Server Action | `*.actions.ts` | `workspace.actions.ts` |
| React component | `PascalCase.tsx` | `WorkspaceCard.tsx` |

---

## Making a Pull Request

1. Fork the repository and create a branch from `main`.
2. Make focused, incremental changes.
3. Ensure `npm run lint` and `npm run build` pass with no new errors.
4. Fill out the PR description with intent, changes, and testing notes.
5. Link related issues with `Closes #N` or `Refs #N`.
6. Request a review.

---

## Spec-Driven Development

For larger features, consider using spec-driven development. See [`SPEC-WORKFLOW.md`](SPEC-WORKFLOW.md).

## AI Delivery Workflow

For larger or cross-module changes, prefer the formal Copilot delivery workflow:

- Plan first with [`docs/swarm.md`](docs/swarm.md)
- Use the implementation plan as the execution contract for implementation, review, and QA
- Keep documentation updates in the same change whenever scope, boundaries, or public workflows move
````

## File: docs/ddd/bounded-contexts.md
````markdown
# Bounded Contexts — Xuanwu App

> **理論依據：** Vaughn Vernon《Implementing Domain-Driven Design》第 2–3 章  
> **產品定位：** Knowledge Platform / Second Brain，以 **Knowledge** 為核心、**Wiki** 為結構、**AI** 為推理層。

本文件定義 Xuanwu App 目前採用的 **16 個有界上下文（Bounded Contexts）**。  
Notion、Wiki、NotebookLM 在這裡是**產品能力映射**，不是 1:1 的程式模組名稱：

- **Notion-like 層**：知識儲存、編輯、工作區協作、來源接入
- **Wiki-like 層**：知識關聯、節點、邊、結構化導覽
- **NotebookLM-like 層**：檢索、摘要、問答、推理

---

## 系統層級映射

| 系統層級 | 產品隱喻 | 主要 Bounded Context | 說明 |
|---|---|---|---|
| Knowledge UI / Storage Layer | Notion-like | `knowledge`, `source`, `workspace` | 管理知識頁面、來源文件、工作區容器與操作介面 |
| Knowledge Structure Layer | Wiki-like | `wiki` | 維護知識節點、關聯、Backlink 與圖譜遍歷 |
| AI Reasoning Layer | NotebookLM-like | `notebook`, `search`, `ai` | 執行檢索、引用、摘要、問答與攝入管線協調 |
| Platform Foundation Layer | 平台基礎 | `identity`, `account`, `organization`, `notification`, `shared` | 支撐身份、帳戶、組織、通知與共享核心 |
| Workspace Operations Layer | 協作營運 | `workspace-flow`, `workspace-scheduling`, `workspace-audit`, `workspace-feed` | 支撐任務、排程、稽核與工作區動態 |

---

## 子域分類摘要

| 分類 | Bounded Context |
|---|---|
| **Core Domain** | `knowledge`, `wiki` |
| **Supporting Subdomain** | `ai`, `notebook`, `search`, `source`, `workspace-flow`, `workspace-scheduling`, `workspace-audit`, `workspace-feed` |
| **Generic Subdomain / Shared Kernel** | `identity`, `account`, `organization`, `workspace`, `notification`, `shared` |

---

## Bounded Context Catalog

| Context | Domain Type | 系統角色 | 主要職責 | 主要協作 |
|---|---|---|---|---|
| `identity` | Generic | 身份入口 | 驗證、登入、token 生命週期 | `account`, `organization`, `workspace` |
| `account` | Generic | 個人帳戶層 | 個人設定檔、偏好、存取政策 | `identity`, `organization` |
| `organization` | Generic | 多租戶治理 | 組織、成員、團隊、夥伴邀請 | `account`, `workspace` |
| `workspace` | Generic | 協作容器 | 工作區、成員、內容樹、子模組整合 | `organization`, `knowledge`, `wiki`, `workspace-*` |
| `notification` | Generic | 通知分發 | 系統訊息、提醒、成功/警告通知 | 全域消費 |
| `shared` | Shared Kernel | 共享核心 | 共用事件、值物件、工具與跨域基礎型別 | 全域依賴 |
| `knowledge` | **Core** | Notion-like 核心內容層 | 知識頁面、版本、內容區塊、審批事件 | `workspace`, `wiki`, `source`, `workspace-flow`, `search`, `notebook` |
| `source` | Supporting | 來源接入層 | 文件上傳、來源登記、保留政策、攝入交接 | `workspace`, `knowledge`, `ai` |
| `wiki` | **Core** | Wiki-like 結構層 | 節點、邊、Backlink、知識圖譜 | `knowledge`, `source`, `search`, `notebook`, `workspace` |
| `ai` | Supporting | AI 攝入協調層 | Ingestion job、worker handoff、索引前處理 | `source`, `search`, `notebook` |
| `notebook` | Supporting | NotebookLM-like 互動層 | 對話、摘要、洞察、引用式問答 | `search`, `knowledge`, `wiki`, `ai` |
| `search` | Supporting | 語意檢索層 | 向量搜尋、RAG 查詢、答案與反饋 | `ai`, `notebook`, `wiki`, `knowledge` |
| `workspace-flow` | Supporting | 工作流程層 | Task / Issue / Invoice 狀態機與物化 | `knowledge`, `workspace`, `workspace-audit`, `workspace-feed` |
| `workspace-scheduling` | Supporting | 協作排程層 | 工作需求、日曆視圖、截止與容量安排 | `workspace`, `workspace-flow` |
| `workspace-audit` | Supporting | 稽核追蹤層 | Append-only 稽核紀錄與查詢 | `workspace`, `organization`, `workspace-flow` |
| `workspace-feed` | Supporting | 工作區動態層 | 工作區貼文、回覆、互動事件流 | `workspace`, `workspace-flow`, `notification` |

---

## 典型依賴與協作方式

```text
Identity → Account → Organization → Workspace
                              ├─→ Knowledge ─→ Search ─→ Notebook
                              ├─→ Wiki ────────────────┘
                              ├─→ Source ───→ AI ─────┘
                              └─→ Workspace Operations
                                   ├─ workspace-flow
                                   ├─ workspace-scheduling
                                   ├─ workspace-audit
                                   └─ workspace-feed
```

---

## 整合原則

1. **Cross-module access 必須走 `api/`**，不得 reach-through 到其他模組內部層。  
2. **Core Domain** 以 `knowledge` 與 `wiki` 為中心，其他上下文支撐其儲存、結構化與推理能力。  
3. **事件整合優先於同步耦合**：例如 `knowledge.page_approved` 驅動 `workspace-flow` 物化。  
4. **外部系統透過 Anti-Corruption Layer 整合**：例如 Firebase、Vector Store、Genkit、Python worker。  
5. **Runtime split 必須維持**：Next.js 負責使用者互動與協調；`py_fn/` 負責重型 ingestion / embedding。  

---

## 詳細文件

- 子域分類：[`subdomains.md`](./subdomains.md)
- 各 BC 詳細文件：`docs/ddd/<context>/README.md`
- 通用語言：各 bounded context 的 `ubiquitous-language.md`
- 上下文關係圖：各 bounded context 的 `context-map.md`
````

## File: docs/ddd/notebook/repositories.md
````markdown
# notebook — Repositories

> **Canonical bounded context:** `notebook`
> **模組路徑:** `modules/notebook/`
> **Domain Type:** Supporting Subdomain

本文件整理 `notebook` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/NotebookRepository.ts`

> `RagGenerationRepository` 與 `RagRetrievalRepository` 已移至 `modules/search`，
> `domain/repositories/RagGenerationRepository.ts` 與 `domain/repositories/RagRetrievalRepository.ts`
> 為 `@deprecated` re-export stub，不屬於 notebook domain ports。

## Infrastructure Implementations

- `infrastructure/genkit/GenkitNotebookRepository.ts`
- `infrastructure/genkit/client.ts`
- `infrastructure/genkit/index.ts`
- `infrastructure/index.ts`

> `infrastructure/firebase/FirebaseRagRetrievalRepository.ts` 屬於 `search` BC，
> 雖然目前物理上仍在 notebook infrastructure 目錄下，應視為過渡性存放。

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/notebook/repositories.md`
- `../../../docs/ddd/notebook/aggregates.md`
````

## File: docs/ddd/subdomains.md
````markdown
# Subdomains — Xuanwu App

> **理論依據：** Vaughn Vernon《Implementing Domain-Driven Design》第 2 章 Strategic Design  
> **產品定位：** Xuanwu 是一個以知識為核心的 Knowledge Platform / Second Brain。

本文件將 Xuanwu App 的能力劃分為 **Core Domain**、**Supporting Subdomain** 與 **Generic Subdomain / Shared Kernel**，用於指導投資順序、建模深度與邊界嚴格度。

---

## 分類原則

| 分類 | 定義 | 投資策略 |
|---|---|---|
| **Core Domain** | 直接承載產品差異化價值 | 最高投入、精細建模、優先保護語言與聚合邊界 |
| **Supporting Subdomain** | 支撐核心價值落地，但不是產品獨特賣點 | 務實建模、重視整合與可靠性 |
| **Generic Subdomain** | 常見平台能力，偏向商品化 | 優先封裝現成方案、最小必要客製化 |
| **Shared Kernel** | 多個上下文共同依賴的穩定共享核心 | 嚴格控制變更、避免膨脹為隱性大模組 |

---

## Core Domain

### `knowledge` — 知識內容管理

Xuanwu 的第一核心域。它承擔 Notion-like 的知識建立、編輯、版本化與審批流程，是使用者最直接感知的產品價值。

**為何是核心域：**
- 承載 Knowledge Page / Block Editor 的主體體驗
- 決定知識如何被保存、版本化、審批與再利用
- `knowledge.page_approved` 是整個平台向下游協作擴散的關鍵事件

### `wiki` — 知識結構與圖譜

Xuanwu 的第二核心域。它提供 Wiki-like 的節點、關聯、Backlink 與結構導航，是知識平台從「文件集合」進化到「知識網路」的關鍵。

**為何是核心域：**
- 提供知識關聯與語意結構，而不只是文件儲存
- 形成 NotebookLM-like 推理所需的可追溯結構基礎
- 與 `knowledge` 共同構成平台的差異化壁壘

---

## Supporting Subdomains

### `source`
負責接入外部文件、上傳與來源登記，是知識進入平台的入口。

### `ai`
負責攝入 job 與 worker handoff，確保來源文件可以被解析、切塊、向量化並交付檢索層。

### `search`
負責語意檢索、引用與 RAG 查詢，是 AI 問答品質的基礎支撐。

### `notebook`
負責以 NotebookLM-like 互動方式把檢索結果轉成摘要、回答、洞察與對話經驗。

### `workspace-flow`
負責把知識內容轉成可執行的任務、問題與發票流程，讓知識平台可進一步驅動協作執行。

### `workspace-scheduling`
負責工作需求與排程，將協作項目放入時間與容量視角管理。

### `workspace-audit`
負責 append-only 稽核可見性，確保工作區與組織範圍內的重要行為可追溯。

### `workspace-feed`
負責工作區動態流與互動紀錄，提升知識協作的可見性與社交流動。

---

## Generic Subdomains / Shared Kernel

### `identity`
封裝身份驗證與 session 起點，屬於標準平台能力。

### `account`
承接個人檔案、偏好與帳戶政策，是 identity 之上的個人化設定層。

### `organization`
提供多租戶組織、成員與團隊治理，是平台級協作基礎。

### `workspace`
提供工作區容器、成員與內容樹，是所有知識與協作能力的歸屬邊界。

### `notification`
負責通知與提醒分發，屬典型平台配套能力。

### `shared`
作為 Shared Kernel，提供跨模組穩定共享的事件、值物件與基礎型別，不承載單一業務流程。

---

## 子域分類總表

| Context | 分類 | 主要價值 |
|---|---|---|
| `knowledge` | **Core** | 知識內容與版本生命週期 |
| `wiki` | **Core** | 知識結構、關聯與圖譜 |
| `source` | Supporting | 文件接入與來源治理 |
| `ai` | Supporting | 攝入管線協調與 worker handoff |
| `search` | Supporting | 語意檢索與 RAG |
| `notebook` | Supporting | 摘要、問答、洞察互動 |
| `workspace-flow` | Supporting | Task / Issue / Invoice 流程 |
| `workspace-scheduling` | Supporting | 排程與時間容量管理 |
| `workspace-audit` | Supporting | 稽核與追溯 |
| `workspace-feed` | Supporting | 工作區動態與互動 |
| `identity` | Generic | 身份驗證 |
| `account` | Generic | 個人帳戶與偏好 |
| `organization` | Generic | 多租戶治理 |
| `workspace` | Generic | 協作容器 |
| `notification` | Generic | 通知分發 |
| `shared` | Shared Kernel | 穩定共享核心 |

---

## 架構參考

- 邊界與整合：[`bounded-contexts.md`](./bounded-contexts.md)
- 各 BC 詳細文件：`docs/ddd/<context>/README.md`
- 通用語言：各 bounded context 的 `ubiquitous-language.md`
- 上下文關係圖：各 bounded context 的 `context-map.md`
````

## File: docs/ddd/workspace/README.md
````markdown
# workspace — 工作區上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/workspace/`  
> **開發狀態:** ✅ Done — 穩定

## 在 Knowledge Platform / Second Brain 中的角色

`workspace` 是整個平台的協作容器，所有知識、來源、任務、稽核與動態都歸屬於某個工作區。它不是產品差異化來源，但決定知識平台如何被團隊實際操作與組合。

## 主要職責

| 能力 | 說明 |
|---|---|
| Workspace 容器管理 | 建立、更新、歸檔工作區 |
| 成員與角色 | 管理工作區成員、角色與協作可見性 |
| 內容結構入口 | 維護內容樹與子模組在工作區中的組合方式 |

## 與其他 Bounded Context 協作

- `organization` 是主要上游，提供多租戶歸屬。
- `knowledge`、`wiki`、`source` 與所有 `workspace-*` 模組都依賴工作區作為協作邊界。

## 核心聚合 / 核心概念

- **`Workspace`**
- **`WorkspaceMember`**
- **`WikiContentTree`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: docs/guides/explanation/architecture-domain.md
````markdown
# 領域概念模型：AI 知識平台架構實現指南

基於 [architecture.md](./architecture.md) 所描述的「Notion × Wiki × NotebookLM」融合架構研究，本文說明儲存庫實現此系統所需的核心領域概念、有界上下文（Bounded Context）、聚合根（Aggregate Root）、值物件（Value Object）及領域事件（Domain Event）。

---

## 一、四層架構與有界上下文對應

architecture.md 確立了三層融合架構（Content / UI、Knowledge Graph、AI）。儲存庫在此三層之下，加入第四層「**Platform Foundation Layer**」，提供驗證、帳戶、組織與工作區等跨切關注點，讓上層三層得以共用同一租戶模型：

```text
┌─────────────────────────────────────────────────┐
│              AI Layer（AI 層）                    │  ← modules/search, modules/notebook, modules/knowledge
├─────────────────────────────────────────────────┤
│         Knowledge Graph Layer（知識圖譜層）        │  ← modules/wiki
├─────────────────────────────────────────────────┤
│         Content / UI Layer（內容層）               │  ← modules/knowledge, modules/source
├─────────────────────────────────────────────────┤
│    Platform Foundation Layer（平台基礎層）         │  ← modules/workspace, modules/organization
│                                                  │     modules/account, modules/identity, modules/shared
└─────────────────────────────────────────────────┘
```

| 架構層 | 對應模組 | 核心職責 |
| --- | --- | --- |
| Platform Foundation Layer | `identity`, `account`, `organization`, `workspace`, `shared` | 身份驗證、帳戶設定檔、組織租戶、工作區容器與能力掛載、共享領域原語（slug 工具、事件存儲原語） |
| Content / UI Layer | `content`, `asset` | Block 編輯器、頁面樹、資料庫、版本歷程、Wiki Library 結構化資料 |
| Knowledge Graph Layer | `knowledge-graph` | 頁面連結、圖譜邊、分類樹、重定向 |
| AI Layer | `knowledge`, `retrieval`, `agent` | 文件攝入、Embedding、RAG 查詢、AI Agent |

**依賴方向：** 圖中越下方的層，越是上方層的基礎——上方層依賴下方層，但下方層絕不直接依賴上方層。圖示從上往下讀是「功能堆疊」，從下往上讀才是「依賴方向」。跨層通訊一律透過各模組的 `api/` 邊界：

```text
依賴方向（箭頭表示「依賴」）：

AI Layer
  ↓ 依賴
Knowledge Graph Layer
  ↓ 依賴
Content / UI Layer
  ↓ 依賴
Platform Foundation Layer（被所有層依賴，但它本身無上層依賴）
```

---

## 二、Content / UI Layer 的領域概念

### 2.1 Page（頁面聚合根）

Page 是系統中最基本的知識單元，融合了 Notion 的「可排版頁面」與 Wiki 的「知識圖節點」兩種角色。

**實現位置：** `modules/knowledge/domain/entities/content-page.entity.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 唯一識別碼（聚合根 ID） |
| `title` | `string` | 頁面標題（Graph Node 標籤） |
| `slug` | `string` | URL 友好路徑（重定向的基礎） |
| `parentPageId` | `string \| null` | 父頁面 ID（樹狀層級） |
| `blockIds` | `string[]` | 組成此頁面的 Block 列表（有序） |
| `status` | `PageStatus` | 頁面狀態（draft / published / archived） |
| `workspaceId` | `string` | 所屬工作區（租戶隔離） |
| `organizationId` | `string` | 所屬組織（多租戶） |

**值物件：**
- `PageStatus`：`"draft" | "published" | "archived"`
- `PageSlug`：確保唯一且 URL-safe 的值物件

**不變式（Invariants）：**
- 一個 Page 必須屬於一個 Workspace。
- `slug` 在同一 Workspace 中必須唯一。
- 已 `archived` 的頁面不能再接受 Block 更新。

### 2.2 Block（區塊聚合根）

Block 是 Notion Block System 的對應物，是頁面的最小內容單元。

**實現位置：** `modules/knowledge/domain/entities/content-block.entity.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | Block 唯一識別碼 |
| `pageId` | `string` | 所屬頁面（外鍵） |
| `type` | `BlockType` | Block 類型（見下方） |
| `content` | `BlockContent` | 具體內容（依 type 變化） |
| `parentBlockId` | `string \| null` | 父 Block（支援巢狀結構） |
| `order` | `number` | 在頁面中的排列順序 |

**BlockType 值物件（對應 Notion Block 類型）：**

```typescript
type BlockType =
  | "text"
  | "heading_1" | "heading_2" | "heading_3"
  | "toggle"
  | "callout"
  | "code"
  | "quote"
  | "divider"
  | "table"
  | "image" | "video" | "file"
  | "embed"
  | "synced_block"
  | "column_layout"
  | "bulleted_list" | "numbered_list"
  | "to_do"
  | "page_link";
```

**設計說明：** Block 被建模為聚合根（獨立 Firestore 文件），而非 Page 內的嵌套陣列，以支援大型頁面的局部更新與 Embedding 顆粒度控制。

### 2.3 ContentVersion（版本快照）

對應 Wiki 的 Edit History / Diff / Rollback 能力。

**實現位置：** `modules/knowledge/domain/entities/content-version.entity.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 版本 ID |
| `pageId` | `string` | 所屬頁面 |
| `snapshotBlocks` | `Block[]` | 此版本的 Block 快照 |
| `editSummary` | `string` | 編輯說明（對應 Wiki Edit Summary） |
| `authorId` | `string` | 作者 ID |
| `createdAt` | `Timestamp` | 版本時間戳 |
| `isMinorEdit` | `boolean` | 是否為小修改標記 |

---

## 三、Knowledge Graph Layer 的領域概念

### 3.1 GraphNode（知識圖節點）

對應 Wiki 的 Page = Graph Node 模型。每個 ContentPage 在知識圖譜中都有一個對應的 GraphNode。

**實現位置：** `modules/wiki/domain/entities/graph-node.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 節點唯一 ID（通常等於 PageId） |
| `label` | `string` | 顯示標籤 |
| `type` | `GraphNodeType` | 節點類型：`"page" \| "tag" \| "attachment"` |
| `status` | `GraphNodeStatus` | 生命週期：`draft → active → archived` |

**GraphNodeStatus 狀態機：**

```text
draft ──────────→ active ──────────→ archived
  ↑                  │
  └──────────────────┘ (reactivation)
```

**領域事件：**
- `graph-node.activated`：節點從 draft 轉為 active 時觸發
- `graph-node.archived`：節點歸檔時觸發（對應 Wiki Page 的歸檔/刪除流程）

### 3.2 GraphEdge / Link（知識圖邊）

對應 Wiki 的 Internal Link，是知識圖譜的核心關聯機制。

**實現位置：** `modules/wiki/domain/entities/link.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 邊唯一 ID |
| `fromNodeId` | `string` | 來源節點（連結發起方） |
| `toNodeId` | `string` | 目標節點（連結目標） |
| `type` | `EdgeType` | 語意關係類型（見下方） |
| `status` | `EdgeStatus` | 生命週期：`pending → active → inactive → removed` |

**EdgeType 值物件（對應 Schema + Ontology Layer）：**

```typescript
type EdgeType =
  | "IS_A"        // 繼承關係（A 是 B 的一種）
  | "PART_OF"     // 組成關係（A 是 B 的一部分）
  | "RELATED_TO"  // 相關關係（通用）
  | "DEPENDS_ON"  // 依賴關係
  | "CAUSES"      // 因果關係
  | "CONTRADICTS" // 矛盾關係
  | "REDIRECT"    // 重定向（別名統一）
  | "CATEGORY";   // 分類從屬
```

**不變式：**
- 一條邊的 `fromNodeId` 與 `toNodeId` 不能相同（禁止自環）。
- `REDIRECT` 類型的邊在同一來源節點只能有一條 `active` 狀態的邊。

**Backlink 的領域含義：**  
Backlink（入度統計）不是獨立的領域物件，而是對某個 `toNodeId` 上所有 `active` 的 GraphEdge 進行反向查詢的結果。Repository 介面應提供 `findByToNodeId(nodeId)` 方法支援此查詢。

### 3.3 WikiPage（Wiki 頁面整合）

輕量化的 Wiki 風格頁面實體，用於 wiki 介面期間的過渡期分解。因為頁面是內容領域關切，此實體已遷移至 `content` 模組。

> **模組遷移說明：** `modules/wiki` 獨立模組已移除。WikiPage 概念已遷移至 `modules/knowledge`（頁面層）；WikiLibrary 概念遷移至 `modules/source`（結構化資料層）；WikiContentTree 保留於 `modules/workspace`；Wiki RAG 查詢類型遷移至 `modules/search`。

**實現位置：** `modules/knowledge/domain/entities/wiki-page.types.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 頁面唯一識別碼 |
| `accountId` | `string` | 所屬帳戶（租戶隔離） |
| `workspaceId` | `string \| undefined` | 所屬工作區（選填） |
| `title` | `string` | 頁面標題 |
| `slug` | `string` | URL 友好路徑 |
| `parentPageId` | `string \| null` | 父頁面 ID（樹狀層級） |
| `order` | `number` | 在內容樹中的排列順序 |
| `status` | `WikiPageStatus` | 頁面狀態：`"active" \| "archived"` |
| `createdAt` | `Date` | 建立時間 |
| `updatedAt` | `Date` | 最後更新時間 |

### 3.4 WikiLibrary（Wiki 知識庫聚合根）

WikiLibrary 是輕量化的結構化資料模型，相當於 Wiki 的「書架」或 Notion 的「Database」，用於將多個結構化資料列群組為一個具有欄位定義的知識集合。因為 Library 是資產與結構化資料的關切，此實體已遷移至 `asset` 模組。

**實現位置：** `modules/source/domain/entities/wiki-library.types.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | Library 唯一 ID（聚合根） |
| `accountId` | `string` | 所屬帳戶（租戶隔離） |
| `workspaceId` | `string \| undefined` | 所屬工作區（選填） |
| `name` | `string` | Library 名稱（顯示於側邊欄） |
| `slug` | `string` | URL 友好路徑 |
| `status` | `WikiLibraryStatus` | 狀態：`"active" \| "archived"` |
| `createdAt` | `Date` | 建立時間 |
| `updatedAt` | `Date` | 最後更新時間 |

**相關實體：**
- `WikiLibraryField`：Library 的欄位定義（`key`, `label`, `type`, `required`, `options`），支援類型：`"title" | "text" | "number" | "select" | "relation"`
- `WikiLibraryRow`：Library 的資料列（`values: Record<string, unknown>`）

**與其他概念的關係：**
- 一個 Workspace 可包含多個 WikiLibrary。
- WikiContentTree 的側邊欄導覽以 Library 為分組呈現頁面列表。

### 3.5 Slug 工具（原 Namespace 模組）

> **模組遷移說明：** `modules/namespace` 獨立模組已移除。其核心職責——Slug 生成與驗證——已遷移至 `modules/shared/domain/slug-utils.ts`，透過 `modules/shared/api` 公開。

Slug 工具提供工作區層面的 URL 友好路徑生成與驗證能力：

**實現位置：** `modules/shared/domain/slug-utils.ts`（透過 `modules/shared/api` 匯出）

| 函式 | 說明 |
| --- | --- |
| `deriveSlugCandidate(displayName)` | 將顯示名稱轉換為 slug 候選字串（小寫、連字符分隔、最長 63 字元） |
| `isValidSlug(slug)` | 驗證 slug 是否符合規範（`/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/`） |

## 四、AI Layer 的領域概念

### 4.1 IngestionDocument（攝入文件聚合根）

文件進入 RAG Pipeline 的起點，對應 architecture.md 第十二節 Ingestion Pipeline 的最頂層實體。

**實現位置：** `modules/knowledge/domain/entities/IngestionDocument.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 文件唯一 ID |
| `organizationId` | `string` | 所屬組織（多租戶隔離） |
| `workspaceId` | `string` | 所屬工作區 |
| `sourceFileId` | `string` | 原始檔案 ID（關聯 asset 模組） |
| `title` | `string` | 文件標題 |
| `mimeType` | `string` | 原始檔案類型（PDF / DOCX / Markdown 等） |
| `status` | `IngestionStatus` | 攝入狀態（見下方） |

**IngestionStatus 狀態機（對應 Ingestion Pipeline 各階段）：**

```text
                        ┌─────────────────────────────────────┐
                        ↓                                     │
uploaded → parsing → chunking → embedding → indexed → stale → re-indexing
    │          │          │           │                         │
    └──────────┴──────────┴───────────┴─────────────────────────┘
                                  failed（任一階段可轉入）
```

| 狀態 | 說明 |
| --- | --- |
| `uploaded` | 檔案已上傳，等待處理 |
| `parsing` | 正在解析（Parse 階段：PDF/DOCX → Markdown） |
| `chunking` | 正在分塊（Chunk 階段：語意分段） |
| `embedding` | 正在向量化（Embedding 階段） |
| `indexed` | 已完成索引，可供查詢 |
| `stale` | 原始文件已更新，需重新索引 |
| `re-indexing` | 重新索引中；完成後轉回 `uploaded` 重新執行完整 Pipeline |
| `failed` | Pipeline 任一階段發生錯誤，可由管理員重設為 `uploaded` 重試 |

---

### 4.2 IngestionJob（攝入作業）

追蹤單一文件在整個 Pipeline 中的執行進度，對應 architecture.md 中各 Pipeline 階段的工作記錄。

**實現位置：** `modules/knowledge/domain/entities/IngestionJob.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 作業唯一 ID |
| `documentId` | `string` | 所屬文件 |
| `stage` | `PipelineStage` | 當前執行階段 |
| `startedAt` | `Timestamp` | 開始時間 |
| `completedAt` | `Timestamp \| null` | 完成時間 |
| `error` | `string \| null` | 錯誤訊息（若 failed） |

**PipelineStage 值物件：**

```typescript
type PipelineStage = "parse" | "clean" | "taxonomy" | "chunk" | "embed" | "persist" | "mark_ready";
```

### 4.3 IngestionChunk（語意分塊）

代表文件被分割後的最小語意單元，是 Embedding 的直接輸入與 RAG 檢索的基本單位。

**實現位置：** `modules/knowledge/domain/entities/IngestionChunk.ts`

**核心屬性（對應 architecture.md 17.1 embeddings collection）：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | Chunk 唯一 ID |
| `documentId` | `string` | 所屬文件 |
| `content` | `string` | Chunk 文字內容 |
| `chunkIndex` | `number` | 在文件中的順序編號 |
| `sectionPath` | `string` | 標題路徑（如 `"第三章 > 3.1 小節"`） |
| `pageNumber` | `number \| null` | 原始頁碼（PDF 適用） |
| `vector` | `number[]` | 向量表示（Embedding 結果） |
| `tokenCount` | `number` | Token 數量（分塊品質指標） |

**不變式：**
- `vector` 維度在同一 Workspace 中必須一致（由 Embedding Model 決定）。Embedding Model 的選擇儲存於 Workspace `capabilities` 陣列中 `id: "embedding"` 的 Capability 項目的 `config` 物件內，由 `modules/workspace` 負責維護。
- `content` 長度不得超過所選 Embedding Model 的 token 上限。

### 4.4 RagQuery（RAG 查詢聚合根）

代表一次完整的 RAG 查詢生命週期，從用戶輸入到最終帶引用的回答。

**實現位置：** `modules/search/domain/entities/RagQuery.ts`

**核心介面：**

```typescript
interface RagQuery {
  id: string;
  workspaceId: string;
  input: string;               // 用戶原始輸入
  intent?: QueryIntent;        // 分類後的查詢意圖
  rewrittenQuery?: string;     // 改寫後的查詢語句（HyDE 或 Query Rewriting）
  subQueries?: string[];       // 拆解的子查詢（Query Decomposition）
}
```

**QueryIntent 值物件（對應 Query Understanding Layer）：**

```typescript
type QueryIntent = "question_answering" | "summarization" | "comparison" | "reasoning" | "exploration";
```

**RagRetrievedChunk 值物件（檢索結果項目）：**

```typescript
interface RagRetrievedChunk {
  chunkId: string;
  documentId: string;
  content: string;
  score: number;           // 相關性分數（Reranker 輸出）
  retrievalMethod: "dense" | "sparse" | "graph" | "hybrid";
}
```

**RagCitation 值物件（引用系統，對應 Source Grounding）：**

```typescript
interface RagCitation {
  documentId: string;
  documentTitle: string;
  chunkId: string;
  sectionPath: string;
  pageNumber?: number;
  confidenceScore: number;     // 引用可信度
}
```

**RagRetrievalSummary 值物件（完整回答結果）：**

```typescript
interface RagRetrievalSummary {
  answer: string;              // LLM 生成的回答
  citations: RagCitation[];    // 引用來源列表
  faithfulnessScore?: number;  // Faithfulness 驗證分數
  isGrounded: boolean;         // 是否通過 Grounding 驗證
}
```

### 4.5 AgentThread / AgentMessage（AI Agent 對話層）

對應 architecture.md 第七節 AI Memory Layer 中的 Episodic Memory（互動記憶）。

**實現位置：**
- `modules/notebook/domain/entities/thread.ts`
- `modules/notebook/domain/entities/message.ts`

**AgentThread 核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 對話 Thread ID |
| `workspaceId` | `string` | 所屬工作區 |
| `userId` | `string` | 發起用戶 |
| `createdAt` | `Timestamp` | 建立時間 |
| `updatedAt` | `Timestamp` | 最後更新時間 |

**AgentMessage 核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 訊息唯一 ID |
| `threadId` | `string` | 所屬 Thread |
| `role` | `"user" \| "assistant"` | 訊息角色 |
| `content` | `string` | 訊息內容 |
| `citations` | `RagCitation[]` | 關聯引用（AI 回覆時） |
| `createdAt` | `Timestamp` | 建立時間 |

---

## 五、Platform Foundation Layer 的領域概念

Platform Foundation Layer 提供整個平台的身份驗證、帳戶設定檔、組織結構與工作區容器，是上層三層（Content / UI、Knowledge Graph、AI）的共同基礎。所有 Content Page、Knowledge Graph 節點及 AI 文件攝入，都必須在一個已驗證身份的用戶（Identity）、歸屬帳戶（Account）、組織租戶（Organization）及工作區（Workspace）的脈絡下運行。

### 5.1 Identity（身份識別）

Identity 是平台安全入口，代表一個已驗證的 Firebase 用戶會話。

**實現位置：** `modules/identity/domain/entities/Identity.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `uid` | `string` | Firebase UID（全平台唯一識別碼） |
| `email` | `string \| null` | 電子信箱（匿名登入時為 null） |
| `displayName` | `string \| null` | 顯示名稱 |
| `photoURL` | `string \| null` | 大頭照 URL |
| `isAnonymous` | `boolean` | 是否為匿名會話 |
| `emailVerified` | `boolean` | 信箱是否已驗證 |

**值物件：**
- `SignInCredentials`：`{ email: string; password: string }`
- `RegistrationInput`：`{ email: string; password: string; name: string }`

**用例：** `SignInUseCase`、`RegisterUseCase`、`SignOutUseCase`、`SendPasswordResetEmailUseCase`

#### TokenRefreshSignal（Custom Claims 刷新訊號）

當帳戶角色或存取政策發生變更時，系統需觸發 Firebase Custom Claims 重新整理，以確保 JWT 中的權限資訊是最新的。此三方握手稱為 **[S6] Claims Refresh Protocol**：

```text
Party 1（account / organization 模組）
    → 角色或政策變更
    → 呼叫 identityApi.emitTokenRefreshSignal()

Party 2（identity 模組 TokenRefreshRepository）
    → 寫入 Firestore tokenRefreshSignals/<accountId> 文件

Party 3（前端 useTokenRefreshListener hook）
    → 監聽 Firestore 該文件
    → 偵測到訊號後呼叫 user.getIdToken(true) 強制刷新 JWT
```

**TokenRefreshSignal 屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `accountId` | `string` | 觸發刷新的帳戶 ID |
| `reason` | `TokenRefreshReason` | 觸發原因 |
| `issuedAt` | `string` | ISO-8601 時間戳 |
| `traceId` | `string \| undefined` | 可選的追蹤 ID（審計用） |

**TokenRefreshReason 值物件：** `"role:changed" | "policy:changed"`

---

### 5.2 Account（帳戶聚合根）

Account 是平台中「人」或「組織」在系統內的完整設定檔，支援 `user`（個人）與 `organization`（組織帳戶）兩種類型。

**實現位置：** `modules/account/domain/entities/Account.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 帳戶唯一 ID（對應 Firebase UID 或 Org ID） |
| `name` | `string` | 帳戶顯示名稱 |
| `accountType` | `AccountType` | 類型：`"user" \| "organization"` |
| `email` | `string \| undefined` | 聯絡信箱 |
| `photoURL` | `string \| undefined` | 大頭照 / 組織 Logo |
| `bio` | `string \| undefined` | 個人簡介或組織描述 |
| `ownerId` | `string \| undefined` | 組織帳戶的擁有者 UID |
| `role` | `OrganizationRole \| undefined` | 在組織中的角色 |
| `members` | `MemberReference[] \| undefined` | 組織帳戶的成員列表 |
| `teams` | `Team[] \| undefined` | 組織帳戶的小組列表 |
| `wallet` | `Wallet \| undefined` | 錢包（積分 / 配額） |
| `theme` | `ThemeConfig \| undefined` | 自訂主題色彩 |
| `createdAt` | `Timestamp \| undefined` | 建立時間 |

**值物件：**
- `AccountType`：`"user" | "organization"`
- `OrganizationRole`：`"Owner" | "Admin" | "Member" | "Guest"`
- `Presence`：`"active" | "away" | "offline"`
- `ThemeConfig`：`{ primary; background; accent }`（對應 Notion 的工作區自訂主題）
- `Wallet`：`{ balance: number }`（積分系統）

**Team 嵌套物件（組織帳戶專屬）：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 小組 ID |
| `name` | `string` | 小組名稱 |
| `type` | `"internal" \| "external"` | 內部小組或外部合作小組 |
| `memberIds` | `string[]` | 成員 ID 列表 |

**用例：** `CreateUserAccountUseCase`、`UpdateUserProfileUseCase`、`CreditWalletUseCase`、`AssignAccountRoleUseCase`

#### AccountPolicy（帳戶層 ABAC 政策）

Account 支援屬性型存取控制（ABAC）。每個帳戶可定義多條 `AccountPolicy`，由規則集（PolicyRule[]）組成，精確控制哪些資源可以執行哪些操作。

**AccountPolicy 屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 政策唯一 ID |
| `accountId` | `string` | 所屬帳戶 |
| `name` | `string` | 政策名稱 |
| `rules` | `PolicyRule[]` | 規則列表 |
| `isActive` | `boolean` | 是否啟用 |
| `createdAt` | `string` | ISO-8601 建立時間 |
| `traceId` | `string \| undefined` | 審計追蹤 ID |

**PolicyRule 值物件：**

```typescript
interface PolicyRule {
  resource: string;                      // 受保護資源路徑
  actions: string[];                     // 允許或拒絕的操作列表
  effect: "allow" | "deny";             // 政策效果
  conditions?: Record<string, string>;   // 條件約束（可選）
}
```

政策變更後，系統自動觸發 `TOKEN_REFRESH_SIGNAL`（see §5.1），確保 JWT 中的 Custom Claims 即時反映最新政策。

---

### 5.3 Organization（組織聚合根）

Organization 是多租戶架構的核心，管理組織的完整生命週期：成員招募、小組管理、合作夥伴邀請及組織層存取政策。

**實現位置：** `modules/organization/domain/entities/Organization.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 組織唯一 ID（聚合根） |
| `name` | `string` | 組織名稱 |
| `ownerId` | `string` | 擁有者 UID |
| `email` | `string \| undefined` | 組織聯絡信箱 |
| `description` | `string \| undefined` | 組織描述 |
| `theme` | `ThemeConfig \| undefined` | 自訂主題 |
| `members` | `MemberReference[]` | 成員列表（含角色與在線狀態） |
| `memberIds` | `string[]` | 成員 ID 快取（查詢最佳化） |
| `teams` | `Team[]` | 小組列表 |
| `partnerInvites` | `PartnerInvite[] \| undefined` | 合作夥伴邀請列表 |
| `createdAt` | `Timestamp` | 建立時間 |

**PartnerInvite 值物件（合作夥伴邀請）：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 邀請唯一 ID |
| `email` | `string` | 被邀請方信箱 |
| `teamId` | `string` | 加入的小組 |
| `role` | `OrganizationRole` | 授予角色 |
| `inviteState` | `InviteState` | 邀請狀態 |
| `invitedAt` | `Timestamp` | 邀請時間 |
| `protocol` | `string` | 協議說明（外部協作規範） |

**InviteState 值物件：** `"pending" | "accepted" | "expired"`

#### OrgPolicy（組織層 ABAC 政策）

與帳戶層 AccountPolicy 類似，但作用域（`OrgPolicyScope`）更廣，可覆蓋整個組織的工作區、成員或全局資源。

**OrgPolicyScope 值物件：** `"workspace" | "member" | "global"`

**用例：** `CreateOrganizationUseCase`、`InviteMemberUseCase`、`RecruitMemberUseCase`、`CreateTeamUseCase`、`SendPartnerInviteUseCase`、`CreateOrgPolicyUseCase`

---

### 5.4 Workspace（工作區聚合根）

Workspace 是平台的「房間」（Room）概念，是 Content、Knowledge Graph 與 AI 三層功能的運行容器。每個 ContentPage、GraphNode 及 IngestionDocument 都掛載在一個特定的 Workspace 之下。

**實現位置：** `modules/workspace/domain/entities/Workspace.ts`

**核心屬性：**

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 工作區唯一 ID（聚合根） |
| `name` | `string` | 工作區名稱 |
| `lifecycleState` | `WorkspaceLifecycleState` | 生命週期狀態（見下方） |
| `visibility` | `WorkspaceVisibility` | 能見度：`"visible" \| "hidden"` |
| `accountId` | `string` | 擁有者帳戶 ID（user 或 org） |
| `accountType` | `"user" \| "organization"` | 擁有者帳戶類型 |
| `capabilities` | `Capability[]` | 已掛載的能力模組（見下方） |
| `grants` | `WorkspaceGrant[]` | 存取授權列表 |
| `teamIds` | `string[]` | 關聯的組織小組 |
| `address` | `Address \| undefined` | 實體地址（選填） |
| `locations` | `WorkspaceLocation[] \| undefined` | 工作區內的地點列表 |
| `personnel` | `WorkspacePersonnel \| undefined` | 工作區人事指派（經理 / 主管 / 安全官） |
| `createdAt` | `Timestamp` | 建立時間 |

**WorkspaceLifecycleState 狀態機：**

```text
preparatory ──────────→ active ──────────→ stopped
```

| 狀態 | 說明 |
| --- | --- |
| `preparatory` | 工作區準備中，正在初始化能力與設定 |
| `active` | 工作區正常運作，可使用全部能力 |
| `stopped` | 工作區已停用，保留資料但不可新增內容 |

**Capability 值物件（能力模組）：**

工作區透過 `capabilities` 列表宣告它開啟了哪些功能模組，對應 architecture.md 中各層的具體能力：

```typescript
interface Capability {
  id: string;
  name: string;
  type: "ui" | "api" | "data" | "governance" | "monitoring";
  status: "stable" | "beta";
  description: string;
  config?: object;  // 各能力的自訂設定
}
```

**WorkspaceGrant 值物件（存取授權）：**

```typescript
interface WorkspaceGrant {
  userId?: string;   // 個人授權
  teamId?: string;   // 小組授權
  role: string;      // 授予的角色
  protocol?: string; // 授權協議（外部合作適用）
}
```

**不變式：**
- 一個 Workspace 必須屬於一個 Account（user 或 organization）。
- `stopped` 狀態的 Workspace 不能再掛載新的 Capability。
- 每個 Workspace 中 `grants` 陣列內，相同 `userId` 最多只能有一條個人直接授權記錄（對應 `WorkspaceMemberAccessSource` 中的 `"direct"` 管道；透過 `userId` 判斷，而非透過 `teamId`）。

**用例：** `CreateWorkspaceUseCase`、`CreateWorkspaceWithCapabilitiesUseCase`、`UpdateWorkspaceSettingsUseCase`、`MountCapabilitiesUseCase`、`GrantTeamAccessUseCase`、`GrantIndividualAccessUseCase`

#### WorkspaceMemberView（工作區成員讀取模型）

WorkspaceMemberView 是 CQRS 的讀側（Read Model），聚合來自 Organization 成員列表與 Workspace grants 的資訊，為 UI 提供「此工作區中哪些人可存取、透過哪個渠道」的扁平化視圖。

**實現位置：** `modules/workspace/domain/entities/WorkspaceMember.ts`

| 屬性 | 類型 | 說明 |
| --- | --- | --- |
| `id` | `string` | 成員 ID |
| `displayName` | `string` | 顯示名稱 |
| `presence` | `WorkspaceMemberPresence` | 在線狀態 |
| `isExternal` | `boolean` | 是否為外部合作成員 |
| `accessChannels` | `WorkspaceMemberAccessChannel[]` | 存取管道列表 |

**WorkspaceMemberAccessSource 值物件：** `"owner" | "direct" | "team" | "personnel"`

#### WikiContentTree（側邊欄導覽樹聚合根）

WikiContentTree 是 Wiki 側邊欄的導覽資料結構，以帳戶為根節點（personal 帳戶優先），展示所屬工作區及各工作區的內容入口（spaces、pages、libraries、documents、rag、ai-tools 等）。

**實現位置：** `modules/workspace/domain/entities/WikiContentTree.ts`

**樹狀結構：**

```text
WikiAccountContentNode（帳戶節點）
  ├── accountId, accountName, accountType（personal | organization）
  ├── membersHref（組織帳戶限定）
  ├── teamsHref（組織帳戶限定）
  └── workspaces[]
        └── WikiWorkspaceContentNode（工作區節點）
              ├── workspaceId, workspaceName
              └── contentBaseItems[]
                    └── WikiContentItemNode（內容入口）
                          ├── key（spaces | pages | libraries | rag | ai-tools …）
                          ├── label, href
                          └── enabled（是否啟用）
```

**不變式：**
- Personal 帳戶節點排列在 Organization 帳戶節點之前。
- `membersHref` 與 `teamsHref` 僅在 `accountType === "organization"` 時存在。

---

### 5.5 Platform Foundation 跨模組關係

```text
Identity ──→ Account ──→ Organization ──→ Workspace
  │ (uid)       │ (accountId)   │ (orgId)       │ (workspaceId)
  │             │               │               │
  │         AccountPolicy   OrgPolicy       Capability
  │             │               │
  └─────────────┴───────────────┘
         [S6] Claims Refresh Protocol
         (角色或政策變更 → TokenRefreshSignal → JWT 刷新)
```

| 關係 | 說明 |
| --- | --- |
| `Identity → Account` | Firebase UID 對應唯一 AccountEntity（user 帳戶），多租戶下同一 UID 可加入多個 Organization |
| `Account → Organization` | Organization 是 Account 的聚合，ownerId 指向建立者的 UID；成員以 MemberReference 陣列嵌入 |
| `Organization → Workspace` | Workspace 透過 `accountId + accountType` 歸屬於 user 或 organization 帳戶 |
| `Workspace → Content / KG / AI` | ContentPage、GraphNode、IngestionDocument 的 `workspaceId` 外鍵指向此聚合根 |
| `Account / Org → Identity ([S6])` | 角色或政策變更後，透過 `identityApi.emitTokenRefreshSignal()` 通知 Identity 模組刷新 JWT Custom Claims |

## 六、三層記憶架構的領域映射

架構研究（第七節）定義了三種記憶類型。以下是各記憶類型在儲存庫中的領域對應：

| 記憶類型 | 架構角色 | 儲存庫對應 | 持久化機制 |
| --- | --- | --- | --- |
| Semantic Memory（語意記憶） | 知識庫長期記憶 | `IngestionChunk.vector` | Firestore Vector Search |
| Episodic Memory（互動記憶） | 用戶互動歷程 | `AgentThread` + `AgentMessage` | Firestore `sessions` collection |
| Working Memory（工作記憶） | 當前對話上下文 | 傳遞給 Genkit Flow 的 context buffer | In-memory（不持久化） |

---

## 七、Ingestion Pipeline 的領域事件

完整的 Ingestion Pipeline（第十二節）應透過領域事件在各階段間協調，避免直接同步呼叫。

| 領域事件 | 觸發時機 | 訂閱方 |
| --- | --- | --- |
| `knowledge.document_registered` | IngestionDocument 建立時 | py_fn 攝入 Worker |
| `knowledge.parsing_completed` | Parse 階段完成時 | py_fn 清洗 Worker |
| `knowledge.chunking_completed` | Chunk 階段完成時 | py_fn Embedding Worker |
| `knowledge.embedding_completed` | Embedding 完成，vector 寫入時 | Next.js（更新 status → indexed） |
| `knowledge.document_stale` | 原始文件更新時 | py_fn 觸發 re-indexing |
| `knowledge.ingestion_failed` | 任一階段發生錯誤時 | 通知系統（notification 模組） |

**事件 DTO 結構慣例：**

```typescript
interface DomainEventDTO {
  type: "knowledge.document_registered";  // 格式：module.event_name
  payload: { documentId: string; workspaceId: string; };
  occurredAtISO: string;                  // ISO 8601 時間戳
}
```

---

## 八、Query Understanding Layer 的領域服務

Query Understanding Layer（第六節）的核心邏輯應建模為領域服務（Domain Service），而非 Use Case，因為它代表無狀態的業務規則計算。

**建議的領域服務介面（位於 `modules/search/domain/services/`）：**

```typescript
interface QueryPlannerService {
  classifyIntent(query: string): Promise<QueryIntent>;
  decomposeQuery(query: string): Promise<string[]>;
  rewriteForRetrieval(query: string): Promise<string>;
  generateHyDE(query: string): Promise<string>;  // Hypothetical Document Embedding
}
```

**對應的 Genkit Flow（`modules/notebook/infrastructure/genkit/` 或 `modules/search/infrastructure/genkit/`）：**
- `QueryPlannerFlow` → 包裝上方 QueryPlannerService 的 AI 實作
- `RetrievalFlow` → Hybrid RAG（Dense + Sparse + Graph + Reranker）
- `CitationFlow` → Answer + Source Mapping + Faithfulness Check

---

## 九、Schema + Ontology Layer 的領域概念

架構研究（第十四節）定義了 Domain Ontology。以下是對應的領域建模方向：

### Ontology 在 EdgeType 中的實現

GraphEdge 的 `type` 屬性直接承載本體論的關係語意：

```text
IS_A        → 類別繼承（OWL SubClassOf）
PART_OF     → 組成關係（Mereology）
RELATED_TO  → 通用相關（RDF関係）
DEPENDS_ON  → 工程依賴
CAUSES      → 因果推理
CONTRADICTS → 知識矛盾偵測
```

### 未來擴充：Entity Normalization（實體正規化）

為支援 Wiki 的 Redirect（別名統一）功能，Domain 層需要：
1. `WikiPage.isRedirect` + `redirectTargetId` 屬性（已在 3.3 節定義）
2. `GraphEdge` 的 `REDIRECT` 類型（已在 3.2 節的 EdgeType 中定義）
3. Repository 的 `resolveRedirect(pageId)` 方法，沿 REDIRECT 邊鏈追蹤到正規頁面

---

## 十、Hybrid Retrieval 的技術邊界說明

architecture.md 第八節描述了 Hybrid Retrieval（Dense + Sparse + Graph + Reranker）。這是基礎設施關切（Infrastructure Concern），**不屬於**領域模型，而是由以下層級實現：

| 元件 | 層級 | 位置 |
| --- | --- | --- |
| Dense Retrieval（Vector Search） | Infrastructure | `modules/search/infrastructure/firebase/` |
| Sparse Retrieval（BM25） | Infrastructure | `modules/search/infrastructure/` |
| Graph Retrieval（Knowledge Graph 遍歷） | Infrastructure | `modules/wiki/infrastructure/` |
| Reranker | Infrastructure / AI | `modules/search/infrastructure/genkit/` |
| Fusion & Ranking | Application | `modules/search/application/use-cases/answer-rag-query.use-case.ts` |

領域層只定義 `RagRetrievedChunk.retrievalMethod` 值物件，記錄某個 Chunk 是透過哪種方式被檢索到的，供上層決策使用。

---

## 十一、完整領域概念清單

| 領域概念 | 類型 | 模組 | 狀態 |
| --- | --- | --- | --- |
| `Identity` | 聚合根 | `identity` | ✅ 已實現 |
| `SignInCredentials` | 值物件 | `identity` | ✅ 已實現 |
| `RegistrationInput` | 值物件 | `identity` | ✅ 已實現 |
| `TokenRefreshSignal` | 聚合根（訊號） | `identity` | ✅ 已實現 |
| `TokenRefreshReason` | 值物件 | `identity` | ✅ 已實現 |
| `Account` | 聚合根 | `account` | ✅ 已實現 |
| `AccountType` | 值物件 | `account` | ✅ 已實現 |
| `OrganizationRole` | 值物件 | `account` | ✅ 已實現 |
| `Presence` | 值物件 | `account` | ✅ 已實現 |
| `ThemeConfig` | 值物件 | `account` | ✅ 已實現 |
| `Wallet` | 值物件 | `account` | ✅ 已實現 |
| `Team` | 值物件（嵌套） | `account` | ✅ 已實現 |
| `AccountPolicy` | 聚合根 | `account` | ✅ 已實現 |
| `PolicyRule` | 值物件 | `account` | ✅ 已實現 |
| `PolicyEffect` | 值物件 | `account` | ✅ 已實現 |
| `Organization` | 聚合根 | `organization` | ✅ 已實現 |
| `MemberReference` | 值物件（嵌套） | `organization` | ✅ 已實現 |
| `PartnerInvite` | 值物件（嵌套） | `organization` | ✅ 已實現 |
| `InviteState` | 值物件 | `organization` | ✅ 已實現 |
| `OrgPolicy` | 聚合根 | `organization` | ✅ 已實現 |
| `OrgPolicyScope` | 值物件 | `organization` | ✅ 已實現 |
| `Workspace` | 聚合根 | `workspace` | ✅ 已實現 |
| `WorkspaceLifecycleState` | 值物件（狀態機） | `workspace` | ✅ 已實現 |
| `WorkspaceVisibility` | 值物件 | `workspace` | ✅ 已實現 |
| `Capability` | 值物件 | `workspace` | ✅ 已實現 |
| `WorkspaceGrant` | 值物件 | `workspace` | ✅ 已實現 |
| `WorkspacePersonnel` | 值物件 | `workspace` | ✅ 已實現 |
| `WorkspaceLocation` | 值物件 | `workspace` | ✅ 已實現 |
| `WorkspaceMemberView` | 讀取模型（CQRS） | `workspace` | ✅ 已實現 |
| `WorkspaceMemberAccessSource` | 值物件 | `workspace` | ✅ 已實現 |
| `WikiContentTree` | 聚合根 | `workspace` | ✅ 已實現 |
| `ContentPage` | 聚合根 | `content` | ✅ 已實現 |
| `ContentBlock` | 聚合根 | `content` | ✅ 已實現 |
| `ContentVersion` | 聚合根 | `content` | ✅ 已實現 |
| `BlockType` | 值物件 | `content` | ✅ 已實現 |
| `PageStatus` | 值物件 | `content` | ✅ 已實現 |
| `GraphNode` | 聚合根 | `knowledge-graph` | ✅ 已實現 |
| `GraphEdge / Link` | 聚合根 | `knowledge-graph` | ✅ 已實現 |
| `EdgeType` | 值物件 | `knowledge-graph` | ✅ 已實現 |
| `GraphNodeStatus` | 值物件（狀態機） | `knowledge-graph` | ✅ 已實現 |
| `WikiPage` | 投影實體 | `content` | ✅ 已實現 |
| `WikiLibrary` | 聚合根 | `asset` | ✅ 已實現 |
| `IngestionDocument` | 聚合根 | `knowledge` | ✅ 已實現 |
| `IngestionJob` | 聚合根 | `knowledge` | ✅ 已實現 |
| `IngestionChunk` | 聚合根 | `knowledge` | ✅ 已實現 |
| `IngestionStatus` | 值物件（狀態機） | `knowledge` | ✅ 已實現 |
| `PipelineStage` | 值物件 | `knowledge` | ✅ 已實現 |
| `RagQuery` | 聚合根 | `retrieval` | ✅ 已實現 |
| `RagRetrievedChunk` | 值物件 | `retrieval` | ✅ 已實現 |
| `RagCitation` | 值物件 | `retrieval` | ✅ 已實現 |
| `RagRetrievalSummary` | 值物件 | `retrieval` | ✅ 已實現 |
| `QueryIntent` | 值物件 | `retrieval` | 🔲 待補充 |
| `AgentThread` | 聚合根 | `agent` | ✅ 已實現 |
| `AgentMessage` | 聚合根 | `agent` | ✅ 已實現 |
| `QueryPlannerService` | 領域服務介面 | `retrieval` | 🔲 待補充 |
| `deriveSlugCandidate` / `isValidSlug` | 領域服務（純函式） | `shared` | ✅ 已實現（原 namespace 模組） |
| `EventRecord` / `IEventStoreRepository` / `IEventBusRepository` | 事件存儲原語 | `shared` | ✅ 已實現（原 event 模組） |
| `PublishDomainEventUseCase` | 用例 | `shared` | ✅ 已實現（原 event 模組） |

---

> 本文件從領域建模角度解釋儲存庫如何實現 architecture.md 描述的三層融合知識平台研究。詳細的技術實現決策請參閱各模組的 `README.md` 及相關 ADR（`docs/decision-architecture/adr/`）。
````

## File: modules/account/AGENT.md
````markdown
# AGENT.md — account BC

## 模組定位

`account` 是 Xuanwu 平台的**帳戶管理**有界上下文，負責用戶 profile 與存取控制政策。在伺服器端消費 `identity/api`。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Account` | User、Profile、Member（在此 BC 內） |
| `AccountPolicy` | Permission、AccessRule、Role（作為存取控制） |
| `customClaims` | Claims、FirebaseClaims |
| `accountId` | userId、uid（在此 BC 之外的引用應使用 accountId） |

## 邊界規則

### ✅ 允許
```typescript
import { accountApi } from "@/modules/account/api";
import type { AccountDTO, AccountPolicyDTO } from "@/modules/account/api";
```

### ❌ 禁止
```typescript
import { Account } from "@/modules/account/domain/entities/Account";
// account use-cases 在 server 端 — 不要在 use-cases 中 import React/client hooks
```

## 關鍵依賴規則

- `modules/account/application/use-cases/account.use-cases.ts` 與 `modules/account/application/use-cases/account-policy.use-cases.ts` 在 server 端執行，可 import `identity/api`
- 不要在 application 層 import 任何含 `"use client"` 的模組

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/account/context-map.md
````markdown
# Context Map — account

## 上游（依賴）

### identity → account（Customer/Supplier）

- `account` 依賴 `identity/api` 取得 uid 與 TokenRefreshSignal
- `modules/account/application/use-cases/account.use-cases.ts` 在 server 端 import `identity/api`

```
identity/api ──► account/application (server-side use-cases)
```

---

## 下游（被依賴）

### account → organization（Customer/Supplier）

- `organization` 的 `MemberReference` 使用 `accountId` 參照 Account
- Organization 成員列表以 `accountId` 為主鍵

### account → workspace（Customer/Supplier）

- `Workspace.accountId` 關聯帳戶或組織

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| identity → account | identity | account | Customer/Supplier |
| account → organization | account | organization | Customer/Supplier |
| account → workspace | account | workspace | Customer/Supplier |
````

## File: modules/identity/AGENT.md
````markdown
# AGENT.md — identity BC

## 模組定位

`identity` 是 Firebase Authentication 的 domain 薄層封裝。無業務邏輯，只有驗證基礎設施抽象。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Identity` | User、CurrentUser、AuthUser |
| `TokenRefreshSignal` | TokenEvent、RefreshToken |
| `signIn` | login、authenticate |
| `signOut` | logout |
| `uid` | userId、id（在此 BC 內） |

## 邊界規則

### ✅ 允許
```typescript
import { identityApi } from "@/modules/identity/api";
import type { IdentityDTO } from "@/modules/identity/api";
```

### ❌ 禁止
```typescript
import { useTokenRefreshListener } from "@/modules/identity/interfaces/hooks/useTokenRefreshListener";
// ❌ api/ 不能含 "use client" 匯出 — account use-cases 在 server 端 import api/
```

## 關鍵守衛

- `modules/identity/api/index.ts` 不得 re-export 任何含 `"use client"` 的檔案
- hooks（`useTokenRefreshListener`）只能從 interfaces 層使用，不可進入 api barrel

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/knowledge/aggregates.md
````markdown
# Aggregates — knowledge

## 聚合根：KnowledgePage（ContentPage）

### 職責
核心知識單元的聚合根。管理頁面標題、父子層級關係（parentPageId）、區塊引用列表（blockIds）及審批狀態。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 頁面主鍵 |
| `title` | `string` | 頁面標題 |
| `slug` | `string` | URL-safe 識別符 |
| `parentPageId` | `string \| null` | 父頁面 ID（樹狀層級） |
| `blockIds` | `string[]` | 關聯的 ContentBlock ID 列表 |
| `accountId` | `string` | 所屬帳戶 |
| `workspaceId` | `string?` | 所屬工作區（可選） |
| `status` | `KnowledgePageStatus` | `active \| archived` |
| `approvalState` | `KnowledgePageApprovalState?` | `pending \| approved`（AI 生成草稿使用） |
| `createdByUserId` | `string` | 建立者 ID |
| `createdAtISO` | `string` | ISO 8601 建立時間 |
| `updatedAtISO` | `string` | ISO 8601 更新時間 |

### 不變數

- `slug` 在同一 accountId 下必須唯一
- archived 頁面不可新增 ContentBlock

---

## 實體：ContentBlock（KnowledgeBlock）

### 職責
頁面內的原子內容單元，有序排列形成頁面內容。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 區塊主鍵 |
| `pageId` | `string` | 所屬頁面 ID |
| `accountId` | `string` | 所屬帳戶 |
| `content` | `BlockContent` | 型別化內容（含 `type: BlockType` 欄位） |
| `order` | `number` | 排列順序 |
| `createdAtISO` | `string` | ISO 8601 |
| `updatedAtISO` | `string` | ISO 8601 |

> `BlockContent.type` 為 `BlockType`（`text \| heading-1 \| heading-2 \| heading-3 \| image \| code \| bullet-list \| numbered-list \| divider \| quote`）。
> 代碼位置：`domain/value-objects/block-content.ts`

---

## 實體：ContentVersion（KnowledgeVersion）

### 職責
頁面的歷史版本快照，append-only。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 版本主鍵 |
| `pageId` | `string` | 所屬頁面 |
| `accountId` | `string` | 所屬帳戶 |
| `label` | `string` | 版本標籤（人類可讀描述） |
| `titleSnapshot` | `string` | 版本建立時的頁面標題快照 |
| `blocks` | `KnowledgeVersionBlock[]` | 版本時間點的區塊快照列表 |
| `createdByUserId` | `string` | 建立者帳戶 ID |
| `createdAtISO` | `string` | ISO 8601 |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `KnowledgePageRepository` | `create()`, `rename()`, `move()`, `archive()`, `approve()`, `findById()`, `listByAccountId()`, `listByWorkspaceId()` |
| `KnowledgeBlockRepository` | `add()`, `update()`, `delete()`, `findById()`, `listByPageId()` |
| `KnowledgeVersionRepository` | `create()`, `findById()`, `listByPageId()` |
| `WikiPageRepository` | `listByAccountId()`, `findById()`, `create()`, `update()` |
````

## File: modules/notebook/AGENT.md
````markdown
# AGENT.md — notebook BC

## 模組定位

`notebook` 是 AI 對話的支援域，管理 Thread/Message 生命週期並封裝 Genkit 呼叫。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Thread` | Conversation、Chat、Session |
| `Message` | ChatMessage、Msg |
| `MessageRole` | Role（單獨使用）、Speaker |
| `NotebookResponse` | AIResponse、GeneratedText |
| `NotebookRepository` | AIRepository、ChatRepository |

## 最重要規則：Server Action 隔離

```typescript
// ✅ 正確：在 app/(shell)/ai-chat/_actions.ts 中建立本地 action
"use server";
import { notebookApi } from "@/modules/notebook/api";
export async function generateResponse(input) {
  return notebookApi.generateResponse(input);
}

// ❌ 禁止：在 Client Component 直接 import notebook/api
// Genkit/gRPC 是 server-only，會導致打包失敗
import { notebookApi } from "@/modules/notebook/api"; // 在 "use client" 檔案中
```

## 邊界規則

### ✅ 允許
```typescript
// Server-side context only
import { notebookApi } from "@/modules/notebook/api";
import type { ThreadDTO, MessageDTO } from "@/modules/notebook/api";
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/notebook/context-map.md
````markdown
# Context Map — notebook

## 上游（依賴）

### search → notebook（Customer/Supplier）

- `notebook` 呼叫 `search/api` 取得語意相關 chunks（RAG retrieval）
- 用於 RAG-augmented 對話生成

### wiki → notebook（Customer/Supplier）

- `notebook` 可查詢 `wiki/api` 取得知識圖譜上下文（未來支援圖譜推理）

---

## 下游（被依賴）

### notebook → app/(shell)/ai-chat（Interfaces）

- AI Chat 頁面透過本地 `app/(shell)/ai-chat/_actions.ts` 呼叫 `notebook/api`
- **注意**：`notebook/api` barrel 不得在 Client Component 中直接 import（Genkit server-only）

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| search → notebook | search | notebook | Customer/Supplier（同步查詢） |
| wiki → notebook | wiki | notebook | Customer/Supplier（同步查詢） |
| notebook → AI Chat UI | notebook | app/ | Anti-Corruption Layer（`app/(shell)/ai-chat/_actions.ts`） |
````

## File: modules/notebook/README.md
````markdown
# notebook — Notebook 對話上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/notebook/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`notebook` 是 Xuanwu 的 NotebookLM-like 互動層，將檢索結果、知識內容與圖譜脈絡轉成對話、摘要、洞察與可引用回答。它是最接近使用者 AI 推理體驗的上下文。

## 主要職責

| 能力 | 說明 |
|---|---|
| 對話 Thread 管理 | 維護對話串與訊息歷史 |
| 摘要 / 問答互動 | 把檢索結果轉成可閱讀、可追問的回答 |
| 引用式輸出 | 保留 citation / source trace，支撐可信回答 |

## 與其他 Bounded Context 協作

- `search` 是主要上游，提供語意檢索與引用資料。
- `knowledge` 與 `wiki` 提供被推理的內容與結構脈絡；`ai` 提供底層攝入能力。

## 核心聚合 / 核心概念

- **`Thread`**
- **`Message`**
- **`Summary`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/shared/aggregates.md
````markdown
# Aggregates — shared

## 注意

`shared` 是 Shared Kernel，不包含業務聚合根。它只提供基礎型別定義。

---

## 基礎介面：DomainEvent

```typescript
// modules/shared/domain/events.ts
interface DomainEvent {
  readonly type: string;       // discriminant: "module.action"
  readonly occurredAt: string; // ISO 8601 — 不是 Date，不是 occurredAtISO
}
```

**所有模組的領域事件介面都繼承此基礎介面。**

---

## 基礎介面：EventRecord

```typescript
// modules/shared/domain/event-record.ts
interface EventRecord {
  readonly eventId: string;    // UUID v4
  readonly occurredAt: string; // ISO 8601
  readonly actorId?: string;   // 操作者 ID（可選）
  readonly correlationId?: string;
  readonly causationId?: string;
}
```

---

## 工具型別

| 型別 / 工具 | 說明 |
|------------|------|
| `ID` | string alias，用於所有業務 ID |
| `Timestamp` | Firebase Timestamp 型別別名 |
| `domain/slug-utils.ts` | URL-safe slug 生成（`toSlug()`, `isValidSlug()`） |
````

## File: modules/source/AGENT.md
````markdown
# AGENT.md — source BC

## 模組定位

`source` 是文件來源的支援域，負責上傳生命週期、版本快照與 RAG 文件登記。是 RAG ingestion pipeline 的業務入口。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `SourceDocument` | File、Document、Asset、Attachment |
| `WikiLibrary` | Library、Folder、Collection |
| `FileVersion` | Version、Snapshot、Revision |
| `RagDocument` | RagFile、IngestionDoc |
| `RetentionPolicy` | Policy、ExpiryRule |
| `AuditRecord` | Log、Event、History |
| `ActorContext` | User、CurrentUser |
| `IngestionHandoff` | Trigger、Signal |

## 邊界規則

### ✅ 允許
```typescript
import { sourceApi } from "@/modules/source/api";
import type { SourceDocumentDTO, WikiLibraryDTO } from "@/modules/source/api";
```

### ❌ 禁止
```typescript
import { File } from "@/modules/source/domain/entities/File";
```

## Firestore Timestamp 規則

```typescript
// ✅ 安全的調用方式
const date = (value.toDate as () => unknown)() as Date;

// ❌ 禁止解構賦值
const { toDate } = value; toDate(); // 'this' binding 失效
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/wiki/AGENT.md
````markdown
# AGENT.md — wiki BC

## 模組定位

`wiki` 是 Core Domain，負責 GraphNode 與 GraphEdge 的知識圖譜生命週期。是 Xuanwu 的核心差異化視覺特性。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `GraphNode` | Node、WikiNode、KnowledgeNode、Page（在圖譜上下文） |
| `GraphEdge` | Edge、Link、Connection、Relation |
| `EdgeType` | RelationType、LinkType |
| `NodeType` | NodeKind、PageType（在圖譜上下文） |
| `Backlink` | ReverseLink、InboundLink |
| `GraphTraversal` | Graph Walk、Traversal |
| `AutoLink` | AutoConnect、AutoRelate |

## 邊界規則

### ✅ 允許
```typescript
import { wikiApi } from "@/modules/wiki/api";
import type { GraphNodeDTO, GraphEdgeDTO } from "@/modules/wiki/api";
```

### ❌ 禁止
```typescript
import { GraphNode } from "@/modules/wiki/domain/entities/graph-node";
// modules/ai/domain/entities/graph-node.ts 是 @deprecated stub，不要使用
```

## 棄用守衛

`modules/ai/domain/entities/graph-node.ts` 和 `modules/ai/domain/entities/link.ts` 都是 `@deprecated` stub，已移至 `modules/wiki/domain/`。絕對不要 import 這些舊路徑。

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/wiki/aggregates.md
````markdown
# Aggregates — wiki

## 聚合根：GraphNode

### 職責
代表知識圖譜中的一個知識節點。管理節點的生命週期（draft → active → archived）與關聯邊列表。

### 生命週期狀態機
```
draft ──[activate]──► active ──[archive]──► archived
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 節點主鍵（對應 knowledge.KnowledgePage.id） |
| `title` | `string` | 節點標題 |
| `nodeType` | `NodeType` | 節點語意類型 |
| `status` | `NodeStatus` | `draft \| active \| archived` |
| `workspaceId` | `string?` | 所屬工作區（workspace BC 整合完成前為 optional） |
| `organizationId` | `string?` | 所屬組織（workspace BC 整合完成前為 optional） |
| `outboundEdgeIds` | `string[]?` | 出向邊 ID 列表（workspace BC 整合完成前為 optional） |

### 不變數

- archived 節點不可建立新 GraphEdge
- `id` 與 `knowledge.KnowledgePage.id` 一一對應

---

## 聚合根：GraphEdge

### 職責
代表兩個 GraphNode 之間的有向關係。管理邊的生命週期（pending → active → inactive → removed）。

### 生命週期狀態機
```
pending ──[activate]──► active ──[deactivate]──► inactive ──[remove]──► removed
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 邊主鍵 |
| `sourceNodeId` | `string` | 起點節點 ID |
| `targetNodeId` | `string` | 終點節點 ID |
| `edgeType` | `EdgeType` | 關係語意類型 |
| `status` | `EdgeStatus` | `pending \| active \| inactive \| removed` |
| `createdByUserId` | `string?` | 建立者 ID（系統自動建立時為 undefined） |

### 不變數

- sourceNodeId 與 targetNodeId 必須是有效的 GraphNode
- removed 的邊不可恢復

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `GraphRepository` | `saveNode()`, `saveEdge()`, `findNodeById()`, `findEdgesByTarget()`, `findEdgesBySource()`, `findEdgesByType()`, `listNodes()`, `listEdges()` |
````

## File: modules/workspace-audit/AGENT.md
````markdown
# AGENT.md — workspace-audit BC

## 模組定位

`workspace-audit` 是稽核紀錄支援域，維護 Append-Only 的 AuditLog，查詢工作區與組織稽核軌跡。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `AuditLog` | Log、Record、History、ActivityLog |
| `auditEventType` | EventType、ActionType |
| `actorId` | UserId、PerformerId |
| `workspaceId` / `organizationId` | Scope（作為稽核範圍） |

## 最重要規則：Append-Only

```typescript
// ✅ 只允許追加新記錄
await auditRepository.append(newAuditLog);

// ❌ 禁止修改或刪除
await auditRepository.update(id, changes);  // 違反 Append-Only
await auditRepository.delete(id);           // 違反 Append-Only
```

## 邊界規則

### ✅ 允許
```typescript
import { workspaceAuditApi } from "@/modules/workspace-audit/api";
import type { AuditLogDTO } from "@/modules/workspace-audit/api";
```

### ❌ 禁止
```typescript
import { AuditLog } from "@/modules/workspace-audit/domain/entities/AuditLog";
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/workspace-audit/README.md
````markdown
# workspace-audit — 工作區稽核上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/workspace-audit/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`workspace-audit` 是工作區治理的追溯層，透過 append-only 稽核紀錄保存重要操作的事後可查性。它不是直接創造知識價值的核心域，但對信任、治理與合規至關重要。

## 主要職責

| 能力 | 說明 |
|---|---|
| 稽核寫入 | 接收重要行為或事件並追加紀錄 |
| 稽核查詢 | 依工作區或組織範圍提供可查詢的 audit trail |
| 治理可見性 | 支援事後追查、責任歸屬與決策證據 |

## 與其他 Bounded Context 協作

- `workspace` 與 `organization` 提供查詢與可見性範圍。
- `workspace-flow`、`workspace-feed` 與其他上下文可作為稽核事件來源。

## 核心聚合 / 核心概念

- **`AuditLog`**
- **`AuditActor`**
- **`AuditScope`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/workspace-flow/AGENT.md
````markdown
# AGENT.md — workspace-flow BC

## 模組定位

`workspace-flow` 是工作流程狀態機支援域，管理 Task/Issue/Invoice 三條業務線，並透過 ContentToWorkflowMaterializer 訂閱 knowledge 事件。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Task` | TodoItem、WorkItem |
| `TaskStatus` | Status（單獨使用）、State |
| `Issue` | Bug、Ticket、Problem |
| `IssueStatus` | Status（單獨使用） |
| `Invoice` | Bill、Receipt、Payment |
| `InvoiceStatus` | Status（單獨使用） |
| `MaterializedTask` | ConvertedTask、AutoTask |
| `sourceReference` | Origin、Source（作為物化來源） |
| `ContentToWorkflowMaterializer` | ContentProcessor、PageConverter |

## 狀態機（必須嚴格遵守）

```
TaskStatus:    draft → in_progress → qa → acceptance → accepted → archived
IssueStatus:   open → investigating → fixing → retest → resolved → closed
InvoiceStatus: draft → submitted → finance_review → approved → paid → closed
```

## 邊界規則

### ✅ 允許
```typescript
import { workspaceFlowApi } from "@/modules/workspace-flow/api";
import { WorkspaceFlowTab } from "@/modules/workspace-flow/api";
```

### ❌ 禁止
```typescript
import { Task } from "@/modules/workspace-flow/domain/entities/Task";
```

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/workspace-flow/README.md
````markdown
# workspace-flow — 工作流程上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/workspace-flow/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`workspace-flow` 把知識內容轉成可執行的業務流程，負責 Task、Issue、Invoice 三條工作線的狀態機與政策。它是知識平台從「記錄知識」走向「驅動執行」的主要協作引擎。

## 主要職責

| 能力 | 說明 |
|---|---|
| Task / Issue / Invoice 狀態機 | 管理主要工作流程聚合與轉換規則 |
| 物化流程 | 消費 `knowledge.page_approved` 等事件建立可執行項目 |
| 業務守衛 | 封裝狀態轉換、角色限制與流程政策 |

## 與其他 Bounded Context 協作

- `knowledge` 是最重要上游，提供審批後的內容事件。
- `workspace` 提供流程歸屬；`workspace-audit` 與 `workspace-feed` 消費流程結果或事件。

## 核心聚合 / 核心概念

- **`Task`**
- **`Issue`**
- **`Invoice`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/workspace/AGENT.md
````markdown
# AGENT.md — workspace BC

## 模組定位

`workspace` 是協作容器有界上下文，負責工作區生命週期、成員管理與 Wiki 內容樹。在 WorkspaceDetailScreen 中組合多個 workspace-* 子模組的 UI tab。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Workspace` | Project、Space、Room |
| `WorkspaceMember` | Member、Participant |
| `WikiContentTree` | PageTree、ContentHierarchy |
| `workspaceId` | projectId、spaceId |
| `accountId` | ownerId（在 Workspace 上下文中） |

## 邊界規則

### ✅ 允許
```typescript
import { workspaceApi } from "@/modules/workspace/api";
import type { WorkspaceDTO } from "@/modules/workspace/api";
```

### ❌ 禁止
```typescript
// workspace/infrastructure 禁止 import workspace/api（循環依賴）
import { workspaceApi } from "@/modules/workspace/api"; // 在 infrastructure 層
```

## 循環依賴守衛

`FirebaseWikiWorkspaceRepository` 使用相對路徑 import `FirebaseWorkspaceRepository`，絕對不能改為 `@/modules/workspace/api`。

## 驗證命令

```bash
npm run lint
npm run build
```
````

## File: modules/workspace/README.md
````markdown
# workspace — 工作區上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/workspace/`  
> **開發狀態:** ✅ Done — 穩定

## 在 Knowledge Platform / Second Brain 中的角色

`workspace` 是整個平台的協作容器，所有知識、來源、任務、稽核與動態都歸屬於某個工作區。它不是產品差異化來源，但決定知識平台如何被團隊實際操作與組合。

## 主要職責

| 能力 | 說明 |
|---|---|
| Workspace 容器管理 | 建立、更新、歸檔工作區 |
| 成員與角色 | 管理工作區成員、角色與協作可見性 |
| 內容結構入口 | 維護內容樹與子模組在工作區中的組合方式 |

## 與其他 Bounded Context 協作

- `organization` 是主要上游，提供多租戶歸屬。
- `knowledge`、`wiki`、`source` 與所有 `workspace-*` 模組都依賴工作區作為協作邊界。

## 核心聚合 / 核心概念

- **`Workspace`**
- **`WorkspaceMember`**
- **`WikiContentTree`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: .github/agents/domain-architect.agent.md
````markdown
---
name: Domain Architect
description: IDDD 領域架構審查 Agent，專注確保聚合根、限界上下文、通用語言與事件驅動設計符合 Vaughn Vernon《Implementing Domain-Driven Design》規範。
tools: ['serena/*', 'context7/*', 'read', 'edit', 'search', 'execute']
model: 'GPT-5.3-Codex'
handoffs:
  - label: 審查模組邊界
    agent: MDDD Architect
    prompt: 審查或重構此領域決策涉及的模組邊界、層依賴方向與公開 API 形狀。
  - label: 更新通用語言術語
    agent: KB Architect
    prompt: 將本次領域建模新增或變更的術語同步更新至 terminology-glossary.md 與知識庫文件。
  - label: 品質審查
    agent: Quality Lead
    prompt: 審查此領域變更的行為風險、邊界回歸與遺漏驗證，確認符合 IDDD 規範。

---

# Domain Architect

## 目標範圍 (Target Scope)

- `modules/**/domain/**`
- `modules/**/application/use-cases/**`
- `modules/**/application/machines/**`
- `terminology-glossary.md`
- `.github/instructions/ubiquitous-language.instructions.md`
- `.github/instructions/bounded-context-rules.instructions.md`
- `.github/instructions/domain-modeling.instructions.md`
- `.github/instructions/event-driven-state.instructions.md`

## 使命 (Mission)

確保所有領域模型設計符合《Implementing Domain-Driven Design》(Vaughn Vernon) 的戰略（Strategic）與戰術（Tactical）設計原則，維護聚合完整性、通用語言一致性與事件驅動架構品質。

## IDDD 審查清單

### 通用語言 (Ubiquitous Language)

- [ ] 新命名是否已查閱 `terminology-glossary.md`？
- [ ] 是否有違反通用語言的同義詞替換？
- [ ] 領域事件命名是否使用過去式？
- [ ] 類別、方法名稱是否反映領域概念而非技術概念？

### 限界上下文 (Bounded Context)

- [ ] 程式碼是否屬於正確的限界上下文（模組）？
- [ ] 是否有直接存取其他模組的 `domain/`、`application/` 或 `infrastructure/` 內部？
- [ ] 跨模組整合是否透過 `api/` 合約或領域事件進行？
- [ ] 外部系統整合是否透過防腐層（Anti-Corruption Layer）隔離？

### 聚合設計 (Aggregate Design)

- [ ] 聚合根是否保護所有業務不變數？
- [ ] 狀態修改是否透過封裝的命令方法進行？
- [ ] 是否存在貧血領域模型（只有 Getter/Setter，無業務邏輯）？
- [ ] 聚合邊界是否合理（不過大、不過小）？
- [ ] `pullDomainEvents()` 是否正確清空事件陣列？

### 值對象 (Value Object)

- [ ] 是否使用 Zod 品牌型別確保型別安全？
- [ ] 值對象是否不可變（Immutable）？
- [ ] 識別碼是否使用品牌型別保護？

### 領域事件 (Domain Event)

- [ ] 每次狀態變更是否產生對應的領域事件？
- [ ] `occurredAt` 是否使用 ISO string（與 `shared/domain/events.ts` 一致）？
- [ ] 事件 Payload 是否以 Zod Schema 嚴格定義？
- [ ] 事件 `type` discriminant 是否為 `<module>.<action>` 格式？
- [ ] 事件是否在聚合持久化成功後才發布？

## 輸出格式

1. **IDDD 合規性評估**：通過 / 需修正
2. **問題項目清單**：每項附檔案路徑與具體說明
3. **修正建議**：附程式碼範例
4. **驗證指令執行結果**：`npm run lint` 與 `npm run build` 結果

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/instructions/app/app-router-parallel-routes.instructions.md
````markdown
---
name: 'App Router Parallel Routes'
description: 'Rules for app/ route slices and parallel-route UI blocks that compose module APIs without importing module internals.'
applyTo: 'app/**/*.{ts,tsx}'
---

# App Router Parallel Routes

Use this instruction for work in `app/`.

## Composition Rules

- Treat each route slice or parallel-route block as one feature area: dashboard surface, sidebar tool, modal, or chat console.
- Keep data flow one-way from module API -> route composition -> local UI state.
- Import module behavior through `@/modules/<target>/api` only.
- Keep route files focused on composition, loading states, and rendering.

## Guardrails

- Do not import `domain/`, `application/`, or `infrastructure/` from any module.
- Do not move business rules into `app/`.
- Keep slot-local state isolated; do not hide coupling through shared mutable module state.
- Prefer Server Components by default; add `use client` only where interactivity requires it.

## Validation

- Run the app-level commands from `agents/commands.md` that match the touched files.
- If routing or public API usage changes, update affected docs or prompt/instruction references in the same change.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill app-router-parallel-routes
#use skill next-devtools-mcp
#use skill vercel-react-best-practices
````

## File: .github/instructions/architecture-api-boundary.instructions.md
````markdown
---
description: 'Cross-boundary rules for API-only collaboration between modules and runtimes.'
applyTo: '{app,modules,packages,providers,py_fn}/**/*.{ts,tsx,js,jsx,py}'
---

# Architecture API Boundary

## Core Rule

- Cross-module access must go through `modules/<target>/api` only.
- Do not import another module's `domain/`, `application/`, `infrastructure/`, or `interfaces/` internals.

## Allowed Patterns

- Import public facades or contracts from `modules/<target>/api`.
- Coordinate across contexts through explicit event contracts.

## Forbidden Patterns

- Reach-through imports into another module's private entities, repositories, or adapters.
- Hiding boundary bypasses behind barrels or re-export chains.

## Refactor Rule

- When boundary violations are found, replace them with API contracts or events in the same change.
- Do not leave temporary reach-through imports after refactors.

## Validation

- Use `eslint.config.mjs` restricted-import and boundary rules as the enforcement source.
- Re-check changed imports for `@/modules/` to confirm API-only access.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/instructions/architecture-mddd.instructions.md
````markdown
---
description: 'MDDD architecture rules for layer ownership and dependency direction.'
applyTo: 'modules/**/*.{ts,tsx,js,jsx,md}'
---

# Architecture MDDD

## Layer Direction

- `interfaces -> application -> domain <- infrastructure`
- Keep `domain/` framework-free.

## Layer Constraints

- `domain/` must not import Firebase SDK, React, HTTP clients, or runtime-specific adapters.
- `application/` orchestrates use cases and coordinates domain abstractions.
- `infrastructure/` implements domain ports and repository interfaces.
- `interfaces/` handles UI, route handlers, API transport, and server action wiring.

## Layer Ownership

- `domain/`: entities, value objects, domain services, repository interfaces.
- `application/`: use cases and DTO orchestration.
- `infrastructure/`: adapters and external implementations.
- `interfaces/`: UI, transport, and action wiring.
- `api/`: only public cross-module boundary.

## Dependency Guardrails

- Keep module dependency flow acyclic unless an explicit event contract documents the exception.
- Do not reverse dependency direction for convenience during refactors.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/instructions/architecture-modules.instructions.md
````markdown
---
description: 'Module structure, naming, and refactor workflow rules for bounded contexts.'
applyTo: 'modules/**/*.{ts,tsx,js,jsx,md}'
---

# Architecture Modules

## Required Shape

- `api/`, `domain/`, `application/`, `infrastructure/`, `interfaces/`, `README.md`, `index.ts`.

## Naming

- Module folder: kebab-case bounded context.
- Use case file: `verb-noun.use-case.ts`.
- Repository interface: `PascalCaseRepository`.
- Repository implementation: `TechnologyPascalCaseRepository`.
- Public facade type: `PascalCaseFacade`; instance: `camelCaseFacade`.
- Domain event discriminant: `module-name.action`.

## Refactor Checklist

1. Confirm ownership.
2. Map API consumers.
3. Preserve boundaries during split/merge/delete.
4. Update docs and imports in the same change.
5. Migrate public API and event contracts before removing old paths.

## Module Lifecycle Notes

- New module: establish `api/` contract immediately and document inventory updates.
- Split/merge: map source-to-target ownership and classify internal vs public surfaces.
- Delete: remove consumers first, then delete module, then update docs and dependency references.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/instructions/architecture-monorepo.instructions.md
````markdown
---
description: 'Monorepo boundary rules across app, modules, packages, and worker runtime.'
applyTo: '{app,modules,packages,providers,debug,py_fn}/**/*.{ts,tsx,js,jsx,py,md}'
---

# Architecture Monorepo

## Boundary Rules

- `app/` composes module APIs and package aliases.
- `modules/` own business capabilities by bounded context.
- `packages/` provide stable shared implementations via aliases.
- `py_fn/` owns ingestion and heavy worker jobs.

## Runtime Ownership Rule

- Browser-facing interactions, auth/session, and route orchestration stay in Next.js.
- Background, retryable, and heavy ingestion jobs stay in `py_fn/`.

## External Docs Rule

- Use external documentation lookup only when repository sources are insufficient or version-sensitive behavior is uncertain.
- Prefer local authoritative sources first: `AGENTS.md`, `.github/copilot-instructions.md`, module docs, and local code.

## Import Rules

- Use configured aliases; avoid legacy import families.
- Avoid cross-layer relative imports across contexts.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
#use skill next-devtools-mcp
````

## File: .github/instructions/bounded-context-rules.instructions.md
````markdown
---
description: '限界上下文邊界與模組依賴方向規範，遵循 Vaughn Vernon IDDD 戰略設計原則。'
applyTo: 'modules/**/*.{ts,tsx,js,jsx,md}'
---

# 限界上下文規則 (Bounded Context Rules)

## 核心原則

每個 `modules/<context>/` 是一個**獨立的限界上下文**，擁有自己的通用語言與領域模型。同一術語在不同限界上下文中可能有不同含義，須以各自的模型為準。

## 邊界規則

1. **跨模組存取**只能透過目標模組的 `api/` 公開合約進行。嚴禁直接匯入其他模組的 `domain/`、`application/`、`infrastructure/` 或 `interfaces/` 內部程式碼。
2. **限界上下文間的通訊**只能透過以下方式：
   - 發布與訂閱**領域事件** (Domain Events)
   - 呼叫目標模組的 `api/` 公開 Facade 或合約
3. **基礎設施直接呼叫**（如 Firebase Admin、Upstash）必須封裝在各自模組的 `infrastructure/` 層，不得跨模組共用。

## 依賴方向

```
interfaces/ → application/ → domain/ ← infrastructure/
```

- `domain/` 必須保持框架無關（不能匯入 Firebase SDK、React、HTTP 客戶端等）。
- `infrastructure/` 實作 `domain/` 定義的 Repository 介面，只向下依賴。
- `application/` 協調 Use Cases，只依賴 `domain/` 的抽象。
- `interfaces/` 處理 UI、路由處理器、API 傳輸與 Server Action 接線。

## 上下文地圖 (Context Map)

完整模組地圖請查閱：**[`docs/ddd/bounded-contexts.md`](../../docs/ddd/bounded-contexts.md)**

> 模組清單不在此複製。模組職責變更時，必須更新上述文件，而非此處。

## 防腐層 (Anti-Corruption Layer)

- 整合外部系統（Firebase、Genkit、Upstash）時，必須在 `infrastructure/` 層建立適配器。
- 防止外部概念與命名污染領域模型的類別與介面。
- 在適配器中負責翻譯外部模型與領域模型之間的概念差異。

## 禁止模式

- ❌ `import { X } from '@/modules/other-context/domain/...'`
- ❌ `import { X } from '@/modules/other-context/application/...'`
- ❌ `import { X } from '@/modules/other-context/infrastructure/...'`
- ✅ `import { X } from '@/modules/other-context/api'`

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/instructions/branching-strategy.instructions.md
````markdown
---
description: 'Branching and change-scope strategy for focused, reviewable delivery.'
applyTo: '**/*'
---

# Branching Strategy

## Rules

- Keep one concern per branch and PR.
- Name branches by intent and scope.
- Avoid mixing architecture refactor with unrelated feature work.

## Validation Before Merge

- Run relevant lint/build/test commands for touched runtime.
- Document what changed and why.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/instructions/ci-cd.instructions.md
````markdown
---
description: 'CI/CD execution rules for lint, build, tests, and release evidence.'
applyTo: '{.github/workflows/**/*.{yml,yaml},package.json,py_fn/requirements.txt,firebase.json,apphosting.yaml}'
---

# CI CD

## Required Checks

- `npm run lint`
- `npm run build`
- `cd py_fn && python -m compileall -q .`
- `cd py_fn && python -m pytest tests/ -v`

## Rules

- Do not skip failing mandatory checks.
- Report unrelated baseline failures separately.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/instructions/cloud-functions.instructions.md
````markdown
---
description: 'Rules for Python Cloud Functions worker responsibilities and boundaries.'
applyTo: 'py_fn/**/*.py'
---

# Cloud Functions

## Ownership

- `py_fn/` handles parsing, cleaning, taxonomy, chunking, embedding, and background jobs.
- Do not add browser-facing chat/auth/session logic in `py_fn/`.

## Runtime Decision Rule

- If called directly from page or browser flow, keep it in Next.js.
- If heavy, retryable, admin/internal, or long-running, keep it in `py_fn/`.

## Guardrails

- Preserve worker layer boundaries.
- Keep ingest job flow deterministic and retry-safe.

## Boundary Change Validation

- Before changing worker ownership, review `py_fn/docs/decision-architecture/adr/README.md` and accepted ADRs.
- Update `py_fn/README.md` when responsibilities or runtime contracts change.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-rag-runtime-boundary
````

## File: .github/instructions/commit-convention.instructions.md
````markdown
---
description: 'Commit message and change-summary conventions for maintainable history.'
applyTo: '**/*'
---

# Commit Convention

## Rules

- Keep subject concise and action-oriented.
- Reference scope (module/runtime) in commit body when relevant.
- Include validation evidence for non-trivial changes.

## Avoid

- Mixed unrelated changes in one commit.
- Vague subjects with no functional signal.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/instructions/domain-modeling.instructions.md
````markdown
---
description: '聚合根、實體與值對象的 Immutable 設計與 Zod 驗證規範，遵循 IDDD 戰術設計原則。'
applyTo: 'modules/**/domain/**/*.{ts,tsx}'
---

# 領域模型設計規範 (Domain Modeling)

> 完整知識參考：**對應 bounded context 的 `docs/ddd/<context>/aggregates.md`**
> 此文件只包含**行為約束與程式碼範例**，不複製領域知識。

## 聚合根 (Aggregate Root)

- 每個聚合必須有**唯一識別碼**（使用 Zod 品牌型別 `z.string().uuid().brand('...')`）。
- 使用**私有建構函式**加靜態工廠方法 `create()` 與 `reconstitute()`。
- 所有狀態修改必須透過**封裝的命令方法**，不允許直接修改屬性。
- **業務規則（不變數）**只在聚合內部執行，違規時拋出帶有描述的 `Error`。
- 每次狀態修改必須產生對應的**領域事件**並存入 `_domainEvents` 私有陣列。
- 使用 `pullDomainEvents()` 方法提取並清空待發布事件。
- `getSnapshot()` 回傳 `Readonly<State>`，防止外部直接修改狀態。

```typescript
// 聚合根標準結構
export class MyAggregate {
  private readonly _id: MyId;
  private _state: MyState;
  private _domainEvents: DomainEvent[] = [];

  private constructor(id: MyId, state: MyState) {
    this._id = id;
    this._state = state;
  }

  // 工廠方法：新建
  public static create(id: MyId, /* ...inputs */): MyAggregate {
    const aggregate = new MyAggregate(id, { /* 初始狀態 */ });
    aggregate._domainEvents.push({ /* MyAggregateCreated 事件 */ });
    return aggregate;
  }

  // 工廠方法：從持久化資料重建
  public static reconstitute(snapshot: MySnapshot): MyAggregate {
    return new MyAggregate(snapshot.id as MyId, snapshot);
  }

  // 業務方法
  public doSomething(input: string): void {
    // 1. 驗證不變數
    if (this._state.status === 'archived') {
      throw new Error('Cannot modify an archived aggregate.');
    }
    // 2. 更新狀態
    this._state = { ...this._state, field: input };
    // 3. 記錄領域事件
    this._domainEvents.push({ type: 'my-context.something-done', /* ... */ });
  }

  public get id(): MyId { return this._id; }

  public getSnapshot(): Readonly<MyState> {
    return Object.freeze({ ...this._state });
  }

  public pullDomainEvents(): DomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }
}
```

## 值對象 (Value Object)

- 使用 **Zod Schema** 定義並驗證，並使用 `z.brand()` 確保型別安全。
- 值對象必須是**不可變的**（Immutable）。
- 相等性以**值內容**判斷，不以物件參考判斷。
- 不應包含識別碼欄位。

```typescript
// 值對象：品牌型別模式
import { z } from 'zod';

export const WorkspaceIdSchema = z.string().uuid().brand('WorkspaceId');
export type WorkspaceId = z.infer<typeof WorkspaceIdSchema>;

export const WorkspaceNameSchema = z.string().min(1).max(100).trim().brand('WorkspaceName');
export type WorkspaceName = z.infer<typeof WorkspaceNameSchema>;
```

## 實體 (Entity)

- 具有唯一識別碼，以識別碼判斷相等性。
- 狀態可變，但修改應透過方法封裝。
- 不要設計成只有 Getter/Setter 的**貧血模型**（Anemic Domain Model）。
- 識別碼使用品牌型別值對象保護型別安全。

## Zod 驗證規範

- 所有 Domain 物件的 Schema 定義必須放在 `domain/` 層（不依賴外部框架）。
- 使用 `z.infer<typeof Schema>` 產生 TypeScript 型別，避免型別重複定義。
- 在聚合的工廠方法或命令方法中執行輸入驗證。
- `CommandResult` 使用 `@shared-types` 的共用型別。

## 禁止模式 (Anti-Patterns)

- ❌ **貧血領域模型**：只有資料屬性（`id`, `name`, `status`），無業務邏輯。
- ❌ **直接暴露可變狀態**：`public state: MyState`。
- ❌ **在 `domain/` 層匯入外部框架**：Firebase、HTTP 客戶端、React。
- ❌ **跨聚合直接操作**：在聚合 A 中直接修改聚合 B 的狀態。
- ❌ **過大聚合**：聚合包含過多子實體，應重新評估邊界。

## 目錄結構

```
modules/<context>/domain/
├── aggregates/        # 聚合根類別
├── entities/          # 子實體類別與型別定義
├── value-objects/     # 值對象（品牌型別）
├── events/            # 領域事件定義（Zod Schema）
├── repositories/      # 儲存庫介面（只有介面，無實作）
└── services/          # 領域服務（無狀態業務邏輯）
```

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/instructions/embedding-pipeline.instructions.md
````markdown
---
description: 'Ingestion and embedding pipeline contract for worker-side RAG preparation.'
applyTo: '{py_fn/**/*.py,docs/**/*.md}'
---

# Embedding Pipeline

## Contract Order

Parse -> Clean -> Taxonomy -> Chunk -> Chunk metadata -> Embedding -> Firestore writes -> Mark ready

## Rules

- Do not reorder stages without contract/doc update.
- Normalize source documents to markdown (for example via MarkItDown) before chunking when required by source format.
- Keep metadata traceable for retrieval citations.
- Validate converted markdown quality before chunking.
- Record notable format-loss risk when conversion fidelity may affect downstream retrieval.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-rag-runtime-boundary
#use skill llamaparse
#use skill liteparse
````

## File: .github/instructions/event-driven-state.instructions.md
````markdown
---
description: 'XState 狀態機與領域事件互動規範，包含 SuperJSON 序列化處理，遵循 IDDD 事件驅動架構原則。'
applyTo: 'modules/**/*.{ts,tsx}'
---

# 事件驅動狀態規範 (Event-Driven State)

> 完整知識參考：**對應 bounded context 的 `docs/ddd/<context>/domain-events.md`**
> 此文件只包含**行為約束與程式碼範例**，不複製領域知識。

## 領域事件 (Domain Events)

- 所有**狀態變更**都必須產生一個對應的領域事件，捕捉業務因果關係。
- 領域事件命名必須是**過去式**，格式為 `<Entity><Action>`，例如 `WorkspaceCreated`、`KnowledgeIngested`。
- 事件 `type` 的 discriminant 格式為 `<module-name>.<action>`，例如 `workspace.created`。
- 使用 **Zod Schema** 嚴格定義事件 Payload。
- 事件必須包含 `eventId`（UUID）與 `occurredAt`（**ISO string**）欄位，遵循 `modules/shared/domain/events.ts` 的 `DomainEvent` 基礎介面。

```typescript
// 領域事件定義範例
import { z } from 'zod';

export const WorkspaceCreatedEventSchema = z.object({
  type: z.literal('workspace.created'),
  eventId: z.string().uuid(),
  occurredAt: z.string().datetime(),   // ISO 8601 字串，非 Date 物件
  payload: z.object({
    workspaceId: z.string().uuid(),
    organizationId: z.string().uuid(),
    name: z.string(),
    ownerId: z.string(),
  }),
});
export type WorkspaceCreatedEvent = z.infer<typeof WorkspaceCreatedEventSchema>;
```

## SuperJSON 序列化

- 跨越 Server/Client 邊界傳遞事件或包含 `Date`、`Map`、`Set` 等型別時，使用 **SuperJSON** 進行序列化。
- 確保 Server Action 或 API 回應中的複雜型別能正確序列化與還原。
- 在 Next.js Server Action 的輸出端序列化，在 Client 端使用 SuperJSON 還原。

## XState 狀態機整合

- 前端複雜的多步驟狀態流轉（如表單精靈、多階段審批）使用 **XState** 管理。
- Machine 定義放在 `modules/<context>/application/machines/` 目錄。
- XState Machine 的 `actions` 應觸發對應的 Server Action，並將結果映射回 Machine 的事件。
- Machine 的事件型別應與對應的領域事件保持語意一致。

```typescript
// XState Machine 與 Server Action 整合範例
import { createMachine, assign } from 'xstate';

export const workspaceMachine = createMachine({
  id: 'workspace',
  initial: 'idle',
  context: { workspaceId: null as string | null, error: null as string | null },
  states: {
    idle: {
      on: { CREATE: 'creating' },
    },
    creating: {
      invoke: {
        src: 'createWorkspaceAction',  // 對應 Server Action
        onDone: {
          target: 'ready',
          actions: assign({ workspaceId: ({ event }) => event.output.aggregateId }),
        },
        onError: {
          target: 'failed',
          actions: assign({ error: ({ event }) => String(event.error) }),
        },
      },
    },
    ready: {},
    failed: { on: { RETRY: 'idle' } },
  },
});
```

## 事件發布流程

1. 聚合根透過業務方法產生領域事件，存入 `_domainEvents` 陣列。
2. Use Case（Application Service）在聚合**持久化成功後**，呼叫 `pullDomainEvents()` 提取事件。
3. Use Case 負責將事件發布到 QStash 或事件匯流排（At-Least-Once 語意）。
4. 不可在聚合持久化**之前**發布事件（確保一致性）。

```typescript
// Use Case 中的事件發布流程
export class CreateWorkspaceUseCase {
  async execute(input: CreateWorkspaceInput): Promise<CommandResult> {
    const workspace = Workspace.create(generateId(), input);
    await this.workspaceRepository.save(workspace);  // 1. 先持久化
    const events = workspace.pullDomainEvents();      // 2. 提取事件
    await this.eventPublisher.publishAll(events);     // 3. 再發布
    return { success: true, aggregateId: workspace.id };
  }
}
```

## 驗證

- `occurredAt` 必須使用 ISO string，不得使用 `Date` 物件（與 `shared/domain/events.ts` 一致）。
- 事件 Schema 使用 Zod 驗證，確保 Payload 型別安全。

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/instructions/firebase-architecture.instructions.md
````markdown
---
description: 'Firebase architecture boundaries for Next.js orchestration, Firestore, and Python worker runtime.'
applyTo: '{app,modules,packages,py_fn}/**/*.{ts,tsx,js,jsx,py}'
---

# Firebase Architecture

## Runtime Split

- Next.js: user-facing orchestration, auth/session, server actions.
- `py_fn/`: heavy ingestion, embedding, and background operations.

## Responsibility Split

- Next.js owns upload UX, browser-facing APIs, and AI response orchestration.
- `py_fn/` owns parse/clean/taxonomy/chunk/embed/persist pipelines.

## Data Boundary

- Keep Firestore document contracts explicit.
- Avoid implicit schema drift across modules.
- Preserve source and chunk metadata traceability for audit and citation needs.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-rag-runtime-boundary
#use skill xuanwu-development-contracts
````

## File: .github/instructions/firestore-schema.instructions.md
````markdown
---
description: 'Firestore schema and index design rules aligned to bounded context ownership.'
applyTo: '{modules/**/infrastructure/**/*.{ts,tsx,js,jsx},firestore.indexes.json,firestore.rules}'
---

# Firestore Schema

## Rules

- Keep collection ownership explicit per module.
- Version breaking schema transitions with migration steps.
- Update indexes with query-shape changes.

## Validation

- Verify read/write paths remain compatible.
- Confirm index coverage for new query patterns.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-development-contracts
````

## File: .github/instructions/genkit-flow.instructions.md
````markdown
---
description: 'Genkit flow design and runtime-boundary rules for AI orchestration.'
applyTo: '{modules/agent/**/*.{ts,tsx,js,jsx},app/**/*.{ts,tsx}}'
---

# Genkit Flow

## Rules

- Keep flow inputs/outputs explicit and typed.
- Keep user-facing orchestration in Next.js.
- Delegate heavy ingestion/embedding to worker-side pipelines.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-rag-runtime-boundary
#use skill next-devtools-mcp
````

## File: .github/instructions/hosting-deploy.instructions.md
````markdown
---
description: 'Hosting deploy guardrails for Firebase App Hosting and release safety.'
applyTo: '{apphosting.yaml,firebase.json,.github/workflows/**/*.{yml,yaml}}'
---

# Hosting Deploy

## Rules

- Validate build and config before deployment.
- Keep deploy scope explicit (hosting, rules, indexes, functions).
- Record rollback path for production-impacting changes.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/instructions/lint-format.instructions.md
````markdown
---
description: 'Lint and formatting expectations for TypeScript and Python changes.'
applyTo: '{app,modules,packages,providers,debug,py_fn}/**/*.{ts,tsx,js,jsx,py}'
---

# Lint Format

## Required Commands

- `npm run lint`
- `npm run build` when types or exports changed
- `cd py_fn && python -m compileall -q .`

## Rules

- Fix new lint errors introduced by your change.
- Do not hide violations by broad rule disables.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill vscode-typescript-workbench
````

## File: .github/instructions/modules/modules-api-surface.instructions.md
````markdown
---
name: 'Modules API Surface'
description: 'Rules for modules/*/api files so cross-domain access stays API-only through contracts and facades.'
applyTo: 'modules/**/api/**/*.ts'
---

# Modules API Surface

Use this instruction for `modules/*/api` files.

## Required Shape

- Keep `contracts.ts` for DTOs, request types, response types, and stable public contracts.
- Keep `facade.ts` for outward use-case entry points that the app layer or other modules can call.
- Export the minimum stable surface needed by consumers.

## Guardrails

- Do not instantiate infrastructure adapters directly in `api/`.
- Do not expose private domain entities or repository implementations unless a public contract explicitly requires a translated type.
- Do not reach into other modules except through their own `api/` boundaries.

## Validation

- Re-check every new export and downstream import path.
- Run validation from `agents/commands.md` when API signatures or import surfaces change.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
#use skill xuanwu-development-contracts
````

## File: .github/instructions/modules/modules-index-entry.instructions.md
````markdown
---
name: 'Modules Index Entry'
description: 'Rules for modules/*/index.ts files so they remain aggregate exports without embedded business logic.'
applyTo: 'modules/**/index.ts'
---

# Modules Index Entry

Use this instruction for module root `index.ts` files.

## Rules

- `index.ts` is an aggregate export only.
- Re-export stable public members from `api/` or other intentionally public entry points.
- Keep the file free of orchestration, conditionals, adapter wiring, and business logic.

## Guardrails

- Do not implement use cases, facades, or stateful helpers here.
- Do not expose private infrastructure or domain internals through convenience exports.

## Validation

- Verify that app-layer or cross-module imports still resolve through the intended public surface.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
````

## File: .github/instructions/modules/modules-infrastructure-adapters.instructions.md
````markdown
---
name: 'Modules Infrastructure Adapters'
description: 'Rules for modules/*/infrastructure files so external resources stay in adapters with downward-only dependencies.'
applyTo: 'modules/**/infrastructure/**/*.{ts,tsx,js,jsx}'
---

# Modules Infrastructure Adapters

Use this instruction for `modules/*/infrastructure` files.

## Rules

- Keep Firebase, storage, HTTP, queue, and third-party adapters here.
- Infrastructure may depend on `domain/` contracts and entities needed to implement ports.
- Keep adapter wiring explicit and local to infrastructure.

## Guardrails

- Do not depend on `application/`, `api/`, or `interfaces/`.
- Do not place domain decision logic here.
- Do not let app-layer concerns leak into adapter code.

## Validation

- Re-check dependency direction after import changes.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/instructions/modules/modules-interfaces-api-consumption.instructions.md
````markdown
---
name: 'Modules Interfaces API Consumption'
description: 'Rules for modules/*/interfaces files so UI, hooks, and external interfaces consume module behavior only through api/.'
applyTo: 'modules/**/interfaces/**/*.{ts,tsx,js,jsx}'
---

# Modules Interfaces API Consumption

Use this instruction for `modules/*/interfaces` files.

## Rules

- Put UI components, hooks, route-facing adapters, and interface DTOs here.
- Consume module behavior through the module's own `api/` surface.
- Keep local view state or interaction state inside the interface layer.

## Guardrails

- Do not import the same module's `domain/` or `application/` directly.
- Do not import another module's internals.
- Do not place external resource adapters here.

## Validation

- Re-check imports for accidental reach-through before finishing.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/instructions/nextjs-app-router.instructions.md
````markdown
---
description: 'Next.js App Router composition rules for route slices and ownership boundaries.'
applyTo: 'app/**/*.{ts,tsx}'
---

# Nextjs App Router

## Rules

- Keep route files focused on composition and rendering.
- Prefer Server Components unless client interactivity is required.
- Keep business logic in modules and consume via module APIs.
- Use package aliases and avoid legacy import families.
- Keep `app/` as composition ownership, not domain-rule ownership.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill next-devtools-mcp
#use skill vercel-react-best-practices
#use skill vercel-composition-patterns
````

## File: .github/instructions/nextjs-parallel-routes.instructions.md
````markdown
---
description: 'Parallel-route UI block composition rules with isolated local state and API-only module access.'
applyTo: 'app/**/*.{ts,tsx}'
---

# Nextjs Parallel Routes

## Rules

- Keep slot-level state isolated.
- Avoid hidden coupling between unrelated slots.
- Consume cross-domain behavior through module APIs only.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill app-router-parallel-routes
#use skill next-devtools-mcp
#use skill vercel-react-best-practices
````

## File: .github/instructions/nextjs-server-actions.instructions.md
````markdown
---
description: 'Server Action rules for thin orchestration, validation at boundaries, and stable result contracts.'
applyTo: '{app,modules}/**/*.{ts,tsx}'
---

# Nextjs Server Actions

## Rules

- Use `use server` explicitly.
- Keep actions thin and delegate business logic to use cases.
- Return consistent command result shapes.
- Validate inputs at action boundaries using shared validators where applicable.
- Keep infrastructure access out of route files and action wrappers.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill next-devtools-mcp
#use skill vercel-react-best-practices
````

## File: .github/instructions/prompt-engineering.instructions.md
````markdown
---
description: 'Prompt authoring rules for deterministic, low-noise, reusable workflow prompts.'
applyTo: '.github/prompts/**/*.prompt.md'
---

# Prompt Engineering

## Frontmatter

- Use clear `description` and `agent` fields.
- Declare `tools` with least privilege when tool usage is required.
- Keep `argument-hint` explicit when the prompt expects user inputs.

## Structure

1. Mission
2. Inputs
3. Workflow
4. Output contract
5. Validation

## Rules

- Keep prompts specific and executable.
- Declare required inputs and fallbacks.
- Keep tools least-privilege when defined.
- Avoid copying repository-global policy into each prompt.
- Prefer short executable steps over long background text.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
````

## File: .github/instructions/rag-architecture.instructions.md
````markdown
---
description: 'RAG architecture boundaries for conversion, chunking, embedding, and retrieval workflows.'
applyTo: '{modules/retrieval/**/*.{ts,tsx,js,jsx},modules/knowledge/**/*.{ts,tsx,js,jsx},py_fn/**/*.py,docs/**/*.md}'
---

# RAG Architecture

## Rules

- Normalize source docs before chunking when needed, including MarkItDown-based conversion for non-markdown sources.
- Keep retrieval metadata auditable and source-traceable.
- Keep runtime split: Next.js orchestration, `py_fn` ingestion pipeline.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-rag-runtime-boundary
#use skill llamaparse
#use skill liteparse
````

## File: .github/instructions/security-rules.instructions.md
````markdown
---
description: 'Security rules guardrails for Firestore and Storage with least-privilege access.'
applyTo: '{firestore.rules,storage.rules,modules/**/infrastructure/**/*.{ts,tsx,js,jsx},py_fn/**/*.py}'
---

# Security Rules

## Rules

- Enforce organization and workspace isolation.
- Keep allow conditions explicit and auditable.
- Pair rule changes with scenario-based validation.

## Avoid

- Broad wildcard allows without actor checks.
- Hidden coupling to UI-side assumptions.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-development-contracts
````

## File: .github/instructions/shadcn-ui.instructions.md
````markdown
---
description: 'shadcn/ui usage rules for consistent component composition and accessibility.'
applyTo: '{app,modules,packages}/**/*.{ts,tsx}'
---

# Shadcn UI

## Rules

- Prefer existing primitives before creating new components.
- Keep semantic markup and keyboard accessibility intact.
- Keep component concerns separate from business rules.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill shadcn
#use skill web-design-guidelines
````

## File: .github/instructions/tailwind-design-system.instructions.md
````markdown
---
description: 'Tailwind design-system consistency rules for tokens, spacing, and responsive behavior.'
applyTo: '{app,modules,packages}/**/*.{ts,tsx,css}'
---

# Tailwind Design System

## Rules

- Reuse established tokens and utility conventions.
- Keep spacing and typography scales consistent.
- Avoid ad-hoc one-off style patterns without rationale.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill web-design-guidelines
#use skill shadcn
````

## File: .github/instructions/testing-e2e.instructions.md
````markdown
---
description: 'End-to-end testing rules for browser flows, evidence capture, and release confidence.'
applyTo: '{app,modules,debug}/**/*.{ts,tsx}'
---

# Testing E2E

## Rules

- Validate user-critical flows and failure paths.
- Capture reproducible evidence for failures.
- Separate confirmed defects from enhancement suggestions.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill vscode-testing-debugging-browser
#use skill next-devtools-mcp
````

## File: .github/instructions/testing-unit.instructions.md
````markdown
---
description: 'Unit testing rules for deterministic, isolated, and behavior-focused coverage.'
applyTo: '{modules,packages,py_fn}/**/*.{ts,tsx,js,jsx,py}'
---

# Testing Unit

## Rules

- Keep tests deterministic and isolated.
- Test behavior and invariants, not implementation trivia.
- Cover happy, boundary, and negative paths for core domain logic.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill vscode-testing-debugging-browser
#use skill vscode-typescript-workbench
````

## File: .github/instructions/ubiquitous-language.instructions.md
````markdown
---
description: '強制查閱 terminology-glossary.md 並使用通用語言進行命名，遵循 IDDD 通用語言規範。'
applyTo: 'modules/**/*.{ts,tsx,js,jsx}'
---

# 通用語言規範 (Ubiquitous Language)

## 核心規則

1. 在命名任何 Class、Interface、Type、Variable 或 Domain Event 之前，**必須**先查閱 `terminology-glossary.md`。
2. 嚴禁使用同義詞替換：若術語表定義使用者為 `Tenant`，不得命名為 `User`、`Client` 或 `Customer`。
3. 領域事件命名必須使用**過去式**，例如：`KnowledgeIngested`、`WorkspaceCreated`、`MemberInvited`。
4. 限界上下文的名稱必須與 `modules/<context>/` 資料夾名稱保持一致。
5. 若發現術語表缺少必要術語，應先更新 `terminology-glossary.md` 再繼續實作。

## 術語定義（權威來源）

完整術語入口請查閱：**[`.github/terminology-glossary.md`](../terminology-glossary.md)**，並依實際 bounded context 查閱對應的 `docs/ddd/<context>/ubiquitous-language.md`。

> 此處不複製術語表。遇到不確定的術語，必須查閱上述文件。

## 命名規範

- **聚合根**：`PascalCase` 名詞，例如 `Workspace`、`KnowledgeBase`。
- **值對象**：`PascalCase` 名詞，通常以用途或含義命名，例如 `WorkspaceName`、`TenantId`。
- **領域事件**：`PascalCase` 過去式，例如 `WorkspaceCreated`、`MemberRemoved`。
- **事件 discriminant**：`kebab-case` 格式 `<module>.<action>`，例如 `workspace.created`。
- **使用案例檔案**：`verb-noun.use-case.ts`，例如 `create-workspace.use-case.ts`。
- **儲存庫介面**：`PascalCaseRepository`，例如 `WorkspaceRepository`。
- **儲存庫實作**：`TechnologyPascalCaseRepository`，例如 `FirebaseWorkspaceRepository`。

## 驗證

- 提交前確認新增命名符合術語表定義。
- 若使用新術語，同步更新 `terminology-glossary.md` 的「DDD 戰術設計術語」章節。

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-mddd-boundaries
````

## File: .github/prompts/analyze-repo.prompt.md
````markdown
---
name: analyze-repo
description: Analyze repository structure, ownership boundaries, and change impact before implementation.
agent: Serena Strategist
argument-hint: Provide target area, goal, and constraints.
---

# Analyze Repo

## Mission

Map ownership, boundaries, and risks before coding.

## Inputs

- target: ${input:target:modules/workspace}
- goal: ${input:goal:what needs to change}
- constraints: ${input:constraints:boundary, runtime, timeline}

## Workflow

1. Identify owning module and runtime.
2. Locate existing APIs, use cases, and adapters.
3. Flag boundary violations and regression risks.
4. Recommend minimal-change implementation path.

## Output Contract

- Ownership map
- Affected files
- Risk list
- Suggested next prompt

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/prompts/app/create-parallel-route-slice.prompt.md
````markdown
---
name: 'create-parallel-route-slice'
description: 'Create or refactor an app/ route slice or parallel-route block that composes module APIs without importing module internals.'
agent: 'App Router Composer'
argument-hint: 'Provide the route path, UI block role, allowed module APIs, and whether the slice should be server or client.'
---

# Create Parallel Route Slice

## Mission

Create or refactor a route slice in `app/` that composes one feature block and keeps the module boundary API-only.

## Inputs

- Route path: `${input:routePath:app/(shell)/dashboard}`
- Block role: `${input:blockRole:dashboard panel | sidebar tool | modal | chat console}`
- Allowed module APIs: `${input:moduleApis:@/modules/workspace/api}`
- Rendering mode: `${input:renderMode:server | client}`

## Workflow

1. Keep the slice focused on one UI responsibility.
2. Consume module data through public APIs only.
3. Keep local UI state isolated to this slice or its local components.
4. Avoid embedding business logic in the route layer.
5. Run the minimum validation needed for the touched files.

## Output

- Files created or changed
- Module APIs consumed
- Validation run
- Any remaining route-state or boundary risks

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill app-router-parallel-routes
#use skill next-devtools-mcp
#use skill vercel-react-best-practices
````

## File: .github/prompts/chunk-docs.prompt.md
````markdown
---
name: chunk-docs
description: Define and execute document chunking strategy for retrieval quality and context efficiency.
agent: rag-lead
argument-hint: Provide source docs, target chunk policy, and constraints.
---

# Chunk Docs

## Inputs

- docs: ${input:docs:docs/**/*.md}
- policy: ${input:policy:size,overlap,metadata}
- constraints: ${input:constraints:token budget and citation needs}

## Workflow

1. Validate document normalization status.
2. Apply chunking policy with explicit metadata fields.
3. Check chunk quality for retrieval relevance.
4. Report chunk statistics and edge cases.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-rag-runtime-boundary
#use skill liteparse
#use skill llamaparse
````

## File: .github/prompts/debug-error.prompt.md
````markdown
---
name: debug-error
description: Reproduce, diagnose, and propose fixes for runtime or logic errors with evidence.
agent: App Router Agent
argument-hint: Provide error message, route/module, and reproduction steps.
---

# Debug Error

## Inputs

- error: ${input:error:paste error message}
- scope: ${input:scope:route/module/runtime}
- repro: ${input:repro:steps to reproduce}

## Workflow

1. Reproduce issue and capture evidence.
2. Isolate likely root cause and affected boundaries.
3. Propose minimal fix plus regression checks.
4. State validation commands to confirm resolution.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill next-devtools-mcp
#use skill vscode-testing-debugging-browser
````

## File: .github/prompts/embedding-docs.prompt.md
````markdown
---
name: embedding-docs
description: Generate embeddings from normalized docs with traceable metadata and retrieval compatibility checks.
agent: embedding-writer
argument-hint: Provide doc sources, embedding model/runtime, and storage target.
---

# Embedding Docs

## Workflow

1. Confirm docs are normalized and chunked.
2. Generate embeddings with stable metadata.
3. Write vectors and verify retrieval compatibility.
4. Report failures, retries, and quality risks.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-rag-runtime-boundary
#use skill llamaparse
````

## File: .github/prompts/implement-feature.prompt.md
````markdown
---
name: implement-feature
description: Execute an approved feature plan with bounded scope, required validation, and doc updates.
agent: Domain Lead
argument-hint: Provide approved plan reference and tasks to execute.
---

# Implement Feature

## Requirements

- Treat the approved plan as execution contract.
- Keep within scope and non-goals.
- Run required validation commands.
- Update listed docs in the same change.

## Output

- Tasks completed
- Validation run
- Documentation updated
- Deviations or blockers

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
#use skill next-devtools-mcp
#use skill vercel-react-best-practices
````

## File: .github/prompts/implement-firestore-schema.prompt.md
````markdown
---
name: implement-firestore-schema
description: Implement Firestore schema/index updates with backward-safe migration and validation evidence.
agent: firestore-schema
argument-hint: Provide collections, fields, query patterns, and migration constraints.
---

# Implement Firestore Schema

## Workflow

1. Define schema and ownership by bounded context.
2. Update indexes for new query shapes.
3. Plan migration or compatibility path.
4. Validate read/write behavior and regressions.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-development-contracts
````

## File: .github/prompts/implement-genkit-flow.prompt.md
````markdown
---
name: implement-genkit-flow
description: Implement or refactor Genkit flow with explicit contracts, runtime boundaries, and validation.
agent: genkit-flow
argument-hint: Provide flow intent, inputs/outputs, and target runtime.
---

# Implement Genkit Flow

## Workflow

1. Define flow contract (input, output, failure modes).
2. Keep orchestration in Next.js and heavy processing in worker runtime.
3. Integrate with retrieval or action boundaries safely.
4. Validate flow behavior and fallback paths.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-rag-runtime-boundary
#use skill next-devtools-mcp
````

## File: .github/prompts/implement-security-rules.prompt.md
````markdown
---
name: implement-security-rules
description: Implement Firestore/Storage security rules with least privilege and tenancy isolation.
agent: security-rules
argument-hint: Provide access scenarios, actor roles, and constrained resources.
---

# Implement Security Rules

## Workflow

1. Enumerate allowed actor-resource actions.
2. Encode explicit allow conditions and deny-by-default behavior.
3. Validate with scenario-based checks.
4. Report residual access risks.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-development-contracts
````

## File: .github/prompts/implement-server-action.prompt.md
````markdown
---
name: implement-server-action
description: Implement Next.js server actions as thin orchestrators that delegate to use cases.
agent: server-action-writer
argument-hint: Provide action intent, input schema, and target use case.
---

# Implement Server Action

## Rules

- Use `use server`.
- Validate input at boundary.
- Delegate business logic to module use cases.
- Return stable command-result shape.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill next-devtools-mcp
#use skill vercel-react-best-practices
#use skill modules-mddd-api-surface
````

## File: .github/prompts/implement-ui-component.prompt.md
````markdown
---
name: implement-ui-component
description: Build or refactor UI components with shadcn patterns and boundary-safe composition.
agent: Component Agent
argument-hint: Provide component goal, route scope, and interaction states.
---

# Implement UI Component

## Workflow

1. Confirm component ownership and target route slice.
2. Reuse existing shadcn primitives where possible.
3. Implement states: loading, empty, error, success.
4. Validate accessibility and interaction behavior.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill shadcn
#use skill web-design-guidelines
#use skill vercel-react-best-practices
#use skill next-devtools-mcp
````

## File: .github/prompts/ingest-docs.prompt.md
````markdown
---
name: ingest-docs
description: Ingest and normalize documents for downstream chunking and embedding workflows.
agent: doc-ingest
argument-hint: Provide source format, target pipeline, and quality constraints.
---

# Ingest Docs

## Workflow

1. Convert/normalize sources to markdown when needed.
2. Preserve source metadata and traceability.
3. Validate structure quality for chunking.
4. Output ingestion summary and loss-risk notes.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-rag-runtime-boundary
#use skill liteparse
#use skill llamaparse
````

## File: .github/prompts/plan-api.prompt.md
````markdown
---
name: plan-api
description: Create an API-focused implementation plan covering contracts, facades, consumers, and validation.
agent: Planner
argument-hint: Provide API intent, owner module, consumers, and compatibility constraints.
---

# Plan API

## Requirements

- Define contract shape and owner boundary.
- Identify consuming routes/modules.
- Include compatibility and migration strategy.
- Specify validation and documentation updates.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-development-contracts
````

## File: .github/prompts/plan-feature.prompt.md
````markdown
---
name: plan-feature
description: Create a formal implementation plan for a feature or scoped enhancement.
agent: Planner
argument-hint: Describe desired outcome, constraints, and affected modules.
---

# Plan Feature

Use the implementation plan template and include scope, ownership, risks, validation, and non-goals.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
#use skill xuanwu-development-contracts
````

## File: .github/prompts/plan-module.prompt.md
````markdown
---
name: plan-module
description: Plan module lifecycle changes (create, refactor, split, merge, delete) under MDDD boundaries.
agent: Modules Architect
argument-hint: Provide module scope, operation type, and migration constraints.
---

# Plan Module

## Workflow

1. Confirm bounded-context ownership.
2. Choose operation: create, refactor, split, merge, delete.
3. Map API/event consumers and migration path.
4. Define validation and docs updates.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/prompts/refactor-api.prompt.md
````markdown
---
name: refactor-api
description: Refactor module API surface with contract safety, consumer migration, and minimal boundary impact.
agent: Modules API Surface Steward
argument-hint: Provide current API, target API, and migration constraints.
---

# Refactor API

## Rules

- Preserve API-only cross-module access.
- Avoid leaking internals through barrels.
- Make compatibility path explicit when breaking changes are required.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/prompts/refactor-module.prompt.md
````markdown
---
name: refactor-module
description: Refactor existing module internals while preserving MDDD layers and public boundaries.
agent: Modules Architect
argument-hint: Provide module name, refactor goal, and boundary risks.
---

# Refactor Module

## Workflow

1. Analyze entity/use-case/repository ownership.
2. Move logic into correct layer boundaries.
3. Remove forbidden internal cross-module imports.
4. Update tests/docs alongside code changes.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/prompts/review-architecture.prompt.md
````markdown
---
name: review-architecture
description: Review ownership boundaries, dependency direction, and contract alignment of implemented changes.
agent: Quality Lead
argument-hint: Provide plan reference, changed files, and architecture concerns.
---

# Review Architecture

Return findings first by severity: boundary breaks, dependency inversions, contract drift, and missing docs.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill xuanwu-mddd-boundaries
````

## File: .github/prompts/review-code.prompt.md
````markdown
---
name: review-code
description: Perform risk-first code review for correctness, regressions, and missing validation.
agent: Quality Lead
argument-hint: Provide change summary, touched files, and known risk areas.
---

# Review Code

## Requirements

- Findings first, ordered by severity.
- Include why it matters and blocking status.
- State residual risks and testing gaps explicitly.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill modules-mddd-api-surface
#use skill vscode-typescript-workbench
````

## File: .github/prompts/review-performance.prompt.md
````markdown
---
name: review-performance
description: Review runtime and render performance risks with evidence-backed recommendations.
agent: App Router Agent
argument-hint: Provide route/feature scope, observed slowness, and baseline expectations.
---

# Review Performance

## Workflow

1. Collect route/runtime evidence.
2. Identify bottlenecks and likely causes.
3. Propose ranked fixes by impact and complexity.
4. Define validation for improvement claims.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill vercel-react-best-practices
#use skill next-devtools-mcp
````

## File: .github/prompts/review-security.prompt.md
````markdown
---
name: review-security
description: Review security posture for access control, data exposure, and rule/authorization regressions.
agent: quality-lead
argument-hint: Provide changed auth/rules/critical data paths and threat concerns.
---

# Review Security

Report vulnerabilities first with severity, reproduction notes, and concrete remediation steps.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill xuanwu-development-contracts
````

## File: .github/prompts/write-docs.prompt.md
````markdown
---
name: write-docs
description: Write or optimize documentation using structured, deduplicated, and index-driven markdown patterns.
agent: KB Architect
argument-hint: Provide target docs scope and expected documentation outcome.
---

# Write Docs

## Workflow

1. Lint markdown syntax first.
2. Compress and deduplicate repeated concepts.
3. Convert prose to rules/tables where possible.
4. Update folder index/README after leaf updates.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill documentation-writer
````

## File: .github/prompts/write-e2e-tests.prompt.md
````markdown
---
name: write-e2e-tests
description: Design and execute end-to-end tests for user-critical flows with reproducible evidence.
agent: E2E QA Agent
argument-hint: Provide URL/route, target user flow, and acceptance criteria.
---

# Write E2E Tests

## Scope

- Happy path
- Boundary/negative path
- Error-state handling

Collect evidence for failures and include clear reproduction steps.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill vscode-testing-debugging-browser
#use skill next-devtools-mcp
````

## File: .github/prompts/write-tests.prompt.md
````markdown
---
name: write-tests
description: Write deterministic unit/integration tests based on risk and behavior contracts.
agent: quality-lead
argument-hint: Provide module scope, behaviors to verify, and known regression risks.
---

# Write Tests

## Requirements

- Cover happy, boundary, and negative cases.
- Keep tests deterministic and isolated.
- Prioritize behavior contracts over implementation details.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill vscode-testing-debugging-browser
#use skill vscode-typescript-workbench
````

## File: CLAUDE.md
````markdown
# CLAUDE.md — Xuanwu App Context

Quick reference for Claude working in this Next.js 16 + MDDD repository.

## Context

**Xuanwu App**: Next.js 16, React 19, Firebase, Python workers (`py_fn/`)

**Architecture**: Module-Driven Domain Design (MDDD) — 19 bounded-context modules

**Essential**: Read AGENTS.md for rules, commands, and patterns.

## Quick Commands

```bash
npm run lint      # ESLint (0 errors)
npm run build     # Type-check + Next.js build
cd py_fn && python -m pytest tests/ -v
```

See [.github/agents/commands.md](.github/agents/commands.md) for full list.

## Key Principles

1. **Module isolation**: `modules/` are bounded contexts — use `api/` boundaries only
2. **Dependency direction**: `UI → App → Domain ← Infrastructure`
3. **Aliases**: Always use `@shared-*`, `@ui-*`, `@lib-*`, `@integration-*` — never `@/`
4. **Runtime split**: Next.js = frontend + orchestration; `py_fn/` = ingestion + workers

## Common Patterns (See AGENTS.md for full examples)

```ts
// Server Action: orchestrate use case, return CommandResult
"use server";
export async function action(input) { return useCase.execute(input); }

// Use Case: `application/use-cases/*.ts` orchestrates domain
// Repository: interface in `domain/`, impl in `infrastructure/`
```

## Full Reference

- **[AGENTS.md](AGENTS.md)** — Complete rules, commands, architecture, patterns
- **[.github/agents/knowledge-base.md](.github/agents/knowledge-base.md)** — Module inventory, tech stack
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** — Copilot delivery workflow
````

## File: modules/source/README.md
````markdown
# source — 文件來源上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/source/`  
> **開發狀態:** 🚧 Developing

## 在 Knowledge Platform / Second Brain 中的角色

`source` 是 Knowledge Platform 的文件入口，承接 Notion-like 內容系統之外的外部文件、附件與來源治理。它負責讓知識進入平台，並安全地交給 `ai` 攝入管線處理。

## 主要職責

| 能力 | 說明 |
|---|---|
| 來源文件生命週期 | 管理上傳初始化、上傳完成、版本快照與保留政策 |
| 來源集合管理 | 維護文件集合、library 與 workspace 範圍的來源視圖 |
| 攝入交接 | 把已完成上傳的來源資料交付 `ai` 進入攝入流程 |

## 與其他 Bounded Context 協作

- `workspace` 提供來源文件的歸屬邊界；`knowledge` 可能引用或轉寫來源內容。
- `ai` 接收來源文件並建立 ingestion job；`wiki` 與 `search` 最終消費來源衍生的結構與索引。

## 核心聚合 / 核心概念

- **`SourceDocument`**
- **`SourceCollection`**
- **`WikiLibrary`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: modules/wiki/README.md
````markdown
# wiki — 知識圖譜上下文

> **Domain Type:** **Core Domain**（核心域）  
> **模組路徑:** `modules/wiki/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`wiki` 是 Xuanwu 的 Wiki-like 結構層，負責把知識內容變成可連結、可遍歷、可回溯的節點與關聯網路。它與 `knowledge` 一起形成產品最核心的差異化價值。

## 主要職責

| 能力 | 說明 |
|---|---|
| Graph Node 管理 | 維護知識節點的生命週期與可見性 |
| Graph Edge 管理 | 維護節點之間的關聯、Backlink 與關係狀態 |
| 結構化知識導航 | 支撐圖譜遍歷、自動連結與知識關聯理解 |

## 與其他 Bounded Context 協作

- `knowledge` 提供被結構化的核心內容。
- `search` 與 `notebook` 消費圖譜脈絡做檢索與推理；`workspace` 提供圖譜的協作歸屬。

## 核心聚合 / 核心概念

- **`GraphNode`**
- **`GraphEdge`**
- **`WikiPage`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
````

## File: .github/instructions/README.md
````markdown
# Instructions Index

Repository instruction index for `applyTo`-scoped Copilot rules.

## DDD 戰略與戰術設計 (IDDD)

- [ubiquitous-language.instructions.md](ubiquitous-language.instructions.md)
- [bounded-context-rules.instructions.md](bounded-context-rules.instructions.md)
- [domain-modeling.instructions.md](domain-modeling.instructions.md)
- [event-driven-state.instructions.md](event-driven-state.instructions.md)

## Architecture

- [architecture-api-boundary.instructions.md](architecture-api-boundary.instructions.md)
- [architecture-mddd.instructions.md](architecture-mddd.instructions.md)
- [architecture-modules.instructions.md](architecture-modules.instructions.md)
- [architecture-monorepo.instructions.md](architecture-monorepo.instructions.md)

## Delivery Process

- [branching-strategy.instructions.md](branching-strategy.instructions.md)
- [ci-cd.instructions.md](ci-cd.instructions.md)
- [commit-convention.instructions.md](commit-convention.instructions.md)
- [lint-format.instructions.md](lint-format.instructions.md)

## Platform and Runtime

- [firebase-architecture.instructions.md](firebase-architecture.instructions.md)
- [cloud-functions.instructions.md](cloud-functions.instructions.md)
- [hosting-deploy.instructions.md](hosting-deploy.instructions.md)
- [firestore-schema.instructions.md](firestore-schema.instructions.md)
- [security-rules.instructions.md](security-rules.instructions.md)

## AI and RAG

- [genkit-flow.instructions.md](genkit-flow.instructions.md)
- [embedding-pipeline.instructions.md](embedding-pipeline.instructions.md)
- [rag-architecture.instructions.md](rag-architecture.instructions.md)
- [prompt-engineering.instructions.md](prompt-engineering.instructions.md)

## Next.js and UI

- [nextjs-app-router.instructions.md](nextjs-app-router.instructions.md)
- [nextjs-parallel-routes.instructions.md](nextjs-parallel-routes.instructions.md)
- [nextjs-server-actions.instructions.md](nextjs-server-actions.instructions.md)
- [shadcn-ui.instructions.md](shadcn-ui.instructions.md)
- [tailwind-design-system.instructions.md](tailwind-design-system.instructions.md)

## Testing

- [testing-unit.instructions.md](testing-unit.instructions.md)
- [testing-e2e.instructions.md](testing-e2e.instructions.md)

## DDD Navigation

Use `docs/ddd/` for domain knowledge and keep these instruction files behavioral only:

- [`../../docs/ddd/subdomains.md`](../../docs/ddd/subdomains.md)
- [`../../docs/ddd/bounded-contexts.md`](../../docs/ddd/bounded-contexts.md)
- `../../docs/ddd/<context>/*.md` for bounded-context details
````

## File: .github/prompts/README.md
````markdown
# Prompts Index

Repository prompt set for repeatable planning, implementation, review, and documentation tasks.

## DDD 領域建模 (IDDD)

- [generate-aggregate.prompt.md](generate-aggregate.prompt.md)
- [generate-domain-event.prompt.md](generate-domain-event.prompt.md)

## Planning

- [plan-feature.prompt.md](plan-feature.prompt.md)
- [plan-module.prompt.md](plan-module.prompt.md)
- [plan-api.prompt.md](plan-api.prompt.md)

## Implementation

- [implement-feature.prompt.md](implement-feature.prompt.md)
- [implement-firestore-schema.prompt.md](implement-firestore-schema.prompt.md)
- [implement-genkit-flow.prompt.md](implement-genkit-flow.prompt.md)
- [implement-security-rules.prompt.md](implement-security-rules.prompt.md)
- [implement-server-action.prompt.md](implement-server-action.prompt.md)
- [implement-ui-component.prompt.md](implement-ui-component.prompt.md)

## Docs and RAG

- [ingest-docs.prompt.md](ingest-docs.prompt.md)
- [chunk-docs.prompt.md](chunk-docs.prompt.md)
- [embedding-docs.prompt.md](embedding-docs.prompt.md)
- [write-docs.prompt.md](write-docs.prompt.md)

## Analysis and Debug

- [analyze-repo.prompt.md](analyze-repo.prompt.md)
- [debug-error.prompt.md](debug-error.prompt.md)

## Refactor and Review

- [refactor-module.prompt.md](refactor-module.prompt.md)
- [refactor-api.prompt.md](refactor-api.prompt.md)
- [review-code.prompt.md](review-code.prompt.md)
- [review-architecture.prompt.md](review-architecture.prompt.md)
- [review-performance.prompt.md](review-performance.prompt.md)
- [review-security.prompt.md](review-security.prompt.md)

## Testing

- [write-tests.prompt.md](write-tests.prompt.md)
- [write-e2e-tests.prompt.md](write-e2e-tests.prompt.md)
````

## File: modules/notebook/repositories.md
````markdown
# notebook — Repositories

> **Canonical bounded context:** `notebook`
> **模組路徑:** `modules/notebook/`
> **Domain Type:** Supporting Subdomain

本文件整理 `notebook` 的 repository ports 與 infrastructure 實作，作為 `domain/` 與 `infrastructure/` 邊界對照表。

## Domain Repository Ports

- `domain/repositories/NotebookRepository.ts`

> `RagGenerationRepository` 與 `RagRetrievalRepository` 已移至 `modules/search`，
> `domain/repositories/RagGenerationRepository.ts` 與 `domain/repositories/RagRetrievalRepository.ts`
> 為 `@deprecated` re-export stub，不屬於 notebook domain ports。

## Infrastructure Implementations

- `infrastructure/genkit/GenkitNotebookRepository.ts`
- `infrastructure/genkit/client.ts`
- `infrastructure/genkit/index.ts`
- `infrastructure/index.ts`

> `infrastructure/firebase/FirebaseRagRetrievalRepository.ts` 屬於 `search` BC，
> 雖然目前物理上仍在 notebook infrastructure 目錄下，應視為過渡性存放。

## 設計規則

- Repository 介面定義在 `domain/repositories/`
- Repository 實作放在 `infrastructure/`
- `application/` 只能依賴 repository ports，不直接依賴 infrastructure 實作

## 模組內對應文件

- `../../../modules/notebook/repositories.md`
- `../../../docs/ddd/notebook/aggregates.md`
````

## File: AGENTS.md
````markdown
# Agent Guide — Xuanwu App

This file is the entry point for AI agents (GitHub Copilot, Claude, OpenCode, etc.) working in this repository.

## Development Status Workflow

Use the following status flow for issues, tasks, and features:

| Order | Status | Emoji | Description |
|------|--------|-------|-------------|
| 0 | Idea | 💡 | Initial idea or feature request |
| 1 | Backlog | 📥 | Stored in backlog, not scheduled |
| 2 | Planned | 📅 | Planned and scheduled |
| 3 | Designing | 🎨 | Architecture / UI / schema design |
| 4 | Ready | 🟢 | Ready for development |
| 5 | Developing | 🚧 | Active development |
| 6 | Midway | 🏗️ | Development partially completed |
| 7 | Testing | 🧪 | Testing / QA |
| 8 | Fixing | 🔧 | Bug fixing |
| 9 | Review | 🔍 | Code review / acceptance review |
|10 | Staging | 🚀 | Staging / pre-production |
|11 | Done | ✅ | Development completed |
|12 | Delivered | 📦 | Delivered / deployed to production |
|13 | Archived | 🗄️ | Archived / closed / inactive |

## Quick Start

1. Read [`.github/agents/README.md`](.github/agents/README.md) — rules index and overview
2. Read [`.github/agents/knowledge-base.md`](.github/agents/knowledge-base.md) — domain knowledge and module inventory
3. Read [`.github/agents/commands.md`](.github/agents/commands.md) — build, lint, deploy commands
4. Read [`.github/README.md`](.github/README.md) — customization index for agents, prompts, skills, and instructions

## Key Rules

### Architecture

- Follow **Module-Driven Domain Design (MDDD)**: code belongs in `modules/<context>/`.
- Treat every `modules/<module-name>/` as an isolated bounded context.
- Cross-module interaction must go through `modules/<module-name>/api/` only.
- Dependency direction: `interfaces/ → application/ → domain/ ← infrastructure/`.
- `domain/` must stay framework-free (no Firebase SDK, React, HTTP clients).
- Keep boundaries explicit: business logic stays in `application/` + `domain/`, while UI/UX concerns stay in `interfaces/` and `app/` composition.
- Import shared code through `@alias` package aliases, never with relative paths across modules.

### Import Aliases

```ts
import type { CommandResult } from "@shared-types";
import { cn } from "@shared-utils";
import { Button } from "@ui-shadcn/ui/button";
import { getFirebaseFirestore } from "@integration-firebase";
```

Never use legacy paths: `@/shared/*`, `@/libs/*`, `@/infrastructure/*`, `@/ui/*`.

### Runtime Boundary

- **Next.js** owns browser-facing APIs, upload UX, auth/session, Server Actions, streaming AI responses.
- **`py_fn/`** owns ingestion, parsing, chunking, embedding, and background jobs.
- Do not add chat streaming or auth logic to `py_fn/`.

## Validation Commands

```bash
npm install          # Install dependencies
npm run lint         # ESLint (0 errors expected; pre-existing warnings are OK)
npm run build        # Next.js production build + TypeScript type-check

# Python worker
cd py_fn && python -m compileall -q .
cd py_fn && python -m pytest tests/ -v
```

## Common Patterns

### Server Action (write-side)

```ts
"use server";
export async function myAction(input: MyInput): Promise<CommandResult> {
  // validate → use case → return CommandResult
}
```

### Use Case

```ts
// modules/<context>/application/use-cases/MyUseCase.ts
export class MyUseCase {
  constructor(private readonly repo: MyRepository) {}
  async execute(input: MyInput): Promise<CommandResult> { ... }
}
```

### Repository

- Interface in `domain/repositories/`.
- Firebase implementation in `infrastructure/firebase/`.

## IDDD 領域驅動設計規範 (Implementing Domain-Driven Design)

本專案已導入 Vaughn Vernon《Implementing Domain-Driven Design》(IDDD) 規範，以確保 Copilot 生成的程式碼符合通用語言、限界上下文與事件驅動架構原則。

### DDD 審查 Agent

- **[Domain Architect](.github/agents/domain-architect.agent.md)** — IDDD 領域架構審查，負責確認聚合根設計、限界上下文邊界、通用語言一致性與領域事件規範。

### DDD 指令文件 (Instructions)

| 文件 | 用途 |
|------|------|
| [ubiquitous-language](.github/instructions/ubiquitous-language.instructions.md) | 強制查閱 `terminology-glossary.md`，規範通用語言命名 |
| [bounded-context-rules](.github/instructions/bounded-context-rules.instructions.md) | 限界上下文邊界與模組依賴方向規範 |
| [domain-modeling](.github/instructions/domain-modeling.instructions.md) | 聚合根、實體與值對象的 Immutable 設計與 Zod 驗證規範 |
| [event-driven-state](.github/instructions/event-driven-state.instructions.md) | XState 與領域事件互動、SuperJSON 序列化規範 |

### DDD Prompt 模板

- [`generate-aggregate`](.github/prompts/generate-aggregate.prompt.md) — 生成符合 IDDD 規範的 TypeScript 聚合根骨架。
- [`generate-domain-event`](.github/prompts/generate-domain-event.prompt.md) — 生成領域事件定義（Zod Schema + 型別推導）。

### DDD 術語表

DDD 相關術語定義（聚合根、限界上下文、通用語言等）請查閱 [`.github/terminology-glossary.md`](.github/terminology-glossary.md) 的「DDD 戰略設計術語」與「DDD 戰術設計術語」章節。

## Spec-Driven Development

When asked to use spec-driven development, follow [`SPEC-WORKFLOW.md`](SPEC-WORKFLOW.md).

## Copilot Delivery Workflow

This repository also maintains a formal Copilot delivery chain for non-trivial work:

1. Planner
2. Implementer
3. Reviewer
4. QA

Use `.github/copilot-instructions.md` as the Copilot-specific baseline and see [`docs/handoffs.md`](docs/handoffs.md) for the formal stage transitions.

## Permissions

For the RBAC/role model used in this project, see [`PERMISSIONS.md`](PERMISSIONS.md).

## Full Rules

See [`.github/agents/README.md`](.github/agents/README.md), [`.github/instructions/`](.github/instructions/), and [`.github/prompts/`](.github/prompts/) for the active rule and workflow set.
````