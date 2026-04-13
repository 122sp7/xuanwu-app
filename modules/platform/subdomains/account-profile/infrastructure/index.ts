/**
 * Account-profile infrastructure barrel — adapter exports only.
 *
 * Composition logic lives in interfaces/composition/account-profile-service.ts.
 */
export {
	createLegacyAccountProfileCommandRepository,
	createLegacyAccountProfileQueryRepository,
} from "./create-legacy-account-profile-application.adapter";
export type {
	LegacyAccountProfileDataSource,
} from "./create-legacy-account-profile-application.adapter";