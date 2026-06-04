import type { DependencyGraph } from "./graph";

export function getDependencyClusterNodeIds(graph: DependencyGraph, startNodeId: string): Set<string> {
  const nodeIds = new Set(graph.nodes.map((node) => node.id));

  if (!nodeIds.has(startNodeId)) {
    return new Set();
  }

  const neighborIdsByNodeId = new Map<string, Set<string>>();

  for (const nodeId of nodeIds) {
    neighborIdsByNodeId.set(nodeId, new Set());
  }

  for (const edge of graph.edges) {
    neighborIdsByNodeId.get(edge.source)?.add(edge.target);
    neighborIdsByNodeId.get(edge.target)?.add(edge.source);
  }

  const clusterNodeIds = new Set<string>();
  const queue = [startNodeId];

  for (const nodeId of queue) {
    if (clusterNodeIds.has(nodeId)) {
      continue;
    }

    clusterNodeIds.add(nodeId);

    for (const neighborId of neighborIdsByNodeId.get(nodeId) ?? []) {
      if (!clusterNodeIds.has(neighborId)) {
        queue.push(neighborId);
      }
    }
  }

  return clusterNodeIds;
}
