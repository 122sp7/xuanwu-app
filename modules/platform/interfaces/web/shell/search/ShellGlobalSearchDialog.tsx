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
  { href: "/workspace", label: "Workspace Hub", group: "導覽" },
  { href: "/knowledge", label: "Knowledge Hub", group: "導覽" },
  { href: "/knowledge-base/articles", label: "Knowledge Base", group: "導覽" },
  { href: "/knowledge-database/databases", label: "Knowledge Database", group: "導覽" },
  { href: "/notebook/rag-query", label: "Notebook / AI", group: "導覽" },
  { href: "/ai-chat", label: "AI Chat", group: "導覽" },
  { href: "/knowledge/pages", label: "頁面管理", group: "Knowledge" },
  { href: "/knowledge/block-editor", label: "區塊編輯器", group: "Knowledge" },
  { href: "/source/libraries", label: "Libraries 表格", group: "Source" },
] as const;

const GROUP_ICONS: Record<string, React.ReactNode> = {
  "導覽": <Layout className="size-4 mr-2 opacity-60" />,
  "Knowledge": <FileText className="size-4 mr-2 opacity-60" />,
  "Source": <FileText className="size-4 mr-2 opacity-60" />,
};

interface ShellGlobalSearchDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function ShellGlobalSearchDialog({ open, onOpenChange }: ShellGlobalSearchDialogProps) {
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
export function useShellGlobalSearch() {
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
