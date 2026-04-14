import { describe, expect, it } from "vitest";

import {
  listSourceFollowUpPrompts,
  resolveSourceFollowUpPrompt,
} from "./index";

describe("prompt-pipeline registry", () => {
  it("exposes source follow-up prompts as one semantic family with separate templates", () => {
    const prompts = listSourceFollowUpPrompts("manual");

    expect(prompts.length).toBeGreaterThanOrEqual(4);
    expect(prompts.every((prompt) => prompt.family === "source-follow-up")).toBe(true);
    expect(prompts.map((prompt) => prompt.templateKey)).toEqual([
      "source-ocr",
      "source-rag-index",
      "source-knowledge-page",
      "source-task-materialization",
    ]);
  });

  it("resolves different intents to different prompts without changing bounded-context ownership", () => {
    const ragPrompt = resolveSourceFollowUpPrompt(
      "source-rag-index",
      { filename: "spec.pdf", jsonReady: true, pageCount: 12 },
      "manual",
    );

    const taskPrompt = resolveSourceFollowUpPrompt(
      "source-task-materialization",
      { filename: "spec.pdf", jsonReady: true, pageCount: 12 },
      "workflow",
    );

    expect(ragPrompt.family).toBe("source-follow-up");
    expect(taskPrompt.family).toBe("source-follow-up");
    expect(ragPrompt.templateKey).toBe("source-rag-index");
    expect(taskPrompt.templateKey).toBe("source-task-materialization");
    expect(ragPrompt.prompt).not.toEqual(taskPrompt.prompt);
    expect(taskPrompt.prompt).toContain("多步驟引導");
  });
});
