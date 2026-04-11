/**
 * Public API boundary for the account-profile subdomain.
 * Cross-module consumers must import through this entry point.
 */

export * from "../application";
export * from "../infrastructure";
export { getUserProfile, subscribeToUserProfile } from "../../account/api";
