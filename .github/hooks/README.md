# Copilot Hooks

This directory is the canonical workspace location for VS Code Copilot hook JSON files.

- Path convention: `.github/hooks/*.json`
- Official docs: `https://code.visualstudio.com/docs/copilot/customization/hooks`
- Status: scaffold files exist, but they currently contain empty hook arrays
- Current policy: replace scaffold files with real commands only after lifecycle event contract, ownership, rollback plan, and security review are documented

Current scaffold files:

- `format.json` reserves the `PostToolUse` event for formatting or post-edit validation.
- `session.json` reserves the `SessionStart` event for session bootstrap or audit context injection.

Hooks are currently a Preview feature in VS Code Copilot. Keep hook commands minimal, deterministic, and reviewable.

