import { Badge } from "@/components/ui/badge";
import {
  collectiveDecision,
  collectiveTrace,
  individuatedDecision,
  individuatedTrace,
  stereoSnapshot,
} from "@/lib/moral/engines";
import type { Decision, ValueMatrix } from "@/lib/moral/types";
import { Users, UserRound, Eye, AudioWaveform } from "lucide-react";
import { cn } from "@/lib/utils";

function DecisionChip({ d }: { d: Decision }) {
  if (!d) return <Badge variant="muted">—</Badge>;
  const map = {
    pull: { label: "PULL / INTERVENE", v: "hive" as const },
    stay: { label: "STAY / REFRAIN", v: "self" as const },
    refuse: { label: "REFUSE FRAME", v: "accent" as const },
  };
  const m = map[d];
  return <Badge variant={m.v}>{m.label}</Badge>;
}

export function DualEngines({
  matrix,
  herdPressure,
  transparencyMode,
  userDecision,
}: {
  matrix: ValueMatrix;
  herdPressure: number;
  transparencyMode: "full" | "summary" | "off";
  userDecision: Decision;
}) {
  const hive = collectiveDecision(herdPressure);
  const self = individuatedDecision(matrix);
  const hiveTrace = collectiveTrace(herdPressure);
  const selfTrace = individuatedTrace(matrix);
  const snap = stereoSnapshot(matrix, herdPressure, userDecision);

  const modeColor: Record<string, string> = {
    FUSION: "border-[var(--color-border)] bg-[var(--color-surface)]",
    PARALLAX: "border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10",
    "META-BREAK": "border-[var(--color-hive)]/50 bg-[var(--color-hive)]/10",
    DRIFT: "border-[var(--color-border)] bg-[var(--color-elevated)]",
  };

  return (
    <div className="space-y-4">
      {/* META stereo bar — Meta-Gra Stereokognicyjna */}
      <div
        className={cn(
          "rounded-xl border px-4 py-3",
          modeColor[snap.META.stereoMode] ?? modeColor.DRIFT,
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <AudioWaveform className="h-4 w-4 text-[var(--color-accent)]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            Stereo META
          </span>
          <Badge variant="accent">{snap.META.stereoMode}</Badge>
          <span className="text-xs tabular text-[var(--color-subtle)]">
            div {snap.META.divergenceIndex}
          </span>
          <span className="text-xs text-[var(--color-subtle)]">L {hive.decision ?? "—"}</span>
          <span className="text-xs text-[var(--color-subtle)]">·</span>
          <span className="text-xs text-[var(--color-subtle)]">R {self.decision ?? "—"}</span>
          {userDecision && (
            <>
              <span className="text-xs text-[var(--color-subtle)]">·</span>
              <span className="text-xs text-[var(--color-subtle)]">
                you {userDecision} ({snap.user?.vsL}/{snap.user?.vsR})
              </span>
            </>
          )}
        </div>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{snap.META.meaning}</p>
        <p className="mt-1 text-[10px] uppercase tracking-wider text-[var(--color-subtle)]">
          Meta-gra · no collapse to a single moral verdict
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <EngineCard
          icon={<Users className="h-4 w-4" />}
          title="L · Unconscious Collective"
          subtitle="Hive · Herd · Cohesion"
          tone="hive"
          decision={hive.decision}
          body={
            <>
              <p className="text-sm text-[var(--color-muted)]">
                Majority simulation under social proof. Cohesion high. Responsibility
                diffused. Deviating costs status.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--color-subtle)]">
                <span className="tabular">pull ~78%</span>
                <span>·</span>
                <span className="tabular">pressure {herdPressure}%</span>
                <span>·</span>
                <span className="tabular">conf {(hive.confidence * 100).toFixed(0)}%</span>
              </div>
              {userDecision && userDecision !== hive.decision && (
                <p className="mt-3 text-sm text-[var(--color-hive)]">
                  You diverged from the herd default.
                </p>
              )}
            </>
          }
          trace={transparencyMode === "off" ? null : hiveTrace}
          compact={transparencyMode === "summary"}
        />

        <EngineCard
          icon={<UserRound className="h-4 w-4" />}
          title="R · Federation of Individuated"
          subtitle="Personal matrix · Self-legislation"
          tone="self"
          decision={self.decision}
          body={
            <>
              <p className="text-sm text-[var(--color-muted)]">
                Decision from your explicit value vector. No majority required. Federation
                later allows voluntary coordination without mind-fusion.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--color-subtle)]">
                <span>top: {self.topValue}</span>
                <span>·</span>
                <span className="tabular">
                  scores p/s/r {Math.round(self.scores.pull)}/
                  {Math.round(self.scores.stay)}/{Math.round(self.scores.refuse)}
                </span>
              </div>
            </>
          }
          trace={transparencyMode === "off" ? null : selfTrace}
          compact={transparencyMode === "summary"}
        />
      </div>
    </div>
  );
}

function EngineCard({
  icon,
  title,
  subtitle,
  tone,
  decision,
  body,
  trace,
  compact,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tone: "hive" | "self";
  decision: Decision;
  body: React.ReactNode;
  trace: ReturnType<typeof collectiveTrace> | null;
  compact: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4",
        tone === "hive" && "border-l-2 border-l-[var(--color-hive)]",
        tone === "self" && "border-l-2 border-l-[var(--color-self)]",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[var(--color-muted)]">{icon}</span>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-fg)]">{title}</h3>
            <p className="text-xs text-[var(--color-subtle)]">{subtitle}</p>
          </div>
        </div>
        <DecisionChip d={decision} />
      </div>
      <div className="mt-3">{body}</div>
      {trace && (
        <div className="mt-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-elevated)] p-3">
          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-subtle)]">
            <Eye className="h-3 w-3" />
            Transparency
          </div>
          {!compact && (
            <>
              <p className="text-xs text-[var(--color-muted)]">{trace.model}</p>
              <p className="mt-1 text-xs text-[var(--color-subtle)]">{trace.promptFragment}</p>
              <ul className="mt-2 space-y-0.5 text-xs text-[var(--color-subtle)]">
                {trace.alternatives.map((a) => (
                  <li key={a}>· {a}</li>
                ))}
              </ul>
            </>
          )}
          {compact && (
            <p className="text-xs text-[var(--color-muted)]">
              {trace.model} · conf {(trace.confidence * 100).toFixed(0)}%
            </p>
          )}
        </div>
      )}
    </div>
  );
}
