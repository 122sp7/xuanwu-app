# Task Subdomain

Defines the core business unit of work in the workspace domain.

Responsibilities:
- Create, update, and manage tasks
- Maintain task lifecycle state
- Store metadata (priority, assignee, deadlines)
- Provide stable identity for all downstream subdomains

Out of scope:
- Financial logic (settlement)
- QA / review decisions
- Workflow orchestration rules

Key entity:
- Task