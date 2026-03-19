# Copilot Hooks

This directory is the canonical workspace location for VS Code Copilot hook JSON files.

- Path convention: `.github/hooks/*.json`
- Official docs: `https://code.visualstudio.com/docs/copilot/customization/hooks`
- Current policy: keep hook count low and only enable deterministic commands with clear ownership, rollback behavior, and security review

Current active files:

- `guardrails.json` uses `PreToolUse` to detect obviously destructive terminal commands and force explicit human review before execution.

Hooks are currently a Preview feature in VS Code Copilot. Keep hook commands minimal, deterministic, and reviewable.

Why only one hook right now:

- destructive terminal commands are the highest-value failure mode to intercept automatically
- blanket auto-format or auto-lint hooks are too noisy until file-level targeting and team ownership are tighter
- session bootstrap hooks add little value because this repository already maintains strong always-on instructions and scoped instructions

