import { AssessmentState } from "./types";

const VARIANT_LADDER = ["V0-Desk", "V1-Lean", "V2-Standard", "V3-Full"] as const;

export interface VariantMeta {
  full: string;
  descriptor: string;
  script: string;
}

export const VARIANT_META: Record<string, VariantMeta> = {
  "V0-Desk": {
    full: "V0-Desk Research",
    descriptor: "desk research and internal synthesis",
    script:
      "Based on the constraints you’ve described, we’ll synthesize a CJM from existing internal knowledge and desk research. No primary research is conducted.",
  },
  "V1-Lean": {
    full: "V1-Lean Diagnostic",
    descriptor: "rapid validation with qualitative depth",
    script:
      "You’ll get a qualitatively-grounded CJM for one persona. Pain points are confirmed through customer interviews and existing data, but not quantified at scale. If you later want statistical validation, a Pollfish add-on is available.",
  },
  "V2-Standard": {
    full: "V2-Standard Discovery",
    descriptor: "mixed-method research and survey validation",
    script:
      "We’ll map your personas using a mix of in-depth interviews and lightweight survey validation. You’ll get both qualitative texture and directional quantitative signal.",
  },
  "V3-Full": {
    full: "V3-Full Immersion",
    descriptor: "full-scale quantitative and qualitative research",
    script:
      "This is our most rigorous approach — full primary research across your persona set, statistically validated at scale, with a Pollfish quantitative layer included.",
  },
};

export type VariantName = (typeof VARIANT_LADDER)[number];

const BASE_INDEX: Record<NonNullable<AssessmentState["timeframe"]>, number> = {
  long: 3,
  medium: 2,
  short: 1,
  sprint: 0,
};

export interface ModifierRow {
  label: string;
  shift: number;
  description: string;
}

export function getModifierRows(state: AssessmentState): ModifierRow[] {
  const rows: ModifierRow[] = [];

  // Client speed
  if (state.clientSpeed === "fast") {
    rows.push({ label: "Responsive client", shift: 0, description: "No shift" });
  } else if (state.clientSpeed === "medium") {
    rows.push({ label: "Medium responsiveness", shift: -1, description: "Step DOWN one" });
  } else if (state.clientSpeed === "slow") {
    rows.push({ label: "Slow / committee", shift: -2, description: "Step DOWN two" });
  }

  // Recruitment
  if (state.recruitment === "yes") {
    rows.push({ label: "Recruitment ready", shift: 0, description: "No shift" });
  } else if (state.recruitment === "uncertain") {
    rows.push({ label: "Recruitment uncertain", shift: -1, description: "Step DOWN one" });
  } else if (state.recruitment === "no") {
    rows.push({ label: "Can't recruit", shift: -99, description: "Force V0-Desk" });
  }

  // Personas
  if (state.personas === 1) {
    rows.push({ label: "1 Persona", shift: 0, description: "No shift" });
  } else if (state.personas === 2) {
    rows.push({ label: "2 Personas", shift: 1, description: "Step UP one" });
  } else if (state.personas === 3) {
    rows.push({ label: "3+ Personas", shift: 2, description: "Step UP to Full" });
  }

  return rows;
}

export function calculateVariant(state: AssessmentState): string {
  if (state.forcedVariant) return state.forcedVariant;
  if (!state.timeframe) return VARIANT_LADDER[0];

  // Recruitment "no" forces V0-Desk
  if (state.recruitment === "no") return "V0-Desk";

  let index = BASE_INDEX[state.timeframe];

  // Client speed
  if (state.clientSpeed === "medium") index -= 1;
  if (state.clientSpeed === "slow") index -= 2;

  // Recruitment
  if (state.recruitment === "uncertain") index -= 1;

  // Personas
  if (state.personas === 2) index += 1;
  if (state.personas === 3) index += 2;

  // Clamp
  index = Math.max(0, Math.min(3, index));

  return VARIANT_LADDER[index];
}
