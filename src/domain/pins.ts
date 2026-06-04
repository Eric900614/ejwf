export function pinCard(storage: Storage, repo: string, cardNumber: number): void {
  storage.setItem(getPinStorageKey(repo, cardNumber), "true");
}

export function unpinCard(storage: Storage, repo: string, cardNumber: number): void {
  storage.removeItem(getPinStorageKey(repo, cardNumber));
}

export function loadPinnedNodeIds(storage: Storage, repo: string, cardNumbers: number[]): Set<string> {
  return new Set(
    cardNumbers
      .filter((cardNumber) => storage.getItem(getPinStorageKey(repo, cardNumber)) === "true")
      .map(String)
  );
}

export function getPinStorageKey(repo: string, cardNumber: number): string {
  return `ejwf:pin:${repo}:${cardNumber}`;
}
