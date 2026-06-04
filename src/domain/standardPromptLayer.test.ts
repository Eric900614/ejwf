import { describe, expect, it } from "vitest";
import { standardPromptLayer } from "./standardPromptLayer";

describe("standardPromptLayer", () => {
  it("收全派活流程的五个阶段，并带上通用交流约定", () => {
    expect(Object.keys(standardPromptLayer.stages)).toEqual([
      "start",
      "submit",
      "review",
      "merge",
      "handoff"
    ]);
    expect(standardPromptLayer.common).toContain("所有的输出使用中文");
    expect(standardPromptLayer.common).toContain("非专业工程师");
    expect(standardPromptLayer.common).toContain("大白话");
  });

  it("审查阶段区分代码 PR 和 PRD / 设计 PR", () => {
    expect(standardPromptLayer.stages.review.cardTypes["code-pr"]).toContain("代码 PR");
    expect(standardPromptLayer.stages.review.cardTypes["prd-design-pr"]).toContain("PRD / 设计 PR");
  });
});
