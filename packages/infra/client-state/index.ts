/**
 * @module infra/client-state
 * Client-side state primitives without business semantics.
 */

export type ClientStateUpdater<T extends object> =
  | Partial<T>
  | ((previousState: T) => Partial<T>);

export const updateClientState = <T extends object>(
  previousState: T,
  updater: ClientStateUpdater<T>,
): T => {
  const partial = typeof updater === "function" ? updater(previousState) : updater;

  return {
    ...previousState,
    ...partial,
  };
};

export const cloneClientState = <T>(state: T): T => {
  if (typeof globalThis.structuredClone === "function") {
    return globalThis.structuredClone(state);
  }

  return JSON.parse(JSON.stringify(state)) as T;
};
