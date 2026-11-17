import { NextResponse } from "next/server";

/**
 * Route API de surveillance de disponibilité (Uptime).
 * Mesure le temps de réponse réel et le code HTTP d'une URL publique.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawUrl = String(body.url || "").trim();

    if (!rawUrl) {
      return NextResponse.json({ ok: false, error: "URL manquante." }, { status: 400 });
    }

    let parsed: URL;
    try {
      parsed = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
    } catch {
      return NextResponse.json({ ok: false, error: "Format d'URL invalide." }, { status: 400 });
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return NextResponse.json({ ok: false, error: "Protocole non supporté." }, { status: 400 });
    }

    const start = performance.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(parsed.toString(), {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "User-Agent": "Pouls-Uptime-Monitor/1.0",
        },
      });
      clearTimeout(timeout);
      const latencyMs = Math.round(performance.now() - start);
      const up = res.status >= 200 && res.status < 400;

      return NextResponse.json({
        ok: true,
        url: parsed.toString(),
        up,
        status: res.status,
        statusText: res.statusText || (up ? "OK" : "Erreur HTTP"),
        latencyMs,
        checkedAt: new Date().toISOString(),
      });
    } catch (fetchErr: unknown) {
      clearTimeout(timeout);
      const latencyMs = Math.round(performance.now() - start);
      const msg = fetchErr instanceof Error ? fetchErr.message : "Délai dépassé ou hôte injoignable";
      return NextResponse.json({
        ok: true,
        url: parsed.toString(),
        up: false,
        status: 0,
        statusText: msg,
        latencyMs,
        checkedAt: new Date().toISOString(),
      });
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "Impossible de vérifier l'URL." },
      { status: 500 }
    );
  }
}

