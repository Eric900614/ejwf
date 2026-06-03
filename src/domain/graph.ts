import { parseBlockedByEdges } from "./blockedBy";
import type { Card, DependencyEdge } from "./types";

export interface GraphNode {
  id: string;
  card: Card;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  dependency: DependencyEdge;
}

export interface DependencyGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function buildDependencyGraph(cards: Card[]): DependencyGraph {
  const nodes = cards.map((card) => ({
    id: String(card.number),
    card
  }));

  const nodeIds = new Set(nodes.map((node) => node.id));
  const seenEdgeIds = new Set<string>();
  const edges: GraphEdge[] = [];

  for (const card of cards) {
    for (const dependency of parseBlockedByEdges(card)) {
      const source = String(dependency.blockerNumber);
      const target = String(dependency.blockedNumber);

      // Skip edges whose blocker isn't among the rendered cards (a closed or
      // cross-repo blocker, e.g. #2 once it closes while #3/#4/#5 still list it).
      // cytoscape throws on an edge that points at a non-existent node, which
      // blanks the whole graph. Surfacing dangling refs is the linter's job (#8).
      if (!nodeIds.has(source) || !nodeIds.has(target)) {
        continue;
      }

      // Dedupe repeated `#N` in one Blocked by section — a duplicate edge id
      // makes cytoscape throw "second element with the same id".
      const id = `${source}->${target}`;
      if (seenEdgeIds.has(id)) {
        continue;
      }
      seenEdgeIds.add(id);

      edges.push({ id, source, target, dependency });
    }
  }

  return {
    nodes,
    edges
  };
}
