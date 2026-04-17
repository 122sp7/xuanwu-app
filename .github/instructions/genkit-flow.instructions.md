---
description: 'Genkit flow design and runtime-boundary rules for AI orchestration in platform.ai and notebooklm.'
applyTo: '{src/modules/platform/**/*.{ts,tsx,js,jsx},src/modules/notebooklm/**/*.{ts,tsx,js,jsx}}'
---

# Genkit Flow

## Ownership and Boundary

- `platform/subdomains/ai/` owns provider selection, quota, safety policy, and the AI adapter port.
- `notebooklm/` owns flow definitions for retrieval, grounding, synthesis, and evaluation.
- `notion/` has zero imports from Genkit or platform.ai — notion is AI-agnostic.
- `workspace/` never calls platform.ai directly; it calls `notebooklm.api` which routes internally.
- No Genkit symbol (`defineFlow`, `defineTool`, `generate`, etc.) may appear in any `domain/` layer.

## Flow Design Rules

- Every flow must declare explicit `inputSchema` and `outputSchema` using Zod.
- Never use `any`, `unknown`, or untyped objects for flow I/O.
- Flow name convention: `<module-name>.<action>` (e.g. `notebooklm.synthesis`, `notebooklm.retrieval`).
- Flow files live in `src/modules/<context>/infrastructure/ai/<name>.flow.ts`.

```typescript
// ✅ Correct: typed flow with Zod schemas
import { defineFlow } from '@genkit-ai/core';
import { z } from 'zod';

const RetrievalInputSchema = z.object({
  query: z.string().min(1).max(2000),
  notebookId: z.string().uuid(),
  limit: z.number().int().min(1).max(20).default(5),
});

const RetrievalOutputSchema = z.object({
  chunks: z.array(z.object({
    chunkId: z.string().uuid(),
    content: z.string(),
    score: z.number().min(0).max(1),
    sourceRef: z.string(),
  })),
  retrievedAt: z.string().datetime(),
});

export const retrievalFlow = defineFlow(
  { name: 'notebooklm.retrieval', inputSchema: RetrievalInputSchema, outputSchema: RetrievalOutputSchema },
  async (input) => { /* ... */ }
);
```

## AI Output Validation Rule

- AI output must be validated with `outputSchema.parse()` or Genkit's built-in schema validation before entering any use case.
- If validation fails, treat as external error — do not propagate raw AI output into domain.
- Never assign AI response directly to a domain aggregate without validation.

## Use Case ↔ Flow Integration

- Use cases depend on a port interface (`AIOrchestrationPort`), not on `defineFlow` directly.
- The port implementation (in `infrastructure/`) calls the flow and validates the result.
- Use case receives a strongly-typed result from the port — it never sees raw AI output.

```typescript
// ✅ Correct: use case depends on port, not on flow directly
export class SynthesizeAnswerUseCase {
  constructor(private readonly aiPort: AIOrchestrationPort) {}
  async execute(cmd: SynthesizeAnswerCommand): Promise<SynthesisResult> {
    return this.aiPort.runSynthesis(cmd);  // port hides Genkit details
  }
}

// ❌ Wrong: use case imports flow directly
import { synthesisFlow } from '../infrastructure/ai/synthesis.flow';
```

## Tool Calling Rules

- Tool definition files live in `src/modules/<context>/infrastructure/ai/tools/<name>.tool.ts`.
- Every tool must have a clear `description` — the model uses this to decide when to invoke the tool.
- Tool input and output must be typed with Zod schemas.
- Tool results must be validated; never passthrough raw tool output.

## Prompt Management

- Do not scatter prompt strings inside use-case or service files.
- Use `definePrompt` or a typed template function.
- System prompt and user prompt are defined separately.
- Prompts that vary by model or language belong in `platform.ai`'s prompt registry.

## Observability (Mandatory)

Every flow execution must log: `traceId`, `source` (module + use-case), `flowName`, `modelVersion`, `inputHash`, `initiatedAt`, `completedAt`, `status` (`success` | `failed`), and `errorCode` on failure.

Log before sending to AI, log after receiving from AI. Never lose the pair.

## Provider and Safety Governance

- Provider config (model name, API key, region) is owned by `platform.ai` — never hardcoded in `notebooklm`.
- Safety filters and content policy are applied at the `platform.ai` adapter layer before result returns to caller.
- `notebooklm` requests capabilities via the port; it does not configure the model directly.

## Anti-Patterns

- ❌ Importing Genkit in `domain/` or `application/` (except through the injected port interface)
- ❌ Passing unvalidated AI output to domain methods
- ❌ Calling AI from `notion/` or `workspace/` directly
- ❌ Flow without `inputSchema` or `outputSchema`
- ❌ Magic string prompts inside use-case files
- ❌ Skipping traceability logging for any AI request

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-skill
#use skill hexagonal-ddd
