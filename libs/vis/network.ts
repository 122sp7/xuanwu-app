/**
 * @module libs/vis/network
 * Thin wrapper for vis-network.
 *
 * vis-network provides interactive visualization of network graphs with nodes,
 * edges, physics simulation, and extensive customization options.
 *
 * Usage:
 *   import { Network } from "@/libs/vis/network";
 *   const network = new Network(container, data, options);
 */

import * as VisNetworkNamespace from "vis-network";

export { Network } from "vis-network";
export * from "vis-network";

const visNetworkRuntime = VisNetworkNamespace as unknown as {
  NetworkImages?: unknown;
  networkDOTParser?: unknown;
  parseDOTNetwork?: unknown;
  parseGephiNetwork?: unknown;
  networkGephiParser?: unknown;
  networkOptions?: unknown;
};

export const NetworkImages = visNetworkRuntime.NetworkImages;
export const networkDOTParser = visNetworkRuntime.networkDOTParser;
export const parseDOTNetwork = visNetworkRuntime.parseDOTNetwork;
export const parseGephiNetwork = visNetworkRuntime.parseGephiNetwork;
export const networkGephiParser = visNetworkRuntime.networkGephiParser;
export const networkOptions = visNetworkRuntime.networkOptions;

type NetworkClass = typeof import("vis-network").Network;
export type NetworkOptions = InstanceType<NetworkClass> extends { setOptions(opts: infer T): void } ? T : never;
