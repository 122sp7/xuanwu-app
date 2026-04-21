# Directory Structure

```
docs/
  decisions/
    ai/
      0001-ai-chunk-embedding-pipeline-ownership.md (77 lines)
      0002-ai-safety-subdomain.md (85 lines)
      0003-ai-orchestration-formalization.md (76 lines)
      0004-ai-tracing-strategy.md (76 lines)
      0005-sap-po-structured-extraction-strategy.md (215 lines)
    architecture/
      0001-ddd-subdomain-boundary-governance.md (70 lines)
      0002-cross-runtime-nextjs-fn-bridge.md (71 lines)
      0003-module-public-api-surface.md (77 lines)
      0004-occam-gap-triage-baseline-focus.md (73 lines)
    data/
      0001-firestore-subdomain-collection-boundaries.md (101 lines)
      0002-upstash-vector-rag-storage.md (106 lines)
      0003-purchase-order-source-schema.md (203 lines)
    domain/
      0001-notebooklm-document-to-source-rename.md (67 lines)
      0002-notion-subdomain-expansion.md (96 lines)
      0003-notebooklm-synthesis-subdomain.md (92 lines)
      0004-workspace-presence-deferral.md (54 lines)
      0005-purchase-order-source-domain-model.md (283 lines)
    meta/
      0001-adr-format-and-numbering.md (74 lines)
    platform/
      0001-platform-audit-log-vs-workspace-audit.md (82 lines)
      0002-feature-flag-subdomain.md (84 lines)
      0003-platform-cache-classification.md (70 lines)
  examples/
    end-to-end/
      deliveries/
        AGENTS.md (8 lines)
        README.md (10 lines)
        upload-parse-to-task-flow.md (77 lines)
    modules/
      feature/
        AGENTS.md (8 lines)
        notebooklm-source-processing-task-flow.md (86 lines)
        py-fn-ts-capability-bridge.md (374 lines)
        README.md (12 lines)
        workspace-nav-notion-notebooklm-implementation-guide.md (215 lines)
  structure/
    contexts/
      ai/
        AGENTS.md (93 lines)
        bounded-contexts.md (61 lines)
        context-map.md (50 lines)
        cross-runtime-contracts.md (99 lines)
        ddd-strategic-design.md (53 lines)
        README.md (76 lines)
        subdomains.md (96 lines)
        ubiquitous-language.md (49 lines)
      analytics/
        AGENTS.md (82 lines)
        bounded-contexts.md (11 lines)
        context-map.md (16 lines)
        README.md (27 lines)
        subdomains.md (20 lines)
        ubiquitous-language.md (15 lines)
      billing/
        AGENTS.md (82 lines)
        bounded-contexts.md (11 lines)
        context-map.md (14 lines)
        README.md (27 lines)
        subdomains.md (18 lines)
        ubiquitous-language.md (15 lines)
      iam/
        AGENTS.md (88 lines)
        bounded-contexts.md (12 lines)
        context-map.md (16 lines)
        README.md (42 lines)
        subdomains.md (28 lines)
        ubiquitous-language.md (17 lines)
      notebooklm/
        AGENTS.md (89 lines)
        bounded-contexts.md (76 lines)
        context-map.md (77 lines)
        README.md (110 lines)
        subdomains.md (68 lines)
        ubiquitous-language.md (93 lines)
      notion/
        AGENTS.md (109 lines)
        bounded-contexts.md (78 lines)
        context-map.md (78 lines)
        README.md (117 lines)
        subdomains.md (72 lines)
        ubiquitous-language.md (93 lines)
      platform/
        AGENTS.md (105 lines)
        bounded-contexts.md (93 lines)
        context-map.md (78 lines)
        README.md (131 lines)
        subdomains.md (89 lines)
        ubiquitous-language.md (140 lines)
      workspace/
        AGENTS.md (97 lines)
        bounded-contexts.md (91 lines)
        context-map.md (77 lines)
        README.md (126 lines)
        subdomains.md (80 lines)
        ubiquitous-language.md (119 lines)
      _template.md (143 lines)
    domain/
      bounded-context-subdomain-template.md (203 lines)
      bounded-contexts.md (88 lines)
      ddd-strategic-design.md (221 lines)
      event-driven-design.md (191 lines)
      subdomains.md (273 lines)
      ubiquitous-language.md (166 lines)
    system/
      architecture-overview.md (135 lines)
      context-map.md (121 lines)
      hard-rules-consolidated.md (415 lines)
      integration-guidelines.md (110 lines)
      module-graph.system-wide.md (134 lines)
      project-delivery-milestones.md (109 lines)
      source-to-task-flow.md (94 lines)
      strategic-patterns.md (79 lines)
      ui-ux-closed-loop.md (134 lines)
  tooling/
    firebase/
      firebase-architecture.md (197 lines)
    genkit/
      genkit-flow-standards.md (229 lines)
    nextjs/
      state-machine-model.md (186 lines)
    commands-reference.md (54 lines)
    knowledge-base-reference.md (41 lines)
  AGENTS.md (39 lines)
  README.md (156 lines)
fn/
  AGENTS.md (137 lines)
  README.md (214 lines)
packages/
  infra/
    client-state/
      AGENTS.md (33 lines)
      README.md (19 lines)
    form/
      AGENTS.md (59 lines)
      README.md (101 lines)
    http/
      AGENTS.md (34 lines)
      README.md (38 lines)
    serialization/
      AGENTS.md (33 lines)
      README.md (20 lines)
    state/
      AGENTS.md (35 lines)
      README.md (75 lines)
    table/
      AGENTS.md (56 lines)
      README.md (124 lines)
    trpc/
      AGENTS.md (35 lines)
      README.md (36 lines)
    uuid/
      AGENTS.md (43 lines)
      README.md (25 lines)
    virtual/
      AGENTS.md (65 lines)
      README.md (118 lines)
    zod/
      AGENTS.md (34 lines)
      README.md (57 lines)
    AGENTS.md (47 lines)
  integration-ai/
    AGENTS.md (45 lines)
    README.md (69 lines)
  integration-firebase/
    AGENTS.md (64 lines)
    README.md (75 lines)
  integration-queue/
    AGENTS.md (42 lines)
    README.md (67 lines)
  ui-components/
    AGENTS.md (35 lines)
    README.md (31 lines)
  ui-dnd/
    AGENTS.md (61 lines)
    README.md (150 lines)
  ui-editor/
    AGENTS.md (42 lines)
    README.md (65 lines)
  ui-markdown/
    AGENTS.md (35 lines)
    README.md (20 lines)
  ui-shadcn/
    AGENTS.md (69 lines)
    README.md (86 lines)
  ui-vis/
    AGENTS.md (66 lines)
    README.md (153 lines)
  ui-visualization/
    AGENTS.md (35 lines)
    README.md (87 lines)
  AGENTS.md (107 lines)
  README.md (137 lines)
src/
  app/
    AGENTS.md (23 lines)
    README.md (19 lines)
  modules/
    ai/
      AGENTS.md (76 lines)
      README.md (111 lines)
    analytics/
      AGENTS.md (51 lines)
      README.md (64 lines)
    billing/
      AGENTS.md (46 lines)
      README.md (57 lines)
    iam/
      AGENTS.md (62 lines)
      README.md (83 lines)
    notebooklm/
      AGENTS.md (59 lines)
      README.md (70 lines)
    notion/
      AGENTS.md (62 lines)
      README.md (60 lines)
    platform/
      AGENTS.md (58 lines)
      README.md (84 lines)
    template/
      AGENTS.md (99 lines)
      README.md (266 lines)
    workspace/
      subdomains/
        feed/
          README.md (64 lines)
        task-formation/
          AGENTS.md (166 lines)
          README.md (220 lines)
      AGENTS.md (75 lines)
      README.md (85 lines)
    AGENTS.md (72 lines)
    README.md (76 lines)
  AGENTS.md (30 lines)
  README.md (8 lines)
```