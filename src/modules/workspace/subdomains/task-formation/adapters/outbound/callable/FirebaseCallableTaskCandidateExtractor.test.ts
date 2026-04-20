import { describe, expect, it } from "vitest";
import { FirebaseCallableTaskCandidateExtractor } from "./FirebaseCallableTaskCandidateExtractor";

// Minimal AP8 PO dense text excerpt mimicking Document AI OCR output.
// Format: {item_no} 3RDTW{code} SET {price}...小計{total}（{section_numeral}）{description}
const AP8_DENSE_EXCERPT = [
  "10 3RDTW5BD1 SET 756,000756,0002025.04.30 GIT(Cost Ref: 6591401)折扣-137,470小計618,530（一）SCADA站內工程:既設161kv RTU（FrontEnd >FO box>Relay RS485）",
  "210 3RDTW5BD1 SET 100,000100,0002025.04.30 GIT折扣-18,184小計81,816（一）SCADA站內工程:高空作業費",
  "370 3RDTW5BD1 SET 80,00080,0002025.04.30 GIT折扣-14,547小計65,453（伍）雜項費用:CUP變電站管理1人*4個月",
  "430 3RDTW5BD1 SET 50,00050,0002025.04.30 GIT折扣-9,092小計40,908（柒）防火填塞",
  "540 3RDTW5BD1 SET 200,000200,0002025.04.30 GIT折扣-36,368小計163,632（玖）利潤及雜費",
].join("\n");

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

  describe("dense AP8 PO format (Document AI OCR output)", () => {
    it("extracts candidates from dense PO text with 3RDTW product codes", async () => {
      const extractor = new FirebaseCallableTaskCandidateExtractor();
      const result = await extractor.extract({
        workspaceId: "00000000-0000-0000-0000-000000000000",
        sourceType: "ai",
        sourcePageIds: ["page-1"],
        sourceText: AP8_DENSE_EXCERPT,
      });

      expect(result.length).toBeGreaterThanOrEqual(4);
      expect(
        result.every((c) => c.title.startsWith("[施工作業]") || c.title.startsWith("[費用管銷]")),
      ).toBe(true);
    });

    it("classifies 高空作業費 (ends with 費) as 費用管銷", async () => {
      const extractor = new FirebaseCallableTaskCandidateExtractor();
      const result = await extractor.extract({
        workspaceId: "00000000-0000-0000-0000-000000000000",
        sourceType: "ai",
        sourcePageIds: ["page-1"],
        sourceText: AP8_DENSE_EXCERPT,
      });
      const highAltFee = result.find((c) => c.title.includes("高空作業費"));
      expect(highAltFee).toBeDefined();
      expect(highAltFee?.title.startsWith("[費用管銷]")).toBe(true);
    });

    it("classifies SCADA RTU installation as 施工作業", async () => {
      const extractor = new FirebaseCallableTaskCandidateExtractor();
      const result = await extractor.extract({
        workspaceId: "00000000-0000-0000-0000-000000000000",
        sourceType: "ai",
        sourcePageIds: ["page-1"],
        sourceText: AP8_DENSE_EXCERPT,
      });
      const scadaItem = result.find((c) => c.title.includes("RTU"));
      expect(scadaItem).toBeDefined();
      expect(scadaItem?.title.startsWith("[施工作業]")).toBe(true);
    });

    it("classifies section 伍 (雜項費用) items as 費用管銷", async () => {
      const extractor = new FirebaseCallableTaskCandidateExtractor();
      const result = await extractor.extract({
        workspaceId: "00000000-0000-0000-0000-000000000000",
        sourceType: "ai",
        sourcePageIds: ["page-1"],
        sourceText: AP8_DENSE_EXCERPT,
      });
      const mgmtItem = result.find((c) => c.title.includes("管理"));
      expect(mgmtItem).toBeDefined();
      expect(mgmtItem?.title.startsWith("[費用管銷]")).toBe(true);
    });

    it("classifies 利潤及雜費 (section 玖) as 費用管銷", async () => {
      const extractor = new FirebaseCallableTaskCandidateExtractor();
      const result = await extractor.extract({
        workspaceId: "00000000-0000-0000-0000-000000000000",
        sourceType: "ai",
        sourcePageIds: ["page-1"],
        sourceText: AP8_DENSE_EXCERPT,
      });
      const profitItem = result.find((c) => c.title.includes("利潤"));
      expect(profitItem).toBeDefined();
      expect(profitItem?.title.startsWith("[費用管銷]")).toBe(true);
    });

    it("classifies 防火填塞 (section 柒) as 施工作業", async () => {
      const extractor = new FirebaseCallableTaskCandidateExtractor();
      const result = await extractor.extract({
        workspaceId: "00000000-0000-0000-0000-000000000000",
        sourceType: "ai",
        sourcePageIds: ["page-1"],
        sourceText: AP8_DENSE_EXCERPT,
      });
      const fireSeal = result.find((c) => c.title.includes("防火"));
      expect(fireSeal).toBeDefined();
      expect(fireSeal?.title.startsWith("[施工作業]")).toBe(true);
    });
  });
});
