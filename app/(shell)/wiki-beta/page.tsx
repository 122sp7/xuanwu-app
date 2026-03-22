"use client";

import { useMemo, useState } from "react";

import { WikiBetaHubView, WikiBetaRagTestView } from "@/modules/wiki-beta";

type WikiBetaMainView = "hub" | "rag-test";

const tabs = [
  { key: "hub" as const, label: "測試中樞" },
  { key: "rag-test" as const, label: "RAG / Reindex" },
];

export default function WikiBetaPage() {
  const [view, setView] = useState<WikiBetaMainView>("hub");

  const content = useMemo(() => {
    if (view === "rag-test") {
      return <WikiBetaRagTestView onBack={() => setView("hub")} />;
    }
    return <WikiBetaHubView onGoRagTest={() => setView("rag-test")} />;
  }, [view]);

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Knowledge Platform</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Wiki Beta</h1>
        <p className="text-sm text-muted-foreground">平行驗證中的 wiki-beta 入口，專注打通 py_fn callable 與 RAG 工作流。</p>
      </header>

      <nav className="flex items-center gap-2" aria-label="Wiki Beta tabs">
        {tabs.map((tab) => {
          const active = view === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setView(tab.key)}
              className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border/60 bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {content}
    </div>
  );
}
