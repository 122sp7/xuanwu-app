"use client";

/**
 * Module: notion/subdomains/knowledge
 * Layer: interfaces/components
 * Purpose: PageEditorView — renders the block editor for a knowledge page.
 *          Connects accountId/pageId context to BlockEditorView.
 */

import { BlockEditorView } from "./BlockEditorView";

export interface PageEditorViewProps {
  accountId: string;
  pageId: string;
}

export function PageEditorView({ accountId, pageId }: PageEditorViewProps) {
  // accountId and pageId are available for future direct Firestore subscriptions.
  void accountId;
  void pageId;
  return <BlockEditorView />;
}
