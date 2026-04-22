以下為可直接使用的「規則句（Rules as Code）」版本。每一條都設計為**可被 AI / 人類直接執行或驗證**，避免敘述性文件。

---

# 📄 `AGENTS.md` — 設計規則句

```md
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
```

---

# 📄 `README.md` — 設計規則句

```md
# README.md

## PURPOSE

- The project MUST clearly state its primary problem and solution.
- The project MUST describe its core value in under 5 lines.

---

## GETTING STARTED

- The project MUST provide runnable setup commands.
- The setup MUST work without modification.
- The project MUST define all required environment variables.

---

## ARCHITECTURE

- The project MUST define high-level system components.
- The project MUST NOT include low-level implementation details.
- The architecture MUST be understandable within 1 minute.

---

## PROJECT STRUCTURE

- The project MUST expose top-level directories.
- Each directory MUST have a single clear responsibility.
- The structure MUST reflect domain boundaries.

---

## DEVELOPMENT RULES

- The project MUST enforce single responsibility for UseCases.
- The project MUST separate Command and Query.
- The project MUST prohibit direct database access from UI.

---

## AI INTEGRATION

- The project MUST define how AI interacts with the system.
- The project MUST restrict AI to UseCase-level operations.
- The project MUST NOT allow direct AI-to-database access.

---

## DOCUMENTATION

- The project MUST link to detailed documents.
- The README MUST act as an entry point, not a full specification.

---

## USABILITY

- A new developer MUST be able to run the project within 5 minutes.
- A developer MUST understand where to modify code within 3 minutes.
```

---

# 🔥 補充：設計哲學（關鍵差異）

這兩者本質不同：

| 文件        | 本質            | 語氣              |
| --------- | ------------- | --------------- |
| AGENTS.md | 行為約束（Runtime） | 強制（MUST）        |
| README.md | 導覽入口（Human）   | 指引（SHOULD/MUST） |

---

# 📌 最核心規則（濃縮版）

如果你要做到極致精簡，只保留這幾條：

### AGENTS.md

* MUST use UseCase
* MUST NOT direct DB access
* MUST validate input
* MUST follow execution flow

### README.md

* MUST run in 5 min
* MUST explain system in 1 min
* MUST show where to modify

---

這組規則句的目的只有一個：

> **讓 AI 不亂做事，讓人快速上手，讓系統維持可控**
