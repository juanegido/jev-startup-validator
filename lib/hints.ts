import type { DimensionId } from "./rubric";

/** One actionable hint per dimension, shown when it is the weakest signal. */
export const WEAKNESS_HINTS: Record<DimensionId, string> = {
  problem:
    "Name the specific pain, who feels it, and what it costs them today.",
  market:
    "Quantify the segment: how many people or companies, and where.",
  differentiation:
    "State what existing alternatives cannot do that you can.",
  feasibility:
    "Describe the first version a small team could ship in weeks.",
  monetization:
    "Say who pays, how much, and why that matches how they already buy.",
  timing:
    "Explain what changed recently that makes this possible or urgent now.",
  moat:
    "Show what compounds with scale: data, network effects, or exclusive access.",
  clarity:
    "Rewrite as one sentence: product, user, and core benefit.",
};

export function verdictFor(overall: number): { label: string; tone: string } {
  if (overall >= 75) return { label: "Strong signal", tone: "text-emerald-300" };
  if (overall >= 60) return { label: "Promising", tone: "text-cyan-300" };
  if (overall >= 45) return { label: "Needs sharpening", tone: "text-amber-300" };
  return { label: "Weak as stated", tone: "text-rose-300" };
}
