---
name: vscode-tasks-authoring
description: Author and review VS Code tasks.json workflows. Use when creating build, test, watch, shell, process, background, or problem matcher tasks, or when explaining the tasks.json schema and task execution behavior.
disable-model-invocation: true
---

# VS Code Tasks Authoring

Use this skill when the task involves authoring or reviewing tasks.json.

## When to Use This Skill

- Creating build or test tasks
- Creating watch or background tasks
- Explaining shell versus process tasks
- Adding problem matchers
- Grouping default build or test tasks
- Configuring cwd, env, presentation, and run options

## Workflow

1. Determine whether the task is one-shot, background, build, or test.
2. Choose shell only when command-line composition is needed; otherwise prefer process.
3. Set group for build or test integration.
4. Add problemMatcher when task output should surface in Problems.
5. Add background matcher when the task is long-running and needs start or end detection.
6. Tune presentation so output is visible but not noisy.

## Key Schema Areas

- version 2.0.0
- tasks array
- label, type, command, and args
- options.cwd and options.env
- group
- presentation
- problemMatcher
- background matcher
- runOptions

## Guardrails

- Do not use shell by habit if process is enough.
- Do not omit background detection for watch tasks.
- Do not forget problem matchers when the user expects Problems integration.

## Output Expectations

When using this skill, return:

1. the task type,
2. the execution style,
3. the schema fields that matter,
4. the matcher or grouping needed.
