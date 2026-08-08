'use client';
import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  rotation: number;
  rotSpeed: number;
  shape: 'star' | 'diamond' | 'dot';
}

const COLORS = [
  '#00c8c8', // teal
  '#f5c518', // yellow
  '#e8284a', // red
  '#a78bfa', // purple
  '#00ff88', // terminal green
  '#ffffff',
];

let uid = 0;

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, rot: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const outerAngle = (i * Math.PI * 2) / 5 - Math.PI / 2;
    const innerAngle = outerAngle + Math.PI / 5;
    ctx.lineTo(Math.cos(outerAngle) * r, Math.sin(outerAngle) * r);
    ctx.lineTo(Math.cos(innerAngle) * r * 0.45, Math.sin(innerAngle) * r * 0.45);
  }
  ctx.closePath();
  ctx.restore();
}

function drawDiamond(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, rot: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.lineTo(r * 0.5, 0);
  ctx.lineTo(0, r);
  ctx.lineTo(-r * 0.5, 0);
  ctx.closePath();
  ctx.restore();
}

export default function CursorSparkle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastSpawnRef = useRef(0);
  const rafRef = useRef<number>(0);

  const spawn = useCallback((x: number, y: number, count = 2) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.6 + Math.random() * 1.8;
      const life = 40 + Math.random() * 30;
      particlesRef.current.push({
        id: uid++,
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        life,
        maxLife: life,
        size: 3 + Math.random() * 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        shape: (['star', 'diamond', 'dot'] as const)[Math.floor(Math.random() * 3)],
      });
    }
    // Keep max 120 particles
    if (particlesRef.current.length > 120) {
      particlesRef.current = particlesRef.current.slice(-120);
    }
  }, []);

  const spawnScroll = useCallback(() => {
    const { x, y } = mouseRef.current;
    spawn(x + (Math.random() - 0.5) * 40, y + (Math.random() - 0.5) * 40, 3);
  }, [spawn]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Mouse move — spawn on move
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      const now = performance.now();
      if (now - lastSpawnRef.current > 30) {
        spawn(e.clientX, e.clientY, 1);
        lastSpawnRef.current = now;
      }
    };

    // Scroll — burst around cursor
    const onScroll = () => { spawnScroll(); };

    // Click — big burst
    const onClick = (e: MouseEvent) => { spawn(e.clientX, e.clientY, 8); };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('click', onClick);

    // Animation loop
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter(p => p.life > 0);

      for (const p of particlesRef.current) {
        const t = p.life / p.maxLife;
        const alpha = t * t; // quadratic fade out
        const size = p.size * (0.3 + t * 0.7);

        ctx.globalAlpha = alpha * 0.9;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;

        if (p.shape === 'star') {
          drawStar(ctx, p.x, p.y, size, p.rotation);
          ctx.fill();
        } else if (p.shape === 'diamond') {
          drawDiamond(ctx, p.x, p.y, size, p.rotation);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Update
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06; // slight gravity
        p.vx *= 0.97;
        p.life--;
        p.rotation += p.rotSpeed;
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('click', onClick);
      cancelAnimationFrame(rafRef.current);
    };
  }, [spawn, spawnScroll]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
