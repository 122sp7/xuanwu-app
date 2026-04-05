# Aggregates ??notebook

## ???對?Thread

### ?瑁痊
隞?”銝??AI 撠店銝脯???摨? Message ?”嚗恣??閰望風?脯?

### ?撅祆?

| 撅祆?| ? | 隤芣? |
|------|------|------|
| `id` | `ID` | Thread 銝駁 |
| `messages` | `Message[]` | ??閮?” |
| `createdAt` | `string` | ISO 8601 |
| `updatedAt` | `string` | ISO 8601 |

### 銝???

- messages ?”蝬剜?餈賢???嚗??舫??唳?摨?
- Thread 銝?芷 Message嚗?質蕭??

---

## ?潛隞塚?Message

### ?瑁痊
Thread 銝剔??桀?閮嚗??航?嚗mmutable嚗?

| 撅祆?| ? | 隤芣? |
|------|------|------|
| `id` | `ID` | 閮銝駁 |
| `role` | `MessageRole` | `"user" \| "assistant" \| "system"` |
| `content` | `string` | 閮?批捆?? |
| `createdAt` | `string` | ISO 8601 |

---

## Repository Interfaces

| 隞 | 隤芣? |
|------|------|
| `NotebookRepository` | 撠? Genkit AI ?澆嚗generateResponse(input)` |

### GenerateNotebookResponseInput

```typescript
interface GenerateNotebookResponseInput {
  readonly prompt: string;
  readonly model?: string;    // ?身 Gemini 2.0 flash
  readonly system?: string;   // System prompt
}
```

### GenerateNotebookResponseResult

```typescript
type GenerateNotebookResponseResult =
  | { ok: true; data: NotebookResponse }
  | { ok: false; error: DomainError };

interface NotebookResponse {
  readonly text: string;
  readonly model: string;
  readonly finishReason?: string;
}
```
