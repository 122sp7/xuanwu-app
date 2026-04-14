"use client";

import { useState } from "react";

import type { FieldType } from "../../../subdomains/knowledge-database/application/dto/knowledge-database.dto";
import { Button } from "@ui-shadcn/ui/button";
import { Input } from "@ui-shadcn/ui/input";
import { Label } from "@ui-shadcn/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@ui-shadcn/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui-shadcn/ui/select";

export const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "text", label: "文字" },
  { value: "number", label: "數字" },
  { value: "checkbox", label: "核取方塊" },
  { value: "date", label: "日期" },
  { value: "select", label: "單選" },
  { value: "multi_select", label: "多選" },
  { value: "url", label: "URL" },
  { value: "email", label: "電子郵件" },
];

interface AddFieldDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (name: string, type: FieldType, required: boolean) => void;
  isPending: boolean;
}

export function AddFieldDialog({ open, onOpenChange, onAdd, isPending }: AddFieldDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<FieldType>("text");
  const [required, setRequired] = useState(false);

  function reset() {
    setName(""); setType("text"); setRequired(false);
  }

  function handleOpenChange(v: boolean) {
    if (!v) reset();
    onOpenChange(v);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), type, required);
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle>新增欄位</DialogTitle></DialogHeader>
        <form id="field-form" className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="field-name">名稱 *</Label>
            <Input id="field-name" value={name} onChange={(e) => setName(e.target.value)} disabled={isPending} placeholder="欄位名稱" />
          </div>
          <div className="space-y-1.5">
            <Label>類型</Label>
            <Select value={type} onValueChange={(v) => setType(v as FieldType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map((ft) => (
                  <SelectItem key={ft.value} value={ft.value}>{ft.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="field-required"
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="field-required" className="cursor-pointer">必填欄位</Label>
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>取消</Button>
          <Button type="submit" form="field-form" disabled={isPending || !name.trim()}>新增</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
