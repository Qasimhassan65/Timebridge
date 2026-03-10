"use client";

import { useEffect, useState } from "react";
import { DateTime } from "luxon";

// Renders a stable SSR skeleton that is visually identical to the loaded clock,
// then hydrates instantly on the client — no layout shift, no "blank" clock.
export default function HeaderClock() {
  // We track HH:mm:ss as plain strings so the component always has *something* to render.
  // The initial SSR value is "00:00" / "00" / empty strings — suppressed via
  // suppressHydrationWarning so React never throws a hydration mismatch.
  const [hhmm, setHhmm] = useState("--:--");
  const [ss, setSs] = useState("--");
  const [dateStr, setDateStr] = useState("");
  const [zoneName, setZoneName] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Immediately set real time on first client render
    const tick = () => {
      const now = DateTime.now();
      setHhmm(now.toFormat("HH:mm"));
      setSs(now.toFormat("ss"));
      setDateStr(now.toFormat("cccc, d MMMM yyyy"));
      setZoneName(now.zoneName ?? "");
    };

    tick();
    setMounted(true);
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="flex flex-col items-center justify-center py-20 sm:py-32 text-center select-none relative">
      {/* Brand label */}
      <div className="absolute top-6 left-0 sm:top-10 flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-accent opacity-50 shadow-[0_0_10px_#22c55e]" />
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">TimeBridge</span>
      </div>

      <div className="space-y-4 sm:space-y-8 w-full">
        <label className="text-[10px] sm:text-[11px] font-bold text-muted-text uppercase tracking-[0.3em] opacity-40">Local Clock</label>

        <div className="relative group flex flex-col items-center">
          <div className="flex items-center justify-center w-full">
            {/* suppressHydrationWarning prevents React from complaining about the
                SSR "--:--" vs client real-time mismatch on first paint */}
            <h1 suppressHydrationWarning className="text-[18vw] sm:text-[10rem] lg:text-[12rem] font-medium tracking-tighter text-white tabular-nums leading-none flex items-baseline">
              {hhmm}
              <span className="text-[4vw] sm:text-4xl lg:text-5xl text-accent font-bold align-top ml-1 sm:ml-2">.</span>
              <span suppressHydrationWarning className="text-[6vw] sm:text-5xl lg:text-6xl text-white/20 font-light ml-1">
                {ss}
              </span>
            </h1>
          </div>

          <div className="mt-8 sm:mt-12 flex flex-col items-center gap-4">
            <span suppressHydrationWarning className="text-sm sm:text-base font-medium text-white/80 tracking-wide" style={{ minHeight: "1.5rem" }}>
              {dateStr}
            </span>

            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-border bg-surface/50 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-accent" style={mounted ? { animation: "none" } : {}} />
              </div>
              <span suppressHydrationWarning className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-muted-text" style={{ minWidth: "8ch" }}>
                {zoneName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
