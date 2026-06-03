import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import { useEffect, useRef } from "react";
import type { DependencyGraph } from "../domain/graph";
import { stageDefinitions } from "../domain/stage";

cytoscape.use(dagre);

interface DependencyGraphViewProps {
  graph: DependencyGraph;
}

export function DependencyGraphView({ graph }: DependencyGraphViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    // cytoscape renders to canvas and cannot read CSS `var(...)`, so resolve the
    // stage design tokens to concrete colors from the same single source the UI
    // uses (src/styles.css `@theme`, ADR-0004).
    const rootStyles = getComputedStyle(document.documentElement);
    const stageColor = (stage: (typeof stageDefinitions)[number]) =>
      rootStyles.getPropertyValue(`--color-stage-${stage.id}`).trim() || stage.color;

    const cy = cytoscape({
      container: containerRef.current,
      elements: [
        ...graph.nodes.map((node) => ({
          data: {
            id: node.id,
            label: `#${node.card.number}\n${node.card.title}`,
            stage: node.stage
          }
        })),
        ...graph.edges.map((edge) => ({
          data: {
            id: edge.id,
            source: edge.source,
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
          selector: "edge",
          style: {
            "curve-style": "bezier",
            "line-color": "#64748b",
            "target-arrow-color": "#64748b",
            "target-arrow-shape": "triangle",
            width: "2px"
          }
        }
      ]
    });

    cy.fit(undefined, 32);

    return () => {
      cy.destroy();
    };
  }, [graph]);

  if (graph.nodes.length === 0) {
    return (
      <div className="flex h-full min-h-[560px] items-center justify-center p-8 text-center text-sm text-slate-500">
        还没有本地数据。运行 npm run fetch 拉取 open 卡片。
      </div>
    );
  }

  return <div aria-label="Open 卡片依赖图" className="h-full min-h-[560px]" ref={containerRef} />;
}
