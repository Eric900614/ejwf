import type { AdrReferenceEdge, Card, ParentPrdEdge } from "./types";

export interface CardRelations {
  parentPrd?: ParentPrdEdge;
  adrReferences: AdrReferenceEdge[];
}

export function parseCardRelations(card: Card): CardRelations {
  return {
    parentPrd: parseParentPrd(card),
    adrReferences: parseAdrReferences(card)
  };
}

function parseParentPrd(card: Card): ParentPrdEdge | undefined {
  const parentSection =
    card.body.match(/(?:^|\r?\n)##\s*Parent\s*\r?\n([\s\S]*?)(?=\r?\n##\s|$)/i)?.[1] ?? "";
  const parentMatch = parentSection.match(/#(\d+)(?:\s*[—-]\s*(.+))?/);

  if (!parentMatch) {
    return undefined;
  }

  const title = parentMatch[2]?.trim();

  return {
    childNumber: card.number,
    parentNumber: Number(parentMatch[1]),
    ...(title ? { title } : {})
  };
}

function parseAdrReferences(card: Card): AdrReferenceEdge[] {
  const seenCodes = new Set<string>();
  const references: AdrReferenceEdge[] = [];

  for (const match of card.body.matchAll(/\bADR-(\d{4})\b/gi)) {
    const number = match[1];
    const code = `ADR-${number}`;

    if (seenCodes.has(code)) {
      continue;
    }

    seenCodes.add(code);
    references.push({
      cardNumber: card.number,
      code,
      number
    });
  }

  return references;
}
