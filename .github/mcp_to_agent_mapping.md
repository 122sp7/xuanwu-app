.github/
│
├── agents/                          # Agent 人格定義（.md）
│   ├── commander.agent.md           # 玄武 MDDD 開發指揮官（Serena 直屬）
│   │
│   ├── domain/
│   │   ├── domain-model.agent.md    # DDD Aggregate / TS interface 設計
│   │   ├── firestore-schema.agent.md# 租戶路徑 + 資料模型設計
│   │   └── security-rules.agent.md  # Firestore Rules 分層存取控制
│   │
│   ├── frontend/
│   │   ├── app-router.agent.md      # RSC/CC 邊界 + next-devtools-mcp
│   │   ├── parallel-routes.agent.md # @slot 平行路由場景設計
│   │   ├── server-actions.agent.md  # Server Actions + Edge Runtime
│   │   └── component.agent.md       # shadcn/ui 元件 + shadcn MCP
│   │
│   ├── ai/
│   │   ├── genkit-flow.agent.md     # Genkit Flow 設計 + Tool Calling
│   │   ├── prompt-engineer.agent.md # Prompt Pipeline + 版本控制
│   │   └── rag-vector.agent.md      # markitdown MCP + Pinecone / Firestore VS
│   │
│   └── quality/
│       ├── ts-lint.agent.md         # no-any / no-admin-in-client 靜態規則
│       ├── test-coverage.agent.md   # Firestore 模擬 + Genkit 單元測試
│       ├── e2e-qa.agent.md          # playwright-mcp E2E 驗收
│       └── cicd-deploy.agent.md     # GitHub Actions + Firebase Hosting
│
├── instructions/                    # Copilot 全域 coding 規範（自動注入）
│   ├── 00-global-rules.instructions.md     # 通用：no-any、租戶路徑、no-hardcode-config
│   ├── 01-nextjs-app-router.instructions.md# App Router、RSC/CC 邊界規則
│   ├── 02-firebase-firestore.instructions.md# Firestore 路徑、Admin SDK 限制
│   ├── 03-shadcn-ui.instructions.md        # 僅 shadcn/ui，禁止其他 UI 套件
│   ├── 04-genkit-ai.instructions.md        # Genkit Flow、Tool Calling 規範
│   ├── 05-security-rules.instructions.md   # Security Rules 設計原則
│   ├── 06-context7-usage.instructions.md   # 何時呼叫 context7 查文件
│   └── 07-markitdown-rag.instructions.md   # KB 文件攝取流程規範
│
├── prompts/                         # 任務型 prompt（手動觸發 / slash command）
│   │
│   ├── scaffolding/
│   │   ├── new-feature.prompt.md    # 新功能：domain → schema → component 全流程
│   │   ├── new-agent-flow.prompt.md # 新增 Genkit Agent Flow 骨架
│   │   └── new-shadcn-page.prompt.md# 新增 shadcn/ui page + parallel route
│   │
│   ├── review/
│   │   ├── pr-review.prompt.md      # PR 審查：serena MCP 語意分析 + 規則驗證
│   │   ├── security-audit.prompt.md # Security Rules 稽核
│   │   └── ts-strict-check.prompt.md# TypeScript strict 逐檔檢查
│   │
│   ├── diagnosis/
│   │   ├── bundle-analysis.prompt.md# next-devtools-mcp bundle 分析
│   │   ├── route-debug.prompt.md    # App Router / parallel route 診斷
│   │   └── firestore-query-opt.prompt.md # Firestore 查詢優化建議
│   │
│   ├── testing/
│   │   ├── e2e-scenario.prompt.md   # playwright-mcp E2E 場景生成
│   │   ├── unit-test-gen.prompt.md  # Genkit Flow / Firestore 單元測試生成
│   │   └── security-rules-test.prompt.md # Rules 測試案例生成
│   │
│   └── rag/
│       ├── ingest-document.prompt.md# markitdown → chunk → embed 流程
│       └── kb-search-eval.prompt.md # RAG 搜尋品質評估
│
└── skills/                          # 可複用技能片段（Agent 引用）
    ├── firestore/
    │   ├── tenant-path-pattern.skill.md   # /orgs/{orgId}/... 路徑範式
    │   ├── subcollection-design.skill.md  # subcollection vs map 選擇
    │   └── batch-write-pattern.skill.md   # batch / transaction 最佳實踐
    │
    ├── nextjs/
    │   ├── rsc-cc-boundary.skill.md       # RSC / Client Component 切分
    │   ├── parallel-route-slot.skill.md   # @slot 實作範式
    │   ├── streaming-suspense.skill.md    # Streaming + Suspense 整合
    │   └── server-action-pattern.skill.md # Server Action 安全寫法
    │
    ├── genkit/
    │   ├── flow-definition.skill.md       # Flow 定義 + input/output schema
    │   ├── tool-calling.skill.md          # Tool / Function Calling 封裝
    │   └── prompt-template.skill.md       # Prompt 版本化管理
    │
    ├── shadcn/
    │   ├── component-composition.skill.md # Radix primitive 組合範式
    │   ├── design-token.skill.md          # CSS variable + dark mode token
    │   └── form-pattern.skill.md          # react-hook-form + zod + shadcn
    │
    ├── rag/
    │   ├── markitdown-ingest.skill.md     # markitdown MCP 文件轉換流程
    │   ├── chunking-strategy.skill.md     # chunk size / overlap 策略
    │   └── vector-search-query.skill.md   # Pinecone / Firestore VS 查詢
    │
    └── testing/
        ├── playwright-scenario.skill.md   # playwright-mcp 場景範式
        ├── firestore-emulator.skill.md    # Firestore emulator 測試設定
        └── genkit-flow-test.skill.md      # Genkit Flow 單元測試範式