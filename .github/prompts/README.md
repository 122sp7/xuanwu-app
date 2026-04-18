# Prompt Catalog

本目錄提供可重用的「規劃 / 實作 / 審查 / 測試」工作流提示。

## Quick Selection

| Goal | Use prompts |
|---|---|
| Analyze / plan | `analyze-repo`, `plan-feature`, `plan-api`, `plan-module`, `feature-design` |
| Implement feature | `implement-feature`, `implement-server-action`, `implement-ui-component`, `implement-state-machine`, `implement-zustand-store` |
| Domain / architecture generation | `domain-modeling`, `use-case-generation`, `generate-aggregate`, `generate-value-object`, `generate-domain-event`, `firebase-adapter`, `refactor-module`, `refactor-api` |
| Data / security / AI flow | `implement-firestore-schema`, `implement-security-rules`, `implement-genkit-flow`, `chunk-docs`, `ingest-docs`, `embedding-docs` |
| QA / review | `review-code`, `review-architecture`, `review-security`, `review-performance`, `write-tests`, `write-e2e-tests`, `playwright-mcp-test`, `playwright-mcp-inspect`, `debug-error` |
| Repo-scale maintenance | `enforce-hexagonal-ddd-convergence`, `serena-hexagonal-ddd-refactor`, `write-docs` |

## Authoring Contract

請遵守 `../instructions/prompt-engineering.instructions.md`：
- clear frontmatter
- executable workflow
- explicit output contract
- least-privilege tools

## Notes

- Prompt 是流程模板，不是架構權威來源。
- 架構與命名真相請回到 `docs/**/*`。
