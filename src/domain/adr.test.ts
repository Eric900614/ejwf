import { describe, expect, it } from "vitest";
import { resolveAdrReferences } from "./adr";

describe("resolveAdrReferences", () => {
  it("按 4 位编号前缀匹配 ADR 文件，并读出文件标题", () => {
    expect(
      resolveAdrReferences(
        [
          { code: "ADR-0002", number: "0002" },
          { code: "ADR-9999", number: "9999" }
        ],
        [
          {
            path: "docs/adr/0002-local-app-not-hosted-web.md",
            content: "# 驾驶舱是本地 app，不是托管网页\n\n正文"
          },
          {
            path: "docs/adr/0004-tech-stack-typescript-react-vite-tailwind.md",
            content: "# 技术栈：TypeScript + React + Vite + Tailwind\n"
          }
        ]
      )
    ).toEqual([
      {
        code: "ADR-0002",
        number: "0002",
        path: "docs/adr/0002-local-app-not-hosted-web.md",
        title: "驾驶舱是本地 app，不是托管网页"
      }
    ]);
  });
});
