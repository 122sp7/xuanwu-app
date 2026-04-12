# Taxonomy Subdomain Gap Implementation — COMPLETE

## Status
Done. Lint exit 0. No type errors.

## Files Created
- `modules/notion/infrastructure/taxonomy/firebase/FirebaseTaxonomyRepository.ts`
  - Firestore path: `notionTaxonomyNodes/{nodeId}`
  - listRoots: queries by organizationId + depth==0
  - listChildren: queries by parentNodeId
  - save/remove: set/delete on doc path
- `modules/notion/infrastructure/taxonomy/firebase/index.ts`
- `modules/notion/infrastructure/taxonomy/index.ts`
- `modules/notion/interfaces/taxonomy/composition/repositories.ts` → makeTaxonomyRepo()
- `modules/notion/interfaces/taxonomy/composition/use-cases.ts` → makeTaxonomyUseCases()
- `modules/notion/subdomains/taxonomy/api/server.ts` — server-only boundary

## READMEs Updated (Stub → Active)
- modules/notion/subdomains/taxonomy/README.md
- modules/notion/subdomains/relations/README.md
- modules/notebooklm/subdomains/notebook/README.md

## Remaining Gaps
- conversation subdomain: application/use-cases missing (SendMessage, LoadThread)
- TODO shells: collaboration/database domain/services, domain/value-objects
