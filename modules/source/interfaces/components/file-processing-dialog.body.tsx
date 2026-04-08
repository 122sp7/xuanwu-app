"use client";

import { ScanSearch, Sparkles } from "lucide-react";

import { Badge } from "@ui-shadcn/ui/badge";
import { Checkbox } from "@ui-shadcn/ui/checkbox";
import { Label } from "@ui-shadcn/ui/label";

import type { ExecutionSummary } from "./file-processing-dialog.utils";
import {
  FileProcessingPathValue,
  FileProcessingResultRow,
  FileProcessingSourceCard,
} from "./file-processing-dialog.parts";

interface FileProcessingDialogBodyProps {
  readonly step: "decide" | "select" | "executing" | "done";
  readonly filename: string;
  readonly mimeType: string;
  readonly gcsUri: string;
  readonly sizeBytes: number;
  readonly shouldRunRag: boolean;
  readonly shouldCreatePage: boolean;
  readonly onShouldRunRagChange: (checked: boolean) => void;
  readonly onShouldCreatePageChange: (checked: boolean) => void;
  readonly summary: ExecutionSummary;
}

export function FileProcessingDialogBody({
  step,
  filename,
  mimeType,
  gcsUri,
  sizeBytes,
  shouldRunRag,
  shouldCreatePage,
  onShouldRunRagChange,
  onShouldCreatePageChange,
  summary,
}: FileProcessingDialogBodyProps) {
  return (
    <>
      <FileProcessingSourceCard
        filename={filename}
        mimeType={mimeType}
        gcsUri={gcsUri}
        sizeBytes={sizeBytes}
      />

      {step === "decide" && (
        <div className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm sm:p-5">
          <p className="text-sm font-medium text-foreground sm:text-base">這份文件需要進一步處理嗎？</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground text-pretty">
            若先保留檔案，系統只會保存原始檔與 metadata，不會自動解析、建立 RAG 或生成頁面。
          </p>
        </div>
      )}

      {step === "select" && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">
              <Checkbox
                checked={shouldRunRag}
                onCheckedChange={(checked) => onShouldRunRagChange(Boolean(checked))}
                id="file-processing-rag"
                className="mt-1"
              />
              <div className="min-w-0 space-y-2">
                <Label htmlFor="file-processing-rag" className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground sm:text-base">
                  <ScanSearch className="size-4" aria-hidden="true" />
                  建立 RAG 索引
                </Label>
                <p className="text-sm leading-6 text-muted-foreground text-pretty">
                  解析完成後建立 chunks 與 vectors，讓搜尋、引用與 AI 問答可以直接使用這份文件。
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">
              <Checkbox
                checked={shouldCreatePage}
                onCheckedChange={(checked) => onShouldCreatePageChange(Boolean(checked))}
                id="file-processing-page"
                className="mt-1"
              />
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Label htmlFor="file-processing-page" className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground sm:text-base">
                    <Sparkles className="size-4" aria-hidden="true" />
                    建立 Knowledge Page
                  </Label>
                  <Badge variant="outline">Draft</Badge>
                </div>
                <p className="text-sm leading-6 text-muted-foreground text-pretty">
                  第一版會先建立一個單頁 Draft，帶入來源資訊與解析節錄，之後再逐步迭代切頁與章節策略。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === "executing" && (
        <div className="space-y-3" aria-live="polite">
          <FileProcessingResultRow label="文件解析" result={summary.parse} />
          <FileProcessingResultRow label="RAG 索引" result={summary.rag} />
          <FileProcessingResultRow label="Knowledge Page" result={summary.page} />
        </div>
      )}

      {step === "done" && (
        <div className="space-y-3" aria-live="polite">
          <FileProcessingResultRow label="文件解析" result={summary.parse} />
          <FileProcessingResultRow label="RAG 索引" result={summary.rag} />
          <FileProcessingResultRow label="Knowledge Page" result={summary.page} />
          {summary.pageCount > 0 && (
            <div className="space-y-2 rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm sm:p-5">
              <p className="text-sm font-medium text-foreground">解析輸出</p>
              <p className="text-sm leading-6 text-muted-foreground">
                共完成 {summary.pageCount} 頁解析結果。
              </p>
              {summary.jsonGcsUri ? (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    JSON URI
                  </p>
                  <FileProcessingPathValue value={summary.jsonGcsUri} />
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </>
  );
}