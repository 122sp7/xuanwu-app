import {
	identityApi,
	register,
	sendPasswordResetEmail,
	signIn,
	signInAnonymously,
	signOut,
} from "@/modules/identity/api";

/**
 * Temporary compatibility port during migration from modules/identity.
 *
 * NOTE:
 * - This port preserves existing behaviors while platform subdomain
 *   implementations are incrementally introduced.
 * - The final target is platform-native use case handlers behind platform/api.
 */
export interface LegacyIdentityApplicationPort {
	emitTokenRefreshSignal: typeof identityApi.emitTokenRefreshSignal;
	signIn: typeof signIn;
	signInAnonymously: typeof signInAnonymously;
	register: typeof register;
	sendPasswordResetEmail: typeof sendPasswordResetEmail;
	signOut: typeof signOut;
}
