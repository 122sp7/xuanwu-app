import { FirebaseTaskRepository } from "../infrastructure/repositories/FirebaseTaskRepository";

export function makeTaskRepo() {
  return new FirebaseTaskRepository();
}
