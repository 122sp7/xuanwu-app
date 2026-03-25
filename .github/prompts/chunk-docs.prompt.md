---
name: chunk-docs
description: Define and execute document chunking strategy for retrieval quality and context efficiency.
agent: rag-lead
argument-hint: Provide source docs, target chunk policy, and constraints.
---

# Chunk Docs

## Inputs

- docs: ${input:docs:docs/**/*.md}
- policy: ${input:policy:size,overlap,metadata}
- constraints: ${input:constraints:token budget and citation needs}

## Workflow

1. Validate document normalization status.
2. Apply chunking policy with explicit metadata fields.
3. Check chunk quality for retrieval relevance.
4. Report chunk statistics and edge cases.

Tags: #use skill context7 #use skill .serena-mcp #use skill xuanwu-app-skill 
#use skill slavingia-skills-company-values
#use skill slavingia-skills-find-community
#use skill slavingia-skills-first-customers
#use skill slavingia-skills-grow-sustainably
#use skill slavingia-skills-minimalist-review
#use skill slavingia-skills-mvp
#use skill slavingia-skills-pricing
#use skill slavingia-skills-validate-idea
