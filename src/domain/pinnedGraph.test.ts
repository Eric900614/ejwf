import { describe, expect, it } from "vitest";
import { buildDependencyGraph } from "./graph";
import { filterPinnedGraph } from "./pinnedGraph";
import type { Card } from "./types";

describe("filterPinnedGraph", () => {
  it("没有盯任何卡时返回空图", () => {
    const graph = buildDependencyGraph([
      card(1, "孤立卡"),
      card(2, "另一张卡")
    ]);

    expect(filterPinnedGraph(graph, new Set())).toEqual({ nodes: [], edges: [] });
  });

  it("盯单张卡时保留它所在的整条血脉", () => {
    const graph = buildDependencyGraph([
      card(1, "前置"),
      card(2, "被挡住", "## Blocked by\n\n- #1"),
      card(3, "血脉下游", "## Blocked by\n\n- #2"),
      card(9, "不相关")
    ]);

    const filtered = filterPinnedGraph(graph, new Set(["2"]));

    expect(filtered.nodes.map((node) => node.id)).toEqual(["1", "2", "3"]);
    expect(filtered.edges.map((edge) => edge.id)).toEqual(["1->2", "2->3"]);
  });

  it("盯跨簇多张卡时保留多个血脉的并集", () => {
    const graph = buildDependencyGraph([
      card(1, "第一簇前置"),
      card(2, "第一簇下游", "## Blocked by\n\n- #1"),
      card(7, "第二簇前置"),
      card(8, "第二簇下游", "## Blocked by\n\n- #7"),
      card(9, "不相关")
    ]);

    const filtered = filterPinnedGraph(graph, new Set(["2", "8"]));

    expect(filtered.nodes.map((node) => node.id)).toEqual(["1", "2", "7", "8"]);
    expect(filtered.edges.map((edge) => edge.id)).toEqual(["1->2", "7->8"]);
  });
});

function card(number: number, title: string, body = ""): Card {
  return {
    number,
    title,
    body,
    state: "OPEN"
  };
}
