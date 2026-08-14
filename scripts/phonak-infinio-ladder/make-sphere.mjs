// SPHERE board -> the branch, at 46%.
//
// ⚠️ THIS BOARD EXISTS TO CORRECT A BELIEF Chintan held going in, and that most
// buyers hold: that the I70 and I90 "have AI". They do not. The AI is the
// DEEPSONIC chip and it ships only in the -Sphere SKUs, which are separate,
// pricier products. Getting this wrong on camera would be the same class of
// error as the Terra Bluetooth cell.
//
// ⚠️ SPHERE EXISTS ONLY AT I70 AND I90. There is no I30-Sphere or I50-Sphere,
// in the catalogue or in Phonak's range.
//
// ⚠️ PHONAK'S CLAIMS ARE ATTRIBUTED, never stated as measured fact. "3x more
// likely" and "35% less listening effort" are the manufacturer's numbers.
// Run: npm run board:infinio-sphere
import { boardOut } from "../../lib/paths.mjs";
import { writeBoard } from "../../lib/svg.mjs";
import { calloutPanels } from "../../lib/callout.mjs";

writeBoard(boardOut("phonak-infinio-ladder", "sphere.svg"), calloutPanels({
  kicker: "WHERE THE AI ACTUALLY IS",
  title: "Sphere is a different product, not a higher setting",
  sub: "It exists at two levels only, and it adds a second chip.",
  panels: [
    {
      head: "I30 · I50 · I70 · I90",
      sub: "the standard Infinio Ultra",
      rows: [
        "One chip: ERA. It does all the sound processing and the connectivity.",
        "No AI processor. Not at the I70, and not at the I90 either.",
        "Noise is handled by directionality and noise cancellation, which is conventional processing.",
      ],
    },
    {
      head: "I70-Sphere · I90-Sphere",
      sub: "the only two with AI",
      rows: [
        "Two chips: ERA plus DEEPSONIC, a dedicated deep neural network processor.",
        "Spheric Speech Clarity separates speech from noise in real time.",
        "Phonak grades it honestly: medium strength on the I70-Sphere, full strength on the I90-Sphere.",
        "Phonak's own claims: up to 3x more likely to understand every word, and up to 35% less listening effort.",
      ],
    },
  ],
  footnote: "Source: Phonak Infinio feature summary doc 028-2681-03, and phonak.com. There is no Sphere below the I70.",
  width: 1440,
}));
