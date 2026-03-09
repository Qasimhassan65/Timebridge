"use client";

import HeaderClock from "@/components/HeaderClock";
import ClientGrid from "@/components/ClientGrid";
import TwinClockConverter from "@/components/TimeConverter";
import { useLocalStorage } from "@/lib/useStorage";
import { Client } from "@/components/ClientCard";

export default function Home() {
  const [clients, setClients] = useLocalStorage<Client[]>("timebridge-clients", []);

  const addClient = (newClient: Omit<Client, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setClients((prev) => [...prev, { ...newClient, id }]);
  };

  const removeClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-accent/20 overflow-hidden font-sans">
      {/* Optimized Static Background */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute inset-0 noise opacity-5 after:absolute after:inset-0 after:bg-linear-to-t after:from-background after:via-transparent after:to-background" />
        <div className="absolute -top-[10%] -left-[5%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] rounded-full bg-accent/2 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-8 lg:px-12">
        <HeaderClock />

        <main className="space-y-32 pb-40">
          <section id="clients">
            <ClientGrid clients={clients} onAdd={addClient} onRemove={removeClient} />
          </section>

          <section id="converter">
            <TwinClockConverter clients={clients} />
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
