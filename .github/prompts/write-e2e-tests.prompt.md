---
name: write-e2e-tests
description: Design and execute end-to-end tests for user-critical flows with reproducible evidence.
applyTo: '{src/app,src/modules,debug}/**/*.{ts,tsx}'
agent: E2E QA Agent
argument-hint: Provide URL/route, target user flow, and acceptance criteria.
---

# Write E2E Tests

## Scope

- Happy path
- Boundary/negative path
- Error-state handling

Collect evidence for failures and include clear reproduction steps.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-skill
#use skill vscode-testing-debugging-browser
#use skill next-devtools-mcp
