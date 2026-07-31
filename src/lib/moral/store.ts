import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_MATRIX, divergenceScore } from "./engines";
import type {
  Decision,
  DilemmaVariant,
  LabState,
  PhilosopherId,
  TurnId,
  ValueKey,
  ValueMatrix,
} from "./types";

const initial: LabState = {
  turn: 1,
  phase: "intro",
  decision: null,
  herdPressure: 55,
  autonomyStrength: 60,
  matrix: { ...DEFAULT_MATRIX },
  matrixLocked: false,
  variant: "classic",
  activePhilosophers: [],
  transparencyMode: "full",
  history: [],
  federationRules: [],
  completed: false,
  started: false,
};

interface LabActions {
  start: () => void;
  setDecision: (d: Decision) => void;
  setHerdPressure: (n: number) => void;
  setAutonomy: (n: number) => void;
  setMatrixValue: (key: ValueKey, value: number) => void;
  lockMatrix: () => void;
  setVariant: (v: DilemmaVariant) => void;
  togglePhilosopher: (id: PhilosopherId) => void;
  setTransparency: (m: LabState["transparencyMode"]) => void;
  addFederationRule: (rule: string) => void;
  commitTurn: (note?: string) => void;
  goPhase: (p: LabState["phase"]) => void;
  nextTurn: () => void;
  prevTurn: () => void;
  jumpTurn: (t: TurnId) => void;
  reset: () => void;
  exportProfile: () => string;
}

export const useLabStore = create<LabState & LabActions>()(
  persist(
    (set, get) => ({
      ...initial,

      start: () => set({ started: true, phase: "dilemma", turn: 1 }),

      setDecision: (d) => set({ decision: d }),

      setHerdPressure: (n) => set({ herdPressure: Math.max(0, Math.min(100, n)) }),

      setAutonomy: (n) => set({ autonomyStrength: Math.max(0, Math.min(100, n)) }),

      setMatrixValue: (key, value) =>
        set((s) => ({
          matrix: { ...s.matrix, [key]: Math.max(0, Math.min(100, value)) },
        })),

      lockMatrix: () => set({ matrixLocked: true }),

      setVariant: (v) => set({ variant: v, decision: null }),

      togglePhilosopher: (id) =>
        set((s) => ({
          activePhilosophers: s.activePhilosophers.includes(id)
            ? s.activePhilosophers.filter((p) => p !== id)
            : [...s.activePhilosophers, id],
        })),

      setTransparency: (m) => set({ transparencyMode: m }),

      addFederationRule: (rule) =>
        set((s) => ({
          federationRules: [...s.federationRules, rule].slice(-8),
        })),

      commitTurn: (note) => {
        const s = get();
        const record = {
          turn: s.turn,
          decision: s.decision,
          variant: s.variant,
          note,
          divergence: divergenceScore(s.decision, s.matrix, s.herdPressure),
          herdPressure: s.herdPressure,
          timestamp: Date.now(),
        };
        set({
          history: [...s.history.filter((h) => h.turn !== s.turn), record],
          phase: "result",
        });
      },

      goPhase: (p) => set({ phase: p }),

      nextTurn: () => {
        const s = get();
        if (s.turn >= 10) {
          set({ completed: true, phase: "synthesis" });
          return;
        }
        const next = (s.turn + 1) as TurnId;
        set({
          turn: next,
          phase: next === 3 ? "matrix" : next === 9 || next === 10 ? "synthesis" : "dilemma",
          decision: null,
          variant:
            next === 5
              ? "fatman"
              : next >= 5
                ? s.variant
                : "classic",
        });
      },

      prevTurn: () => {
        const s = get();
        if (s.turn <= 1) return;
        const prev = (s.turn - 1) as TurnId;
        set({ turn: prev, phase: "dilemma" });
      },

      jumpTurn: (t) => set({ turn: t, phase: t === 3 ? "matrix" : "dilemma" }),

      reset: () => set({ ...initial, matrix: { ...DEFAULT_MATRIX } }),

      exportProfile: () => {
        const s = get();
        return JSON.stringify(
          {
            app: "Trolley of Enlightenment → Alignment",
            version: "0.3",
            matrix: s.matrix,
            history: s.history,
            herdPressure: s.herdPressure,
            autonomyStrength: s.autonomyStrength,
            federationRules: s.federationRules,
            philosophers: s.activePhilosophers,
            exportedAt: new Date().toISOString(),
          },
          null,
          2,
        );
      },
    }),
    { name: "trolley-enlightenment-lab" },
  ),
);

export function matrixAsRadar(matrix: ValueMatrix) {
  return (Object.keys(matrix) as ValueKey[]).map((k) => ({
    key: k,
    value: matrix[k],
  }));
}
