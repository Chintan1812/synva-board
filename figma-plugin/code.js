// Synva SVG to Board — main plugin thread (no DOM here).
//
// The UI iframe (ui.html) parses the pasted SVG, splits out every <text>, and
// sends { graphicsSvg, texts }. This thread rebuilds the board as NATIVE Figma
// objects so nothing depends on Figma's flaky SVG-text import:
//   - graphics/icons -> figma.createNodeFromSvg (exact vectors)
//   - each <text>    -> figma.createText (real editable text, auto-width)
// Works in both Figma and FigJam.

figma.showUI(__html__, { width: 460, height: 400, themeColors: true });

// SVG numeric font-weight -> Figma style name (Bricolage / Inter families).
const WEIGHT_STYLE = {
  "100": "Thin", "200": "ExtraLight", "300": "Light", "400": "Regular",
  "500": "Medium", "600": "SemiBold", "700": "Bold", "800": "ExtraBold", "900": "Black",
  normal: "Regular", bold: "Bold",
};

function hexToRgb(hex) {
  let h = String(hex || "#000000").replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  if (isNaN(n)) return { r: 0, g: 0, b: 0 };
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

// Load the requested font/style; fall back through the family's Regular, then
// Inter Regular, so a build never dies on a missing weight.
async function resolveFont(family, style) {
  const tries = [
    { family, style },
    { family, style: "Regular" },
    { family: "Inter", style: "Regular" },
  ];
  for (const f of tries) {
    try {
      await figma.loadFontAsync(f);
      return f;
    } catch (e) {
      /* try next */
    }
  }
  return null;
}

figma.ui.onmessage = async (msg) => {
  if (!msg || msg.type !== "build") return;

  const raw = (msg.graphicsSvg || "").trim();
  const texts = Array.isArray(msg.texts) ? msg.texts : [];
  const created = [];

  try {
    // 1) Graphics: rects, lines, icon paths — exact via native SVG import.
    //    createNodeFromSvg buries them in a frame; UNWRAP it — reparent each
    //    child to the page (preserving position) so every shape is a direct,
    //    individually selectable/editable element, not two levels deep.
    let originX = 0;
    let originY = 0;
    if (raw && /<(rect|path|circle|ellipse|line|polygon|polyline|g)\b/i.test(raw)) {
      const frame = figma.createNodeFromSvg(raw);
      originX = frame.x;
      originY = frame.y;
      for (const ch of frame.children.slice()) {
        const ax = originX + ch.x;
        const ay = originY + ch.y;
        figma.currentPage.appendChild(ch);
        ch.x = ax;
        ch.y = ay;
        created.push(ch);
      }
      frame.remove();
    }

    // 1b) Images: raster fills. Figma's createNodeFromSvg cannot reliably load an
    //     embedded raster, so the UI extracts each <image> to raw bytes and we
    //     build a native rectangle with an image fill here (PNG/JPEG bytes only).
    for (const im of (Array.isArray(msg.images) ? msg.images : [])) {
      if (!im || !im.bytes) continue;
      try {
        const bytes = im.bytes instanceof Uint8Array ? im.bytes : new Uint8Array(im.bytes);
        const image = figma.createImage(bytes);
        const rect = figma.createRectangle();
        rect.resize(Math.max(1, im.width || 1), Math.max(1, im.height || 1));
        rect.x = originX + (im.x || 0);
        rect.y = originY + (im.y || 0);
        // FIT (contain) = show the whole image, never crop/zoom — matches the
        // SVG's preserveAspectRatio="…meet". FILL would cover-crop (zoom in).
        rect.fills = [{ type: "IMAGE", imageHash: image.hash, scaleMode: "FIT" }];
        created.push(rect);
      } catch (e) {
        /* skip an unreadable image, keep building the rest */
      }
    }

    // 2) Text: native, editable, auto-width, positioned to match the SVG.
    for (const t of texts) {
      const style = WEIGHT_STYLE[String(t.fontWeight)] || "Regular";
      const font = await resolveFont(t.fontFamily || "Inter", style);
      if (!font) continue;

      const node = figma.createText();
      node.fontName = font;
      node.fontSize = t.fontSize || 16;
      node.characters = t.text || "";
      node.fills = [{ type: "SOLID", color: hexToRgb(t.fill) }];
      node.textAutoResize = "WIDTH_AND_HEIGHT"; // auto-width => never wraps

      // Honor the SVG's horizontal anchor. The <text> x is the anchor point;
      // now that the node has an auto-width, shift its left edge so middle/end
      // anchored text (e.g. a digit centred in a disc) lands exactly on x.
      let nx = originX + (t.x || 0);
      if (t.textAnchor === "middle") nx -= node.width / 2;
      else if (t.textAnchor === "end") nx -= node.width;
      node.x = nx;

      // Vertical: dominant-baseline central/middle => y is the CENTRE, so top =
      // y - height/2. Otherwise y is the SVG BASELINE (Figma y is the box top),
      // so shift up by the approx ascent.
      const b = t.baseline;
      node.y = (b === "central" || b === "middle")
        ? originY + (t.y || 0) - node.height / 2
        : originY + (t.y || 0) - (t.fontSize || 16) * 0.82;
      created.push(node);
    }

    if (created.length === 0) {
      figma.closePlugin("Nothing to build — is the SVG empty?");
      return;
    }

    // Individual shapes resize freely (no locked ratio) — a grabbed veil/rect can
    // be stretched to any size. The whole BOARD, though, is locked proportional
    // (on the group below) so a corner-drag scales it uniformly, text included,
    // instead of stretching one axis and breaking the pill labels.
    for (const n of created) {
      try { n.constrainProportions = false; } catch (e) { /* not all node types have it */ }
    }

    // 3) Group so the board moves as one piece (skip if unsupported, e.g. FigJam).
    let result = created;
    try {
      const g = figma.group(created, figma.currentPage);
      g.name = "Synva board";
      try { g.constrainProportions = true; } catch (e) { /* keep board aspect locked */ }
      result = [g];
    } catch (e) {
      /* leave ungrouped, still correctly positioned */
    }

    figma.currentPage.selection = result;
    figma.viewport.scrollAndZoomIntoView(result);
    figma.notify("Synva board built. Resize it with the Scale tool (press K) so the text scales too.");
  } catch (err) {
    figma.notify("Build failed: " + (err && err.message ? err.message : String(err)), { error: true });
  }
};
