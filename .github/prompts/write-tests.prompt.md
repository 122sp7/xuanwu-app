---
name: write-tests
description: Design or scaffold tests with explicit scope, risks, and verification goals.
agent: reviewer
argument-hint: "[target file or workflow] [test level]"
---
Use xuanwu-skill first.

Produce a test plan or scaffold for the requested target.

- identify the highest-risk paths and expected behaviors
- prefer targeted, reproducible tests over broad snapshots
- call out required fixtures, mocks, and environment assumptions
- keep assertions aligned with module ownership and public contracts
- return proposed test cases, coverage gaps, and execution commands
