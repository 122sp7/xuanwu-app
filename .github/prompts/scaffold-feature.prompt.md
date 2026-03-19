---
name: scaffold-feature
description: Scaffold a new feature slice that follows Xuanwu module boundaries and current shell conventions.
agent: planner
argument-hint: "[feature name] [target module or route]"
---
Use xuanwu-skill first.

Create a minimal feature scaffold plan for the requested area.

- map the affected route, module, and shared dependencies
- propose the smallest file set to create or change
- keep dependency direction strict: UI -> Application -> Domain <- Infrastructure
- identify required prompts, agents, or skills if this feature deserves reusable tooling
- return file layout, responsibilities, and validation steps before implementation
