/**
 * firebase-composition — notion module outbound composition root.
 *
 * Uses Firestore for Pages (contentPages collection) and Databases
 * (knowledgeDatabases collection). Templates remain in-memory.
 *
 * All exported helper functions MUST be called from client components,
 * NOT from Server Actions. The Firebase Web Client SDK requires a signed-in
 * user in the browser context so that Firestore Security Rules can evaluate
 * request.auth.
 *
 * ESLint: @integration-firebase is allowed here — this file lives at
 * src/modules/notion/adapters/outbound/ which matches the permitted glob.
 */

import { FirestorePageRepository } from "../../subdomains/page/adapters/outbound/firestore/FirestorePageRepository";
import { FirestoreDatabaseRepository } from "../../subdomains/database/adapters/outbound/firestore/FirestoreDatabaseRepository";
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
import type { CreatePageInput } from "../../subdomains/page/domain/entities/Page";
import type { CreateDatabaseInput, DatabaseProperty } from "../../subdomains/database/domain/entities/Database";

// ── Singleton repositories ────────────────────────────────────────────────────

let _pageRepo: FirestorePageRepository | undefined;
let _databaseRepo: FirestoreDatabaseRepository | undefined;
let _templateRepo: InMemoryTemplateRepository | undefined;

function getPageRepo(): FirestorePageRepository {
  if (!_pageRepo) _pageRepo = new FirestorePageRepository();
  return _pageRepo;
}

function getDatabaseRepo(): FirestoreDatabaseRepository {
  if (!_databaseRepo) _databaseRepo = new FirestoreDatabaseRepository();
  return _databaseRepo;
}

function getTemplateRepo(): InMemoryTemplateRepository {
  if (!_templateRepo) _templateRepo = new InMemoryTemplateRepository();
  return _templateRepo;
}

// ── Factory functions (kept for server-action compatibility) ──────────────────

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

// ── Client-side page helpers ──────────────────────────────────────────────────
//
// MUST be called from client components, NOT from Server Actions.

export async function queryPages(params: { accountId: string; workspaceId: string }) {
  const { queryPages: uc } = createClientNotionPageUseCases();
  return uc.execute({ accountId: params.accountId, workspaceId: params.workspaceId });
}

export async function createPage(input: CreatePageInput) {
  const { createPage: uc } = createClientNotionPageUseCases();
  return uc.execute(input);
}

export async function renamePage(pageId: string, title: string) {
  const { renamePage: uc } = createClientNotionPageUseCases();
  return uc.execute(pageId, title);
}

export async function archivePage(pageId: string) {
  const { archivePage: uc } = createClientNotionPageUseCases();
  return uc.execute(pageId);
}

// ── Client-side database helpers ──────────────────────────────────────────────
//
// MUST be called from client components, NOT from Server Actions.

export async function queryDatabases(workspaceId: string) {
  const repo = getDatabaseRepo();
  return repo.findByWorkspaceId(workspaceId);
}

export async function createDatabase(input: CreateDatabaseInput) {
  const { createDatabase: uc } = createClientNotionDatabaseUseCases();
  return uc.execute(input);
}

export async function addDatabaseProperty(databaseId: string, property: DatabaseProperty) {
  const { addProperty: uc } = createClientNotionDatabaseUseCases();
  return uc.execute(databaseId, property);
}
