import { GenkitNotebookRepository } from "../infrastructure/genkit/GenkitNotebookRepository";

export function makeNotebookRepo() {
  return new GenkitNotebookRepository();
}
