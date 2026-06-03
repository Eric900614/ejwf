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

  const edges = cards.flatMap((card) =>
    parseBlockedByEdges(card).map((dependency) => ({
      id: `${dependency.blockerNumber}->${dependency.blockedNumber}`,
      source: String(dependency.blockerNumber),
      target: String(dependency.blockedNumber),
      dependency
    }))
  );

  return {
    nodes,
    edges
  };
}
