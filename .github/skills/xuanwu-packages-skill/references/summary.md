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
- Only files matching these patterns are included: packages/**/*
- Files matching these patterns are excluded: .next/**, .turbo/**, .vercel/**, .cache/**, .temp/**, .tmp/**, tmp/**, temp/**, .cursor/**, .vscode/**, .serena/**, .claude/**, .opencode/**, .idea/**, repomix-output.*, .env*, *.pem, *.key, *.crt, skills-lock.json, *.png, *.jpg, *.jpeg, *.gif, *.webp, *.mp4, *.zip, *.tar, *.gz, *.sqlite, *.db, .github/skills/**/references/**
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Content has been formatted for parsing in markdown style
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

## Statistics

135 files | 4,958 lines

| Language | Files | Lines |
|----------|------:|------:|
| TypeScript (TSX) | 58 | 790 |
| Markdown | 48 | 3,340 |
| TypeScript | 29 | 828 |

**Largest files:**
- `packages/ui-dnd/README.md` (169 lines)
- `packages/infra/table/README.md` (143 lines)
- `packages/infra/virtual/README.md` (137 lines)
- `packages/integration-queue/index.ts` (136 lines)
- `packages/infra/form/README.md` (120 lines)
- `packages/ui-shadcn/README.md` (109 lines)
- `packages/ui-visualization/README.md` (105 lines)
- `packages/ui-visualization/index.tsx` (101 lines)
- `packages/integration-firebase/README.md` (99 lines)
- `packages/infra/state/README.md` (94 lines)