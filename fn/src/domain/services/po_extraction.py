"""
Domain Service — Purchase Order (PO) line item extraction and classification.

Pure business logic — no infrastructure dependency.

Supports the ABB 訂購單 AP8 format (document 4510250181-AP8_v0-8150.PDF):
  - 54 line items numbered 10–540 in steps of 10
  - Two task categories: 施工作業 (construction) / 費用管銷 (expense management)
  - Dense text format produced by Document AI OCR / Layout Parser

Dependency: stdlib only.
"""

from __future__ import annotations

import re
from typing import Any, Literal

# ── Chinese numeral character class used in section headers ─────────────────
_CHINESE_NUMERALS = "一二三四五六七八九十壹貳參肆伍陸柒捌玖拾"

# Pattern: item number (10–540, step 10) at word boundary
_ITEM_NO_PATTERN = re.compile(r"(?<!\d)(\d{2,3})(?=\s)")

# Pattern: 小計 + amount signals end of price data; description follows.
# The space between 小計 and the amount is optional — items crossing page
# breaks in the AP8 PDF produce "小計 721,619" (with space).
_SUBTOTAL_PATTERN = re.compile(r"小計\s*[\d,，.]+\s*")

# Pattern: section header 「（中文数字）」
_SECTION_HEADER_PATTERN = re.compile(
    rf"（([{_CHINESE_NUMERALS}]+)\s*）([^（\n]{{1,80}})"
)

# Pattern to truncate description at noise boundaries within a single OCR line:
# next-item anchor (e.g. "330 3RDTW"), summary totals, or ABB page footer.
# Note: "ABB Ltd." is intentionally vendor-specific — this service is scoped to
# the ABB AP8 訂購單 format (document 4510250181); see module docstring.
_DESCRIPTION_STOP_PATTERN = re.compile(r"\d{2,3}\s+3RDTW|未稅總計|ABB Ltd\.")

# ── Classification rules ─────────────────────────────────────────────────────

# Section numerals whose entire section is 費用管銷.
# Specific to the ABB AP8 訂購單 4510250181 section structure:
#   伍 = Section 5 （伍）雜項費用 (Miscellaneous Expenses — management headcount, safety, site floor protection)
#   玖 = Section 9 （玖）利潤及雜費 (Profit and Miscellaneous Fees)
# Sections 一–肆 and 柒–捌 contain a mix; classification falls through to
# _COST_DESCRIPTION_PATTERNS for per-item discrimination.
_COST_SECTION_CHARS: frozenset[str] = frozenset(["伍", "玖"])

# Description-level patterns that force 費用管銷, regardless of section
_COST_DESCRIPTION_PATTERNS: list[re.Pattern[str]] = [
    re.compile(r"費$"),           # ends with 費 (e.g., 高空作業費, 工程衛生費)
    re.compile(r"費用"),          # 費用 anywhere
    re.compile(r"管理\d*人"),     # management headcount (e.g., 管理1人*4個月)
    re.compile(r"監工"),          # supervision
    re.compile(r"工安費"),        # safety fee
    re.compile(r"保險"),          # insurance
    re.compile(r"分攤"),          # cost allocation
    re.compile(r"廢棄物"),        # waste disposal
    re.compile(r"5D"),            # 5D cost
    re.compile(r"利潤"),          # profit
    re.compile(r"圖控與軟體"),    # SCADA software deliverable (cost item)
    re.compile(r"圖面製作"),      # drawing / document fee
    re.compile(r"工務所"),        # site office
]


def classify_po_task(description: str, section_char: str = "") -> Literal["施工作業", "費用管銷"]:
    """Classify a PO line item as 施工作業 or 費用管銷.

    Args:
        description: Chinese task description text.
        section_char: Chinese numeral from the section header (e.g., "伍").

    Returns:
        "施工作業" or "費用管銷"
    """
    # Section-level override takes precedence
    if section_char in _COST_SECTION_CHARS:
        return "費用管銷"

    # Description-level pattern matching
    for pattern in _COST_DESCRIPTION_PATTERNS:
        if pattern.search(description):
            return "費用管銷"

    return "施工作業"


def extract_po_line_items(text: str) -> list[dict[str, Any]]:
    """Extract structured line items from AP8 PO raw text.

    Document AI (OCR / Layout Parser) produces dense text where each line item
    is formatted as::

        "{item_no} {product_code} SET {price}... 小計{total}（{section}）{description}"

    This function locates each item's Chinese section header and description
    after the price block and returns a structured list.

    Args:
        text: Raw text from Document AI output for the PO document.

    Returns:
        Sorted list (by item_no) of dicts with keys:
            item_no (int): 10, 20, … 540
            section (str): e.g., "（一）SCADA站內工程"
            section_char (str): e.g., "一"
            description (str): task description text
            category (str): "施工作業" or "費用管銷"
            raw_snippet (str): first 200 chars of the matched segment
    """
    # Normalize horizontal whitespace for reliable pattern matching
    normalized = re.sub(r"[ \t]+", " ", text)

    items: list[dict[str, Any]] = []

    # Split on item boundaries: digit(s) followed by the ABB product code prefix
    # or a Chinese description marker so we get one segment per line item.
    segment_pattern = re.compile(
        r"(?<!\d)(\d{2,3})\s+3RDTW\S+",
        re.DOTALL,
    )
    segments = list(segment_pattern.finditer(normalized))

    for idx, match in enumerate(segments):
        item_no_str = match.group(1)
        try:
            item_no = int(item_no_str)
        except ValueError:
            continue

        # Validate item number is in the expected AP8 range (10–540, step 10)
        if not (10 <= item_no <= 540 and item_no % 10 == 0):
            continue

        # Extract the text segment for this item
        start = match.start()
        end = segments[idx + 1].start() if idx + 1 < len(segments) else len(normalized)
        segment = normalized[start:end]

        # Find 小計 to locate where the price block ends
        subtotal_match = _SUBTOTAL_PATTERN.search(segment)
        description_zone = segment[subtotal_match.end():] if subtotal_match else segment

        # Extract section header + leading description from the description zone
        header_match = _SECTION_HEADER_PATTERN.search(description_zone)
        if not header_match:
            continue

        section_char = header_match.group(1).strip()
        description_raw = (header_match.group(2) or "").strip()
        # Truncate at noise boundaries (next-item anchor or summary totals)
        description_raw = _DESCRIPTION_STOP_PATTERN.split(description_raw, maxsplit=1)[0].strip()

        # Collect any remaining text after the section header (may continue on next line)
        after_header = description_zone[header_match.end():].strip()
        # Limit to first sentence/clause; stop at new section, page-break, next item, or totals
        extra = re.split(r"[（\n]|ABB Ltd\.|(?=\d{2,3}\s+3RDTW)|未稅總計", after_header, maxsplit=1)[0].strip()
        # Only append extra if it starts with Chinese text (genuine description continuation).
        # ASCII-leading text (e.g., "Ref: 6591401)折扣…") is leaked price data — discard.
        # Known limitation: descriptions that legitimately start with English terms
        # (e.g., "RTU盤內…") will not be extended by extra; they are however already
        # fully captured by _SECTION_HEADER_PATTERN group 2 in practice.
        if extra and re.match(r"^[\u4e00-\u9fff（]", extra):
            description_raw = (description_raw + " " + extra).strip()

        description = re.sub(r"\s+", " ", description_raw).strip()
        if not description:
            continue

        section_label = f"（{section_char}）"
        category = classify_po_task(description, section_char)

        items.append(
            {
                "item_no": item_no,
                "section": section_label,
                "section_char": section_char,
                "description": description,
                "category": category,
                "raw_snippet": segment[:200],
            }
        )

    items.sort(key=lambda x: x["item_no"])

    # De-duplicate: the PDF's multi-page layout causes identical items to appear
    # more than once in the OCR text.  Keep the first occurrence per item_no
    # because it tends to come from the main table (cleaner formatting).
    seen: set[int] = set()
    deduped: list[dict[str, Any]] = []
    for item in items:
        if item["item_no"] not in seen:
            seen.add(item["item_no"])
            deduped.append(item)
    return deduped


def po_line_items_to_rag_chunks(
    line_items: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """Convert extracted PO line items to RAG chunk format.

    Each line item becomes one chunk, preserving category metadata so the
    RAG pipeline can filter by 施工作業 / 費用管銷.

    Args:
        line_items: Output of extract_po_line_items().

    Returns:
        list of dicts compatible with the RAG ingestion pipeline.
    """
    result: list[dict[str, Any]] = []
    for item in line_items:
        text = (
            f"[{item['category']}] 項次 {item['item_no']} "
            f"{item['section']} {item['description']}"
        ).strip()
        result.append(
            {
                "text": text,
                "char_start": 0,
                "char_end": len(text),
                "page_start": 0,
                "page_end": 0,
                "chunk_id": f"po-item-{item['item_no']:03d}",
                "source_block_indices": [],
                "po_item_no": item["item_no"],
                "po_category": item["category"],
                "po_section": item["section"],
            }
        )
    return result
