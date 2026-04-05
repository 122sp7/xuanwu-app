## Phase: impl
## Task: Wave 1 + Wave 2 module completeness pass
## Date: 2026-04-05

### Scope
- 6 implementation steps across knowledge-base, knowledge, notebook modules
- Zero new lint errors (0 errors, 141 warnings — all pre-existing baseline)

### Decisions / Findings

#### Step 1 — knowledge-base: Markdown 渲染
- File: `app/(shell)/knowledge-base/articles/[articleId]/page.tsx`
- Replaced `<pre>{article.content}</pre>` with `<ReactMarkdown remarkPlugins={[remarkGfm]}>` from `@lib-react-markdown` / `@lib-remark-gfm`
- Added `prose prose-sm dark:prose-invert` Tailwind classes for readable typography

#### Step 2 — knowledge: BlockEditor store type fix + multi-type rendering
- File: `modules/knowledge/interfaces/store/block-editor.store.ts`
  - `Block.content` changed from `string` → `BlockContent` (from domain value-object)
  - `updateBlock(id, text)` updates only the `text` field within `BlockContent`
  - Added `changeBlockType(id, type: BlockType)` action
- File: `modules/knowledge/interfaces/components/BlockEditorView.tsx`
  - Added `TypeSelectorButton` dropdown for switching between 10 block types
  - Conditional rendering per type: heading-1/2/3 (font sizing), quote (border-l italic), code (mono bg), divider (full-width `<hr>`), bullet-list (• prefix), text (default)
  - `blockEditableClass()` and `blockPlaceholder()` helpers for per-type styling

#### Step 3 — knowledge-base: Category 樹側欄
- File: `app/(shell)/knowledge-base/articles/page.tsx` (complete rewrite)
  - `buildCategoryTree()`: flat `Category[]` → nested `CategoryNode[]` using parentCategoryId
  - `CategoryTreePanel` + `CategoryNodeRow` recursive component with expand/collapse
  - Article grid filtered by selected category via `cat.articleIds.includes(a.id)`
  - Import added: `useMemo` for filtering + tree building

#### Step 4 — knowledge-base: Backlinks tab
- File: `modules/knowledge-base/infrastructure/firebase/FirebaseArticleRepository.ts`
  - Added `listByLinkedArticleId(accountId, articleId)`: Firestore `array-contains` query on `linkedArticleIds`
- File: `modules/knowledge-base/interfaces/queries/knowledge-base.queries.ts`
  - Added `getBacklinks(accountId, articleId)` query function
- File: `modules/knowledge-base/api/index.ts`
  - Exported `getBacklinks`
- File: `app/(shell)/knowledge-base/articles/[articleId]/page.tsx`
  - Added Backlinks tab (tab index between content and comments)
  - Shows count badge on tab trigger; lists articles with link to detail

#### Step 5 — notebook: FirebaseThreadRepository
- File (new): `modules/notebook/domain/repositories/IThreadRepository.ts`
  - Interface: `save(accountId, thread)`, `getById(accountId, threadId)`
- File (new): `modules/notebook/infrastructure/firebase/FirebaseThreadRepository.ts`
  - Firestore path: `accounts/{accountId}/threads/{threadId}`
  - Serializes Message[] with ISO date strings
- File: `modules/notebook/interfaces/_actions/notebook.actions.ts`
  - Added `saveThread(accountId, thread)` and `loadThread(accountId, threadId)` server actions
- File: `modules/notebook/api/index.ts`
  - Exported `IThreadRepository`, `saveThread`, `loadThread`

#### Step 6 — ai-chat: Thread 持久化 + Multi-turn context injection
- File: `app/(shell)/ai-chat/_actions.ts`
  - Re-exports `saveThread`, `loadThread`, `Thread` type from notebook module
- File: `app/(shell)/ai-chat/page.tsx`
  - `useAuth()` added to get `accountId`
  - `localStorage` key: `nb_thread_{accountId}_{workspaceId}` stores active `threadId`
  - On mount: load thread from Firestore, restore message history to state
  - `buildContextPrompt(history)`: formats previous messages as `[User]/[Assistant]` lines injected into `system` prompt
  - After assistant reply: call `saveThread(accountId, thread)` (fire-and-forget)
  - "新對話" button: clears localStorage key, resets state

### Validation / Evidence
- All 6 modified/created files: `get_errors` → 0 TypeScript errors
- Final lint: `npm run lint` → 0 errors, 141 warnings (same baseline as pre-session)

### Deviations / Risks
- Firestore index for `threads` collection not yet added to `firestore.indexes.json` — no composite query needed (only doc reads by id), so not required
- `useAuth` not previously imported in ai-chat page — added; safe because AuthProvider wraps the app shell

### Open Questions
- Wave 3 items still pending: knowledge full block types (code/list Prism), knowledge-database Board view, notification center UI