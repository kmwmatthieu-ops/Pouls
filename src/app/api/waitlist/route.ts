import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const source = String(body.source || "landing").slice(0, 64);
    const gotcha = String(body._gotcha || "");
    const metadata = body.metadata || {};

    // Piège anti-robots
    if (gotcha) {
      return NextResponse.json({ ok: true, mode: "honeypot" });
    }

    if (!email || !EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json(
        { ok: false, error: "Adresse email invalide." },
        { status: 400 }
      );
    }

    // 1. Si un endpoint externe (Formspree, Brevo, Webhook) est configuré dans .env.local
    const externalEndpoint = process.env.WAITLIST_FORM_ENDPOINT;
    if (externalEndpoint) {
      const extRes = await fetch(externalEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          source,
          ...metadata,
          createdAt: new Date().toISOString(),
        }),
      });
      if (!extRes.ok) {
        return NextResponse.json(
          { ok: false, error: "Le service externe a renvoyé une erreur." },
          { status: 502 }
        );
      }
      return NextResponse.json({ ok: true, mode: "external" });
    }

    // 2. Stockage local JSON (prêt pour le développement et la démo locale avant branchement PostgreSQL)
    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "waitlist.json");
    await fs.mkdir(dataDir, { recursive: true });

    let entries: Array<Record<string, unknown>> = [];
    try {
      const existing = await fs.readFile(filePath, "utf8");
      entries = JSON.parse(existing);
    } catch {
      entries = [];
    }

    const alreadyExists = entries.some((e) => e.email === email);
    if (!alreadyExists) {
      entries.push({
        email,
        source,
        metadata,
        createdAt: new Date().toISOString(),
      });
      await fs.writeFile(filePath, JSON.stringify(entries, null, 2), "utf8");
    }

    return NextResponse.json({
      ok: true,
      mode: "local",
      totalRegistered: entries.length,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Erreur lors de l'enregistrement." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "waitlist.json");
    const content = await fs.readFile(filePath, "utf8");
    const entries = JSON.parse(content);
    return NextResponse.json({ ok: true, count: Array.isArray(entries) ? entries.length : 0 });
  } catch {
    return NextResponse.json({ ok: true, count: 0 });
  }
}

