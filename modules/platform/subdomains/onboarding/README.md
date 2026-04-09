# Onboarding Subdomain

## Purpose

The **onboarding** subdomain manages initial setup and guided activation for new principals (Tenants, Accounts, Organization members). It orchestrates the first-run experience, including profile completion, workspace initialization, feature discovery, and onboarding checklist progression.

## Core Responsibilities

- **Principal activation** — Post-registration setup flow for Tenants and Accounts
- **Profile initialization** — Guided completion of required account attributes
- **Workspace bootstrapping** — Auto-creation of default workspace and initial structure
- **Feature discovery** — Progressive feature introduction and tutorial guidance
- **Onboarding checklist** — Trackable milestone progression (e.g., "create first knowledge page")
- **Preference defaults** — Seeding initial user preferences and notification settings

## Bounded Context

**Module**: `modules/platform/subdomains/onboarding`

**Ubiquitous Language**:
- **Onboarding Session** — Immutable record of a principal's onboarding journey (createdAt, completedAt, milestones)
- **Milestone** — Discrete onboarding checkpoint (past-tense: `ProfileCompleted`, `FirstWorkspaceCreated`)
- **Onboarding Checklist** — Mutable checklist of tasks tied to a principal's session
- **Feature Gate** — Conditional display of feature hints based on onboarding progress

**Aggregates**:
- `OnboardingSession` (root) — One per principal; owns milestones and completion state
- `OnboardingChecklist` (value object) — Immutable snapshot of required and optional tasks

**Domain Events**:
- `OnboardingSessionStarted` — When a principal enters onboarding (post-signup)
- `MilestoneReached` — When a principal completes a checkpoint
- `OnboardingSessionCompleted` — When all required milestones are done

## Cross-Context Collaboration

**Upstream** (consumes events from):
- `identity` — New principal created → triggers onboarding session start
- `account` — Profile attribute updates inform milestone completion

**Downstream** (publishes events to):
- `account-profile` — Writes onboarding-driven profile defaults
- `workspace` — Creates or configures default workspace after profile completion
- `feature-flag` — Queries feature gates to show/hide tutorial hints

**Anti-Corruption Layer**:
- `identity` and `account` models are adapted in `infrastructure/` to avoid exposing their internal structure to onboarding domain logic

## Implementation Notes

- Use `IOnboardingSessionRepository` in `domain/repositories/` for persistence contract
- Archive completed sessions after configurable retention period (see `compliance` subdomain)
- Onboarding events are published through `modules/shared/api` event-store contract
- Tutorial hints are feature-flagged; see `feature-flag` subdomain for conditional rendering

## Files

- `domain/entities/OnboardingSession.ts` — Aggregate root
- `domain/repositories/OnboardingSessionRepository.ts` — Repository interface
- `application/use-cases/start-onboarding-session.use-case.ts` — Initiate flow on new principal
- `application/use-cases/mark-milestone-reached.use-case.ts` — Record checkpoint completion
- `infrastructure/firebase/FirebaseOnboardingSessionRepository.ts` — Firestore adapter
- `interfaces/api/onboarding.routes.ts` — HTTP endpoints for client checklist fetch/update
- `interfaces/_actions/update-onboarding-checklist.action.ts` — Server Action for checklist mutation