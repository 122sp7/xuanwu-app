"use client";

/**
 * Module: knowledge
 * Layer: interfaces/components
 * Purpose: RichTextEditor — Tiptap-powered full-page rich text editor with
 *          Firebase persistence via PageEditorView's existing server actions.
 *
 * Architecture:
 *  - The entire page content is stored as a single Tiptap JSON document.
 *  - Firebase block: type "text", properties.tiptapJson = <TiptapJSON object>.
 *  - On mount, loads the canonical block (first block with properties.tiptapJson).
 *  - Falls back to reconstructing from legacy contentEditable text blocks.
 *  - On editor change (debounced 800 ms), persists via updateKnowledgeBlock.
 *
 * Extensions used:
 *  - StarterKit (paragraph, heading 1-3, bold, italic, code, lists, blockquote, hr, strike)
 *  - Placeholder
 *  - Underline
 *  - Link (with auto-link)
 *  - Typography (smart quotes, en-dash)
 *  - TextStyle + Color (inline text colouring)
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { Typography } from "@tiptap/extension-typography";
import { Color } from "@tiptap/extension-color";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Minus,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Loader2,
} from "lucide-react";

import { getKnowledgeBlocks } from "../queries/knowledge.queries";
import {
  addKnowledgeBlock,
  updateKnowledgeBlock,
} from "../_actions/knowledge.actions";
import type { BlockContent } from "../../domain/value-objects/block-content";
import { richTextToPlainText } from "../../domain/value-objects/block-content";

// ── Constants ─────────────────────────────────────────────────────────────────

const DEBOUNCE_MS = 800;
/** Marker stored in block.properties so we can distinguish Tiptap blocks. */
const TIPTAP_PROPERTY_KEY = "tiptapJson";

// ── Types ─────────────────────────────────────────────────────────────────────

interface RichTextEditorProps {
  accountId: string;
  pageId: string;
  /** Optional: called when the document changes with the raw Tiptap JSON. */
  onDocumentChange?: (json: object) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function RichTextEditor({ accountId, pageId, onDocumentChange }: RichTextEditorProps) {
  const [loading, setLoading] = useState(true);
  /**
   * blockId of the persisted "tiptap" block in Firestore.
   * null = not yet created; undefined = being resolved.
   */
  const blockIdRef = useRef<string | null | undefined>(undefined);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestJsonRef = useRef<object | null>(null);
  const isSavingRef = useRef(false);
  const mountedRef = useRef(true);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false, // use plain code marks for now
      }),
      Placeholder.configure({
        placeholder: "開始輸入，或按 / 選擇區塊類型…",
        emptyEditorClass: "is-editor-empty",
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { class: "text-primary underline" },
      }),
      Typography,
      Color,
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

  // ── Load from Firebase ──────────────────────────────────────────────────────

  useEffect(() => {
    mountedRef.current = true;
    if (!accountId || !pageId || !editor) { setLoading(false); return; }
    setLoading(true);

    void (async () => {
      try {
        const blocks = await getKnowledgeBlocks(accountId, pageId);

        // Find the canonical Tiptap block.
        const tiptapBlock = blocks.find(
          (b) => b.content.properties?.[TIPTAP_PROPERTY_KEY] != null,
        );

        if (tiptapBlock) {
          blockIdRef.current = tiptapBlock.id;
          const json = tiptapBlock.content.properties![TIPTAP_PROPERTY_KEY] as object;
          if (mountedRef.current) {
            editor.commands.setContent(json, { emitUpdate: false });
          }
        } else if (blocks.length > 0) {
          // Legacy blocks: reconstruct as Tiptap paragraphs.
          const legacyHtml = blocks
            .map((b) => {
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
            })
            .join("");

          if (mountedRef.current) {
            editor.commands.setContent(legacyHtml, { emitUpdate: false });
          }
          // blockIdRef stays null — first save will create a new Tiptap block.
        } else {
          // Brand new page — create an empty Tiptap block.
          const emptyContent = buildBlockContent(editor.getJSON());
          const result = await addKnowledgeBlock({
            accountId,
            pageId,
            content: emptyContent,
            index: 0,
          });
          if (result.success) {
            blockIdRef.current = result.aggregateId;
          }
        }
      } catch {
        // Silently ignore; editor is still usable, just unsaved.
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    })();

    return () => {
      mountedRef.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- editor instance is stable
  }, [accountId, pageId]);

  // Cleanup editor on unmount.
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      editor?.destroy();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Save / debounce ─────────────────────────────────────────────────────────

  const scheduleSave = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void persistNow();
    }, DEBOUNCE_MS);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const persistNow = useCallback(async () => {
    const json = latestJsonRef.current;
    if (!json || isSavingRef.current) return;

    isSavingRef.current = true;
    try {
      if (blockIdRef.current == null) {
        // First save: create the block.
        const result = await addKnowledgeBlock({
          accountId,
          pageId,
          content: buildBlockContent(json),
          index: 0,
        });
        if (result.success) blockIdRef.current = result.aggregateId;
      } else {
        // Subsequent saves: update the block.
        await updateKnowledgeBlock({
          accountId,
          blockId: blockIdRef.current,
          content: buildBlockContent(json),
        });
      }
    } finally {
      isSavingRef.current = false;
    }
  }, [accountId, pageId]);

  // ── Loading state ───────────────────────────────────────────────────────────

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
      {/* Toolbar */}
      {editor && <EditorToolbar editor={editor} />}

      {/* Editor surface */}
      <EditorContent
        editor={editor}
        className="tiptap-editor flex-1 cursor-text px-6 py-4 text-sm text-foreground"
      />
    </div>
  );
}

// ── Toolbar ───────────────────────────────────────────────────────────────────

function EditorToolbar({ editor }: { editor: Editor }) {
  function toggleLink() {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const url = window.prompt("輸入連結 URL：");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border/60 px-3 py-1.5">
      {/* Undo / Redo */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="復原"
        >
          <Undo className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="取消復原"
        >
          <Redo className="size-3.5" />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      {/* Headings */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          title="標題 1"
        >
          <Heading1 className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="標題 2"
        >
          <Heading2 className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="標題 3"
        >
          <Heading3 className="size-3.5" />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      {/* Inline marks */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="粗體 (Ctrl+B)"
        >
          <Bold className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="斜體 (Ctrl+I)"
        >
          <Italic className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="底線 (Ctrl+U)"
        >
          <UnderlineIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="刪除線"
        >
          <Strikethrough className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="行內程式碼 (Ctrl+E)"
        >
          <Code className="size-3.5" />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      {/* Link */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={toggleLink}
          active={editor.isActive("link")}
          title="連結"
        >
          <LinkIcon className="size-3.5" />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      {/* Lists */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="項目清單"
        >
          <List className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="編號清單"
        >
          <ListOrdered className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="引言"
        >
          <Quote className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="水平線"
        >
          <Minus className="size-3.5" />
        </ToolbarButton>
      </ToolbarGroup>
    </div>
  );
}

// ── Toolbar primitives ────────────────────────────────────────────────────────

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function ToolbarSeparator() {
  return <div className="mx-1 h-5 w-px bg-border/60" />;
}

interface ToolbarButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  title?: string;
}

function ToolbarButton({ onClick, children, active, disabled, title }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`flex size-7 items-center justify-center rounded transition ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      } disabled:opacity-30`}
    >
      {children}
    </button>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Build the BlockContent envelope that wraps a Tiptap JSON document. */
function buildBlockContent(tiptapJson: object): BlockContent {
  return {
    type: "text",
    richText: [], // Canonical content is the tiptapJson; richText spans are left empty.
    properties: { [TIPTAP_PROPERTY_KEY]: tiptapJson },
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
