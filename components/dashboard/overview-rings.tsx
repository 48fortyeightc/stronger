"use client";

interface CompletionRing {
  label: string;
  value: number;
  accent: string;
}

const ringSettings = [
  { radius: 104, strokeWidth: 14 },
  { radius: 78, strokeWidth: 14 },
  { radius: 52, strokeWidth: 14 },
];

export function OverviewRings({
  rings = [],
  isLight,
}: {
  rings?: CompletionRing[];
  isLight: boolean;
}) {
  const normalized = rings.slice(0, ringSettings.length).map((ring, index) => {
    const { radius, strokeWidth } = ringSettings[index];
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(Math.max(ring.value / 100, 0), 1);

    return {
      ...ring,
      radius,
      strokeWidth,
      circumference,
      dashOffset: circumference * (1 - progress),
    };
  });

  const centerValue = normalized[1]?.value ?? 0;

  return (
    <div className="relative flex w-full items-center justify-center py-2">
      <div className="relative aspect-square w-full max-w-[320px]">
        <svg viewBox="0 0 280 280" className="size-full -rotate-90">
          {normalized.map((ring) => (
            <g key={ring.label}>
              <circle
                cx="140"
                cy="140"
                r={ring.radius}
                fill="none"
                stroke={isLight ? "rgba(15,23,42,0.06)" : "rgba(255,255,255,0.05)"}
                strokeWidth={ring.strokeWidth}
              />
              <circle
                cx="140"
                cy="140"
                r={ring.radius}
                fill="none"
                stroke={ring.accent}
                strokeWidth={ring.strokeWidth}
                strokeLinecap="round"
                strokeDasharray={ring.circumference}
                strokeDashoffset={ring.dashOffset}
              />
            </g>
          ))}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div
            className={
              isLight
                ? "text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500"
                : "text-[11px] font-medium uppercase tracking-[0.28em] text-white/40"
            }
          >
            本周完成
          </div>
          <div
            className={
              isLight
                ? "mt-2 text-7xl font-semibold tracking-[-0.08em] text-slate-950"
                : "mt-2 text-7xl font-semibold tracking-[-0.08em] text-white"
            }
          >
            {centerValue}
            <span className={isLight ? "text-2xl text-slate-400" : "text-2xl text-white/40"}>
              %
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
