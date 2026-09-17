import type { DimensionResult } from "@/lib/analyze";
import type { Dimension } from "@/lib/rubric";

interface DimensionChartProps {
  dimensions: readonly Dimension[];
  results: DimensionResult[] | null;
  weakestId: string | null;
  strongestId: string | null;
}

const TICKS = [0, 25, 50, 75, 100];

export function DimensionChart({
  dimensions,
  results,
  weakestId,
  strongestId,
}: DimensionChartProps) {
  return (
    <div>
      <ol className="flex flex-col">
        {dimensions.map((dimension) => {
          const result = results?.find((r) => r.id === dimension.id) ?? null;
          const percent = result ? Math.round(result.value * 100) : null;
          const isWeakest = result !== null && dimension.id === weakestId;
          const isStrongest = result !== null && dimension.id === strongestId;
          const lowConfidence = result !== null && result.confidence < 0.4;

          return (
            <li
              key={dimension.id}
              className="group relative grid grid-cols-[1fr_auto_auto] gap-x-3 gap-y-1.5 py-2.5 sm:grid-cols-[8.5rem_2.75rem_1fr_2.5rem] sm:items-center"
            >
              <span className="flex items-baseline gap-2 text-sm text-ink">
                {dimension.label}
                {isWeakest && (
                  <span className="text-[11px] font-medium text-critical">
                    weakest
                  </span>
                )}
                {isStrongest && (
                  <span className="text-[11px] font-medium text-ink-2">
                    strongest
                  </span>
                )}
              </span>
              <span className="font-mono text-xs tabular-nums text-ink-3">
                {Math.round(dimension.weight * 100)}%
              </span>

              <div
                className="gridlines relative order-last col-span-3 h-6 sm:order-none sm:col-span-1"
                tabIndex={result ? 0 : -1}
                aria-label={
                  result
                    ? `${dimension.label}: ${percent} of 100, confidence ${Math.round(result.confidence * 100)} percent`
                    : `${dimension.label}: not judged yet`
                }
              >
                <div
                  className={`absolute top-1/2 left-0 h-2.5 -translate-y-1/2 rounded-r transition-[width] duration-500 ease-out ${
                    isWeakest ? "bg-critical" : "bg-accent"
                  } ${lowConfidence ? "opacity-60" : ""}`}
                  style={{ width: `${percent ?? 0}%` }}
                />

                {result && (
                  <div
                    role="tooltip"
                    className="pointer-events-none absolute top-full left-0 z-10 mt-1.5 hidden w-[22rem] max-w-[80vw] border border-rule bg-panel p-3 text-xs shadow-sm group-hover:block group-focus-within:block"
                  >
                    <p className="mb-2 flex items-baseline justify-between text-ink-2">
                      <span>{dimension.label} · level distribution</span>
                      <span className="font-mono tabular-nums">
                        conf {Math.round(result.confidence * 100)}%
                      </span>
                    </p>
                    <ol className="flex flex-col gap-1.5">
                      {result.levels.map((level) => (
                        <li
                          key={level.level}
                          className="grid grid-cols-[1.25rem_3rem_1fr] items-start gap-2"
                        >
                          <span className="font-mono tabular-nums text-ink-3">
                            {level.level}
                          </span>
                          <span className="relative h-2 self-center bg-rule">
                            <span
                              className="absolute inset-y-0 left-0 bg-accent"
                              style={{ width: `${Math.round(level.probability * 100)}%` }}
                            />
                          </span>
                          <span className="leading-snug text-ink">
                            {level.description}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              <span className="text-right font-mono text-sm tabular-nums text-ink">
                {percent ?? "–"}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[8.5rem_2.75rem_1fr_2.5rem]">
        <span className="hidden font-mono text-[11px] text-ink-3 sm:block">dimension</span>
        <span className="hidden font-mono text-[11px] text-ink-3 sm:block">weight</span>
        <div className="relative h-4">
          {TICKS.map((tick) => (
            <span
              key={tick}
              className="absolute top-0 -translate-x-1/2 font-mono text-[11px] tabular-nums text-ink-3 first:translate-x-0 last:-translate-x-full"
              style={{ left: `${tick}%` }}
            >
              {tick}
            </span>
          ))}
        </div>
        <span className="hidden sm:block" />
      </div>
    </div>
  );
}
