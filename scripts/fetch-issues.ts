import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
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

const issues = JSON.parse(issuesJson) as GhIssue[];
const pullRequestsByUrl = fetchPullRequestsByUrl(
  unique(
    issues.flatMap((issue) =>
      (issue.closedByPullRequestsReferences ?? []).map((pullRequest) => pullRequest.url)
    )
  )
);

const cards = issues.map<Card>((issue) => ({
  number: issue.number,
  title: issue.title,
  body: issue.body ?? "",
  state: issue.state,
  url: issue.url,
  labels: issue.labels?.map((label) => ({ name: label.name })) ?? [],
  associatedPullRequests: (issue.closedByPullRequestsReferences ?? [])
    .map((pullRequest) => pullRequestsByUrl.get(pullRequest.url))
    .filter((pullRequest): pullRequest is GhPullRequest => pullRequest !== undefined)
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
