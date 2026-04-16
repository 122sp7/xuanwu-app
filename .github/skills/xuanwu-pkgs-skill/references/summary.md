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
- Files matching these patterns are excluded: __pycache__, venv, tests, .pytest_cache
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Content has been formatted for parsing in markdown style
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

## Statistics

92 files | 1,734 lines

| Language | Files | Lines |
|----------|------:|------:|
| TypeScript (TSX) | 49 | 780 |
| TypeScript | 43 | 954 |

**Largest files:**
- `packages/shared-events/index.ts` (139 lines)
- `packages/shared-types/index.ts` (107 lines)
- `packages/ui-vis/network.tsx` (105 lines)
- `packages/ui-vis/timeline.tsx` (96 lines)
- `packages/ui-shadcn/hooks/use-toast.ts` (58 lines)
- `packages/ui-shadcn/ui/sidebar.tsx` (56 lines)
- `packages/ui-shadcn/ui/carousel.tsx` (42 lines)
- `packages/integration-firebase/database.ts` (40 lines)
- `packages/lib-zod/index.ts` (35 lines)
- `packages/lib-zustand/index.ts` (35 lines)