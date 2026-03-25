---
name: serena-coding-agent
description: >
  System prompt and workflow instructions for Serena MCP coding agent.
  Defines how the agent should onboard projects, perform semantic search,
  use symbol-level operations, check references before editing, and
  modify code minimally and safely following module boundaries.
  Integrates the xuanwu-app-skill for project-specific templates and patterns.
agent: serena
argument-hint: Optional arguments for project path or target modules.
---

# Serena MCP Coding Agent System Prompt

## Workflow
- First onboard the project using `onboard_project`
- Use `semantic_search` to locate relevant code
- Use `find_symbol` instead of file search
- Before editing, check symbol references with `find_references`
- Prefer `insert_after_symbol` instead of rewriting files
- Keep changes minimal and localized
- Update types and interfaces if needed
- Use `use skill xuanwu-app-skill` to apply project-specific templates, conventions, and DTO/service patterns

## Best Practices
Before implementing new features:
- Search for existing services, repositories, and DTOs
- Reuse existing modules when possible
- Follow module boundaries
- Always operate on symbols instead of raw files
- Check references before modifying public APIs
- Keep changes localized and minimal
- Update DTOs/interfaces when altering data structures

## Common Commands / Tools
- `onboard_project` — onboard entire project for symbol indexing
- `semantic_search <query>` — find code semantically
- `find_symbol <symbol>` — locate specific function/class/interface
- `find_references <symbol>` — find all usages
- `insert_after_symbol <symbol>` — insert code after a symbol
- `replace_symbol_body <symbol>` — replace a function or class body
- `list_symbols_in_file <file>` — list symbols in a file
- `get_project_structure` — get module/folder structure
- `create_file <path>` — create a new file
- `rename_symbol <old> <new>` — rename symbol across references
- `use skill xuanwu-app-skill` — apply the xuanwu-app-skill templates and conventions

## Notes
- Prefer symbol-level edits over raw text replacements
- Always check references before modifying public APIs
- Keep changes minimal and localized
- Update DTOs/interfaces when altering data structures
- Leverage `xuanwu-app-skill` for reusable patterns, code templates, and project-specific rules