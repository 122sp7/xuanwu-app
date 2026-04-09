import { firebaseClientApp } from "@integration-firebase/client";
import {
	createUserWithEmailAndPassword as fbCreateUser,
	getAuth,
	sendPasswordResetEmail as fbSendPasswordResetEmail,
	signInAnonymously as fbSignInAnonymously,
	signInWithEmailAndPassword as fbSignIn,
	signOut as fbSignOut,
	type User,
	updateProfile,
} from "firebase/auth";
import type { IdentityEntity, IdentityRepository, RegistrationInput, SignInCredentials } from "../../domain";

function toIdentityEntity(user: User): IdentityEntity {
	return {
		uid: user.uid,
		email: user.email,
		displayName: user.displayName,
		photoURL: user.photoURL,
		isAnonymous: user.isAnonymous,
		emailVerified: user.emailVerified,
	};
}

export class FirebaseIdentityRepository implements IdentityRepository {
	private get auth() {
		return getAuth(firebaseClientApp);
	}

	async signInWithEmailAndPassword(credentials: SignInCredentials): Promise<IdentityEntity> {
		const result = await fbSignIn(this.auth, credentials.email, credentials.password);
		return toIdentityEntity(result.user);
	}

	async signInAnonymously(): Promise<IdentityEntity> {
		const result = await fbSignInAnonymously(this.auth);
		return toIdentityEntity(result.user);
	}

	async createUserWithEmailAndPassword(input: RegistrationInput): Promise<IdentityEntity> {
		const result = await fbCreateUser(this.auth, input.email, input.password);
		return toIdentityEntity(result.user);
	}

	async updateDisplayName(uid: string, displayName: string): Promise<void> {
		const currentUser = this.auth.currentUser;
		if (currentUser && currentUser.uid === uid) {
			await updateProfile(currentUser, { displayName });
		}
	}

	async sendPasswordResetEmail(email: string): Promise<void> {
		await fbSendPasswordResetEmail(this.auth, email);
	}

	async signOut(): Promise<void> {
		await fbSignOut(this.auth);
	}

	getCurrentUser(): IdentityEntity | null {
		const user = this.auth.currentUser;
		return user ? toIdentityEntity(user) : null;
	}
}
