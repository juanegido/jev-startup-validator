interface DimensionBarProps {
  label: string;
  /** 0-1, or null when not judged yet. */
  value: number | null;
  confidence?: number;
  highlight?: "strong" | "weak" | null;
}

export function DimensionBar({
  label,
  value,
  confidence,
  highlight = null,
}: DimensionBarProps) {
  const percent = value === null ? 0 : Math.round(value * 100);
  const lowConfidence = confidence !== undefined && confidence < 0.4;

  const fill =
    highlight === "weak"
      ? "bg-gradient-to-r from-rose-500 to-orange-400"
      : highlight === "strong"
        ? "bg-gradient-to-r from-emerald-400 to-cyan-300"
        : "bg-gradient-to-r from-indigo-500 via-violet-400 to-cyan-400";

  return (
    <div className="group flex items-center gap-4">
      <span className="w-28 shrink-0 text-sm font-medium text-neutral-300">
        {label}
      </span>
      <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={`h-full rounded-full transition-[width] duration-700 ease-out ${
            lowConfidence ? "opacity-50" : ""
          } ${fill}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span
        className="w-9 shrink-0 text-right text-sm tabular-nums text-neutral-400"
        title={
          confidence === undefined
            ? undefined
            : `Confidence ${Math.round(confidence * 100)}%`
        }
      >
        {value === null ? "–" : percent}
      </span>
    </div>
  );
}
