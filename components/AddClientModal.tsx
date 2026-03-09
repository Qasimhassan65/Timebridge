"use client";

import { useState, useMemo } from "react";
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

            <motion.div initial={{ opacity: 0, scale: 0.98, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 30 }} className="relative w-full max-w-2xl max-h-[90vh] sm:max-h-[80vh] bg-[#0E0E0E] border border-white/10 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
              <div className="p-8 sm:p-10 border-b border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1.5">
                    <div className={cn("w-2 h-2 rounded-full transition-all duration-500", step === 1 ? "bg-accent scale-125" : "bg-accent/20")} />
                    <div className={cn("h-px w-4 transition-all duration-500", step === 2 ? "bg-accent/40" : "bg-white/5")} />
                    <div className={cn("w-2 h-2 rounded-full transition-all duration-500", step === 2 ? "bg-accent scale-125" : "bg-white/10")} />
                  </div>
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Step {step} of 2</span>
                </div>
                <button onClick={resetForm} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-muted-text hover:text-white transition-all border border-white/5">
                  <X size={18} />
                </button>
              </div>

              <div className={cn("flex-1 overflow-y-auto custom-scrollbar p-8 sm:p-12", step === 2 && "overflow-y-visible")}>
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-12">
                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/10 text-accent">
                          <Sparkles size={12} />
                          <span className="text-[9px] font-black uppercase tracking-widest leading-none">New Connection</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tighter">
                          Who are we <br /> sync with?
                        </h2>
                        <p className="text-muted-text text-sm font-medium opacity-40 max-w-sm">Enter the name of your client or teammate.</p>
                      </div>

                      <div className="space-y-8">
                        <div className="relative group">
                          <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent/20 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
                          <input autoFocus type="text" placeholder="e.g. Acme Studio" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && nextStep()} className="w-full bg-transparent border-b-2 border-white/5 py-6 text-3xl sm:text-4xl font-medium text-white placeholder:text-white/5 focus:outline-none focus:border-accent transition-all duration-500" />
                        </div>

                        <div className="flex justify-end pt-4">
                          <button onClick={nextStep} disabled={name.length < 2} className="flex items-center gap-3 px-8 h-16 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] hover:bg-accent hover:text-white disabled:opacity-5 disabled:cursor-not-allowed transition-all duration-500 shadow-xl">
                            <span>Continue</span>
                            <ArrowRight size={16} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12 pb-32">
                      <button onClick={prevStep} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-accent transition-colors">
                        <ChevronLeft size={14} />
                        Identity phase
                      </button>

                      <div className="space-y-3">
                        <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tighter">
                          Current <br /> location?
                        </h2>
                        <p className="text-muted-text text-sm font-medium opacity-40 max-w-sm">Search for their city to auto-detect their timezone.</p>
                      </div>

                      <div className="space-y-10">
                        <CityTimezoneSelect
                          value={timezone}
                          onChange={(tz, data) => {
                            setTimezone(tz);
                            if (data) setLocation(`${data.city}, ${data.country}`);
                          }}
                          className="no-border-select"
                          placeholder="Search for a city..."
                        />

                        <AnimatePresence>
                          {clockData && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-4">
                              <div className="p-6 rounded-[24px] bg-white/2 border border-white/5 relative overflow-hidden group">
                                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                  <Laptop size={64} />
                                </div>
                                <div className="space-y-4 relative z-10">
                                  <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Me</span>
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-white tabular-nums">{clockData.local.time}</span>
                                    <span className="text-[10px] font-black text-white/30 uppercase">{clockData.local.period}</span>
                                  </div>
                                  <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center bg-white/5", clockData.local.day ? "text-amber-400" : "text-indigo-400")}>{clockData.local.day ? <Sun size={12} /> : <Moon size={12} />}</div>
                                </div>
                              </div>

                              <div className="p-6 rounded-[24px] bg-accent/5 border border-accent/10 relative overflow-hidden group">
                                <div className="absolute -right-4 -bottom-4 opacity-10">
                                  <ArrowRightLeft size={64} className="text-accent" />
                                </div>
                                <div className="space-y-4 relative z-10">
                                  <span className="text-[9px] font-black text-accent/40 uppercase tracking-[0.2em]">Client</span>
                                  <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-white tabular-nums">{clockData.remote.time}</span>
                                    <span className="text-[10px] font-black text-white/30 uppercase">{clockData.remote.period}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center bg-accent/10", clockData.remote.day ? "text-amber-400" : "text-indigo-400")}>{clockData.remote.day ? <Sun size={12} /> : <Moon size={12} />}</div>
                                    <span className="text-[9px] font-bold text-accent uppercase tracking-widest">{clockData.diff}</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="pt-6">
                          <button onClick={handleSubmit} disabled={!name || !timezone} className="w-full h-20 rounded-[28px] bg-white text-black font-black uppercase tracking-[0.2em] hover:bg-accent hover:text-white disabled:opacity-5 disabled:cursor-not-allowed transition-all duration-500 shadow-2xl flex items-center justify-center gap-4 group">
                            <span>Add Client</span>
                            <CheckCircle2 size={18} strokeWidth={3} className="group-hover:scale-125 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[100px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-white/5 blur-[100px]" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
