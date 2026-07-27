// Lucide icons as flat vector <path>, the only icon source a board uses.
//
// We deep-import `lucide-react/dist/esm/icons/<kebab>.mjs` and read `__iconNode`
// (an array of [tag, attrs] pairs). That is Lucide's INTERNAL shape, not its public
// API, which is why package.json pins an exact version rather than a range.
//
// Icons are rendered as stroked paths with no fill, so they import into Figma as
// editable vectors and never carry a gradient or filter.
import { ICON_DIR } from "./paths.mjs";

/** "MessageSquare" / "messageSquare" -> "message-square" (Lucide's file naming). */
export const kebab = (s) =>
  s
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();

/**
 * Preload a set of icons and return the renderer.
 *
 *   const icon = await loadIcons(["ear", "sparkles"]);
 *   g.push(icon("ear", x, y, 24, YELLOW_DARK));
 *
 * A missing icon warns and renders nothing, so one bad name never kills a board.
 * `stroke` sets the default stroke-width for this board (per-call `sw` still wins).
 */
export async function loadIcons(names, { stroke = 2 } = {}) {
  const wanted = [...new Set(names.filter(Boolean).map(kebab))];
  const nodes = {};
  for (const n of wanted) {
    try {
      const node = (await import(`${ICON_DIR}/${n}.mjs`)).__iconNode;
      if (!node) {
        console.warn("icon has no __iconNode (pick another):", n);
        continue;
      }
      nodes[n] = node;
    } catch {
      console.warn("icon missing:", n);
    }
  }

  const icon = (name, x, y, size, color, sw = stroke) => {
    const node = nodes[kebab(name)];
    if (!node) return "";
    const s = (size / 24).toFixed(4);
    const inner = node
      .map(([tag, attrs]) => {
        const a = { ...attrs };
        delete a.key;
        delete a.fill;
        const at = Object.entries(a)
          .map(([k, v]) => `${k}="${v}"`)
          .join(" ");
        return `<${tag} ${at} fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
      })
      .join("");
    return `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
  };

  icon.loaded = Object.keys(nodes);
  return icon;
}
