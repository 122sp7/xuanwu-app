---
description: 'Guidelines for creating custom agent files for GitHub Copilot'
applyTo: '.github/agents/*.agent.md'
---

# Custom Agent File Guidelines

Instructions for creating effective and maintainable custom agent files that provide specialized expertise for specific development tasks in GitHub Copilot.

## Project Context

- Target audience: Developers creating custom agents for GitHub Copilot
- File format: Markdown with YAML frontmatter
- File naming convention: lowercase with hyphens (e.g., `test-specialist.agent.md`)
- Location: `.github/agents/` directory (repository-level) or `agents/` directory (organization/enterprise-level)
- Purpose: Define specialized agents with tailored expertise, tools, and instructions for specific tasks
- Official documentation: https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents

## Required Frontmatter

Every agent file must include YAML frontmatter with the following fields:

```yaml
---
description: 'Brief description of the agent purpose and capabilities'
name: 'Agent Display Name'
tools: ['read', 'edit', 'search']
model: 'GPT-5.1-Codex-Max.5'
target: 'vscode'
---
```

### Core Frontmatter Properties

#### **description** (REQUIRED)
- Single-quoted string, clearly stating the agent's purpose and domain expertise
- Should be concise (50-150 characters) and actionable
- Example: `'Focuses on test coverage, quality, and testing best practices'`

#### **name** (OPTIONAL)
- Display name for the agent in the UI
- If omitted, defaults to filename (without `.md` or `.agent.md`)
- Use title case and be descriptive
- Example: `'Testing Specialist'`

#### **tools** (OPTIONAL)
- List of tool names or aliases the agent can use
- Supports comma-separated string or YAML array format
- If omitted, agent has access to all available tools
- See "Tool Configuration" section below for details

#### **model** (STRONGLY RECOMMENDED)
- Specifies which AI model the agent should use
- Supported in VS Code, JetBrains IDEs, Eclipse, and Xcode
- Example: `'GPT-5.1-Codex-Max.5'`, `'gpt-4'`, `'gpt-4o'`
- Choose based on agent complexity and required capabilities

#### **target** (OPTIONAL)
- Specifies target environment: `'vscode'` or `'github-copilot'`
- If omitted, agent is available in both environments
- Use when agent has environment-specific features

#### **user-invocable** (OPTIONAL)
- Boolean controlling whether the agent appears in the agents dropdown in chat
- Default: `true` if omitted
- Set to `false` to create agents that are only accessible as subagents or programmatically

#### **disable-model-invocation** (OPTIONAL)
- Boolean controlling whether the agent can be invoked as a subagent by other agents
- Default: `false` if omitted
- Set to `true` to prevent subagent invocation while keeping it available in the picker

#### **metadata** (OPTIONAL, GitHub.com only)
- Object with name-value pairs for agent annotation
- Example: `metadata: { category: 'testing', version: '1.0' }`
- Not supported in VS Code

#### **mcp-servers** (OPTIONAL, Organization/Enterprise only)
- Configure MCP servers available only to this agent
- Only supported for organization/enterprise level agents
- See "MCP Server Configuration" section below

#### **handoffs** (OPTIONAL, VS Code only)
- Enable guided sequential workflows that transition between agents with suggested next steps
- List of handoff configurations, each specifying a target agent and optional prompt
- After a chat response completes, handoff buttons appear allowing users to move to the next agent
- Only supported in VS Code (version 1.106+)
- See "Handoffs Configuration" section below for details

## Handoffs Configuration

Handoffs enable you to create guided sequential workflows that transition seamlessly between custom agents. This is useful for orchestrating multi-step development workflows where users can review and approve each step before moving to the next one.

### Common Handoff Patterns

- **Planning → Implementation**: Generate a plan in a planning agent, then hand off to an implementation agent to start coding
- **Implementation → Review**: Complete implementation, then switch to a code review agent to check for quality and security issues
- **Write Failing Tests → Write Passing Tests**: Generate failing tests, then hand off to implement the code that makes those tests pass
- **Research → Documentation**: Research a topic, then transition to a documentation agent to write guides

### Handoff Frontmatter Structure

Define handoffs in the agent file's YAML frontmatter using the `handoffs` field:

```yaml
---
description: 'Brief description of the agent'
name: 'Agent Name'
tools: ['search', 'read']
handoffs:
  - label: Start Implementation
    agent: implementation
    prompt: 'Now implement the plan outlined above.'
    send: false
  - label: Code Review
    agent: code-review
    prompt: 'Please review the implementation for quality and security issues.'
    send: false
---
```

### Handoff Properties

Each handoff in the list must include the following properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `label` | string | Yes | The display text shown on the handoff button in the chat interface |
| `agent` | string | Yes | The target agent identifier to switch to (name or filename without `.agent.md`) |
| `prompt` | string | No | The prompt text to pre-fill in the target agent's chat input |
| `send` | boolean | No | If `true`, automatically submits the prompt to the target agent (default: `false`) |

### Handoff Behavior

- **Button Display**: Handoff buttons appear as interactive suggestions after a chat response completes
- **Context Preservation**: When users select a handoff button, they switch to the target agent with conversation context maintained
- **Pre-filled Prompt**: If a `prompt` is specified, it appears pre-filled in the target agent's chat input
- **Manual vs Auto**: When `send: false`, users must review and manually send the pre-filled prompt; when `send: true`, the prompt is automatically submitted

### Handoff Configuration Guidelines

#### When to Use Handoffs

- **Multi-step workflows**: Breaking down complex tasks across specialized agents
- **Quality gates**: Ensuring review steps between implementation phases
- **Guided processes**: Directing users through a structured development process
- **Skill transitions**: Moving from planning/design to implementation/testing specialists

#### Best Practices

- **Clear Labels**: Use action-oriented labels that clearly indicate the next step
  - ✅ Good: "Start Implementation", "Review for Security", "Write Tests"
  - ❌ Avoid: "Next", "Go to agent", "Do something"

- **Relevant Prompts**: Provide context-aware prompts that reference the completed work
  - ✅ Good: `'Now implement the plan outlined above.'`
  - ❌ Avoid: Generic prompts without context

- **Selective Use**: Don't create handoffs to every possible agent; focus on logical workflow transitions
  - Limit to 2-3 most relevant next steps per agent
  - Only add handoffs for agents that naturally follow in the workflow

- **Agent Dependencies**: Ensure target agents exist before creating handoffs
  - Handoffs to non-existent agents will be silently ignored
  - Test handoffs to verify they work as expected

- **Prompt Content**: Keep prompts concise and actionable
  - Refer to work from the current agent without duplicating content
  - Provide any necessary context the target agent might need

### Version Compatibility

- **VS Code 1.106+**: Full handoffs support
- **GitHub.com**: Handoffs not supported; agent flows use different mechanisms

## Tool Configuration

### Tool Specification Strategies

**Enable all tools** (default):
```yaml
# Omit tools property entirely, or use:
tools: ['*']
```

**Enable specific tools**:
```yaml
tools: ['read', 'edit', 'search', 'execute']
```

**Enable MCP server tools**:
```yaml
tools: ['read', 'edit', 'github/*', 'playwright/navigate']
```

**Disable all tools**:
```yaml
tools: []
```

### Standard Tool Aliases

All aliases are case-insensitive:

| Alias | Alternative Names | Category | Description |
|-------|------------------|----------|-------------|
| `execute` | shell, Bash, powershell | Shell execution | Execute commands in appropriate shell |
| `read` | Read, NotebookRead, view | File reading | Read file contents |
| `edit` | Edit, MultiEdit, Write, NotebookEdit | File editing | Edit and modify files |
| `search` | Grep, Glob, search | Code search | Search for files or text in files |
| `agent` | custom-agent, Task | Agent invocation | Invoke other custom agents |
| `web` | WebSearch, WebFetch | Web access | Fetch web content and search |
| `todo` | TodoWrite | Task management | Create and manage task lists (VS Code only) |

### Built-in MCP Server Tools

**GitHub MCP Server**:
```yaml
tools: ['github/*']  # All GitHub tools
tools: ['github/get_file_contents', 'github/search_repositories']  # Specific tools
```
- All read-only tools available by default
- Token scoped to source repository

**Playwright MCP Server**:
```yaml
tools: ['playwright/*']  # All Playwright tools
tools: ['playwright/navigate', 'playwright/screenshot']  # Specific tools
```
- Configured to access localhost only
- Useful for browser automation and testing

### Tool Selection Best Practices

- **Principle of Least Privilege**: Only enable tools necessary for the agent's purpose
- **Security**: Limit `execute` access unless explicitly required
- **Focus**: Fewer tools = clearer agent purpose and better performance
- **Documentation**: Comment why specific tools are required for complex configurations

## Sub-Agent Invocation (Agent Orchestration)

Agents can invoke other agents using the **agent invocation tool** (the `agent` tool) to orchestrate multi-step workflows.

The recommended approach is **prompt-based orchestration**:
- The orchestrator defines a step-by-step workflow in natural language.
- Each step is delegated to a specialized agent.
- The orchestrator passes only the essential context (e.g., base path, identifiers) and requires each sub-agent to read its own `.agent.md` spec for tools/constraints.

### How It Works

1) Enable agent invocation by including `agent` in the orchestrator's tools list:

```yaml
tools: ['read', 'edit', 'search', 'agent']
```

2) For each step, invoke a sub-agent by providing:
- **Agent name** (the identifier users select/invoke)
- **Agent spec path** (the `.agent.md` file to read and follow)
- **Minimal shared context** (e.g., `basePath`, `projectName`, `logFile`)

### Prompt Pattern (Recommended)

Use a consistent “wrapper prompt” for every step so sub-agents behave predictably:

```text
This phase must be performed as the agent "<AGENT_NAME>" defined in "<AGENT_SPEC_PATH>".

IMPORTANT:
- Read and apply the entire .agent.md spec (tools, constraints, quality standards).
- Work on "<WORK_UNIT_NAME>" with base path: "<BASE_PATH>".
- Perform the necessary reads/writes under this base path.
- Return a clear summary (actions taken + files produced/modified + issues).
```

### Orchestrator Guidelines

- Sub-agent registry: map each step to `agentName` + `agentSpecPath`.
- Step ordering: explicit sequence (Step 1 → Step N) with optional trigger conditions.
- Log to a single file updated after each step.
- No orchestration code (JS/Python); use deterministic tool-driven coordination.

### ⚠️ Tool Ceiling

Sub-agents cannot access tools not in the orchestrator's `tools` list — include every tool sub-agents need.

```yaml
tools: ['read', 'edit', 'search', 'execute', 'agent']
```

### ⚠️ Not for Bulk Processing

Avoid multi-step orchestration for hundreds of files, large datasets, or >10 sequential steps — implement logic in a single agent instead.

## Agent Prompt Structure

The markdown content below the frontmatter defines the agent's behavior, expertise, and instructions. Well-structured prompts typically include:

1. **Agent Identity and Role**: Who the agent is and its primary role
2. **Core Responsibilities**: What specific tasks the agent performs
3. **Approach and Methodology**: How the agent works to accomplish tasks
4. **Guidelines and Constraints**: What to do/avoid and quality standards
5. **Output Expectations**: Expected output format and quality

### Prompt Writing Best Practices

- **Be Specific and Direct**: Use imperative mood ("Analyze", "Generate"); avoid vague terms
- **Define Boundaries**: Clearly state scope limits and constraints
- **Include Context**: Explain domain expertise and reference relevant frameworks
- **Focus on Behavior**: Describe how the agent should think and work
- **Use Structured Format**: Headers, bullets, and lists make prompts scannable

## File Organization and Naming

### Repository-Level Agents
- Location: `.github/agents/`
- Scope: Available only in the specific repository
- Access: Uses repository-configured MCP servers

### Organization/Enterprise-Level Agents
- Location: `.github-private/agents/` (then move to `agents/` root)
- Scope: Available across all repositories in org/enterprise
- Access: Can configure dedicated MCP servers

### Naming Conventions
- Use lowercase with hyphens: `test-specialist.agent.md`
- Name should reflect agent purpose
- Filename becomes default agent name (if `name` not specified)
- Allowed characters: `.`, `-`, `_`, `a-z`, `A-Z`, `0-9`

## Agent Creation Checklist

### Frontmatter
- [ ] `description` field present and descriptive (50-150 chars)
- [ ] `description` wrapped in single quotes
- [ ] `name` specified (optional but recommended)
- [ ] `tools` configured appropriately (or intentionally omitted)
- [ ] `model` specified for optimal performance
- [ ] `target` set if environment-specific
- [ ] Use `user-invocable: false` to hide from picker while allowing subagent invocation
- [ ] Use `disable-model-invocation: true` to prevent subagent invocation while keeping picker visibility


### Prompt Content
- [ ] Clear agent identity and role defined
- [ ] Core responsibilities listed explicitly
- [ ] Approach and methodology explained
- [ ] Guidelines and constraints specified
- [ ] Output expectations documented
- [ ] Examples provided where helpful
- [ ] Instructions are specific and actionable
- [ ] Scope and boundaries clearly defined
- [ ] Total content under 30,000 characters

### File Structure
- [ ] Filename follows lowercase-with-hyphens convention
- [ ] File placed in correct directory (`.github/agents/` or `agents/`)
- [ ] Filename uses only allowed characters
- [ ] File extension is `.agent.md`

### Quality Assurance
- [ ] Agent purpose is unique and not duplicative
- [ ] Tools are minimal and necessary
- [ ] Instructions are clear and unambiguous
- [ ] Agent has been tested with representative tasks
- [ ] Documentation references are current
- [ ] Security considerations addressed (if applicable)

## Additional Resources

### Official Documentation
- [Creating Custom Agents](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents)
- [Custom Agents Configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration)
- [Custom Agents in VS Code](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [MCP Integration](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/extend-coding-agent-with-mcp)

### Community Resources
- [Awesome Copilot Agents Collection](https://github.com/github/awesome-copilot/tree/main/agents)
- [Customization Library Examples](https://docs.github.com/en/copilot/tutorials/customization-library/custom-agents)
- [Your First Custom Agent Tutorial](https://docs.github.com/en/copilot/tutorials/customization-library/custom-agents/your-first-custom-agent)

### Related Files
- [Prompt Files Guidelines](./prompt.instructions.md) - For creating prompt files
- [Instructions Guidelines](./instructions.instructions.md) - For creating instruction files
