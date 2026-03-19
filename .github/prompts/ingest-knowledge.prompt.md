---
name: ingest-knowledge
description: Turn raw product or technical material into structured repo knowledge and implementation guidance.
agent: rag-architect
argument-hint: "[source description or link] [target module]"
---
Use xuanwu-skill first.

Ingest the requested knowledge source into a structured implementation brief.

- extract core concepts, domain vocabulary, constraints, and risks
- map the material to Xuanwu modules, interfaces, and infrastructure
- identify what should become docs, prompts, skills, or code tasks
- highlight ambiguities that block safe implementation
- return a normalized summary plus concrete next actions
