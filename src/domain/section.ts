// Extract the body of a `## Heading` section from an issue body.
//
// One shared implementation for every "read a ## section" need (Blocked by,
// Parent) so the three parsers can't drift apart in how they detect a heading
// or where they stop. The scan ends the section at the next level-2 `##`
// heading OR end-of-file, which covers "## Blocked by is the last section",
// the case the prototype's `\Z` bug silently dropped (see
// prototype-dag/NOTES.md). Returns undefined when the section is absent so
// callers can tell "no section" from "empty section".
export function extractSection(body: string, heading: string): string | undefined {
  const targetHeading = normalizeHeading(heading);
  const lines = body.split(/\r?\n/);
  const sectionLines: string[] = [];
  let inSection = false;

  for (const line of lines) {
    const currentHeading = readLevel2Heading(line);

    if (currentHeading !== undefined) {
      if (inSection) {
        break;
      }

      inSection = currentHeading === targetHeading;
      continue;
    }

    if (inSection) {
      sectionLines.push(line);
    }
  }

  if (!inSection) {
    return undefined;
  }

  while (sectionLines[0]?.trim() === "") {
    sectionLines.shift();
  }

  return sectionLines.join("\n");
}

function readLevel2Heading(line: string): string | undefined {
  const match = line.match(/^##(?!#)\s*(.*?)\s*$/);
  return match ? normalizeHeading(match[1]) : undefined;
}

function normalizeHeading(heading: string): string {
  return heading.trim().toLowerCase();
}
