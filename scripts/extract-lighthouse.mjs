import { readFile, writeFile } from "node:fs/promises";

const report = JSON.parse(await readFile("docs/lighthouse-audit.json", "utf8"));
const scores = Object.fromEntries(
  Object.entries(report.categories ?? {}).map(([key, category]) => [
    key,
    category.score,
  ])
);
await writeFile(
  "docs/lighthouse-summary.json",
  JSON.stringify(
    {
      requestedUrl: report.requestedUrl,
      finalUrl: report.finalUrl,
      fetchTime: report.fetchTime,
      scores,
      warnings: report.runWarnings ?? [],
    },
    null,
    2
  ) + "\n"
);
console.log(JSON.stringify(scores));
