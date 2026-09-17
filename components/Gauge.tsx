interface GaugeProps {
  value: number | null;
  size?: number;
}

export function Gauge({ value, size = 160 }: GaugeProps) {
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = value === null ? 0 : (value / 100) * circumference;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value ?? undefined}
      aria-label="Overall startup potential"
    >
      <div
        className="absolute inset-3 rounded-full blur-2xl transition-opacity duration-700"
        style={{
          background:
            "conic-gradient(from 180deg, #6366f1, #22d3ee, #a78bfa, #6366f1)",
          opacity: value === null ? 0 : 0.35,
        }}
      />
      <svg width={size} height={size} className="relative -rotate-90">
        <defs>
          <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="55%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gauge-gradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          className="transition-[stroke-dasharray] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-semibold tabular-nums tracking-tight">
          {value === null ? "–" : value}
        </span>
        <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          / 100
        </span>
      </div>
    </div>
  );
}
