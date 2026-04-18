/**
 * @module ui-editor
 * TipTap 3 富文本編輯器封裝。
 *
 * Context7 基線：/ueberdosis/tiptap-docs
 * - 使用 useEditor + EditorContent（React 整合方式）。
 * - `immediatelyRender: false` 避免 Next.js SSR hydration mismatch。
 * - 啟用 StarterKit + Link + Underline + TextStyle + Color + Typography + Placeholder。
 */

"use client";

import { createElement, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";

// ─── RichTextEditor ───────────────────────────────────────────────────────────

export interface RichTextEditorProps {
  /** HTML string content */
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  /** Disable editor (read-only mode via prop) */
  disabled?: boolean;
}

/**
 * Editable TipTap rich-text editor with common formatting extensions.
 *
 * @example
 * ```tsx
 * <RichTextEditor
 *   value={html}
 *   onChange={setHtml}
 *   placeholder="Start writing…"
 * />
 * ```
 */
export const RichTextEditor = ({
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Underline,
      TextStyle,
      Color,
      Typography,
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: value,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
  });

  // Sync external content changes (e.g., form reset)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  // Sync editable state
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  return createElement(EditorContent, {
    editor,
    className: ["tiptap-editor w-full rounded-md border p-3", className]
      .filter(Boolean)
      .join(" "),
  });
};

// ─── ReadOnlyEditor ───────────────────────────────────────────────────────────

export interface ReadOnlyEditorProps {
  /** HTML string content */
  value: string;
  className?: string;
}

/**
 * Read-only TipTap viewer. Uses an editable:false editor instance so that
 * the same HTML output is rendered with ProseMirror schema rather than
 * raw dangerouslySetInnerHTML.
 */
export const ReadOnlyEditor = ({ value, className }: ReadOnlyEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit, Link, Underline, TextStyle, Color, Typography],
    content: value,
    editable: false,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  return createElement(EditorContent, {
    editor,
    className: ["prose max-w-none rounded-md border p-3", className]
      .filter(Boolean)
      .join(" "),
  });
};
