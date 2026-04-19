---
description: 'Security rules guardrails for Firestore and Storage with least-privilege access.'
applyTo: '{firestore.rules,storage.rules,src/modules/**/infrastructure/**/*.{ts,tsx,js,jsx},fn/**/*.py}'
---

# Security Rules

## Rules

- Enforce organization and workspace isolation.
- Keep allow conditions explicit and auditable.
- Pair rule changes with scenario-based validation.

## Avoid

- Broad wildcard allows without actor checks.
- Hidden coupling to UI-side assumptions.

## Security Rules Audit Checklist

### Firestore / Storage Security Rules
- [ ] Firestore rules 包含 `request.auth != null` 驗證？
- [ ] 每個 collection 有 organization / workspace isolation 條件？
- [ ] 無寬泛 wildcard allow（`allow read, write: if true`）？

### Cloud Functions（fn）
- [ ] `fn/` 函式不包含 browser-facing auth / session logic？
- [ ] `fn/` 的 Firestore 寫入使用 Admin SDK（非 client SDK）？

Tags: #use skill context7 #use skill serena-mcp #use skill repomix #use skill xuanwu-skill
#use skill xuanwu-development-contracts
