"use client";

/**
 * Module: notion/subdomains/knowledge
 * Layer: interfaces/components
 * Purpose: PageEditorPanel ??renders the block editor for a knowledge page.
 *          Connects accountId/pageId context to BlockEditorPanel.
 */

import { useEffect, useCallback } from "react";
import { useBlockEditorStore } from "../store/block-editor.store";
import { getKnowledgeBlocks } from "../queries";
import { BlockEditorPanel } from "./BlockEditorPanel";

export interface PageEditorPanelProps {
  accountId: string;
  pageId: string;
}

export function PageEditorPanel({ accountId, pageId }: PageEditorPanelProps) {
  const { setPage, setBlocks } = useBlockEditorStore();

  const loadBlocks = useCallback(async () => {
    if (!accountId || !pageId) return;
    setPage(accountId, pageId);
    const snapshots = await getKnowledgeBlocks(accountId, pageId);
    setBlocks(
      snapshots.map((b) => ({
        id: b.id,
        content: b.content,
        order: b.order,
        parentBlockId: b.parentBlockId,
        isFocused: false,
      })),
    );
  }, [accountId, pageId, setPage, setBlocks]);

  useEffect(() => { void loadBlocks(); }, [loadBlocks]);

  return <BlockEditorPanel />;
}

