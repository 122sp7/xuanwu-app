import { FirebaseAutomationRepository } from "../infrastructure/firebase/FirebaseAutomationRepository";
import { FirebaseDatabaseRecordRepository } from "../infrastructure/firebase/FirebaseDatabaseRecordRepository";
import { FirebaseDatabaseRepository } from "../infrastructure/firebase/FirebaseDatabaseRepository";
import { FirebaseViewRepository } from "../infrastructure/firebase/FirebaseViewRepository";

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
