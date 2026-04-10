# Fix: FileProcessingDialog Execution Order + PageEditorView Block Loading

## Status: COMPLETE ✅

## Scope
Two bugs identified from screenshots and code analysis, both fixed in this session.

## Bug B — FileProcessingDialog.tsx execution order reversal
- File: `modules/notebooklm/subdomains/source/interfaces/components/FileProcessingDialog.tsx`
- Root cause: `if (shouldCreatePage)` ran BEFORE `if (shouldRunRag)` in `handleExecute()`
- Evidence: Screenshot showed RAG "待命" while Knowledge Page "處理中" — impossible if order were correct
- Fix: Swapped the two `if` blocks — RAG now executes first, Knowledge Page second
- Semantic reason: RAG is the foundation (makes document searchable); Knowledge Page is presentation on top

## Bug A — PageEditorView.tsx stub (never loaded blocks)
- File: `modules/notion/subdomains/knowledge/interfaces/components/PageEditorView.tsx`
- Root cause: `void accountId; void pageId;` — params explicitly discarded, never fetched Firestore blocks
- Pattern used: Same `useCallback` + `useEffect` pattern as `DatabaseTableView.tsx` (imports from `../queries/index`)
- Fix: Added `useEffect` that calls `getKnowledgeBlocks(accountId, pageId)` and populates `useBlockEditorStore.setBlocks()`
- Note: `getKnowledgeBlocks` uses Firebase Client SDK (not Admin), so it is safe to call from `"use client"` components

## Validation
- `tsc --noEmit` exits 0

## Key details
- `ContentBlockSnapshot` → `EditorBlock` mapping: `{ id, content, order, parentBlockId, isFocused: false }`
- `getKnowledgeBlocks` is in `interfaces/queries/index.ts` (no `"use server"` directive, uses client SDK)
- `setPage` resets the store (clears blocks first); `setBlocks` then populates
