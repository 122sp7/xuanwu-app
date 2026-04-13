/**
 * Organization infrastructure — adapter factories only.
 *
 * Composition logic (use-case wiring, service facade) has been relocated to
 * interfaces/composition/organization-service.ts to fix the
 * infrastructure → application dependency direction violation.
 *
 * This file is retained for backward compatibility; the composition root
 * is now re-exported through the infrastructure barrel from its new home.
 */

export {
  organizationService,
  organizationQueryService,
  configureOrganizationTeamPortFactory,
} from "../interfaces/composition/organization-service";

