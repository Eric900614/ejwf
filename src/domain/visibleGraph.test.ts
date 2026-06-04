import { describe, expect, it } from "vitest";
import { buildDependencyGraph } from "./graph";
import type { Card } from "./types";
import { filterVisibleGraph } from "./visibleGraph";

describe("filterVisibleGraph", () => {
  it("默认只显示 open 卡，并隐藏指向 closed 卡的已满足依赖线", () => {
    const cards: Card[] = [
      {
        number: 2,
        title: "已完成前置",
        state: "CLOSED",
        body: ""
      },
      {
        number: 7,
        title: "默认只看 open",
        state: "OPEN",
        body: "## Blocked by\n\n- #2"
      }
    ];

    expect(filterVisibleGraph(buildDependencyGraph(cards), { showClosedCards: false })).toEqual({
      nodes: [
        expect.objectContaining({
          id: "7",
          card: expect.objectContaining({ state: "OPEN" })
        })
      ],
      edges: []
    });
  });

  it("打开显示已关闭卡后，保留 closed 卡和已满足依赖线", () => {
    const cards: Card[] = [
      {
        number: 2,
        title: "已完成前置",
        state: "CLOSED",
        body: ""
      },
      {
        number: 7,
        title: "默认只看 open",
        state: "OPEN",
        body: "## Blocked by\n\n- #2"
      }
    ];

    expect(filterVisibleGraph(buildDependencyGraph(cards), { showClosedCards: true })).toEqual({
      nodes: [
        expect.objectContaining({
          id: "2",
          card: expect.objectContaining({ state: "CLOSED" })
        }),
        expect.objectContaining({
          id: "7",
          card: expect.objectContaining({ state: "OPEN" })
        })
      ],
      edges: [
        expect.objectContaining({
          id: "2->7",
          status: "satisfied"
        })
      ]
    });
  });
});
