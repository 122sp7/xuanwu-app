"use client";

/**
 * @module ui/vis/network
 * React wrapper for vis-network.
 *
 * Provides a drop-in React component for interactive network visualization.
 * Simplifies ref management and event handling for Next.js environments.
 */

import { useRef, useEffect, FC } from "react";
import Graph from "react-graph-vis";
import type { Network, Options } from "vis-network";

export interface VisNetworkProps {
  /**
   * Nodes data array
   */
  nodes?: Array<{ id: string | number; label?: string; [key: string]: unknown }>;

  /**
   * Edges data array
   */
  edges?: Array<{ from: string | number; to: string | number; [key: string]: unknown }>;

  /**
   * vis-network options
   */
  options?: Options;

  /**
   * Fired when a node is clicked
   */
  onSelectNode?: (nodeId: string | number) => void;

  /**
   * Fired when a node is double-clicked
   */
  onDoubleClickNode?: (nodeId: string | number) => void;

  /**
   * Fired when physics simulation finishes
   */
  onPhysicsStabilized?: () => void;

  /**
   * Container CSS class
   */
  className?: string;

  /**
   * Container CSS styles
   */
  style?: React.CSSProperties;
}

/**
 * VisNetwork component - interactive network graph with React integration.
 *
 * @example
 * ```tsx
 * <VisNetwork
 *   nodes={[{ id: 1, label: "Node 1" }]}
 *   edges={[{ from: 1, to: 2 }]}
 *   options={{ physics: { enabled: true } }}
 *   onSelectNode={(id) => console.log("Selected:", id)}
 * />
 * ```
 */
export const VisNetwork: FC<VisNetworkProps> = ({
  nodes = [],
  edges = [],
  options = {},
  onSelectNode,
  onDoubleClickNode,
  onPhysicsStabilized,
  className,
  style = { width: "100%", height: "600px" },
}) => {
  const networkRef = useRef<Network | null>(null);

  const defaultOptions: Options = {
    physics: {
      enabled: true,
      barnesHut: {
        gravitationalConstant: -26000,
        centralGravity: 0.3,
        springLength: 200,
      },
    },
    interaction: {
      navigationButtons: true,
      keyboard: true,
    },
    ...options,
  };

  useEffect(() => {
    if (!networkRef.current) return;

    const handleSelectNode = (event: { nodes: (string | number)[] }) => {
      if (event.nodes.length > 0 && onSelectNode) {
        onSelectNode(event.nodes[0]);
      }
    };

    const handleDoubleClickNode = (event: { nodes: (string | number)[] }) => {
      if (event.nodes.length > 0 && onDoubleClickNode) {
        onDoubleClickNode(event.nodes[0]);
      }
    };

    const handlePhysicsStabilized = () => {
      if (onPhysicsStabilized) {
        onPhysicsStabilized();
      }
    };

    networkRef.current.on("selectNode", handleSelectNode);
    networkRef.current.on("doubleClick", handleDoubleClickNode);
    networkRef.current.on("stabilizationIterationsDone", handlePhysicsStabilized);

    return () => {
      if (networkRef.current) {
        networkRef.current.off("selectNode", handleSelectNode);
        networkRef.current.off("doubleClick", handleDoubleClickNode);
        networkRef.current.off("stabilizationIterationsDone", handlePhysicsStabilized);
      }
    };
  }, [onSelectNode, onDoubleClickNode, onPhysicsStabilized]);

  return (
    <div className={className} style={style}>
      <Graph
        graph={{ nodes, edges }}
        options={defaultOptions}
        events={{}}
        getNetwork={(network: Network) => {
          networkRef.current = network;
        }}
      />
    </div>
  );
};

export default VisNetwork;
