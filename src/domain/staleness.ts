// Staleness (龄期) = how long an open card has sat since its last activity. The
// severity tier lets the graph color-code the signal (fresh → muted, then amber
// → orange → red as it sits longer) so "what's stuck" is scannable at a glance,
// while `now` stays injected so the buckets are deterministically testable.
export type StalenessSeverity = "fresh" | "recent" | "stale" | "old";

export interface Staleness {
  label: string;
  severity: StalenessSeverity;
}

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export function describeStaleness(updatedAt: string, now: Date): Staleness {
  const elapsedMs = now.getTime() - new Date(updatedAt).getTime();
  const elapsedDays = Math.floor(elapsedMs / DAY_MS);

  if (elapsedMs < HOUR_MS) {
    return { label: "刚刚动过", severity: "fresh" };
  }

  if (elapsedDays < 1) {
    return { label: "今天动过", severity: "fresh" };
  }

  if (elapsedDays >= 30) {
    return { label: `${Math.floor(elapsedDays / 30)} 个月没动`, severity: "old" };
  }

  if (elapsedDays >= 7) {
    return { label: `${Math.floor(elapsedDays / 7)} 周没动`, severity: "stale" };
  }

  return { label: `${elapsedDays} 天没动`, severity: "recent" };
}
