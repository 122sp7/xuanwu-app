// platform-config — domain layer
// Owns shell navigation configuration: route contexts, nav sections, breadcrumbs.

export interface NavConfigEntry {
  readonly id: string;
  readonly label: string;
  readonly href: string;
}

export interface PlatformNavSection {
  readonly sectionId: string;
  readonly label: string;
  readonly items: readonly NavConfigEntry[];
}

export interface PlatformConfigRepository {
  getNavSections(): Promise<readonly PlatformNavSection[]>;
}
