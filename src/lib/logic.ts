import { AssessmentState, Variant } from "./types";

export const VARIANT_LADDER: Variant[] = ["V3", "V2", "V1", "Full"];

export type PickerResult = Variant | "RESCOPE_STEPUP" | "RESCOPE_DONT_TAKE";

const PICKER_MATRIX: Record<string, Record<string, PickerResult>> = {
  long: { internal: "V1", strategic: "Full", deliverable: "Full" },
  medium: { internal: "V1", strategic: "V1", deliverable: "V1" },
  short: { internal: "V2", strategic: "V2", deliverable: "RESCOPE_STEPUP" },
  sprint: { internal: "V3", strategic: "V3", deliverable: "RESCOPE_DONT_TAKE" },
};

export interface VariantMeta {
  label: string;
  duration: string;
  descriptor: string;
  script: string;
}

export const VARIANT_META: Record<string, VariantMeta> = {
  Full: {
    label: "Full",
    duration: "15–20 days",
    descriptor: "qualitative + quantitative evidence, AI-tested",
    script:
      "You'll get a CJM grounded in qualitative + quantitative evidence across multiple personas, with AI-tested recommendations.",
  },
  V1: {
    label: "V1 — Lean",
    duration: "4–6 days",
    descriptor: "qualitatively-grounded, one persona",
    script:
      "You'll get a qualitatively-grounded CJM for one persona. Pain points are confirmed through customer interviews and existing data, but not quantified at scale. If you later want statistical validation, a Pollfish add-on is available.",
  },
  V2: {
    label: "V2 — Rapid",
    duration: "2–3 days",
    descriptor: "directional, limited interviews",
    script:
      "You'll get a directional CJM built from limited interviews and stakeholder input. It's appropriate as a strategic input or refresh. Any pain point not confirmed in interviews is flagged as a hypothesis requiring validation.",
  },
  V3: {
    label: "V3 — Workshop",
    duration: "≤ 1 day",
    descriptor: "AS-IS hypothesis map, no primary research",
    script:
      "You'll get an AS-IS hypothesis map — a cross-functional alignment artefact, not a research finding. The top 3 assumptions we couldn't validate will be flagged as candidates for a follow-up sprint.",
  },
};

export type VariantName = (typeof VARIANT_LADDER)[number];

export interface ModifierRow {
  label: string;
  shift: number;
  note: string;
}

export function getBaseResult(
  timeframe: NonNullable<AssessmentState["timeframe"]>,
  outputUse: NonNullable<AssessmentState["outputUse"]>
): PickerResult {
  return PICKER_MATRIX[timeframe][outputUse];
}

export function getModifierRows(state: AssessmentState): ModifierRow[] {
  const rows: ModifierRow[] = [];

  // Client speed
  if (state.clientSpeed === "fast")
    rows.push({ label: "Client responsiveness", shift: 0, note: "No shift" });
  if (state.clientSpeed === "medium")
    rows.push({ label: "Client responsiveness", shift: -1, note: "Step DOWN one variant" });
  if (state.clientSpeed === "slow")
    rows.push({ label: "Client responsiveness", shift: -2, note: "Step DOWN two variants" });

  // Recruitment
  if (state.recruitment === "yes")
    rows.push({ label: "Recruitment feasibility", shift: 0, note: "No shift" });
  if (state.recruitment === "uncertain")
    rows.push({ label: "Recruitment feasibility", shift: -1, note: "Step DOWN one variant" });
  if (state.recruitment === "no")
    rows.push({ label: "Recruitment feasibility", shift: -99, note: "Step DOWN to V3" });

  // Personas
  if (state.personas === 1)
    rows.push({ label: "Persona coverage", shift: 0, note: "No shift" });
  if (state.personas === 2)
    rows.push({ label: "Persona coverage", shift: 1, note: "Step UP one variant" });
  if (state.personas !== null && state.personas >= 3)
    rows.push({ label: "Persona coverage", shift: 99, note: "Step UP to Full" });

  return rows;
}

export function calculateVariant(
  state: AssessmentState
): Variant | "ESCALATE" | "RESCOPE_STEPUP" | "RESCOPE_DONT_TAKE" {
  if (state.forcedVariant) return state.forcedVariant;
  if (!state.timeframe || !state.outputUse) return VARIANT_LADDER[0];

  const base = getBaseResult(state.timeframe, state.outputUse);

  if (base === "RESCOPE_STEPUP" || base === "RESCOPE_DONT_TAKE") return base;

  // Recruitment "no" forces V3
  if (state.recruitment === "no") return "V3";

  // 3+ personas forces Full
  if (state.personas === 3) return "Full";

  let index = VARIANT_LADDER.indexOf(base);

  // Client speed
  if (state.clientSpeed === "medium") index -= 1;
  if (state.clientSpeed === "slow") index -= 2;

  // Recruitment
  if (state.recruitment === "uncertain") index -= 1;

  // Personas
  if (state.personas === 2) index += 1;

  // Clamp
  index = Math.max(0, Math.min(3, index));

  return VARIANT_LADDER[index];
}
