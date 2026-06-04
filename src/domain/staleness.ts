export function formatStaleness(updatedAt: string, now: Date): string {
  const updated = new Date(updatedAt);
  const elapsedMs = now.getTime() - updated.getTime();
  const elapsedDays = Math.floor(elapsedMs / (24 * 60 * 60 * 1000));

  if (elapsedMs < 60 * 60 * 1000) {
    return "刚刚动过";
  }

  if (elapsedDays < 1) {
    return "今天动过";
  }

  if (elapsedDays >= 30) {
    return `${Math.floor(elapsedDays / 30)} 个月没动`;
  }

  if (elapsedDays >= 7) {
    return `${Math.floor(elapsedDays / 7)} 周没动`;
  }

  return `${elapsedDays} 天没动`;
}
