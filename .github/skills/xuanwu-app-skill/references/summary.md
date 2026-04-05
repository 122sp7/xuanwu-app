This file is a merged representation of a subset of the codebase, containing files not matching ignore patterns, combined into a single document by Repomix.
The content has been processed where empty lines have been removed, content has been compressed (code blocks are separated by ⋮---- delimiter).

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
- Files matching these patterns are excluded: node_modules/**, .next/**, out/**, build/**, dist/**, coverage/**, .turbo/**, .vercel/**, .firebase/**, .output/**, .parcel-cache/**, .cursor/**, .vscode/**, .serena/**, .claude/**, .opencode/**, .idea/**, .history/**, .cache/**, .temp/**, .tmp/**, tmp/**, temp/**, *.log, logs/**, firebase-debug.log, .env*, *.pem, *.key, *.crt, .DS_Store, Thumbs.db, *.lock, package-lock.json, pnpm-lock.yaml, yarn.lock, skills-lock.json, *.tsbuildinfo, .eslintcache, .stylelintcache, .git/**, .github/workflows/**, .github/skills/**, docs/architecture/**, diagrams/**, public/**, .tmp-eslint*.json, *.png, *.jpg, *.jpeg, *.gif, *.webp, *.mp4, *.zip, *.tar, *.gz, *.sqlite, *.db, docs/**, .github/agents/**, .github/instructions/**, .github/prompts/**, .github/terminology-glossary.md, .github/README.md, .github/copilot-instructions.md
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Empty lines have been removed from all files
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

## Statistics

847 files | 25,333 lines

| Language | Files | Lines |
|----------|------:|------:|
| TypeScript | 415 | 10,986 |
| Markdown | 172 | 7,481 |
| TypeScript (TSX) | 130 | 3,245 |
| No Extension | 52 | 135 |
| Python | 49 | 1,140 |
| JSON | 10 | 1,098 |
| MERMAID | 10 | 583 |
| RULES | 2 | 18 |
| JavaScript (ESM) | 2 | 38 |
| Text | 2 | 114 |
| Other | 3 | 495 |

**Largest files:**
- `scripts/init-framework.sh` (437 lines)
- `firestore.indexes.json` (415 lines)
- `py_fn/README.md` (265 lines)
- `py_fn/src/infrastructure/external/upstash/clients.py` (172 lines)
- `py_fn/src/interface/handlers/https.py` (163 lines)
- `modules/workspace-flow/interfaces/components/WorkspaceFlowTab.tsx` (153 lines)
- `modules/knowledge-database/domain-events.md` (151 lines)
- `modules/knowledge/domain/events/knowledge.events.ts` (149 lines)
- `modules/workspace-flow/Workspace-Flow-Tree.mermaid` (148 lines)
- `AGENTS.md` (147 lines)