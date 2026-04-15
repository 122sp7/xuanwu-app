import { FirebaseTaskMaterializationBatchJobRepository } from "../infrastructure/repositories/FirebaseTaskMaterializationBatchJobRepository";

export function makeTaskMaterializationBatchJobRepo() {
  return new FirebaseTaskMaterializationBatchJobRepository();
}
