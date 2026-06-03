import { describe, expect, it } from "vitest";
import { parseBlockedByEdges } from "./blockedBy";
import type { Card } from "./types";

describe("parseBlockedByEdges", () => {
  it("能解析正文最后一个 ## Blocked by 段里的依赖", () => {
    const card: Card = {
      number: 12,
      title: "被挡住的卡片",
      state: "OPEN",
      body: [
        "## What to build",
        "",
        "先做一个最薄版本。",
        "",
        "## Blocked by",
        "",
        "- #3",
        "- Depends on #4"
      ].join("\n")
    };

    expect(parseBlockedByEdges(card)).toEqual([
      { blockerNumber: 3, blockedNumber: 12 },
      { blockerNumber: 4, blockedNumber: 12 }
    ]);
  });

  it("Blocked by 写 None 时不生成依赖边", () => {
    const card: Card = {
      number: 20,
      title: "没有前置的卡片",
      state: "OPEN",
      body: [
        "## What to build",
        "",
        "直接开始。",
        "",
        "## Blocked by",
        "",
        "None - 可立即开始"
      ].join("\n")
    };

    expect(parseBlockedByEdges(card)).toEqual([]);
  });
});
