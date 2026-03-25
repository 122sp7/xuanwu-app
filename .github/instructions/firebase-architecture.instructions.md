---
description: 'Firebase architecture boundaries for Next.js orchestration, Firestore, and Python worker runtime.'
applyTo: '{app,modules,packages,py_fn}/**/*.{ts,tsx,js,jsx,py}'
---

# Firebase Architecture

## Runtime Split

- Next.js: user-facing orchestration, auth/session, server actions.
- `py_fn/`: heavy ingestion, embedding, and background operations.

## Responsibility Split

- Next.js owns upload UX, browser-facing APIs, and AI response orchestration.
- `py_fn/` owns parse/clean/taxonomy/chunk/embed/persist pipelines.

## Data Boundary

- Keep Firestore document contracts explicit.
- Avoid implicit schema drift across modules.
- Preserve source and chunk metadata traceability for audit and citation needs.

Tags: #use skill context7 #use skill .serena-mcp #use skill xuanwu-app-skill 
#use skill slavingia-skills-company-values
#use skill slavingia-skills-find-community
#use skill slavingia-skills-first-customers
#use skill slavingia-skills-grow-sustainably
#use skill slavingia-skills-minimalist-review
#use skill slavingia-skills-mvp
#use skill slavingia-skills-pricing
#use skill slavingia-skills-validate-idea
