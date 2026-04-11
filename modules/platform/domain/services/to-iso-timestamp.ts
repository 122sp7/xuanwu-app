/**
 * toIsoTimestamp — convert a Date or Unix ms timestamp to an ISO 8601 string.
 *
 * All `occurredAt` and `publishedAt` fields in the platform domain must use
 * ISO 8601 strings, never Date objects, to ensure safe serialisation across
 * the server/client boundary.  This is a domain-level invariant.
 *
 * @see instructions — occurredAt must be ISO string (not Date)
 */
export function toIsoTimestamp(value: Date | number): string {
	const date = typeof value === "number" ? new Date(value) : value;
	return date.toISOString();
}
