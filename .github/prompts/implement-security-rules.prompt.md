---
name: implement-security-rules
description: Implement Firestore/Storage security rules with least privilege and tenancy isolation.
applyTo: '{firestore.rules,storage.rules}'
agent: Security Rules Agent
argument-hint: Provide access scenarios, actor roles, and constrained resources.
---

# Implement Security Rules

## Workflow

1. Enumerate allowed actor-resource actions.
2. Encode explicit allow conditions and deny-by-default behavior.
3. Validate with scenario-based checks.
4. Report residual access risks.

Tags: #use skill context7 #use skill serena-mcp #use skill repomix #use skill xuanwu-skill
#use skill xuanwu-development-contracts
