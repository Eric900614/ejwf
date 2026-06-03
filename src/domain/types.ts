export interface Card {
  number: number;
  title: string;
  body: string;
  state: "OPEN" | "CLOSED";
  url?: string;
  labels?: CardLabel[];
  associatedPullRequests?: AssociatedPullRequest[];
}

export interface CardLabel {
  name: string;
}

export type PullRequestState = "OPEN" | "CLOSED" | "MERGED";

export interface AssociatedPullRequest {
  number: number;
  state: PullRequestState;
  url?: string;
}

export interface DependencyEdge {
  blockerNumber: number;
  blockedNumber: number;
}
