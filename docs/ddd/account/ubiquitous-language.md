# Ubiquitous Language ??account

> **蝭?嚗?* ?? `modules/account/` ??銝??

## 銵?摰儔

| 銵? | ?望? | 摰儔 | 隞?Ⅳ雿蔭 |
|------|------|------|---------|
| 撣單 | Account | 雿輻?撟喳?平??????profile 鞈?????| `modules/account/domain/entities/Account.ts` |
| 撣單?輻? | AccountPolicy | ???啣董?嗥?摮??批?輻?嚗捱摰?Firebase custom claims ?批捆 | `modules/account/domain/entities/AccountPolicy.ts` |
| 撣單 ID | accountId | Account ?平?蜓?蛛?撠? Firebase uid嚗??冽平?惜雿輻 accountId 銵?嚗?| `Account.id` |
| ?芾?摰?? | customClaims | Firebase ID token 銝剔??芾? claims嚗 AccountPolicy 瘙箏? | `Account.customClaims` |
| 撣單?亥岷摨?| AccountQueryRepository | CQRS 霈? Repository port | `domain/repositories/AccountQueryRepository.ts` |

## 蝳迫?踵?銵?

| 甇?Ⅱ | 蝳迫 |
|------|------|
| `Account` | `User`, `Profile` |
| `AccountPolicy` | `Permission`, `Role`, `AccessRule` |
| `accountId` | `userId`嚗董?嗅惜?蝙??accountId嚗?|
