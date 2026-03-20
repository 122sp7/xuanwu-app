---
name: Xuanwu State Machine Rules
description: Apply these rules when editing state machines, workflows, or XState-based coordination.
applyTo: "**/*machine*.ts,**/*machine*.tsx,**/*xstate*.ts,**/*xstate*.tsx,libs/xstate/**/*.ts,modules/**/*.ts,modules/**/*.tsx"
---
# State machine rules

- Model business workflow transitions explicitly; avoid hiding state transitions inside scattered boolean flags.
- Keep machine context serializable and domain-meaningful.
- Side effects belong in invoked services, actions, or the application layer, not directly in UI event handlers.
- Prefer guards and named transitions over ad hoc conditional branches that are hard to audit.
- When a state machine spans module boundaries, document the owning module and the external events it accepts.
