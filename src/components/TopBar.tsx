"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const navLinks = [
  { href: "/start", icon: "home", label: "Start" },
  { href: "/blockers", icon: "rule", label: "Blockers" },
  { href: "/picker", icon: "grid_view", label: "Picker" },
  { href: "/result", icon: "analytics", label: "Result" },
] as const;

export default function TopBar() {
  const pathname = usePathname();

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
            return (
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
