"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  VALUATION_CONFIG,
  estimateValuation,
  type LeverKey,
  type NicheKey,
  type SaasInput,
} from "@/lib/valuation";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Check,
  CheckCircle2,
  Database,
  Download,
  ExternalLink,
  Filter,
  Globe,
  Info,
  KeyRound,
  Layers,
  Plus,
  Printer,
  RefreshCw,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";

interface UptimeEndpoint {
  id: string;
  label: string;
  url: string;
  up: boolean;
  status: number | null;
  statusText: string;
  latencyMs: number | null;
  lastCheckedAt: string | null;
}

interface SaasProject extends SaasInput {
  id: string;
  name: string;
  url: string;
  alertEmail: string;
  endpoints: UptimeEndpoint[];
}

const DEFAULT_PROJECTS: SaasProject[] = [
  {
    id: "saas-1",
    name: "Facturio B2B",
    url: "https://example.com",
    niche: "b2b_prod",
    visitors: 4800,
    freeUsers: 620,
    users: 165,
    mrr: 3630,
    growth: 5.5,
    churn: 3.8,
    margin: 78,
    age: 20,
    alertEmail: "fondateur@mon-saas.com",
    activeLevers: {
      convertFree: true,
      reduceChurn: true,
      improveLanding: false,
      boostAcquisition: false,
      optimizePricing: false,
      expandNrr: false,
    },
    endpoints: [
      {
        id: "ep-1",
        label: "Application Web",
        url: "https://example.com",
        up: true,
        status: 200,
        statusText: "OK",
        latencyMs: 142,
        lastCheckedAt: "Vérifié récemment",
      },
    ],
  },
  {
    id: "saas-2",
    name: "LogPulse API",
    url: "https://www.IANA.org",
    niche: "devtools",
    visitors: 3200,
    freeUsers: 410,
    users: 84,
    mrr: 2940,
    growth: 7.0,
    churn: 2.4,
    margin: 82,
    age: 14,
    alertEmail: "alerte@logpulse.dev",
    activeLevers: {
      convertFree: true,
      reduceChurn: false,
      improveLanding: true,
      boostAcquisition: true,
      optimizePricing: false,
      expandNrr: false,
    },
    endpoints: [
      {
        id: "ep-2",
        label: "Portail Développeurs",
        url: "https://www.iana.org",
        up: true,
        status: 200,
        statusText: "OK",
        latencyMs: 185,
        lastCheckedAt: "Vérifié récemment",
      },
    ],
  },
];

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

type TabKey = "overview" | "analyzer" | "valuation" | "uptime" | "integrations";

export default function SaasAppPage() {
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<SaasProject[]>(DEFAULT_PROJECTS);
  const [activeId, setActiveId] = useState<string>(DEFAULT_PROJECTS[0].id);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [chartMetric, setChartMetric] = useState<"users" | "mrr" | "val">("users");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Uptime check state
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [newEndpointLabel, setNewEndpointLabel] = useState("");
  const [newEndpointUrl, setNewEndpointUrl] = useState("");

  // Stripe sync state
  const [stripeKey, setStripeKey] = useState("");
  const [stripeStatus, setStripeStatus] = useState<{
    state: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ state: "idle", message: "" });

  // Load saved projects & draft from Landing Page calculator
  useEffect(() => {
    try {
      const savedRaw = localStorage.getItem("pouls_saas_projects_v1");
      let loaded: SaasProject[] = savedRaw ? JSON.parse(savedRaw) : DEFAULT_PROJECTS;
      if (!Array.isArray(loaded) || loaded.length === 0) {
        loaded = DEFAULT_PROJECTS;
      }

      const draftRaw =
        localStorage.getItem("pouls_landing_import") ||
        localStorage.getItem("pouls_active_draft");
      if (draftRaw) {
        const draft = JSON.parse(draftRaw);
        localStorage.removeItem("pouls_landing_import");
        localStorage.removeItem("pouls_active_draft");
        const customProj: SaasProject = {
          id: "draft-" + Date.now(),
          name: draft.name || "Mon SaaS analysé",
          url: draft.url || "https://example.com",
          niche: draft.niche || "b2b_prod",
          visitors: Number(draft.visitors ?? 4500),
          freeUsers: Number(draft.freeUsers ?? 600),
          users: Number(draft.users ?? 150),
          mrr: Number(draft.mrr ?? 3000),
          growth: Number(draft.growth ?? 5),
          churn: Number(draft.churn ?? 4),
          margin: Number(draft.margin ?? 75),
          age: Number(draft.age ?? 18),
          alertEmail: "fondateur@mon-saas.com",
          activeLevers: draft.activeLevers || { convertFree: true, reduceChurn: true },
          endpoints: [
            {
              id: "ep-draft",
              label: "Service principal",
              url: draft.url || "https://example.com",
              up: true,
              status: 200,
              statusText: "Prêt à tester",
              latencyMs: null,
              lastCheckedAt: null,
            },
          ],
        };
        loaded = [customProj, ...loaded];
        setActiveId(customProj.id);
        setActiveTab("analyzer");
      }

      setProjects(loaded);
    } catch {
      // ignore storage errors
    }
  }, []);

  // Save projects on change
  useEffect(() => {
    try {
      localStorage.setItem("pouls_saas_projects_v1", JSON.stringify(projects));
    } catch {
      // ignore
    }
  }, [projects]);

  const currentProject = useMemo(
    () => projects.find((p) => p.id === activeId) || projects[0],
    [projects, activeId]
  );

  const analysis = useMemo(
    () => estimateValuation(currentProject),
    [currentProject]
  );

  function updateProject(patch: Partial<SaasProject>) {
    setProjects((prev) =>
      prev.map((p) => (p.id === currentProject.id ? { ...p, ...patch } : p))
    );
  }

  function toggleLever(key: LeverKey) {
    const nextLevers = {
      ...(currentProject.activeLevers || {}),
      [key]: !currentProject.activeLevers?.[key],
    };
    updateProject({ activeLevers: nextLevers });
  }

  function addNewProject() {
    const id = "saas-" + Date.now();
    const created: SaasProject = {
      id,
      name: `Nouveau SaaS #${projects.length + 1}`,
      url: "https://example.com",
      niche: "b2b_prod",
      visitors: 2500,
      freeUsers: 300,
      users: 45,
      mrr: 1125,
      growth: 6,
      churn: 3.5,
      margin: 80,
      age: 10,
      alertEmail: "fondateur@mon-saas.com",
      activeLevers: { convertFree: true, reduceChurn: true },
      endpoints: [
        {
          id: "ep-" + Date.now(),
          label: "Page d'accueil / App",
          url: "https://example.com",
          up: true,
          status: null,
          statusText: "Non testé",
          latencyMs: null,
          lastCheckedAt: null,
        },
      ],
    };
    setProjects((prev) => [...prev, created]);
    setActiveId(id);
    setActiveTab("analyzer");
  }

  function deleteCurrentProject() {
    if (projects.length <= 1) return;
    const remaining = projects.filter((p) => p.id !== currentProject.id);
    setProjects(remaining);
    setActiveId(remaining[0].id);
  }

  async function checkEndpoint(ep: UptimeEndpoint) {
    setCheckingId(ep.id);
    try {
      const res = await fetch("/api/uptime/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: ep.url }),
      });
      const data = await res.json();
      const updated = currentProject.endpoints.map((item) =>
        item.id === ep.id
          ? {
              ...item,
              up: Boolean(data.up),
              status: data.status ?? 0,
              statusText: data.statusText || (data.up ? "OK" : "Injoignable"),
              latencyMs: data.latencyMs ?? null,
              lastCheckedAt: new Date().toLocaleTimeString("fr-FR"),
            }
          : item
      );
      updateProject({ endpoints: updated });
    } catch {
      // fallback
    } finally {
      setCheckingId(null);
    }
  }

  function handleAddEndpoint(e: React.FormEvent) {
    e.preventDefault();
    if (!newEndpointUrl.trim()) return;
    const ep: UptimeEndpoint = {
      id: "ep-" + Date.now(),
      label: newEndpointLabel.trim() || "Service Web",
      url: newEndpointUrl.trim(),
      up: true,
      status: null,
      statusText: "Prêt à tester",
      latencyMs: null,
      lastCheckedAt: null,
    };
    updateProject({ endpoints: [...currentProject.endpoints, ep] });
    setNewEndpointLabel("");
    setNewEndpointUrl("");
  }

  async function handleStripeSync(e: React.FormEvent) {
    e.preventDefault();
    setStripeStatus({ state: "loading", message: "Connexion en lecture seule à Stripe…" });
    try {
      const res = await fetch("/api/stripe/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: stripeKey }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStripeStatus({
          state: "error",
          message: data.error || "Erreur lors de la synchronisation Stripe.",
        });
        return;
      }
      updateProject({
        mrr: data.mrr,
        users: data.users,
      });
      setStripeStatus({
        state: "success",
        message: `Synchronisation réussie : ${data.users} clients actifs et ${fmtEur(data.mrr)} de MRR importés.`,
      });
    } catch {
      setStripeStatus({
        state: "error",
        message: "Erreur réseau lors de la connexion à l'API.",
      });
    }
  }

  function exportReportJson() {
    const report = {
      generatedAt: new Date().toISOString(),
      product: {
        name: currentProject.name,
        url: currentProject.url,
        niche: analysis.niche.label,
      },
      currentMetrics: {
        mrr: currentProject.mrr,
        arr: analysis.arr,
        payingUsers: analysis.users,
        freeUsers: analysis.freeUsers,
        visitors: analysis.visitors,
        arpu: Math.round(analysis.arpu * 100) / 100,
        ltv: Math.round(analysis.ltv),
        churnPct: currentProject.churn,
        growthPct: currentProject.growth,
        marginPct: currentProject.margin,
        ageMonths: currentProject.age,
        healthScore: analysis.healthScore,
      },
      valuationRange: {
        low: analysis.low,
        median: analysis.mid,
        high: analysis.high,
        adjustments: analysis.adjustments,
        disclaimer:
          "Estimation indicative, non contractuelle, ne constitue pas un conseil financier.",
      },
      projection12Months: analysis.combined12m,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pouls-analyse-${currentProject.name.toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Coordonnées SVG pour la courbe comparative 12 mois
  const chartPoints = useMemo(() => {
    const series = analysis.monthlySeries;
    const getVal = (pt: (typeof series)[0], mode: "base" | "proj") => {
      if (chartMetric === "users") return mode === "base" ? pt.baseUsers : pt.projUsers;
      if (chartMetric === "mrr") return mode === "base" ? pt.baseMrr : pt.projMrr;
      return mode === "base" ? pt.baseVal : pt.projVal;
    };

    const allVals = series.flatMap((pt) => [getVal(pt, "base"), getVal(pt, "proj")]);
    const maxVal = Math.max(10, ...allVals);
    const minVal = Math.min(0, ...allVals);
    const span = Math.max(1, maxVal - minVal);

    const width = 640;
    const height = 200;
    const padY = 18;

    const toCoords = (mode: "base" | "proj") =>
      series.map((pt, idx) => {
        const x = Math.round((idx / (series.length - 1)) * width);
        const raw = getVal(pt, mode);
        const y = Math.round(height - padY - ((raw - minVal) / span) * (height - padY * 2));
        return { x, y, raw, label: pt.label };
      });

    const baseCoords = toCoords("base");
    const projCoords = toCoords("proj");

    const basePath = baseCoords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x} ${c.y}`).join(" ");
    const projPath = projCoords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x} ${c.y}`).join(" ");
    const projArea = `${projPath} L${width} ${height} L0 ${height} Z`;

    return { basePath, projPath, projArea, maxVal, baseCoords, projCoords };
  }, [analysis.monthlySeries, chartMetric]);

  const activeLeversCount = Object.values(currentProject.activeLevers || {}).filter(Boolean).length;

  if (!mounted) {
    return (
      <div
        suppressHydrationWarning
        className="min-h-screen bg-[#0B0A14] text-white flex flex-col items-center justify-center p-6 space-y-4"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5B3DF5] via-[#EC4899] to-[#FFB84D] p-[2px] animate-pulse">
          <div className="w-full h-full rounded-[14px] bg-[#0B0A14] flex items-center justify-center">
            <svg className="w-6 h-6 text-[#FFB84D]" viewBox="0 0 32 32" fill="none">
              <path
                d="M4 17h5l3-7 5 13 3-6h8"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <p className="text-sm font-mono text-white/60">Chargement de Pouls Studio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* BARRE SUPÉRIEURE DE L'APPLICATION */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text-2 transition hover:border-border-strong hover:text-text"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Accueil</span>
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#5B3DF5] via-[#EC4899] to-[#FFB84D] p-[1.5px]">
                <div className="w-full h-full rounded-[10px] bg-[#0B0A14] flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-[#FFB84D]" viewBox="0 0 32 32" fill="none">
                    <path
                      d="M4 17h5l3-7 5 13 3-6h8"
                      stroke="currentColor"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <span className="font-bold tracking-tight text-white flex items-center gap-1.5">
                Pouls Studio
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-full bg-[#5B3DF5]/30 text-[#D9D2FF] border border-[#5B3DF5]/40">
                  v2.0
                </span>
              </span>
            </div>

            {/* Sélecteur de produit SaaS */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="project-select" className="sr-only">
                Sélectionner un SaaS
              </label>
              <select
                id="project-select"
                value={currentProject.id}
                onChange={(e) => setActiveId(e.target.value)}
                className="rounded-xl border border-border-strong bg-surface-sunken px-3 py-1.5 text-xs font-semibold text-text focus:border-accent focus:outline-none sm:text-sm"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({fmtNum(p.users)} clients · {fmtEur(p.mrr)}/m)
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={addNewProject}
                title="Analyser un nouveau SaaS"
                className="inline-flex items-center gap-1 rounded-xl border border-border-strong bg-surface px-2.5 py-1.5 text-xs font-semibold text-text transition hover:border-accent hover:text-accent"
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Nouveau SaaS</span>
              </button>
            </div>
          </div>

          {/* Onglets de navigation du Studio */}
          <nav aria-label="Modules de l'outil" className="flex flex-wrap gap-1">
            {[
              { id: "overview", label: "Tableau de bord", icon: BarChart3 },
              { id: "analyzer", label: "Analyse & Utilisateurs", icon: Users },
              { id: "valuation", label: "Valorisation", icon: TrendingUp },
              { id: "uptime", label: "Disponibilité", icon: Activity },
              { id: "integrations", label: "API & Base de données", icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabKey)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition sm:text-sm ${
                    isActive
                      ? "bg-accent text-on-accent shadow-sm"
                      : "text-text-2 hover:bg-surface-sunken hover:text-text"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main id="contenu" className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6">
        {/* BANDEAU DE SYNTHÈSE DU SAAS ACTIF */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight">{currentProject.name}</h1>
              <span className="rounded-full bg-info-soft px-3 py-0.5 text-xs font-semibold text-info">
                {analysis.niche.label}
              </span>
              <span className="rounded-full bg-accent-soft px-3 py-0.5 text-xs font-semibold text-accent">
                Score santé : {analysis.healthScore}/100
              </span>
            </div>
            <p className="mt-1 text-xs text-text-2 sm:text-sm">
               Priorité détectée :{" "}
              <strong className="font-semibold text-text">{analysis.bottleneck.title}</strong> —{" "}
              {analysis.bottleneck.detail}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={exportReportJson}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border-strong bg-surface-sunken px-3.5 py-2 text-xs font-semibold text-text transition hover:border-accent"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Exporter JSON</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border-strong bg-surface-sunken px-3.5 py-2 text-xs font-semibold text-text transition hover:border-accent"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Imprimer / PDF</span>
            </button>
            {projects.length > 1 && (
              <button
                type="button"
                onClick={deleteCurrentProject}
                className="inline-flex items-center gap-1 rounded-xl border border-border px-2.5 py-2 text-xs font-medium text-error hover:bg-error-soft"
                title="Supprimer ce profil SaaS"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ===================================================================
            ONGLET 1 : TABLEAU DE BORD (VUE D'ENSEMBLE)
           =================================================================== */}
        {activeTab === "overview" && (
          <div className="grid gap-6">
            {/* 6 KPIs Principaux */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
              <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
                  MRR actuel
                </p>
                <p className="tnum mt-1 text-2xl font-bold text-text">
                  {fmtEur(currentProject.mrr)}
                </p>
                <p className="tnum mt-1 text-xs font-semibold text-success">
                  ARR : {fmtEur(analysis.arr)}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
                  Clients payants
                </p>
                <p className="tnum mt-1 text-2xl font-bold text-text">
                  {fmtNum(analysis.users)}
                </p>
                <p className="tnum mt-1 text-xs text-text-2">
                  +{fmtNum(analysis.freeUsers)} gratuits ({fmtNum(analysis.convRate)} % conv.)
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
                  ARPU &amp; LTV nette
                </p>
                <p className="tnum mt-1 text-2xl font-bold text-text">
                  {analysis.users > 0 ? fmtEur(Math.round(analysis.arpu)) : "—"}
                </p>
                <p className="tnum mt-1 text-xs text-text-2">
                  LTV : {analysis.users > 0 ? fmtEur(Math.round(analysis.ltv)) : "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
                  Churn mensuel
                </p>
                <p className="tnum mt-1 text-2xl font-bold text-text">
                  {fmtNum(currentProject.churn)} %
                </p>
                <p className="tnum mt-1 text-xs text-text-2">
                  Repère niche : {fmtNum(analysis.niche.refChurn)} %
                </p>
              </div>

              <div className="rounded-2xl border border-accent/50 bg-accent-soft p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                  Valeur médiane
                </p>
                <p className="tnum mt-1 text-2xl font-bold text-accent">
                  {fmtEur(analysis.mid.value)}
                </p>
                <p className="tnum mt-1 text-xs font-medium text-text-2">
                  {fmtEur(analysis.low.value)} – {fmtEur(analysis.high.value)} (
                  {fmtMult(analysis.mid.multiple)})
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
                  Potentiel à 12 mois
                </p>
                <p className="tnum mt-1 text-2xl font-bold text-success">
                  {fmtNum(analysis.combined12m.users)} clients
                </p>
                <p className="tnum mt-1 text-xs font-semibold text-text-2">
                  MRR {fmtEur(analysis.combined12m.mrr)} · Val. {fmtEur(analysis.combined12m.valuation)}
                </p>
              </div>
            </div>

            {/* Graphique comparatif 12 mois + Résumé des leviers actifs */}
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm lg:col-span-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold">
                      Trajectoire sur 12 mois : Rythme actuel vs Actions activées
                    </h2>
                    <p className="text-xs text-text-2">
                      Visualisez l&apos;impact direct de vos leviers sur vos utilisateurs, votre MRR
                      et votre valorisation.
                    </p>
                  </div>

                  <div className="flex rounded-xl border border-border bg-surface-sunken p-1 text-xs font-semibold">
                    {[
                      { key: "users", label: "Utilisateurs payants" },
                      { key: "mrr", label: "MRR (€)" },
                      { key: "val", label: "Valorisation (€)" },
                    ].map((m) => (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setChartMetric(m.key as "users" | "mrr" | "val")}
                        className={`rounded-lg px-3 py-1.5 transition ${
                          chartMetric === m.key
                            ? "bg-surface text-accent shadow-sm"
                            : "text-text-2 hover:text-text"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <svg
                    className="h-52 w-full overflow-visible"
                    viewBox="0 0 640 200"
                    preserveAspectRatio="none"
                    aria-label="Graphique de projection sur 12 mois"
                  >
                    <defs>
                      <linearGradient id="studioProjGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line
                      x1="0"
                      y1="40"
                      x2="640"
                      y2="40"
                      stroke="var(--border)"
                      strokeDasharray="3 4"
                    />
                    <line
                      x1="0"
                      y1="100"
                      x2="640"
                      y2="100"
                      stroke="var(--border)"
                      strokeDasharray="3 4"
                    />
                    <line
                      x1="0"
                      y1="160"
                      x2="640"
                      y2="160"
                      stroke="var(--border)"
                      strokeDasharray="3 4"
                    />

                    {/* Aire et courbe projetée (avec leviers) */}
                    <path d={chartPoints.projArea} fill="url(#studioProjGrad)" />
                    <path
                      d={chartPoints.projPath}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Courbe de base (sans levier additionnel) */}
                    <path
                      d={chartPoints.basePath}
                      fill="none"
                      stroke="var(--text-2)"
                      strokeWidth="2"
                      strokeDasharray="5 5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <div className="mt-2 flex justify-between text-[11px] font-medium text-text-2">
                    {analysis.monthlySeries
                      .filter((_, i) => i % 2 === 0)
                      .map((pt) => (
                        <span key={pt.month}>{pt.label}</span>
                      ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4 text-xs">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="inline-flex items-center gap-2 font-semibold text-accent">
                        <span className="h-2.5 w-2.5 rounded-full bg-accent" /> Avec vos{" "}
                        {activeLeversCount} action{activeLeversCount > 1 ? "s" : ""} :{" "}
                        {chartMetric === "users"
                          ? `${fmtNum(analysis.combined12m.users)} clients`
                          : chartMetric === "mrr"
                          ? fmtEur(analysis.combined12m.mrr)
                          : fmtEur(analysis.combined12m.valuation)}
                      </span>
                      <span className="inline-flex items-center gap-2 text-text-2">
                        <span className="h-0.5 w-4 border-t-2 border-dashed border-text-2" /> Sans
                        action supplémentaire :{" "}
                        {chartMetric === "users"
                          ? `${fmtNum(analysis.baseline12m.users)} clients`
                          : chartMetric === "mrr"
                          ? fmtEur(analysis.baseline12m.mrr)
                          : fmtEur(analysis.baseline12m.valuation)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab("analyzer")}
                      className="font-semibold text-accent hover:underline"
                    >
                      Modifier les paramètres &amp; leviers →
                    </button>
                  </div>
                </div>
              </div>

              {/* État Uptime & Accès rapide aux leviers */}
              <div className="flex flex-col gap-6 lg:col-span-4">
                <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold">Surveillance de disponibilité</h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab("uptime")}
                      className="text-xs font-semibold text-accent hover:underline"
                    >
                      Gérer ({currentProject.endpoints.length})
                    </button>
                  </div>

                  <div className="mt-4 grid gap-3">
                    {currentProject.endpoints.map((ep) => (
                      <div
                        key={ep.id}
                        className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface-sunken p-3 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 font-semibold text-text">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                ep.up ? "bg-success" : "bg-error"
                              }`}
                            />
                            <span className="truncate">{ep.label}</span>
                          </p>
                          <p className="truncate text-[11px] text-text-2">{ep.url}</p>
                        </div>

                        <div className=" flex shrink-0 items-center gap-2">
                          {ep.latencyMs !== null && (
                            <span className="tnum rounded-md bg-surface px-2 py-0.5 font-mono text-[11px] font-semibold">
                              {ep.latencyMs} ms
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => checkEndpoint(ep)}
                            disabled={checkingId === ep.id}
                            className="rounded-lg border border-border-strong bg-surface px-2.5 py-1 font-semibold text-text hover:border-accent"
                          >
                            {checkingId === ep.id ? "Test…" : "Tester"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                  <h3 className="text-base font-bold">
                    Gains potentiels d&apos;utilisateurs (12 mois)
                  </h3>
                  <p className="mt-1 text-xs text-text-2">
                    Aperçu des actions les plus rentables pour {currentProject.name} :
                  </p>
                  <ul className="mt-3 grid gap-2 text-xs">
                    {LEVER_KEYS.slice(0, 4).map((k) => {
                      const lv = analysis.levers[k];
                      return (
                        <li
                          key={k}
                          className="flex items-center justify-between rounded-xl border border-border bg-surface-sunken px-3 py-2"
                        >
                          <span className="font-medium text-text">{lv.title}</span>
                          <span className="tnum font-bold text-accent">
                            {lv.gainUsers > 0
                              ? `+${fmtNum(lv.gainUsers)} clients`
                              : `+${fmtEur(lv.gainMrr)}/m`}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            ONGLET 2 : ANALYSE 360° NICHE, UTILISATEURS & LEVIERS
           =================================================================== */}
        {activeTab === "analyzer" && (
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Formulaire complet des données du SaaS */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm lg:col-span-5">
              <h2 className="text-lg font-bold">Profil complet de votre SaaS</h2>
              <p className="mt-1 text-xs text-text-2">
                Modifiez n&apos;importe quelle donnée : l&apos;analyse de niche, l&apos;entonnoir
                d&apos;utilisateurs et les projections se recalculent instantanément.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-text">
                    Nom du SaaS
                  </label>
                  <input
                    type="text"
                    value={currentProject.name}
                    onChange={(e) => updateProject({ name: e.target.value })}
                    className="w-full rounded-xl border border-border-strong bg-surface-sunken px-3.5 py-2 text-sm text-text"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-text">
                    Niche / Secteur du SaaS
                  </label>
                  <select
                    value={currentProject.niche}
                    onChange={(e) => updateProject({ niche: e.target.value as NicheKey })}
                    className="w-full rounded-xl border border-border-strong bg-surface-sunken px-3.5 py-2.5 text-sm font-medium text-text"
                  >
                    {Object.values(VALUATION_CONFIG.niches).map((n) => (
                      <option key={n.key} value={n.key}>
                        {n.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[11px] text-text-2">{analysis.niche.description}</p>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-text">
                    Visiteurs mensuels (site)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={currentProject.visitors ?? 3000}
                    onChange={(e) =>
                      updateProject({ visitors: Math.max(0, Number(e.target.value) || 0) })
                    }
                    className="tnum w-full rounded-xl border border-border-strong bg-surface-sunken px-3.5 py-2 text-sm text-text"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-text">
                    Inscrits gratuits / essais
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={currentProject.freeUsers}
                    onChange={(e) =>
                      updateProject({ freeUsers: Math.max(0, Number(e.target.value) || 0) })
                    }
                    className="tnum w-full rounded-xl border border-border-strong bg-surface-sunken px-3.5 py-2 text-sm text-text"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-text">
                    Clients payants actifs
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={currentProject.users}
                    onChange={(e) =>
                      updateProject({ users: Math.max(0, Number(e.target.value) || 0) })
                    }
                    className="tnum w-full rounded-xl border border-border-strong bg-surface-sunken px-3.5 py-2 text-sm text-text"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-text">
                    MRR actuel (€ / mois)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={currentProject.mrr}
                    onChange={(e) =>
                      updateProject({ mrr: Math.max(0, Number(e.target.value) || 0) })
                    }
                    className="tnum w-full rounded-xl border border-border-strong bg-surface-sunken px-3.5 py-2 text-sm text-text"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-text">
                    Croissance mensuelle (%)
                  </label>
                  <input
                    type="number"
                    min={-50}
                    max={100}
                    step={0.5}
                    value={currentProject.growth}
                    onChange={(e) => updateProject({ growth: Number(e.target.value) || 0 })}
                    className="tnum w-full rounded-xl border border-border-strong bg-surface-sunken px-3.5 py-2 text-sm text-text"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-text">
                    Churn mensuel (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    value={currentProject.churn}
                    onChange={(e) =>
                      updateProject({ churn: Math.max(0, Number(e.target.value) || 0) })
                    }
                    className="tnum w-full rounded-xl border border-border-strong bg-surface-sunken px-3.5 py-2 text-sm text-text"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-text">
                    Marge nette (%)
                  </label>
                  <input
                    type="number"
                    min={-100}
                    max={100}
                    step={1}
                    value={currentProject.margin}
                    onChange={(e) => updateProject({ margin: Number(e.target.value) || 0 })}
                    className="tnum w-full rounded-xl border border-border-strong bg-surface-sunken px-3.5 py-2 text-sm text-text"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-text">
                    Ancienneté (mois)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={600}
                    step={1}
                    value={currentProject.age}
                    onChange={(e) =>
                      updateProject({ age: Math.max(0, Number(e.target.value) || 0) })
                    }
                    className="tnum w-full rounded-xl border border-border-strong bg-surface-sunken px-3.5 py-2 text-sm text-text"
                  />
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-border bg-surface-sunken p-4 text-xs">
                <p className="font-bold text-text">
                  Canaux d&apos;acquisition recommandés pour {analysis.niche.shortLabel} :
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {analysis.niche.typicalChannels.map((ch) => (
                    <span
                      key={ch}
                      className="rounded-lg border border-border bg-surface px-2.5 py-1 font-medium text-text-2"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Entonnoir d'utilisateurs + Simulateur des 6 leviers d'action */}
            <div className="flex flex-col gap-6 lg:col-span-7">
              {/* Entonnoir complet */}
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="inline-flex items-center gap-2 text-base font-bold">
                    <Filter className="h-4 w-4 text-accent" />
                    <span>
                      Entonnoir d&apos;utilisateurs vs Repères {analysis.niche.shortLabel}
                    </span>
                  </h3>
                  <span className="text-xs text-text-2">
                    Total base inscrite : {fmtNum(analysis.totalUsers)} utilisateurs
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-4">
                  <div className="rounded-xl border border-border bg-surface-sunken p-3.5">
                    <p className="text-[11px] font-semibold uppercase text-text-2">
                      1. Trafic mensuel
                    </p>
                    <p className="tnum mt-1 text-xl font-bold">{fmtNum(analysis.visitors)}</p>
                    <p className="mt-1 text-[11px] text-text-2">
                      Cible inscrit : {analysis.niche.refVisitorToSignup} %
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-surface-sunken p-3.5">
                    <p className="text-[11px] font-semibold uppercase text-text-2">
                      2. Gratuits / Essais
                    </p>
                    <p className="tnum mt-1 text-xl font-bold">{fmtNum(analysis.freeUsers)}</p>
                    <p className="mt-1 text-[11px] text-text-2">
                      Conv. actuelle : {fmtNum(analysis.convRate)} % (cible{" "}
                      {analysis.niche.targetConv} %)
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-surface-sunken p-3.5">
                    <p className="text-[11px] font-semibold uppercase text-text-2">
                      3. Clients payants
                    </p>
                    <p className="tnum mt-1 text-xl font-bold text-accent">
                      {fmtNum(analysis.users)}
                    </p>
                    <p className="mt-1 text-[11px] text-text-2">
                      ARPU : {fmtEur(Math.round(analysis.arpu))} (repère{" "}
                      {fmtEur(analysis.niche.refArpu)})
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-surface-sunken p-3.5">
                    <p className="text-[11px] font-semibold uppercase text-text-2">
                      4. Projeté à 12 mois
                    </p>
                    <p className="tnum mt-1 text-xl font-bold text-success">
                      {fmtNum(analysis.combined12m.users)}
                    </p>
                    <p className="mt-1 text-[11px] text-text-2">
                      Soit +
                      {fmtNum(Math.max(0, analysis.combined12m.users - analysis.users))} clients
                      payants
                    </p>
                  </div>
                </div>
              </div>

              {/* Les 6 leviers d'action détaillés */}
              <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-base font-bold">
                    Simulateur d&apos;actions : combien d&apos;utilisateurs et de valeur
                    gagnez-vous si vous faites telle ou telle chose ?
                  </h3>
                  <p className="mt-1 text-xs text-text-2">
                    Cochez les actions que vous souhaitez mettre en place sur les 12 prochains
                    mois pour voir leur impact individuel et cumulé.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {LEVER_KEYS.map((key) => {
                    const lv = analysis.levers[key];
                    const isPressed = !!currentProject.activeLevers?.[key];
                    return (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={isPressed}
                        onClick={() => toggleLever(key)}
                        className={`flex flex-col justify-between rounded-xl border p-4 text-left transition ${
                          isPressed
                            ? "border-accent bg-accent-soft shadow-sm"
                            : "border-border-strong bg-surface-sunken hover:border-accent/60"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-text">{lv.title}</span>
                            <span
                              className={`inline-grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                                isPressed
                                  ? "border-accent bg-accent text-on-accent"
                                  : "border-border-strong bg-surface text-transparent"
                              }`}
                            >
                              <Check className="h-3.5 w-3.5" />
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs leading-relaxed text-text-2">
                            {lv.actionPlan}
                          </p>
                        </div>

                        <div className="mt-3 border-t border-border/60 pt-2.5">
                          <p className="text-[11px] font-medium text-text-2">
                            {lv.targetMetricLabel}
                          </p>
                          <div className="tnum mt-1 flex flex-wrap gap-2 text-xs font-bold text-accent">
                            {lv.gainUsers > 0 && <span>+{fmtNum(lv.gainUsers)} clients</span>}
                            {lv.gainFreeUsers > 0 && (
                              <span>+{fmtNum(lv.gainFreeUsers)} inscrits</span>
                            )}
                            <span>+{fmtEur(lv.gainMrr)}/mois</span>
                            <span>+{fmtEur(lv.gainVal)} valeur</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Tableau comparatif M0 -> M+12 */}
                <div className="mt-6 overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border bg-surface-sunken text-[11px] uppercase text-text-2">
                      <tr>
                        <th className="px-3 py-2.5">Horizon</th>
                        <th className="px-3 py-2.5">Clients (sans action)</th>
                        <th className="px-3 py-2.5 text-accent">Clients (avec actions)</th>
                        <th className="px-3 py-2.5">MRR projeté</th>
                        <th className="px-3 py-2.5">Valeur médiane</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border tnum">
                      {[0, 3, 6, 9, 12].map((mIdx) => {
                        const row = analysis.monthlySeries[mIdx];
                        return (
                          <tr key={mIdx} className="hover:bg-surface-sunken/50">
                            <td className="px-3 py-2 font-semibold">{row.label}</td>
                            <td className="px-3 py-2 text-text-2">{fmtNum(row.baseUsers)}</td>
                            <td className="px-3 py-2 font-bold text-accent">
                              {fmtNum(row.projUsers)}
                            </td>
                            <td className="px-3 py-2 font-semibold">{fmtEur(row.projMrr)}</td>
                            <td className="px-3 py-2 font-semibold">{fmtEur(row.projVal)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            ONGLET 3 : VALORISATION & DOSSIER CESSION
           =================================================================== */}
        {activeTab === "valuation" && (
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm lg:col-span-7">
              <h2 className="text-lg font-bold">
                Estimation de la valeur de revente de {currentProject.name}
              </h2>
              <p className="mt-1 text-xs text-text-2">
                Calcul transparent basé sur l&apos;ARR ({fmtEur(analysis.arr)}) et un multiple
                ajusté selon 6 critères objectifs.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-surface-sunken p-4">
                  <p className="text-xs font-semibold uppercase text-text-2">Fourchette basse</p>
                  <p className="tnum mt-1 text-2xl font-bold">{fmtEur(analysis.low.value)}</p>
                  <p className="tnum text-xs text-text-2">{fmtMult(analysis.low.multiple)} ARR</p>
                </div>

                <div className="rounded-2xl border-2 border-accent bg-accent-soft p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase text-accent">Valeur médiane</p>
                  <p className="tnum mt-1 text-3xl font-bold text-accent">
                    {fmtEur(analysis.mid.value)}
                  </p>
                  <p className="tnum text-xs text-text-2">{fmtMult(analysis.mid.multiple)} ARR</p>
                </div>

                <div className="rounded-2xl border border-border bg-surface-sunken p-4">
                  <p className="text-xs font-semibold uppercase text-text-2">Fourchette haute</p>
                  <p className="tnum mt-1 text-2xl font-bold">{fmtEur(analysis.high.value)}</p>
                  <p className="tnum text-xs text-text-2">{fmtMult(analysis.high.multiple)} ARR</p>
                </div>
              </div>

              <h3 className="mt-8 text-sm font-bold uppercase tracking-wider text-text-2">
                Décomposition ligne par ligne du multiple d&apos;ARR
              </h3>

              <div className="mt-3 divide-y divide-border rounded-xl border border-border">
                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span>Multiple de base SaaS</span>
                  <span className="tnum font-mono font-bold">{fmtMult(analysis.base)}</span>
                </div>
                {analysis.adjustments.map((adj) => (
                  <div
                    key={adj.key}
                    className="flex items-center justify-between px-4 py-3 text-sm"
                  >
                    <span>Ajustement {adj.label}</span>
                    <span
                      className={`tnum font-mono font-bold ${
                        adj.value > 0
                          ? "text-success"
                          : adj.value < 0
                          ? "text-error"
                          : "text-text-2"
                      }`}
                    >
                      {fmtSigned(adj.value)}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between bg-surface-sunken px-4 py-3 text-sm font-bold">
                  <span>Multiple médian retenu (borné entre 1,5× et 5,0×)</span>
                  <span className="tnum font-mono text-accent">
                    {fmtMult(analysis.mid.multiple)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-info-soft p-4 text-xs font-medium text-text">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" />
                <span>
                  Estimation indicative, non contractuelle, ne constitue pas un conseil financier.
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm lg:col-span-5">
              <h3 className="text-base font-bold">
                Ce qui augmentera le plus votre prix de vente d&apos;ici 12 mois
              </h3>
              <p className="mt-1 text-xs text-text-2">
                Comparaison entre votre valorisation actuelle et votre valorisation projetée avec
                vos actions :
              </p>

              <div className="mt-5 rounded-xl border border-border bg-surface-sunken p-4">
                <div className="flex justify-between text-xs text-text-2">
                  <span>Valeur médiane aujourd&apos;hui</span>
                  <span className="tnum font-bold text-text">{fmtEur(analysis.mid.value)}</span>
                </div>
                <div className="mt-2 flex justify-between text-xs text-text-2">
                  <span>Valeur médiane à 12 mois (avec actions)</span>
                  <span className="tnum font-bold text-accent">
                    {fmtEur(analysis.combined12m.valuation)}
                  </span>
                </div>
                <div className="mt-3 border-t border-border pt-3 flex justify-between text-sm font-bold">
                  <span>Création de valeur potentielle</span>
                  <span className="tnum text-success">
                    +{fmtEur(Math.max(0, analysis.combined12m.valuation - analysis.mid.value))}
                  </span>
                </div>
              </div>

              <h4 className="mt-6 text-xs font-bold uppercase tracking-wider text-text-2">
                Points vérifiés par un acquéreur ({analysis.niche.shortLabel})
              </h4>
              <ul className="mt-3 grid gap-2.5 text-xs text-text-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>
                    <strong>Concentration client :</strong> {analysis.userTier.label} (
                    {fmtNum(analysis.users)} clients payants actifs).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>
                    <strong>Rétention comparée à la niche :</strong> votre churn est de{" "}
                    {fmtNum(currentProject.churn)} % pour une référence de{" "}
                    {fmtNum(analysis.niche.refChurn)} %.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>
                    <strong>Réserve de croissance interne :</strong> {fmtNum(analysis.freeUsers)}{" "}
                    inscrits gratuits/essais déjà présents dans votre base.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* ===================================================================
            ONGLET 4 : SURVEILLANCE UPTIME & ALERTES
           =================================================================== */}
        {activeTab === "uptime" && (
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm lg:col-span-7">
              <h2 className="text-lg font-bold">
                Surveillance de disponibilité en direct (HTTP réel)
              </h2>
              <p className="mt-1 text-xs text-text-2">
                Cliquez sur « Tester maintenant » pour effectuer une vraie vérification HTTP depuis
                le serveur Next.js et mesurer le temps de réponse.
              </p>

              <div className="mt-5 grid gap-3">
                {currentProject.endpoints.map((ep) => (
                  <div
                    key={ep.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface-sunken p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            ep.up ? "bg-success" : "bg-error"
                          }`}
                        />
                        <strong className="text-sm font-bold">{ep.label}</strong>
                        {ep.status !== null && (
                          <span className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-xs font-semibold">
                            HTTP {ep.status} · {ep.statusText}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-text-2">
                        {ep.url}{" "}
                        {ep.lastCheckedAt && <span>· Dernier test : {ep.lastCheckedAt}</span>}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {ep.latencyMs !== null && (
                        <span className="tnum rounded-lg bg-accent-soft px-2.5 py-1 font-mono text-xs font-bold text-accent">
                          {ep.latencyMs} ms
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => checkEndpoint(ep)}
                        disabled={checkingId === ep.id}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3.5 py-2 text-xs font-semibold text-on-accent transition hover:bg-accent-hover disabled:opacity-60"
                      >
                        <RefreshCw
                          className={`h-3.5 w-3.5 ${checkingId === ep.id ? "animate-spin" : ""}`}
                        />
                        <span>
                          {checkingId === ep.id ? "Vérification…" : "Tester maintenant"}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleAddEndpoint}
                className="mt-6 border-t border-border pt-5"
              >
                <h3 className="text-sm font-bold">Ajouter une URL à surveiller</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-12">
                  <input
                    type="text"
                    placeholder="Nom (ex. API Production)"
                    value={newEndpointLabel}
                    onChange={(e) => setNewEndpointLabel(e.target.value)}
                    className="rounded-xl border border-border-strong bg-surface-sunken px-3.5 py-2 text-sm sm:col-span-4"
                  />
                  <input
                    type="url"
                    placeholder="https://api.votre-saas.com/health"
                    value={newEndpointUrl}
                    onChange={(e) => setNewEndpointUrl(e.target.value)}
                    required
                    className="rounded-xl border border-border-strong bg-surface-sunken px-3.5 py-2 text-sm sm:col-span-5"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-on-accent hover:bg-accent-hover sm:col-span-3"
                  >
                    + Ajouter l&apos;URL
                  </button>
                </div>
              </form>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm lg:col-span-5">
              <h3 className="text-base font-bold">Canaux d&apos;alerte</h3>
              <p className="mt-1 text-xs text-text-2">
                Recevez une notification dès qu&apos;une URL renvoie une erreur ou dépasse le délai.
              </p>

              <div className="mt-4 grid gap-4">
                <div className="rounded-xl border border-border bg-surface-sunken p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">✉️ Alertes par Email</span>
                    <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">
                      Actif
                    </span>
                  </div>
                  <label className="mt-3 block text-xs text-text-2">
                    Adresse de réception des alertes
                  </label>
                  <input
                    type="email"
                    value={currentProject.alertEmail}
                    onChange={(e) => updateProject({ alertEmail: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border-strong bg-surface px-3 py-2 text-sm"
                  />
                </div>

                <div className="rounded-xl border border-border bg-surface-sunken p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">💬 Alertes WhatsApp</span>
                    <span className="rounded-full bg-warning-soft px-2.5 py-0.5 text-xs font-semibold text-warning">
                      Bientôt · Offre Pro
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-text-2">
                    Les variables <code>WHATSAPP_ACCESS_TOKEN</code> et{" "}
                    <code>WHATSAPP_PHONE_NUMBER_ID</code> sont déjà prévues dans{" "}
                    <code>.env.example</code> pour le branchement de l&apos;API WhatsApp Cloud.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            ONGLET 5 : CONNEXIONS API & BASE DE DONNÉES
           =================================================================== */}
        {activeTab === "integrations" && (
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Connecteur Stripe Lecture Seule */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm lg:col-span-6">
              <div className="flex items-center gap-2.5">
                <span className="inline-grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
                  <KeyRound className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold">Connecteur Stripe (Lecture seule)</h2>
                  <p className="text-xs text-text-2">
                    Route API active : <code>POST /api/stripe/sync</code>
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-text-2">
                Saisissez une clé restreinte Stripe en lecture seule (<code>rk_test_...</code> ou{" "}
                <code>rk_live_...</code> avec permission <em>Subscriptions : Read</em>) pour
                calculer automatiquement votre MRR réel et votre nombre de clients actifs.
              </p>

              <form onSubmit={handleStripeSync} className="mt-4 grid gap-3">
                <label htmlFor="stripe-rk" className="text-xs font-semibold">
                  Clé restreinte Stripe (Lecture seule)
                </label>
                <input
                  id="stripe-rk"
                  type="password"
                  placeholder="rk_test_..."
                  value={stripeKey}
                  onChange={(e) => setStripeKey(e.target.value)}
                  className="w-full rounded-xl border border-border-strong bg-surface-sunken px-3.5 py-2.5 font-mono text-sm"
                />
                <button
                  type="submit"
                  disabled={stripeStatus.state === "loading"}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent hover:bg-accent-hover disabled:opacity-60"
                >
                  {stripeStatus.state === "loading"
                    ? "Synchronisation…"
                    : "Synchroniser MRR & Clients depuis Stripe"}
                </button>
              </form>

              {stripeStatus.message && (
                <p
                  className={`mt-3 rounded-xl p-3 text-xs font-medium ${
                    stripeStatus.state === "error"
                      ? "bg-error-soft text-error"
                      : stripeStatus.state === "success"
                      ? "bg-accent-soft text-accent"
                      : "bg-surface-sunken text-text-2"
                  }`}
                >
                  {stripeStatus.message}
                </p>
              )}
            </div>

            {/* Architecture Base de données & API prête à brancher */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm lg:col-span-6">
              <div className="flex items-center gap-2.5">
                <span className="inline-grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Database className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold">
                    Base de données &amp; Endpoints prêts à brancher
                  </h2>
                  <p className="text-xs text-text-2">
                    Architecture préparée pour notre prochaine étape ensemble
                  </p>
                </div>
              </div>

              <ul className="mt-4 grid gap-3 text-xs">
                <li className="rounded-xl border border-border bg-surface-sunken p-3.5">
                  <strong className="block font-bold text-text">
                    1. Schéma Prisma / PostgreSQL (<code>prisma/schema.prisma</code>)
                  </strong>
                  <span className="text-text-2">
                    Modèles <code>User</code>, <code>SaasProduct</code>,{" "}
                    <code>MetricSnapshot</code>, <code>UptimeMonitor</code> et{" "}
                    <code>WaitlistEntry</code> prêts à être migrés sur Supabase, Neon ou PostgreSQL.
                  </span>
                </li>

                <li className="rounded-xl border border-border bg-surface-sunken p-3.5">
                  <strong className="block font-bold text-text">
                    2. API Liste d&apos;attente (<code>/api/waitlist</code>)
                  </strong>
                  <span className="text-text-2">
                    Enregistre les emails localement dans <code>data/waitlist.json</code> et les
                    transfère automatiquement vers Formspree/Brevo dès que{" "}
                    <code>WAITLIST_FORM_ENDPOINT</code> est renseigné.
                  </span>
                </li>

                <li className="rounded-xl border border-border bg-surface-sunken p-3.5">
                  <strong className="block font-bold text-text">
                    3. API Surveillance HTTP (<code>/api/uptime/check</code>)
                  </strong>
                  <span className="text-text-2">
                    Vérifie en direct le statut HTTP et la latence en millisecondes des URLs
                    configurées.
                  </span>
                </li>

                <li className="rounded-xl border border-border bg-surface-sunken p-3.5">
                  <strong className="block font-bold text-text">
                    4. Variables d&apos;environnement (<code>.env.example</code>)
                  </strong>
                  <span className="text-text-2">
                    Toutes les clés (<code>DATABASE_URL</code>, <code>STRIPE_RESTRICTED_KEY</code>,{" "}
                    <code>RESEND_API_KEY</code>, <code>WHATSAPP_ACCESS_TOKEN</code>) sont
                    documentées.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

