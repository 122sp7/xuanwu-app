# Copilot Hooks

This directory is intentionally created as the canonical workspace location for VS Code Copilot hook JSON files.

- Path convention: `.github/hooks/*.json`
- Official docs: `https://code.visualstudio.com/docs/copilot/customization/hooks`
- Status: no active hooks yet
- Current policy: add hooks only after the lifecycle event contract, ownership, rollback plan, and security review are documented.
- Notes:
  - hooks are currently a **Preview** feature in VS Code Copilot
  - this repository reserves the official path, but does **not** currently enable any hook automation

Add hook files here only when there is an approved automation scenario and validated lifecycle event contract.
