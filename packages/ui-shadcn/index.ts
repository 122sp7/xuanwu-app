/**
 * @package ui-shadcn
 * shadcn/ui component library — the single import path for all shadcn primitives.
 *
 * This package re-exports all shadcn UI components from the internal
 * ui/shadcn/ui directory. Use this package instead of importing from
 * "@/ui/shadcn/ui/..." directly.
 *
 * All components are "use client" compatible unless otherwise noted.
 *
 * Usage:
 *   import { Button, Dialog, Input } from "@ui-shadcn";
 */

// ── Layout & Structure ────────────────────────────────────────────────────
export * from "@/ui/shadcn/ui/accordion";
export * from "@/ui/shadcn/ui/aspect-ratio";
export * from "@/ui/shadcn/ui/card";
export * from "@/ui/shadcn/ui/collapsible";
export * from "@/ui/shadcn/ui/separator";
export * from "@/ui/shadcn/ui/sidebar";
export * from "@/ui/shadcn/ui/tabs";
export * from "@/ui/shadcn/ui/scroll-area";

// ── Feedback & Overlays ───────────────────────────────────────────────────
export * from "@/ui/shadcn/ui/alert";
export * from "@/ui/shadcn/ui/alert-dialog";
export * from "@/ui/shadcn/ui/dialog";
export * from "@/ui/shadcn/ui/drawer";
export * from "@/ui/shadcn/ui/hover-card";
export * from "@/ui/shadcn/ui/popover";
export * from "@/ui/shadcn/ui/sheet";
export * from "@/ui/shadcn/ui/tooltip";
export * from "@/ui/shadcn/ui/sonner";

// ── Navigation ────────────────────────────────────────────────────────────
export * from "@/ui/shadcn/ui/breadcrumb";
export * from "@/ui/shadcn/ui/dropdown-menu";
export * from "@/ui/shadcn/ui/menubar";
export * from "@/ui/shadcn/ui/navigation-menu";
export * from "@/ui/shadcn/ui/pagination";
export * from "@/ui/shadcn/ui/context-menu";
export * from "@/ui/shadcn/ui/command";

// ── Forms & Inputs ────────────────────────────────────────────────────────
export * from "@/ui/shadcn/ui/button";
export * from "@/ui/shadcn/ui/calendar";
export * from "@/ui/shadcn/ui/checkbox";
export * from "@/ui/shadcn/ui/input";
export * from "@/ui/shadcn/ui/input-group";
export * from "@/ui/shadcn/ui/input-otp";
export * from "@/ui/shadcn/ui/label";
export * from "@/ui/shadcn/ui/radio-group";
export * from "@/ui/shadcn/ui/select";
export * from "@/ui/shadcn/ui/slider";
export * from "@/ui/shadcn/ui/switch";
export * from "@/ui/shadcn/ui/textarea";
export * from "@/ui/shadcn/ui/toggle";
export * from "@/ui/shadcn/ui/toggle-group";

// ── Display ───────────────────────────────────────────────────────────────
export * from "@/ui/shadcn/ui/avatar";
export * from "@/ui/shadcn/ui/badge";
export * from "@/ui/shadcn/ui/carousel";
export * from "@/ui/shadcn/ui/chart";
export * from "@/ui/shadcn/ui/kbd";
export * from "@/ui/shadcn/ui/progress";
export * from "@/ui/shadcn/ui/skeleton";
export * from "@/ui/shadcn/ui/spinner";
export * from "@/ui/shadcn/ui/table";

// ── Hooks ─────────────────────────────────────────────────────────────────
export * from "@/ui/shadcn/hooks/use-mobile";
export * from "@/ui/shadcn/hooks/use-toast";

// ── Utilities ─────────────────────────────────────────────────────────────
// cn() — class-name merging utility (clsx + tailwind-merge)
export { cn } from "@/libs/utils";
