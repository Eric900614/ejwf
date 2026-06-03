import { describe, expect, it } from "vitest";
import { buildDependencyGraph } from "./graph";
import { buildPrdGroups } from "./prdGroups";
import type { Card } from "./types";

describe("buildPrdGroups", () => {
  it("按 Parent 里的 PRD 编号给节点分组，没有 Parent 的进入散卡组", () => {
    const cards: Card[] = [
      {
        number: 1,
        title: "PRD: Agents 团队驾驶舱",
        state: "OPEN",
        body: ""
      },
      {
        number: 6,
        title: "按 PRD 分组视图",
        state: "OPEN",
        body: "## Parent\n\n#1 — PRD: Agents 团队驾驶舱"
      },
      {
        number: 9,
        title: "没有 PRD 的散卡",
        state: "OPEN",
        body: ""
      }
    ];

    expect(buildPrdGroups(buildDependencyGraph(cards))).toEqual([
      {
        id: "prd-1",
        title: "#1 PRD: Agents 团队驾驶舱",
        nodeIds: ["6"]
      },
      {
        id: "ungrouped",
        title: "散卡",
        nodeIds: ["1", "9"]
      }
    ]);
  });
});
