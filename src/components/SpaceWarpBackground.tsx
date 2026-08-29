import { useEffect, useRef } from 'react';
import './SpaceWarpBackground.css';

const CODE_SNIPPETS = [
  'function()',
  'const x = 1',
  '=> {}',
  'npm run dev',
  'export default',
  'return true',
  '<div />',
  'async () =>',
  'if (x) {}',
  '[...arr]',
  'try { }',
  'import App',
];

interface Star {
  x: number;
  y: number;
  z: number;
  prevX: number;
  prevY: number;
}

interface CodeFragment {
  x: number;
  y: number;
  z: number;
  text: string;
  isTeal: boolean;
}

const DEPTH = 1200;
const FOCAL_LENGTH = 300;

function SpaceWrapBackground() {
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

    function randomStar(): Star {
      const x = (Math.random() - 0.5) * width * 1.5;
      const y = (Math.random() - 0.5) * height * 1.5;
      const z = Math.random() * DEPTH;
      return { x, y, z, prevX: x, prevY: y };
    }

    function randomFragment(): CodeFragment {
      return {
        x: (Math.random() - 0.5) * width,
        y: (Math.random() - 0.5) * height,
        z: DEPTH * (0.5 + Math.random() * 0.5),
        text: CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
        isTeal: Math.random() > 0.5,
      };
    }

    const starCount = Math.min(Math.floor((width * height) / 6000), 220);
    const stars: Star[] = Array.from({ length: starCount }, randomStar);

    const fragmentCount = 7;
    const fragments: CodeFragment[] = Array.from({ length: fragmentCount }, randomFragment);

    const starSpeed = prefersReduced ? 0 : 1.4;
    const fragmentSpeed = prefersReduced ? 0 : 2.6;

    let animationId: number;

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      for (const star of stars) {
        star.prevX = star.x;
        star.prevY = star.y;
        star.z -= starSpeed * 4;
        if (star.z <= 1) {
          Object.assign(star, randomStar(), { z: DEPTH });
        }

        const scale = FOCAL_LENGTH / star.z;
        const screenX = cx + star.x * scale;
        const screenY = cy + star.y * scale;
        const prevScale = FOCAL_LENGTH / (star.z + starSpeed * 4);
        const prevScreenX = cx + star.x * prevScale;
        const prevScreenY = cy + star.y * prevScale;

        if (screenX < -50 || screenX > width + 50 || screenY < -50 || screenY > height + 50) {
          continue;
        }

        const opacity = Math.min(1, (DEPTH - star.z) / DEPTH) * 0.7;
        ctx!.strokeStyle = `rgba(232, 234, 242, ${opacity})`;
        ctx!.lineWidth = Math.max(0.5, scale * 1.2);
        ctx!.beginPath();
        ctx!.moveTo(prevScreenX, prevScreenY);
        ctx!.lineTo(screenX, screenY);
        ctx!.stroke();
      }

      ctx!.font = '13px "JetBrains Mono", monospace';
      ctx!.textAlign = 'center';
      for (const frag of fragments) {
        frag.z -= fragmentSpeed * 3;
        if (frag.z <= 40) {
          Object.assign(frag, randomFragment(), { z: DEPTH });
        }

        const scale = FOCAL_LENGTH / frag.z;
        const screenX = cx + frag.x * scale;
        const screenY = cy + frag.y * scale;

        if (screenX < -100 || screenX > width + 100 || screenY < -50 || screenY > height + 50) {
          continue;
        }

        const proximity = Math.min(1, (DEPTH - frag.z) / DEPTH);
        const blurAmount = Math.max(0, (1 - proximity) * 6);
        const nearFadeStart = 0.88;
        const opacity =
          proximity < nearFadeStart
            ? proximity * 0.5
            : Math.max(0, (1 - proximity) / (1 - nearFadeStart)) * 0.5;

        ctx!.save();
        ctx!.filter = `blur(${blurAmount.toFixed(1)}px)`;
        ctx!.fillStyle = frag.isTeal
          ? `rgba(95, 208, 192, ${opacity.toFixed(2)})`
          : `rgba(242, 184, 75, ${opacity.toFixed(2)})`;
        const fontSize = Math.min(28, 10 * scale);
        ctx!.font = `${fontSize.toFixed(1)}px "JetBrains Mono", monospace`;
        ctx!.fillText(frag.text, screenX, screenY);
        ctx!.restore();
      }

      animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="space-warp-bg" aria-hidden="true" />;
}

export default SpaceWrapBackground;