import { FirestoreTaskFormationJobRepository } from "../../subdomains/task-formation/adapters/outbound/firestore/FirestoreTaskFormationJobRepository";
import { GenkitTaskCandidateExtractor } from "../../subdomains/task-formation/adapters/outbound/genkit/GenkitTaskCandidateExtractor";
import {
  ExtractTaskCandidatesUseCase,
  ConfirmCandidatesUseCase,
} from "../../subdomains/task-formation/application/use-cases/TaskFormationUseCases";
import { FirestoreTaskRepository } from "../../subdomains/task/adapters/outbound/firestore/FirestoreTaskRepository";
import { CreateTaskUseCase } from "../../subdomains/task/application/use-cases/TaskUseCases";
import { createFirestoreLikeAdapter } from "./firebase-composition";

export function createServerTaskFormationUseCasesWithGenkit() {
  const db = createFirestoreLikeAdapter();
  const jobRepo = new FirestoreTaskFormationJobRepository(db);
  const taskRepo = new FirestoreTaskRepository(db);
  const createTaskUseCase = new CreateTaskUseCase(taskRepo);
  const extractor = new GenkitTaskCandidateExtractor();
  return {
    extractTaskCandidates: new ExtractTaskCandidatesUseCase(jobRepo, extractor),
    confirmCandidates: new ConfirmCandidatesUseCase(jobRepo, {
      createTask: (input) => createTaskUseCase.execute(input),
    }),
    getJobSnapshot: (jobId: string) => jobRepo.findById(jobId),
  };
}
