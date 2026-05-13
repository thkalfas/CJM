"use client";

import { useRouter } from "next/navigation";
import { useAssessment } from "@/context/AssessmentContext";
import { calculateVariant, getModifierRows, VARIANT_META } from "@/lib/logic";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { clsx } from "clsx";
import type { AssessmentState } from "@/lib/types";

const speedOptions: {
  value: NonNullable<AssessmentState["clientSpeed"]>;
  label: string;
  sub: string;
  shift: string;
  shiftColor: string;
}[] = [
  {
    value: "fast",
    label: "Fast",
    sub: "24-48h replies. Ideal for rapid iterations.",
    shift: "No Shift",
    shiftColor: "text-on-surface-variant/40",
  },
  {
    value: "medium",
    label: "Medium",
    sub: "2-3 day replies. Limited momentum.",
    shift: "-1 Variant",
    shiftColor: "text-secondary",
  },
  {
    value: "slow",
    label: "Slow",
    sub: "Committee/Unpredictable. High risk of stall.",
    shift: "-2 Variants",
    shiftColor: "text-error",
  },
];

const recruitOptions: {
  value: NonNullable<AssessmentState["recruitment"]>;
  label: string;
  sub: string;
  shift: string;
}[] = [
  { value: "yes", label: "Yes Ready", sub: "List & Consent ready", shift: "No shift required" },
  { value: "uncertain", label: "Uncertain", sub: "List exists, no consent yet", shift: "Step DOWN one variant" },
  { value: "no", label: "Not Available", sub: "Can't recruit in time", shift: "Step DOWN to V3" },
];

const personaOptions: {
  value: NonNullable<AssessmentState["personas"]>;
  label: string;
  sub: string;
  shift: string;
}[] = [
  { value: 1, label: "1", sub: "Persona", shift: "No shift required" },
  { value: 2, label: "2", sub: "Personas", shift: "+1 Variant Boost" },
  { value: 3, label: "3+", sub: "Personas", shift: "Step UP to Full" },
];

export default function RealityPage() {
  const router = useRouter();
  const { state, setState } = useAssessment();

  const allAnswered =
    state.clientSpeed !== null &&
    state.recruitment !== null &&
    state.personas !== null;

  const variant = calculateVariant(state);
  const modifiers = getModifierRows(state);

  return (
    <>
      <TopBar />
      <main className="flex-grow pt-24 md:pt-28 pb-32 md:pb-12 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        {/* Header */}
        <section className="mb-8 md:mb-12">
          <span className="text-label-sm text-primary uppercase tracking-widest font-bold">
            Step 03 — Reality Check
          </span>
          <h1 className="text-headline-lg md:text-display-lg text-primary mt-2 font-[family-name:var(--font-sora)] tracking-tighter">
            Reality Check
          </h1>
          <p className="text-body-lg text-on-surface-variant mt-2 max-w-2xl">
            Adjust your selection based on project constraints to ensure
            technical and operational feasibility before finalization.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left + Center: Selection sections */}
          <div className="lg:col-span-8 space-y-12">
            {/* 3A: Client Responsiveness */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-primary rounded-full" />
                <h3 className="text-headline-md text-primary font-[family-name:var(--font-sora)]">
                  3A: Client Responsiveness
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {speedOptions.map((opt) => {
                  const active = state.clientSpeed === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() =>
                        setState((prev) => ({ ...prev, clientSpeed: opt.value }))
                      }
                      className={clsx(
                        "flex flex-col p-6 bg-surface-container-lowest rounded-xl text-left transition-all shadow-sm hover:shadow-md h-full",
                        active
                          ? "border-2 border-primary"
                          : "border border-outline-variant hover:border-primary"
                      )}
                    >
                      <p className="text-body-md font-bold text-on-surface font-[family-name:var(--font-sora)] mb-2">
                        {opt.label}
                      </p>
                      <p className="text-label-sm text-on-surface-variant leading-relaxed">
                        {opt.sub}
                      </p>
                      <div className="mt-auto pt-4 flex justify-between items-center">
                        <span
                          className={clsx(
                            "text-[10px] font-black uppercase",
                            active ? opt.shiftColor : "text-on-surface-variant/40"
                          )}
                        >
                          {opt.shift}
                        </span>
                        <div
                          className={clsx(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                            active
                              ? "border-primary bg-primary"
                              : "border-outline-variant"
                          )}
                        >
                          {active && (
                            <div className="w-2.5 h-2.5 bg-white rounded-full" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 3B: Recruitment Feasibility */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-secondary rounded-full" />
                <h3 className="text-headline-md text-secondary font-[family-name:var(--font-sora)]">
                  3B: Recruitment Feasibility
                </h3>
              </div>
              <div className="bg-surface-container-lowest border border-outline-variant p-6 md:p-8 rounded-2xl shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  {recruitOptions.map((opt) => {
                    const active = state.recruitment === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() =>
                          setState((prev) => ({
                            ...prev,
                            recruitment: opt.value,
                          }))
                        }
                        className="flex items-start gap-4 text-left"
                      >
                        <div
                          className={clsx(
                            "mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                            active
                              ? "border-secondary bg-secondary"
                              : "border-outline-variant"
                          )}
                        >
                          {active && (
                            <div className="w-2.5 h-2.5 bg-white rounded-full" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-body-md font-bold text-on-surface font-[family-name:var(--font-sora)]">
                            {opt.label}
                          </span>
                          <span className="text-label-sm text-on-surface-variant mt-1">
                            {opt.sub}
                          </span>
                          <span className="text-[10px] text-secondary font-black uppercase mt-2">
                            {opt.shift}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 3C: Journey Coverage */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-surface-tint rounded-full" />
                <h3 className="text-headline-md text-surface-tint font-[family-name:var(--font-sora)]">
                  3C: Journey Coverage
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {personaOptions.map((opt) => {
                  const active = state.personas === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() =>
                        setState((prev) => ({ ...prev, personas: opt.value }))
                      }
                      className={clsx(
                        "p-8 text-left rounded-2xl transition-all",
                        active
                          ? "bg-primary-container border-4 border-primary shadow-xl scale-[1.02]"
                          : "bg-surface-container-lowest border border-outline-variant shadow-sm hover:border-primary hover:shadow-md group"
                      )}
                    >
                      <span
                        className={clsx(
                          "text-display-lg font-[family-name:var(--font-sora)]",
                          active
                            ? "text-on-primary-container"
                            : "text-outline-variant group-hover:text-primary transition-colors"
                        )}
                      >
                        {opt.label}
                      </span>
                      <p
                        className={clsx(
                          "text-label-md font-extrabold uppercase mt-2 font-[family-name:var(--font-sora)]",
                          active
                            ? "text-on-primary-container"
                            : "text-on-surface"
                        )}
                      >
                        {opt.sub}
                      </p>
                      <div
                        className={clsx(
                          "h-px w-full my-4",
                          active
                            ? "bg-primary opacity-30"
                            : "bg-outline-variant"
                        )}
                      />
                      <p
                        className={clsx(
                          "text-[10px] uppercase font-black tracking-widest",
                          active
                            ? "text-on-primary-container"
                            : "text-on-surface-variant"
                        )}
                      >
                        {opt.shift}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-8">
            {/* Adjusted Outcome card */}
            <div className="bg-secondary-container p-6 md:p-8 rounded-3xl shadow-2xl border-b-8 border-secondary overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <p className="text-[10px] text-on-secondary-fixed-variant uppercase tracking-[0.3em] font-black font-[family-name:var(--font-sora)]">
                    Adjusted Outcome
                  </p>
                  <h4 className="text-4xl text-on-secondary-fixed-variant mt-2 font-extrabold font-[family-name:var(--font-sora)]">
                    {allAnswered ? (VARIANT_META[variant]?.label ?? variant) : "—"}
                  </h4>
                </div>
                <div className="bg-secondary p-3 rounded-xl shadow-lg">
                  <span className="material-symbols-outlined text-white text-3xl">
                    analytics
                  </span>
                </div>
              </div>
              {allAnswered && modifiers.length > 0 && (
                <div className="space-y-4 relative z-10">
                  {modifiers.map((mod) => (
                    <div
                      key={mod.label}
                      className="flex items-center gap-4 py-3 px-5 bg-white/50 rounded-xl backdrop-blur-md border border-white/40"
                    >
                      <span className="material-symbols-outlined text-secondary font-bold">
                        {mod.shift > 0
                          ? "arrow_upward"
                          : mod.shift < 0
                            ? "arrow_downward"
                            : "check_circle"}
                      </span>
                      <span className="text-on-secondary-fixed-variant font-bold text-sm">
                        {mod.note} ({mod.shift > 0 ? "+" : ""}
                        {mod.shift === -99 ? "force V3" : mod.shift})
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {!allAnswered && (
                <p className="text-sm text-on-secondary-fixed-variant/60 italic relative z-10">
                  Answer all questions to see the adjusted outcome.
                </p>
              )}
            </div>

            {/* Pro-Tip sticky note */}
            <div className="hidden lg:block bg-tertiary-fixed p-6 -rotate-1 border border-outline-variant shadow-lg rounded-sm relative">
              <div className="absolute top-0 right-4 w-8 h-8 bg-tertiary/10 rounded-b-lg" />
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-on-tertiary-fixed text-xl">
                  lightbulb
                </span>
                <p className="text-label-sm font-black uppercase text-on-tertiary-fixed tracking-wider font-[family-name:var(--font-sora)]">
                  Project Advice
                </p>
              </div>
              <p className="text-on-tertiary-fixed text-sm leading-relaxed italic">
                &ldquo;If client responsiveness is &lsquo;Slow&rsquo;, consider
                switching to an asynchronous workshop model to keep the timeline
                from slipping.&rdquo;
              </p>
            </div>

            {/* Finalize button */}
            <button
              onClick={() => allAnswered && router.push("/result")}
              disabled={!allAnswered}
              className={clsx(
                "w-full py-5 md:py-6 px-8 md:px-10 rounded-2xl text-label-md font-black uppercase tracking-widest flex justify-between items-center transition-all shadow-xl active:scale-95 font-[family-name:var(--font-sora)] group",
                allAnswered
                  ? "bg-primary text-on-primary hover:bg-surface-tint hover:shadow-2xl"
                  : "bg-outline text-white opacity-50 cursor-not-allowed"
              )}
            >
              <span>Finalize & See Result</span>
              <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
