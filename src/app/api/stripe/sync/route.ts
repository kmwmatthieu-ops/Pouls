import { NextResponse } from "next/server";

/**
 * Route API de synchronisation Stripe en lecture seule.
 * Utilise soit la clé passée dans la requête (test de connexion), soit STRIPE_RESTRICTED_KEY dans .env.local.
 * Ne réalise que des requêtes GET (lecture seule).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const apiKey = String(body.apiKey || process.env.STRIPE_RESTRICTED_KEY || "").trim();

    if (!apiKey) {
      return NextResponse.json(
        {
          ok: false,
          mode: "missing_key",
          error:
            "Aucune clé Stripe fournie. Saisissez une clé restreinte en lecture seule (rk_live_... ou rk_test_...) ou configurez STRIPE_RESTRICTED_KEY dans .env.local.",
        },
        { status: 400 }
      );
    }

    if (!apiKey.startsWith("rk_") && !apiKey.startsWith("sk_")) {
      return NextResponse.json(
        {
          ok: false,
          error: "Format de clé invalide. Privilégiez une clé restreinte en lecture seule commençant par rk_test_ ou rk_live_.",
        },
        { status: 400 }
      );
    }

    // Lecture seule des abonnements actifs (limite 100 pour aperçu rapide)
    const subsRes = await fetch("https://api.stripe.com/v1/subscriptions?status=active&limit=100", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!subsRes.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: `Stripe a refusé la clé (HTTP ${subsRes.status}). Vérifiez que la clé autorise la lecture des Subscriptions.`,
        },
        { status: 401 }
      );
    }

    const subsData = await subsRes.json();
    const subscriptions = Array.isArray(subsData.data) ? subsData.data : [];

    let mrrCents = 0;
    const customerIds = new Set<string>();

    for (const sub of subscriptions) {
      if (sub.customer) customerIds.add(String(sub.customer));
      const items = sub.items?.data || [];
      for (const item of items) {
        const amount = Number(item.price?.unit_amount || 0) * Number(item.quantity || 1);
        const interval = item.price?.recurring?.interval;
        const intervalCount = Number(item.price?.recurring?.interval_count || 1);
        if (interval === "month") {
          mrrCents += amount / intervalCount;
        } else if (interval === "year") {
          mrrCents += amount / (12 * intervalCount);
        } else if (interval === "week") {
          mrrCents += (amount * 52) / (12 * intervalCount);
        }
      }
    }

    const mrr = Math.round(mrrCents / 100);
    const activeCustomers = customerIds.size || subscriptions.length;

    return NextResponse.json({
      ok: true,
      mode: "live_stripe",
      mrr,
      arr: mrr * 12,
      users: activeCustomers,
      arpu: activeCustomers > 0 ? Math.round((mrr / activeCustomers) * 100) / 100 : 0,
      syncedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Impossible de joindre l'API Stripe. Vérifiez votre connexion réseau.",
      },
      { status: 500 }
    );
  }
}

