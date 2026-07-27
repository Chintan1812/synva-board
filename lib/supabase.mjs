// Live catalogue reads from the shared Supabase project.
//
// READ-ONLY BY DESIGN. This repo holds the anon/publishable key only, so it can
// never write. The database is shared with the website AND the consultation app —
// any change to it is a two-app change and does not belong here (website CLAUDE.md
// rule 12). If a board ever seems to need a schema change, raise it, don't do it.
//
// Table reference: `docs/catalog-schema.md` in the website repo (see WEBSITE.md).

const url = () => process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = () => process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_PUBLISHABLE_KEY;

function credentials() {
  const SUPA = url();
  const KEY = key();
  if (!SUPA || !KEY) {
    throw new Error(
      "Missing Supabase credentials.\n" +
        "Run boards via npm (`npm run board:...`), which loads .env.local, or pass\n" +
        "--env-file=.env.local yourself. Needs SUPABASE_URL + SUPABASE_ANON_KEY\n" +
        "(the NEXT_PUBLIC_* names from the website env also work).",
    );
  }
  return { SUPA, KEY };
}

/**
 * A PostgREST GET.
 *   await rest("hearing_aid_models?id=in.(HA-001)&select=id,mrp")
 */
export async function rest(path) {
  const { SUPA, KEY } = credentials();
  const r = await fetch(`${SUPA}/rest/v1/${path}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  });
  if (!r.ok) throw new Error(`${path}: ${r.status} ${await r.text()}`);
  return r.json();
}

/** Public URL for an object in a public Storage bucket (product-images is public). */
export function storageUrl(bucket, path) {
  const { SUPA } = credentials();
  return `${SUPA}/storage/v1/object/public/${bucket}/${path}`;
}

/** Download a Storage object as a Buffer, or null if it is missing. */
export async function storageBuffer(bucket, path) {
  const { KEY } = credentials();
  const r = await fetch(storageUrl(bucket, path), { headers: { apikey: KEY } });
  if (!r.ok) {
    console.warn("image fetch failed:", path, r.status);
    return null;
  }
  return Buffer.from(await r.arrayBuffer());
}
