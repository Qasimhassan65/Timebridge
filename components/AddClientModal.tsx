"use client";

import { useState, useMemo, useEffect } from "react";
import { X, Plus, User, Globe, Sparkles, ArrowRight, ShieldCheck, ChevronLeft, CheckCircle2, Timer, Sun, Moon, ArrowRightLeft, Laptop } from "lucide-react";
import CityTimezoneSelect from "./CityTimezoneSelect";
import { motion, AnimatePresence } from "framer-motion";
import { DateTime } from "luxon";
import { cn } from "@/lib/utils";

interface AddClientModalProps {
  onAdd: (client: { name: string; timezone: string; location?: string }) => void;
}

export default function AddClientModal({ onAdd }: AddClientModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("");
  const [location, setLocation] = useState("");
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const resetForm = () => {
    setName("");
    setTimezone("");
    setLocation("");
    setStep(1);
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !timezone) return;
    onAdd({ name, timezone, location: location || timezone });
    resetForm();
  };

  const nextStep = () => {
    if (step === 1 && name.length > 1) setStep(2);
  };

  const prevStep = () => {
    if (step === 2) setStep(1);
  };

  const clockData = useMemo(() => {
    if (!timezone) return null;
    const now = DateTime.now();
    const local = now.toLocal();
    const remote = now.setZone(timezone);
    const diff = Math.round(remote.offset / 60 - local.offset / 60);

    return {
      local: {
        time: local.toFormat("h:mm"),
        period: local.toFormat("a"),
        day: local.hour >= 6 && local.hour < 18,
      },
      remote: {
        time: remote.toFormat("h:mm"),
        period: remote.toFormat("a"),
        day: remote.hour >= 6 && remote.hour < 18,
      },
      diff: diff === 0 ? "Same time" : `${Math.abs(diff)}h ${diff > 0 ? "ahead" : "behind"}`,
    };
  }, [timezone]);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-all duration-500 shadow-2xl shadow-white/5 group relative overflow-hidden">
        <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0" />
        <Plus size={14} strokeWidth={3} className="relative z-10 group-hover:rotate-90 transition-transform duration-500" />
        <span className="relative z-10 transition-colors duration-500">New Client</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetForm} className="fixed inset-0 bg-black/95 backdrop-blur-2xl" />

            <motion.div initial={{ opacity: 0, scale: 0.98, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 30 }} className="relative w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl max-h-[95vh] lg:max-h-[85vh] bg-[#0E0E0E] border border-white/10 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
              <div className="p-8 sm:p-14 lg:p-16 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/1">
                <div className="flex items-center gap-10">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2.5 h-2.5 rounded-full transition-all duration-700", step === 1 ? "bg-accent shadow-[0_0_15px_rgba(34,197,94,0.5)] scale-110" : "bg-accent/20")} />
                    <div className={cn("h-px w-8 transition-all duration-700", step === 2 ? "bg-accent/40" : "bg-white/5")} />
                    <div className={cn("w-2.5 h-2.5 rounded-full transition-all duration-700", step === 2 ? "bg-accent shadow-[0_0_15px_rgba(34,197,94,0.5)] scale-110" : "bg-white/10")} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] leading-none mb-1">Authorization Phase</span>
                    <span className="text-[9px] font-bold text-muted-text/20 uppercase tracking-[0.2em]">{step === 1 ? "Identity Confirmation" : "Temporal Alignment"}</span>
                  </div>
                </div>
                <button onClick={resetForm} className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 text-muted-text hover:text-white transition-all border border-white/5 group">
                  <X size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                </button>
              </div>

              {/* Modal Content - Revamped for better scroll/UX */}
              <div
                className={cn(
                  "flex-1 overflow-y-auto custom-scrollbar p-8 sm:p-14 lg:p-20 relative z-10",
                  step === 2 && "overflow-y-auto", // Specifically allow scroll here
                )}
              >
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div key="step1" initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 1.02, y: -10 }} transition={{ duration: 0.4, ease: "easeOut" }} className="space-y-20 lg:space-y-28">
                      <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-accent/5 border border-accent/10">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent leading-none">New Connection</span>
                        </div>
                        <h2 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white tracking-tighter leading-[0.85]">
                          Meet your <br /> next partner.
                        </h2>
                        <p className="text-muted-text text-base lg:text-xl font-medium opacity-40 max-w-md lg:max-w-xl leading-relaxed">Let's start by giving them a name. It helps keep your workspace organized and professionally mapped.</p>
                      </div>

                      <div className="space-y-12 lg:space-y-20">
                        <div className="relative group">
                          <input autoFocus type="text" placeholder="Type client name..." value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && nextStep()} className="w-full bg-transparent border-b-2 border-white/5 py-10 lg:py-14 text-4xl sm:text-5xl lg:text-7xl font-medium text-white placeholder:text-white/5 focus:outline-none focus:border-accent transition-all duration-700 tracking-tight" />
                          <motion.div animate={name.length >= 2 ? { x: 0, opacity: 0.3 } : { x: 20, opacity: 0 }} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ArrowRight size={48} className="text-accent" />
                          </motion.div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-8 pt-10">
                          <div className="flex items-center gap-3 text-[11px] lg:text-xs font-bold text-muted-text/20 uppercase tracking-[0.3em] order-2 sm:order-1">
                            <ShieldCheck size={16} className="text-accent/40" />
                            <span>Enterprise Grade Encryption Layer</span>
                          </div>
                          <button onClick={nextStep} disabled={name.length < 2} className="w-full sm:w-auto flex items-center justify-center gap-5 px-12 h-20 lg:h-24 rounded-[32px] bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-accent hover:text-white disabled:opacity-5 disabled:cursor-not-allowed transition-all duration-700 shadow-[0_30px_60px_rgba(255,255,255,0.05)] text-xs lg:text-sm order-1 sm:order-2">
                            <span>Initialize Phase</span>
                            <ArrowRight size={20} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="step2" initial={{ opacity: 0, scale: 0.98, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 1.02, x: -20 }} transition={{ duration: 0.4, ease: "easeOut" }} className="space-y-16 lg:space-y-24">
                      <button onClick={prevStep} className="flex items-center gap-2 text-[10px] lg:text-xs font-black uppercase tracking-[0.4em] text-white/30 hover:text-accent transition-all duration-300 group">
                        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Identity Registry
                      </button>

                      <div className="space-y-6">
                        <h2 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white tracking-tighter leading-[0.85]">
                          Set the <br /> horizon.
                        </h2>
                        <p className="text-muted-text text-base lg:text-xl font-medium opacity-40 max-w-md lg:max-w-xl leading-relaxed">Where is this partner based? We'll use this to bridge your temporal gap and align your workspace.</p>
                      </div>

                      <div className="space-y-16 lg:space-y-20">
                        <div className="p-1 rounded-[32px] lg:rounded-[40px] bg-white/2 border border-white/5 shadow-2xl">
                          <CityTimezoneSelect
                            value={timezone}
                            onChange={(tz, data) => {
                              setTimezone(tz);
                              if (data) setLocation(`${data.city}, ${data.country}`);
                            }}
                            className="no-border-select"
                            placeholder="Enter their city..."
                          />
                        </div>

                        <AnimatePresence mode="wait">
                          {clockData && (
                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                              <div className="p-10 lg:p-14 rounded-[40px] bg-white/2 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all duration-500">
                                <div className="absolute -right-12 -bottom-12 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity rotate-12 scale-150">
                                  <Laptop size={180} />
                                </div>
                                <div className="space-y-8 relative z-10">
                                  <span className="text-[11px] lg:text-xs font-black text-white/20 uppercase tracking-[0.5em]">Your Local Node</span>
                                  <div className="flex items-baseline gap-3">
                                    <span className="text-5xl lg:text-7xl font-bold text-white tabular-nums tracking-tighter leading-none">{clockData.local.time}</span>
                                    <span className="text-sm lg:text-base font-black text-white/30 uppercase tracking-[0.3em]">{clockData.local.period}</span>
                                  </div>
                                  <div className={cn("w-12 h-12 lg:w-16 lg:h-16 rounded-[20px] lg:rounded-[24px] flex items-center justify-center bg-white/5 shadow-inner", clockData.local.day ? "text-amber-400" : "text-indigo-400")}>{clockData.local.day ? <Sun size={20} className="lg:size-24" /> : <Moon size={20} className="lg:size-24" />}</div>
                                </div>
                              </div>

                              <div className="p-10 lg:p-14 rounded-[40px] bg-accent/5 border border-accent/10 relative overflow-hidden group hover:border-accent/20 transition-all duration-500 shadow-[0_20px_60px_rgba(34,197,94,0.05)]">
                                <div className="absolute -right-12 -bottom-12 opacity-[0.05] group-hover:opacity-[0.15] transition-opacity -rotate-12 scale-150">
                                  <User size={180} className="text-accent" />
                                </div>
                                <div className="space-y-8 relative z-10">
                                  <span className="text-[11px] lg:text-xs font-black text-accent/40 uppercase tracking-[0.5em]">Remote Client Node</span>
                                  <div className="flex items-baseline gap-3">
                                    <span className="text-5xl lg:text-7xl font-bold text-white tabular-nums tracking-tighter leading-none">{clockData.remote.time}</span>
                                    <span className="text-sm lg:text-base font-black text-white/30 uppercase tracking-[0.3em]">{clockData.remote.period}</span>
                                  </div>
                                  <div className="flex items-center gap-5">
                                    <div className={cn("w-12 h-12 lg:w-16 lg:h-16 rounded-[20px] lg:rounded-[24px] flex items-center justify-center bg-accent/10 shadow-inner", clockData.remote.day ? "text-amber-400" : "text-indigo-400")}>{clockData.remote.day ? <Sun size={20} className="lg:size-24" /> : <Moon size={20} className="lg:size-24" />}</div>
                                    <div className="px-5 py-2 rounded-full bg-accent/10 border border-accent/20">
                                      <span className="text-[11px] lg:text-xs font-black text-accent uppercase tracking-[0.3em]">{clockData.diff}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="pt-10 lg:pt-16 pb-10">
                          <button onClick={handleSubmit} disabled={!name || !timezone} className="w-full h-24 lg:h-32 rounded-[40px] bg-accent text-white font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black disabled:opacity-5 disabled:cursor-not-allowed transition-all duration-700 shadow-[0_30px_80px_rgba(34,197,94,0.2)] flex items-center justify-center gap-10 group text-xs lg:text-sm">
                            <span>Synchronize Horizon</span>
                            <ArrowRightLeft size={24} strokeWidth={3} className="group-hover:rotate-180 transition-transform duration-1000" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Background Glows Refined */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[0%] left-[-10%] w-[80%] h-[80%] rounded-full bg-accent/5 blur-[160px] opacity-40" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] rounded-full bg-white/2 blur-[140px]" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
