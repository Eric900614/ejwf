import { extractSection } from "./section";
import type { Card, DependencyEdge } from "./types";

export function parseBlockedByEdges(card: Card): DependencyEdge[] {
  const section = extractSection(card.body, "Blocked by");

  if (section === undefined) {
    return [];
  }

  return [...section.matchAll(/#(\d+)/g)].map((match) => ({
    blockerNumber: Number(match[1]),
    blockedNumber: card.number
  }));
}
