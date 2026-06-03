import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import { useEffect, useRef } from "react";
import type { DependencyGraph } from "../domain/graph";
import { stageDefinitions } from "../domain/stage";

cytoscape.use(dagre);

interface DependencyGraphViewProps {
  graph: DependencyGraph;
  onSelectNodeId?: (nodeId: string | undefined) => void;
  selectedNodeId?: string;
}

export function DependencyGraphView({
  graph,
  onSelectNodeId,
  selectedNodeId
}: DependencyGraphViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    // cytoscape renders to canvas and cannot read CSS `var(...)`, so resolve the
    // stage design tokens to concrete colors from the same single source the UI
    // uses (src/styles.css `@theme`, ADR-0004).
    const rootStyles = getComputedStyle(document.documentElement);
    const cssVar = (name: string, fallback: string) =>
      rootStyles.getPropertyValue(name).trim() || fallback;
    const stageColor = (stage: (typeof stageDefinitions)[number]) =>
      cssVar(`--color-stage-${stage.id}`, stage.color);
    const readyColor = cssVar("--color-ready", "#facc15");
    const satisfiedColor = cssVar("--color-dep-satisfied", "#16a34a");
    const blockingColor = cssVar("--color-dep-blocking", "#64748b");

    const cy = cytoscape({
      container: containerRef.current,
      elements: [
        ...graph.nodes.map((node) => ({
          data: {
            id: node.id,
            label: `#${node.card.number}\n${node.card.title}`,
            ready: node.isReady ? "true" : "false",
            selected: node.id === selectedNodeId ? "true" : "false",
            stage: node.stage
          }
        })),
        ...graph.edges.map((edge) => ({
          data: {
            id: edge.id,
            source: edge.source,
            status: edge.status,
            target: edge.target
          }
        }))
      ],
      layout: {
        name: "dagre",
        rankDir: "TB",
        nodeSep: 70,
        rankSep: 110
      } as cytoscape.LayoutOptions,
      maxZoom: 2,
      minZoom: 0.2,
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#ffffff",
            "border-color": "#94a3b8",
            "border-width": "2px",
            color: "#0f172a",
            "font-family": "Inter, ui-sans-serif, system-ui, sans-serif",
            "font-size": "11px",
            height: "54px",
            label: "data(label)",
            shape: "round-rectangle",
            "text-halign": "center",
            "text-max-width": "150px",
            "text-valign": "center",
            "text-wrap": "wrap",
            width: "180px"
          }
        },
        ...stageDefinitions.map((stage) => {
          const color = stageColor(stage);
          return {
            selector: `node[stage = "${stage.id}"]`,
            style: {
              "background-color": color,
              "border-color": color,
              color: "#ffffff"
            }
          };
        }),
        {
          selector: 'node[ready = "true"]',
          style: {
            "border-color": readyColor,
            "border-width": "5px"
          }
        },
        {
          selector: 'node[selected = "true"]',
          style: {
            "border-color": "#0f172a",
            "border-width": "6px"
          }
        },
        {
          selector: "edge",
          style: {
            "curve-style": "bezier",
            "line-color": blockingColor,
            "target-arrow-color": blockingColor,
            "target-arrow-shape": "triangle",
            width: "2px"
          }
        },
        {
          selector: 'edge[status = "satisfied"]',
          style: {
            "line-color": satisfiedColor,
            "line-style": "dashed",
            "target-arrow-color": satisfiedColor
          }
        }
      ]
    });

    cy.fit(undefined, 32);
    cy.on("tap", "node", (event) => {
      onSelectNodeId?.(String(event.target.id()));
    });
    cy.on("tap", (event) => {
      if (event.target === cy) {
        onSelectNodeId?.(undefined);
      }
    });

    cyRef.current = cy;

    return () => {
      cyRef.current = null;
      cy.destroy();
    };
    // selectedNodeId is intentionally excluded: the initial highlight is seeded
    // above, and the effect below syncs it without rebuilding the whole graph.
  }, [graph, onSelectNodeId]);

  // Reflect selection by mutating node data in place — rebuilding the cytoscape
  // instance just to move the highlight would re-run dagre + cy.fit() on every
  // tap, throwing away the user's pan/zoom and flickering.
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) {
      return;
    }

    cy.batch(() => {
      cy.nodes().forEach((node) => {
        node.data("selected", node.id() === selectedNodeId ? "true" : "false");
      });
    });
  }, [graph, selectedNodeId]);

  if (graph.nodes.length === 0) {
    return (
      <div className="flex h-full min-h-[560px] items-center justify-center p-8 text-center text-sm text-slate-500">
        还没有本地数据。运行 npm run fetch 拉取 open 卡片。
      </div>
    );
  }

  return <div aria-label="卡片依赖图" className="h-full min-h-[560px]" ref={containerRef} />;
}
