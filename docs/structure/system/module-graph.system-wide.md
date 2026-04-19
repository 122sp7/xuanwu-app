
# System-Wide Module Graph

本圖反映 0014-main-domain-resplit.md 確立的八主域重切 baseline。

凡例：
  subdomain          = Baseline subdomain（已基線化）
  [subdomain]        = Recommended Gap subdomain（尚未基線化，待 ADR 確認）
  T0 / T1 / … / SINK = Upstream→Downstream Tier（越小越上游）

---

## Upstream → Downstream Dependency Map

  Upstream     │  Downstream
  ─────────────┼───────────────────────────────────────────────────────────
  iam          │  billing · platform · workspace · notion · notebooklm
  billing      │  workspace · notion · notebooklm
  ai           │  notion · notebooklm
  platform     │  workspace
  workspace    │  notion · notebooklm
  notion       │  notebooklm
  (all above)  │  analytics  ← 事件 / 投影 sink，不反向寫回任何上游

---

## Domain + Subdomain Inventory

─────────────────────────────────────────────────────────────────────────────
T0  IAM                     BILLING                 AI
    身份與存取治理上游       商業與權益治理上游       共享 AI Capability 上游
─────────────────────────────────────────────────────────────────────────────

    identity                billing                 generation
    access-control          subscription            orchestration
    tenant                  entitlement             distillation
    security-policy         referral                retrieval
    account                                          memory
    account-profile                                  context
    organization                                     safety
    team                                             tool-calling
                                                     reasoning
                                                     conversation
                                                     evaluation
                                                     tracing

    [session]               [pricing]               [provider-routing]
    [consent]               [invoice]               [model-policy]
    [secret-governance]     [quota-policy]

─────────────────────────────────────────────────────────────────────────────
T1  PLATFORM
    平台營運支撐
─────────────────────────────────────────────────────────────────────────────

    notification            audit-log
    background-job          observability
    content                 support
    search                  workflow
    platform-config         compliance
    feature-flag            integration
    onboarding

    > account / account-profile / organization / team → 已遷入 T0 iam

    [consent]               [secret-management]     [operational-catalog]

─────────────────────────────────────────────────────────────────────────────
T2  WORKSPACE
    協作容器與工作區範疇
─────────────────────────────────────────────────────────────────────────────

    audit                   issue                   settlement
    feed                    orchestration           task
    scheduling              quality                 task-formation
    approve

    [lifecycle]             [membership]
    [sharing]               [presence]

─────────────────────────────────────────────────────────────────────────────
T3  NOTION
    正典知識內容
─────────────────────────────────────────────────────────────────────────────

    knowledge               automation
    authoring               external-knowledge-sync
    collaboration           notes
    database                templates
    knowledge-engagement     knowledge-versioning
    attachments

    taxonomy                relations               publishing

─────────────────────────────────────────────────────────────────────────────
T4  NOTEBOOKLM
    對話與推理輸出
─────────────────────────────────────────────────────────────────────────────

    conversation            source
    note                    synthesis
    notebook                conversation-versioning

    [ingestion]             [retrieval]
    [grounding]             [evaluation]

─────────────────────────────────────────────────────────────────────────────
SINK  ANALYTICS
      Read model / 事件 sink，下游 only，不反向擁有任何上游正典
─────────────────────────────────────────────────────────────────────────────

    reporting               telemetry-projection
    metrics
    dashboards

    [experimentation]       [decision-support]

---

## Ownership Rules（速查）

  iam         → 身份、tenant、access decision、**account、organization**；不擁有商業、內容、推理正典
  billing     → subscription、entitlement；不擁有身份治理或內容正典
  ai          → shared AI capability；不擁有 notion 或 notebooklm 的語言
  platform    → operational services（notification、search、audit-log 等）；account/org 已遷入 iam
  workspace   → 工作區範疇與 membership；不擁有平台治理或正典內容
  notion      → 正典知識內容；不擁有治理或推理流程
  notebooklm  → 推理流程與衍生輸出；不擁有正典知識內容
  analytics   → 下游 read model sink；不反向成為上游 canonical owner

---

## Document Network

  architecture-overview.md  — 全域架構與主域關係
  bounded-contexts.md        — 主域與子域所有權詳目
  context-map.md             — Upstream/Downstream published language 對照
  ubiquitous-language.md     — 戰略術語權威
