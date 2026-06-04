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
        label: "项目骨架",
        ready: "false",
        selected: "false",
        stage: "triage",
        card: "true",
        state: "OPEN",
        parent: "prd-1"
      },
      {
        id: "6",
        label: "按 PRD 分组视图",
        ready: "false",
        selected: "false",
        stage: "triage",
        card: "true",
        state: "OPEN",
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

  it("把 closed 卡状态放进图元素，供界面灰显", () => {
    const cards: Card[] = [
      {
        number: 2,
        title: "已完成前置",
        state: "CLOSED",
        body: ""
      }
    ];
    const graph = buildDependencyGraph(cards);

    expect(buildDependencyGraphElements(graph).map((element) => element.data)).toEqual([
      {
        id: "2",
        label: "已完成前置",
        ready: "false",
        selected: "false",
        stage: "done",
        card: "true",
        state: "CLOSED"
      }
    ]);
  });

  it("只给 open 卡生成龄期文案，closed 卡不显示停滞", () => {
    const cards: Card[] = [
      {
        number: 2,
        title: "等待维护者验收",
        state: "OPEN",
        body: "",
        updatedAt: "2026-06-01T12:00:00Z"
      },
      {
        number: 3,
        title: "已完成前置",
        state: "CLOSED",
        body: "",
        updatedAt: "2026-06-01T12:00:00Z"
      }
    ];
    const graph = buildDependencyGraph(cards);
    const elements = buildDependencyGraphElements(graph, {
      now: new Date("2026-06-04T12:00:00Z")
    }).map((element) => element.data);

    expect(elements).toEqual([
      {
        id: "2",
        label: "等待维护者验收",
        ready: "false",
        selected: "false",
        stage: "triage",
        card: "true",
        state: "OPEN",
        stalenessLabel: "3 天没动"
      },
      {
        id: "3",
        label: "已完成前置",
        ready: "false",
        selected: "false",
        stage: "done",
        card: "true",
        state: "CLOSED"
      }
    ]);
  });
});
