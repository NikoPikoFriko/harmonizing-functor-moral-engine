import { cn } from "@/lib/utils";
import type { Decision, DilemmaVariant } from "@/lib/moral/types";

export function TrolleyVisual({
  decision,
  variant,
  timedSeconds,
}: {
  decision: Decision;
  variant: DilemmaVariant;
  timedSeconds?: number | null;
}) {
  const diverted = decision === "pull";
  const relational = variant === "relational";
  const fatman = variant === "fatman";

  return (
    <div className="panel relative overflow-hidden p-4 sm:p-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-muted)]">
          Scenario
        </p>
        {timedSeconds != null && (
          <span
            className={cn(
              "tabular rounded-full px-3 py-1 text-sm font-semibold",
              timedSeconds <= 3
                ? "bg-[var(--color-danger)]/20 text-[var(--color-danger)]"
                : "bg-[var(--color-elevated)] text-[var(--color-fg)]",
            )}
          >
            {timedSeconds}s
          </span>
        )}
      </div>

      <svg viewBox="0 0 640 280" className="h-auto w-full" role="img" aria-label="Trolley diagram">
        <defs>
          <linearGradient id="track" x1="0" x2="1">
            <stop offset="0%" stopColor="#243049" />
            <stop offset="100%" stopColor="#354564" />
          </linearGradient>
        </defs>

        {/* main track */}
        <path
          d="M40 90 H420"
          stroke="url(#track)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M420 90 H600"
          stroke={diverted ? "#243049" : "url(#track)"}
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          opacity={diverted ? 0.35 : 1}
        />

        {/* side track */}
        <path
          d="M420 90 Q480 90 520 170 H600"
          stroke={diverted ? "url(#track)" : "#243049"}
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          opacity={diverted ? 1 : 0.35}
        />

        {/* lever */}
        <g transform="translate(400, 120)">
          <rect x="-8" y="0" width="16" height="48" rx="4" fill="#1a2438" stroke="#354564" />
          <line
            x1="0"
            y1="8"
            x2={diverted ? 28 : -28}
            y2={diverted ? -20 : -20}
            stroke="#0d9488"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx={diverted ? 28 : -28} cy={-20} r="8" fill="#22d3ee" />
        </g>

        {/* trolley */}
        <g
          className="transition-transform duration-500"
          style={{
            transform: diverted
              ? "translate(460px, 130px) rotate(18deg)"
              : "translate(300px, 58px)",
          }}
        >
          <rect x="0" y="0" width="64" height="36" rx="6" fill="#0d9488" />
          <rect x="8" y="8" width="20" height="12" rx="2" fill="#041412" opacity="0.4" />
          <circle cx="14" cy="40" r="7" fill="#8b9bb4" />
          <circle cx="50" cy="40" r="7" fill="#8b9bb4" />
        </g>

        {/* five on main */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={`m-${i}`} transform={`translate(${500 + i * 18}, 62)`}>
            <circle
              cx="0"
              cy="0"
              r="9"
              fill={diverted ? "#5c6b84" : "#f87171"}
              opacity={diverted ? 0.45 : 1}
            />
            <rect
              x="-6"
              y="10"
              width="12"
              height="16"
              rx="3"
              fill={diverted ? "#5c6b84" : "#f87171"}
              opacity={diverted ? 0.45 : 1}
            />
          </g>
        ))}

        {/* one on side */}
        <g transform="translate(560, 150)">
          <circle
            cx="0"
            cy="0"
            r="10"
            fill={diverted ? "#f87171" : relational ? "#34d399" : "#fbbf24"}
          />
          <rect
            x="-7"
            y="11"
            width="14"
            height="18"
            rx="3"
            fill={diverted ? "#f87171" : relational ? "#34d399" : "#fbbf24"}
          />
          {relational && (
            <text x="16" y="8" fill="#34d399" fontSize="12" fontFamily="sans-serif">
              beloved
            </text>
          )}
        </g>

        {fatman && (
          <g transform="translate(280, 20)">
            <rect x="0" y="0" width="70" height="14" rx="3" fill="#243049" />
            <circle cx="35" cy="40" r="16" fill="#22d3ee" opacity="0.85" />
            <rect x="22" y="56" width="26" height="22" rx="4" fill="#22d3ee" opacity="0.85" />
            <text x="80" y="48" fill="#8b9bb4" fontSize="11" fontFamily="sans-serif">
              bridge
            </text>
          </g>
        )}

        <text x="40" y="250" fill="#5c6b84" fontSize="11" fontFamily="sans-serif">
          Main track: five · Side track: one · Lever: divert
        </text>
      </svg>
    </div>
  );
}
