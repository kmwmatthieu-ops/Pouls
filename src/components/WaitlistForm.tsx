"use client";

import React, { useState } from "react";

interface WaitlistFormProps {
  idPrefix: string;
  source: string;
  buttonLabel?: string;
  metadata?: Record<string, unknown>;
  darkContext?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function WaitlistForm({
  idPrefix,
  source,
  buttonLabel = "Rejoindre la liste d'attente",
  metadata,
  darkContext = false,
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [gotcha, setGotcha] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed) {
      setStatus("error");
      setMessage("Veuillez saisir votre adresse email.");
      return;
    }
    if (!EMAIL_RE.test(trimmed) || trimmed.length > 254) {
      setStatus("error");
      setMessage("Cette adresse ne semble pas valide. Exemple : vous@votre-saas.com");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          source,
          _gotcha: gotcha,
          metadata,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Erreur serveur");
      }
      setEmail("");
      setStatus("success");
      setMessage(
        data.mode === "external"
          ? "Merci ! Votre inscription est confirmée. Nous vous écrirons au lancement."
          : "Inscription enregistrée dans la base locale (data/waitlist.json). Configurez WAITLIST_FORM_ENDPOINT dans .env.local pour la relier à Formspree ou Brevo."
      );
    } catch (err: unknown) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "L'envoi a échoué. Réessayez dans un instant."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:rounded-2xl sm:border sm:border-border-strong sm:bg-surface sm:p-1.5 sm:shadow-md focus-within:border-accent">
        <label htmlFor={`${idPrefix}-email`} className="sr-only">
          Votre adresse email
        </label>
        <input
          id={`${idPrefix}-email`}
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") {
              setStatus("idle");
              setMessage("");
            }
          }}
          placeholder="vous@votre-saas.com"
          aria-invalid={status === "error"}
          aria-describedby={`${idPrefix}-msg`}
          className="min-h-[48px] flex-1 rounded-xl border border-border-strong bg-surface px-4 py-3 text-base text-text placeholder:text-text-2/80 focus:outline-none sm:border-0 sm:bg-transparent"
          required
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex min-h-[48px] items-center justify-center whitespace-nowrap rounded-xl bg-accent px-6 py-3 text-base font-semibold text-on-accent shadow-sm transition hover:bg-accent-hover disabled:cursor-progress disabled:opacity-60"
        >
          {status === "loading" ? "Envoi…" : buttonLabel}
        </button>
      </div>

      {/* Champ anti-robots invisible */}
      <input
        type="text"
        name="_gotcha"
        value={gotcha}
        onChange={(e) => setGotcha(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only"
      />

      <p
        id={`${idPrefix}-msg`}
        role="status"
        aria-live="polite"
        className={`mt-2 min-h-[1.5em] text-sm font-medium ${
          status === "error"
            ? darkContext
              ? "text-red-300"
              : "text-error"
            : status === "success"
            ? darkContext
              ? "text-emerald-300"
              : "text-success"
            : "text-text-2"
        }`}
      >
        {message}
      </p>
    </form>
  );
}

