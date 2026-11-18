"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CalculatorSection } from "@/components/CalculatorSection";
import { WaitlistForm } from "@/components/WaitlistForm";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Clock,
  Eye,
  Layers,
  Lock,
  Menu,
  ShieldCheck,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "Mes données Stripe sont-elles en sécurité ?",
    a: "Pouls utilise un accès en lecture seule : il peut lire vos abonnements et paiements pour calculer vos métriques et analyser vos cohortes d'utilisateurs, mais ne peut rien créer, rembourser ni modifier. Les jetons sont chiffrés avant stockage et vous pouvez révoquer l'accès à tout moment depuis Stripe.",
  },
  {
    q: "L'estimation de valeur est-elle fiable ?",
    a: "Elle est indicative. Elle repose sur un multiple de l'ARR ajusté selon votre croissance, votre churn, votre marge et l'ancienneté du produit. C'est pour cette raison que nous affichons une fourchette, jamais un chiffre unique. Ce n'est pas un conseil financier : pour une transaction, faites-vous accompagner par un professionnel.",
  },
  {
    q: "Quand le produit sera-t-il disponible ?",
    a: "Le studio d'analyse complet et le vérificateur de disponibilité sont déjà accessibles en prévisualisation sur cette application (/app). Les inscrits à la liste d'attente seront prévenus en priorité pour l'ouverture des comptes persistants et des alertes automatisées.",
  },
  {
    q: "Quels moyens de paiement sont compatibles ?",
    a: "Au lancement, uniquement Stripe (via clé restreinte en lecture seule). D'autres plateformes de paiement (Lemon Squeezy, Paddle) sont prévues ensuite.",
  },
  {
    q: "Que se passe-t-il après mon inscription ?",
    a: "Vous recevrez quelques emails, peu nombreux : l'avancement du produit, puis l'invitation à l'ouverture. Chaque email contient un lien de désinscription. Votre adresse n'est ni revendue ni partagée.",
  },
  {
    q: "Faut-il des compétences techniques ?",
    a: "Non. Connecter Stripe et ajouter une URL à surveiller se fait en quelques clics, sans code ni installation sur votre serveur.",
  },
  {
    q: "Les alertes WhatsApp seront-elles disponibles dès le lancement ?",
    a: "Non, elles arriveront peu après. Au lancement, les alertes sont envoyées par email. Les alertes WhatsApp sont prévues dans l'offre Pro.",
  },
  {
    q: "Puis-je supprimer mes données ?",
    a: "Oui. Vous pourrez demander l'export ou la suppression complète de vos données à tout moment, conformément au RGPD.",
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* ===================================================================
          1. BARRE DE NAVIGATION
         =================================================================== */}
      <header className="sticky top-0 z-50 h-16 border-b border-border/80 bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-8">
          <a
            href="#haut"
            className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight text-text"
            aria-label="Pouls, retour en haut de page"
          >
            <svg className="h-7 w-7" viewBox="0 0 32 32" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="var(--accent)" />
              <path
                d="M5 17h5l3-7 5 13 3-6h6"
                fill="none"
                stroke="var(--on-accent)"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Pouls</span>
          </a>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-1 text-sm font-medium text-text-2">
              <li>
                <a
                  href="#fonctionnalites"
                  className="rounded-lg px-3 py-2 transition hover:bg-surface-sunken hover:text-text"
                >
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a
                  href="#pour-qui"
                  className="rounded-lg px-3 py-2 transition hover:bg-surface-sunken hover:text-text"
                >
                  Pour qui
                </a>
              </li>
              <li>
                <a
                  href="#calculateur"
                  className="rounded-lg px-3 py-2 transition hover:bg-surface-sunken hover:text-text"
                >
                  Calculateur
                </a>
              </li>
              <li>
                <a
                  href="#tarifs"
                  className="rounded-lg px-3 py-2 transition hover:bg-surface-sunken hover:text-text"
                >
                  Tarifs
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="rounded-lg px-3 py-2 transition hover:bg-surface-sunken hover:text-text"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/app"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-text transition hover:border-border-strong hover:bg-surface-sunken"
            >
              <Zap className="h-3.5 w-3.5 text-accent" />
              <span>Pouls Studio (/app)</span>
            </Link>
            <a
              href="#liste-attente"
              className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-on-accent shadow-sm transition hover:bg-accent-hover"
            >
              Rejoindre la liste d&apos;attente
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-text lg:hidden"
            aria-expanded={mobileMenuOpen}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-b border-border bg-bg px-4 py-4 lg:hidden">
            <ul className="flex flex-col gap-2 text-sm font-medium">
              <li>
                <a
                  href="#fonctionnalites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 hover:bg-surface-sunken"
                >
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a
                  href="#pour-qui"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 hover:bg-surface-sunken"
                >
                  Pour qui
                </a>
              </li>
              <li>
                <a
                  href="#calculateur"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 hover:bg-surface-sunken"
                >
                  Calculateur
                </a>
              </li>
              <li>
                <a
                  href="#tarifs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 hover:bg-surface-sunken"
                >
                  Tarifs
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 hover:bg-surface-sunken"
                >
                  FAQ
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/app"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-center text-sm font-semibold text-text"
                >
                  Ouvrir Pouls Studio (/app)
                </Link>
              </li>
              <li className="pt-1">
                <a
                  href="#liste-attente"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full rounded-xl bg-accent px-4 py-2.5 text-center text-sm font-semibold text-on-accent"
                >
                  Rejoindre la liste d&apos;attente
                </a>
              </li>
            </ul>
          </div>
        )}
      </header>

      <main id="contenu">
        {/* ===================================================================
            2. HERO — SACHEZ OÙ EN EST VOTRE SAAS
           =================================================================== */}
        <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28" id="haut">
          {/* Trame de fond subtile */}
          <div className="hero-grid absolute inset-0 pointer-events-none" />

          <div className="relative mx-auto max-w-[1200px] px-4 sm:px-8">
            <div className="mx-auto max-w-[820px] text-center">
              <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-2 mb-6 shadow-sm">
                <span className="pulse-dot" aria-hidden="true" />
                <span>Pré-lancement · liste d&apos;attente ouverte</span>
              </p>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-[-0.035em] text-text leading-[1.06] mb-6">
                Sachez où en est votre SaaS.{" "}
                <span className="text-accent font-extrabold not-italic">
                  Chaque matin, en un coup d&apos;œil.
                </span>
              </h1>

              <p className="mx-auto max-w-2xl text-base sm:text-lg text-text-2 leading-relaxed mb-8">
                Pouls se connecte à Stripe en lecture seule pour afficher vos métriques, surveiller
                la disponibilité de votre service et estimer ce que vaut votre produit.
              </p>

              <div className="mx-auto max-w-lg mb-4">
                <WaitlistForm
                  idPrefix="hero"
                  source="hero"
                  buttonLabel="Rejoindre la liste d'attente"
                />
              </div>

              <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-text-2 pt-2">
                <li className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-accent" />
                  <span>Gratuit, sans carte bancaire</span>
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-accent" />
                  <span>Désinscription en un clic</span>
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-accent" />
                  <span>Interface en français</span>
                </li>
              </ul>
            </div>

            {/* APERÇU DU TABLEAU DE BORD (MOCKUP 100% PUR CSS/SVG) */}
            <div className="mt-14 sm:mt-16 mx-auto max-w-4xl">
              <div className="flex items-center justify-end mb-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-0.5 text-xs text-text-2">
                  <Eye className="h-3 w-3 text-accent" />
                  <span>Aperçu · données d&apos;exemple</span>
                  <span className="ml-1 rounded bg-info-soft px-1.5 py-0.2 text-[10px] font-semibold text-info">
                    Exemple
                  </span>
                </span>
              </div>

              <div className="rounded-2xl border border-border-strong bg-surface shadow-lg overflow-hidden">
                {/* Barre supérieure de fenêtre */}
                <div className="flex items-center justify-between border-b border-border bg-surface-sunken px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
                    <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
                    <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
                  </div>
                  <span className="text-xs font-medium text-text-2">
                    Mon SaaS d&apos;exemple · 12 derniers mois
                  </span>
                  <div className="w-12 text-right">
                    <span className="rounded bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent">
                      Live
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-6">
                  {/* 4 KPIs de l'aperçu */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border border-border bg-surface-elevated p-3.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
                        MRR
                      </p>
                      <p className="tnum mt-1 text-2xl font-bold text-text">4 820 €</p>
                      <p className="tnum mt-1 text-xs font-semibold text-success">
                        ▲ +6,2 % ce mois
                      </p>
                    </div>

                    <div className="rounded-xl border border-border bg-surface-elevated p-3.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
                        Churn mensuel
                      </p>
                      <p className="tnum mt-1 text-2xl font-bold text-text">2,9 %</p>
                      <p className="tnum mt-1 text-xs font-semibold text-success">
                        ▼ −0,4 pt
                      </p>
                    </div>

                    <div className="rounded-xl border border-border bg-surface-elevated p-3.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-text-2">
                        Clients actifs
                      </p>
                      <p className="tnum mt-1 text-2xl font-bold text-text">212</p>
                      <p className="tnum mt-1 text-xs text-text-2">+14 nouveaux</p>
                    </div>

                    <div className="rounded-xl border border-accent/40 bg-accent-soft/30 p-3.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                        Valeur estimée
                      </p>
                      <p className="tnum mt-1 text-2xl font-bold text-accent">116–174 k€</p>
                      <p className="tnum mt-1 text-xs text-text-2">Médiane 145 k€ · 2,5× ARR</p>
                    </div>
                  </div>

                  {/* Split Preview : Évolution MRR & Surveillance */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Graphique MRR */}
                    <div className="rounded-xl border border-border bg-surface-sunken p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-text">Évolution du MRR</span>
                        <span className="tnum text-xs text-text-2 font-mono">
                          2 600 € → 4 820 €
                        </span>
                      </div>
                      <div className="relative h-28 w-full pt-2">
                        <svg
                          className="h-full w-full overflow-visible"
                          viewBox="0 0 594 170"
                          preserveAspectRatio="none"
                        >
                          <defs>
                            <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.32" />
                              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <line
                            x1="0"
                            y1="42"
                            x2="594"
                            y2="42"
                            stroke="var(--border)"
                            strokeDasharray="4 4"
                          />
                          <line
                            x1="0"
                            y1="85"
                            x2="594"
                            y2="85"
                            stroke="var(--border)"
                            strokeDasharray="4 4"
                          />
                          <line
                            x1="0"
                            y1="128"
                            x2="594"
                            y2="128"
                            stroke="var(--border)"
                            strokeDasharray="4 4"
                          />
                          <path
                            d="M0 149 L54 141 L108 133 L162 128 L216 114 L270 106 L324 98 L378 85 L432 71 L486 58 L540 44 L594 30 L594 170 L0 170 Z"
                            fill="url(#mrrGrad)"
                          />
                          <path
                            d="M0 149 L54 141 L108 133 L162 128 L216 114 L270 106 L324 98 L378 85 L432 71 L486 58 L540 44 L594 30"
                            fill="none"
                            stroke="var(--accent)"
                            strokeWidth="2.8"
                          />
                        </svg>
                      </div>
                      <div className="flex justify-between text-[10px] text-text-2 mt-2 pt-1 border-t border-border">
                        <span>nov.</span>
                        <span>févr.</span>
                        <span>mai</span>
                        <span>août</span>
                        <span>oct.</span>
                      </div>
                    </div>

                    {/* Uptime & Alertes */}
                    <div className="rounded-xl border border-border bg-surface-sunken p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-text">
                            <span className="pulse-dot" />
                            Service en ligne
                          </span>
                          <span className="text-xs text-text-2 font-mono">app.exemple.com</span>
                        </div>

                        {/* Barres d'Uptime */}
                        <div className="grid grid-cols-30 gap-1 my-3">
                          {Array.from({ length: 30 }).map((_, i) => (
                            <span
                              key={i}
                              className={`h-7 rounded-sm ${
                                i === 22 ? "bg-warning" : "bg-accent"
                              }`}
                              style={{ opacity: i === 22 ? 0.9 : 0.85 }}
                            />
                          ))}
                        </div>

                        <div className="flex justify-between text-[11px] text-text-2">
                          <span>Il y a 30 j</span>
                          <span className="font-bold text-accent font-mono tnum">99,94 %</span>
                          <span>Aujourd&apos;hui</span>
                        </div>
                      </div>

                      <div className="mt-4 rounded-lg border border-border bg-surface p-2.5 flex items-start gap-2.5 text-xs">
                        <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-text block font-semibold">
                            Exemple d&apos;alerte · 03:12
                          </strong>
                          <span className="text-text-2 text-[11px]">
                            api.exemple.com ne répond plus (HTTP 503). Email envoyé. Rétabli après
                            4 min.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            3. LE PROBLÈME
           =================================================================== */}
        <section className="border-y border-border bg-surface-sunken py-20 sm:py-28">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">
                Le problème
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-text">
                Trois onglets, deux tableurs, et toujours pas de réponse claire.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <p className="text-xs font-semibold text-text-2 uppercase tracking-wider mb-2">
                  01 — Chiffres éparpillés
                </p>
                <h3 className="text-lg font-bold text-text mb-2">
                  Vous reconstituez votre MRR à la main.
                </h3>
                <p className="text-sm text-text-2 leading-relaxed">
                  Les revenus sont dans Stripe, le churn dans un tableur que vous oubliez de mettre à
                  jour. Résultat : vous pilotez au ressenti.
                </p>
              </article>

              <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <p className="text-xs font-semibold text-text-2 uppercase tracking-wider mb-2">
                  02 — Pannes découvertes trop tard
                </p>
                <h3 className="text-lg font-bold text-text mb-2">
                  Vos clients voient la panne avant vous.
                </h3>
                <p className="text-sm text-text-2 leading-relaxed">
                  Vous apprenez que votre service est tombé par un email de client mécontent,
                  parfois plusieurs heures après.
                </p>
              </article>

              <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <p className="text-xs font-semibold text-text-2 uppercase tracking-wider mb-2">
                  03 — Valeur inconnue
                </p>
                <h3 className="text-lg font-bold text-text mb-2">
                  Vous ignorez ce que vaut votre produit.
                </h3>
                <p className="text-sm text-text-2 leading-relaxed">
                  Une offre de rachat arrive, ou l&apos;envie de vendre : impossible de savoir si le
                  prix évoqué est sérieux.
                </p>
              </article>
            </div>

            <p className="mt-10 text-center text-sm sm:text-base text-text-2">
              Pouls réunit les trois réponses sur un seul écran :{" "}
              <strong className="text-text font-semibold">
                combien vous gagnez, si votre service tient, et ce que vaut votre travail.
              </strong>
            </p>
          </div>
        </section>

        {/* ===================================================================
            4. FONCTIONNALITÉS
           =================================================================== */}
        <section className="py-20 sm:py-28" id="fonctionnalites">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">
                Fonctionnalités
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-text">
                Un seul tableau de bord, trois questions résolues.
              </h2>
              <p className="text-base text-text-2 mt-2">
                Pensé pour les fondateurs solo et les petites équipes : l&apos;essentiel, sans
                configuration interminable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">
                      Au lancement
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-text mb-2">
                    Vos métriques, calculées pour vous
                  </h3>
                  <p className="text-sm text-text-2 leading-relaxed mb-6">
                    MRR, ARR, nouveaux clients, churn, ARPU et LTV estimée, mis à jour
                    automatiquement depuis Stripe.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-surface-sunken p-3 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-text-2">ARR</span>
                    <span className="font-bold text-text tnum">57 840 €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-2">ARPU</span>
                    <span className="font-bold text-text tnum">22,74 €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-2">LTV estimée</span>
                    <span className="font-bold text-text tnum">784 €</span>
                  </div>
                </div>
              </article>

              {/* Feature 2 */}
              <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <Activity className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">
                      Au lancement
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-text mb-2">Surveillance et alertes</h3>
                  <p className="text-sm text-text-2 leading-relaxed mb-6">
                    Pouls vérifie votre URL à intervalle régulier et vous prévient dès que le service
                    ne répond plus.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-surface-sunken p-3 text-xs space-y-2">
                  <div className="flex justify-between text-text-2">
                    <span>30 jours</span>
                    <span className="font-bold text-accent font-mono">99,94 %</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent">
                      ✉️ Email
                    </span>
                    <span className="rounded-full bg-warning-soft px-2 py-0.5 text-[10px] font-semibold text-warning">
                      💬 WhatsApp · Bientôt
                    </span>
                  </div>
                </div>
              </article>

              {/* Feature 3 */}
              <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent">
                      Au lancement
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-text mb-2">
                    Une valeur en fourchette, expliquée
                  </h3>
                  <p className="text-sm text-text-2 leading-relaxed mb-6">
                    Jamais un chiffre unique : une estimation basse, médiane et haute, avec le
                    détail de chaque ajustement.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-surface-sunken p-3 text-xs font-mono space-y-2">
                  <div className="flex justify-between text-[11px] text-text-2">
                    <span>Basse (116k€)</span>
                    <span className="font-bold text-accent">Médiane (145k€)</span>
                    <span>Haute (174k€)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-border overflow-hidden flex">
                    <span className="w-1/3 bg-border-strong" />
                    <span className="w-1/3 bg-accent" />
                    <span className="w-1/3 bg-border-strong" />
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ===================================================================
            5. CALCULATEUR INTERACTIF (POULS ORIGINAL)
           =================================================================== */}
        <section className="border-y border-border bg-surface-sunken py-20 sm:py-28" id="calculateur">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
            <CalculatorSection />
          </div>
        </section>

        {/* ===================================================================
            6. POUR QUI ?
           =================================================================== */}
        <section className="py-20 sm:py-28" id="pour-qui">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">
                Pour qui ?
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-text">
                Conçu pour ceux qui construisent, vendent ou rachètent des SaaS.
              </h2>
              <p className="text-base text-text-2 mt-2">
                De 0 à 50 000 € de MRR, quand embaucher un analyste n&apos;a pas de sens.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <span className="text-3xl mb-3 block">🧑‍💻</span>
                <h3 className="text-base font-bold text-text">Indie hackers</h3>
                <p className="text-xs font-semibold text-accent font-mono mb-2">0 → 10 k€ MRR</p>
                <p className="text-xs text-text-2 leading-relaxed">
                  Vous codez, vendez et assurez le support. Pouls vous donne vos chiffres sans ouvrir
                  un tableur, et veille sur votre service pendant que vous dormez.
                </p>
              </article>

              <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <span className="text-3xl mb-3 block">👥</span>
                <h3 className="text-base font-bold text-text">Petites équipes SaaS</h3>
                <p className="text-xs font-semibold text-accent font-mono mb-2">10 → 50 k€ MRR</p>
                <p className="text-xs text-text-2 leading-relaxed">
                  Un tableau de bord commun pour suivre la croissance, le churn et la disponibilité,
                  sans payer trois outils différents.
                </p>
              </article>

              <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <span className="text-3xl mb-3 block">🧰</span>
                <h3 className="text-base font-bold text-text">Micro-agences</h3>
                <p className="text-xs font-semibold text-accent font-mono mb-2">Plusieurs produits</p>
                <p className="text-xs text-text-2 leading-relaxed">
                  Vous vendez plusieurs outils ? L&apos;offre Pro réunira vos produits dans un seul
                  espace, chacun avec ses métriques et sa surveillance.
                </p>
              </article>

              <article className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <span className="text-3xl mb-3 block">🤝</span>
                <h3 className="text-base font-bold text-text">Acheteurs &amp; revendeurs</h3>
                <p className="text-xs font-semibold text-accent font-mono mb-2">Rachat · Cession</p>
                <p className="text-xs text-text-2 leading-relaxed">
                  Avant de vendre ou d&apos;acheter, disposez d&apos;une première fourchette de valeur
                  argumentée, pour cadrer la discussion.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ===================================================================
            7. COMMENT ÇA MARCHE
           =================================================================== */}
        <section className="border-y border-border bg-surface-sunken py-20 sm:py-28">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">
                Comment ça marche
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-text">
                Opérationnel en trois étapes.
              </h2>
            </div>

            <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 list-none">
              <li className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-on-accent font-bold text-sm mb-4">
                  1
                </div>
                <h3 className="text-lg font-bold text-text mb-2">Connectez Stripe</h3>
                <p className="text-sm text-text-2 leading-relaxed mb-4">
                  Avec une clé en lecture seule : Pouls peut lire vos abonnements, jamais créer de
                  paiement ni modifier vos données.
                </p>
                <span className="inline-block rounded-md bg-surface-sunken border border-border px-2.5 py-1 text-xs text-text-2">
                  🔒 Lecture seule
                </span>
              </li>

              <li className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-on-accent font-bold text-sm mb-4">
                  2
                </div>
                <h3 className="text-lg font-bold text-text mb-2">Ajoutez votre URL</h3>
                <p className="text-sm text-text-2 leading-relaxed mb-4">
                  Indiquez l&apos;adresse à surveiller et l&apos;email à prévenir. Les alertes
                  partent dès qu&apos;une panne est détectée.
                </p>
                <div className="flex gap-2">
                  <span className="rounded-md bg-accent-soft px-2 py-0.5 text-xs text-accent">
                    Email
                  </span>
                  <span className="rounded-md bg-warning-soft px-2 py-0.5 text-xs text-warning">
                    WhatsApp · Bientôt
                  </span>
                </div>
              </li>

              <li className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-on-accent font-bold text-sm mb-4">
                  3
                </div>
                <h3 className="text-lg font-bold text-text mb-2">Lisez vos chiffres</h3>
                <p className="text-sm text-text-2 leading-relaxed mb-4">
                  Vos métriques, votre disponibilité et votre fourchette de valeur, réunies sur un
                  seul écran.
                </p>
                <span className="inline-block rounded-md bg-surface-sunken border border-border px-2.5 py-1 text-xs text-text-2">
                  📊 Un seul écran
                </span>
              </li>
            </ol>
          </div>
        </section>

        {/* ===================================================================
            8. ROADMAP
           =================================================================== */}
        <section className="py-20 sm:py-28" id="roadmap">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">Roadmap</p>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-text">
                Ce qui arrive, et quand.
              </h2>
              <p className="text-base text-text-2 mt-2">
                Une feuille de route publique, pour que vous sachiez exactement sur quoi compter.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border-2 border-accent bg-surface p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-text">Maintenant</h3>
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-on-accent">
                    MVP
                  </span>
                </div>
                <ul className="space-y-2.5 text-xs text-text-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-accent shrink-0" />
                    <span>Connexion Stripe en lecture seule</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-accent shrink-0" />
                    <span>Métriques : MRR, ARR, churn, ARPU, LTV estimée</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-accent shrink-0" />
                    <span>Surveillance de disponibilité avec alertes email</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-accent shrink-0" />
                    <span>Estimation de valeur en fourchette</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-text">Bientôt</h3>
                  <span className="rounded-full bg-warning-soft px-2.5 py-0.5 text-xs font-semibold text-warning">
                    Bientôt
                  </span>
                </div>
                <ul className="space-y-2.5 text-xs text-text-2">
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-text-2 shrink-0" />
                    <span>Alertes WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-text-2 shrink-0" />
                    <span>Autres moyens de paiement que Stripe</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-text-2 shrink-0" />
                    <span>Rapports mensuels par email</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-text">Plus tard</h3>
                  <span className="rounded-full bg-surface-sunken px-2.5 py-0.5 text-xs font-semibold text-text-2">
                    À l&apos;étude
                  </span>
                </div>
                <ul className="space-y-2.5 text-xs text-text-2">
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-text-2 shrink-0" />
                    <span>Analyse de niche assistée par IA</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-text-2 shrink-0" />
                    <span>Rapport PDF de valorisation complet</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-text-2 shrink-0" />
                    <span>Accès partagé pour acheteurs potentiels</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            9. SÉCURITÉ ET CONFIANCE
           =================================================================== */}
        <section className="border-y border-border bg-surface-sunken py-20 sm:py-28" id="securite">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">
                Sécurité et confiance
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-text">
                Vos données de revenus méritent de la prudence.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Eye className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text mb-1">Accès en lecture seule</h3>
                  <p className="text-xs text-text-2 leading-relaxed">
                    Pouls demande uniquement des droits de lecture sur Stripe. Il ne peut ni
                    encaisser, ni rembourser, ni modifier un abonnement.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text mb-1">Jetons chiffrés</h3>
                  <p className="text-xs text-text-2 leading-relaxed">
                    Les clés et jetons d&apos;accès sont chiffrés avant d&apos;être stockés, et
                    révocables à tout moment depuis votre compte Stripe.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text mb-1">Conformité RGPD</h3>
                  <p className="text-xs text-text-2 leading-relaxed">
                    Vos données ne sont jamais revendues. Export et suppression complète sur simple
                    demande.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            10. TARIFS
           =================================================================== */}
        <section className="py-20 sm:py-28" id="tarifs">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">
                Tarifs prévisionnels
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-text">
                Commencez gratuitement. Passez à Pro quand vous grandissez.
              </h2>
            </div>

            <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              <article className="rounded-2xl border border-border bg-surface p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-text mb-2">Gratuit</h3>
                  <p className="text-3xl font-extrabold font-mono text-text mb-2">
                    0 € <span className="text-sm font-normal text-text-2">/ mois</span>
                  </p>
                  <p className="text-xs text-text-2 mb-6">Pour démarrer et suivre un produit.</p>
                  <ul className="space-y-3 text-xs text-text-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-accent shrink-0" />
                      <span>1 produit connecté</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-accent shrink-0" />
                      <span>Métriques de base : MRR, ARR, churn, clients</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-accent shrink-0" />
                      <span>Interface et support en français</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8">
                  <a
                    href="#liste-attente"
                    className="block w-full rounded-xl border border-border-strong bg-surface py-3 text-center text-sm font-semibold text-text hover:bg-surface-sunken"
                  >
                    Rejoindre la liste d&apos;attente
                  </a>
                </div>
              </article>

              <article className="rounded-2xl border-2 border-accent bg-surface p-8 shadow-md flex flex-col justify-between relative">
                <div className="absolute -top-3 right-6 rounded-full bg-accent px-3 py-0.5 text-[10px] font-bold uppercase text-on-accent tracking-wider">
                  Tarif de lancement
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text mb-2">Pro</h3>
                  <p className="text-3xl font-extrabold font-mono text-accent mb-2">
                    ≈ 19 € <span className="text-sm font-normal text-text-2">/ mois</span>
                  </p>
                  <p className="text-xs text-text-2 mb-6">Montant à confirmer avant l&apos;ouverture.</p>
                  <ul className="space-y-3 text-xs text-text-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-accent shrink-0" />
                      <span>Plusieurs produits connectés</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-accent shrink-0" />
                      <span>Valorisation détaillée, ajustement par ajustement</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-accent shrink-0" />
                      <span>Alertes WhatsApp (Bientôt)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-accent shrink-0" />
                      <span>Rapports mensuels (Bientôt)</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8">
                  <a
                    href="#liste-attente"
                    className="block w-full rounded-xl bg-accent py-3 text-center text-sm font-semibold text-on-accent hover:bg-accent-hover shadow-sm"
                  >
                    Réserver le tarif de lancement
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ===================================================================
            11. FAQ
           =================================================================== */}
        <section className="border-y border-border bg-surface-sunken py-20 sm:py-28" id="faq">
          <div className="mx-auto max-w-[800px] px-4 sm:px-8">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">FAQ</p>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-text">
                Questions fréquentes
              </h2>
            </div>

            <div className="space-y-3">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-border bg-surface overflow-hidden shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm sm:text-base text-text hover:text-accent transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-text-2 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-accent" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-text-2 leading-relaxed border-t border-border pt-3">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================================================================
            12. APPEL À L'ACTION FINAL
           =================================================================== */}
        <section className="py-20 sm:py-28" id="liste-attente">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
            <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-surface p-8 sm:p-12 text-center shadow-md">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-text mb-3">
                Prenez le pouls de votre SaaS dès l&apos;ouverture.
              </h2>
              <p className="text-sm sm:text-base text-text-2 mb-8">
                Inscrivez-vous pour tester la première version en avant-première et bloquer le tarif
                de lancement.
              </p>

              <div className="mx-auto max-w-md">
                <WaitlistForm
                  idPrefix="final"
                  source="cta-final"
                  buttonLabel="Rejoindre la liste d'attente"
                />
              </div>

              <p className="mt-4 text-xs text-text-2">
                Gratuit, sans carte bancaire. Votre email sert uniquement à vous informer du
                lancement.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ===================================================================
          13. PIED DE PAGE
         =================================================================== */}
      <footer className="border-t border-border bg-surface py-12 text-xs text-text-2">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-border">
            <a
              href="#haut"
              className="inline-flex items-center gap-2 text-base font-bold text-text"
            >
              <svg className="h-6 w-6" viewBox="0 0 32 32" aria-hidden="true">
                <rect width="32" height="32" rx="8" fill="var(--accent)" />
                <path
                  d="M5 17h5l3-7 5 13 3-6h6"
                  fill="none"
                  stroke="var(--on-accent)"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Pouls</span>
            </a>
            <div className="flex items-center gap-6">
              <Link href="/app" className="hover:text-text">
                Pouls Studio (/app)
              </Link>
              <a href="#calculateur" className="hover:text-text">
                Calculateur
              </a>
              <a href="#faq" className="hover:text-text">
                FAQ
              </a>
            </div>
          </div>
          <p className="mt-6 text-center sm:text-left text-[11px] leading-relaxed">
            Les estimations de valeur fournies par Pouls sont indicatives et non contractuelles.
            Elles ne constituent ni un conseil financier, ni un conseil en investissement.
            <br />© {new Date().getFullYear()} Pouls. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
