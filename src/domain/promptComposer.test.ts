import { describe, expect, it } from "vitest";
import { composeDispatchPrompt, type StandardPromptLayer } from "./promptComposer";
import { standardPromptLayer } from "./standardPromptLayer";

describe("composeDispatchPrompt", () => {
  it("拼出开工阶段的通用约定、阶段要求和这张卡 brief", () => {
    const promptLayer: StandardPromptLayer = {
      common: "所有输出使用中文，用大白话简述。",
      stages: {
        start: {
          prompt: "按 TDD 做：先写一条行为测试，再做最小实现。"
        },
        submit: {
          prompt: "提交代码并打开 PR。"
        },
        review: {
          prompt: "进入审查阶段。",
          cardTypes: {
            "code-pr": "按代码 PR 审查。",
            "prd-design-pr": "按 PRD / 设计 PR 审查。"
          }
        },
        merge: {
          prompt: "合并后切回 main。"
        },
        handoff: {
          prompt: "写清交接。"
        }
      }
    };

    const prompt = composeDispatchPrompt({
      stage: "start",
      cardType: "code-pr",
      perCardBrief: "实现 #31 的标准提示词层。",
      promptLayer
    });

    expect(prompt).toContain("所有输出使用中文，用大白话简述。");
    expect(prompt).toContain("按 TDD 做：先写一条行为测试，再做最小实现。");
    expect(prompt).toContain("实现 #31 的标准提示词层。");
  });

  it.each(["start", "submit", "review", "merge", "handoff"] as const)(
    "用真实标准提示词层拼出 %s 阶段，并保留这张卡 brief",
    (stage) => {
      const prompt = composeDispatchPrompt({
        stage,
        cardType: "code-pr",
        perCardBrief: "## What to build\n\n把 #31 做完。",
        promptLayer: standardPromptLayer
      });

      expect(prompt).toContain("注意我们交流的过程中所有的输出使用中文。");
      expect(prompt).toContain("## What to build\n\n把 #31 做完。");
    }
  );

  it("审查阶段按卡类型选择不同提示词", () => {
    const codeReviewPrompt = composeDispatchPrompt({
      stage: "review",
      cardType: "code-pr",
      perCardBrief: "审查代码 PR。",
      promptLayer: standardPromptLayer
    });
    const prdReviewPrompt = composeDispatchPrompt({
      stage: "review",
      cardType: "prd-design-pr",
      perCardBrief: "审查 PRD。",
      promptLayer: standardPromptLayer
    });

    expect(codeReviewPrompt).toContain("按代码 PR 审查。");
    expect(codeReviewPrompt).not.toContain("按 PRD / 设计 PR 审查。");
    expect(prdReviewPrompt).toContain("按 PRD / 设计 PR 审查。");
    expect(prdReviewPrompt).not.toContain("按代码 PR 审查。");
  });
});
