---
name: write-tests
description: Write deterministic unit/integration tests based on risk and behavior contracts.
applyTo: '{src/modules,packages,py_fn}/**/*.{ts,tsx,py}'
agent: Quality Lead
argument-hint: Provide module scope, behaviors to verify, and known regression risks.
---

# Write Tests

## Requirements

- Cover happy, boundary, and negative cases.
- Keep tests deterministic and isolated.
- Prioritize behavior contracts over implementation details.

Tags: #use skill context7 #use skill serena-mcp #use skill repomix #use skill xuanwu-skill
#use skill vscode-testing-debugging-browser
#use skill vscode-typescript-workbench
