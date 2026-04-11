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
- Only files matching these patterns are included: modules/workspace/**
- Files matching these patterns are excluded: node_modules/**, .next/**, out/**, build/**, dist/**, coverage/**, .turbo/**, .vercel/**, .firebase/**, .output/**, .parcel-cache/**, .cursor/**, .vscode/**, .serena/**, .claude/**, .opencode/**, .idea/**, .history/**, .cache/**, .temp/**, .tmp/**, tmp/**, temp/**, *.log, logs/**, firebase-debug.log, .env*, *.pem, *.key, *.crt, .DS_Store, Thumbs.db, *.lock, package-lock.json, pnpm-lock.yaml, yarn.lock, skills-lock.json, *.tsbuildinfo, .eslintcache, .stylelintcache, .git/**, .github/workflows/**, .github/skills/**, docs/architecture/**, diagrams/**, public/**, .tmp-eslint*.json, *.png, *.jpg, *.jpeg, *.gif, *.webp, *.mp4, *.zip, *.tar, *.gz, *.sqlite, *.db
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

## Statistics

288 files | 16,929 lines

| Language | Files | Lines |
|----------|------:|------:|
| TypeScript | 238 | 10,713 |
| TypeScript (TSX) | 38 | 5,917 |
| Markdown | 12 | 299 |

**Largest files:**
- `modules/workspace/subdomains/workspace-workflow/interfaces/components/WorkspaceFlowTab.tsx` (339 lines)
- `modules/workspace/domain/aggregates/Workspace.ts` (305 lines)
- `modules/workspace/interfaces/web/components/screens/WorkspaceDetailScreen.tsx` (281 lines)
- `modules/workspace/interfaces/web/components/screens/WorkspaceHubScreen.tsx` (279 lines)
- `modules/workspace/interfaces/web/components/dialogs/WorkspaceSettingsInformationFields.tsx` (272 lines)
- `modules/workspace/interfaces/web/components/tabs/WorkspaceOverviewTab.tsx` (267 lines)
- `modules/workspace/application/services/WorkspaceCommandApplicationService.ts` (260 lines)
- `modules/workspace/subdomains/feed/interfaces/components/WorkspaceFeedWorkspaceView.tsx` (255 lines)
- `modules/workspace/interfaces/web/components/dialogs/CustomizeNavigationDialog.tsx` (254 lines)
- `modules/workspace/infrastructure/firebase/FirebaseWorkspaceQueryRepository.ts` (243 lines)