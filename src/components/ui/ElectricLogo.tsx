'use client';

import React, { useEffect, useRef, useState } from 'react';

interface ElectricLogoProps {
  size?: number;
  glowColor?: string;
  secondaryColor?: string;
  sparkFrequency?: number;
  interactive?: boolean;
  className?: string;
}

export const ElectricLogo: React.FC<ElectricLogoProps> = ({
  size = 120,
  glowColor = '#38bdf8', // Electric Cyan / Blue
  secondaryColor = '#818cf8', // Electric Indigo / Purple
  sparkFrequency = 0.85,
  interactive = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Logo geometric vertices scaled to canvas coordinates
  const getLogoVertices = (scale: number, offset: number) => {
    const rawVertices = [
      // Top Diamond
      { x: 12, y: 2 },
      { x: 22, y: 7 },
      { x: 12, y: 12 },
      { x: 2, y: 7 },
      // Middle Tier
      { x: 2, y: 12 },
      { x: 12, y: 17 },
      { x: 22, y: 12 },
      // Bottom Tier
      { x: 2, y: 17 },
      { x: 12, y: 22 },
      { x: 22, y: 17 },
    ];

    return rawVertices.map((v) => ({
      x: (v.x / 24) * scale + offset,
      y: (v.y / 24) * scale + offset,
    }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const canvasWidth = size * 1.8;
    const canvasHeight = size * 1.8;
    const offset = (canvasWidth - size) / 2;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const vertices = getLogoVertices(size, offset);

    // Particle spark system
    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
      size: number;
    }

    const sparks: Spark[] = [];

    // Fractal lightning bolt generator
    const drawLightning = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      displace: number,
      iteration: number,
      color: string,
      width: number
    ) => {
      if (displace < 1.5 || iteration <= 0) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.stroke();
        return;
      }

      const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * displace;
      const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * displace;

      // Primary lightning branch
      drawLightning(x1, y1, midX, midY, displace / 1.8, iteration - 1, color, width);
      drawLightning(midX, midY, x2, y2, displace / 1.8, iteration - 1, color, width);

      // Occasional sub-branch leaping off
      if (Math.random() < 0.25) {
        const branchX = midX + (Math.random() - 0.5) * displace * 1.4;
        const branchY = midY + (Math.random() - 0.5) * displace * 1.4;
        drawLightning(midX, midY, branchX, branchY, displace / 2.2, iteration - 2, color, width * 0.6);
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const intensity = isHovered ? 1.8 : 1.0;
      const arcCount = Math.floor((isHovered ? 5 : 3) * sparkFrequency);

      // Generate electric arcs jumping between vertices
      for (let i = 0; i < arcCount; i++) {
        const v1 = vertices[Math.floor(Math.random() * vertices.length)];
        let v2 = vertices[Math.floor(Math.random() * vertices.length)];

        // Jump to mouse if nearby and hovered
        if (isHovered && mousePos && Math.random() < 0.4) {
          v2 = { x: mousePos.x, y: mousePos.y };
        }

        if (v1 && v2 && (v1.x !== v2.x || v1.y !== v2.y)) {
          ctx.save();
          ctx.shadowBlur = 12 * intensity;
          ctx.shadowColor = Math.random() > 0.5 ? glowColor : secondaryColor;

          // Outer colored glow strand
          drawLightning(
            v1.x,
            v1.y,
            v2.x,
            v2.y,
            24 * intensity,
            5,
            Math.random() > 0.5 ? glowColor : secondaryColor,
            1.8 * intensity
          );

          // Inner ultra-bright white core
          drawLightning(v1.x, v1.y, v2.x, v2.y, 22 * intensity, 5, '#ffffff', 0.8 * intensity);
          ctx.restore();

          // Spawn flying sparks from arc endpoints
          if (sparks.length < 40 && Math.random() < 0.6) {
            sparks.push({
              x: v1.x,
              y: v1.y,
              vx: (Math.random() - 0.5) * 4 * intensity,
              vy: (Math.random() - 0.5) * 4 * intensity,
              life: 1,
              maxLife: 20 + Math.random() * 20,
              color: Math.random() > 0.4 ? glowColor : '#ffffff',
              size: 1 + Math.random() * 2,
            });
          }
        }
      }

      // Update and draw flying spark particles
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life++;

        const alpha = 1 - s.life / s.maxLife;
        if (alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 6;
        ctx.shadowColor = s.color;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [size, glowColor, secondaryColor, sparkFrequency, isHovered, mousePos]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const canvasWidth = size * 1.8;
    const scale = canvasWidth / rect.width;
    setMousePos({
      x: (e.clientX - rect.left) * scale,
      y: (e.clientY - rect.top) * scale,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos(null);
      }}
      onMouseMove={handleMouseMove}
      className={`relative inline-flex items-center justify-center cursor-pointer select-none group ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background Electric Lightning Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute pointer-events-none z-10"
        style={{
          width: size * 1.8,
          height: size * 1.8,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* SVG Living Electric Outline */}
      <div className="relative z-20 flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <filter id="electric-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="blur1" />
              <feGaussianBlur stdDeviation="3.5" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="electric-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor={glowColor} />
              <stop offset="100%" stopColor={secondaryColor} />
            </linearGradient>

            <linearGradient id="electric-inner" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={glowColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Glowing aura underlay */}
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            fill="url(#electric-inner)"
            stroke={glowColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#electric-glow)"
            className="animate-pulse opacity-80"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke={glowColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#electric-glow)"
            className="animate-pulse opacity-80"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke={glowColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#electric-glow)"
            className="animate-pulse opacity-80"
          />

          {/* Sharp Electric High-Voltage Paths with dash animation */}
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="url(#electric-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="40 10"
            className="transition-all duration-300"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="url(#electric-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="30 8"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="url(#electric-gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="30 8"
          />
        </svg>
      </div>

      {/* Radiant Electric Glow Bloom */}
      <div
        className="absolute inset-0 rounded-full filter blur-xl -z-10 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${glowColor}40 0%, ${secondaryColor}20 50%, transparent 70%)`,
          opacity: isHovered ? 0.9 : 0.45,
          transform: 'scale(1.4)',
        }}
      />
    </div>
  );
};
