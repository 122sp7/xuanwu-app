# tool-runtime subdomain

## Purpose

The tool-runtime subdomain owns the registration and execution of AI tools
within the `ai` bounded context. It provides tool-enabled generation — the
ability to run `generate()` with one or more callable tools available to the
model.

## Responsibility

- define the `ToolRuntimePort` domain contract (framework-free)
- implement `GenkitToolRuntimeAdapter` with a registry of built-in tools
- expose `generateWithTools()` for downstream AI flows that need tool access
- expose `listAvailableTools()` for discovery and validation

## Built-in tools

| Tool name                    | Description                                                        |
| ---------------------------- | ------------------------------------------------------------------ |
| `ai.getCurrentDatetime`      | Returns current ISO 8601 datetime and IANA timezone                |
| `ai.evaluateMathExpression`  | Evaluates a safe arithmetic expression (regex-validated input)     |

## Non-Responsibility

- no flow definitions (`defineFlow`) — tool execution only
- no prompt registry (see `prompt-pipeline`)
- no content distillation (see `content-distillation`)
- no UI composition
- no cross-domain state mutation

## Extending the tool registry

Add a new tool in `infrastructure/genkit/GenkitToolRuntimeAdapter.ts`:

1. Define the tool with `aiClient.defineTool({ name: 'ai.<action>', ... })`
2. Add an entry to `REGISTERED_TOOLS` with `descriptor` + `instance`
3. Update this README's built-in tool table

Tool name convention: `<module>.<action>` in camelCase lower + `.` separator.

## Dependency direction

```
api → application → domain ← infrastructure
```
