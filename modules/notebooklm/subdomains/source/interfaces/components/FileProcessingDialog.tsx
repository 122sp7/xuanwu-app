"use client";

import { useState } from "react";
import Link from "next/link";

import { useAuth } from "@/app/providers/auth-provider";
import { getFirebaseFunctions, functionsApi } from "@integration-firebase/functions";
import { Button } from "@ui-shadcn/ui/button";

import { createKnowledgeDraftFromSourceDocument } from "../_actions/source-processing.actions";
import { FileProcessingDialogBody } from "./file-processing-dialog.body";
import { FileProcessingDialogSurface } from "./file-processing-dialog.surface";
import {
  createIdleSummary,
  readCallableData,
  readNumber,
  readString,
  type ExecutionSummary,
  waitForParsedDocument,
} from "./file-processing-dialog.utils";

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
  const [step, setStep] = useState<DialogStep>("decide");
  const [shouldRunRag, setShouldRunRag] = useState(true);
  const [shouldCreatePage, setShouldCreatePage] = useState(false);
  const [summary, setSummary] = useState<ExecutionSummary>(createIdleSummary);

  const canDismiss = step !== "executing";

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && canDismiss) onClose();
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
        parse: { status: "success", detail: `解析完成，共 ${parsedDocument.pageCount} 頁。` },
      }));

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
          setSummary((current) => ({ ...current, rag: { status: "error", detail: message } }));
        }
      }

      if (shouldCreatePage) {
        setSummary((current) => ({
          ...current,
          page: { status: "running", detail: "正在建立可編輯的 Knowledge Page 草稿" },
        }));

        try {
          if (!user?.id) throw new Error("缺少登入使用者，無法建立 Knowledge Page 草稿");

          const draftPage = await createKnowledgeDraftFromSourceDocument({
            accountId,
            workspaceId,
            createdByUserId: user.id,
            filename,
            sourceGcsUri: gcsUri,
            jsonGcsUri: parsedDocument.jsonGcsUri,
            pageCount: parsedDocument.pageCount,
          });

          if (!draftPage.success) throw new Error(draftPage.error.message || "建立 Knowledge Page 失敗");

          setSummary((current) => ({
            ...current,
            pageHref: `/knowledge/pages/${draftPage.aggregateId}`,
            page: { status: "success", detail: "已建立單頁 Draft，可直接進頁面補內容、調整結構，後續再迭代切頁策略。" },
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : "建立 Knowledge Page 失敗";
          setSummary((current) => ({ ...current, page: { status: "error", detail: message } }));
        }
      }

      setStep("done");
    } catch (error) {
      const message = error instanceof Error ? error.message : "文件處理失敗";
      setSummary((current) => {
        if (current.parse.status === "running") {
          return { ...current, parse: { status: "error", detail: message } };
        }
        return { ...current, rag: { status: "error", detail: message } };
      });
      setStep("done");
    }
  }

  const canContinue = shouldRunRag || shouldCreatePage;

  const footerActions = (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
      {step === "decide" && (
        <>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">保留檔案即可</Button>
          <Button onClick={() => setStep("select")} className="w-full sm:w-auto">我要決定後續處理</Button>
        </>
      )}

      {step === "select" && (
        <>
          <Button variant="outline" onClick={() => setStep("decide")} className="w-full sm:w-auto">上一步</Button>
          <Button onClick={() => { void handleExecute(); }} disabled={!canContinue} className="w-full sm:w-auto">開始處理</Button>
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

  return (
    <FileProcessingDialogSurface
      open={open}
      canDismiss={canDismiss}
      onOpenChange={handleOpenChange}
      footer={step !== "executing" ? footerActions : null}
    >
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
    </FileProcessingDialogSurface>
  );
}
