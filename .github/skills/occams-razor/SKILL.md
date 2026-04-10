---
name: occams-razor
description: >-
  Occam's Razor skillbook. Use when multiple designs compete, abstractions are proliferating,
  docs or workflows are bloating, or you need the simplest adequate path without denying real complexity.
user-invocable: true
disable-model-invocation: false
---

# Occam's Razor

Use this skill when you must choose between plausible options and need to reduce unnecessary assumptions, indirection, or ceremony.

## Research Basis

Context7 availability note:

1. No authoritative Context7 library entry exists for Occam's Razor as a philosophical and methodological principle, so this skill is grounded primarily in web sources.

Web-verified:

1. Occam's Razor is a parsimony heuristic: when competing explanations have comparable explanatory power, prefer the one with fewer assumptions.
2. It is a heuristic, not a proof rule and not a guarantee that the simplest explanation is true.
3. It is most useful for cutting ad hoc additions and prioritizing the option that is easier to test and falsify.
4. It becomes misuse when used to erase real complexity, evidence, or domain distinctions.

## Engineering Translation

In software work, apply Occam's Razor as:

1. remove assumptions before removing evidence,
2. prefer the smallest structure that still protects the real boundary,
3. do not create a second abstraction until the first concrete pressure appears,
4. simplify by deleting duplication, not by collapsing distinct meanings,
5. if two options both work, prefer the one that is easier to explain, test, and reverse.

## What Counts As A Real Pressure

An extra abstraction, document, layer, or module should usually exist only if it protects at least one of these:

1. a runtime or process boundary,
2. a bounded-context ownership boundary,
3. a volatile external dependency,
4. materially different behavior,
5. repeated change pressure that is already visible.

If none of those exist, the extra structure is probably speculative.

## Xuanwu Translation

In this repo, applying Occam's Razor usually means:

1. prefer the owning existing bounded context before inventing a new one,
2. keep `.github` thin and let `docs/` stay the authority,
3. add ports only when they protect the core from a real external seam,
4. avoid parallel glossaries, prompts, or instructions that restate existing authority,
5. keep app shims thin and move real behavior into the owning module,
6. keep one concern per branch or PR.

## Decision Loop

1. State the competing options and the invariant that must be preserved.
2. List the extra assumptions, files, layers, or concepts each option introduces.
3. Remove options that depend on hypothetical future needs only.
4. Prefer the option with fewer assumptions that still satisfies current evidence and boundaries.
5. If uncertain, choose the option that is easiest to validate and easiest to undo.
6. Reintroduce complexity only after new evidence appears.

## Red Flags

- A new interface exists only because “architecturally it feels right”.
- A new module or subdomain is created for naming symmetry rather than ownership.
- A second document restates the first without new authority.
- The solution becomes more generic while the use case remains singular.
- “Simple” is being used to dismiss already confirmed edge cases.
- Fewer files are treated as inherently better even when boundaries become less clear.

## Review Questions

1. What new assumption does this change add?
2. Which existing owner or layer could absorb the behavior instead?
3. Is the abstraction protecting a real seam or only aesthetics?
4. Did we simplify the explanation, or only hide the complexity?
5. What would break if we removed this extra layer today?

## Output Contract

When this skill is used, provide:

1. the competing options,
2. the unnecessary assumptions or layers,
3. the simplest adequate recommendation,
4. what complexity must remain because it is real,
5. the validation step that proves the simpler path still works.