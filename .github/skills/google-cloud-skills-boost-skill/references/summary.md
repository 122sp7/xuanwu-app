# Google Cloud Skills Boost 重點摘要

本技能整理自可在目前環境讀取到的 Google Cloud Skills / Google Cloud 公開摘要內容，用於提供
**架構決策參考**，不是課程逐字轉錄。

## 主要能力面向

### 1. Core Infrastructure

- Google Cloud 專案、資源與 IAM 基礎
- 雲端運算模型與基礎設施配置
- VM、網路、負載平衡等核心雲端能力

### 2. Data and Storage

- Cloud Storage、Cloud SQL、Spanner、Firestore、Bigtable 等資料能力
- ETL / dataflow / 大量資料處理的設計思維
- 適合拿來對照資料平面與 metadata plane 的切分方式

### 3. Serverless and Modern Runtime Design

- Cloud Functions、Cloud Run、GKE / Kubernetes 等現代執行模型
- 以職責、延遲、可重試性、維運成本決定 runtime placement
- 適合用來評估 Firebase Functions / Next.js / worker runtime 的邊界

### 4. AI / ML Platform

- Vertex AI、BigQuery ML、生成式 AI 與預測式 AI 的平台化思路
- 關注資料前處理、模型訓練、部署與生命週期管理
- 適合拿來規劃 document AI、embedding、retrieval pipeline 的平台責任

### 5. Security and Governance

- IAM、service account、權限控管與資源治理
- 適合對照 multi-tenant / namespace / audit / policy 設計

### 6. Practice-oriented Learning

- Skills Boost 強調 lab / badge / certification 導向
- 對工程實作的啟發是：優先建立可驗證、可觀測、可遷移的最小完整切片

## 對本倉庫可直接借用的設計原則

1. **先切 runtime responsibility，再切語言**
   - 是否 user-facing、是否需要 streaming/auth、是否重型背景作業，應先決定放在哪個 runtime。

2. **先定 canonical store，再做衍生索引**
   - 先決定 Firestore / Storage / Vector store 的角色，再安排 retrieval 或 analytics。

3. **把 AI 流程視為平台管線**
   - parse → clean → classify → chunk → embed → persist → observe。

4. **把治理和觀測視為一級需求**
   - IAM / audit / usage analytics 不應該等功能完成後才補。

## 來源

- Google Cloud Fundamentals: Core Infrastructure — https://www.skills.google/course_templates/60
- Google Skills portal — https://www.skills.google/
- Google Cloud credentials overview — https://cloud.google.com/learn/training/credentials
