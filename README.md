# Pouls — Tableau de bord, Analyseur 360° & Valorisation SaaS

Application complète développée avec **Next.js (App Router)**, **React**, **TypeScript** et **Tailwind CSS**, accompagnée d'une version autonome ([index.html](./index.html)).

## 1. Démarrage rapide

```bash
npm run dev
```

- **Landing page & Calculateur interactif :** `http://localhost:3000/`
- **Application complète (Pouls Studio) :** `http://localhost:3000/app`

## 2. Fonctionnalités livrées

1. **Landing page complète (`/`)** :
   - 13 sections ordonnées, mode clair/sombre automatique (`prefers-color-scheme`), accessibilité WCAG AA, SEO & Schema.org.
   - Calculateur interactif intégrant la **niche**, les **utilisateurs payants**, les **inscrits gratuits/essais**, le **trafic mensuel** et **6 leviers d'action à 12 mois**.
2. **Application SaaS — Pouls Studio (`/app`)** :
   - **Multi-projets** avec persistance locale (`localStorage`) et import direct depuis le calculateur de la landing page.
   - **Tableau de bord** : 6 KPIs, score de santé sur 100, détection automatique du goulot d'étranglement prioritaire et courbes comparatives sur 12 mois (*Rythme actuel* vs *Avec vos actions*).
   - **Analyse 360° Niche, Utilisateurs & Leviers** : entonnoir complet (*Visiteurs → Gratuits → Payants → Rétention*) comparé aux repères des 7 niches SaaS, et simulateur interactif des 6 leviers.
   - **Valorisation & Dossier Cession** : fourchette Basse / Médiane / Haute (multiple borné entre `1,5×` et `5,0×` de l'ARR), décomposition ligne par ligne, export JSON et impression PDF.
   - **Surveillance Uptime HTTP réelle** : test en direct du code HTTP et de la latence en millisecondes via `/api/uptime/check`.
   - **Connexions API & Base de données** : synchronisation Stripe en lecture seule (`/api/stripe/sync`), liste d'attente (`/api/waitlist`) et schéma PostgreSQL/Prisma (`prisma/schema.prisma`).

## 3. Ce que nous pourrons brancher ensemble (Base de données & API)

Copiez [`.env.example`](./.env.example) en `.env.local` pour renseigner :
- `DATABASE_URL` : base PostgreSQL (Supabase, Neon, Railway) pour activer [`prisma/schema.prisma`](./prisma/schema.prisma).
- `STRIPE_RESTRICTED_KEY` : clé Stripe en lecture seule (`rk_test_...` ou `rk_live_...`).
- `WAITLIST_FORM_ENDPOINT` : URL Formspree, Brevo ou Tally.
- `RESEND_API_KEY` & `WHATSAPP_ACCESS_TOKEN` : envoi réel des alertes email et WhatsApp.

