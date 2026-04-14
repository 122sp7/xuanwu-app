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
- Only files matching these patterns are included: .github/**/*.md, docs/**/*.md, app/**/*.md, modules/**/*.md, packages/**/*.md, py_fn/**/*.md
- Files matching these patterns are excluded: .next/**, .turbo/**, .vercel/**, .firebase/**, .output/**, .parcel-cache/**, .cursor/**, .vscode/**, .serena/**, .claude/**, .opencode/**, .idea/**, .history/**, .cache/**, .temp/**, .tmp/**, tmp/**, temp/**, logs/**, firebase-debug.log, repomix-output.*, .env*, *.pem, *.key, *.crt, skills-lock.json, docs/architecture/**, diagrams/**, *.png, *.jpg, *.jpeg, *.gif, *.webp, *.mp4, *.zip, *.tar, *.gz, *.sqlite, *.db, .github/skills/**/references/**
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Content has been formatted for parsing in markdown style
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

## Statistics

401 files | 24,673 lines

| Language | Files | Lines |
|----------|------:|------:|
| Markdown | 401 | 24,673 |

**Largest files:**
- `docs/hard-rules-consolidated.md` (455 lines)
- `.github/skills/hexagonal-ddd/SKILL.md` (415 lines)
- `.github/skills/playwright-mcp-testing/SKILL.md` (358 lines)
- `.github/skills/shadcn/SKILL.md` (296 lines)
- `.github/skills/zustand-xstate/SKILL.md` (284 lines)
- `.github/skills/zod-validation/SKILL.md` (274 lines)
- `.github/skills/genkit-ai/SKILL.md` (271 lines)
- `py_fn/README.md` (265 lines)
- `docs/subdomains.md` (265 lines)
- `modules/platform/domain/events/DESIGN.md` (257 lines)