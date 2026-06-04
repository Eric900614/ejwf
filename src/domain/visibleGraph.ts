import type { DependencyGraph } from "./graph";

export interface VisibleGraphOptions {
  showClosedCards: boolean;
}

export function filterVisibleGraph(
  graph: DependencyGraph,
  options: VisibleGraphOptions
): DependencyGraph {
  if (options.showClosedCards) {
    return graph;
  }

  const nodes = graph.nodes.filter((node) => node.card.state === "OPEN");
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edges = graph.edges.filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target));

  return { nodes, edges };
}
