---
title: Legacy customizations migration
description: Migration record for replacing older AI customizations with the Xuanwu Copilot Delivery Suite.
---

# Legacy customizations migration

This page tracks older customization assets that are being replaced by the formal delivery suite.

## Active migration items

| Legacy asset | Replacement | Migration status | Notes |
| --- | --- | --- | --- |
| [.github/agents/qa-subagent.agent.md](../../../.github/agents/qa-subagent.agent.md) | [.github/agents/qa.agent.md](../../../.github/agents/qa.agent.md) | In progress | The legacy agent is now hidden from picker and model invocation to avoid QA name collisions while contributor-facing references are cleaned up |

## Migration rules

- Do not silently delete a legacy asset before its replacement is documented.
- Update [customizations-index.md](./customizations-index.md) when status changes.
- Remove legacy references from contributor-facing docs before deleting the file.

## Retirement criteria

A legacy customization can be removed when all of the following are true:

- the replacement asset exists,
- contributor-facing docs point to the replacement,
- internal references have been updated,
- and the workflow no longer depends on the legacy name.