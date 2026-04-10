
## workspace.scheduling subdomain

The scheduling subdomain owns workspace-scoped schedule management: creating, updating, cancelling time-driven actions, recurrence rules, and reminder coordination within a workspace.

### Strategic classification

**Subdomain Type:** Generic
**Parent Domain:** workspace
**Anchoring aggregate:** `Schedule` (scoped to `workspaceId`)

### Hexagonal shape

```
interfaces/
    ├── queries/          # TanStack Query hooks for schedule fetching
    ├── components/       # React UI for schedule views and reminder panels
    └── view-models/      # View transformation for schedule display

application/
    ├── use-cases/        # CreateSchedule, UpdateSchedule, CancelSchedule, ListSchedules, ExecuteScheduledAction
    └── dto/              # ScheduleReadDTO, ScheduleWriteDTO, RecurrenceDTO

domain/
    ├── entities/         # Schedule (aggregate root), ScheduledAction (entity)
    ├── value-objects/    # ScheduleId, ScheduleName, Recurrence, ScheduleStatus
    ├── repositories/     # IScheduleRepository
    └── events/           # ScheduleCreated, ScheduleTriggered, ScheduleCancelled

infrastructure/
    ├── firebase/         # FirebaseScheduleRepository (Firestore)
    └── memory/           # InMemoryScheduleRepository (testing)

api/
    └── index.ts          # Public subdomain boundary
```

### Ownership and contracts

- **Aggregate root:** `Schedule` — time-driven action descriptor with `workspaceId`, `scheduledAction`, `recurrence`, `status`, `createdAt`
- **Repository interface:** `IScheduleRepository` — CRUD + query by workspaceId/status
- **Published events:** `scheduling.schedule-triggered`, `scheduling.schedule-cancelled`
- **Dependency:** Consumes `platform.background-job` for cron execution; publishes to `workspace.feed` and `workspace.audit`

### Cross-module integration

- Entry: `@/modules/workspace/api` (preferred cross-module entry point)
- Subdomain internal queries: `@/modules/workspace/subdomains/scheduling/api`
- Do NOT reach into `domain/`, `application/`, `infrastructure/`, `interfaces/` directly from other modules

### Use cases (sample)

- `create-schedule.use-case.ts` — create a new scheduled action
- `update-schedule.use-case.ts` — modify schedule definition or recurrence
- `cancel-schedule.use-case.ts` — cancel an active schedule
- `list-schedules.use-case.ts` — fetch schedules for a workspace with filters
- `execute-scheduled-action.use-case.ts` — triggered by background-job cron

### Status

🔨 Migration-Pending — scaffold only
