/**
 * @module packages
 * Unique entry point for all package-layer public surfaces.
 *
 * Import everything from this barrel:
 *   import { generateId, Button, firestoreApi } from '@packages'
 *
 * All named exports are flat — no namespace wrapping.
 */

// ─── infra ────────────────────────────────────────────────────────────────────
export * from "./infra/client-state";
export * from "./infra/http";
export * from "./infra/serialization";
export * from "./infra/state";
export * from "./infra/trpc";
export * from "./infra/uuid";
export * from "./infra/zod";

// ─── integration ──────────────────────────────────────────────────────────────
export * from "./integration-ai";
export * from "./integration-firebase";
export * from "./integration-queue";

// ─── ui ───────────────────────────────────────────────────────────────────────
export * from "./ui-components";
export * from "./ui-editor";
export * from "./ui-markdown";
export * from "./ui-shadcn";
export * from "./ui-visualization";
