# .vscode

VS Code workspace settings for the Xuanwu App monorepo.

## Files

| File | Purpose |
|---|---|
| `extensions.json` | Recommended extensions for this workspace |
| `launch.json` | Debug launch configurations (Next.js, Node.js, Python) |
| `mcp.json` | MCP (Model Context Protocol) server configurations for Copilot agents |
| `tasks.json` | Task definitions (`dev`, `build`, `lint`, `test`, `py:compile`, `py:test`) |

## Recommended Extensions

- `dbaeumer.vscode-eslint` — ESLint integration
- `bradlc.vscode-tailwindcss` — Tailwind CSS IntelliSense
- `ms-vscode.vscode-typescript-next` — TypeScript support
- `github.copilot` + `github.copilot-chat` — AI coding assistant
- `ms-playwright.playwright` — Playwright test runner

## Notes

- Do not commit secrets or personal machine paths into these files.
- MCP server configs in `mcp.json` are workspace-scoped and govern Copilot agent tool availability.
- Task definitions mirror the `package.json` scripts; prefer `npm run <script>` in CI/CD.
