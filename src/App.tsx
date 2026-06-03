import { DependencyGraphView } from "./components/DependencyGraphView";
import { buildDependencyGraph } from "./domain/graph";
import { deriveCardStage, stageDefinitions } from "./domain/stage";
import { cards, fetchedAt, sourceRepo } from "./data/cards.generated";

const graph = buildDependencyGraph(cards);
const readyByCardNumber = new Map(graph.nodes.map((node) => [node.card.number, node.isReady]));
const fetchedLabel = fetchedAt ? new Date(fetchedAt).toLocaleString("zh-CN") : "尚未拉取";

export function App() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Agents 团队驾驶舱</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950">
              卡片依赖 DAG
            </h1>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-5">
            <Metric label="repo" value={sourceRepo} />
            <Metric label="卡片" value={String(graph.nodes.length)} />
            <Metric label="依赖边" value={String(graph.edges.length)} />
            <Metric label="就绪" value={String(graph.nodes.filter((node) => node.isReady).length)} />
            <Metric label="拉取时间" value={fetchedLabel} />
          </dl>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-h-[560px] overflow-hidden rounded border border-slate-200 bg-white">
          <DependencyGraphView graph={graph} />
        </div>
        <aside className="rounded border border-slate-200 bg-white p-4">
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded border border-slate-200 bg-slate-50 px-3 py-2">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="truncate text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}
