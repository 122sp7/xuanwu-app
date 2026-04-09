$root='"'"'d:\GitHub\122sp7\xuanwu-app\modules\platform'"'"'
$utf8NoBom=New-Object System.Text.UTF8Encoding($false)
$sub=@('"'"'access-control'"'"','"'"'account'"'"','"'"'account-profile'"'"','"'"'analytics'"'"','"'"'audit-log'"'"','"'"'background-job'"'"','"'"'billing'"'"','"'"'compliance'"'"','"'"'content'"'"','"'"'feature-flag'"'"','"'"'identity'"'"','"'"'integration'"'"','"'"'notification'"'"','"'"'observability'"'"','"'"'onboarding'"'"','"'"'organization'"'"','"'"'platform-config'"'"','"'"'referral'"'"','"'"'search'"'"','"'"'security-policy'"'"','"'"'subscription'"'"','"'"'support'"'"','"'"'workflow'"'"')
$expected=@(
'"'"'AGENT.md'"'"','"'"'index.ts'"'"','"'"'README.md'"'"',
'"'"'adapters/index.ts'"'"','"'"'adapters/cli/index.ts'"'"','"'"'adapters/external/.gitkeep'"'"','"'"'adapters/external/index.ts'"'"','"'"'adapters/persistence/.gitkeep'"'"','"'"'adapters/persistence/index.ts'"'"','"'"'adapters/web/.gitkeep'"'"','"'"'adapters/web/index.ts'"'"',
'"'"'api/contracts.ts'"'"','"'"'api/facade.ts'"'"','"'"'api/index.ts'"'"',
'"'"'application/index.ts'"'"','"'"'application/commands/.gitkeep'"'"','"'"'application/commands/index.ts'"'"','"'"'application/dtos/index.ts'"'"','"'"'application/handlers/.gitkeep'"'"','"'"'application/handlers/index.ts'"'"','"'"'application/queries/.gitkeep'"'"','"'"'application/queries/index.ts'"'"',
'"'"'docs/aggregates.md'"'"','"'"'docs/application-services.md'"'"','"'"'docs/bounded-context.md'"'"','"'"'docs/context-map.md'"'"','"'"'docs/domain-events.md'"'"','"'"'docs/domain-services.md'"'"','"'"'docs/README.md'"'"','"'"'docs/repositories.md'"'"','"'"'docs/subdomains.md'"'"','"'"'docs/ubiquitous-language.md'"'"',
'"'"'domain/index.ts'"'"','"'"'domain/aggregates/.gitkeep'"'"','"'"'domain/aggregates/index.ts'"'"','"'"'domain/entities/.gitkeep'"'"','"'"'domain/entities/index.ts'"'"','"'"'domain/events/.gitkeep'"'"','"'"'domain/events/index.ts'"'"','"'"'domain/factories/.gitkeep'"'"','"'"'domain/factories/index.ts'"'"','"'"'domain/services/.gitkeep'"'"','"'"'domain/services/index.ts'"'"','"'"'domain/value-objects/.gitkeep'"'"','"'"'domain/value-objects/index.ts'"'"',
'"'"'events/index.ts'"'"','"'"'events/contracts/.gitkeep'"'"','"'"'events/handlers/.gitkeep'"'"','"'"'events/ingress/.gitkeep'"'"','"'"'events/mappers/.gitkeep'"'"','"'"'events/published/.gitkeep'"'"','"'"'events/routing/.gitkeep'"'"',
'"'"'infrastructure/index.ts'"'"','"'"'infrastructure/cache/.gitkeep'"'"','"'"'infrastructure/cache/index.ts'"'"','"'"'infrastructure/db/.gitkeep'"'"','"'"'infrastructure/db/index.ts'"'"','"'"'infrastructure/email/.gitkeep'"'"','"'"'infrastructure/email/index.ts'"'"','"'"'infrastructure/messaging/.gitkeep'"'"','"'"'infrastructure/messaging/index.ts'"'"','"'"'infrastructure/monitoring/.gitkeep'"'"','"'"'infrastructure/monitoring/index.ts'"'"','"'"'infrastructure/storage/.gitkeep'"'"','"'"'infrastructure/storage/index.ts'"'"',
'"'"'ports/index.ts'"'"','"'"'ports/input/.gitkeep'"'"','"'"'ports/input/index.ts'"'"','"'"'ports/output/.gitkeep'"'"','"'"'ports/output/index.ts'"'"',
'"'"'shared/index.ts'"'"','"'"'shared/constants/.gitkeep'"'"','"'"'shared/constants/index.ts'"'"','"'"'shared/errors/.gitkeep'"'"','"'"'shared/errors/index.ts'"'"','"'"'shared/types/.gitkeep'"'"','"'"'shared/types/index.ts'"'"','"'"'shared/utils/.gitkeep'"'"','"'"'shared/utils/index.ts'"'"','"'"'shared/value-objects/.gitkeep'"'"','"'"'shared/value-objects/index.ts'"'"',
'"'"'subdomains/index.ts'"'"')
foreach($s in $sub){$expected+=@("subdomains/$s/index.ts","subdomains/$s/README.md","subdomains/$s/adapters/.gitkeep","subdomains/$s/adapters/index.ts","subdomains/$s/application/.gitkeep","subdomains/$s/application/index.ts","subdomains/$s/domain/.gitkeep","subdomains/$s/domain/index.ts")}
$created=0;$annotated=0
foreach($rel in $expected){
  $p=Join-Path $root ($rel -replace '/' ,'\\')
  $d=Split-Path -Parent $p
  if(-not(Test-Path $d)){New-Item -ItemType Directory -Path $d -Force|Out-Null}
  if(-not(Test-Path $p)){
    if($rel.EndsWith('"'"'.gitkeep'"'"')){New-Item -ItemType File -Path $p -Force|Out-Null}
    elseif($rel.EndsWith('"'"'.md'"'"')){[IO.File]::WriteAllText($p,'"'"'<!-- Purpose: Placeholder scaffold file for platform module development. -->'"'"',$utf8NoBom)}
    else{[IO.File]::WriteAllText($p,'"'"'// Purpose: Placeholder scaffold file for platform module development.'"'"',$utf8NoBom)}
    $created++
  } elseif(-not $rel.EndsWith('"'"'.gitkeep'"'"')){
    $c=[IO.File]::ReadAllText($p)
    if([string]::IsNullOrWhiteSpace($c)){
      if($rel.EndsWith('"'"'.md'"'"')){[IO.File]::WriteAllText($p,'"'"'<!-- Purpose: Placeholder scaffold file for platform module development. -->'"'"',$utf8NoBom)}
      else{[IO.File]::WriteAllText($p,'"'"'// Purpose: Placeholder scaffold file for platform module development.'"'"',$utf8NoBom)}
      $annotated++
    }
  }
}
$missing=@(); foreach($rel in $expected){$p=Join-Path $root ($rel -replace '/' ,'\\'); if(-not(Test-Path $p)){$missing+=$rel}}
"'"'expected_count='"'"'+$expected.Count
"'"'created_count='"'"'+$created
"'"'annotated_empty_count='"'"'+$annotated
"'"'missing_after='"'"'+$missing.Count
