import { describe, expect, it } from "vitest";
import { buildDependencyGraph } from "../domain/graph";
import { buildPrdGroups } from "../domain/prdGroups";
import type { Card } from "../domain/types";
import { buildDependencyGraphElements } from "./dependencyGraphElements";

describe("buildDependencyGraphElements", () => {
  it("分组模式生成 PRD 分组框，并保留 blocked-by 依赖边", () => {
    const cards: Card[] = [
      {
        number: 2,
        title: "项目骨架",
        state: "OPEN",
        body: "## Parent\n\n#1 — PRD: Agents 团队驾驶舱"
      },
      {
        number: 6,
        title: "按 PRD 分组视图",
        state: "OPEN",
        body: "## Parent\n\n#1 — PRD: Agents 团队驾驶舱\n\n## Blocked by\n\n- #2"
      }
    ];
    const graph = buildDependencyGraph(cards);

    expect(
      buildDependencyGraphElements(graph, { groups: buildPrdGroups(graph) }).map(
        (element) => element.data
      )
    ).toEqual([
      {
        id: "prd-1",
        label: "#1 PRD: Agents 团队驾驶舱",
        group: "true"
      },
      {
        id: "2",
        label: "#2\n项目骨架",
        ready: "false",
        selected: "false",
        stage: "triage",
        card: "true",
        parent: "prd-1"
      },
      {
        id: "6",
        label: "#6\n按 PRD 分组视图",
        ready: "false",
        selected: "false",
        stage: "triage",
        card: "true",
        parent: "prd-1"
      },
      {
        id: "2->6",
        source: "2",
        status: "blocking",
        target: "6"
      }
    ]);
  });
});
