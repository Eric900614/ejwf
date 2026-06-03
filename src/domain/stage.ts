import type { Card } from "./types";

export type CardStage = "triage" | "ready" | "review" | "acceptance" | "done";

export interface StageDefinition {
  id: CardStage;
  label: string;
  color: string;
}

export const stageDefinitions: StageDefinition[] = [
  { id: "triage", label: "待打理", color: "#f59e0b" },
  { id: "ready", label: "待开发", color: "#2563eb" },
  { id: "review", label: "开发审查中", color: "#7c3aed" },
  { id: "acceptance", label: "待我验收", color: "#db2777" },
  { id: "done", label: "完成", color: "#16a34a" }
];

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
