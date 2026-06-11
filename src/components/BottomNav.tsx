"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAssessment } from "@/context/AssessmentContext";
import { clsx } from "clsx";

const tabs = [
  { href: "/start", icon: "rocket_launch", label: "Start" },
  { href: "/blockers", icon: "rule", label: "Blockers" },
  { href: "/picker", icon: "grid_view", label: "Picker" },
  { href: "/reality", icon: "fact_check", label: "Reality" },
  { href: "/result", icon: "analytics", label: "Result" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const { state } = useAssessment();

  const blockersComplete = ["q1", "q2", "q3", "q4", "q5"].every(
    (k) => state.blockers[k] !== null
  );
  const hasForced = state.forcedVariant !== null;
  const pickerComplete = state.timeframe !== null && state.outputUse !== null;
  const realityComplete =
    state.clientSpeed !== null &&
    state.recruitment !== null &&
    state.personas !== null;

  const reachedResult = hasForced || realityComplete;
  const reachedPicker = pickerComplete || reachedResult;

  function isUnlocked(href: string): boolean {
    if (href === "/start" || href === "/blockers") return true;
    if (href === "/picker") return blockersComplete && (reachedPicker || !hasForced);
    if (href === "/reality") return pickerComplete || reachedResult;
    if (href === "/result") return reachedResult;
    return false;
  }

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex md:hidden justify-around items-center h-16 bg-surface-container-lowest px-2 border-t border-outline-variant">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        const unlocked = isUnlocked(tab.href);
        return unlocked ? (
          <Link
            key={tab.href}
            href={tab.href}
            className={clsx(
              "flex flex-col items-center justify-center pt-1 transition-all",
              active
                ? "text-primary font-bold border-t-2 border-primary"
                : "text-outline"
            )}
          >
            <span
              className={clsx(
                "material-symbols-outlined",
                active && "filled"
              )}
            >
              {tab.icon}
            </span>
            <span className="text-[10px] font-bold uppercase mt-1">
              {tab.label}
            </span>
          </Link>
        ) : (
          <span
            key={tab.href}
            className="flex flex-col items-center justify-center pt-1 text-outline/30 cursor-not-allowed"
          >
            <span className="material-symbols-outlined">{tab.icon}</span>
            <span className="text-[10px] font-bold uppercase mt-1">
              {tab.label}
            </span>
          </span>
        );
      })}
    </nav>
  );
}
