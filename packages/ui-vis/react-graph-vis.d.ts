declare module "react-graph-vis" {
  import type { ComponentType } from "react";
  import type { Data, Network, Options } from "vis-network";

  interface GraphEvents {
    [eventName: string]: (...args: unknown[]) => void;
  }

  export interface GraphProps {
    graph: Pick<Data, "nodes" | "edges">;
    options?: Options;
    events?: GraphEvents;
    getNetwork?: (network: Network) => void;
    getEdges?: (edges: unknown) => void;
    getNodes?: (nodes: unknown) => void;
    style?: React.CSSProperties;
    className?: string;
  }

  const Graph: ComponentType<GraphProps>;
  export default Graph;
}
