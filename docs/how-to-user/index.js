const howTo = Object.freeze({
  ai: Object.freeze({
    recoverAgentFlow: "docs/how-to-user/how-to/ai/recover-agent-flow.md",
    startFeatureDelivery: "docs/how-to-user/how-to/ai/start-feature-delivery.md",
    updateCustomizations: "docs/how-to-user/how-to/ai/update-customizations.md",
  }),
});

const uiUx = Object.freeze({
  componentPatterns: "docs/how-to-user/ui-ux/component-patterns.md",
  designSystem: "docs/how-to-user/ui-ux/design-system.md",
  informationArchitecture: "docs/how-to-user/ui-ux/information-architecture.md",
  readme: "docs/how-to-user/ui-ux/README.md",
  uxPrinciples: "docs/how-to-user/ui-ux/ux-principles.md",
  wireframes: "docs/how-to-user/ui-ux/wireframes.md",
});

const userManual = Object.freeze({
  adminGuide: "docs/how-to-user/user-manual/admin-guide.md",
  readme: "docs/how-to-user/user-manual/README.md",
  userGuide: "docs/how-to-user/user-manual/user-guide.md",
});

const markdown = Object.freeze({
  howToAiRecoverAgentFlow: howTo.ai.recoverAgentFlow,
  howToAiStartFeatureDelivery: howTo.ai.startFeatureDelivery,
  howToAiUpdateCustomizations: howTo.ai.updateCustomizations,
  uiUxComponentPatterns: uiUx.componentPatterns,
  uiUxDesignSystem: uiUx.designSystem,
  uiUxInformationArchitecture: uiUx.informationArchitecture,
  uiUxReadme: uiUx.readme,
  uiUxUxPrinciples: uiUx.uxPrinciples,
  uiUxWireframes: uiUx.wireframes,
  userManualAdminGuide: userManual.adminGuide,
  userManualReadme: userManual.readme,
  userManualUserGuide: userManual.userGuide,
});

const assets = Object.freeze({});

module.exports = Object.freeze({
  howTo,
  uiUx,
  userManual,
  markdown,
  assets,
});