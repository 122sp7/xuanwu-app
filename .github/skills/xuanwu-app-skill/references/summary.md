This file is a merged representation of a subset of the codebase, containing specifically included files and files not matching ignore patterns, combined into a single document by Repomix.
The content has been processed where content has been formatted for parsing in markdown style.

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
- Files matching these patterns are excluded: node_modules/**, .next/**, out/**, build/**, dist/**, coverage/**, .turbo/**, .vercel/**, .firebase/**, .output/**, .parcel-cache/**, .cursor/**, .vscode/**, .serena/**, .claude/**, .opencode/**, .idea/**, .history/**, .cache/**, .temp/**, .tmp/**, tmp/**, temp/**, *.log, logs/**, firebase-debug.log, .env*, *.pem, *.key, *.crt, .DS_Store, Thumbs.db, *.lock, package-lock.json, pnpm-lock.yaml, yarn.lock, skills-lock.json, *.tsbuildinfo, .eslintcache, .stylelintcache, .git/**, docs/architecture/**, diagrams/**, *.png, *.jpg, *.jpeg, *.gif, *.webp, *.mp4, *.zip, *.tar, *.gz, *.sqlite, *.db
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Content has been formatted for parsing in markdown style
- Files are sorted by Git change count (files with more changes are at the bottom)

## Statistics

1443 files | 68,321 lines

| Language | Files | Lines |
|----------|------:|------:|
| TypeScript | 1151 | 42,247 |
| TypeScript (TSX) | 199 | 23,701 |
| Markdown | 74 | 2,158 |
| No Extension | 18 | 18 |
| CSS | 1 | 197 |

**Largest files:**
- `packages/ui-shadcn/ui/sidebar.tsx` (702 lines)
- `app/(shell)/(account)/[accountId]/dev-tools/page.tsx` (477 lines)
- `packages/ui-shadcn/ui/chart.tsx` (356 lines)
- `modules/platform/subdomains/organization/domain/aggregates/Organization.ts` (351 lines)
- `modules/workspace/subdomains/workspace-workflow/interfaces/components/WorkspaceFlowTab.tsx` (339 lines)
- `app/(shell)/_shell/ShellAppRail.tsx` (335 lines)
- `modules/platform/subdomains/platform-config/application/services/shell-navigation-catalog.ts` (329 lines)
- `modules/platform/api/infrastructure-api.ts` (312 lines)
- `modules/workspace/interfaces/web/components/tabs/WorkspaceOverviewTab.tsx` (310 lines)
- `modules/notion/subdomains/knowledge/domain/aggregates/KnowledgePage.ts` (305 lines)