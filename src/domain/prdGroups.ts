import type { DependencyGraph } from "./graph";

export interface PrdGroup {
  id: string;
  title: string;
  nodeIds: string[];
}

export function buildPrdGroups(graph: DependencyGraph): PrdGroup[] {
  const groupsByParentNumber = new Map<number, PrdGroup>();
  const ungrouped: PrdGroup = {
    id: "ungrouped",
    title: "散卡",
    nodeIds: []
  };

  for (const node of graph.nodes) {
    const parentPrd = node.relations.parentPrd;

    if (!parentPrd) {
      ungrouped.nodeIds.push(node.id);
      continue;
    }

    const group =
      groupsByParentNumber.get(parentPrd.parentNumber) ??
      createPrdGroup(parentPrd.parentNumber, parentPrd.title);
    group.nodeIds.push(node.id);
    groupsByParentNumber.set(parentPrd.parentNumber, group);
  }

  return [...groupsByParentNumber.values(), ungrouped].filter(
    (group) => group.nodeIds.length > 0
  );
}

function createPrdGroup(parentNumber: number, title?: string): PrdGroup {
  return {
    id: `prd-${parentNumber}`,
    title: `#${parentNumber}${title ? ` ${title}` : ""}`,
    nodeIds: []
  };
}
