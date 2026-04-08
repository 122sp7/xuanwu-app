import { describe, expect, it } from "vitest";

import { buildDraftDocumentRepresentation } from "./file-processing-draft";

const PURCHASE_ORDER_SAMPLE = `
訂購單
4509897907
供應商/賣方 V27421335
宏林工程有限公司
427013 台中市潭子區復興路2段43號
聯絡人 蔡明興,lhs5518@hotmail.com
0425318057
RFQ-240703
2024.08.19
訂購公司/買方 22522313
艾波比股份有限公司
114066 台北市內湖區基湖路18號10樓
TEL: 02-87516090
訂單日期 2024.08.20
採購人員 Madeline Su
請購人員 ROBIN.FAN@TW.ABB.COM
費用案號 6122401
付款方式 買方月結日後90天
付款條件 100%交貨/完工後,依標準TWABB文件辦理驗收 -
交貨地址 tsmc 15P7 台中市西屯區新科路1號(台積電中科F15B新廠-Phase
交貨條款 DDP n/a
交貨方式 Local Transportation
驗收文件 Test Report ;
項次
10
20
料號/品名
3RDTW5BF
(Cost Ref: 6122401)
(Customer PO: )
ACB搬運工程
堆高機下車
3RDTW5BF
(Cost Ref: 6122401)
(Customer PO: )
新設ACB搬運定位
數量
6
6
單位
PC
PC
單價
8,000
6,000
未稅總計
1,500,000
稅金
75,001
含稅總價
1,575,001
TWD
`;

describe("file-processing-draft", () => {
  it("builds a purchase-order specific draft representation", () => {
    const result = buildDraftDocumentRepresentation({
      filename: "4509897907-AP8P1-150.PDF",
      sourceGcsUri: "gs://bucket/source.pdf",
      jsonGcsUri: "gs://bucket/source.json",
      pageCount: 7,
      parsedText: PURCHASE_ORDER_SAMPLE,
    });

    expect(result.templateKind).toBe("purchase-order");
    expect(result.title).toBe("4509897907｜訂購單草稿");
    expect(result.plainText).toContain("買賣雙方");
    expect(result.plainText).toContain("供應商：宏林工程有限公司 (V27421335)");
    expect(result.plainText).toContain("買方：艾波比股份有限公司 (22522313)");
    expect(result.plainText).toContain("10. ACB搬運工程 / 堆高機下車｜數量 6 PC｜單價 TWD 8,000");
    expect(result.plainText).toContain("20. 新設ACB搬運定位｜數量 6 PC｜單價 TWD 6,000");
    expect(JSON.stringify(result.tiptapDocument)).toContain("品項摘要");
  });
});