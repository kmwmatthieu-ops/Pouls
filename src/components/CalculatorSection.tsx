"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  VALUATION_CONFIG,
  estimateValuation,
  type NicheKey,
  type LeverKey,
} from "@/lib/valuation";
import { WaitlistForm } from "./WaitlistForm";
import { ArrowRight, Check, Info, Sparkles, TrendingUp, Users } from "lucide-react";

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

const fmtSigned = (v: number) =>
  (v > 0 ? "+" : v < 0 ? "−" : "±") +
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(Math.abs(v)) +
  "×";

const LEVER_KEYS: LeverKey[] = [
  "convertFree",
  "reduceChurn",
  "improveLanding",
  "boostAcquisition",
  "optimizePricing",
  "expandNrr",
];

export function CalculatorSection() {
  const [niche, setNiche] = useState<NicheKey>("b2b_prod");
  const [users, setUsers] = useState<number>(150);
  const [freeUsers, setFreeUsers] = useState<number>(600);
  const [visitors, setVisitors] = useState<number>(4500);
  const [mrr, setMrr] = useState<number>(3000);
  const [growth, setGrowth] = useState<number>(5);
  const [churn, setChurn] = useState<number>(4);
  const [margin, setMargin] = useState<number>(75);
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
      localStorage.setItem("pouls_active_draft", JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
  }

  const activeCount = Object.values(activeLevers).filter(Boolean).length;
  const diffUsers = result.combined12m.users - result.users;
  const diffMrr = result.combined12m.mrr - mrr;
  const diffVal = result.combined12m.valuation - result.mid.value;

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-md">
      <div className="grid lg:grid-cols-12">
        {/* COLONNE GAUCHE : SAISIE DES PARAMÈTRES DU SAAS */}
        <div className="border-b border-border p-6 sm:p-8 lg:col-span-5 lg:border-b-0 lg:border-r lg:p-10">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-text-2">
              1. Niche &amp; Base d&apos;utilisateurs
            </span>
            <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">
              Santé : {result.healthScore}/100
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="c-niche"
                className="mb-1.5 flex items-baseline justify-between text-sm font-semibold text-text"
              >
                <span>Niche du SaaS</span>
                <span className="text-xs font-normal text-text-2">secteur &amp; modèle</span>
              </label>
              <select
                id="c-niche"
                value={niche}
                onChange={(e) => setNiche(e.target.value as NicheKey)}
                className="min-h-[46px] w-full rounded-xl border border-border-strong bg-surface-sunken px-3.5 py-2.5 text-sm font-medium text-text focus:border-accent focus:outline-none"
              >
                {Object.values(VALUATION_CONFIG.niches).map((n) => (
                  <option key={n.key} value={n.key}>
                    {n.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-text-2">{result.niche.description}</p>
            </div>

            <div>
              <label
                htmlFor="c-users"
                className="mb-1.5 flex items-baseline justify-between text-sm font-semibold text-text"
              >
                <span>Utilisateurs payants</span>
                <span className="text-xs font-normal text-text-2">actifs</span>
              </label>
              <div className="relative">
                <input
                  id="c-users"
                  type="number"
                  min={0}
                  max={10000000}
                  value={users}
                  onChange={(e) => setUsers(Math.max(0, Number(e.target.value) || 0))}
                  className="tnum min-h-[46px] w-full rounded-xl border border-border-strong bg-surface-sunken py-2.5 pl-3.5 pr-14 text-base text-text focus:border-accent focus:outline-none"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-2">
                  clients
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="c-free"
                className="mb-1.5 flex items-baseline justify-between text-sm font-semibold text-text"
              >
                <span>Inscrits gratuits / essai</span>
                <span className="text-xs font-normal text-text-2">0 si aucun</span>
              </label>
              <div className="relative">
                <input
                  id="c-free"
                  type="number"
                  min={0}
                  max={50000000}
                  step={10}
                  value={freeUsers}
                  onChange={(e) => setFreeUsers(Math.max(0, Number(e.target.value) || 0))}
                  className="tnum min-h-[46px] w-full rounded-xl border border-border-strong bg-surface-sunken py-2.5 pl-3.5 pr-16 text-base text-text focus:border-accent focus:outline-none"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-2">
                  inscrits
                </span>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="c-visitors"
                className="mb-1.5 flex items-baseline justify-between text-sm font-semibold text-text"
              >
                <span>Visiteurs mensuels du site</span>
                <span className="text-xs font-normal text-text-2">trafic estimé / mois</span>
              </label>
              <div className="relative">
                <input
                  id="c-visitors"
                  type="number"
                  min={0}
                  max={100000000}
                  step={100}
                  value={visitors}
                  onChange={(e) => setVisitors(Math.max(0, Number(e.target.value) || 0))}
                  className="tnum min-h-[46px] w-full rounded-xl border border-border-strong bg-surface-sunken py-2.5 pl-3.5 pr-20 text-base text-text focus:border-accent focus:outline-none"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-2">
                  visiteurs
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4 mt-6 border-b border-border pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-text-2">
              2. Revenus, rétention &amp; historique
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="c-mrr"
                className="mb-1.5 flex items-baseline justify-between text-sm font-semibold text-text"
              >
                <span>MRR actuel</span>
                <span className="text-xs font-normal text-text-2">mensuel</span>
              </label>
              <div className="relative">
                <input
                  id="c-mrr"
                  type="number"
                  min={0}
                  max={10000000}
                  step={50}
                  value={mrr}
                  onChange={(e) => setMrr(Math.max(0, Number(e.target.value) || 0))}
                  className="tnum min-h-[46px] w-full rounded-xl border border-border-strong bg-surface-sunken py-2.5 pl-3.5 pr-10 text-base text-text focus:border-accent focus:outline-none"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-2">
                  €
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="c-growth"
                className="mb-1.5 flex items-baseline justify-between text-sm font-semibold text-text"
              >
                <span>Croissance / mois</span>
                <span className="text-xs font-normal text-text-2">MRR</span>
              </label>
              <div className="relative">
                <input
                  id="c-growth"
                  type="number"
                  min={-50}
                  max={100}
                  step={0.5}
                  value={growth}
                  onChange={(e) => setGrowth(Number(e.target.value) || 0)}
                  className="tnum min-h-[46px] w-full rounded-xl border border-border-strong bg-surface-sunken py-2.5 pl-3.5 pr-10 text-base text-text focus:border-accent focus:outline-none"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-2">
                  %
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="c-churn"
                className="mb-1.5 flex items-baseline justify-between text-sm font-semibold text-text"
              >
                <span>Churn mensuel</span>
                <span className="text-xs font-normal text-text-2">pertes</span>
              </label>
              <div className="relative">
                <input
                  id="c-churn"
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={churn}
                  onChange={(e) => setChurn(Math.max(0, Number(e.target.value) || 0))}
                  className="tnum min-h-[46px] w-full rounded-xl border border-border-strong bg-surface-sunken py-2.5 pl-3.5 pr-10 text-base text-text focus:border-accent focus:outline-none"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-2">
                  %
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="c-margin"
                className="mb-1.5 flex items-baseline justify-between text-sm font-semibold text-text"
              >
                <span>Marge nette</span>
                <span className="text-xs font-normal text-text-2">coûts déduits</span>
              </label>
              <div className="relative">
                <input
                  id="c-margin"
                  type="number"
                  min={-100}
                  max={100}
                  step={1}
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value) || 0)}
                  className="tnum min-h-[46px] w-full rounded-xl border border-border-strong bg-surface-sunken py-2.5 pl-3.5 pr-10 text-base text-text focus:border-accent focus:outline-none"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-2">
                  %
                </span>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="c-age"
                className="mb-1.5 flex items-baseline justify-between text-sm font-semibold text-text"
              >
                <span>Ancienneté du produit</span>
                <span className="text-xs font-normal text-text-2">depuis le 1er revenu</span>
              </label>
              <div className="relative">
                <input
                  id="c-age"
                  type="number"
                  min={0}
                  max={600}
                  step={1}
                  value={age}
                  onChange={(e) => setAge(Math.max(0, Number(e.target.value) || 0))}
                  className="tnum min-h-[46px] w-full rounded-xl border border-border-strong bg-surface-sunken py-2.5 pl-3.5 pr-14 text-base text-text focus:border-accent focus:outline-none"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-2">
                  mois
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-surface-sunken p-4">
            <div className="flex items-start gap-2.5">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div className="text-xs leading-relaxed">
                <p className="font-semibold text-text">
                  Diagnostic prioritaire : {result.bottleneck.title}
                </p>
                <p className="mt-1 text-text-2">{result.bottleneck.detail}</p>
              </div>
            </div>
          </div>

          <Link
            href="/app?tab=analyzer"
            onClick={saveToStudio}
            className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-accent bg-accent-soft px-4 py-3 text-sm font-semibold text-accent transition hover:bg-accent hover:text-on-accent"
          >
            <span>Ouvrir cette analyse dans l&apos;outil complet</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* COLONNE DROITE : VALORISATION, MÉTRIQUES UTILISATEURS & LEVIERS */}
        <div className="flex flex-col gap-6 bg-surface-sunken p-6 sm:p-8 lg:col-span-7 lg:p-10">
          {/* 1. Valorisation en fourchette */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-text-2">
                ARR (MRR × 12) :{" "}
                <strong className="tnum font-bold text-text">{fmtEur(result.arr)}</strong>
              </p>
              <span className="rounded-full bg-info-soft px-3 py-1 text-xs font-semibold text-info">
                Niche : {result.niche.shortLabel}
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3 sm:items-end">
              <div className="rounded-2xl border border-border bg-surface p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-2">
                  Fourchette basse
                </p>
                <p className="tnum mt-1 text-xl font-bold text-text sm:text-2xl">
                  {fmtEur(result.low.value)}
                </p>
                <p className="tnum text-xs text-text-2">{fmtMult(result.low.multiple)} ARR</p>
              </div>

              <div className="rounded-2xl border-2 border-accent bg-surface p-5 shadow-md">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Valeur médiane
                </p>
                <p className="tnum mt-1 text-2xl font-bold text-accent sm:text-3xl">
                  {fmtEur(result.mid.value)}
                </p>
                <p className="tnum text-xs text-text-2">{fmtMult(result.mid.multiple)} ARR</p>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-2">
                  Fourchette haute
                </p>
                <p className="tnum mt-1 text-xl font-bold text-text sm:text-2xl">
                  {fmtEur(result.high.value)}
                </p>
                <p className="tnum text-xs text-text-2">{fmtMult(result.high.multiple)} ARR</p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-text-2">
              Valeur = <code className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono">ARR × multiple</code>.
              Le multiple médian de <strong>{fmtMult(result.mid.multiple)}</strong> part d&apos;une base
              de {fmtMult(result.base)}, ajustée selon votre niche ({result.niche.shortLabel}), votre
              base de {fmtNum(result.users)} clients payants, votre croissance, votre churn, votre
              marge et l&apos;ancienneté (borné de {fmtMult(result.min)} à {fmtMult(result.max)}).
            </p>

            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Détail des ajustements du multiple">
              <li className="tnum rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-text">
                Base {fmtMult(result.base)}
              </li>
              {result.adjustments.map((a) => (
                <li
                  key={a.key}
                  className={`tnum rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-semibold ${
                    a.value > 0 ? "text-success" : a.value < 0 ? "text-error" : "text-text-2"
                  }`}
                >
                  {a.label} {fmtSigned(a.value)}
                </li>
              ))}
            </ul>
          </div>

          {/* 2. Diagnostic par utilisateur & repères de la niche */}
          <div className="border-t border-border pt-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-text-2">
              Analyse de vos utilisateurs &amp; repères {result.niche.shortLabel}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-border bg-surface p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
                  ARPU (panier)
                </p>
                <p className="tnum mt-1 text-lg font-bold text-text">
                  {result.users > 0
                    ? fmtEur(Math.round(result.arpu))
                    : fmtEur(result.niche.refArpu)}
                </p>
                <p className="text-[11px] text-text-2">
                  Repère niche : ~{fmtEur(result.niche.refArpu)}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
                  LTV nette estimée
                </p>
                <p className="tnum mt-1 text-lg font-bold text-text">
                  {result.users > 0 ? fmtEur(Math.round(result.ltv)) : "—"}
                </p>
                <p className="text-[11px] text-text-2">Marge {fmtNum(margin)} % incluse</p>
              </div>

              <div className="rounded-xl border border-border bg-surface p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
                  Base utilisateurs
                </p>
                <p className="tnum mt-1 text-lg font-bold text-text">
                  {fmtNum(result.totalUsers)} tot.
                </p>
                <p className="text-[11px] text-text-2">
                  {freeUsers > 0
                    ? `${fmtNum(result.convRate)} % payants (cible ${result.niche.targetConv} %)`
                    : `${fmtNum(result.users)} payants (100 %)`}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-surface p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
                  Churn vs Niche
                </p>
                <p className="tnum mt-1 text-lg font-bold text-text">
                  {fmtNum(churn)} % vs {fmtNum(result.niche.refChurn)} %
                </p>
                <p className="truncate text-[11px] text-text-2">{result.userTier.label}</p>
              </div>
            </div>
          </div>

          {/* 3. Simulateur de leviers : combien d'utilisateurs et de revenus gagner selon vos actions */}
          <div className="border-t border-border pt-5">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="text-base font-bold text-text">
                Combien d&apos;utilisateurs et de valeur pouvez-vous obtenir si vous agissez ?
              </h4>
              <span className="text-xs text-text-2">
                Cliquez sur les actions pour cumuler leur impact à 12 mois
              </span>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {LEVER_KEYS.map((key) => {
                const lv = result.levers[key];
                const isPressed = !!activeLevers[key];
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={isPressed}
                    onClick={() => toggleLever(key)}
                    className={`flex flex-col justify-between rounded-xl border p-3.5 text-left transition ${
                      isPressed
                        ? "border-accent bg-accent-soft shadow-sm"
                        : "border-border-strong bg-surface hover:border-accent/60"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-text">{lv.title}</span>
                        <span
                          className={`inline-grid h-5 w-5 shrink-0 place-items-center rounded-md border text-xs ${
                            isPressed
                              ? "border-accent bg-accent text-on-accent"
                              : "border-border-strong bg-surface text-transparent"
                          }`}
                          aria-hidden="true"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-text-2">
                        {lv.actionPlan}
                      </p>
                    </div>
                    <div className="tnum mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border/60 pt-2 text-[11px] font-bold text-accent">
                      {lv.gainUsers > 0 && <span>+{fmtNum(lv.gainUsers)} clients payants</span>}
                      {lv.gainFreeUsers > 0 && <span>+{fmtNum(lv.gainFreeUsers)} inscrits</span>}
                      <span>+{fmtEur(lv.gainMrr)}/mois</span>
                      <span>+{fmtEur(lv.gainVal)} valeur</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bilan projeté à 12 mois */}
            <div className="mt-4 rounded-2xl border border-border-strong bg-surface p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-text">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  Projection estimée à 12 mois (croissance + actions cochées)
                </span>
                <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">
                  {activeCount === 0
                    ? "Rythme actuel (0 action)"
                    : `${activeCount} action${activeCount > 1 ? "s" : ""} activée${
                        activeCount > 1 ? "s" : ""
                      }`}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-3">
                <div>
                  <p className="flex items-center gap-1 text-[11px] text-text-2">
                    <Users className="h-3 w-3" /> Utilisateurs payants
                  </p>
                  <p className="tnum mt-0.5 text-lg font-bold text-accent sm:text-xl">
                    {fmtNum(result.combined12m.users)} clients
                  </p>
                  <p className="tnum text-[11px] font-semibold text-text-2">
                    {diffUsers >= 0 ? "+" : "−"}
                    {fmtNum(Math.abs(diffUsers))} vs aujourd&apos;hui ({fmtNum(result.users)})
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-text-2">MRR estimé à 12 mois</p>
                  <p className="tnum mt-0.5 text-lg font-bold text-accent sm:text-xl">
                    {fmtEur(result.combined12m.mrr)}
                  </p>
                  <p className="tnum text-[11px] font-semibold text-text-2">
                    {diffMrr >= 0 ? "+" : "−"}
                    {fmtEur(Math.abs(diffMrr))}/mois vs aujourd&apos;hui
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-text-2">Valeur médiane à 12 mois</p>
                  <p className="tnum mt-0.5 text-lg font-bold text-accent sm:text-xl">
                    {fmtEur(result.combined12m.valuation)}
                  </p>
                  <p className="tnum text-[11px] font-semibold text-text-2">
                    {diffVal >= 0 ? "+" : "−"}
                    {fmtEur(Math.abs(diffVal))} ({fmtMult(result.combined12m.multiple)} ARR)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl bg-info-soft p-3.5 text-xs font-medium text-text">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" />
            <span>
              Estimation indicative, non contractuelle, ne constitue pas un conseil financier. Les
              projections reposent sur des repères sectoriels et ne garantissent pas de résultats
              futurs.
            </span>
          </div>

          <div className="border-t border-border pt-5">
            <p className="text-base font-bold text-text">
              Recevez le diagnostic complet de votre SaaS au lancement
            </p>
            <p className="mb-3 mt-1 text-xs text-text-2">
              Avec connexion Stripe en lecture seule, suivi réel de vos cohortes d&apos;utilisateurs
              et plan d&apos;action personnalisé.
            </p>
            <WaitlistForm
              idPrefix="calc"
              source="calculateur"
              buttonLabel="M'inscrire"
              metadata={{
                niche,
                payingUsers: users,
                freeUsers,
                mrr,
                estimatedMedian: result.mid.value,
                projected12mUsers: result.combined12m.users,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

