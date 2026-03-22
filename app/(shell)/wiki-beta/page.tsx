"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { WikiBetaHubView } from "@/modules/wiki-beta";

export default function WikiBetaPage() {
  const router = useRouter();

  const routeItems = [
    { href: "/wiki-beta/pages", label: "Pages" },
    { href: "/wiki-beta/rag-query", label: "RAG Query" },
    { href: "/wiki-beta/documents", label: "Documents" },
  ] as const;

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Knowledge Platform</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Wiki Beta</h1>
        <p className="text-sm text-muted-foreground">wiki-beta 入口，專注 account-scoped 知識流程與 py_fn callable 協作。</p>
      </header>

      <nav className="flex items-center gap-2" aria-label="Wiki Beta sections">
        {routeItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-border/60 bg-background px-3 py-1 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <WikiBetaHubView onGoRagTest={() => router.push("/wiki-beta/rag-query")} />
    </div>
  );
}
