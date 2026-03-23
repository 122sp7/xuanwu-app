---
name: vscode-typescript-workbench
description: Work effectively with TypeScript in VS Code. Use when configuring tsconfig, transpiling with tsc, debugging with source maps, editing with IntelliSense, refactoring symbols, or managing TypeScript-specific editor features.
---

# VS Code TypeScript Workbench

Use this skill when the task is specifically about TypeScript workflows inside VS Code.

## When to Use This Skill

- Creating or fixing tsconfig.json
- Explaining TypeScript transpilation flow
- Setting up source maps and launch.json
- Refactoring TypeScript symbols or imports
- Explaining auto imports, inlay hints, CodeLens, or Quick Fixes
- Aligning VS Code's TypeScript version with the workspace TypeScript version

## Workflow

1. Determine whether the problem is editing, compiling, refactoring, or debugging.
2. For compile issues, inspect tsconfig, outDir, sourceMap, and included files.
3. For editor-behavior issues, inspect TypeScript version, IntelliSense features, and settings.
4. For refactoring, choose rename, extract, move, import conversion, or organize imports.
5. For debugging, ensure source maps exist and launch.json outFiles points at built output.

## Key Topics

- Compiler versus language service
- Workspace TypeScript version versus bundled version
- sourceMap and outFiles
- Organize Imports and updateImportsOnFileMove
- Code actions on save
- Large-project performance with focused tsconfig and project references

## Output Expectations

When using this skill, return:

1. the TypeScript workflow category,
2. the relevant VS Code feature or config,
3. the likely misconfiguration if something is broken,
4. the fastest way to validate.