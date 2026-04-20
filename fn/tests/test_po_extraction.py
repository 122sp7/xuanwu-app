"""
Unit tests for domain/services/po_extraction.py.

Tests cover the ABB 訂購單 AP8 format (document 4510250181-AP8_v0-8150.PDF):
  - 54 line items numbered 10–540 in steps of 10
  - Classification into 施工作業 / 費用管銷
  - Dense text format from Document AI OCR output
"""

from __future__ import annotations

import pytest

from domain.services.po_extraction import (
    classify_po_task,
    extract_po_line_items,
    po_line_items_to_rag_chunks,
)


# ── classify_po_task ──────────────────────────────────────────────────────────


class TestClassifyPoTask:
    def test_scada_installation_is_work(self) -> None:
        assert classify_po_task("既設161kv RTU（FrontEnd >FO box>Relay RS485）") == "施工作業"

    def test_fiber_splicing_is_work(self) -> None:
        assert classify_po_task("光纖熔接", section_char="一") == "施工作業"

    def test_panel_transport_is_work(self) -> None:
        assert classify_po_task("DC套盤搬運定位", section_char="壹") == "施工作業"

    def test_fire_seal_is_work(self) -> None:
        assert classify_po_task("防火填塞", section_char="柒") == "施工作業"

    def test_foundation_work_is_work(self) -> None:
        assert classify_po_task("DC盤基礎座製作約6000*800*100", section_char="參") == "施工作業"

    def test_high_altitude_fee_is_cost(self) -> None:
        # ends with 費 → 費用管銷
        assert classify_po_task("高空作業費", section_char="一") == "費用管銷"

    def test_sanitation_fee_is_cost(self) -> None:
        assert classify_po_task("工程衛生費", section_char="一") == "費用管銷"

    def test_document_fee_is_cost(self) -> None:
        assert classify_po_task("文件及圖面製作費", section_char="一") == "費用管銷"

    def test_software_control_is_cost(self) -> None:
        assert classify_po_task("圖控與軟體", section_char="一") == "費用管銷"

    def test_substation_management_is_cost(self) -> None:
        # 管理N人 pattern
        assert classify_po_task("CUP變電站管理1人*4個月", section_char="伍") == "費用管銷"

    def test_supervision_fee_is_cost(self) -> None:
        assert classify_po_task("監工/工安費3人*8個月", section_char="伍") == "費用管銷"

    def test_insurance_is_cost(self) -> None:
        assert classify_po_task("保險費", section_char="捌") == "費用管銷"

    def test_waste_disposal_is_cost(self) -> None:
        assert classify_po_task("廢棄物處理", section_char="捌") == "費用管銷"

    def test_profit_and_misc_is_cost(self) -> None:
        assert classify_po_task("利潤及雜費", section_char="玖") == "費用管銷"

    def test_wu_section_forces_cost(self) -> None:
        # Section 伍 (雜項費用) is always 費用管銷 regardless of description
        assert classify_po_task("地板防護", section_char="伍") == "費用管銷"

    def test_jiu_section_forces_cost(self) -> None:
        assert classify_po_task("雜費", section_char="玖") == "費用管銷"

    def test_5d_cost_is_cost(self) -> None:
        assert classify_po_task("5D 費用", section_char="捌") == "費用管銷"

    def test_site_office_is_cost(self) -> None:
        assert classify_po_task("工務所費用", section_char="捌") == "費用管銷"


# ── extract_po_line_items ─────────────────────────────────────────────────────


# Minimal AP8 text excerpt with two items representing both categories.
_AP8_EXCERPT = (
    "10 3RDTW5BD1 SET 756,000756,0002025.04.30 GIT(Cost Ref: 6591401)"
    "折扣-137,470(Customer PO: )小計618,530"
    "（一 ）SCADA站內工程:既設161kv RTU（FrontEnd >FO box>Relay RS485>Meter PT100 OLC#RJ45>RTU ）"
    "20 3RDTW5BD1 SET 200,000200,0002025.04.30 GIT(Cost Ref: 6591401)"
    "折扣-36,368(Customer PO: )小計163,632"
    "（一 ）SCADA站內工程:既設EH盤22.8KV"
    "210 3RDTW5BD1 SET 100,000100,0002025.04.30 GIT(Cost Ref: 6591401)"
    "折扣-18,184(Customer PO: )小計81,816"
    "（一 ）SCADA站內工程:高空作業費"
)


class TestExtractPoLineItems:
    def test_extractsItemNumbers(self) -> None:
        items = extract_po_line_items(_AP8_EXCERPT)
        item_nos = [item["item_no"] for item in items]
        assert 10 in item_nos
        assert 20 in item_nos
        assert 210 in item_nos

    def test_item10_isWork(self) -> None:
        items = extract_po_line_items(_AP8_EXCERPT)
        item10 = next((i for i in items if i["item_no"] == 10), None)
        assert item10 is not None
        assert item10["category"] == "施工作業"

    def test_item210_isCost(self) -> None:
        items = extract_po_line_items(_AP8_EXCERPT)
        item210 = next((i for i in items if i["item_no"] == 210), None)
        assert item210 is not None
        assert item210["category"] == "費用管銷"

    def test_itemsAreSortedByNumber(self) -> None:
        items = extract_po_line_items(_AP8_EXCERPT)
        nos = [i["item_no"] for i in items]
        assert nos == sorted(nos)

    def test_emptyText_returnsEmpty(self) -> None:
        assert extract_po_line_items("") == []

    def test_nonPoText_returnsEmpty(self) -> None:
        assert extract_po_line_items("This is not a PO document.") == []

    def test_descriptionIsNonEmpty(self) -> None:
        items = extract_po_line_items(_AP8_EXCERPT)
        for item in items:
            assert item["description"].strip() != "", f"Item {item['item_no']} has empty description"

    def test_categoryIsOnlyTwoValues(self) -> None:
        items = extract_po_line_items(_AP8_EXCERPT)
        for item in items:
            assert item["category"] in ("施工作業", "費用管銷")


# ── po_line_items_to_rag_chunks ───────────────────────────────────────────────


class TestPoLineItemsToRagChunks:
    def test_chunkContainsCategoryAndItemNo(self) -> None:
        line_items = [
            {
                "item_no": 10,
                "section": "（一）",
                "section_char": "一",
                "description": "既設161kv RTU",
                "category": "施工作業",
                "raw_snippet": "...",
            }
        ]
        chunks = po_line_items_to_rag_chunks(line_items)
        assert len(chunks) == 1
        chunk = chunks[0]
        assert "[施工作業]" in chunk["text"]
        assert "10" in chunk["text"]
        assert chunk["chunk_id"] == "po-item-010"
        assert chunk["po_category"] == "施工作業"
        assert chunk["po_item_no"] == 10

    def test_emptyInput_returnsEmpty(self) -> None:
        assert po_line_items_to_rag_chunks([]) == []

    def test_charStartIsZeroAndCharEndIsTextLength(self) -> None:
        line_items = [
            {
                "item_no": 100,
                "section": "（一）",
                "section_char": "一",
                "description": "光纖熔接",
                "category": "施工作業",
                "raw_snippet": "",
            }
        ]
        chunk = po_line_items_to_rag_chunks(line_items)[0]
        assert chunk["char_start"] == 0
        assert chunk["char_end"] == len(chunk["text"])
