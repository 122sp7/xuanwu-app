"use client";

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
  AlertCircle,
  ChevronRight,
  TableOfContents,
  Link2,
} from "lucide-react";
import type { Editor } from "@tiptap/react";

// ── Toolbar ───────────────────────────────────────────────────────────────────

export function EditorToolbar({ editor }: { editor: Editor }) {
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
      <ToolbarGroup>
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="復原">
          <Undo className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="取消復原">
          <Redo className="size-3.5" />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="標題 1">
          <Heading1 className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="標題 2">
          <Heading2 className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="標題 3">
          <Heading3 className="size-3.5" />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="粗體 (Ctrl+B)">
          <Bold className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="斜體 (Ctrl+I)">
          <Italic className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="底線 (Ctrl+U)">
          <UnderlineIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="刪除線">
          <Strikethrough className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="行內程式碼 (Ctrl+E)">
          <Code className="size-3.5" />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ToolbarButton onClick={toggleLink} active={editor.isActive("link")} title="連結">
          <LinkIcon className="size-3.5" />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="項目清單">
          <List className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="編號清單">
          <ListOrdered className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="引言">
          <Quote className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="水平線">
          <Minus className="size-3.5" />
        </ToolbarButton>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ToolbarButton onClick={() => editor.chain().focus().toggleWrap("callout").run()} active={editor.isActive("callout")} title="標注區塊 (Callout)">
          <AlertCircle className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleWrap("toggle").run()} active={editor.isActive("toggle")} title="折疊區塊 (Toggle)">
          <ChevronRight className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().insertContent({ type: "tableOfContents" }).run()} title="目錄 (TOC)">
          <TableOfContents className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().insertContent({ type: "syncedBlock" }).run()} active={editor.isActive("syncedBlock")} title="同步區塊 (Synced Block)">
          <Link2 className="size-3.5" />
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
