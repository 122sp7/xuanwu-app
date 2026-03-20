---
name: Xuanwu Cloud Functions Rules
description: Apply these rules when editing Firebase or server-side function entrypoints and runtime adapters.
applyTo: "libs/firebase/functions-python/**/*,**/*function*.ts,**/*function*.tsx,infrastructure/firebase/**/*.ts,interfaces/rest/**/*.ts"
---
# Cloud Functions rules

- Keep function entrypoints thin: validate input, delegate to application services, and return transport-safe results.
- Do not place core domain rules inside provider handlers or transport adapters.
- Make retries, idempotency, and timeout behavior explicit for background or event-driven functions.
- Keep secrets and runtime configuration outside source files.
- Document deployment prerequisites whenever a function depends on new infrastructure, env vars, or IAM permissions.
