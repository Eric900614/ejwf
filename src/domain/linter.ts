import { parseBlockedByEdges } from "./blockedBy";
import { parseCardRelations } from "./relations";
import type { Card, ParseWarning } from "./types";

export function lintCards(cards: Card[]): ParseWarning[] {
  const cardNumbers = new Set(cards.map((card) => card.number));
  const warnings: ParseWarning[] = [];

  for (const card of cards) {
    const parentSection = extractSection(card.body, "Parent");
    const blockedBySection = extractSection(card.body, "Blocked by");
    const relations = parseCardRelations(card);
    const dependencies = parseBlockedByEdges(card);

    if (blockedBySection === undefined && looksLikeTbCard(card)) {
      warnings.push({
        kind: "missing-blocked-by",
        cardNumber: card.number,
        cardTitle: card.title,
        ...(card.url ? { cardUrl: card.url } : {}),
        message: `Card #${card.number} looks like a TB card, but it has no Blocked by section.`
      });
    }

    if (parentSection !== undefined && !relations.parentPrd) {
      warnings.push({
        kind: "invalid-parent",
        cardNumber: card.number,
        cardTitle: card.title,
        ...(card.url ? { cardUrl: card.url } : {}),
        message: `Card #${card.number} has a Parent section, but it does not contain a parseable #number.`
      });
    }

    for (const reference of findMalformedAdrReferences(card.body)) {
      warnings.push({
        kind: "malformed-reference",
        cardNumber: card.number,
        cardTitle: card.title,
        ...(card.url ? { cardUrl: card.url } : {}),
        reference,
        message: `Card #${card.number} has malformed reference ${reference}; expected ADR-NNNN.`
      });
    }

    if (
      card.state === "OPEN" &&
      parentSection === undefined &&
      dependencies.length === 0 &&
      relations.adrReferences.length === 0 &&
      !isPrdCard(card)
    ) {
      warnings.push({
        kind: "disconnected-card",
        cardNumber: card.number,
        cardTitle: card.title,
        ...(card.url ? { cardUrl: card.url } : {}),
        message: `Card #${card.number} has no Parent, Blocked by dependency, or ADR reference; it may be disconnected from the work chain.`
      });
    }

    for (const dependency of dependencies) {
      if (cardNumbers.has(dependency.blockerNumber)) {
        continue;
      }

      warnings.push({
        kind: "dangling-reference",
        cardNumber: card.number,
        cardTitle: card.title,
        ...(card.url ? { cardUrl: card.url } : {}),
        referencedNumber: dependency.blockerNumber,
        message: `Card #${card.number} says it is blocked by #${dependency.blockerNumber}, but #${dependency.blockerNumber} is not in the loaded card set.`
      });
    }
  }

  return warnings;
}

function extractSection(body: string, heading: string): string | undefined {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return body.match(new RegExp(`(?:^|\\r?\\n)##\\s*${escapedHeading}\\s*\\r?\\n([\\s\\S]*?)(?=\\r?\\n##\\s|$)`, "i"))?.[1];
}

function findMalformedAdrReferences(body: string): string[] {
  const references: string[] = [];

  for (const match of body.matchAll(/\bADR-([A-Za-z0-9]+)\b/g)) {
    if (/^\d{4}$/.test(match[1]) || match[1] === "NNNN") {
      continue;
    }

    references.push(match[0]);
  }

  return references;
}

function looksLikeTbCard(card: Card): boolean {
  return (
    card.state === "OPEN" &&
    /^TB\d+-\d+\b/i.test(card.title) &&
    (card.labels ?? []).some((label) => label.name === "ready-for-agent")
  );
}

function isPrdCard(card: Card): boolean {
  return /^PRD\b/i.test(card.title);
}
