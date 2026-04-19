/**
 * @module infra/form
 * Headless form state management via TanStack Form v1.
 *
 * useForm — main hook for form state; use in interfaces layer with "use client".
 * createFormHook / createFormHookContexts — composition pattern for reusable
 *   custom field components injected with field context.
 * formOptions — defines shared defaultValues and validators (safe for shared config).
 * mergeForm — merges server-state into client form (for server-side initial data).
 *
 * Alias: @infra/form
 */

// ─── Core Hooks ───────────────────────────────────────────────────────────────

export { useForm } from "@tanstack/react-form";
export { useField } from "@tanstack/react-form";
export { useStore } from "@tanstack/react-form";

// ─── Composition Factory ──────────────────────────────────────────────────────

export { createFormHook, createFormHookContexts } from "@tanstack/react-form";

// ─── Options Helpers ──────────────────────────────────────────────────────────

export { formOptions } from "@tanstack/react-form";
export { mergeForm } from "@tanstack/react-form";

// ─── Types ────────────────────────────────────────────────────────────────────

export type {
  FormApi,
  FieldApi,
  FieldMeta,
  FormState,
  ValidationError,
  FormOptions,
  FieldOptions,
  UseFieldOptions,
  FormValidateOrFn,
  FieldValidateOrFn,
} from "@tanstack/react-form";
