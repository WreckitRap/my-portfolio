import { useEffect, useRef } from 'react';

export default function Screensaver({ onWake }: { onWake: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.random(),
    }));

    let raf = 0;
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        s.z -= 0.006;
        if (s.z <= 0) {
          s.x = Math.random() * 2 - 1;
          s.y = Math.random() * 2 - 1;
          s.z = 1;
        }
        const sx = (s.x / s.z) * (w / 4) + w / 2;
        const sy = (s.y / s.z) * (h / 4) + h / 2;
        const r = (1 - s.z) * 2.5;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="os-saver" onClick={onWake} onPointerDown={onWake}>
      <canvas ref={ref} />
      <p className="os-saver-text">PortfolioOS 95 — move the mouse to wake</p>
    </div>
  );
}