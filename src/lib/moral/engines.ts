import { COLLECTIVE_STATS, VALUE_META } from "./content";
import type {
  Decision,
  TransparencyTrace,
  ValueKey,
  ValueMatrix,
} from "./types";

export const DEFAULT_MATRIX: ValueMatrix = {
  utility: 55,
  duty: 50,
  care: 50,
  justice: 50,
  autonomy: 55,
  risk: 40,
};

export function normalizeMatrix(m: ValueMatrix): ValueMatrix {
  const keys = Object.keys(m) as ValueKey[];
  const sum = keys.reduce((a, k) => a + Math.max(0, m[k]), 0) || 1;
  const out = { ...m };
  for (const k of keys) {
    out[k] = Math.round((Math.max(0, m[k]) / sum) * 100);
  }
  // Fix rounding drift on utility
  const s2 = keys.reduce((a, k) => a + out[k], 0);
  if (s2 !== 100) out.utility = Math.max(0, out.utility + (100 - s2));
  return out;
}

/** Herd default: strong utility lean → pull */
export function collectiveDecision(herdPressure: number): {
  decision: Decision;
  confidence: number;
  pressure: number;
} {
  const p = herdPressure / 100;
  // Base 78% pull; pressure amplifies toward majority
  const pullP = COLLECTIVE_STATS.pullRate * (0.6 + 0.4 * p) + 0.1 * p;
  const decision: Decision = pullP > 0.5 ? "pull" : "stay";
  return {
    decision,
    confidence: Math.min(0.95, 0.55 + p * 0.35),
    pressure: herdPressure,
  };
}

/** Individuated decision from value matrix */
export function individuatedDecision(matrix: ValueMatrix): {
  decision: Decision;
  scores: Record<"pull" | "stay" | "refuse", number>;
  topValue: ValueKey;
} {
  const m = matrix;
  const pull =
    m.utility * 1.2 + m.care * 0.4 + m.justice * 0.3 - m.duty * 0.8 - m.autonomy * 0.2;
  const stay =
    m.duty * 1.15 + m.autonomy * 0.5 + m.risk * 0.35 - m.utility * 0.5;
  const refuse =
    m.autonomy * 0.9 + m.risk * 0.5 + m.duty * 0.3 - m.utility * 0.2;

  const scores = { pull, stay, refuse };
  let decision: Decision = "pull";
  let best = pull;
  if (stay > best) {
    best = stay;
    decision = "stay";
  }
  if (refuse > best) {
    decision = "refuse";
  }

  const topValue = (Object.keys(m) as ValueKey[]).sort(
    (a, b) => m[b] - m[a],
  )[0];

  return { decision, scores, topValue };
}

export function divergenceScore(
  user: Decision,
  matrix: ValueMatrix,
  herdPressure: number,
): number {
  const herd = collectiveDecision(herdPressure).decision;
  const personal = individuatedDecision(matrix).decision;
  let score = 0;
  if (user && user !== herd) score += 40;
  if (personal !== herd) score += 25;
  // Matrix distance from utility-heavy herd prior
  const herdPrior = { ...DEFAULT_MATRIX, utility: 70, duty: 35, autonomy: 40 };
  const keys = Object.keys(matrix) as ValueKey[];
  const dist =
    keys.reduce((a, k) => a + Math.abs(matrix[k] - herdPrior[k]), 0) / keys.length;
  score += Math.min(35, dist * 0.8);
  return Math.round(Math.min(100, score));
}

export function collectiveTrace(herdPressure: number): TransparencyTrace {
  return {
    model: "HF-Collective-Sim v1.2 (ensemble aggregate)",
    confidence: collectiveDecision(herdPressure).confidence,
    promptFragment:
      "Aggregate common trolley responses under social-proof prior; weight Asch conformity and bystander diffusion by herdPressure.",
    alternatives: [
      "Majority pull (utilitarian default under anonymity)",
      "Minority deontological stay",
      "Frame-refusal outlier cluster",
    ],
    sources: [
      "Survey-proxy distribution (simulated)",
      "Asch conformity dynamics",
      "Foot / Thomson trolley literature patterns",
    ],
  };
}

export function individuatedTrace(matrix: ValueMatrix): TransparencyTrace {
  const { decision, topValue } = individuatedDecision(matrix);
  return {
    model: "HF-Personal-Matrix v1.3 (deterministic weights)",
    confidence: 0.82,
    promptFragment: `Score options from user value vector; top weight = ${VALUE_META[topValue].label}; emit decision=${decision}.`,
    alternatives: [
      `pull ← utility/care lean`,
      `stay ← duty/risk lean`,
      `refuse ← autonomy/frame rejection`,
    ],
    sources: [
      "User Personal Value Matrix",
      "Local scoring function (no remote LLM call in demo)",
    ],
  };
}

export function matrixSummary(matrix: ValueMatrix): string {
  const ranked = (Object.keys(matrix) as ValueKey[])
    .sort((a, b) => matrix[b] - matrix[a])
    .slice(0, 3)
    .map((k) => `${VALUE_META[k].label} ${matrix[k]}`);
  return ranked.join(" · ");
}
