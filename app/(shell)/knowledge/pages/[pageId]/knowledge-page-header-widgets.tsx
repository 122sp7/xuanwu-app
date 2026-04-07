"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ImageIcon, Pencil, Smile } from "lucide-react";

import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@ui-shadcn/ui/popover";

// ── Title editor ──────────────────────────────────────────────────────────────

export interface TitleEditorProps {
  initialTitle: string;
  onSave: (title: string) => void;
  isPending: boolean;
}

export function TitleEditor({ initialTitle, onSave, isPending }: TitleEditorProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setValue(initialTitle); }, [initialTitle]);

  function startEdit() {
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function commit() {
    setEditing(false);
    const trimmed = value.trim();
    if (trimmed && trimmed !== initialTitle) {
      onSave(trimmed);
    } else {
      setValue(initialTitle);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); commit(); }
    if (e.key === "Escape") { setValue(initialTitle); setEditing(false); }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          disabled={isPending}
          className="h-auto border-0 bg-transparent px-0 text-2xl font-semibold tracking-tight shadow-none focus-visible:ring-0"
        />
        <button
          type="button"
          onClick={commit}
          disabled={isPending}
          className="rounded p-1 text-muted-foreground hover:text-foreground"
          aria-label="儲存標題"
        >
          <Check className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-2">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{value}</h1>
      <button
        type="button"
        onClick={startEdit}
        disabled={isPending}
        className="invisible rounded p-1 text-muted-foreground hover:text-foreground group-hover:visible"
        aria-label="重新命名頁面"
      >
        <Pencil className="size-3.5" />
      </button>
    </div>
  );
}

// ── Icon picker ───────────────────────────────────────────────────────────────

const QUICK_EMOJIS = ["📄", "📝", "📚", "💡", "🎯", "🚀", "⭐", "🔑", "📌", "🗂️", "🏷️", "🔖", "📋", "🗒️", "📊", "🔍"];

export interface IconPickerProps {
  value?: string;
  onChange: (icon: string) => void;
  isPending: boolean;
}

export function IconPicker({ value, onChange, isPending }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={isPending}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-xl hover:bg-muted/60 transition"
          title="設定頁面圖示"
        >
          {value ? value : <Smile className="h-5 w-5 text-muted-foreground" />}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <p className="mb-2 text-xs font-medium text-muted-foreground">選擇圖示</p>
        <div className="mb-3 grid grid-cols-8 gap-1">
          {QUICK_EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => { onChange(e); setOpen(false); }}
              className="rounded p-1 text-lg hover:bg-muted transition"
            >
              {e}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="輸入 emoji 或文字"
            className="h-7 text-xs"
          />
          <Button
            size="sm"
            className="h-7 px-2 text-xs"
            disabled={!custom.trim()}
            onClick={() => { onChange(custom.trim()); setCustom(""); setOpen(false); }}
          >
            套用
          </Button>
        </div>
        {value && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 h-7 w-full text-xs text-muted-foreground"
            onClick={() => { onChange(""); setOpen(false); }}
          >
            移除圖示
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}

// ── Cover editor ──────────────────────────────────────────────────────────────

export interface CoverEditorProps {
  value?: string;
  onChange: (url: string) => void;
  isPending: boolean;
}

export function CoverEditor({ value, onChange, isPending }: CoverEditorProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(value ?? "");

  return (
    <Popover open={open} onOpenChange={(v) => { setOpen(v); if (v) setUrl(value ?? ""); }}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={isPending}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition"
          title="設定封面圖片"
        >
          <ImageIcon className="h-3.5 w-3.5" />
          {value ? "變更封面" : "新增封面"}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3">
        <p className="mb-2 text-xs font-medium text-muted-foreground">封面圖片 URL</p>
        <div className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="h-7 text-xs"
          />
          <Button
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => { onChange(url.trim()); setOpen(false); }}
          >
            套用
          </Button>
        </div>
        {value && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 h-7 w-full text-xs text-muted-foreground"
            onClick={() => { onChange(""); setOpen(false); }}
          >
            移除封面
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
