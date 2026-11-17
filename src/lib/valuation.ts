/**
 * MOTEUR DE VALORISATION, DIAGNOSTIC DE NICHE ET SIMULATION D'UTILISATEURS
 * Fonction pure, sans effet de bord, partagée entre la Landing Page et l'Application.
 */

export type NicheKey =
  | "b2b_prod"
  | "devtools"
  | "fintech"
  | "vertical"
  | "ai"
  | "martech"
  | "b2c";

export type LeverKey =
  | "convertFree"
  | "reduceChurn"
  | "improveLanding"
  | "boostAcquisition"
  | "optimizePricing"
  | "expandNrr";

export interface NicheBenchmark {
  key: NicheKey;
  label: string;
  shortLabel: string;
  description: string;
  multAdj: number;
  refChurn: number;
  targetConv: number;
  refVisitorToSignup: number;
  refArpu: number;
  refMargin: number;
  typicalChannels: string[];
}

export interface SaasInput {
  id?: string;
  name?: string;
  url?: string;
  niche: NicheKey;
  visitors?: number;
  freeUsers: number;
  users: number;
  mrr: number;
  growth: number;
  churn: number;
  margin: number;
  age: number;
  activeLevers?: Partial<Record<LeverKey, boolean>>;
}

export interface LeverSimulation {
  key: LeverKey;
  title: string;
  actionPlan: string;
  gainUsers: number;
  gainFreeUsers: number;
  gainMrr: number;
  gainVal: number;
  targetMetricLabel: string;
}

export interface MonthlyPoint {
  month: number;
  label: string;
  baseUsers: number;
  projUsers: number;
  baseMrr: number;
  projMrr: number;
  baseVal: number;
  projVal: number;
}

export const VALUATION_CONFIG = {
  baseMultiple: 2.0, // multiple de départ appliqué à l'ARR
  minMultiple: 1.5,  // plancher absolu
  maxMultiple: 5.0,  // plafond absolu
  spread: 0.5,       // écart ± autour de la médiane pour les valeurs basse/haute

  niches: {
    b2b_prod: {
      key: "b2b_prod",
      label: "Productivité & Collaboration B2B",
      shortLabel: "Productivité B2B",
      description: "Outils d'équipe, gestion de projet, documentation, flux de travail internes.",
      multAdj: 0.15,
      refChurn: 3.5,
      targetConv: 4.5,
      refVisitorToSignup: 4.0,
      refArpu: 25,
      refMargin: 82,
      typicalChannels: ["SEO comparatif", "Templates gratuits", "Parrainage d'équipe"],
    },
    devtools: {
      key: "devtools",
      label: "DevTools, API & Infrastructure",
      shortLabel: "DevTools & API",
      description: "Outils pour développeurs, monitoring, SDK, API facturées à l'usage ou à l'abonnement.",
      multAdj: 0.3,
      refChurn: 2.5,
      targetConv: 4.0,
      refVisitorToSignup: 5.0,
      refArpu: 35,
      refMargin: 80,
      typicalChannels: ["Documentation technique", "Open-source / GitHub", "Intégrations CI/CD"],
    },
    fintech: {
      key: "fintech",
      label: "FinTech, Facturation & Comptabilité",
      shortLabel: "FinTech & Facturation",
      description: "Gestion financière, trésorerie, facturation, conformité et reporting.",
      multAdj: 0.35,
      refChurn: 2.2,
      targetConv: 5.0,
      refVisitorToSignup: 3.5,
      refArpu: 40,
      refMargin: 85,
      typicalChannels: ["SEO réglementaire", "Partenariats experts-comptables", "Outils gratuits"],
    },
    vertical: {
      key: "vertical",
      label: "SaaS vertical / Métier spécifique",
      shortLabel: "SaaS Vertical",
      description: "Logiciel dédié à une profession précise (immobilier, santé, BTP, juridique, restauration).",
      multAdj: 0.4,
      refChurn: 2.0,
      targetConv: 6.0,
      refVisitorToSignup: 3.8,
      refArpu: 55,
      refMargin: 84,
      typicalChannels: ["Approche directe ciblée", "Annuaires professionnels", "Bouche-à-oreille métier"],
    },
    ai: {
      key: "ai",
      label: "IA & Automatisation",
      shortLabel: "IA & Automatisation",
      description: "Agents IA, génération assistée, automatisation de processus et traitement de données.",
      multAdj: 0.2,
      refChurn: 5.5,
      targetConv: 3.2,
      refVisitorToSignup: 6.5,
      refArpu: 29,
      refMargin: 68,
      typicalChannels: ["Démos interactives", "SEO cas d'usage", "Connecteurs Zapier/Make"],
    },
    martech: {
      key: "martech",
      label: "Marketing, SEO & E-commerce",
      shortLabel: "Marketing & E-com",
      description: "Acquisition, analytics, emailing, optimisation de boutique et réseaux sociaux.",
      multAdj: -0.1,
      refChurn: 5.0,
      targetConv: 3.5,
      refVisitorToSignup: 4.5,
      refArpu: 32,
      refMargin: 78,
      typicalChannels: ["Audit gratuit en ligne", "App Stores (Shopify, etc.)", "Affiliation"],
    },
    b2c: {
      key: "b2c",
      label: "Créateurs, Éducation & B2C",
      shortLabel: "Créateurs & B2C",
      description: "Applications grand public, outils pour créateurs de contenu, formation et communautés.",
      multAdj: -0.25,
      refChurn: 6.5,
      targetConv: 2.5,
      refVisitorToSignup: 7.0,
      refArpu: 12,
      refMargin: 75,
      typicalChannels: ["Contenu organique", "Boucle virale produit", "Offre annuelle d'entrée"],
    },
  } satisfies Record<NicheKey, NicheBenchmark>,

  users: [
    { min: 250, adj: 0.25, label: "Base large (risque dilué)" },
    { min: 50, adj: 0.15, label: "Base diversifiée" },
    { min: 15, adj: 0, label: "Base en construction" },
    { min: 0, adj: -0.25, label: "Forte concentration (< 15 clients)" },
  ],

  growth: {
    neutral: 2,
    perPoint: 0.15,
    maxBonus: 1.5,
    maxMalus: -0.5,
  },
  churn: {
    excellent: 2,
    excellentBonus: 0.25,
    neutral: 3,
    perPoint: -0.2,
    maxMalus: -1.5,
  },
  margin: [
    { min: 80, adj: 0.5 },
    { min: 60, adj: 0.25 },
    { min: 40, adj: 0 },
    { min: -Infinity, adj: -0.3 },
  ],
  age: {
    young: 12,
    youngAdj: -0.3,
    mature: 36,
    matureAdj: 0.2,
  },
};

export function estimateValuation(input: SaasInput, cfg = VALUATION_CONFIG) {
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  const round2 = (v: number) => Math.round(v * 100) / 100;

  const nicheKey: NicheKey = input.niche && cfg.niches[input.niche] ? input.niche : "b2b_prod";
  const niche = cfg.niches[nicheKey];
  const users = Math.max(0, Math.round(input.users || 0));
  const freeUsers = Math.max(0, Math.round(input.freeUsers || 0));
  const defaultVisitors = Math.max(800, (users + freeUsers) * 6);
  const visitors = Math.max(0, Math.round(input.visitors ?? defaultVisitors));

  // 1. ARR = MRR × 12
  const arr = Math.max(0, input.mrr) * 12;

  // 2. Ajustements du multiple
  const nicheAdj = niche.multAdj;
  const userTier = cfg.users.find((t) => users >= t.min) || cfg.users[cfg.users.length - 1];
  const usersAdj = users === 0 && input.mrr === 0 ? 0 : userTier.adj;

  const g = cfg.growth;
  const growthAdj = clamp((input.growth - g.neutral) * g.perPoint, g.maxMalus, g.maxBonus);

  const c = cfg.churn;
  const churnAdj =
    input.churn < c.excellent
      ? c.excellentBonus
      : Math.max(c.maxMalus, Math.max(0, input.churn - c.neutral) * c.perPoint);

  const marginAdj = (cfg.margin.find((t) => input.margin >= t.min) || cfg.margin[cfg.margin.length - 1]).adj;

  const a = cfg.age;
  const ageAdj = input.age < a.young ? a.youngAdj : input.age >= a.mature ? a.matureAdj : 0;

  const computeMidMultiple = (uCount: number, gr: number, ch: number, mg: number, ag: number) => {
    const uAdj = (cfg.users.find((t) => uCount >= t.min) || cfg.users[cfg.users.length - 1]).adj;
    const gAdj = clamp((gr - g.neutral) * g.perPoint, g.maxMalus, g.maxBonus);
    const cAdj = ch < c.excellent ? c.excellentBonus : Math.max(c.maxMalus, Math.max(0, ch - c.neutral) * c.perPoint);
    const mAdj = (cfg.margin.find((t) => mg >= t.min) || cfg.margin[cfg.margin.length - 1]).adj;
    const aAdj = ag < a.young ? a.youngAdj : ag >= a.mature ? a.matureAdj : 0;
    return round2(clamp(cfg.baseMultiple + nicheAdj + uAdj + gAdj + cAdj + mAdj + aAdj, cfg.minMultiple, cfg.maxMultiple));
  };

  const midMultiple = round2(
    clamp(cfg.baseMultiple + nicheAdj + usersAdj + growthAdj + churnAdj + marginAdj + ageAdj, cfg.minMultiple, cfg.maxMultiple)
  );
  const lowMultiple = round2(clamp(midMultiple - cfg.spread, cfg.minMultiple, cfg.maxMultiple));
  const highMultiple = round2(clamp(midMultiple + cfg.spread, cfg.minMultiple, cfg.maxMultiple));

  // 3. Métriques par utilisateur & entonnoir
  const arpu = users > 0 ? input.mrr / users : 0;
  const effectiveArpu = arpu > 0 ? arpu : niche.refArpu;
  const effectiveMonths = 1 / Math.max(0.015, Math.min(1, input.churn / 100));
  const ltv = arpu * (Math.max(0, input.margin) / 100) * effectiveMonths;
  const totalUsers = users + freeUsers;
  const convRate = totalUsers > 0 ? (users / totalUsers) * 100 : 0;

  // Score de santé sur 100 (factuel)
  const churnScore = clamp(25 - (input.churn - niche.refChurn) * 4, 5, 25);
  const growthScore = clamp(10 + input.growth * 2, 0, 25);
  const marginScore = clamp((input.margin / 85) * 25, 0, 25);
  const userBaseScore = users >= 200 ? 25 : users >= 50 ? 20 : users >= 15 ? 14 : users > 0 ? 8 : 3;
  const healthScore = Math.round(clamp(churnScore + growthScore + marginScore + userBaseScore, 10, 99));

  // Diagnostic du goulot d'étranglement prioritaire
  let bottleneck = {
    title: "Accélération de l'acquisition",
    detail: `Vos fondamentaux sont sains pour la niche ${niche.shortLabel}. Le principal levier est d'augmenter le flux d'utilisateurs entrants.`,
  };
  if (input.churn > niche.refChurn + 1.2) {
    bottleneck = {
      title: "Fuite de rétention (Churn au-dessus de la niche)",
      detail: `Votre churn (${round2(input.churn)} %) dépasse le repère ${niche.shortLabel} (${niche.refChurn} %). Réduire ce taux augmente à la fois le nombre de clients conservés et le multiple de revente.`,
    };
  } else if (freeUsers > 50 && convRate < niche.targetConv * 0.75) {
    bottleneck = {
      title: "Gisement d'inscrits gratuits sous-exploité",
      detail: `Votre taux de conversion gratuit → payant (${round2(convRate)} %) est sous la cible de ${niche.targetConv} % pour ${niche.shortLabel}. Vos prochains clients sont déjà inscrits.`,
    };
  } else if (users > 0 && arpu < niche.refArpu * 0.7) {
    bottleneck = {
      title: "ARPU inférieur au repère de la niche",
      detail: `Votre panier moyen (${Math.round(arpu)} €/mois) est inférieur à la médiane ${niche.shortLabel} (~${niche.refArpu} €). Un palier supérieur augmente le MRR sans effort d'acquisition.`,
    };
  }

  // 4. Simulation sur 12 mois selon les leviers d'action
  const monthlyNetRate = clamp(input.growth, -15, 20) / 100;
  const monthlyChurnRate = clamp(input.churn, 0, 50) / 100;
  const baseMonthlyNewUsers =
    users > 0
      ? Math.max(1, users * Math.max(0.01, monthlyNetRate + monthlyChurnRate))
      : Math.max(2, Math.round((freeUsers * (niche.targetConv / 100)) / 6) || 3);

  const simulate12Months = (flags: Partial<Record<LeverKey, boolean>>) => {
    let currentUsers = users;
    let currentFree = freeUsers;
    const targetChurnPct = flags.reduceChurn
      ? Math.min(input.churn, Math.max(1, round2(Math.min(input.churn * 0.7, (input.churn + niche.refChurn) / 2))))
      : input.churn;
    const chRate = clamp(targetChurnPct, 0, 50) / 100;
    const acqMultiplier = flags.boostAcquisition ? 1.5 : 1;

    // Levier conversion des gratuits
    const freeConversionPool = flags.convertFree
      ? freeUsers > 0
        ? Math.max(3, Math.round(freeUsers * (niche.targetConv / 100)))
        : Math.max(4, Math.round(baseMonthlyNewUsers * 3))
      : 0;
    const monthlyFromFree = freeConversionPool / 12;

    // Levier amélioration landing page (+1,5 pt de conversion visiteurs -> inscrits)
    const extraMonthlySignups = flags.improveLanding ? Math.max(15, Math.round(visitors * 0.015)) : 0;
    const extraMonthlyPaidFromLanding = extraMonthlySignups * (niche.targetConv / 100);

    // Levier expansion NRR (upsell sur clients existants)
    const nrrExpansionBoost = flags.expandNrr ? 1.12 : 1;
    const priceBoost = flags.optimizePricing ? 1.15 : 1;
    const finalArpu = effectiveArpu * priceBoost * nrrExpansionBoost;

    const points: { month: number; users: number; mrr: number; val: number }[] = [
      { month: 0, users, mrr: Math.round(input.mrr), val: Math.round(arr * midMultiple) },
    ];

    for (let m = 1; m <= 12; m++) {
      const lost = currentUsers * chRate;
      const acquired = baseMonthlyNewUsers * acqMultiplier + monthlyFromFree + extraMonthlyPaidFromLanding;
      currentUsers = Math.max(0, currentUsers - lost + acquired);
      currentFree = Math.max(0, currentFree + extraMonthlySignups - monthlyFromFree);

      const mUsers = Math.round(currentUsers);
      const progress = m / 12;
      const mArpu = effectiveArpu * (1 + (priceBoost * nrrExpansionBoost - 1) * progress);
      const mMrr = Math.round(mUsers * mArpu);
      const mArr = mMrr * 12;
      const impliedGr =
        users > 0
          ? clamp(((mMrr / Math.max(1, input.mrr)) ** (1 / m) - 1) * 100, -20, 25)
          : Math.max(input.growth, 6);
      const mMult = computeMidMultiple(mUsers, impliedGr, targetChurnPct, input.margin, input.age + m);
      points.push({ month: m, users: mUsers, mrr: mMrr, val: Math.round(mArr * mMult) });
    }

    const last = points[12];
    const impliedGrowth =
      users > 0
        ? clamp(((last.mrr / Math.max(1, input.mrr)) ** (1 / 12) - 1) * 100, -20, 25)
        : Math.max(input.growth, 6);
    const finalMult = computeMidMultiple(last.users, impliedGrowth, targetChurnPct, input.margin, input.age + 12);

    return {
      users: last.users,
      freeUsers: Math.round(currentFree),
      mrr: last.mrr,
      arr: last.mrr * 12,
      multiple: finalMult,
      valuation: Math.round(last.mrr * 12 * finalMult),
      targetChurnPct,
      points,
    };
  };

  const baseline12m = simulate12Months({});
  const onlyFree = simulate12Months({ convertFree: true });
  const onlyChurn = simulate12Months({ reduceChurn: true });
  const onlyLanding = simulate12Months({ improveLanding: true });
  const onlyAcq = simulate12Months({ boostAcquisition: true });
  const onlyPrice = simulate12Months({ optimizePricing: true });
  const onlyNrr = simulate12Months({ expandNrr: true });
  const combined12m = simulate12Months(input.activeLevers || {});

  const monthNames = ["Auj.", "M+1", "M+2", "M+3", "M+4", "M+5", "M+6", "M+7", "M+8", "M+9", "M+10", "M+11", "M+12"];
  const monthlySeries: MonthlyPoint[] = monthNames.map((label, i) => ({
    month: i,
    label,
    baseUsers: baseline12m.points[i].users,
    projUsers: combined12m.points[i].users,
    baseMrr: baseline12m.points[i].mrr,
    projMrr: combined12m.points[i].mrr,
    baseVal: baseline12m.points[i].val,
    projVal: combined12m.points[i].val,
  }));

  const levers: Record<LeverKey, LeverSimulation> = {
    convertFree: {
      key: "convertFree",
      title: "Activer les inscrits gratuits / essais",
      actionPlan:
        freeUsers > 0
          ? `Convertir ~${niche.targetConv} % de vos ${freeUsers} inscrits gratuits via une séquence d'onboarding et des déclencheurs d'usage.`
          : "Mettre en place un essai guidé et relancer automatiquement les inscriptions inachevées.",
      gainUsers: Math.max(0, onlyFree.users - baseline12m.users),
      gainFreeUsers: 0,
      gainMrr: Math.max(0, onlyFree.mrr - baseline12m.mrr),
      gainVal: Math.max(0, onlyFree.valuation - baseline12m.valuation),
      targetMetricLabel: `Cible conversion niche : ${niche.targetConv} %`,
    },
    reduceChurn: {
      key: "reduceChurn",
      title: "Réduire le churn (Dunning Stripe & J+30)",
      actionPlan: `Abaisser le churn de ${round2(input.churn)} % à ${onlyChurn.targetChurnPct} % en récupérant les cartes expirées et en accompagnant les 30 premiers jours.`,
      gainUsers: Math.max(0, onlyChurn.users - baseline12m.users),
      gainFreeUsers: 0,
      gainMrr: Math.max(0, onlyChurn.mrr - baseline12m.mrr),
      gainVal: Math.max(0, onlyChurn.valuation - baseline12m.valuation),
      targetMetricLabel: `Repère churn ${niche.shortLabel} : ${niche.refChurn} %`,
    },
    improveLanding: {
      key: "improveLanding",
      title: "Optimiser la conversion du site (+1,5 pt)",
      actionPlan: `Améliorer la clarté de la proposition de valeur et l'inscription sur vos ~${visitors} visiteurs mensuels.`,
      gainUsers: Math.max(0, onlyLanding.users - baseline12m.users),
      gainFreeUsers: Math.max(0, onlyLanding.freeUsers - baseline12m.freeUsers),
      gainMrr: Math.max(0, onlyLanding.mrr - baseline12m.mrr),
      gainVal: Math.max(0, onlyLanding.valuation - baseline12m.valuation),
      targetMetricLabel: `Repère visiteur → inscrit : ${niche.refVisitorToSignup} %`,
    },
    boostAcquisition: {
      key: "boostAcquisition",
      title: "Accélérer l'acquisition dans la niche (+50 %)",
      actionPlan: `Déployer les canaux clés ${niche.shortLabel} : ${niche.typicalChannels.join(", ")}.`,
      gainUsers: Math.max(0, onlyAcq.users - baseline12m.users),
      gainFreeUsers: 0,
      gainMrr: Math.max(0, onlyAcq.mrr - baseline12m.mrr),
      gainVal: Math.max(0, onlyAcq.valuation - baseline12m.valuation),
      targetMetricLabel: `Canaux : ${niche.typicalChannels[0]}`,
    },
    optimizePricing: {
      key: "optimizePricing",
      title: "Optimiser le tarif & l'ARPU (+15 %)",
      actionPlan: `Créer un palier supérieur et proposer l'abonnement annuel (panier repère ${niche.shortLabel} : ~${niche.refArpu} €/mois).`,
      gainUsers: 0,
      gainFreeUsers: 0,
      gainMrr: Math.max(0, onlyPrice.mrr - baseline12m.mrr),
      gainVal: Math.max(0, onlyPrice.valuation - baseline12m.valuation),
      targetMetricLabel: `ARPU repère : ${niche.refArpu} €/mois`,
    },
    expandNrr: {
      key: "expandNrr",
      title: "Activer l'expansion / Upsell (+12 % NRR)",
      actionPlan: "Facturer selon l'usage (sièges, volume, options) pour faire croître le revenu par client existant.",
      gainUsers: 0,
      gainFreeUsers: 0,
      gainMrr: Math.max(0, onlyNrr.mrr - baseline12m.mrr),
      gainVal: Math.max(0, onlyNrr.valuation - baseline12m.valuation),
      targetMetricLabel: "Expansion sur base installée",
    },
  };

  return {
    arr,
    users,
    freeUsers,
    visitors,
    totalUsers,
    arpu,
    effectiveArpu,
    ltv,
    convRate,
    healthScore,
    bottleneck,
    niche,
    userTier,
    base: cfg.baseMultiple,
    min: cfg.minMultiple,
    max: cfg.maxMultiple,
    spread: cfg.spread,
    adjustments: [
      { key: "niche", label: "Niche", value: round2(nicheAdj) },
      { key: "users", label: "Utilisateurs", value: round2(usersAdj) },
      { key: "growth", label: "Croissance", value: round2(growthAdj) },
      { key: "churn", label: "Churn", value: round2(churnAdj) },
      { key: "margin", label: "Marge", value: round2(marginAdj) },
      { key: "age", label: "Ancienneté", value: round2(ageAdj) },
    ],
    low: { multiple: lowMultiple, value: Math.round(arr * lowMultiple) },
    mid: { multiple: midMultiple, value: Math.round(arr * midMultiple) },
    high: { multiple: highMultiple, value: Math.round(arr * highMultiple) },
    levers,
    baseline12m,
    combined12m,
    monthlySeries,
  };
}

