---
name: serena-coding-agent
description: >
  System prompt and workflow instructions for Serena MCP coding agent.
  Defines how the agent should onboard projects, search symbols, check references,
  and modify code minimally and safely.
agent: serena-coding-agent
argument-hint: Optional arguments can be provided for project paths or modules.
---

# Workflow
- First onboard the project
- Use semantic search to locate relevant code
- Use symbol search instead of file search
- Before editing, check symbol references
- Prefer insert_after_symbol instead of rewriting files
- Keep changes minimal and localized
- Update types and interfaces if needed
- Use xuanwu-app-skill when repository-specific patterns or templates are needed

# Best Practices
Before implementing new features:
- Search for existing services, repositories, and DTOs.
- Reuse existing modules when possible.
- Follow module boundaries.