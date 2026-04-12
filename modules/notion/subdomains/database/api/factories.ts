import { FirebaseAutomationRepository } from "../../../infrastructure/database/firebase/FirebaseAutomationRepository";
import { FirebaseDatabaseRecordRepository } from "../../../infrastructure/database/firebase/FirebaseDatabaseRecordRepository";
import { FirebaseDatabaseRepository } from "../../../infrastructure/database/firebase/FirebaseDatabaseRepository";
import { FirebaseViewRepository } from "../../../infrastructure/database/firebase/FirebaseViewRepository";

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
