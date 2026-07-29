// Every path in this repo resolves from here. Nothing hardcodes an absolute path.
//
// Three roots matter:
//   ROOT         this repo, derived from import.meta.url — move the repo, nothing breaks.
//   webRepo()    the Synva website repo, read LIVE for brand assets and design context.
//                It is never copied in. See WEBSITE.md for what lives where.
//   scriptRepo() the YouTube Script Generator Agent repo, read LIVE for Chintan's
//                brand-voice baseline. Read-only — this repo never writes into it.
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

// ── The script-generator repo (brand voice, read-only) ────────────────────────
const DEFAULT_SCRIPT_REPO = path.resolve(ROOT, "..", "YouTube Script Generator Agent");
// A file that only the script-generator repo has — proves we resolved the right folder.
const SCRIPT_MARKER = "context/synva-brand-voice.md";

let cachedScriptRepo = null;

/**
 * Absolute path to the YouTube Script Generator Agent repo.
 * Read LIVE for Chintan's brand-voice baseline so it can never go stale here.
 * NEVER write into it — that repo owns its own files.
 * Override with SYNVA_SCRIPT_REPO in .env.local if it ever moves.
 */
export function scriptRepo() {
  if (cachedScriptRepo) return cachedScriptRepo;
  const dir = process.env.SYNVA_SCRIPT_REPO || DEFAULT_SCRIPT_REPO;
  if (!fs.existsSync(path.join(dir, SCRIPT_MARKER))) {
    throw new Error(
      `Cannot find the YouTube Script Generator Agent repo at:\n  ${dir}\n\n` +
        `The video-research skill reads Chintan's brand voice from it live (read-only).\n` +
        `Fix: keep this repo next to it, or set SYNVA_SCRIPT_REPO in .env.local.`,
    );
  }
  cachedScriptRepo = dir;
  return dir;
}

/** A file inside the script-generator repo, e.g. scriptFile("context", "data-sources.md"). */
export const scriptFile = (...seg) => path.join(scriptRepo(), ...seg);

/** Chintan's brand-voice baseline. Read it; never write it. */
export const brandVoice = () => scriptFile("context", "synva-brand-voice.md");

// ── The Phonak render library (local PNGs, read-only) ─────────────────────────
// Built by the Admin app from Phonak Target 11.2.3: 481 deduplicated 600x600
// PNG renders, one per unique shape+colour+side, plus CSVs saying which models
// use which. Lives in the Admin app because that is where it was generated;
// boards read it live, exactly like the website assets. Never write into it.
const DEFAULT_PHONAK_IMAGES = path.resolve(
  ROOT, "..", "Consultation PDF Generator", "data", "phonak_images",
);
const PHONAK_MARKER = "phonak_renders.csv";

let cachedPhonakImages = null;

/**
 * Absolute path to the Phonak render library.
 * Override with SYNVA_PHONAK_IMAGES in .env.local if it moves.
 */
export function phonakImages() {
  if (cachedPhonakImages) return cachedPhonakImages;
  const dir = process.env.SYNVA_PHONAK_IMAGES || DEFAULT_PHONAK_IMAGES;
  if (!fs.existsSync(path.join(dir, PHONAK_MARKER))) {
    throw new Error(
      `Cannot find the Phonak render library at:\n  ${dir}\n\n` +
        `Boards embed real Phonak device renders from it (see lib/phonak-renders.mjs).\n` +
        `Fix: keep this repo next to the Consultation PDF Generator, or set\n` +
        `SYNVA_PHONAK_IMAGES in .env.local.`,
    );
  }
  cachedPhonakImages = dir;
  return dir;
}

/** A file inside the Phonak render library. */
export const phonakFile = (...seg) => path.join(phonakImages(), ...seg);

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

/**
 * The planning folder for one video: research, hook, and the mind-map spec.
 * Markdown + JSON only — the SVGs live in boards/<slug>/.
 */
export function videoDir(slug) {
  const dir = path.join(ROOT, "videos", slug);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/** A planning artifact for a video, e.g. videoFile("styletto-ix", "01-research.md"). */
export const videoFile = (slug, file) => path.join(videoDir(slug), file);
