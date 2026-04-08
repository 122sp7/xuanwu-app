type TiptapNode = Record<string, unknown>;

export interface DraftDocumentInput {
  readonly filename: string;
  readonly sourceGcsUri: string;
  readonly jsonGcsUri: string;
  readonly pageCount: number;
  readonly parsedText: string;
}

export interface DraftSection {
  readonly heading: string;
  readonly paragraphs?: readonly string[];
  readonly bullets?: readonly string[];
  readonly orderedItems?: readonly string[];
}

export interface DraftDocumentRepresentation {
  readonly title: string;
  readonly plainText: string;
  readonly tiptapDocument: TiptapNode;
  readonly templateKind: "purchase-order" | "generic";
}

export interface PurchaseOrderItem {
  readonly itemNo: string;
  readonly description: string;
  readonly quantity?: string;
  readonly unit?: string;
  readonly unitPrice?: string;
}

export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function trimFileExtension(filename: string): string {
  const trimmed = filename.trim();
  const extensionIndex = trimmed.lastIndexOf(".");
  if (extensionIndex <= 0) {
    return trimmed;
  }

  return trimmed.slice(0, extensionIndex);
}

export function splitMeaningfulLines(text: string): string[] {
  return text
    .replace(/\f/g, "\n")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line !== "ABB Ltd.")
    .filter((line) => !/^Page\s+\d+/i.test(line))
    .filter((line) => line !== "of");
}

export function matchFirst(text: string, pattern: RegExp): string {
  const match = pattern.exec(text);
  return match?.[1]?.trim() ?? "";
}

export function findLineIndex(lines: readonly string[], label: string): number {
  return lines.findIndex((line) => line.startsWith(label));
}

export function captureSingleLine(lines: readonly string[], label: string, fallback = ""): string {
  const index = findLineIndex(lines, label);
  if (index < 0) {
    return fallback;
  }

  const inlineValue = lines[index].slice(label.length).trim();
  if (inlineValue) {
    return inlineValue;
  }

  return lines[index + 1] ?? fallback;
}

export function captureSection(lines: readonly string[], label: string, stopLabels: readonly string[]): string {
  const index = findLineIndex(lines, label);
  if (index < 0) {
    return "";
  }

  const collected: string[] = [];
  const inlineValue = lines[index].slice(label.length).trim();
  if (inlineValue) {
    collected.push(inlineValue);
  }

  for (let lineIndex = index + 1; lineIndex < lines.length; lineIndex += 1) {
    const nextLine = lines[lineIndex];
    if (stopLabels.some((stopLabel) => nextLine.startsWith(stopLabel))) {
      break;
    }

    collected.push(nextLine);
  }

  return normalizeWhitespace(collected.join(" "));
}

export function formatCurrency(value: string, currency: string): string {
  if (!value) {
    return "";
  }

  return currency ? `${currency} ${value}` : value;
}

function createTextNode(text: string): TiptapNode {
  return { type: "text", text };
}

function createParagraphNode(text: string): TiptapNode {
  return text ? { type: "paragraph", content: [createTextNode(text)] } : { type: "paragraph" };
}

function createHeadingNode(level: 2 | 3, text: string): TiptapNode {
  return { type: "heading", attrs: { level }, content: [createTextNode(text)] };
}

function createListItemNode(text: string): TiptapNode {
  return { type: "listItem", content: [createParagraphNode(text)] };
}

function createBulletListNode(items: readonly string[]): TiptapNode {
  return { type: "bulletList", content: items.map((item) => createListItemNode(item)) };
}

function createOrderedListNode(items: readonly string[]): TiptapNode {
  return { type: "orderedList", attrs: { start: 1 }, content: items.map((item) => createListItemNode(item)) };
}

export function buildPlainTextDocument(title: string, sections: readonly DraftSection[]): string {
  const blocks: string[] = [title];

  for (const section of sections) {
    blocks.push(section.heading);

    for (const paragraph of section.paragraphs ?? []) {
      blocks.push(paragraph);
    }

    for (const bullet of section.bullets ?? []) {
      blocks.push(`- ${bullet}`);
    }

    for (const orderedItem of section.orderedItems ?? []) {
      blocks.push(orderedItem);
    }
  }

  return blocks.join("\n\n");
}

export function buildTiptapDocument(title: string, sections: readonly DraftSection[]): TiptapNode {
  const content: TiptapNode[] = [createHeadingNode(2, title)];

  for (const section of sections) {
    content.push(createHeadingNode(3, section.heading));

    for (const paragraph of section.paragraphs ?? []) {
      content.push(createParagraphNode(paragraph));
    }

    if ((section.bullets ?? []).length > 0) {
      content.push(createBulletListNode(section.bullets ?? []));
    }

    if ((section.orderedItems ?? []).length > 0) {
      content.push(createOrderedListNode(section.orderedItems ?? []));
    }
  }

  return {
    type: "doc",
    content,
  };
}