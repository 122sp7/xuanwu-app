import { FirebaseInvoiceRepository } from "../infrastructure/repositories/FirebaseInvoiceRepository";
import { FirebaseIssueRepository } from "../infrastructure/repositories/FirebaseIssueRepository";
import { FirebaseTaskRepository } from "../infrastructure/repositories/FirebaseTaskRepository";

export function makeTaskRepo() {
  return new FirebaseTaskRepository();
}

export function makeIssueRepo() {
  return new FirebaseIssueRepository();
}

export function makeInvoiceRepo() {
  return new FirebaseInvoiceRepository();
}
