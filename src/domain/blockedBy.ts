import type { Card, DependencyEdge } from "./types";

export function parseBlockedByEdges(card: Card): DependencyEdge[] {
  const lines = card.body.split(/\r?\n/);
  const sectionLines: string[] = [];
  let inBlockedBySection = false;

  for (const line of lines) {
    const heading = line.match(/^##\s+(.+?)\s*$/);

    if (heading) {
      if (inBlockedBySection) {
        break;
      }

      inBlockedBySection = heading[1].toLowerCase() === "blocked by";
      continue;
    }

    if (inBlockedBySection) {
      sectionLines.push(line);
    }
  }

  return sectionLines.flatMap((line) =>
    [...line.matchAll(/#(\d+)/g)].map((match) => ({
      blockerNumber: Number(match[1]),
      blockedNumber: card.number
    }))
  );
}
