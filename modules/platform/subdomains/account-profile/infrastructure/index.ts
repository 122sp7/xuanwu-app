export {
	createLegacyAccountProfileCommandRepository,
	createLegacyAccountProfileQueryRepository,
} from "./create-legacy-account-profile-application.adapter";
export type {
	LegacyAccountProfileDataSource,
} from "./create-legacy-account-profile-application.adapter";
export {
	getAccountProfile as getAccountProfileFromService,
	subscribeToAccountProfile as subscribeToAccountProfileFromService,
	updateAccountProfile as updateAccountProfileFromService,
	configureLegacyAccountProfileDataSource,
} from "./account-profile-service";