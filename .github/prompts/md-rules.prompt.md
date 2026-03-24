---
mode: agent
tools: [markitdown]
description: Convert prose documentation into machine-optimized rules, tables, and structured formats
---

# md-rules — Prose → Rules Converter

## Conversion Priority

```
Paragraph → Rule sentence
Multi-rule paragraph → Table
Sequential steps → Numbered list
Conditional logic → Decision table
Structural description → ASCII tree
Repeated pattern → Template
```

## Rule Sentence Format

```
{Subject} {must|must not|should|may} {verb} {object} [when {condition}].
```

Examples:
- ✅ `Firestore paths must include tenant boundary (/orgs/{orgId}/...).`
- ✅ `Server Actions must not import Firebase Admin SDK in Client Components.`
- ❌ "It's important that when you are writing Firestore paths, you should always make sure to include..."

## Decision Table Format

```md
| Condition | Action |
|---|---|
| User is authenticated | Allow read |
| User owns resource | Allow write |
| User is admin | Allow delete |
| Otherwise | Deny |
```

## Conversion Triggers

| Input Signal | Convert To |
|---|---|
| "There are three rules..." | Numbered rules list |
| "You should/must/never..." | Rule sentence |
| "If X then Y, if A then B..." | Decision table |
| "The folder contains..." | ASCII tree |
| "First..., then..., finally..." | Numbered steps |
| "For example:" + long paragraph | Code block only |

## Anti-Rules (never do)

- Never write "This section describes..."
- Never use passive voice in rules ("should be done" → "do X")
- Never leave implicit constraints — make them explicit rules
- Never use "etc." — enumerate all or link to full list
