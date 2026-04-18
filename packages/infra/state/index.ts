/**
 * @module infra/state
 * State management primitives for local stores and machines.
 */

export { createStore, type StoreApi } from "zustand/vanilla";
export { createMachine } from "xstate";

import type { StoreApi } from "zustand/vanilla";

export const replaceStoreState = <T>(store: StoreApi<T>, nextState: T): void => {
  store.setState(nextState, true);
};
