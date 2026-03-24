# Skill: UI Component Selection
## Context
當開發者或 Agent 需要建立提示訊息、彈窗或任何反饋 UI 時。

## Constraints
- **禁止使用 `toast` 組件**（已在 2026-03 標記為過時）。
- **強制使用 `sonner` 組件**。
- 所有的 `L6` (Adapter) 層 UI 必須引用 `sonner`。

## Examples
- ✅ `import { toast } from "sonner"`
- ❌ `import { useToast } from "@/components/ui/use-toast"`