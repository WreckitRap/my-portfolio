// 🐀 Pizza Rat worldwide leaderboard API
import { useEffect, useRef, useState } from 'react';

const W = 480;
const H = 640;
const TAU = Math.PI * 2;
const SCALE = 2; 

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  color: string;
  size: number;
}

interface TextPopup {
  x: number;
  y: number;
  str: string;
  life: number;
  color: string;
  size: number;
}

interface Item {
  type: 'pizza' | 'bomb' | 'cheese';
  x: number;
  y: number;
  vy: number;
  rot: number;
  vr: number;
}

interface Mote {
  x: number;
  y: number;
  s: number;
  sp: number;
}

interface Rat {
  x: number;
  tx: number | null;
  dir: number;
  y: number;
}

export default function PizzaRatGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const stateRef = useRef({
    state: 'start' as 'start' | 'playing' | 'over',
    paused: false,
    score: 0,
    lives: 3,
    level: 1,
    combo: 0,
    best: 0,
    newBest: false,
    overAt: 0,
    rat: null as Rat | null,
    items: [] as Item[],
    particles: [] as Particle[],
    texts: [] as TextPopup[],
    spawnTimer: 0,
    invT: 0,
    shake: 0,
    flash: 0,
    tSec: 0,
    uiHint: 0,
    keys: { left: false, right: false },
    motes: [] as Mote[],
  });

  const [best, setBest] = useState(() => {
    try {
      return Number(localStorage.getItem('ratPizzaBest') ?? 0);
    } catch {
      return 0;
    }
  });

  // --- HALL OF FAME STATE ---
  const [phase, setPhase] = useState<'start' | 'playing' | 'over'>('start');
  const [finalScore, setFinalScore] = useState(0);
  const [top, setTop] = useState<{ name: string; score: number }[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [saved, setSaved] = useState(false);
  const gameApi = useRef<{ restart: () => void } | null>(null);

  const loadTop = async () => {
    try {
      const r = await fetch('/api/scores');
      if (r.ok) setTop(await r.json());
    } catch {
      /* no API in local dev — that's fine */
    }
  };

  useEffect(() => {
    loadTop();
  }, []);

  const saveScore = async () => {
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: playerName.trim() || 'Anonymous',
          score: finalScore,
        }),
      });
    } catch {
      /* ignore */
    }
    setSaved(true);
    await loadTop();
  };

  const playAgain = () => {
    setSaved(false);
    setPhase('playing');
    gameApi.current?.restart();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);

    const s = stateRef.current;
    s.best = best;

    // Initialize motes
    if (s.motes.length === 0) {
      for (let i = 0; i < 26; i++) {
        s.motes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          s: 1 + Math.random() * 2,
          sp: 6 + Math.random() * 14,
        });
      }
    }

    const ensureAudio = () => {
      if (!audioRef.current) {
        audioRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioRef.current.state === 'suspended') {
        void audioRef.current.resume();
      }
    };

    const beep = (f: number, d: number, type: OscillatorType = 'square', v: number = 0.06, slideTo: number = 0, delay: number = 0) => {
      if (!audioRef.current) return;
      const t0 = audioRef.current.currentTime + delay;
      const o = audioRef.current.createOscillator();
      const g = audioRef.current.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f, t0);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(slideTo, 1), t0 + d);
      g.gain.setValueAtTime(v, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
      o.connect(g);
      g.connect(audioRef.current.destination);
      o.start(t0);
      o.stop(t0 + d + 0.03);
    };

    const sPizza = () => { beep(660, 0.07); beep(880, 0.09, 'square', 0.05, 0, 0.06); };
    const sCheese = () => { beep(740, 0.06); beep(988, 0.06, 'square', 0.05, 0, 0.05); beep(1318, 0.1, 'square', 0.05, 0, 0.1); };
    const sBomb = () => { beep(170, 0.35, 'sawtooth', 0.1, 40); beep(90, 0.4, 'triangle', 0.09, 30, 0.02); };
    const sMiss = () => beep(196, 0.09, 'triangle', 0.04);
    const sLevel = () => { beep(523, 0.08); beep(659, 0.08, 'square', 0.05, 0, 0.07); beep(784, 0.12, 'square', 0.05, 0, 0.14); };
    const sOver = () => { beep(392, 0.15, 'triangle', 0.07); beep(311, 0.15, 'triangle', 0.07, 0, 0.14); beep(233, 0.4, 'triangle', 0.07, 0, 0.28); };

    const reset = () => {
      s.score = 0;
      s.lives = 3;
      s.level = 1;
      s.combo = 0;
      s.rat = { x: W / 2, tx: null, dir: 1, y: H - 60 };
      s.items = [];
      s.particles = [];
      s.texts = [];
      s.spawnTimer = 0.4;
      s.invT = 0;
      s.shake = 0;
      s.flash = 0;
      s.uiHint = 4;
    };

    const startGame = () => {
      reset();
      s.state = 'playing';
      s.paused = false;
      setPhase('playing');
      setSaved(false);
    };
    gameApi.current = { restart: startGame };

    const spawnItem = () => {
      const bombP = Math.min(0.2 + s.level * 0.03, 0.42);
      const r = Math.random();
      const type = r < bombP ? 'bomb' : r < bombP + 0.1 ? 'cheese' : 'pizza';
      const vy = (115 + Math.random() * 60) * (1 + (s.level - 1) * 0.16);
      s.items.push({
        type,
        x: 30 + Math.random() * (W - 60),
        y: -34,
        vy,
        rot: Math.random() * TAU,
        vr: (Math.random() - 0.5) * 2.6,
      });
    };

    const crumbs = (x: number, y: number, color: string, n: number = 10) => {
      for (let i = 0; i < n; i++) {
        s.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 220,
          vy: -60 - Math.random() * 160,
          life: 0.5 + Math.random() * 0.4,
          max: 0.9,
          color,
          size: 2 + Math.random() * 3,
        });
      }
    };

    const explosion = (x: number, y: number) => {
      for (let i = 0; i < 34; i++) {
        const a = Math.random() * TAU;
        const sp = 60 + Math.random() * 260;
        s.particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 40,
          life: 0.4 + Math.random() * 0.5,
          max: 0.9,
          color: ['#ffd24d', '#ff8c42', '#ff5533', '#8a93a8'][Math.floor(Math.random() * 4)],
          size: 2 + Math.random() * 4,
        });
      }
    };

    const catchItem = (it: Item) => {
      if (it.type === 'pizza') {
        s.combo++;
        const mult = Math.min(1 + Math.floor(s.combo / 5), 5);
        const pts = 10 * mult;
        s.score += pts;
        s.texts.push({ x: it.x, y: it.y - 12, str: '+' + pts + (mult > 1 ? ' ×' + mult : ''), life: 0.9, color: '#ffd24d', size: 16 });
        crumbs(it.x, it.y, '#f7c948');
        crumbs(it.x, it.y, '#e04b3a', 5);
        sPizza();
      } else {
        s.combo++;
        s.score += 30;
        s.texts.push({ x: it.x, y: it.y - 12, str: '+30', life: 0.9, color: '#ffe58a', size: 17 });
        crumbs(it.x, it.y, '#ffd24d', 14);
        sCheese();
      }
    };

    const hitBomb = (it: Item) => {
      s.lives--;
      s.combo = 0;
      s.shake = 16;
      s.flash = 0.9;
      s.invT = 1.6;
      explosion(it.x, it.y);
      s.texts.push({ x: it.x, y: it.y - 24, str: '−1 ♥', life: 1, color: '#ff6b6b', size: 19 });
      sBomb();
      if (s.lives <= 0) {
        s.state = 'over';
        s.overAt = performance.now();
        s.newBest = s.score > s.best;
        if (s.newBest) {
          s.best = s.score;
          try {
            localStorage.setItem('ratPizzaBest', String(s.best));
          } catch {}
          setBest(s.best);
        }
        setFinalScore(s.score); // Trigger Hall of Fame UI
        setPhase('over');       // Trigger Hall of Fame UI
        sOver();
      }
    };

    const update = (dt: number) => {
      s.tSec += dt;
      for (const m of s.motes) {
        m.y += m.sp * dt;
        if (m.y > H) {
          m.y = -4;
          m.x = Math.random() * W;
        }
      }

      s.particles.forEach((p) => {
        p.life -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 500 * dt;
      });
      s.particles = s.particles.filter((p) => p.life > 0);
      s.texts.forEach((t) => {
        t.life -= dt;
        t.y -= 42 * dt;
      });
      s.texts = s.texts.filter((t) => t.life > 0);
      s.shake = Math.max(0, s.shake - 46 * dt);
      s.flash = Math.max(0, s.flash - 2.2 * dt);

      if (s.state !== 'playing') return;

      s.uiHint = Math.max(0, s.uiHint - dt);
      s.invT = Math.max(0, s.invT - dt);

      const newLevel = 1 + Math.floor(s.score / 120);
      if (newLevel > s.level) {
        s.level = newLevel;
        s.texts.push({ x: W / 2, y: H / 2 - 60, str: 'LEVEL ' + s.level + '!', life: 1.4, color: '#7ff3ff', size: 26 });
        sLevel();
      }

      let mv = 0;
      if (s.keys.left) mv--;
      if (s.keys.right) mv++;
      if (mv !== 0) {
        s.rat!.x += mv * 440 * dt;
        s.rat!.dir = mv;
        s.rat!.tx = null;
      } else if (s.rat!.tx !== null) {
        const d = s.rat!.tx - s.rat!.x;
        s.rat!.x += Math.abs(d) < 3 ? d : d * Math.min(1, 13 * dt);
        if (Math.abs(d) > 6) s.rat!.dir = d > 0 ? 1 : -1;
      }
      s.rat!.x = Math.max(30, Math.min(W - 30, s.rat!.x));

      s.spawnTimer -= dt;
      if (s.spawnTimer <= 0) {
        spawnItem();
        s.spawnTimer = Math.max(0.32, 0.92 - (s.level - 1) * 0.06) * (0.7 + Math.random() * 0.6);
      }

      for (let i = s.items.length - 1; i >= 0; i--) {
        const it = s.items[i];
        it.y += it.vy * dt;
        it.rot += it.vr * dt;
        const inBand = it.y > s.rat!.y - 46 && it.y < s.rat!.y + 16;
        if (inBand && Math.abs(it.x - s.rat!.x) < 37) {
          if (it.type === 'bomb') {
            if (s.invT <= 0) {
              s.items.splice(i, 1);
              hitBomb(it);
              continue;
            }
          } else {
            s.items.splice(i, 1);
            catchItem(it);
            continue;
          }
        }
        if (it.y > H + 40) {
          if (it.type !== 'bomb') {
            s.combo = 0;
            s.texts.push({ x: it.x, y: H - 70, str: 'MISS', life: 0.6, color: '#8892a8', size: 13 });
            sMiss();
          }
          s.items.splice(i, 1);
        }
      }
    };

    const circle = (x: number, y: number, r: number) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
    };

    const ellipse = (x: number, y: number, rx: number, ry: number, rot: number = 0) => {
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, rot, 0, TAU);
      ctx.fill();
    };

    const drawHeart = (x: number, y: number, s: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y + s * 0.3);
      ctx.bezierCurveTo(x, y, x - s * 0.55, y, x - s * 0.55, y + s * 0.3);
      ctx.bezierCurveTo(x - s * 0.55, y + s * 0.62, x, y + s * 0.8, x, y + s);
      ctx.bezierCurveTo(x, y + s * 0.8, x + s * 0.55, y + s * 0.62, x + s * 0.55, y + s * 0.3);
      ctx.bezierCurveTo(x + s * 0.55, y, x, y, x, y + s * 0.3);
      ctx.fill();
    };

    const drawBackground = () => {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#1c2547');
      g.addColorStop(0.7, '#131a30');
      g.addColorStop(1, '#0f1322');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(255,255,255,0.035)';
      ctx.lineWidth = 1;
      for (let y = 40; y < H - 40; y += 44) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
        for (let x = y / 44 % 2 ? 40 : 90; x < W; x += 100) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + 44);
          ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgba(200,215,255,0.18)';
      for (const m of s.motes) circle(m.x, m.y, m.s * 0.6);
      ctx.fillStyle = '#252e48';
      ctx.fillRect(0, H - 38, W, 38);
      ctx.fillStyle = '#39456b';
      ctx.fillRect(0, H - 38, W, 4);
    };

    const drawPizza = (x: number, y: number, rot: number, sc: number = 1) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(sc, sc);
      ctx.beginPath();
      ctx.moveTo(0, 22);
      ctx.lineTo(-17, -12);
      ctx.quadraticCurveTo(0, -21, 17, -12);
      ctx.closePath();
      ctx.fillStyle = '#f7c948';
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-17, -12);
      ctx.quadraticCurveTo(0, -21, 17, -12);
      ctx.lineWidth = 7;
      ctx.strokeStyle = '#d98e3f';
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.fillStyle = '#e04b3a';
      circle(-6, -2, 3.6);
      circle(6, -6, 3.2);
      circle(1, 9, 3);
      ctx.restore();
    };

    const drawBomb = (x: number, y: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.sin(rot) * 0.15);
      ctx.strokeStyle = '#b08d57';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.quadraticCurveTo(4, -26, 9, -28);
      ctx.stroke();
      const sp = 2.5 + Math.random() * 2.5;
      ctx.fillStyle = '#ffe066';
      circle(9, -28, sp);
      ctx.fillStyle = '#fff6c8';
      circle(9, -28, sp * 0.45);
      ctx.fillStyle = '#4a5262';
      ctx.fillRect(-5, -21, 10, 6);
      const g = ctx.createRadialGradient(-5, -6, 2, 0, 0, 16);
      g.addColorStop(0, '#4d5563');
      g.addColorStop(1, '#20242c');
      ctx.fillStyle = g;
      circle(0, 0, 15);
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      circle(-6, -6, 3.2);
      ctx.restore();
    };

    const drawCheese = (x: number, y: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.sin(rot) * 0.2);
      ctx.fillStyle = '#ffd24d';
      ctx.beginPath();
      ctx.moveTo(-17, 9);
      ctx.lineTo(17, 9);
      ctx.lineTo(17, -3);
      ctx.quadraticCurveTo(6, -15, -8, -9);
      ctx.quadraticCurveTo(-17, -5, -17, 9);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#e6a817';
      circle(-6, 0, 3);
      circle(5, 4, 2.4);
      circle(9, -4, 2);
      ctx.restore();
    };

    const drawItem = (it: Item) => {
      if (it.type === 'pizza') drawPizza(it.x, it.y, Math.sin(it.rot) * 0.35);
      else if (it.type === 'bomb') drawBomb(it.x, it.y, it.rot);
      else drawCheese(it.x, it.y, it.rot);
    };

    const drawRat = (x: number, y: number, dir: number, moving: boolean) => {
      ctx.save();
      ctx.translate(x, y + (moving ? Math.sin(s.tSec * 14) * 2 : Math.sin(s.tSec * 3)));
      if (dir < 0) ctx.scale(-1, 1);
      ctx.strokeStyle = '#f0a8b8';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-24, 4);
      ctx.quadraticCurveTo(-44, 10 + Math.sin(s.tSec * 5) * 5, -54, -8);
      ctx.stroke();
      ctx.fillStyle = '#f0a8b8';
      ellipse(-12 + (moving ? Math.sin(s.tSec * 14) * 3 : 0), 18, 6, 3);
      ellipse(10 - (moving ? Math.sin(s.tSec * 14) * 3 : 0), 18, 6, 3);
      ctx.fillStyle = '#a9b1c0';
      ellipse(-4, 4, 26, 17);
      ellipse(20, -5, 14, 12, -0.15);
      ellipse(31, -1, 7, 5, 0.2);
      circle(11, -17, 6.5);
      circle(23, -15, 6);
      ctx.fillStyle = '#f5b8c4';
      circle(11, -17, 3.4);
      circle(23, -15, 3);
      ctx.fillStyle = '#1d2129';
      circle(24, -7, 2.3);
      ctx.fillStyle = '#f06292';
      circle(37, -2, 3);
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 1;
      for (const [ex, ey] of [
        [48, -8],
        [49, -1],
        [47, 6],
      ] as const) {
        ctx.beginPath();
        ctx.moveTo(33, -2);
        ctx.lineTo(ex, ey);
        ctx.stroke();
      }
      ctx.restore();
    };

    const overlay = (a: number = 0.55) => {
      ctx.fillStyle = `rgba(8,10,18,${a})`;
      ctx.fillRect(0, 0, W, H);
    };

    const centerText = (str: string, y: number, size: number, color: string, bold: boolean = true) => {
      ctx.fillStyle = color;
      ctx.font = `${bold ? 'bold ' : ''}${size}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(str, W / 2, y);
    };

    const drawHUD = () => {
      ctx.textAlign = 'left';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 18px Consolas, monospace';
      ctx.fillText('SCORE ' + String(s.score).padStart(6, '0'), 14, 28);
      ctx.fillStyle = '#8fa3c8';
      ctx.font = 'bold 13px Consolas, monospace';
      ctx.fillText('BEST ' + String(Math.max(s.best, s.score)).padStart(6, '0'), 14, 48);
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = i < s.lives ? '#ff5d6c' : 'rgba(255,255,255,0.15)';
        drawHeart(W - 86 + i * 30, 12, 13);
      }
      ctx.textAlign = 'center';
      ctx.fillStyle = '#7ff3ff';
      ctx.font = 'bold 14px Consolas, monospace';
      ctx.fillText('LV ' + s.level, W / 2, 26);
      const mult = Math.min(1 + Math.floor(s.combo / 5), 5);
      if (mult > 1) {
        ctx.fillStyle = '#ffd24d';
        ctx.font = `bold ${16 + Math.sin(s.tSec * 8) * 2}px Consolas, monospace`;
        ctx.fillText('COMBO ×' + mult, W / 2, 50);
      }
      ctx.fillStyle = 'rgba(200,215,255,0.5)';
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillText('← → / A D to move · mouse or finger to steer', W / 2, H - 10);
      if (s.uiHint > 0) {
        ctx.fillStyle = `rgba(200,215,255,${Math.min(s.uiHint, 0.7)})`;
        ctx.fillText('← → / A D to move · mouse or finger to steer', W / 2, H - 96);
      }
    };

    const drawStart = () => {
      overlay(0.6);
      drawPizza(W / 2 - 130, 150 + Math.sin(s.tSec * 2) * 8, Math.sin(s.tSec * 1.5) * 0.2, 1.6);
      drawBomb(W / 2 + 130, 155 + Math.cos(s.tSec * 2) * 8, s.tSec * 2);
      ctx.shadowColor = '#ffd24d';
      ctx.shadowBlur = 24;
      centerText('PIZZA RAT', 190, 52, '#ffd24d');
      ctx.shadowBlur = 0;
      centerText('The great pizza heist!', 226, 16, '#c8d3ff', false);
      centerText('🍕 Catch pizza +10 🧀 Cheese +30', 300, 16, '#fff', false);
      centerText('💣 Bombs cost a life — dodge them!', 328, 16, '#ff8f8f', false);
      centerText('← → / A D keys · or drag with mouse / finger', 372, 13, '#8fa3c8', false);
      if (Math.sin(s.tSec * 4) > -0.4) centerText('CLICK OR TAP TO START', 470, 19, '#7ff3ff');
      if (s.best > 0) centerText('BEST ' + s.best, 512, 15, '#ffd24d');
      drawRat(W / 2, H - 60, 1, false);
    };

    const drawOver = () => {
      overlay(0.62);
      ctx.shadowColor = '#ff5533';
      ctx.shadowBlur = 22;
      centerText('GAME OVER', 220, 46, '#ff6b6b');
      ctx.shadowBlur = 0;
      centerText('SCORE ' + s.score, 285, 26, '#fff');
      if (s.newBest) {
        if (Math.sin(s.tSec * 6) > -0.3) centerText('★ NEW BEST! ★', 322, 19, '#ffd24d');
      } else {
        centerText('BEST ' + s.best, 322, 16, '#8fa3c8', false);
      }
      if (performance.now() - s.overAt > 500 && Math.sin(s.tSec * 4) > -0.4)
        centerText('CLICK OR TAP TO RETRY', 420, 18, '#7ff3ff');
    };

    const drawPause = () => {
      overlay(0.5);
      centerText('PAUSED', H / 2 - 10, 34, '#fff');
      centerText('press P to resume', H / 2 + 24, 15, '#8fa3c8', false);
    };

    const render = () => {
      ctx.save();
      if (s.shake > 0) ctx.translate((Math.random() - 0.5) * s.shake, (Math.random() - 0.5) * s.shake);
      drawBackground();

      if (s.state !== 'start') {
        for (const it of s.items) drawItem(it);
        const moving = s.keys.left !== s.keys.right;
        if (s.invT <= 0 || Math.floor(s.tSec * 14) % 2 === 0) drawRat(s.rat!.x, s.rat!.y, s.rat!.dir, moving);
        for (const p of s.particles) {
          ctx.globalAlpha = Math.max(p.life / p.max, 0);
          ctx.fillStyle = p.color;
          circle(p.x, p.y, p.size);
        }
        ctx.globalAlpha = 1;
        for (const t of s.texts) {
          ctx.globalAlpha = Math.min(t.life * 2, 1);
          ctx.fillStyle = t.color;
          ctx.font = `bold ${t.size}px system-ui, sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(t.str, t.x, t.y);
        }
        ctx.globalAlpha = 1;
        drawHUD();
      } else {
        drawStart();
      }
      ctx.restore();

      if (s.flash > 0) {
        ctx.fillStyle = `rgba(255,70,50,${s.flash * 0.32})`;
        ctx.fillRect(0, 0, W, H);
      }
      if (s.state === 'over') drawOver();
      if (s.paused && s.state === 'playing') drawPause();
    };

    const action = () => {
      ensureAudio();
      if (s.state === 'start') startGame();
      else if (s.state === 'over' && performance.now() - s.overAt > 500) startGame();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // Prevent game keys from firing when typing in the name input
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea')) return;

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') s.keys.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') s.keys.right = true;
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        action();
      }
      if (e.code === 'KeyP' && s.state === 'playing') s.paused = !s.paused;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') s.keys.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') s.keys.right = false;
    };

    const pointerX = (e: MouseEvent | TouchEvent) => {
      const r = canvas.getBoundingClientRect();
      const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
      return (cx - r.left) * (W / r.width);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (s.state === 'playing' && !s.paused && s.rat) s.rat.tx = pointerX(e);
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (s.state === 'playing' && !s.paused && s.rat) s.rat.tx = pointerX(e);
    };

    const onMouseDown = () => action();

    const onTouchStart = (e: TouchEvent) => {
      if (s.state === 'playing' && s.rat) s.rat.tx = pointerX(e);
      else action();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });

    let last = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!(s.paused && s.state === 'playing')) update(dt);
      render();
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('touchstart', onTouchStart);
    };
  }, [best]);

  return (
    <div className="pizza-wrap">
      <canvas
        ref={canvasRef}
        width={W * SCALE}
        height={H * SCALE}
        className="pizza-canvas"
      />

      {/* HALL OF FAME DIALOG */}
      {phase === 'over' && (
        <div className="pizza-dialog">
          <p className="pizza-dialog-title">💥 GAME OVER — score {finalScore}</p>

          {!saved ? (
            <>
              <input
                className="os-input"
                maxLength={20}
                placeholder="Your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
              <button className="os-btn" onClick={saveScore}>
                💾 Save to Hall of Fame
              </button>
            </>
          ) : (
            <p className="pizza-saved">✅ Saved! You're on the board.</p>
          )}

          <div className="pizza-top">
            <p className="pizza-top-title">🏆 TOP RATS (worldwide)</p>
            {top.length === 0 ? (
              <p className="pizza-top-empty">No scores yet — be the first!</p>
            ) : (
              top.slice(0, 5).map((t, i) => (
                <p key={`${t.name}-${i}`} className="pizza-top-row">
                  {i + 1}. {t.name} — {t.score}
                </p>
              ))
            )}
          </div>

          <button className="os-btn" onClick={playAgain}>🔄 Play again</button>
        </div>
      )}
    </div>
  );
}