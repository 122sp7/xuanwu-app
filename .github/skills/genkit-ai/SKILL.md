---
name: genkit-ai
description: >-
  Genkit AI Orchestration skillbook for Xuanwu. Use when designing or reviewing AI flow contracts,
  tool calling patterns, prompt pipeline management, platform.ai governance, AI output validation,
  and notebooklm vs platform.ai boundary. Covers Genkit Flows, Tool Calling, and Prompt Pipelines.
user-invocable: true
disable-model-invocation: false
---

# Genkit AI Orchestration

Use this skill when the task involves AI flow design, Genkit SDK boundaries, prompt management,
tool calling, AI output validation, or the governance split between platform.ai and notebooklm.

## Research Basis

Context7-verified + Xuanwu-specific:

- Genkit treats AI as an external untrusted actor — all output must be validated before entering domain.
- Flow input/output schemas defined with Zod ensure type safety at the AI boundary.
- Platform.ai owns provider selection, quota, and safety policy; notebooklm owns flow semantics.
- AI flows must not directly mutate Firestore or domain aggregates — they return data for use cases to act on.

## Working Synthesis

Genkit AI Orchestration in Xuanwu means:

1. AI is an external dependency — Genkit SDK exists only in infrastructure adapter layers.
2. Every flow has explicit Zod-typed input and output schemas — `any` is prohibited.
3. AI output is validated before reaching any use case or domain method.
4. platform.ai governs provider, quota, and safety; notebooklm governs retrieval/synthesis semantics.
5. All AI requests are traceable: traceId, input, output, model version, timestamps are always logged.

---

## Ownership and Boundary

### Governance Split

| Concern | Owner |
|---|---|
| Provider selection (Gemini, Vertex AI, etc.) | `platform/subdomains/ai/` |
| Quota and rate limiting | `platform/subdomains/ai/` |
| Safety policy and content filtering | `platform/subdomains/ai/` |
| Prompt registry (shared prompts) | `platform/subdomains/ai/` |
| Retrieval flow semantics | `notebooklm/infrastructure/ai/` |
| Synthesis flow semantics | `notebooklm/infrastructure/ai/` |
| Evaluation flow | `notebooklm/infrastructure/ai/` |
| Embedding pipeline | `fn/` (async worker) |

### Who May Call Genkit

- `platform/subdomains/ai/infrastructure/` — ✅ direct Genkit SDK
- `notebooklm/infrastructure/ai/` — ✅ flow definitions via injected AI port
- `notion/` — ❌ notion is AI-agnostic; zero imports from Genkit or platform.ai
- `workspace/` — ❌ workspace calls `notebooklm.api`; never calls platform.ai directly
- Any `domain/` — ❌ absolute prohibition

---

## Flow Design Rules

### 1. Always Type Input and Output with Zod

```typescript
import { defineFlow } from '@genkit-ai/core';
import { z } from 'zod';

const SynthesisInputSchema = z.object({
  notebookId: z.string().uuid(),
  query: z.string().min(1).max(2000),
  groundingChunks: z.array(z.object({
    chunkId: z.string().uuid(),
    content: z.string(),
    sourceRef: z.string(),
  })).min(1).max(20),
});

const SynthesisOutputSchema = z.object({
  answer: z.string(),
  citations: z.array(z.object({
    chunkId: z.string().uuid(),
    excerpt: z.string(),
  })),
  modelVersion: z.string(),
  completedAt: z.string().datetime(),
});

export const synthesisFlow = defineFlow(
  { name: 'notebooklm.synthesis', inputSchema: SynthesisInputSchema, outputSchema: SynthesisOutputSchema },
  async (input) => { /* ... return typed result */ }
);
```

### 2. Flow Name Convention

Format: `<module-name>.<action>` (kebab-case, lowercase)

- `notebooklm.synthesis`
- `notebooklm.retrieval`
- `notebooklm.evaluation`

### 3. File Placement

```
modules/<context>/infrastructure/ai/<name>.flow.ts
```

---

## Port + Adapter Pattern for AI

Use cases depend on an `AIOrchestrationPort` interface, not on Genkit flows directly:

```typescript
// domain/ports/AIOrchestrationPort.ts  (Port — no Genkit)
export interface AIOrchestrationPort {
  runSynthesis(input: SynthesisInput): Promise<SynthesisOutput>;
  runRetrieval(input: RetrievalInput): Promise<RetrievalOutput>;
}

// application/use-cases/synthesize-answer.use-case.ts  (depends on port only)
export class SynthesizeAnswerUseCase {
  constructor(private readonly aiPort: AIOrchestrationPort) {}
  async execute(cmd: SynthesizeAnswerCommand): Promise<SynthesisResult> {
    return this.aiPort.runSynthesis(cmd);   // port hides Genkit details
  }
}

// infrastructure/ai/GenkitAIOrchestrationAdapter.ts  (Genkit here)
import { runFlow } from '@genkit-ai/core';
import { synthesisFlow } from './synthesis.flow';

export class GenkitAIOrchestrationAdapter implements AIOrchestrationPort {
  async runSynthesis(input: SynthesisInput): Promise<SynthesisOutput> {
    const result = await runFlow(synthesisFlow, input);
    return SynthesisOutputSchema.parse(result);  // validate output
  }
}
```

---

## AI Output Validation (Mandatory)

AI output must be validated with `outputSchema.parse()` before being returned to the use case.
If validation fails, treat as an external error — do not propagate invalid AI output into domain.

```typescript
// ✅ Correct: validate AI output
const raw = await runFlow(synthesisFlow, input);
return SynthesisOutputSchema.parse(raw);

// ❌ Wrong: passthrough AI output without validation
return raw as SynthesisOutput;
```

---

## Tool Calling Rules

### Tool Definition Pattern

```typescript
import { defineTool } from '@genkit-ai/core';
import { z } from 'zod';

export const retrieveChunksTool = defineTool(
  {
    name: 'retrieveGroundingChunks',
    description: '根據查詢語句從 vector index 取回最相關的知識片段，供回答 grounding 使用',
    inputSchema: z.object({
      query: z.string().min(1),
      limit: z.number().int().min(1).max(20).default(5),
    }),
    outputSchema: z.array(z.object({
      chunkId: z.string().uuid(),
      content: z.string(),
      score: z.number().min(0).max(1),
    })),
  },
  async ({ query, limit }) => retrievalAdapter.search(query, limit)
);
```

### Tool Rules

- Tool `description` is the model's signal for when to call it — write it precisely.
- Every tool must have Zod-typed `inputSchema` and `outputSchema`.
- Tool results must be validated; never passthrough raw tool output.
- Tool files: `modules/<context>/infrastructure/ai/tools/<name>.tool.ts`

---

## Prompt Pipeline Management

- Prompts must not be scattered as magic strings inside use-case or service files.
- Use typed template functions or `definePrompt` for all prompt construction.
- System prompt and user prompt are defined and composed separately.
- Prompts that vary by model or language belong in `platform.ai` prompt registry.

```typescript
// ✅ Correct: typed template function
const buildSynthesisPrompt = (input: SynthesisInput): string => `
You are a knowledge assistant. Answer the question using only the reference material below.
Cite each claim with its source number [N].

### Reference Material
${input.groundingChunks.map((c, i) => `[${i + 1}] ${c.content}`).join('\n\n')}

### Question
${input.query}
`;

// ❌ Wrong: magic string inline in use case
const prompt = `Answer: ${query}\n${chunks.join('\n')}`;
```

---

## Traceability (Mandatory)

Every AI flow execution must log these fields:

| Field | Type | Notes |
|---|---|---|
| `traceId` | `string` (UUID) | Request unique identifier |
| `source` | `string` | `<module>.<use-case>` |
| `flowName` | `string` | Genkit flow name |
| `modelVersion` | `string` | Actual model version used |
| `inputHash` | `string` | Hash of input for dedup |
| `initiatedAt` | `string` (ISO) | Request start time |
| `completedAt` | `string` (ISO) | Request end time |
| `status` | `'success' \| 'failed'` | Outcome |
| `errorCode` | `string \| null` | Error classification on failure |

Log before sending to AI and after receiving from AI. Never lose the request-response pair.

---

## Red Flags

- `import { defineFlow }` or any Genkit symbol in `domain/` or `application/` (except injected port).
- AI flow output used without Zod validation.
- `notion/` importing from Genkit, platform.ai, or notebooklm.
- `workspace/` importing platform.ai directly instead of calling `notebooklm.api`.
- Flow without `inputSchema` or `outputSchema`.
- Prompt string constructed inline in a use case file.
- AI request with no `traceId` or no request/response logging.
- AI flow writing directly to Firestore instead of returning data to the use case.

## Review Loop

1. Confirm flow ownership: is this `platform.ai` (governance) or `notebooklm` (semantics)?
2. Verify Genkit SDK is only in `infrastructure/` adapter files.
3. Verify input and output are Zod-typed.
4. Verify AI output is validated before reaching the use case.
5. Verify use case depends on `AIOrchestrationPort`, not on flow directly.
6. Verify traceability fields are recorded for every execution.
7. Verify prompts are managed as typed templates, not magic strings.

## Output Contract

When this skill is used, provide:

1. Ownership and boundary findings (wrong layer for Genkit, missing validation),
2. Flow contract (input schema, output schema, name),
3. Port interface definition,
4. Prompt management assessment,
5. Traceability coverage gaps.
