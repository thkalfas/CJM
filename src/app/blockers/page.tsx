"use client";

import { useRouter } from "next/navigation";
import { useAssessment } from "@/context/AssessmentContext";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { clsx } from "clsx";

const questions = [
  {
    id: "q1",
    text: "Is there a regulatory or legal prohibition on conducting primary customer research?",
    sub: "(e.g. certain financial / pharma / defence / minor-focused clients)",
  },
  {
    id: "q2",
    text: "Is the end-customer base unreachable within the engagement timeline?",
    sub: "(no list access, no consent mechanism, no public-facing channel to recruit from, language barriers unsolvable in time)",
  },
  {
    id: "q3",
    text: "Is the client's internal team unavailable for even one half-day working session?",
    sub: null,
  },
  {
    id: "q4",
    text: "Do we have zero prior research, zero CRM data, and no stakeholder access?",
    sub: null,
  },
  {
    id: "q5",
    text: "Is the CJM output intended to support a high-stakes decision?",
    sub: "(€M+ investment, regulatory submission, external publication)",
  },
];

const answeredCount = (blockers: Record<string, "yes" | "no" | null>) =>
  questions.filter((q) => blockers[q.id] !== null).length;

export default function BlockersPage() {
  const router = useRouter();
  const { state, setState } = useAssessment();
  const { blockers } = state;

  const allAnswered = questions.every((q) => blockers[q.id] !== null);
  const anyYes = questions.some((q) => blockers[q.id] === "yes");

  function setAnswer(id: string, value: "yes" | "no") {
    setState((prev) => ({
      ...prev,
      blockers: {
        ...prev.blockers,
        [id]: prev.blockers[id] === value ? null : value,
      },
    }));
  }

  const clearPickerReality = {
    timeframe: null,
    outputUse: null,
    clientSpeed: null,
    recruitment: null,
    personas: null,
  } as const;

  function handleContinue() {
    if (!allAnswered) return;
    const yesAnswers = ["q1", "q2", "q3", "q4", "q5"].filter(
      (k) => blockers[k] === "yes"
    );
    if (yesAnswers.includes("q3") || yesAnswers.includes("q4")) {
      setState((prev) => ({ ...prev, ...clearPickerReality, forcedVariant: "ESCALATE" }));
      router.push("/result");
    } else if (yesAnswers.includes("q5")) {
      setState((prev) => ({ ...prev, ...clearPickerReality, forcedVariant: "Full" }));
      router.push("/result");
    } else if (yesAnswers.includes("q1") || yesAnswers.includes("q2")) {
      setState((prev) => ({ ...prev, ...clearPickerReality, forcedVariant: "V3" }));
      router.push("/result");
    } else {
      setState((prev) => ({ ...prev, forcedVariant: null }));
      router.push("/picker");
    }
  }

  return (
    <>
      <TopBar />
      <main className="flex-grow pt-24 md:pt-28 pb-44 md:pb-32 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-8">
            <div>
              <span className="text-label-sm text-primary uppercase tracking-widest font-bold">
                Step 1 of 4
              </span>
              <h1 className="text-display-lg text-on-surface mt-2 font-[family-name:var(--font-sora)]">
                Blocker Check
              </h1>
              <div className="h-2 w-16 bg-secondary mt-4 rounded-full" />
            </div>

            {/* Warning card */}
            <div className="p-6 bg-error-container border-2 border-error rounded-xl shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="material-symbols-outlined text-error text-3xl filled"
                >
                  warning
                </span>
                <h2 className="font-bold text-headline-md text-on-error-container uppercase font-[family-name:var(--font-sora)]">
                  Critical Constraint
                </h2>
              </div>
              <p className="text-body-lg text-on-error-container font-medium">
                Any YES selection forces a specific methodology outcome and
                restricts certain research paths. Review carefully.
              </p>
            </div>

            {/* Methodology note (desktop only) */}
            <div className="hidden lg:block bg-surface-container-low p-6 rounded-xl border border-outline-variant">
              <h3 className="text-label-md text-on-surface font-bold uppercase mb-4">
                Methodology Note
              </h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                This phase ensures that organizational constraints are mapped
                before exploring creative pathing. Skipping these gates often
                leads to late-stage project failure.
              </p>
            </div>
          </div>

          {/* Right content */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-6">
              {questions.map((q, i) => (
                <div
                  key={q.id}
                  className="bg-surface-container-lowest border border-outline-variant p-6 md:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
                    <div className="flex-grow">
                      <span className="inline-block px-2 py-1 bg-surface-variant text-label-sm rounded mb-3 text-on-surface-variant">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-body-lg text-on-surface font-medium leading-tight">
                        {q.text}
                      </p>
                      {q.sub && (
                        <p className="text-label-sm text-outline mt-2 italic">
                          {q.sub}
                        </p>
                      )}
                    </div>
                    <div className="flex border-2 border-outline-variant rounded-xl overflow-hidden flex-shrink-0 bg-background">
                      <button
                        onClick={() => setAnswer(q.id, "yes")}
                        className={clsx(
                          "px-6 md:px-8 py-3 text-label-md font-bold transition-all border-r-2 border-outline-variant",
                          blockers[q.id] === "yes"
                            ? "bg-error text-on-error"
                            : "text-outline hover:bg-error hover:text-white"
                        )}
                      >
                        YES
                      </button>
                      <button
                        onClick={() => setAnswer(q.id, "no")}
                        className={clsx(
                          "px-6 md:px-8 py-3 text-label-md font-bold transition-all",
                          blockers[q.id] === "no"
                            ? "bg-primary text-on-primary"
                            : "text-outline hover:bg-secondary hover:text-white"
                        )}
                      >
                        NO
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Spacer for sticky footer */}
            <div className="h-8" />
          </div>
        </div>
      </main>
      {/* Sticky footer */}
      <div className="fixed bottom-16 md:bottom-0 left-0 w-full bg-surface-container-lowest border-t border-outline-variant py-4 md:py-5 px-4 md:px-12 z-40 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <p className="text-label-sm text-outline">
            {answeredCount(blockers)} of 5 answered
          </p>
          <button
            onClick={handleContinue}
            disabled={!allAnswered}
            className={clsx(
              "px-10 py-3 rounded-full font-bold text-label-md uppercase tracking-widest transition-all shadow-lg active:scale-95",
              allAnswered
                ? "bg-primary text-on-primary hover:bg-primary-container shadow-primary/25"
                : "bg-outline text-white opacity-50 cursor-not-allowed"
            )}
          >
            Continue
          </button>
        </div>
      </div>

      <BottomNav />
    </>
  );
}
