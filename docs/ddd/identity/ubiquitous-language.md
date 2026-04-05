# Ubiquitous Language ??identity

> **蝭?嚗?* ?? `modules/identity/` ??銝??

## 銵?摰儔

| 銵? | ?望? | 摰儔 | 隞?Ⅳ雿蔭 |
|------|------|------|---------|
| 頨思遢 | Identity | Firebase Auth 撽?敺?雿輻????隞?`uid` ?箏銝霅蝣?| `modules/identity/domain/entities/` |
| ?臭?頨思遢蝣?| uid | Firebase Authentication ?Ｙ??蝙?刻?銝 ID | `Identity.uid` |
| Token ?瑟閮? | TokenRefreshSignal | 隞?” Firebase ID token ?閬?啁?閮??拐辣 | `domain/entities/` |
| ?餃 | signIn | ?? Email ??OAuth 撱箇? Firebase Auth session | `IdentityRepository.signIn()` |
| ?餃 | signOut | 蝯迫 Firebase Auth session | `IdentityRepository.signOut()` |

## 蝳迫?踵?銵?

| 甇?Ⅱ | 蝳迫 |
|------|------|
| `Identity` | `User`, `AuthUser`, `CurrentUser` |
| `uid` | `userId`, `id`, `accountId`嚗甇?BC ?改? |
| `TokenRefreshSignal` | `RefreshToken`, `TokenEvent` |
