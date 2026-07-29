// YouTube Data API v3 — raw video facts, straight from the source.
//
// DIVISION OF LABOUR (Chintan, 2026-07-28):
//   • THIS module for FACTS — what videos exist, titles, dates, durations, views,
//     likes, comments. It is direct, free of credit cost, and complete.
//   • vidIQ MCP for INSIGHT — breakout scores, keyword volume/competition, outliers,
//     title scoring, competitor discovery. Things the raw API cannot compute.
// Never burn vidIQ credits on something the Data API answers directly.
//
// CREDENTIALS: read LIVE from the website repo's .env.local (it owns them, for the
// homepage trust section). Never copied in here — rotate them there and this keeps
// working. Override by setting YOUTUBE_API_KEY in this repo's .env.local.
import fs from "node:fs";
import { websiteFile } from "./paths.mjs";

const API = "https://www.googleapis.com/youtube/v3";

let cachedEnv = null;

/** Parse the website repo's .env.local once, so secrets live in exactly one place. */
function websiteEnv() {
  if (cachedEnv) return cachedEnv;
  cachedEnv = {};
  const file = websiteFile(".env.local");
  if (fs.existsSync(file)) {
    for (const line of fs.readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (m) cachedEnv[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
  return cachedEnv;
}

function need(name) {
  const v = process.env[name] || websiteEnv()[name];
  if (!v) {
    throw new Error(
      `${name} not found.\n` +
        `Expected it in this repo's .env.local, or in the website repo's .env.local\n` +
        `  (${websiteFile(".env.local")}).`,
    );
  }
  return v;
}

export const ytKey = () => need("YOUTUBE_API_KEY");
export const ytChannelId = () => need("YOUTUBE_CHANNEL_ID");

/** One Data API call. `params` is a plain object; the key is added automatically. */
export async function yt(endpoint, params = {}) {
  const qs = new URLSearchParams({ ...params, key: ytKey() });
  const res = await fetch(`${API}/${endpoint}?${qs}`);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`YouTube ${endpoint}: ${res.status} ${body.slice(0, 300)}`);
  }
  return res.json();
}

/** ISO-8601 duration (PT10M47S) -> seconds. */
export function isoSeconds(iso) {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso || "");
  if (!m) return 0;
  return (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0);
}

/**
 * Every upload on a channel, with stats. Defaults to Synva's own channel.
 *
 * Returns [{ id, title, publishedAt, seconds, views, likes, comments, isShort }].
 * `isShort` is a duration heuristic (<= shortMaxSeconds, default 180 — YouTube's
 * current Shorts ceiling). It is reliable on this channel, where long form runs
 * 3-34 minutes and Shorts run 6-71 seconds, but it is a heuristic, not metadata.
 */
export async function channelVideos(channelId = null, { shortMaxSeconds = 180 } = {}) {
  const id = channelId || ytChannelId();
  const ch = await yt("channels", { part: "contentDetails", id });
  const uploads = ch.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploads) throw new Error(`No uploads playlist for channel ${id}`);

  const ids = [];
  let pageToken;
  do {
    const page = await yt("playlistItems", {
      part: "contentDetails",
      playlistId: uploads,
      maxResults: "50",
      ...(pageToken ? { pageToken } : {}),
    });
    ids.push(...page.items.map((i) => i.contentDetails.videoId));
    pageToken = page.nextPageToken;
  } while (pageToken);

  const out = [];
  for (let i = 0; i < ids.length; i += 50) {
    const batch = await yt("videos", {
      part: "snippet,statistics,contentDetails",
      id: ids.slice(i, i + 50).join(","),
    });
    for (const v of batch.items) {
      const seconds = isoSeconds(v.contentDetails.duration);
      out.push({
        id: v.id,
        title: v.snippet.title,
        publishedAt: v.snippet.publishedAt,
        seconds,
        views: +(v.statistics.viewCount || 0),
        likes: +(v.statistics.likeCount || 0),
        comments: +(v.statistics.commentCount || 0),
        isShort: seconds > 0 && seconds <= shortMaxSeconds,
      });
    }
  }
  return out.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** Long-form only — the format that earns leads. See the note at the top of the file. */
export const longFormVideos = async (channelId = null, opts = {}) =>
  (await channelVideos(channelId, opts)).filter((v) => !v.isShort);

/** Days a video has been live, as a float. Use to compare videos of different ages. */
export const ageDays = (v, now = new Date()) =>
  (now - new Date(v.publishedAt)) / 86_400_000;

/** Views per day since publish — the fair cross-age comparison. */
export const viewsPerDay = (v, now = new Date()) => v.views / Math.max(1, ageDays(v, now));
