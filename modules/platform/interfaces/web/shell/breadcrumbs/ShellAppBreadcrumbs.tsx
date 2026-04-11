"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { resolveShellBreadcrumbLabel } from "../../../../subdomains/platform-config/api";

export function ShellAppBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Only render when there's more than one segment (i.e., not just root page).
  if (segments.length <= 1) return null;

  const crumbs: { label: string; href: string }[] = segments.map((seg, idx) => ({
    label: resolveShellBreadcrumbLabel(seg),
    href: "/" + segments.slice(0, idx + 1).join("/"),
  }));

  return (
    <nav aria-label="Breadcrumb" className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
      {crumbs.map((crumb, idx) => (
        <span key={crumb.href} className="flex items-center gap-1">
          {idx > 0 && <ChevronRight className="size-3 opacity-40" />}
          {idx < crumbs.length - 1 ? (
            <Link
              href={crumb.href}
              className="transition hover:text-foreground"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
