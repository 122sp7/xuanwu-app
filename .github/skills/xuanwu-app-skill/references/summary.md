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
- Only files matching these patterns are included: .github/copilot-instructions.md, .github/agents/**, .github/instructions/**/*.md, .github/prompts/**, docs/**, app/**, modules/**, packages/**, py_fn/**, AGENTS.md, CLAUDE.md, apphosting.yaml, components.json, eslint.config.mjs, firebase.apphosting.json, firebase.json, firestore.indexes.json, firestore.rules, llms.txt, next.config.ts, package.json, postcss.config.mjs, storage.rules, tailwind.config.ts, tsconfig.json, vitest.config.ts, repomix*.config.json
- Files matching these patterns are excluded: .next/**, .turbo/**, .vercel/**, .firebase/**, .output/**, .parcel-cache/**, .cursor/**, .vscode/**, .serena/**, .claude/**, .opencode/**, .idea/**, .history/**, .cache/**, .temp/**, .tmp/**, tmp/**, temp/**, logs/**, firebase-debug.log, repomix-output.*, .env*, *.pem, *.key, *.crt, skills-lock.json, docs/architecture/**, diagrams/**, *.png, *.jpg, *.jpeg, *.gif, *.webp, *.mp4, *.zip, *.tar, *.gz, *.sqlite, *.db, .github/skills/**/references/**
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Content has been formatted for parsing in markdown style
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

## Statistics

1660 files | 47,995 lines

| Language | Files | Lines |
|----------|------:|------:|
| TypeScript | 1123 | 23,954 |
| Markdown | 258 | 16,912 |
| TypeScript (TSX) | 171 | 4,459 |
| Python | 61 | 1,404 |
| No Extension | 30 | 35 |
| JSON | 8 | 943 |
| Text | 3 | 107 |
| RULES | 2 | 18 |
| JavaScript (ESM) | 2 | 52 |
| CSS | 1 | 47 |
| Other | 1 | 64 |

**Largest files:**
- `docs/hard-rules-consolidated.md` (455 lines)
- `firestore.indexes.json` (437 lines)
- `AGENTS.md` (305 lines)
- `py_fn/README.md` (265 lines)
- `modules/platform/domain/events/DESIGN.md` (257 lines)
- `modules/platform/api/contracts.ts` (224 lines)
- `.github/prompts/serena-hexagonal-ddd-refactor.prompt.md` (215 lines)
- `.github/prompts/enforce-hexagonal-ddd-convergence.prompt.md` (215 lines)
- `.github/instructions/architecture.instructions.md` (211 lines)
- `docs/bounded-context-subdomain-template.md` (206 lines)