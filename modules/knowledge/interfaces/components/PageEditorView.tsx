"use client";

/**
 * Module: knowledge
 * Layer: interfaces/components
 * Purpose: PageEditorView — Firebase-connected page editor.
 *
 * Delegates to RichTextEditor (Tiptap-powered) for rich text editing with
 * full toolbar, keyboard shortcuts, and Firebase persistence.
 */

import { RichTextEditor } from "./RichTextEditor";

export interface PageEditorViewProps {
  accountId: string;
  pageId: string;
}

export function PageEditorView({ accountId, pageId }: PageEditorViewProps) {
  return <RichTextEditor accountId={accountId} pageId={pageId} />;
}
