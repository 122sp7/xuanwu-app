# Context Map ??account

## 銝虜嚗?鞈湛?

### identity ??account嚗ustomer/Supplier嚗?

- `account` 靘陷 `identity/api` ?? uid ??TokenRefreshSignal
- `modules/account/application/use-cases/account.use-cases.ts` ??server 蝡?import `identity/api`

```
identity/api ????account/application (server-side use-cases)
```

---

## 銝虜嚗◤靘陷嚗?

### account ??organization嚗ustomer/Supplier嚗?

- `organization` ??`MemberReference` 雿輻 `accountId` ? Account
- Organization ??”隞?`accountId` ?箔蜓??

### account ??workspace嚗ustomer/Supplier嚗?

- `Workspace.accountId` ?撣單??蝜?

---

## IDDD ?游?璅∪?蝮賜?

| ?? | 銝虜 | 銝虜 | 璅∪? |
|------|------|------|------|
| identity ??account | identity | account | Customer/Supplier |
| account ??organization | account | organization | Customer/Supplier |
| account ??workspace | account | workspace | Customer/Supplier |
