"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { DateTime } from "luxon";
import { Calendar, MapPin, Sun, Moon, ArrowRightLeft, ChevronRight, ChevronLeft, Timer, Info, Laptop, User } from "lucide-react";
import { useLocalStorage } from "@/lib/useStorage";
import { Client } from "./ClientCard";
import CityTimezoneSelect from "./CityTimezoneSelect";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

// --- Components ---

interface ClockPanelProps {
  label: string;
  type: "user" | "client";
  time: DateTime;
  timezone: string;
  name: string;
  location: string;
  isActive: boolean;
  onTimeChange: (newTime: DateTime) => void;
}

function ClockPanel({ label, type, time, timezone, name, location, isActive, onTimeChange }: ClockPanelProps) {
  const isDay = time.hour >= 6 && time.hour < 18;

  const handleHourChange = (delta: number) => {
    onTimeChange(time.plus({ hours: delta }));
  };

  const handleMinuteChange = (delta: number) => {
    onTimeChange(time.plus({ minutes: delta }));
  };

  return (
    <motion.div layout className={cn("relative flex-1 p-6 sm:p-8 lg:p-10 xl:p-12 rounded-[28px] sm:rounded-[40px] bg-surface-secondary/30 border transition-all duration-700 overflow-hidden group", isActive ? "border-accent/40 bg-surface/50 shadow-[0_0_60px_rgba(34,197,94,0.05)]" : "border-white/5 opacity-60 hover:opacity-100 hover:border-white/10")}>
      <AnimatePresence>{isActive && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-linear-to-b from-accent/5 to-transparent pointer-events-none" />}</AnimatePresence>

      <div className="relative z-10 space-y-6 sm:space-y-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-4">
            <div className={cn("w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center border transition-all duration-500", isActive ? "bg-accent/10 border-accent/20 text-accent" : "bg-white/5 border-white/5 text-muted-text")}>{type === "user" ? <Laptop size={14} className="sm:w-5 sm:h-5" /> : <User size={14} className="sm:w-5 sm:h-5" />}</div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">{label}</p>
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">{name}</h4>
            </div>
          </div>

          <div className={cn("flex items-center gap-2 px-2.5 py-1 sm:px-4 sm:py-2 rounded-xl border transition-all duration-500", isDay ? "text-amber-400 border-amber-400/10 bg-amber-400/5" : "text-indigo-400 border-indigo-400/10 bg-indigo-400/5")}>
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest">{isDay ? "Day" : "Night"}</span>
            {isDay ? <Sun size={12} strokeWidth={2.5} /> : <Moon size={12} strokeWidth={2.5} />}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3 sm:gap-6 select-none">
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <button onClick={() => handleHourChange(1)} className="p-1 sm:p-2 text-white/5 hover:text-accent transition-colors" aria-label="Increase hours">
                <ChevronRight size={18} className="-rotate-90 sm:w-5 sm:h-5" />
              </button>
              <span className="text-4xl sm:text-6xl lg:text-7xl font-semibold text-white tabular-nums tracking-tighter leading-none">{time.toFormat("hh")}</span>
              <button onClick={() => handleHourChange(-1)} className="p-1 sm:p-2 text-white/5 hover:text-accent transition-colors" aria-label="Decrease hours">
                <ChevronRight size={18} className="rotate-90 sm:w-5 sm:h-5" />
              </button>
            </div>

            <span className="text-2xl sm:text-4xl lg:text-5xl font-light text-white/5 mb-3 sm:mb-8">:</span>

            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <button onClick={() => handleMinuteChange(5)} className="p-1 sm:p-2 text-white/5 hover:text-accent transition-colors" aria-label="Increase minutes">
                <ChevronRight size={18} className="-rotate-90 sm:w-5 sm:h-5" />
              </button>
              <span className="text-4xl sm:text-6xl lg:text-7xl font-semibold text-white tabular-nums tracking-tighter leading-none">{time.toFormat("mm")}</span>
              <button onClick={() => handleMinuteChange(-5)} className="p-1 sm:p-2 text-white/5 hover:text-accent transition-colors" aria-label="Decrease minutes">
                <ChevronRight size={18} className="rotate-90 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="flex flex-col items-end mb-3 sm:mb-8">
              <span className="text-xs sm:text-xl lg:text-2xl font-black text-white/20 uppercase tracking-widest leading-none">{time.toFormat("a")}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 sm:pt-10 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-text/30 min-w-0">
            <MapPin size={10} className="shrink-0" />
            <span className="text-[9px] font-bold uppercase tracking-widest truncate">{location}</span>
          </div>
          <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.4em] whitespace-nowrap ml-4">{time.toFormat("ZZZZ")}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function TwinClockConverter() {
  const [clients] = useLocalStorage<Client[]>("timebridge-clients", []);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [manualTimezone, setManualTimezone] = useState<string>("");

  const [currentTime, setCurrentTime] = useState(DateTime.now());
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeSide, setActiveSide] = useState<"user" | "client">("user");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const clientData = useMemo(() => {
    if (selectedClientId && selectedClientId !== "manual") {
      return clients.find((c) => c.id === selectedClientId);
    }
    return null;
  }, [selectedClientId, clients]);

  const activeClientTz = clientData?.timezone || manualTimezone || "UTC";
  const clientLocationLabel = clientData ? clientData.location || clientData.timezone : manualTimezone || "Select city";
  const clientName = clientData?.name || "Client";

  const userTime = currentTime.toLocal();
  const clientTime = currentTime.setZone(activeClientTz);

  const hourDiff = Math.round(clientTime.offset / 60 - userTime.offset / 60);
  const diffLabel = hourDiff === 0 ? "Same time" : `${Math.abs(hourDiff)}h ${hourDiff > 0 ? "ahead" : "behind"}`;

  const handleTimeUpdate = (newTime: DateTime, side: "user" | "client") => {
    setIsSyncing(true);
    setActiveSide(side);
    setCurrentTime(newTime);
    setTimeout(() => setIsSyncing(false), 300);
  };

  if (!mounted) return <div className="min-h-[400px]" />;

  return (
    <div className="space-y-10 sm:space-y-16">
      {/* Configuration Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3 text-accent">
          <Timer size={14} strokeWidth={2.5} />
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.4em]">Time Converter</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-3">
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tighter">Check the time</h2>
            <p className="text-sm text-muted-text font-medium opacity-40">Choose a client or search for any city to see their time.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-surface/30 p-2 rounded-2xl border border-white/5">
            <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
              <button onClick={() => setSelectedClientId(clients[0]?.id || "")} className={cn("px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", selectedClientId !== "manual" ? "bg-accent/10 text-accent" : "text-muted-text hover:text-white")}>
                Saved
              </button>
              <button onClick={() => setSelectedClientId("manual")} className={cn("px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all", selectedClientId === "manual" ? "bg-accent/10 text-accent" : "text-muted-text hover:text-white")}>
                Search
              </button>
            </div>

            <div className="w-full sm:w-64">
              <AnimatePresence mode="wait">
                {selectedClientId !== "manual" ? (
                  <motion.div key="saved" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="relative">
                    <select value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)} className="w-full h-11 pl-4 pr-10 rounded-xl bg-surface-secondary border border-white/5 text-xs text-white appearance-none focus:outline-none focus:border-accent/40 transition-all font-bold uppercase tracking-wider">
                      <option value="" disabled>
                        Select a client...
                      </option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-text rotate-90 pointer-events-none" size={14} />
                  </motion.div>
                ) : (
                  <motion.div key="atlas" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                    <CityTimezoneSelect value={manualTimezone} onChange={setManualTimezone} className="h-11 no-border-select" placeholder="Enter city name..." />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Main Converter Workspace */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-8 items-stretch pb-10">
        {/* Visual Link - Desktop */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-4">
          <div className="h-16 w-px bg-linear-to-b from-transparent via-accent/20 to-transparent" />
          <motion.div animate={isSyncing ? { scale: [1, 1.2, 1], rotate: 180 } : {}} className="w-12 h-12 rounded-full bg-black border border-accent/20 flex items-center justify-center text-accent shadow-[0_0_30px_rgba(34,197,94,0.1)] backdrop-blur-xl">
            <ArrowRightLeft size={18} />
          </motion.div>
          <div className="px-3 py-1.5 rounded-full bg-surface border border-white/5 text-[9px] font-black text-accent uppercase tracking-[0.2em] whitespace-nowrap shadow-2xl">{diffLabel}</div>
          <div className="h-16 w-px bg-linear-to-b from-accent/20 via-border/50 to-transparent" />
        </div>

        {/* User Clock */}
        <ClockPanel label="Me" type="user" time={userTime} timezone="local" name="My Time" location="Local" isActive={activeSide === "user"} onTimeChange={(t) => handleTimeUpdate(t, "user")} />

        {/* Mobile Delta Badge */}
        <div className="lg:hidden flex justify-center -my-4 relative z-20">
          <div className="px-6 py-2.5 rounded-full bg-surface border border-accent/20 text-[10px] font-black text-accent uppercase tracking-[0.3em] shadow-2xl flex items-center gap-3">
            <ArrowRightLeft size={14} />
            {diffLabel}
          </div>
        </div>

        {/* Client Clock */}
        <ClockPanel label="Client" type="client" time={clientTime} timezone={activeClientTz} name={clientName} location={clientLocationLabel} isActive={activeSide === "client"} onTimeChange={(t) => handleTimeUpdate(t.setZone(activeClientTz).toLocal(), "client")} />
      </div>
    </div>
  );
}
