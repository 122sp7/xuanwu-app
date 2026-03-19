/**
 * @module lib/vis/network
 * Thin wrapper for vis-network.
 *
 * vis-network provides interactive visualization of network graphs with nodes,
 * edges, physics simulation, and extensive customization options.
 *
 * Usage:
 *   import { Network } from "@/lib/vis/network";
 *   const network = new Network(container, data, options);
 */

export { Network } from "vis-network/esnext";
export * from "vis-network/esnext/types";

export type NetworkOptions = InstanceType<typeof Network> extends { setOptions(opts: infer T): void } ? T : never;
