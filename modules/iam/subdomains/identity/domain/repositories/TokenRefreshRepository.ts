import type { TokenRefreshSignal } from "../entities/TokenRefreshSignal";

export interface TokenRefreshRepository {
	emit(signal: TokenRefreshSignal): Promise<void>;
	subscribe(accountId: string, onSignal: () => void): () => void;
}
