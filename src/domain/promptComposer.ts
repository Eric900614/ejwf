import type {
  DispatchCardType,
  DispatchPromptStage,
  StandardPromptLayer
} from "./types";

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
  const stageCopy = promptLayer.stages[stage];
  const cardTypeCopy =
    stage === "review" ? promptLayer.stages.review.cardTypes[cardType] : undefined;

  // 每节自带「标题 + 空行 + 正文」，再用空行把各节连起来——保证段落分隔一致。
  // （卡类型节只在审查阶段存在，不存在时为 undefined，统一在末尾过滤掉。）
  const sections = [
    "# 派活提示词",
    `## 通用约定\n\n${promptLayer.common.trim()}`,
    `## 阶段要求\n\n${stageCopy.prompt.trim()}`,
    cardTypeCopy ? `## 卡类型要求\n\n${cardTypeCopy.trim()}` : undefined,
    `## 这张卡\n\n${perCardBrief.trim()}`
  ];

  return sections
    .filter((section): section is string => section !== undefined)
    .join("\n\n");
}
