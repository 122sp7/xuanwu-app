# AI Context

本 README 在本次重切作業下，定義 shared AI capability 的主域邊界。

## Purpose

ai 是共享 AI capability 主域。它負責 provider routing、model policy、quota 與 safety guardrails，供 platform、notion、notebooklm 等主域穩定消費。

## Context Summary

| Aspect | Summary |
|---|---|
| Primary Role | 共享 AI capability 與 orchestration |
| Upstream Dependency | iam 的 access policy、billing 的 entitlement |
| Downstream Consumers | platform、notion、notebooklm |
| Core Principle | 提供 AI 能力，不接管內容或推理正典 |
