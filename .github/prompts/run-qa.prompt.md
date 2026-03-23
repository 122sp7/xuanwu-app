---
name: run-qa
description: Execute formal QA verification for a delivered change.
agent: qa
argument-hint: Provide the plan reference, reviewed change summary, and any risk areas or scenarios that must be checked.
---

# Run QA

Verify the delivered change using the formal QA output structure.

## Requirements

- Base the QA pass on the approved plan and any reviewer findings.
- Execute the scenarios needed to support a release recommendation.
- Separate failures, residual risks, and unverified areas.
- Do not mark the change ready if required evidence is missing.

## Output

Use the QA agent's formal sections for scope checked, scenarios executed, evidence collected, failures found, residual risks, and release recommendation.