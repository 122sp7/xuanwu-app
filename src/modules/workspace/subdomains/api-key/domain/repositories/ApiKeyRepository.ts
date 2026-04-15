import type { ApiKeySnapshot } from "../entities/ApiKey";

export interface ApiKeyRepository {
  findById(keyId: string): Promise<ApiKeySnapshot | null>;
  findByWorkspaceId(workspaceId: string): Promise<ApiKeySnapshot[]>;
  findByHash(keyHash: string): Promise<ApiKeySnapshot | null>;
  save(key: ApiKeySnapshot): Promise<void>;
  revoke(keyId: string, nowISO: string): Promise<void>;
}
