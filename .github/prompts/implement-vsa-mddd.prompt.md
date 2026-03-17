---
name: implement-vsa-mddd
agent: vsa-mddd-implementer
description: Implement a focused VSA to MDDD migration step with MCP-first execution.
argument-hint: "[approved plan or migration task]"
---
Use **xuanwu-skill** first, then implement the approved migration step.

Requirements:
- use filesystem MCP to understand the project-wide impact before editing
- use Serena MCP for symbol-aware edits and memory updates
- use next-devtools MCP when Next.js runtime behavior matters
- use shadcn MCP before introducing UI primitives
- use markitdown MCP when linked documents or product specs need to be normalized
- keep the change minimal, architecture-safe, and validation-backed
- finish with lint/build validation and a screenshot if the UI changed
