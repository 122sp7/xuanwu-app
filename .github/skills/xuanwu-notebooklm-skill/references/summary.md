This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.

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
- Only files matching these patterns are included: modules/notebooklm/**
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

## Statistics

154 files | 8,075 lines

| Language | Files | Lines |
|----------|------:|------:|
| TypeScript | 129 | 5,918 |
| TypeScript (TSX) | 10 | 1,820 |
| No Extension | 8 | 8 |
| Markdown | 7 | 329 |

**Largest files:**
- `modules/notebooklm/interfaces/conversation/components/ConversationPanel.tsx` (241 lines)
- `modules/notebooklm/interfaces/source/components/LibrariesPanel.tsx` (239 lines)
- `modules/notebooklm/interfaces/source/components/LibraryTablePanel.tsx` (231 lines)
- `modules/notebooklm/interfaces/source/components/WorkspaceFilesTab.tsx` (227 lines)
- `modules/notebooklm/infrastructure/synthesis/firebase/FirebaseKnowledgeContentAdapter.ts` (212 lines)
- `modules/notebooklm/interfaces/synthesis/components/RagQueryPanel.tsx` (199 lines)
- `modules/notebooklm/subdomains/source/application/use-cases/wiki-library.use-cases.ts` (191 lines)
- `modules/notebooklm/infrastructure/source/firebase/FirebaseWikiLibraryAdapter.ts` (190 lines)
- `modules/notebooklm/interfaces/source/components/SourceDocumentsPanel.tsx` (185 lines)
- `modules/notebooklm/subdomains/source/application/use-cases/process-source-document-workflow.use-case.ts` (167 lines)