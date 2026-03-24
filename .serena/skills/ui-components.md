# Skill: UI Standards & Component Selection
## Context
所有 Xuanwu 平台前端 UI 開發。

## Constraints
- **Toast 規範**: `toast` 組件已廢棄。
- **強制使用**: 必須使用 `sonner` 組件處理所有通知。
- **技術棧**: Next.js 15+ (App Router), Tailwind CSS.
- **原子化**: 遵循 Shadcn/ui 的組件哲學，但通知邏輯統一導向 `sonner`。

## Examples
- ✅ `import { toast } from "sonner";`
- ❌ `import { useToast } from "@/components/ui/use-toast";`