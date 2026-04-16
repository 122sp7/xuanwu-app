"use client";

/**
 * DevToolsParsedDocsSection.tsx
 * Owns: the "已解析檔案" (completed-only) table section in the Dev Tools page.
 * Receives all doc data and handlers as props; contains no state.
 */

import { CheckCircle2, FlaskConical, Loader2 } from "lucide-react";

import { type DocRecord } from "./dev-tools-helpers";
import { RagBadge } from "./dev-tools-badges";
import { formatDateTime } from "./use-dev-tools-doc-list";

interface DevToolsParsedDocsSectionProps {
  parsedDocs: DocRecord[];
  reindexingId: string | null;
  onViewJson: (doc: DocRecord) => void;
  onManualProcess: (doc: DocRecord) => void;
  formatNormalizationRatio: (doc: DocRecord) => string;
}

export function DevToolsParsedDocsSection({
  parsedDocs,
  reindexingId,
  onViewJson,
  onManualProcess,
  formatNormalizationRatio,
}: DevToolsParsedDocsSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="size-4 text-emerald-600" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          已解析檔案（{parsedDocs.length}）
        </h2>
      </div>
      {parsedDocs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
          尚無解析完成檔案
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-emerald-500/20">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm">
              <thead>
                <tr className="border-b border-emerald-500/10 bg-emerald-500/5">
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">檔名</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">頁數</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">RAG</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Chunks / Vectors</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Normalization</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">版本 / 語系</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">JSON</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">完成時間</th>
                </tr>
              </thead>
              <tbody>
                {parsedDocs.map((doc, i) => (
                  <tr
                    key={`parsed-${doc.id}`}
                    className={`border-b border-border/30 last:border-0 ${i % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
                  >
                    <td className="px-4 py-2.5 font-mono text-xs max-w-[220px] truncate" title={doc.filename}>
                      {doc.filename}
                    </td>
                    <td className="px-4 py-2.5 text-xs font-medium">{doc.page_count ?? "—"}</td>
                    <td className="px-4 py-2.5 text-xs">
                      <RagBadge status={doc.rag_status} error={doc.rag_error} />
                    </td>
                    <td className="px-4 py-2.5 text-xs font-mono">
                      {(doc.rag_chunk_count ?? 0).toLocaleString()} /{" "}
                      {(doc.rag_vector_count ?? 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-xs font-mono">
                      {formatNormalizationRatio(doc)}
                    </td>
                    <td className="px-4 py-2.5 text-xs font-mono">
                      {(doc.rag_normalization_version || "—").toUpperCase()} /{" "}
                      {(doc.rag_language_hint || "—").toUpperCase()}
                    </td>
                    <td className="px-4 py-2.5 text-xs max-w-[320px]">
                      {doc.json_gcs_uri ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { onViewJson(doc); }}
                            className="font-mono text-left truncate text-primary hover:underline"
                            title={doc.json_gcs_uri}
                          >
                            {doc.json_gcs_uri}
                          </button>
                          <button
                            onClick={() => { onManualProcess(doc); }}
                            disabled={reindexingId === doc.id}
                            title="手動整理（Normalization + RAG）"
                            className="inline-flex h-6 items-center gap-1 rounded-md border border-border/60 px-2 text-[11px] text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
                          >
                            {reindexingId === doc.id ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              <FlaskConical className="size-3" />
                            )}
                            手動整理
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDateTime(doc.uploaded_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
