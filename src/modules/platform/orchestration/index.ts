import {
  InMemoryBackgroundJobRepository,
} from "../subdomains/background-job/adapters/outbound";
import {
  RegisterJobDocumentUseCase,
  AdvanceJobStageUseCase,
  ListWorkspaceJobsUseCase,
  type RegisterJobDocumentInput,
  type AdvanceJobStageInput,
  type ListWorkspaceJobsInput,
  type JobResult,
} from "../subdomains/background-job/application";
import type { BackgroundJob } from "../subdomains/background-job/domain";

export class PlatformFacade {
  private readonly backgroundJobRepo = new InMemoryBackgroundJobRepository();

  registerBackgroundJob(input: RegisterJobDocumentInput): Promise<JobResult<BackgroundJob>> {
    return new RegisterJobDocumentUseCase(this.backgroundJobRepo).execute(input);
  }

  advanceBackgroundJob(input: AdvanceJobStageInput): Promise<JobResult<BackgroundJob>> {
    return new AdvanceJobStageUseCase(this.backgroundJobRepo).execute(input);
  }

  listWorkspaceBackgroundJobs(input: ListWorkspaceJobsInput): Promise<readonly BackgroundJob[]> {
    return new ListWorkspaceJobsUseCase(this.backgroundJobRepo).execute(input);
  }
}
