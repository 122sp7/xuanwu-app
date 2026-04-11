import {
	createAccountProfile,
	type AccountProfile,
	type AccountProfileId,
	type AccountProfileTheme,
} from "../domain";
import type {
	AccountProfileQueryRepository,
	Unsubscribe,
} from "../domain";

type LegacyTheme = Partial<AccountProfileTheme> | null | undefined;

type LegacyAccountProfileRecord = {
	id: string;
	name?: string | null;
	email?: string | null;
	photoURL?: string | null;
	bio?: string | null;
	theme?: LegacyTheme;
} | null;

export interface LegacyAccountProfileDataSource {
	getUserProfile(userId: string): Promise<LegacyAccountProfileRecord>;
	subscribeToUserProfile(
		userId: string,
		onUpdate: (profile: LegacyAccountProfileRecord) => void,
	): Unsubscribe;
}

function normalizeTheme(theme: LegacyTheme): AccountProfileTheme | undefined {
	if (!theme?.primary || !theme?.background || !theme?.accent) {
		return undefined;
	}

	return {
		primary: theme.primary,
		background: theme.background,
		accent: theme.accent,
	};
}

function mapLegacyProfile(record: LegacyAccountProfileRecord): AccountProfile | null {
	if (!record) {
		return null;
	}

	const displayName = (record.name ?? "").trim() || "Unknown Actor";

	return createAccountProfile({
		id: record.id as AccountProfileId,
		displayName,
		email: record.email ?? undefined,
		photoURL: record.photoURL ?? undefined,
		bio: record.bio ?? undefined,
		theme: normalizeTheme(record.theme),
	});
}

class LegacyAccountProfileQueryRepository
	implements AccountProfileQueryRepository {
	constructor(
		private readonly legacyDataSource: LegacyAccountProfileDataSource,
	) {}

	async getAccountProfile(
		actorId: AccountProfileId,
	): Promise<AccountProfile | null> {
		const profile = await this.legacyDataSource.getUserProfile(actorId);
		return mapLegacyProfile(profile);
	}

	subscribeToAccountProfile(
		actorId: AccountProfileId,
		onUpdate: (profile: AccountProfile | null) => void,
	): Unsubscribe {
		return this.legacyDataSource.subscribeToUserProfile(actorId, (profile) => {
			onUpdate(mapLegacyProfile(profile));
		});
	}
}

export function createLegacyAccountProfileQueryRepository(
	legacyDataSource: LegacyAccountProfileDataSource,
): AccountProfileQueryRepository {
	return new LegacyAccountProfileQueryRepository(legacyDataSource);
}
