"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FileText, Layout } from "lucide-react";
import { listShellCommandCatalogItems } from "../../../../subdomains/search/api";
import { buildShellContextualHref } from "../../../../subdomains/platform-config/api";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@ui-shadcn/ui/command";

const NAV_ITEMS = listShellCommandCatalogItems();

const GROUP_ICONS: Record<string, React.ReactNode> = {
  "導覽": <Layout className="size-4 mr-2 opacity-60" />,
  "Knowledge": <FileText className="size-4 mr-2 opacity-60" />,
  "Source": <FileText className="size-4 mr-2 opacity-60" />,
};

interface ShellGlobalSearchDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

const NON_ACCOUNT_WORKSPACE_TOP_LEVEL_ROUTES = new Set([
  "workspace",
  "workspace-feed",
  "knowledge",
  "knowledge-base",
  "knowledge-database",
  "source",
  "notebook",
  "ai-chat",
  "organization",
  "settings",
  "dashboard",
  "dev-tools",
]);

export function ShellGlobalSearchDialog({ open, onOpenChange }: ShellGlobalSearchDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pathSegments = pathname.split("/").filter(Boolean);
  const pathAccountId =
    pathSegments.length > 0 && !NON_ACCOUNT_WORKSPACE_TOP_LEVEL_ROUTES.has(pathSegments[0])
      ? decodeURIComponent(pathSegments[0])
      : null;

  const pathWorkspaceId =
    pathSegments.length > 1 && pathAccountId && !["organization", "settings", "dev-tools"].includes(pathSegments[1])
      ? decodeURIComponent(pathSegments[1])
      : null;

  const queryWorkspaceId = searchParams.get("workspaceId")?.trim() || null;
  const activeWorkspaceId = pathWorkspaceId || queryWorkspaceId;

  const commandItems = NAV_ITEMS.map((item) => ({
    ...item,
    href: buildShellContextualHref(item.href, {
      accountId: pathAccountId,
      workspaceId: activeWorkspaceId,
    }),
  }));

  function handleSelect(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  const groups = Array.from(new Set(commandItems.map((i) => i.group)));

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
            {commandItems.filter((i) => i.group === group).map((item) => (
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
