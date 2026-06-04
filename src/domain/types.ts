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

// 派活提示词的契约类型：被「标准提示词层」数据、「提示词拼装器」逻辑，以及将来
// 派活核心（命令构造器等）共用，故住共享 types（与 Card 同理），数据与逻辑都依赖它。
export type DispatchPromptStage = "start" | "submit" | "review" | "merge" | "handoff";

export type DispatchCardType = "code-pr" | "prd-design-pr";

export interface PromptStageCopy {
  prompt: string;
}

export interface StandardPromptLayer {
  common: string;
  stages: {
    start: PromptStageCopy;
    submit: PromptStageCopy;
    review: PromptStageCopy & {
      cardTypes: Record<DispatchCardType, string>;
    };
    merge: PromptStageCopy;
    handoff: PromptStageCopy;
  };
}
