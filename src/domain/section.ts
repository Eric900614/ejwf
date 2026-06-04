// Extract the body of a `## Heading` section from an issue body.
//
// One shared implementation for every "read a ## section" need (Blocked by,
// Parent) so the three parsers can't drift apart in how they detect a heading
// or where they stop. The lookahead ends the section at the next `## ` heading
// OR end-of-string (`|$`) — the explicit `$` is what makes "## Blocked by is the
// last section" work, the case the prototype's `\Z` bug silently dropped (see
// prototype-dag/NOTES.md). Returns undefined when the section is absent so
// callers can tell "no section" from "empty section".
export function extractSection(body: string, heading: string): string | undefined {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return body.match(
    new RegExp(`(?:^|\\r?\\n)##\\s*${escapedHeading}\\s*\\r?\\n([\\s\\S]*?)(?=\\r?\\n##\\s|$)`, "i")
  )?.[1];
}
