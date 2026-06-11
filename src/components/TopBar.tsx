"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAssessment } from "@/context/AssessmentContext";
import { clsx } from "clsx";

const navLinks = [
  { href: "/start", icon: "home", label: "Start" },
  { href: "/blockers", icon: "rule", label: "Blockers" },
  { href: "/picker", icon: "grid_view", label: "Picker" },
  { href: "/reality", icon: "fact_check", label: "Reality" },
  { href: "/result", icon: "analytics", label: "Result" },
] as const;

export default function TopBar() {
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

  // Once you've reached a step, all previous steps stay unlocked
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
    <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest border-b border-outline-variant">
      {/* Mobile header */}
      <div className="flex md:hidden justify-between items-center px-4 h-16">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">menu</span>
          <span className="text-xl font-extrabold text-primary tracking-tighter">
            CJM
          </span>
        </div>
        <span className="material-symbols-outlined text-primary text-3xl">
          account_circle
        </span>
      </div>

      {/* Desktop header */}
      <div className="hidden md:flex justify-between items-center px-8 lg:px-12 h-20">
        <div className="flex items-center">
          <h1 className="text-xl font-extrabold text-primary tracking-tighter uppercase font-[family-name:var(--font-sora)]">
            CJM Framework
          </h1>
        </div>

        <nav className="flex items-center gap-8">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            const unlocked = isUnlocked(link.href);
            return unlocked ? (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "flex items-center gap-2 py-2 text-label-md uppercase tracking-widest transition-colors",
                  active
                    ? "text-primary font-bold border-b-2 border-primary"
                    : "text-outline hover:text-primary"
                )}
              >
                <span
                  className={clsx(
                    "material-symbols-outlined text-xl",
                    active && "filled"
                  )}
                >
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </Link>
            ) : (
              <span
                key={link.href}
                className="flex items-center gap-2 py-2 text-label-md uppercase tracking-widest text-outline/30 cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-xl">
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </span>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end">
            <p className="text-label-md font-bold text-on-surface">
              Project Admin
            </p>
            <p className="text-[10px] text-outline uppercase tracking-wider">
              admin@cjm.frame
            </p>
          </div>
          <span className="material-symbols-outlined text-primary text-3xl">
            account_circle
          </span>
        </div>
      </div>
    </header>
  );
}
