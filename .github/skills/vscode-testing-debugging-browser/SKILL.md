---
name: vscode-testing-debugging-browser
description: Use Copilot to test, debug, and validate applications in VS Code. Use when generating tests, fixing failing tests, setting up debugging, using browser agent tools, or creating closed-loop test and fix workflows.
disable-model-invocation: true
---

# VS Code Testing, Debugging, and Browser Workflows

Use this skill for validation-heavy workflows in VS Code.

## When to Use This Skill

- Generating unit, integration, or end-to-end tests
- Fixing failing tests
- Setting up launch.json or debugging flows
- Using copilot-debug
- Testing a web app with browser agent tools
- Verifying UI behavior in the integrated browser

## Workflow

1. Identify the validation target: code, tests, terminal failure, or browser behavior.
2. If tests do not exist, recommend generating tests first.
3. If tests fail, use the failure output as context and fix one issue at a time.
4. If the issue is UI or interaction-based, use browser tools to verify behavior directly.
5. If debugging is needed, set up source maps and launch configuration before deep analysis.
6. Re-run the narrowest useful validation, then broader validation if needed.

## Browser Guidance

- Use browser tools for interaction, screenshots, and functional checks.
- Prefer isolated browser sessions unless the user explicitly shares a page.
- Treat browser validation as a closed-loop build, test, and fix process.

## Guardrails

- Do not claim a fix without rerunning the relevant validation.
- Do not use browser tools when the issue is clearly compile-time only.
- Do not skip sourceMap and outFiles checks for TypeScript debugging.

## Output Expectations

When using this skill, return:

1. the validation method,
2. the narrowest first check,
3. any required debug or browser setup,
4. the rerun strategy after fixes.
