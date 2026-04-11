# features/

> **Behaviour layer** — user-facing feature slices composed from domain modules.

---

## What is a "feature"?

A feature is anything a user can **do** in the application — a discrete, nameable action with its own UI, state, and logic.

```
"I want to sync this note to Notion."          → features/sync-to-notion/
"I want to import from NotebookLM."            → features/import-from-notebooklm/
"I want to switch my active workspace."        → features/workspace-switcher/
"I want to search across all modules."         → features/global-search/
```

If you can complete the sentence _"As a user, I want to ___"_ with the folder name, it belongs here.

---

## Folder structure

```
features/
├── sync-to-notion/
│   ├── ui/
│   │   └── SyncToNotionButton.tsx
│   ├── model/
│   │   └── useSyncToNotion.ts
│   └── index.ts
│
├── import-from-notebooklm/
│   ├── ui/
│   │   └── ImportDialog.tsx
│   ├── model/
│   │   └── useImportFromNotebooklm.ts
│   ├── api/
│   │   └── importApi.ts
│   └── index.ts
│
├── workspace-switcher/
│   ├── ui/
│   │   └── WorkspaceSwitcher.tsx
│   ├── model/
│   │   └── useWorkspaceSwitcher.ts
│   └── index.ts
│
└── auth-guard/
    ├── ui/
    │   └── AuthGuard.tsx
    ├── model/
    │   └── useAuthGuard.ts
    └── index.ts
```

---

## Layer relationship

```
app/              → orchestrates features into pages & layouts
  features/       → composes modules into user actions
    modules/      → domain logic, API clients, data models
      shared/     → primitives, utilities, constants
```

Features sit **above** modules and **below** the app routing layer.

---

## Rules

| Rule | Reason |
|------|--------|
| Import from `modules/*` via their `index.ts` only | Keeps module internals encapsulated |
| Never import from another `features/*` sibling | Prevents hidden coupling; cross-feature logic goes in `app/` |
| Export only the public surface in `index.ts` | Consumers should not depend on internal file paths |
| Name folders as `<verb>-<noun>` | Signals this is an action, not a data domain |
| Keep business logic in `model/`, not in `ui/` | Testability and separation of concerns |

---

## Quick reference

| I want to… | Location |
|------------|----------|
| Add a new user-facing action | `features/<verb>-<noun>/` |
| Add a reusable UI component | `shared/ui/` |
| Add an API integration for a platform | `modules/<platform>/` |
| Add a page or route | `app/` |
| Add a cross-feature utility | `shared/lib/` |
