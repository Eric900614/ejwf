import { useState } from "react";
import { DependencyGraphView } from "./components/DependencyGraphView";
import { buildDependencyGraph, type GraphNode } from "./domain/graph";
import { buildPrdGroups } from "./domain/prdGroups";
import { deriveCardStage, stageDefinitions } from "./domain/stage";
import { adrDocuments, cards, fetchedAt, sourceRepo } from "./data/cards.generated";
import type { ResolvedAdrReference } from "./domain/adr";

const graph = buildDependencyGraph(cards);
const prdGroups = buildPrdGroups(graph);
const readyByCardNumber = new Map(graph.nodes.map((node) => [node.card.number, node.isReady]));
const cardByNumber = new Map(cards.map((card) => [card.number, card]));
const adrDocumentByCode = new Map(adrDocuments.map((document) => [document.code, document]));
const defaultSelectedNodeId =
  graph.nodes.find((node) => node.relations.adrReferences.length > 0)?.id ?? graph.nodes[0]?.id;
const fetchedLabel = fetchedAt ? new Date(fetchedAt).toLocaleString("zh-CN") : "尚未拉取";

export function App() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(defaultSelectedNodeId);
  const [viewMode, setViewMode] = useState<"prd" | "dag">("prd");
  const selectedNode = graph.nodes.find((node) => node.id === selectedNodeId);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Agents 团队驾驶舱</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950">
              按 PRD 分组
            </h1>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <div
              aria-label="视图切换"
              className="inline-grid grid-cols-2 rounded border border-slate-200 bg-slate-100 p-1 text-sm"
              role="group"
            >
              <button
                className={viewMode === "prd" ? activeViewButtonClass : inactiveViewButtonClass}
                onClick={() => setViewMode("prd")}
                type="button"
              >
                按 PRD 分组
              </button>
              <button
                className={viewMode === "dag" ? activeViewButtonClass : inactiveViewButtonClass}
                onClick={() => setViewMode("dag")}
                type="button"
              >
                依赖图
              </button>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-6">
              <Metric label="repo" value={sourceRepo} />
              <Metric label="分组" value={String(prdGroups.length)} />
              <Metric label="卡片" value={String(graph.nodes.length)} />
              <Metric label="依赖边" value={String(graph.edges.length)} />
              <Metric label="就绪" value={String(graph.nodes.filter((node) => node.isReady).length)} />
              <Metric label="拉取时间" value={fetchedLabel} />
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-h-[560px] self-start overflow-auto rounded border border-slate-200 bg-white">
          <DependencyGraphView
            graph={graph}
            groups={viewMode === "prd" ? prdGroups : undefined}
            layoutMode={viewMode === "prd" ? "grouped" : "dag"}
            onSelectNodeId={setSelectedNodeId}
            selectedNodeId={selectedNodeId}
          />
        </div>
        <aside className="rounded border border-slate-200 bg-white p-4">
          <NodeDetails
            adrDocumentByCode={adrDocumentByCode}
            node={selectedNode}
            sourceRepo={sourceRepo}
          />

          <h2 className="text-base font-semibold">阶段图例</h2>
          <div className="mt-3 grid grid-cols-1 gap-2">
            {stageDefinitions.map((stage) => (
              <div className="flex items-center gap-2 text-sm text-slate-700" key={stage.id}>
                <span
                  aria-hidden="true"
                  className="h-3 w-3 rounded-sm"
                  style={{ backgroundColor: stage.color }}
                />
                <span>{stage.label}</span>
              </div>
            ))}
          </div>

          <h2 className="mt-5 text-base font-semibold">箭头图例</h2>
          <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <span
                className="h-0 w-8 border-t-2"
                style={{ borderColor: "var(--color-dep-blocking)" }}
                aria-hidden="true"
              />
              <span>仍在阻塞</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="h-0 w-8 border-t-2 border-dashed"
                style={{ borderColor: "var(--color-dep-satisfied)" }}
                aria-hidden="true"
              />
              <span>已满足</span>
            </div>
          </div>

          <h2 className="mt-5 text-base font-semibold">卡片列表</h2>
          <div className="mt-3 max-h-[520px] space-y-2 overflow-auto pr-1">
            {cards.map((card) => (
              <a
                className="block rounded border border-slate-200 px-3 py-2 text-sm hover:border-sky-400 hover:bg-sky-50"
                href={card.url}
                key={card.number}
                rel="noreferrer"
                target="_blank"
              >
                <span className="flex items-start gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-1 h-2.5 w-2.5 shrink-0 rounded-sm"
                    style={{ backgroundColor: stageColorById[deriveCardStage(card)] }}
                  />
                  <span className="min-w-0">
                    <span className="font-semibold text-slate-700">#{card.number}</span>{" "}
                    <span className="text-slate-900">{card.title}</span>
                    {readyByCardNumber.get(card.number) ? (
                      <span className="ml-2 inline-block rounded-sm bg-yellow-100 px-1.5 py-0.5 text-xs font-medium text-yellow-800">
                        就绪
                      </span>
                    ) : null}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

const stageColorById = Object.fromEntries(
  stageDefinitions.map((stage) => [stage.id, stage.color])
) as Record<(typeof stageDefinitions)[number]["id"], string>;
const activeViewButtonClass =
  "rounded-sm bg-white px-3 py-1.5 font-semibold text-slate-950 shadow-sm";
const inactiveViewButtonClass =
  "rounded-sm px-3 py-1.5 font-medium text-slate-600 hover:bg-white/70 hover:text-slate-950";

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded border border-slate-200 bg-slate-50 px-3 py-2">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="truncate text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}

function NodeDetails({
  adrDocumentByCode,
  node,
  sourceRepo
}: {
  adrDocumentByCode: Map<string, ResolvedAdrReference>;
  node?: GraphNode;
  sourceRepo: string;
}) {
  if (!node) {
    return (
      <section className="mb-5 border-b border-slate-200 pb-5">
        <h2 className="text-base font-semibold">节点详情</h2>
        <p className="mt-2 text-sm text-slate-500">未选中节点</p>
      </section>
    );
  }

  const labels = node.card.labels?.map((label) => label.name) ?? [];
  const pullRequests = node.card.associatedPullRequests ?? [];
  const parentPrd = node.relations.parentPrd;
  const parentCard = parentPrd ? cardByNumber.get(parentPrd.parentNumber) : undefined;
  const parentUrl =
    parentCard?.url ?? (parentPrd ? `https://github.com/${sourceRepo}/issues/${parentPrd.parentNumber}` : undefined);

  return (
    <section className="mb-5 border-b border-slate-200 pb-5">
      <h2 className="text-base font-semibold">节点详情</h2>
      <div className="mt-3 space-y-3 text-sm text-slate-700">
        <div>
          <p className="font-semibold text-slate-900">
            #{node.card.number} {node.card.title}
          </p>
          {node.isReady ? <p className="mt-1 font-medium text-yellow-700">就绪</p> : null}
        </div>

        <DetailRow label="标签" value={labels.length > 0 ? labels.join(" / ") : "无"} />
        <DetailRow
          label="关联 PR"
          value={
            pullRequests.length > 0
              ? pullRequests.map((pullRequest) => `#${pullRequest.number} ${pullRequest.state}`).join(" / ")
              : "无"
          }
        />

        <div>
          <p className="text-xs font-medium uppercase text-slate-500">归属 PRD</p>
          {parentPrd && parentUrl ? (
            <a
              className="mt-1 inline-block text-sky-700 hover:text-sky-900"
              href={parentUrl}
              rel="noreferrer"
              target="_blank"
            >
              #{parentPrd.parentNumber} {parentPrd.title ?? parentCard?.title ?? "PRD"}
            </a>
          ) : (
            <p className="mt-1 text-slate-500">无</p>
          )}
        </div>

        <div>
          <p className="text-xs font-medium uppercase text-slate-500">引用 ADR</p>
          {node.relations.adrReferences.length > 0 ? (
            <ul className="mt-1 space-y-1">
              {node.relations.adrReferences.map((reference) => {
                const document = adrDocumentByCode.get(reference.code);

                return (
                  <li key={reference.code}>
                    {document?.url ? (
                      <a
                        className="text-sky-700 hover:text-sky-900"
                        href={document.url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {reference.code} — {document.title}
                      </a>
                    ) : (
                      <span>
                        {reference.code}
                        {document?.title ? ` — ${document.title}` : ""}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-1 text-slate-500">无</p>
          )}
        </div>
      </div>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-slate-700">{value}</p>
    </div>
  );
}
