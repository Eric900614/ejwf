export interface Card {
  number: number;
  title: string;
  body: string;
  state: "OPEN" | "CLOSED";
  url?: string;
  labels?: CardLabel[];
}

export interface CardLabel {
  name: string;
}

export interface DependencyEdge {
  blockerNumber: number;
  blockedNumber: number;
}
