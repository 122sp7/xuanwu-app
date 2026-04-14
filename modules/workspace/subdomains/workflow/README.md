# Workflow Subdomain

Defines and controls task lifecycle transitions across subdomains.

Responsibilities:
- Manage state machine for tasks
- Define allowed transitions between stages
- Orchestrate events between subdomains
- Handle loops (issue → revision → review)

Key concepts:
- Workflow definition
- Workflow instance
- State transitions

Out of scope:
- Business logic inside each step