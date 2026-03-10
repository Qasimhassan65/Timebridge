"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Search, Check, Globe, MapPin, Clock, X } from "lucide-react";
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
  value: string;
  onChange: (timezone: string, cityData?: CityResult) => void;
  placeholder?: string;
}

export default function CityTimezoneSelect({ value, onChange, placeholder = "Search city or timezone..." }: CityTimezoneSelectProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // ── Derived label for the selected value ──────────────────────────────────
  const selectedLabel = useMemo(() => {
    if (!value) return "";
    try {
      const dt = DateTime.now().setZone(value);
      return dt.offsetNameLong ?? value;
    } catch {
      return value;
    }
  }, [value]);

  // ── City search ───────────────────────────────────────────────────────────
  const results = useMemo(() => {
    if (search.length < 2) return [];
    const matches = cityTimezones.findFromCityStateProvince(search);
    const seen = new Set<string>();
    const unique: CityResult[] = [];
    for (const m of matches) {
      const key = `${m.city}|${m.country}|${m.timezone}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push({
          city: m.city,
          country: m.country,
          timezone: m.timezone,
          iso2: m.iso2,
          province: m.province,
        });
      }
      if (unique.length >= 10) break;
    }
    return unique;
  }, [search]);

  const getFriendlyTz = (tz: string) => {
    try {
      return DateTime.now().setZone(tz).offsetNameLong ?? tz;
    } catch {
      return tz;
    }
  };

  const getCurrentTime = (tz: string) => {
    try {
      return DateTime.now().setZone(tz).toFormat("h:mm a");
    } catch {
      return "";
    }
  };

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Prevent dropdown scroll from propagating to page ─────────────────────
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const stop = (e: WheelEvent) => e.stopPropagation();
    el.addEventListener("wheel", stop, { passive: true });
    return () => el.removeEventListener("wheel", stop);
  }, [isOpen]);

  const handleSelect = useCallback(
    (city: CityResult) => {
      onChange(city.timezone, city);
      setSearch("");
      setIsOpen(false);
    },
    [onChange],
  );

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("", undefined);
    setSearch("");
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const openSearch = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ── Trigger / Selected Display ─────────────────────────────────── */}
      {!isOpen && (
        <div className="relative w-full">
          {/* Main clickable area — div, NOT button, to avoid nesting */}
          <div role="button" tabIndex={0} onClick={openSearch} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openSearch()} className={cn("w-full flex items-center gap-4 px-5 py-5 rounded-2xl border transition-all duration-300 cursor-pointer group select-none", value ? "bg-accent/5 border-accent/20 hover:border-accent/40" : "bg-white/3 border-white/8 hover:border-white/15 hover:bg-white/5")}>
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors", value ? "bg-accent/15 text-accent" : "bg-white/5 text-white/20")}>
              <Globe size={18} />
            </div>

            <div className="flex-1 min-w-0 pr-16">
              {value ? (
                <>
                  <p className="text-sm font-bold text-white truncate leading-tight">{value}</p>
                  <p className="text-[10px] text-white/30 font-medium mt-0.5 truncate">{selectedLabel}</p>
                </>
              ) : (
                <p className="text-white/20 font-medium text-base group-hover:text-white/40 transition-colors">{placeholder}</p>
              )}
            </div>

            {/* Search icon — non-interactive indicator */}
            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5 text-white/20 shrink-0">
              <Search size={13} />
            </div>
          </div>

          {/* Clear button — absolutely positioned OUTSIDE the div to avoid any nesting */}
          {value && (
            <button type="button" onClick={handleClear} className="absolute right-11 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center bg-white/8 hover:bg-white/15 text-white/30 hover:text-white transition-all z-10">
              <X size={12} />
            </button>
          )}
        </div>
      )}

      {/* ── Inline Search Panel ────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div key="search-panel" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2, ease: "easeOut" }} className="w-full rounded-2xl border border-white/10 bg-[#111111] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.8)]">
            {/* Search input row — single X button: clears text if typed, or closes panel */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <Search size={15} />
              </div>
              <input ref={inputRef} type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Type a city name…" className="flex-1 bg-transparent text-white text-base font-medium outline-none placeholder:text-white/10" />
              {/* Single smart X: clears search if there's text, otherwise closes panel */}
              <button type="button" onClick={() => (search ? setSearch("") : setIsOpen(false))} className="w-7 h-7 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/30 hover:text-white transition-all shrink-0">
                <X size={12} />
              </button>
            </div>

            {/* Results list — fixed height, scrolls independently */}
            <div ref={listRef} className="overflow-y-auto overscroll-contain" style={{ maxHeight: "320px" }}>
              {results.length > 0 ? (
                <div className="py-2">
                  {results.map((city, idx) => (
                    <button key={`${city.timezone}-${idx}`} type="button" onClick={() => handleSelect(city)} className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-white/4 transition-colors group text-left">
                      {/* Pin icon */}
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/20 group-hover:text-accent group-hover:bg-accent/10 group-hover:border-accent/20 transition-all shrink-0 mt-0.5">
                        <MapPin size={14} />
                      </div>

                      {/* Main info */}
                      <div className="flex-1 min-w-0">
                        {/* City + Country — NO truncation */}
                        <p className="text-sm font-semibold text-white leading-snug wrap-break-word">
                          {city.city}, {city.country}
                        </p>
                        {/* Timezone long name */}
                        <p className="text-[11px] text-white/30 font-medium mt-0.5 leading-tight wrap-break-word">{getFriendlyTz(city.timezone)}</p>
                      </div>

                      {/* Current time — always visible on mobile, not just on hover */}
                      <div className="flex flex-col items-end shrink-0 gap-1">
                        <div className="flex items-center gap-1 bg-accent/8 px-2 py-0.5 rounded-full border border-accent/10">
                          <Clock size={9} className="text-accent" />
                          <span className="text-[10px] tabular-nums font-bold text-accent">{getCurrentTime(city.timezone)}</span>
                        </div>
                        {value === city.timezone && <Check size={12} className="text-accent mt-0.5" />}
                      </div>
                    </button>
                  ))}
                </div>
              ) : search.length < 2 ? (
                <div className="py-12 text-center space-y-3 select-none">
                  <div className="w-12 h-12 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center mx-auto">
                    <Globe size={22} className="text-white/15" />
                  </div>
                  <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">Start Typing</p>
                  <p className="text-xs text-white/15 max-w-[180px] mx-auto leading-relaxed">Enter at least 2 characters to search cities</p>
                </div>
              ) : (
                <div className="py-12 text-center space-y-3 select-none">
                  <div className="w-12 h-12 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center mx-auto">
                    <Search size={22} className="text-white/15" />
                  </div>
                  <p className="text-[11px] font-bold text-white/20 uppercase tracking-widest">No Results</p>
                  <p className="text-xs text-white/15 max-w-[180px] mx-auto leading-relaxed">Try a different city or region name</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
