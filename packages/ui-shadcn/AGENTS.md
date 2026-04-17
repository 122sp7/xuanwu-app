# AGENTS.md — packages/ui-shadcn

## ⛔ 禁止直接修改此套件

`packages/ui-shadcn/` 是 **shadcn/ui 官方組件庫的原始輸出目錄**。
所有 `ui/` 下的組件皆由 `shadcn` CLI 生成，不得手動編輯。

---

## 為什麼禁止修改

| 理由 | 說明 |
|---|---|
| 官方組件來源 | `ui/` 下每個檔案都是由 `npx shadcn add <component>` 生成 |
| CLI 覆寫會 overwrite | 下次執行 `shadcn add` 或 `shadcn diff` 會直接覆寫手動修改 |
| 版本追蹤困難 | 手動修改混入 CLI 更新，導致 diff 不可讀、回退困難 |
| 架構邊界 | 此套件是 **pure UI primitive**，不承載業務邏輯 |

---

## 允許的操作

| 操作 | 方式 |
|---|---|
| 新增組件 | `npx shadcn add <component>` — 由 CLI 生成，不要手動建檔 |
| 升級組件 | `npx shadcn diff` 預覽差異，`npx shadcn update` 更新 |
| 查看可用組件 | `npx shadcn list` |
| 客製化樣式 | 在消費端（`src/app/`、`src/modules/*/interfaces/`）wrapping，不改本套件 |
| Provider / hooks | `provider/` 與 `hooks/` 為此套件的 thin wrapper，修改前需確認不是官方管理範圍 |

---

## 正確的客製化路徑

```
❌ 不對
packages/ui-shadcn/ui/button.tsx        ← 直接改官方組件
src/app/components/AppButton.tsx        ← 不應散落在 src/app

✅ 正確
packages/ui-shadcn/ui-custom/           ← 所有自訂 UI 組件的唯一存放位置
  AppButton.tsx                         ← wrap 官方組件，加入業務語意或設計系統層
  ...
src/modules/<context>/interfaces/       ← 組合 ui-custom 為模組業務 UI pattern
```

---

## Route Here / Route Elsewhere

| 任務 | 路由 |
|---|---|
| 新增 shadcn 原生組件 | 這裡（CLI 執行） |
| 修改組件 **外觀** | `packages/ui-shadcn/ui-custom/` — wrap 官方組件加設計語意 |
| 修改組件 **行為** | `packages/ui-shadcn/ui-custom/` — 同上，不直接改 `ui/` |
| 消費官方原件 | `import { Button } from "@ui-shadcn/ui/button"` |
| 消費自訂組件 | `import { AppButton } from "@ui-shadcn/ui-custom/AppButton"` |
| 主題 / design token | `src/app/globals.css` 的 CSS 變數層 |

---

## 別名

```ts
// tsconfig.json 中已配置
"@ui-shadcn/*": ["packages/ui-shadcn/*"]
```

消費端使用 `@ui-shadcn/ui/<component>` import，不用相對路徑。
