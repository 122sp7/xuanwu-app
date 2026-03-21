import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";

import type {
  CreateWorkspaceQualityCheckInput,
  UpdateWorkspaceQualityCheckInput,
  WorkspaceQualityCheckEntity,
} from "../../domain/entities/QualityCheck";
import type { QualityCheckRepository } from "../../domain/repositories/QualityCheckRepository";

export class CreateWorkspaceQualityCheckUseCase {
  constructor(private readonly qualityCheckRepository: QualityCheckRepository) {}

  async execute(input: CreateWorkspaceQualityCheckInput): Promise<CommandResult> {
    const workspaceId = input.workspaceId.trim();
    const label = input.label.trim();

    if (!workspaceId) {
      return commandFailureFrom("QA_WORKSPACE_REQUIRED", "Workspace is required.");
    }

    if (!label) {
      return commandFailureFrom("QA_LABEL_REQUIRED", "QA label is required.");
    }

    const qualityCheck = await this.qualityCheckRepository.create({
      ...input,
      workspaceId,
      label,
    });

    return commandSuccess(qualityCheck.id, Date.now());
  }
}

export class UpdateWorkspaceQualityCheckUseCase {
  constructor(private readonly qualityCheckRepository: QualityCheckRepository) {}

  async execute(qualityCheckId: string, input: UpdateWorkspaceQualityCheckInput): Promise<CommandResult> {
    const normalizedQualityCheckId = qualityCheckId.trim();
    if (!normalizedQualityCheckId) {
      return commandFailureFrom("QA_ID_REQUIRED", "Quality check id is required.");
    }

    const nextLabel = typeof input.label === "string" ? input.label.trim() : undefined;
    if (typeof nextLabel === "string" && !nextLabel) {
      return commandFailureFrom("QA_LABEL_REQUIRED", "QA label is required.");
    }

    const updatedQualityCheck = await this.qualityCheckRepository.update(normalizedQualityCheckId, {
      ...input,
      ...(typeof nextLabel === "string" ? { label: nextLabel } : {}),
    });

    if (!updatedQualityCheck) {
      return commandFailureFrom("QA_NOT_FOUND", "Quality check not found.");
    }

    return commandSuccess(updatedQualityCheck.id, Date.now());
  }
}

export class DeleteWorkspaceQualityCheckUseCase {
  constructor(private readonly qualityCheckRepository: QualityCheckRepository) {}

  async execute(qualityCheckId: string): Promise<CommandResult> {
    const normalizedQualityCheckId = qualityCheckId.trim();
    if (!normalizedQualityCheckId) {
      return commandFailureFrom("QA_ID_REQUIRED", "Quality check id is required.");
    }

    await this.qualityCheckRepository.delete(normalizedQualityCheckId);
    return commandSuccess(normalizedQualityCheckId, Date.now());
  }
}

export class ListWorkspaceQualityChecksUseCase {
  constructor(private readonly qualityCheckRepository: QualityCheckRepository) {}

  async execute(workspaceId: string): Promise<WorkspaceQualityCheckEntity[]> {
    const normalizedWorkspaceId = workspaceId.trim();
    if (!normalizedWorkspaceId) {
      return [];
    }

    return this.qualityCheckRepository.findByWorkspaceId(normalizedWorkspaceId);
  }
}
