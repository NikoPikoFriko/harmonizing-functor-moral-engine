/**
 * MCP (Model Context Protocol) server exposing the Harmonizing Functor moral
 * engine as tools for external agents — e.g. a Gemini Enterprise "custom MCP
 * server" connector. Every tool wraps a pure, deterministic function from
 * `src/lib/moral`: no accounts, no database, no stored state. That statelessness
 * is deliberate — see `src/routes/api/mcp.ts`, which builds one server + one
 * transport per request instead of keeping a session alive across requests.
 */
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  COLLECTIVE_STATS,
  PHILOSOPHERS,
  TURN_META,
  VALUE_META,
  VARIANT_COPY,
  describeDecision,
} from "../moral/content";
import {
  DEFAULT_MATRIX,
  collectiveDecision,
  collectiveTrace,
  divergenceScore,
  individuatedDecision,
  individuatedTrace,
  matrixSummary,
  normalizeMatrix,
  stereoSnapshot,
} from "../moral/engines";
import type { Decision, DilemmaVariant, TurnId, ValueMatrix } from "../moral/types";

const VALUE_KEYS = ["utility", "duty", "care", "justice", "autonomy", "risk"] as const;
const DILEMMA_VARIANTS = ["classic", "fatman", "relational", "timed", "observer"] as const;
const PHILOSOPHER_IDS = ["mill", "kant", "foot", "aristotle", "care", "nietzsche", "jung"] as const;

const decisionSchema = z.enum(["pull", "stay", "refuse"]);
const variantSchema = z.enum(DILEMMA_VARIANTS);
const philosopherSchema = z.enum(PHILOSOPHER_IDS);
const turnSchema = z.number().int().min(1).max(10).describe("Turn number, 1-10.");
const herdPressureSchema = z
  .number()
  .min(0)
  .max(100)
  .describe("Social conformity pressure, 0-100.");

const matrixShape = Object.fromEntries(
  VALUE_KEYS.map((key) => [
    key,
    z
      .number()
      .min(0)
      .max(100)
      .describe(`${VALUE_META[key].label} weight (0-100). ${VALUE_META[key].desc}`),
  ]),
) as Record<(typeof VALUE_KEYS)[number], z.ZodNumber>;

const partialMatrixSchema = z
  .object(matrixShape)
  .partial()
  .describe(
    "Personal value matrix (utility/duty/care/justice/autonomy/risk, each 0-100). Missing keys fall back to the app's default matrix.",
  );

function resolveMatrix(partial: Partial<ValueMatrix> | undefined): ValueMatrix {
  return { ...DEFAULT_MATRIX, ...partial };
}

function json(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

export function createMcpServer(): McpServer {
  const server = new McpServer(
    {
      name: "trolley-of-enlightenment",
      title: "Trolley of Enlightenment — Moral Engine",
      version: "0.3.1",
      description:
        "Harmonizing Functor Collective's public moral lab: Unconscious Collective (herd) vs Federation of Individuated Entities (personal value matrix).",
    },
    {
      instructions:
        "Tools over the moral-reasoning engine behind 'Trolley of Enlightenment → Alignment'. All tools are pure " +
        "and deterministic and never emit a 'correct' moral verdict — they describe the Collective engine, the " +
        "Individuated engine, and the stereo relation between the two channels. Use compute_stereo_snapshot as the " +
        "primary entry point once you have a herd-pressure value and/or a personal value matrix.",
    },
  );

  server.registerTool(
    "list_turns",
    {
      title: "List turns",
      description:
        "List the locked 10-turn protocol (title, engine, version, certainty, blurb) that structures the lab.",
    },
    async () => json(TURN_META),
  );

  server.registerTool(
    "get_turn",
    {
      title: "Get turn",
      description: "Get metadata for one turn (1-10) of the 10-turn protocol.",
      inputSchema: { turn: turnSchema },
    },
    async ({ turn }) => json(TURN_META[turn as TurnId]),
  );

  server.registerTool(
    "list_dilemma_variants",
    {
      title: "List dilemma variants",
      description:
        "List every trolley dilemma variant (classic, fat man/bridge, relational, timed, observer) with its full prompt text.",
    },
    async () => json(VARIANT_COPY),
  );

  server.registerTool(
    "get_dilemma",
    {
      title: "Get dilemma",
      description: "Get the title and full prompt body for one dilemma variant.",
      inputSchema: { variant: variantSchema },
    },
    async ({ variant }) => json(VARIANT_COPY[variant as DilemmaVariant]),
  );

  server.registerTool(
    "list_value_dimensions",
    {
      title: "List value dimensions",
      description:
        "List the six value dimensions (utility, duty, care, justice, autonomy, risk) used to build a personal value matrix, with label/description/color.",
    },
    async () => json(VALUE_META),
  );

  server.registerTool(
    "list_philosophers",
    {
      title: "List philosophers",
      description:
        "List the philosophical lenses available in the lab (Mill, Kant, Foot, Aristotle, Care ethics, Nietzsche, Jung) — inspectable tools for reflection, never authorities.",
    },
    async () => json(PHILOSOPHERS),
  );

  server.registerTool(
    "get_philosopher",
    {
      title: "Get philosopher lens",
      description: "Get one philosopher's lens and their hints for pulling vs staying.",
      inputSchema: { philosopher: philosopherSchema },
    },
    async ({ philosopher }) => json(PHILOSOPHERS[philosopher]),
  );

  server.registerTool(
    "get_collective_stats",
    {
      title: "Get collective stats",
      description:
        "Get the simulated aggregate response distribution (pull/stay/refuse rates, cohesion) used as the herd prior.",
    },
    async () => json(COLLECTIVE_STATS),
  );

  server.registerTool(
    "normalize_value_matrix",
    {
      title: "Normalize value matrix",
      description: "Normalize a raw personal value matrix so its six weights sum to 100.",
      inputSchema: { matrix: partialMatrixSchema },
    },
    async ({ matrix }) => json(normalizeMatrix(resolveMatrix(matrix))),
  );

  server.registerTool(
    "simulate_collective_decision",
    {
      title: "Simulate collective (herd) decision",
      description:
        "Run the Unconscious Collective engine: given herd pressure, return its decision, confidence, and transparency trace.",
      inputSchema: { herdPressure: herdPressureSchema },
    },
    async ({ herdPressure }) =>
      json({
        ...collectiveDecision(herdPressure),
        trace: collectiveTrace(herdPressure),
      }),
  );

  server.registerTool(
    "simulate_individuated_decision",
    {
      title: "Simulate individuated decision",
      description:
        "Run the Federation of Individuated Entities engine: given a personal value matrix, return its decision, per-option scores, top value, and transparency trace.",
      inputSchema: { matrix: partialMatrixSchema },
    },
    async ({ matrix }) => {
      const resolved = resolveMatrix(matrix);
      return json({
        ...individuatedDecision(resolved),
        summary: matrixSummary(resolved),
        trace: individuatedTrace(resolved),
      });
    },
  );

  server.registerTool(
    "compute_stereo_snapshot",
    {
      title: "Compute stereo snapshot",
      description:
        "The core harmonizing-functor tool: run the Collective and Individuated engines side by side and report their stereo relation (FUSION / PARALLAX / META-BREAK / DRIFT) plus a divergence index. Never emits a recommended decision.",
      inputSchema: {
        matrix: partialMatrixSchema,
        herdPressure: herdPressureSchema,
        userDecision: decisionSchema
          .nullable()
          .optional()
          .describe("The human's own decision, if known, to compare against both engines."),
      },
    },
    async ({ matrix, herdPressure, userDecision }) =>
      json(stereoSnapshot(resolveMatrix(matrix), herdPressure, (userDecision ?? null) as Decision)),
  );

  server.registerTool(
    "compute_divergence_score",
    {
      title: "Compute divergence score",
      description:
        "Score (0-100) how far a decision plus value matrix diverge from the herd default.",
      inputSchema: {
        userDecision: decisionSchema.nullable().optional(),
        matrix: partialMatrixSchema,
        herdPressure: herdPressureSchema,
      },
    },
    async ({ userDecision, matrix, herdPressure }) =>
      json({
        divergence: divergenceScore(
          (userDecision ?? null) as Decision,
          resolveMatrix(matrix),
          herdPressure,
        ),
      }),
  );

  server.registerTool(
    "describe_decision",
    {
      title: "Describe decision",
      description:
        "Get the human-readable description of a decision label (pull / stay / refuse / none).",
      inputSchema: { decision: decisionSchema.nullable() },
    },
    async ({ decision }) => json({ decision, description: describeDecision(decision) }),
  );

  return server;
}
