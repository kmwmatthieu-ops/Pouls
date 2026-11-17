"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LiquidColorLake } from "@/components/LiquidColorLake";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Hero3DScene } from "@/components/Hero3DScene";
import { MarqueeBanner } from "@/components/MarqueeBanner";
import { Navbar } from "@/components/Navbar";
import { InteractiveSimulator } from "@/components/InteractiveSimulator";
import { WaitlistForm } from "@/components/WaitlistForm";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  Eye,
  Globe,
  HelpCircle,
  Layers,
  Lock,
  Plus,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "Mes données Stripe sont-elles réellement en sécurité ?",
    a: "Pouls utilise une clé Stripe restreinte en lecture seule stricte (read-only). Le système peut uniquement lire les abonnements, transactions et factures pour calculer votre MRR, churn et cohortes. Il lui est techniquement impossible de prélever, rembourser, créer ou modifier quoi que ce soit. Vos jetons sont chiffrés via AES-256-GCM et révocables en un clic depuis votre dashboard Stripe.",
  },
  {
    q: "Comment fonctionne l'estimation de valorisation et les multiples ?",
    a: "Notre algorithme applique un multiple de marché borné de manière réaliste entre 1,5× et 5,0× de votre ARR. Ce multiple démarre avec la base de votre niche SaaS, puis est ajusté avec précision selon votre taux de rétention nette (churn), votre croissance mensuelle, votre marge brute, l'ancienneté du produit et la composition de votre base d'utilisateurs.",
  },
  {
    q: "Quelle différence entre Pouls Studio (/app) et le calculateur de la page d'accueil ?",
    a: "Le calculateur de la landing page vous donne un aperçu instantané. Pouls Studio (/app) est l'application complète : elle vous permet de gérer plusieurs projets en parallèle, de surveiller la disponibilité HTTP réelle de vos URLs toutes les 60 secondes avec latence en millisecondes, d'analyser vos entonnoirs et d'exporter un dossier de cession complet (format JSON & impression PDF).",
  },
  {
    q: "Comment fonctionne l'analyse 360° par niche ?",
    a: "Chaque niche SaaS obéit à ses propres lois : un outil DevTools n'a pas les mêmes ratios de conversion visiteur-gratuit qu'une micro-application B2C ou un logiciel B2B Enterprise. Pouls compare votre entonnoir (Visiteurs → Gratuits → Payants → Churn) aux données réelles de 7 niches de référence pour pointer immédiatement le goulet d'étranglement qui freine votre valorisation.",
  },
  {
    q: "La surveillance Uptime teste-t-elle vraiment mes serveurs ?",
    a: "Oui. Dès que vous ajoutez un endpoint dans Pouls Studio, une requête HTTP réelle est émise via notre route sécurisée (/api/uptime/check). Le code de réponse (ex: 200 OK) et le temps de réponse exact en millisecondes sont affichés en temps réel avec indicateur visuel de santé.",
  },
  {
    q: "Puis-je exporter un dossier de valorisation pour des investisseurs ou acquéreurs ?",
    a: "Absolument. En un clic depuis l'onglet 'Valorisation & Cession' de Pouls Studio, vous pouvez exporter vos données au format JSON structuré ou déclencher une vue d'impression PDF épurée prête à être remise à un courtier, un associé ou un acquéreur potentiel (Acquire.com, Flippa, etc.).",
  },
  {
    q: "Quelles plateformes de paiement sont prévues ?",
    a: "Au lancement, Stripe est pleinement intégré. Lemon Squeezy et Paddle sont en cours de développement pour les fondateurs vendant des logiciels à l'international sous statut Merchant of Record.",
  },
  {
    q: "Puis-je supprimer mes données à tout moment ?",
    a: "Oui, à tout moment et sans condition. Pouls respecte scrupuleusement le RGPD. Vous disposez d'un bouton de suppression totale de vos données locales et de vos configurations de surveillance en un clic.",
  },
];

const BENCHMARK_NICHES = [
  {
    niche: "B2B Pro & Productivité",
    churnTarget: "2.5% — 3.5%",
    convRate: "3.5% — 5.0%",
    arpuRef: "45 € — 150 €",
    multiple: "3.5× — 4.8×",
  },
  {
    niche: "DevTools & APIs",
    churnTarget: "1.8% — 2.8%",
    convRate: "4.0% — 7.5%",
    arpuRef: "35 € — 120 €",
    multiple: "3.8× — 5.0×",
  },
  {
    niche: "Micro-SaaS & Créateurs",
    churnTarget: "4.5% — 6.5%",
    convRate: "2.0% — 4.0%",
    arpuRef: "12 € — 39 €",
    multiple: "2.2× — 3.4×",
  },
  {
    niche: "IA & Nouveaux Wrappers",
    churnTarget: "6.0% — 8.5%",
    convRate: "5.0% — 9.0%",
    arpuRef: "19 € — 49 €",
    multiple: "2.0× — 3.2×",
  },
  {
    niche: "E-commerce & Retail Apps",
    churnTarget: "3.5% — 5.0%",
    convRate: "2.5% — 4.5%",
    arpuRef: "29 € — 89 €",
    multiple: "2.8× — 4.0×",
  },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#0B0A14] text-white selection:bg-[#5B3DF5] selection:text-white">
      {/* Navbar dynamique avec barre de progression de scroll 3px */}
      <Navbar />

      <main id="contenu">
        {/* ===================================================================
            SECTION 1 : HERO SOMBRE AVEC LAC DE COULEURS VIVANT (60 FPS)
           =================================================================== */}
        <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28">
          {/* Moteur Graphique 60 FPS Canvas en arrière-plan */}
          <LiquidColorLake mode="dark" className="opacity-95" />

          {/* Grille Cybernétique Sombre superposée */}
          <div className="absolute inset-0 cyber-grid-dark pointer-events-none" />

          {/* Halo d'ambiance central */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#5B3DF5]/30 via-[#EC4899]/20 to-[#FFB84D]/25 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-[1240px] px-4 sm:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Colonne Gauche : Titre et Promesse */}
              <ScrollReveal variant="fade-left" className="lg:col-span-7 space-y-7">
                {/* Badge d'introduction */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 text-xs font-mono tracking-wider font-semibold uppercase text-[#D9D2FF] shadow-[0_4px_20px_rgba(91,61,245,0.25)]">
                  <span className="w-2 h-2 rounded-full bg-[#FFB84D] animate-pulse" />
                  <span>PILOTAGE, ANALYSE 360° & VALORISATION SAAS</span>
                </div>

                {/* Titre Principal avec Triptyque Typographique */}
                <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold tracking-[-0.03em] leading-[1.04] text-white">
                  L&apos;ARR ne suffit plus. <br />
                  Pilotez votre valeur,{" "}
                  <span className="font-serif-drama italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFB84D] via-[#FFF0C2] to-[#FFB84D] drop-shadow-[0_4px_16px_rgba(255,184,77,0.35)]">
                    Recevez-en le prix.
                  </span>
                </h1>

                {/* Sous-titre */}
                <p className="text-base sm:text-xl text-white/80 font-normal leading-relaxed max-w-2xl drop-shadow-sm">
                  Pouls connecte votre compte Stripe en lecture seule, analyse l&apos;entonnoir
                  complet de votre niche, teste la disponibilité HTTP réelle de vos serveurs et
                  calcule la valeur de cession de votre SaaS en temps réel.
                </p>

                {/* CTAs d'action directe */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <a
                    href="#simulateur"
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#5B3DF5] via-[#4D2CE6] to-[#3A22C8] hover:from-[#6B4EFA] hover:to-[#4A2FE0] shadow-[0_8px_30px_rgba(91,61,245,0.45)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Simuler la valeur de mon SaaS</span>
                    <ArrowRight className="w-4 h-4 text-[#FFB84D]" />
                  </a>

                  <Link
                    href="/app"
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-bold text-white/90 bg-white/10 hover:bg-white/15 backdrop-blur-xl border border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Zap className="w-4 h-4 text-[#FFB84D]" />
                    <span>Lancer Pouls Studio (/app)</span>
                  </Link>
                </div>

                {/* Preuves de confiance & Sécurité */}
                <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-white/60 font-mono">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Stripe lecture seule (AES-256)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FFB84D]" />
                    <span>Multiple de marché borné 1.5× — 5.0×</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#06B6D4]" />
                    <span>Sonde HTTP 60 secondes</span>
                  </div>
                </div>
              </ScrollReveal>

              {/* Colonne Droite : Scène 3D Interactive avec Cartes Flottantes */}
              <ScrollReveal variant="fade-right" className="lg:col-span-5">
                <Hero3DScene />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 2 : MARQUEE BANNER PERPÉTUEL 60 FPS
           =================================================================== */}
        <MarqueeBanner />

        {/* ===================================================================
            SECTION 3 : SURFACE CLAIRE CRISTALLINE — LES 3 PIÈGES DES FONDATEURS
           =================================================================== */}
        <section className="relative py-24 sm:py-32 bg-[#F7F7FB] text-[#12122A] overflow-hidden">
          {/* Moteur Graphique 60 FPS Canvas en Mode Clair Soyeux */}
          <LiquidColorLake mode="light" className="opacity-70" />

          {/* Grille Cybernétique Claire */}
          <div className="absolute inset-0 cyber-grid-light pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-[1240px] px-4 sm:px-8">
            <ScrollReveal variant="fade-up" className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEEAFF] border border-[#D9D2FF] text-[#3A22C8] text-xs font-mono font-semibold uppercase tracking-wider mb-4">
                <AlertTriangle className="w-3.5 h-3.5 text-[#5B3DF5]" />
                L&apos;Angle Mort du Fondateur
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#12122A] mb-4">
                Pourquoi 85% des SaaS sont vendus avec une{" "}
                <span className="font-serif-drama italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#5B3DF5] via-[#8B5CF6] to-[#EC4899]">
                  décote injustifiée.
                </span>
              </h2>
              <p className="text-base sm:text-lg text-[#5A5A70] leading-relaxed">
                Regarder son tableau de bord Stripe ne dit jamais ce qu&apos;un acquéreur regarde.
                Sans benchmark de niche et sans preuve de disponibilité, le prix s&apos;effondre.
              </p>
            </ScrollReveal>

            {/* Grille de 3 Cartes Claires avec Décalage en Cascade */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ScrollReveal variant="fade-up" delay={0}>
                <div className="addme-card p-8 h-full flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#EEEAFF] border border-[#D9D2FF] flex items-center justify-center text-[#5B3DF5] mb-6">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-mono font-semibold text-[#5B3DF5] uppercase tracking-wider mb-2">
                      Piège N°1
                    </div>
                    <h3 className="text-xl font-bold text-[#12122A] mb-3">
                      Le mirage de l&apos;ARR brut
                    </h3>
                    <p className="text-sm text-[#5A5A70] leading-relaxed">
                      Un SaaS à 10 000 € de MRR avec 6% de churn mensuel vaut souvent 3 fois moins
                      cher qu&apos;un SaaS à 5 000 € de MRR avec une rétention nette positive. Les
                      acquéreurs calculent la valeur de la baignoire percée, pas l&apos;eau qui coule.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#E3E3EE] text-xs font-mono font-semibold text-[#5B3DF5]">
                    Impact : Multiple amputé de 1.8×
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={140}>
                <div className="addme-card p-8 h-full flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF5E6] border border-[#FFE0B2] flex items-center justify-center text-[#FFB84D] mb-6">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-mono font-semibold text-[#D48200] uppercase tracking-wider mb-2">
                      Piège N°2
                    </div>
                    <h3 className="text-xl font-bold text-[#12122A] mb-3">
                      Le cimetière des inscrits gratuits
                    </h3>
                    <p className="text-sm text-[#5A5A70] leading-relaxed">
                      Des milliers d&apos;utilisateurs en compte gratuit qui ne convertissent jamais
                      ne sont pas un actif : ce sont des coûts de serveurs et un signal négatif
                      pour la rentabilité. Pouls isole vos cohortes actives et calcule le levier de
                      conversion réel.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#E3E3EE] text-xs font-mono font-semibold text-[#D48200]">
                    Impact : Dilution du ratio ARPU
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={280}>
                <div className="addme-card p-8 h-full flex flex-col justify-between shadow-sm">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#E0F7FA] border border-[#B2EBF2] flex items-center justify-center text-[#06B6D4] mb-6">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-mono font-semibold text-[#00838F] uppercase tracking-wider mb-2">
                      Piège N°3
                    </div>
                    <h3 className="text-xl font-bold text-[#12122A] mb-3">
                      L&apos;absence d&apos;historique Uptime
                    </h3>
                    <p className="text-sm text-[#5A5A70] leading-relaxed">
                      Lors de l&apos;audit technique de pré-acquisition (due diligence), une panne
                      inattendue ou un temps de latence supérieur à 800ms donne immédiatement un
                      argument de renégociation massive à l&apos;acheteur.
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#E3E3EE] text-xs font-mono font-semibold text-[#00838F]">
                    Impact : -25% lors de la signature
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 4 : SIMULATEUR INTERACTIF EN TEMPS RÉEL (DARK OBSIDIAN)
           =================================================================== */}
        <InteractiveSimulator />

        {/* ===================================================================
            SECTION 5 : ANALYSEUR 360° & BENCHMARK DES 7 NICHES (SURFACE CLAIRE)
           =================================================================== */}
        <section id="analyseur" className="relative py-24 sm:py-32 bg-[#F7F7FB] text-[#12122A] overflow-hidden">
          <LiquidColorLake mode="light" className="opacity-60" />
          <div className="absolute inset-0 cyber-grid-light pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-[1240px] px-4 sm:px-8">
            <ScrollReveal variant="fade-up" className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEEAFF] border border-[#D9D2FF] text-[#3A22C8] text-xs font-mono font-semibold uppercase tracking-wider mb-4">
                <Layers className="w-3.5 h-3.5 text-[#5B3DF5]" />
                Intelligence & Benchmarks Sectoriels
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#12122A] mb-4">
                Comparez votre entonnoir aux{" "}
                <span className="font-serif-drama italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#5B3DF5] via-[#8B5CF6] to-[#EC4899]">
                  vrais standards de votre niche.
                </span>
              </h2>
              <p className="text-base sm:text-lg text-[#5A5A70] leading-relaxed">
                Arrêtez de mesurer un DevTools technique avec les règles d&apos;une application de
                méditation. Pouls intègre les repères observés sur plus de 1 200 cessions SaaS
                européennes et américaines.
              </p>
            </ScrollReveal>

            {/* Tableau architectural des Niches */}
            <ScrollReveal variant="scale-up">
              <div className="addme-card overflow-hidden shadow-xl border border-[#D9D2FF]/80">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#EEEAFF]/60 border-b border-[#E3E3EE] font-mono text-xs uppercase tracking-wider text-[#3A22C8]">
                      <tr>
                        <th className="py-4 px-6 font-bold">Niche SaaS</th>
                        <th className="py-4 px-6 font-bold">Churn Cible (Médian)</th>
                        <th className="py-4 px-6 font-bold">Taux Conversion Visiteur → Payant</th>
                        <th className="py-4 px-6 font-bold">ARPU Référence</th>
                        <th className="py-4 px-6 font-bold text-right">Multiple ARR Observé</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E3E3EE] font-sans">
                      {BENCHMARK_NICHES.map((row, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-white/80 transition-colors group cursor-default"
                        >
                          <td className="py-4 px-6 font-bold text-[#12122A] flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#5B3DF5] opacity-0 group-hover:opacity-100 transition-opacity" />
                            {row.niche}
                          </td>
                          <td className="py-4 px-6 font-mono text-[#5A5A70] tnum">
                            {row.churnTarget}
                          </td>
                          <td className="py-4 px-6 font-mono text-[#5A5A70] tnum">
                            {row.convRate}
                          </td>
                          <td className="py-4 px-6 font-mono text-[#5A5A70] tnum">
                            {row.arpuRef}
                          </td>
                          <td className="py-4 px-6 font-mono font-bold text-right text-[#5B3DF5] tnum">
                            {row.multiple}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-white/70 border-t border-[#E3E3EE] flex flex-col sm:flex-row items-center justify-between text-xs text-[#5A5A70] font-mono gap-3">
                  <span>
                    Données calibrées selon les transactions de marché publiques & rapports MicroAcquire / Flippa
                  </span>
                  <Link
                    href="/app"
                    className="font-bold text-[#5B3DF5] hover:text-[#3A22C8] flex items-center gap-1 shrink-0"
                  >
                    <span>Lancer l&apos;Analyseur sur vos données</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ===================================================================
            SECTION 6 : MANIFESTE DU FONDATEUR (DARK OBSIDIAN & CARTES MANIFESTE)
           =================================================================== */}
        <section id="manifeste" className="relative py-24 sm:py-32 bg-[#0B0A14] text-white overflow-hidden">
          <LiquidColorLake mode="dark" className="opacity-75" />
          <div className="absolute inset-0 cyber-grid-dark pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-[1240px] px-4 sm:px-8">
            <ScrollReveal variant="fade-up" className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFB84D]/15 border border-[#FFB84D]/35 text-[#FFB84D] text-xs font-mono font-semibold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Notre Démarche
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
                Le Manifeste Pouls :{" "}
                <span className="font-serif-drama italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFB84D] via-[#FFF0C2] to-[#FFB84D]">
                  Vérité, Rigueur et Maîtrise.
                </span>
              </h2>
              <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                Les tableaux de bord traditionnels vous noient sous des vanity metrics. Nous avons
                conçu Pouls comme un instrument de pilotage stratégique et d&apos;arbitrage financier.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ScrollReveal variant="fade-up" delay={0}>
                <div className="manifesto-card p-8 h-full flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-mono font-bold text-[#FFB84D] mb-4 tracking-widest uppercase">
                      01 / PURE VÉRITÉ
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      Zéro multiple fantaisiste
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Nous ne promettons jamais un multiple absurde de 12× pour flatter votre ego.
                      Nos calculs sont volontairement bornés entre 1,5× et 5,0× de l&apos;ARR réel,
                      avec des déductions concrètes pour le churn et les faiblesses d&apos;entonnoir.
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-white/10 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Crédibilité totale face aux acheteurs</span>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={140}>
                <div className="manifesto-card p-8 h-full flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-mono font-bold text-[#06B6D4] mb-4 tracking-widest uppercase">
                      02 / SOUVERAINETÉ
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      Lecture seule inviolable
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Aucune modification de vos clients, aucune écriture sur Stripe. Vous gardez
                      le contrôle absolu de votre compte bancaire et de votre base de données.
                      Vos jetons sont chiffrés selon les meilleurs standards de sécurité.
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-white/10 text-xs font-mono text-[#06B6D4] flex items-center gap-1.5">
                    <Lock className="w-4 h-4" />
                    <span>Conforme RGPD & Chiffrement AES-256</span>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="fade-up" delay={280}>
                <div className="manifesto-card p-8 h-full flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-mono font-bold text-[#EC4899] mb-4 tracking-widest uppercase">
                      03 / ORIENTATION ACTION
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      De la métrique à la transaction
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Savoir ne sert à rien sans levier d&apos;action. Pouls identifie
                      automatiquement votre goulot prioritaire (activation, churn, ARPU) et simule
                      l&apos;impact à 12 mois de chaque levier activé pour faire décoller votre valeur.
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-white/10 text-xs font-mono text-[#EC4899] flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    <span>6 leviers modélisés en direct</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 7 : TARIFS TRANSPARENTS (SURFACE CLAIRE CRISTALLINE)
           =================================================================== */}
        <section id="tarifs" className="relative py-24 sm:py-32 bg-[#F7F7FB] text-[#12122A] overflow-hidden">
          <LiquidColorLake mode="light" className="opacity-55" />
          <div className="absolute inset-0 cyber-grid-light pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-[1240px] px-4 sm:px-8">
            <ScrollReveal variant="fade-up" className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEEAFF] border border-[#D9D2FF] text-[#3A22C8] text-xs font-mono font-semibold uppercase tracking-wider mb-4">
                <Zap className="w-3.5 h-3.5 text-[#5B3DF5]" />
                Modèle Transparent
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#12122A] mb-4">
                Accessible à chaque fondateur,{" "}
                <span className="font-serif-drama italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#5B3DF5] via-[#8B5CF6] to-[#EC4899]">
                  sans abonnement abusif.
                </span>
              </h2>
              <p className="text-base sm:text-lg text-[#5A5A70] leading-relaxed">
                Testez immédiatement en local avec vos données réelles. Rejoignez la liste d&apos;attente
                pour obtenir votre clé d&apos;accès Pro à vie.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
              {/* Offre Starter / Gratuite */}
              <ScrollReveal variant="fade-left">
                <div className="addme-card p-8 sm:p-10 h-full flex flex-col justify-between shadow-md">
                  <div>
                    <div className="inline-block px-3 py-1 rounded-full bg-[#E3E3EE] text-[#5A5A70] text-xs font-mono uppercase tracking-wider font-semibold mb-4">
                      Prévisualisation Studio
                    </div>
                    <h3 className="text-2xl font-bold text-[#12122A]">Pouls Local & Manuel</h3>
                    <p className="text-sm text-[#5A5A70] mt-2">
                      Tout ce dont vous avez besoin pour évaluer votre SaaS et tester votre Uptime
                      directement dans votre navigateur.
                    </p>

                    <div className="my-6">
                      <span className="text-4xl font-extrabold font-mono text-[#12122A]">0 €</span>
                      <span className="text-sm text-[#5A5A70] ml-2 font-mono">/ pour toujours</span>
                    </div>

                    <ul className="space-y-3 text-sm text-[#5A5A70]">
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Calculateur de valorisation dynamique complet</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Gestion multi-projets avec persistance locale</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Sonde Uptime HTTP en direct avec latence (ms)</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Export dossier cession (JSON & impression PDF)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#E3E3EE]">
                    <Link
                      href="/app"
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-[#12122A] bg-white border border-[#CFCFE0] hover:bg-[#F1F1EC] transition-all"
                    >
                      <span>Ouvrir l&apos;App Gratuite</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>

              {/* Offre PRO / Cloud */}
              <ScrollReveal variant="fade-right">
                <div className="addme-card p-8 sm:p-10 h-full flex flex-col justify-between shadow-xl border-2 border-[#5B3DF5] bg-gradient-to-b from-white to-[#EEEAFF]/40 relative">
                  <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#5B3DF5] to-[#EC4899] text-white text-xs font-mono font-bold uppercase tracking-wider shadow-md">
                    Accès Anticipé Prioritaire
                  </div>

                  <div>
                    <div className="inline-block px-3 py-1 rounded-full bg-[#EEEAFF] text-[#3A22C8] text-xs font-mono uppercase tracking-wider font-semibold mb-4">
                      Cloud & Surveillance Continue
                    </div>
                    <h3 className="text-2xl font-bold text-[#12122A]">Pouls Pro Automatisé</h3>
                    <p className="text-sm text-[#5A5A70] mt-2">
                      Synchronisation Stripe continue, alertes instantanées par email et WhatsApp,
                      et base de données PostgreSQL sécurisée.
                    </p>

                    <div className="my-6">
                      <span className="text-4xl font-extrabold font-mono text-[#5B3DF5]">29 €</span>
                      <span className="text-sm text-[#5A5A70] ml-2 font-mono">
                        / mois (Offert pour les inscrits)
                      </span>
                    </div>

                    <ul className="space-y-3 text-sm text-[#12122A]">
                      <li className="flex items-center gap-2.5 font-medium">
                        <Check className="w-4 h-4 text-[#5B3DF5] shrink-0" />
                        <span>Synchronisation automatique Stripe quotidienne</span>
                      </li>
                      <li className="flex items-center gap-2.5 font-medium">
                        <Check className="w-4 h-4 text-[#5B3DF5] shrink-0" />
                        <span>Surveillance 24/7 de vos URLs & alertes en cas de panne</span>
                      </li>
                      <li className="flex items-center gap-2.5 font-medium">
                        <Check className="w-4 h-4 text-[#5B3DF5] shrink-0" />
                        <span>Alertes temps réel par Email et WhatsApp</span>
                      </li>
                      <li className="flex items-center gap-2.5 font-medium">
                        <Check className="w-4 h-4 text-[#5B3DF5] shrink-0" />
                        <span>Historique et courbes d&apos;évolution illimitées</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#D9D2FF]">
                    <a
                      href="#waitlist"
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#5B3DF5] to-[#3A22C8] hover:from-[#6B4EFA] hover:to-[#4A2FE0] shadow-[0_8px_25px_rgba(91,61,245,0.35)] transition-all"
                    >
                      <span>Réserver ma place Pro gratuite</span>
                      <ArrowRight className="w-4 h-4 text-[#FFB84D]" />
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 8 : FAQ DÉTAILLÉE (DARK OBSIDIAN)
           =================================================================== */}
        <section id="faq" className="relative py-24 sm:py-32 bg-[#0B0A14] text-white overflow-hidden">
          <LiquidColorLake mode="dark" className="opacity-70" />
          <div className="absolute inset-0 cyber-grid-dark pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-8">
            <ScrollReveal variant="fade-up" className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-mono font-semibold uppercase tracking-wider text-[#D9D2FF] mb-4">
                <HelpCircle className="w-3.5 h-3.5 text-[#FFB84D]" />
                Questions Fréquentes
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
                Tout ce que vous devez savoir avant de{" "}
                <span className="font-serif-drama italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFB84D] via-[#FFF0C2] to-[#FFB84D]">
                  brancher vos données.
                </span>
              </h2>
              <p className="text-base sm:text-lg text-white/70">
                La transparence technique est notre engagement premier. Voici nos réponses complètes.
              </p>
            </ScrollReveal>

            <div className="space-y-4">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <ScrollReveal key={idx} variant="fade-up" delay={idx * 60}>
                    <div className="manifesto-card border border-white/10 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-6 text-left font-bold text-base sm:text-lg text-white hover:text-[#FFB84D] transition-colors"
                      >
                        <span>{item.q}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-white/60 transition-transform duration-300 ${
                            isOpen ? "rotate-180 text-[#FFB84D]" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6 text-sm text-white/70 leading-relaxed border-t border-white/5 pt-4">
                          {item.a}
                        </div>
                      )}
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 9 : CTA FINAL CINÉMATOGRAPHIQUE & CAPTURE D'EMAIL
           =================================================================== */}
        <section
          id="waitlist"
          className="relative py-24 sm:py-36 bg-[#0B0A14] text-white overflow-hidden border-t border-white/10"
        >
          <LiquidColorLake mode="dark" className="opacity-90" />
          <div className="absolute inset-0 cyber-grid-dark pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-8 text-center space-y-8">
            <ScrollReveal variant="zoom-in" className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#5B3DF5]/30 to-[#EC4899]/30 border border-white/20 text-xs font-mono font-semibold uppercase tracking-wider text-white">
                <Sparkles className="w-3.5 h-3.5 text-[#FFB84D]" />
                Accès Prioritaire Ouvert
              </div>

              <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Prenez le contrôle de la valeur de votre SaaS{" "}
                <span className="font-serif-drama italic font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFB84D] via-[#FFF0C2] to-[#FFB84D]">
                  dès aujourd&apos;hui.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
                Rejoignez les 340+ fondateurs qui mesurent leur multiple de marché et préparent
                leur avenir avec Pouls.
              </p>

              <div className="max-w-md mx-auto pt-4">
                <WaitlistForm
                  idPrefix="cta-final"
                  source="landing-cta-bottom"
                  buttonLabel="Obtenir mon accès prioritaire"
                  darkContext
                />
              </div>

              <div className="pt-2 flex items-center justify-center gap-6 text-xs text-white/50 font-mono">
                <span>✦ Sans carte bancaire</span>
                <span>✦ Clé d&apos;accès Pro offerte</span>
                <span>✦ Zéro spam</span>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      {/* ===================================================================
          PIED DE PAGE
         =================================================================== */}
      <footer className="border-t border-[#2E2C40] bg-[#08070F] py-12 text-xs text-white/50 font-mono">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-[#5B3DF5] flex items-center justify-center text-white">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <span className="text-white font-bold tracking-tight">POULS SAAS</span>
            <span className="text-white/30">|</span>
            <span>Tableau de bord, Analyseur 360° & Valorisation</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/app" className="hover:text-white transition-colors">
              Pouls Studio (/app)
            </Link>
            <a href="#simulateur" className="hover:text-white transition-colors">
              Simulateur
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Système 100% Opérationnel
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
