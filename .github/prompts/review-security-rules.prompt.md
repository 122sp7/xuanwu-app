---
name: review-security-rules
description: Review Firestore, storage, or related access rules with a tenant and ownership mindset.
agent: firestore-guard
argument-hint: "[rules file or surface] [threat model if known]"
---
Use xuanwu-app-skill first.

Review the requested security rules with emphasis on privilege boundaries.

- identify data exposure, tenant isolation, and privilege-escalation risks
- trace rule assumptions back to account, organization, and workspace ownership
- call out missing tests, indexes, or deployment prerequisites
- prioritize findings by impact and exploitability
- return findings first, then remediation guidance
