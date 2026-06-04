import type cytoscape from "cytoscape";
import type { DependencyGraph } from "../domain/graph";
import type { PrdGroup } from "../domain/prdGroups";
import { formatStaleness } from "../domain/staleness";

interface DependencyGraphElementOptions {
  groups?: PrdGroup[];
  now?: Date;
  selectedNodeId?: string;
}

export function buildDependencyGraphElements(
  graph: DependencyGraph,
  options: DependencyGraphElementOptions = {}
): cytoscape.ElementDefinition[] {
  const groupByNodeId = new Map<string, string>();

  for (const group of options.groups ?? []) {
    for (const nodeId of group.nodeIds) {
      groupByNodeId.set(nodeId, group.id);
    }
  }

  const nodePositionById = options.groups ? positionGroupedNodes(options.groups) : new Map();
  const now = options.now ?? new Date();

  return [
    ...(options.groups ?? []).map((group) => ({
      data: {
        id: group.id,
        label: group.title,
        group: "true"
      }
    })),
    ...graph.nodes.map((node) => ({
      data: {
        id: node.id,
        label: node.card.title,
        ready: node.isReady ? "true" : "false",
        selected: node.id === options.selectedNodeId ? "true" : "false",
        stage: node.stage,
        card: "true",
        state: node.card.state,
        ...(node.card.state === "OPEN" && node.card.updatedAt
          ? { stalenessLabel: formatStaleness(node.card.updatedAt, now) }
          : {}),
        ...(groupByNodeId.has(node.id) ? { parent: groupByNodeId.get(node.id) } : {})
      },
      ...(nodePositionById.has(node.id) ? { position: nodePositionById.get(node.id) } : {})
    })),
    ...graph.edges.map((edge) => ({
      data: {
        id: edge.id,
        source: edge.source,
        status: edge.status,
        target: edge.target
      }
    }))
  ];
}

function positionGroupedNodes(groups: PrdGroup[]): Map<string, { x: number; y: number }> {
  const positionByNodeId = new Map<string, { x: number; y: number }>();
  const columnGap = 230;
  const rowGap = 145;
  const groupGap = 130;
  let nextGroupTop = 0;

  for (const group of groups) {
    const columns = Math.min(3, Math.max(1, Math.ceil(Math.sqrt(group.nodeIds.length))));
    const rows = Math.max(1, Math.ceil(group.nodeIds.length / columns));

    group.nodeIds.forEach((nodeId, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);

      positionByNodeId.set(nodeId, {
        x: column * columnGap,
        y: nextGroupTop + row * rowGap
      });
    });

    nextGroupTop += rows * rowGap + groupGap;
  }

  return positionByNodeId;
}
