---
name: analyze-codebase
description: Analyze a route, module, or subsystem and return a focused implementation or migration brief.
agent: planner
argument-hint: "[route, module, or concern]"
---
Use xuanwu-app-skill first.
Use Serena first to gather symbols, references, snippets, and likely file paths for the requested area.
Use sequential thinking after the Serena evidence pass to expand the analysis.

Analyze the requested codebase area.

- map the flow across app, modules, interfaces, infrastructure, lib, shared, and ui
- name the main symbols, references, and code snippets that support the analysis
- identify ownership mismatches or layering leaks
- estimate the smallest high-value next step
- list validation commands and regression risks
- return a concise, implementation-ready brief
