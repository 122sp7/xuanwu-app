import { v4 as uuid } from "@lib-uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { ApiKeyRepository } from "../../domain/repositories/ApiKeyRepository";
import { ApiKey } from "../../domain/entities/ApiKey";

export class GenerateApiKeyUseCase {
  constructor(private readonly keyRepo: ApiKeyRepository) {}

  async execute(workspaceId: string, actorId: string, label: string, expiresAtISO?: string): Promise<CommandResult> {
    try {
      const keyId = uuid();
      const rawKey = uuid().replace(/-/g, "");
      const keyPrefix = rawKey.substring(0, 8);
      const keyHash = `hash_${rawKey}`;
      const key = ApiKey.create(keyId, { workspaceId, actorId, label, keyPrefix, keyHash, expiresAtISO });
      await this.keyRepo.save(key.getSnapshot());
      return commandSuccess(key.id, Date.now());
    } catch (err) {
      return commandFailureFrom("API_KEY_GENERATE_FAILED", err instanceof Error ? err.message : "Failed to generate API key.");
    }
  }
}

export class RevokeApiKeyUseCase {
  constructor(private readonly keyRepo: ApiKeyRepository) {}

  async execute(keyId: string): Promise<CommandResult> {
    try {
      const snapshot = await this.keyRepo.findById(keyId);
      if (!snapshot) return commandFailureFrom("API_KEY_NOT_FOUND", "API key not found.");
      const key = ApiKey.reconstitute(snapshot);
      key.revoke();
      await this.keyRepo.save(key.getSnapshot());
      return commandSuccess(keyId, Date.now());
    } catch (err) {
      return commandFailureFrom("API_KEY_REVOKE_FAILED", err instanceof Error ? err.message : "Failed to revoke API key.");
    }
  }
}
