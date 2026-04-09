---
name: iddd-implementing-ddd
description: Comprehensive IDDD (Implementing Domain-Driven Design by Vaughn Vernon) reference skill. Use when modeling aggregates, bounded contexts, domain events, value objects, repositories, or any DDD tactical/strategic pattern. Covers all 16 IDDD chapters with design rules and TypeScript-mapped code examples.
---

# Implementing Domain-Driven Design (IDDD) — Vaughn Vernon

> Source: *Implementing Domain-Driven Design* by Vaughn Vernon (2013, Addison-Wesley).
> This skill is the authoritative DDD reference for the Xuanwu codebase.

---

## When to use this skill

- Designing or reviewing any `modules/<context>/domain/` code
- Deciding whether something is an Entity, Value Object, Domain Service, or Aggregate Root
- Mapping bounded contexts and inter-context relationships
- Publishing or handling domain events
- Designing repositories, factories, or application services
- Choosing an architecture style (Hexagonal, CQRS, Event Sourcing)
- Resolving terminology disagreements — always check Ubiquitous Language first

---

## Part I — Strategic Design

### Chapter 1: Getting Started with DDD

DDD exists to help us achieve high-quality software model designs that explicitly reflect the intended business objective.

**Three pillars of DDD:**

1. **Ubiquitous Language** — Developed with full team agreement (domain experts + developers), spoken in every conversation, and directly captured in the model. Never "us and them" — always *us*.
2. **Strategic Design** — Defines bounded contexts, inter-team organizational relationships, and cleanly bounding systems so each business-level service is protected.
3. **Tactical Design** — Modeling tools (Aggregates, Entities, Value Objects, Domain Events, Repositories, etc.) that produce a correct codification of the domain experts' mental model.

**Why DDD?**
- Put domain experts and developers on a level playing field — software makes perfect sense to the business.
- Zero translations between domain experts, developers, and the software.
- Centralizing knowledge prevents it being locked in "tribal knowledge."
- You can teach the business more about itself through continuous discovery.
- Domain model becomes a justifiable business investment, not just a cost center.

**Score your project** — DDD is most valuable when:
- The domain is not trivial
- The design team has access to domain experts
- Long-term maintainability matters
- The model will evolve over time

---

### Chapter 2: Domains, Subdomains, and Bounded Contexts

**Domain** — What an organization does and the world it does it in. The entire realm of understanding and the methods for carrying out its operations.

**Subdomain** — One area within the broader domain. DDD focuses on one specific area at a time, not an all-inclusive enterprise model.

**Three types of Subdomains:**

| Type | Description | Investment |
|------|-------------|------------|
| **Core Domain** | The primary differentiator — what makes the business unique. Where excellence is required. | Maximum investment |
| **Supporting Subdomain** | Supports the Core but not a differentiator. May be custom-built because it is specialized. | Moderate investment |
| **Generic Subdomain** | Required but provides no distinction (billing, authentication, email). Often buy or use open source. | Minimize investment |

**Bounded Context** — An explicit boundary within which a particular domain model is defined and applicable. Inside a Bounded Context, all terms of the Ubiquitous Language have a precise meaning.

> A single term can mean different things in different Bounded Contexts. This is intentional and correct — it reflects the distinct mental models of each team.

**Key principle:** Vigorously separating distinct areas of the whole business domain leads to success. Do NOT attempt to define the entire business in a single all-encompassing model.

**Bounded Context scope:**
- Contains not only the domain model but also related UI, services, database schemas, and infrastructure for that context.
- Aligns closely with a single team's ownership.
- Size is bounded by team cognitive load — if a team can't own it, split it.

---

### Chapter 3: Context Maps

A **Context Map** is a visual drawing of the existing terrain: the Bounded Contexts in your project and the integration relationships between them.

**Draw a Context Map first** — before writing any integration code. It gives your team the solution-space perspective needed to succeed.

**Integration relationship patterns:**

| Pattern | Abbreviation | Description |
|---------|-------------|-------------|
| Partnership | | Two teams succeed or fail together; coordinate planning and development. |
| Shared Kernel | SK | A shared subset of the domain model. Explicit agreement required for changes. |
| Customer-Supplier | U/D | Upstream (supplier) provides what downstream (customer) needs. Downstream is at upstream's mercy. |
| Conformist | | Downstream conforms to upstream's model with no translation. |
| Anticorruption Layer | ACL | Downstream isolates its model from upstream's model using a translation layer. |
| Open Host Service | OHS | Upstream publishes a protocol/API for external access. |
| Published Language | PL | A well-documented shared language for integration (e.g., JSON schema, XML schema). |
| Separate Ways | | No integration. Teams go their own way. |
| Big Ball of Mud | | An ill-defined, sprawling legacy context with tangled models. |

**ACL (Anticorruption Layer)** — The most important defensive pattern. When integrating with a legacy system or external context, always translate their model to yours at the boundary. Prevents foreign concepts from polluting your domain model.

---

### Chapter 4: Architecture

DDD is not limited to any single architecture. Architectural styles are tools to mitigate specific risks — not a "coolness factor."

#### Hexagonal Architecture (Ports and Adapters)

Codified by Alistair Cockburn. Promotes symmetry: the application's interior (domain model + application services) is wrapped by the outside (clients and infrastructure).

```
           HTTP Client
               │
           Adapter
               │
    ┌──────────▼──────────┐
    │   Application API   │  ← Port (interface)
    │  ┌───────────────┐  │
    │  │  Domain Model │  │
    │  └───────────────┘  │
    │   Application API   │  ← Port (interface)
    └──────────┬──────────┘
           Adapter
               │
         Persistence
```

- **Port** — An interface defined by the application's API.
- **Adapter** — Transforms external input into the port's contract, or transforms output to an external mechanism.
- Enables swappable infrastructure (database, messaging, HTTP) without touching domain logic.
- Dependency direction flows inward: adapters depend on ports, never the reverse.

#### CQRS (Command-Query Responsibility Segregation)

Separate the write model (commands that change state) from the read model (queries that return data).

- **Command side** — Uses the domain model, aggregates, and repositories. Executes business logic.
- **Query side** — Uses optimized read models, denormalized projections. No domain logic.
- Allows independent scaling of read and write workloads.
- Eventual consistency between write and read models is acceptable and expected.

#### Event-Driven Architecture

- Components communicate through domain events published to an event bus.
- Enables loose coupling between bounded contexts.
- **Event Sourcing** — Store the sequence of events (not the current state) as the source of truth. Aggregate state is reconstituted by replaying events.
- **Long-Running Processes (Sagas)** — Coordinate multi-step, multi-aggregate workflows using domain events and compensating transactions.

---

## Part II — Tactical Design

### Chapter 5: Entities

**Use an Entity** when you care about the individuality of an object — when distinguishing it from all other objects is a mandatory constraint.

An Entity:
- Has a **unique identity** that persists over its entire lifetime.
- Is **mutable** — state changes over time while identity remains stable.
- Is equal to another Entity only when their identities match.

```typescript
// Entity with stable identity and private constructor
export class BacklogItem {
  private constructor(
    private readonly _id: BacklogItemId,
    private _title: BacklogItemTitle,
    private _status: BacklogItemStatus,
  ) {}

  static create(id: BacklogItemId, title: BacklogItemTitle): BacklogItem {
    return new BacklogItem(id, title, BacklogItemStatus.Planned);
  }

  get id(): BacklogItemId { return this._id; }

  equals(other: BacklogItem): boolean {
    return this._id === other._id;
  }
}
```

**Identity generation strategies:**
1. **User provides identity** — User enters a natural key (e.g., username). Validate uniqueness at boundary.
2. **Application generates identity** — Use UUID v4 at creation time. Most common for aggregates.
3. **Persistence mechanism generates identity** — Database auto-increment. Delay until after save; problematic for domain events.
4. **Another Bounded Context assigns identity** — Integrate and adopt their identity.

**Prefer early identity generation** — Generate identity before persistence so domain events can carry the correct ID.

**Validation:**
- Validate at construction (factory method or constructor).
- Each setter/command method validates its own invariants.
- Do not use anemic validation objects — keep rules inside the aggregate.

---

### Chapter 6: Value Objects

A **Value Object** measures, quantifies, or describes a thing in the domain. It is NOT a thing itself.

**Six characteristics of a Value Object:**
1. **Measures, Quantifies, or Describes** — A `Name` describes a `Person`; an `Age` quantifies years lived.
2. **Immutable** — Created once; state never changes. Replace entirely when the value changes.
3. **Conceptual Whole** — Composes related attributes as one integral unit (e.g., `Money = amount + currency`).
4. **Replaceable** — When the measurement changes, replace the whole value object.
5. **Value Equality** — Two VOs are equal when all their attributes are equal.
6. **Side-Effect-Free Behavior** — Methods return new instances; they do not modify state.

```typescript
// Value Object with Zod brand type
import { z } from 'zod';

export const MoneySchema = z.object({
  amount: z.number().nonnegative(),
  currency: z.enum(['USD', 'EUR', 'TWD']),
}).brand('Money');
export type Money = z.infer<typeof MoneySchema>;

// Factory enforces construction rules
export function createMoney(amount: number, currency: string): Money {
  return MoneySchema.parse({ amount, currency });
}

// Side-effect-free method: returns new instance
export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) throw new Error('Currency mismatch');
  return createMoney(a.amount + b.amount, a.currency);
}
```

**Prefer Value Objects over primitives** — Replace `string` email with `Email`, replace `number` amount with `Money`. This eliminates primitive obsession and co-locates validation with the concept.

**Persist Value Objects by:**
- Embedding directly into the owning Entity's row (preferred for single VOs).
- Serializing multiple values into one column (simple lists).
- Using a separate table backed by a join (when needed for query).

---

### Chapter 7: Domain Services

A Domain Service is used when a significant process or transformation in the domain is **not a natural responsibility of an Entity or Value Object**.

```
Sometimes, it just isn't a thing...
When a significant process or transformation in the domain is not a
natural responsibility of an Entity or Value Object, add an operation
to the model as a standalone interface declared as a Service.
Define the interface in terms of the language of the model and make
sure the operation name is part of the Ubiquitous Language.
Make the Service stateless. — Evans
```

**Domain Service vs Application Service:**

| | Domain Service | Application Service |
|-|---------------|---------------------|
| Layer | `domain/services/` | `application/use-cases/` |
| Contains | Business logic / invariants | Orchestration only |
| State | Stateless | Stateless |
| Dependencies | Domain interfaces only | Domain + infrastructure interfaces |
| Client | Application Services | UI / API layer |

**When to use a Domain Service:**
- A business rule or calculation spans multiple Aggregates.
- The operation involves significant domain logic that doesn't belong to any single Aggregate.
- The operation name is part of the Ubiquitous Language.

```typescript
// Domain Service: interface in domain/, implementation in infrastructure/ or application/
export interface EncryptionService {
  encryptText(plainText: string): string;
  decryptText(cipherText: string): string;
}

// Application Service uses Domain Service
export class CreateMemberUseCase {
  constructor(
    private readonly memberRepo: MemberRepository,
    private readonly encryptionService: EncryptionService,
  ) {}

  async execute(input: CreateMemberInput): Promise<CommandResult> {
    const encrypted = this.encryptionService.encryptText(input.password);
    const member = Member.create(generateId(), input.email, encrypted);
    await this.memberRepo.save(member);
    return { success: true, aggregateId: member.id };
  }
}
```

---

### Chapter 8: Domain Events

> Something happened that domain experts care about.

A **Domain Event** is a full-fledged part of the domain model, representing something that happened in the domain.

**Listen for event signals in conversations with domain experts:**
- "When..." → explicit trigger
- "If that happens..." → conditional outcome
- "Inform me if..." / "Notify me if..." → publication need
- "An occurrence of..." → named event concept

**Naming conventions:**
- Name in **past tense**: `BacklogItemCommitted`, `WorkspaceCreated`, `MemberInvited`
- Derive from the command that caused it: command `commitTo(sprint)` → event `BacklogItemCommitted`
- Include enough context to be self-descriptive

```typescript
// Domain Event definition with Zod
import { z } from 'zod';

export const BacklogItemCommittedSchema = z.object({
  type: z.literal('agile-pm.backlog-item-committed'),
  eventId: z.string().uuid(),
  occurredAt: z.string().datetime(), // ISO 8601 string — NOT Date object
  payload: z.object({
    backlogItemId: z.string().uuid(),
    sprintId: z.string().uuid(),
    committedBy: z.string(),
  }),
});
export type BacklogItemCommitted = z.infer<typeof BacklogItemCommittedSchema>;
```

**Event publication lifecycle:**
1. Aggregate method executes business logic and records event in `_domainEvents`.
2. Application Service (Use Case) saves the Aggregate to the repository first.
3. Application Service pulls events via `pullDomainEvents()`.
4. Application Service publishes events to the event bus / QStash.

```
⚠️ NEVER publish events before persistence. Always: save first, publish second.
```

**Spreading events to remote Bounded Contexts:**
- Use **messaging middleware** (QStash, Kafka) for at-least-once delivery.
- Use **RESTful notifications** (polling a notification log) for pull-based consumers.
- Store events in an **Event Store** for auditability and replay.

---

### Chapter 9: Modules

**Modules** are named containers for closely related domain objects. They are a form of design-level naming that reflects the Ubiquitous Language.

**Rules for module design:**
- Module names come directly from the Ubiquitous Language.
- Modules group tightly cohesive domain concepts that must change together.
- Modules have low coupling to other modules.
- Module names should be meaningful nouns in the domain: `product`, `sprint`, `backlog`, not `util` or `helper`.
- Name modules by the model, not the technical layer.

**Relationship to Bounded Contexts:**
- A module is finer-grained than a Bounded Context.
- Multiple modules can exist within one Bounded Context.
- If a module grows large enough to warrant its own team, it may become a Bounded Context.

In Xuanwu's MDDD structure: the `modules/<context>/` folder is a Bounded Context; sub-folders (`domain/aggregates/`, `domain/events/`, etc.) are the module-level groupings within it.

---

### Chapter 10: Aggregates

An **Aggregate** is a cluster of associated domain objects (Entities + Value Objects) treated as a unit for data changes. Each Aggregate has an **Aggregate Root** — the single Entity through which all external access occurs.

#### The Four Rules of Aggregate Design

**Rule 1: Model True Invariants in Consistency Boundaries**

An invariant is a business rule that must always be consistent — atomically, within a single transaction.

> Design each Aggregate so that ALL of its invariants can be satisfied within ONE transaction on ONE Aggregate instance.

```
✅ One transaction modifies ONE Aggregate instance
❌ One transaction modifies MULTIPLE Aggregate instances
```

**Rule 2: Design Small Aggregates**

Start with a single Entity as the Aggregate Root. Add only what is truly necessary to enforce invariants. Large clusters cause:
- Performance degradation
- Scalability bottlenecks
- Increased transaction contention
- Higher failure rates

> When in doubt, make it smaller. You can always merge later if invariants demand it.

**Rule 3: Reference Other Aggregates by Identity Only**

Never hold a direct object reference to another Aggregate Root from inside your Aggregate. Reference by ID only.

```typescript
// ❌ WRONG: direct object reference creates implicit coupling
class BacklogItem {
  private sprint: Sprint; // holds entire Sprint aggregate
}

// ✅ CORRECT: reference by identity only
class BacklogItem {
  private sprintId: SprintId; // identity reference only
}
```

Benefits:
- Enforces boundary: you cannot modify two Aggregates in one transaction by accident.
- Enables independent scaling and distribution.
- Forces you to use repositories for navigation.

**Rule 4: Use Eventual Consistency Outside the Boundary**

When a change in one Aggregate must affect another Aggregate, use eventual consistency via Domain Events, not a single transaction spanning both.

```
Q: If not in the same transaction, when should it be consistent?
A: Ask: "Whose job is it to enforce this consistency?"
   If the answer is "the user's job" → immediate consistency is fine.
   If the answer is "the system's eventual job" → use domain events.
```

**Aggregate Root implementation pattern:**

```typescript
export class Product {
  private readonly _id: ProductId;
  private _backlogItems: BacklogItemId[] = []; // identity refs only
  private _domainEvents: DomainEvent[] = [];

  private constructor(id: ProductId, /* ... */) {
    this._id = id;
  }

  static create(id: ProductId, name: ProductName, ownerId: TenantId): Product {
    const product = new Product(id, name, ownerId);
    product._domainEvents.push({
      type: 'agile-pm.product-created',
      eventId: crypto.randomUUID(),
      occurredAt: new Date().toISOString(),
      payload: { productId: id, name, ownerId },
    });
    return product;
  }

  static reconstitute(snapshot: ProductSnapshot): Product {
    return new Product(snapshot.id as ProductId, /* ... */);
  }

  scheduleBacklogItem(backlogItemId: BacklogItemId): void {
    if (this._backlogItems.includes(backlogItemId)) return;
    this._backlogItems.push(backlogItemId);
    this._domainEvents.push({ /* BacklogItemScheduled event */ });
  }

  get id(): ProductId { return this._id; }

  getSnapshot(): Readonly<ProductSnapshot> {
    return Object.freeze({ id: this._id, /* ... */ });
  }

  pullDomainEvents(): DomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }
}
```

**When to break the rules:**
- Rule-breaking is sometimes necessary: UI convenience, lack of technical mechanisms, global transactions (rare), query performance.
- Document the reason explicitly.
- Ensure business stakeholders accept the eventual consistency window.

---

### Chapter 11: Factories

A **Factory** encapsulates the creation complexity of domain objects. Use when construction requires multiple steps, external collaborators, or domain rules.

**Factory types:**
1. **Static factory method** on the Aggregate Root — `Product.create(...)`. Preferred for creating new instances.
2. **Reconstitution factory** — `Product.reconstitute(snapshot)`. Used by Repositories to rebuild from stored state.
3. **Separate Factory class** — For complex creation that involves external inputs (another Bounded Context's data, external services).

```typescript
// Factory Method on Aggregate Root (create new)
static create(id: ProductId, input: CreateProductInput): Product { ... }

// Reconstitution factory (rebuild from persistence)
static reconstitute(data: ProductData): Product { ... }
```

**Factory responsibilities:**
- Enforce all creation invariants — an invalid object must never be constructed.
- Accept inputs in terms of the Ubiquitous Language.
- Shield clients from the complexity of assembling an object graph.

**Factory is NOT responsible for persistence.** Factories create objects; Repositories persist them.

---

### Chapter 12: Repositories

A **Repository** provides the illusion of an in-memory collection of Aggregate Roots. It mediates between the domain model and the data mapper/persistence layer.

**One Repository per Aggregate Root** — never one per Entity or Value Object.

**Two Repository styles:**

| Style | Interface hints | Best for |
|-------|----------------|----------|
| Collection-oriented | `add()`, `remove()` — no "save" method | ORM with change tracking (Hibernate, EF) |
| Persistence-oriented | `save()`, `saveAll()` — explicit persistence | Firebase, Redis, NoSQL, REST |

```typescript
// Repository interface — belongs in domain/repositories/
export interface ProductRepository {
  findById(id: ProductId): Promise<Product | null>;
  findAll(tenantId: TenantId): Promise<Product[]>;
  save(product: Product): Promise<void>;
  remove(product: Product): Promise<void>;
}

// Firebase implementation — belongs in infrastructure/firebase/
export class FirebaseProductRepository implements ProductRepository {
  constructor(private readonly firestore: Firestore) {}

  async findById(id: ProductId): Promise<Product | null> {
    const doc = await this.firestore.collection('products').doc(id).get();
    if (!doc.exists) return null;
    return Product.reconstitute(doc.data() as ProductData);
  }

  async save(product: Product): Promise<void> {
    await this.firestore.collection('products').doc(product.id).set(product.getSnapshot());
  }
}
```

**Repositories are NOT:**
- For managing Entity children (those live inside the Aggregate).
- For executing bulk queries across Aggregates for display (use read models / projections for that).

**Query methods on Repositories:**
- Keep query methods focused on what is needed to enforce invariants.
- For complex reporting queries, bypass the domain model and query a read model directly (CQRS query side).

---

### Chapter 13: Integrating Bounded Contexts

Bounded Contexts must integrate through explicit contracts, never through shared databases or shared domain model code.

**Integration patterns:**

1. **REST / Open Host Service** — Publish a stable HTTP API. Consumers use Published Language (documented schema).
2. **Messaging / Domain Events** — Publish events to a message bus. Consumers subscribe and handle asynchronously.
3. **Anti-Corruption Layer (ACL)** — Translate the upstream model into your domain model using a dedicated translator/adapter. Protects your model from pollution.

**Event-based integration workflow:**

```
Bounded Context A         Message Bus         Bounded Context B
─────────────────         ───────────         ─────────────────
Aggregate publishes   →   Event topic   →   Event subscriber
domain event              (QStash)          translates to B's
                                            Ubiquitous Language
                                            via ACL adapter
```

**Autonomous Services principle:** Each Bounded Context should be independently deployable and functional. Avoid synchronous hard dependencies between contexts where possible.

---

### Chapter 14: Application

The **Application Layer** orchestrates use cases. It sits between the user interface and the domain model.

**Application Service responsibilities:**
- Receive input from the interface layer (UI, API, message handler).
- Validate/authenticate the request.
- Load Aggregate(s) from Repository.
- Invoke domain behavior on the Aggregate.
- Save Aggregate via Repository.
- Publish domain events.
- Return a result to the caller.

```typescript
// Application Service / Use Case — application/use-cases/
export class CommitBacklogItemToSprintUseCase {
  constructor(
    private readonly backlogItemRepo: BacklogItemRepository,
    private readonly sprintRepo: SprintRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(input: CommitBacklogItemInput): Promise<CommandResult> {
    const backlogItem = await this.backlogItemRepo.findById(
      BacklogItemIdSchema.parse(input.backlogItemId)
    );
    if (!backlogItem) return { success: false, error: 'BacklogItem not found' };

    backlogItem.commitToSprint(SprintIdSchema.parse(input.sprintId));

    // 1. Persist first
    await this.backlogItemRepo.save(backlogItem);

    // 2. Publish events after persistence
    const events = backlogItem.pullDomainEvents();
    await this.eventPublisher.publishAll(events);

    return { success: true, aggregateId: input.backlogItemId };
  }
}
```

**Application Services must be thin:**
- No business logic inside an Application Service.
- Business logic belongs in the domain model.
- Application Service = workflow coordinator, not decision maker.

**User Interface concerns:**
- The UI renders a Presentation Model (DTO/ViewModel), not a domain Aggregate.
- Never expose Aggregate internals directly to the UI.
- Use DTOs to transfer data across the boundary.

---

## Quick Reference: Choosing the Right Building Block

| Scenario | Use |
|----------|-----|
| Unique, trackable, mutable thing | **Entity** |
| Descriptive, immutable, replaceable concept | **Value Object** |
| Cluster of entities/VOs with consistency rules | **Aggregate** |
| Stateless domain operation spanning multiple objects | **Domain Service** |
| Something significant that happened | **Domain Event** |
| Complex object creation | **Factory** |
| Aggregate persistence abstraction | **Repository** |
| Workflow orchestration | **Application Service** |
| Grouping of related domain objects | **Module** |
| Explicit model boundary with its own UL | **Bounded Context** |
| Visual integration map | **Context Map** |

---

## Common Anti-Patterns (from IDDD)

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| Anemic Domain Model | Entities/VOs have only getters/setters; logic lives in services | Move business rules into Aggregates |
| Large-Cluster Aggregate | One Aggregate holds too many child entities | Apply Rule 2: Design Small Aggregates |
| Direct cross-Aggregate object references | Tight coupling, can't modify independently | Apply Rule 3: Reference by Identity Only |
| Logic in Application Service | Business decisions in use cases, not domain | Move decision logic into Aggregate methods |
| Shared database integration | Two contexts share tables | Integrate via events or REST with ACL |
| Missing Ubiquitous Language | Code terms differ from business terms | Align code naming with domain expert vocabulary |
| Persistence concerns in domain | Domain objects know about DB | Use Repository pattern + ACL |

---

## Xuanwu-Specific Application

In the Xuanwu codebase, these IDDD patterns map to:

| IDDD Concept | Xuanwu Location |
|-------------|----------------|
| Bounded Context | `modules/<context>/` |
| Aggregate Root | `modules/<context>/domain/aggregates/` |
| Value Object (Zod branded) | `modules/<context>/domain/value-objects/` |
| Domain Event (Zod schema) | `modules/<context>/domain/events/` |
| Repository interface | `modules/<context>/domain/repositories/` |
| Firebase Repository impl | `modules/<context>/infrastructure/firebase/` |
| Domain Service interface | `modules/<context>/domain/services/` |
| Application Service / Use Case | `modules/<context>/application/use-cases/` |
| Context Map (ACL adapter) | `modules/<context>/infrastructure/adapters/` |
| Module public API | `modules/<context>/api/` |
| Application composition | `app/` |

> Always cross-reference `modules/bounded-contexts.md` and `modules/<context>/ubiquitous-language.md` before naming new domain concepts.
