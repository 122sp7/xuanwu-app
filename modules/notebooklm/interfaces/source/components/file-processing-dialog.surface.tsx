"use client";

import type { ReactNode } from "react";

import { useIsMobile } from "@ui-shadcn";
import { Badge } from "@ui-shadcn/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@ui-shadcn/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@ui-shadcn/ui/sheet";

interface FileProcessingDialogSurfaceProps {
  readonly open: boolean;
  readonly canDismiss: boolean;
  readonly onOpenChange: (nextOpen: boolean) => void;
  readonly footer: ReactNode;
  readonly children: ReactNode;
}

export function FileProcessingDialogSurface({
  open,
  canDismiss,
  onOpenChange,
  footer,
  children,
}: FileProcessingDialogSurfaceProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          showCloseButton={canDismiss}
          className="h-auto max-h-[92vh] gap-0 overflow-y-auto rounded-t-[28px] p-0 overscroll-contain"
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
          <div className="space-y-4 px-4 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">{children}</div>
          {footer ? (
            <div className="border-t border-border/60 bg-muted/30 px-4 py-4 sm:px-6">
              {footer}
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-2xl"
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
        <div className="space-y-4 px-4 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">{children}</div>
        {footer ? (
          <div className="border-t border-border/60 bg-muted/30 px-4 py-4 sm:px-6">
            {footer}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
