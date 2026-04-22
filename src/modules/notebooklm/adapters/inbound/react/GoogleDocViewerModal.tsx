"use client";

/**
 * GoogleDocViewerModal — inline Google Docs Viewer preview overlay.
 *
 * Renders a fullscreen modal that embeds the Google Docs Viewer <iframe>.
 * All Firebase download-URL resolution happens in the parent (NotebooklmSourcesSection);
 * this component only receives an already-resolved HTTPS URL.
 */

import { Button, createGoogleViewerEmbedUrl } from "@packages";
import { Eye, X, Loader2 } from "lucide-react";

export interface GoogleDocViewerModalProps {
  name: string;
  mimeType: string;
  url: string | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onRetry: () => void;
}

export function GoogleDocViewerModal({
  name,
  mimeType,
  url,
  loading,
  error,
  onClose,
  onRetry,
}: GoogleDocViewerModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`預覽：${name}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
    >
      <div className="relative flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-background shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-border/40 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Eye className="size-4 text-primary" />
            <span className="text-sm font-medium truncate max-w-xs">{name}</span>
            <span className="text-xs text-muted-foreground">{mimeType}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={onClose} className="h-7 w-7 p-0">
            <X className="size-4" />
          </Button>
        </div>
        <div className="relative flex-1 overflow-hidden">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
              <p className="text-sm text-destructive">{error}</p>
              <Button size="sm" variant="outline" onClick={onRetry}>
                重試
              </Button>
            </div>
          )}
          {url && (
            <iframe
              src={createGoogleViewerEmbedUrl(url)}
              className="h-full w-full border-0"
              title={`預覽：${name}`}
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          )}
        </div>
      </div>
    </div>
  );
}
