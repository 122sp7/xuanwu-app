import {
  CreateDatabaseUseCase,
  UpdateDatabaseUseCase,
  AddFieldUseCase,
  ArchiveDatabaseUseCase,
  GetDatabaseUseCase,
  ListDatabasesUseCase,
  CreateRecordUseCase,
  UpdateRecordUseCase,
  DeleteRecordUseCase,
  ListRecordsUseCase,
  CreateViewUseCase,
  UpdateViewUseCase,
  DeleteViewUseCase,
  ListViewsUseCase,
  CreateAutomationUseCase,
  UpdateAutomationUseCase,
  DeleteAutomationUseCase,
  ListAutomationsUseCase,
} from "../../../subdomains/database/application/use-cases";
import type { DatabaseRepository } from "../../../subdomains/database/domain/repositories/DatabaseRepository";
import type { DatabaseRecordRepository } from "../../../subdomains/database/domain/repositories/DatabaseRecordRepository";
import type { ViewRepository } from "../../../subdomains/database/domain/repositories/ViewRepository";
import type { AutomationRepository } from "../../../subdomains/database/domain/repositories/AutomationRepository";
import { makeDatabaseRepo, makeRecordRepo, makeViewRepo, makeAutomationRepo } from "./repositories";

export interface DatabaseUseCases {
  readonly createDatabase: CreateDatabaseUseCase;
  readonly updateDatabase: UpdateDatabaseUseCase;
  readonly addField: AddFieldUseCase;
  readonly archiveDatabase: ArchiveDatabaseUseCase;
  readonly getDatabase: GetDatabaseUseCase;
  readonly listDatabases: ListDatabasesUseCase;
  readonly createRecord: CreateRecordUseCase;
  readonly updateRecord: UpdateRecordUseCase;
  readonly deleteRecord: DeleteRecordUseCase;
  readonly listRecords: ListRecordsUseCase;
  readonly createView: CreateViewUseCase;
  readonly updateView: UpdateViewUseCase;
  readonly deleteView: DeleteViewUseCase;
  readonly listViews: ListViewsUseCase;
  readonly createAutomation: CreateAutomationUseCase;
  readonly updateAutomation: UpdateAutomationUseCase;
  readonly deleteAutomation: DeleteAutomationUseCase;
  readonly listAutomations: ListAutomationsUseCase;
}

export function makeDatabaseUseCases(
  databaseRepo: DatabaseRepository = makeDatabaseRepo(),
  recordRepo: DatabaseRecordRepository = makeRecordRepo(),
  viewRepo: ViewRepository = makeViewRepo(),
  automationRepo: AutomationRepository = makeAutomationRepo(),
): DatabaseUseCases {
  return {
    createDatabase: new CreateDatabaseUseCase(databaseRepo),
    updateDatabase: new UpdateDatabaseUseCase(databaseRepo),
    addField: new AddFieldUseCase(databaseRepo),
    archiveDatabase: new ArchiveDatabaseUseCase(databaseRepo),
    getDatabase: new GetDatabaseUseCase(databaseRepo),
    listDatabases: new ListDatabasesUseCase(databaseRepo),
    createRecord: new CreateRecordUseCase(recordRepo),
    updateRecord: new UpdateRecordUseCase(recordRepo),
    deleteRecord: new DeleteRecordUseCase(recordRepo),
    listRecords: new ListRecordsUseCase(recordRepo),
    createView: new CreateViewUseCase(viewRepo),
    updateView: new UpdateViewUseCase(viewRepo),
    deleteView: new DeleteViewUseCase(viewRepo),
    listViews: new ListViewsUseCase(viewRepo),
    createAutomation: new CreateAutomationUseCase(automationRepo),
    updateAutomation: new UpdateAutomationUseCase(automationRepo),
    deleteAutomation: new DeleteAutomationUseCase(automationRepo),
    listAutomations: new ListAutomationsUseCase(automationRepo),
  };
}
