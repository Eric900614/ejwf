export interface Card {
  number: number;
  title: string;
  body: string;
  state: "OPEN" | "CLOSED";
  url?: string;
  updatedAt?: string;
  createdAt?: string;
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

export interface ParentPrdEdge {
  parentNumber: number;
  childNumber: number;
  title?: string;
}

export interface AdrReferenceEdge {
  cardNumber: number;
  code: string;
  number: string;
}

export type ParseWarningKind =
  | "dangling-reference"
  | "disconnected-card"
  | "invalid-parent"
  | "malformed-reference"
  | "missing-blocked-by";

export interface ParseWarning {
  kind: ParseWarningKind;
  cardNumber: number;
  cardTitle: string;
  cardUrl?: string;
  message: string;
  reference?: string;
  referencedNumber?: number;
}
