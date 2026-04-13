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
- Only files matching these patterns are included: app/**, modules/**, packages/**
- Files matching these patterns are excluded: node_modules/**, .next/**, out/**, build/**, dist/**, coverage/**, .turbo/**, .vercel/**, .firebase/**, .output/**, .parcel-cache/**, .cursor/**, .vscode/**, .serena/**, .claude/**, .opencode/**, .idea/**, .history/**, .cache/**, .temp/**, .tmp/**, tmp/**, temp/**, *.log, logs/**, firebase-debug.log, .env*, *.pem, *.key, *.crt, .DS_Store, Thumbs.db, *.lock, package-lock.json, pnpm-lock.yaml, yarn.lock, skills-lock.json, *.tsbuildinfo, .eslintcache, .stylelintcache, .git/**, docs/architecture/**, diagrams/**, *.png, *.jpg, *.jpeg, *.gif, *.webp, *.mp4, *.zip, *.tar, *.gz, *.sqlite, *.db, **/.gitkeep, *.test.ts, *.test.tsx, *.spec.ts, *.spec.tsx, **/__tests__/**, **/__mocks__/**, packages/ui-shadcn/ui/**, packages/lib-date-fns/**, packages/lib-dragdrop/**, packages/lib-react-markdown/**, packages/lib-remark-gfm/**, packages/lib-superjson/**, packages/lib-tanstack/**, packages/lib-uuid/**, packages/lib-xstate/**, packages/lib-zod/**, packages/lib-zustand/**, packages/lib-vis/**, packages/ui-vis/**
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Content has been formatted for parsing in markdown style
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

## Statistics

1334 files | 29,847 lines

| Language | Files | Lines |
|----------|------:|------:|
| TypeScript | 1125 | 23,842 |
| TypeScript (TSX) | 134 | 3,788 |
| Markdown | 74 | 2,170 |
| CSS | 1 | 47 |

**Largest files:**
- `modules/platform/api/contracts.ts` (219 lines)
- `modules/platform/domain/ports/output/index.ts` (204 lines)
- `modules/notion/AGENT.md` (156 lines)
- `modules/notion/subdomains/knowledge/domain/events/KnowledgePageEvents.ts` (150 lines)
- `modules/platform/subdomains/organization/domain/entities/Organization.ts` (132 lines)
- `modules/notion/README.md` (128 lines)
- `packages/shared-events/index.ts` (123 lines)
- `modules/workspace/domain/aggregates/Workspace.ts` (115 lines)
- `modules/notebooklm/AGENT.md` (115 lines)
- `modules/platform/application/dtos/index.ts` (113 lines)