"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, Globe, MapPin, Command, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import cityTimezones from "city-timezones";
import { DateTime } from "luxon";

interface CityResult {
  city: string;
  country: string;
  timezone: string;
  iso2?: string;
  province?: string;
}

interface CityTimezoneSelectProps {
  value: string; // The timezone ID
  onChange: (timezone: string, cityData?: CityResult) => void;
  placeholder?: string;
  className?: string;
}

export default function CityTimezoneSelect({ value, onChange, placeholder = "Search for a city...", className }: CityTimezoneSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<"bottom" | "top">("bottom");

  const isMinimal = className?.includes("no-border-select");

  const filteredCities = useMemo(() => {
    if (!search || search.length < 2) return [];

    const cityMatches = cityTimezones.findFromCityStateProvince(search);
    const seen = new Set();
    const uniqueMatches: CityResult[] = [];

    for (const match of cityMatches) {
      const key = `${match.city}-${match.country}-${match.timezone}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueMatches.push({
          city: match.city,
          country: match.iso2 || match.country,
          timezone: match.timezone,
          iso2: match.iso2,
          province: match.province,
        });
      }
      if (uniqueMatches.length >= 12) break;
    }

    return uniqueMatches;
  }, [search]);

  const getFriendlyTz = (tz: string) => {
    try {
      const dt = DateTime.now().setZone(tz);
      return dt.offsetNameLong || tz;
    } catch {
      return tz;
    }
  };

  const getTimeInTz = (tz: string) => {
    try {
      return DateTime.now().setZone(tz).toFormat("h:mm a");
    } catch {
      return "";
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < 400 && spaceAbove > spaceBelow) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  }, [open]);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button type="button" role="combobox" aria-expanded={open} onClick={() => setOpen(!open)} className={cn("flex h-full w-full items-center justify-between transition-all duration-300 font-medium outline-none group", isMinimal ? "border-b border-white/10 bg-transparent px-0 py-4 text-xl sm:text-2xl hover:border-accent" : "rounded-2xl border border-border bg-surface-secondary px-6 py-3 hover:bg-surface focus:ring-2 focus:ring-accent/50", "text-white")}>
        <div className="flex items-center gap-4 overflow-hidden">
          <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center transition-colors shrink-0", value ? "bg-accent/10 text-accent" : "bg-white/5 text-muted-text opacity-40")}>
            <Globe size={16} />
          </div>
          <div className="flex flex-col items-start truncate text-left">
            {value ? (
              <>
                <span className="text-sm font-bold text-white tracking-tight">{value}</span>
                <span className="text-[10px] text-muted-text uppercase tracking-widest font-black opacity-30">Selected Location</span>
              </>
            ) : (
              <span className="text-white/20 font-medium transition-colors group-hover:text-white/40">{placeholder}</span>
            )}
          </div>
        </div>
        <ChevronDown size={isMinimal ? 20 : 16} className={cn("text-muted-text transition-transform duration-500 opacity-20 group-hover:opacity-100", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: dropdownPosition === "bottom" ? 4 : -4, scale: 0.99 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: dropdownPosition === "bottom" ? 4 : -4, scale: 0.99 }} className={cn("absolute z-50 w-full sm:w-[130%] sm:-left-[15%] max-h-[380px] overflow-hidden rounded-[32px] border border-white/10 bg-[#0A0A0A]/90 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.9)] backdrop-blur-3xl flex flex-col", dropdownPosition === "bottom" ? "mt-4 top-full" : "mb-4 bottom-full")}>
            <div className="flex items-center border-b border-white/5 px-8 py-5 bg-white/2">
              <Search size={20} className="text-accent mr-5 shrink-0" />
              <input autoFocus className="flex h-12 w-full bg-transparent text-xl text-white outline-none placeholder:text-white/5 font-medium" placeholder="Where to?" value={search} onChange={(e) => setSearch(e.target.value)} />
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 ml-3 shrink-0">
                <Command size={10} className="text-muted-text opacity-40" />
                <span className="text-[9px] font-black text-muted-text opacity-40">ESC</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth py-4 custom-scrollbar">
              {filteredCities.length > 0 ? (
                <div className="px-3 space-y-1.5">
                  {filteredCities.map((city, idx) => (
                    <button
                      key={`${city.city}-${city.timezone}-${idx}`}
                      type="button"
                      onClick={() => {
                        onChange(city.timezone, city);
                        setOpen(false);
                        setSearch("");
                      }}
                      className="flex w-full items-center gap-5 px-5 py-4 text-left hover:bg-white/5 rounded-2xl transition-all group relative mx-auto"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-surface border border-white/5 flex items-center justify-center text-muted-text group-hover:text-accent group-hover:border-accent/40 group-hover:bg-accent/5 transition-all shrink-0">
                        <MapPin size={18} />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-base font-bold text-white group-hover:translate-x-1 transition-transform duration-300 truncate">
                            {city.city}, {city.country}
                          </span>
                          <div className="flex items-center gap-2 text-accent opacity-0 group-hover:opacity-100 transition-all">
                            <Clock size={12} />
                            <span className="text-xs tabular-nums font-black">{getTimeInTz(city.timezone)}</span>
                          </div>
                        </div>
                        <span className="text-[11px] font-medium text-muted-text opacity-30 uppercase tracking-[0.2em] mt-1.5">{getFriendlyTz(city.timezone)}</span>
                      </div>
                      {value === city.timezone && (
                        <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center">
                          <Check size={14} className="text-accent" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-10 py-16 text-center select-none">
                  {search.length < 2 ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 rounded-3xl bg-accent/5 border border-accent/10 flex items-center justify-center mx-auto">
                        <Globe size={28} className="text-accent opacity-40" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Ready to search</p>
                        <p className="text-[10px] text-muted-text opacity-30 font-medium max-w-[180px] mx-auto leading-relaxed">Type at least 2 characters to search.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center mx-auto opacity-20">
                        <Search size={28} className="text-muted-text" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">No city found</p>
                        <p className="text-[10px] text-muted-text opacity-30 font-medium max-w-[200px] mx-auto leading-relaxed">Try searching for a different city or region.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-white/5 bg-white/1 flex items-center justify-between">
              <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.2em]">Timebridge Database</span>
              <div className="flex gap-1.5 opacity-20 transition-all">
                <div className="w-1 h-1 rounded-full bg-accent" />
                <div className="w-1 h-1 rounded-full bg-accent" />
                <div className="w-1 h-1 rounded-full bg-accent" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
