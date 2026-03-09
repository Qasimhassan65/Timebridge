"use client";

import { useEffect, useState } from "react";
import { DateTime } from "luxon";

export default function HeaderClock() {
  const [time, setTime] = useState<DateTime | null>(null);

  useEffect(() => {
    setTime(DateTime.now());
    const interval = setInterval(() => {
      setTime(DateTime.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time)
    return (
      <div className="flex flex-col items-center justify-center py-20 sm:py-32 animate-pulse">
        <div className="h-16 w-60 sm:h-20 sm:w-80 bg-surface rounded-2xl mb-4" />
        <div className="h-4 w-32 sm:h-4 sm:w-40 bg-surface rounded-lg opacity-50" />
      </div>
    );

  return (
    <header className="flex flex-col items-center justify-center py-20 sm:py-32 text-center select-none relative">
      <div className="absolute top-6 left-0 sm:top-10 flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-accent opacity-50 shadow-[0_0_10px_#22c55e]" />
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">TimeBridge</span>
      </div>

      <div className="space-y-4 sm:space-y-8 w-full">
        <label className="text-[10px] sm:text-[11px] font-bold text-muted-text uppercase tracking-[0.3em] opacity-40">Local Clock</label>

        <div className="relative group flex flex-col items-center">
          <div className="flex items-center justify-center w-full">
            <h1 className="text-[18vw] sm:text-[10rem] lg:text-[12rem] font-medium tracking-tighter text-white tabular-nums leading-none flex items-baseline">
              {time.toFormat("HH:mm")}
              <span className="text-[4vw] sm:text-4xl lg:text-5xl text-accent font-bold align-top ml-1 sm:ml-2">.</span>
              <span className="text-[6vw] sm:text-5xl lg:text-6xl text-white/20 font-light ml-1">{time.toFormat("ss")}</span>
            </h1>
          </div>

          <div className="mt-8 sm:mt-12 flex flex-col items-center gap-4">
            <span className="text-sm sm:text-base font-medium text-white/80 tracking-wide">{time.toFormat("cccc, d MMMM yyyy")}</span>
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-border bg-surface/50 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-accent" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-muted-text">{time.zoneName}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
