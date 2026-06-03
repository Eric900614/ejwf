import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { Card } from "../src/domain/types";

interface GhIssue {
  number: number;
  title: string;
  body?: string;
  state: "open" | "closed";
  html_url?: string;
  labels?: Array<{ name: string }>;
  pull_request?: unknown;
}

const repo = process.argv[2] ?? getCurrentRepo();
const outputPath = resolve("src/data/cards.generated.ts");

// `--paginate` with a `--jq` that returns an array emits one array *per page*
// (e.g. `[...]\n[...]`), which is not parseable as a single JSON document. Emit
// one issue object per line instead (NDJSON) so every page concatenates cleanly
// and we can fetch *all* open cards, not just the first 100 (acceptance #2).
const issuesJson = execFileSync(
  "gh",
  [
    "api",
    "--method",
    "GET",
    `repos/${repo}/issues`,
    "-f",
    "state=open",
    "-f",
    "per_page=100",
    "--paginate",
    "--jq",
    ".[] | select(.pull_request == null)",
  ],
  { encoding: "utf8" }
);

const issues = issuesJson
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.length > 0)
  .map((line) => JSON.parse(line) as GhIssue);

const cards = issues.map<Card>((issue) => ({
  number: issue.number,
  title: issue.title,
  body: issue.body ?? "",
  state: issue.state.toUpperCase() as Card["state"],
  url: issue.html_url,
  labels: issue.labels?.map((label) => ({ name: label.name })) ?? []
}));

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(
  outputPath,
  [
    "import type { Card } from \"../domain/types\";",
    "",
    `export const sourceRepo = ${JSON.stringify(repo)};`,
    `export const fetchedAt = ${JSON.stringify(new Date().toISOString())};`,
    `export const cards: Card[] = ${JSON.stringify(cards, null, 2)};`,
    ""
  ].join("\n"),
  "utf8"
);

console.log(`Fetched ${cards.length} open cards from ${repo}`);
console.log(`Wrote ${outputPath}`);

function getCurrentRepo(): string {
  return execFileSync("gh", ["repo", "view", "--json", "nameWithOwner", "-q", ".nameWithOwner"], {
    encoding: "utf8"
  }).trim();
}
