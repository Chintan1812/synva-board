// Regenerate every board.  npm run boards:all
//
// Run this after a price or catalogue change in Supabase, or after editing a
// brand token — it rebuilds all boards from live data in one go.
//
// The list is DISCOVERED from package.json's "board:*" scripts, so a board added
// by `npm run new-board` is picked up automatically. Nothing to keep in sync.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { ROOT } from "../lib/paths.mjs";

const only = process.argv.slice(2);
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
const boards = Object.keys(pkg.scripts)
  .filter((k) => k.startsWith("board:"))
  .filter((k) => !only.length || only.some((f) => k.includes(f)))
  .sort();

if (!boards.length) {
  console.error(only.length ? `No board matches: ${only.join(", ")}` : "No board:* scripts found.");
  process.exit(1);
}

console.log(`Regenerating ${boards.length} board script${boards.length === 1 ? "" : "s"}\n`);

const failed = [];
for (const name of boards) {
  process.stdout.write(`── ${name}\n`);
  const r = spawnSync("npm", ["run", "--silent", name], { cwd: ROOT, stdio: "inherit" });
  if (r.status !== 0) failed.push(name);
  process.stdout.write("\n");
}

if (failed.length) {
  console.error(`FAILED (${failed.length}): ${failed.join(", ")}`);
  process.exit(1);
}
console.log(`All ${boards.length} generators finished. Next: npm run verify`);
