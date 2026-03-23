"use client";

/**
 * global-search-palette.tsx
 * Purpose: Global search command palette activated by Cmd/Ctrl+K.
 * Responsibilities: keyboard shortcut registration, search input, and result display.
 * Constraints: client-only; delegates data fetching to callers via onSelect callback.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Book,
  Database,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@ui-shadcn/ui/command";

interface SearchResultItem {
  id: string;
  label: string;
  description?: string;
  href: string;
  group: string;
  icon?: React.ComponentType<{ className?: string }>;
  shortcut?: string;
}

const STATIC_NAVIGATION_ITEMS: SearchResultItem[] = [
  {
    id: "dashboard",
    label: "儀表板",
    description: "主儀表板總覽",
    href: "/dashboard",
    group: "導覽",
    icon: LayoutDashboard,
    shortcut: "D",
  },
  {
    id: "wiki-beta",
    label: "Account Wiki-Beta",
    description: "知識庫總覽",
    href: "/wiki-beta",
    group: "導覽",
    icon: Book,
  },
  {
    id: "wiki-beta-pages",
    label: "Wiki 頁面",
    description: "頁面樹管理",
    href: "/wiki-beta/pages",
    group: "導覽",
    icon: FileText,
  },
  {
    id: "wiki-beta-libraries",
    label: "Wiki Libraries",
    description: "結構化資料庫",
    href: "/wiki-beta/libraries",
    group: "導覽",
    icon: Database,
  },
  {
    id: "wiki-beta-rag",
    label: "RAG 查詢",
    description: "知識問答",
    href: "/wiki-beta/rag-query",
    group: "導覽",
    icon: MessageSquare,
  },
  {
    id: "settings",
    label: "個人設定",
    description: "帳號與偏好設定",
    href: "/settings",
    group: "導覽",
    icon: Settings,
    shortcut: "S",
  },
];

interface GlobalSearchPaletteProps {
  /** Whether the palette is open. */
  open: boolean;
  /** Callback to close the palette. */
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearchPalette({ open, onOpenChange }: GlobalSearchPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? STATIC_NAVIGATION_ITEMS.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase()),
      )
    : STATIC_NAVIGATION_ITEMS;

  const groups = Array.from(new Set(filtered.map((item) => item.group)));

  function handleSelect(item: SearchResultItem) {
    onOpenChange(false);
    setQuery("");
    router.push(item.href);
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      setQuery("");
    }
    onOpenChange(next);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="全域搜尋"
      description="搜尋頁面、文件與指令"
    >
      <CommandInput
        placeholder="搜尋頁面、文件或指令…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>找不到符合的結果</CommandEmpty>

        {groups.map((group, groupIndex) => (
          <span key={group}>
            {groupIndex > 0 && <CommandSeparator />}
            <CommandGroup heading={group}>
              {filtered
                .filter((item) => item.group === group)
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <CommandItem
                      key={item.id}
                      value={item.label}
                      onSelect={() => handleSelect(item)}
                    >
                      {Icon ? (
                        <Icon className="size-4 shrink-0 text-muted-foreground" />
                      ) : null}
                      <span className="flex-1">{item.label}</span>
                      {item.description ? (
                        <span className="text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      ) : null}
                      {item.shortcut ? (
                        <CommandShortcut>⌘{item.shortcut}</CommandShortcut>
                      ) : null}
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </span>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

/** Hook to wire up Cmd/Ctrl+K keyboard shortcut for the global search palette. */
export function useGlobalSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        onOpen();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpen]);
}
