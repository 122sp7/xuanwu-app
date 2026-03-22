interface WikiBetaHubViewProps {
  readonly onGoRagTest: () => void;
}

export function WikiBetaHubView({ onGoRagTest }: WikiBetaHubViewProps) {
  return (
    <section className="rounded-xl border border-border/60 bg-card p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">Wiki Beta</p>
      <h2 className="mt-2 text-xl font-semibold text-foreground">Py_fn 串接驗證中樞</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        這個頁面專門測試 wiki-beta 與 py_fn 的 callable 串接，包含 RAG 查詢與文件重整流程。驗證通過後，可逐步替換現行 Wiki 流程。
      </p>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="rounded-full border border-border/60 px-2 py-1">callable: rag_query</span>
        <span className="rounded-full border border-border/60 px-2 py-1">callable: rag_reindex_document</span>
        <span className="rounded-full border border-border/60 px-2 py-1">{"collection: accounts/{accountId}/documents"}</span>
        <span className="rounded-full border border-border/60 px-2 py-1">fallback: parsed_documents</span>
      </div>

      <button
        type="button"
        onClick={onGoRagTest}
        className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
      >
        進入 RAG 測試
      </button>
    </section>
  );
}
