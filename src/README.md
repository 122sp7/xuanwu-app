# src

## PURPOSE

src 是應用主程式入口，承載 Next.js App Router 組裝與主域模組實作。
這層把「路由組裝」與「業務能力」分離為 app 與 modules 兩個子樹。
所有業務規則應留在 modules，src/app 只負責組裝與進入點協調。

## GETTING STARTED

在 repo 根目錄執行：

```bash
npm install
npm run dev
```

開發入口：

- App Router: [app](app)
- Bounded contexts: [modules](modules)

## ARCHITECTURE

src 內有兩個核心層：

- app：UI route composition 與 entry wiring
- modules：bounded-context 實作（application/domain/infrastructure/interfaces）

依賴方向遵循 interfaces -> application -> domain <- infrastructure。

## PROJECT STRUCTURE

- [app](app)：Next.js App Router composition layer
- [modules](modules)：主域模組實作層
- [AGENTS.md](AGENTS.md)：AI routing 與行為約束

## DEVELOPMENT RULES

- MUST keep business rules in modules, not in app routes.
- MUST use module public boundaries for cross-context collaboration.
- MUST separate command behavior and query behavior.
- MUST validate external input at interface boundary before application flow.

## AI INTEGRATION

AI 代理在 src 層只能做路由與邊界決策，不直接定義業務語言。
涉及術語、所有權、context map 的問題，先回到 docs 權威文件。

## DOCUMENTATION

- Routing rules: [AGENTS.md](AGENTS.md)
- App layer guide: [app/README.md](app/README.md)
- Module layer guide: [modules/README.md](modules/README.md)
- Strategic authority: [../docs/README.md](../docs/README.md)

## USABILITY

- 新開發者可在 5 分鐘內以 npm run dev 啟動系統。
- 可在 3 分鐘內透過 app/modules 分流找到要修改的位置。
