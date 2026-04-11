# Directory Structure

```
.github/
  agents/
    ai-genkit-lead.agent.md (41 lines)
    app-router.agent.md (48 lines)
    chunk-strategist.agent.md (35 lines)
    commands.md (54 lines)
    doc-ingest.agent.md (36 lines)
    domain-architect.agent.md (68 lines)
    domain-lead.agent.md (46 lines)
    e2e-qa.agent.md (46 lines)
    embedding-writer.agent.md (35 lines)
    firestore-schema.agent.md (33 lines)
    frontend-lead.agent.md (37 lines)
    genkit-flow.agent.md (41 lines)
    hexagonal-ddd-architect.agent.md (51 lines)
    kb-architect.agent.md (44 lines)
    knowledge-base.md (55 lines)
    lint-rule-enforcer.agent.md (38 lines)
    prompt-engineer.agent.md (38 lines)
    quality-lead.agent.md (52 lines)
    rag-lead.agent.md (41 lines)
    schema-migration.agent.md (33 lines)
    security-rules.agent.md (37 lines)
    server-action-writer.agent.md (33 lines)
    shadcn-composer.agent.md (40 lines)
    test-scenario-writer.agent.md (33 lines)
    ts-interface-writer.agent.md (39 lines)
  instructions/
    architecture-api-boundary.instructions.md (34 lines)
    architecture-hexagonal-ddd.instructions.md (34 lines)
    architecture-modules.instructions.md (37 lines)
    architecture-monorepo.instructions.md (32 lines)
    bounded-context-rules.instructions.md (28 lines)
    branching-strategy.instructions.md (19 lines)
    ci-cd.instructions.md (20 lines)
    cloud-functions.instructions.md (29 lines)
    commit-convention.instructions.md (19 lines)
    doc-governance.instructions.md (26 lines)
    domain-modeling.instructions.md (124 lines)
    embedding-pipeline.instructions.md (23 lines)
    event-driven-state.instructions.md (107 lines)
    firebase-architecture.instructions.md (26 lines)
    firestore-schema.instructions.md (20 lines)
    genkit-flow.instructions.md (18 lines)
    hosting-deploy.instructions.md (14 lines)
    lint-format.instructions.md (20 lines)
    nextjs-app-router.instructions.md (19 lines)
    nextjs-parallel-routes.instructions.md (17 lines)
    nextjs-server-actions.instructions.md (18 lines)
    playwright-mcp-testing.instructions.md (98 lines)
    prompt-engineering.instructions.md (30 lines)
    rag-architecture.instructions.md (19 lines)
    security-rules.instructions.md (20 lines)
    shadcn-ui.instructions.md (16 lines)
    tailwind-design-system.instructions.md (16 lines)
    testing-e2e.instructions.md (16 lines)
    testing-unit.instructions.md (16 lines)
    ubiquitous-language.instructions.md (38 lines)
  prompts/
    analyze-repo.prompt.md (35 lines)
    chunk-docs.prompt.md (26 lines)
    debug-error.prompt.md (25 lines)
    embedding-docs.prompt.md (19 lines)
    generate-aggregate.prompt.md (50 lines)
    generate-domain-event.prompt.md (58 lines)
    implement-feature.prompt.md (27 lines)
    implement-firestore-schema.prompt.md (18 lines)
    implement-genkit-flow.prompt.md (19 lines)
    implement-security-rules.prompt.md (18 lines)
    implement-server-action.prompt.md (20 lines)
    implement-ui-component.prompt.md (21 lines)
    ingest-docs.prompt.md (20 lines)
    plan-api.prompt.md (19 lines)
    plan-feature.prompt.md (14 lines)
    plan-module.prompt.md (19 lines)
    playwright-mcp-inspect.prompt.md (163 lines)
    playwright-mcp-test.prompt.md (127 lines)
    refactor-api.prompt.md (17 lines)
    refactor-module.prompt.md (18 lines)
    review-architecture.prompt.md (18 lines)
    review-code.prompt.md (18 lines)
    review-performance.prompt.md (19 lines)
    review-security.prompt.md (13 lines)
    serena-hexagonal-ddd-refactor.prompt.md (215 lines)
    write-docs.prompt.md (18 lines)
    write-e2e-tests.prompt.md (20 lines)
    write-tests.prompt.md (18 lines)
  copilot-instructions.md (53 lines)
docs/
  contexts/
    notebooklm/
      AGENT.md (98 lines)
      bounded-contexts.md (83 lines)
      context-map.md (75 lines)
      README.md (111 lines)
      subdomains.md (72 lines)
      ubiquitous-language.md (78 lines)
    notion/
      AGENT.md (103 lines)
      bounded-contexts.md (83 lines)
      context-map.md (76 lines)
      README.md (115 lines)
      subdomains.md (75 lines)
      ubiquitous-language.md (78 lines)
    platform/
      AGENT.md (117 lines)
      bounded-contexts.md (85 lines)
      context-map.md (71 lines)
      README.md (125 lines)
      subdomains.md (91 lines)
      ubiquitous-language.md (82 lines)
    workspace/
      AGENT.md (94 lines)
      bounded-contexts.md (83 lines)
      context-map.md (75 lines)
      README.md (107 lines)
      subdomains.md (71 lines)
      ubiquitous-language.md (78 lines)
    _template.md (144 lines)
  decisions/
    0001-hexagonal-architecture.md (80 lines)
    0002-bounded-contexts.md (81 lines)
    0003-context-map.md (79 lines)
    0004-ubiquitous-language.md (79 lines)
    0005-anti-corruption-layer.md (80 lines)
    README.md (68 lines)
  architecture-overview.md (109 lines)
  bounded-context-subdomain-template.md (154 lines)
  bounded-contexts.md (80 lines)
  context-map.md (84 lines)
  integration-guidelines.md (94 lines)
  project-delivery-milestones.md (95 lines)
  README.md (90 lines)
  strategic-patterns.md (81 lines)
  subdomains.md (79 lines)
  ubiquitous-language.md (86 lines)
features/
  README.md (42 lines)
modules/
  notebooklm/
    docs/
      aggregates.md (66 lines)
      application-services.md (28 lines)
      bounded-context.md (86 lines)
      context-map.md (27 lines)
      domain-events.md (23 lines)
      domain-services.md (22 lines)
      README.md (39 lines)
      repositories.md (36 lines)
      subdomains.md (56 lines)
      ubiquitous-language.md (30 lines)
    subdomains/
      ai/
        README.md (32 lines)
      conversation/
        README.md (32 lines)
      conversation-versioning/
        README.md (31 lines)
      evaluation/
        README.md (37 lines)
      grounding/
        README.md (37 lines)
      ingestion/
        README.md (37 lines)
      note/
        README.md (31 lines)
      notebook/
        README.md (32 lines)
      retrieval/
        README.md (37 lines)
      source/
        README.md (33 lines)
      synthesis/
        README.md (35 lines)
    AGENT.md (63 lines)
    README.md (68 lines)
  notion/
    docs/
      aggregates.md (201 lines)
      application-services.md (153 lines)
      bounded-context.md (98 lines)
      context-map.md (106 lines)
      domain-events.md (113 lines)
      domain-services.md (48 lines)
      README.md (50 lines)
      repositories.md (70 lines)
      subdomains.md (83 lines)
      ubiquitous-language.md (87 lines)
    subdomains/
      attachments/
        README.md (32 lines)
      authoring/
        README.md (45 lines)
      automation/
        README.md (32 lines)
      collaboration/
        README.md (44 lines)
      database/
        README.md (55 lines)
      knowledge/
        README.md (44 lines)
      knowledge-analytics/
        README.md (32 lines)
      knowledge-integration/
        README.md (32 lines)
      knowledge-versioning/
        README.md (33 lines)
      notes/
        README.md (32 lines)
      publishing/
        README.md (37 lines)
      relations/
        README.md (37 lines)
      taxonomy/
        README.md (37 lines)
      templates/
        README.md (32 lines)
    AGENT.md (101 lines)
    README.md (108 lines)
  platform/
    docs/
      aggregates.md (181 lines)
      application-services.md (93 lines)
      bounded-context.md (151 lines)
      context-map.md (132 lines)
      domain-events.md (152 lines)
      domain-services.md (65 lines)
      README.md (79 lines)
      repositories.md (125 lines)
      subdomains.md (109 lines)
      ubiquitous-language.md (176 lines)
    subdomains/
      access-control/
        README.md (47 lines)
      account/
        README.md (51 lines)
      account-profile/
        README.md (48 lines)
      ai/
        README.md (39 lines)
      analytics/
        README.md (50 lines)
      audit-log/
        README.md (49 lines)
      background-job/
        README.md (78 lines)
      billing/
        README.md (44 lines)
      compliance/
        README.md (50 lines)
      consent/
        README.md (37 lines)
      content/
        README.md (86 lines)
      entitlement/
        README.md (37 lines)
      feature-flag/
        README.md (78 lines)
      identity/
        README.md (44 lines)
      integration/
        README.md (51 lines)
      notification/
        README.md (64 lines)
      observability/
        README.md (43 lines)
      onboarding/
        README.md (64 lines)
      organization/
        README.md (69 lines)
      platform-config/
        README.md (34 lines)
      referral/
        README.md (49 lines)
      search/
        README.md (45 lines)
      secret-management/
        README.md (37 lines)
      security-policy/
        README.md (43 lines)
      subscription/
        README.md (49 lines)
      support/
        README.md (58 lines)
      team/
        README.md (39 lines)
      tenant/
        README.md (37 lines)
      workflow/
        README.md (48 lines)
    AGENT.md (176 lines)
    README.md (116 lines)
  workspace/
    application/
      dtos/
        AGENT.md (66 lines)
      services/
        AGENT.md (77 lines)
      use-cases/
        AGENT.md (65 lines)
    docs/
      aggregates.md (70 lines)
      application-services.md (61 lines)
      bounded-context.md (46 lines)
      context-map.md (41 lines)
      domain-events.md (42 lines)
      domain-services.md (32 lines)
      README.md (43 lines)
      repositories.md (40 lines)
      subdomains.md (54 lines)
      ubiquitous-language.md (48 lines)
    domain/
      aggregates/
        AGENT.md (64 lines)
      entities/
        AGENT.md (51 lines)
      events/
        AGENT.md (56 lines)
      factories/
        AGENT.md (44 lines)
      ports/
        input/
          AGENT.md (42 lines)
        output/
          AGENT.md (50 lines)
        README.md (43 lines)
      services/
        AGENT.md (64 lines)
      value-objects/
        AGENT.md (47 lines)
    infrastructure/
      events/
        AGENT.md (42 lines)
      firebase/
        AGENT.md (42 lines)
    interfaces/
      api/
        AGENT.md (56 lines)
      cli/
        AGENT.md (40 lines)
      web/
        AGENT.md (67 lines)
    subdomains/
      audit/
        README.md (54 lines)
      feed/
        README.md (212 lines)
      lifecycle/
        README.md (37 lines)
      membership/
        README.md (37 lines)
      presence/
        README.md (37 lines)
      scheduling/
        README.md (60 lines)
      sharing/
        README.md (37 lines)
      workspace-workflow/
        README.md (63 lines)
    AGENT.md (83 lines)
    README.md (90 lines)
py_fn/
  README.md (265 lines)
```