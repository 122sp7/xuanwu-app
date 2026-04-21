This file is a merged representation of a subset of the codebase, containing specifically included files and files not matching ignore patterns, combined into a single document by Repomix.
The content has been processed where content has been formatted for parsing in markdown style, content has been compressed (code blocks are separated by ⋮---- delimiter).

# Summary

## Purpose

This is a reference codebase organized into multiple files for AI consumption.
It is designed to be easily searchable using grep and other text-based tools.

## File Structure

This skill contains the following reference files:

| File | Contents |
|------|----------|
| `project-structure.md` | Directory tree with line counts per file |
| `files.md` | All file contents (search with `## File: <path>`) |
| `tech-stack.md` | Languages, frameworks, and dependencies |
| `summary.md` | This file - purpose and format explanation |

## Usage Guidelines

- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes

- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: .github/copilot-instructions.md, docs/**, src/app/**, src/modules/ai/**, src/modules/analytics/**, src/modules/billing/**, src/modules/notebooklm/**, src/modules/notion/**, src/modules/platform/**, src/modules/shared/**, src/modules/template/**, src/modules/workspace/**, src/modules/iam/**, src/packages/**, fn/**, AGENTS.md, CLAUDE.md, apphosting.yaml, components.json, eslint.config.mjs, firebase.apphosting.json, firebase.json, firestore.indexes.json, llms.txt, next.config.ts, package.json, postcss.config.mjs, tailwind.config.ts, tsconfig.json, firestore.rules, storage.rules
- Files matching these patterns are excluded: fn/tests/**, **/*.test.ts, *.md, .next/**, .turbo/**, .vercel/**, .firebase/**, .output/**, .parcel-cache/**, .cursor/**, .vscode/**, .serena/**, .claude/**, .opencode/**, .idea/**, .history/**, .cache/**, .temp/**, .tmp/**, tmp/**, temp/**, logs/**, firebase-debug.log, repomix-output.*, .env*, *.pem, *.key, *.crt, skills-lock.json, docs/architecture/**, diagrams/**, *.png, *.jpg, *.jpeg, *.gif, *.webp, *.mp4, *.zip, *.tar, *.gz, *.sqlite, *.db, .github/skills/**/references/**
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Content has been formatted for parsing in markdown style
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

## Statistics

1182 files | 28,252 lines

| Language | Files | Lines |
|----------|------:|------:|
| TypeScript | 900 | 13,384 |
| Markdown | 107 | 8,958 |
| Python | 87 | 2,266 |
| TypeScript (TSX) | 53 | 2,526 |
| No Extension | 18 | 18 |
| JSON | 6 | 727 |
| Text | 3 | 108 |
| JavaScript (ESM) | 2 | 10 |
| RULES | 2 | 60 |
| YAML | 1 | 64 |
| Other | 3 | 131 |

**Largest files:**
- `firestore.indexes.json` (437 lines)
- `docs/structure/system/hard-rules-consolidated.md` (415 lines)
- `docs/examples/modules/feature/py-fn-ts-capability-bridge.md` (377 lines)
- `docs/structure/domain/subdomains.md` (273 lines)
- `docs/tooling/genkit/genkit-flow-standards.md` (229 lines)
- `docs/structure/domain/ddd-strategic-design.md` (221 lines)
- `src/modules/workspace/subdomains/task-formation/README.md` (220 lines)
- `docs/examples/modules/feature/workspace-nav-notion-notebooklm-implementation-guide.md` (215 lines)
- `docs/structure/domain/bounded-context-subdomain-template.md` (203 lines)
- `src/modules/platform/adapters/inbound/react/platform-ui-stubs.tsx` (203 lines)