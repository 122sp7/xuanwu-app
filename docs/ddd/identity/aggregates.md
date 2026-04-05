# Aggregates ??identity

## ???對?Identity

### ?瑁痊
隞?”銝?歇?? Firebase Authentication 撽??蝙?刻?靘??澈隞質?閮??賢???

### 撅祆?

| 撅祆?| ? | 隤芣? |
|------|------|------|
| `uid` | `string` | Firebase UID嚗蜓?蛛? |
| `email` | `string \| null` | 雿輻??Email |
| `displayName` | `string \| null` | 憿舐內?迂 |
| `photoURL` | `string \| null` | ?剖? URL |

### 銝???

- `uid` 瘞賊?銝蝛綽???Firebase 靽?嚗?
- `Identity` ?拐辣?臬霈????Firebase Auth SDK ?Ｙ?嚗?

---

## ?潛隞塚?TokenRefreshSignal

### ?瑁痊
隞?”?oken ?閬?啜?鈭辣閮?嚗孛??`account` ???custom claims??

### 撅祆?

| 撅祆?| ? | 隤芣? |
|------|------|------|
| `uid` | `string` | ?閬??token ?蝙?刻?UID |
| `occurredAt` | `string` | ISO 8601 ????|

---

## Repository Interfaces

| 隞 | 銝餉??寞? | 隤芣? |
|------|---------|------|
| `IdentityRepository` | `signIn()`, `signOut()`, `getCurrentIdentity()` | Firebase Auth ?? |
| `TokenRefreshRepository` | `listenToTokenRefresh()` | ?? token ?瑟鈭辣 |
