export const SKILL_LEVELS = ["junior", "mid", "senior"] as const;
export type SkillLevel = (typeof SKILL_LEVELS)[number];

export interface Skill {
  readonly skillId: string;
  readonly level: SkillLevel;
}

export interface Capability {
  readonly capabilityId: string;
  readonly scope: string;
  readonly qualificationLevel?: string;
}

export interface SkillRequirement {
  readonly skillId: string;
  readonly minLevel: SkillLevel;
  readonly requiredHeadcount: number;
}

export interface CapabilityRequirement {
  readonly capabilityId: string;
  readonly required: boolean;
}
