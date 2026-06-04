import { useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ExternalLink,
  Eye,
  EyeOff,
  Gauge,
  LayoutGrid,
  List,
  Network,
  Palette,
  RefreshCw,
  X
} from "lucide-react";
import { DependencyGraphView } from "./components/DependencyGraphView";
import { buildDependencyGraph, type GraphNode } from "./domain/graph";
import { lintCards } from "./domain/linter";
import { buildPrdGroups } from "./domain/prdGroups";
import { deriveCardStage, stageDefinitions } from "./domain/stage";
import { filterVisibleGraph } from "./domain/visibleGraph";
import { adrDocuments, cards, fetchedAt, sourceRepo } from "./data/cards.generated";
import type { Card, ParseWarning } from "./domain/types";
import type { ResolvedAdrReference } from "./domain/adr";

const graph = buildDependencyGraph(cards);
const lintWarnings = lintCards(cards);
const readyByCardNumber = new Map(graph.nodes.map((node) => [node.card.number, node.isReady]));
const cardByNumber = new Map(cards.map((card) => [card.number, card]));
const adrDocumentByCode = new Map(adrDocuments.map((document) => [document.code, document]));
const fetchedLabel = fetchedAt ? new Date(fetchedAt).toLocaleString("zh-CN") : "尚未拉取";
const stageColorById = Object.fromEntries(
  stageDefinitions.map((stage) => [stage.id, stage.color])
) as Record<(typeof stageDefinitions)[number]["id"], string>;

type SidebarTab = "list" | "linter" | "legend";

export function App() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(undefined);
  const [viewMode, setViewMode] = useState<"prd" | "dag">("prd");
  const [showClosedCards, setShowClosedCards] = useState(false);
  const [refreshState, setRefreshState] = useState<"idle" | "refreshing" | "failed">("idle");
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("list");
  const [wheelSensitivity, setWheelSensitivity] = useState(0.3);

  // Memoize so the filtered graph and groups keep a stable identity across
  // renders that don't toggle showClosedCards — otherwise every node tap hands
  // DependencyGraphView fresh graph/groups props and forces a full cytoscape
  // rebuild (re-running the layout + cy.fit(), discarding the user's pan/zoom).
  const visibleGraph = useMemo(() => filterVisibleGraph(graph, { showClosedCards }), [showClosedCards]);
  const prdGroups = useMemo(() => buildPrdGroups(visibleGraph), [visibleGraph]);
  const selectedNode = visibleGraph.nodes.find((node) => node.id === selectedNodeId);
  const visibleCards = visibleGraph.nodes.map((node) => node.card);
  const hiddenClosedCount = graph.nodes.length - visibleGraph.nodes.length;
  const readyCount = visibleGraph.nodes.filter((node) => node.isReady).length;

  async function refreshFromGitHub() {
    setRefreshState("refreshing");

    try {
      const response = await fetch("/api/refresh", { method: "POST" });

      if (!response.ok) {
        throw new Error("refresh failed");
      }

      window.location.reload();
    } catch {
      setRefreshState("failed");
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-console-bg text-console-text lg:h-screen lg:min-h-0 lg:overflow-hidden">
      <header className="shrink-0 border-b border-console-border bg-console-panel">
        <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-console-accent" aria-hidden="true" />
            <span className="text-sm font-semibold tracking-wide">驾驶舱</span>
            <span className="font-mono text-xs text-console-dim">{sourceRepo}</span>
          </div>

          <div
            aria-label="视图切换"
            className="flex items-center rounded-md border border-console-border bg-console-bg p-0.5"
            role="group"
          >
            <SegmentButton
              active={viewMode === "prd"}
              icon={LayoutGrid}
              label="PRD"
              onClick={() => setViewMode("prd")}
              title="按 PRD 分组"
            />
            <SegmentButton
              active={viewMode === "dag"}
              icon={Network}
              label="DAG"
              onClick={() => setViewMode("dag")}
              title="依赖图"
            />
          </div>

          <button
            aria-pressed={showClosedCards}
            className={
              showClosedCards
                ? "flex h-8 items-center gap-1.5 rounded-md border border-console-accent/40 bg-console-accent/10 px-2.5 text-xs font-medium text-console-accent"
                : "flex h-8 items-center gap-1.5 rounded-md border border-console-border bg-console-bg px-2.5 text-xs font-medium text-console-muted transition hover:text-console-text"
            }
            onClick={() => setShowClosedCards((value) => !value)}
            title="显示已关闭卡"
            type="button"
          >
            {showClosedCards ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            <span className="hidden sm:inline">已关闭</span>
          </button>

          <button
            className="flex h-8 items-center gap-1.5 rounded-md border border-console-border bg-console-bg px-2.5 text-xs font-medium text-console-muted transition hover:text-console-text disabled:cursor-wait disabled:opacity-60"
            disabled={refreshState === "refreshing"}
            onClick={refreshFromGitHub}
            title={refreshState === "failed" ? "刷新失败，确认 gh 已登录后重试" : "手动刷新"}
            type="button"
          >
            <RefreshCw className={`h-4 w-4 ${refreshState === "refreshing" ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{refreshState === "failed" ? "重试" : "刷新"}</span>
          </button>

          <label className="flex items-center gap-1.5 text-xs text-console-muted" title="滚轮缩放灵敏度">
            <span className="hidden md:inline">灵敏度</span>
            <input
              aria-label="滚轮缩放灵敏度"
              className="h-1 w-20 cursor-pointer accent-console-accent"
              max={1}
              min={0.05}
              onChange={(event) => setWheelSensitivity(Number(event.target.value))}
              step={0.05}
              type="range"
              value={wheelSensitivity}
            />
          </label>

          <div className="ml-auto flex items-center gap-3 font-mono text-xs">
            <Telemetry label="卡片" value={visibleGraph.nodes.length} />
            <Telemetry label="就绪" tone="ready" value={readyCount} />
            <Telemetry label="依赖边" value={visibleGraph.edges.length} />
            <Telemetry label="Linter" tone={lintWarnings.length > 0 ? "warn" : undefined} value={lintWarnings.length} />
            <span className="hidden text-console-dim xl:inline">{fetchedLabel}</span>
          </div>
        </div>
      </header>

      <div className="grid w-full flex-1 gap-3 p-3 lg:min-h-0 lg:grid-rows-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="relative flex min-h-[560px] flex-col overflow-hidden rounded-lg border border-console-border bg-console-bg lg:min-h-0">
          <div className="min-h-0 flex-1">
            <DependencyGraphView
              graph={visibleGraph}
              groups={viewMode === "prd" ? prdGroups : undefined}
              layoutMode={viewMode === "prd" ? "grouped" : "dag"}
              onSelectNodeId={setSelectedNodeId}
              selectedNodeId={selectedNodeId}
              wheelSensitivity={wheelSensitivity}
            />
          </div>
          <div className="shrink-0 border-t border-console-border px-4 py-2 text-xs text-console-dim">
            默认隐藏已关闭卡。没有箭头通常表示前置已完成并被隐藏；打开“已关闭”可看完整链路。
            {hiddenClosedCount > 0 && !showClosedCards ? ` 当前隐藏 ${hiddenClosedCount} 张已关闭卡。` : ""}
            {refreshState === "failed" ? " 刷新失败，请确认本机 gh 已登录后重试。" : ""}
          </div>

          {selectedNode ? (
            <FloatingDetails
              adrDocumentByCode={adrDocumentByCode}
              node={selectedNode}
              onClose={() => setSelectedNodeId(undefined)}
              sourceRepo={sourceRepo}
            />
          ) : null}
        </div>

        <aside className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-console-border bg-console-panel">
          <div className="flex shrink-0 border-b border-console-border" role="tablist">
            <TabButton
              active={sidebarTab === "list"}
              icon={List}
              label="列表"
              onClick={() => setSidebarTab("list")}
            />
            <TabButton
              active={sidebarTab === "linter"}
              badge={lintWarnings.length || undefined}
              icon={AlertTriangle}
              label="Linter"
              onClick={() => setSidebarTab("linter")}
            />
            <TabButton
              active={sidebarTab === "legend"}
              icon={Palette}
              label="图例"
              onClick={() => setSidebarTab("legend")}
            />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {sidebarTab === "list" ? (
              <CardList
                cards={visibleCards}
                onSelect={setSelectedNodeId}
                selectedNodeId={selectedNodeId}
              />
            ) : null}
            {sidebarTab === "linter" ? <LinterPanel warnings={lintWarnings} /> : null}
            {sidebarTab === "legend" ? <Legend /> : null}
          </div>
        </aside>
      </div>
    </main>
  );
}

function SegmentButton({
  active,
  icon: Icon,
  label,
  onClick,
  title
}: {
  active: boolean;
  icon: typeof LayoutGrid;
  label: string;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      aria-pressed={active}
      className={
        active
          ? "flex items-center gap-1.5 rounded bg-console-accent/15 px-2.5 py-1 text-xs font-semibold text-console-accent"
          : "flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium text-console-muted transition hover:text-console-text"
      }
      onClick={onClick}
      title={title}
      type="button"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function Telemetry({ label, value, tone }: { label: string; value: number; tone?: "ready" | "warn" }) {
  const valueClass =
    tone === "ready" ? "text-ready" : tone === "warn" ? "text-amber-400" : "text-console-text";

  return (
    <span className="flex items-baseline gap-1.5">
      <span className="text-console-dim">{label}</span>
      <span className={`text-sm font-semibold tabular-nums ${valueClass}`}>{value}</span>
    </span>
  );
}

function TabButton({
  active,
  badge,
  icon: Icon,
  label,
  onClick
}: {
  active: boolean;
  badge?: number;
  icon: typeof List;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-selected={active}
      className={
        active
          ? "flex flex-1 items-center justify-center gap-1.5 border-b-2 border-console-accent px-3 py-2.5 text-xs font-semibold text-console-text"
          : "flex flex-1 items-center justify-center gap-1.5 border-b-2 border-transparent px-3 py-2.5 text-xs font-medium text-console-muted transition hover:text-console-text"
      }
      onClick={onClick}
      role="tab"
      type="button"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      {badge ? (
        <span className="rounded bg-amber-400/15 px-1.5 text-[10px] font-semibold text-amber-300">{badge}</span>
      ) : null}
    </button>
  );
}

function CardList({
  cards,
  onSelect,
  selectedNodeId
}: {
  cards: Card[];
  onSelect: (nodeId: string) => void;
  selectedNodeId?: string;
}) {
  if (cards.length === 0) {
    return <p className="text-xs text-console-dim">没有可显示的卡片。</p>;
  }

  return (
    <div className="space-y-1.5">
      {cards.map((card) => {
        const stage = deriveCardStage(card);
        const selected = String(card.number) === selectedNodeId;

        return (
          <button
            className={
              (selected
                ? "border-console-accent/50 bg-console-accent/10"
                : "border-console-border bg-console-bg hover:border-console-border-strong") +
              (card.state === "CLOSED" ? " opacity-60" : "") +
              " flex w-full items-start gap-2 rounded-md border px-2.5 py-2 text-left text-xs transition"
            }
            key={card.number}
            onClick={() => onSelect(String(card.number))}
            type="button"
          >
            <span
              aria-hidden="true"
              className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: stageColorById[stage] }}
            />
            <span className="min-w-0">
              <span className="font-mono text-console-dim">#{card.number}</span>{" "}
              <span className="text-console-text">{card.title}</span>
              {card.state === "CLOSED" ? (
                <span className="ml-1.5 inline-block rounded bg-console-elevated px-1 text-[10px] text-console-dim">
                  已关闭
                </span>
              ) : null}
              {readyByCardNumber.get(card.number) ? (
                <span className="ml-1.5 inline-block rounded bg-ready/15 px-1 text-[10px] font-semibold text-ready">
                  就绪
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Legend() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-console-dim">阶段</p>
        <div className="mt-2 space-y-1.5">
          {stageDefinitions.map((stage) => (
            <div className="flex items-center gap-2 text-xs text-console-muted" key={stage.id}>
              <span aria-hidden="true" className="h-3 w-3 rounded-sm" style={{ backgroundColor: stage.color }} />
              <span>{stage.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-console-dim">圈 / 箭头</p>
        <div className="mt-2 space-y-1.5 text-xs text-console-muted">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-3.5 w-3.5 rounded-full border-2"
              style={{ borderColor: "var(--color-ready)" }}
            />
            <span>金圈 = 就绪可派</span>
          </div>
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="h-0 w-8 border-t-2" style={{ borderColor: "var(--color-dep-blocking)" }} />
            <span>仍在阻塞</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-0 w-8 border-t-2 border-dashed"
              style={{ borderColor: "var(--color-dep-satisfied)" }}
            />
            <span>已满足（指向已关闭前置）</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const warningLabelByKind: Record<ParseWarning["kind"], string> = {
  "dangling-reference": "悬空引用",
  "disconnected-card": "连不上线",
  "invalid-parent": "Parent 格式",
  "malformed-reference": "引用格式",
  "missing-blocked-by": "缺 Blocked by"
};

function describeWarning(warning: ParseWarning): string {
  switch (warning.kind) {
    case "dangling-reference":
      return `这张卡写了被 #${warning.referencedNumber} 挡住，但当前数据里没有这张卡。`;
    case "disconnected-card":
      return "这张卡没有 Parent、Blocked by 或 ADR，看起来没接到主链路上。";
    case "invalid-parent":
      return "这张卡有 Parent 段，但里面没有能解析的 #数字。";
    case "malformed-reference":
      return `${warning.reference} 格式不对，ADR 应该写成 ADR-NNNN。`;
    case "missing-blocked-by":
      return "这张 TB 卡没有 Blocked by 段；没有前置也建议写 None。";
  }
}

function LinterPanel({ warnings }: { warnings: ParseWarning[] }) {
  if (warnings.length === 0) {
    return <p className="text-xs text-console-dim">暂无解析告警 ✓</p>;
  }

  return (
    <ul className="space-y-2">
      {warnings.map((warning, index) => (
        <li
          className="rounded-md border border-amber-500/25 bg-amber-500/5 px-3 py-2 text-xs"
          key={`${warning.kind}-${warning.cardNumber}-${warning.reference ?? warning.referencedNumber ?? index}`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
              {warningLabelByKind[warning.kind]}
            </span>
            {warning.cardUrl ? (
              <a
                className="font-mono text-[11px] text-console-accent hover:underline"
                href={warning.cardUrl}
                rel="noreferrer"
                target="_blank"
              >
                #{warning.cardNumber}
              </a>
            ) : (
              <span className="font-mono text-[11px] text-console-dim">#{warning.cardNumber}</span>
            )}
          </div>
          <p className="mt-1.5 font-medium text-console-text">{warning.cardTitle}</p>
          <p className="mt-0.5 text-console-muted">{describeWarning(warning)}</p>
        </li>
      ))}
    </ul>
  );
}

function FloatingDetails({
  adrDocumentByCode,
  node,
  onClose,
  sourceRepo
}: {
  adrDocumentByCode: Map<string, ResolvedAdrReference>;
  node: GraphNode;
  onClose: () => void;
  sourceRepo: string;
}) {
  const labels = node.card.labels?.map((label) => label.name) ?? [];
  const pullRequests = node.card.associatedPullRequests ?? [];
  const parentPrd = node.relations.parentPrd;
  const parentCard = parentPrd ? cardByNumber.get(parentPrd.parentNumber) : undefined;
  const parentUrl =
    parentCard?.url ?? (parentPrd ? `https://github.com/${sourceRepo}/issues/${parentPrd.parentNumber}` : undefined);

  return (
    <div className="absolute right-3 top-3 z-10 flex max-h-[calc(100%-1.5rem)] w-80 max-w-[calc(100%-1.5rem)] flex-col overflow-hidden rounded-lg border border-console-border-strong bg-console-panel/95 shadow-2xl shadow-black/50 backdrop-blur-md">
      <div className="flex items-start justify-between gap-2 border-b border-console-border px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-console-dim">#{node.card.number}</span>
            {node.isReady ? (
              <span className="rounded bg-ready/15 px-1.5 py-0.5 text-[10px] font-semibold text-ready">就绪</span>
            ) : null}
          </div>
          <p className="mt-1 text-sm font-semibold leading-snug text-console-text">{node.card.title}</p>
        </div>
        <button
          className="shrink-0 rounded p-1 text-console-muted transition hover:bg-console-elevated hover:text-console-text"
          onClick={onClose}
          title="关闭"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm">
        {node.card.url ? (
          <a
            className="inline-flex items-center gap-1.5 text-xs font-medium text-console-accent hover:underline"
            href={node.card.url}
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink className="h-3.5 w-3.5" /> 在 GitHub 打开
          </a>
        ) : null}

        <Field label="标签">
          {labels.length > 0 ? (
            <span className="flex flex-wrap gap-1">
              {labels.map((label) => (
                <span
                  className="rounded bg-console-elevated px-1.5 py-0.5 font-mono text-[11px] text-console-muted"
                  key={label}
                >
                  {label}
                </span>
              ))}
            </span>
          ) : (
            <span className="text-console-dim">无</span>
          )}
        </Field>

        <Field label="关联 PR">
          {pullRequests.length > 0 ? (
            <span className="flex flex-wrap gap-1">
              {pullRequests.map((pullRequest) => (
                <span
                  className="rounded bg-console-elevated px-1.5 py-0.5 font-mono text-[11px] text-console-muted"
                  key={pullRequest.number}
                >
                  #{pullRequest.number} {pullRequest.state}
                </span>
              ))}
            </span>
          ) : (
            <span className="text-console-dim">无</span>
          )}
        </Field>

        <Field label="归属 PRD">
          {parentPrd && parentUrl ? (
            <a className="text-console-accent hover:underline" href={parentUrl} rel="noreferrer" target="_blank">
              #{parentPrd.parentNumber} {parentPrd.title ?? parentCard?.title ?? "PRD"}
            </a>
          ) : (
            <span className="text-console-dim">无</span>
          )}
        </Field>

        <Field label="引用 ADR">
          {node.relations.adrReferences.length > 0 ? (
            <ul className="space-y-1">
              {node.relations.adrReferences.map((reference) => {
                const document = adrDocumentByCode.get(reference.code);

                return (
                  <li key={reference.code}>
                    {document?.url ? (
                      <a
                        className="text-console-accent hover:underline"
                        href={document.url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <span className="font-mono">{reference.code}</span> — {document.title}
                      </a>
                    ) : (
                      <span>
                        <span className="font-mono">{reference.code}</span>
                        {document?.title ? ` — ${document.title}` : ""}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <span className="text-console-dim">无</span>
          )}
        </Field>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-console-dim">{label}</p>
      <div className="mt-1 text-console-text">{children}</div>
    </div>
  );
}
