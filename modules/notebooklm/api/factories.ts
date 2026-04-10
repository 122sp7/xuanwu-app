import { FirebaseThreadRepository } from "../infrastructure/firebase/FirebaseThreadRepository";
import { GenkitNotebookRepository } from "../infrastructure/genkit/GenkitNotebookRepository";

export function makeThreadRepo() {
  return new FirebaseThreadRepository();
}

export function makeNotebookRepo() {
  return new GenkitNotebookRepository();
}
