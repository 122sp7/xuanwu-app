import type { IssueRepository } from "../../../domain/repositories/IssueRepository";
import { OpenIssueUseCase, TransitionIssueStatusUseCase } from "../../../application/use-cases/IssueUseCases";

export class IssueController {
  private readonly openIssue: OpenIssueUseCase;
  private readonly transitionIssue: TransitionIssueStatusUseCase;

  constructor(issueRepo: IssueRepository) {
    this.openIssue = new OpenIssueUseCase(issueRepo);
    this.transitionIssue = new TransitionIssueStatusUseCase(issueRepo);
  }
}
