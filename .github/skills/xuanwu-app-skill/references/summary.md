This file is a merged representation of a subset of the codebase, containing files not matching ignore patterns, combined into a single document by Repomix.

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
- Files matching these patterns are excluded: node_modules/**, .next/**, out/**, build/**, dist/**, coverage/**, .turbo/**, .vercel/**, .firebase/**, .output/**, .parcel-cache/**, .cursor/**, .vscode/**, .serena/**, .claude/**, .opencode/**, .idea/**, .history/**, .cache/**, .temp/**, .tmp/**, tmp/**, temp/**, *.log, logs/**, firebase-debug.log, .env*, *.pem, *.key, *.crt, .DS_Store, Thumbs.db, *.lock, package-lock.json, pnpm-lock.yaml, yarn.lock, skills-lock.json, *.tsbuildinfo, .eslintcache, .stylelintcache, .git/**, .github/workflows/**, .github/skills/**, docs/architecture/**, diagrams/**, public/**, .tmp-eslint*.json, *.png, *.jpg, *.jpeg, *.gif, *.webp, *.mp4, *.zip, *.tar, *.gz, *.sqlite, *.db
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

## Statistics

1560 files | 72,987 lines

| Language | Files | Lines |
|----------|------:|------:|
| TypeScript | 1051 | 35,283 |
| Markdown | 201 | 8,738 |
| TypeScript (TSX) | 190 | 23,621 |
| Python | 61 | 3,823 |
| No Extension | 41 | 125 |
| JSON | 7 | 822 |
| Text | 3 | 107 |
| RULES | 2 | 18 |
| JavaScript (ESM) | 2 | 189 |
| CSS | 1 | 197 |
| Other | 1 | 64 |

**Largest files:**
- `packages/ui-shadcn/ui/sidebar.tsx` (702 lines)
- `app/(shell)/dev-tools/page.tsx` (475 lines)
- `firestore.indexes.json` (437 lines)
- `modules/platform/interfaces/web/components/AppRail.tsx` (358 lines)
- `packages/ui-shadcn/ui/chart.tsx` (356 lines)
- `modules/platform/subdomains/organization/domain/aggregates/Organization.ts` (351 lines)
- `modules/notebooklm/subdomains/conversation/interfaces/components/AiChatPage.tsx` (341 lines)
- `modules/workspace/subdomains/workspace-workflow/interfaces/components/WorkspaceFlowTab.tsx` (339 lines)
- `modules/platform/interfaces/web/components/ShellLayout.tsx` (338 lines)
- `modules/workspace/domain/aggregates/Workspace.ts` (305 lines)