"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const tabs = [
  { href: "/start", icon: "rocket_launch", label: "Start" },
  { href: "/blockers", icon: "rule", label: "Blockers" },
  { href: "/picker", icon: "grid_view", label: "Picker" },
  { href: "/result", icon: "analytics", label: "Result" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex md:hidden justify-around items-center h-16 bg-surface-container-lowest px-2 border-t border-outline-variant">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
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
        );
      })}
    </nav>
  );
}
