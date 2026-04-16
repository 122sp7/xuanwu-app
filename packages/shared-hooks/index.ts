/**
 * @deprecated This package has been cleaned of misplaced business logic.
 *
 * Previously housed `useAppStore` (Zustand store), which belongs in
 * `src/modules/platform/adapters/inbound/react/` per architecture rules.
 *
 * Discussion 07: packages/* must remain independent of application modules
 * and must not contain business logic.
 *
 * If you need a shared loading indicator store, scope it to the module
 * that owns the loading concern, not to a shared package.
 */

// No exports — this package is a stub pending removal or repurposing.
export {};
