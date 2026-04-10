"use client";

/**
 * Module: notion/subdomains/knowledge
 * Layer: interfaces/components
 * Purpose: PageEditorView — renders the block editor for a knowledge page.
 *          Connects accountId/pageId context to BlockEditorView.
 */

import { useEffect, useCallback } from "react";
import { useBlockEditorStore } from "../store/block-editor.store";
import { getKnowledgeBlocks } from "../queries/index";
import { BlockEditorView } from "./BlockEditorView";

export interface PageEditorViewProps {
  accountId: string;
  pageId: string;
}

export function PageEditorView({ accountId, pageId }: PageEditorViewProps) {
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

  return <BlockEditorView />;
}
