"use client";

import React from "react";
import { Activity, CheckCircle2, ShieldCheck, Sparkles, TrendingUp, Zap } from "lucide-react";

const MARQUEE_ITEMS = [
  { icon: TrendingUp, label: "ARR & MRR TEMPS RÉEL", color: "text-[#5B3DF5]" },
  { icon: Sparkles, label: "MULTIPLE DE VALORISATION BORNÉ 1.5× — 5.0×", color: "text-[#FFB84D]" },
  { icon: ShieldCheck, label: "CONNEXION STRIPE LECTURE SEULE AES-256", color: "text-emerald-400" },
  { icon: Activity, label: "SURVEILLANCE UPTIME 60S & LATENCE RÉELLE", color: "text-[#06B6D4]" },
  { icon: Zap, label: "DÉTECTION AUTOMATIQUE DU GOULOT PRIORITAIRE", color: "text-[#EC4899]" },
  { icon: CheckCircle2, label: "DOSSIER DE CESSION EXPORTABLE PDF & JSON", color: "text-amber-300" },
];

export function MarqueeBanner() {
  return (
    <div className="relative w-full overflow-hidden border-y border-[#2E2C40] bg-[#0E0D18]/90 py-4 backdrop-blur-md">
      {/* Masques de fondu latéraux */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-24 sm:w-36 bg-gradient-to-r from-[#0B0A14] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-24 sm:w-36 bg-gradient-to-l from-[#0B0A14] to-transparent" />

      {/* Track en défilement perpétuel 60 FPS */}
      <div className="perpetual-marquee-track flex items-center gap-10 select-none">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 shrink-0 px-3 text-xs sm:text-sm font-mono tracking-wider font-semibold text-white/80 transition-colors hover:text-white"
            >
              <span className={`w-2 h-2 rounded-full ${item.color} bg-current animate-pulse`} />
              <Icon className={`w-4 h-4 ${item.color}`} />
              <span>{item.label}</span>
              <span className="text-white/20 ml-6">✦</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

