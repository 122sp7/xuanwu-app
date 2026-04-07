"use client";

/**
 * Module: knowledge
 * Layer: interfaces/components
 * Purpose: RichTextEditor — Tiptap-powered full-page rich text editor with
 *          Firebase persistence via PageEditorView's existing server actions.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { Typography } from "@tiptap/extension-typography";
import { Color } from "@tiptap/extension-color";
import { Loader2 } from "lucide-react";

import { getKnowledgeBlocks } from "../queries/knowledge.queries";
import { addKnowledgeBlock, updateKnowledgeBlock } from "../_actions/knowledge.actions";
import type { BlockContent } from "../../domain/value-objects/block-content";
import { richTextToPlainText } from "../../domain/value-objects/block-content";
import { CalloutBlock } from "./extensions/callout-block.extension";
import { ToggleBlock } from "./extensions/toggle-block.extension";
import { TableOfContentsNode } from "./extensions/table-of-contents-node.extension";
import { SyncedBlock } from "./extensions/synced-block.extension";
import { EditorToolbar } from "./editor-toolbar";

const DEBOUNCE_MS = 800;
const TIPTAP_PROPERTY_KEY = "tiptapJson";

interface RichTextEditorProps {
  accountId: string;
  pageId: string;
  onDocumentChange?: (json: object) => void;
}

export function RichTextEditor({ accountId, pageId, onDocumentChange }: RichTextEditorProps) {
  const [loading, setLoading] = useState(true);
  const blockIdRef = useRef<string | null | undefined>(undefined);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestJsonRef = useRef<object | null>(null);
  const isSavingRef = useRef(false);
  const mountedRef = useRef(true);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] }, codeBlock: false }),
      Placeholder.configure({ placeholder: "開始輸入，或按 / 選擇區塊類型…", emptyEditorClass: "is-editor-empty" }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { class: "text-primary underline" } }),
      Typography,
      Color,
      CalloutBlock,
      ToggleBlock,
      TableOfContentsNode,
      SyncedBlock,
    ],
    editable: true,
    immediatelyRender: false,
    onUpdate({ editor }) {
      const json = editor.getJSON();
      latestJsonRef.current = json;
      onDocumentChange?.(json);
      scheduleSave();
    },
  });

  useEffect(() => {
    mountedRef.current = true;
    if (!accountId || !pageId || !editor) { setLoading(false); return; }
    setLoading(true);

    void (async () => {
      try {
        const blocks = await getKnowledgeBlocks(accountId, pageId);
        const tiptapBlock = blocks.find((b) => b.content.properties?.[TIPTAP_PROPERTY_KEY] != null);

        if (tiptapBlock) {
          blockIdRef.current = tiptapBlock.id;
          const json = tiptapBlock.content.properties![TIPTAP_PROPERTY_KEY] as object;
          if (mountedRef.current) editor.commands.setContent(json, { emitUpdate: false });
        } else if (blocks.length > 0) {
          const legacyHtml = blocks.map((b) => {
            switch (b.content.type) {
              case "heading-1": return `<h1>${escapeHtml(richTextToPlainText(b.content.richText))}</h1>`;
              case "heading-2": return `<h2>${escapeHtml(richTextToPlainText(b.content.richText))}</h2>`;
              case "heading-3": return `<h3>${escapeHtml(richTextToPlainText(b.content.richText))}</h3>`;
              case "quote": return `<blockquote><p>${escapeHtml(richTextToPlainText(b.content.richText))}</p></blockquote>`;
              case "bullet-list": return `<ul><li><p>${escapeHtml(richTextToPlainText(b.content.richText))}</p></li></ul>`;
              case "numbered-list": return `<ol><li><p>${escapeHtml(richTextToPlainText(b.content.richText))}</p></li></ol>`;
              case "code": return `<pre><code>${escapeHtml(richTextToPlainText(b.content.richText))}</code></pre>`;
              case "divider": return "<hr />";
              default: return `<p>${escapeHtml(richTextToPlainText(b.content.richText))}</p>`;
            }
          }).join("");
          if (mountedRef.current) editor.commands.setContent(legacyHtml, { emitUpdate: false });
        } else {
          const result = await addKnowledgeBlock({ accountId, pageId, content: buildBlockContent(editor.getJSON()), index: 0 });
          if (result.success) blockIdRef.current = result.aggregateId;
        }
      } catch {
        // Silently ignore; editor is still usable, just unsaved.
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    })();

    return () => { mountedRef.current = false; };
  }, [accountId, editor, pageId]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      editor?.destroy();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scheduleSave = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { void persistNow(); }, DEBOUNCE_MS);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const persistNow = useCallback(async () => {
    const json = latestJsonRef.current;
    if (!json || isSavingRef.current) return;
    isSavingRef.current = true;
    try {
      if (blockIdRef.current == null) {
        const result = await addKnowledgeBlock({ accountId, pageId, content: buildBlockContent(json), index: 0 });
        if (result.success) blockIdRef.current = result.aggregateId;
      } else {
        await updateKnowledgeBlock({ accountId, blockId: blockIdRef.current, content: buildBlockContent(json) });
      }
    } finally {
      isSavingRef.current = false;
    }
  }, [accountId, pageId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">載入內容中…</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-[400px] flex-col rounded-xl border border-border/60 bg-card">
      {editor && <EditorToolbar editor={editor} />}
      <EditorContent
        editor={editor}
        className="tiptap-editor flex-1 cursor-text px-6 py-4 text-sm text-foreground"
      />
    </div>
  );
}

function buildBlockContent(tiptapJson: object): BlockContent {
  return { type: "text", richText: [], properties: { [TIPTAP_PROPERTY_KEY]: tiptapJson } };
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
