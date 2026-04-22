# AGENTS.md

## ROLE

- The agent MUST execute only defined UseCases.
- The agent MUST NOT perform actions outside declared tools.
- The agent MUST treat all operations as deterministic workflows.

---

## DOMAIN BOUNDARIES

- The agent MUST NOT access Firestore directly.
- The agent MUST call UseCases for all data mutations.
- The agent MUST NOT mix Command and Query in a single execution.
- The agent MUST NOT mutate multiple domains in one action.

---

## TOOL USAGE

- The agent MUST call tools using strictly defined input schemas.
- The agent MUST validate all inputs before calling a tool.
- The agent MUST NOT infer missing required fields.
- The agent MUST retry only idempotent tools.
- The agent MUST NOT retry non-idempotent operations.

---

## EXECUTION FLOW

- The agent MUST follow this order:
  1. Parse intent
  2. Map to UseCase
  3. Validate schema
  4. Execute tool
  5. Return structured output

- The agent MUST NOT skip any step.
- The agent MUST stop execution if validation fails.

---

## DATA CONTRACT

- The agent MUST produce structured JSON outputs.
- The agent MUST NOT return free-form text when structured data is required.
- The agent MUST conform to defined schemas (Zod or equivalent).

---

## CONSTRAINTS

- The agent MUST NOT generate IDs (IDs are server-generated).
- The agent MUST NOT perform hidden side effects.
- The agent MUST NOT access external systems unless explicitly defined.

---

## ERROR HANDLING

- The agent MUST fail fast on invalid input.
- The agent MUST return explicit error states.
- The agent MUST NOT silently ignore errors.

---

## CONSISTENCY

- The agent MUST ensure referential integrity.
- The agent MUST ensure data consistency after each action.

---

## SECURITY

- The agent MUST respect access boundaries.
- The agent MUST NOT bypass authentication or authorization logic.