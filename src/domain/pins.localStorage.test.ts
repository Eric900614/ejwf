// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from "vitest";
import { loadPinnedNodeIds, pinCard, unpinCard } from "./pins";

describe("pin storage with localStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("盯、读回、取消都走真实 localStorage，并按 repo 隔离", () => {
    pinCard(localStorage, "owner/repo", 23);

    expect(loadPinnedNodeIds(localStorage, "owner/repo", [22, 23])).toEqual(new Set(["23"]));
    expect(loadPinnedNodeIds(localStorage, "fork/repo", [23])).toEqual(new Set());

    unpinCard(localStorage, "owner/repo", 23);

    expect(loadPinnedNodeIds(localStorage, "owner/repo", [23])).toEqual(new Set());
  });
});
