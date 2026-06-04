import { describe, expect, it } from "vitest";
import { formatStaleness } from "./staleness";

describe("formatStaleness", () => {
  const now = new Date("2026-06-04T12:00:00Z");

  it("刚更新的 open 卡显示刚刚动过", () => {
    expect(formatStaleness("2026-06-04T11:58:00Z", now)).toBe("刚刚动过");
  });

  it("不到一天但不是刚更新时显示今天动过", () => {
    expect(formatStaleness("2026-06-04T09:00:00Z", now)).toBe("今天动过");
  });

  it("超过一天按天显示没动多久", () => {
    expect(formatStaleness("2026-06-01T12:00:00Z", now)).toBe("3 天没动");
  });

  it("超过一周按周显示没动多久", () => {
    expect(formatStaleness("2026-05-21T12:00:00Z", now)).toBe("2 周没动");
  });

  it("超过一个月按月显示没动多久", () => {
    expect(formatStaleness("2026-04-05T12:00:00Z", now)).toBe("2 个月没动");
  });
});
