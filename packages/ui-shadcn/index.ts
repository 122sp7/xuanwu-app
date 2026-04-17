/**
 * @package ui-shadcn
 * shadcn/ui component library — public barrel export.
 *
 * All UI primitives are re-exported from this package.
 * Internal components use relative imports; external consumers use @ui-shadcn.
 */

// ─── Utility ──────────────────────────────────────────────────────────────────
export { cn } from "./lib/utils";

// ─── Hooks ────────────────────────────────────────────────────────────────────
export { useIsMobile } from "./hooks/use-mobile";

// ─── Provider ─────────────────────────────────────────────────────────────────
export { ThemeProvider } from "./provider/theme-provider";