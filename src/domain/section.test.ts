import { describe, expect, it } from "vitest";
import { extractSection } from "./section";

describe("extractSection", () => {
  it("读出作为正文最后一段的 section（prototype 的 \\Z bug 命门）", () => {
    const body = ["## What to build", "", "做点东西。", "", "## Blocked by", "", "- #3"].join("\n");

    expect(extractSection(body, "Blocked by")).toBe("- #3");
  });

  it("section 在中间时，在下一个 ## 标题处收口（不吃到 Notes 里的 #99）", () => {
    const body = ["## Blocked by", "", "- #2", "", "## Notes", "", "见 #99"].join("\n");

    expect(extractSection(body, "Blocked by")?.trim()).toBe("- #2");
  });

  it("section 不存在时返回 undefined，区别于空 section", () => {
    const body = ["## What to build", "", "没有 Parent 段。"].join("\n");

    expect(extractSection(body, "Parent")).toBeUndefined();
  });

  it("标题匹配大小写不敏感、容忍标题前后空白", () => {
    const body = ["##  blocked by  ", "", "- #5"].join("\n");

    expect(extractSection(body, "Blocked by")).toBe("- #5");
  });
});
