## Phase: impl
## Task: IDDD SRP file-size refactor (Sprint I)
## Date: 2026-04-07

### Scope
Reduced oversized files violating Vaughn Vernon IDDD single-responsibility principle.
No functional changes — only structural split to achieve one-aggregate-per-file alignment.

### Changes Made

#### workspace-flow.actions.ts (211 lines) → 3 aggregate files
- `workspace-flow-task.actions.ts` (~70 lines): Task lifecycle server actions
- `workspace-flow-issue.actions.ts` (~80 lines): Issue lifecycle server actions
- `workspace-flow-invoice.actions.ts` (~100 lines): Invoice lifecycle server actions
- Updated 7 component consumers (TaskRow, IssueRow, InvoiceRow, WorkspaceFlowTab, OpenIssueDialog, CreateTaskDialog, AssignTaskDialog)
- Original `workspace-flow.actions.ts` deleted

#### organization.actions.ts (202 lines) → 5 responsibility files
- `organization-lifecycle.actions.ts`: create, createWithTeam, updateSettings, delete
- `organization-member.actions.ts`: invite, recruit, dismiss, updateRole
- `organization-team.actions.ts`: createTeam, deleteTeam, updateTeamMembers
- `organization-partner.actions.ts`: createPartnerGroup, sendPartnerInvite, dismissPartner
- `organization-policy.actions.ts`: createOrgPolicy, updateOrgPolicy, deleteOrgPolicy
- Updated `api/index.ts` and `index.ts`
- Original `organization.actions.ts` deleted

#### wiki-libraries.use-case.ts (210 lines → 168 lines)
- Extracted helpers to `wiki-library-use-case.helpers.ts` (56 lines)
- Helpers: generateId, normalizeName, normalizeFieldKey, ensureUniqueLibrarySlug, defaultEventPublisher

### Validation
- npm run lint: exit code 0
- npm run build: exit code 0

### Files >300 Lines Still Present (all within ESLint infra ≤400 limit)
- `FirebaseOrganizationRepository.ts`: 360 lines (one interface implementation, acceptable)
- `FirebaseKnowledgePageRepository.ts`: 285 lines (infrastructure adapter)
- `InMemoryKnowledgeRepository.ts`: 256 lines (in-memory test double)
