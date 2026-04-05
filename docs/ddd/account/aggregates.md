# Aggregates ??account

## ???對?Account

### ?瑁痊
隞?”雿輻? Xuanwu 撟喳?平?澈隞質??恣??profile 鞈??董?嗥???

### ?撅祆?

| 撅祆?| ? | 隤芣? |
|------|------|------|
| `id` | `string` | 撣單銝駁嚗???Firebase uid嚗?|
| `displayName` | `string` | 憿舐內?迂 |
| `email` | `string` | Email |
| `avatarUrl` | `string \| null` | ?剖? URL |
| `createdAt` | `Timestamp` | 撱箇??? |

### 銝???

- 瘥?Account 撠??臭?銝??Firebase uid
- Account 撱箇?敺?id 銝霈

---

## ???對?AccountPolicy

### ?瑁痊
隞?”???啣董?嗥?摮??批?輻?嚗?蝢拙鈭?皞摮??鈭?雿◤?迂嚗蒂????Firebase custom claims??

### ?撅祆?

| 撅祆?| ? | 隤芣? |
|------|------|------|
| `id` | `string` | Policy 銝駁 |
| `accountId` | `string` | ???Account ID |
| `rules` | `PolicyRule[]` | 摮??批閬??” |
| `effect` | `"allow" \| "deny"` | 閬??? |

---

## Repository Interfaces

| 隞 | 銝餉??寞? |
|------|---------|
| `AccountRepository` | `save()`, `findById()`, `delete()` |
| `AccountQueryRepository` | `findById()`, `findByEmail()` |
| `AccountPolicyRepository` | `save()`, `findByAccountId()` |
