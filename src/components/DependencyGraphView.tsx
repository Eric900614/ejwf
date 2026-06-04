import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import { useEffect, useRef, useState } from "react";
import { getDependencyClusterNodeIds } from "../domain/dependencyCluster";
import type { DependencyGraph } from "../domain/graph";
import type { PrdGroup } from "../domain/prdGroups";
import { buildDependencyGraphElements } from "./dependencyGraphElements";

cytoscape.use(dagre);

// Fallback only; the live value is read from the CSS design token.
const NODE_FONT_FALLBACK = '"PingFang SC", "Microsoft YaHei", ui-sans-serif, system-ui, sans-serif';

// Card nodes render as HTML overlays (cytoscape's canvas label can't lay out a
// number, signal icons and a clamped title together — that fight is what made
// the old badges collide with the title). cytoscape keeps only an invisible
// anchor of this size for layout + edge attachment; the overlay card uses the
// same size so edges meet its border. Keep the two in sync via these constants.
const NODE_CARD_WIDTH = 208;
const NODE_CARD_HEIGHT = 64;

// Inline lucide-style glyphs for the overlay cards. The overlay is plain DOM
// (no React there), so icons are small static SVG strings tinted by currentColor.
const CLOCK_ICON_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 1.8"/></svg>';
const READY_ICON_SVG =
  '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M13 2 4.5 13.4H11l-1 8.6L19.5 9.8H13z"/></svg>';
const PIN_ICON_SVG =
  '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="m12 2.5 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9z"/></svg>';

interface DependencyGraphViewProps {
  activeClusterNodeIds?: ReadonlySet<string>;
  graph: DependencyGraph;
  groups?: PrdGroup[];
  layoutMode?: "dag" | "grouped";
  now?: Date;
  onSelectNodeId?: (nodeId: string | undefined) => void;
  onTogglePinnedNodeId?: (nodeId: string) => void;
  pinnedNodeIds?: ReadonlySet<string>;
  selectedNodeId?: string;
  wheelSensitivity?: number;
}

export function DependencyGraphView({
  activeClusterNodeIds,
  graph,
  groups,
  layoutMode = "dag",
  now,
  onSelectNodeId,
  onTogglePinnedNodeId,
  pinnedNodeIds,
  selectedNodeId,
  wheelSensitivity = 0.3
}: DependencyGraphViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const cardsByNodeIdRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [pinMenu, setPinMenu] = useState<{ nodeId: string; x: number; y: number } | undefined>(undefined);
  const selectedNodeIdRef = useRef(selectedNodeId);
  const sensitivityRef = useRef(wheelSensitivity);

  // Keep the live sensitivity in a ref so the slider retunes wheel zoom without
  // rebuilding the cytoscape instance (which would re-run the layout + fit).
  useEffect(() => {
    sensitivityRef.current = wheelSensitivity;
  }, [wheelSensitivity]);

  useEffect(() => {
    selectedNodeIdRef.current = selectedNodeId;
  }, [selectedNodeId]);

  useEffect(() => {
    if (!containerRef.current || !overlayRef.current) {
      return;
    }

    const container = containerRef.current;
    const overlay = overlayRef.current;

    // cytoscape renders to canvas and cannot read CSS `var(...)`, so resolve the
    // design tokens it still draws (the PRD group boxes and the dependency edges)
    // to concrete colors from the same single source the UI uses (src/styles.css
    // `@theme`, ADR-0004). The card nodes are HTML overlays and read the tokens
    // directly via CSS, so their colors are no longer resolved here.
    const rootStyles = getComputedStyle(document.documentElement);
    const cssVar = (name: string, fallback: string) =>
      rootStyles.getPropertyValue(name).trim() || fallback;
    const satisfiedColor = cssVar("--color-dep-satisfied", "#34d399");
    const blockingColor = cssVar("--color-dep-blocking", "#6b7a90");
    const panelColor = cssVar("--color-console-panel", "#0f1521");
    const groupBorder = cssVar("--color-console-border-strong", "#33405c");
    const groupText = cssVar("--color-console-muted", "#93a1b8");
    const clusterFocusColor = cssVar("--color-dependency-cluster-focus", "#e0f2fe");
    const clusterDimColor = cssVar("--color-dependency-cluster-dim", "#475569");
    const nodeFont = cssVar("--font-sans", NODE_FONT_FALLBACK);

    const cy = cytoscape({
      container,
      elements: buildDependencyGraphElements(graph, { groups, now, pinnedNodeIds, selectedNodeId }),
      layout: getLayout(layoutMode),
      maxZoom: 2,
      minZoom: 0.2,
      // Wheel zoom is handled manually below so its speed stays adjustable;
      // disable the built-in one to avoid double-zooming.
      userZoomingEnabled: false,
      style: [
        {
          // Invisible layout anchor: the visible card is an HTML overlay (built
          // below). Keeping the box transparent-but-present means edges still
          // attach to the card's footprint and taps still hit-test the node.
          selector: 'node[card = "true"]',
          style: {
            "background-opacity": 0,
            "border-width": 0,
            height: `${NODE_CARD_HEIGHT}px`,
            shape: "round-rectangle",
            width: `${NODE_CARD_WIDTH}px`
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
            "font-family": nodeFont,
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
        },
        {
          selector: 'edge[cluster = "active"]',
          style: {
            "line-color": clusterFocusColor,
            "line-opacity": 1,
            "target-arrow-color": clusterFocusColor,
            width: "3px"
          }
        },
        {
          selector: 'edge[cluster = "dimmed"]',
          style: {
            "line-color": clusterDimColor,
            "line-opacity": 0.22,
            "target-arrow-color": clusterDimColor
          }
        }
      ]
    });

    cy.fit(undefined, 36);
    let lastTappedNodeId: string | undefined;
    let lastTapAt = 0;
    cy.on("tap", 'node[card = "true"]', (event) => {
      const nodeId = String(event.target.id());
      const now = Date.now();
      const isDoubleTap = lastTappedNodeId === nodeId && now - lastTapAt <= 320;
      lastTappedNodeId = nodeId;
      lastTapAt = now;

      if (isDoubleTap) {
        onSelectNodeId?.(nodeId);
        fitToNodeIds(cy, getDependencyClusterNodeIds(graph, nodeId));
        return;
      }

      onSelectNodeId?.(selectedNodeIdRef.current === nodeId ? undefined : nodeId);
    });
    cy.on("tap", (event) => {
      setPinMenu(undefined);
      if (event.target === cy) {
        lastTappedNodeId = undefined;
        onSelectNodeId?.(undefined);
      }
    });
    cy.on("cxttap", 'node[card = "true"]', (event) => {
      const nodeId = String(event.target.id());
      const originalEvent = event.originalEvent as MouseEvent | undefined;
      originalEvent?.preventDefault();
      const rect = container.getBoundingClientRect();
      setPinMenu({
        nodeId,
        x: (originalEvent?.clientX ?? rect.left) - rect.left,
        y: (originalEvent?.clientY ?? rect.top) - rect.top
      });
    });

    cyRef.current = cy;

    // Each card node gets one HTML card in the overlay: a stage-colored left
    // rail + a head row (#N, staleness chip, ready bolt) + a 2-line clamped
    // title. Rich layout (flex, icons, ellipsis) is why this is DOM and not a
    // cytoscape canvas label — the card stays scannable instead of letting the
    // number and signals collide with a centered, overflowing title. The card is
    // repositioned and scaled from its node's rendered box on every frame; the
    // separate effect below toggles its selected / cluster state classes.
    const cardsByNodeId = new Map<string, HTMLDivElement>();
    cy.nodes('[card = "true"]').forEach((node) => {
      const card = document.createElement("div");
      card.className = "node-card";
      card.style.width = `${NODE_CARD_WIDTH}px`;
      card.style.height = `${NODE_CARD_HEIGHT}px`;
      card.style.setProperty("--card-stage", `var(--color-stage-${String(node.data("stage"))})`);
      if (node.data("state") === "CLOSED") {
        card.classList.add("is-closed");
      }
      const isReady = node.data("ready") === "true";
      if (isReady) {
        card.classList.add("is-ready");
      }
      if (node.data("pinned") === "true") {
        card.classList.add("is-pinned");
      }

      const head = document.createElement("div");
      head.className = "node-card-head";

      const idEl = document.createElement("span");
      idEl.className = "node-card-id";
      idEl.textContent = `#${node.id()}`;
      head.appendChild(idEl);

      const flags = document.createElement("div");
      flags.className = "node-card-flags";

      const pin = document.createElement("span");
      pin.className = "node-card-pin";
      pin.title = "已盯";
      pin.innerHTML = PIN_ICON_SVG;
      flags.appendChild(pin);

      const stalenessLabel = node.data("stalenessLabel");
      if (typeof stalenessLabel === "string" && stalenessLabel.length > 0) {
        const chip = document.createElement("span");
        chip.className = "node-card-staleness";
        chip.dataset.sev = String(node.data("stalenessSeverity") ?? "recent");
        chip.innerHTML = CLOCK_ICON_SVG;
        const text = document.createElement("span");
        text.textContent = stalenessLabel;
        chip.appendChild(text);
        flags.appendChild(chip);
      }

      if (isReady) {
        const bolt = document.createElement("span");
        bolt.className = "node-card-ready";
        bolt.title = "就绪可派";
        bolt.innerHTML = READY_ICON_SVG;
        flags.appendChild(bolt);
      }

      head.appendChild(flags);

      const titleEl = document.createElement("div");
      titleEl.className = "node-card-title";
      const title = String(node.data("label") ?? "");
      titleEl.textContent = title;
      titleEl.title = title;

      card.append(head, titleEl);
      overlay.appendChild(card);
      cardsByNodeId.set(node.id(), card);
    });
    cardsByNodeIdRef.current = cardsByNodeId;

    const positionOverlays = () => {
      const zoom = cy.zoom();
      cardsByNodeId.forEach((card, id) => {
        const box = cy.getElementById(id).renderedBoundingBox({ includeLabels: false, includeOverlays: false });
        card.style.transform = `translate(${box.x1}px, ${box.y1}px) scale(${zoom})`;
      });
    };

    positionOverlays();
    cy.on("render", positionOverlays);

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
      cy.off("render", positionOverlays);
      cardsByNodeId.forEach((card) => card.remove());
      cardsByNodeIdRef.current = new Map();
      cyRef.current = null;
      cy.destroy();
    };
    // selectedNodeId is intentionally excluded: the initial highlight is seeded
    // above, and the effect below syncs it without rebuilding the whole graph.
  }, [graph, groups, layoutMode, now, onSelectNodeId, onTogglePinnedNodeId]);

  // Reflect selection + cluster focus by toggling classes on the overlay cards
  // and mutating edge data in place — rebuilding the cytoscape instance just to
  // move the highlight would re-run dagre + cy.fit() on every tap, throwing away
  // the user's pan/zoom and flickering.
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) {
      return;
    }

    const hasActiveCluster = Boolean(activeClusterNodeIds && activeClusterNodeIds.size > 0);

    cardsByNodeIdRef.current.forEach((card, id) => {
      const inCluster = activeClusterNodeIds?.has(id) ?? false;
      card.classList.toggle("is-selected", id === selectedNodeId);
      card.classList.toggle("is-cluster-active", hasActiveCluster && inCluster);
      card.classList.toggle("is-dimmed", hasActiveCluster && !inCluster);
      card.classList.toggle("is-pinned", pinnedNodeIds?.has(id) ?? false);
    });

    cy.batch(() => {
      cy.edges().forEach((edge) => {
        edge.data(
          "cluster",
          hasActiveCluster &&
            activeClusterNodeIds?.has(edge.source().id()) &&
            activeClusterNodeIds.has(edge.target().id())
            ? "active"
            : hasActiveCluster
              ? "dimmed"
              : "none"
        );
      });
    });
  }, [activeClusterNodeIds, graph, pinnedNodeIds, selectedNodeId]);

  if (graph.nodes.length === 0) {
    return (
      <div className="flex h-full min-h-[560px] items-center justify-center bg-console-bg p-8 text-center text-sm text-console-dim">
        没有可显示的卡片。
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-console-bg">
      <div aria-label="卡片依赖图" className="h-full w-full" ref={containerRef} />
      <div className="node-overlay" ref={overlayRef} />
      {pinMenu ? (
        <div
          className="pin-menu"
          style={{ left: pinMenu.x, top: pinMenu.y }}
          onContextMenu={(event) => event.preventDefault()}
        >
          <button
            onClick={() => {
              onTogglePinnedNodeId?.(pinMenu.nodeId);
              setPinMenu(undefined);
            }}
            type="button"
          >
            {pinnedNodeIds?.has(pinMenu.nodeId) ? "取消盯" : "盯上"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function fitToNodeIds(cy: cytoscape.Core, nodeIds: ReadonlySet<string>) {
  let collection = cy.collection();

  for (const nodeId of nodeIds) {
    const node = cy.getElementById(nodeId);
    if (node.nonempty()) {
      collection = collection.union(node);
    }
  }

  if (collection.nonempty()) {
    cy.fit(collection, 64);
  }
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
