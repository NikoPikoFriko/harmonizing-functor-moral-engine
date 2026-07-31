export type Decision = "pull" | "stay" | "refuse" | null;

export type ValueKey =
  | "utility"
  | "duty"
  | "care"
  | "justice"
  | "autonomy"
  | "risk";

export type ValueMatrix = Record<ValueKey, number>;

export type EngineId =
  | "seed"
  | "collective"
  | "individuated"
  | "philosophical"
  | "contextual"
  | "community"
  | "meta"
  | "transparency"
  | "profile"
  | "adaptive";

export type TurnId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type DilemmaVariant =
  | "classic"
  | "fatman"
  | "relational"
  | "timed"
  | "observer";

export type PhilosopherId =
  | "mill"
  | "kant"
  | "foot"
  | "aristotle"
  | "care"
  | "nietzsche"
  | "jung";

export interface TurnRecord {
  turn: TurnId;
  decision: Decision;
  variant: DilemmaVariant;
  note?: string;
  divergence?: number;
  herdPressure?: number;
  timestamp: number;
}

export interface TransparencyTrace {
  model: string;
  confidence: number;
  promptFragment: string;
  alternatives: string[];
  sources: string[];
}

export interface LabState {
  turn: TurnId;
  phase: "intro" | "dilemma" | "result" | "matrix" | "synthesis";
  decision: Decision;
  herdPressure: number;
  autonomyStrength: number;
  matrix: ValueMatrix;
  matrixLocked: boolean;
  variant: DilemmaVariant;
  activePhilosophers: PhilosopherId[];
  transparencyMode: "full" | "summary" | "off";
  history: TurnRecord[];
  federationRules: string[];
  completed: boolean;
  started: boolean;
}
