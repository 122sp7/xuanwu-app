import { describe, expect, it } from "vitest";

import { listSourceFollowUpPrompts, resolveSourceFollowUpPrompt } from "./index";

describe("source follow-up prompt registry", () => {
  it("lists the four manual follow-up actions as independent prompt intents", () => {
    const prompts = listSourceFollowUpPrompts("manual");

    expect(prompts).toHaveLength(4);
    expect(prompts.map((prompt) => prompt.intent)).toEqual([
      "source-ocr",
      "source-rag-index",
      "source-knowledge-page",
      "source-task-materialization",
    ]);
    expect(prompts.every((prompt) => prompt.mode === "manual")).toBe(true);
  });

  it("resolves workflow task materialization with multi-step wording", () => {
    const prompt = resolveSourceFollowUpPrompt(
      "source-task-materialization",
      {
        filename: "meeting-notes.pdf",
        jsonReady: true,
        pageCount: 12,
      },
      "workflow",
    );

    expect(prompt.mode).toBe("workflow");
    expect(prompt.label).toBe("建立任務");
    expect(prompt.prompt).toContain("多步驟引導");
    expect(prompt.prompt).toContain("先建立知識頁");
  });
});
