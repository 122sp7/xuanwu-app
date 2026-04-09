<!-- Purpose: Subdomain scaffold overview for platform 'support'. -->

## Support

**Subdomain**: `platform.support`  
**Bounded Context**: `modules/platform/`  
**Classification**: Generic Subdomain  
**Primary Language**: Ubiquitous Language

### Purpose

Manage customer support operations—issue tracking, ticketing workflows, knowledge base integration, and support team coordination. This subdomain handles the interface between customer inquiries and internal resolution processes.

### Core Responsibilities

- **Ticket Lifecycle**: Create, prioritize, assign, and resolve support tickets
- **Issue Tracking**: Track issue status, history, and resolution evidence
- **Knowledge Integration**: Link support tickets to knowledge base articles for self-service
- **Team Coordination**: Distribute tickets to support agents, manage workload
- **Escalation**: Route complex issues to appropriate domain experts
- **Resolution Documentation**: Capture resolution steps and lessons learned

### Strategic Fit

Supports the broader **platform** generic subdomain by enabling customer success and reducing friction between users and the system.

### Key Aggregates

- **SupportTicket** — Root aggregate for customer issues
- **TicketComment** — Conversation thread within a ticket
- **Agent** — Support team member assignment and availability

### Domain Events

- `SupportTicketCreated` — New support request submitted
- `TicketAssigned` — Ticket routed to agent
- `TicketResolved` — Issue resolved and closed
- `TicketEscalated` — Escalated to domain expert or management
- `CommentAdded` — Agent or customer added reply

### External Dependencies

- **Workspace**: Tenant scope and workspaceId anchor
- **Identity**: Verified actor (customer or agent)
- **Account**: Customer account details for ticket context
- **Knowledge**: Link to knowledge base articles for resolution

### Anti-Patterns

- Direct customer database queries without repository abstraction
- Ticket resolution without documented reason or evidence
- Bypassing escalation workflow for urgent issues

### References

- Strategic DDD: [`docs/subdomains.md`](../../../docs/subdomains.md)
- Bounded Context Rule: [`bounded-contexts.md`](../../../docs/bounded-contexts.md)
- Context Map: [`context-map.md`](./context-map.md) (local)
