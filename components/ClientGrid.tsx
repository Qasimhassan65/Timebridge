"use client";

import ClientCard, { Client } from "./ClientCard";
import AddClientModal from "./AddClientModal";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

export type { Client };

interface ClientGridProps {
  clients: Client[];
  onAdd: (client: Omit<Client, "id">) => void;
  onRemove: (id: string) => void;
}

export default function ClientGrid({ clients, onAdd, onRemove }: ClientGridProps) {
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
        <AddClientModal onAdd={onAdd} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {clients.length > 0 ? (
            clients.map((client) => (
              <motion.div key={client.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <ClientCard client={client} onRemove={onRemove} />
              </motion.div>
            ))
          ) : (
            <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-border/30 rounded-2xl bg-surface/20">
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-white/20 mb-6">
                <Plus size={20} />
              </div>
              <p className="text-muted-text text-[13px] font-medium tracking-wide">Bridge the gap. Add your first client to get started.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
