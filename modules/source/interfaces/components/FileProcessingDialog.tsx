"use client";

import { useState } from "react";
import Link from "next/link";

import { useAuth } from "@/app/providers/auth-provider";
import { getFirebaseFunctions, functionsApi } from "@integration-firebase/functions";
import { useIsMobile } from "@ui-shadcn";
import { Badge } from "@ui-shadcn/ui/badge";
import { Button } from "@ui-shadcn/ui/button";
import { Checkbox } from "@ui-shadcn/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@ui-shadcn/ui/dialog";
import { Label } from "@ui-shadcn/ui/label";
import { ScrollArea } from "@ui-shadcn/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@ui-shadcn/ui/sheet";
import {
  createIdleSummary,
  readCallableData,
  readNumber,
  readString,
  type ExecutionSummary,
  waitForParsedDocument,
} from "./file-processing-dialog.utils";
import { createKnowledgeDraftFromSourceDocument } from "../_actions/file-processing.actions";
import { FileProcessingDialogBody } from "./file-processing-dialog.body";

interface FileProcessingDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly accountId: string;
  readonly workspaceId: string;
  readonly sourceFileId: string;
  readonly filename: string;
  readonly gcsUri: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
}

type DialogStep = "decide" | "select" | "executing" | "done";

export function FileProcessingDialog({
  open,
  onClose,
  accountId,
  workspaceId,
  sourceFileId,
  filename,
  gcsUri,
  mimeType,
  sizeBytes,
}: FileProcessingDialogProps) {
  const { state: { user } } = useAuth();
  const isMobile = useIsMobile();
  const [step, setStep] = useState<DialogStep>("decide");
  const [shouldRunRag, setShouldRunRag] = useState(true);
  const [shouldCreatePage, setShouldCreatePage] = useState(false);
  const [summary, setSummary] = useState<ExecutionSummary>(createIdleSummary);

  const canDismiss = step !== "executing";

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && canDismiss) {
      onClose();
    }
  }

  async function handleExecute() {
    setStep("executing");
    setSummary({
      ...createIdleSummary(),
      parse: { status: "running", detail: "正在呼叫 Document AI 解析文件" },
      rag: shouldRunRag
        ? { status: "idle", detail: "等待文件解析完成後建立索引" }
        : { status: "skipped", detail: "使用者未勾選 RAG 索引" },
      page: shouldCreatePage
        ? { status: "idle", detail: "等待文件解析完成後建立單頁草稿" }
        : { status: "skipped", detail: "使用者未勾選 Knowledge Page" },
    });

    try {
      const functions = getFirebaseFunctions("asia-southeast1");
      const parseDocument = functionsApi.httpsCallable(functions, "parse_document");

      const parseResponse = await parseDocument({
        account_id: accountId,
        workspace_id: workspaceId,
        doc_id: sourceFileId,
        gcs_uri: gcsUri,
        filename,
        mime_type: mimeType || "application/octet-stream",
        size_bytes: sizeBytes,
        run_rag: false,
      });

      const parseData = readCallableData(parseResponse.data);
      const docId = readString(parseData.doc_id, sourceFileId);

      setSummary((current) => ({
        ...current,
        parse: { status: "running", detail: "解析工作已送出，正在等待文件狀態完成" },
      }));

      const parsedDocument = await waitForParsedDocument(accountId, docId);

      setSummary((current) => ({
        ...current,
        pageCount: parsedDocument.pageCount,
        jsonGcsUri: parsedDocument.jsonGcsUri,
        parse: {
          status: "success",
          detail: `解析完成，共 ${parsedDocument.pageCount} 頁。`,
        },
      }));

      if (shouldCreatePage) {
        setSummary((current) => ({
          ...current,
          page: { status: "running", detail: "正在建立可編輯的 Knowledge Page 草稿" },
        }));

        try {
          if (!user?.id) {
            throw new Error("缺少登入使用者，無法建立 Knowledge Page 草稿");
          }

          const draftPage = await createKnowledgeDraftFromSourceDocument({
            accountId,
            workspaceId,
            createdByUserId: user.id,
            filename,
            sourceGcsUri: gcsUri,
            jsonGcsUri: parsedDocument.jsonGcsUri,
            pageCount: parsedDocument.pageCount,
          });

          if (!draftPage.success) {
            throw new Error(draftPage.error.message || "建立 Knowledge Page 失敗");
          }

          setSummary((current) => ({
            ...current,
            pageHref: `/knowledge/pages/${draftPage.aggregateId}`,
            page: {
              status: "success",
              detail: "已建立單頁 Draft，可直接進頁面補內容、調整結構，後續再迭代切頁策略。",
            },
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : "建立 Knowledge Page 失敗";
          setSummary((current) => ({
            ...current,
            page: { status: "error", detail: message },
          }));
        }
      }

      if (shouldRunRag) {
        setSummary((current) => ({
          ...current,
          rag: { status: "running", detail: "正在建立可檢索的 RAG 索引" },
        }));

        try {
          const runRagIndex = functionsApi.httpsCallable(functions, "rag_reindex_document");
          const ragResponse = await runRagIndex({
            account_id: accountId,
            workspace_id: workspaceId,
            doc_id: docId,
            json_gcs_uri: parsedDocument.jsonGcsUri,
            source_gcs_uri: gcsUri,
            filename,
            page_count: parsedDocument.pageCount,
          });
          const ragResult = readCallableData(ragResponse.data);

          setSummary((current) => ({
            ...current,
            rag: {
              status: "success",
              detail: `索引完成，${readNumber(ragResult.chunk_count, 0)} 個 chunks / ${readNumber(ragResult.vector_count, 0)} 個 vectors。`,
            },
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : "RAG 索引失敗";
          setSummary((current) => ({
            ...current,
            rag: { status: "error", detail: message },
          }));
        }
      }

      setStep("done");
    } catch (error) {
      const message = error instanceof Error ? error.message : "文件處理失敗";

      setSummary((current) => {
        if (current.parse.status === "running") {
          return {
            ...current,
            parse: { status: "error", detail: message },
          };
        }

        return {
          ...current,
          rag: { status: "error", detail: message },
        };
      });

      setStep("done");
    }
  }

  const canContinue = shouldRunRag || shouldCreatePage;

  const footerActions = (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
      {step === "decide" && (
        <>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            保留檔案即可
          </Button>
          <Button onClick={() => setStep("select")} className="w-full sm:w-auto">
            我要決定後續處理
          </Button>
        </>
      )}

      {step === "select" && (
        <>
          <Button variant="outline" onClick={() => setStep("decide")} className="w-full sm:w-auto">
            上一步
          </Button>
          <Button onClick={() => { void handleExecute(); }} disabled={!canContinue} className="w-full sm:w-auto">
            開始處理
          </Button>
        </>
      )}

      {step === "done" && (
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {summary.pageHref && summary.page.status === "success" ? (
            <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
              <Link href={summary.pageHref}>前往 Draft Page</Link>
            </Button>
          ) : (
            <div className="hidden sm:block" />
          )}
          <Button onClick={onClose} className="w-full sm:w-auto">完成</Button>
        </div>
      )}
    </div>
  );

  const sharedContent = (
    <>
      <ScrollArea className="min-h-0 flex-1 overscroll-contain">
        <div className="space-y-4 px-4 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
          <FileProcessingDialogBody
            step={step}
            filename={filename}
            mimeType={mimeType}
            gcsUri={gcsUri}
            sizeBytes={sizeBytes}
            shouldRunRag={shouldRunRag}
            shouldCreatePage={shouldCreatePage}
            onShouldRunRagChange={setShouldRunRag}
            onShouldCreatePageChange={setShouldCreatePage}
            summary={summary}
          />
        </div>
      </ScrollArea>
      {step !== "executing" ? (
        <div className="border-t border-border/60 bg-muted/30 px-4 py-4 sm:px-6">
          {footerActions}
        </div>
      ) : null}
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          side="bottom"
          showCloseButton={canDismiss}
          className="h-auto max-h-[92vh] gap-0 rounded-t-[28px] p-0 overscroll-contain"
        >
          <SheetHeader className="gap-3 border-b border-border/60 px-4 pb-4 pt-5 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">File Processing</Badge>
              <Badge variant="secondary">Prototype</Badge>
            </div>
            <div className="space-y-1.5 pr-10">
              <SheetTitle className="text-left text-lg">上傳完成後續處理</SheetTitle>
              <SheetDescription className="text-left leading-6 text-pretty">
                先決定是否要解析，再決定是否建立 RAG 索引或 Knowledge Page，避免檔案被自動處理造成爭議。
              </SheetDescription>
            </div>
          </SheetHeader>
          {sharedContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="[display:flex] max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
        showCloseButton={canDismiss}
      >
        <DialogHeader className="gap-3 border-b border-border/60 px-4 pb-4 pt-5 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">File Processing</Badge>
            <Badge variant="secondary">Prototype</Badge>
          </div>
          <div className="space-y-1.5 pr-10">
            <DialogTitle className="text-lg">上傳完成後續處理</DialogTitle>
            <DialogDescription className="leading-6 text-pretty">
              先決定是否要解析，再決定是否建立 RAG 索引或 Knowledge Page，避免檔案被自動處理造成爭議。
            </DialogDescription>
          </div>
        </DialogHeader>
        {sharedContent}
      </DialogContent>
    </Dialog>
  );
}