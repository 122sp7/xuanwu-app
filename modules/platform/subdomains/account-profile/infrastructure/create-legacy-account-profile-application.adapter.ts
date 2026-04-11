import {
	createAccountProfile,
	type AccountProfile,
	type AccountProfileId,
	type AccountProfileTheme,
	type UpdateAccountProfileInput,
} from "../domain";
import type {
	AccountProfileCommandRepository,
	AccountProfileQueryRepository,
	Unsubscribe,
} from "../domain";

type LegacyTheme = Partial<AccountProfileTheme> | null | undefined;
type LegacyUpdateProfileInput = {
	name?: string;
	bio?: string;
	photoURL?: string;
	theme?: AccountProfileTheme;
};

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
	updateUserProfile(userId: string, input: LegacyUpdateProfileInput): Promise<void>;
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

/** Read-side adapter: maps legacy data source to AccountProfileQueryRepository. */
class LegacyAccountProfileQueryAdapter implements AccountProfileQueryRepository {
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

/** Write-side adapter: maps legacy data source to AccountProfileCommandRepository. */
class LegacyAccountProfileCommandAdapter implements AccountProfileCommandRepository {
	constructor(
		private readonly legacyDataSource: LegacyAccountProfileDataSource,
	) {}

	async updateAccountProfile(
		actorId: AccountProfileId,
		input: UpdateAccountProfileInput,
	): Promise<void> {
		const legacyInput: LegacyUpdateProfileInput = {
			name: input.displayName,
			bio: input.bio,
			photoURL: input.photoURL,
			theme: input.theme,
		};

		await this.legacyDataSource.updateUserProfile(actorId, legacyInput);
	}
}

export function createLegacyAccountProfileQueryRepository(
	legacyDataSource: LegacyAccountProfileDataSource,
): AccountProfileQueryRepository {
	return new LegacyAccountProfileQueryAdapter(legacyDataSource);
}

export function createLegacyAccountProfileCommandRepository(
	legacyDataSource: LegacyAccountProfileDataSource,
): AccountProfileCommandRepository {
	return new LegacyAccountProfileCommandAdapter(legacyDataSource);
}
