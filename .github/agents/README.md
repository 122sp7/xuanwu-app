# Xuanwu Agents

This folder contains the active workspace custom agents for VS Code Copilot.

## Official Frontmatter

Context7 confirms these `.agent.md` frontmatter fields are supported by VS Code custom agents:

| Property | Importance | Official meaning | Xuanwu convention |
| --- | --- | --- | --- |
| `name` | Required in practice | Agent display name | Keep unique, stable, and human-readable |
| `description` | Critical | Discovery text and chat placeholder | Use strong trigger phrases so routing works reliably |
| `tools` | Critical | Allowed built-in, MCP, or extension tools | Keep smallest effective tool set; remove duplicates |
| `target` | Important | Target environment: `vscode` or `github-copilot` | Use `vscode` for workspace agents in this repo |
| `handoffs` | Important | Suggested next-agent transitions | Use 2 to 3 clear workflow handoffs per agent |

## Xuanwu Agent Structure

Each agent file should follow this pattern:

1. YAML frontmatter with `name`, `description`, `tools`, `model`, `target`, and `handoffs`
2. A `# Agent Name` heading
3. A `## Target Scope` section for the folders or workspace areas the agent is responsible for
4. Role-specific workflow, guardrails, and output rules

## Target Scope Rule

Official `target` does not mean folder ownership. It only sets the environment target.

In this repository, folder responsibility is documented in each agent body under `## Target Scope`.

## Handoff Rule

- Handoffs should point to the visible target agent name, such as `Quality Lead` or `Server Action Writer`
- Labels should describe the next action, not repeat the target name mechanically
- Prompts should be short and task-forward so the next agent can start immediately

## Source-to-Target Mapping

| Legacy source | Current target agents |
| --- | --- |
| `serena.agent.md` | `serena-strategist.agent.md` |
| `commander.agent.md` | `tool-caller.agent.md`, `support-architect.agent.md` |
| `modules-architect.agent.md` | `mddd-architect.agent.md`, `billing-architect.agent.md` |
| `modules-boundary-steward.agent.md` | `domain-lead.agent.md` |
| `modules-api-surface-steward.agent.md` | `ts-interface-writer.agent.md`, `firestore-schema.agent.md` |
| `app-router.agent.md` | `app-router.agent.md`, `server-action-writer.agent.md` |
| `app-router-composer.agent.md` | `parallel-routes.agent.md`, `frontend-lead.agent.md` |
| `component.agent.md` | `shadcn-composer.agent.md` |
| `rag-vector.agent.md` | `rag-lead.agent.md`, `doc-ingest.agent.md`, `chunk-strategist.agent.md`, `embedding-writer.agent.md`, `genkit-flow.agent.md`, `ai-genkit-lead.agent.md` |
| `e2e-qa.agent.md` | `e2e-qa.agent.md`, `test-scenario-writer.agent.md` |
| `reviewer.agent.md` and `qa.agent.md` | `quality-lead.agent.md`, `lint-rule-enforcer.agent.md` |
| `planner-docs.agent.md` and `md-writer.agent.md` | `kb-architect.agent.md`, `prompt-engineer.agent.md` |
| `repo-architect.agent.md` | `repo-architect.agent.md`, `cicd-deploy.agent.md`, `schema-migration.agent.md` |

## Maintenance Rules

- Keep agent names unique. Duplicate visible names create routing and handoff ambiguity.
- Keep agent bodies concise. Put repository-global policy in `.github/copilot-instructions.md` or scoped `.instructions.md` files.
- Update handoffs when agent responsibilities move.
- Update Serena memory after non-trivial agent-configuration changes.

Tags: #use skill context7 #use skill .serena-mcp #use skill xuanwu-app-skill 
#use skill slavingia-skills-company-values
#use skill slavingia-skills-find-community
#use skill slavingia-skills-first-customers
#use skill slavingia-skills-grow-sustainably
#use skill slavingia-skills-minimalist-review
#use skill slavingia-skills-mvp
#use skill slavingia-skills-pricing
#use skill slavingia-skills-validate-idea
