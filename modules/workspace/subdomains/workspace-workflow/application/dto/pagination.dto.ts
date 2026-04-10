/**
 * @module workspace-flow/application/dto
 * @file pagination.dto.ts
 * @description Shared pagination request / response DTOs for workspace-flow list queries.
 * @author workspace-flow
 * @since 2026-03-24
 */

export interface PaginationDto {
  /** 1-based page number. Defaults to 1. */
  readonly page?: number;
  /** Items per page. Defaults to 20. */
  readonly pageSize?: number;
}

export interface PagedResult<T> {
  readonly items: T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly hasMore: boolean;
}
 
