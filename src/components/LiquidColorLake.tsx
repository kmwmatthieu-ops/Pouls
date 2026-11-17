"use client";

import React, { useEffect, useRef } from "react";

export function LiquidColorLake({
  mode = "dark",
  className = "",
}: {
  mode?: "dark" | "light";
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = Math.random() * 50;
    const width = 600;
    const height = 380;
    canvas.width = width;
    canvas.height = height;

    const darkOrbs = [
      { r: 91, g: 61, b: 245, radius: 250, speedX: 0.75, speedY: 0.55, phaseX: 0, phaseY: 1.0 },
      { r: 236, g: 72, b: 153, radius: 220, speedX: -0.65, speedY: 0.85, phaseX: 2.1, phaseY: 0.5 },
      { r: 255, g: 184, b: 77, radius: 215, speedX: 0.85, speedY: -0.65, phaseX: 4.2, phaseY: 2.5 },
      { r: 6, g: 182, b: 212, radius: 235, speedX: -0.55, speedY: -0.75, phaseX: 1.5, phaseY: 3.8 },
      { r: 139, g: 92, b: 246, radius: 260, speedX: 0.5, speedY: 0.9, phaseX: 3.2, phaseY: 5.1 },
      { r: 244, g: 63, b: 94, radius: 195, speedX: -0.9, speedY: 0.45, phaseX: 5.0, phaseY: 1.8 },
    ];

    const lightOrbs = [
      { r: 124, g: 58, b: 237, radius: 265, speedX: 0.7, speedY: 0.55, phaseX: 0, phaseY: 1.0 },
      { r: 245, g: 158, b: 11, radius: 235, speedX: -0.6, speedY: 0.8, phaseX: 2.2, phaseY: 0.4 },
      { r: 236, g: 72, b: 153, radius: 245, speedX: 0.8, speedY: -0.6, phaseX: 4.1, phaseY: 2.7 },
      { r: 14, g: 165, b: 233, radius: 250, speedX: -0.55, speedY: -0.7, phaseX: 1.3, phaseY: 3.9 },
      { r: 168, g: 85, b: 247, radius: 270, speedX: 0.5, speedY: 0.85, phaseX: 3.5, phaseY: 4.8 },
    ];

    const orbs = mode === "dark" ? darkOrbs : lightOrbs;

    const render = () => {
      time += 0.016;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = mode === "dark" ? "#0B0A14" : "#F3F0FF";
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = mode === "dark" ? "screen" : "source-over";

      orbs.forEach((orb, idx) => {
        const x =
          width * 0.5 +
          Math.sin(time * orb.speedX + orb.phaseX) * (width * 0.38) +
          Math.cos(time * 0.45 + idx) * (width * 0.12);
        const y =
          height * 0.5 +
          Math.cos(time * orb.speedY + orb.phaseY) * (height * 0.36) +
          Math.sin(time * 0.55 + idx) * (height * 0.12);

        const dynamicRadius = orb.radius * (1 + 0.25 * Math.sin(time * 1.2 + idx * 1.6));
        const shiftR = Math.min(255, Math.max(0, Math.round(orb.r + Math.sin(time * 0.9 + idx) * 35)));
        const shiftG = Math.min(255, Math.max(0, Math.round(orb.g + Math.cos(time * 0.7 + idx) * 35)));
        const shiftB = Math.min(255, Math.max(0, Math.round(orb.b + Math.sin(time * 1.1 + idx * 2) * 35)));

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, dynamicRadius);
        if (mode === "dark") {
          gradient.addColorStop(0, `rgba(${shiftR}, ${shiftG}, ${shiftB}, 0.78)`);
          gradient.addColorStop(0.45, `rgba(${shiftR}, ${shiftG}, ${shiftB}, 0.38)`);
          gradient.addColorStop(1, `rgba(${shiftR}, ${shiftG}, ${shiftB}, 0)`);
        } else {
          gradient.addColorStop(0, `rgba(${shiftR}, ${shiftG}, ${shiftB}, 0.42)`);
          gradient.addColorStop(0.55, `rgba(${shiftR}, ${shiftG}, ${shiftB}, 0.18)`);
          gradient.addColorStop(1, `rgba(${shiftR}, ${shiftG}, ${shiftB}, 0)`);
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, dynamicRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Vagues sinusoïdales fluides en surface
      ctx.globalCompositeOperation = "source-over";
      for (let w = 0; w < 3; w++) {
        ctx.beginPath();
        const waveYBase = height * (0.25 + w * 0.25);
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 15) {
          const y =
            waveYBase +
            Math.sin(x * 0.013 + time * (1.3 + w * 0.35) + w * 2) * 42 +
            Math.cos(x * 0.009 - time * 1.0 + w) * 28;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.closePath();

        const waveGrad = ctx.createLinearGradient(0, waveYBase - 50, width, height);
        if (mode === "dark") {
          waveGrad.addColorStop(
            0,
            w === 0
              ? "rgba(91, 61, 245, 0.30)"
              : w === 1
              ? "rgba(255, 184, 77, 0.22)"
              : "rgba(6, 182, 212, 0.20)"
          );
          waveGrad.addColorStop(
            0.5,
            w === 0
              ? "rgba(236, 72, 153, 0.24)"
              : w === 1
              ? "rgba(91, 61, 245, 0.28)"
              : "rgba(139, 92, 246, 0.25)"
          );
          waveGrad.addColorStop(1, "rgba(11, 10, 20, 0.45)");
        } else {
          waveGrad.addColorStop(0, "rgba(139, 92, 246, 0.18)");
          waveGrad.addColorStop(0.5, "rgba(255, 184, 77, 0.16)");
          waveGrad.addColorStop(1, "rgba(247, 247, 251, 0.40)");
        }
        ctx.fillStyle = waveGrad;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [mode]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover scale-110"
        style={{
          filter:
            mode === "dark"
              ? "blur(24px) saturate(175%) contrast(115%)"
              : "blur(26px) saturate(160%)",
        }}
      />
    </div>
  );
}

