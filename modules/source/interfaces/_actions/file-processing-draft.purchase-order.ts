import {
  buildPlainTextDocument,
  buildTiptapDocument,
  captureSection,
  captureSingleLine,
  type DraftDocumentInput,
  type DraftDocumentRepresentation,
  type DraftSection,
  findLineIndex,
  formatCurrency,
  matchFirst,
  normalizeWhitespace,
  type PurchaseOrderItem,
  splitMeaningfulLines,
  trimFileExtension,
} from "./file-processing-draft.shared";

function collectPositiveNumbers(lines: readonly string[], startLabel: string, stopLabels: readonly string[]): string[] {
  const startIndex = findLineIndex(lines, startLabel);
  if (startIndex < 0) {
    return [];
  }

  const values: string[] = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (stopLabels.some((stopLabel) => line.startsWith(stopLabel))) {
      break;
    }

    if (/^[\d,]+$/.test(line)) {
      values.push(line);
    }
  }

  return values;
}

function collectUnits(lines: readonly string[], startLabel: string, stopLabels: readonly string[]): string[] {
  const startIndex = findLineIndex(lines, startLabel);
  if (startIndex < 0) {
    return [];
  }

  const units: string[] = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (stopLabels.some((stopLabel) => line.startsWith(stopLabel))) {
      break;
    }

    if (/^[A-Z]{1,5}$/.test(line)) {
      units.push(line);
    }
  }

  return units;
}

function extractItemNumbers(lines: readonly string[]): string[] {
  const itemNumbers: string[] = [];
  const startIndex = findLineIndex(lines, "項次");
  const stopIndex = findLineIndex(lines, "料號/品名");

  if (startIndex < 0 || stopIndex < 0 || stopIndex <= startIndex) {
    return itemNumbers;
  }

  for (let index = startIndex + 1; index < stopIndex; index += 1) {
    const line = lines[index];
    if (/^\d+$/.test(line)) {
      itemNumbers.push(line);
    }
  }

  return itemNumbers;
}

function extractPurchaseOrderItems(lines: readonly string[]): PurchaseOrderItem[] {
  const itemNumbers = extractItemNumbers(lines);
  const descriptions: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index] !== "(Customer PO: )") {
      continue;
    }

    const descriptionLines: string[] = [];
    for (let nextIndex = index + 1; nextIndex < lines.length; nextIndex += 1) {
      const nextLine = lines[nextIndex];
      if (
        nextLine === "(Customer PO: )"
        || nextLine.startsWith("3RDT")
        || nextLine === "數量"
        || nextLine === "單位"
        || nextLine === "單價"
        || nextLine === "金額"
      ) {
        break;
      }

      if (!nextLine.startsWith("(Cost Ref:")) {
        descriptionLines.push(nextLine);
      }
    }

    if (descriptionLines.length > 0) {
      descriptions.push(descriptionLines.join(" / "));
    }
  }

  const quantities = collectPositiveNumbers(lines, "數量", ["單價", "金額"]);
  const units = collectUnits(lines, "單位", ["單價", "金額"]);

  const unitPriceStart = findLineIndex(lines, "單價");
  const unitPrices: string[] = [];
  if (unitPriceStart >= 0) {
    for (let index = unitPriceStart + 1; index < lines.length; index += 1) {
      const line = lines[index];
      if (line.startsWith("交貨日期") || line.startsWith("未稅總計")) {
        break;
      }

      if (/^[\d,]+$/.test(line)) {
        unitPrices.push(line);
        if (unitPrices.length >= descriptions.length) {
          break;
        }
      }
    }
  }

  return descriptions.map((description, index) => ({
    itemNo: itemNumbers[index] ?? String(index + 1),
    description,
    quantity: quantities[index],
    unit: units[index],
    unitPrice: unitPrices[index],
  }));
}

function buildPurchaseOrderSummary(items: readonly PurchaseOrderItem[], currency: string): string[] {
  return items.map((item) => {
    const parts = [`${item.itemNo}. ${item.description}`];
    if (item.quantity) {
      parts.push(`數量 ${item.quantity}${item.unit ? ` ${item.unit}` : ""}`);
    }
    if (item.unitPrice) {
      parts.push(`單價 ${formatCurrency(item.unitPrice, currency)}`);
    }
    return parts.join("｜");
  });
}

export function buildPurchaseOrderDraft(input: DraftDocumentInput): DraftDocumentRepresentation {
  const lines = splitMeaningfulLines(input.parsedText);
  const normalizedText = normalizeWhitespace(input.parsedText);
  const documentNumber =
    matchFirst(normalizedText, /訂購單\s*(\d{8,})/)
    || matchFirst(normalizedText, /\b(\d{10})\b/)
    || trimFileExtension(input.filename);
  const supplierLineIndex = findLineIndex(lines, "供應商/賣方");
  const buyerLineIndex = findLineIndex(lines, "訂購公司/買方");
  const supplierCode = matchFirst(normalizedText, /供應商\/賣方\s+([A-Z0-9]+)/);
  const buyerCode = matchFirst(normalizedText, /訂購公司\/買方\s+([A-Z0-9]+)/);
  const supplierName = captureSingleLine(lines, "供應商/賣方").replace(supplierCode, "").trim() || (lines[supplierLineIndex + 1] ?? "");
  const supplierAddress = lines[supplierLineIndex + 2] ?? "";
  const supplierContact = lines[supplierLineIndex + 3] ?? "";
  const supplierPhone = lines[supplierLineIndex + 4] ?? "";
  const buyerName = captureSingleLine(lines, "訂購公司/買方").replace(buyerCode, "").trim() || (lines[buyerLineIndex + 1] ?? "");
  const buyerAddress = lines[buyerLineIndex + 2] ?? "";
  const buyerPhone = lines[buyerLineIndex + 3] ?? "";
  const quoteNumber = matchFirst(normalizedText, /(RFQ-\d+)/);
  const quoteDate = matchFirst(normalizedText, /報價日期\s*(\d{4}\.\d{2}\.\d{2})/) || matchFirst(normalizedText, /RFQ-\d+\s*(\d{4}\.\d{2}\.\d{2})/);
  const orderDate = matchFirst(normalizedText, /訂單日期\s*(\d{4}\.\d{2}\.\d{2})/);
  const purchaser = captureSection(lines, "採購人員", ["請購人員", "費用案號"]);
  const requester = captureSection(lines, "請購人員", ["費用案號", "付款方式"]);
  const costRef = captureSingleLine(lines, "費用案號");
  const paymentMethod = captureSection(lines, "付款方式", ["付款條件"]);
  const paymentTerms = captureSection(lines, "付款條件", ["交貨地址"]);
  const deliveryAddress = captureSection(lines, "交貨地址", ["交貨條款"]);
  const deliveryTerms = captureSection(lines, "交貨條款", ["交貨方式"]);
  const deliveryMethod = captureSection(lines, "交貨方式", ["外箱嘜頭", "包裝條件"]);
  const preTaxTotal = matchFirst(normalizedText, /未稅總計\s*([\d,]+)/);
  const taxAmount = matchFirst(normalizedText, /稅金\s*([\d,]+)/);
  const totalAmount = matchFirst(normalizedText, /含稅總價\s*([\d,]+)/);
  const currency = matchFirst(normalizedText, /含稅總價\s*[\d,]+\s*([A-Z]{3})/) || matchFirst(normalizedText, /\b(TWD|USD|EUR)\b/);
  const acceptanceDocument = captureSection(lines, "驗收文件", ["罰款條件", "訂單指示"]);
  const acceptanceNotice = captureSection(lines, "驗收及請款須知", ["ABB Ltd.", "Email至madeline.su@tw.abb.com。若廠商未於該期限內回覆，本公司得以隨時撤銷本交易。"]);
  const safetyNotice = captureSection(lines, "工安文件如下:", ["驗收及請款須知"]);
  const items = extractPurchaseOrderItems(lines);
  const excerpt = normalizedText.length > 900 ? `${normalizedText.slice(0, 900)}…` : normalizedText;

  const sections: DraftSection[] = [
    {
      heading: "文件摘要",
      bullets: [
        "文件類型：訂購單",
        documentNumber ? `訂購單號：${documentNumber}` : "",
        quoteNumber ? `報價單號：${quoteNumber}` : "",
        quoteDate ? `報價日期：${quoteDate}` : "",
        orderDate ? `訂單日期：${orderDate}` : "",
        costRef ? `費用案號：${costRef}` : "",
        `頁數：${input.pageCount}`,
      ].filter(Boolean),
    },
    {
      heading: "買賣雙方",
      bullets: [
        supplierName ? `供應商：${supplierName}${supplierCode ? ` (${supplierCode})` : ""}` : "",
        supplierAddress ? `供應商地址：${supplierAddress}` : "",
        supplierContact ? `供應商聯絡：${supplierContact}` : "",
        supplierPhone ? `供應商電話：${supplierPhone}` : "",
        buyerName ? `買方：${buyerName}${buyerCode ? ` (${buyerCode})` : ""}` : "",
        buyerAddress ? `買方地址：${buyerAddress}` : "",
        buyerPhone ? `買方電話：${buyerPhone}` : "",
        purchaser ? `採購人員：${purchaser}` : "",
        requester ? `請購人員：${requester}` : "",
      ].filter(Boolean),
    },
    {
      heading: "付款與交貨",
      bullets: [
        paymentMethod ? `付款方式：${paymentMethod}` : "",
        paymentTerms ? `付款條件：${paymentTerms}` : "",
        deliveryAddress ? `交貨地址：${deliveryAddress}` : "",
        deliveryTerms ? `交貨條款：${deliveryTerms}` : "",
        deliveryMethod ? `交貨方式：${deliveryMethod}` : "",
      ].filter(Boolean),
    },
    {
      heading: "金額摘要",
      bullets: [
        preTaxTotal ? `未稅總計：${formatCurrency(preTaxTotal, currency)}` : "",
        taxAmount ? `稅金：${formatCurrency(taxAmount, currency)}` : "",
        totalAmount ? `含稅總價：${formatCurrency(totalAmount, currency)}` : "",
      ].filter(Boolean),
    },
    {
      heading: "品項摘要",
      orderedItems: buildPurchaseOrderSummary(items, currency).length > 0
        ? buildPurchaseOrderSummary(items, currency)
        : ["尚未從解析文字中萃取出可用的品項摘要。"],
    },
    {
      heading: "驗收與請款重點",
      bullets: [
        acceptanceDocument ? `驗收文件：${acceptanceDocument}` : "",
        safetyNotice ? `工安文件：${safetyNotice}` : "",
        acceptanceNotice ? `請款提醒：${normalizeWhitespace(acceptanceNotice).slice(0, 280)}…` : "",
      ].filter(Boolean),
    },
    {
      heading: "系統追蹤",
      bullets: [
        `來源文件：${input.filename}`,
        `原始檔案：${input.sourceGcsUri}`,
        `解析 JSON：${input.jsonGcsUri}`,
      ],
    },
    {
      heading: "原文節錄",
      paragraphs: [excerpt],
    },
  ];

  const displayTitle = `訂購單 ${documentNumber || trimFileExtension(input.filename)}`;

  return {
    title: documentNumber ? `${documentNumber}｜訂購單草稿` : `${trimFileExtension(input.filename)}｜匯入草稿`,
    plainText: buildPlainTextDocument(displayTitle, sections),
    tiptapDocument: buildTiptapDocument(displayTitle, sections),
    templateKind: "purchase-order",
  };
}