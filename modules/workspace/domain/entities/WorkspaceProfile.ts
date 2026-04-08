import type { WorkspaceLocationCatalog } from "./WorkspaceLocation";
import type { Address } from "../value-objects/Address";

export interface WorkspacePersonnel {
  managerId?: string;
  supervisorId?: string;
  safetyOfficerId?: string;
  customRoles?: WorkspacePersonnelCustomRole[];
}

export interface WorkspacePersonnelCustomRole {
  roleId: string;
  roleName: string;
  role: string;
}

export interface WorkspaceOperationalProfile extends WorkspaceLocationCatalog {
  address?: Address;
  personnel?: WorkspacePersonnel;
}

export type { Address, AddressInput } from "../value-objects/Address";