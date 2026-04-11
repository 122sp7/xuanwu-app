This file is a merged representation of a subset of the codebase, containing specifically included files and files not matching ignore patterns, combined into a single document by Repomix.

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
- Only files matching these patterns are included: modules/platform/**
- Files matching these patterns are excluded: node_modules/**, .next/**, out/**, build/**, dist/**, coverage/**, .turbo/**, .vercel/**, .firebase/**, .output/**, .parcel-cache/**, .cursor/**, .vscode/**, .serena/**, .claude/**, .opencode/**, .idea/**, .history/**, .cache/**, .temp/**, .tmp/**, tmp/**, temp/**, *.log, logs/**, firebase-debug.log, .env*, *.pem, *.key, *.crt, .DS_Store, Thumbs.db, *.lock, package-lock.json, pnpm-lock.yaml, yarn.lock, skills-lock.json, *.tsbuildinfo, .eslintcache, .stylelintcache, .git/**, .github/workflows/**, .github/skills/**, docs/architecture/**, diagrams/**, public/**, .tmp-eslint*.json, *.png, *.jpg, *.jpeg, *.gif, *.webp, *.mp4, *.zip, *.tar, *.gz, *.sqlite, *.db
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

## Statistics

537 files | 16,874 lines

| Language | Files | Lines |
|----------|------:|------:|
| TypeScript | 476 | 12,218 |
| Markdown | 33 | 614 |
| TypeScript (TSX) | 27 | 4,041 |
| No Extension | 1 | 1 |

**Largest files:**
- `modules/platform/interfaces/web/components/AppRail.tsx` (358 lines)
- `modules/platform/subdomains/organization/domain/aggregates/Organization.ts` (351 lines)
- `modules/platform/interfaces/web/components/ShellLayout.tsx` (338 lines)
- `modules/platform/subdomains/organization/infrastructure/firebase/FirebaseOrganizationRepository.ts` (293 lines)
- `modules/platform/interfaces/web/components/DashboardSidebar.tsx` (256 lines)
- `modules/platform/interfaces/web/providers/app-provider.tsx` (243 lines)
- `modules/platform/interfaces/web/components/sidebar/DashboardSidebarBody.tsx` (233 lines)
- `modules/platform/subdomains/organization/interfaces/components/MembersPage.tsx` (227 lines)
- `modules/platform/subdomains/account/domain/aggregates/Account.ts` (225 lines)
- `modules/platform/subdomains/organization/interfaces/components/PermissionsPage.tsx` (215 lines)