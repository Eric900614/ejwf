import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { resolveAdrReferences, type AdrFile } from "../src/domain/adr";
import { findMissingBlockerNumbers } from "../src/domain/graph";
import { parseCardRelations } from "../src/domain/relations";
import type { Card } from "../src/domain/types";

interface GhIssue {
  number: number;
  title: string;
  body: string;
  state: "OPEN" | "CLOSED";
  url?: string;
  labels?: Array<{ name: string }>;
  closedByPullRequestsReferences?: GhPullRequestReference[];
}

interface GhPullRequestReference {
  number: number;
  url: string;
}

interface GhPullRequest {
  number: number;
  state: "OPEN" | "CLOSED" | "MERGED";
  url?: string;
}

const repo = process.argv[2] ?? getCurrentRepo();
const outputPath = resolve("src/data/cards.generated.ts");

const issuesJson = execFileSync(
  "gh",
  [
    "issue",
    "list",
    "--repo",
    repo,
    "--state",
    "open",
    "--limit",
    "1000",
    "--json",
    "number,title,body,state,url,labels,closedByPullRequestsReferences"
  ],
  { encoding: "utf8" }
);

const openIssues = JSON.parse(issuesJson) as GhIssue[];
const missingBlockerIssues = findMissingBlockerNumbers(openIssues.map(toCard))
  .map((number) => fetchIssue(number))
  .filter((issue): issue is GhIssue => issue !== undefined);
const issues = [...openIssues, ...missingBlockerIssues];
const pullRequestsByUrl = fetchPullRequestsByUrl(
  unique(
    issues.flatMap((issue) =>
      (issue.closedByPullRequestsReferences ?? []).map((pullRequest) => pullRequest.url)
    )
  )
);

const cards = issues.map(toCardWithPullRequests);
const adrDocuments = resolveAdrReferences(
  uniqueAdrReferences(cards),
  loadAdrFilesFromMain(),
  (path) => `https://github.com/${repo}/blob/main/${path.replace(/\\/g, "/")}`
);

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(
  outputPath,
  [
    "import type { Card } from \"../domain/types\";",
    "import type { ResolvedAdrReference } from \"../domain/adr\";",
    "",
    `export const sourceRepo = ${JSON.stringify(repo)};`,
    `export const fetchedAt = ${JSON.stringify(new Date().toISOString())};`,
    `export const cards: Card[] = ${JSON.stringify(cards, null, 2)};`,
    `export const adrDocuments: ResolvedAdrReference[] = ${JSON.stringify(adrDocuments, null, 2)};`,
    ""
  ].join("\n"),
  "utf8"
);

console.log(`Fetched ${openIssues.length} open cards and ${missingBlockerIssues.length} missing blockers from ${repo}`);
console.log(`Wrote ${outputPath}`);

function toCard(issue: GhIssue): Card {
  return {
    number: issue.number,
    title: issue.title,
    body: issue.body ?? "",
    state: issue.state,
    url: issue.url,
    labels: issue.labels?.map((label) => ({ name: label.name })) ?? []
  };
}

function toCardWithPullRequests(issue: GhIssue): Card {
  return {
    ...toCard(issue),
    associatedPullRequests: (issue.closedByPullRequestsReferences ?? [])
      .map((pullRequest) => pullRequestsByUrl.get(pullRequest.url))
      .filter((pullRequest): pullRequest is GhPullRequest => pullRequest !== undefined)
  };
}

function getCurrentRepo(): string {
  return execFileSync("gh", ["repo", "view", "--json", "nameWithOwner", "-q", ".nameWithOwner"], {
    encoding: "utf8"
  }).trim();
}

function fetchPullRequestsByUrl(urls: string[]): Map<string, GhPullRequest> {
  const pullRequestsByUrl = new Map<string, GhPullRequest>();

  for (const url of urls) {
    const pullRequest = JSON.parse(
      execFileSync("gh", ["pr", "view", url, "--json", "number,state,url"], {
        encoding: "utf8"
      })
    ) as GhPullRequest;

    if (pullRequest.url) {
      pullRequestsByUrl.set(pullRequest.url, pullRequest);
    }
  }

  return pullRequestsByUrl;
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function fetchIssue(number: number): GhIssue | undefined {
  try {
    return JSON.parse(
      execFileSync(
        "gh",
        [
          "issue",
          "view",
          String(number),
          "--repo",
          repo,
          "--json",
          "number,title,body,state,url,labels,closedByPullRequestsReferences"
        ],
        { encoding: "utf8" }
      )
    ) as GhIssue;
  } catch {
    return undefined;
  }
}

function uniqueAdrReferences(cards: Card[]) {
  const referencesByCode = new Map(
    cards.flatMap((card) =>
      parseCardRelations(card).adrReferences.map((reference) => [reference.code, reference] as const)
    )
  );

  return [...referencesByCode.values()].sort((left, right) => left.code.localeCompare(right.code));
}

function loadAdrFilesFromMain(): AdrFile[] {
  try {
    const paths = execFileSync("git", ["ls-tree", "-r", "--name-only", "origin/main", "docs/adr"], {
      encoding: "utf8"
    })
      .split(/\r?\n/)
      .filter((path) => path.endsWith(".md"));

    return paths.map((path) => ({
      path,
      content: execFileSync("git", ["show", `origin/main:${path}`], { encoding: "utf8" })
    }));
  } catch {
    return loadLocalAdrFiles();
  }
}

function loadLocalAdrFiles(): AdrFile[] {
  const paths = execFileSync("git", ["ls-files", "docs/adr/*.md"], { encoding: "utf8" })
    .split(/\r?\n/)
    .filter(Boolean);

  return paths.map((path) => ({
    path,
    content: readFileSync(path, "utf8")
  }));
}
