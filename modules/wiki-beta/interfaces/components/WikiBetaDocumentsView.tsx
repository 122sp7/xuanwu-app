"use client";

/**
 * WikiBetaDocumentsView — clean document management with upload + table.
 *
 * Provides:
 *  - Drop zone for file uploads
 *  - Documents table with status tracking
 *  - Account-scoped data with optional workspace filtering
 *
 * This is a UI skeleton that delegates to WikiBetaRagTestView for actual
 * upload/list/reindex logic, wrapped in a cleaner notion-style layout.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  FileUp,
  Loader2,
  Search,
  Upload,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { useApp } from "@/app/providers/app-provider";
import { useAuth } from "@/app/providers/auth-provider";
import { firestoreApi, getFirebaseFirestore } from "@integration-firebase/firestore";
import { getFirebaseStorage, storageApi } from "@integration-firebase/storage";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import {
  Card,
  CardContent,
} from "@ui-shadcn/ui/card";
import { Input } from "@ui-shadcn/ui/input";
import { Separator } from "@ui-shadcn/ui/separator";
import { Skeleton } from "@ui-shadcn/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui-shadcn/ui/table";
import {
  TooltipProvider,
} from "@ui-shadcn/ui/tooltip";
import { cn } from "@ui-shadcn/utils";

import type { WikiBetaParsedDocument } from "../../domain";

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const UPLOAD_BUCKET = "xuanwu-i-00708880-4e2d8.firebasestorage.app";
const ACCEPTED_MIME: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/tiff": ".tif/.tiff",
  "image/png": ".png",
  "image/jpeg": ".jpg/.jpeg",
};
const ACCEPTED_EXTS = Object.values(ACCEPTED_MIME).join(", ");

interface WikiBetaLiveDocument extends WikiBetaParsedDocument {
  errorMessage: string;
  ragError: string;
}

/* ------------------------------------------------------------------ */
/*  Status badge                                                      */
/* ------------------------------------------------------------------ */

function StatusBadge({ status }: { readonly status: string }) {
  switch (status) {
    case "completed":
    case "ready":
      return (
        <Badge variant="outline" className="gap-1 border-emerald-300/60 bg-emerald-50 text-emerald-700 dark:border-emerald-700/40 dark:bg-emerald-900/20 dark:text-emerald-400">
          <CheckCircle2 className="size-3" />
          {status}
        </Badge>
      );
    case "processing":
      return (
        <Badge variant="outline" className="gap-1 border-amber-300/60 bg-amber-50 text-amber-700 dark:border-amber-700/40 dark:bg-amber-900/20 dark:text-amber-400">
          <Clock className="size-3" />
          {status}
        </Badge>
      );
    case "error":
      return (
        <Badge variant="outline" className="gap-1 border-red-300/60 bg-red-50 text-red-700 dark:border-red-700/40 dark:bg-red-900/20 dark:text-red-400">
          <XCircle className="size-3" />
          {status}
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-xs">
          {status || "—"}
        </Badge>
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Props                                                             */
/* ------------------------------------------------------------------ */

interface WikiBetaDocumentsViewProps {
  readonly workspaceId?: string;
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export function WikiBetaDocumentsView({ workspaceId }: WikiBetaDocumentsViewProps) {
  const { state: appState } = useApp();
  const { state: authState } = useAuth();
  const [documents, setDocuments] = useState<WikiBetaLiveDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const accountId = appState.activeAccount?.id ?? authState.user?.id ?? "";

  // Filtered documents
  const filteredDocs = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const q = searchQuery.toLowerCase();
    return documents.filter(
      (d) =>
        d.filename.toLowerCase().includes(q) ||
        d.status.toLowerCase().includes(q),
    );
  }, [documents, searchQuery]);

  /* ── Real-time document listener ── */
  useEffect(() => {
    if (!accountId) {
      setLoading(false);
      return;
    }

    const db = getFirebaseFirestore();
    const colRef = firestoreApi.collection(db, `accounts/${accountId}/documents`);
    const q = firestoreApi.query(colRef, firestoreApi.orderBy("uploadedAt", "desc"));

    const unsubscribe = firestoreApi.onSnapshot(q, (snapshot) => {
      const docs: WikiBetaLiveDocument[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        docs.push({
          id: docSnap.id,
          filename: String(data.source?.filename ?? data.filename ?? "unknown"),
          workspaceId: String(data.metadata?.space_id ?? data.workspaceId ?? ""),
          status: String(data.status ?? "unknown"),
          ragStatus: String(data.rag?.status ?? ""),
          pageCount: Number(data.parsed?.page_count ?? data.pageCount ?? 0),
          uploadedAt: data.uploadedAt?.toDate?.() ?? null,
          sourceGcsUri: String(data.source?.gcs_uri ?? ""),
          jsonGcsUri: String(data.parsed?.json_gcs_uri ?? ""),
          errorMessage: String(data.error_message ?? data.errorMessage ?? ""),
          ragError: String(data.rag?.error ?? ""),
        });
      });
      setDocuments(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [accountId]);

  /* ── Upload handler ── */
  const handleUpload = useCallback(
    async (file: File) => {
      if (!ACCEPTED_MIME[file.type]) {
        toast.error(`不支援的檔案類型: ${file.type}`);
        return;
      }
      if (!accountId) {
        toast.error("請先登入");
        return;
      }

      setUploading(true);
      try {
        const storage = getFirebaseStorage();
        const path = `uploads/${accountId}/${Date.now()}_${file.name}`;
        const ref = storageApi.ref(storage, `gs://${UPLOAD_BUCKET}/${path}`);
        const metadata: Record<string, string> = { account_id: accountId };
        if (workspaceId) metadata.workspace_id = workspaceId;
        await storageApi.uploadBytes(ref, await file.arrayBuffer(), {
          contentType: file.type,
          customMetadata: metadata,
        });
        toast.success(`已上傳: ${file.name}`);
      } catch (e) {
        toast.error(`上傳失敗: ${e instanceof Error ? e.message : "Unknown error"}`);
      } finally {
        setUploading(false);
      }
    },
    [accountId, workspaceId],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) void handleUpload(file);
      e.target.value = "";
    },
    [handleUpload],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) void handleUpload(file);
    },
    [handleUpload],
  );

  function formatDate(value: Date | null): string {
    if (!value) return "—";
    return value.toLocaleString("zh-TW", { hour12: false });
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-6 p-6">
        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Documents
            </h1>
            <p className="text-sm text-muted-foreground">
              上傳文件、追蹤解析狀態與 RAG 索引進度。
            </p>
          </div>
          {workspaceId && (
            <Badge variant="secondary" className="text-xs">
              workspace: {workspaceId}
            </Badge>
          )}
        </div>

        {/* ── Upload area ── */}
        <Card>
          <CardContent className="py-4">
            <div
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 text-center transition",
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-border/60 hover:border-primary/40",
                uploading && "pointer-events-none opacity-60",
              )}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {uploading ? (
                <Loader2 className="mb-2 size-8 animate-spin text-primary" />
              ) : (
                <Upload className="mb-2 size-8 text-muted-foreground/40" />
              )}
              <p className="text-sm font-medium text-foreground">
                {uploading ? "上傳中..." : "拖放文件至此處"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                支援 {ACCEPTED_EXTS}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <FileUp className="mr-1.5 size-3.5" />
                選擇檔案
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={Object.keys(ACCEPTED_MIME).join(",")}
                onChange={handleFileSelect}
              />
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* ── Search ── */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋文件名稱..."
              className="h-9 pl-8 text-sm"
            />
          </div>
          <Badge variant="secondary" className="text-xs">
            {filteredDocs.length} 筆
          </Badge>
        </div>

        {/* ── Documents table ── */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        ) : filteredDocs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="mb-3 size-10 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "找不到符合的文件" : "尚無文件"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                {searchQuery
                  ? "嘗試不同的搜尋關鍵字"
                  : "上傳第一份文件來開始使用知識庫。"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">檔案名稱</TableHead>
                  <TableHead className="w-28 text-xs">狀態</TableHead>
                  <TableHead className="w-28 text-xs">RAG</TableHead>
                  <TableHead className="w-20 text-center text-xs">頁數</TableHead>
                  <TableHead className="w-40 text-xs">上傳時間</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocs.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 shrink-0 text-muted-foreground/60" />
                        <span className="truncate text-sm">{doc.filename}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={doc.status} />
                    </TableCell>
                    <TableCell>
                      {doc.ragStatus ? (
                        <StatusBadge status={doc.ragStatus} />
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {doc.pageCount > 0 ? doc.pageCount : "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(doc.uploadedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
