---
description: '子域（Subdomain）戰略設計規則：業務能力切分、邊界穩定性、契約溝通、可替換性。'
applyTo: 'modules/**/subdomains/**/*.{ts,tsx,js,jsx,md}'
---

# 子域（Subdomain）設計規則

> 完整邊界參考：**先查 `docs/subdomains.md`、`docs/bounded-contexts.md`、`docs/ubiquitous-language.md`**
> 此文件只包含子域層級的**戰略設計約束**，不複製領域知識或程式碼範例。

## 核心定義

子域 = 業務能力邊界（Business Capability Boundary）

每個子域代表一個獨立、明確定義的業務能力，不得混合多重職責。

## 戰略設計規則

1. 子域必須以「業務能力」切分，而不是技術功能或 UI 功能。
2. 每個子域必須能獨立描述一個完整業務問題空間（Problem Space）。
3. 子域之間禁止共享內部模型，只能透過明確契約（ACL / API / Event）。
4. 子域邊界必須穩定，不能因 UI 或技術重構而頻繁變動。
5. 子域劃分優先於技術架構（database / service / module）。
6. 一個子域內可以包含多個 bounded context，但不能跨子域共享 domain model。
7. 子域必須可被替換（replaceable），不依賴其他子域內部實作。
8. 子域之間只能透過「輸入/輸出契約」溝通，不允許直接依賴 domain logic。

## 層級約束（Hard Rules）

子域內預設允許：
- `api/`
- `domain/`
- `application/`
- `ports/`（optional）

子域內條件允許：
- `infrastructure/`、`interfaces/` 僅在 subdomain 具備 mini-module 級獨立能力時可建立。
- mini-module gate 需同時滿足：
	1. 具有明確且長期穩定的獨立外部整合責任。
	2. 需要獨立演化與測試節奏，且無法由 bounded-context 根層承接。
	3. 於子域 `README.md` 明確記錄為 mini-module 例外與邊界責任。

子域內禁止：
- 在未符合 mini-module gate 時建立 `infrastructure/` 或 `interfaces/`。

## 單一職責

每個子域只負責一個業務能力。

正確：authoring、collaboration、publishing

錯誤：article + comment + permission 混在一起

## 跨子域依賴禁止

子域不得直接匯入其他子域。溝通必須經由：
- 上層 application layer
- module API boundary

## 領域純度

domain 層必須：
- 零框架依賴
- 不依賴 Firebase、DB 或 API
- 不包含 UI logic

允許：Entities、Value Objects、Domain Services、Business invariants

## 命名規則

使用業務語言命名子域。

正確：authoring、knowledge-base、workspace

錯誤：utils、common、shared

## 獨立演化

每個子域應：
- 可獨立測試
- 可獨立重構
- 為未來微服務拆分做準備

## 一句話總結

Subdomain = core-first business capability; adapters/UI only by mini-module exception

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
