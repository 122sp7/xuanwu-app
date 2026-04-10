
## workspace-workflow subdomain

The `workspace-workflow` subdomain owns workspace-scoped process orchestration: defining, executing, and governing multi-step automated workflows triggered by domain events or user actions within a workspace.

> **Renamed from `workflow`** to `workspace-workflow` per `docs/contexts/workspace/subdomains.md` to avoid naming conflict with `platform.workflow`.

### Strategic classification

**Subdomain Type:** Generic
**Parent Domain:** workspace
**Anchoring aggregate:** `Workflow` (scoped to `workspaceId`)

### Hexagonal shape

```
interfaces/
    ├── queries/          # TanStack Query hooks for workflow state fetching
    ├── components/       # React UI for workflow builder and execution status
    └── view-models/      # View transformation for workflow run display

application/
    ├── use-cases/        # DefineWorkflow, TriggerWorkflow, CancelWorkflowRun, ListWorkflowRuns
    └── dto/              # WorkflowReadDTO, WorkflowRunDTO, WorkflowStepDTO

domain/
    ├── entities/         # Workflow (aggregate root), WorkflowRun, WorkflowStep
    ├── value-objects/    # WorkflowId, WorkflowRunId, StepStatus, TriggerCondition
    ├── repositories/     # IWorkflowRepository, IWorkflowRunRepository
    └── events/           # WorkflowDefined, WorkflowRunStarted, WorkflowRunCompleted, WorkflowRunFailed

infrastructure/
    ├── firebase/         # FirebaseWorkflowRepository, FirebaseWorkflowRunRepository
    └── memory/           # InMemory implementations (testing)

api/
    └── index.ts          # Public subdomain boundary
```

### Ownership and contracts

- **Aggregate root:** `Workflow` — process definition with `workspaceId`, steps, trigger conditions, and status
- **Run entity:** `WorkflowRun` — a single execution instance of a `Workflow`, with per-step state
- **Repository interfaces:** `IWorkflowRepository` (definitions), `IWorkflowRunRepository` (run history)
- **Published events:** `workflow.run-started`, `workflow.run-completed`, `workflow.run-failed`, `workflow.step-completed`
- **Dependency:** Consumes workspace domain events as triggers; delegates to `platform.background-job` for async step execution; publishes to `workspace.feed` and `workspace.audit`

### Cross-module integration

- Entry: `@/modules/workspace/api` (preferred cross-module entry point)
- Subdomain internal queries: `@/modules/workspace/subdomains/workflow/api`
- Do NOT reach into `domain/`, `application/`, `infrastructure/`, `interfaces/` directly from other modules

### Use cases (sample)

- `define-workflow.use-case.ts` — create or update a workflow definition
- `trigger-workflow.use-case.ts` — start a workflow run from an event or manual action
- `cancel-workflow-run.use-case.ts` — abort an in-progress run
- `list-workflow-runs.use-case.ts` — query run history with status filters
- `advance-workflow-step.use-case.ts` — move run to next step (invoked by job executor)

### Status

🔨 Migration-Pending — scaffold only
