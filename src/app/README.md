# src/app

## PURPOSE

src/app 是 Next.js App Router 的 composition layer。
本層負責 page/layout/slot 組裝與 route-level rendering 邏輯。
業務規則不應落在本層，而應由 modules 提供公開能力。

## GETTING STARTED

從 repo 根目錄啟動：

```bash
npm install
npm run dev
```

進入 app 後，先閱讀：

1. [AGENTS.md](AGENTS.md)
2. [../AGENTS.md](../AGENTS.md)
3. [../../docs/README.md](../../docs/README.md)

## ARCHITECTURE

app 層只做 composition：

- route group 與 layout 編排
- loading/error/not-found 視圖組裝
- 對 modules 公開 API 的調用

## PROJECT STRUCTURE

- [AGENTS.md](AGENTS.md)：AI 路由與邊界規則
- [../modules](../modules)：業務能力提供層
- [../README.md](../README.md)：src 層總覽

## DEVELOPMENT RULES

- MUST keep business rules outside route components.
- MUST call modules through public boundaries.
- MUST keep command/query orchestration in modules, not in app routes.
- MUST preserve route parameter semantics from owning context contracts.

## AI INTEGRATION

AI 代理在 app 層只做組裝決策，不直接產生跨域業務邏輯。
若需求牽涉 bounded-context 所有權，先回到 docs 權威文件。

## DOCUMENTATION

- Routing rules: [AGENTS.md](AGENTS.md)
- src overview: [../README.md](../README.md)
- modules overview: [../modules/README.md](../modules/README.md)
- Strategic authority: [../../docs/README.md](../../docs/README.md)

## USABILITY

- 新開發者可在 5 分鐘內啟動並找到 app 層入口。
- 可在 3 分鐘內判斷改動應落在 app 還是 modules。
