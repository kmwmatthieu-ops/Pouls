"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  VALUATION_CONFIG,
  estimateValuation,
  type NicheKey,
  type LeverKey,
} from "@/lib/valuation";
import { ScrollReveal } from "./ScrollReveal";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  HelpCircle,
  Layers,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

const fmtEur = (v: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(v);

const fmtNum = (v: number) =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(v);

const fmtMult = (v: number) =>
  new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(v) + "×";

const LEVER_KEYS: LeverKey[] = [
  "convertFree",
  "reduceChurn",
  "improveLanding",
  "boostAcquisition",
  "optimizePricing",
  "expandNrr",
];

export function InteractiveSimulator() {
  const [niche, setNiche] = useState<NicheKey>("b2b_prod");
  const [users, setUsers] = useState<number>(180);
  const [freeUsers, setFreeUsers] = useState<number>(750);
  const [visitors, setVisitors] = useState<number>(5400);
  const [mrr, setMrr] = useState<number>(3800);
  const [growth, setGrowth] = useState<number>(6);
  const [churn, setChurn] = useState<number>(3.5);
  const [margin, setMargin] = useState<number>(80);
  const [age, setAge] = useState<number>(18);

  const [activeLevers, setActiveLevers] = useState<Partial<Record<LeverKey, boolean>>>({
    convertFree: true,
    reduceChurn: true,
    improveLanding: false,
    boostAcquisition: false,
    optimizePricing: false,
    expandNrr: false,
  });

  const result = useMemo(
    () =>
      estimateValuation({
        niche,
        users,
        freeUsers,
        visitors,
        mrr,
        growth,
        churn,
        margin,
        age,
        activeLevers,
      }),
    [niche, users, freeUsers, visitors, mrr, growth, churn, margin, age, activeLevers]
  );

  function toggleLever(key: LeverKey) {
    setActiveLevers((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function saveToStudio() {
    try {
      const payload = {
        id: "custom-landing",
        name: "Mon SaaS",
        url: "https://mon-saas.com",
        niche,
        users,
        freeUsers,
        visitors,
        mrr,
        growth,
        churn,
        margin,
        age,
        activeLevers,
      };
      if (typeof window !== "undefined") {
        window.localStorage.setItem("pouls_landing_import", JSON.stringify(payload));
      }
    } catch {
      // Ignorer si localStorage désactivé
    }
  }

  const annualGain = Math.max(0, result.combined12m.arr - result.baseline12m.arr);
  const growth12m =
    result.baseline12m.arr > 0
      ? ((result.combined12m.arr - result.baseline12m.arr) / result.baseline12m.arr) * 100
      : 0;

  return (
    <section id="simulateur" className="relative py-24 sm:py-32 overflow-hidden bg-[#0B0A14]">
      {/* Grille cyber-grid sombre en fond */}
      <div className="absolute inset-0 cyber-grid-dark opacity-60 pointer-events-none" />

      {/* Halos d'ambiance */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-[#5B3DF5]/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full bg-[#FFB84D]/15 blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-8">
        {/* En-tête de section */}
        <ScrollReveal variant="fade-up" className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5B3DF5]/20 border border-[#5B3DF5]/40 text-[#D9D2FF] text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#FFB84D]" />
            Simulateur & Valorisation Temps Réel
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Quelle est la valeur réelle de votre SaaS ?{" "}
            <span className="font-serif-drama italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFB84D] via-[#FFF0C2] to-[#FFB84D]">
              Calculez-la ici.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-white/70 leading-relaxed">
            Ajustez vos métriques actuelles et activez vos leviers d&apos;action pour mesurer
            instantanément l&apos;impact sur votre ARR, vos utilisateurs et votre valorisation de cession.
          </p>
        </ScrollReveal>

        {/* Grille en 2 colonnes (Gauche : Paramètres / Droite : Synthèse Sombre) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLONNE GAUCHE (Paramètres & Curseurs) */}
          <ScrollReveal variant="fade-left" className="lg:col-span-7 space-y-6">
            <div className="manifesto-card p-6 sm:p-8 space-y-7 border border-white/10 shadow-2xl">
              {/* Sélecteur de Niche */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/70 font-semibold mb-3">
                  1. Niche & Modèle économique
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(Object.keys(VALUATION_CONFIG.niches) as NicheKey[]).map((k) => {
                    const n = VALUATION_CONFIG.niches[k];
                    const selected = niche === k;
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setNiche(k)}
                        className={`text-left p-3 rounded-xl border text-xs transition-all ${
                          selected
                            ? "bg-[#5B3DF5]/25 border-[#5B3DF5] text-white shadow-[0_0_20px_rgba(91,61,245,0.35)]"
                            : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>{n.shortLabel}</span>
                          {selected && <span className="w-1.5 h-1.5 rounded-full bg-[#FFB84D]" />}
                        </div>
                        <div className="text-[10px] text-white/50 mt-1">
                          Ref. Churn : {n.refChurn}% · Cible {n.targetConv}%
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sliders Principaux */}
              <div className="space-y-5 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-white/70 font-semibold">
                    2. Vos chiffres clés
                  </span>
                  <span className="text-[11px] text-[#FFB84D] font-mono">Calcul temps réel</span>
                </div>

                {/* MRR */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/80">Revenu Récurrent Mensuel (MRR)</span>
                    <span className="font-mono font-bold text-white text-sm tnum">
                      {fmtEur(mrr)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={30000}
                    step={100}
                    value={mrr}
                    onChange={(e) => setMrr(Number(e.target.value))}
                    className="w-full accent-[#5B3DF5] h-2 bg-white/10 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-white/40 font-mono">
                    <span>200 €</span>
                    <span>ARR : {fmtEur(mrr * 12)}</span>
                    <span>30 000 €</span>
                  </div>
                </div>

                {/* Utilisateurs Payants */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/80">Clients payants actifs</span>
                    <span className="font-mono font-bold text-white text-sm tnum">
                      {users} clients
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={1500}
                    step={5}
                    value={users}
                    onChange={(e) => setUsers(Number(e.target.value))}
                    className="w-full accent-[#5B3DF5] h-2 bg-white/10 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-white/40 font-mono">
                    <span>5</span>
                    <span>ARPU : {fmtEur(users > 0 ? mrr / users : 0)}/mois</span>
                    <span>1 500</span>
                  </div>
                </div>

                {/* Grille Trafic & Inscrits Gratuits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/80">Visiteurs / mois</span>
                      <span className="font-mono font-bold text-white text-xs tnum">{visitors}</span>
                    </div>
                    <input
                      type="range"
                      min={200}
                      max={40000}
                      step={200}
                      value={visitors}
                      onChange={(e) => setVisitors(Number(e.target.value))}
                      className="w-full accent-[#5B3DF5] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/80">Inscrits gratuits / essais</span>
                      <span className="font-mono font-bold text-white text-xs tnum">{freeUsers}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={5000}
                      step={25}
                      value={freeUsers}
                      onChange={(e) => setFreeUsers(Number(e.target.value))}
                      className="w-full accent-[#5B3DF5] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Grille Churn & Croissance */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/80">Churn mensuel (%)</span>
                      <span className="font-mono font-bold text-white text-xs tnum">{churn}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.5}
                      max={15}
                      step={0.5}
                      value={churn}
                      onChange={(e) => setChurn(Number(e.target.value))}
                      className="w-full accent-[#EC4899] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/80">Croissance mensuelle (%)</span>
                      <span className="font-mono font-bold text-white text-xs tnum">+{growth}%</span>
                    </div>
                    <input
                      type="range"
                      min={-5}
                      max={25}
                      step={0.5}
                      value={growth}
                      onChange={(e) => setGrowth(Number(e.target.value))}
                      className="w-full accent-[#FFB84D] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Les 6 Leviers d'Action */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-white/70 font-semibold">
                    3. Leviers d&apos;optimisation (Projection 12 mois)
                  </span>
                  <span className="text-[11px] text-[#06B6D4] font-mono">
                    {Object.values(activeLevers).filter(Boolean).length}/6 activés
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {LEVER_KEYS.map((k) => {
                    const active = Boolean(activeLevers[k]);
                    const info = result.levers[k];
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => toggleLever(k)}
                        className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all ${
                          active
                            ? "bg-[#5B3DF5]/20 border-[#5B3DF5] text-white shadow-[0_0_15px_rgba(91,61,245,0.25)]"
                            : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                            active
                              ? "bg-[#5B3DF5] border-[#5B3DF5] text-white"
                              : "border-white/20 bg-white/5"
                          }`}
                        >
                          {active && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold leading-tight">{info.title}</div>
                          <div className="text-[10px] text-white/50 mt-0.5 leading-snug">
                            {info.actionPlan}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* COLONNE DROITE (Carte de Synthèse Sombre & Valorisation) */}
          <ScrollReveal variant="fade-right" className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 manifesto-card p-6 sm:p-8 space-y-6 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.7)] bg-[#12111E]/95">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FFB84D]/20 border border-[#FFB84D]/40 flex items-center justify-center text-[#FFB84D]">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Synthèse de Valorisation</h3>
                    <p className="text-[11px] text-white/60">Modèle de marché SaaS 2026</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-mono text-white/50">Score Santé</div>
                  <div className="text-base font-bold font-mono text-emerald-400">
                    {result.healthScore}/100
                  </div>
                </div>
              </div>

              {/* Chiffre Clé : Valorisation Médiane */}
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-white/50 mb-1">
                  Estimation Médiane Indicative
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#FFB84D] via-[#FFF0C2] to-[#FFB84D] tnum tracking-tight">
                  {fmtEur(result.mid.value)}
                </div>
                <div className="text-xs text-white/60 mt-1 flex items-center gap-2">
                  <span>Multiple appliqué :</span>
                  <span className="font-mono font-bold text-[#FFB84D] bg-[#FFB84D]/10 px-2 py-0.5 rounded border border-[#FFB84D]/25">
                    {fmtMult(result.mid.multiple)} ARR
                  </span>
                </div>
              </div>

              {/* Fourchette Basse / Haute */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10 font-mono text-xs">
                <div>
                  <div className="text-[10px] text-white/50 uppercase">Fourchette Basse</div>
                  <div className="text-base font-bold text-white/90 tnum mt-0.5">
                    {fmtEur(result.low.value)}
                  </div>
                  <div className="text-[10px] text-white/40">{fmtMult(result.low.multiple)}</div>
                </div>
                <div className="border-l border-white/10 pl-3">
                  <div className="text-[10px] text-white/50 uppercase">Fourchette Haute</div>
                  <div className="text-base font-bold text-emerald-400 tnum mt-0.5">
                    {fmtEur(result.high.value)}
                  </div>
                  <div className="text-[10px] text-white/40">{fmtMult(result.high.multiple)}</div>
                </div>
              </div>

              {/* Impact des Leviers à 12 Mois */}
              <div className="p-4 rounded-xl bg-[#5B3DF5]/15 border border-[#5B3DF5]/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#D9D2FF]">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#FFB84D]" />
                    Projection à 12 mois avec vos leviers
                  </span>
                  <span className="font-mono text-emerald-400">+{fmtNum(growth12m)}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-white/10">
                  <div>
                    <div className="text-[10px] text-white/60">ARR Futur Projeté</div>
                    <div className="text-sm font-bold text-white tnum">
                      {fmtEur(result.combined12m.arr)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/60">Gain Annuel Net</div>
                    <div className="text-sm font-bold text-[#FFB84D] tnum">
                      +{fmtEur(annualGain)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Diagnostic Flash */}
              <div className="text-xs text-white/70 bg-white/5 p-3 rounded-xl border border-white/10 flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-[#FFB84D] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Goulot d&apos;étranglement détecté : </span>
                  <span>{result.bottleneck.title}. </span>
                  <span className="text-white/50">{result.bottleneck.detail}</span>
                </div>
              </div>

              {/* Bouton Action Directe */}
              <div className="pt-2">
                <Link
                  href="/app"
                  onClick={saveToStudio}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#5B3DF5] to-[#3A22C8] hover:from-[#6A4EFA] hover:to-[#432BD9] shadow-[0_8px_30px_rgba(91,61,245,0.45)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Importer dans Pouls Studio (/app)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="text-[11px] text-center text-white/40 mt-2 font-mono">
                  Génère votre dossier complet, monitoring & export PDF
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
