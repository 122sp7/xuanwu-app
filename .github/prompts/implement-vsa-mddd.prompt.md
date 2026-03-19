---
name: implement-vsa-mddd
agent: vsa-mddd-implementer
description: Implement a focused VSA to MDDD migration step with MCP-first execution.
argument-hint: "[approved plan or migration task]"
---
Use **xuanwu-skill** first, then implement the approved migration step.

Requirements:
- use filesystem MCP to understand the project-wide impact before editing
- use repomix MCP for project-wide reference lookups
- use memory MCP for milestone and migration note updates
- use next-devtools MCP when Next.js runtime behavior matters
- use shadcn MCP before introducing UI primitives
- use fetch tools or existing repo docs when linked documents or product specs need to be normalized
- when asked to "continue next phase", execute the next unfinished slice in this order:
  1) identity/account/organization closure
  2) workspace + shell context consistency
  3) remaining unfinished modules by user-facing impact
- exclude VS8 unless the user explicitly asks for VS8
- keep the change minimal, architecture-safe, and validation-backed
- finish with lint/build validation and a screenshot if the UI changed
