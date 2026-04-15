import { FirebaseIssueRepository } from "../infrastructure/repositories/FirebaseIssueRepository";

export function makeIssueRepo() {
  return new FirebaseIssueRepository();
}
