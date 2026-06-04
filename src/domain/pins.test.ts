import { describe, expect, it } from "vitest";
import { loadPinnedNodeIds, pinCard, unpinCard } from "./pins";

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

describe("pin storage", () => {
  it("把盯标记按 repo 和卡号隔离存取", () => {
    const storage = new MemoryStorage();

    pinCard(storage, "owner/repo", 23);

    expect(loadPinnedNodeIds(storage, "owner/repo", [22, 23])).toEqual(new Set(["23"]));
    expect(loadPinnedNodeIds(storage, "other/repo", [23])).toEqual(new Set());

    unpinCard(storage, "owner/repo", 23);

    expect(loadPinnedNodeIds(storage, "owner/repo", [23])).toEqual(new Set());
  });
});
