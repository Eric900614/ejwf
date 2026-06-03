export interface AdrReferenceInput {
  code: string;
  number: string;
}

export interface AdrFile {
  path: string;
  content: string;
}

export interface ResolvedAdrReference {
  code: string;
  number: string;
  path: string;
  title: string;
  url?: string;
}

export function resolveAdrReferences(
  references: AdrReferenceInput[],
  files: AdrFile[],
  urlForPath?: (path: string) => string
): ResolvedAdrReference[] {
  return references.flatMap((reference) => {
    const file = files.find((candidate) =>
      candidate.path.split(/[\\/]/).pop()?.startsWith(`${reference.number}-`)
    );

    if (!file) {
      return [];
    }

    return [
      {
        code: reference.code,
        number: reference.number,
        path: file.path,
        title: parseMarkdownTitle(file.content) ?? file.path,
        ...(urlForPath ? { url: urlForPath(file.path) } : {})
      }
    ];
  });
}

function parseMarkdownTitle(content: string): string | undefined {
  return content.match(/^#\s+(.+)$/m)?.[1]?.trim();
}
