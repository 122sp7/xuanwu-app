/**
 * Module: workspace-planner
 * Layer: api/barrel
 * Purpose: Public anti-corruption layer for the WorkDemand API contract.
 *
 * Other modules and UI layers import schemas and types from here.
 * Direct imports into domain/, application/, or infrastructure/ are forbidden.
 */

export {
  CreateDemandSchema,
  AssignMemberSchema,
} from "./schema";

export type {
  CreateDemandInput,
  AssignMemberInput,
} from "./schema";
