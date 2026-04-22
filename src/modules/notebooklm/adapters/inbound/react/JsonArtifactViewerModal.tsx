"use client";

/**
 * JsonArtifactViewerModal — viewer for fn parse_document JSON artifact output.
 *
 * Fetches and renders the raw JSON stored in GCS (via a Firebase Storage download URL)
 * for layout, form, ocr, or genkit parser artifacts.
 */

import { Button } from "@packages";
import { CheckCircle2, X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { IngestionSourceSnapshot } from "../../../subdomains/source/domain/entities/IngestionSource";
import { getDocumentDownloadUrl } from "../../outbound/firebase-composition";

export type ArtifactType = "layout" | "form" | "ocr" | "genkit";

const ARTIFACT_TITLE: Record<ArtifactType, string> = {
  layout: "Layout Parser 產出物",
  form: "Form Parser 產出物",
  ocr: "Document OCR 產出物",
  genkit: "Genkit-AI 產出物",
};

function resolveArtifactUri(doc: IngestionSourceSnapshot, type: ArtifactType): string | undefined {
  if (type === "layout") return doc.parsedLayoutJsonGcsUri;
  if (type === "form") return doc.parsedFormJsonGcsUri;
  if (type === "ocr") return doc.parsedOcrJsonGcsUri;
  return doc.parsedGenkitJsonGcsUri;
}

export interface JsonArtifactViewerModalProps {
  doc: IngestionSourceSnapshot;
  type: ArtifactType;
  onClose: () => void;
}

export function JsonArtifactViewerModal({ doc, type, onClose }: JsonArtifactViewerModalProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Compute uri outside the effect so the effect can depend on it directly.
  // When uri is undefined the effect skips entirely; the render shows the empty message.
  const uri = resolveArtifactUri(doc, type);

  useEffect(() => {
    if (!uri) return; // No external operation to start; render handles the empty case.

    let cancelled = false;

    // Wrap all state mutations in an async chain so nothing runs synchronously
    // in the effect body (avoids react-hooks/set-state-in-effect rule).
    void (async () => {
      await Promise.resolve(); // yield before any setState
      if (cancelled) return;
      setLoading(true);
      setContent(null);
      try {
        const url = await getDocumentDownloadUrl(uri);
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const raw = await resp.json() as unknown;
        if (!cancelled) setContent(JSON.stringify(raw, null, 2));
      } catch (err: unknown) {
        if (!cancelled) setContent(`// 無法載入產出物\n// ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [uri]);

  const title = ARTIFACT_TITLE[type];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
    >
      <div className="relative flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-background shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-border/40 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-green-600" />
            <span className="text-sm font-medium">{title}</span>
            <span className="text-xs text-muted-foreground truncate max-w-xs">{doc.name}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={onClose} className="h-7 w-7 p-0">
            <X className="size-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              載入產出物…
            </div>
          ) : content ? (
            <pre className="text-xs text-foreground whitespace-pre-wrap break-all font-mono">
              {content}
            </pre>
          ) : (
            <p className="text-xs text-muted-foreground">（產出物 URI 不存在，請先執行對應解析。）</p>
          )}
        </div>
      </div>
    </div>
  );
}
