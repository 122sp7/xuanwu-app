# Playwright MCP Testing Skill

## Purpose

This skill enables browser-based test execution for Xuanwu App using the Playwright MCP toolchain combined with Next.js DevTools, shadcn, context7, Serena, and markitdown MCPs.

## When to Use This Skill

Load [SKILL.md](SKILL.md) when:

- Running UI functional tests via simulate click / fill / navigate
- Detecting missing features or anti-intuitive UX gaps
- Validating form flows (create/edit/submit) with evidence
- Taking and documenting screenshots for test reports
- Checking Console errors and API response behaviour
- Testing login, workspace switching, and account-context flows

## Quick Start

```bash
# Ensure dev server is running
npm run dev
```

Then use the [playwright-mcp-test prompt](../../.github/prompts/playwright-mcp-test.prompt.md) or [playwright-mcp-inspect prompt](../../.github/prompts/playwright-mcp-inspect.prompt.md).

## Tools in This Skill

| Tool | Role |
|------|------|
| `mcp_playwright-mc_*` | Primary browser automation |
| `mcp_io_github_ver_browser_eval` | Fallback when playwright-mcp is closed |
| `mcp_io_github_ver_nextjs_*` | Next.js runtime diagnostics |
| `mcp_shadcn_*` | Component lookup |
| `mcp_context7_*` | API documentation verification |
| `mcp_oraios_serena_*` | Source code symbol search |
| `mcp_markitdown_*` | Test evidence to Markdown |
