import {
	identityApi,
	register,
	sendPasswordResetEmail,
	signIn,
	signInAnonymously,
	signOut,
} from "@/modules/identity/api";
import type { LegacyIdentityApplicationPort } from "../application";

export function createLegacyIdentityApplicationAdapter(): LegacyIdentityApplicationPort {
	return {
		emitTokenRefreshSignal(input) {
			return identityApi.emitTokenRefreshSignal(input);
		},
		signIn,
		signInAnonymously,
		register,
		sendPasswordResetEmail,
		signOut,
	};
}
