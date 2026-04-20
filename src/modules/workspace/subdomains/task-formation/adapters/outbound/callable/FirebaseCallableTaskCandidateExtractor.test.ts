import { describe, expect, it } from "vitest";
import { FirebaseCallableTaskCandidateExtractor } from "./FirebaseCallableTaskCandidateExtractor";

describe("FirebaseCallableTaskCandidateExtractor", () => {
  it("extracts line-item candidates without the legacy 8-item cap", async () => {
    const extractor = new FirebaseCallableTaskCandidateExtractor();
    const sourceText = [
      "10 高空作業費",
      "20 工程衛生費",
      "30 文件及圖面製作費",
      "40 圖控與軟體",
      "50 RTU盤內設備安裝及配線",
      "60 光纖熔接",
      "70 監工/工安費",
      "80 臨時門施作與保護",
      "90 工務所費用",
      "100 保險費",
      "110 DC盤基礎座製作",
      "120 跨棟/線槽/管路配置",
    ].join("\n");

    const result = await extractor.extract({
      workspaceId: "00000000-0000-0000-0000-000000000000",
      sourceType: "ai",
      sourcePageIds: ["pages"],
      sourceText,
    });

    expect(result.length).toBeGreaterThanOrEqual(12);
    expect(result.every((candidate) => candidate.title.startsWith("[施工作業]") || candidate.title.startsWith("[費用管銷]"))).toBe(true);
    expect(result.some((candidate) => candidate.title.startsWith("[費用管銷]"))).toBe(true);
  });

  it("falls back to source-id candidates when source text is empty", async () => {
    const extractor = new FirebaseCallableTaskCandidateExtractor();

    const result = await extractor.extract({
      workspaceId: "00000000-0000-0000-0000-000000000000",
      sourceType: "ai",
      sourcePageIds: ["research"],
      sourceText: "",
    });

    expect(result.length).toBe(1);
    expect(result[0]?.title).toContain("來源任務");
  });
});
