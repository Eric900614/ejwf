import { describe, expect, it } from "vitest";
import { parseCardRelations } from "./relations";
import type { Card } from "./types";

describe("parseCardRelations", () => {
  it("从 Parent 段读出归属 PRD，并从全文读出多处 ADR 引用", () => {
    const card: Card = {
      number: 5,
      title: "为什么链",
      state: "OPEN",
      body: [
        "## Parent",
        "",
        "  #1 — PRD: Agents 团队驾驶舱 — TB1",
        "",
        "## What to build",
        "",
        "参考 ADR-0002，也要遵守 adr-0004。",
        "重复提到 ADR-0002 时只保留一次。"
      ].join("\n")
    };

    expect(parseCardRelations(card)).toEqual({
      parentPrd: {
        childNumber: 5,
        parentNumber: 1,
        title: "PRD: Agents 团队驾驶舱 — TB1"
      },
      adrReferences: [
        { cardNumber: 5, code: "ADR-0002", number: "0002" },
        { cardNumber: 5, code: "ADR-0004", number: "0004" }
      ]
    });
  });

  it("没有可解析 Parent 编号时不生成 PRD 归属", () => {
    const card: Card = {
      number: 8,
      title: "linter 面板",
      state: "OPEN",
      body: [
        "## Parent",
        "",
        "PRD 卡以后再补",
        "",
        "## What to build",
        "",
        "这里没有 ADR。"
      ].join("\n")
    };

    expect(parseCardRelations(card)).toEqual({
      parentPrd: undefined,
      adrReferences: []
    });
  });
});
