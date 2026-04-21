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
- Only files matching these patterns are included: src/modules/notebooklm/**, docs/structure/contexts/notebooklm/**
- Files matching these patterns are excluded: .next/**, .turbo/**, .vercel/**, .firebase/**, .output/**, .parcel-cache/**, .cursor/**, .vscode/**, .serena/**, .claude/**, .opencode/**, .idea/**, .history/**, .cache/**, .temp/**, .tmp/**, tmp/**, temp/**, logs/**, firebase-debug.log, repomix-output.*, .env*, *.pem, *.key, *.crt, skills-lock.json, docs/architecture/**, diagrams/**, *.png, *.jpg, *.jpeg, *.gif, *.webp, *.mp4, *.zip, *.tar, *.gz, *.sqlite, *.db, .github/skills/**/references/**
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Content has been formatted for parsing in markdown style
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

## Statistics

64 files | 1,965 lines

| Language | Files | Lines |
|----------|------:|------:|
| TypeScript | 52 | 1,156 |
| Markdown | 8 | 581 |
| TypeScript (TSX) | 4 | 228 |

**Largest files:**
- `src/modules/notebooklm/adapters/inbound/react/NotebooklmSourcesSection.tsx` (157 lines)
- `src/modules/notebooklm/subdomains/source/adapters/outbound/firestore/FirestoreIngestionSourceRepository.ts` (119 lines)
- `src/modules/notebooklm/adapters/outbound/firebase-composition.ts` (119 lines)
- `src/modules/notebooklm/subdomains/source/domain/entities/IngestionSource.ts` (117 lines)
- `docs/structure/contexts/notebooklm/README.md` (110 lines)
- `src/modules/notebooklm/orchestration/ProcessSourceDocumentWorkflowUseCase.ts` (100 lines)
- `docs/structure/contexts/notebooklm/ubiquitous-language.md` (93 lines)
- `docs/structure/contexts/notebooklm/AGENTS.md` (89 lines)
- `docs/structure/contexts/notebooklm/context-map.md` (77 lines)
- `src/modules/notebooklm/adapters/inbound/server-actions/document-actions.ts` (77 lines)