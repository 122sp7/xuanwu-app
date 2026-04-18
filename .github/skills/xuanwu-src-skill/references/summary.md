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
- Only files matching these patterns are included: src/**/*
- Files matching these patterns are excluded: .next/**, .turbo/**, .vercel/**, .firebase/**, .output/**, .parcel-cache/**, .cursor/**, .vscode/**, .serena/**, .claude/**, .opencode/**, .idea/**, .history/**, .cache/**, .temp/**, .tmp/**, tmp/**, temp/**, logs/**, firebase-debug.log, repomix-output.*, .env*, *.pem, *.key, *.crt, skills-lock.json, *.png, *.jpg, *.jpeg, *.gif, *.webp, *.mp4, *.zip, *.tar, *.gz, *.sqlite, *.db, .github/skills/**/references/**
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Content has been formatted for parsing in markdown style
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

## Statistics

853 files | 13,320 lines

| Language | Files | Lines |
|----------|------:|------:|
| TypeScript | 797 | 10,273 |
| TypeScript (TSX) | 31 | 1,322 |
| Markdown | 24 | 1,678 |
| CSS | 1 | 47 |

**Largest files:**
- `src/modules/template/README.md` (266 lines)
- `src/modules/workspace/adapters/inbound/react/workspace-nav-model.ts` (174 lines)
- `src/modules/iam/subdomains/organization/adapters/outbound/firestore/FirestoreOrganizationRepository.ts` (159 lines)
- `src/modules/workspace/adapters/inbound/react/workspace-shell-interop.tsx` (147 lines)
- `src/modules/iam/adapters/outbound/firebase-composition.ts` (140 lines)
- `src/modules/iam/subdomains/organization/domain/entities/Organization.ts` (111 lines)
- `src/modules/ai/README.md` (111 lines)
- `src/modules/shared/index.ts` (107 lines)
- `src/modules/platform/adapters/inbound/react/AppContext.tsx` (106 lines)
- `src/modules/template/AGENT.md` (99 lines)