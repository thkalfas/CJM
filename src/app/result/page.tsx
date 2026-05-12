"use client";

import { useRouter } from "next/navigation";
import { useAssessment } from "@/context/AssessmentContext";
import { calculateVariant, getModifierRows, VARIANT_META } from "@/lib/logic";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { clsx } from "clsx";
import { useState } from "react";

export default function ResultPage() {
  const router = useRouter();
  const { state, resetState } = useAssessment();
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const variant = calculateVariant(state);
  const modifiers = getModifierRows(state);
  const meta = VARIANT_META[variant] ?? VARIANT_META["V0-Desk"];

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

  function copyScript() {
    navigator.clipboard.writeText(meta.script).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function shareResult() {
    const payload = {
      title: "CJM Framework Result",
      text: `Recommended variant: ${meta.full}`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(payload);
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      });
    }
  }

  function restartAssessment() {
    resetState();
    router.push("/start");
  }

  return (
    <>
      <TopBar />
      <main className="flex-grow pt-24 md:pt-28 pb-32 md:pb-12 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto w-full">
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
              onClick={shareResult}
              className="bg-secondary text-on-secondary py-3 px-8 rounded-xl text-label-md font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-secondary/25 active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">
                {shared ? "check" : "share"}
              </span>
              {shared ? "Link Copied!" : "Share Result"}
            </button>
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
                        {mod.label}: {mod.description} (
                        {mod.shift > 0 ? "+" : ""}
                        {mod.shift === -99 ? "force V0" : mod.shift})
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
                    {meta.full}
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
                <button
                  onClick={copyScript}
                  className="flex items-center gap-2 text-label-md font-bold text-secondary py-3 px-6 rounded-xl hover:bg-secondary/5 transition-colors border border-transparent hover:border-secondary/20 uppercase tracking-wider"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copied ? "check" : "content_copy"}
                  </span>
                  {copied ? "Copied!" : "Copy Script"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-only footer actions */}
        <div className="md:hidden flex flex-col gap-4 pt-8">
          <button
            onClick={shareResult}
            className="bg-secondary text-on-secondary py-5 rounded-xl text-label-md font-bold uppercase tracking-wider hover:shadow-lg transition-all flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined">
              {shared ? "check" : "share"}
            </span>
            {shared ? "Link Copied!" : "Share Result"}
          </button>
          <button
            onClick={restartAssessment}
            className="border-2 border-outline text-on-surface py-5 rounded-xl text-label-md font-bold uppercase tracking-wider hover:bg-surface-container-low transition-all flex items-center justify-center gap-3"
          >
            <span className="material-symbols-outlined">restart_alt</span>
            Restart Assessment
          </button>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
