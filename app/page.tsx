"use client";

import { motion } from "framer-motion";
import HeaderClock from "@/components/HeaderClock";
import ClientGrid from "@/components/ClientGrid";
import TimeConverter from "@/components/TimeConverter";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-accent/20 overflow-hidden font-sans">
      {/* Premium Background Elements */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute inset-0 noise after:absolute after:inset-0 after:bg-linear-to-t after:from-background after:via-transparent after:to-background" />
        <motion.div
          animate={{
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-accent/10 blur-[120px]"
        />
        <motion.div
          animate={{
            opacity: [0.05, 0.15, 0.05],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-accent/5 blur-[120px]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-8 lg:px-12">
        <HeaderClock />

        <main className="space-y-32 pb-40">
          <section id="clients">
            <ClientGrid />
          </section>

          <section id="converter">
            <TimeConverter />
          </section>
        </main>

        <footer className="py-24 border-t border-border/40 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] select-none">TimeBridge</span>
              <div className="h-px w-8 bg-border" />
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] select-none">v1.2.0</span>
            </div>
            <p className="text-[11px] text-muted-text max-w-xs leading-relaxed font-medium opacity-40">Designed for precision. Built for the global freelancer.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
