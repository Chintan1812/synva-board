// Every path in this repo resolves from here. Nothing hardcodes an absolute path.
//
// Two roots matter:
//   ROOT      this repo, derived from import.meta.url — move the repo, nothing breaks.
//   webRepo() the Synva website repo, read LIVE for brand assets and design context.
//             It is never copied in. See WEBSITE.md for what lives where.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// The website folder's real name carries a typo ("Webiste"). Match it exactly.
const DEFAULT_WEB_REPO = path.resolve(ROOT, "..", "Synva Webiste - 2.0");
// A file that only the website repo has — proves we resolved the right folder.
const WEB_MARKER = "src/app/globals.css";

let cachedWebRepo = null;

/**
 * Absolute path to the Synva website repo.
 * Override with SYNVA_WEB_REPO in .env.local if it ever moves.
 */
export function webRepo() {
  if (cachedWebRepo) return cachedWebRepo;
  const dir = process.env.SYNVA_WEB_REPO || DEFAULT_WEB_REPO;
  if (!fs.existsSync(path.join(dir, WEB_MARKER))) {
    throw new Error(
      `Cannot find the Synva website repo at:\n  ${dir}\n\n` +
        `Boards read brand assets and design context from it live (see WEBSITE.md).\n` +
        `Fix: keep this repo next to the website folder, or set SYNVA_WEB_REPO in .env.local.`,
    );
  }
  cachedWebRepo = dir;
  return dir;
}

/** A file inside the website repo, e.g. websiteFile("DESIGN.md"). */
export const websiteFile = (...seg) => path.join(webRepo(), ...seg);

/** A brand asset, e.g. brandAsset("synva-logo-horizontal-darkyellow.svg"). */
export const brandAsset = (name) => websiteFile("public", "brand", name);

/** A website product/lifestyle image, e.g. websiteImage("hearing-aids", "lifestyle-calm-2.webp"). */
export const websiteImage = (...seg) => websiteFile("public", "images", ...seg);

/** Lucide icon sources — this repo's own dependency, pinned in package.json. */
export const ICON_DIR = path.join(ROOT, "node_modules", "lucide-react", "dist", "esm", "icons");

/** Where a generated board is written, e.g. boardOut("styletto-ix", "hook.svg"). */
export function boardOut(group, file) {
  const dir = path.join(ROOT, "boards", group);
  fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, file);
}

/** The directory for a board group (used by generators that emit several files). */
export function boardDir(group) {
  const dir = path.join(ROOT, "boards", group);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
