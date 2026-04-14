# AI Module Docs

模組本地架構筆記。

## Current Baseline

- generation 子域持有 Genkit-backed 文字生成接縫（`GenkitAiTextGenerationAdapter`）。
- `generateAiText` 與 `summarize` 是目前對外的兩個 server functions。
- 其餘子域（orchestration、distillation、retrieval、memory、context、safety 等）為骨架，尚未實作。

## Distillation

distillation 子域負責將長輸出或多段內容濃縮為精煉知識片段（`DistillationResult`）。與 generation 的 `summarize` 差異在於輸入可以是多份文件，輸出是可引用的知識片段而非單純摘要文字。

## Public API Surface

```
modules/ai/api/index.ts       — client-safe types（AIAPI、GenerateAiTextInput、GenerateAiTextOutput、AiTextGenerationPort）
modules/ai/api/server.ts      — server-only functions（generateAiText、summarize）
```

## Architecture Notes

- Genkit 設定在 `infrastructure/generation/genkit/GenkitAiTextGenerationAdapter.ts`。
- 模型預設為 `googleai/gemini-2.5-flash`，可透過 `GENKIT_MODEL` 環境變數覆蓋。
- 子域之間的協調由 orchestration application 主控，不直接跨子域 domain 依賴。

## References

- [../../docs/contexts/ai/README.md](../../docs/contexts/ai/README.md)
- [../../docs/contexts/ai/subdomains.md](../../docs/contexts/ai/subdomains.md)
