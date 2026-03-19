---
name: Xuanwu React Component Rules
description: Use these rules for React components in app, modules, and ui layers.
applyTo: "app/**/*.tsx,modules/**/*.tsx,ui/**/*.tsx"
---
# React component rules

- Keep components focused on presentation and interaction; move orchestration into the correct application or interface layer.
- Prefer existing `ui/shadcn` primitives and established shell patterns before adding new component variants.
- Keep props explicit and domain-meaningful; avoid large catch-all prop bags.
- Do not hardcode user-facing copy when the surface is intended to be localized.
- Split server and client concerns cleanly instead of mixing data loading, side effects, and presentation in one component.
