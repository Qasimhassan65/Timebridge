"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { X, Plus, User, ArrowRight, ChevronLeft, Sun, Moon, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DateTime } from "luxon";
import { cn } from "@/lib/utils";
import CityTimezoneSelect from "./CityTimezoneSelect";

interface AddClientModalProps {
  onAdd: (client: { name: string; timezone: string; location?: string }) => void;
}

export default function AddClientModal({ onAdd }: AddClientModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("");
  const [location, setLocation] = useState("");

  // ── Lock body scroll ───────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ── Reset ─────────────────────────────────────────────────────────────────
  const reset = () => {
    setIsOpen(false);
    setStep(1);
    setName("");
    setTimezone("");
    setLocation("");
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const submit = () => {
    if (!name.trim() || !timezone) return;
    onAdd({ name: name.trim(), timezone, location: location || timezone });
    reset();
  };

  // ── Twin-clock preview ────────────────────────────────────────────────────
  const preview = useMemo(() => {
    if (!timezone) return null;
    try {
      const now = DateTime.now();
      const local = now.toLocal();
      const remote = now.setZone(timezone);
      const diffH = Math.round(remote.offset / 60 - local.offset / 60);
      return {
        local: {
          time: local.toFormat("h:mm"),
          period: local.toFormat("a"),
          day: local.hour >= 6 && local.hour < 20,
        },
        remote: {
          time: remote.toFormat("h:mm"),
          period: remote.toFormat("a"),
          day: remote.hour >= 6 && remote.hour < 20,
        },
        diff: diffH === 0 ? "same time" : `${Math.abs(diffH)}h ${diffH > 0 ? "ahead" : "behind"}`,
      };
    } catch {
      return null;
    }
  }, [timezone]);

  const canGoNext = name.trim().length >= 2;

  return (
    <>
      {/* ── Trigger button ─────────────────────────────────────────────────── */}
      <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-white text-[11px] font-black uppercase tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-accent/20">
        <Plus size={13} strokeWidth={3} />
        <span>Add Client</span>
      </button>

      {/* ── Modal ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-200 flex items-end sm:items-center justify-center overflow-hidden">
            {/* Backdrop */}
            <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={reset} className="absolute inset-0 bg-black/85 backdrop-blur-2xl" />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className={cn(
                // mobile: full-width bottom sheet
                "relative w-full bg-[#0D0D0D] border-t border-white/8 shadow-[0_-20px_80px_rgba(0,0,0,0.8)] flex flex-col",
                // sm+: centered modal
                "sm:border sm:border-white/10 sm:rounded-[36px] sm:shadow-[0_40px_100px_rgba(0,0,0,0.9)]",
                // widths
                "sm:max-w-lg md:max-w-xl",
                // heights
                "max-h-[92dvh] sm:max-h-[88vh]",
                // bottom-sheet pill on mobile
                "rounded-t-[32px] sm:rounded-[36px]",
              )}
            >
              {/* Pill handle (mobile) */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
                <div className="w-10 h-1 rounded-full bg-white/10" />
              </div>

              {/* ── Header ───────────────────────────────────────────────── */}
              <div className="flex items-center justify-between px-6 py-4 sm:px-8 sm:py-5 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-3">
                  {/* Step indicators */}
                  <div className="flex items-center gap-1.5">
                    <div className={cn("h-1.5 rounded-full transition-all duration-500", step === 1 ? "w-6 bg-accent" : "w-3 bg-white/10")} />
                    <div className={cn("h-1.5 rounded-full transition-all duration-500", step === 2 ? "w-6 bg-accent" : "w-3 bg-white/10")} />
                  </div>
                  <span className="text-[10px] font-black text-white/25 uppercase tracking-[0.3em]">{step === 1 ? "Identity" : "Location"}</span>
                </div>

                <button onClick={reset} className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/30 hover:text-white transition-all">
                  <X size={15} />
                </button>
              </div>

              {/* ── Scrollable content ────────────────────────────────────── */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <AnimatePresence mode="wait" initial={false}>
                  {/* ── Step 1: Identity ─────────────────────────────────── */}
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.22, ease: "easeOut" }} className="px-6 pt-8 pb-6 sm:px-8 sm:pt-10 sm:pb-8 space-y-8">
                      {/* Heading */}
                      <div className="space-y-2">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                          Who are you
                          <br />
                          bridging with?
                        </h2>
                        <p className="text-sm text-white/30 font-medium leading-relaxed max-w-sm">Enter your client's name to get started.</p>
                      </div>

                      {/* Name input */}
                      <div className="group">
                        <div className="flex items-center gap-3 border-b-2 border-white/6 focus-within:border-accent pb-3 transition-colors duration-300">
                          <User size={20} className="text-white/15 group-focus-within:text-accent/50 transition-colors shrink-0" />
                          <input autoFocus type="text" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && canGoNext && setStep(2)} placeholder="Full name" className="flex-1 bg-transparent text-2xl sm:text-3xl font-semibold text-white placeholder:text-white/8 outline-none tracking-tight" />
                        </div>
                        <p className="mt-2 text-[10px] text-white/15 font-medium pl-8">e.g. Sarah Jenkins, Yuki Tanaka</p>
                      </div>

                      {/* CTA */}
                      <div className="pt-2">
                        <button disabled={!canGoNext} onClick={() => setStep(2)} className="w-full h-14 sm:h-16 rounded-2xl bg-white text-black text-sm font-black uppercase tracking-[0.25em] hover:bg-accent hover:text-white disabled:opacity-10 disabled:cursor-not-allowed transition-all duration-500 flex items-center justify-center gap-3 group">
                          <span>Continue</span>
                          <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Step 2: Location ────────────────────────────────── */}
                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22, ease: "easeOut" }} className="px-6 pt-6 pb-6 sm:px-8 sm:pt-8 sm:pb-8 space-y-6">
                      {/* Back link */}
                      <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-[10px] font-bold text-white/25 uppercase tracking-[0.3em] hover:text-white/60 transition-colors group">
                        <ChevronLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
                        Back
                      </button>

                      {/* Heading */}
                      <div className="space-y-2">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
                          Where is
                          <br />
                          {name}?
                        </h2>
                        <p className="text-sm text-white/30 font-medium leading-relaxed max-w-sm">Search their city to calculate the time gap between your zones.</p>
                      </div>

                      {/* ── City picker ───────────────────────────────────── */}
                      <CityTimezoneSelect
                        value={timezone}
                        onChange={(tz, data) => {
                          setTimezone(tz);
                          if (data) setLocation(`${data.city}, ${data.country}`);
                        }}
                        placeholder="Search city or timezone…"
                      />

                      {/* ── Twin-clock preview ────────────────────────────── */}
                      <AnimatePresence>
                        {preview && (
                          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.25 }} className="rounded-2xl border border-white/6 bg-white/2 overflow-hidden">
                            <div className="grid grid-cols-2 divide-x divide-white/5">
                              {/* Your time */}
                              <div className="p-5 space-y-3">
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">You</p>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="text-3xl font-bold text-white tabular-nums tracking-tight">{preview.local.time}</span>
                                  <span className="text-xs font-bold text-white/25 uppercase">{preview.local.period}</span>
                                </div>
                                <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide", preview.local.day ? "bg-amber-400/8 text-amber-400/70" : "bg-indigo-400/8 text-indigo-400/70")}>
                                  {preview.local.day ? <Sun size={10} /> : <Moon size={10} />}
                                  {preview.local.day ? "Day" : "Night"}
                                </div>
                              </div>

                              {/* Client time */}
                              <div className="p-5 space-y-3 bg-accent/3">
                                <p className="text-[9px] font-black text-accent/30 uppercase tracking-[0.4em]">{name || "Client"}</p>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="text-3xl font-bold text-white tabular-nums tracking-tight">{preview.remote.time}</span>
                                  <span className="text-xs font-bold text-white/25 uppercase">{preview.remote.period}</span>
                                </div>
                                <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide", preview.remote.day ? "bg-amber-400/8 text-amber-400/70" : "bg-indigo-400/8 text-indigo-400/70")}>
                                  {preview.remote.day ? <Sun size={10} /> : <Moon size={10} />}
                                  {preview.remote.day ? "Day" : "Night"}
                                </div>
                              </div>
                            </div>
                            {/* Offset bar */}
                            <div className="px-5 py-3 border-t border-white/5 flex items-center gap-2">
                              <Globe size={11} className="text-accent/40 shrink-0" />
                              <span className="text-[10px] font-black text-accent/50 uppercase tracking-widest">{preview.diff}</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Save button */}
                      <button disabled={!name.trim() || !timezone} onClick={submit} className="w-full h-14 sm:h-16 rounded-2xl bg-accent text-white text-sm font-black uppercase tracking-[0.25em] hover:brightness-110 disabled:opacity-10 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-[0_16px_48px_rgba(34,197,94,0.2)]">
                        Save Client
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
