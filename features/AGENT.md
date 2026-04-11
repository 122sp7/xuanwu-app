# AGENT.md — features/

## Role

`features/` is the **behaviour layer** of this application.

Each feature represents a discrete user-facing action or interaction that is composed from one or more domain modules (`modules/notebooklm`, `modules/notion`, `modules/platform`, `modules/workspace`, etc.).

---

## Architectural Contract

### What belongs here

| Artefact | Description |
|----------|-------------|
| `ui/` | Components that exist solely to serve this feature |
| `model/` | Local state, hooks, business logic (`use<Feature>.ts`) |
| `api/` | Feature-scoped API calls (if not already covered by a module) |
| `index.ts` | Public API — the only surface exposed to `app/` or other consumers |

### What does NOT belong here

| Artefact | Correct location |
|----------|-----------------|
| Reusable UI primitives (Button, Modal, …) | `shared/ui` |
| Domain API clients & data models | `modules/<domain>/` |
| Route definitions | `app/` |
| Cross-feature utilities | `shared/lib` |

---

## Dependency Rules

```
app/
 └── features/          ← may import from modules/, shared/
      └── modules/      ← no knowledge of features/
           └── shared/  ← no knowledge of modules/ or features/
```

- A feature **may** import from any `modules/*` or `shared/*`.
- A feature **must not** import from another feature directly.
  - Cross-feature coordination belongs in `app/` (page / layout level).
- `modules/*` **must not** import from `features/*`.

---

## Naming Convention

```
features/
└── <verb>-<noun>/          # kebab-case, action-oriented name
    ├── ui/
    │   └── <FeatureName>.tsx
    ├── model/
    │   └── use<FeatureName>.ts
    ├── api/                # optional
    │   └── <featureName>Api.ts
    └── index.ts            # explicit public exports only
```

**Good names** (verb + noun):
- `sync-to-notion`
- `import-from-notebooklm`
- `workspace-switcher`
- `auth-guard`

**Bad names** (avoid noun-only or vague names):
- `notion` ← belongs in `modules/notion`, not features
- `utils`
- `helpers`

---

## Checklist before adding a new feature

- [ ] The feature name describes a user action, not a data entity
- [ ] It composes ≥ 1 module (not just wrapping a single module call)
- [ ] `index.ts` exports only what consumers need
- [ ] No direct import from another `features/*` sibling
- [ ] UI components inside `ui/` are not reused outside this feature

---

## Agent Guidance

When generating or modifying code in `features/`:

1. **Read `modules/<domain>/index.ts`** before importing — use the public API only.
2. **Keep `index.ts` minimal** — do not barrel-export internal implementation files.
3. **One hook per feature** — `model/use<Feature>.ts` owns all state and side-effects for that feature.
4. **No business logic inside UI components** — delegate to the `model/` hook.
5. **Do not add routing logic** — return components/hooks only; let `app/` decide where to render.
