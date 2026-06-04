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

  it("下一个二级标题没有空格时也会收口，但不会被三级标题截断", () => {
    const body = [
      "## Blocked by",
      "",
      "- #2",
      "",
      "### Detail",
      "",
      "仍属本段 #3",
      "",
      "##Notes",
      "",
      "不属本段 #99"
    ].join("\n");

    expect(extractSection(body, "Blocked by")?.trim()).toBe("- #2\n\n### Detail\n\n仍属本段 #3");
  });

  it("空 section 位于正文末尾时返回空字符串，而不是 undefined", () => {
    const body = ["## What to build", "", "做点东西。", "", "## Blocked by"].join("\n");

    expect(extractSection(body, "Blocked by")).toBe("");
  });

  it("空 section 后面紧跟下一个二级标题时返回空字符串", () => {
    const body = ["## Blocked by", "## Notes", "", "不属本段 #99"].join("\n");

    expect(extractSection(body, "Blocked by")).toBe("");
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
