# Team Subdomain

> Bounded Context: **platform**
> Status: 🟢 Active

## Purpose

Manages team entities within organizations — creation, deletion, and member roster changes.

## Aggregate Root

- **Team** — identified by `id`, scoped to an organization via `organizationId`

## Key Concepts

| Term | Definition |
|---|---|
| Team | A named group of members within an organization (internal or external) |
| CreateTeamInput | Command payload for creating a new team |
| TeamRepository | Port for team persistence operations |

## Use Cases

| Use Case | Description |
|---|---|
| CreateTeamUseCase | Creates a new team under an organization |
| DeleteTeamUseCase | Removes a team from an organization |
| UpdateTeamMembersUseCase | Adds or removes a member from a team |

## Dependencies

- `@shared-types` — CommandResult contract
- `@integration-firebase/client` — Firebase client (infrastructure only)

## Notes

- Team data is stored in the `organizations/{orgId}/teams` Firestore sub-collection.
- Previously nested under `organization/subdomains/team/`; promoted to peer-level subdomain for template compliance.
- Organization subdomain re-exports team use cases for backward compatibility.
