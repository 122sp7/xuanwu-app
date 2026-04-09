<!-- Purpose: Subdomain scaffold overview for platform 'background-job'. -->
# background-job Subdomain

## Overview

The `background-job` subdomain manages the lifecycle of asynchronous tasks within the platform. It provides abstractions for job submission, scheduling, monitoring, and execution coordination across the xuanwu-app system.

## Core Responsibilities

- **Job Submission**: Accept and queue work requests from other bounded contexts
- **Job Scheduling**: Define and manage when/how jobs execute (immediate, delayed, recurring)
- **Job Monitoring**: Track execution status, progress, and outcomes
- **Retry & Failure Handling**: Define policies for transient failures and dead-letter handling
- **Worker Coordination**: Coordinate with async workers (py_fn Cloud Functions, Cloud Tasks)

## Ubiquitous Language

| Term | Definition |
|---|---|
| **Job** | A unit of async work defined by type, payload, and execution constraints |
| **Job Queue** | Ordered collection of pending jobs awaiting execution |
| **Job Status** | Lifecycle state: `pending` → `running` → `completed`/`failed`/`retrying` |
| **Job Result** | Outcome record: success payload, error details, or retry signal |
| **Retry Policy** | Rules governing max attempts, backoff strategies, and failure thresholds |
| **Job Discriminant** | Unique identifier for job type (e.g., `knowledge.index-page`, `notification.send-email`) |

## Bounded Context

- **Upstream**: All other contexts that submit jobs (knowledge, workspace, notification, etc.)
- **Downstream**: Worker infrastructure (Cloud Functions, Cloud Tasks, message queues)
- **Peer Integration**: Observability and audit-log subdomains for monitoring and compliance

## API Surface

See [`api/`](./api/README.md) for:
- Job submission use cases
- Job query interfaces
- Execution callbacks and webhooks

## Architecture

```
interfaces/
    ├── _actions/          # Server Actions for job submission
    ├── components/        # Job monitoring UI
    └── hooks/             # useJobStatus, useJobHistory

application/
    ├── use-cases/
    │   ├── submit-job.use-case.ts
    │   ├── poll-job-status.use-case.ts
    │   └── retry-failed-job.use-case.ts
    └── dto/

domain/
    ├── entities/          # Job aggregate root
    ├── repositories/      # IJobRepository interface
    ├── services/          # Job scheduling logic, retry policies
    └── ports/             # Worker execution port

infrastructure/
    ├── firebase/          # Firestore job store
    ├── cloud-tasks/       # Cloud Tasks adapter
    └── memory/            # In-memory job store (testing)
```

## Key Patterns

- **Job Aggregate**: Owns all state transitions and retry logic; enforces invariants
- **Retry Policy as Value Object**: Encapsulates backoff, max attempts, and failure criteria
- **Job Result Union**: `{ type: "success", data } | { type: "failed", error } | { type: "retrying", attempt }`
- **Worker Callback Port**: Defines contract for external executors to report completion

## Related Subdomains

- [`notification`](../notification/README.md) — Submits notification jobs
- [`observability`](../observability/README.md) — Monitors job execution health
- [`audit-log`](../audit-log/README.md) — Records job lifecycle events