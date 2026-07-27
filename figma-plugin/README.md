# Synva SVG to Board (Figma / FigJam plugin)

Imports an SVG onto the canvas as **native Figma objects** so the layout looks
exactly like the SVG and the **text stays editable** (real text nodes, auto-width,
correct font) — instead of Figma's built-in SVG import, which mangles text into
fixed-width boxes that wrap.

- Graphics / icons -> vector shapes (`createNodeFromSvg`)
- Every `<text>` -> a native editable text node (`createText`), auto-width, exact
  font / size / colour / position
- Every `<image>` (embedded **PNG/JPEG** data-URI) -> a native rectangle with an
  **image fill** (`createImage`) — Figma's own SVG import is unreliable with
  embedded raster, so the UI decodes it to bytes and the plugin builds the fill.
  (Embed illustrations as PNG, not webp — `createImage` won't take webp.)
- Works in **Figma Design and FigJam**

## Install (one time, ~2 min — needs the Figma **desktop** app)

1. Open the Figma desktop app.
2. Menu → **Plugins → Development → Import plugin from manifest…**
3. Pick this folder's **`manifest.json`**.

It now lives under **Plugins → Development → Synva SVG to Board**.

## Use

1. On your board, run **Plugins → Development → Synva SVG to Board**.
2. Click **Choose SVG file…** and pick one from **`../boards/`**
   (e.g. `styletto-ix-compare.svg`) — it builds automatically. Or paste an SVG
   into the box instead.

Text lands as editable text you can double-click and retype. Fonts must exist in
Figma (Bricolage Grotesque and Inter both do).

## Resizing a board (important)

To make a whole board bigger/smaller, use the **Scale tool: press `K`, then drag a
corner.** The Scale tool scales **font sizes** too, so the text stays inside its
pills. The normal move tool (`V`) only stretches the bounding box — text keeps its
original size and the small labels (e.g. the `1IX`/`2IX` chips) break out. The
board is grouped with its **aspect ratio locked**, so even a normal corner-drag
stays proportional; the Scale tool is still the clean way to do it. Individual
shapes you pull out of the group (a veil, a rect) resize freely.

## Notes

- Text is positioned from the SVG baseline with an approx ascent offset
  (`fontSize * 0.82`). If labels sit a hair high/low for a given font, nudge the
  whole group, or tell me and I'll tune the constant in `code.js`.
- No build step — plain JS. Edit `code.js` / `ui.html` and re-run.
