# Directory Structure

```
.claude/
  agents/
    worker-architect.md (41 lines)
    worker-builder.md (32 lines)
    worker-explorer.md (34 lines)
    worker-research.md (202 lines)
    worker-researcher.md (37 lines)
    worker-reviewer.md (47 lines)
  commands/
    architect.md (52 lines)
    builder.md (48 lines)
    code-check.md (136 lines)
    qa-engineer.md (56 lines)
    security-auditor.md (60 lines)
    swarm-execute.md (176 lines)
    swarm-plan.md (165 lines)
    swarm-research.md (149 lines)
    swarm-review.md (133 lines)
    ui-ux-designer.md (61 lines)
  rules/
    agent-constraints.md (12 lines)
    code-quality.md (79 lines)
    core-directives.md (75 lines)
    security.md (64 lines)
    tech-strategy.md (127 lines)
  skills/
    architecture/
      capacity-planning/
        SKILL.md (89 lines)
      cloud-native-patterns/
        SKILL.md (104 lines)
      defense-in-depth/
        SKILL.md (76 lines)
      designing-apis/
        SKILL.md (112 lines)
      designing-systems/
        resources/
          adr.template.md (47 lines)
          system-design.template.md (81 lines)
        SKILL.md (71 lines)
      domain-driven-design/
        SKILL.md (104 lines)
      writing-adrs/
        SKILL.md (88 lines)
    core-engineering/
      data-management/
        SKILL.md (77 lines)
      data-to-ui/
        SKILL.md (206 lines)
      debugging/
        SKILL.md (79 lines)
      dependency-management/
        SKILL.md (81 lines)
      implementing-code/
        SKILL.md (70 lines)
      optimizing-code/
        SKILL.md (79 lines)
      refactoring-code/
        SKILL.md (57 lines)
      test-driven-development/
        SKILL.md (91 lines)
      testing/
        SKILL.md (93 lines)
    design/
      accessibility/
        SKILL.md (96 lines)
      component-recipes/
        SKILL.md (231 lines)
      demo-design-tokens/
        SKILL.md (165 lines)
      design-systems/
        SKILL.md (98 lines)
      interface-design/
        resources/
          design-framework.template.md (104 lines)
        SKILL.md (84 lines)
      visual-assets/
        SKILL.md (84 lines)
    languages/
      bash/
        SKILL.md (136 lines)
      biome/
        SKILL.md (273 lines)
      expo-router/
        SKILL.md (106 lines)
      expo-sdk/
        SKILL.md (145 lines)
      framer-motion/
        SKILL.md (514 lines)
      go/
        SKILL.md (167 lines)
      hono/
        SKILL.md (343 lines)
      kotlin/
        SKILL.md (478 lines)
      nativewind/
        SKILL.md (123 lines)
      python/
        SKILL.md (132 lines)
      radix-ui/
        SKILL.md (249 lines)
      react-native-patterns/
        SKILL.md (202 lines)
      react-patterns/
        SKILL.md (267 lines)
      reanimated/
        SKILL.md (126 lines)
      rust/
        SKILL.md (161 lines)
      swift/
        SKILL.md (405 lines)
      tailwind-css/
        SKILL.md (267 lines)
      terraform/
        SKILL.md (181 lines)
      typescript/
        SKILL.md (132 lines)
      vite/
        SKILL.md (248 lines)
    operations/
      beads-workflow/
        SKILL.md (115 lines)
      chaos-engineering/
        SKILL.md (96 lines)
      deploy-aws-ecs/
        SKILL.md (173 lines)
      deploy-cloudflare/
        SKILL.md (159 lines)
      deploy-railway/
        SKILL.md (111 lines)
      incident-management/
        SKILL.md (92 lines)
      infrastructure/
        SKILL.md (165 lines)
      observability/
        SKILL.md (97 lines)
      swarm-coordination/
        SKILL.md (164 lines)
    product/
      agile-methodology/
        SKILL.md (86 lines)
      brainstorming/
        SKILL.md (73 lines)
      context-management/
        SKILL.md (80 lines)
      decomposing-tasks/
        SKILL.md (93 lines)
      documentation/
        SKILL.md (135 lines)
      estimating-work/
        SKILL.md (74 lines)
      execution-roadmaps/
        resources/
          execution-roadmap.template.md (105 lines)
        SKILL.md (75 lines)
      reaching-consensus/
        SKILL.md (77 lines)
      requirements-analysis/
        SKILL.md (77 lines)
      writing-pr-faqs/
        resources/
          pr-faq.template.md (81 lines)
        SKILL.md (78 lines)
      writing-prds/
        resources/
          prd.template.md (70 lines)
        SKILL.md (67 lines)
    security/
      application-security/
        SKILL.md (97 lines)
      compliance/
        SKILL.md (97 lines)
      identity-access/
        SKILL.md (94 lines)
      security-review/
        SKILL.md (98 lines)
      threat-modeling/
        SKILL.md (106 lines)
  templates/
    artifacts/
      adr.template.md (144 lines)
      design_spec.template.md (172 lines)
      plan.template.md (172 lines)
      postmortem.template.md (267 lines)
      pr_faq.template.md (218 lines)
      prd.template.md (175 lines)
      roadmap.template.md (185 lines)
      security_audit.template.md (321 lines)
      system_design.template.md (446 lines)
    agent.template.md (54 lines)
    command.template.md (66 lines)
    rule.template.md (58 lines)
    skill.template.md (67 lines)
.github/
  agents/
    ai-genkit-lead.agent.md (38 lines)
    app-router.agent.md (49 lines)
    chunk-strategist.agent.md (34 lines)
    commands.md (52 lines)
    doc-ingest.agent.md (35 lines)
    domain-architect.agent.md (84 lines)
    domain-lead.agent.md (47 lines)
    e2e-qa.agent.md (47 lines)
    embedding-writer.agent.md (34 lines)
    firestore-schema.agent.md (34 lines)
    frontend-lead.agent.md (38 lines)
    genkit-flow.agent.md (39 lines)
    kb-architect.agent.md (45 lines)
    knowledge-base.md (228 lines)
    lint-rule-enforcer.agent.md (39 lines)
    mddd-architect.agent.md (52 lines)
    prompt-engineer.agent.md (39 lines)
    quality-lead.agent.md (53 lines)
    rag-lead.agent.md (39 lines)
    README.md (25 lines)
    schema-migration.agent.md (34 lines)
    security-rules.agent.md (38 lines)
    server-action-writer.agent.md (34 lines)
    shadcn-composer.agent.md (41 lines)
    test-scenario-writer.agent.md (34 lines)
    ts-interface-writer.agent.md (40 lines)
    workspace-audit.agent.md (0 lines)
  instructions/
    app/
      app-router-parallel-routes.instructions.md (33 lines)
    modules/
      modules-api-surface.instructions.md (31 lines)
      modules-index-entry.instructions.md (27 lines)
      modules-infrastructure-adapters.instructions.md (29 lines)
      modules-interfaces-api-consumption.instructions.md (29 lines)
    architecture-api-boundary.instructions.md (35 lines)
    architecture-mddd.instructions.md (35 lines)
    architecture-modules.instructions.md (37 lines)
    architecture-monorepo.instructions.md (33 lines)
    bounded-context-rules.instructions.md (52 lines)
    branching-strategy.instructions.md (19 lines)
    ci-cd.instructions.md (20 lines)
    cloud-functions.instructions.md (29 lines)
    commit-convention.instructions.md (19 lines)
    doc-governance.instructions.md (57 lines)
    domain-modeling.instructions.md (125 lines)
    embedding-pipeline.instructions.md (23 lines)
    event-driven-state.instructions.md (108 lines)
    firebase-architecture.instructions.md (26 lines)
    firestore-schema.instructions.md (20 lines)
    genkit-flow.instructions.md (16 lines)
    hosting-deploy.instructions.md (14 lines)
    lint-format.instructions.md (20 lines)
    nextjs-app-router.instructions.md (19 lines)
    nextjs-parallel-routes.instructions.md (17 lines)
    nextjs-server-actions.instructions.md (18 lines)
    prompt-engineering.instructions.md (30 lines)
    rag-architecture.instructions.md (17 lines)
    README.md (60 lines)
    security-rules.instructions.md (20 lines)
    shadcn-ui.instructions.md (16 lines)
    tailwind-design-system.instructions.md (16 lines)
    testing-e2e.instructions.md (16 lines)
    testing-unit.instructions.md (16 lines)
    ubiquitous-language.instructions.md (38 lines)
  prompts/
    app/
      create-parallel-route-slice.prompt.md (39 lines)
    analyze-repo.prompt.md (36 lines)
    chunk-docs.prompt.md (26 lines)
    debug-error.prompt.md (25 lines)
    embedding-docs.prompt.md (19 lines)
    generate-aggregate.prompt.md (51 lines)
    generate-domain-event.prompt.md (59 lines)
    implement-feature.prompt.md (28 lines)
    implement-firestore-schema.prompt.md (18 lines)
    implement-genkit-flow.prompt.md (19 lines)
    implement-security-rules.prompt.md (18 lines)
    implement-server-action.prompt.md (20 lines)
    implement-ui-component.prompt.md (21 lines)
    ingest-docs.prompt.md (20 lines)
    plan-api.prompt.md (19 lines)
    plan-feature.prompt.md (15 lines)
    plan-module.prompt.md (19 lines)
    README.md (49 lines)
    refactor-api.prompt.md (18 lines)
    refactor-module.prompt.md (19 lines)
    review-architecture.prompt.md (14 lines)
    review-code.prompt.md (18 lines)
    review-performance.prompt.md (19 lines)
    review-security.prompt.md (13 lines)
    write-docs.prompt.md (18 lines)
    write-e2e-tests.prompt.md (20 lines)
    write-tests.prompt.md (18 lines)
  copilot-instructions.md (97 lines)
  README.md (31 lines)
  terminology-glossary.md (30 lines)
docs/
  ddd/
    account/
      AGENT.md (40 lines)
      aggregates.md (47 lines)
      application-services.md (27 lines)
      context-map.md (35 lines)
      domain-events.md (32 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (30 lines)
      ubiquitous-language.md (21 lines)
    ai/
      AGENT.md (47 lines)
      aggregates.md (68 lines)
      application-services.md (28 lines)
      context-map.md (40 lines)
      domain-events.md (23 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (28 lines)
      ubiquitous-language.md (23 lines)
    identity/
      AGENT.md (41 lines)
      aggregates.md (43 lines)
      application-services.md (28 lines)
      context-map.md (33 lines)
      domain-events.md (26 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (28 lines)
      ubiquitous-language.md (21 lines)
    knowledge/
      AGENT.md (45 lines)
      aggregates.md (64 lines)
      application-services.md (31 lines)
      context-map.md (48 lines)
      domain-events.md (54 lines)
      domain-services.md (22 lines)
      README.md (38 lines)
      repositories.md (32 lines)
      ubiquitous-language.md (25 lines)
    notebook/
      AGENT.md (46 lines)
      aggregates.md (66 lines)
      application-services.md (28 lines)
      context-map.md (31 lines)
      domain-events.md (23 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (33 lines)
      ubiquitous-language.md (30 lines)
    notification/
      AGENT.md (34 lines)
      aggregates.md (33 lines)
      application-services.md (26 lines)
      context-map.md (23 lines)
      domain-events.md (24 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (26 lines)
      ubiquitous-language.md (20 lines)
    organization/
      AGENT.md (36 lines)
      aggregates.md (43 lines)
      application-services.md (27 lines)
      context-map.md (31 lines)
      domain-events.md (27 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (26 lines)
      ubiquitous-language.md (24 lines)
    search/
      AGENT.md (45 lines)
      aggregates.md (39 lines)
      application-services.md (28 lines)
      context-map.md (44 lines)
      domain-events.md (28 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (33 lines)
      ubiquitous-language.md (25 lines)
    shared/
      AGENT.md (41 lines)
      aggregates.md (44 lines)
      application-services.md (26 lines)
      context-map.md (29 lines)
      domain-events.md (34 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (28 lines)
      ubiquitous-language.md (23 lines)
    source/
      AGENT.md (48 lines)
      aggregates.md (62 lines)
      application-services.md (33 lines)
      context-map.md (37 lines)
      domain-events.md (24 lines)
      domain-services.md (23 lines)
      README.md (37 lines)
      repositories.md (31 lines)
      ubiquitous-language.md (26 lines)
    wiki/
      AGENT.md (42 lines)
      aggregates.md (64 lines)
      application-services.md (27 lines)
      context-map.md (42 lines)
      domain-events.md (28 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (26 lines)
      ubiquitous-language.md (25 lines)
    workspace/
      AGENT.md (40 lines)
      aggregates.md (54 lines)
      application-services.md (28 lines)
      context-map.md (44 lines)
      domain-events.md (26 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (30 lines)
      ubiquitous-language.md (22 lines)
    workspace-audit/
      AGENT.md (45 lines)
      aggregates.md (40 lines)
      application-services.md (27 lines)
      context-map.md (43 lines)
      domain-events.md (26 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (27 lines)
      ubiquitous-language.md (26 lines)
    workspace-feed/
      AGENT.md (18 lines)
      aggregates.md (21 lines)
      application-services.md (27 lines)
      context-map.md (25 lines)
      domain-events.md (19 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (28 lines)
      ubiquitous-language.md (9 lines)
    workspace-flow/
      AGENT.md (47 lines)
      aggregates.md (91 lines)
      application-services.md (67 lines)
      context-map.md (46 lines)
      domain-events.md (41 lines)
      domain-services.md (26 lines)
      README.md (37 lines)
      repositories.md (37 lines)
      ubiquitous-language.md (26 lines)
    workspace-scheduling/
      AGENT.md (41 lines)
      aggregates.md (48 lines)
      application-services.md (26 lines)
      context-map.md (35 lines)
      domain-events.md (22 lines)
      domain-services.md (22 lines)
      README.md (37 lines)
      repositories.md (27 lines)
      ubiquitous-language.md (32 lines)
    bounded-contexts.md (91 lines)
    subdomains.md (121 lines)
  development/
    modules-implementation-guide.md (165 lines)
    README.md (0 lines)
  guides/
    explanation/
      architecture-domain.md (925 lines)
      architecture.md (942 lines)
      README.md (16 lines)
    how-to/
      ui-ux/
        component-patterns.md (362 lines)
        information-architecture.md (244 lines)
        ux-principles.md (228 lines)
        wireframes.md (337 lines)
      README.md (17 lines)
  reference/
    specification/
      system-overview.md (189 lines)
    README.md (16 lines)
  templates/
    explanation.template.md (23 lines)
    how-to.template.md (24 lines)
    reference.template.md (21 lines)
    tutorial.template.md (25 lines)
  tutorials/
    README.md (17 lines)
  beads.md (42 lines)
  customization.md (102 lines)
  getting-started.md (68 lines)
  handoffs.md (57 lines)
  hooks.md (143 lines)
  mcp-servers.md (92 lines)
  personas.md (48 lines)
  README.md (28 lines)
  skills.md (89 lines)
  SOURCE-OF-TRUTH.md (25 lines)
  swarm.md (98 lines)
modules/
  account/
    AGENT.md (40 lines)
    aggregates.md (47 lines)
    application-services.md (27 lines)
    context-map.md (35 lines)
    domain-events.md (32 lines)
    domain-services.md (22 lines)
    README.md (37 lines)
    repositories.md (30 lines)
    ubiquitous-language.md (21 lines)
  ai/
    AGENT.md (47 lines)
    aggregates.md (68 lines)
    application-services.md (28 lines)
    context-map.md (40 lines)
    domain-events.md (23 lines)
    domain-services.md (22 lines)
    README.md (37 lines)
    repositories.md (28 lines)
    ubiquitous-language.md (23 lines)
  identity/
    AGENT.md (41 lines)
    aggregates.md (43 lines)
    application-services.md (28 lines)
    context-map.md (33 lines)
    domain-events.md (26 lines)
    domain-services.md (22 lines)
    README.md (37 lines)
    repositories.md (28 lines)
    ubiquitous-language.md (21 lines)
  knowledge/
    AGENT.md (45 lines)
    aggregates.md (64 lines)
    application-services.md (31 lines)
    context-map.md (48 lines)
    domain-events.md (54 lines)
    domain-services.md (22 lines)
    README.md (38 lines)
    repositories.md (32 lines)
    ubiquitous-language.md (25 lines)
  notebook/
    AGENT.md (46 lines)
    aggregates.md (66 lines)
    application-services.md (28 lines)
    context-map.md (31 lines)
    domain-events.md (23 lines)
    domain-services.md (22 lines)
    README.md (37 lines)
    repositories.md (33 lines)
    ubiquitous-language.md (30 lines)
  notification/
    AGENT.md (34 lines)
    aggregates.md (33 lines)
    application-services.md (26 lines)
    context-map.md (23 lines)
    domain-events.md (24 lines)
    domain-services.md (22 lines)
    README.md (37 lines)
    repositories.md (26 lines)
    ubiquitous-language.md (20 lines)
  organization/
    AGENT.md (36 lines)
    aggregates.md (43 lines)
    application-services.md (27 lines)
    context-map.md (31 lines)
    domain-events.md (27 lines)
    domain-services.md (22 lines)
    README.md (37 lines)
    repositories.md (26 lines)
    ubiquitous-language.md (24 lines)
  search/
    AGENT.md (45 lines)
    aggregates.md (39 lines)
    application-services.md (28 lines)
    context-map.md (44 lines)
    domain-events.md (28 lines)
    domain-services.md (22 lines)
    README.md (37 lines)
    repositories.md (33 lines)
    ubiquitous-language.md (25 lines)
  shared/
    AGENT.md (41 lines)
    aggregates.md (44 lines)
    application-services.md (26 lines)
    context-map.md (29 lines)
    domain-events.md (34 lines)
    domain-services.md (22 lines)
    README.md (37 lines)
    repositories.md (28 lines)
    ubiquitous-language.md (23 lines)
  source/
    AGENT.md (48 lines)
    aggregates.md (62 lines)
    application-services.md (33 lines)
    context-map.md (37 lines)
    domain-events.md (24 lines)
    domain-services.md (23 lines)
    README.md (37 lines)
    repositories.md (31 lines)
    ubiquitous-language.md (26 lines)
  wiki/
    AGENT.md (42 lines)
    aggregates.md (64 lines)
    application-services.md (27 lines)
    context-map.md (42 lines)
    domain-events.md (28 lines)
    domain-services.md (22 lines)
    README.md (37 lines)
    repositories.md (26 lines)
    ubiquitous-language.md (25 lines)
  workspace/
    AGENT.md (40 lines)
    aggregates.md (54 lines)
    application-services.md (28 lines)
    context-map.md (44 lines)
    domain-events.md (26 lines)
    domain-services.md (22 lines)
    README.md (37 lines)
    repositories.md (30 lines)
    ubiquitous-language.md (22 lines)
  workspace-audit/
    AGENT.md (45 lines)
    aggregates.md (40 lines)
    application-services.md (27 lines)
    context-map.md (43 lines)
    domain-events.md (26 lines)
    domain-services.md (22 lines)
    README.md (37 lines)
    repositories.md (27 lines)
    ubiquitous-language.md (26 lines)
  workspace-feed/
    AGENT.md (18 lines)
    aggregates.md (21 lines)
    application-services.md (27 lines)
    context-map.md (25 lines)
    domain-events.md (19 lines)
    domain-services.md (22 lines)
    README.md (37 lines)
    repositories.md (28 lines)
    ubiquitous-language.md (9 lines)
  workspace-flow/
    AGENT.md (47 lines)
    aggregates.md (91 lines)
    application-services.md (67 lines)
    context-map.md (46 lines)
    domain-events.md (41 lines)
    domain-services.md (26 lines)
    README.md (37 lines)
    repositories.md (37 lines)
    ubiquitous-language.md (26 lines)
    Workspace-Flow-File-Template.md (82 lines)
  workspace-scheduling/
    AGENT.md (41 lines)
    aggregates.md (48 lines)
    application-services.md (26 lines)
    context-map.md (35 lines)
    domain-events.md (22 lines)
    domain-services.md (22 lines)
    README.md (37 lines)
    repositories.md (27 lines)
    ubiquitous-language.md (32 lines)
py_fn/
  README.md (265 lines)
AGENTS.md (147 lines)
CLAUDE.md (45 lines)
CONTRIBUTING.md (115 lines)
PERMISSIONS.md (10 lines)
README.md (141 lines)
SPEC-WORKFLOW.md (11 lines)
```