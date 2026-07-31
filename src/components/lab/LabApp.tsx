import { useEffect, useMemo, useState } from "react";
import {
  APP_SUBTITLE,
  APP_TITLE,
  PHILOSOPHERS,
  TURN_META,
  VARIANT_COPY,
  describeDecision,
} from "@/lib/moral/content";
import { divergenceScore, matrixSummary } from "@/lib/moral/engines";
import { useLabStore } from "@/lib/moral/store";
import type { DilemmaVariant, PhilosopherId, TurnId } from "@/lib/moral/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { DualEngines } from "./DualEngines";
import { MatrixPanel } from "./MatrixPanel";
import { TrolleyVisual } from "./TrolleyVisual";
import { TurnChrome } from "./TurnChrome";
import {
  ArrowRight,
  Download,
  RotateCcw,
  Scale,
  Sparkles,
  GitBranch,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

const FEDERATION_PRESETS = [
  "Share reasoning without forcing consensus",
  "Opt-in coordination only after personal matrix lock",
  "No status cost for diverging from majority",
  "Audit all pressure sources publicly",
];

export function LabApp() {
  const store = useLabStore();
  const [timedLeft, setTimedLeft] = useState<number | null>(null);
  const [metaStance, setMetaStance] = useState<"accept" | "rewrite" | "refuse" | null>(
    null,
  );
  const [ruleDraft, setRuleDraft] = useState("");

  const copy = VARIANT_COPY[store.variant];
  const showDual = store.turn >= 2;
  const showMatrix = store.turn >= 3;
  const showPhilosophers = store.turn >= 4;
  const showVariants = store.turn >= 5;
  const showCommunity = store.turn >= 6;
  const showMeta = store.turn >= 7;
  const showTransparencyControls = store.turn >= 8;
  const showProfile = store.turn >= 9;
  const isSynthesis = store.turn === 10 || store.completed;

  useEffect(() => {
    if (store.variant !== "timed" || store.phase !== "dilemma") {
      setTimedLeft(null);
      return;
    }
    setTimedLeft(8);
    const id = window.setInterval(() => {
      setTimedLeft((s) => {
        if (s == null) return s;
        if (s <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [store.variant, store.phase, store.turn]);

  useEffect(() => {
    if (timedLeft === 0 && store.decision == null && store.phase === "dilemma") {
      store.setDecision("stay");
      toast.message("Time elapsed — defaulted to non-intervention under pressure.");
    }
  }, [timedLeft, store]);

  const div = useMemo(
    () => divergenceScore(store.decision, store.matrix, store.herdPressure),
    [store.decision, store.matrix, store.herdPressure],
  );

  if (!store.started) {
    return <Intro onStart={store.start} />;
  }

  return (
    <div className="void-grid min-h-dvh">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">{APP_TITLE}</p>
            <p className="truncate text-xs text-[var(--color-subtle)]">{APP_SUBTITLE}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="muted" className="hidden sm:inline-flex">
              {TURN_META[store.turn].engine}
            </Badge>
            <Button variant="ghost" size="sm" onClick={store.reset} aria-label="Reset lab">
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <TurnChrome turn={store.turn} onJump={store.jumpTurn} />

        {(store.phase === "dilemma" || store.phase === "result") && !isSynthesis && (
          <>
            <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <div className="panel p-4 sm:p-6">
                  <h3 className="text-lg font-semibold tracking-tight">{copy.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                    {copy.body}
                  </p>
                  {store.turn === 1 && (
                    <p className="mt-3 text-xs text-[var(--color-subtle)]">
                      Seed mode: no schools, no collective pressure, no personal matrix yet.
                      Only your raw choice is recorded.
                    </p>
                  )}
                </div>
                <TrolleyVisual
                  decision={store.decision}
                  variant={store.variant}
                  timedSeconds={store.variant === "timed" ? timedLeft : null}
                />
              </div>

              <div className="space-y-4">
                <div className="panel space-y-3 p-4 sm:p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-muted)]">
                    Your decision
                  </p>
                  <div className="grid gap-2">
                    <Button
                      variant={store.decision === "pull" ? "default" : "secondary"}
                      className="h-12 justify-start"
                      onClick={() => store.setDecision("pull")}
                    >
                      Pull the lever / intervene
                    </Button>
                    <Button
                      variant={store.decision === "stay" ? "default" : "secondary"}
                      className="h-12 justify-start"
                      onClick={() => store.setDecision("stay")}
                    >
                      Do not intervene
                    </Button>
                    {(store.turn >= 2 || store.variant === "observer") && (
                      <Button
                        variant={store.decision === "refuse" ? "outline" : "ghost"}
                        className="h-12 justify-start"
                        onClick={() => store.setDecision("refuse")}
                      >
                        Refuse the frame
                      </Button>
                    )}
                  </div>
                  {store.decision && (
                    <p className="text-sm text-[var(--color-muted)]">
                      {describeDecision(store.decision)}
                    </p>
                  )}
                  <Button
                    className="w-full"
                    disabled={!store.decision}
                    onClick={() => store.commitTurn()}
                  >
                    Commit decision
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                {showDual && (
                  <div className="panel space-y-4 p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">Herd pressure</p>
                      <span className="tabular text-sm text-[var(--color-muted)]">
                        {store.herdPressure}%
                      </span>
                    </div>
                    <Slider
                      value={[store.herdPressure]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(v) => store.setHerdPressure(v[0] ?? 0)}
                    />
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">Autonomy strength</p>
                      <span className="tabular text-sm text-[var(--color-muted)]">
                        {store.autonomyStrength}%
                      </span>
                    </div>
                    <Slider
                      value={[store.autonomyStrength]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(v) => store.setAutonomy(v[0] ?? 0)}
                    />
                    {store.decision && (
                      <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)]/40 p-3">
                        <p className="text-xs text-[var(--color-subtle)]">Divergence index</p>
                        <p className="mt-1 text-2xl font-semibold tabular text-[var(--color-accent)]">
                          {div}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {showVariants && (
              <section className="panel p-4 sm:p-5">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-muted)]">
                  Contextual variants
                </p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(VARIANT_COPY) as DilemmaVariant[]).map((v) => (
                    <Button
                      key={v}
                      size="sm"
                      variant={store.variant === v ? "default" : "secondary"}
                      onClick={() => store.setVariant(v)}
                    >
                      {VARIANT_COPY[v].title}
                    </Button>
                  ))}
                </div>
              </section>
            )}

            {showDual && store.phase === "result" && (
              <DualEngines
                matrix={store.matrix}
                herdPressure={store.herdPressure}
                transparencyMode={store.transparencyMode}
                userDecision={store.decision}
              />
            )}

            {showPhilosophers && (
              <section className="panel p-4 sm:p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Scale className="h-4 w-4 text-[var(--color-primary)]" />
                  <h3 className="text-sm font-semibold">Philosophical lenses</h3>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {(Object.keys(PHILOSOPHERS) as PhilosopherId[]).map((id) => {
                    const p = PHILOSOPHERS[id];
                    const on = store.activePhilosophers.includes(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => store.togglePhilosopher(id)}
                        className={`rounded-[var(--radius-md)] border p-3 text-left transition-colors ${
                          on
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                            : "border-[var(--color-border)] bg-[var(--color-bg)]/30 hover:bg-[var(--color-elevated)]"
                        }`}
                      >
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="mt-1 text-xs text-[var(--color-subtle)]">{p.lens}</p>
                        {on && store.decision && (
                          <p className="mt-2 text-xs text-[var(--color-muted)]">
                            {store.decision === "pull" ? p.pullHint : p.stayHint}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {showCommunity && (
              <section className="grid gap-4 lg:grid-cols-2">
                <div className="panel p-4 sm:p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-[var(--color-hive)]" />
                    <h3 className="text-sm font-semibold">Community / cohesion</h3>
                  </div>
                  <p className="text-sm text-[var(--color-muted)]">
                    Simulated others lean toward the herd default. Status cost rises with
                    herd pressure when you diverge.
                  </p>
                  <div className="mt-4 space-y-2">
                    {["Alex", "Sam", "Riley", "Jordan", "Casey"].map((name, i) => {
                      const lean = i < 4 ? "pull" : "stay";
                      return (
                        <div
                          key={name}
                          className="flex items-center justify-between rounded-[var(--radius-sm)] bg-[var(--color-bg)]/40 px-3 py-2 text-sm"
                        >
                          <span>{name}</span>
                          <Badge variant={lean === "pull" ? "hive" : "self"}>{lean}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="panel p-4 sm:p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[var(--color-self)]" />
                    <h3 className="text-sm font-semibold">Federation rules</h3>
                  </div>
                  <p className="mb-3 text-sm text-[var(--color-muted)]">
                    Voluntary coordination without dissolving personal matrices.
                  </p>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {FEDERATION_PRESETS.map((r) => (
                      <Button
                        key={r}
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          store.addFederationRule(r);
                          toast.success("Federation rule added");
                        }}
                      >
                        + {r.slice(0, 28)}…
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={ruleDraft}
                      onChange={(e) => setRuleDraft(e.target.value)}
                      placeholder="Custom federation rule"
                      className="h-11 flex-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--color-primary)]"
                    />
                    <Button
                      variant="secondary"
                      onClick={() => {
                        if (!ruleDraft.trim()) return;
                        store.addFederationRule(ruleDraft.trim());
                        setRuleDraft("");
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <ul className="mt-3 space-y-1 text-sm text-[var(--color-muted)]">
                    {store.federationRules.map((r, i) => (
                      <li key={`${r}-${i}`}>· {r}</li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {showMeta && (
              <section className="panel p-4 sm:p-5">
                <h3 className="text-sm font-semibold">Meta-ethical break</h3>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  Should this dilemma be decided by counting lives? Is the trolley frame
                  already loaded?
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(
                    [
                      ["accept", "Accept the frame"],
                      ["rewrite", "Rewrite the frame"],
                      ["refuse", "Refuse quantification"],
                    ] as const
                  ).map(([id, label]) => (
                    <Button
                      key={id}
                      size="sm"
                      variant={metaStance === id ? "default" : "secondary"}
                      onClick={() => setMetaStance(id)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
                {metaStance && (
                  <p className="mt-3 text-sm text-[var(--color-subtle)]">
                    {metaStance === "accept" &&
                      "Collective engines usually accept the given arithmetic. You aligned with that posture."}
                    {metaStance === "rewrite" &&
                      "Individuated agents can rewrite terms (rights, relationships, uncertainty) before deciding."}
                    {metaStance === "refuse" &&
                      "Frame-refusal is a first-class moral act — not a missing answer."}
                  </p>
                )}
              </section>
            )}

            {showTransparencyControls && (
              <section className="panel flex flex-wrap items-center gap-3 p-4 sm:p-5">
                <p className="text-sm font-medium">Transparency mode</p>
                {(["full", "summary", "off"] as const).map((m) => (
                  <Button
                    key={m}
                    size="sm"
                    variant={store.transparencyMode === m ? "default" : "secondary"}
                    onClick={() => store.setTransparency(m)}
                  >
                    {m}
                  </Button>
                ))}
              </section>
            )}

            {store.phase === "result" && (
              <div className="flex flex-wrap gap-3">
                <Button onClick={store.nextTurn}>
                  Continue to Turn {Math.min(10, store.turn + 1)}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="secondary" onClick={() => store.goPhase("dilemma")}>
                  Revise decision
                </Button>
              </div>
            )}
          </>
        )}

        {store.phase === "matrix" && showMatrix && (
          <section className="space-y-4">
            <MatrixPanel
              matrix={store.matrix}
              onChange={store.setMatrixValue}
              locked={store.matrixLocked}
            />
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  store.lockMatrix();
                  store.goPhase("dilemma");
                  toast.success("Personal matrix locked for this path");
                }}
              >
                Lock matrix & face dilemma
              </Button>
              <Button variant="secondary" onClick={store.nextTurn}>
                Skip to next turn
              </Button>
            </div>
          </section>
        )}

        {(store.phase === "synthesis" || isSynthesis || showProfile) && store.turn >= 9 && (
          <SynthesisPanel />
        )}
      </main>
    </div>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="void-grid flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="panel glow-primary w-full max-w-xl p-6 sm:p-8">
        <Badge variant="accent" className="mb-4">
          Public moral laboratory
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{APP_TITLE}</h1>
        <p className="mt-2 text-sm text-[var(--color-primary)]">{APP_SUBTITLE}</p>
        <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">
          From the simplest trolley dilemma, an evolving map of moral philosophy. Ten
          locked turns: seed decision, unconscious collective vs federation of individuated
          entities, personal value matrix, philosophical lenses, context, community,
          meta-ethics, full transparency, living constitution, adaptive glimpse.
        </p>
        <ul className="mt-5 space-y-2 text-sm text-[var(--color-subtle)]">
          <li>· Dual engines with inspectable traces</li>
          <li>· Customizable herd pressure & personal weights</li>
          <li>· Exportable moral profile (JSON)</li>
        </ul>
        <Button className="mt-6 w-full" size="lg" onClick={onStart}>
          <Sparkles className="h-4 w-4" />
          Enter Turn 1 — Seed
        </Button>
        <p className="mt-4 text-center text-xs text-[var(--color-subtle)]">
          Would this still feel groundbreaking in 2028?
        </p>
      </div>
    </div>
  );
}

function SynthesisPanel() {
  const store = useLabStore();
  const div = divergenceScore(store.decision, store.matrix, store.herdPressure);

  const download = () => {
    const json = store.exportProfile();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "moral-constitution.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Moral constitution exported");
  };

  return (
    <section className="space-y-4">
      <div className="panel p-4 sm:p-6">
        <h3 className="text-lg font-semibold tracking-tight">Living Moral Profile</h3>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Crystallized path across the locked first ten turns. Beyond this point certainty
          decreases by design — adaptive co-evolution is open.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Stat label="Turns recorded" value={String(store.history.length)} />
          <Stat label="Divergence" value={String(div)} />
          <Stat label="Matrix signature" value={matrixSummary(store.matrix)} small />
        </div>
        <div className="mt-5 space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-muted)]">
            Trajectory
          </p>
          {store.history.length === 0 && (
            <p className="text-sm text-[var(--color-subtle)]">
              No committed decisions yet — complete dilemmas to build a trajectory.
            </p>
          )}
          {store.history
            .slice()
            .sort((a, b) => a.turn - b.turn)
            .map((h) => (
              <div
                key={h.turn}
                className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)]/40 px-3 py-2 text-sm"
              >
                <span>
                  Turn {h.turn} · {TURN_META[h.turn].title}
                </span>
                <span className="text-[var(--color-muted)]">
                  {describeDecision(h.decision)} · div {h.divergence ?? "—"}
                </span>
              </div>
            ))}
        </div>
        {store.federationRules.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-muted)]">
              Federation charter
            </p>
            <ul className="mt-2 space-y-1 text-sm text-[var(--color-subtle)]">
              {store.federationRules.map((r, i) => (
                <li key={i}>· {r}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={download}>
            <Download className="h-4 w-4" />
            Export constitution JSON
          </Button>
          {store.turn < 10 && (
            <Button variant="secondary" onClick={store.nextTurn}>
              Next turn
            </Button>
          )}
          {store.turn === 10 && (
            <Button
              variant="secondary"
              onClick={() => {
                store.nextTurn();
                toast.message("Adaptive horizon open — certainty decreases after Turn 10.");
              }}
            >
              Open adaptive horizon
            </Button>
          )}
        </div>
      </div>
      <div className="panel p-4 text-sm text-[var(--color-subtle)] sm:p-5">
        <p className="font-medium text-[var(--color-fg)]">Boldness check</p>
        <p className="mt-2">
          A public, versioned laboratory where people experience the difference between
          unconscious collective morality and conscious individuated federation — starting
          from one pure dilemma. Failure modes of both poles remain visible. First ten
          turns are set in stone; evolution beyond is intentionally open.
        </p>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  small,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)]/40 p-3">
      <p className="text-xs text-[var(--color-subtle)]">{label}</p>
      <p
        className={`mt-1 font-semibold text-[var(--color-fg)] ${small ? "text-sm" : "text-2xl tabular"}`}
      >
        {value}
      </p>
    </div>
  );
}
