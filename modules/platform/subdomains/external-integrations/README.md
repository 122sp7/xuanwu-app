# integration — platform subdomain

`integration` 是 platform blueprint 中負責外部系統契約與交付執行的子域。它讓平台能用 `IntegrationContract`、`EndpointRef` 與 `DeliveryPolicy` 與外部世界互動，同時保留替換 adapter 的空間。

## 核心責任

- 維持 `IntegrationContract` 的契約語言與狀態邊界
- 維持 `EndpointRef`、`SecretReference`、`DeliveryPolicy` 的交付參照
- 協調外部呼叫結果，並把結果轉成事件、稽核與觀測訊號

## 主要語言

- `IntegrationContract`
- `EndpointRef`
- `DeliveryPolicy`

## Port 焦點

- `PlatformCommandPort`
- `IntegrationContractRepository`
- `ExternalSystemGateway`
- `SecretReferenceResolver`

## 與其他子域關係

- 上游主要受 `subscription`、`config`、`permission` 約束
- 下游主要服務 `audit` 與 `observability`

## 不擁有的責任

- 不定義方案權益真相
- 不建立 `WorkflowTrigger`
- 不直接保存通知歷史
