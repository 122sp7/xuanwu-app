---
title: Organize repository docs for AI
description: How to structure, summarize, index, and maintain Xuanwu App documentation so AI tools can route and read the right material quickly.
---

# Organize repository docs for AI

Use this guide when you want Xuanwu App documents to be easier for Copilot, agents, and retrieval workflows to understand.

## Goal

Turn scattered documents into a predictable knowledge flow:

1. collect and classify,
2. add table-of-contents and summaries,
3. maintain an index with metadata,
4. separate overview from detail,
5. optionally enable retrieval,
6. guide AI with the right prompt entry points,
7. keep everything current.

## Recommended storage layout in this repository

Use the existing docs structure instead of adding a parallel documentation tree.

| Content type | Primary location | Why |
| --- | --- | --- |
| High-level architecture and rationale | [docs/decision-architecture/](../../../decision-architecture/) | Design intent, ADRs, system architecture |
| Development workflows and technical references | [docs/development-reference/](../../../development-reference/) | Implementation rules, contracts, specifications |
| Diagrams and explanations | [docs/diagrams-events-explanations/](../../../diagrams-events-explanations/) | Visual and explanatory support material |
| User-facing guides and operator flows | [docs/how-to-user/](../../../how-to-user/) | How-to and manual content |
| Agent and repo operating rules | [agents/](../../../../agents/) and [.github/](../../../../.github/) | AI instructions, command references, workflow assets |

Do not create a new root-level docs bucket unless the existing structure cannot express the ownership clearly.

## Step 1: Collect and classify

Before editing content, decide the document's home by intent, not by filename.

| Question | Place it here |
| --- | --- |
| Is this about architecture decisions or rationale? | [docs/decision-architecture/](../../../decision-architecture/) |
| Is this a rule, contract, specification, or engineering reference? | [docs/development-reference/](../../../development-reference/) |
| Is this a how-to, operator guide, or user manual? | [docs/how-to-user/](../../../how-to-user/) |
| Is this mainly a diagram or visual explanation? | [docs/diagrams-events-explanations/](../../../diagrams-events-explanations/) |

When consolidating files:

- remove duplicate copies,
- archive or delete stale drafts,
- keep one canonical source per topic,
- update the nearest README when a file moves.

## Step 2: Add a table of contents and section summaries

Every long Markdown file should have:

1. a short introduction that explains what the file is for,
2. a predictable heading hierarchy,
3. a one- or two-line summary at the start of each major section.

Recommended pattern:

```md
# Title

One paragraph summary of what this document covers and when to read it.

## Section A

Short summary of why this section matters.

### Detail A.1
```

Prefer explicit headings over hidden or tool-specific TOC syntax. In this repository, clear headings and index pages are more reliable than relying on `[TOC]` rendering.

## Step 3: Maintain an index with metadata

For each folder that acts as a document hub, keep a README index table. At minimum, include:

| File | Topic | Keywords | Summary |
| --- | --- | --- | --- |
| `example.md` | runtime boundary | nextjs, worker, rag | Explains which runtime owns each step. |

For larger collections, use this richer schema:

| File | Type | Layer | Topic | Keywords | Summary | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `rag-ingestion-contract.md` | reference | mid | RAG ingestion | rag, ingestion, worker, firestore | Canonical upload-to-worker contract. | active |

Field guidance:

- File: canonical path from the current folder
- Type: tutorial, how-to, reference, explanation
- Layer: high, mid, low
- Topic: main subject area
- Keywords: search-oriented terms an AI would likely match
- Summary: one sentence with the decision-relevant point
- Status: active, draft, legacy, archived

## Step 4: Separate high, mid, and low layers

AI tools should read the smallest useful layer first.

| Layer | Purpose | Typical files in this repo |
| --- | --- | --- |
| High | Fast orientation and routing | [docs/README.md](../../../README.md), [docs/development-reference/specification/system-overview.md](../../../development-reference/specification/system-overview.md), [agents/knowledge-base.md](../../../../agents/knowledge-base.md) |
| Mid | Implementation guidance and workflows | contracts, development READMEs, AI workflow references |
| Low | Raw detail and supporting artifacts | ADRs, diagrams, logs, detailed specs |

Apply this reading rule:

1. Start from a README or overview page.
2. Move to the specific contract, guide, or reference page.
3. Only then open detailed diagrams, ADRs, or low-level artifacts.

## Step 5: Optional retrieval and embeddings

If the documentation set becomes too large for direct reading:

1. chunk by heading boundaries,
2. store chunk metadata with path, section title, topic, and keywords,
3. index the chunks in a vector store,
4. return the most relevant sections before loading full files.

Recommended chunk metadata:

| Field | Purpose |
| --- | --- |
| `path` | file location |
| `title` | document title |
| `section` | heading path |
| `layer` | high, mid, low |
| `topic` | business or technical topic |
| `keywords` | retrieval hints |
| `summary` | short routing hint |

## Step 6: Give AI a stable entry prompt

Use a consistent instruction pattern when asking AI to work from docs.

Example prompt:

```text
先讀 llms.txt 與 docs/README.md，根據摘要與關鍵字定位最相關文件。
先回報你選了哪些高層文件，再下鑽到契約或細節文件。
如果找到多份重複來源，請指出 canonical file。
```

For this repository, preferred entry order is:

1. [llms.txt](../../../../llms.txt)
2. [docs/README.md](../../../README.md)
3. nearest folder README
4. specific contract, guide, or reference page
5. supporting ADRs or diagrams

## Step 7: Keep it current

Whenever a new document is added or moved, update in the same change:

1. the nearest README index,
2. any affected root index such as [docs/README.md](../../../README.md),
3. summaries and keywords,
4. AI entry points such as [llms.txt](../../../../llms.txt) if routing changes materially.

Use this maintenance checklist:

- Is there exactly one canonical file for the topic?
- Does the document start with a summary?
- Is the heading structure easy to chunk by section?
- Is the document indexed from the nearest README?
- Does the file belong to the correct high, mid, or low layer?
- Would an AI know when to open this file from its title, summary, and keywords alone?

## Minimum standard for new docs

Every new important document should provide all of the following:

- title,
- one-paragraph summary,
- clear headings,
- index entry in a nearby README,
- keywords or topic wording that matches likely search terms,
- a stable canonical location.

## Related references

- [docs/README.md](../../../README.md)
- [docs/development-reference/reference/ai/customizations-index.md](../../../development-reference/reference/ai/customizations-index.md)
- [agents/knowledge-base.md](../../../../agents/knowledge-base.md)