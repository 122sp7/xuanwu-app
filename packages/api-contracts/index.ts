/**
 * @package api-contracts
 * API contracts, interfaces, and DTOs shared between client and server.
 *
 * This package defines the surface boundary between the client-facing
 * interface layer and the backend application layer.
 *
 * Import via: import { type ApiResponse } from "@api-contracts"
 */

// ─── Generic API response wrapper ─────────────────────────────────────────────

export interface ApiResponse<T = void> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: {
    readonly code: string;
    readonly message: string;
    readonly context?: Record<string, unknown>;
  };
}

export interface ApiListResponse<T> extends ApiResponse<T[]> {
  readonly total: number;
  readonly page: number;
  readonly limit: number;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

// ─── Re-export command result from shared-types ───────────────────────────────
export type { CommandResult, CommandSuccess, CommandFailure, DomainError } from "@shared-types";
