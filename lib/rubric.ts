/**
 * Startup idea rubric: eight independent dimensions, each judged as a Score
 * question (levels 0-4). Weights are applied in code, so they can change
 * without re-running inference.
 */
export type DimensionId =
  | "problem"
  | "market"
  | "differentiation"
  | "feasibility"
  | "monetization"
  | "timing"
  | "moat"
  | "clarity";

export interface Dimension {
  id: DimensionId;
  label: string;
  weight: number;
  instructions: string;
  criteria: readonly [string, string, string, string, string];
}

export const DIMENSIONS: readonly Dimension[] = [
  {
    id: "problem",
    label: "Problem",
    weight: 0.2,
    instructions:
      "How real and painful is the problem that `idea` claims to solve for its intended users?",
    criteria: [
      "No identifiable problem, or a problem nobody experiences.",
      "A minor inconvenience people tolerate without looking for a fix.",
      "A recurring annoyance people occasionally try to work around.",
      "A costly or frequent pain people already spend money or time to mitigate.",
      "An urgent, expensive pain with no acceptable workaround; users would switch today.",
    ],
  },
  {
    id: "market",
    label: "Market",
    weight: 0.15,
    instructions:
      "How large is the group of people or businesses that could realistically pay for what `idea` describes?",
    criteria: [
      "A handful of people; essentially no market.",
      "A tiny niche with a few thousand potential customers worldwide.",
      "A defined segment in the hundreds of thousands, or a mid-size regional market.",
      "A broad segment of millions of users or a large industry vertical.",
      "A mass market or a very large global industry where even small share is significant.",
    ],
  },
  {
    id: "differentiation",
    label: "Differentiation",
    weight: 0.15,
    instructions:
      "How different is `idea` from the alternatives its target users already have, including doing nothing?",
    criteria: [
      "Identical to widely available products; no reason to switch.",
      "Minor cosmetic or pricing tweak over existing options.",
      "A meaningful improvement on one axis, but competitors could copy it quickly.",
      "A clearly distinct approach or insight that existing players do not offer.",
      "A fundamentally new way to solve the problem with no direct equivalent.",
    ],
  },
  {
    id: "feasibility",
    label: "Feasibility",
    weight: 0.1,
    instructions:
      "How feasible is it for a small founding team to build a first working version of `idea` within a few months?",
    criteria: [
      "Requires breakthroughs in science, regulation, or infrastructure that do not exist.",
      "Needs years of R&D, large capital, or hard-to-obtain licenses before anything ships.",
      "Buildable but demands specialized talent, partnerships, or significant funding first.",
      "Buildable by a small team with known technology and moderate effort.",
      "A weekend-to-weeks prototype using off-the-shelf tools is realistic.",
    ],
  },
  {
    id: "monetization",
    label: "Monetization",
    weight: 0.15,
    instructions:
      "How clear and credible is the path for `idea` to make money?",
    criteria: [
      "No plausible way to charge anyone.",
      "Vague hope of ads or 'figure it out later'.",
      "A generic model (subscription, marketplace fee) named but not tied to who pays or why.",
      "A specific payer and pricing logic that matches how the segment already buys.",
      "An obvious, proven revenue model where the customer's willingness to pay is evident.",
    ],
  },
  {
    id: "timing",
    label: "Timing",
    weight: 0.1,
    instructions:
      "Is there a reason `idea` is possible or needed now that was not true a few years ago?",
    criteria: [
      "No timing argument; it could have existed decades ago and did not succeed.",
      "The idea depends on a trend that has not started or already peaked.",
      "Some relevant tailwind exists but is not essential to the idea.",
      "A clear recent shift in technology, behavior, or regulation makes it newly viable.",
      "A strong 'why now': a discontinuity has just opened a window competitors have not filled.",
    ],
  },
  {
    id: "moat",
    label: "Moat",
    weight: 0.05,
    instructions:
      "If `idea` gains early traction, how hard would it be for a well-funded competitor to replicate it?",
    criteria: [
      "Trivial to copy in days; no lasting advantage.",
      "Copyable in weeks; only first-mover speed protects it.",
      "Some accumulating advantage (data, content, integrations) but still catchable.",
      "Strong network effects, switching costs, or proprietary assets develop with scale.",
      "Structural defensibility (exclusive access, regulation, deep network effects) from early on.",
    ],
  },
  {
    id: "clarity",
    label: "Clarity",
    weight: 0.1,
    instructions:
      "How clearly does `idea` communicate what the product is, who it is for, and what it does?",
    criteria: [
      "Unintelligible or so vague that nothing concrete can be inferred.",
      "Only a theme or buzzwords; product and user are both unclear.",
      "Product or user is clear, but not both.",
      "Product, user, and core benefit are all understandable on first read.",
      "Crisp one-liner: anyone could repeat what it does and for whom.",
    ],
  },
] as const;

export const MAX_LEVEL = 4;

/** Composite weights sum to 1. Guarded at module load so a typo fails fast. */
const totalWeight = DIMENSIONS.reduce((sum, d) => sum + d.weight, 0);
if (Math.abs(totalWeight - 1) > 1e-9) {
  throw new Error(`Rubric weights must sum to 1, got ${totalWeight}`);
}
