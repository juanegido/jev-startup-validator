import type { AnalysisResult, DimensionResult } from "@/lib/analyze";
import { WEAKNESS_HINTS, verdictFor } from "@/lib/hints";
import { DIMENSIONS } from "@/lib/rubric";
import { DimensionChart } from "./DimensionChart";

interface AssessmentPanelProps {
  result: AnalysisResult | null;
  notAnIdea: boolean;
  judging: boolean;
}

function extremes(dimensions: DimensionResult[]) {
  const sorted = [...dimensions].sort((a, b) => b.value - a.value);
  return { strongest: sorted[0], weakest: sorted[sorted.length - 1] };
}

export function AssessmentPanel({
  result,
  notAnIdea,
  judging,
}: AssessmentPanelProps) {
  const scored = result !== null && !notAnIdea;
  const overall = scored ? result.overall : null;
  const verdict = overall !== null ? verdictFor(overall) : null;
  const ends = scored ? extremes(result.dimensions) : null;

  return (
    <section
      aria-labelledby="assessment-heading"
      className={`flex flex-col border border-rule bg-panel transition-opacity ${
        judging ? "opacity-70" : ""
      }`}
      aria-busy={judging}
    >
      <header className="flex items-center justify-between border-b border-rule px-5 py-3">
        <h2
          id="assessment-heading"
          className="text-xs font-medium uppercase tracking-[0.14em] text-ink-2"
        >
          Assessment
        </h2>
        <span className="font-mono text-xs text-ink-3">
          {result ? result.model : "jev"}
        </span>
      </header>

      <div className="grid gap-6 px-5 py-6 sm:grid-cols-[auto_1fr] sm:items-end">
        <div>
          <p className="text-xs text-ink-2">Weighted composite</p>
          <p className="mt-1 text-6xl font-semibold leading-none tracking-tight">
            {overall ?? "–"}
            <span className="ml-1 text-base font-normal text-ink-3">/100</span>
          </p>
        </div>
        <div className="sm:pb-1">
          <p className={`text-xl font-medium ${verdict ? "text-ink" : "text-ink-3"}`}>
            {notAnIdea
              ? "Not read as a startup idea"
              : verdict
                ? verdict.label
                : "Waiting for an idea"}
          </p>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-ink-2">
            {notAnIdea
              ? "Describe a product or service someone intends to build, who it is for, and how it makes money."
              : ends
                ? `Weakest is ${ends.weakest.label.toLowerCase()}. ${WEAKNESS_HINTS[ends.weakest.id]}`
                : "Eight rubric scores, each a probability-weighted level from 0 to 4, combined with the weights shown below."}
          </p>
        </div>
      </div>

      <div className="px-5">
        <div className="h-1.5 w-full bg-track">
          <div
            className="h-full bg-accent transition-[width] duration-500 ease-out"
            style={{ width: `${overall ?? 0}%` }}
          />
        </div>
      </div>

      <div className="px-5 pt-6 pb-4">
        <DimensionChart
          dimensions={DIMENSIONS}
          results={scored ? result.dimensions : null}
          weakestId={ends?.weakest.id ?? null}
          strongestId={ends?.strongest.id ?? null}
        />
      </div>

      <footer className="border-t border-rule px-5 py-3 text-xs text-ink-3">
        Hover a bar for the level distribution. Faded bars mean the model split its
        probability across levels.
      </footer>
    </section>
  );
}
