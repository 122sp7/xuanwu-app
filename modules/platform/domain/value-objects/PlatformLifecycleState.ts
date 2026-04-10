/**
 * PlatformLifecycleState — State Value Object
 *
 * Lifecycle state of a PlatformContext aggregate.
 *
 * Values: draft | active | suspended | retired
 *
 * Transition rules:
 *   draft -> active     (context is fully configured and subscription is activated)
 *   active -> suspended (governance action or payment failure)
 *   suspended -> active (issue resolved)
 *   active | suspended -> retired (permanent decommission)
 *
 * @see docs/aggregates.md — 主要識別值與狀態值
 */

// TODO: implement PlatformLifecycleState type and transition guard
