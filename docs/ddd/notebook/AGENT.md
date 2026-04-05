# AGENT.md ??notebook BC

## 璅∠?摰?

`notebook` ??AI 撠店??游?嚗恣??Thread/Message ??望?銝血?鋆?Genkit ?澆??

## ?隤?嚗biquitous Language嚗?

| 甇?Ⅱ銵? | 蝳迫雿輻 |
|----------|----------|
| `Thread` | Conversation?hat?ession |
| `Message` | ChatMessage?sg |
| `MessageRole` | Role嚗?其蝙?剁??peaker |
| `NotebookResponse` | AIResponse?eneratedText |
| `NotebookRepository` | AIRepository?hatRepository |

## ???閬?嚗erver Action ?

```typescript
// ??甇?Ⅱ嚗 app/(shell)/ai-chat/_actions.ts 銝剖遣蝡??action
"use server";
import { notebookApi } from "@/modules/notebook/api";
export async function generateResponse(input) {
  return notebookApi.generateResponse(input);
}

// ??蝳迫嚗 Client Component ?湔 import notebook/api
// Genkit/gRPC ??server-only嚗?撠??憭望?
import { notebookApi } from "@/modules/notebook/api"; // ??"use client" 瑼?銝?
```

## ??閬?

### ???迂
```typescript
// Server-side context only
import { notebookApi } from "@/modules/notebook/api";
import type { ThreadDTO, MessageDTO } from "@/modules/notebook/api";
```

## 撽??賭誘

```bash
npm run lint
npm run build
```
