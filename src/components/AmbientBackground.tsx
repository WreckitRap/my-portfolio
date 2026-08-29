import { useEffect, useRef } from 'react';
import './AmbientBackground.css';

const CHARS = '01{}<>/;=+-*ABCDEFabcdef'.split('');

interface Star {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
}

interface CodeDrop {
  x: number;
  y: number;
  speed: number;
  char: string;
  opacity: number;
  nextCharAt: number;
}

function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // Star density scales gently with screen area, capped for perf
    const starCount = Math.min(Math.floor((width * height) / 9000), 160);
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.1 + 0.3,
      speed: Math.random() * 0.06 + 0.015,
      opacity: Math.random() * 0.5 + 0.15,
    }));

    // Sparse falling code characters
    const dropCount = Math.min(Math.floor(width / 140), 12);
    const drops: CodeDrop[] = Array.from({ length: dropCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: Math.random() * 0.35 + 0.15,
      char: CHARS[Math.floor(Math.random() * CHARS.length)],
      opacity: Math.random() * 0.18 + 0.05,
      nextCharAt: Date.now() + Math.random() * 4000 + 2000,
    }));

    let animationId: number;

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      // Stars — slow downward drift, like a very slow warp
      for (const star of stars) {
        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(232, 234, 242, ${star.opacity})`;
        ctx!.fill();

        if (!prefersReduced) {
          star.y += star.speed;
          if (star.y > height) {
            star.y = 0;
            star.x = Math.random() * width;
          }
        }
      }

      // Occasional falling code characters
      ctx!.font = '13px "JetBrains Mono", monospace';
      for (const drop of drops) {
        const isTeal = drop.char.charCodeAt(0) % 2 === 0;
        ctx!.fillStyle = isTeal
          ? `rgba(95, 208, 192, ${drop.opacity})`
          : `rgba(242, 184, 75, ${drop.opacity})`;
        ctx!.fillText(drop.char, drop.x, drop.y);

        if (!prefersReduced) {
          drop.y += drop.speed;
          if (drop.y > height + 20) {
            drop.y = -20;
            drop.x = Math.random() * width;
          }
          if (Date.now() > drop.nextCharAt) {
            drop.char = CHARS[Math.floor(Math.random() * CHARS.length)];
            drop.nextCharAt = Date.now() + Math.random() * 4000 + 2000;
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="ambient-bg" aria-hidden="true" />;
}

export default AmbientBackground;