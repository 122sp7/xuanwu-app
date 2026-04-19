/**
 * firebase-composition — notion module outbound composition root.
 *
 * Currently uses InMemory repositories — no Firestore adapter exists yet
 * for notion (it is pure TypeScript DDD; fn has no corresponding capability).
 * Replace InMemory repos with real Firestore implementations when the notion
 * Firestore schema is finalized.
 *
 * ESLint: @integration-firebase is allowed here — this file lives at
 * src/modules/notion/adapters/outbound/ which matches the permitted glob.
 */

import { InMemoryPageRepository } from "../../subdomains/page/adapters/outbound/memory/InMemoryPageRepository";
import { InMemoryDatabaseRepository } from "../../subdomains/database/adapters/outbound/memory/InMemoryDatabaseRepository";
import { InMemoryTemplateRepository } from "../../subdomains/template/adapters/outbound/memory/InMemoryTemplateRepository";
import {
  CreatePageUseCase,
  RenamePageUseCase,
  ArchivePageUseCase,
  QueryPagesUseCase,
} from "../../subdomains/page/application/use-cases/PageUseCases";
import {
  CreateDatabaseUseCase,
  AddPropertyUseCase,
} from "../../subdomains/database/application/use-cases/DatabaseUseCases";
import {
  QueryTemplatesUseCase,
  CreateTemplateUseCase,
} from "../../subdomains/template/application/use-cases/TemplateUseCases";

// ── Singleton repositories ────────────────────────────────────────────────────

let _pageRepo: InMemoryPageRepository | undefined;
let _databaseRepo: InMemoryDatabaseRepository | undefined;
let _templateRepo: InMemoryTemplateRepository | undefined;

function getPageRepo(): InMemoryPageRepository {
  if (!_pageRepo) _pageRepo = new InMemoryPageRepository();
  return _pageRepo;
}

function getDatabaseRepo(): InMemoryDatabaseRepository {
  if (!_databaseRepo) _databaseRepo = new InMemoryDatabaseRepository();
  return _databaseRepo;
}

function getTemplateRepo(): InMemoryTemplateRepository {
  if (!_templateRepo) _templateRepo = new InMemoryTemplateRepository();
  return _templateRepo;
}

// ── Factory functions ─────────────────────────────────────────────────────────

export function createClientNotionPageUseCases() {
  const repo = getPageRepo();
  return {
    createPage: new CreatePageUseCase(repo),
    renamePage: new RenamePageUseCase(repo),
    archivePage: new ArchivePageUseCase(repo),
    queryPages: new QueryPagesUseCase(repo),
  };
}

export function createClientNotionDatabaseUseCases() {
  const repo = getDatabaseRepo();
  return {
    createDatabase: new CreateDatabaseUseCase(repo),
    addProperty: new AddPropertyUseCase(repo),
    findByWorkspaceId: (workspaceId: string) => repo.findByWorkspaceId(workspaceId),
  };
}

export function createClientNotionTemplateUseCases() {
  const repo = getTemplateRepo();
  return {
    queryTemplates: new QueryTemplatesUseCase(repo),
    createTemplate: new CreateTemplateUseCase(repo),
  };
}
