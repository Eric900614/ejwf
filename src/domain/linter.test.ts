import { describe, expect, it } from "vitest";
import { lintCards } from "./linter";
import type { Card } from "./types";

describe("lintCards", () => {
  it("reports a dangling blocked-by reference with the card it came from", () => {
    const cards: Card[] = [
      {
        number: 8,
        title: "Linter panel",
        state: "OPEN",
        body: "## Parent\n\n#1\n\n## Blocked by\n\n- #99",
        url: "https://example.test/issues/8"
      },
      {
        number: 1,
        title: "PRD: cockpit",
        state: "OPEN",
        body: ""
      }
    ];

    expect(lintCards(cards)).toEqual([
      {
        kind: "dangling-reference",
        cardNumber: 8,
        cardTitle: "Linter panel",
        cardUrl: "https://example.test/issues/8",
        referencedNumber: 99,
        message: "Card #8 says it is blocked by #99, but #99 is not in the loaded card set."
      }
    ]);
  });

  it("reports a Parent section that has no parseable issue number", () => {
    const cards: Card[] = [
      {
        number: 12,
        title: "Why-chain detail",
        state: "OPEN",
        body: "## Parent\n\nPRD card is still being discussed.\n\n## Blocked by\n\nNone"
      }
    ];

    expect(lintCards(cards)).toEqual([
      {
        kind: "invalid-parent",
        cardNumber: 12,
        cardTitle: "Why-chain detail",
        message: "Card #12 has a Parent section, but it does not contain a parseable #number."
      }
    ]);
  });

  it("reports malformed ADR references", () => {
    const cards: Card[] = [
      {
        number: 14,
        title: "ADR link card",
        state: "OPEN",
        body: "## Parent\n\n#1\n\n## What to build\n\nSee ADR-12 and ADR-main."
      },
      {
        number: 1,
        title: "PRD: cockpit",
        state: "OPEN",
        body: ""
      }
    ];

    expect(lintCards(cards)).toEqual([
      {
        kind: "malformed-reference",
        cardNumber: 14,
        cardTitle: "ADR link card",
        reference: "ADR-12",
        message: "Card #14 has malformed reference ADR-12; expected ADR-NNNN."
      },
      {
        kind: "malformed-reference",
        cardNumber: 14,
        cardTitle: "ADR link card",
        reference: "ADR-main",
        message: "Card #14 has malformed reference ADR-main; expected ADR-NNNN."
      }
    ]);
  });

  it("does not report ADR-NNNN placeholders as malformed references", () => {
    const cards: Card[] = [
      {
        number: 1,
        title: "PRD: cockpit",
        state: "OPEN",
        body: "Use ADR-NNNN as a writing-template placeholder."
      }
    ];

    expect(lintCards(cards)).toEqual([]);
  });

  it("reports a ready TB card that is missing the Blocked by section", () => {
    const cards: Card[] = [
      {
        number: 15,
        title: "TB1-8: next slice",
        state: "OPEN",
        labels: [{ name: "ready-for-agent" }],
        body: "## Parent\n\n#1\n\n## What to build\n\nDo the next slice."
      },
      {
        number: 1,
        title: "PRD: cockpit",
        state: "OPEN",
        body: ""
      }
    ];

    expect(lintCards(cards)).toEqual([
      {
        kind: "missing-blocked-by",
        cardNumber: 15,
        cardTitle: "TB1-8: next slice",
        message: "Card #15 looks like a TB card, but it has no Blocked by section."
      }
    ]);
  });

  it("reports an open non-PRD card that has no parent, dependency, or ADR link", () => {
    const cards: Card[] = [
      {
        number: 16,
        title: "Loose note",
        state: "OPEN",
        body: "## What to build\n\nThis has no links back to the work chain."
      }
    ];

    expect(lintCards(cards)).toEqual([
      {
        kind: "disconnected-card",
        cardNumber: 16,
        cardTitle: "Loose note",
        message: "Card #16 has no Parent, Blocked by dependency, or ADR reference; it may be disconnected from the work chain."
      }
    ]);
  });
});
