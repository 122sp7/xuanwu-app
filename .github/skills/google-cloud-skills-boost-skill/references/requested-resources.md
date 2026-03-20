# Requested Google Skills Boost 資源對照

本檔整理 reviewer 指定的 Google Skills Boost 連結，區分：

- **publicly confirmed**：可從可存取的公開來源確認主題或標題
- **public proxy theme**：無法直接讀到原頁，但可由 Google Skills / Cloud Skills Boost 公開摘要推定其能力面向
- **unresolved**：目前公開來源無法可靠映射精確標題，應避免假設為已確認事實

> 原則：這份技能是提供給本倉庫後續設計/實作參考，不是課程內容轉錄，也不應偽造
> 無法公開驗證的官方標題。

---

## 1. 指定資源總覽

| Requested resource | Status | Publicly confirmed title/topic | How to use in this repo |
| --- | --- | --- | --- |
| `https://www.skills.google/focuses/21028` | public proxy theme | GenAI / Gemini / Vertex AI / app-building track theme inferred from current Google Skills public summaries | 參考生成式 AI 應用分層、Gemini/Vertex AI integration、AI app delivery patterns |
| `https://www.skills.google/focuses/67856` | unresolved | No authoritative public title mapping found | 不要假設精確官方名稱；保留為 reviewer-curated resource id |
| `https://www.skills.google/focuses/21026` | public proxy theme | Prompt design / Vertex AI / Gemini-oriented learning theme inferred from accessible summaries | 參考 query preprocessing、prompt design、LLM orchestration decision-making |
| `https://www.skills.google/focuses/67859` | unresolved | No authoritative public title mapping found | 不要假設精確官方名稱；保留為 reviewer-curated resource id |
| `https://www.skills.google/focuses/67857` | unresolved | No authoritative public title mapping found | 不要假設精確官方名稱；保留為 reviewer-curated resource id |
| `https://www.skills.google/focuses/21027` | public proxy theme | Gemini / multimodal / application-building learning theme inferred from accessible summaries | 參考 AI app UX、multimodal pipelines、deployment boundary decisions |
| `https://www.skills.google/focuses/34185` | public proxy theme | AI Boost Bites / short-form practical AI upskilling theme | 參考「可驗證的最小完整切片」與快速可落地 AI workflow design |
| `https://www.skills.google/focuses/67855` | unresolved | No authoritative public title mapping found | 不要假設精確官方名稱；保留為 reviewer-curated resource id |
| `https://www.skills.google/course_templates/674` | publicly confirmed | **Automate Data Capture at Scale with Document AI** | 直接對應本 repo 的 Document AI / ingestion / extraction 架構參考 |
| `https://www.skills.google/course_templates/674/labs/616163` | course-linked lab set | Public search does not expose exact lab title, but it belongs to the Document AI data-capture course path | 參考 Document AI processor setup / extraction / workflow automation 實作面 |
| `https://www.skills.google/course_templates/674/labs/616164` | course-linked lab set | Same as above | 同上 |
| `https://www.skills.google/course_templates/674/labs/616165` | course-linked lab set | Same as above | 同上 |
| `https://www.skills.google/course_templates/674/labs/616166` | course-linked lab set | Same as above | 同上 |

---

## 2. Public proxy themes for the requested focus pages

由於多個 `focuses/<id>` 頁面在目前環境無法直接抓取，且公開搜尋結果不會穩定回傳官方標題，
此技能只保留「可公開支撐的主題層級」：

### A. GenAI / Gemini / Vertex AI

可對應到以下設計面向：

- prompt design 與 query preprocessing
- Gemini / Vertex AI 的 runtime integration
- multimodal or application-building learning slices
- 將 AI 能力封裝為可部署的 app / flow / service

對本倉庫的直接意義：

- Next.js / Genkit 應承接 user-facing query orchestration
- worker/runtime（如 `functions-python`）應承接 heavy background processing 與 document pipeline
- prompt / retrieval / answer-generation 應分清 orchestration 與 infrastructure responsibilities

### B. AI Boost Bites / practice-first learning

可對應到以下工程原則：

- 優先交付最小但完整的 end-to-end slice
- 每個 AI feature 都應有明確輸入、輸出、觀測點、與可驗證結果
- 不把 AI 寫成不可測且無觀測的黑盒流程

### C. Unresolved focus IDs (`67855/67856/67857/67859`)

這些 ID 目前沒有可靠的公開標題映射。對技能使用者的要求是：

1. 可在文件中記錄這些連結是 reviewer-curated inputs
2. 不要在後續 PR / docs 中把它們寫成已驗證的官方課程標題
3. 若未來在可登入環境查到精確名稱，再以增量方式補全

---

## 3. Course Template 674: Document AI track

### Confirmed course

- **Automate Data Capture at Scale with Document AI**

### Confirmed capability theme

- 大規模文件資料擷取 / extraction automation
- 以 Document AI 作為核心 document processing platform
- 和 Cloud Storage / event-driven workflow / downstream structured data persistence 的整合思維

### 對本 repo 的直接借用方式

這組課程和 labs 最適合映射到：

- `libs/firebase/functions-python` 的 ingestion runtime
- 文件上傳後的背景處理管線
- parser / extraction / metadata persistence / operational automation

也就是：

```text
upload -> storage -> metadata -> worker trigger -> parse/extract -> persist -> ready
```

這與目前 `functions-python` ADR 已定義的 worker 邊界高度一致。

---

## 4. Document AI labs 616163-616166 的實作啟發

雖然公開來源沒有穩定暴露各 lab 的逐一標題，但這組 labs 隸屬於同一個
Document AI data-capture course path，因此可安全萃取以下「實作層級」參考：

- Document AI processor 建立與設定
- 文件上傳、處理、結果擷取
- 與 Cloud Storage / Pub/Sub / Cloud Functions 類型的 workflow orchestration 整合
- 將抽取結果轉成可被下游服務消費的 structured output

對本 repo 的落地含義：

1. **文件處理要被視為管線，不是單一步驟**
   - upload
   - detect / parse / clean
   - classify / enrich
   - persist / observe

2. **Document AI 是 adapter，不是 domain**
   - vendor SDK 應留在 infrastructure adapter
   - pipeline contracts 應維持可替換

3. **結果資料要可追蹤**
   - input document
   - extracted fields
   - normalized text
   - chunk / taxonomy / status transitions

---

## 5. Recommended usage pattern for future PRs

當後續工作提到這些 Google learning resources 時，建議採用以下說法：

- 對 **已確認** 的課程，用精確名稱引用
- 對 **未確認 title 的 focus IDs**，用 `reviewer-requested focus resource` 或 `requested focus id` 表述
- 對 **架構設計**，引用這裡萃取出的 capability themes，而不是假裝直接複製課程內容

---

## Sources

- Google Skills catalog: https://www.skills.google/catalog?locale=en
- Google Skills / AI upskilling overview: https://blog.google/products-and-platforms/products/education/google-skills/
- AI Boost Bites collection: https://www.skills.google/collections/ai-boost-bites
- AI Boost Bites path: https://www.skills.google/paths/2480
- Boost Your Cloud Skills with Google: https://cloud.google.com/resources/boost-your-cloud-skills-with-google
- Automate Data Capture at Scale with Document AI: https://www.cloudskillsboost.google/course_templates/674
- Labs help overview: https://support.google.com/qwiklabs/answer/9115366?hl=en
- Credentials help: https://support.google.com/qwiklabs/answer/11286114?hl=en
