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
- Only files matching these patterns are included: fn/**/*
- Files matching these patterns are excluded: __pycache__/**, venv/**, tests/**, .pytest_cache/**, .cursor/**, .vscode/**, .serena/**, .cache/**, repomix-output.*, .env*, *.pem, *.key, *.crt, *.png, *.jpg, *.jpeg, *.gif, *.webp, *.mp4, *.zip, *.tar, *.gz, *.sqlite, *.db
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Content has been formatted for parsing in markdown style
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

## Statistics

78 files | 2,128 lines

| Language | Files | Lines |
|----------|------:|------:|
| Python | 74 | 1,753 |
| Text | 2 | 26 |
| Markdown | 2 | 349 |

**Largest files:**
- `fn/README.md` (212 lines)
- `fn/src/infrastructure/external/documentai/client.py` (138 lines)
- `fn/AGENTS.md` (137 lines)
- `fn/src/interface/handlers/storage.py` (100 lines)
- `fn/src/infrastructure/persistence/firestore/document_repository.py` (89 lines)
- `fn/src/infrastructure/external/upstash/search_client.py` (73 lines)
- `fn/src/core/config.py` (71 lines)
- `fn/src/interface/schemas/rag_query.py` (71 lines)
- `fn/src/infrastructure/persistence/storage/client.py` (68 lines)
- `fn/src/domain/services/rag_ingestion_text.py` (63 lines)