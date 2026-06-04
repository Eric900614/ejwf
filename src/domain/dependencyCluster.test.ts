import { describe, expect, it } from "vitest";
import { buildDependencyGraph } from "./graph";
import { getDependencyClusterNodeIds } from "./dependencyCluster";
import { filterVisibleGraph } from "./visibleGraph";
import type { Card } from "./types";

describe("getDependencyClusterNodeIds", () => {
  it("follows a dependency chain without caring about edge direction", () => {
    const cards: Card[] = [
      { number: 1, title: "Root blocker", state: "OPEN", body: "" },
      { number: 2, title: "Middle card", state: "OPEN", body: "## Blocked by\n\n- #1" },
      { number: 3, title: "Downstream card", state: "OPEN", body: "## Blocked by\n\n- #2" }
    ];

    expect([...getDependencyClusterNodeIds(buildDependencyGraph(cards), "2")].sort()).toEqual([
      "1",
      "2",
      "3"
    ]);
  });

  it("includes a fork that branches away from the selected card", () => {
    const cards: Card[] = [
      { number: 1, title: "Shared root", state: "OPEN", body: "" },
      { number: 2, title: "First branch", state: "OPEN", body: "## Blocked by\n\n- #1" },
      { number: 3, title: "Second branch", state: "OPEN", body: "## Blocked by\n\n- #1" },
      { number: 4, title: "Other work", state: "OPEN", body: "" }
    ];

    expect([...getDependencyClusterNodeIds(buildDependencyGraph(cards), "2")].sort()).toEqual([
      "1",
      "2",
      "3"
    ]);
  });

  it("keeps sibling cards together when they are blocked by the same card", () => {
    const cards: Card[] = [
      { number: 10, title: "Shared blocker", state: "OPEN", body: "" },
      { number: 11, title: "Sibling A", state: "OPEN", body: "## Blocked by\n\n- #10" },
      { number: 12, title: "Sibling B", state: "OPEN", body: "## Blocked by\n\n- #10" }
    ];

    expect([...getDependencyClusterNodeIds(buildDependencyGraph(cards), "11")].sort()).toEqual([
      "10",
      "11",
      "12"
    ]);
  });

  it("returns only the selected node for an isolated card", () => {
    const cards: Card[] = [
      { number: 21, title: "Isolated", state: "OPEN", body: "" },
      { number: 22, title: "Other isolated", state: "OPEN", body: "" }
    ];

    expect([...getDependencyClusterNodeIds(buildDependencyGraph(cards), "21")]).toEqual(["21"]);
  });

  it("uses the currently visible graph so closed cards join only when visible", () => {
    const cards: Card[] = [
      { number: 30, title: "Closed blocker", state: "CLOSED", body: "" },
      { number: 31, title: "Open card", state: "OPEN", body: "## Blocked by\n\n- #30" }
    ];
    const graph = buildDependencyGraph(cards);

    expect([
      ...getDependencyClusterNodeIds(filterVisibleGraph(graph, { showClosedCards: false }), "31")
    ]).toEqual(["31"]);
    expect([
      ...getDependencyClusterNodeIds(filterVisibleGraph(graph, { showClosedCards: true }), "31")
    ].sort()).toEqual(["30", "31"]);
  });
});
