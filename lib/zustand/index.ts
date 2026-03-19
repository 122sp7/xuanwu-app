/**
 * @module lib/zustand
 * Thin wrapper for Zustand v5 state management.
 *
 * Provides a single import path for creating React stores, vanilla stores,
 * and middleware (persist, devtools, immer).  The React hook (`create`) must
 * only be used inside Client Components; the vanilla `createStore` is safe on
 * the server.
 *
 * Usage — React store (requires "use client"):
 *   import { create } from "@/lib/zustand";
 *
 *   const useCounter = create<{ count: number; inc: () => void }>((set) => ({
 *     count: 0,
 *     inc: () => set((s) => ({ count: s.count + 1 })),
 *   }));
 *
 * Usage — with persist middleware:
 *   import { create, persist, createJSONStorage } from "@/lib/zustand";
 *
 *   const useStore = create(persist((set) => ({ … }), {
 *     name: "my-store",
 *     storage: createJSONStorage(() => sessionStorage),
 *   }));
 *
 * Usage — vanilla store (server-safe):
 *   import { createStore, useStore } from "@/lib/zustand";
 *   const store = createStore<State>()((set) => ({ … }));
 */

// ── Core ───────────────────────────────────────────────────────────────────
export { create, createStore, useStore } from "zustand";

// ── Middleware ─────────────────────────────────────────────────────────────
export {
  combine,
  createJSONStorage,
  devtools,
  persist,
  redux,
  subscribeWithSelector,
} from "zustand/middleware";

// ── Types ──────────────────────────────────────────────────────────────────
export type { StoreApi, UseBoundStore, StateCreator, StoreMutatorIdentifier } from "zustand";
