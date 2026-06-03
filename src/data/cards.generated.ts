import type { Card } from "../domain/types";

export const sourceRepo = "Eric900614/ejwf";
export const fetchedAt = "2026-06-03T13:02:45.340Z";
export const cards: Card[] = [
  {
    "number": 8,
    "title": "TB1-7 (AFK): linter 面板 — 列出格式跑偏 / 连不上线的卡",
    "body": "## Parent\n\n#1 — PRD: Agents 团队驾驶舱 — TB1\n\n## What to build\n\n关系解析器顺手当 **linter**：在解析依赖时收集**解析告警**——缺 `## Blocked by` 段而看似应有、引用格式异常、`## Parent` 段无可解析编号、悬空引用（指向不存在的卡）、既无 PRD 又无依赖又无 ADR 的疑似「连不上线」卡等——在界面上单独列出，督促卡片保持干净（US8）。\n\n## Acceptance criteria\n\n- [ ] 关系解析器输出结构化**解析告警**（含格式异常、悬空引用、疑似连不上线）\n- [ ] 界面单独展示 linter 告警清单，可定位到具体卡片\n- [ ] 解析告警带行为单测\n\n## Blocked by\n\n- #5",
    "state": "OPEN",
    "url": "https://github.com/Eric900614/ejwf/issues/8",
    "labels": [
      {
        "name": "ready-for-agent"
      }
    ]
  },
  {
    "number": 7,
    "title": "TB1-6 (AFK): 默认只看 open + 显示已关闭开关 + 手动刷新",
    "body": "## Parent\n\n#1 — PRD: Agents 团队驾驶舱 — TB1\n\n## What to build\n\n落实 ADR-0003：**默认只显示 open 卡**；提供「**显示已关闭卡**」开关，打开时把已关闭卡以灰色背景调出、并补全指向它们的「已满足」依赖箭头，看完整血脉。提供**手动刷新**，把图更新到 GitHub 最新状态（US12）。「没有依赖箭头」需可被解释（提示前置多半已完成、已隐藏），避免误读为缺陷。\n\n## Acceptance criteria\n\n- [ ] 默认视图只显示 open 卡（ADR-0003）\n- [ ] 「显示已关闭卡」开关：打开后已关闭卡灰显、已满足依赖箭头补全；关闭后回到只看 open\n- [ ] 手动刷新能把图拉到 GitHub 最新（US12）\n- [ ] 对「无依赖箭头」给出可解释提示，避免被误读为缺陷\n\n## Blocked by\n\n- #4",
    "state": "OPEN",
    "url": "https://github.com/Eric900614/ejwf/issues/7",
    "labels": [
      {
        "name": "ready-for-agent"
      }
    ]
  },
  {
    "number": 6,
    "title": "TB1-5 (AFK): 按 PRD 分组视图（首选视图）",
    "body": "## Parent\n\n#1 — PRD: Agents 团队驾驶舱 — TB1\n\n## What to build\n\n实现**按 PRD 分组**的视图，作为驾驶舱**首选视图**（ADR-0003）：把 open 卡按其归属 PRD 收进**泳道 / 分组框**，无 PRD 归属的卡进「散卡」组；**依赖图（不分组）作为次选视图**，两者可切换。原型验证此分组方式让几十张卡清爽可读（US16，见 NOTES.md）。\n\n## Acceptance criteria\n\n- [ ] 提供「按 PRD 分组」视图：每张 open 卡进其归属 PRD 的分组；无归属进「散卡」组\n- [ ] 「按 PRD 分组」为默认 / 首选视图，「依赖图」为可切换的次选\n- [ ] 分组视图里依赖边（blocked-by）仍可见\n\n## Blocked by\n\n- #5",
    "state": "OPEN",
    "url": "https://github.com/Eric900614/ejwf/issues/6",
    "labels": [
      {
        "name": "ready-for-agent"
      }
    ]
  },
  {
    "number": 5,
    "title": "TB1-4 (AFK): 为什么链 — 归属 PRD + ADR 引用 + 节点详情",
    "body": "## Parent\n\n#1 — PRD: Agents 团队驾驶舱 — TB1\n\n## What to build\n\n解析卡片的**为什么链**两端：归属 **PRD**（正文 `## Parent` 段的 `#NNN`）与引用的 **ADR**（正文任意处 `ADR-NNNN`）。点开任意节点显示**详情**：标题、标签、关联 PR 状态、归属 PRD（可跳 GitHub issue）、引用的 ADR。\n\n**ADR 读取器**把 `ADR-NNNN` 解析为「文件 + 标题」：读 `docs/adr/NNNN-*.md`，靠 4 位数字前缀匹配，**倾向读 GitHub `main` 版本**（ADR-0002），并提供跳转去读那篇 ADR。\n\n## Acceptance criteria\n\n- [ ] 关系解析器从 `## Parent` 段解析归属 PRD 边、从正文解析 `ADR-NNNN` 引用边\n- [ ] 点节点弹出详情：标题 / 标签 / PR 状态 / 归属 PRD / 引用 ADR（US5/6/7）\n- [ ] ADR 读取器按 4 位前缀把 `ADR-NNNN` 解析为文件 + 标题，取 GitHub `main` 版本（US11）\n- [ ] 详情里能跳去读对应的 PRD（GitHub）与 ADR（仓库文档）\n- [ ] 关系解析器对 PRD / ADR 解析带行为单测（多处 ADR、缺 Parent 段、脏格式等）\n\n## Blocked by\n\n- #2",
    "state": "OPEN",
    "url": "https://github.com/Eric900614/ejwf/issues/5",
    "labels": [
      {
        "name": "ready-for-agent"
      }
    ]
  },
  {
    "number": 4,
    "title": "TB1-3 (AFK): 高亮「就绪」+ 画出已满足的依赖",
    "body": "## Parent\n\n#1 — PRD: Agents 团队驾驶舱 — TB1\n\n## What to build\n\n取回被引用到的**已关闭前置卡**（即便默认不显示，也要据此判定 blocker 是否已关——见 ADR-0003 后果）；计算每张卡是否**就绪**（标签 `ready-for-agent` 且其所有 `Blocked by` 指向的卡都已关闭）；在图上以醒目高亮标出**就绪**卡；并画出指向**已关闭卡**的依赖箭头，作为「已满足」的依赖（US15）。当一张卡的最后一个 blocker 关闭，它应即刻变为就绪高亮（US13）。\n\n## Acceptance criteria\n\n- [ ] GitHub 读取器能取回被引用到的已关闭前置卡的状态\n- [ ] 图构建器 + 就绪计算（纯逻辑）正确判定就绪：`ready-for-agent` 且所有 blocker 已关\n- [ ] 就绪卡在图上醒目高亮\n- [ ] 指向已关闭卡的依赖边作为「已满足」依赖被画出（US15）\n- [ ] 带行为单测，尤其覆盖「最后一个 blocker 关闭 → 变就绪」的边界（US13）\n\n## Blocked by\n\n- #2",
    "state": "OPEN",
    "url": "https://github.com/Eric900614/ejwf/issues/4",
    "labels": [
      {
        "name": "ready-for-agent"
      }
    ]
  },
  {
    "number": 3,
    "title": "TB1-2 (AFK): 节点按阶段上色（5 桶阶段推导）",
    "body": "## Parent\n\n#1 — PRD: Agents 团队驾驶舱 — TB1\n\n## What to build\n\n在依赖图的节点上，按**阶段**给卡片上色。阶段由现有信号**自动派生**为 5 桶（不新增标签、不改写卡习惯）：\n\n- **待打理**：`needs-triage` / `needs-info`\n- **待开发**：`ready-for-agent` / `ready-for-human` 且无 open 关联 PR\n- **开发审查中**：有 open 关联 PR\n- **待我验收**：PR 已合但 issue 未关 / 独立 smoke 卡（判定最弱、可接受）\n- **完成**：issue 已关闭\n\n优先级有序匹配。GitHub 读取器需补充提供卡片的**标签**与**关联 PR 状态**。\n\n## Acceptance criteria\n\n- [ ] 阶段推导器（纯逻辑）：输入（open/closed + 标签 + 关联 PR 状态）→ 输出 5 桶之一，优先级有序匹配\n- [ ] 有 open 关联 PR 的卡判为「开发审查中」（US14）\n- [ ] 图上节点按阶段上色，并配图例\n- [ ] 阶段推导器带枚举式行为单测（open/closed × 标签组合 × PR 状态）\n\n## Blocked by\n\n- #2",
    "state": "OPEN",
    "url": "https://github.com/Eric900614/ejwf/issues/3",
    "labels": [
      {
        "name": "ready-for-agent"
      }
    ]
  },
  {
    "number": 2,
    "title": "TB1-1 (needs-triage): 项目骨架 + 最薄一条龙 — open issues→解析 Blocked by→画出依赖图",
    "body": "## Parent\n\n#1 — PRD: Agents 团队驾驶舱 — TB1：单 repo 只读依赖 DAG\n\n## What to build\n\n驾驶舱的第一条 tracer：给定单个 repo，拉取它的 open **卡片**（issue），解析每张卡正文里的 `## Blocked by` 段得到**依赖边**，在屏幕上渲染成一张**有向图**——节点＝卡片，箭头＝blocked-by（前置→被挡）。\n\n这一刀刻意只走最薄路径：**不上色、不算就绪、不连 PRD/ADR、不做 linter**，只证明「拉数据 → 解析 → 建图 → 画出来」端到端跑得通。\n\n同时确立两条全局基线：\n- **技术栈与技术路线**：本地 app + 一个成熟的 DAG 渲染库（PRD 倾向，不锁）。**本卡为 needs-triage：先与维护者一起决策定栈、定路线，再转 ready-for-agent 放给 AFK agent。**\n- **测试风格基线**：纯逻辑模块用「输入 → 断言输出」的行为测试；ejwf 当前为空 repo，本卡立下范式。\n\n只读，不写回 GitHub（ADR-0001 / ADR-0002）。原型 `prototype-dag/` 已验证此路径可行；正式实现按 `prototype-dag/NOTES.md` 的教训重写，**不直接提升原型代码**。\n\n## Acceptance criteria\n\n- [ ] 技术栈与技术路线经与维护者决策确定，并简短记录（README 或新 ADR）\n- [ ] 给定一个 repo，能拉到它全部 open 卡片，至少含 number / 标题 / 正文\n- [ ] 关系解析器能从卡片正文的 `## Blocked by` 段解析出 blocked-by 依赖边；**必须覆盖「`## Blocked by` 是正文最末段」这一情形**（原型曾因 JS 不支持 `\\Z` 而漏解析，见 NOTES.md）\n- [ ] 屏幕上渲染出「节点 + blocked-by 箭头」的有向图，跑起来肉眼可见\n- [ ] 全程只读，未对 GitHub 产生任何写操作\n- [ ] 关系解析器带「输入 → 输出」行为单测，确立测试风格基线\n\n## Blocked by\n\nNone - 可立即开始（但需先完成 needs-triage 的定栈/定路线决策，再转 AFK）",
    "state": "OPEN",
    "url": "https://github.com/Eric900614/ejwf/issues/2",
    "labels": [
      {
        "name": "enhancement"
      },
      {
        "name": "ready-for-agent"
      }
    ]
  },
  {
    "number": 1,
    "title": "PRD: Agents 团队驾驶舱 — TB1：单 repo 只读依赖 DAG",
    "body": "> 来源：2026-06-03 一场 `/grill-with-docs` 会话（对「Agents 团队驾驶舱」想法的逐枝逼问），随后 `/to-prd`。词汇见 `CONTEXT.md`；架构决策见 `docs/adr/0001`（不接 GitHub Projects、标签+正文为数据主权）与 `docs/adr/0002`（本地 app，不是托管网页）。本卡是「驾驶舱」产品的**第一颗 tracer bullet（TB1）**。\n\n## Problem Statement\n\n我每天用多个 AI agent（Claude Code / Codex）并行做研发，所有上下文和依据都落在本地文档 + GitHub issues 上。但面对一个 repo 里几十张卡，我是「失明」的：\n\n- issue 是扁平的 list / 看板，**看不清卡片之间的依赖、优先级、谁在等谁**。\n- 卡片「为什么存在」的依据（ADR / PRD）被埋在正文里，得一张张点开读。\n- 我曾用 GitHub Projects 看板想治这个病，但它**扁**（装不下依赖/层级）、**死**（agent 不参与、没人喂）、**没有「为什么」**，最终荒废（见 ADR-0001）。\n- 结果：我不知道此刻**哪张卡其实已经「就绪、能马上放给 agent 干」**——所有依赖关系只能靠脑子记。\n\n## Solution\n\n一个跑在我自己机器上的**本地 app**（**只读，碰不坏任何东西**），把单个 repo 的 open issues 画成一张**依赖 DAG（有向图）**：\n\n- 节点 = 卡片，按**阶段**上色；箭头 = `Blocked by`（「谁挡着谁」）。\n- **高亮「就绪」的卡**：标签为 `ready-for-agent` 且其所有 `Blocked by` 指向的卡都已关闭——即现在就能放给 agent 干的卡。这正是当年那块死看板永远给不了我的信息。\n- 每个节点连着它的 **PRD（卡片）** 和 **ADR（仓库文档）**——「为什么链」，点开能看。\n- 所有的线（依赖 / 归属 / ADR 引用）**从我已有的写卡约定里自动解析**：`## Blocked by` 段里的 `#NNN`、正文首行的 `#NNN — …PRD…`、正文任意处的 `ADR-NNNN`。**我一个字都不用改 GitHub。**\n- 解析器顺手当 **linter**：列出格式跑偏、连不上线的卡，督促卡片保持干净。\n\n## User Stories\n\n1. 作为驾驶舱用户，我想把一个 repo 的 open issues 看成一张依赖图，这样我能一眼理清几十张卡的关系，而不用在扁平 list 里靠脑子拼。\n2. 作为驾驶舱用户，我想让每个节点按**阶段**（待打理 / 待开发 / 开发审查中 / 待我验收 / 完成）上色，这样我扫一眼就知道每张卡走到哪一站了。\n3. 作为驾驶舱用户，我想用箭头看到「谁挡着谁」（`Blocked by`），这样依赖关系一目了然。\n4. 作为驾驶舱用户，我想让 app **高亮出「就绪」的卡**（`ready-for-agent` 且所有 blocker 已关），这样我立刻知道现在该把哪张放给 agent，而不必逐张核对依赖。\n5. 作为驾驶舱用户，我想点开任意节点，看到它的标题、标签、关联 PR 状态，这样不必切回 GitHub 就能了解一张卡。\n6. 作为驾驶舱用户，我想在节点上看到它引用的 **ADR**，并能跳去读那篇 ADR 文档，这样卡片的「为什么」触手可及。\n7. 作为驾驶舱用户，我想看到一张 TB 卡归属于哪张 **PRD**，这样我能按需求把相关卡片归组理解。\n8. 作为驾驶舱用户，我想让 app 把「格式跑偏 / 连不上线」的卡单独列出来（linter），这样我能顺手修正写卡约定、让图更准。\n9. 作为驾驶舱用户，我想这个 app **只读、不改我的 GitHub 任何数据**，这样我可以放心地随便点、随便看，零风险。\n10. 作为驾驶舱用户，我想它跑在我自己机器上，这样它将来够得着我本地的 repo 文件和 agent 进程（为后续阶段铺路）。\n11. 作为驾驶舱用户，我想 app 读 ADR 时取 GitHub `main` 上的版本，这样不会被我本地某个脏的 / 别的分支的 worktree 副本搞混（ADR-0002）。\n12. 作为驾驶舱用户，我想手动刷新就能把图更新到 GitHub 的最新状态，这样我能在干活间隙拉一把看看全局。\n13. 作为驾驶舱用户，当一张卡的所有 blocker 关闭后，我想它在图里立刻变成「就绪」高亮，这样依赖解开的那一刻我能马上看见。\n14. 作为驾驶舱用户，我想当一张卡有 open 的关联 PR 时，它显示为「开发审查中」，这样我知道它正在被推进。\n15. 作为驾驶舱用户，我想看到指向**已关闭卡片**的依赖箭头（作为「已满足」的依赖），这样我能理解一条依赖链的完整来龙去脉，而不仅是未完成的部分。\n16. 作为驾驶舱用户，我想图在卡片很多时仍然可读（而不是糊成一团面条），这样它真的比 list 好用——这一点要靠真实数据原型先验证。\n17. 作为驾驶舱用户，我想先只对一个 repo（`foravia`）生效，这样第一版小、能快速跑起来攒真实体会。\n\n## Implementation Decisions\n\n**整体形态**：本地 app，只读（ADR-0002）。数据主权在 GitHub 的标签 + issue 正文，不引入 GitHub Projects（ADR-0001）。依赖、归属、ADR 引用一律**确定性解析**自现有写卡约定，**不上 LLM**（约定已高度结构化，正则即可高精度，且可重复、可调试）。\n\n按职责拆成 6 块模块，刻意把「纯逻辑」和「碰外部 / 界面」分开：\n\n1. **GitHub 读取器**（IO）：输入一个 repo，输出该 repo 的卡片集合（每张含 number / 标题 / 正文 / 标签 / open-closed / 关联 PR 状态）。封装 GitHub 访问细节，对上游只暴露「卡片」这一简单概念。需要同时取**被引用到的已关闭卡片**，以便判定 blocker 是否已关、画出已满足的依赖。\n2. **ADR 读取器**（IO）：把形如 `ADR-0039` 的引用解析为「文件 + 标题」。读取 `docs/adr/NNNN-*.md`，靠 4 位数字前缀匹配；倾向读 GitHub `main` 版本（ADR-0002）。\n3. **关系解析器**（纯逻辑，核心深模块）：输入一张卡的标题 + 正文，输出它的所有**依赖边**——`## Blocked by` 段中的 `#NNN`（blocked-by 边）、正文首行 `#NNN — …` 的父 PRD 归属边、正文中的 `ADR-NNNN` 引用边——并输出**解析告警**（缺 `## Blocked by`、引用格式异常等，喂给 linter）。纯字符串进、结构化关系出，无 IO。\n4. **阶段推导器**（纯逻辑）：输入（卡片 open/closed + 标签 + 关联 PR 状态），输出 5 桶之一：**待打理**（`needs-triage`/`needs-info`）、**待开发**（`ready-for-agent`/`ready-for-human` 且无 open PR）、**开发审查中**（有 open 关联 PR）、**待我验收**（PR 已合但 issue 未关 / 独立 smoke 卡，判定最弱、可接受）、**完成**（issue 已关闭）。优先级有序匹配。\n5. **图构建器 + 就绪计算**（纯逻辑）：把卡片 + 边 + 阶段拼成 DAG 模型，并计算每张卡是否**就绪**（`ready-for-agent` 标签 且 所有 `Blocked by` 指向的卡均已关闭）。\n6. **画图界面**（界面层）：渲染 DAG、按阶段上色、高亮就绪、点节点看详情（PR / ADR / PRD）、单独展示 linter 告警、提供手动刷新。\n\n**阶段模型刻意「粗」**：5 桶全部由现有信号自动派生，**不新增任何标签、不改写卡习惯**；「待我验收 / smoke」一桶判定偏糙，已知并接受，待真实使用后再决定是否补一个干净信号。\n\n## Testing Decisions\n\n- **好测试只验外部行为，不验内部实现**：给定输入 → 断言输出，不窥探模块内部怎么实现。\n- **写测试的模块：3、4、5（三个纯逻辑深模块）**——它们「输入 → 输出」边界干净、便宜、抓真 bug：\n  - 关系解析器（3）：喂各种真实/异常的标题+正文样本（含取自 `foravia` 的真卡），断言解析出的边集合与告警集合。这是命门，覆盖要厚（多条 blocked-by、首行 PRD、多处 ADR 引用、缺段、脏格式等）。\n  - 阶段推导器（4）：枚举（open/closed × 标签组合 × PR 状态）输入，断言落桶正确。\n  - 图构建器 + 就绪计算（5）：给定卡片+边的小图，断言 DAG 结构与「就绪」判定（尤其「最后一个 blocker 关闭 → 变就绪」的边界）。\n- **界面（6）不写单测**，由人工 smoke 验收——对齐 CONTEXT 中「前端体验是人工闸门」的定性。\n- **读取器（1、2）** 用录制的假数据做轻量集成测试，或第一版先不测。\n- 先用 TDD（红-绿-重构）推进 3、4、5。`ejwf` 目前是空 repo，无既有测试可参照，本卡同时确立测试风格基线。\n\n## Out of Scope\n\n- **Phase 2 / 3 的一切**：一键触发 agent、状态变化自动流转、agent 在哪起进程、防止与手动窗口撞车、做完怎么验收才敢推进卡片。（产品最硬的骨头，故意挂起，等 TB1 跑起来有真实体会再 grill。）\n- **跨多个 repo**（TB1 只做 `foravia` 一个）。\n- **架构图（Pillar C）**：从代码接口画系统结构。\n- **实时团队态 / agent 花名册**：此刻哪个 agent 在忙哪张卡（需要 agent 主动上报，是另一摊工程）。\n- **写回 GitHub**：在驾驶舱里「拖动卡片 → 改标签」。TB1 纯只读。\n- **更细的阶段**（开发中 vs 审查中分离、干净的 in-smoke 阶段）与**带类型的更多关系边**（relates / follow-up 等）——超出 blocked-by / PRD / ADR 三类主线。\n- **技术栈锁定**：交给实现阶段决定，不写进本卡。\n\n## Further Notes\n\n- **这是一次 dogfooding**：我们正是用我自己的 skill 流水线（`/grill-with-docs` → `/to-prd`）给「驾驶舱」产品本身开第一刀。\n- **建议的开造第一步是 `prototype`**：拉 `foravia` 的真实卡片，先画一版 DAG，回答「真实数据画出来到底清爽还是面条」——这是 TB1 最大的真未知（User Story 16）。\n- **技术栈倾向**（不锁，仅供参考）：本地 app + 一个成熟的 DAG 渲染库；具体框架由实现 agent 现场定或短 spike 决定。\n- 指导原则（用户原话）：「**先跑起来才能有真实体会**」——TB1 要薄、要能跑、零风险，把更远的设计留给真实手感去校准。\n- **Phase 2/3「派活」要带可配置的「提示词层」**：将来\"一键派活\"不是把卡丢给 agent 就完事——要随卡注入一套**标准/调优提示词**（我平时的工作约定、质量基线、persona）＋ 这张卡的 agent brief，并留好提示词的**调整机制与配置位置**。因为提示词质量直接影响 agent 干得好坏。留待 #4「派活」那轮正式 grill。\n\n",
    "state": "OPEN",
    "url": "https://github.com/Eric900614/ejwf/issues/1",
    "labels": [
      {
        "name": "ready-for-agent"
      }
    ]
  }
];
