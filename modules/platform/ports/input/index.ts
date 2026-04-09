/**
 * platform input ports.
 */

import type { PlatformCommand, PlatformCommandResult, PlatformQuery } from "../../application/dtos";
import type { PlatformDomainEvent } from "../../domain/events";

export interface PlatformCommandPort {
	executeCommand<TCommand extends PlatformCommand>(command: TCommand): Promise<PlatformCommandResult>;
}

export interface PlatformQueryPort {
	executeQuery<TResult, TQuery extends PlatformQuery>(query: TQuery): Promise<TResult>;
}

export interface PlatformEventIngressPort {
	ingestEvent(event: PlatformDomainEvent): Promise<void>;
}