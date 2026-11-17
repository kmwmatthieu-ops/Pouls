"use client";

import React, { useState } from "react";
import { Activity, CheckCircle2, ShieldCheck, Sparkles, TrendingUp, Zap } from "lucide-react";

export function Hero3DScene() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const toggleCard = (idx: number) => {
    setActiveCard(activeCard === idx ? null : idx);
  };

  return (
    <div className="relative w-full max-w-[540px] mx-auto h-[460px] sm:h-[500px] flex items-center justify-center [perspective:1100px]">
      {/* Halo lumineux d'ambiance */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#5B3DF5]/35 via-[#EC4899]/25 to-[#FFB84D]/30 blur-[75px] rounded-full pointer-events-none scale-90" />

      {/* Médaille / Pièce 3D en rotation perpétuelle au centre */}
      <div className="absolute z-10 w-28 h-28 sm:w-32 sm:h-32 coin-spin-3d pointer-events-none flex items-center justify-center">
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#5B3DF5] via-[#3A22C8] to-[#FFB84D] p-[3px] shadow-[0_0_50px_rgba(91,61,245,0.7)]">
          <div className="w-full h-full rounded-full bg-[#0B0A14] flex flex-col items-center justify-center border border-white/20">
            <svg className="w-10 h-10 text-[#FFB84D]" viewBox="0 0 32 32" fill="none">
              <path
                d="M4 17h5l3-7 5 13 3-6h8"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[10px] font-mono tracking-widest text-white/80 uppercase font-semibold mt-0.5">
              POULS
            </span>
          </div>
        </div>
      </div>

      {/* Carte Flottante 1 : Stripe Live & ARR (Haut Gauche) */}
      <div
        onClick={() => toggleCard(1)}
        style={{ animationDelay: "0s" }}
        className="floating-3d-card absolute -top-2 -left-2 sm:left-4 z-20 w-[240px] sm:w-[270px] cursor-pointer rounded-2xl bg-[#1B1A26]/90 backdrop-blur-xl border border-white/15 p-4 shadow-[0_16px_36px_rgba(0,0,0,0.55)] select-none"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#5B3DF5]/25 border border-[#5B3DF5]/40 flex items-center justify-center text-[#5B3DF5]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Stripe Sync Live</div>
              <div className="text-[10px] text-white/60">Lecture seule chiffrée</div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            200 OK
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-white/10">
          <div>
            <div className="text-[10px] text-white/50 uppercase tracking-wider font-mono">ARR Actuel</div>
            <div className="text-lg font-bold font-mono text-white tnum">184 200 €</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-white/50 uppercase tracking-wider font-mono">Churn net</div>
            <div className="text-xs font-bold text-emerald-400 font-mono tnum">-1.8% /mois</div>
          </div>
        </div>

        {activeCard === 1 && (
          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-[#FFB84D] font-medium bg-[#FFB84D]/10 px-2 py-1 rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Chiffrement AES-256 actif & sans risque</span>
          </div>
        )}
      </div>

      {/* Carte Flottante 2 : Valorisation Immédiate (Haut Droite) */}
      <div
        onClick={() => toggleCard(2)}
        style={{ animationDelay: "1.8s" }}
        className="floating-3d-card absolute top-12 -right-2 sm:right-2 z-20 w-[230px] sm:w-[260px] cursor-pointer rounded-2xl bg-[#1B1A26]/90 backdrop-blur-xl border border-white/15 p-4 shadow-[0_16px_36px_rgba(0,0,0,0.55)] select-none"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FFB84D]/25 border border-[#FFB84D]/40 flex items-center justify-center text-[#FFB84D]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Valorisation Cession</div>
              <div className="text-[10px] text-white/60">Multiple pondéré 4.2x</div>
            </div>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-white/10">
          <div className="text-[10px] text-white/50 uppercase tracking-wider font-mono">Fourchette Médiane</div>
          <div className="text-xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#FFB84D] via-[#FFF0C2] to-[#FFB84D] tnum">
            775 000 €
          </div>
          <div className="text-[10px] text-white/60 mt-0.5">Fourchette : 620k € — 920k €</div>
        </div>

        {activeCard === 2 && (
          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium bg-emerald-950/60 px-2 py-1 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Score santé 88/100 · Dossier prêt</span>
          </div>
        )}
      </div>

      {/* Carte Flottante 3 : Uptime HTTP & Latence (Bas Centre/Gauche) */}
      <div
        onClick={() => toggleCard(3)}
        style={{ animationDelay: "3.2s" }}
        className="floating-3d-card absolute bottom-4 left-6 sm:left-12 z-20 w-[240px] sm:w-[280px] cursor-pointer rounded-2xl bg-[#1B1A26]/90 backdrop-blur-xl border border-white/15 p-4 shadow-[0_16px_36px_rgba(0,0,0,0.55)] select-none"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#06B6D4]/25 border border-[#06B6D4]/40 flex items-center justify-center text-[#06B6D4]">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Sonde Uptime HTTP</div>
              <div className="text-[10px] text-white/60">Fréquence 60s en direct</div>
            </div>
          </div>
          <span className="text-[10px] font-mono font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
            99.98%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/10 text-xs font-mono">
          <div>
            <div className="text-[9px] text-white/50 uppercase">Latence API</div>
            <div className="text-sm font-bold text-white tnum">124 ms</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-white/50 uppercase">Statut Serveur</div>
            <div className="text-sm font-bold text-emerald-400">Opérationnel</div>
          </div>
        </div>

        {activeCard === 3 && (
          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-cyan-300 font-medium bg-cyan-950/60 px-2 py-1 rounded-lg">
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span>Alerte email & webhook configurées</span>
          </div>
        )}
      </div>
    </div>
  );
}

