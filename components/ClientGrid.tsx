"use client";

import { useLocalStorage } from "@/lib/useStorage";
import ClientCard, { Client } from "./ClientCard";
import AddClientModal from "./AddClientModal";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

export default function ClientGrid() {
  const [clients, setClients] = useLocalStorage<Client[]>("timebridge-clients", []);

  const addClient = (newClient: Omit<Client, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setClients((prev) => [...prev, { ...newClient, id }]);
  };

  const removeClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-16">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-1 h-1 rounded-full bg-accent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Network</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Active Clients</h2>
        </div>
        <AddClientModal onAdd={addClient} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {clients.length > 0 ? (
            clients.map((client, index) => (
              <motion.div key={client.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                <ClientCard client={client} onRemove={removeClient} />
              </motion.div>
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-border/30 rounded-2xl bg-surface/20">
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-white/20 mb-6">
                <Plus size={20} />
              </div>
              <p className="text-muted-text text-[13px] font-medium tracking-wide">Bridge the gap. Add your first client to get started.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
