# Directory Structure

```
docs/
  _archive/
    decisions/
      adr/
        README.md (1 lines)
      ai/
        README.md (1 lines)
      architecture/
        README.md (1 lines)
      data/
        README.md (1 lines)
      domain/
        README.md (1 lines)
      meta/
        README.md (1 lines)
      platform/
        README.md (1 lines)
      README.md (1 lines)
    examples/
      ai/
        README.md (1 lines)
      architecture/
        README.md (1 lines)
      data/
        README.md (1 lines)
      domain/
        README.md (1 lines)
      end-to-end/
        deliveries/
          AGENTS.md (33 lines)
          README.md (10 lines)
          upload-parse-to-task-flow.md (77 lines)
        README.md (1 lines)
      modules/
        feature/
          AGENTS.md (33 lines)
          notebooklm-source-processing-task-flow.md (86 lines)
          py-fn-ts-capability-bridge.md (377 lines)
          README.md (12 lines)
          workspace-nav-notion-notebooklm-implementation-guide.md (215 lines)
        README.md (1 lines)
      README.md (1 lines)
    structure/
      ai/
        README.md (1 lines)
      contexts/
        ai/
          AGENTS.md (34 lines)
          bounded-contexts.md (61 lines)
          context-map.md (50 lines)
          cross-runtime-contracts.md (99 lines)
          ddd-strategic-design.md (53 lines)
          README.md (76 lines)
          subdomains.md (96 lines)
          ubiquitous-language.md (49 lines)
        analytics/
          AGENTS.md (34 lines)
          bounded-contexts.md (11 lines)
          context-map.md (16 lines)
          README.md (27 lines)
          subdomains.md (20 lines)
          ubiquitous-language.md (15 lines)
        billing/
          AGENTS.md (34 lines)
          bounded-contexts.md (11 lines)
          context-map.md (14 lines)
          README.md (27 lines)
          subdomains.md (18 lines)
          ubiquitous-language.md (15 lines)
        iam/
          AGENTS.md (34 lines)
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
        README.md (1 lines)
      data/
        README.md (1 lines)
      domain/
        AGENTS.md (64 lines)
        bounded-context-subdomain-template.md (203 lines)
        bounded-contexts.md (88 lines)
        ddd-strategic-design.md (221 lines)
        event-driven-design.md (191 lines)
        README.md (95 lines)
        subdomains.md (273 lines)
        ubiquitous-language.md (166 lines)
      modules/
        README.md (1 lines)
      system/
        AGENTS.md (73 lines)
        architecture-overview.md (135 lines)
        context-map.md (121 lines)
        hard-rules-consolidated.md (415 lines)
        integration-guidelines.md (110 lines)
        module-graph.system-wide.md (134 lines)
        project-delivery-milestones.md (109 lines)
        README.md (105 lines)
        source-to-task-flow.md (100 lines)
        strategic-patterns.md (79 lines)
        ui-ux-closed-loop.md (134 lines)
      templates/
        markdown.md (189 lines)
        README.md (1 lines)
      README.md (1 lines)
    tooling/
      ci-cd/
        README.md (1 lines)
      cli/
        README.md (1 lines)
      firebase/
        firebase-architecture.md (197 lines)
        README.md (1 lines)
      firestore/
        README.md (1 lines)
      genkit/
        genkit-flow-standards.md (229 lines)
        README.md (1 lines)
      nextjs/
        README.md (1 lines)
        state-machine-model.md (186 lines)
      commands-reference.md (73 lines)
      knowledge-base-reference.md (41 lines)
      README.md (1 lines)
    README.md (1 lines)
  .refactor-tmp/
    README.md (1 lines)
  01-architecture/
    contexts/
      ai/
        bounded-contexts.md (61 lines)
        context-map.md (50 lines)
        cross-runtime-contracts.md (99 lines)
        ddd-strategic-design.md (53 lines)
        README.md (76 lines)
        subdomains.md (96 lines)
        ubiquitous-language.md (49 lines)
      analytics/
        bounded-contexts.md (11 lines)
        context-map.md (16 lines)
        README.md (27 lines)
        subdomains.md (20 lines)
        ubiquitous-language.md (15 lines)
      billing/
        bounded-contexts.md (11 lines)
        context-map.md (14 lines)
        README.md (27 lines)
        subdomains.md (18 lines)
        ubiquitous-language.md (15 lines)
      iam/
        bounded-contexts.md (12 lines)
        context-map.md (16 lines)
        README.md (42 lines)
        subdomains.md (28 lines)
        ubiquitous-language.md (17 lines)
      notebooklm/
        bounded-contexts.md (76 lines)
        context-map.md (77 lines)
        README.md (110 lines)
        subdomains.md (68 lines)
        ubiquitous-language.md (93 lines)
      notion/
        bounded-contexts.md (78 lines)
        context-map.md (78 lines)
        README.md (117 lines)
        subdomains.md (72 lines)
        ubiquitous-language.md (93 lines)
      platform/
        bounded-contexts.md (93 lines)
        context-map.md (78 lines)
        README.md (131 lines)
        subdomains.md (89 lines)
        ubiquitous-language.md (140 lines)
      workspace/
        bounded-contexts.md (91 lines)
        context-map.md (77 lines)
        README.md (126 lines)
        subdomains.md (80 lines)
        ubiquitous-language.md (119 lines)
      _template.md (143 lines)
      README.md (1 lines)
    domain/
      bounded-context-subdomain-template.md (203 lines)
      bounded-contexts.md (88 lines)
      context-map.template.md (3 lines)
      ddd-strategic-design.md (221 lines)
      event-driven-design.md (191 lines)
      README.md (95 lines)
      subdomains.md (273 lines)
      ubiquitous-language.md (166 lines)
    system/
      architecture-overview.md (135 lines)
      context-map.md (121 lines)
      hard-rules-consolidated.md (415 lines)
      integration-guidelines.md (110 lines)
      module-graph.system-wide.md (134 lines)
      project-delivery-milestones.md (109 lines)
      README.md (105 lines)
      source-to-task-flow.md (100 lines)
      strategic-patterns.md (79 lines)
      ui-ux-closed-loop.md (134 lines)
    AGENTS.md (163 lines)
    README.md (1 lines)
  02-decisions/
    adr/
      README.md (1 lines)
    README.md (1 lines)
  03-domains/
    core/
      README.md (1 lines)
    experimental/
      README.md (1 lines)
    supporting/
      README.md (1 lines)
    README.md (1 lines)
  04-examples/
    ai/
      README.md (1 lines)
    end-to-end/
      deliveries/
        README.md (10 lines)
        upload-parse-to-task-flow.md (77 lines)
      README.md (1 lines)
    modules/
      feature/
        notebooklm-source-processing-task-flow.md (86 lines)
        py-fn-ts-capability-bridge.md (377 lines)
        README.md (12 lines)
        workspace-nav-notion-notebooklm-implementation-guide.md (215 lines)
      README.md (1 lines)
    AGENTS.md (86 lines)
    README.md (1 lines)
  05-tooling/
    ci-cd/
      README.md (1 lines)
    firebase/
      firebase-architecture.md (197 lines)
      README.md (1 lines)
    genkit/
      genkit-flow-standards.md (229 lines)
      README.md (1 lines)
    nextjs/
      README.md (1 lines)
      state-machine-model.md (186 lines)
    commands-reference.md (73 lines)
    knowledge-base-reference.md (41 lines)
    README.md (1 lines)
  99-templates/
    markdown.md (189 lines)
    README.md (1 lines)
  AGENTS.md (77 lines)
  README.md (92 lines)
fn/
  AGENTS.md (96 lines)
  README.md (64 lines)
packages/
  infra/
    client-state/
      AGENTS.md (52 lines)
      README.md (38 lines)
    date/
      AGENTS.md (56 lines)
      README.md (57 lines)
    form/
      AGENTS.md (78 lines)
      README.md (120 lines)
    http/
      AGENTS.md (53 lines)
      README.md (57 lines)
    query/
      AGENTS.md (56 lines)
      README.md (59 lines)
    serialization/
      AGENTS.md (52 lines)
      README.md (39 lines)
    state/
      AGENTS.md (54 lines)
      README.md (94 lines)
    table/
      AGENTS.md (75 lines)
      README.md (143 lines)
    trpc/
      AGENTS.md (54 lines)
      README.md (55 lines)
    uuid/
      AGENTS.md (62 lines)
      README.md (44 lines)
    virtual/
      AGENTS.md (84 lines)
      README.md (137 lines)
    zod/
      AGENTS.md (53 lines)
      README.md (76 lines)
    AGENTS.md (38 lines)
    README.md (52 lines)
  integration-ai/
    AGENTS.md (65 lines)
    README.md (89 lines)
  integration-firebase/
    AGENTS.md (88 lines)
    README.md (99 lines)
  integration-queue/
    AGENTS.md (61 lines)
    README.md (86 lines)
  ui-components/
    AGENTS.md (54 lines)
    README.md (50 lines)
  ui-dnd/
    AGENTS.md (80 lines)
    README.md (169 lines)
  ui-editor/
    AGENTS.md (61 lines)
    README.md (84 lines)
  ui-markdown/
    AGENTS.md (53 lines)
    README.md (38 lines)
  ui-shadcn/
    AGENTS.md (92 lines)
    README.md (109 lines)
  ui-vis/
    AGENTS.md (85 lines)
    README.md (42 lines)
  ui-visualization/
    AGENTS.md (53 lines)
    README.md (105 lines)
  AGENTS.md (42 lines)
  README.md (51 lines)
src/
  app/
    AGENTS.md (74 lines)
    README.md (60 lines)
  modules/
    ai/
      subdomains/
        chunk/
          AGENTS.md (34 lines)
          README.md (35 lines)
        citation/
          AGENTS.md (34 lines)
          README.md (35 lines)
        context/
          AGENTS.md (34 lines)
          README.md (35 lines)
        embedding/
          AGENTS.md (34 lines)
          README.md (35 lines)
        evaluation/
          AGENTS.md (34 lines)
          README.md (35 lines)
        generation/
          AGENTS.md (34 lines)
          README.md (35 lines)
        memory/
          AGENTS.md (34 lines)
          README.md (35 lines)
        pipeline/
          AGENTS.md (34 lines)
          README.md (35 lines)
        retrieval/
          AGENTS.md (34 lines)
          README.md (35 lines)
        safety/
          AGENTS.md (34 lines)
          README.md (35 lines)
        tool-calling/
          AGENTS.md (34 lines)
          README.md (35 lines)
      AGENTS.md (73 lines)
      README.md (56 lines)
    analytics/
      subdomains/
        event-contracts/
          AGENTS.md (34 lines)
          README.md (35 lines)
        event-ingestion/
          AGENTS.md (34 lines)
          README.md (35 lines)
        event-projection/
          AGENTS.md (34 lines)
          README.md (35 lines)
        experimentation/
          AGENTS.md (34 lines)
          README.md (35 lines)
        insights/
          AGENTS.md (34 lines)
          README.md (35 lines)
        metrics/
          AGENTS.md (34 lines)
          README.md (35 lines)
        realtime-insights/
          AGENTS.md (34 lines)
          README.md (35 lines)
      AGENTS.md (71 lines)
      README.md (52 lines)
    billing/
      subdomains/
        entitlement/
          AGENTS.md (38 lines)
          README.md (35 lines)
        subscription/
          AGENTS.md (38 lines)
          README.md (35 lines)
        usage-metering/
          AGENTS.md (38 lines)
          README.md (35 lines)
      AGENTS.md (72 lines)
      README.md (48 lines)
    iam/
      subdomains/
        access-control/
          AGENTS.md (38 lines)
          README.md (35 lines)
        account/
          AGENTS.md (38 lines)
          README.md (35 lines)
        authentication/
          AGENTS.md (38 lines)
          README.md (35 lines)
        authorization/
          AGENTS.md (38 lines)
          README.md (35 lines)
        federation/
          AGENTS.md (38 lines)
          README.md (35 lines)
        identity/
          AGENTS.md (38 lines)
          README.md (35 lines)
        organization/
          AGENTS.md (38 lines)
          README.md (35 lines)
        security-policy/
          AGENTS.md (38 lines)
          README.md (35 lines)
        session/
          AGENTS.md (38 lines)
          README.md (35 lines)
        tenant/
          AGENTS.md (38 lines)
          README.md (35 lines)
      AGENTS.md (72 lines)
      README.md (55 lines)
    notebooklm/
      subdomains/
        conversation/
          AGENTS.md (20 lines)
          README.md (19 lines)
        notebook/
          AGENTS.md (20 lines)
          README.md (19 lines)
        source/
          AGENTS.md (20 lines)
          README.md (19 lines)
        synthesis/
          AGENTS.md (20 lines)
          README.md (19 lines)
      AGENTS.md (69 lines)
      README.md (49 lines)
    notion/
      subdomains/
        block/
          AGENTS.md (20 lines)
          README.md (19 lines)
        collaboration/
          AGENTS.md (20 lines)
          README.md (19 lines)
        database/
          AGENTS.md (20 lines)
          README.md (19 lines)
        knowledge/
          AGENTS.md (20 lines)
          README.md (19 lines)
        page/
          AGENTS.md (20 lines)
          README.md (19 lines)
        template/
          AGENTS.md (20 lines)
          README.md (19 lines)
        view/
          AGENTS.md (20 lines)
          README.md (19 lines)
      AGENTS.md (69 lines)
      README.md (52 lines)
    platform/
      subdomains/
        audit-log/
          AGENTS.md (20 lines)
          README.md (19 lines)
        background-job/
          AGENTS.md (20 lines)
          README.md (19 lines)
        cache/
          AGENTS.md (20 lines)
          README.md (19 lines)
        feature-flag/
          AGENTS.md (20 lines)
          README.md (19 lines)
        file-storage/
          AGENTS.md (20 lines)
          README.md (19 lines)
        notification/
          AGENTS.md (20 lines)
          README.md (19 lines)
        platform-config/
          AGENTS.md (20 lines)
          README.md (19 lines)
        search/
          AGENTS.md (20 lines)
          README.md (19 lines)
      AGENTS.md (69 lines)
      README.md (53 lines)
    template/
      subdomains/
        document/
          AGENTS.md (20 lines)
          README.md (19 lines)
        generation/
          AGENTS.md (20 lines)
          README.md (19 lines)
        ingestion/
          AGENTS.md (20 lines)
          README.md (19 lines)
        workflow/
          AGENTS.md (20 lines)
          README.md (19 lines)
      AGENTS.md (72 lines)
      README.md (51 lines)
    workspace/
      subdomains/
        activity/
          AGENTS.md (20 lines)
          README.md (19 lines)
        api-key/
          AGENTS.md (20 lines)
          README.md (19 lines)
        approval/
          AGENTS.md (20 lines)
          README.md (19 lines)
        audit/
          AGENTS.md (20 lines)
          README.md (19 lines)
        feed/
          AGENTS.md (0 lines)
          README.md (53 lines)
        invitation/
          AGENTS.md (20 lines)
          README.md (19 lines)
        issue/
          AGENTS.md (20 lines)
          README.md (19 lines)
        lifecycle/
          AGENTS.md (20 lines)
          README.md (19 lines)
        membership/
          AGENTS.md (20 lines)
          README.md (19 lines)
        orchestration/
          AGENTS.md (20 lines)
          README.md (19 lines)
        quality/
          AGENTS.md (20 lines)
          README.md (19 lines)
        resource/
          AGENTS.md (20 lines)
          README.md (19 lines)
        schedule/
          AGENTS.md (20 lines)
          README.md (19 lines)
        settlement/
          AGENTS.md (20 lines)
          README.md (19 lines)
        share/
          AGENTS.md (20 lines)
          README.md (19 lines)
        task/
          AGENTS.md (20 lines)
          README.md (19 lines)
        task-formation/
          AGENTS.md (74 lines)
          README.md (56 lines)
      AGENTS.md (69 lines)
      README.md (62 lines)
    AGENTS.md (90 lines)
    README.md (68 lines)
  AGENTS.md (76 lines)
  README.md (60 lines)
```