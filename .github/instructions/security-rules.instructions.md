---
description: 'Security rules guardrails for Firestore and Storage with least-privilege access.'
applyTo: '{firestore.rules,storage.rules,modules/**/infrastructure/**/*.{ts,tsx,js,jsx},py_fn/**/*.py}'
---

# Security Rules

## Rules

- Enforce organization and workspace isolation.
- Keep allow conditions explicit and auditable.
- Pair rule changes with scenario-based validation.

## Avoid

- Broad wildcard allows without actor checks.
- Hidden coupling to UI-side assumptions.

Tags: #use skill context7 #use skill .serena-mcp #use skill xuanwu-app-skill 
#use skill slavingia-skills-company-values
#use skill slavingia-skills-find-community
#use skill slavingia-skills-first-customers
#use skill slavingia-skills-grow-sustainably
#use skill slavingia-skills-minimalist-review
#use skill slavingia-skills-mvp
#use skill slavingia-skills-pricing
#use skill slavingia-skills-validate-idea
