import { describe, expect, it } from "vitest";
import { buildDependencyGraph, findMissingBlockerNumbers } from "./graph";
import type { Card } from "./types";

describe("buildDependencyGraph", () => {
  it("把 blocked-by 解析成前置指向被挡卡片的箭头", () => {
    const cards: Card[] = [
      {
        number: 2,
        title: "项目骨架",
        state: "OPEN",
        body: "## Blocked by\n\nNone",
        labels: [{ name: "ready-for-agent" }]
      },
      {
        number: 5,
        title: "为什么链",
        state: "OPEN",
        body: "## Blocked by\n\n- #2",
        labels: [{ name: "ready-for-agent" }]
      }
    ];

    expect(buildDependencyGraph(cards)).toEqual({
      nodes: [
        { id: "2", card: cards[0], stage: "ready", isReady: true },
        { id: "5", card: cards[1], stage: "ready", isReady: false }
      ],
      edges: [
        {
          id: "2->5",
          source: "2",
          target: "5",
          dependency: { blockerNumber: 2, blockedNumber: 5 },
          status: "blocking"
        }
      ]
    });
  });

  it("最后一个 blocker 关闭后，ready-for-agent 卡片变成就绪，并保留已满足依赖箭头", () => {
    const cards: Card[] = [
      {
        number: 2,
        title: "已完成的项目骨架",
        state: "CLOSED",
        body: "",
        labels: [{ name: "ready-for-agent" }]
      },
      {
        number: 4,
        title: "高亮就绪卡",
        state: "OPEN",
        body: "## Blocked by\n\n- #2",
        labels: [{ name: "ready-for-agent" }]
      }
    ];

    expect(buildDependencyGraph(cards)).toEqual({
      nodes: [
        { id: "2", card: cards[0], stage: "done", isReady: false },
        { id: "4", card: cards[1], stage: "ready", isReady: true }
      ],
      edges: [
        {
          id: "2->4",
          source: "2",
          target: "4",
          dependency: { blockerNumber: 2, blockedNumber: 4 },
          status: "satisfied"
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
        dependency: { blockerNumber: 2, blockedNumber: 5 },
        status: "blocking"
      }
    ]);
  });
});

describe("findMissingBlockerNumbers", () => {
  it("找出 open 卡引用到、但当前卡集合里还没有的 blocker 编号", () => {
    const cards: Card[] = [
      {
        number: 4,
        title: "等待已关闭前置",
        state: "OPEN",
        body: "## Blocked by\n\n- #2\n- #3",
        labels: [{ name: "ready-for-agent" }]
      },
      {
        number: 3,
        title: "仍在打开的前置",
        state: "OPEN",
        body: ""
      }
    ];

    expect(findMissingBlockerNumbers(cards)).toEqual([2]);
  });
});
