"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAssessment } from "@/context/AssessmentContext";
import { calculateVariant, getModifierRows, VARIANT_META } from "@/lib/logic";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { clsx } from "clsx";

export default function ResultPage() {
  const router = useRouter();
  const { state, resetState } = useAssessment();

  // Guard: must have forced variant (from blockers) OR completed reality check
  const realityComplete =
    state.clientSpeed !== null &&
    state.recruitment !== null &&
    state.personas !== null;
  useEffect(() => {
    if (!state.forcedVariant && !realityComplete) {
      router.replace("/blockers");
    }
  }, [state.forcedVariant, realityComplete, router]);

  const isEscalate = state.forcedVariant === "ESCALATE";
  const variant = calculateVariant(state);
  const modifiers = getModifierRows(state);
  const meta = VARIANT_META[variant] ?? VARIANT_META["V3"];

  const speedLabel =
    state.clientSpeed === "fast"
      ? "Fast"
      : state.clientSpeed === "medium"
        ? "Medium"
        : state.clientSpeed === "slow"
          ? "Slow"
          : "—";

  const recruitLabel =
    state.recruitment === "yes"
      ? "Ready"
      : state.recruitment === "uncertain"
        ? "Uncertain"
        : state.recruitment === "no"
          ? "No"
          : "—";

  const personaLabel =
    state.personas === 1
      ? "1"
      : state.personas === 2
        ? "2"
        : state.personas === 3
          ? "3+"
          : "—";

  function restartAssessment() {
    resetState();
    router.push("/start");
  }

  return (
    <>
      <TopBar />
      <main className="flex-grow pt-24 md:pt-28 pb-32 md:pb-12 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        {isEscalate ? (
          <>
            {/* ESCALATE layout */}
            <div className="flex flex-col gap-1 mb-8">
              <span className="text-label-sm text-error uppercase tracking-widest font-bold">
                Escalation Required
              </span>
              <h1 className="text-headline-lg md:text-display-lg text-on-surface font-[family-name:var(--font-sora)] font-extrabold">
                Cannot Proceed
              </h1>
            </div>

            <div className="bg-error-container border-2 border-error rounded-xl p-8 md:p-10 shadow-lg mb-8">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-error text-4xl filled flex-shrink-0">
                  warning
                </span>
                <div>
                  <h2 className="text-headline-md text-on-error-container font-[family-name:var(--font-sora)] mb-3">
                    This engagement cannot proceed as scoped.
                  </h2>
                  <p className="text-body-lg text-on-error-container leading-relaxed">
                    The team or data access required to deliver any CJM variant
                    is not available. Rescope the engagement before continuing.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant p-6 md:p-8 rounded-xl shadow-sm mb-8">
              <h3 className="text-label-md text-on-surface font-bold mb-4 font-[family-name:var(--font-sora)]">
                What to do next
              </h3>
              <ul className="space-y-3 text-body-md text-on-surface-variant">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-error text-lg mt-0.5">
                    arrow_forward
                  </span>
                  Escalate to the engagement manager or trigger a Bar Raiser
                  review.
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-error text-lg mt-0.5">
                    arrow_forward
                  </span>
                  Negotiate with the client for team access or existing data
                  before restarting the assessment.
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-error text-lg mt-0.5">
                    arrow_forward
                  </span>
                  If constraints are immovable, push back on the engagement
                  scope in writing.
                </li>
              </ul>
            </div>

            <button
              onClick={restartAssessment}
              className="w-full py-5 px-8 rounded-2xl text-label-md font-black uppercase tracking-widest flex justify-between items-center transition-all shadow-xl active:scale-95 bg-primary text-on-primary hover:bg-surface-tint hover:shadow-2xl font-[family-name:var(--font-sora)] group"
            >
              <span>Restart Assessment</span>
              <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">
                restart_alt
              </span>
            </button>
          </>
        ) : (
          <>
            {/* Normal result layout */}
            {/* Header row */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div className="flex flex-col gap-1">
                <span className="text-label-sm text-primary uppercase tracking-widest font-bold">
                  Assessment Complete
                </span>
                <h1 className="text-headline-lg md:text-display-lg text-on-surface font-[family-name:var(--font-sora)] font-extrabold">
                  Final Result
                </h1>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <button
                  onClick={restartAssessment}
                  className="border-2 border-outline text-on-surface py-3 px-8 rounded-xl text-label-md font-bold uppercase tracking-wider hover:bg-surface-container-low transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">
                    restart_alt
                  </span>
                  Restart
                </button>
              </div>
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Left column */}
              <div className="lg:col-span-4 space-y-6">
                {/* Selection Logic Summary */}
                <div className="bg-surface-container-lowest border border-outline-variant p-6 md:p-8 rounded-xl shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-label-md text-primary font-bold mb-6 font-[family-name:var(--font-sora)]">
                      Selection Logic Summary
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex items-center justify-between border-b border-surface-container-low pb-3">
                        <span className="text-body-md text-on-surface-variant">
                          Client Responsiveness
                        </span>
                        <span className="text-label-sm font-bold bg-surface-container-high px-2 py-1 rounded">
                          {speedLabel}
                        </span>
                      </li>
                      <li className="flex items-center justify-between border-b border-surface-container-low pb-3">
                        <span className="text-body-md text-on-surface-variant">
                          Recruitment
                        </span>
                        <span
                          className={clsx(
                            "text-label-sm font-bold px-2 py-1 rounded",
                            state.recruitment === "uncertain" ||
                              state.recruitment === "no"
                              ? "bg-error-container text-on-error-container"
                              : "bg-surface-container-high text-on-surface"
                          )}
                        >
                          {recruitLabel}
                        </span>
                      </li>
                      <li className="flex items-center justify-between border-b border-surface-container-low pb-3">
                        <span className="text-body-md text-on-surface-variant">
                          Personas
                        </span>
                        <span className="text-label-sm font-bold bg-surface-container-high px-2 py-1 rounded">
                          {personaLabel}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-8 hidden lg:block">
                    <span className="material-symbols-outlined text-outline-variant text-5xl">
                      account_tree
                    </span>
                  </div>
                </div>

                {/* Internal Note */}
                {modifiers.length > 0 && (
                  <div className="bg-tertiary-fixed text-on-tertiary-fixed p-6 rounded-xl shadow-sm border-l-4 border-primary/40">
                    <h5 className="text-label-md font-bold mb-3 flex items-center gap-2 font-[family-name:var(--font-sora)]">
                      <span className="material-symbols-outlined text-sm">
                        push_pin
                      </span>
                      Internal Note
                    </h5>
                    <div className="space-y-2">
                      {modifiers.map((mod) => (
                        <div
                          key={mod.label}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="material-symbols-outlined text-sm">
                            {mod.shift > 0
                              ? "arrow_upward"
                              : mod.shift < 0
                                ? "arrow_downward"
                                : "check_circle"}
                          </span>
                          <span>
                            {mod.label}: {mod.note} (
                            {mod.shift > 0 ? "+" : ""}
                            {mod.shift === -99 ? "force V3" : mod.shift})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right column */}
              <div className="lg:col-span-8 space-y-6">
                {/* Final Recommended Variant */}
                <div className="bg-primary text-on-primary p-8 md:p-10 rounded-xl flex flex-col justify-center items-start min-h-[280px] md:min-h-[320px] shadow-xl shadow-primary/20 relative overflow-hidden group">
                  <div className="absolute -right-10 -top-10 w-64 h-64 bg-secondary opacity-20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl" />
                  <h3 className="text-label-md text-on-primary-container mb-6 z-10 tracking-widest uppercase opacity-80 font-[family-name:var(--font-sora)]">
                    Final Recommended Variant
                  </h3>
                  <div className="flex flex-col gap-8 z-10 w-full">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 md:p-8 rounded-2xl inline-block max-w-max">
                      <h4 className="text-4xl md:text-display-lg text-white font-[family-name:var(--font-sora)] font-extrabold">
                        {meta.label}
                      </h4>
                    </div>
                    <div className="flex items-center gap-4 text-on-primary text-body-lg">
                      <span className="material-symbols-outlined text-secondary-fixed text-3xl filled">
                        check_circle
                      </span>
                      Optimized for {meta.descriptor}
                    </div>
                  </div>
                </div>

                {/* Client Communication Script */}
                <div className="bg-surface-container-lowest border border-outline-variant p-6 md:p-8 rounded-xl shadow-sm relative">
                  <div className="absolute top-0 right-0 p-8 hidden md:block">
                    <span className="material-symbols-outlined text-surface-container-highest text-8xl opacity-30">
                      format_quote
                    </span>
                  </div>
                  <h3 className="text-label-md text-primary font-bold mb-6 font-[family-name:var(--font-sora)]">
                    Client Communication Script
                  </h3>
                  <div className="bg-surface-container-low p-6 md:p-8 rounded-xl border-l-4 border-secondary relative z-10">
                    <p className="text-body-lg text-on-surface italic leading-relaxed">
                      &ldquo;{meta.script}&rdquo;
                    </p>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <a
                      href={meta.notionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-label-md font-bold text-secondary py-3 px-6 rounded-xl hover:bg-secondary/5 transition-colors border border-transparent hover:border-secondary/20 uppercase tracking-wider"
                    >
                      <span className="material-symbols-outlined text-sm">
                        open_in_new
                      </span>
                      View in Notion
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile-only footer actions */}
            <div className="md:hidden flex flex-col gap-4 pt-8">
              <button
                onClick={restartAssessment}
                className="border-2 border-outline text-on-surface py-5 rounded-xl text-label-md font-bold uppercase tracking-wider hover:bg-surface-container-low transition-all flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined">restart_alt</span>
                Restart Assessment
              </button>
            </div>
          </>
        )}
      </main>
      <BottomNav />
    </>
  );
}
