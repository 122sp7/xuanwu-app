/**
 * @package skill-core
 * Skill domain — pure types, entity contracts, and repository ports.
 *
 * This package defines the core domain contracts for professional skills
 * and competency management:
 *   - SkillEntity and value types (category, level, proficiency)
 *   - AccountSkillEntity (skill-to-account assignment)
 *   - Repository port interfaces
 *
 * Dependency rule: Zero external dependencies.
 * This package depends only on TypeScript built-ins.
 *
 * Usage:
 *   import type { SkillEntity, SkillCategory } from "@skill-core";
 */

// ── Skill entity ──────────────────────────────────────────────────────────

export type SkillId = string;
export type AccountId = string;

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type SkillCategory =
  | "technical"
  | "management"
  | "communication"
  | "design"
  | "domain"
  | "other";

export interface SkillEntity {
  readonly id: SkillId;
  readonly name: string;
  readonly description?: string;
  readonly category: SkillCategory;
  readonly tags: readonly string[];
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateSkillInput {
  readonly name: string;
  readonly description?: string;
  readonly category: SkillCategory;
  readonly tags?: string[];
}

export interface UpdateSkillInput {
  readonly name?: string;
  readonly description?: string;
  readonly category?: SkillCategory;
  readonly tags?: string[];
}

// ── Account skill assignment ───────────────────────────────────────────────

export interface AccountSkillEntity {
  readonly id: string;
  readonly accountId: AccountId;
  readonly skillId: SkillId;
  readonly level: SkillLevel;
  readonly yearsOfExperience?: number;
  readonly endorsedBy?: readonly AccountId[];
  readonly assignedAtISO: string;
}

export interface AssignSkillToAccountInput {
  readonly accountId: AccountId;
  readonly skillId: SkillId;
  readonly level: SkillLevel;
  readonly yearsOfExperience?: number;
}

// ── Repository ports ──────────────────────────────────────────────────────

export interface SkillRepository {
  create(input: CreateSkillInput): Promise<SkillEntity>;
  update(skillId: SkillId, input: UpdateSkillInput): Promise<SkillEntity | null>;
  delete(skillId: SkillId): Promise<void>;
  findById(skillId: SkillId): Promise<SkillEntity | null>;
  findByCategory(category: SkillCategory): Promise<SkillEntity[]>;
  findAll(): Promise<SkillEntity[]>;
}

export interface AccountSkillRepository {
  assign(input: AssignSkillToAccountInput): Promise<AccountSkillEntity>;
  revoke(accountId: AccountId, skillId: SkillId): Promise<void>;
  findByAccount(accountId: AccountId): Promise<AccountSkillEntity[]>;
  findBySkill(skillId: SkillId): Promise<AccountSkillEntity[]>;
}
