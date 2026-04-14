"use client";

import { useState } from "react";
import Link from "next/link";

import { useAuth } from "@/modules/iam/api";
import { Button } from "@ui-shadcn/ui/button";

import { processSourceDocumentWorkflow } from "../_actions/source-processing.actions";
import { FileProcessingDialogBody } from "./file-processing-dialog.body";
import { FileProcessingDialogSurface } from "./file-processing-dialog.surface";
import {
  createIdleSummary,
  type ExecutionSummary,
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
  const [shouldCreateTasks, setShouldCreateTasks] = useState(false);
  const [summary, setSummary] = useState<ExecutionSummary>(createIdleSummary);

  const canDismiss = step !== "executing";

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && canDismiss) onClose();
  }

  function handleShouldCreatePageChange(nextChecked: boolean) {
    setShouldCreatePage(nextChecked);
    if (!nextChecked) {
      setShouldCreateTasks(false);
    }
  }

  function handleShouldCreateTasksChange(nextChecked: boolean) {
    setShouldCreateTasks(nextChecked);
    if (nextChecked) {
      setShouldCreatePage(true);
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
      page: shouldCreatePage || shouldCreateTasks
        ? {
          status: "idle",
          detail: shouldCreateTasks
            ? "等待建立 Knowledge Page 以承接任務流程"
            : "等待文件解析完成後建立單頁草稿",
        }
        : { status: "skipped", detail: "使用者未勾選 Knowledge Page" },
      task: shouldCreateTasks
        ? { status: "idle", detail: "等待抽取候選任務並送入 Workspace Flow" }
        : { status: "skipped", detail: "使用者未勾選任務流程" },
    });

    try {
      const nextSummary = await processSourceDocumentWorkflow({
        accountId,
        workspaceId,
        sourceFileId,
        gcsUri,
        filename,
        mimeType: mimeType || "application/octet-stream",
        sizeBytes,
        shouldRunRag,
        shouldCreatePage,
        shouldCreateTasks,
        createdByUserId: user?.id,
      });

      setSummary(nextSummary);

      setStep("done");
    } catch (error) {
      const message = error instanceof Error ? error.message : "文件處理失敗";
      setSummary((current) => ({ ...current, parse: { status: "error", detail: message } }));
      setStep("done");
    }
  }

  const canContinue = shouldRunRag || shouldCreatePage || shouldCreateTasks;

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
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
            {summary.pageHref && summary.page.status === "success" ? (
              <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
                <Link href={summary.pageHref}>前往 Knowledge Page</Link>
              </Button>
            ) : null}
            {summary.workflowHref && summary.task.status === "success" ? (
              <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
                <Link href={summary.workflowHref}>前往 Tasks</Link>
              </Button>
            ) : null}
          </div>
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
        shouldCreateTasks={shouldCreateTasks}
        onShouldRunRagChange={setShouldRunRag}
        onShouldCreatePageChange={handleShouldCreatePageChange}
        onShouldCreateTasksChange={handleShouldCreateTasksChange}
        summary={summary}
      />
    </FileProcessingDialogSurface>
  );
}
