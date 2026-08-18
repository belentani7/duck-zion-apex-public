import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const sources = {
  "typed-domain": ["shared/types.ts", "server/routers/production.ts"],
  "extension-contracts": ["shared/production-catalog.ts", "shared/types.ts"],
  observability: ["server/routers/production.ts", "docs/audit-runtime.log"],
  "load-test": ["docs/audit-runtime.log"],
};

for (const [key, paths] of Object.entries(sources)) {
  const files = [];
  for (const path of paths) {
    const buffer = await readFile(path);
    files.push({
      path,
      sha256: createHash("sha256").update(buffer).digest("hex"),
    });
  }
  const digest = createHash("sha256")
    .update(JSON.stringify(files))
    .digest("hex");
  console.log(`${key} ${digest}`);
}
