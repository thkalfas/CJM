export interface AssessmentState {
  blockers: Record<string, "yes" | "no" | null>; // q1..q5
  timeframe: "long" | "medium" | "short" | "sprint" | null;
  outputUse: "strategic" | "internal" | "deliverable" | null;
  clientSpeed: "fast" | "medium" | "slow" | null;
  recruitment: "yes" | "uncertain" | "no" | null;
  personas: 1 | 2 | 3 | null;
  forcedVariant: string | null;
}

export const INITIAL_STATE: AssessmentState = {
  blockers: { q1: null, q2: null, q3: null, q4: null, q5: null },
  timeframe: null,
  outputUse: null,
  clientSpeed: null,
  recruitment: null,
  personas: null,
  forcedVariant: null,
};
