"use client";

import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { Sun, Moon, Trash2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface Client {
  id: string;
  name: string;
  timezone: string;
  location?: string;
}

interface ClientCardProps {
  client: Client;
  onRemove?: (id: string) => void;
}

export default function ClientCard({ client, onRemove }: ClientCardProps) {
  const [now, setNow] = useState(DateTime.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(DateTime.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const clientTime = now.setZone(client.timezone);
  const isDay = clientTime.hour >= 6 && clientTime.hour < 18;
  const diffInHours = Math.round(clientTime.offset / 60 - now.offset / 60);

  return (
    <div className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-8 rounded-xl bg-surface/40 border border-border/50 hover:border-accent/40 hover:bg-surface/60 transition-all duration-300 gap-6 sm:gap-4">
      <div className="flex flex-col gap-1.5 min-w-0">
        <h3 className="text-lg font-bold text-white tracking-tight truncate group-hover:text-accent transition-colors duration-300">{client.name}</h3>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-text opacity-50">
          <span>{client.location || client.timezone}</span>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-12 text-right">
        <div className="flex flex-col gap-1 items-start sm:items-end">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl font-bold text-white tabular-nums tracking-tighter">{clientTime.toFormat("h:mm a")}</span>
            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center ring-1", isDay ? "text-amber-400 ring-amber-400/20 bg-amber-400/5" : "text-emerald-400 ring-emerald-400/20 bg-emerald-400/5")}>{isDay ? <Sun size={12} strokeWidth={2.5} /> : <Moon size={12} strokeWidth={2.5} />}</div>
          </div>
          <div className="flex items-center gap-2 opacity-40">
            <Clock size={10} className="text-white" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">Me: {now.toFormat("h:mm a")}</span>
          </div>
        </div>

        <div className="flex flex-col items-end min-w-[60px] sm:min-w-[80px]">
          <span className={cn("text-base font-black tabular-nums tracking-tight", diffInHours > 0 ? "text-accent" : diffInHours < 0 ? "text-rose-500" : "text-white/60")}>{diffInHours === 0 ? "Sync" : `${diffInHours > 0 ? "+" : ""}${diffInHours}h`}</span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-text opacity-40">{diffInHours > 0 ? "Ahead" : diffInHours < 0 ? "Behind" : "Same"}</span>
        </div>

        <button onClick={() => onRemove?.(client.id)} className="p-2 rounded-lg sm:opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 hover:text-rose-400 text-muted-text transition-all duration-200 ml-0 sm:ml-2">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
