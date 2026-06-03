import { describe, expect, it } from "vitest";
import { deriveCardStage, type CardStage } from "./stage";
import type { Card, PullRequestState } from "./types";

describe("deriveCardStage", () => {
  it.each([
    ["CLOSED", [], [], "done"],
    ["CLOSED", ["needs-info"], ["OPEN"], "done"],
    ["OPEN", ["needs-triage"], [], "triage"],
    ["OPEN", ["needs-info"], [], "triage"],
    ["OPEN", ["needs-info"], ["OPEN"], "triage"],
    ["OPEN", ["ready-for-agent"], ["OPEN"], "review"],
    ["OPEN", ["ready-for-human"], ["OPEN"], "review"],
    ["OPEN", ["ready-for-agent"], ["MERGED"], "acceptance"],
    ["OPEN", ["needs-smoke"], [], "acceptance"],
    ["OPEN", ["ready-for-agent"], [], "ready"],
    ["OPEN", ["ready-for-human"], [], "ready"],
    ["OPEN", [], [], "triage"]
  ] satisfies Array<[Card["state"], string[], PullRequestState[], CardStage]>)(
    "%s + %j labels + %j PRs -> %s",
    (state, labels, pullRequestStates, expectedStage) => {
      expect(
        deriveCardStage(
          card({
            state,
            labels,
            pullRequestStates
          })
        )
      ).toBe(expectedStage);
    }
  );
});

function card({
  state,
  labels,
  pullRequestStates
}: {
  state: Card["state"];
  labels: string[];
  pullRequestStates: PullRequestState[];
}): Card {
  return {
    number: 1,
    title: "测试卡片",
    body: "",
    state,
    labels: labels.map((name) => ({ name })),
    associatedPullRequests: pullRequestStates.map((prState, index) => ({
      number: index + 1,
      state: prState
    }))
  };
}
