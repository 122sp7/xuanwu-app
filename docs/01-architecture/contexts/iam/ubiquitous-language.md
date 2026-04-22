# IAM

## Canonical Terms

| Term | Meaning |
|---|---|
| Actor | 被識別與治理的主體 |
| Identity | 證明 Actor 是誰的訊號集合 |
| Tenant | 租戶隔離與 tenant-scoped 規則邊界 |
| AccessDecision | 對 actor 當下能否執行某行為的判定 |
| SecurityPolicy | 可版本化的安全規則集合 |

## Avoid

- 不用 User 混稱 Actor。
- 不用 Organization 取代 Tenant。
- 不把 access decision 寫成 UI flag。
