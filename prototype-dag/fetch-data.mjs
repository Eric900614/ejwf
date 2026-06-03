// ============================================================================
// PROTOTYPE — throwaway. 一次性、只读。用完即删（或把结论折回真代码）。
// ----------------------------------------------------------------------------
// 它在干啥：拉目标仓库的真实 open issues，用确定性正则解析依赖边
//           （## Blocked by 段 / ## Parent 段 / ADR-NNNN），派生 5 桶阶段、
//           算「就绪」，吐成 data.js 供 index.html 画图。
//
// 唯一要回答的真未知（PRD #1, User Story 16）：
//   真实数据画成依赖 DAG，到底清爽好用、还是糊成一团面条？
//
// 不上 LLM（约定已高度结构化，正则即可，可重复可调试）。无 npm 依赖。
// 运行：node fetch-data.mjs owner/repo   （需要本机 gh 已登录）
// ============================================================================

import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const REPO = process.argv[2] || process.env.COCKPIT_REPO;

if (!REPO) {
  console.error("[fetch] 用法：node fetch-data.mjs owner/repo");
  console.error("[fetch] 也可先设置环境变量 COCKPIT_REPO=owner/repo");
  process.exit(1);
}

if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(REPO)) {
  console.error(`[fetch] repo 必须是 owner/repo 格式，收到：${REPO}`);
  process.exit(1);
}

function gh(args) {
  return execFileSync("gh", args, { encoding: "utf8", maxBuffer: 128 * 1024 * 1024 });
}

console.error(`[fetch] 拉取 ${REPO} 的真实数据 …`);

// 1) open issues（带正文，用来解析边）
const openIssues = JSON.parse(
  gh(["issue", "list", "--repo", REPO, "--state", "open", "--limit", "300", "--json", "number,title,body,labels,state"])
);
// 2) 全部 issues 的轻量元数据（无正文）—— 用来解析被引用到的「已关闭」卡的状态/标题/标签
const allMeta = JSON.parse(
  gh(["issue", "list", "--repo", REPO, "--state", "all", "--limit", "600", "--json", "number,title,labels,state"])
);
// 3) open PRs（用来标「开发审查中」）
const openPRs = JSON.parse(
  gh(["pr", "list", "--repo", REPO, "--state", "open", "--limit", "300", "--json", "number,title,body,headRefName"])
);

console.error(
  `[fetch] open issues=${openIssues.length}  all issues=${allMeta.length}  open PRs=${openPRs.length}`
);

// ---- 按编号建索引 -----------------------------------------------------------
const metaByNum = new Map();
for (const m of allMeta) {
  metaByNum.set(m.number, {
    number: m.number,
    title: m.title,
    state: m.state, // OPEN / CLOSED
    labels: (m.labels || []).map((l) => l.name),
  });
}
// open issues 的正文额外存一份
const bodyByNum = new Map();
for (const it of openIssues) bodyByNum.set(it.number, it.body || "");

// ---- 哪些 issue 有 open 关联 PR（解析 PR 正文/标题/分支名里的 #NNN）-----------
const issuesWithOpenPR = new Set();
for (const pr of openPRs) {
  const hay = `${pr.title}\n${pr.body || ""}\n${pr.headRefName || ""}`;
  for (const m of hay.matchAll(/#(\d+)/g)) issuesWithOpenPR.add(Number(m[1]));
  // 分支名常见形如 123-foo 或 feat/123-foo
  for (const m of (pr.headRefName || "").matchAll(/(?:^|\/)(\d+)-/g))
    issuesWithOpenPR.add(Number(m[1]));
}

// ============================================================================
// 关系解析器（模块 3 的原型版）：纯字符串进、结构化关系 + 告警出
// ============================================================================
function parseRelations(body) {
  const warnings = [];
  body = body || "";

  // 取某个 "## 标题" 段的正文行（从该标题下一行，到下一个 "## " 标题或文末）。
  // 注意：JS 正则没有 \Z 末尾锚点，早先用 \Z 会被当字母 Z，导致末段解析全失败 —— 故按行扫。
  const lines = body.split(/\r?\n/);
  function sectionLines(name) {
    const headRe = new RegExp(`^##\\s+${name}\\s*$`, "i");
    let start = -1;
    for (let i = 0; i < lines.length; i++) {
      if (headRe.test(lines[i])) { start = i + 1; break; }
    }
    if (start === -1) return null;
    const out = [];
    for (let i = start; i < lines.length; i++) {
      if (/^##\s/.test(lines[i])) break; // 下一个 H2 标题即段落结束
      out.push(lines[i]);
    }
    return out;
  }

  // --- Blocked by 段：每个 "- #NNN" 取该行首个 #编号（约定是逐条列） ---
  const blockedBy = [];
  const blockLines = sectionLines("Blocked by");
  if (blockLines !== null) {
    for (const ln of blockLines) {
      const m = ln.match(/#(\d+)/);
      if (m) blockedBy.push(Number(m[1]));
    }
  }

  // --- Parent 段：首个 #NNN 作为父 PRD ---
  let prd = null;
  const parentLines = sectionLines("Parent");
  if (parentLines !== null) {
    const m = parentLines.join("\n").match(/#(\d+)/);
    if (m) prd = Number(m[1]);
    else warnings.push("有 ## Parent 段但没解析到 #编号");
  }

  // --- 正文任意处的 ADR-NNNN ---
  const adrs = [...new Set([...body.matchAll(/ADR-(\d{4})/g)].map((m) => m[1]))];

  return { blockedBy: [...new Set(blockedBy)], prd, adrs, warnings };
}

// ============================================================================
// 阶段推导器（模块 4 的原型版）：5 桶，优先级有序匹配
// ============================================================================
function deriveStage(node) {
  const L = new Set(node.labels);
  if (node.state === "CLOSED") return "done"; // 完成
  if (node.hasOpenPR) return "in-review"; // 开发审查中
  if (L.has("needs-triage") || L.has("needs-info")) return "triage"; // 待打理
  if (L.has("ready-for-agent") || L.has("ready-for-human")) return "todo"; // 待开发
  return "accept"; // 待我验收（最弱的兜底桶：open 但无已知信号，可能是合了 PR 待关 / 独立 smoke 卡）
}

// ============================================================================
// 图构建 + 就绪计算（模块 5 的原型版）
// ============================================================================
// 节点集合 = 全部 open issues + 被引用到的（哪怕已关闭的）卡
const nodeNums = new Set(openIssues.map((i) => i.number));
const relByNum = new Map();
for (const it of openIssues) {
  const rel = parseRelations(it.body);
  relByNum.set(it.number, rel);
  for (const b of rel.blockedBy) nodeNums.add(b);
  if (rel.prd != null) nodeNums.add(rel.prd);
}

const linter = [];
const nodes = [];
for (const num of nodeNums) {
  const meta = metaByNum.get(num);
  if (!meta) {
    // 引用了一个仓库里不存在的编号 —— linter 告警，仍画一个占位节点
    linter.push({ number: num, warnings: ["被引用但仓库里查无此卡（悬空引用）"] });
    nodes.push({
      id: String(num), number: num, title: `#${num}（查无此卡）`,
      labels: [], state: "UNKNOWN", stage: "missing", ready: false,
      prd: null, adrs: [], blockedBy: [], hasOpenPR: false, warnings: ["悬空引用"],
    });
    continue;
  }
  const isOpen = openIssues.find((i) => i.number === num);
  const rel = relByNum.get(num) || { blockedBy: [], prd: null, adrs: [], warnings: [] };
  const hasOpenPR = issuesWithOpenPR.has(num) && meta.state === "OPEN";

  const node = {
    id: String(num),
    number: num,
    title: meta.title,
    labels: meta.labels,
    state: meta.state,
    hasOpenPR,
    prd: rel.prd,
    adrs: rel.adrs,
    blockedBy: rel.blockedBy,
    warnings: [...rel.warnings],
  };
  node.stage = deriveStage(node);

  // 就绪 = ready-for-agent 且所有 blocker 已关闭
  const isReadyLabel = meta.labels.includes("ready-for-agent");
  const allBlockersClosed = rel.blockedBy.every((b) => {
    const bm = metaByNum.get(b);
    return bm && bm.state === "CLOSED";
  });
  node.ready = isReadyLabel && allBlockersClosed && node.state === "OPEN";

  // linter：open 卡若既无父 PRD、又无 blocked-by、又无 ADR —— 可能「连不上线」
  if (isOpen && !rel.prd && rel.blockedBy.length === 0 && rel.adrs.length === 0) {
    node.warnings.push("无父 PRD / 无 Blocked by / 无 ADR —— 可能连不上线");
  }
  if (isOpen && node.warnings.length) linter.push({ number: num, warnings: node.warnings });

  nodes.push(node);
}

// ---- 边 --------------------------------------------------------------------
// blocked-by：方向 = 前置卡(blocker) → 被挡卡，使前置卡排在上层、依赖向下流
const edges = [];
const nodeIds = new Set(nodes.map((n) => n.id));
for (const n of nodes) {
  for (const b of n.blockedBy) {
    if (nodeIds.has(String(b))) edges.push({ source: String(b), target: n.id, type: "blocks" });
  }
  if (n.prd != null && nodeIds.has(String(n.prd)) && n.prd !== n.number) {
    edges.push({ source: String(n.prd), target: n.id, type: "prd" });
  }
}

// ---- 汇总写盘 --------------------------------------------------------------
const stageCounts = {};
for (const n of nodes) stageCounts[n.stage] = (stageCounts[n.stage] || 0) + 1;

const data = {
  repo: REPO,
  fetchedAt: new Date().toISOString(),
  counts: {
    openIssues: openIssues.length,
    nodes: nodes.length,
    edges: edges.length,
    ready: nodes.filter((n) => n.ready).length,
    byStage: stageCounts,
  },
  nodes,
  edges,
  linter,
};

writeFileSync(
  new URL("./data.js", import.meta.url),
  `// 自动生成 —— 勿手改。重新运行 fetch-data.mjs 即刷新。\nwindow.COCKPIT_DATA = ${JSON.stringify(data, null, 2)};\n`
);

console.error(
  `[fetch] 完成：${nodes.length} 节点 / ${edges.length} 边 / ${data.counts.ready} 张就绪 / linter ${linter.length} 条`
);
console.error(`[fetch] 阶段分布：${JSON.stringify(stageCounts)}`);
console.error(`[fetch] 已写 data.js —— 打开 index.html 看图`);
