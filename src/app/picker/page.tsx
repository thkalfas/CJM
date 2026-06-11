"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAssessment } from "@/context/AssessmentContext";
import { getBaseResult } from "@/lib/logic";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { clsx } from "clsx";
import type { AssessmentState } from "@/lib/types";

const timeOptions: {
  value: AssessmentState["timeframe"];
  tag: string;
  label: string;
  sub: string;
}[] = [
  { value: "long", tag: "LONG", label: ">=3 weeks", sub: "Comprehensive Research" },
  { value: "medium", tag: "MEDIUM", label: "4-6 days", sub: "Focused Workshop" },
  { value: "short", tag: "SHORT", label: "2-3 days", sub: "Rapid Prototyping" },
  { value: "sprint", tag: "SPRINT", label: "<=1 day", sub: "Ideation Burst" },
];

const outputOptions: {
  value: AssessmentState["outputUse"];
  label: string;
  sub: string;
}[] = [
  { value: "strategic", label: "Strategic", sub: "Future state planning & vision." },
  { value: "internal", label: "Internal", sub: "Team alignment & workflow sync." },
  { value: "deliverable", label: "Deliverable", sub: "Client-facing final asset." },
];

const previewData: Record<string, { title: string; body: string }> = {
  strategic: {
    title: "Strategic Workshop",
    body: "A focused intensive to map out long-term user experience goals and internal alignments.",
  },
  internal: {
    title: "Internal Alignment Sprint",
    body: "A rapid session to synchronize team workflows and validate internal journey assumptions.",
  },
  deliverable: {
    title: "Deliverable Production",
    body: "A structured process to produce a client-ready journey map as the primary project output.",
  },
};

const proTips: Record<string, string> = {
  strategic:
    "Selecting \"Strategic\" adds additional stakeholders and a visioning workshop to your journey.",
  internal:
    "\"Internal\" mode focuses on team-facing outputs — ideal when the CJM is a coordination tool, not a deliverable.",
  deliverable:
    "\"Deliverable\" mode prioritizes polish and presentation — the CJM becomes the primary client artifact.",
};

export default function PickerPage() {
  const router = useRouter();
  const { state, setState } = useAssessment();

  // Guard: blockers must be completed
  const blockersComplete = ["q1", "q2", "q3", "q4", "q5"].every(
    (k) => state.blockers[k] !== null
  );
  useEffect(() => {
    if (!blockersComplete) {
      router.replace("/blockers");
    }
  }, [blockersComplete, router]);

  const bothSelected = state.timeframe !== null && state.outputUse !== null;
  const pickerResult =
    bothSelected ? getBaseResult(state.timeframe!, state.outputUse!) : null;
  const isRescope =
    pickerResult === "RESCOPE_STEPUP" || pickerResult === "RESCOPE_DONT_TAKE";
  const canContinue = bothSelected && !isRescope;

  const timeLabel = timeOptions.find((t) => t.value === state.timeframe)?.label;
  const outputLabel = outputOptions.find((o) => o.value === state.outputUse)?.label;
  const preview = state.outputUse ? previewData[state.outputUse] : null;
  const proTip = state.outputUse ? proTips[state.outputUse] : null;

  return (
    <>
      <TopBar />
      <main className="flex-grow pt-24 md:pt-28 pb-44 md:pb-32 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        {/* Step header */}
        <div className="mb-8 md:mb-12 text-center md:text-left">
          <p className="text-label-sm text-primary mb-2 uppercase tracking-widest font-bold">
            Step 02 — Selection
          </p>
          <h1 className="text-headline-lg md:text-display-lg text-on-surface font-[family-name:var(--font-sora)]">
            The Picker
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Left + Center: Controls */}
          <div className="lg:col-span-8 space-y-12">
            {/* Time Available */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-label-md text-outline uppercase tracking-widest">
                  Time Available
                </h3>
                <span className="hidden md:block text-xs text-on-surface-variant italic">
                  Select how much time you have for this phase
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {timeOptions.map((opt) => {
                  const active = state.timeframe === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() =>
                        setState((prev) => ({ ...prev, timeframe: prev.timeframe === opt.value ? null : opt.value }))
                      }
                      className={clsx(
                        "flex flex-col p-4 md:p-5 rounded-lg text-left transition-all",
                        active
                          ? "bg-primary text-on-primary shadow-lg shadow-primary/20 border border-primary ring-4 ring-primary/10"
                          : "bg-surface-container-lowest border border-outline-variant hover:border-primary/50 hover:bg-surface-container-low"
                      )}
                    >
                      <span
                        className={clsx(
                          "text-label-sm mb-1 uppercase",
                          active ? "text-on-primary/80" : "text-primary"
                        )}
                      >
                        {opt.tag}
                      </span>
                      <span
                        className={clsx(
                          "text-headline-md leading-none mb-2 font-[family-name:var(--font-sora)]",
                          !active && "text-on-surface"
                        )}
                      >
                        {opt.label}
                      </span>
                      <span
                        className={clsx(
                          "text-label-sm",
                          active ? "text-on-primary/70" : "text-on-surface-variant"
                        )}
                      >
                        {opt.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Use of Output */}
            <section>
              <h3 className="text-label-md text-outline uppercase mb-6 tracking-widest">
                Use of Output
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {outputOptions.map((opt) => {
                  const active = state.outputUse === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() =>
                        setState((prev) => ({ ...prev, outputUse: prev.outputUse === opt.value ? null : opt.value }))
                      }
                      className={clsx(
                        "relative p-5 bg-surface-container-lowest rounded-xl flex flex-col justify-between text-left transition-all h-full",
                        active
                          ? "border-2 border-primary shadow-sm"
                          : "border border-outline-variant opacity-60 hover:opacity-80 hover:border-primary/30"
                      )}
                    >
                      <div className="mb-4">
                        <span className="block text-headline-md text-on-surface font-[family-name:var(--font-sora)]">
                          {opt.label}
                        </span>
                        <span className="text-body-md text-on-surface-variant">
                          {opt.sub}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        {active && (
                          <span className="text-[10px] font-bold text-primary">
                            SELECTED
                          </span>
                        )}
                        <div
                          className={clsx(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-auto",
                            active ? "border-primary" : "border-outline-variant"
                          )}
                        >
                          {active && (
                            <div className="w-3 h-3 bg-primary rounded-full" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Rescope warnings */}
            {pickerResult === "RESCOPE_STEPUP" && (
              <div className="flex items-start gap-4 p-6 bg-amber-50 border-2 border-amber-400 rounded-xl">
                <span className="material-symbols-outlined text-amber-600 text-2xl flex-shrink-0 mt-0.5">
                  warning
                </span>
                <div>
                  <h4 className="text-body-md font-bold text-amber-800 font-[family-name:var(--font-sora)] mb-1">
                    Rescope Recommended
                  </h4>
                  <p className="text-body-md text-amber-700 leading-relaxed">
                    Step up to V1 or rescope time — this combination is not
                    recommended as a primary deliverable.
                  </p>
                </div>
              </div>
            )}
            {pickerResult === "RESCOPE_DONT_TAKE" && (
              <div className="flex items-start gap-4 p-6 bg-error-container border-2 border-error rounded-xl">
                <span className="material-symbols-outlined text-error text-2xl flex-shrink-0 mt-0.5 filled">
                  warning
                </span>
                <div>
                  <h4 className="text-body-md font-bold text-on-error-container font-[family-name:var(--font-sora)] mb-1">
                    Cannot Proceed
                  </h4>
                  <p className="text-body-md text-on-error-container leading-relaxed">
                    Don&apos;t take this job as-is — rescope the engagement
                    before continuing.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24">
              <h3 className="text-label-md text-outline uppercase mb-4 tracking-widest">
                Preview
              </h3>

              {/* Preview image placeholder */}
              <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest p-2 shadow-sm mb-6">
                <div className="w-full h-48 md:h-64 overflow-hidden rounded-xl bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-outline text-6xl">
                    image
                  </span>
                </div>
                {preview ? (
                  <div className="p-4">
                    <h4 className="text-on-surface font-bold mb-2 font-[family-name:var(--font-sora)]">
                      {preview.title}
                    </h4>
                    <p className="text-body-md text-on-surface-variant">
                      {preview.body}
                    </p>
                  </div>
                ) : (
                  <div className="p-4">
                    <p className="text-body-md text-outline italic">
                      Select an output type to see a preview.
                    </p>
                  </div>
                )}
              </div>

              {/* Pro Tip */}
              {proTip && (
                <div className="hidden lg:block p-6 bg-secondary-fixed/30 rounded-xl border border-primary/20">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">
                      lightbulb
                    </span>
                    <div>
                      <h5 className="text-label-md font-bold text-primary uppercase mb-1">
                        Pro Tip
                      </h5>
                      <p className="text-sm text-on-surface-variant leading-relaxed">
                        {proTip}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Sticky footer */}
      <div className="fixed bottom-16 md:bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant py-4 md:py-5 px-4 md:px-12 z-40 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-4 md:gap-0">
          <div className="flex items-center gap-6 md:gap-12">
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold text-outline uppercase tracking-wider">
                Selected Timeframe
              </span>
              <span className="text-label-md md:text-headline-md text-primary leading-none font-[family-name:var(--font-sora)]">
                {timeLabel?.toUpperCase() ?? "—"}
              </span>
            </div>
            <div className="h-8 w-px bg-outline-variant" />
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold text-outline uppercase tracking-wider">
                Chosen Output
              </span>
              <span className="text-label-md md:text-headline-md text-primary leading-none font-[family-name:var(--font-sora)]">
                {outputLabel?.toUpperCase() ?? "—"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => router.push("/blockers")}
              className="flex-1 md:flex-none border-2 border-outline text-on-surface px-8 py-3 rounded-full font-bold text-label-md uppercase tracking-widest hover:bg-surface-container-low transition-all"
            >
              Back
            </button>
            <button
              onClick={() => canContinue && router.push("/reality")}
              disabled={!canContinue}
              className={clsx(
                "flex-1 md:flex-none px-10 py-3 rounded-full font-bold text-label-md uppercase tracking-widest transition-all shadow-lg active:scale-95",
                canContinue
                  ? "bg-primary text-on-primary hover:bg-primary-container shadow-primary/25"
                  : "bg-outline text-white opacity-50 cursor-not-allowed"
              )}
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </>
  );
}
