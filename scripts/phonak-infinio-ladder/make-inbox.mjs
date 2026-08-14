// INBOX board -> the unboxing payoff, at 11%.
//
// The title promises an opened box. This board pays that promise EARLY and in
// full -- a viewer who came for the unboxing gets it inside two minutes rather
// than waiting through a comparison for it.
//
// ⚠️ THE LAST ROW IS THE HINGE OF THE WHOLE VIDEO. Nothing in the box changes
// between the I30 and the I90. Identical contents, identical body, identical
// charger options. That is what makes the price ladder a question worth asking,
// and it is why this board runs before the ladder rather than after it.
//
// ⚠️ RECEIVERS ARE NOT A TIER THING. They are ordered separately and chosen by
// hearing loss. People assume the expensive level comes with a better receiver;
// it does not.
// Run: npm run board:infinio-inbox
import { boardOut } from "../../lib/paths.mjs";
import { rest } from "../../lib/supabase.mjs";
import { writeBoard } from "../../lib/svg.mjs";
import { calloutCard } from "../../lib/callout.mjs";

const std = await rest("hearing_aid_models?id=eq.HA-270&select=mrp,unit");
const go = await rest("hearing_aid_models?id=eq.HA-317&select=mrp,unit");
if (!std[0] || !go[0]) throw new Error("missing catalogue rows — refusing to guess");
const diff = go[0].mrp - std[0].mrp;
const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

writeBoard(boardOut("phonak-infinio-ladder", "inbox.svg"), calloutCard({
  kicker: "WHAT IS ACTUALLY IN THE BOX",
  title: "An I50, opened",
  sub: "This is the same box at every level. That is the point.",
  rows: [
    { label: "Two hearing aids", note: "Audéo Infinio Ultra R. Rechargeable, IP68, no battery door.", tone: "yes" },
    { label: "The charger", note: `Standard charger, or ChargerGo with a battery built in for ${inr(diff)} more.`, tone: "yes" },
    { label: "Cleaning tools and documentation", note: "Plus the domes. The domes are fitted to your ear, not chosen by price.", tone: "yes" },
    { label: "Receivers are ordered separately", note: "Chosen by your hearing loss, not by which level you buy. S, M, MAV, P or UP.", tone: "neutral" },
    { label: "Nothing here changes between I30 and I90", note: "Same body, same charger, same box. Only the software inside differs.", tone: "neutral" },
  ],
  footnote: "So what does the extra money actually buy? That is the rest of this video.",
  width: 1400,
}));
