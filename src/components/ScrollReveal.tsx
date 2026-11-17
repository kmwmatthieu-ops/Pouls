"use client";

import React, { useEffect, useRef, useState } from "react";

export type RevealVariant = "fade-up" | "fade-left" | "fade-right" | "zoom-in" | "scale-up";

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number; // ms
  duration?: number; // ms
  className?: string;
  threshold?: number;
}

export function ScrollReveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 750,
  className = "",
  threshold = 0.15,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Détection bidirectionnelle (Haut <-> Bas) : once = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const getHiddenTransform = (v: RevealVariant) => {
    switch (v) {
      case "fade-up":
        return "translate3d(0, 48px, 0) scale(0.97)";
      case "fade-left":
        return "translate3d(-52px, 0, 0) scale(0.97)";
      case "fade-right":
        return "translate3d(52px, 0, 0) scale(0.97)";
      case "zoom-in":
        return "translate3d(0, 28px, 0) scale(0.91)";
      case "scale-up":
        return "translate3d(0, 36px, 0) scale(0.94)";
      default:
        return "translate3d(0, 48px, 0) scale(0.97)";
    }
  };

  const style: React.CSSProperties = {
    transitionProperty: "opacity, transform, filter",
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    transitionDelay: `${delay}ms`,
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translate3d(0, 0, 0) scale(1)" : getHiddenTransform(variant),
    filter: isVisible ? "blur(0px)" : "blur(4px)",
    willChange: "transform, opacity, filter",
  };

  return (
    <div ref={elementRef} style={style} className={className}>
      {children}
    </div>
  );
}

