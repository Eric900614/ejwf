import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import { useEffect, useRef } from "react";
import type { DependencyGraph } from "../domain/graph";
import type { PrdGroup } from "../domain/prdGroups";
import { stageDefinitions } from "../domain/stage";
import { buildDependencyGraphElements } from "./dependencyGraphElements";

cytoscape.use(dagre);

// CJK-friendly, offline system stack for node labels (titles are often Chinese).
const NODE_FONT = '"PingFang SC", "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif';

interface DependencyGraphViewProps {
  graph: DependencyGraph;
  groups?: PrdGroup[];
  layoutMode?: "dag" | "grouped";
  onSelectNodeId?: (nodeId: string | undefined) => void;
  selectedNodeId?: string;
  wheelSensitivity?: number;
}

export function DependencyGraphView({
  graph,
  groups,
  layoutMode = "dag",
  onSelectNodeId,
  selectedNodeId,
  wheelSensitivity = 0.3
}: DependencyGraphViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const sensitivityRef = useRef(wheelSensitivity);

  // Keep the live sensitivity in a ref so the slider retunes wheel zoom without
  // rebuilding the cytoscape instance (which would re-run the layout + fit).
  useEffect(() => {
    sensitivityRef.current = wheelSensitivity;
  }, [wheelSensitivity]);

  useEffect(() => {
    if (!containerRef.current || !overlayRef.current) {
      return;
    }

    const container = containerRef.current;
    const overlay = overlayRef.current;

    // cytoscape renders to canvas and cannot read CSS `var(...)`, so resolve the
    // design tokens to concrete colors from the same single source the UI uses
    // (src/styles.css `@theme`, ADR-0004) instead of duplicating values here.
    const rootStyles = getComputedStyle(document.documentElement);
    const cssVar = (name: string, fallback: string) =>
      rootStyles.getPropertyValue(name).trim() || fallback;
    const stageColor = (stage: (typeof stageDefinitions)[number]) =>
      cssVar(`--color-stage-${stage.id}`, stage.color);
    const stageSurface = (stage: (typeof stageDefinitions)[number]) =>
      cssVar(`--color-stage-${stage.id}-surface`, "#161d2c");
    const readyColor = cssVar("--color-ready", "#fbbf24");
    const satisfiedColor = cssVar("--color-dep-satisfied", "#34d399");
    const blockingColor = cssVar("--color-dep-blocking", "#6b7a90");
    const accentColor = cssVar("--color-console-accent", "#38bdf8");
    const panelColor = cssVar("--color-console-panel", "#0f1521");
    const elevatedColor = cssVar("--color-console-elevated", "#161d2c");
    const groupBorder = cssVar("--color-console-border-strong", "#33405c");
    const groupText = cssVar("--color-console-muted", "#93a1b8");

    const cy = cytoscape({
      container,
      elements: buildDependencyGraphElements(graph, { groups, selectedNodeId }),
      layout: getLayout(layoutMode),
      maxZoom: 2,
      minZoom: 0.2,
      // Wheel zoom is handled manually below so its speed stays adjustable;
      // disable the built-in one to avoid double-zooming.
      userZoomingEnabled: false,
      style: [
        {
          selector: 'node[card = "true"]',
          style: {
            // A deep, neutral body; the stage rule below tints it. The label sits
            // on a dark fill, so it stays crisp with no heavy text-outline.
            "background-color": elevatedColor,
            "border-color": "#2b3650",
            "border-width": "1.5px",
            color: "#eaf0fb",
            "font-family": NODE_FONT,
            "font-size": "11px",
            "font-weight": 500,
            height: "56px",
            label: "data(label)",
            "line-height": 1.3,
            shape: "round-rectangle",
            "text-halign": "center",
            "text-max-width": "152px",
            "text-valign": "center",
            "text-wrap": "wrap",
            width: "188px"
          }
        },
        {
          selector: 'node[group = "true"]',
          style: {
            "background-color": panelColor,
            "background-opacity": 0.55,
            "border-color": groupBorder,
            "border-style": "dashed",
            "border-width": "1.5px",
            color: groupText,
            "font-family": NODE_FONT,
            "font-size": "12px",
            "font-weight": 600,
            label: "data(label)",
            padding: "30px",
            shape: "round-rectangle",
            "text-halign": "center",
            "text-margin-y": -10,
            "text-max-width": "320px",
            "text-valign": "top",
            "text-wrap": "wrap"
          }
        },
        ...stageDefinitions.map((stage) => ({
          selector: `node[card = "true"][stage = "${stage.id}"]`,
          style: {
            "background-color": stageSurface(stage),
            "border-color": stageColor(stage),
            "border-width": "1.5px"
          }
        })),
        {
          selector: 'node[card = "true"][state = "CLOSED"]',
          style: {
            "background-color": "#0f141e",
            "border-color": "#232c3d",
            color: "#6f7d96"
          }
        },
        {
          selector: 'node[card = "true"][ready = "true"]',
          style: {
            "border-color": readyColor,
            "border-width": "3px"
          }
        },
        {
          selector: 'node[card = "true"][selected = "true"]',
          style: {
            "border-color": accentColor,
            "border-width": "3px"
          }
        },
        {
          selector: "edge",
          style: {
            "curve-style": "bezier",
            "line-color": blockingColor,
            "line-opacity": 0.8,
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

    cy.fit(undefined, 36);
    cy.on("tap", 'node[card = "true"]', (event) => {
      onSelectNodeId?.(String(event.target.id()));
    });
    cy.on("tap", (event) => {
      if (event.target === cy) {
        onSelectNodeId?.(undefined);
      }
    });

    cyRef.current = cy;

    // #N corner badges as a synced HTML overlay: cytoscape's canvas label can't
    // style the issue number apart from the title, so the node face shows only
    // the title and each number rides the top-left corner as its own badge,
    // repositioned and scaled from the node's rendered box on every frame.
    const badgeByNodeId = new Map<string, HTMLDivElement>();
    cy.nodes('[card = "true"]').forEach((node) => {
      const badge = document.createElement("div");
      badge.className = "node-badge";
      badge.textContent = `#${node.id()}`;
      overlay.appendChild(badge);
      badgeByNodeId.set(node.id(), badge);
    });

    const positionBadges = () => {
      const zoom = cy.zoom();
      badgeByNodeId.forEach((badge, id) => {
        const box = cy.getElementById(id).renderedBoundingBox({ includeLabels: false, includeOverlays: false });
        badge.style.transform = `translate(${box.x1 + 7 * zoom}px, ${box.y1 + 7 * zoom}px) scale(${zoom})`;
      });
    };

    positionBadges();
    cy.on("render", positionBadges);

    // Adjustable wheel zoom toward the cursor (replaces cytoscape's built-in).
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      let delta = event.deltaY;
      if (event.deltaMode === 1) {
        delta *= 16; // lines -> px (e.g. Firefox mouse wheel)
      } else if (event.deltaMode === 2) {
        delta *= 100; // pages -> px
      }
      const rect = container.getBoundingClientRect();
      const factor = Math.exp(-delta * 0.01 * sensitivityRef.current);
      const level = Math.min(2, Math.max(0.2, cy.zoom() * factor));
      cy.zoom({ level, renderedPosition: { x: event.clientX - rect.left, y: event.clientY - rect.top } });
    };
    container.addEventListener("wheel", handleWheel, { passive: false });

    // Keep the canvas sized to its container (window resize, sidebar toggles,
    // the single-screen flex layout); cytoscape only auto-tracks window resize.
    const resizeObserver = new ResizeObserver(() => cy.resize());
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      resizeObserver.disconnect();
      cy.off("render", positionBadges);
      badgeByNodeId.forEach((badge) => badge.remove());
      cyRef.current = null;
      cy.destroy();
    };
    // selectedNodeId is intentionally excluded: the initial highlight is seeded
    // above, and the effect below syncs it without rebuilding the whole graph.
  }, [graph, groups, layoutMode, onSelectNodeId]);

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
      <div className="flex h-full min-h-[560px] items-center justify-center bg-console-bg p-8 text-center text-sm text-console-dim">
        还没有本地数据。运行 npm run fetch 拉取 open 卡片。
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-console-bg">
      <div aria-label="卡片依赖图" className="h-full w-full" ref={containerRef} />
      <div className="node-overlay" ref={overlayRef} />
    </div>
  );
}

function getLayout(layoutMode: "dag" | "grouped"): cytoscape.LayoutOptions {
  if (layoutMode === "grouped") {
    return {
      name: "preset",
      fit: true,
      padding: 48
    } as cytoscape.LayoutOptions;
  }

  return {
    name: "dagre",
    rankDir: "TB",
    nodeSep: 70,
    rankSep: 110
  } as cytoscape.LayoutOptions;
}
