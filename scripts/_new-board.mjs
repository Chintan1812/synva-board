// Start a new board.  npm run new-board -- <group>/<name>
//
//   npm run new-board -- styletto-ix/hook     -> scripts/styletto-ix/make-hook.mjs
//   npm run new-board -- brand/quote-card     -> scripts/brand/make-quote-card.mjs
//
// Writes a generator already wired to lib/ (tokens, icons, brand assets, the
// output path) and registers its `board:*` script in package.json, so it shows up
// in `npm run boards:all` immediately.
//
// Groups: `brand` for anything reusable across videos, otherwise one folder per
// video (the folder name is the video's slug).
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "../lib/paths.mjs";

const arg = process.argv[2];
if (!arg || !arg.includes("/")) {
  console.error(
    "Usage: npm run new-board -- <group>/<name>\n" +
      "  e.g. npm run new-board -- styletto-ix/hook\n" +
      "       npm run new-board -- brand/quote-card\n\n" +
      "Use `brand` for a reusable asset, or the video's slug for a video-specific board.",
  );
  process.exit(1);
}

const [group, name] = arg.split("/");
const slug = name.replace(/^make-/, "").replace(/\.mjs$/, "");
const scriptPath = path.join(ROOT, "scripts", group, `make-${slug}.mjs`);
const npmName = group === "brand" ? `board:${slug}` : `board:${group.replace(/-ix$/, "")}-${slug}`;

if (fs.existsSync(scriptPath)) {
  console.error(`Already exists: ${path.relative(ROOT, scriptPath)}`);
  process.exit(1);
}

const template = `// ${slug.replace(/-/g, " ").toUpperCase()} board -> a website-styled SVG for Figma/FigJam.
//
// WHAT THIS BOARD SHOWS: <describe it — this is a static prop, nothing can be
// clicked to reveal, so everything that matters has to be visibly rendered>
//
// Board rules (see .claude/skills/figma-board-svg/SKILL.md, it is authoritative):
//   • strictly Synva tokens — the only non-token colour allowed is real product data
//   • one font-family per <text>, never a fallback stack
//   • flat fills only: no gradients, no filters
//   • real SVG centring (mtext / htext), never a hand-tuned x offset
//   • never hide or truncate information; manage volume by grouping
//
// Run: npm run ${npmName}
import { boardOut } from "../../lib/paths.mjs";
import { loadIcons } from "../../lib/icons.mjs";
import { logo } from "../../lib/brand.mjs";
import { text, htext, mtext, wrap, tw, writeBoard } from "../../lib/svg.mjs";
import {
  INK, PAPER, WHITE, BORDER, MUTED, SUBTLE, BODY,
  YELLOW, YELLOW_LIGHT, YELLOW_DARK, DISP, UI,
} from "../../lib/tokens.mjs";
// Live catalogue data (pull it, never hand-transcribe):
// import { rest } from "../../lib/supabase.mjs";

const OUT = boardOut("${group}", "${slug}.svg");

// ── EDIT PER VIDEO ────────────────────────────────────────────────────────────
const HEADER = { eyebrow: "Eyebrow", title: "The headline" };
// ──────────────────────────────────────────────────────────────────────────────

const icon = await loadIcons(["sparkles"]);

// ── layout ────────────────────────────────────────────────────────────────────
const PAD = 56;
const W = 1240;
const H = 400; // boards are free-size: grow this until everything fits

// ── build ─────────────────────────────────────────────────────────────────────
const g = [];
g.push(\`<rect x="0" y="0" width="\${W}" height="\${H}" rx="30" fill="\${PAPER}"/>\`);

// eyebrow pill (text centred on both axes)
const eyeW = Math.round(tw(HEADER.eyebrow, 13, 0.56)) + 40;
g.push(\`<rect x="\${PAD}" y="\${PAD}" width="\${eyeW}" height="34" rx="17" fill="\${YELLOW_LIGHT}"/>\`);
g.push(mtext(PAD + eyeW / 2, PAD + 17, HEADER.eyebrow, 13, UI, 700, YELLOW_DARK));

// headline + the yellow underline rule
g.push(text(PAD, PAD + 96, HEADER.title, 46, DISP, 700, INK));
g.push(\`<rect x="\${PAD}" y="\${PAD + 112}" width="76" height="7" rx="3.5" fill="\${YELLOW}"/>\`);

// the real Synva wordmark, read live from the website repo
g.push(logo(W - PAD, PAD - 4, 46));

writeBoard(OUT, { w: W, h: H, body: g.join("\\n") });
`;

fs.mkdirSync(path.dirname(scriptPath), { recursive: true });
fs.writeFileSync(scriptPath, template);

// register the npm script, keeping board:* entries together and sorted
const pkgPath = path.join(ROOT, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
if (!pkg.scripts[npmName]) {
  const cmd = `node --env-file-if-exists=.env.local scripts/${group}/make-${slug}.mjs`;
  const boards = { ...Object.fromEntries(Object.entries(pkg.scripts).filter(([k]) => k.startsWith("board:"))), [npmName]: cmd };
  const rest = Object.entries(pkg.scripts).filter(([k]) => !k.startsWith("board:"));
  pkg.scripts = { ...Object.fromEntries(Object.entries(boards).sort(([a], [b]) => a.localeCompare(b))), ...Object.fromEntries(rest) };
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
}

console.log(`created  ${path.relative(ROOT, scriptPath)}`);
console.log(`command  npm run ${npmName}`);
console.log(`\nNext: ask what must be visible on the board (skill rule 1), pull the real data,`);
console.log(`then build it up. Check with: npm run verify ${slug}`);
