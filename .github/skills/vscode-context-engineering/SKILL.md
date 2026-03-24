---
name: vscode-context-engineering
description: Build high-signal AI workflows for a repository. Use when setting up project context, planning workflows, implementation handoffs, documentation layers, or best-practice Copilot customization strategies in VS Code.
disable-model-invocation: true
---

# VS Code Context Engineering

Use this skill when the goal is to improve AI quality by curating context, separating workflow stages, and reducing ambiguity.

## When to Use This Skill

- Creating a project-wide Copilot setup
- Improving prompt quality and context quality
- Designing planning to implementation handoffs
- Reducing repeated agent mistakes
- Creating reusable AI workflows for teams

## Principles

- Start small and iterate.
- Prefer concise, decision-relevant context.
- Separate planning, implementation, review, and testing.
- Keep context fresh as the codebase evolves.
- Use different customizations for different layers of guidance.

## Workflow

1. Identify what context must always be present.
2. Put stable project truths into always-on instructions.
3. Put planning structure into a Plan workflow or planning agent.
4. Put execution logic into Agent workflows or custom agents.
5. Put repeated multi-step capabilities into skills.
6. Revisit and refine the setup after failures or repeated corrections.

## Anti-patterns

- Context dumping
- Conflicting instructions across files
- Mixing unrelated tasks in one chat
- Using one giant customization for everything
- Skipping validation after AI output

## Output Expectations

When using this skill, return:

1. the context layers to create,
2. what belongs in each layer,
3. how the workflow should hand off between stages,
4. what to review periodically.
