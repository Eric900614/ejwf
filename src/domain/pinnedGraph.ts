import type { DependencyGraph } from "./graph";
import { getDependencyClusterNodeIds } from "./dependencyCluster";

export function filterPinnedGraph(graph: DependencyGraph, pinnedNodeIds: ReadonlySet<string>): DependencyGraph {
  if (pinnedNodeIds.size === 0) {
    return { nodes: [], edges: [] };
  }

  const keptNodeIds = new Set<string>();

  for (const pinnedNodeId of pinnedNodeIds) {
    for (const nodeId of getDependencyClusterNodeIds(graph, pinnedNodeId)) {
      keptNodeIds.add(nodeId);
    }
  }

  return {
    nodes: graph.nodes.filter((node) => keptNodeIds.has(node.id)),
    edges: graph.edges.filter((edge) => keptNodeIds.has(edge.source) && keptNodeIds.has(edge.target))
  };
}
