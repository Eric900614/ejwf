import type { Card } from "./types";

export type CardStage = "triage" | "ready" | "review" | "acceptance" | "done";

export interface StageDefinition {
  id: CardStage;
  label: string;
  color: string;
}

// Stage colors live once in the design tokens (src/styles.css `@theme`). We
// reference them by CSS variable here so the graph and the UI take color from
// the same source (ADR-0004) instead of duplicating hex values. `color` is a
// `var(...)` usable directly in DOM inline styles; cytoscape (canvas) resolves
// it to a concrete value via getComputedStyle (see DependencyGraphView).
export const stageDefinitions: StageDefinition[] = (
  [
    { id: "triage", label: "待打理" },
    { id: "ready", label: "待开发" },
    { id: "review", label: "开发审查中" },
    { id: "acceptance", label: "待我验收" },
    { id: "done", label: "完成" }
  ] satisfies Array<Omit<StageDefinition, "color">>
).map((stage) => ({ ...stage, color: `var(--color-stage-${stage.id})` }));

const triageLabels = new Set(["needs-triage", "needs-info"]);
const readyLabels = new Set(["ready-for-agent", "ready-for-human"]);

export function deriveCardStage(card: Card): CardStage {
  if (card.state === "CLOSED") {
    return "done";
  }

  const labels = new Set(card.labels?.map((label) => label.name) ?? []);
  if (hasAny(labels, triageLabels)) {
    return "triage";
  }

  const pullRequests = card.associatedPullRequests ?? [];
  if (pullRequests.some((pullRequest) => pullRequest.state === "OPEN")) {
    return "review";
  }

  if (pullRequests.some((pullRequest) => pullRequest.state === "MERGED") || labels.has("needs-smoke")) {
    return "acceptance";
  }

  if (hasAny(labels, readyLabels)) {
    return "ready";
  }

  return "triage";
}

function hasAny(values: Set<string>, candidates: Set<string>): boolean {
  return [...candidates].some((candidate) => values.has(candidate));
}
