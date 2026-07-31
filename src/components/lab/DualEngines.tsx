import { Badge } from "@/components/ui/badge";
import {
  collectiveDecision,
  collectiveTrace,
  individuatedDecision,
  individuatedTrace,
} from "@/lib/moral/engines";
import type { Decision, ValueMatrix } from "@/lib/moral/types";
import { Users, UserRound, Eye } from "lucide-react";
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

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <EngineCard
        icon={<Users className="h-4 w-4" />}
        title="Unconscious Collective"
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
        title="Federation of Individuated"
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
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "panel p-4 sm:p-5",
        tone === "hive" && "border-[color-mix(in_oklab,var(--color-hive)_35%,var(--color-border))]",
        tone === "self" && "border-[color-mix(in_oklab,var(--color-self)_35%,var(--color-border))]",
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[var(--color-fg)]">
            {icon}
            <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          </div>
          <p className="text-xs text-[var(--color-subtle)]">{subtitle}</p>
        </div>
        <DecisionChip d={decision} />
      </div>
      {body}
      {trace && (
        <details className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)]/50 p-3">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-medium text-[var(--color-muted)]">
            <Eye className="h-3.5 w-3.5" />
            LLM / engine transparency
          </summary>
          <div className="mt-3 space-y-2 text-xs text-[var(--color-subtle)]">
            <p>
              <span className="text-[var(--color-muted)]">Model:</span> {trace.model}
            </p>
            <p>
              <span className="text-[var(--color-muted)]">Confidence:</span>{" "}
              <span className="tabular">{(trace.confidence * 100).toFixed(0)}%</span>
            </p>
            {!compact && (
              <>
                <p>
                  <span className="text-[var(--color-muted)]">Prompt fragment:</span>{" "}
                  {trace.promptFragment}
                </p>
                <p>
                  <span className="text-[var(--color-muted)]">Alternatives:</span>{" "}
                  {trace.alternatives.join(" · ")}
                </p>
                <p>
                  <span className="text-[var(--color-muted)]">Sources:</span>{" "}
                  {trace.sources.join(" · ")}
                </p>
              </>
            )}
          </div>
        </details>
      )}
    </div>
  );
}
