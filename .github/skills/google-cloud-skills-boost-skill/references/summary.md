# Google Cloud Skills Boost 重點摘要

本技能整理自**目前環境可取得的公開摘要、Google Skills / Cloud Skills Boost 說明頁與搜尋可驗證資訊**，
用來提供**架構決策參考**，不是課程逐字轉錄。

若需求直接提到 reviewer 指定的特定 `focus` / `course_template` / `lab` 連結，請搭配
`requested-resources.md` 一起使用。

---

## 主要能力面向

### 1. Core Infrastructure

- Google Cloud 專案、資源、IAM、網路與基礎設施配置
- VM / load balancer / resource hierarchy 等核心雲端能力
- 適合用來對照 environment、tenant、network、governance 基礎設計

### 2. Data and Storage

- Cloud Storage、BigQuery、Firestore 與資料處理服務的角色切分
- canonical data store 與 downstream processing/indexing 的分工
- 適合用來思考 raw file、metadata、chunk store、analytics store 的界線

### 3. Serverless and Modern Runtime Design

- Cloud Functions、Cloud Run、Kubernetes 等現代執行模型
- 以職責、延遲、可重試性、維運成本決定 runtime placement
- 適合拿來評估 Firebase Functions / Next.js / worker runtime 的邊界

### 4. AI / ML Platform

- Vertex AI、Gemini、Document AI、BigQuery ML 的平台化思路
- 關注資料前處理、模型呼叫、結果持久化與生命週期管理
- 適合拿來規劃 document parsing、embedding、retrieval、prompt orchestration 的平台責任

### 5. Security and Governance

- IAM、service account、權限控管、資源治理、認證與技能路徑
- 適合對照 multi-tenant / namespace / audit / policy 設計

### 6. Practice-oriented Learning

- Skills Boost 強調 lab / badge / hands-on completion
- 對工程實作的啟發是：優先建立可驗證、可觀測、可遷移的最小完整切片

---

## 對本倉庫可直接借用的設計原則

1. **先切 runtime responsibility，再切語言**
   - 是否 user-facing、是否需要 streaming/auth、是否屬於重型背景作業，應先決定放在哪個 runtime。

2. **先定 canonical store，再做衍生索引**
   - 先決定 Firestore / Storage / Vector store / cache 的角色，再安排 retrieval 或 analytics。

3. **把 AI 流程視為平台管線**
   - parse → clean → classify → chunk → embed → persist → observe。

4. **把治理和觀測視為一級需求**
   - IAM / audit / usage analytics 不應該等功能完成後才補。

5. **對無法公開驗證的課程 ID 保持誠實**
   - 能確認名稱就精確引用。
   - 不能確認就只保留 resource id 與 theme，不偽造官方標題。

---

## 這次新增補強的重點

這份技能現在除了平台級摘要外，也額外涵蓋：

- reviewer 指定的多個 `focuses/<id>` 連結
- `course_templates/674`
- `labs/616163` ~ `616166`

其中：

- **Document AI course template 674** 可被公開確認
- 多數 `focus` 頁面只能確認到主題層級或完全無法公開解析精確標題
- 技能文件因此改採「confirmed / proxy theme / unresolved」三層標記，避免誤導後續代理或開發者

---

## 來源

- Google Skills catalog — https://www.skills.google/catalog?locale=en
- Google Skills / AI upskilling overview — https://blog.google/products-and-platforms/products/education/google-skills/
- AI Boost Bites collection — https://www.skills.google/collections/ai-boost-bites
- AI Boost Bites path — https://www.skills.google/paths/2480
- Boost Your Cloud Skills with Google — https://cloud.google.com/resources/boost-your-cloud-skills-with-google
- Automate Data Capture at Scale with Document AI — https://www.cloudskillsboost.google/course_templates/674
- Labs help overview — https://support.google.com/qwiklabs/answer/9115366?hl=en
- Credentials help — https://support.google.com/qwiklabs/answer/11286114?hl=en
