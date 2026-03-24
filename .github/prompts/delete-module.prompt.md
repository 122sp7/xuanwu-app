---
description: 'Delete a module safely by removing imports, API usage, event usage, and documentation references first'
name: 'delete-module'
agent: 'modules-architect'
argument-hint: 'Module name, replacement module or API, and required migration constraints'
---

# Delete Module

## Mission

Delete a module only after its imports, API usage, events, and docs have been migrated or removed.

## Inputs

- Module name: `${input:moduleName:legacy-module}`
- Replacement target: `${input:replacement:Target module, API, or event flow}`
- Constraints: `${input:constraints:Consumer migrations or compatibility requirements}`

## Workflow

1. Search all imports of the module.
2. Search all API usage.
3. Search all event usage.
4. Remove or migrate consumers first.
5. Delete the module and update indexes, docs, and dependency guidance.

## Output Expectations

- Summarize consumer migration
- List deleted or updated references
- List validation performed
