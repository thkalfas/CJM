"use client";

import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";

export default function StartPage() {
  const router = useRouter();

  return (
    <>
      <TopBar />
      <main className="flex-grow pt-24 md:pt-28 pb-24 md:pb-12 px-4 md:px-8 lg:px-12 max-w-[1440px] mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left column */}
          <section className="lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-4 py-1.5 rounded-full mb-6 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                How we do it
              </span>
              <span className="material-symbols-outlined text-sm">
                settings
              </span>
            </div>

            <h1 className="text-[36px] lg:text-[56px] leading-[1.05] font-extrabold text-on-surface mb-6 font-[family-name:var(--font-sora)]">
              Everything we do is grounded in{" "}
              <span className="text-primary">our approach to change.</span>
            </h1>

            <p className="text-on-surface-variant text-lg lg:text-xl max-w-xl leading-relaxed">
              We use a rigorous yet adaptable methodology to ensure every
              intervention delivers measurable impact and sustainable results.
            </p>
          </section>

          {/* Right column */}
          <section>
            <div className="bg-primary rounded-xl lg:rounded-2xl p-8 lg:p-12 text-on-primary shadow-2xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              <div className="flex flex-col gap-12 lg:gap-16">
                {/* Step 0 — Start Assessment */}
                <div className="flex flex-col gap-4 relative">
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold mb-3 font-[family-name:var(--font-sora)]">
                      Start Assessment
                    </h3>
                    <p className="text-base opacity-90 leading-relaxed mb-8 max-w-md">
                      A 2-minute decision tool designed to pick the right
                      process for your specific organizational needs.
                    </p>
                    <button
                      onClick={() => router.push("/blockers")}
                      className="bg-white text-primary font-bold py-3.5 px-10 rounded-lg uppercase tracking-wider hover:bg-surface-container transition-all active:scale-95 shadow-lg inline-flex items-center gap-2"
                    >
                      Launch Tool
                      <span className="material-symbols-outlined text-sm">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Desktop footer */}
      <footer className="hidden lg:block bg-surface-container-low border-t border-outline-variant py-6 px-12">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center text-on-surface-variant text-sm">
          <p>&copy; 2024 CJM Framework. All rights reserved.</p>
          <div className="flex gap-8">
            <a className="hover:text-primary transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-primary transition-colors" href="#">
              Terms of Service
            </a>
            <a className="hover:text-primary transition-colors" href="#">
              Support
            </a>
          </div>
        </div>
      </footer>

      <BottomNav />
    </>
  );
}
