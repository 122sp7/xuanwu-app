import type { WorkspaceLocationCatalog } from "./WorkspaceLocation";

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

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  details?: string;
}

export interface WorkspaceOperationalProfile extends WorkspaceLocationCatalog {
  address?: Address;
  personnel?: WorkspacePersonnel;
}