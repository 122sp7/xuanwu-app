"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Layout } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@ui-shadcn/ui/command";

const NAV_ITEMS = [
  { href: "/wiki", label: "Wiki", group: "導覽" },
  { href: "/wiki/block-editor", label: "區塊編輯器", group: "Wiki" },
  { href: "/wiki/pages-dnd", label: "頁面樹 (DnD)", group: "Wiki" },
  { href: "/wiki/libraries", label: "Libraries 表格", group: "Wiki" },
  { href: "/wiki/rag-query", label: "RAG 查詢", group: "Wiki" },
  { href: "/wiki/documents", label: "文件管理", group: "Wiki" },
] as const;

const GROUP_ICONS: Record<string, React.ReactNode> = {
  "導覽": <Layout className="size-4 mr-2 opacity-60" />,
  "Wiki": <FileText className="size-4 mr-2 opacity-60" />,
};

interface GlobalSearchDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function GlobalSearchDialog({ open, onOpenChange }: GlobalSearchDialogProps) {
  const router = useRouter();

  function handleSelect(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  const groups = Array.from(new Set(NAV_ITEMS.map((i) => i.group)));

  return (
    <CommandDialog
      title="全域搜尋"
      description="搜尋頁面或功能"
      open={open}
      onOpenChange={onOpenChange}
    >
      <CommandInput placeholder="搜尋頁面或功能…" />
      <CommandList>
        <CommandEmpty>找不到結果。</CommandEmpty>
        {groups.map((group) => (
          <CommandGroup key={group} heading={group}>
            {NAV_ITEMS.filter((i) => i.group === group).map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => handleSelect(item.href)}
              >
                {GROUP_ICONS[group]}
                {item.label}
                <CommandShortcut className="text-[10px] opacity-50">{item.href}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

/** Hook to manage Cmd/Ctrl+K keyboard shortcut. */
export function useGlobalSearch() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return { open, setOpen };
}
