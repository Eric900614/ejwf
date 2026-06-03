import { describe, expect, it } from "vitest";
import { buildDependencyGraph } from "./graph";
import type { Card } from "./types";

describe("buildDependencyGraph", () => {
  it("把 blocked-by 解析成前置指向被挡卡片的箭头", () => {
    const cards: Card[] = [
      {
        number: 2,
        title: "项目骨架",
        state: "OPEN",
        body: "## Blocked by\n\nNone"
      },
      {
        number: 5,
        title: "为什么链",
        state: "OPEN",
        body: "## Blocked by\n\n- #2"
      }
    ];

    expect(buildDependencyGraph(cards)).toEqual({
      nodes: [
        { id: "2", card: cards[0] },
        { id: "5", card: cards[1] }
      ],
      edges: [
        {
          id: "2->5",
          source: "2",
          target: "5",
          dependency: { blockerNumber: 2, blockedNumber: 5 }
        }
      ]
    });
  });

  it("丢弃指向不存在卡片的依赖边（前置已关闭 / 跨 repo），避免 cytoscape 崩溃", () => {
    const cards: Card[] = [
      {
        number: 5,
        title: "仍挂着已关闭前置的卡",
        state: "OPEN",
        body: "## Blocked by\n\n- #2"
      }
    ];

    expect(buildDependencyGraph(cards).edges).toEqual([]);
  });

  it("同一段里重复引用同一前置时只生成一条边", () => {
    const cards: Card[] = [
      { number: 2, title: "前置", state: "OPEN", body: "" },
      {
        number: 5,
        title: "重复引用前置的卡",
        state: "OPEN",
        body: "## Blocked by\n\n- #2\n- 另见 #2"
      }
    ];

    expect(buildDependencyGraph(cards).edges).toEqual([
      {
        id: "2->5",
        source: "2",
        target: "5",
        dependency: { blockerNumber: 2, blockedNumber: 5 }
      }
    ]);
  });
});
