import type { Card } from "../domain/types";
import type { ResolvedAdrReference } from "../domain/adr";

export const sourceRepo = "Eric900614/ejwf";
export const fetchedAt = "2026-06-04T07:07:42.105Z";
export const cards: Card[] = [
  {
    "number": 23,
    "title": "盯/重点：右键盯 + 本地存储 + 星标 +「只看我盯的」（看图体验 v2）",
    "body": "## Parent\n\n#20\n\n## What to build\n\n给卡片加「盯 / 重点」本地标注 + 「只看我盯的」过滤：\n\n- **右键**一张卡把它「盯上」或取消盯；盯了的卡在图上**更醒目**（星标 + 提亮 / 描边）。\n- 标记**只存在本机浏览器的 localStorage**（key = `repo + 卡号`），**不写回 GitHub、不进 repo**（依据 ADR-0006），**跨刷新保留**（接受跨机器 / 跨浏览器不同步、清缓存会丢）。\n- 加一个**「只看我盯的」开关**，一键把图收敛到盯的卡 **+ 它们的血脉**（复用 #21 的血脉计算器）；关掉恢复。\n\n盯用**二元星标**（盯 / 不盯，无高 / 中 / 低分级），与现有三层信号（阶段配色 / 就绪圈 / `#编号` 角标）并存，省视觉预算、防止图变面条。\n\n术语见 `CONTEXT.md`「盯 / 重点 (Pin)」；存储决策见 ADR-0006。\n\n## Acceptance criteria\n\n- [ ] 盯-存储：localStorage 薄封装（key = `repo + 卡号`），核心序列化 / 键名逻辑可注入 Storage 接口测试\n- [ ] 新增 DOM 测试环境（jsdom 或 happy-dom），测盯-存储的**真实 localStorage 读写往返**：盯→存→读回→取消→读空、key 按 repo 隔离（这是对 ADR-0004 测试基线的小扩展；新依赖复核大陆可直连 / 可走镜像）\n- [ ] 右键节点菜单：盯 / 取消盯\n- [ ] 盯的卡视觉更醒目（星标 + 提亮 / 描边），颜色取自 `@theme` 令牌、无硬编码\n- [ ] 新增「盯-过滤器」纯逻辑模块（输入图 + pinned 集合 → 盯的卡及其血脉子图，复用 #21 血脉计算器），配 Vitest 行为测试：空 pinned / 盯单点 / 盯跨簇多点\n- [ ] 「只看我盯的」开关：收敛到盯的卡 + 它们的血脉；关掉恢复全图\n- [ ] 盯跨页面刷新保留\n- [ ] needs-smoke：维护者 smoke 确认右键、星标、过滤的手感\n\n## Blocked by\n\n- #21\n",
    "state": "OPEN",
    "url": "https://github.com/Eric900614/ejwf/issues/23",
    "updatedAt": "2026-06-04T06:31:50Z",
    "createdAt": "2026-06-04T06:31:50Z",
    "labels": [
      {
        "name": "ready-for-agent"
      },
      {
        "name": "needs-smoke"
      }
    ],
    "associatedPullRequests": []
  },
  {
    "number": 22,
    "title": "卡片龄期（多久没动）+ 创建时间（看图体验 v2）",
    "body": "## Parent\n\n#20\n\n## What to build\n\n给每张卡加「龄期」信号 = **距上次活动到现在多久**（即「这卡停了多久没动」，是卡在人工闸门、等维护者推的 HITL 信号），用人话表达（如「3 天没动」「2 周没动」）。龄期只对 **open** 卡显示（closed 卡不显示停滞），使信号聚焦在「还要管的活」。\n\n需要数据层多拉两个时间字段。龄期换算要抽成**与渲染解耦的纯逻辑深模块**，并把「现在」作为参数**注入**以便确定性测试。另外在**节点详情**里显示该卡的**创建时间**，作为静态追溯信息（次要，不作醒目信号）。\n\n术语见 `CONTEXT.md`「龄期 (Staleness)」。**注意区分**：龄期看「上次活动」(`updatedAt`)，不是「创建到现在」(`createdAt`)——两者不一样。\n\n## Acceptance criteria\n\n- [ ] `scripts/fetch-issues.ts` 的 `gh issue list --json` 增加 `updatedAt`、`createdAt`（沿用 argv 数组，无命令注入）；`Card` 类型加可选 `updatedAt` / `createdAt`\n- [ ] 新增「龄期换算器」纯逻辑模块（输入 `updatedAt` + 注入的 now → 人话停滞时长），配 Vitest 行为测试：刚更新、几天、几周、几月等边界\n- [ ] 每张 open 卡在图上显示「多久没动」\n- [ ] 节点详情显示创建时间（静态信息）\n- [ ] 显示文案 / 颜色取自令牌，无硬编码\n- [ ] needs-smoke：维护者 smoke 确认龄期显示正确、易读\n\n## Blocked by\n\nNone - can start immediately\n",
    "state": "OPEN",
    "url": "https://github.com/Eric900614/ejwf/issues/22",
    "updatedAt": "2026-06-04T06:31:26Z",
    "createdAt": "2026-06-04T06:31:26Z",
    "labels": [
      {
        "name": "ready-for-agent"
      },
      {
        "name": "needs-smoke"
      }
    ],
    "associatedPullRequests": []
  },
  {
    "number": 20,
    "title": "看图体验 v2：高亮血脉 + 龄期 + 盯/重点",
    "body": "## Problem Statement\n\nTB1 的只读驾驶舱真实 smoke 后，暴露三个看图缺口：① 图一大，点一张卡看不清它**牵扯哪些卡、整条血脉在哪**；② 卡片看不出**卡了多久没动**——哪些停滞、等我推，一眼看不出；③ 没法在图上标记**当前盯着的重点**，每次都要重新找。\n\n## Solution\n\n在**不改变「纯只读」形态**的前提下，给驾驶舱加三件看图利器：单击高亮整条依赖血脉（其余暗掉）、双击聚焦放大；每张卡显示「多久没动」；右键打本地「盯」标记 + 一键「只看我盯的」。\n\n## User Stories\n\n**血脉（高亮关联簇 + fit）**\n\n1. 作为维护者，我想单击一张卡就高亮它所在的整条依赖血脉（连通分量）、其余卡暗掉，以便一眼看清这张卡牵一发动哪些卡。\n2. 作为维护者，我想血脉包含上游挡它的、下游被它挡的、以及「同被某张卡挡住」的难兄难弟，以便看清共同瓶颈。\n3. 作为维护者，我想双击一张卡 fit 缩放聚焦到它的血脉，以便在大图里快速钻进这一簇。\n4. 作为维护者，我想血脉跟随当前可见范围（默认只 open；打开「显示 closed」后才并入已完成卡），以便已做完、藏起来的卡不会把不相干的卡硬连成一簇。\n5. 作为维护者，我想再次单击可取消高亮、恢复全图，以便在聚焦与全局之间切换。\n\n**龄期**\n\n6. 作为维护者，我想每张 open 卡显示「多久没动」（距上次活动），以便一眼看出哪些卡停滞、可能卡在人工闸门等我推。\n7. 作为维护者，我想龄期用人话表达（如「3 天没动」「2 周没动」），免我心算时间差。\n8. 作为维护者，我想在节点详情里看到这张卡的创建时间（静态信息），以便需要时追溯它建了多久。\n9. 作为维护者，我想龄期只对 open 卡算（closed 卡不显示停滞），使信号聚焦在「还要管的活」上。\n\n**盯 / 重点**\n\n10. 作为维护者，我想右键一张卡把它「盯上」/取消盯，以便标记当前重点。\n11. 作为维护者，我想盯了的卡在图上更醒目（星标 + 提亮/描边），以便一眼找到我盯的卡。\n12. 作为维护者，我想「盯」只存在我本机（不写回 GitHub、不进 repo），以便随手标记而不污染共享数据、不破坏只读。\n13. 作为维护者，我想一个「只看我盯的」开关，一键把图收敛到我盯的卡 + 它们的血脉，以便屏蔽噪声、专注重点。\n14. 作为维护者，我想「盯」跨刷新还在（存 localStorage），免我每次重标；我接受跨机器/跨浏览器不同步、清缓存会丢。\n\n**贯穿**\n\n15. 作为维护者，我想这三件新视觉都从设计令牌单一来源取色（图与 UI 同一套），以便与暗色控制台风格一致、不出现硬编码色。\n16. 作为维护者，我想整轮驾驶舱保持纯只读（不碰 GitHub、不写文件），以便不引入「长出手」的架构风险（那留给将来 Phase 2/3 的派活）。\n\n## Implementation Decisions\n\n- **纯逻辑深模块**（与 React/渲染解耦，照 `src/domain/` 既有范式）：\n  - **血脉计算器**：输入 `DependencyGraph`（已是 `filterVisibleGraph` 后的可见图）+ 起点节点 → 输出该无向连通分量的节点集合。「跟随可见范围」由调用方传入已过滤的图自然满足。\n  - **龄期换算器**：输入 `updatedAt`（ISO 串）+ 注入的「现在」时间 → 输出人类可读的停滞时长字符串。注入 now 以便确定性测试。\n  - **盯-过滤器**：输入 `DependencyGraph` + pinned 卡号集合 → 输出「盯的卡 + 它们的血脉」子图（复用血脉计算器）。叠加在 `visibleGraph` 之上（先按 open/closed 过滤，再按 pinned 过滤）。\n- **盯-存储**：薄封装 localStorage，key = `repo + 卡号`。核心序列化/键名逻辑可注入 Storage 接口测试，真正访问 localStorage 那层薄。（依据 ADR-0006：人工标注一律纯本地存）\n- **数据层**：`scripts/fetch-issues.ts` 的 `gh issue list --json` 增加 `updatedAt`、`createdAt`；`Card` 类型加可选 `updatedAt`/`createdAt`；`toCard` 映射。沿用 argv 数组、无命令注入。\n- **前端交互**（`DependencyGraphView` / `App`）：单击节点→调血脉计算器→给簇成员加高亮、其余加暗掉样式；双击→cytoscape fit 到簇；右键节点→盯/取消盯菜单；「只看我盯的」开关切换盯-过滤器；龄期显示在节点芯片、创建时间在节点详情。所有颜色取自 `styles.css` 的 `@theme` 令牌（cytoscape 经 `getComputedStyle` 共用），不硬编码。\n- 盯用**二元星标**，与现有三层信号（阶段配色 / 就绪圈 / `#编号` 角标）并存，最省视觉预算、防止图变面条。\n\n## Testing Decisions\n\n- **好测试的标准**：只测外部行为（输入 → 断言输出），不测实现细节；prior art = `src/domain/graph.test.ts`、`visibleGraph.test.ts` 等行为测试。\n- **必测（纯逻辑深模块，Vitest 行为测试）**：血脉计算器（链 / 分叉 / 难兄难弟 / 孤立点 / 含与不含 closed）、龄期换算器（注入不同 now，边界如刚更新 / 几天 / 几周 / 几月）、盯-过滤器（空 pinned / 盯单点 / 盯跨簇多点 / 盯的卡 + 血脉）。\n- **测厚增量**（维护者选「测厚一点」）：盯-存储在 **jsdom / happy-dom** 环境下测**真实 localStorage 读写往返**（盯→存→读回→取消盯→读空、key 按 repo 隔离）。这需要给项目新增一个 DOM 测试环境——是对 ADR-0004 测试基线的一次小扩展，新依赖需复核「大陆可直连 / 可走镜像」（jsdom/happy-dom 镜像有，install 一次性联网）。\n- **界面交互的逻辑覆盖**：把交互的「决策」都抽进上述三个纯逻辑积木（点击高亮哪些＝血脉计算器、过滤留哪些＝盯-过滤器），界面层因此薄到主要靠这些积木的测试保障；cytoscape 自身的渲染 / 手感（高亮好不好看、fit 顺不顺）测不出来（cytoscape 在无头环境受限，且属体验），仍走 **smoke 人工验收**（ADR-0005）。\n- 本批属**混合卡**：纯逻辑可自动验收，UI / 体验需 smoke → 该 PRD 拆出的含 UI 的 TB 卡标 `needs-smoke`（ADR-0005）。\n\n## Out of Scope\n\n- **milestone 显示**：真实数据当前无 milestone，做了无法 smoke 验收；等数据里真有再做（届时数据层加 `milestone` 字段）。\n- **半自动 / 全自动派活（#4）**：让驾驶舱「长出手」（拉本地 agent / 写回 GitHub）属 Phase 2/3，本轮明确推后。\n- **盯的跨机器同步 / 持久化到 repo**：ADR-0006 已定本地存；同步留待将来 Phase 2/3 整体迈进后重评。\n- **「盯」的分级优先级（高 / 中 / 低）**：本轮只做二元盯 / 不盯；分级是另一个概念，将来需要再说。\n- **盯影响图的排序 / 布局**：本轮盯不改 dagre 自动布局（避免与自动排版打架），只做视觉强调 + 过滤。\n\n## Further Notes\n\n- 术语已在 `CONTEXT.md` 钉定：**龄期（Staleness）**、**盯 / 重点（Pin）**、**血脉 / 依赖簇（Dependency Cluster）**。\n- 决策已落 **ADR-0006**（人工标注一律纯本地存、不长手）。\n- 这批属「看图体验 polish」，**不是降 HITL 的大头**；但**龄期其实是 HITL 的眼睛**（暴露停滞、等人推的卡）。「盯」曾被考虑做成派活队列雏形（序号排队），维护者最终选了更轻的二元盯——派活队列留到真做 #4 派活时再设计。\n",
    "state": "OPEN",
    "url": "https://github.com/Eric900614/ejwf/issues/20",
    "updatedAt": "2026-06-04T06:21:55Z",
    "createdAt": "2026-06-04T06:21:55Z",
    "labels": [
      {
        "name": "ready-for-agent"
      }
    ],
    "associatedPullRequests": []
  },
  {
    "number": 21,
    "title": "点卡高亮血脉 + 双击 fit（看图体验 v2）",
    "body": "## Parent\n\n#20\n\n## What to build\n\n给依赖图加「点卡看血脉」的交互：单击一张卡，高亮它所在的**整条依赖血脉**——无向连通分量，即顺着依赖边（**不分上下游方向**）能连到的所有卡，含上游挡它的、下游被它挡的、以及「同被某卡挡住」的难兄难弟；其余卡暗掉。双击该卡 **fit 缩放聚焦**到这条血脉；再次单击空白处或同一张卡取消高亮、恢复全图。\n\n血脉计算要抽成一个**与 React/cytoscape 渲染解耦的纯逻辑深模块**（输入已按 open/closed 过滤的可见图 + 起点节点 → 输出该连通分量的节点集合）。这样「血脉跟随当前可见范围」天然成立：默认只含 open 卡；打开「显示 closed」开关后，已完成的卡与边才并入计算。\n\n术语见 `CONTEXT.md`「血脉 / 依赖簇 (Dependency Cluster)」。\n\n## Acceptance criteria\n\n- [ ] 新增「血脉计算器」纯逻辑模块（与渲染解耦），配 Vitest 行为测试：链、分叉、难兄难弟（同被一卡挡）、孤立点、含与不含 closed 的可见图\n- [ ] 单击一张卡：高亮其整条血脉、其余节点暗掉\n- [ ] 双击一张卡：fit 缩放聚焦到该血脉\n- [ ] 再次单击空白处 / 同一张卡：取消高亮、恢复全图\n- [ ] 高亮 / 暗掉的颜色取自 `styles.css` 的 `@theme` 令牌（图经 `getComputedStyle` 共用），无硬编码色\n- [ ] needs-smoke：维护者 smoke 确认高亮与聚焦的手感\n\n## Blocked by\n\nNone - can start immediately\n",
    "state": "CLOSED",
    "url": "https://github.com/Eric900614/ejwf/issues/21",
    "updatedAt": "2026-06-04T07:01:41Z",
    "createdAt": "2026-06-04T06:31:23Z",
    "labels": [
      {
        "name": "ready-for-agent"
      },
      {
        "name": "needs-smoke"
      }
    ],
    "associatedPullRequests": []
  }
];
export const adrDocuments: ResolvedAdrReference[] = [
  {
    "code": "ADR-0004",
    "number": "0004",
    "path": "docs/adr/0004-tech-stack-typescript-react-vite-tailwind.md",
    "title": "驾驶舱技术栈：TypeScript + React/Vite + Tailwind 设计令牌 + cytoscape/dagre + Vitest",
    "url": "https://github.com/Eric900614/ejwf/blob/main/docs/adr/0004-tech-stack-typescript-react-vite-tailwind.md"
  },
  {
    "code": "ADR-0005",
    "number": "0005",
    "path": "docs/adr/0005-acceptance-gate-smoke-vs-auto.md",
    "title": "卡片验收闸门：smoke vs 自动放行，及 `needs-smoke` 信号",
    "url": "https://github.com/Eric900614/ejwf/blob/main/docs/adr/0005-acceptance-gate-smoke-vs-auto.md"
  },
  {
    "code": "ADR-0006",
    "number": "0006",
    "path": "docs/adr/0006-local-annotations-stay-local.md",
    "title": "驾驶舱的私人人工标注纯本地存储，不写回 GitHub、也不进 repo",
    "url": "https://github.com/Eric900614/ejwf/blob/main/docs/adr/0006-local-annotations-stay-local.md"
  }
];
