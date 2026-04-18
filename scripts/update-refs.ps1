$replacements = [ordered]@{
  "docs/architecture-overview.md"               = "docs/structure/system/architecture-overview.md"
  "docs/bounded-context-subdomain-template.md"  = "docs/structure/domain/bounded-context-subdomain-template.md"
  "docs/bounded-contexts.md"                    = "docs/structure/domain/bounded-contexts.md"
  "docs/context-map.md"                         = "docs/structure/system/context-map.md"
  "docs/hard-rules-consolidated.md"             = "docs/structure/system/hard-rules-consolidated.md"
  "docs/integration-guidelines.md"              = "docs/structure/system/integration-guidelines.md"
  "docs/module-graph.system-wide.md"            = "docs/structure/system/module-graph.system-wide.md"
  "docs/project-delivery-milestones.md"         = "docs/structure/system/project-delivery-milestones.md"
  "docs/strategic-patterns.md"                  = "docs/structure/system/strategic-patterns.md"
  "docs/subdomains.md"                          = "docs/structure/domain/subdomains.md"
  "docs/ubiquitous-language.md"                 = "docs/structure/domain/ubiquitous-language.md"
  "docs/architecture/source-to-task-flow.md"    = "docs/structure/system/source-to-task-flow.md"
  "docs/architecture/firebase-architecture.md"  = "docs/tooling/firebase/firebase-architecture.md"
  "docs/architecture/genkit-flow-standards.md"  = "docs/tooling/genkit/genkit-flow-standards.md"
  "docs/architecture/state-machine-model.md"    = "docs/tooling/nextjs/state-machine-model.md"
  "docs/architecture/ddd-strategic-design.md"   = "docs/structure/domain/ddd-strategic-design.md"
  "docs/architecture/event-driven-design.md"    = "docs/structure/domain/event-driven-design.md"
}

$files = Get-ChildItem -Path "D:\GitHub\122sp7\xuanwu-app" -Recurse -Include "*.md","*.ts","*.tsx","*.mjs" | Where-Object {
  $_.FullName -notmatch "node_modules" -and
  $_.FullName -notmatch "\.serena" -and
  $_.FullName -notmatch "skills.+references"
}

$updated = @()
foreach ($file in $files) {
  $content = Get-Content $file.FullName -Raw -Encoding UTF8
  if (-not $content) { continue }
  $newContent = $content
  foreach ($old in $replacements.Keys) {
    $newContent = $newContent -replace [regex]::Escape($old), $replacements[$old]
  }
  if ($newContent -ne $content) {
    Set-Content $file.FullName $newContent -Encoding UTF8 -NoNewline
    $updated += $file.FullName -replace "D:\\GitHub\\122sp7\\xuanwu-app\\", ""
  }
}

Write-Host "Updated $($updated.Count) files:"
$updated | Sort-Object | ForEach-Object { Write-Host "  $_" }
