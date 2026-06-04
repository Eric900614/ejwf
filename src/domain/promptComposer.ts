export type DispatchPromptStage = "start" | "submit" | "review" | "merge" | "handoff";

export type DispatchCardType = "code-pr" | "prd-design-pr";

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

interface PromptStageCopy {
  prompt: string;
}

export interface ComposeDispatchPromptInput {
  stage: DispatchPromptStage;
  cardType: DispatchCardType;
  perCardBrief: string;
  promptLayer: StandardPromptLayer;
}

export function composeDispatchPrompt({
  stage,
  cardType,
  perCardBrief,
  promptLayer
}: ComposeDispatchPromptInput): string {
  const stagePrompt = promptLayer.stages[stage];
  const cardTypePrompt = stage === "review" ? promptLayer.stages.review.cardTypes[cardType] : undefined;

  return [
    "# 派活提示词",
    "",
    "## 通用约定",
    "",
    promptLayer.common.trim(),
    "",
    "## 阶段要求",
    "",
    stagePrompt.prompt.trim(),
    cardTypePrompt ? ["", "## 卡类型要求", "", cardTypePrompt.trim()].join("\n") : undefined,
    "",
    "## 这张卡",
    "",
    perCardBrief.trim()
  ]
    .filter((part): part is string => typeof part === "string" && part.length > 0)
    .join("\n");
}
