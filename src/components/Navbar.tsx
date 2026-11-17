"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Menu, X, Zap } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrolled(currentScroll > 30);
      if (totalScroll > 0) {
        setScrollProgress((currentScroll / totalScroll) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* 1. Barre de progression lumineuse du scroll (3px) */}
      <div
        className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-gradient-to-r from-[#5B3DF5] via-[#EC4899] to-[#FFB84D] transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* 2. Header fixe dynamique */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0B0A14]/90 backdrop-blur-xl border-b border-white/15 shadow-[0_12px_40px_rgba(91,61,245,0.28)] py-3"
            : "bg-transparent border-b border-white/5 py-4"
        }`}
      >
        {/* Ruban de nuance liquide animé subtil en bordure haute */}
        <div className="absolute inset-x-0 top-0 h-[1px] opacity-40 animate-lake-flow bg-gradient-to-r from-[#5B3DF5] via-[#EC4899] to-[#FFB84D]" />

        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-8">
          {/* Logo & Identité */}
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight text-white group shrink-0"
          >
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5B3DF5] via-[#EC4899] to-[#FFB84D] p-[1.5px] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full rounded-[10px] bg-[#0B0A14] flex items-center justify-center">
                <svg className="w-4 h-4 text-[#FFB84D]" viewBox="0 0 32 32" fill="none">
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
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-white flex items-center gap-1.5">
                POULS
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-full bg-[#5B3DF5]/30 text-[#D9D2FF] border border-[#5B3DF5]/40">
                  STUDIO
                </span>
              </span>
            </div>
          </Link>

          {/* Navigation principale Desktop */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-white/80">
            <a
              href="#simulateur"
              className="px-3.5 py-2 rounded-lg transition-colors hover:text-white hover:bg-white/5"
            >
              Simulateur & Valorisation
            </a>
            <a
              href="#analyseur"
              className="px-3.5 py-2 rounded-lg transition-colors hover:text-white hover:bg-white/5"
            >
              Analyseur 360°
            </a>
            <a
              href="#manifeste"
              className="px-3.5 py-2 rounded-lg transition-colors hover:text-white hover:bg-white/5"
            >
              Manifeste Fondateur
            </a>
            <a
              href="#tarifs"
              className="px-3.5 py-2 rounded-lg transition-colors hover:text-white hover:bg-white/5"
            >
              Tarifs
            </a>
            <a
              href="#faq"
              className="px-3.5 py-2 rounded-lg transition-colors hover:text-white hover:bg-white/5"
            >
              FAQ
            </a>
          </nav>

          {/* CTA actions */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="#simulateur"
              className="text-xs font-semibold px-3.5 py-2 rounded-xl text-white/80 hover:text-white transition-colors"
            >
              Tester mon SaaS
            </a>
            <Link
              href="/app"
              className="relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#5B3DF5] to-[#3A22C8] hover:from-[#6A4EFA] hover:to-[#432BD9] shadow-[0_4px_20px_rgba(91,61,245,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-3.5 h-3.5 text-[#FFB84D]" />
              <span>Ouvrir l'App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Menu Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10"
            aria-label="Ouvrir le menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu Mobile déroulant */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0B0A14]/98 border-b border-white/15 px-6 py-6 backdrop-blur-2xl animate-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col gap-3 text-base font-medium text-white/90">
              <a
                href="#simulateur"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-white/5"
              >
                Simulateur & Valorisation
              </a>
              <a
                href="#analyseur"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-white/5"
              >
                Analyseur 360°
              </a>
              <a
                href="#manifeste"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-white/5"
              >
                Manifeste Fondateur
              </a>
              <a
                href="#tarifs"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-white/5"
              >
                Tarifs
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-white/5"
              >
                FAQ
              </a>
              <div className="pt-4 flex flex-col gap-2">
                <Link
                  href="/app"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl font-bold text-white bg-[#5B3DF5] shadow-[0_4px_20px_rgba(91,61,245,0.4)]"
                >
                  Accéder à Pouls Studio (/app)
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

