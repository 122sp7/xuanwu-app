import { FirebaseAutomationRepository } from "../../../infrastructure/knowledge-database/firebase/FirebaseAutomationRepository";
import { FirebaseDatabaseRecordRepository } from "../../../infrastructure/knowledge-database/firebase/FirebaseDatabaseRecordRepository";
import { FirebaseDatabaseRepository } from "../../../infrastructure/knowledge-database/firebase/FirebaseDatabaseRepository";
import { FirebaseViewRepository } from "../../../infrastructure/knowledge-database/firebase/FirebaseViewRepository";

export function makeDatabaseRepo() {
  return new FirebaseDatabaseRepository();
}

export function makeRecordRepo() {
  return new FirebaseDatabaseRecordRepository();
}

export function makeViewRepo() {
  return new FirebaseViewRepository();
}

export function makeAutomationRepo() {
  return new FirebaseAutomationRepository();
}
