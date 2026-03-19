---
name: add-shadcn-component
description: Add or adapt a shadcn component while preserving Xuanwu shell and design consistency.
agent: implementer
argument-hint: "[component name] [where it should be used]"
---
Use xuanwu-app-skill first.

Plan and implement a shadcn-based component addition.

- inspect existing `ui/shadcn` usage first
- prefer extending shared primitives over local one-off copies
- keep accessibility, shell consistency, and mobile behavior intact
- note any styling tokens or i18n strings that must be added
- return the affected files, decisions, and validation steps
