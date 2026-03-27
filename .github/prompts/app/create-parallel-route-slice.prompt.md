---
name: 'create-parallel-route-slice'
description: 'Create or refactor an app/ route slice or parallel-route block that composes module APIs without importing module internals.'
agent: 'App Router Composer'
argument-hint: 'Provide the route path, UI block role, allowed module APIs, and whether the slice should be server or client.'
---

# Create Parallel Route Slice

## Mission

Create or refactor a route slice in `app/` that composes one feature block and keeps the module boundary API-only.

## Inputs

- Route path: `${input:routePath:app/(shell)/dashboard}`
- Block role: `${input:blockRole:dashboard panel | sidebar tool | modal | chat console}`
- Allowed module APIs: `${input:moduleApis:@/modules/workspace/api}`
- Rendering mode: `${input:renderMode:server | client}`

## Workflow

1. Keep the slice focused on one UI responsibility.
2. Consume module data through public APIs only.
3. Keep local UI state isolated to this slice or its local components.
4. Avoid embedding business logic in the route layer.
5. Run the minimum validation needed for the touched files.

## Output

- Files created or changed
- Module APIs consumed
- Validation run
- Any remaining route-state or boundary risks

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill slavingia-skills-mvp
#use skill app-router-parallel-routes
#use skill next-devtools-mcp
#use skill vercel-react-best-practices
