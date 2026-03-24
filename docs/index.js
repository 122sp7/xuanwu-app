const decisionArchitecture = require("./decision-architecture");
const developmentReference = require("./development-reference");
const diagramsEventsExplanations = require("./diagrams-events-explanations");
const howToUser = require("./how-to-user");

const readme = "docs/README.md";

const markdown = Object.freeze({
  readme,
  ...decisionArchitecture.markdown,
  ...developmentReference.markdown,
  ...diagramsEventsExplanations.markdown,
  ...howToUser.markdown,
});

const assets = Object.freeze({
  ...decisionArchitecture.assets,
  ...developmentReference.assets,
  ...diagramsEventsExplanations.assets,
  ...howToUser.assets,
});

module.exports = Object.freeze({
  readme,
  decisionArchitecture,
  developmentReference,
  diagramsEventsExplanations,
  howToUser,
  markdown,
  assets,
});