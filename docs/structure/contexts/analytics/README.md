# Analytics Context

本 README 在本次重切作業下，定義 analytics 作為下游 read-model 主域的邊界。

## Purpose

analytics 是報表、指標與儀表板主域。它主要消費其他主域的事件、usage signal 與 projection input，形成可查詢的分析視圖。

## Context Summary

| Aspect | Summary |
|---|---|
| Primary Role | reporting、metrics、dashboard、projection |
| Upstream Dependency | iam、billing、platform、workspace、notion、notebooklm 的事件與訊號 |
| Downstream Consumers | 產品與營運分析使用者 |
| Core Principle | analytics 是下游投影，不反向成為 canonical owner |

## Document Network

- [AGENTS.md](./AGENTS.md)
- [bounded-contexts.md](./bounded-contexts.md)
- [context-map.md](./context-map.md)
- [subdomains.md](./subdomains.md)
- [ubiquitous-language.md](./ubiquitous-language.md)
- 
        param($m)
        $dir = $m.Groups[1].Value
        $file = $m.Groups[2].Value
        "[$file](../../$dir/$file)"
    
- 
        param($m)
        $dir = $m.Groups[1].Value
        $file = $m.Groups[2].Value
        "[$file](../../$dir/$file)"
    
- 
        param($m)
        $dir = $m.Groups[1].Value
        $file = $m.Groups[2].Value
        "[$file](../../$dir/$file)"
    
