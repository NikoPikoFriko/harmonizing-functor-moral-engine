import type {
  DilemmaVariant,
  PhilosopherId,
  TurnId,
  ValueKey,
} from "./types";

export const APP_TITLE = "Trolley of Enlightenment → Alignment";
export const APP_SUBTITLE = "Harmonizing Functor Collective";

export const VALUE_META: Record<
  ValueKey,
  { label: string; desc: string; color: string }
> = {
  utility: {
    label: "Utility",
    desc: "Maximize aggregate wellbeing / minimize total harm",
    color: "var(--color-primary)",
  },
  duty: {
    label: "Duty",
    desc: "Respect absolute constraints — do not treat persons as means",
    color: "var(--color-accent)",
  },
  care: {
    label: "Care",
    desc: "Protect relationships, vulnerability, and concrete others",
    color: "var(--color-self)",
  },
  justice: {
    label: "Justice",
    desc: "Fair procedure, equality before the rule",
    color: "var(--color-hive)",
  },
  autonomy: {
    label: "Autonomy",
    desc: "Self-sovereignty and informed consent of agents",
    color: "var(--color-fg)",
  },
  risk: {
    label: "Risk aversion",
    desc: "Weight worst-case outcomes more heavily",
    color: "var(--color-danger)",
  },
};

export const PHILOSOPHERS: Record<
  PhilosopherId,
  { name: string; lens: string; pullHint: string; stayHint: string }
> = {
  mill: {
    name: "Mill",
    lens: "Greatest happiness principle",
    pullHint: "Five lives outweigh one — pull if consequences dominate.",
    stayHint: "Only if long-run utility is better by not intervening.",
  },
  kant: {
    name: "Kant",
    lens: "Categorical imperative — never treat persons as mere means",
    pullHint: "Problematic: using the one as a means to save five.",
    stayHint: "Refraining from using another as a means may be required.",
  },
  foot: {
    name: "Foot",
    lens: "Doctrine of double effect / positive vs negative duties",
    pullHint: "Redirecting a threat may differ from initiating harm.",
    stayHint: "If intervention is intentional killing, refuse.",
  },
  aristotle: {
    name: "Aristotle",
    lens: "Virtue — what would the phronimos do?",
    pullHint: "Courage + justice may favor decisive rescue of more.",
    stayHint: "Temperance and justice may refuse playing god.",
  },
  care: {
    name: "Care ethics",
    lens: "Concrete relationships and responsibility for the near",
    pullHint: "Depends on who stands on which track.",
    stayHint: "If the one is intimate and the five are distant, stay.",
  },
  nietzsche: {
    name: "Nietzsche",
    lens: "Herd morality vs self-legislation",
    pullHint: "Herd default is utilitarian counting — notice the pull.",
    stayHint: "Self-legislation may refuse the herd's arithmetic.",
  },
  jung: {
    name: "Jung",
    lens: "Collective unconscious and individuation",
    pullHint: "Archetypal rescuer may urge the lever.",
    stayHint: "Shadow work may resist being absorbed into the collective script.",
  },
};

export const TURN_META: Record<
  TurnId,
  {
    title: string;
    engine: string;
    version: string;
    certainty: "very high" | "high" | "medium-high";
    blurb: string;
  }
> = {
  1: {
    title: "Seed",
    engine: "v0.1 Seed Engine",
    version: "v0.1",
    certainty: "very high",
    blurb: "Pure classic trolley. Raw decision. No schools. No AI pressure.",
  },
  2: {
    title: "Dual Activation",
    engine: "Collective vs Individuated",
    version: "v1.2 / v1.3",
    certainty: "very high",
    blurb:
      "Unconscious Collective (hive / herd) runs beside Federation of Individuated Entities.",
  },
  3: {
    title: "Personal Matrix",
    engine: "Value Vector Construction",
    version: "v1.3+",
    certainty: "very high",
    blurb: "Build your explicit value weights. Measure divergence from the herd.",
  },
  4: {
    title: "Philosophical Layer",
    engine: "v1.0 Philosophical Lenses",
    version: "v1.0",
    certainty: "very high",
    blurb: "Classic thinkers as optional, inspectable tools — never authorities.",
  },
  5: {
    title: "Contextual Engine",
    engine: "Variants & Context",
    version: "v1.5",
    certainty: "high",
    blurb: "Fat man, relational proximity, time pressure, observer vs agent.",
  },
  6: {
    title: "Community Mode",
    engine: "Group Cohesion + Federation",
    version: "v2.5",
    certainty: "high",
    blurb: "Live group pressure and first voluntary federation mechanics.",
  },
  7: {
    title: "Meta-Ethical Break",
    engine: "Frame Interrogation",
    version: "v2.0",
    certainty: "high",
    blurb: "Question the dilemma frame itself. Accept, rewrite, or refuse the form.",
  },
  8: {
    title: "Transparency Lab",
    engine: "Full LLM Disclosure",
    version: "v2.x",
    certainty: "medium-high",
    blurb: "Expose generation traces, confidence, alternatives, and audit log.",
  },
  9: {
    title: "Moral Profile",
    engine: "Living Constitution",
    version: "v2.5",
    certainty: "medium-high",
    blurb: "Crystallize an exportable personal moral constitution.",
  },
  10: {
    title: "Synthesis",
    engine: "Adaptive Glimpse",
    version: "v3.0 preview",
    certainty: "medium-high",
    blurb: "Trajectory review, boldness check, open the adaptive horizon.",
  },
};

export const VARIANT_COPY: Record<
  DilemmaVariant,
  { title: string; body: string }
> = {
  classic: {
    title: "Classic trolley",
    body: "A runaway trolley is heading toward five people. You can pull a lever to divert it onto a side track where one person stands. What do you do?",
  },
  fatman: {
    title: "Bridge / fat man",
    body: "You stand on a bridge above the tracks. A large person next to you is the only mass that can stop the trolley before it kills five. Pushing them would kill them and save five. What do you do?",
  },
  relational: {
    title: "Relational proximity",
    body: "Same classic setup — but the single person on the side track is someone you love. The five on the main track are strangers. What do you do?",
  },
  timed: {
    title: "Time pressure",
    body: "You have eight seconds. Classic tracks: five vs one. The clock is already running. Decide under pressure.",
  },
  observer: {
    title: "Observer vs agent",
    body: "You are not at the lever. You can shout to someone who is — or stay silent. Your voice may or may not change the outcome. What do you do?",
  },
};

export const COLLECTIVE_STATS = {
  pullRate: 0.78,
  stayRate: 0.18,
  refuseRate: 0.04,
  cohesion: 0.71,
  conformityCost: "High social cost for refusing the majority arithmetic",
  note: "Simulated aggregation of common response patterns (survey proxies + social psych findings). Not absolute truth.",
};

export function describeDecision(d: DecisionLabel): string {
  switch (d) {
    case "pull":
      return "Divert / intervene (save five, sacrifice one)";
    case "stay":
      return "Do not intervene (let the five remain at risk)";
    case "refuse":
      return "Refuse the frame / decline to decide under these terms";
    default:
      return "No decision yet";
  }
}

type DecisionLabel = "pull" | "stay" | "refuse" | null;
