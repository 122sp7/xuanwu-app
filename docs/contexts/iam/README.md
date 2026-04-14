# IAM Context

本 README 在本次重切作業下，定義 identity and access management 的主域邊界。

## Purpose

iam 是身份、租戶與存取治理主域。它提供 actor、identity、tenant、access decision 與 security policy 語言，作為其他主域的治理上游。

## Context Summary

| Aspect | Summary |
|---|---|
| Primary Role | 身份、租戶與 access governance |
| Upstream Dependency | 無主域級上游 |
| Downstream Consumers | billing、platform、workspace、notion、notebooklm |
| Core Principle | 提供治理判定，不接管商業、內容或推理正典 |
