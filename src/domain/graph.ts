import { parseBlockedByEdges } from "./blockedBy";
import { deriveCardStage, type CardStage } from "./stage";
import type { Card, DependencyEdge } from "./types";

export interface GraphNode {
  id: string;
  card: Card;
  stage: CardStage;
  isReady: boolean;
}

export type GraphEdgeStatus = "blocking" | "satisfied";

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  dependency: DependencyEdge;
  status: GraphEdgeStatus;
}

export interface DependencyGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function buildDependencyGraph(cards: Card[]): DependencyGraph {
  const cardByNumber = new Map(cards.map((card) => [card.number, card]));
  const dependenciesByCardNumber = new Map(
    cards.map((card) => [card.number, parseBlockedByEdges(card)])
  );

  const nodes = cards.map((card) => ({
    id: String(card.number),
    card,
    stage: deriveCardStage(card),
    isReady: isReadyForAgent(card, dependenciesByCardNumber.get(card.number) ?? [], cardByNumber)
  }));

  const nodeIds = new Set(nodes.map((node) => node.id));
  const seenEdgeIds = new Set<string>();
  const edges: GraphEdge[] = [];

  for (const card of cards) {
    for (const dependency of dependenciesByCardNumber.get(card.number) ?? []) {
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

      edges.push({
        id,
        source,
        target,
        dependency,
        status: cardByNumber.get(dependency.blockerNumber)?.state === "CLOSED" ? "satisfied" : "blocking"
      });
    }
  }

  return {
    nodes,
    edges
  };
}

export function findMissingBlockerNumbers(cards: Card[]): number[] {
  const cardNumbers = new Set(cards.map((card) => card.number));
  const missingBlockerNumbers = new Set<number>();

  for (const card of cards) {
    for (const dependency of parseBlockedByEdges(card)) {
      if (!cardNumbers.has(dependency.blockerNumber)) {
        missingBlockerNumbers.add(dependency.blockerNumber);
      }
    }
  }

  return [...missingBlockerNumbers].sort((left, right) => left - right);
}

function isReadyForAgent(
  card: Card,
  dependencies: DependencyEdge[],
  cardByNumber: Map<number, Card>
): boolean {
  if (card.state !== "OPEN" || !card.labels?.some((label) => label.name === "ready-for-agent")) {
    return false;
  }

  return dependencies.every((dependency) => cardByNumber.get(dependency.blockerNumber)?.state === "CLOSED");
}
